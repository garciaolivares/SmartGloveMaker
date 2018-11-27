import React from 'react';  
import '../css/glove.css'; 
import {MusicPlayer} from './MusicPlayer'; 
   
export class Glove extends React.Component{

  constructor (props) {
    super(props); 
    this.state = {  
            inputGesture:[],
            gesturePlay: [],
            gesturePrev: [],
            gestureNext: [], 
            visibleGesture: "", 
          }; 
    this.showGesture = this.showGesture.bind(this);   
  }

  isGestureEqual(arr1, arr2) {
      if(arr1.length !== arr2.length){  
        return false;
      }
      for(var i = arr1.length; i--;) {
          if(arr1[i] !== arr2[i]){ 
              return false;
          }
      } 
      return true;
  }

  identifyGesture(){ 
    if(this.isGestureEqual(this.state.inputGesture, this.state.gesturePlay)){
      this.refs.correct.play();  
      this.refs.musicPlayer.handlePlay(); 
    }else if(this.isGestureEqual(this.state.inputGesture, this.state.gesturePrev)){
       this.refs.correct.play();
      this.refs.musicPlayer.handleRewind();
    } else if(this.isGestureEqual(this.state.inputGesture, this.state.gestureNext)){
      this.refs.correct.play();
      this.refs.musicPlayer.handleForward();
    } 
  }



  sensorPosition(idSensor){
    switch(idSensor){
      case 18:  return {x:65, y:8.3} 
      case 16:  return {x:50, y:4} 
      case 15:  return {x:35.5, y:8} 
      case 14:  return {x:25.5, y:15} 
      case 2:  return  {x:63, y:12.5} 
      case 3:  return  {x:62.5, y:22.5} 
      case 4:  return  {x:62.5, y:32} 
      case 7:  return  {x:50.4, y:8.5} 
      case 5:  return  {x:50.5, y:19.3} 
      case 6:  return  {x:50.5, y:31} 
      case 10:  return {x:38.5, y:12.5} 
      case 9:  return  {x:39.5, y:22} 
      case 8:  return  {x:39.6, y:32} 
      case 11:  return {x:27, y:19.3} 
      case 13:  return {x:26.2, y:27} 
      case 12:  return {x:27, y:37} 
      default: return{x:0, y:0}
    }
  }

  renderRecordedGestures(){
      let indents = [];

      if(this.state.visibleGesture === "gesturePlay"){
        for (let i = 0; i < this.state.gesturePlay.length; i++) {
          let position = this.sensorPosition(this.state.gesturePlay[i]);
          indents.push( <g key={"play"+i}>
                          <circle  fill="#ffc107" key={"ci"+i}  cx={(position.x+1)+"%"} cy={(position.y-1)+"%"} r="34" ></circle>
                          <text key={"i"+i} x={position.x+"%"} y={position.y+"%"} fontSize="50px" >{i+1}</text>
                        </g>);
        } 
      }
      if(this.state.visibleGesture === "gesturePrev"){
        for (let j = 0; j < this.state.gesturePrev.length; j++) {
          let position = this.sensorPosition(this.state.gesturePrev[j]);
          indents.push(<g key={"prev"+j}>
                          <circle  fill="#ff004e" key={"cj"+j}  cx={(position.x+1)+"%"} cy={(position.y-1)+"%"} r="34" ></circle>
                          <text key={"j"+j} x={position.x+"%"} y={position.y+"%"} fontSize="50px" >{j+1}</text>
                        </g>);
        }
      }
      if(this.state.visibleGesture === "gestureNext"){
        for (let z = 0; z < this.state.gestureNext.length; z++) {
          let position = this.sensorPosition(this.state.gestureNext[z]);
          indents.push(<g key={"next"+z}>
                          <circle  fill="#17c0b7" key={"cz"+z}  cx={(position.x+1)+"%"} cy={(position.y-1)+"%"} r="34" ></circle>
                          <text key={"z"+z} x={position.x+"%"} y={position.y+"%"} fontSize="50px">{z+1}</text>
                        </g>);
        }
      } 

      if(this.props.deviceInputReader.state.flow == 3){
        return null;
      }else{
        return indents; 
      }
  }

   
  recordGesture = gesture => e => {  
    switch(gesture){
        case "gesturePlay": this.setState({gesturePlay: []}); 
                          break;
        case "gesturePrev": this.setState({gesturePrev: []}); 
                          break;
        case "gestureNext": this.setState({gestureNext: []}); 
                          break;
        default:
    }  
    this.props.deviceInputReader.setState({isRecording:{status: true, gesture: gesture}}); 
    this.setState({visibleGesture: gesture}); 
  };

