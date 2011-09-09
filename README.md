# currency.io
A offline-capable, html5 currency converter app for the iPhone.  
Visit <http://currency.io> on your iOS/Android phone to try it out.

### Goals
To build a useful, cohesive application for your phone using web standards.

### Javascript libraries
Everything is built with raw html, css & javascript. We have decided against including a library like Zepto or jQuery. With the main browser targets being Android and iOS browsers, we can use querySelectorAll and addEventListener which covers most of what a library gives us anyway. Plus it cuts down on the filesize, which is especially important when dealing with mobile.

### Images
Modern browsers means solid base64 support. So, the majority of images have been base64 encoded and inlined to cut down on requests (see `/public/stylesheets/images.css` & `/public/stylesheets/images-x2.css`).

### The app
The app itself is running on Sinatra. It doesn't do anything fancy, it's just there to query and parse current currency rates from Yahoo. If you haven't used Sinatra before, you can find all the markup within the `/views` folder, with each chunk of markup wrapped by `layout.erb`.

### Other notes
We're using an image to do the small drop shadows rather than using `box-shadow`, which turns out to be horrible for mobile browser performance.

We've designed everything using `em`s, which is really useful as this means you can scale everything up by 150% and test it in Chrome or Safari. Much less hassle than testing directly in the iOS Simulator.

Developing strictly for Android/iOS kicks ass.
- No need for graceful degradation
- querySelector & querySelectorAll
- Native JSON parsing (in iOS 3.2+)
- ApplicationCache & localStorage
- A consistent XMLHttpRequest implementation
- Full CSS3 support — including transitions & animations