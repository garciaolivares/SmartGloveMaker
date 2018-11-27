import React from 'react';
import '../css/sensorView.css'; 

class ToogleSensor extends React.Component{ 
  constructor (props) {
    super(props)
    this.state = {	 isAdded: this.props.selected};  
    this.handleClick = this.handleClick.bind(this); 
}
  handleClick() {  
    this.setState(prevState => ({
      isAdded: !prevState.isAdded
    })); 

    let sensors = this.props.designer.state.activeSensors;
    //let sensor = document.getElementById("sensor"+this.props.sensorId);
    if(this.state.isAdded === false){
    	sensors.push(this.props.sensorId);
    	//sensor.setAttribute("fill","#17C0B7");
    }else{
    	//sensor.setAttribute("fill","#FFFFFF");
    	for(let i = 0; i<sensors.length; i++){
    		if(sensors[i]=== this.props.sensorId){
    			sensors.splice(i, 1);
    		}
    	}
    }
    this.props.designer.setState({activeSensors:sensors});
    if(this.props.designer.state.modalOpen=== true){
      this.props.designer.setState({modalOpen:false});
    } 
  } 
   
  render () { 
	let img;
	(this.state.isAdded === false)? 
		img = require("../img/addSensor.svg"): 
		img = require("../img/removeSensor.svg");

	let style={
		left: this.props.left,
		top: this.props.top
	}
	
    return (
	  	<a  className="addSensor"  style={style} onClick={this.handleClick}>  
	  		<img id={"btn"+this.props.sensorId} alt="add Sensor" className="img-fluid" src={img}/> 
	  	</a>
    )
  }
} 


class FlipHand extends React.Component{
  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() { 
    this.props.view.startTimer();
  } 

  render(){ 
    return( 
      <div className="flippingControl" style={{opacity: (this.props.view.state.animationCount === 1 || this.props.view.state.animationCount === 24? 1:0)}}> 
      	<svg 
      		onClick={this.handleClick} 
      		viewBox="0 0 147.78 125.53" style={{height:this.props.height/3}} 
      		onTouchStart={e => this.props.view.handleTouchStart(e)}
      		onTouchMove={e => this.props.view.handleTouchMove(e)}
      		onTouchEnd={e => this.props.view.handleTouchEnd(e)}
      		onMouseDown={e => this.props.view.handleMouseDown(e)} 
      		onMouseUp={e => this.props.view.handleMouseUp(e)} 
      	> 
      		<path d="M119,40.78a38.88,38.88,0,0,1,7.53,5,18.29,18.29,0,0,1,5.38,7.27,10.21,10.21,0,0,1,.61,4.54,11.14,11.14,0,0,1-1.4,4.38,21,21,0,0,1-6.32,6.56,67,67,0,0,1-16.38,7.81,133.5,133.5,0,0,1-17.59,4.44,221.73,221.73,0,0,1-36.06,3.57,232.27,232.27,0,0,1-36.14-2.14.21.21,0,0,1,0-.41,319.63,319.63,0,0,0,36.06,1,254.66,254.66,0,0,0,35.88-3.21,132.44,132.44,0,0,0,17.5-4.19,66.46,66.46,0,0,0,16.26-7.5,20.31,20.31,0,0,0,6.23-6.25,10,10,0,0,0,.88-8.49A17.93,17.93,0,0,0,126.37,46a38.66,38.66,0,0,0-7.4-5.11.08.08,0,0,1,0-.1A.08.08,0,0,1,119,40.78Z" transform="translate(0.5 0.5)"/>
      		
      		{(this.props.isHandFlipped===false)?
      			<polygon points="20.4 79.6 14.92 82.01 19.75 85.55 20.4 79.6"/>: //front Arrow
      			<polygon points="122.38 46.59 119.5 41.34 125.48 41.48 122.38 46.59"/> //back arrow
      		} 
      	</svg> 
      </div>


    );
  } 
}



export  class SensorView extends React.Component {
	constructor(props){
		super(props);
		this.state = 	{
							width:0,
							animationCount: this.props.designer.state.isFlipped === true? 24:1,
							animationSequence: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
							startTouch:{x: 0, y: 0},
							endTouch:{x: 0, y: 0},
						}
	}

	componentWillUnmount () {
	  clearInterval(this.timer);
	}

	tick () {
		if(this.props.designer.state.isFlipped === true){
			this.state.animationCount === 24 ? this.stopTimer() : this.setState({animationCount: (this.state.animationCount + 1)});	    
		}else{
			this.state.animationCount === 1 ? this.stopTimer() : this.setState({animationCount: (this.state.animationCount - 1)});
		}
		
	}
	startTimer () {
	  clearInterval(this.timer);
	  this.timer = setInterval(this.tick.bind(this), 1000/24);
	  this.props.designer.setState({isFlipped: !this.props.designer.state.isFlipped});
	}
	stopTimer () {
	  clearInterval(this.timer);
	}

