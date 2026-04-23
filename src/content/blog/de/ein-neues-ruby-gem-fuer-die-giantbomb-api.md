---
lang: 'de'
title: 'Ein neues Ruby-Gem für die Giantbomb-API'
description: 'Ein neues, sehr ruby-isches Gem für die Giantbomb-API. Weil ich Ruby und Videospiele liebe.'
pubDate: '2015-09-19T00:00:00.000+02:00'
alternateLanguageUrl: '/en/blog/a-new-ruby-gem-for-the-giantbomb-api/'
---

Ich liebe **Videospiele**. Ich liebe auch **strukturierte Daten** über Dinge, wie z.B. [IMDB](http://www.imdb.com) oder [TheMovieDB](https://www.themoviedb.org/). Wenn es um Daten zu Videospielen geht, sind die besten strukturierten Informationen im redaktionellen Content von [Giantbomb](http://www.giantbomb.com/) versteckt. Sie bieten auch eine großartige [API](http://api.giantbomb.com), die Zugang zu diesen Daten ermöglicht. Leider war die Ruby-Unterstützung durch bestehende Gems etwas begrenzt.

Es gibt zwei verfügbare Gems — [eins](https://github.com/flockonus/giantbomb_api), [zwei](https://github.com/pacMakaveli/giantbomb) — beide sind gut für den grundlegenden API-Zugriff, aber nicht besonders *ruby-isch* und unterstützen manchmal nicht alle Endpunkte.

Ich habe versucht, diese Situation zu verbessern, indem ich mein eigenes [Giantbomb API-Gem](https://github.com/toadle/giant_bomb_api) erstellt habe.

Mit folgenden Zielen:

  - Unterstützung der meisten API-Endpunkte
  - *Ruby-isch* sein
  - Abfragen durch einfache Aufrufe an die jeweiligen Models
  - Leicht verständlicher, wartbarer Code
  - Vollständig getestet

Jetzt könnt ihr selbst urteilen, ob es geklappt hat — entweder mit `gem install giant_bomb_api` oder indem ihr `gem 'giant_bomb_api'` zu eurem `Gemfile` hinzufügt.
