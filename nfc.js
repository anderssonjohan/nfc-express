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

    res.sseSend = function(data) {
        res.write('data: ' + JSON.stringify(data) + '\n\n');
    };

    next();
}

var init = function(app) {
    var tagData = { uid: null };
    var connections = [];

    app.use(middleware);
    app.get('/events', function(req, res) {
        res.sseSetup();
        res.sseSend(tagData);
        connections.push(res);
    });

    n.on('uid', function(uid) {
        console.log('UID:', uid);
        tagData.uid = uid;
        for(var i = 0; i < connections.length; i++) {
            connections[i].sseSend(tagData);
        }
    });

    n.start();
};

module.exports = init;