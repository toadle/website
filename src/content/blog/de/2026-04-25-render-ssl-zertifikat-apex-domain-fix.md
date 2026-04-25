---
lang: de
title: "Render stellt kein SSL-Zertifikat für deine Apex-Domain aus? Check den DNS."
subtitle: "ALIAS-Records klingen richtig — aber sie zeigen auf die falschen IPs für die Zertifikatsausstellung."
description: "Wenn Render bei der SSL-Zertifikatsausstellung für deine Apex-Domain feststeckt, könnte ein ALIAS-Record das Problem sein. Ein einfacher A-Record auf 216.24.57.1 löst es sofort."
pubDate: '2026-04-25T00:00:00.000+02:00'
alternateLanguageUrl: /en/blog/render-ssl-certificate-apex-domain-fix/
---

Ich habe meine Website auf ein neues Render Static Site Deployment umgezogen. DNS eingerichtet, Seite erreichbar, alles wunderbar — bis auf die Kleinigkeit, dass `toadle.me` kein SSL-Zertifikat bekam. `www.toadle.me` natürlich schon. Sofort. Problemlos. Als wäre es das Normalste der Welt.

## Das Setup

Bei DNSimple hatte ich, völlig vernünftigerweise, folgendes konfiguriert:

- `ALIAS toadle.me → website-423g.onrender.com`
- `CNAME www.toadle.me → website-423g.onrender.com`

Beide Domains: dem Render-Service hinzugefügt, `verificationStatus: verified`, DNS löst korrekt auf, Seite ist erreichbar. Kurz: alles in bester Ordnung. Außer dem Zertifikat. Das fehlte einfach. Render schwieg dazu.

## Warum es feststeckt

Render verwendet **TLS-ALPN-01** für die Zertifikatsausstellung bei Custom Domains. Die CA von Google verbindet sich auf Port 443 und erwartet eine spezielle Challenge-Antwort — dafür muss die Domain auf die richtige Render-Infrastruktur routen, nicht bloß irgendwo auf den CDN-Edge landen.

Ein ALIAS-Record löst den Zielhostnamen zur Abfragezeit auf und gibt dessen aktuelle A-Records zurück. `website-423g.onrender.com` wurde zu `216.24.57.251` und `216.24.57.7` aufgelöst — Renders CDN-Edge-IPs. Die leiten Traffic brav weiter, beantworten TLS-ALPN-01-Challenges für Apex-Domains aber scheinbar nicht. Eine Information, die Render nirgendwo besonders laut kommuniziert.

`www.toadle.me` funktionierte, weil ein CNAME den Hostnamen erhält und Renders Infrastruktur damit die Anfrage korrekt zuordnen kann — auch während der Zertifikatsausstellung. Apex-Domain mit ALIAS: Fehlanzeige.

## Die Lösung

ALIAS-Record raus, stattdessen ein schnöder **A-Record**:

```
A  toadle.me  216.24.57.1
```

`216.24.57.1` ist die IP, die Render für Apex-Custom-Domains vorgesehen hat und die die Zertifikatsausstellung tatsächlich verarbeitet. Das Zertifikat war buchstäblich Sekunden später da. Hätte man ja auch einfach so dokumentieren können.

## Das Besonders Erfreuliche daran

Der ALIAS-Record hatte nämlich vorher funktioniert. Meine alte Website war ein Ruby-Webservice auf Render, ebenfalls auf `toadle.me`, ebenfalls mit exakt demselben ALIAS-Record — und der hatte ein einwandfreies SSL-Zertifikat. Kein Problem, nie gewesen.

Irgendwas am Wechsel auf eine Static Site hat also still und heimlich geändert, wie Render das Routing für die Zertifikatsausstellung bei Apex-Domains handhabt. Changelog-Eintrag dazu: nicht auffindbar.

## Fazit

Wer eine **Static Site** auf Render mit einer Apex-Domain betreibt: kein ALIAS, kein ANAME auf den `*.onrender.com`-Hostnamen. Einfach `A → 216.24.57.1` und fertig. Der Rest ist Zeitverschwendung.
