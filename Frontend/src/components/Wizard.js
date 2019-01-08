import React from 'react'; 
import {Home} from './Home';
import {Designer} from './EagleDesigner'; 
import {Directions} from './Directions'; 
import {DeviceConnection} from './DeviceConnection'; 

export class Wizard extends React.Component{
	constructor(props) { 
	    super(props); 
	    this.state = {
	      step:1,
	    }; 
		this.handleStepClick = this.handleStepClick.bind(this); 
	}

	handleStepClick(step) {  
		this.setState({ step:  step}); 
	} 

	componentDidCatch(error, info) {
	  // Display fallback UI
	  this.setState({ hasError: true });
	  // You can also log the error to an error reporting service
	  alert(error, info)
	}



	solveStep(){
		switch(this.state.step){
			case 1: return (
						<div className="row h-85">
							<div className="container">
								<Home 	status="active" 
											wizard={this}/>
							</div>
						</div>
					);  
			 
			case 2: return (
						<div className="row h-85">
							<div className="container">
								<div className="row h-100">
									<Designer 	status="active" 
												wizard={this}/>
								</div>				
							</div>
						</div>
					);   
			case 3: return (
						<div  className="row h-85">
							<div className="container">
								<div className="row h-100">
									<Directions status="active" 
											wizard={this}/>
								</div>
							</div>
						</div>
					); 
			case 4: return (
						<div  className="row h-85">
							<div className="container">
								<div className="row h-100">
									<DeviceConnection status="active"  wizard={this}/>
								</div>
							</div>
						</div>
						 
					); 
			default:
		}
	}


	render(){ 
 		
		let gestures = {status: "", src: require('../img/home.svg')};
		let design = {status: "", src: require('../img/gesture.svg')}; 
		let directions = {status: "", src: require('../img/needle.svg')};
		let gloveTesting = {status: "", src: require('../img/serial.svg')};
		let progress = {width: "0%"}; 

		switch(this.state.step){
			case 1: gestures.status = "active";
					gestures.src = require('../img/homeActive.svg'); 
					break;
			case 2: progress.width = "33.333333333%";
					gestures.status = "visited";
					gestures.src = require('../img/homeActive.svg');
					design.status = "active";
					design.src = require('../img/gestureActive.svg');
					break; 
			case 3: progress.width = "66.6666666666666%";
					gestures.status = "visited";
					gestures.src = require('../img/homeActive.svg');
					design.status = "visited";
					design.src = require('../img/gestureActive.svg');
					 
					directions.status = "active";
					directions.src = require('../img/needleActive.svg'); 
					break;
			case 4: progress.width = "100%";
					gestures.status = "visited";
					gestures.src = require('../img/homeActive.svg');
					design.status = "visited";
					design.src = require('../img/gestureActive.svg'); 
					directions.status = "visited";
					directions.src = require('../img/needleActive.svg');
					gloveTesting.status = "active";
					gloveTesting.src = require('../img/serialActive.svg'); 
					break;

			default:
		} 

	   	return( 
	    	<div className="container-fluid h-100">
	        	<div className="row h-15">
	          		<div id="step-header" className="col">
	          		   <div className="row pad10-30">
	          		   		<div className="col-md-1 col-lg-2">
	          		   			{/*{this.navPrev()}*/}
	          		   		</div>
	          		   		<div className="col-md-10 col-lg-8">
	          		   			<div className="row">
	          		   				<div className="progressFrame"></div>
	          		   				<div className="col progress">
	          		   				  <div className="progress-bar" style={progress}></div>
	          		   				</div>
	          		   			</div>
	          		   			<div className="row">
	          		   				<div onClick={() => this.handleStepClick(1)} className={gestures.status+ " col stepBadge hidden-xs-down" }>
	          		   					<div  style={{padding: "6px 8px"}}>
	          		   						<img  alt="Define gestures" src={gestures.src}/> 
	          		   					</div>  
	          		   					<div>HOME</div>
	          		   				</div>
	          		   				<div onClick={() => this.handleStepClick(2)} className={design.status+ " col stepBadge hidden-xs-down" }>
	          		   					<div>
	          		   					 	<img  alt="Set sensor position" src={design.src}/> 
	          		   					</div>
	          		   					<div>DESIGN GLOVE</div>
	          		   				</div>
	          		   				 
	          		   				<div onClick={() => this.handleStepClick(3)} className={directions.status+ " col stepBadge hidden-xs-down" }>
	          		   					<div>
	          		   					 	<img  alt="Glove Directions" src={directions.src}/> 
	          		   					</div>
	          		   					<div>BUILD GLOVE</div>
	          		   				</div>
	          		   				<div onClick={() => this.handleStepClick(4)} className={gloveTesting.status+ " col stepBadge hidden-xs-down" }>
	          		   					<div>
	          		   					 	<img  alt="Glove Directions" src={gloveTesting.src}/> 
	          		   					</div>
	          		   					<div>PROGRAM GLOVE</div>
	          		   				</div>
	          		   			</div>
	          		   		</div>
	          		   		<div className="col-md-1 col-lg-2"> 
	          		   			{/*{this.navNext()}*/}
	          		   		</div>
	          		   </div>
	          		</div>
	        	</div> 
		        {this.solveStep()} 
	      	</div>
	    );
	}
} 


 
