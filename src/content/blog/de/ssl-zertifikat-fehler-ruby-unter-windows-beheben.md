---
lang: 'de'
title: 'SSL-Zertifikatsfehler in Ruby unter Windows beheben'
description: 'Vor einiger Zeit habe ich beschrieben, wie man SSL-Zertifikatsprobleme mit RVM behebt. Das Problem existiert auch unter Windows — hier ist die Lösung.'
pubDate: '2016-08-23T00:00:00.000+02:00'
alternateLanguageUrl: '/en/blog/fixing-failing-ssl-certificate-verification-for-ruby-under-windows/'
---

Vor einiger Zeit habe ich [einen kurzen Artikel](/de/blog/ssl-zertifikat-fehler-rvm-osx-beheben/) geschrieben, der Menschen vor den SSL-Zertifikatsproblemen bewahren sollte, die bei der Verwendung von RVM auftreten können. Dieses Problem ist **nicht** verschwunden und existiert bis heute.

Da ich es gerade unter Windows beheben musste, dachte ich, ich schreibe auch über die Lösung, die ich dort entdeckt habe. Windows ist leider ein völlig anderes Tier, wenn es um Ruby geht.

## Systemvoraussetzungen

Für die folgende Lösung gehe ich davon aus, dass Ruby über **[RubyInstaller](http://rubyinstaller.org/)** installiert wurde und **GitBash** als Kommando-Shell verwendet wird, die mit dem [Standard Windows Git Installer](https://git-scm.com/download/win) mitgeliefert wird. Falls nicht, empfehle ich, auf diesen Weg umzusteigen. Andernfalls sind die Anweisungen hier nur als Hinweise zu verstehen.

## Fehler beim Verbinden mit SSL- oder HTTPS-Zielen

Der Fehler sieht ungefähr so aus. Ich führe hier ein Skript aus, das versucht, Geocoding über Google APIs durchzuführen:

    OpenSSL::SSL::SSLError: SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed

Dasselbe Skript zeigte auf meinem Rechner (Mac/OSX, behoben mit den Anweisungen aus [diesem Artikel](/de/blog/ssl-zertifikat-fehler-rvm-osx-beheben/)) keine Probleme.

Da ich aus meiner Suche nach einer Lösung unter OSX bereits wusste, dass das Problem in den fehlenden **lokalen SSL-Zertifikaten** liegt, die OpenSSL zur Überprüfung anderer Zertifikate (z.B. Googles) verwendet.

Ich konnte nicht sicher sein, ob OpenSSL überhaupt auf dem Windows-Rechner meines Kollegen vorhanden war. Also habe ich das zuerst geprüft. **Bitte beachten**: Alles wird in GitBash ausgeführt, weshalb — wie unter OSX/Linux — am Anfang der Befehle immer ein `$` steht:

    $ openssl
    OpenSSL> exit

OpenSSL ist also vorhanden. Das macht die Sache aber nicht unbedingt einfacher, denn unter OSX lässt sich das Problem durch die Neuinstallation eines **lokal kompilierten** Ruby beheben, das die korrekte OpenSSL-Installation verwendet.

Das können wir hier nicht tun, weil unter Windows keine Build-Tools vorhanden sind. Also wollen wir zunächst mehr über das Problem erfahren.

## Immer noch eine statisch gelinkte OpenSSL-Installation

Mit dem bewährten [ssl-tools/doctor.rb](https://github.com/mislav/ssl-tools) sah ich folgendes:

    $ ruby doctor.rb accounts.google.com:443
    C:/Ruby23-x64/bin/ruby (2.3.1-p112)
    OpenSSL 1.0.1l 15 Jan 2015: C:/Users/Justin/Projects/knap-build/var/knapsack/software/x64-windows/openssl/1.0.1l/ssl
    SSL_CERT_DIR=""
    SSL_CERT_FILE=""

    HEAD https://accounts.google.com:443
    OpenSSL::SSL::SSLError: SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed

    The server presented a certificate that could not be verified:
      subject: /C=US/O=GeoTrust Inc./CN=GeoTrust Global CA
      issuer: /C=US/O=Equifax/OU=Equifax Secure Certificate Authority
      error code 20: unable to get local issuer certificate

    Possible causes:
      `C:/Users/Justin/Projects/knap-build/var/knapsack/software/x64-windows/openssl/1.0.1l/ssl/cert.pem' does not exist
      `C:/Users/Justin/Projects/knap-build/var/knapsack/software/x64-windows/openssl/1.0.1l/ssl/certs/' is empty

Wenig bekannte Tatsache über den RubyInstaller: Der Typ, der ihn kompiliert, heißt offenbar `Justin`, und man sieht auch, wie seine lokalen Projekte organisiert sind.

Das Problem ist also, dass das installierte Ruby OpenSSL in `C:/Users/Justin/Projects/...` nach Zertifikaten sucht.

Zunächst versuchte ich, das `cert.pem` meines OSX-Systems und den Inhalt meines `ssl/certs`-Verzeichnisses in einen Ordner wie `Justin`s zu kopieren, den ich manuell erstellt hatte. Kurze Version: Das funktioniert nicht. Warum genau, kann ich nicht sagen. Ich vermute, dass mein Kollege keinen Zugriff auf `Justin`s Ordner hat.

## Lösung durch das Finden der richtigen Zertifikatspfade

Da das Kopieren von SSL-Zertifikaten nicht hilft, dachte ich, es müssen Zertifikate mit **GitBash** installiert sein, da `openssl` dort vorhanden ist.

Wie findet man die richtigen Pfade für GitBash's OpenSSL?

    $ which openssl
    /mingw64/bin/openssl

Das zeigt, dass `openssl` sich in `/mingw64/bin/openssl` befindet. Der Verzeichnisname `mingw64` verweist auf [MinGW](http://mingw.org/), auf dem GitBash basiert.

Wo sind die Zertifikate genau? Da Linux-Distributionen Dinge gerne verteilt speichern, war ich etwas besorgt, dass sie schwer zu finden sein würden.

Das waren sie nicht.

    $ cd /mingw64/

    user@PC MINGW64 /mingw64
    $ ll
    total 40
    drwxr-xr-x 1 user 197121 0 Aug 18 09:32 bin/
    drwxr-xr-x 1 user 197121 0 Aug 18 09:31 etc/
    drwxr-xr-x 1 user 197121 0 Aug 18 09:31 lib/
    drwxr-xr-x 1 user 197121 0 Aug 18 09:31 ssl/

    user@PC MINGW64 /mingw64
    $ cd ssl/

    user@PC MINGW64 /mingw64/ssl
    $ ll
    total 260
    -rw-r--r-- 1 user 197121 251072 Nov 30  2015 cert.pem
    drwxr-xr-x 1 user 197121      0 Aug 18 09:31 certs/
    -rw-r--r-- 1 user 197121  10835 Mai 10 08:55 openssl.cnf

Da sind sie. **Glückstreffer.**

Jetzt muss Ruby nur noch angewiesen werden, in `/mingw64/ssl` nachzuschauen — ohne Neukompilierung.

`doctor.rb` gibt den richtigen Hinweis: Es gibt zwei Variablen, die wir nutzen können: `SSL_CERT_DIR` und `SSL_CERT_FILE`.

    $ export SSL_CERT_DIR=/mingw64/ssl/certs
    $ export SSL_CERT_FILE=/mingw64/ssl/cert.pem

Dann nochmal versuchen:

    $ ruby doctor.rb accounts.google.com:443
    ...
    HEAD https://accounts.google.com:443
    OK

Funktioniert.

Diese Einstellung gilt aber nur für das aktuelle Shell-Fenster. Damit sie dauerhaft erhalten bleibt, fügen wir sie zur `.profile`-Datei hinzu:

    $ echo "export SSL_CERT_DIR=/mingw64/ssl/certs" >> .profile
    $ echo "export SSL_CERT_FILE=/mingw64/ssl/cert.pem" >> .profile

Problem gelöst. Nichts weiter zu sehen hier.
