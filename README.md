# nfc-express

Hack to expose UID events from libnfc as stream of [server sent events](https://en.wikipedia.org/wiki/Server-sent_events).

# prerequisites

Obviously an NFC reader! The [ACR122U](http://www.acs.com.hk/en/products/3/acr122u-usb-nfc-reader) is cheap and will work just fine.

# setup for OSX

1. Make sure you have a working XCode installed
2. The OSX SmartCardServices driver will hijack the ACR122U reader as mentioned in [nft-tools/libnfc#316](https://github.com/nfc-tools/libnfc/issues/316). 
   In [my .plist-file](https://gist.github.com/anderssonjohan/4ae8fe09100224ce119c) for SmartCardServices I have the ACR122U reader commented out to solve this.
3. You will need node v0.10.33 (use nvm to install) for the [node-nfc](https://www.npmjs.com/package/nfc) dependency
4. You need libnfc properly installed ```brew install libnfc nfcutils```

# starting the server

```
$ nvm use 0.10.33
$ npm install
$ npm start 

> nfc-proxy@1.0.0 start
> node index.js

Proxy server started. Go to http://localhost:3000/events to see the event stream.

```

Now hit the following command in another terminal:

```
$ curl -v http://localhost:3000/events
* Connected to localhost (127.0.0.1) port 3000 (#0)
> GET /events HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.43.0
> Accept: */*
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: text/event-stream
< Cache-Control: no-cache
< Connection: keep-alive
< Date: Tue, 01 Mar 2016 23:43:11 GMT
< Transfer-Encoding: chunked
<
data: {"uid":null}

```

As soon as you near the reader with a tag, you will see a stream of events like the following ones:

```

data: {"uid":[252,172,15,111]}

data: {"uid":[252,172,15,111]}

data: {"uid":[252,172,15,111]}

...
```

# demo

See https://youtu.be/bPmuwzljdtU for a short video footage of when navigating to the event stream in a browser.
