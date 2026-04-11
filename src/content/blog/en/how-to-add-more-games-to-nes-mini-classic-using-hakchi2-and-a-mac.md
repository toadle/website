---
lang: 'en'
title: 'How to add more games to NES Mini Classic using hakchi2 and a Mac'
description: 'The [NES Mini Classic](http://bit.ly/nesminiclassic) is a wonderful little box. It captures most of the **old gaming feeling** by putting you close to the scree'
pubDate: '2017-02-03T00:00:00.000+02:00'
heroImage: '../../../assets/blog/legacy/how-to-add-more-games-to-nes-mini-classic-using-hakchi2-and-a-mac-1cda43de.jpg'
---

The [NES Mini Classic](http://bit.ly/nesminiclassic) is a wonderful little box. It captures most of the **old gaming feeling** by putting you close to the screen and giving you authentic feeling controllers. That all while displaying everything in a modern fashion on a up-to-date HDMI-capable device or TV.
Also part of the thrill is that it gives you all that good old classic games in it’s 30 game line-up so that you can play everything that you loved during the 90s. **Everything? Just barely.**

There might be some games missing that you’d like to see on the NES Mini Classic and that is probably why from it’s launch everybody has looked for a way to add more games. For example I’m missing *Nintendo World Cup* that I own on my real NES, but not on my NES Mini Classic. There might be other games. IGN has a great [list](http://www.ign.com/lists/top-100-nes-games/41).

Not to long ago [hakchi](https://github.com/madmonkey1907/hakchi "hakchi") came to the rescue offering a first way to add games. It did the job even on multiple platforms like Windows, Mac and Ubuntu, but you had to compile it yourself, which didn’t work out for me.

Along came [hakchi2](https://github.com/ClusterM/hakchi2) with much better usability but with the big downside for Mac-user like myself that **it only works on Windows**. So since it’s release I was trying to find a way on **how to do it on a Mac**. After figuring it out it’s not that difficult and also it’s **FREE** even if you don’t own Windows.

**DISCLAIMER:**
So the way [hakchi2](https://github.com/ClusterM/hakchi2) actually works is that it’ll completely replace the firmware/storage of your NES Mini Classic. This means copying everything off there. Then modifying it. Then copying everything back again - overwriting the whole system. If - during this process - something goes wrong your Mini might not come back to life. I’ve read about people who this happened to, and they still could flash back the original system. But you never know.

You love retro-games that is why you read this. So you also know that even the NES games are **copyrighted and must not be used for free**. Only put games on your NES Mini that you legally own.

![nesminiclassic](//images.contentful.com/zbv7lbwbpya6/1NsmttTJdK0AkYIQqAgyU4/8358c82dbcb59303729b777f95a994a7/nesminiclassic.jpg)

## Everything you’ll need for this
- The [latest binary release of hakchi2](https://github.com/ClusterM/hakchi2/releases)
- [VirtualBox for Mac](https://www.virtualbox.org/) (I used version 5.1.14 for OSX hosts)
- The [VirtualBox Extension Pack](https://www.virtualbox.org/wiki/Downloads) (click on `All supported platforms`)
- A Microsoft Windows Virtual Machine image for VirtualBox which you can find [here](https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/) for testing purposes (I used the `Microsoft Edge Win 10 Stable`). This will run for 90 days. You can use snapshots to extend this time. Microsoft even recommends this in the background wallpaper.
- About 20GB of space on your Mac
- Your trusty NES Mini Classic (mine is a China produced model named `MOD. CLV-001` on the back) with it’s USB-cable. Controllers are not needed for this.

## Quick version
- Get **VirtualBox** up and running.
- Install **expansion pack**.
- Add **Windows** virtual machine.
- Activate **USB-support** for it.
- Fire it up.
- Startup `hakchi2`.
- Let Windows install **.NET Framework** on the way.
- USB-**Connect NES mini** to your Mac.
- Power-On NES Mini while holding RESET.
- Install **NES Mini driver** from `hakchi2`.
- Dump kernel.
- Use [video](https://www.youtube.com/watch?v=33_dE9CqN_I) to learn about `hakchi2`.

## Detailed version
- Install VirtualBox normally by using the installer (my file was called `VirtualBox-5.1.14-112924-OSX`)
- Next launch VirtualBox
- When it has started up successfully get that file which you download as the VirtualBox Extension Pack and double-click it (for me it was named `Oracle_VM_VirtualBox_Extension_Pack-5.1.14-112924.vbox-extpack`)
	We need this extensions-pack cause VirtualBox does not ship with USB-support. This gets added by the extensions-pack. Since we’ll later connect that NES Mini via USB this must be installed.
- Click „Install“, Accept the license agreement. It should succeed. Now we’ll install the Windows Virtual Machine.
- Unpack the virtual machine you downloaded from Microsoft from the ZIP-file. My file was named `MSEdge.Win10_RS1.VirtualBox.zip` and gave me just one resulting file named `MSEdge - Win10_preview.ova`
- Double-click `MSEdge - Win10_preview.ova`.
- VirtualBox should now present you with the configuration for that virtual machine. Accept those settings as they are and click *„Import“*
- The import will take some time
- After the import is finished the virtual machine will be visible in VirtualBox. You’ll notice in the right panel under *„USB“* it’ll say *„Deactivated“*. We’ll have to change that.
- Click on „Settings“ in the Toolbar. Goto to *„Ports“ -> „USB“*. Activate the USB-Controller and select `USB-2.0-Controller (EHCI)``. The others might also work. I haven’t tried them.
- Now „Start“ the virtual machine.
- After the virtual machine has started VirtualBox’s guest tools might prompt you with a notification that they are outdated. Didn’t matter for me. But you can go *"Devices" -> "Insert Guest Additions CD Image…"* and update them. If you do, reboot afterwards.
- Now download [hakchi2](https://github.com/ClusterM/hakchi2/releases) and unpack it.
- Double-click that `hakchi.exe`. Windows should prompt you that you need the .NET Framework 3.5 to use this application. Press *"Download and install this feature"*. Wait until finished.
- Close the window
- Double-click that `hakchi.exe` again. It should start up fine now.
- Now connect your NES Mini Classic via USB-cable to any USB-port of your Mac.
- Power it up while holding the RESET-button. Let go off RESET. The NES Mini’s red LED will not light up.
- From VirtualBox’ bottom right icon-lineup click on the one that looks like an USB-cable. Select the `Onda (unverified) V972 tablet in flashing mode`.
- Windows should automatically start up a device install (look for the icon in your startbar). Wait until finished. Might take some time.
- Back in *hakchi2* select *"Kernel -> Dump kernel"*.
- A popup should appear that says *„Waiting for NES Mini…“* followed by some steps. Click the *„Install driver“*-button. Accept the warning.
- A black window appears. Wait until a message appears that says something like *„Press ENTER to close“*.
- Press ENTER to close.
- The kernel dump should start.
- *hakchi2* is ready to use.

If you need more info on how to use *hakchi2* watch this [video](https://www.youtube.com/watch?v=33_dE9CqN_I).

And that is how to use *hakchi2* on a Mac for *FREE*.

