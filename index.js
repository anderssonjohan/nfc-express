var express   = require('express'),
httpProxy = require('http-proxy'),
app       = express(),
nfc       = require('./nfc');

var proxy = new httpProxy.createProxyServer( {} );

function apiProxy(target) {
    return function(req, res, next) {
        delete req.headers.host;
        proxy.proxyRequest(req, res, { target: target });
    }
}

nfc(app);
// Point to your webapp backend of choice that will utilize the /events stream in the browser.
app.use(apiProxy('http://localhost:3001'));

app.listen(3000, function() {
    console.log('Proxy server started. Go to http://localhost:3000/events to see the event stream.');
});

module.exports = app;