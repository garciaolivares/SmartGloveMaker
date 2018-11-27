 
 // Initialize application constants
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const tcpPort = 8080;

const SerialPort = require('serialport');
const Readline  = require('parser-readline'); 




/* ===========================================
*
* Setup a simple server.
*
=========================================== */

app.get('/', (req, res) => {
  res.sendfile('index.html');
}); 

http.listen(tcpPort, () => {
  console.log(`listening on http://localhost:${tcpPort}`);
});

/* ===========================================
*
*  Socket.io stuff
*
=========================================== */

io.on('connection', (socket) => {
  let portBinding = null;
  

  socket.on('devicesList', () => {
    SerialPort.list().then(function(ports){
      let devices= [];
      ports.forEach(function(port) {
        let device = {  comName:  port.comName,
                        pnpId: port.pnpId, 
                        manufacturer: port.manufacturer
                      }
        devices.push(device);
      }); 
       socket.emit('devices',devices); 
    });
  });

  socket.on('connection', (port, state) => {

    if(state && port !== null){
      portBinding = new SerialPort(port, {
        baudRate: 57600
      });  

      portBinding.on('open', () => {
        console.log('Port is open!');
        portBinding.pipe(new Readline({ delimiter: '\r\n' }));
      });

      portBinding.on('data', (data) => {
        io.sockets.emit('data', data);
      });

      portBinding.on('close', () => {
        console.log('Serial port disconnected.'); 
        io.sockets.emit('close');
      });
    }else{
      if(portBinding !== null){
        socket.disconnect(true); 
      }
    } 

  });


 

 

});



/* ===========================================
*
* Serialport stuff
*
=========================================== */

/**
 * listen to the bytes as they are parsed from the parser.
 */

 
 



