import React from 'react';
import '../css/routingView.css';

const patternNaturalDimension = {width:1190.6, height:841.9}

const gloveButtons =  {
                     1:{ startPoint: [935,560] },
                     2:{ startPoint: [265,550] },
                     3:{ startPoint: [286,101] },
                     4:{ startPoint: [286,164] },
                     5:{ startPoint: [286,226] },
                     6:{ startPoint: [213,68]  },
                     7:{ startPoint: [213,139] },
                     8:{ startPoint: [213,211] },
                     9:{ startPoint: [132,101] },
                    10:{ startPoint: [132,164] },
                    11:{ startPoint: [132,226] },
                    12:{ startPoint: [55,165]  },
                    13:{ startPoint: [55,221]  },
                    14:{ startPoint: [55,276]  },
                    15:{ startPoint: [360,75]  },
                    16:{ startPoint: [445,49]  },
                    17:{ startPoint: [525,75]  },
                    18:{ startPoint: [609,144] },
                }

const controller = { pins:{
                            "RX":   {endPoint:[71.528, 10.05 ]}, 
                            "TX":   {endPoint:[53.95,12.455]},
                            "2":    {endPoint:[38.1, 19.845]},
                            "3":    {endPoint:[24.65, 31.335 ]},
                            "4":    {endPoint:[15.145 ,45.957 ]},
                            "GND":  {endPoint:[10.249, 62.65 ]},
                            "VOL":  {endPoint:[10.113,80.163]},
                            "5":    {endPoint:[15.105 ,96.919 ]},
                            "6":    {endPoint:[24.67 ,111.575]},
                            "7":    {endPoint:[37.995,123.05]},
                            "8":    {endPoint:[53.55,131.028]},
                            "9":    {endPoint:[71.45 ,132.628]}, 
                            "10":   {endPoint:[88.837,130.25 ]},
                            "11":   {endPoint:[104.907 ,123.05]},
                            "12":   {endPoint:[118.122 ,111.55]},
                            "13":   {endPoint:[127.645 ,96.855]},
                            "A0":   {endPoint:[132.596,80.213]},
                            "A1":   {endPoint:[132.65 ,62.705]},
                            "A2":   {endPoint:[127.705,45.854]},
                            "A3":   {endPoint:[118.155,31.3]},
                            "A4":   {endPoint:[104.949,19.905]},
                            "A5":   {endPoint:[88.75,12.561]}, 
                      },
                      position: [111,629], //pixel position[x,y] of coordinate 0,0 
                      angle: 90,
                      size: [142, 142]   //pixel size [width, height]
} 

export class RoutingView extends React.Component{

  constructor(props) {  
    super(props);  
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleButtonMapping = this.handleButtonMapping.bind(this);
    this.state = { 
      activeButton: null,
      activePin: null, 
      mappings: {},
      activePins:[]

    };     
  } 

  componentDidMount(){
  }


  componentWillUnmount () {
  }

  placeController(){  
    let top = (controller.position[1]);
    let left = (controller.position[0]);  
    return {top: top, left: left};
  }

  rotateController(){
    let cx =  controller.position[0] + (controller.size[0]/2);
    let cy =  controller.position[1] + (controller.size[1]/2); 
    return `rotate(${controller.angle} ${cx},${cy})`
  }

  roatePoint(pos){
    let angle = controller.angle * Math.PI / 180.0;
    let originX = controller.position[0]+(controller.size[0]/2);
    let originY = controller.position[1]+(controller.size[1]/2);
    let x = pos[0] + controller.position[0];
    let y = pos[1] +controller.position[1]; 


    let cx = Math.cos(angle) * (x-originX) - Math.sin(angle) * (y-originY) + originX;
    let cy = Math.sin(angle) * (x-originX) + Math.cos(angle) * (y-originY) + originY;


    return {x: cx, y:cy}
  }

  rotateCoordinate() {
    let cx =  controller.position[0] + (controller.size[0]/2);
    let cy =  controller.position[1] + (controller.size[1]/2); 
    return `rotate(${controller.angle} ${cx},${cy})`
  }

