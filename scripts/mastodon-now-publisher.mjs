#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const MASTODON_BASE_URL = (process.env.MASTODON_BASE_URL ?? '').replace(/\/$/, '');
const MASTODON_ACCESS_TOKEN = process.env.MASTODON_ACCESS_TOKEN ?? '';
const MASTODON_VISIBILITY = process.env.MASTODON_VISIBILITY ?? 'public';
const DRY_RUN = process.env.DRY_RUN !== 'false';
const CHAR_LIMIT = parseInt(process.env.MASTODON_CHAR_LIMIT ?? '500', 10);
const TARGET_COMMIT_SHA = process.env.TARGET_COMMIT_SHA ?? 'HEAD';
const GITHUB_STEP_SUMMARY = process.env.GITHUB_STEP_SUMMARY ?? '';

function log(...args) {
  const line = args.join(' ');
  console.log(line);
  if (GITHUB_STEP_SUMMARY) {
    appendFileSync(GITHUB_STEP_SUMMARY, line + '\n');
  }
}

function git(command) {
  return execSync(command, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function getParentCommit(commitSha) {
  try {
    return git(`git rev-parse ${commitSha}^`);
  } catch {
    return git('git hash-object -t tree /dev/null');
  }
}

function getNewDeNowFiles(commitSha) {
  const parentCommit = getParentCommit(commitSha);
  const output = git(
    `git diff --diff-filter=A --name-only ${parentCommit} ${commitSha} -- src/content/now/de/`
  );
  return output ? output.split('\n').filter((filePath) => filePath.endsWith('.md')) : [];
}

function readFileAtCommit(commitSha, filePath) {
  return git(`git show ${commitSha}:${filePath}`);
}

function parseScalar(raw) {
  if (!raw && raw !== 0) return '';
  const value = String(raw).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  if (value === 'true') return true;
  if (value === 'false') return false;
  const num = Number(value);
  if (value !== '' && !Number.isNaN(num)) return num;
  return value;
}

function parseSimpleYaml(text) {
  const result = {};
  const lines = text.split('\n');
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const topLevel = line.match(/^(\w+):\s*(.*)/);
    if (!topLevel) {
      index += 1;
      continue;
    }

    const key = topLevel[1];
    const rest = topLevel[2].trim();

    if (rest === '') {
      const nested = {};
      index += 1;
      while (index < lines.length && /^\s+\S/.test(lines[index])) {
        const child = lines[index].match(/^\s+(\w+):\s*(.*)/);
        if (child) {
          nested[child[1]] = parseScalar(child[2].trim());
        }
        index += 1;
      }
      result[key] = nested;
      continue;
    }

    result[key] = parseScalar(rest);
    index += 1;
  }

  return result;
}

function parseContent(rawContent) {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: rawContent.trim() };
  }

  return {
    frontmatter: parseSimpleYaml(match[1]),
    body: match[2].trim(),
  };
}

function stripMarkdown(text) {
  return text
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_]{1,2}([^*_\n]+)[*_]{1,2}/g, '$1')
    .replace(/`{1,3}[^`\n]*`{1,3}/g, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function composeText({ frontmatter, body }) {
  const textParts = [];
  const linkParts = [];

  if (frontmatter.richlink && frontmatter.richlink.title) {
    const title =
      frontmatter.rating && frontmatter.rating.display
        ? `${frontmatter.richlink.title} (${frontmatter.rating.display})`
        : frontmatter.richlink.title;
    textParts.push(title);
  }

  if (frontmatter.quote) {
    textParts.push(`»${frontmatter.quote}«`);
    if (frontmatter.opinion) {
      textParts.push(String(frontmatter.opinion));
    }
  }

  if (body) {
    textParts.push(stripMarkdown(body));
  }

  if (textParts.length === 0 && frontmatter.image && frontmatter.image.alt) {
    textParts.push(String(frontmatter.image.alt));
  }

  // Links always go last so Mastodon can render a preview card at the bottom
  if (frontmatter.richlink && frontmatter.richlink.kind === 'movie' && frontmatter.richlink.url) {
    linkParts.push(String(frontmatter.richlink.url));
  }

  if (frontmatter.youtube) {
    linkParts.push(String(frontmatter.youtube));
  }

  return [...textParts, ...linkParts].join('\n\n').trim();
}

function truncate(text, limit) {
  if (text.length <= limit) {
    return text;
  }

  const headroom = limit - 1;
  const candidate = text.slice(0, headroom);
  const sentenceEnd = Math.max(
    candidate.lastIndexOf('. '),
    candidate.lastIndexOf('.\n'),
    candidate.lastIndexOf('! '),
    candidate.lastIndexOf('? ')
  );
  const cutAt = sentenceEnd > headroom * 0.5 ? sentenceEnd + 1 : headroom;
  return text.slice(0, cutAt).trimEnd() + '…';
}

async function postToMastodon(status) {
  const response = await fetch(`${MASTODON_BASE_URL}/api/v1/statuses`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${MASTODON_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, visibility: MASTODON_VISIBILITY }),
  });

  if (!response.ok) {
    const body = await response.text();
    const label =
      response.status === 401
        ? 'Auth error — check MASTODON_ACCESS_TOKEN'
        : response.status === 422
          ? 'Validation error — toot text rejected by server'
          : response.status === 429
            ? 'Rate limit — try again later'
            : `HTTP ${response.status}`;
    throw new Error(`${label}: ${body}`);
  }

  return response.json();
}

async function main() {
  log('# Mastodon Now Mirror');
  log('');
  log(`Target commit: ${TARGET_COMMIT_SHA}`);
  log(`Mode: **${DRY_RUN ? 'Dry-Run (no posts sent)' : 'Live'}**`);
  log('');

  const files = getNewDeNowFiles(TARGET_COMMIT_SHA);
  if (files.length === 0) {
    log('No new DE now-files found in the target commit. Nothing to post.');
    return;
  }

  if (!DRY_RUN && (!MASTODON_BASE_URL || !MASTODON_ACCESS_TOKEN)) {
    console.error('Error: MASTODON_BASE_URL and MASTODON_ACCESS_TOKEN must be set for live posting.');
    process.exit(1);
  }

  log(`New DE now-file(s) detected: ${files.length}`);
  log('');

  for (const relPath of files) {
    log('---');
    log(`**File:** \`${relPath}\``);

    const rawContent = readFileAtCommit(TARGET_COMMIT_SHA, relPath);
    const { frontmatter, body } = parseContent(rawContent);
    const rawText = composeText({ frontmatter, body });

    if (!rawText) {
      log('No postable content found. Skipping.');
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
      log('Would post — dry-run mode, no API call made.');
    } else {
      const result = await postToMastodon(tootText);
      log(`Posted successfully — ${result.url} (ID: ${result.id})`);
    }

    log('');
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});