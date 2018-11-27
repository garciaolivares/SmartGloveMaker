import React from 'react'; 
import {Glove} from './Glove';
import '../css/carousel.css';  
const io = require('socket.io-client');
let moment = require('moment');  

export class DeviceConnection extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      connected: true,
      port: null,
      gesture:[],
      flow: 1,     
      isRecording:  {status: false, gesture: ""}
    }; 
    this.lastInput = {   timestamp: moment(),
                          value: 0
                }; 
          
    this.gesture=[]; 
    this.socket = io.connect('http://localhost:8080');
    
    this.handleConnection = this.handleConnection.bind(this);
    this.handleRequestList = this.handleRequestList.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
  }

  componentDidMount(){ 
    let component = this;  
    this.openSerialPort();
    
    this.socket.on( 'connect', function () {
        console.log( 'connected to server' );
        component.socket.emit('devicesList',null); 
    } );

    this.socket.on('close', () => {
      console.log('Lost connection to device.');
    }); 

    this.socket.on('data', (data) => {
      this.parseGesture(new TextDecoder("utf-8").decode(data));
    });  

    this.socket.on('devices', (devicesList) => {
        this.setState({devices:devicesList});   
    }); 

     this.socket.on('connect_error', function(){
          console.log("Error");
          component.socket.disconnect( true );
    }); 
  }

  openSerialPort(){ 
    this.socket.connect('http://localhost:8080'); 
  }


  componentWillUnmount(){  
    this.closeSerialPort(); 
  }

  closeSerialPort(){ 
    this.socket.emit('connection', null,false);
    this.socket.disconnect( true );
   
  }

  handleConnection = portName => e => {  
    this.socket.emit('connection',portName,true);
    this.setState({flow:2});  
  };

  parseGesture(sensorInput){
    let component = this;
    let validInputs=["2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18"];
    
    let input = sensorInput.trim();  
    let ms = moment(moment(),"X").diff(moment(component.lastInput.timestamp,"X"));
    let expiration = moment.duration(ms);  

    if(expiration > 900){
      component.lastInput.value=0; 
      component.gesture=[];
    }   

    if(validInputs.includes(input) && component.lastInput.value !== input){ 
      component.lastInput.value = input;
      component.lastInput.timestamp = moment();
      component.gesture.push(parseInt(component.lastInput.value,10)); 
      component.refs.glove.setState({inputGesture:component.reduceNoice(component.gesture)});
      if(expiration < 900){
         clearTimeout(this.timeOut);
      }

      this.timeOut = setTimeout(function(){  
        let inputGesture = component.refs.glove.state.inputGesture;
        if(component.state.isRecording.status === true){

          switch(component.state.isRecording.gesture){
              case "gesturePlay": component.refs.glove.setState({gesturePlay: inputGesture});
                                break;
              case "gesturePrev": component.refs.glove.setState({gesturePrev: inputGesture});
                                break;
              case "gestureNext": component.refs.glove.setState({gestureNext: inputGesture});
                                break;
              default:
          }
          component.refs.glove.refs.correct.play();
          component.setState({isRecording:{status: false, gesture: ""}});  
        }else if(component.state.flow===3){
              component.refs.glove.identifyGesture();
        }   
        
        component.refs.glove.setState({inputGesture:[]});
        component.gesture = []; 
      },900); 
    } 
  } 


  reduceNoice(gesture){
    let noice = gesture.toString();

    noice = noice.replace("13,3,13", "13");
    noice = noice.replace("13,3", "13");
    noice = noice.replace("3,13", "13");
    noice = noice.replace("12,2,12", "12");
    noice = noice.replace("12,2", "12");
    noice = noice.replace("2,12", "12");
    noice = noice.replace("12,13,11,13,11,13", "12,13,11");
    
    noice = noice.replace("6,7,5,7", "6,5,7");
    noice = noice.replace("7,5,7,6", "7,5,6");
    noice = noice.replace("6,5,7,5,7,5", "6,5,7");
    noice = noice ==="6,7"? "6,5,7":noice; 
    noice = noice ==="7,6"? "7,5,6":noice;  

    return noice.split(",").map(Number);
  } 


  handleRequestList(){ 
    this.openSerialPort();
    
  }


  handleNextClick(){ 
    if(this.state.flow<3){ 
      this.setState({ flow:  this.state.flow + 1 });  
    }  
  }
  
  handleBackClick() { 
    if(this.state.flow>1){ 
      this.setState({ flow:  this.state.flow - 1 }); 
    } 
    else if(this.state.flow === 1){
      this.props.wizard.setState({step:3});
    } 
  } 

  render() {   
    return (
      <div  id="step-glove"   className="col pad-30-h panel" >  
        <div className="row frame toolBar" style={{height: "57px"}}>  
                <div className="col-3"> 
                  <a className="navButton back" onClick={this.handleBackClick} >
                        <img  alt="Step Before" src={require('../img/arrow.svg')}/>
                  </a>
                  <div className="flowLabel">
                    <span>
                      {this.state.flow === 1?   "Build Glove":
                        this.state.flow === 2?  "Select Decive":
                                                "Record Gestures"
                      }   
                    </span>
                  </div>
                </div>
                <div className="col-6" >
                  <div className="mainTitle">
                      <div className="title">
                                          {this.state.flow === 1? "Select Your Device":
                                           this.state.flow === 2? "Record Gestures":
                                                                  "Test Glove"
                                          }                    
                                        </div>            
                  </div>
                </div>
                <div className="col-3" hidden={this.state.flow === 1? true:false}> 
                  <a hidden={this.state.flow === 3? true:false} ref="nextBtn" className="navButton next " onClick={this.handleNextClick} >
                      <img  alt="Step Before" src={require('../img/arrowNext.svg')}/>
                  </a>  
                  <div className="flowLabel right">
                     <span>
                       {this.state.flow === 1?   "Record Gestures":
                         this.state.flow === 2?  "Test Glove":
                                                 ""
                       }
                     </span>
                  </div>
                </div> 
        </div>

        <div className="row"  id="gridWrapper">
          {  this.state.flow === 1? 
              <ConnectDevice  deviceInputReader={this}/>: <Glove ref="glove" deviceInputReader={this}/>   
          } 
        </div>   
      </div>
    );
  }
}



