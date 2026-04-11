---
lang: 'en'
title: 'Terminal as an App-Launcher alternative on the Mac'
description: 'I''m a very big fan of the productivity improvements that only using keyboard shortcuts brings. You trade the learning of some button pushes for a lot of speed i'
pubDate: '2020-10-21T21:30:00.000+02:00'
alternateLanguageUrl: '/de/blog/terminal-as-launchbar-alfred-alternative-auf-dem-mac/'
heroImage: '../../../assets/blog/legacy/terminal-as-an-app-launcher-alternative-on-the-mac-6c8908c2.jpg'
---

I'm a very big fan of the productivity improvements that only using keyboard shortcuts brings. You trade the learning of some button pushes for a lot of speed in your workflows while maintaining precision. I find using tools like [Launchbar](https://obdev.at/products/launchbar/index.html) or [Alfred](https://www.alfredapp.com) or [Quicksilver](https://qsapp.com) (when that was still a thing) very satisfying. Even the current version of the Mac's Spotlight-searchbar is something I like very much. 

But I've never gotten around of really digging into the way these tools do their extensions. Also I find that writing seperate extensions for task that I can solve in very few commands in Terminal somewhat tedious and therefore rarely use more than the simple app-launching of these apps. 

So my **standard use-case** for these incredibly powerful tools is just pressing `Cmd+Space` and punching some characters of the name of my target app, then launching the app with `Enter`. 

All the while the Terminal has so many great productivity boosting apps like in [terminals-are-sexy](https://github.com/k4m4/terminals-are-sexy) which I use often, but would like to use even more. But my standard use-case of just launching apps with `Cmd+Space` is NOT something that the Terminal can do. Especially if you want something like fuzzy-matching that for example Launchbar does out of the box.  

Here is how to change that.

First you need a Terminal that you can launch the same way with `Cmd+Space`. I'd suggest using [iTerm](https://iterm2.com). Under `Preferences -> Keys -> Hotkey` you can create a system-wide hotkey that will show/hide iTerm.

![iTerm Hotkey](//images.ctfassets.net/zbv7lbwbpya6/2Yj4KvAp9Ous3ZDqFB9emF/cb03d069c2218b9e25dbc8e15ad56c5b/Bildschirmfoto_2020-10-21_um_21.55.15.png){: .my-4}

Next you should set the window to appear somewhat similar by setting `Profiles -> Window -> Style` to `Full-Width Top of Screen`. 

![Bildschirmfoto 2020-10-21 um 22.00.20](//images.ctfassets.net/zbv7lbwbpya6/7no2wr6osGTF62za4Iw3Y/905a2c8522978933edbd0a546d875e9d/Bildschirmfoto_2020-10-21_um_22.00.20.png){: .my-4}

This way you'll get a nice shell-window on the top-half of your screen by just pushing `Cmd+Space`. By the way I use [fishshell](http://fishshell.com) as my standard shell and the sys-info tool is [archey](https://formulae.brew.sh/formula/archey).

![Bildschirmfoto 2020-10-21 um 22.01.25](//images.ctfassets.net/zbv7lbwbpya6/3GfGxP15wh7Gc4xBz19EIT/a058e8412d47e19c785d2dc2fed0aefe/Bildschirmfoto_2020-10-21_um_22.01.25.jpg){: .my-4}

Now for the needed scripts to launch apps.

Go create a `.config/fish/functions/launcher.fish` file and add the following content: 

```
function launcher
  if test -d $argv
    mdfind 'kMDItemContentType == "com.apple.application-*"' | grep '/Applications/' | sk | tr \\n \\0 | xargs -0 open
  else
    mdfind 'kMDItemContentType == "com.apple.application-*"' | grep '/Applications/' | sk -q $argv | tr \\n \\0 | xargs -0 open
  end
end
```

__Please note__ that this only works with fishshell. Using `bash` might be similar.

Now edit your `.config/fish/config.fish` file and add a line `alias l=launcher` to it. 

Now you have two ways of using this: 
- Either you can just type `l` on your Terminal and will get a list of all your apps, which you can fuzzy-filter by just typing ahead. `Enter` will launch the selected app.
- Or you can type `l <something>` and the list will already be filtered by `something`. Best case, you can just hit `Enter` and be done.

Here is what it looks like:
[![asciicast](https://asciinema.org/a/pHyO3R5HnxTEwkg0Qc81G7EWP.svg){: .my-4}](https://asciinema.org/a/pHyO3R5HnxTEwkg0Qc81G7EWP)

Here is how it works:

- `mdfind 'kMDItemContentType == "com.apple.application-*"'` will use the Mac's Spotlight commandline client to search for all available apps.
- `grep '/Applications/'` will filter it down to just your user and system-apps (otherwise you'll also find a lot of stuff scattered around the whole system)
- `sk` will make the list fuzzy-findable, by using [skim](https://github.com/lotabout/skim). By the way you'll need to install it in order to make this work.
- `tr \\n \\0 | xargs -0 open` does some cleanup of the output and then launches the selected app. 

I hope you like it. If you have any suggestions, please let me know on [Twitter](http://twitter.com/toadle).

