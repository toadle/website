---
lang: en
title: "Render Won't Issue an SSL Certificate for Your Apex Domain? Check Your DNS."
subtitle: "ALIAS records sound right — but they point to the wrong IPs for cert provisioning."
description: "If Render is stuck on SSL certificate issuance for your apex domain, the culprit might be an ALIAS record. Switching to a plain A record pointing to 216.24.57.1 fixes it instantly."
pubDate: '2026-04-25T00:00:00.000+02:00'
alternateLanguageUrl: /de/blog/render-ssl-zertifikat-apex-domain-fix/
---

I recently moved my site to a new Render static site deployment. DNS was set up, the site was live — but the SSL certificate for the apex domain `toadle.me` refused to be issued. Meanwhile, `www.toadle.me` got its cert immediately.

## The Setup

On DNSimple I had:

- `ALIAS toadle.me → website-423g.onrender.com`
- `CNAME www.toadle.me → website-423g.onrender.com`

Both domains were added to the Render service and showed `verificationStatus: verified`. DNS was resolving correctly. The site was reachable. And yet: no cert for the apex domain, while `www` worked fine.

## Why It Gets Stuck

Render uses **TLS-ALPN-01** for custom domain cert provisioning. This means Google's CA connects to your domain on port 443 and expects a special challenge response. For this to work, your domain needs to route to the specific Render infrastructure that handles cert provisioning — not just the CDN edge.

An ALIAS record resolves the target hostname at query time and returns its current A records. In my case, `website-423g.onrender.com` was resolving to `216.24.57.251` and `216.24.57.7` — Render's CDN edge IPs. These handle traffic just fine, but they apparently don't respond to TLS-ALPN-01 challenges for custom apex domains.

`www.toadle.me` worked because a CNAME lets Render's infrastructure identify the request by hostname and route it correctly, including during cert provisioning.

## The Fix

Remove the ALIAS record and replace it with a plain **A record**:

```
A  toadle.me  216.24.57.1
```

`216.24.57.1` is Render's designated IP for apex custom domains — the one that properly handles cert provisioning. The certificate was issued within seconds of making the change.

## The Strange Part

What made this extra puzzling: the ALIAS record had worked perfectly before. My previous site was a Ruby web service on Render, also on `toadle.me`, also using the same ALIAS record — and that one had a valid SSL certificate without any issues. So it's not that ALIAS records are fundamentally broken on Render. Something about the switch to a static site changed how cert provisioning routes traffic for apex domains.

## Takeaway

If you're hosting a **static site** on Render with a custom apex domain, don't use an ALIAS (or ANAME) record pointed at your `*.onrender.com` hostname — even though it seems like the right approach. Use a direct A record to `216.24.57.1` instead.
