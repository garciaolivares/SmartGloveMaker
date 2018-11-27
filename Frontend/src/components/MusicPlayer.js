import React from 'react'; 
import '../css/player.css';  
import { parse } from 'id3-parser';
import { convertFileToBuffer} from 'id3-parser/lib/universal/helpers'; 

let moment = require('moment');

export class MusicPlayer extends React.Component{

	constructor (props) {
	  	super(props); 
	  	this.state = {   
	          gesturePlay: [],
	          gesturePrev: [],
	          gestureNext: [],  
	          seekBarProgress: 0,
	          songDuration: "0:00",
	          currentTime: "0:00",
	          maxDuration: 0,
	          width: 0,
	          height: 0,
	          isPlaying: false,
	          tags: {
	          		  title: "",
	          		  artist: "",
	          		  album: "",
	          		},
	          rwd:false,
	          time:0,
	          songNumber: 0,
	          playlist: ["genesis", "charmingMan", "mundo"],
	          initiated: false,

	        }; 

	    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();  
		this.src = null; 
		this.analyser = null;
		this.ctx = null; 

    	this.handleOnLoadSong = this.handleOnLoadSong.bind(this);
    	this.handleOnLoadFile = this.handleOnLoadFile.bind(this); 
    	this.handleSeekBar = this.handleSeekBar.bind(this); 
    	this.handleUpdateTime = this.handleUpdateTime.bind(this); 
    	this.handlePlay = this.handlePlay.bind(this); 
    	this.handleForward = this.handleForward.bind(this);
		this.handleRewind = this.handleRewind.bind(this);
    	this.renderFrame = this.renderFrame.bind(this);
    	this.updatePlayerDimensions = this.updatePlayerDimensions.bind(this);
    	this.handleOpenExplorerOnEnter = this.handleOpenExplorerOnEnter.bind(this);
    	this.handleOpenExplorerOnClick = this.handleOpenExplorerOnClick.bind(this);
    	this.handleOnEnded = this.handleOnEnded.bind(this); 	
	} 


	handleOnEnded(){
		this.setState({isPlaying: false});
	}

	componentDidMount(){
		window.addEventListener('resize', this.updatePlayerDimensions);
		this.src= this.audioCtx.createMediaElementSource(this.refs.audio);
		this.analyser = this.audioCtx.createAnalyser();
		this.ctx = this.refs.canvas.getContext("2d");  
		this.refs.canvas.width = this.refs.playerWrapper.clientWidth;
		this.refs.canvas.height = this.refs.playerWrapper.clientHeight;

		this.setState({width:this.refs.player.getBoundingClientRect().width});
		this.setState({height:this.refs.player.getBoundingClientRect().height});
		this.handlePreLoadedSong("genesis");
	}


	componentWillUnmount() {
	  window.removeEventListener('resize', this.updatePlayerDimensions); 
	  this.audioCtx.close();
	}

	updatePlayerDimensions() {
	  this.setState({ width: this.refs.playerWrapper.clientWidth, height: this.refs.playerWrapper.clientHeight });
	}  

	handleSeekBar(event){
		this.refs.audio.currentTime = event.target.value;  
  		this.setState({seekBarProgress: event.target.value});
	}

	handleUpdateTime(event){

		let dif = this.refs.audio.currentTime - this.state.time;
		if(this.state.rwd){
			this.refs.audio.currentTime -= dif*2; 
		} 
		this.setState({time:event.target.currentTime})
		let currentTime = this.state.time;
		let tempTime = moment.duration(currentTime, 'seconds');
		let seconds = tempTime.seconds();
		let y = tempTime.minutes()+ ":"+ ( seconds < 10? "0"+seconds: seconds); 
		this.setState({currentTime: y})
		this.setState({seekBarProgress: currentTime}); 
	}

 

	handlePlay(){
		let component = this;
		if(this.state.isPlaying){
			this.refs.audio.pause();
			this.setState({isPlaying: false});
		}else{
			this.refs.audio.play();
			this.setState({isPlaying: true}); 
			 
				setTimeout(function(){
				  try {
				      component.renderFrame();
				  }
				  catch(err) { 
				  }  
				},500); 
				this.setState({initiated: true})
			 

		}
	}

	handleForward(){
		this.refs.audio.pause();
		this.setState({isPlaying: false});

		let position = this.state.songNumber;
		if(this.state.songNumber < 2 ) {
			this.setState({songNumber: (this.state.songNumber+1)});
			position += 1;
		}else{
			this.setState({songNumber: 0});
			position =0;
		}

		 

		 
		let song = this.state.playlist[position];  
		this.handlePreLoadedSong(song);
		this.refs.audio.play();
		this.setState({isPlaying: true});
/*		this.refs.audio.playbackRate = 4.0; 
		let component = this;
		setTimeout(function(){
			component.refs.audio.playbackRate = 1.0;
		},1000);  */

	}

