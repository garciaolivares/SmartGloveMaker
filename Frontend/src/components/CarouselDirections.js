import React from 'react'; 
import '../css/carousel.css'; 
import Slider  from 'react-slick'; 
 

function SampleNextArrow(props) {
  const {className, style, onClick} = props
  return (
    <a
      className={className}
      style={{...style}}
      onClick={onClick}
    >
      <img alt="Back Arrow" src={require('../img/navNext.svg')} />
    </a>
  );
}

function SamplePrevArrow(props) {
  const {className, style, onClick} = props;
  return (
    <a
      className={className}
      style={{...style}}
      onClick={onClick}
    >
      <img alt="Next Arrow" src={require('../img/navPrev.svg')} />
    </a>
  );
}


export  class Carousel extends React.Component {  

  constructor(props) {
     super(props);
     this.state = {
        activeSlide:0,
     }
     this.slider = React.createRef();
      this.myRef = React.createRef();
   }

  render (){ 
    let component = this;
    var settings = {
        customPaging: function(i) {
              switch(i){
                
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7: 
                case 8: 
                case 9: 
                case 10: 
                        return (
                          <a>
                            <span className="stepNumber">{i}</span>
                            <img alt={"Step "+i} style={{width:"90%"}} src={require("../img/directions/thumbnails/thumbnail"+(i)+".png")} />
                          </a>
                        );  
               
                default: return (
                          <a hidden={true}>
                            
                          </a>
                        ); 
              }
                
         },

         beforeChange: function(oldIndex, newIndex) {  
          switch(newIndex){
            case 0: component.props.directions.setState({title: "Tools & materials you will need"});
                    break;
            case 1: component.props.directions.setState({title: (newIndex)+ ". Identify glove parts"});
                    break;
            case 2: component.props.directions.setState({title: (newIndex)+ ". Apply fusible interfacing"});
                    break;
            case 3: component.props.directions.setState({title: (newIndex)+ ". Sew laterals"});
                    break;
            case 4: component.props.directions.setState({title: (newIndex)+ ". Fold the glove and sew"});
                    break;
            case 5: component.props.directions.setState({title: (newIndex)+ ". Sew up the thumb"});
                    break;
            case 6: component.props.directions.setState({title: (newIndex)+ ". Attach the thumb to the glove"});
                    break;
            case 7: component.props.directions.setState({title: (newIndex)+ ". Flip the glove"});
                    break;
            case 8: component.props.directions.setState({title: (newIndex)+ ". Place the lilypad"});
                    break;
            case 9: component.props.directions.setState({title: (newIndex)+ ". Sew buttons to pins"});
                    break;
            case 10: component.props.directions.setState({title: (newIndex)+ ". Upload arduino code"});
                    break;
            default:
                                     
          }
        },
         dots: this.state.activeSlide === 0? false:true,
         infinite: false, 
         slidesToShow: 1, 
         useTransform: true,
         accessibility:false,
         initialSlide: this.state.activeSlide,
         slidesToScroll: 1,
         adaptiveHeight: true,
         nextArrow: <SampleNextArrow />,
         prevArrow: <SamplePrevArrow />,
         afterChange: (current) => this.setState({ activeSlide: current }),
         resposive: [ { breakpoint: 768, settings: { slidesToShow: 1} }, { breakpoint: 1024, settings: { slidesToShow: 2 } }, { breakpoint: 100000, settings: 'unslick' } ]
    };
    
     
    return ( 
      <div id="wrapperSlider" className='h-100'>
          
        <Slider ref={this.slider} {...settings}> 
            <div> 
              <div  className="frame row" style={{margin: "0px", width: "100%", height: "calc(100% - 60px)"}}>
                
                <div className="col h-100">
                  <div className="row h-50">
                    <div className="col-3">
                      <img alt="" className="materials" src={require("../img/materials/interfacing.png")} />
                      <center>Fusible Interfacing</center>
                    </div>
                    <div className="col-3">
                      <img alt="" className="materials" src={require("../img/materials/iron.png")} />
                      <center>Iron</center>
                    </div>
                    <div className="col-3">
                      <img alt="" className="materials" src={require("../img/materials/towel.png")} />
                      <center>Towel</center>
                    </div>
                    <div className="col-3">
                      <img alt="" className="materials" src={require("../img/materials/needle.png")} />
                      <center>Needle</center>
                    </div>
                  </div>
                  <div className="row h-50">
                     <div className="col-3">
                      <img alt="" className="materials" src={require("../img/materials/conductive.png")} />
                      <center>Conductive Thread</center>
                    </div>
                    <div className="col-3">
                      <img alt="" className="materials" src={require("../img/materials/thread.png")} />
                      <center>Thread</center>
                    </div>
                    <div className="col-3">
                      <img alt="" className="materials" src={require("../img/materials/scissors.png")} />
                      <center>Scissors</center>
                    </div>
                    <div className="col-3">
                      <img alt="" className="materials" src={require("../img/materials/lilypad.png")} />
                      <center>Arduino LilyPad</center>
                    </div>
                  </div> 
                </div>  
              </div> 
            </div>

            <div> 
              <div  className="row" style={{margin: "0px", width: "100%", height: "calc(100% - 60px)"}}>
                <div className="col">  
                  <img alt="" className="vector-responsive" src={require("../img/directions/directions_step1.svg")}/>
                </div>  
              </div> 
            </div>

            <div> 
              <div  className="row" style={{margin: "0px", width: "100%", height: "calc(100% - 60px)"}}>
                <div className="col-7">  
                  <img alt="" className="vector-responsive" src={require("../img/directions/directions_step2.svg")}/>
                </div> 
                <div className="col-5">
                  <div className="descriptionBox scroll">  
                    <div className="description"> 
                        <ol type="A">
                          <li>Place the glove facing down on a flat surface.</li>
                          <li>Cut a piece of fusible interfacing that covers perfectly the glove and <b>
                            <i> place the <span>sticky side</span> down.</i></b></li>
                          <li>On top of it, place a towel or another heat resistant fabric to avoid burning the interfacing.</li>
                          <li>Iron at medium temperature until the interfacing is completely adhered, <b><i>this proccess will take around 2 minutes.</i></b></li> 
                        </ol>  
                    </div>
                  </div> 
                </div>  
              </div> 
            </div>

            <div> 
              <div className="row" style={{margin: "0px", width: "100%", height: "calc(100% - 60px)"}}>
                <div className="col-7">  
                  <img alt="" className="vector-responsive" src={require("../img/directions/directions_step3.svg")}/>
                </div> 
                <div className="col-5">
                  <div className="descriptionBox scroll"> 
                    <div className="description">
                      <ol type="A">
                        <li>Cut all glove parts around the edges leaving approximately 1mm.</li> 
                        <li>In order to keep aesthetics, <b><i>start the stitching on the back side of the glove.</i></b></li>
                      </ol> 
                    </div> 
                  </div>   
                </div>  
              </div> 
            </div>

            <div> 
              <div className="row" style={{margin: "0px", width: "100%", height: "calc(100% - 60px)"}}>
                <div className="col-7">  
                  <img alt="" className="vector-responsive" src={require("../img/directions/directions_step4.svg")}/>
                </div> 
                <div className="col-5">
                  <div className="descriptionBox scroll"> 
                    <div className="description">
                      
                         Fold the glove and start stitching from the tip of the little finger to around 5cm to the end the wrist.
                       
                    </div> 
                  </div>   
                </div> 
              </div> 
            </div>

            <div> 
              <div className="row" style={{margin: "0px", width: "100%", height: "calc(100% - 60px)"}}>
                <div className="col-7">  
                  <img alt="" className="vector-responsive" src={require("../img/directions/directions_step5.svg")}/>
                </div>
                <div className="col-5">
                  <div className="descriptionBox scroll"> 
                    <div className="description"> 
                        Fold the thumb leaving the back part exposed.
                    </div> 
                  </div>   
                </div>  
              </div> 
            </div>

            <div> 
              <div className="row" style={{margin: "0px", width: "100%", height: "calc(100% - 60px)"}}>
                <div className="col-7">  
                  <img alt="" className="vector-responsive" src={require("../img/directions/directions_step6.svg")}/>
                </div>
                <div className="col-5">
                  <div className="descriptionBox scroll"> 
                    <div className="description"> 
                        Align the ellipses so that the thumb is pointing upwards, after that start sewing.
                    </div> 
                  </div>   
                </div>  
              </div> 
            </div> 

            <div> 
              <div className="row" style={{margin: "0px", width: "100%", height: "calc(100% - 60px)"}}>
                <div className="col-7">  
                  <img alt="" className="vector-responsive" src={require("../img/directions/directions_step7.svg")}/>
                </div>
                <div className="col-5">
                  <div className="descriptionBox scroll"> 
                    <div className="description"> 
                        At this point the construction of your glove is done, flip your glove so the front side is visible.
                    </div> 
                  </div>   
                </div> 
                
              </div> 
            </div>

            <div> 
              <div className="row" style={{margin: "0px", width: "100%", height: "calc(100% - 60px)"}}>
                <div className="col-7">  
                  <img alt="" className="vector-responsive" src={require("../img/directions/directions_step8.svg")}/>
                </div> 
                <div className="col-5">
                  <div className="descriptionBox scroll">
                    <div className="description">
                      It is important to identify the correct position of our Arduino LilyPad. Buttons are designed in a way that the Arduino LilyPad must be placed with a rotation of 90 degree.<br/><br/>
                      <ol type="A">
                        <li>Place the Arduino Arduino LilyPad in the correct position.</li>
                      </ol>
                    </div>
                  </div>
                
                </div>  
              </div> 
            </div> 

            <div> 
              <div className="row" style={{margin: "0px", width: "100%", height: "calc(100% - 60px)"}}>
                <div className="col-7">  
                  <img alt="" className="vector-responsive" src={require("../img/directions/directions_step9.svg")}/>
                </div> 
                <div className="col-5">
                  <div className="descriptionBox scroll"> 
                    <div className="description">
                      <ol type="A">
                        <li>Thread a needle with conductive yard. </li>
                        <li>Sew each button line to its nearest pin on the Arduino LilyPad. </li>
                        <li>Finally, stitch the line that leads from voltage to the thumb. </li>
                      </ol>
                    </div>
                  </div>
                
                </div>  
              </div> 
            </div>

            <div> 
              <div className="row" style={{margin: "0px", width: "100%", height: "calc(100% - 60px)"}}>
                <div className="col-7">  
                  <img alt="" className="vector-responsive" src={require("../img/gloveIso.png")}/>
                </div> 
                <div className="col-5">
                  <div className="descriptionBox scroll"> 
                    <div className="description">
                      You can find an Arduino demo code in the link bellow  <br/>
                        <center>
                        <a className="downloadBtn" href={require("../arduino/sampleSmartGloveTemplate.rar")} download>
                          <img alt="download" src={require("../img/arduino.svg")} />
                          <p>DOWNLOAD ARDUINO CODE</p>
                        </a>
                        </center> 
                      <ol type="A">
                        <li>To upload the code, it is necessary to have installed the <a href="https://www.arduino.cc/en/Main/Software" target="_blank" rel="noopener noreferrer">Arduino software</a></li> 
                      </ol>
                    </div>
                  </div> 
                </div>  
              </div> 
            </div> 
        </Slider>
      </div>
    );
  }
};    



 