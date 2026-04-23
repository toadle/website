---
lang: 'de'
title: 'Mehr Spiele auf dem NES Mini Classic mit hakchi2 und einem Mac hinzufügen'
description: 'Der NES Mini Classic ist eine wunderbare kleine Konsole. So fügt man mit hakchi2 und einem Mac kostenlos weitere Spiele hinzu.'
pubDate: '2017-02-03T00:00:00.000+02:00'
alternateLanguageUrl: '/en/blog/how-to-add-more-games-to-nes-mini-classic-using-hakchi2-and-a-mac/'
---

Der [NES Mini Classic](http://bit.ly/nesminiclassic) ist eine wunderbare kleine Konsole. Er fängt das **alte Gaming-Feeling** perfekt ein — man sitzt nah am Bildschirm, hält authentisch wirkende Controller in der Hand und alles wird modern über HDMI auf einem aktuellen Fernseher ausgegeben.
Dazu kommen all die guten alten Klassiker im 30-Spiele-Lineup, sodass man alles spielen kann, was man in den 90ern liebte. **Alles? Fast.**

Vielleicht fehlen einige Spiele, die man gerne hätte. Mir fehlt zum Beispiel *Nintendo World Cup*, das ich auf meinem echten NES besitze, aber nicht auf dem Mini. Andere Titel vermisst man vielleicht auch. IGN hat eine großartige [Liste](http://www.ign.com/lists/top-100-nes-games/41).

Nicht lange nach dem Launch kam [hakchi](https://github.com/madmonkey1907/hakchi "hakchi") zur Rettung und bot eine erste Möglichkeit, Spiele hinzuzufügen. Es funktionierte sogar auf mehreren Plattformen — Windows, Mac und Ubuntu — aber man musste es selbst kompilieren, was bei mir nicht klappte.

Dann kam [hakchi2](https://github.com/ClusterM/hakchi2) mit viel besserer Bedienbarkeit, aber mit dem großen Nachteil für Mac-Nutzer wie mich: **Es läuft nur unter Windows.** Seit seiner Veröffentlichung habe ich nach einem Weg gesucht, **es auf einem Mac zu nutzen**. Nach einigem Ausprobieren ist es gar nicht so schwierig — und es ist **KOSTENLOS**, auch wenn man kein Windows besitzt.

**HAFTUNGSAUSSCHLUSS:**
[hakchi2](https://github.com/ClusterM/hakchi2) ersetzt die komplette Firmware/den Speicher des NES Mini Classic. Das bedeutet: alles auslesen, modifizieren, wieder einspielen — dabei wird das gesamte System überschrieben. Falls dabei etwas schiefgeht, könnte der Mini nicht mehr starten. Ich habe Berichte gelesen, wo das passiert ist und die Leute das Original-System wieder flashen konnten. Aber Garantien gibt es keine.

Wer Retro-Spiele liebt, weiß auch: NES-Spiele sind **urheberrechtlich geschützt und dürfen nicht kostenlos genutzt werden**. Bitte nur Spiele auf dem NES Mini installieren, die man legal besitzt.

![nesminiclassic](//images.contentful.com/zbv7lbwbpya6/1NsmttTJdK0AkYIQqAgyU4/8358c82dbcb59303729b777f95a994a7/nesminiclassic.jpg)

## Was man braucht
- Das [neueste Binary-Release von hakchi2](https://github.com/ClusterM/hakchi2/releases)
- [VirtualBox für Mac](https://www.virtualbox.org/) (ich nutzte Version 5.1.14 für OSX Hosts)
- Das [VirtualBox Extension Pack](https://www.virtualbox.org/wiki/Downloads) (auf `All supported platforms` klicken)
- Ein Microsoft Windows Virtual Machine Image für VirtualBox, das man [hier](https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/) findet (ich nutzte `Microsoft Edge Win 10 Stable`). Läuft 90 Tage. Mit Snapshots kann man das verlängern — Microsoft empfiehlt das sogar im Hintergrundbild.
- Etwa 20 GB freier Speicherplatz auf dem Mac
- Den NES Mini Classic (meiner ist ein Modell `MOD. CLV-001`) mit USB-Kabel. Controller werden nicht benötigt.

## Kurzversion
- **VirtualBox** installieren und starten.
- **Extension Pack** installieren.
- **Windows** VM hinzufügen.
- **USB-Unterstützung** aktivieren.
- VM starten.
- `hakchi2` starten.
- Windows **.NET Framework** installieren lassen.
- NES Mini per USB **verbinden**.
- NES Mini einschalten, dabei RESET halten.
- **NES-Mini-Treiber** aus `hakchi2` installieren.
- Kernel dumpen.
- [Video](https://www.youtube.com/watch?v=33_dE9CqN_I) ansehen, um hakchi2 kennenzulernen.

## Detaillierte Version
- VirtualBox mit dem Installer installieren (meine Datei hieß `VirtualBox-5.1.14-112924-OSX`)
- VirtualBox starten
- Das Extension Pack herunterladen und per Doppelklick öffnen (bei mir `Oracle_VM_VirtualBox_Extension_Pack-5.1.14-112924.vbox-extpack`)
  Das Extension Pack wird benötigt, weil VirtualBox standardmäßig keine USB-Unterstützung mitbringt. Da wir später den NES Mini per USB verbinden, muss es installiert werden.
- „Install" klicken, Lizenzvereinbarung akzeptieren. Dann die Windows VM installieren.
- Die heruntergeladene VM von Microsoft aus der ZIP-Datei entpacken. Meine Datei hieß `MSEdge.Win10_RS1.VirtualBox.zip` und enthielt `MSEdge - Win10_preview.ova`
- `MSEdge - Win10_preview.ova` doppelklicken.
- VirtualBox zeigt nun die Konfiguration für die VM. Einstellungen so akzeptieren und auf *„Import"* klicken.
- Der Import dauert etwas.
- Nach dem Import ist die VM in VirtualBox sichtbar. Im rechten Panel unter *„USB"* steht *„Deaktiviert"* — das muss geändert werden.
- Auf „Einstellungen" klicken → *„Anschlüsse" → „USB"*. USB-Controller aktivieren und `USB-2.0-Controller (EHCI)` wählen.
- VM starten.
- Nach dem Start gibt es möglicherweise einen Hinweis, dass die Gasterweiterungen veraltet sind. Kann man ignorieren oder über *"Geräte" → "Gasterweiterungen einlegen…"* aktualisieren.
- [hakchi2](https://github.com/ClusterM/hakchi2/releases) herunterladen und entpacken.
- `hakchi.exe` doppelklicken. Windows fordert möglicherweise die Installation von .NET Framework 3.5. *"Diese Funktion herunterladen und installieren"* klicken und warten.
- Fenster schließen und `hakchi.exe` erneut starten.
- NES Mini Classic per USB mit dem Mac verbinden.
- NES Mini einschalten, dabei die RESET-Taste halten. LED leuchtet nicht auf.
- In VirtualBox unten rechts auf das USB-Symbol klicken und `Onda (unverified) V972 tablet in flashing mode` auswählen.
- Windows installiert automatisch einen Treiber. Warten bis fertig.
- In *hakchi2* auf *„Kernel → Dump kernel"* klicken.
- Ein Popup erscheint: *„Waiting for NES Mini…"*, dann *„Install driver"* klicken und Warnung akzeptieren.
- Ein schwarzes Fenster erscheint. Warten, bis eine Meldung erscheint, die etwa *„Press ENTER to close"* lautet.
- ENTER drücken.
- Der Kernel-Dump startet.
- *hakchi2* ist einsatzbereit.

Wer mehr über die Verwendung von *hakchi2* erfahren möchte, schaut sich dieses [Video](https://www.youtube.com/watch?v=33_dE9CqN_I) an.

Und so nutzt man *hakchi2* auf einem Mac — **kostenlos**.