  handleButtonClick(button) {
    if(this.state.activePin ===null){
      this.setState({activeButton: button});
    }else{ 
      let mappings = this.state.mappings;
      mappings[button] = this.state.activePin; 
      this.setState({mappings: mappings});
      this.setState({activePin: null});
      let pins = []; 
      for(let btn in mappings){ 
        pins.push(mappings[btn]);
      } 
      this.setState({activePins: pins});
    }
  }

  handleButtonMapping(pin) {


    if(this.state.activeButton !== null ){ 
      let mappings = this.state.mappings;
      mappings[this.state.activeButton] = pin; 
      this.setState({mappings: mappings});
      this.setState({activeButton: null});
      let pins = []; 
      for(let btn in mappings){ 
        pins.push(mappings[btn]);
      } 
      this.setState({activePins: pins});
    }else{
      this.setState({activePin: pin});
    }
     
  }

  

 
  render (){
      
      let height = this.props.designer.state.height;
      let width = this.props.designer.state.width;
      console.log(Object.keys(this.state.mappings))
      return(
      <div className="col grid routingViewWrapper">
        <div className="scroll">

          <div className="mainWrapper" style={{width:  "100%" , height:height}}> 
                <svg  width={width}
                      height={height}
                      viewBox={`0 0 ${patternNaturalDimension.width} ${patternNaturalDimension.height}`}>  
                      <image  xlinkHref={require('../img/glovePatternStroke.svg')}  
                              width={patternNaturalDimension.width}
                              height={patternNaturalDimension.height} />

                      <image  xlinkHref={require('../img/lilypad.svg')} 
                              x={this.placeController().left} 
                              y={this.placeController().top}  
                              width={controller.size[0]}
                              height={controller.size[1]}
                              transform={this.rotateController()}
                               />
                       {Object.keys(controller.pins).map(pin => (
                        <React.Fragment key={`pin${pin}`}>
                            
                              <circle id="pin"  
                                      cx={controller.pins[pin].endPoint[0]+controller.position[0]} 
                                      cy={controller.pins[pin].endPoint[1]+controller.position[1]} 
                                      r="5"  
                                      stroke="black" 
                                      strokeWidth="0.5" 
                                      fill={( this.state.activePins.includes(pin) === true || 
                                              this.state.activePin === pin)? "#FF004E": "#17c0b7"} 
                                      className="pin"
                                      transform={this.rotateCoordinate()} 
                                      onClick={() => this.handleButtonMapping(pin)} 
                              /> 
                            
                        </React.Fragment>                          
                        ))}  

                      {Object.keys(this.state.mappings).map(mapping => ( 
                        <React.Fragment key={`line${mapping}`}>
                          <line 
                            x1={gloveButtons[mapping].startPoint[0]} 
                            y1={gloveButtons[mapping].startPoint[1]} 
                            x2={this.roatePoint(controller.pins[this.state.mappings[mapping]].endPoint).x} 
                            y2={this.roatePoint(controller.pins[this.state.mappings[mapping]].endPoint).y} 
                            stroke="black" 
                            strokeDasharray="4"
                            strokeWidth="1"
                            className="line" 
                            strokeLinecap="round"
                            />
                        </React.Fragment>
                      ))} 


                      {this.props.designer.state.activeSensors.map(button => ( 
                        <React.Fragment key={button}>
                          <circle id="button" 
                                  ref={`sensor${button}`}
                                  cx={gloveButtons[button].startPoint[0]} 
                                  cy={gloveButtons[button].startPoint[1]} 
                                  r={this.state.activeButton === button ? "15":"5"} 
                                  stroke="black" 
                                  strokeWidth="0.5" 
                                  fill={(Object.keys(this.state.mappings).includes(button.toString()) === true ||
                                                     this.state.activeButton === button) ? "#FF004E": "#17c0b7"}
                                  onClick={() => this.handleButtonClick(button)} 
                                  className="sensorBtn"
                          />
                        </React.Fragment>
                      ))} 
                     
                </svg>  
             
          </div>
        </div> 
      </div>
      );
  }
}