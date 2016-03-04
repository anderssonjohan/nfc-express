var nfc = require('nfc').nfc;
var n = new nfc();

var middleware = function (req, res, next) {
    res.sseSetup = function() {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
    };

    res.sseSend = function(eventName, data) {
        res.write( 'event: ' + eventName + '\ndata: ' + JSON.stringify(data) + '\n\n');
    };

    next();
}

var init = function(app) {
    var connections = [];
    var lastUid;

    app.use(middleware);
    app.get('/events', function(req, res) {
        res.sseSetup();
        res.sseSend( 'ping', new Date() );
        connections.push(res);
    });

    n.on('uid', function(uid) {
        console.log('UID:', uid);
        if( lastUid === uid ) {
            return;
        }
        for(var i = 0; i < connections.length; i++) {
            connections[i].sseSend( 'nfcread', { uid: uid });
        }
        lastUid = uid;
        setTimeout(function() { lastUid = null; }, 5000);
    });

    n.start();
};

module.exports = init;