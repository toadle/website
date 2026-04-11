---
lang: 'en'
title: 'A new Ruby-gem for the Giantbomb API'
description: 'A new, very ruby-ish GEM for the Giantbomb-API. Because I like Ruby and video-games.'
pubDate: '2015-09-19T00:00:00.000+02:00'
---

You know, I really like **videogames**. I also really like **structured data** about stuff. e.g. [IMDB](http://www.imdb.com) or [TheMovieDB](https://www.themoviedb.org/). When it comes to data for videogames the best place for structured data is hidden in the editorial content of [Giantbomb](http://www.giantbomb.com/). They also offer a great [API](http://api.giantbomb.com) that gives access for this data. Sadly the ruby-support in gems was a bit limited.

There are two gems available [one](https://github.com/flockonus/giantbomb_api), [two](https://github.com/pacMakaveli/giantbomb) both are great for doing basic access to the API, but are a bit *not-ruby-ish* and sometimes don't have support for every endpoint. 

I tried so work on that situation, by creating my own [Giantbomb API-gem](https://github.com/toadle/giant_bomb_api). 

With the following in mind: 

  - Support most of the API-endpoints
  - Be *ruby-ish*
  - Querying by simple calls to the respective models
  - Easy to understand/mainable code
  - Full tested

Now you be the judges if it worked or do `gem install giant_bomb_api` or just add `gem 'giant_bomb_api'` to your `Gemfile`.
