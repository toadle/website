---
lang: 'en'
title: 'Fixing failing SSL-certificate verification with RVM/OSX'
description: 'Ruby installed with RVM under OSX gives you and error OpenSSL::SSL::SSLError which stops you from connecting to any kind os SSL-secured destination. Here is how to fix it.'
pubDate: '2015-04-16T00:00:00.000+02:00'
alternateLanguageUrl: '/de/blog/ssl-zertifikat-fehler-rvm-osx-beheben/'
---

I just returned from a world of hate and am going to tell you my war story, in order to spare you the trip.

Just this morning when starting to work on some ruby-code again I tried executing a `rake` task that in the process does a **simple HTTPS-connection** to a Google-Service.

## Error

This suddenly returned a very strange error like this:

    OpenSSL::SSL::SSLError: SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed

Trying the same on machines of two co-workers didn’t show any problems.

Basically this tells you that the certificate-chain for the HTTPS-connection can not be verified. In normal people’s words this means that ruby is not able to do some security-magic that in the process it uses **locally installed root-certificates** for.

## Reason

In trying to fix this issue I tried several things ranging from

- *reinstalling* `rvm` (which I use to handle multiple rubies and gems on my machine)
- to *reinstalling* `brew` the OS X package-manager.

No good.

Then while googling the problem I came across a great script called [ssl-tools/doctor.rb](https://github.com/mislav/ssl-tools) which finally pointed me into the correct direction.

The script analyzes SSL-problems with ruby and gives a bit more verbose errors than the simple exception. This turned up like this:

    ruby doctor.rb accounts.google.com:443
    /Users/tim/.rvm/rubies/ruby-2.2.1/bin/ruby (2.2.1-p85)
    OpenSSL 1.0.1j 15 Oct 2014: /etc/openssl
    SSL_CERT_DIR=„“
    SSL_CERT_FILE=„“

    HEAD https://accounts.google.com:443
    OpenSSL::SSL::SSLError: SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed

    The server presented a certificate that could not be verified:
      subject: /C=US/O=GeoTrust Inc./CN=GeoTrust Global CA
      issuer: /C=US/O=Equifax/OU=Equifax Secure Certificate Authority
      error code 20: unable to get local issuer certificate

    Possible causes:
      `/etc/openssl/certs/‚ is empty

So it seems that there are no **certificates** present in `/etc/openssl/certs` which turned out to be correct. Nothing was present.

Question is **why** the heck is it even looking here?
When you installed `openssl` using `brew` your installation should reside in `/usr/local/bin/openssl`. The corresponding certificates therefore are in `/usr/local/etc/openssl/certs`.

During further desperate attempts I completely uninstalled `rvm` and was back on plain old `ruby-2.0` with comes preinstalled with OS X. Suddenly it worked:

    ruby doctor.rb accounts.google.com:443
    /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/bin/ruby (2.0.0-p481)
    OpenSSL 0.9.8za 5 Jun 2014: /System/Library/OpenSSL
    SSL_CERT_DIR=""
    SSL_CERT_FILE=""

    HEAD https://accounts.google.com:443
    warning: will not be able show failed certificate info on OS X's OpenSSL
    OK

## Solution

So the rvm-installed ruby does look into the wrong directory for certificates whereas the OSX-ruby will look into the correct one. In it's case that is a OSX system-directory.

**So the rvm-installed ruby is the problem.**

This [discussion on Github](https://github.com/rvm/rvm/issues/3330) finally gave the solution: Somehow RVM comes with a precompiled version of ruby that is statically linked against an openssl that looks into `/etc/openssl` for it's certificates.

What you wanna do is **NOT TO USE** any of the precompiled rubies and rather have ruby compiled on your local machine, like so: `rvm install 2.2.0 --disable-binary`

This will take longer but is worth it:

    ruby doctor.rb accounts.google.com:443
    /Users/tim/.rvm/rubies/ruby-2.2.0/bin/ruby (2.2.0-p0)
    OpenSSL 1.0.2a 19 Mar 2015: /usr/local/etc/openssl
    SSL_CERT_DIR=""
    SSL_CERT_FILE=""

    HEAD https://accounts.google.com:443
    OK

Happy times.

**Update 2016-08-23**: I wrote about how to fix [this problem under Windows](/2016/08/23/fixing-failing-ssl-verification-windows.html).

**Update 2016-11-16**: Several people have mentioned that this problem still persists even in OSX Yosemite, OSX El Capitan, OSX Sierra and also macOS. This solution still works with all of them. But another way is to switch over to [rbenv](https://github.com/rbenv/rbenv) instead of RVM. Which is what I did in the meantime.
