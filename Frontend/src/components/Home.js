import React from 'react';  

class Animation extends React.Component{ 
  constructor (props) {
    super(props)
    this.state = {	count: 0,
    				isPlayOn: false,
    				};  
    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.redirectWizard = this.redirectWizard.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

 
  handleMouseEnter() {  
      this.handlePlayClick();
  }

  handleMouseLeave() {  
      this.handlePlayClick();  
  }

  handlePlayClick() {
    this.setState(prevState => ({
      isPlayOn: !prevState.isPlayOn
    })); 
    if(this.state.isPlayOn === false){
    	var play = document.getElementsByClassName("playing"); 
    	for (var i = 0; i < play.length; i++) {
    		play[i].click();
    	} 
    	this.startTimer();
    }else{
    	this.stopTimer();
    } 
  } 

  redirectWizard() {  
    if(this.props.valueInWizard === 4){ 
       this.props.wizard.setState({step:4});
    }else{ 
      this.props.wizard.setState({step:this.props.valueInWizard});
    }
    
  }

  componentWillUnmount () {
    clearInterval(this.timer);
  }

  tick () {
  	this.state.count=== this.props.sequence.length-1 ? this.stopTimer(): this.setState({count: (this.state.count + 1)});	    
  }
  startTimer () { 
    clearInterval(this.timer);
    this.timer = setInterval(this.tick.bind(this), 50);
    this.setState({count:0});
    
  }
  stopTimer () {
    clearInterval(this.timer);  
    this.props.home.setState({animationSet: this.props.step === 1? 2:1});
  }

  removeDuplicates(arr){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) === -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
  }

  render () { 
	let keyframe = this.props.sequence[this.state.count];
    return (
      <span>
        <div className= {"animation "+this.props.clss}  
              onClick={this.redirectWizard}>   
          <div className="title"> <h1>{this.props.step}</h1> <span>{this.props.title}</span></div>
        	<div className={"imgContainer h-100"+ (this.props.available === false? "disable":" ")} > 
                  {this.removeDuplicates(this.props.sequence).map(item => ( 
                    <React.Fragment key={item}> 
                        <img alt={this.props.name} src={require("../img/gestures/"+this.props.srcFolder+"/"+item+".png")} hidden={keyframe!==item? true:false}/> 
                    </React.Fragment>
                  ))} 
        	</div> 
        </div> 
      </span>
    )
  }
} 



 export class Home extends React.Component{

	constructor (props) {
	  super(props);
	  this.state = {
      animationSet: 0,
    };   
	}

	componentDidMount(){
    this.refs.animation2.startTimer(); 
	}


  componentDidUpdate(prevProps, prevState) {
      if(this.state.animationSet===1){
        this.refs.animation1.startTimer(); 
      }else{
        this.refs.animation2.startTimer(); 
      }
  }

	render() {  
		
		return (
	    	<div id="step-gestures" ref="stepGestures" className="col h-100"> 
			    <div className="row h-100"> 
            <div className="col-lg-6 h-100" style={{overflow:"hidden"}}>
              <img className="logo" alt="" src={require("../img/logo.svg")}/> 
            </div>
            <div className="col-lg-6 h-100">
              <div className="row h-50"> 
                 <div className="col h-100" style={{paddingBottom: "30px"}}>
                   <Animation 
                    ref="animation1"
                    srcFolder="gesture1" 
                    valueInWizard = {2} 
                    home={this} 
                    step={1} 
                    title="Design Your Smart Glove"
                    clss= "row h-100"
                    wizard={this.props.wizard}
                    sequence = {[ 
                                  77,77,77,77,77,77,77,77,77,77,77,77,77,77,
                                  1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,24,24,24,24,24,
                                  24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1, 

                                  77,77,77,77,77,77,77,77,77,77,77,77,77,77,

                                  25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,48,48,48,48,48,
                                  48,47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32,31,30,29,28,27,26,25, 
                                  
                                  77,77,77,77,77,77,77,77,77,77,77,77,77,77,

                                  49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,72,72,72,72,72,
                                  72,71,70,69,68,67,66,65,64,63,62,61,60,59,58,57,56,55,54,53,52,51,50,49,

                                  77,77,77,77,77,77,77,77]} />
                </div>
              </div>
              <div className="row h-50"> 
                  <div className="col h-100" style={{paddingBottom: "30px"}}> 
                     <Animation 
                      ref="animation2" 
                      srcFolder="gesture3" 
                      valueInWizard = {4}  
                      home={this} 
                      step={2} 
                      title="Program your Smart Glove"
                      clss= "gloveFilter row h-100" 
                      wizard={this.props.wizard}
                      sequence = {[
                                  1,1,1,1,1,1,1,
                                  1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,24,24,24,24,24,24,24,24,24,24,24,
                                  24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,1,1,1,1,1,
                                  1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,24,24,24,24,24,24,24,24,24,24,24,
                                  24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,1,1,1,1,1]} />
                  </div>  
              </div>
            </div> 
			    </div>  
	    	</div> 
	  );
	}
}

 