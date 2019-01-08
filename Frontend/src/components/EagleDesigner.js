import React from 'react'; 
import {SensorView} from './SensorView';
import {RoutingView} from './RoutingView';
import {Download} from './Download';  

export class Designer extends React.Component{
  constructor(props) {  
    super(props); 
    this.state = {   
      height: 0,
      width:0,
      isFlipped:false, 
      flow: 1,
      modalOpen: false,
      warning:"",
      activeSensors: [1,2], 
      mappings: {},
      wires:[],
      buttonsPosition:[]
      
    }; 
      this.handleBackClick = this.handleBackClick.bind(this);
      this.handleNextClick = this.handleNextClick.bind(this); 
  } 

  componentWillUnmount () {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  componentDidMount(){  
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    let container = document.getElementById("gridWrapper");   
    let height = container.clientHeight;
    let width = container.clientWidth;
    this.setState({height:height, width:width});  
  }

  navPrev(){ 
    return (
      <a className="navButton back " onClick={this.handleBackClick} >
              <img  alt="Step Before" src={require('../img/arrow.svg')}/>
        </a>
      );
  }

  navNext(){  
    return (
      <span>
        <span ref="popOver" className={(this.state.modalOpen===false)? "popOver hidden": "popOver shake"} >
          <p>{this.state.warning}</p>
          <span className="pointer"></span>
        </span>  
        <a ref="nextBtn" className={"navButton next"} onClick={this.handleNextClick} >
            <img  alt="Step Before" src={require('../img/arrowNext.svg')}/>
        </a>   
      </span> 
      );
  }

  handleBackClick() { 
    if(this.state.flow>1){ 
      this.setState({ flow:  this.state.flow - 1 }); 
    } 
    else if(this.state.flow === 1){
      this.props.wizard.setState({step:1});
    } 
  }  

  handleNextClick(){
    switch(this.state.flow){
      case 1:   if(this.state.activeSensors.length===2){
                  this.setState({warning: "Choose at least one button"});
                  this.refs.popOver.classList.add("shake");
                  this.setState({modalOpen: true});
                  let component = this;
                  setTimeout(function(){
                    try {
                        component.refs.popOver.classList.remove("shake");
                    }
                    catch(err) {

                    }  
                  },1000);
                  return;
                } 
                break;

      case 3:   this.props.wizard.setState({step:3});

                return;
      default:  
    } 

    this.setState({modalOpen: false}); 
    if(this.state.flow<3){ 
      this.setState({ flow:  this.state.flow + 1 }); 
    }  
  } 

  render() { 
    return (
      <div  id="step-sensors" ref="stepSensors" className="col pad-30-h panel">         
        <div className="row frame toolBar" style={{height: "57px"}}>  
                <div className="col">
                  {this.navPrev()}
                  <div className="flowLabel">
                    <span>
                      {this.state.flow === 1?   "Home":
                        this.state.flow === 2?  "Choose Buttons":
                                                "Connect Buttons to Pins"
                      } 
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="title">
                    {this.state.flow === 1? "Choose Buttons":
                     this.state.flow === 2? "Connect Buttons to Pins":
                                            "Embroidery Files" 
                    }                    
                  </div>
                </div>
                <div className="col"> 
                  {this.navNext()}
                  <div className="flowLabel right">
                     <span>{
                      this.state.flow === 1? "Connect Buttons to Pins":
                      this.state.flow === 2? "Embroidery Files": "Build Glove"
                      }
                    </span>
                  </div>
                </div> 
        </div>

        <div className={"row "+(this.state.flow !== 3? "frame":"")}  id="gridWrapper">
            {this.state.flow === 1? 
            <SensorView wizard={this.props.wizard}  designer={this}/>:
            this.state.flow === 2?
            <RoutingView wizard={this.props.wizard} ref="wiring" designer={this} />:
            <Download designer={this}/>
           } 
        </div>   
      </div> 
      );
  }  
}