  showGesture = gesture => e => {  
    switch(gesture){
        case "gesturePlay": this.setState({visibleGesture:"gesturePlay"}); 
                          break;
        case "gesturePrev": this.setState({visibleGesture:"gesturePrev"}); 
                          break;
        case "gestureNext": this.setState({visibleGesture:"gestureNext"}); 
                          break;
        default:
    }   
  }; 

	render() { 

    
        return (  
          <div className="row glovePanel w-100 h-100"> 
               
              <div className={"widthAnimation h-100 "+ (this.props.deviceInputReader.state.flow ===2? "col-sm-7":"col-sm-5")}>
                <audio ref="correct">
                    <source src={require('../audio/correct.wav')} type="audio/mpeg"/> 
                </audio>   
                <svg style={{height: "100%", width:"100%"}} id="sensors" viewBox="0 0 1440 2048" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
                    <g  hidden={this.state.inputGesture.includes(18)? false:true} id="s18" fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="2">
                        <circle cx="66%" cy="7.3%" r="0%"  stroke="#ff004e">
                            <animate attributeName="r" begin="0s" dur="0.5s" values="0%;5%" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeOpacity" begin="0s" dur="0.5s" values="1;0.5" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeWidth" begin="0s" dur="0.5s" values="10;0" calcMode="linear" repeatCount="indefinite" />
                        </circle> 
                    </g>

                    <g hidden={this.state.inputGesture.includes(16)? false:true}  id="s16" fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="2">
                        <circle cx="51%" cy="3%" r="0%"  stroke="#ff004e">
                            <animate attributeName="r" begin="0s" dur="0.5s" values="0%;5%" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeOpacity" begin="0s" dur="0.5s" values="1;0.5" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeWidth" begin="0s" dur="0.5s" values="10;0" calcMode="linear" repeatCount="indefinite" />
                        </circle>  
                    </g>

                    <g hidden={this.state.inputGesture.includes(15)? false:true}  id="s15" fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="2">
                        <circle cx="36.5%" cy="7%" r="0%"  stroke="#ff004e">
                            <animate attributeName="r" begin="0s" dur="0.5s" values="0%;5%" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeOpacity" begin="0s" dur="0.5s" values="1;0.5" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeWidth" begin="0s" dur="0.5s" values="10;0" calcMode="linear" repeatCount="indefinite" />
                        </circle>  
                    </g>

                    <g hidden={this.state.inputGesture.includes(14)? false:true}  id="s14" fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="2">
                        <circle cx="26.5%" cy="14%" r="0%"  stroke="#ff004e">
                            <animate attributeName="r" begin="0s" dur="0.5s" values="0%;5%" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeOpacity" begin="0s" dur="0.5s" values="1;0.5" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeWidth" begin="0s" dur="0.5s" values="10;0" calcMode="linear" repeatCount="indefinite" />
                        </circle>  
                    </g>



                    <image xlinkHref={require("../img/glove.png")} x="0" y="0" height="2048" width="1440"/>
                    
                    {this.renderRecordedGestures()} 

                    <g hidden={this.state.inputGesture.includes(2)? false:true} id="s2" fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="2">
                        <circle cx="64%" cy="11.5%" r="0%"  stroke="#ffc107">
                            <animate attributeName="r" begin="0s" dur="0.5s" values="0%;5%" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeOpacity" begin="0s" dur="0.5s" values="1;0.5" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeWidth" begin="0s" dur="0.5s" values="10;0" calcMode="linear" repeatCount="indefinite" />
                        </circle>  
                    </g>

                    <g hidden={this.state.inputGesture.includes(3)? false:true} id="s3" fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="2">
                        <circle cx="63.5%" cy="21.5%" r="0%"  stroke="#ffc107">
                            <animate attributeName="r" begin="0s" dur="0.5s" values="0%;5%" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeOpacity" begin="0s" dur="0.5s" values="1;0.5" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeWidth" begin="0s" dur="0.5s" values="10;0" calcMode="linear" repeatCount="indefinite" />
                        </circle> 
                    </g>

                    <g hidden={this.state.inputGesture.includes(4)? false:true} id="s4" fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="2">
                        <circle cx="63.5%" cy="31%" r="0%"  stroke="#ffc107">
                            <animate attributeName="r" begin="0s" dur="0.5s" values="0%;5%" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeOpacity" begin="0s" dur="0.5s" values="1;0.5" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeWidth" begin="0s" dur="0.5s" values="10;0" calcMode="linear" repeatCount="indefinite" />
                        </circle> 
                    </g>

                    <g hidden={this.state.inputGesture.includes(7)? false:true} id="s7" fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="2">
                        <circle cx="51.4%" cy="7.5%" r="0%"  stroke="#ffc107">
                            <animate attributeName="r" begin="0s" dur="0.5s" values="0%;5%" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeOpacity" begin="0s" dur="0.5s" values="1;0.5" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeWidth" begin="0s" dur="0.5s" values="10;0" calcMode="linear" repeatCount="indefinite" />
                        </circle> 
                    </g>

                    <g hidden={this.state.inputGesture.includes(5)? false:true} id="s5" fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="2">
                        <circle cx="51.5%" cy="18.3%" r="0%"  stroke="#ffc107">
                            <animate attributeName="r" begin="0s" dur="0.5s" values="0%;5%" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeOpacity" begin="0s" dur="0.5s" values="1;0.5" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeWidth" begin="0s" dur="0.5s" values="10;0" calcMode="linear" repeatCount="indefinite" />
                        </circle> 
                    </g>

                    <g hidden={this.state.inputGesture.includes(6)? false:true} id="s6" fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="2">
                        <circle cx="51.5%" cy="30%" r="0%"  stroke="#ffc107">
                            <animate attributeName="r" begin="0s" dur="0.5s" values="0%;5%" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeOpacity" begin="0s" dur="0.5s" values="1;0.5" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeWidth" begin="0s" dur="0.5s" values="10;0" calcMode="linear" repeatCount="indefinite" />
                        </circle> 
                    </g>

                    <g hidden={this.state.inputGesture.includes(10)? false:true} id="s10" fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="2">
                        <circle cx="39.5%" cy="11.5%" r="0%"  stroke="#ffc107">
                            <animate attributeName="r" begin="0s" dur="0.5s" values="0%;5%" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeOpacity" begin="0s" dur="0.5s" values="1;0.5" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeWidth" begin="0s" dur="0.5s" values="10;0" calcMode="linear" repeatCount="indefinite" />
                        </circle> 
                    </g>

                    <g hidden={this.state.inputGesture.includes(9)? false:true} id="s9" fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="2">
                        <circle cx="40.5%" cy="21%" r="0%"  stroke="#ffc107">
                            <animate attributeName="r" begin="0s" dur="0.5s" values="0%;5%" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeOpacity" begin="0s" dur="0.5s" values="1;0.5" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeWidth" begin="0s" dur="0.5s" values="10;0" calcMode="linear" repeatCount="indefinite" />
                        </circle> 
                    </g>

                    <g hidden={this.state.inputGesture.includes(8)? false:true} id="s8" fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="2">
                        <circle cx="40.6%" cy="31%" r="0%"  stroke="#ffc107">
                            <animate attributeName="r" begin="0s" dur="0.5s" values="0%;5%" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeOpacity" begin="0s" dur="0.5s" values="1;0.5" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeWidth" begin="0s" dur="0.5s" values="10;0" calcMode="linear" repeatCount="indefinite" />
                        </circle> 
                    </g> 

                    <g hidden={this.state.inputGesture.includes(11)? false:true} id="s11" fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="2">
                        <circle cx="28%" cy="18.3%" r="0%"  stroke="#ffc107">
                            <animate attributeName="r" begin="0s" dur="0.5s" values="0%;5%" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeOpacity" begin="0s" dur="0.5s" values="1;0.5" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeWidth" begin="0s" dur="0.5s" values="10;0" calcMode="linear" repeatCount="indefinite" />
                        </circle> 
                    </g>

                     <g hidden={this.state.inputGesture.includes(13)? false:true} id="s13" fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="2">
                        <circle cx="27.2%" cy="26%" r="0%"  stroke="#ffc107">
                            <animate attributeName="r" begin="0s" dur="0.5s" values="0%;5%" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeOpacity" begin="0s" dur="0.5s" values="1;0.5" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeWidth" begin="0s" dur="0.5s" values="10;0" calcMode="linear" repeatCount="indefinite" />
                        </circle> 
                    </g>

                    <g hidden={this.state.inputGesture.includes(12)? false:true} id="s12" fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="2">
                        <circle cx="28%" cy="36%" r="0%"  stroke="#ffc107">
                            <animate attributeName="r" begin="0s" dur="0.5s" values="0%;5%" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeOpacity" begin="0s" dur="0.5s" values="1;0.5" calcMode="linear" repeatCount="indefinite" />
                            <animate attributeName="strokeWidth" begin="0s" dur="0.5s" values="10;0" calcMode="linear" repeatCount="indefinite" />
                        </circle> 
                    </g>
                </svg>
              </div>


              {this.props.deviceInputReader.state.flow===2?
                <Recorder glove={this} deviceInputReader={this.props.deviceInputReader}/>:
                (<div className="col-sm-7 h-100" > 
                    <div className="row frame h-100"> 
                      <MusicPlayer glove={this} deviceInputReader={this.props.deviceInputReader} ref="musicPlayer"/>
                    </div> 
                  </div>)
              }
                
           </div> 
              
        );
    


	}
} 


