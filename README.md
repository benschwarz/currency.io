# currency.io
A offline-capable, html5 currency converter app for the iPhone.  
Visit <http://currency.io> on your iOS/Android phone to try it out.

### Our goal was:
To build a useful, cohesive application for your phone using web standards.

#### Javascript libraries
Everything is built with raw html, css & javascript. We decided against including a library like Zepto or jQuery. With the main browser targets being Android and iOS browsers, we can use `querySelectorAll` and `addEventListener` which covered the basic features that we'd rely on a library for normally. Plus it cuts down on the file size, which is especially important when dealing with mobile.

#### Images
Targeting only modern (mobile) browsers means solid base64 support. So, the majority of images have been base64 encoded and inlined to cut down on requests (see `/public/stylesheets/images.css` & `/public/stylesheets/images-x2.css`). One may note that we used media queries to target older devices with `images.css` and iPhone 4 (retina display) with `images-x2.css`—This saved older devices from downloading high(er) resolution images needlessly. 

#### The app
The app itself is running on Sinatra. It doesn't do anything fancy, it's just there to query and parse current currency rates from Yahoo.
Currencies are pulled over HTTP from Yahoo's Finance services, the interesting aspect of this is that we [used YQL](http://developer.yahoo.com/yql/console/?q=show%20tables&env=store://datatables.org/alltableswithkeys#h=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20%28%27USD%27%2C%20%27AUD%27%29) to do so. 

#### Other notes
We're using an image to do the small drop shadows rather than using `box-shadow`, which turns out to be horrible for mobile browser performance.

We've designed everything using `em`s, which is really useful as this means you can scale everything up by 150% and test it in Chrome or Safari (just be sure to set your user-agent string to iPhone or something supported). Much less hassle than testing directly in the iOS Simulator.

Developing strictly for Android/iOS kicks ass.
* No need for graceful degradation
* querySelector & querySelectorAll
* Native JSON parsing (in iOS 3.2+)
* ApplicationCache & localStorage
* A consistent XMLHttpRequest implementation
* Full CSS3 support — including transitions & animations