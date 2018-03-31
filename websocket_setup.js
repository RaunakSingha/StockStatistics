/**
 * Create Websocket server.
 */

var request_json = require("request");
var ws_server = require('ws').Server;
var wsport = '8000';
var ws = new ws_server({port: wsport});

ws.on('connection', function(w){
    console.log("Websocket server is live");
    w.on('message', function(msg){
        console.log('message from client: '+ msg);

        request_json.get("https://www.quandl.com/api/v3/datasets/NSE/"+msg+".json?api_key=MX4zkypoSjUzp8CyotQg", function(error, response, body) {
            if(error) {
                return console.dir(error);
            }
            console.dir(JSON.parse(body));
            w.send(body);
        });
    });

    w.on('close', function() {
        console.log('closing connection');
    });

});