export class Recorder extends React.Component{

    render() {  
          let isRecording =  this.props.deviceInputReader.state.isRecording;
          return (
            <div className="col-sm-5 descriptionBox" > 
              <div className="row frame description scroll">
                <div className="col"> 
                  <p>Record new gestures by clicking the button and performing the gesture with your glove. Afterwards, You can test out these gestures in our music player! </p> 
                  <div className="row controlsGestures">
                    <div  className="col-12">
                      <div className="row">
                        <div className="col controlBtn">
                          <div onClick={this.props.glove.recordGesture('gesturePlay')} className={"btn "+(isRecording.status===true && isRecording.gesture==="gesturePlay"? "recording":"")}>
                            <svg className="svgIcon ico" width="30px" height="30px" viewBox="0 0 60 60">
                              <path d="M45.6,29.2l-22-15a1.18,1.18,0,0,0-1-.1,1,1,0,0,0-.6.9V45a1.05,1.05,0,0,0,.5.9.9.9,0,0,0,.5.1,1.42,1.42,0,0,0,.6-.2l22-15A.91.91,0,0,0,46,30,1.23,1.23,0,0,0,45.6,29.2ZM24,43.1V16.9L43.2,30Z" />
                              <path d="M30,0A30,30,0,1,0,60,30,30.09,30.09,0,0,0,30,0Zm0,58A28,28,0,1,1,58,30,28.08,28.08,0,0,1,30,58Z" />
                            </svg>
                            <svg  className="svgIcon rec" viewBox="0 0 60 60"   width="30px" height="30px">
                              <path d="M47,17c-7.168,0-13,5.832-13,13c0,4.634,2.444,8.698,6.104,11H19.896C23.556,38.698,26,34.634,26,30c0-7.168-5.832-13-13-13  S0,22.832,0,30s5.832,13,13,13h34c7.168,0,13-5.832,13-13S54.168,17,47,17z M2,30c0-6.065,4.935-11,11-11s11,4.935,11,11  s-4.935,11-11,11S2,36.065,2,30z M47,41c-6.065,0-11-4.935-11-11s4.935-11,11-11s11,4.935,11,11S53.065,41,47,41z" />
                            </svg>
                            <span>  {isRecording.status===true && isRecording.gesture==="gesturePlay"? "Recording":"Play / Stop"}</span> 
                          </div>
                            <svg onClick={this.props.glove.showGesture('gesturePlay')}  className={"successAnimation " +(this.props.glove.state.gesturePlay.length ===0? "": "animated")} viewBox="0 0 52 52" >
                              <circle className="successAnimation_circle" cx="26" cy="26" r="25"/>
                              <path className="successAnimation_check" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                            </svg>
                        </div>
                      </div>
                      <div className="row"> 
                        <div className="col controlBtn">
                          {/*<svg style={{opacity: this.props.glove.state.gestureNext.length >0? 1:0}} className="showGesture"  x="0px" y="0px" viewBox="0 0 59.2 59.2" > 
                            <path d="M51.062,21.561c-11.889-11.889-31.232-11.889-43.121,0L0,29.501l8.138,8.138c5.944,5.944,13.752,8.917,21.561,8.917
                              s15.616-2.972,21.561-8.917l7.941-7.941L51.062,21.561z M49.845,36.225c-11.109,11.108-29.184,11.108-40.293,0l-6.724-6.724
                              l6.527-6.527c11.109-11.108,29.184-11.108,40.293,0l6.724,6.724L49.845,36.225z"/>
                            <path d="M28.572,21.57c-3.86,0-7,3.14-7,7c0,0.552,0.448,1,1,1s1-0.448,1-1c0-2.757,2.243-5,5-5c0.552,0,1-0.448,1-1
                              S29.125,21.57,28.572,21.57z"/>
                            <path d="M29.572,16.57c-7.168,0-13,5.832-13,13s5.832,13,13,13s13-5.832,13-13S36.741,16.57,29.572,16.57z M29.572,40.57
                              c-6.065,0-11-4.935-11-11s4.935-11,11-11s11,4.935,11,11S35.638,40.57,29.572,40.57z"/>
                          </svg>*/}
                          <div onClick={this.props.glove.recordGesture('gestureNext')} className={"btn "+(isRecording.status===true && isRecording.gesture==="gestureNext"? "recording":"")}>
                            <svg className="svgIcon ico" width="30px" height="30px"  viewBox="0 0 57 39.97">
                              <path d="M56.6,27.7l-27-19a1.18,1.18,0,0,0-1-.1,1,1,0,0,0-.6.9V27.3L1.6,8.7a1.18,1.18,0,0,0-1-.1,1,1,0,0,0-.6.9v38a1.05,1.05,0,0,0,.5.9.75.75,0,0,0,.5.1,1.42,1.42,0,0,0,.6-.2L28,29.7V47.5a1.05,1.05,0,0,0,.5.9.75.75,0,0,0,.5.1,1.42,1.42,0,0,0,.6-.2l27-19a.91.91,0,0,0,.4-.8A1.23,1.23,0,0,0,56.6,27.7ZM2,45.6V11.4L26.3,28.5Zm28,0V11.4L54.3,28.5Z" transform="translate(0 -8.53)" />
                            </svg>
                            <svg  className="svgIcon rec" viewBox="0 0 60 60"   width="30px" height="30px">
                              <path d="M47,17c-7.168,0-13,5.832-13,13c0,4.634,2.444,8.698,6.104,11H19.896C23.556,38.698,26,34.634,26,30c0-7.168-5.832-13-13-13  S0,22.832,0,30s5.832,13,13,13h34c7.168,0,13-5.832,13-13S54.168,17,47,17z M2,30c0-6.065,4.935-11,11-11s11,4.935,11,11  s-4.935,11-11,11S2,36.065,2,30z M47,41c-6.065,0-11-4.935-11-11s4.935-11,11-11s11,4.935,11,11S53.065,41,47,41z" />
                            </svg>
                            <span> {isRecording.status===true && isRecording.gesture==="gestureNext"? "Recording":"NEXT SONG"}</span>
                          </div>
                          <svg onClick={this.props.glove.showGesture('gestureNext')} className={"successAnimation " +(this.props.glove.state.gestureNext.length ===0? "": "animated")} viewBox="0 0 52 52" >
                            <circle className="successAnimation_circle" cx="26" cy="26" r="25"/>
                            <path className="successAnimation_check" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                          </svg>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col controlBtn">
                          {/*<svg style={{opacity: this.props.glove.state.gesturePrev.length >0? 1:0}} className="showGesture"  x="0px" y="0px" viewBox="0 0 59.2 59.2" > 
                            <path d="M51.062,21.561c-11.889-11.889-31.232-11.889-43.121,0L0,29.501l8.138,8.138c5.944,5.944,13.752,8.917,21.561,8.917
                              s15.616-2.972,21.561-8.917l7.941-7.941L51.062,21.561z M49.845,36.225c-11.109,11.108-29.184,11.108-40.293,0l-6.724-6.724
                              l6.527-6.527c11.109-11.108,29.184-11.108,40.293,0l6.724,6.724L49.845,36.225z"/>
                            <path d="M28.572,21.57c-3.86,0-7,3.14-7,7c0,0.552,0.448,1,1,1s1-0.448,1-1c0-2.757,2.243-5,5-5c0.552,0,1-0.448,1-1
                              S29.125,21.57,28.572,21.57z"/>
                            <path d="M29.572,16.57c-7.168,0-13,5.832-13,13s5.832,13,13,13s13-5.832,13-13S36.741,16.57,29.572,16.57z M29.572,40.57
                              c-6.065,0-11-4.935-11-11s4.935-11,11-11s11,4.935,11,11S35.638,40.57,29.572,40.57z"/>
                          </svg>*/}
                          <div onClick={this.props.glove.recordGesture('gesturePrev')} className={"btn prev "+(isRecording.status===true && isRecording.gesture==="gesturePrev"? "recording":"")}> 
                            <svg className="svgIcon ico" width="30px" height="30px" viewBox="0 0 57 39.97">
                            <path d="M0,28.48a.91.91,0,0,0,.4.8l27,19a1.42,1.42,0,0,0,.6.2.75.75,0,0,0,.5-.1,1.05,1.05,0,0,0,.5-.9V29.68l26.4,18.6a1.42,1.42,0,0,0,.6.2.75.75,0,0,0,.5-.1,1.05,1.05,0,0,0,.5-.9v-38a1,1,0,0,0-.6-.9,1.18,1.18,0,0,0-1,.1L29,27.28V9.48a1,1,0,0,0-.6-.9,1.18,1.18,0,0,0-1,.1l-27,19A1.23,1.23,0,0,0,0,28.48Zm30.7,0L55,11.38v34.2Zm-28,0L27,11.38v34.2Z" transform="translate(0 -8.52)" />
                            </svg>
                           
                            <svg  className="svgIcon rec" viewBox="0 0 60 60"   width="30px" height="30px">
                              <path d="M47,17c-7.168,0-13,5.832-13,13c0,4.634,2.444,8.698,6.104,11H19.896C23.556,38.698,26,34.634,26,30c0-7.168-5.832-13-13-13  S0,22.832,0,30s5.832,13,13,13h34c7.168,0,13-5.832,13-13S54.168,17,47,17z M2,30c0-6.065,4.935-11,11-11s11,4.935,11,11  s-4.935,11-11,11S2,36.065,2,30z M47,41c-6.065,0-11-4.935-11-11s4.935-11,11-11s11,4.935,11,11S53.065,41,47,41z" />
                            </svg>

                            <span> {isRecording.status===true && isRecording.gesture==="gesturePrev"? "Recording":"PREV. SONG"}</span>
                          </div>
                          <svg onClick={this.props.glove.showGesture('gesturePrev')} className={"successAnimation " +(this.props.glove.state.gesturePrev.length ===0? "": "animated")} viewBox="0 0 52 52" >
                            <circle className="successAnimation_circle" cx="26" cy="26" r="25"/>
                            <path className="successAnimation_check" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                          </svg>
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
 
