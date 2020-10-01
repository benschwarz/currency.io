# 𝙘𝙪𝙧𝙧𝙚𝙣𝙘𝙮.𝙞𝙤
An offline-capable, html5 currency converter app for the iPhone.  
Visit <http://currency.io> on your iOS/Android phone to try it out.

### 𝙊𝙪𝙧 𝙜𝙤𝙖𝙡 𝙬𝙖𝙨:
To build a useful, cohesive application for your phone using web standards.

#### 𝙅𝙖𝙫𝙖𝙨𝙘𝙧𝙞𝙥𝙩 𝙡𝙞𝙗𝙧𝙖𝙧𝙞𝙚𝙨 𝙪𝙨𝙚𝙙
We decided against including a library like Zepto or jQuery, so everything is built with raw javascript. With the main browser targets being Android and iOS browsers, we can use `querySelectorAll` and `addEventListener` which covers the basic features we'd usually rely on a library for. Plus it cuts down on filesize, which matters when dealing with mobile.

#### 𝙄𝙢𝙖𝙜𝙚𝙨
Targeting only modern (mobile) browsers means solid base64 support. The majority of images have been base64 encoded and inlined to cut down on requests (see `/public/stylesheets/images.css` & `/public/stylesheets/images-x2.css`). We used media queries to target older devices with `images.css` and iPhone 4 (retina display) with `images-x2.css` — this saved older devices from downloading high(er) resolution images needlessly. 

#### 𝙏𝙝𝙚 𝙖𝙥𝙥
The app is running on Sinatra. It doesn't do anything fancy, it's just there to query, parse and cache current currency rates from Yahoo.
Currencies are pulled over HTTP from Yahoo's Finance services [using YQL](http://developer.yahoo.com/yql/console/?q=show%20tables&env=store://datatables.org/alltableswithkeys#h=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20%28%27USD%27%2C%20%27AUD%27%29).

#### 𝙊𝙩𝙝𝙚𝙧 𝙣𝙤𝙩𝙚𝙨
We're using an image to do the drop shadows rather than `box-shadow`, which turns out to be horrible for performance.

The whole layout has been designed using `em`s, which means everything can be scaled up 150% for testing in Chrome or Safari (with a user-agent string set to 'iPhone'). Much less hassle than testing directly in the iOS Simulator.

Developing for modern browsers is so much less hassle.

* No need for graceful degradation
* querySelector & querySelectorAll
* Native JSON parsing (in iOS 3.2+)
* ApplicationCache & localStorage
* A consistent XMLHttpRequest implementation
* Reliable CSS3 support — including transitions & animations