	componentDidMount(){  
 		let sensors = this.props.designer.state.activeSensors;  
		for (var i = 0; i < sensors.length; i++) {
			let sensor =document.getElementById("sensor"+sensors[i]);
			if(sensor !== null ){
				sensor.setAttribute("fill","#17C0B7");
			}
		} 
	}

	handleMouseDown(e){ 
		this.setState({startTouch:{x: e.pageX, y: e.pageY }})
	}
	handleMouseUp(e){ 
		if(Math.abs(this.state.startTouch.x - e.pageX ) > 50  && e.pageX !== this.state.startTouch.x){
			this.startTimer();
		} 
	 	this.setState({startTouch:{x: 0, y: 0}});
		this.setState({endTouch:{x: 0, y: 0}});
	}

	handleTouchStart(e){   
		this.setState({endTouch:{x: 0, y: 0}});
		this.setState({startTouch:{x: e.touches[0].clientX, y: e.touches[0].clientY }})
	}
	
	handleTouchMove(e){  
		this.setState({endTouch:{x: e.touches[0].clientX, y: e.touches[0].clientY }})
	}
	
	handleTouchEnd(e){
		if(Math.abs(this.state.startTouch.x - this.state.endTouch.x ) > 50 && this.state.endTouch.x >0){
			this.startTimer();
		}
	 	this.setState({startTouch:{x: 0, y: 0}});
		this.setState({endTouch:{x: 0, y: 0}});
	}

	 
  	render (){  
   		let designer = this.props.designer;
   		let sensors = this.props.designer.state.activeSensors; 
   		//let visibleHand = this.props.designer.state.firstGesture; 
   		let isHandFlipped = this.props.designer.state.isFlipped;
   		 
	    	return ( 
	    		<div className="content h-100"  style={{overflow: "hidden"}}>  
	    			<FlipHand designer={this.props.designer} height={this.props.height} view={this} isHandFlipped={isHandFlipped}/>
	    			<svg className="handModel"  x="0px" y="0px" style={{height:this.props.height, width: "100%" }}
	    				 viewBox="0 0 720 1024" > 
	    				{this.state.animationSequence.map(item => ( 
	    				    <React.Fragment key={item}>
	    				       <image hidden={this.state.animationCount === item? false:true} xlinkHref={require('../img/gestures/flip/'+item+'.png')} x="0" y="0"  width="100%" />
	    				    </React.Fragment>
	    				))}  
	    				<image hidden={(sensors.includes(3) && this.state.animationCount === 1 )? false:true} xlinkHref={require('../img/gestures/flip/sensors/3.png')} x="0" y="0"  width="100%" />
	    				<image hidden={(sensors.includes(4) && this.state.animationCount === 1 )? false:true} xlinkHref={require('../img/gestures/flip/sensors/4.png')} x="0" y="0"  width="100%" />
	    				<image hidden={(sensors.includes(5) && this.state.animationCount === 1 )? false:true} xlinkHref={require('../img/gestures/flip/sensors/5.png')} x="0" y="0"  width="100%" />
	    				<image hidden={(sensors.includes(6) && this.state.animationCount === 1 )? false:true} xlinkHref={require('../img/gestures/flip/sensors/6.png')} x="0" y="0"  width="100%" />
	    				<image hidden={(sensors.includes(7) && this.state.animationCount === 1 )? false:true} xlinkHref={require('../img/gestures/flip/sensors/7.png')} x="0" y="0"  width="100%" />
	    				<image hidden={(sensors.includes(8) && this.state.animationCount === 1 )? false:true} xlinkHref={require('../img/gestures/flip/sensors/8.png')} x="0" y="0"  width="100%" />
	    				<image hidden={(sensors.includes(9) && this.state.animationCount === 1 )? false:true} xlinkHref={require('../img/gestures/flip/sensors/9.png')} x="0" y="0"  width="100%" />
	    				<image hidden={(sensors.includes(10) && this.state.animationCount === 1 )? false:true} xlinkHref={require('../img/gestures/flip/sensors/10.png')} x="0" y="0"  width="100%" />
	    				<image hidden={(sensors.includes(11) && this.state.animationCount === 1 )? false:true} xlinkHref={require('../img/gestures/flip/sensors/11.png')} x="0" y="0"  width="100%" />
	    				<image hidden={(sensors.includes(12) && this.state.animationCount === 1 )? false:true} xlinkHref={require('../img/gestures/flip/sensors/12.png')} x="0" y="0"  width="100%" />
	    				<image hidden={(sensors.includes(13) && this.state.animationCount === 1 )? false:true} xlinkHref={require('../img/gestures/flip/sensors/13.png')} x="0" y="0"  width="100%" />
	    				<image hidden={(sensors.includes(14) && this.state.animationCount === 1 )? false:true} xlinkHref={require('../img/gestures/flip/sensors/14.png')} x="0" y="0"  width="100%" />

	    				<image hidden={(sensors.includes(16) && this.state.animationCount === 24 )? false:true} xlinkHref={require('../img/gestures/flip/sensors/16.png')} x="0" y="0"  width="100%" />
	    				<image hidden={(sensors.includes(18) && this.state.animationCount === 24 )? false:true} xlinkHref={require('../img/gestures/flip/sensors/18.png')} x="0" y="0"  width="100%" />
	    				<image hidden={(sensors.includes(20) && this.state.animationCount === 24 )? false:true} xlinkHref={require('../img/gestures/flip/sensors/20.png')} x="0" y="0"  width="100%" />
	    				<image hidden={(sensors.includes(22) && this.state.animationCount === 24 )? false:true} xlinkHref={require('../img/gestures/flip/sensors/22.png')} x="0" y="0"  width="100%" />
	    			</svg>

	    			<div id="hand" 
	    				 className={(isHandFlipped===true)? "flipped ":""}
	    				 onTouchStart={e => this.handleTouchStart(e)}
	    				 onTouchMove={e => this.handleTouchMove(e)}
	    				 onTouchEnd={e => this.handleTouchEnd(e)}
	    				 onMouseDown={e => this.handleMouseDown(e)} 
	    				 onMouseUp={e => this.handleMouseUp(e)} 

	    			>
	    				<div className={"row front "+(isHandFlipped===false? "opacityTransition": "")} style={{zIndex:(isHandFlipped===true)? 1:2}}>
	    					<div className="col sensorHandContainer" style={{maxHeight:this.props.height}}>
	    						<div 	className="sensorGroup" 
	    								ref="sensorGroup"  
	    								style={{height:this.props.height, 
	    									    width: 293.4*(this.props.height)/(499.5),
	    									    bottom: this.props.height-8
	    										}}> 
	    							<ToogleSensor visibleHand="hand1" sensorId ={3 } designer={designer} selected={sensors.includes(3 )?true:false} top="11%" left="21%" />
	    							<ToogleSensor visibleHand="hand1" sensorId ={4 } designer={designer} selected={sensors.includes(4 )?true:false} top="19.5%" left="23.6%" />
	    							<ToogleSensor visibleHand="hand1" sensorId ={5 } designer={designer} selected={sensors.includes(5 )?true:false} top="30%" left="27%" />
	    							<ToogleSensor visibleHand="hand1" sensorId ={6 } designer={designer} selected={sensors.includes(6 )?true:false} top="5%" left="44.5%" />
	    							<ToogleSensor visibleHand="hand1" sensorId ={7 } designer={designer} selected={sensors.includes(7 )?true:false} top="15%" left="44.5%" />
	    							<ToogleSensor visibleHand="hand1" sensorId ={8 } designer={designer} selected={sensors.includes(8 )?true:false} top="27%" left="45%" />
	    							<ToogleSensor visibleHand="hand1" sensorId ={9 } designer={designer} selected={sensors.includes(9 )?true:false} top="9%" left="65%" />
	    							<ToogleSensor visibleHand="hand1" sensorId ={10} designer={designer} selected={sensors.includes(10)?true:false} top="18.5%" left="62.5%" />
	    							<ToogleSensor visibleHand="hand1" sensorId ={11} designer={designer} selected={sensors.includes(11)?true:false} top="28.7%" left="60.5%" />
	    							<ToogleSensor visibleHand="hand1" sensorId ={12} designer={designer} selected={sensors.includes(12)?true:false}  top="16.5%" left="83%" />
	    							<ToogleSensor visibleHand="hand1" sensorId ={13} designer={designer} selected={sensors.includes(13)?true:false}  top="24%" left="79.5%" />
	    							<ToogleSensor visibleHand="hand1" sensorId ={14} designer={designer} selected={sensors.includes(14)?true:false}  top="33%" left="74.5%" />
	    						</div>
	    					</div>
	    				</div> 

	    				<div className={"row back "+(isHandFlipped===true? "opacityTransition": "")} style={{zIndex:(isHandFlipped===false)? 1:2}} >
	    					<div className="col sensorHandContainer" style={{maxHeight:this.props.height}}> 
	    						<div 	className="sensorGroup" 
	    								ref="sensorGroup"  
	    								style={{height:this.props.height, 
	    									    width: 293.4*(this.props.height)/(499.5),
	    									    bottom: this.props.height-8
	    										}}>

	    							<ToogleSensor visibleHand="hand2" sensorId ={22} designer={designer} selected={sensors.includes(22)?true:false} top="16%" left="10.5%" />
	    							<ToogleSensor visibleHand="hand2" sensorId ={20} designer={designer} selected={sensors.includes(20)?true:false} top="7.3%" left="29%" />
	    							<ToogleSensor visibleHand="hand2" sensorId ={18} designer={designer} selected={sensors.includes(18)?true:false} top="3%" left="50%" />
	    							<ToogleSensor visibleHand="hand2" sensorId ={16} designer={designer} selected={sensors.includes(16)?true:false}  top="9.5%" left="72.5%" />
	    							
	    						</div>
	    					</div>
	    				</div>
	    			</div>
	    		</div>
	   		);
   		
   		 
  }
};