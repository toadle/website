---
lang: 'de'
title: 'Terminal als App-Launcher-Alternative auf dem Mac'
description: 'Ich bin ein sehr großer Fan der Produktivitätsverbesserungen, die nur durch die Verwendung von Tastaturkürzeln möglich sind. Man tauscht das Erlernen einiger Ta'
pubDate: '2020-10-21T21:30:00.000+02:00'
alternateLanguageUrl: '/en/blog/terminal-as-an-app-launcher-alternative-on-the-mac/'
heroImage: '../../../assets/blog/legacy/terminal-as-launchbar-alfred-alternative-auf-dem-mac-6c8908c2.jpg'
---

Ich bin ein sehr großer Fan der Produktivitätsverbesserungen, die nur durch die Verwendung von Tastaturkürzeln möglich sind. Man tauscht das Erlernen einiger Tastendrücke gegen eine Menge Geschwindigkeit seiner Workflows bei gleichzeitiger Wahrung der Präzision. Ich finde die Verwendung von Tools wie [Launchbar](https://obdev.at/products/launchbar/index.html) oder [Alfred](https://www.alfredapp.com) oder [Quicksilver](https://qsapp.com) (als es das noch gab) sehr befriedigend. Sogar die aktuelle Version der Spotlight-Suchleiste des Mac macht da einen guten Job. 

Aber ich bin nie dazu gekommen, mich wirklich in die Art und Weise zu vertiefen, wie bei diesen Tools die Erweiterungen funktionieren. Außerdem finde ich das Schreiben separater Erweiterungen für Aufgaben, die ich mit sehr wenigen Befehlen im Terminal lösen kann, irgendwie vertane Zeit und benutze daher selten mehr als das einfache App-Starten dieser Apps. 

Mein **Standard-Nutzungsfall** für diese unglaublich leistungsfähigen Werkzeuge besteht also darin, einfach `Cmd+Leertaste` zu drücken und einige Zeichen des Namens meiner Zielanwendung zu hämmern und dann die Anwendung mit `Enter` zu starten. 

Währenddessen hat das Terminal so viele produktivitätssteigernde Anwendungen wie in [terminals-are-sexy] (https://github.com/k4m4/terminals-are-sexy), die ich oft benutze, aber gerne noch mehr verwenden würde. Problematisch ist allerdings, dass mein Standard-Anwendungsfall - Anwendungen nur mit `Cmd+Leertaste` zu starten - NICHT wirklich gut mit dem Terminal umgesetzt werden kann. Vor allem dann nicht, wenn man etwas wie Fuzzy-Matching haben will, das z.B. Launchbar out of the box macht.  

Aber...das lässt sich ändern. Hier ist wie:

Zuerst benötigt ihr ein Terminal, das man auf die gleiche Weise mit `Cmd+Leertaste` starten kann. Ich würde vorschlagen, [iTerm](https://iterm2.com) zu verwenden. Unter `Einstellungen -> Tasten -> Hotkey` kann man einen systemweiten Hotkey erstellen, der iTerm ein- und ausblendet.

![iTerm Hotkey](//images.ctfassets.net/zbv7lbwbpya6/2Yj4KvAp9Ous3ZDqFB9emF/cb03d069c2218b9e25dbc8e15ad56c5b/Bildschirmfoto_2020-10-21_um_21.55.15.png){: .my-4}

Als nächstes solltet ihr das Fenster so einstellen, dass es ähnlich aussieht wie Launchbar, indem ihr `Profiles -> Window -> Style` auf `Full-Width Top of Screen` setzt. 

![Bildschirmfoto 2020-10-21 um 22.00.20](//images.ctfassets.net/zbv7lbwbpya6/7no2wr6osGTF62za4Iw3Y/905a2c8522978933edbd0a546d875e9d/Bildschirmfoto_2020-10-21_um_22.00.20.png){: .my-4}

Auf diese Weise erhalten Sie ein schönes Shell-Fenster in der oberen Hälfte Ihres Bildschirms, indem Sie einfach `Cmd+Space` drücken. Übrigens benutze ich [fishshell](http://fishshell.com) als meine Standard-Shell und das sys-info-Tool ist [archey](https://formulae.brew.sh/formula/archey).

![Bildschirmfoto 2020-10-21 um 22.01.25](//images.ctfassets.net/zbv7lbwbpya6/3GfGxP15wh7Gc4xBz19EIT/a058e8412d47e19c785d2dc2fed0aefe/Bildschirmfoto_2020-10-21_um_22.01.25.jpg){: .my-4}

Nun zu den benötigten Skripten zum Starten von Anwendungen.

Erstellt eine Datei `.config/fish/functions/launcher.fish` und fügt den folgenden Inhalt ein: 

```
function launcher
  if test -d $argv
    mdfind 'kMDItemContentType == "com.apple.application-*"' | grep '/Applications/' | sk | tr \\n \\0 | xargs -0 open
  else
    mdfind 'kMDItemContentType == "com.apple.application-*"' | grep '/Applications/' | sk -q $argv | tr \\n \\0 | xargs -0 open
  end
end
```

Bitte beachtet, dass dies nur mit Fishshell funktioniert. Die Verwendung von `Bash` sollte aber ähnlich sein.

Ändert nun die Datei `.config/fish/config.fish` und fügt eine Zeile `alias l=launcher` hinzu. 

Nun gibt es zwei Möglichkeiten: 
- Entweder ihr gebt einfach `l` auf Ihrem Terminal ein und man erhält eine Liste all Ihrer Anwendungen, die man mit Fuzzy-Filter filtern kann, indem einfach lostippt. Mit `Enter` wird die ausgewählte Anwendung gestartet.
- Oder man kann einfach `l <irgendwas>` tippen und die Liste wird bereits nach `irgendwas` gefiltert. Im besten Fall könnt ihr einfach `Enter` drücken und fertig.

So sieht das Ganze aus:
[![asciicast](https://asciinema.org/a/pHyO3R5HnxTEwkg0Qc81G7EWP.svg){: .my-4}](https://asciinema.org/a/pHyO3R5HnxTEwkg0Qc81G7EWP)

Und so funktioniert es:

- `mdfind 'kMDItemContentType == "com.apple.application-*"'` verwendet den Spotlight Kommandozeilen-Client des Mac, um nach allen verfügbaren Anwendungen zu suchen.
- `grep '/Applications/'` filtert nur Ihre Benutzer- und System-Anwendungen heraus.
- `sk" macht die Liste fuzzy-finding-fähig, indem [skim] (https://github.com/lotabout/skim) verwendet wird. Übrigens müsst ihr das vorher installieren.
- `tr \\n \\0 | xargs -0 open` führt eine Bereinigung der Ausgabe durch und startet dann die ausgewählte Anwendung. 

Ich hoffe, es gefällt Euch. Wenn ihr irgendwelche Verbesserungsvorschläge habt, immer her damit - am besten auf [Twitter](http://twitter.com/toadle).

