---
lang: 'de'
title: 'SSL-Zertifikatsfehler mit RVM auf OSX beheben'
description: 'Ruby, installiert mit RVM unter OSX, wirft einen OpenSSL::SSL::SSLError und verhindert Verbindungen zu SSL-gesicherten Zielen. Hier ist die Lösung.'
pubDate: '2015-04-16T00:00:00.000+02:00'
alternateLanguageUrl: '/en/blog/fixing-failing-ssl-certificate-verification-with-rvm-osx/'
---

Ich komme gerade aus einer Welt des Schmerzes zurück und werde euch meine Geschichte erzählen, damit ihr diesen Weg nicht selbst gehen müsst.

Heute Morgen, beim Arbeiten an etwas Ruby-Code, versuchte ich einen `rake`-Task auszuführen, der im Verlauf eine **einfache HTTPS-Verbindung** zu einem Google-Dienst herstellt.

## Fehler

Das plötzlich zurückgegebene Ergebnis war ein sehr seltsamer Fehler:

    OpenSSL::SSL::SSLError: SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed

Auf den Maschinen zweier Kollegen trat das Problem nicht auf.

Das bedeutet im Wesentlichen, dass die Zertifikatskette für die HTTPS-Verbindung nicht verifiziert werden kann. In normalen Worten: Ruby ist nicht in der Lage, ein Sicherheits-Verfahren durchzuführen, für das es **lokal installierte Root-Zertifikate** benötigt.

## Ursache

Bei der Suche nach einer Lösung habe ich verschiedenes versucht:

- *Neuinstallation* von `rvm` (das ich zur Verwaltung mehrerer Ruby-Versionen nutze)
- *Neuinstallation* von `brew`, dem OS X Paketmanager

Nichts half.

Beim Googeln stieß ich auf ein großartiges Skript namens [ssl-tools/doctor.rb](https://github.com/mislav/ssl-tools), das mich schließlich in die richtige Richtung wies.

Das Skript analysiert SSL-Probleme mit Ruby und liefert etwas ausführlichere Fehlermeldungen als die einfache Exception:

    ruby doctor.rb accounts.google.com:443
    /Users/tim/.rvm/rubies/ruby-2.2.1/bin/ruby (2.2.1-p85)
    OpenSSL 1.0.1j 15 Oct 2014: /etc/openssl
    SSL_CERT_DIR=„"
    SSL_CERT_FILE=„"

    HEAD https://accounts.google.com:443
    OpenSSL::SSL::SSLError: SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed

    Possible causes:
      `/etc/openssl/certs/‚ is empty

Es sind also keine **Zertifikate** in `/etc/openssl/certs` vorhanden — was sich als korrekt herausstellte. Dort war nichts.

Die Frage ist, warum es dort überhaupt sucht. Bei einer `openssl`-Installation über `brew` sollte diese in `/usr/local/bin/openssl` liegen. Die entsprechenden Zertifikate wären dann in `/usr/local/etc/openssl/certs`.

In weiteren verzweifelten Versuchen habe ich `rvm` vollständig deinstalliert und war wieder auf dem alten `ruby-2.0`, das mit OS X vorinstalliert ist. Plötzlich funktionierte es:

    ruby doctor.rb accounts.google.com:443
    /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/bin/ruby (2.0.0-p481)
    OpenSSL 0.9.8za 5 Jun 2014: /System/Library/OpenSSL
    ...
    HEAD https://accounts.google.com:443
    OK

## Lösung

Das mit RVM installierte Ruby sucht also im falschen Verzeichnis nach Zertifikaten, während das OSX-Ruby im richtigen sucht.

**Das mit RVM installierte Ruby ist das Problem.**

Diese [Diskussion auf Github](https://github.com/rvm/rvm/issues/3330) lieferte schließlich die Lösung: RVM liefert eine vorkompilierte Ruby-Version aus, die statisch gegen ein OpenSSL gelinkt ist, das in `/etc/openssl` nach Zertifikaten sucht.

Die Lösung ist, **keine** der vorkompilierten Rubies zu verwenden und Ruby stattdessen lokal zu kompilieren: `rvm install 2.2.0 --disable-binary`

Das dauert länger, lohnt sich aber:

    ruby doctor.rb accounts.google.com:443
    /Users/tim/.rvm/rubies/ruby-2.2.0/bin/ruby (2.2.0-p0)
    OpenSSL 1.0.2a 19 Mar 2015: /usr/local/etc/openssl
    ...
    HEAD https://accounts.google.com:443
    OK

Geschafft.

**Update 2016-08-23**: Ich habe beschrieben, wie man [dieses Problem unter Windows](/de/blog/ssl-zertifikat-fehler-ruby-unter-windows-beheben/) behebt.

**Update 2016-11-16**: Mehrere Leute haben darauf hingewiesen, dass das Problem in OSX Yosemite, El Capitan, Sierra und macOS weiterhin auftritt. Diese Lösung funktioniert mit allen. Eine weitere Option ist, von RVM auf [rbenv](https://github.com/rbenv/rbenv) umzusteigen — was ich inzwischen selbst getan habe.