	handleRewind(){ 
		this.refs.audio.pause();
		this.setState({isPlaying: false});

		let position = this.state.songNumber;
		if(this.state.songNumber > 0 ) {
			this.setState({songNumber: (this.state.songNumber-1)});
			position -= 1;
		}else{
			this.setState({songNumber: 2});
			position =2;
		} 
		let song = this.state.playlist[position];

		 
		this.handlePreLoadedSong(song);
		this.refs.audio.play();
		this.setState({isPlaying: true});
/*	 	let component = this;
		this.setState({rwd:true}); 
		setTimeout(function(){ 
			component.setState({rwd:false});
		},5000); */
	}
	  	
	handleOnLoadSong(event){  
		this.setState({maxDuration: event.target.duration });
		let tempTime = moment.duration(this.refs.audio.duration, 'seconds');
		let seconds = tempTime.seconds();
		let duration = tempTime.minutes()+ ":"+ ( seconds < 10? "0"+seconds: seconds);
		this.setState({songDuration: duration}); 
		this.refs.playBtn.focus();
	}

	handlePreLoadedSong(audio){  
		let component = this;
		this.refs.audio.src = require('../audio/'+audio+'.mp3');
	   	this.refs.audio.load();  
	   	this.analyser = this.audioCtx.createAnalyser();
	   	this.src.connect(this.analyser);
	   	this.analyser.connect(this.audioCtx.destination); 
	   	this.analyser.fftSize = 1024; 
	   	this.bufferLength = this.analyser.frequencyBinCount; 
	   	this.dataArray = new Uint8Array(this.bufferLength); 
	   	this.barWidth = (this.state.width / this.bufferLength);  

	   	let xhr = new XMLHttpRequest();
	   	xhr.open('GET', require('../audio/'+audio+'.mp3'), true);
	    xhr.responseType = 'blob'; 

	   	xhr.onload = function(e) {
	   	  if (this.status === 200) {
	   	    let song = this.response;
	   	     convertFileToBuffer(song).then(parse).then(tag => {  
	   	         component.setState({tags:{
	   	         	album: tag.album || "Unknown album",
	   	         	title: tag.title || "Unknown ",
	   	         	artist: tag.artist || "unknown"
	   	         }})
	   	     }); 
	   	     setTimeout(function(){
	   	       try {
	   	           component.renderFrame();
	   	       }
	   	       catch(err) { 
	   	       }  
	   	     },500); 
	   	  }
	 
	   	};
	   	xhr.send(); 
	}

	handleOnLoadFile(){   
		this.setState({tags:{
			album: "",
			title: "",
			artist: ""
		}});
		let component = this;
		let files = this.refs.songFile.files; 
		this.refs.audio.src =  URL.createObjectURL(files[0]); 
	   	this.refs.audio.load();  
	   	  
   	    convertFileToBuffer(files[0]).then(parse).then(tag => {  
   	         component.setState({tags:{
   	         	album: tag.album || "unknown",
   	         	title: tag.title || "unknown",
   	         	artist: tag.artist || "unknown"
   	         }})
   	    });   

   	    this.setState({isPlaying: true});
   	    this.refs.audio.play();
   	    setTimeout(function(){
   	      try {
   	          component.renderFrame();
   	      }
   	      catch(err) { 
   	      }  
   	    },500);  
	}

	handleOpenExplorerOnEnter(event){
		if ( event.keyCode === 13 || event.keyCode === 32 ) {  
		    this.refs.songFile.focus();  
		    this.refs.songFile.click();
		} 
	}

	handleOpenExplorerOnClick(event){ 
		this.refs.songFile.focus();  
		this.refs.songFile.click(); 
	}

	renderFrame() {
			this.ctx.clearRect(0, 0, this.state.width, this.state.height); 
			if(this.state.isPlaying === false){ 
				return
			} 
	     	requestAnimationFrame(this.renderFrame);
	     	  

	     	//Frequency lines
	     	if(this.state.isPlaying === true){
		     	this.analyser.getByteTimeDomainData(this.dataArray);
		     	this.ctx.lineWidth = 1;
		     	this.ctx.strokeStyle = "rgba(" + 0 + "," + 0 + "," + 0 + ",0.1)";
		     	this.ctx.beginPath();
		     	let sliceWidth = this.state.width * 1.0 / this.bufferLength;
		     	let x = 0; 
		     	for(let i = 0; i < this.bufferLength; i++) {
		     		let v = this.dataArray[i] / 128.0;
		     		let y = v * this.state.height/2 - 50;   
	     		    this.ctx.quadraticCurveTo(x,y,(x+sliceWidth), y); 
		     		x += sliceWidth;
		     	}  
		     	this.ctx.stroke();
		     	 
		   

		     	//Frequency Circles

		     	this.analyser.getByteFrequencyData(this.dataArray);
		     	this.barWidth = ((this.state.width)/2) /  this.bufferLength;
		       	let x1 =  (this.state.width/2);
		       	let x2 =  (this.state.width/2);  
		       	let r , g ,b; 
		       	this.ctx.lineWidth = 0.5;
		       	let bitFlag=false; 
		       	let step = this.bufferLength; 

		 	    for (let i = 0; i < this.bufferLength;  i++) {
		 	    	this.barHeight = this.dataArray[i]/1.5; 

		 	    	bitFlag = (this.barHeight > 150? !bitFlag: bitFlag);
		 	    	
		 	    	if(this.barHeight >= 1){  
		 	    		if(!this.state.rwd){
		 	    			r = this.barHeight + (255 * (i/this.bufferLength));
		 	    			g=0;
		 	    			b=78;
		 	    		}else{
		 	    			r=23;
		 	    			g = this.barHeight + (255 * (i/this.bufferLength));
		 	    			b=178;
		 	    		} 
		 	    		 
		 		        this.ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + ",0.1)";
		 		        this.ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ",0.03)";  
		 		       
		 		        this.ctx.beginPath();
		 			    this.ctx.arc(x1, this.state.height/2-50, this.barHeight, 0, 2 * Math.PI); 
		 			    this.ctx.closePath(); 
		 			    i < this.bufferLength/2? this.ctx.fill():this.ctx.stroke(); 
		 			  	//this.ctx.fill(); 	

		 	            this.ctx.beginPath();
		 	    	    this.ctx.arc(x2, this.state.height/2-50, this.barHeight, 0, 2 * Math.PI);
		 	    	    this.ctx.closePath();
		 	    	    i < this.bufferLength/2? this.ctx.fill():this.ctx.stroke();
		 			    //this.ctx.stroke();  
		 		    }

		 		    x1+=this.barWidth; 
		 		    x2-=this.barWidth;
		 		    step--; 
				}
			 }
			 
		} 


