#!/usr/bin/env node
/**
 * Mastodon Now Mirror — publishes new DE now-posts to Mastodon.
 *
 * Reads new files (git diff status A) under src/content/now/de/,
 * composes the toot text directly from frontmatter + body, and posts.
 *
 * Environment variables:
 *   MASTODON_BASE_URL       — e.g. https://mastodon.social  (required for live)
 *   MASTODON_ACCESS_TOKEN   — Mastodon app access token      (required for live)
 *   MASTODON_VISIBILITY     — public | unlisted | private    (default: public)
 *   DRY_RUN                 — true | false                   (default: true)
 *   MASTODON_CHAR_LIMIT     — character limit                (default: 500)
 */

import { execSync } from 'node:child_process';
import { readFileSync, appendFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const MASTODON_BASE_URL = (process.env.MASTODON_BASE_URL ?? '').replace(/\/$/, '');
const MASTODON_ACCESS_TOKEN = process.env.MASTODON_ACCESS_TOKEN ?? '';
const MASTODON_VISIBILITY = process.env.MASTODON_VISIBILITY ?? 'public';
// Safe default: dry-run unless explicitly set to 'false'
const DRY_RUN = process.env.DRY_RUN !== 'false';
const CHAR_LIMIT = parseInt(process.env.MASTODON_CHAR_LIMIT ?? '500', 10);
const GITHUB_STEP_SUMMARY = process.env.GITHUB_STEP_SUMMARY ?? '';

// ---------------------------------------------------------------------------
// Logging — writes to stdout and the GitHub step summary file if available
// ---------------------------------------------------------------------------

function log(...args) {
  const line = args.join(' ');
  console.log(line);
  if (GITHUB_STEP_SUMMARY) {
    appendFileSync(GITHUB_STEP_SUMMARY, line + '\n');
  }
}

// ---------------------------------------------------------------------------
// Git diff — find newly added DE now-files in the current push
// ---------------------------------------------------------------------------

function getNewDeNowFiles() {
  const diffCmd = 'git diff --diff-filter=A --name-only HEAD~1 HEAD -- src/content/now/de/';
  try {
    const out = execSync(diffCmd, { cwd: ROOT, encoding: 'utf8' }).trim();
    return out ? out.split('\n').filter(f => f.endsWith('.md')) : [];
  } catch {
    // Fallback for repositories where HEAD~1 does not exist (first commit)
    try {
      const emptyTree = execSync('git hash-object -t tree /dev/null', {
        cwd: ROOT,
        encoding: 'utf8',
      }).trim();
      const out = execSync(
        `git diff --diff-filter=A --name-only ${emptyTree} HEAD -- src/content/now/de/`,
        { cwd: ROOT, encoding: 'utf8' },
      ).trim();
      return out ? out.split('\n').filter(f => f.endsWith('.md')) : [];
    } catch {
      return [];
    }
  }
}

// ---------------------------------------------------------------------------
// Minimal YAML frontmatter parser
// Handles the field shapes used in src/content/now: scalars + one level of
// nested objects (richlink, rating, image).
// ---------------------------------------------------------------------------

function parseScalar(raw) {
  if (!raw && raw !== 0) return '';
  const s = String(raw).trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  if (s === 'true') return true;
  if (s === 'false') return false;
  const num = Number(s);
  if (s !== '' && !isNaN(num)) return num;
  return s;
}

function parseSimpleYaml(text) {
  const result = {};
  const lines = text.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const topKey = line.match(/^(\w+):\s*(.*)/);
    if (!topKey) { i++; continue; }
    const key = topKey[1];
    const rest = topKey[2].trim();
    if (rest === '') {
      // Nested object — collect indented children (one level deep)
      const obj = {};
      i++;
      while (i < lines.length && /^\s+\S/.test(lines[i])) {
        const child = lines[i].match(/^\s+(\w+):\s*(.*)/);
        if (child) obj[child[1]] = parseScalar(child[2].trim());
        i++;
      }
      result[key] = obj;
    } else {
      result[key] = parseScalar(rest);
      i++;
    }
  }
  return result;
}

function parseFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { fm: {}, body: '' };
  return {
    fm: parseSimpleYaml(match[1]),
    body: match[2].trim(),
  };
}

// ---------------------------------------------------------------------------
// Markdown normalisation — strip markup to readable plain text
// ---------------------------------------------------------------------------