export class ConnectDevice extends React.Component{

  render(){
    return(
        <div className="col h-100">
          <div className={"h-100"}> 
            <div  ref="stepGlove"  className={"row h-100 panel"}>  
              <div ref="deviceWrapper" className="col-12 h-100">
                <div className="row h-100 ">
                  <div className="col-sm-6 offset-sm-3 col-lg-4 offset-lg-4 frame devices"> 
                    <div className="row" style={{height: "100%"}}> 
                      {Object.keys(this.props.deviceInputReader.state.devices).length>0?
                        <div style={{    width: "100%"}}>
                          <div className={(this.props.deviceInputReader.state.devices.length===0)?"hidden":" col-12"} style={{padding:"15px 0", height: "calc(100% - 90px)"}}>
                            <img className="vector-responsive" src={require("../img/glove.png")} alt="" style={{width:"100%"}}/>
                          </div>
                          <div className="col-12 scroll" style={{padding:"0 15px"}}>
                             {this.props.deviceInputReader.state.devices.map(item => ( 
                                <React.Fragment key={item}> 
                                    <div className="row">
                                      <div className="col">
                                        <span><b>CONNECT DEVICE:</b></span>
                                        <div className="device deviceBtn" >
                                         <a onClick={this.props.deviceInputReader.handleConnection(item.comName)}>{item.comName}</a>  
                                        </div>
                                      </div>
                                   </div>
                                </React.Fragment>
                              ))}  
                          </div> 
                        </div>
                      : <div className="col-12 noDevice h-100" >
                          <div className="contentInfo">
                            <p><b>NO DEVICE FOUND</b></p>
                            <p><i>Make sure that your smart glove is connected to the computer</i></p>
                            <br/>
                            <div className="deviceBtn" >
                              <a onClick={this.props.deviceInputReader.handleRequestList}>REFRESH DEVICE LIST</a>  
                            </div> 
                          </div>
                        </div>
                      } 
                    </div>
                  </div>
                </div> 
              </div>    
            </div>
          </div>
        </div>
    );
  }
}