	render() {

		let titleStyle = {}
		if (this.state.tags.title.length > 14 && this.state.tags.title.length <= 17) { 
			titleStyle ={fontSize: "6.5vh"}; 
		}
		if (this.state.tags.title.length > 17 && this.state.tags.title.length <= 20) { 
			titleStyle ={fontSize: "5.5vh"};
		} 
		if (this.state.tags.title.length > 20) { 
			titleStyle ={fontSize: "5.5vh"}; 
		} 

	    return (
	    	<div className="col" style={{padding:"0"}}>
		    	<div ref="playerWrapper" className="row playerWrapper w-100">
		    	  	<div className="col-12 canvas h-100">
		    	  		<form>
		    	  		  <div className="input-file-container">  
		    	  		    <input className="input-file" ref="songFile" type="file" onChange={this.handleOnLoadFile}/>
		    	  		    <label tabIndex="0" htmlFor="thefile" className="input-file-trigger" onClick={this.handleOpenExplorerOnClick} onKeyDown={this.handleOpenExplorerOnEnter}>
		    	  		    	<img src={require("../img/player/open.svg")} alt=""/>
		    	  		    </label>
		    	  		  </div>
		    	  		  <p className="file-return"></p>
		    	  		 
		    	  		</form> 
		    			<canvas ref="canvas" width={this.state.width} height={this.state.height}></canvas>
		    			<audio ref="audio" onLoadedData={this.handleOnLoadSong} onTimeUpdate={this.handleUpdateTime}   onEnded={this.handleOnEnded}></audio> 
		    			
		    	  	</div>
	  	 			<div ref="player" className="col-12 h-100 player"> 
	  					<div className="row h-50 tagWrapper">
	  			        	<div className={"col info "+ (this.state.isPlaying === true? "textShadow": "")}>
	  			        		<span id="title" style={titleStyle}>{this.state.tags.title}</span>
	  			        		<br/>
	  			        		<span id="artist">{this.state.tags.artist}</span> <span >{this.state.tags.title !== ""? "-": ""}</span>
	  							 
	  							<span id="album"> {this.state.tags.album}</span>
	  			        	</div>				
	  					</div>
	  	 				 
	  					<div className="row durationBar h-25">
	  						<div className="col-2" id="currentTime"><span className="float-right">{this.state.currentTime}</span></div>
	  						<div className="col-8 pad0">
	  						  	<input onChange={this.handleSeekBar} type="range" ref="seekBar" max={this.state.maxDuration} value={this.state.seekBarProgress}/>
	  						</div>
	  						<div className="col-2" id="duration"><span className="float-left">{this.state.songDuration}</span></div>
	  					</div>
	  	 				 
	  	 				<div className="row playControls h-25"> 
	  	 					<div className="col-4 prev">
	  	 						<a ref="prevBtn" onClick={this.handleRewind}>
	  	 							<img alt=""  className="float-right " src={require("../img/player/fast-forward.svg")}/>
	  	 						</a>
	  	 					</div>
	  	 					<div className="col-4 playBtn">
	  	 						<a ref="playBtn" onClick={this.handlePlay} >
	  	 							<img alt="" className="fn-play" src={this.state.isPlaying === true? require("../img/player/pause.svg"): require("../img/player/play.svg")}/></a>
	  	 					</div>
	  	 					<div className="col-4 next">
	  	 						<a ref="nextBtn" onClick={this.handleForward}>
	  	 							<img  alt="" className="float-left" src={require("../img/player/fast-forward.svg")}/>
	  	 						</a>
	  	 					</div>
	  	 				</div>
	  	 				  
	  	 			</div>
	  	 		</div>
	    	</div>
	    );
	}
}