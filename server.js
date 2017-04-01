
// *** Initializing  Mosca Server
var mosca = require('mosca');

var ascoltatore = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://mongo:27017/mqtt',
  pubsubCollection: 'dewee',
  mongo: {}
};

var settings = {
  port: 1883,
  backend: ascoltatore
};

var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);

});

// fired when a message is received
server.on('published', function(packet, client) {
  console.log('Published', packet.payload);
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');

}

function delayed_off() {

      var message = {
      topic: 'cmnd/sonoff/POWER',
      payload: 'off', // or a Buffer
      qos: 0, // 0, 1, or 2
      retain: false // or true
      };
      server.publish(message, function() {
      console.log('done!');
      });
}

// *** API routing
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var router = express.Router();
  
var path = __dirname + '/views/';
  

app.use(express.static('public'))

// parse html forms
app.use(bodyParser.urlencoded({ extended : false }));
  
app.get('/',function(req, res){
  res.sendFile(path + 'index2.html');
});
 
app.post('/valveon', function (req, res) {
      var message = {
      topic: 'cmnd/sonoff/POWER',
      payload: 'on', // or a Buffer
      qos: 0, // 0, 1, or 2
      retain: false // or true
      };
      server.publish(message, function() {
      console.log('done!');
      });
setTimeout(delayed_off, 3000);
  res.redirect('/');
});

app.post('/valveoff', function (req, res) {
      var message = {
      topic: 'cmnd/sonoff/POWER',
      payload: 'off', // or a Buffer
      qos: 0, // 0, 1, or 2
      retain: false // or true
      };
      server.publish(message, function() {
      console.log('done!');
      });
  res.redirect('/');
});


app.listen(8080);
