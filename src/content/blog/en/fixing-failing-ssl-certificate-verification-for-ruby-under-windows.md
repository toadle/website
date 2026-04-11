---
lang: 'en'
title: 'Fixing failing SSL-certificate verification for Ruby under Windows'
description: 'A while ago I wrote a [little piece](/2015/04/16/fixing-failing-ssl-verification-with-rvm.html) that was ment to safe people from the SSL-certificate problems t'
pubDate: '2016-08-23T00:00:00.000+02:00'
---

A while ago I wrote a [little piece](/2015/04/16/fixing-failing-ssl-verification-with-rvm.html) that was ment to safe people from the SSL-certificate problems that might occur using RVM.
For the past year this problem **has not** gone away and still exists today.

Since I just had to fix it on Windows, I thought I'd also about the solution I discovered there. Sadly Windows is a totally different beast regarding Ruby.

## System Requirements

For the following solution I'm assuming that you have installed Ruby using **[RubyInstaller](http://rubyinstaller.org/)** and are using **GitBash** as a command-shell, which comes with the [Standard Windows GIT Installer](https://git-scm.com/download/win). If not I'd suggest you move over to that way of doing things. Otherwise the instructions here will just be hints.

## Error when connecting to SSL or HTTPS-destinations

So the error will appear somewhat like this. I'm running a script here that tries to do some geocoding using Google APIs:

    OpenSSL::SSL::SSLError: SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed

The same script showed no problems on my machine (a Mac/OSX, fixed up with the instructions described in [this article](/2015/04/16/fixing-failing-ssl-verification-with-rvm.html)).

Since I already knew from my hunt for a solution under OSX that the problem must be in the missing **local SSL-certificates** that OpenSSL uses to verify other certificates (e.g. Google's) against.

I couldn't be sure if OpenSSL was even on that colleagues Windows-machine. So I checked that first. **Please note again**: Everything is executed in GitBash, which is why - as under OSX/Linux - you'll always see a `$` at the beginning of the commands:

    $ openssl
    OpenSSL> exit

So OpenSSL is there. Knowing that doesn't make things exactly easy, cause under OSX it is fixable by reinstalling a **locally compiled** Ruby, which uses the correct OpenSSL-installation.

We'll not be able to do that, because there are no build-tools under Windows. So let's first know more about the problem.  

## Still a statically linked OpenSSL installation

Using the famous [ssl-tools/doctor.rb](https://github.com/mislav/ssl-tools) again, I saw this:

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

Little known facts about the RubyInstaller: The guy who compiles it seems to be called `Justin` and we can also see how his local projects are organized.

So we have the problem that our installed Ruby's OpenSSL looks into `C:/Users/Justin/Projects/knap-build/var/knapsack/software/x64-windows/openssl/1.0.1l/ssl/` for those certificates.

At first I tried to copy over my OSX's `cert.pem` and the content of my `ssl/certs`-directory to a folder like `Justin`'s which I created manually. Long story short: That doesn't work. I can't actually tell why. But I suppose that my colleague's user actually can't access that user `Justin`'s folders. Therefore the missing certificates problem stays.

## Solved by finding the correct certificate locations

So if copying over SSL-certificates does not help, I thought there must be certificates installed with **GitBash** since I found out earlier that `openssl` is present in GitBash.

So how to find the correct paths for GitBash's OpenSSL?

    $ which openssl
    /mingw64/bin/openssl

Reveals that `openssl` is actually in `/mingw64/bin/openssl`. The directory-name `mingw64` points to [MinGW](http://mingw.org/) which is what GitBash is based on.

So now where are the certificates exactly? Since Linux-distros typically scatter things around a bit, I was a bit anxious that they would be difficult to find.

They were not.

    $ cd /mingw64/

    user@PC MINGW64 /mingw64
    $ ll
    total 40
    drwxr-xr-x 1 user 197121 0 Aug 18 09:32 bin/
    drwxr-xr-x 1 user 197121 0 Aug 18 09:31 doc/
    drwxr-xr-x 1 user 197121 0 Aug 18 09:32 etc/
    drwxr-xr-x 1 user 197121 0 Aug 18 09:31 lib/
    drwxr-xr-x 1 user 197121 0 Aug 18 09:31 libexec/
    drwxr-xr-x 1 user 197121 0 Aug 18 09:31 share/
    drwxr-xr-x 1 user 197121 0 Aug 18 09:31 ssl/

    user@PC MINGW64 /mingw64
    $ cd ssl/

    user@PC MINGW64 /mingw64/ssl
    $ ll
    total 260
    -rw-r--r-- 1 user 197121 251072 Nov 30  2015 cert.pem
    drwxr-xr-x 1 user 197121      0 Aug 18 09:31 certs/
    -rw-r--r-- 1 user 197121  10835 Mai 10 08:55 openssl.cnf

So here they are. **Lucky punch.**

Now the last thing is to tell Ruby to look into `/mingw64/ssl` without recompiling.

The `doctor.rb` gives the correct hint:

    $ ruby doctor.rb accounts.google.com:443
    C:/Ruby23-x64/bin/ruby (2.3.1-p112)
    OpenSSL 1.0.1l 15 Jan 2015: C:/Users/Justin/Projects/knap-build/var/knapsack/software/x64-windows/openssl/1.0.1l/ssl
    SSL_CERT_DIR=""
    SSL_CERT_FILE=""

So there is actually two variables that we can use to point Ruby the right direction: `SSL_CERT_DIR` and `SSL_CERT_FILE`. **Note to self**: Perhaps even for [this](/2015/04/16/fixing-failing-ssl-verification-with-rvm.html) thiy might be an alternative solution.

Let's do that:

    $ export SSL_CERT_DIR=/mingw64/ssl/certs
    $ export SSL_CERT_FILE=/mingw64/ssl/cert.pem

Then try again:

    $ ruby doctor.rb accounts.google.com:443
    C:/Ruby23-x64/bin/ruby (2.3.1-p112)
    OpenSSL 1.0.1l 15 Jan 2015: C:/Users/Justin/Projects/knap-build/var/knapsack/software/x64-windows/openssl/1.0.1l/ssl
    SSL_CERT_DIR="C:/Users/hanse/AppData/Local/Programs/Git/mingw64/ssl/certs/"
    SSL_CERT_FILE="C:/Users/hanse/AppData/Local/Programs/Git/mingw64/ssl/cert.pem"

    HEAD https://accounts.google.com:443
    OK

Works.

The way we did this up to this point will NOT persist over opening a new shell-window. Meaning you'll have to execute the given commands again, when you open a new shell-window.

Therefore lets add it to our `.profile`-file.

    $ echo "export SSL_CERT_DIR=/mingw64/ssl/certs" >> .profile
    $ echo "export SSL_CERT_FILE=/mingw64/ssl/cert.pem" >> .profile

Problem solved. Carry on please. Nothing to see here.