function stripMarkdown(text) {
  return text
    .replace(/!\[.*?\]\(.*?\)/g, '')                 // inline images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')         // links → label only
    .replace(/^#{1,6}\s+/gm, '')                     // headings
    .replace(/[*_]{1,2}([^*_\n]+)[*_]{1,2}/g, '$1') // bold / italic
    .replace(/`{1,3}[^`\n]*`{1,3}/g, '')             // inline code
    .replace(/^\s*[-*+]\s+/gm, '')                   // unordered list bullets
    .replace(/^\s*\d+\.\s+/gm, '')                   // ordered list
    .replace(/\n{3,}/g, '\n\n')                      // excessive blank lines
    .trim();
}

// ---------------------------------------------------------------------------
// Compose toot text from parsed frontmatter + body
// Mirrors the now-stream content faithfully.
// ---------------------------------------------------------------------------

function composeText({ fm, body }) {
  const parts = [];

  // Richlink title, optionally with rating
  if (fm.richlink && fm.richlink.title) {
    const title =
      fm.rating && fm.rating.display
        ? `${fm.richlink.title} (${fm.rating.display})`
        : fm.richlink.title;
    parts.push(title);
  }

  // For movie richlinks, include the URL so Mastodon can render a preview
  if (fm.richlink && fm.richlink.kind === 'movie' && fm.richlink.url) {
    parts.push(String(fm.richlink.url));
  }

  // Quote posts
  if (fm.quote) {
    parts.push(`»${fm.quote}«`);
    if (fm.opinion) parts.push(String(fm.opinion));
  }

  // Markdown body
  if (body) {
    parts.push(stripMarkdown(body));
  }

  // YouTube URL (always include so the link is clickable in Mastodon)
  if (fm.youtube) {
    parts.push(String(fm.youtube));
  }

  // Image-only post: use alt text as last resort
  if (parts.length === 0 && fm.image && fm.image.alt) {
    parts.push(String(fm.image.alt));
  }

  return parts.join('\n\n').trim();
}

// ---------------------------------------------------------------------------
// Truncation — sentence-aware, falls back to hard cut
// ---------------------------------------------------------------------------

function truncate(text, limit) {
  if (text.length <= limit) return text;
  const headroom = limit - 1; // reserve one char for ellipsis
  const candidate = text.slice(0, headroom);
  // Try to end at the last sentence boundary (≥ 50 % of headroom)
  const sentenceEnd = Math.max(
    candidate.lastIndexOf('. '),
    candidate.lastIndexOf('.\n'),
    candidate.lastIndexOf('! '),
    candidate.lastIndexOf('? '),
  );
  const cutAt = sentenceEnd > headroom * 0.5 ? sentenceEnd + 1 : headroom;
  return text.slice(0, cutAt).trimEnd() + '…';
}

// ---------------------------------------------------------------------------
// Mastodon API
// ---------------------------------------------------------------------------

async function postToMastodon(status) {
  const url = `${MASTODON_BASE_URL}/api/v1/statuses`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${MASTODON_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, visibility: MASTODON_VISIBILITY }),
  });
  if (!res.ok) {
    const body = await res.text();
    const label =
      res.status === 401 ? 'Auth error — check MASTODON_ACCESS_TOKEN' :
      res.status === 422 ? 'Validation error — toot text rejected by server' :
      res.status === 429 ? 'Rate limit — try again later' :
      `HTTP ${res.status}`;
    throw new Error(`${label}: ${body}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  log('# Mastodon Now Mirror');
  log('');
  log(`Mode: **${DRY_RUN ? 'Dry-Run (no posts sent)' : 'Live'}**`);
  log('');

  const files = getNewDeNowFiles();

  if (files.length === 0) {
    log('No new DE now-files found in this push. Nothing to post.');
    return;
  }

  log(`New DE now-file(s) detected: ${files.length}`);
  log('');

  if (!DRY_RUN && (!MASTODON_BASE_URL || !MASTODON_ACCESS_TOKEN)) {
    console.error(
      'Error: MASTODON_BASE_URL and MASTODON_ACCESS_TOKEN must be set for live posting.',
    );
    process.exit(1);
  }

  for (const relPath of files) {
    const filePath = resolve(ROOT, relPath);
    log(`---`);
    log(`**File:** \`${relPath}\``);

    const { fm, body } = parseFile(filePath);
    const rawText = composeText({ fm, body });

    if (!rawText) {
      log('⚠ No postable content found. Skipping.');
      log('');
      continue;
    }

    const tootText = truncate(rawText, CHAR_LIMIT);
    log('');
    log('**Toot text:**');
    log('');
    log('```');
    log(tootText);
    log('```');
    log('');
    log(`Length: ${tootText.length} / ${CHAR_LIMIT}`);
    log('');

    if (DRY_RUN) {
      log('▷ Would post — dry-run mode, no API call made.');
    } else {
      try {
        const result = await postToMastodon(tootText);
        log(`✓ Posted successfully — ${result.url} (ID: ${result.id})`);
      } catch (err) {
        log(`✗ Failed: ${err.message}`);
        process.exit(1);
      }
    }
    log('');
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
