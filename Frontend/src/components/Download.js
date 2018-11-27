import React from 'react';  
var JSZip = require("jszip");
var FileSaver = require('file-saver');

let conductiveThread = "";
let conductivePoints = "";
let insulationThread = "";

let conductiveThread2 = ""; 
let insulationThread2 = "";
   
export class Download extends React.Component{

  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);  
  }



  normalizePointInSVG (point, offset){
    let scaleFactor;  //1192 is the natural size of the pattern glove file
    let width = this.props.designer.state.width;
    width>1192? (scaleFactor = 1192/width) :
                (scaleFactor = width/1192); 
    let unit =((width*scaleFactor)/(140*scaleFactor));   
    return ((point*unit+(unit/2))/scaleFactor)+offset;
    
  }

  getConductiveLines(route,color,type,offset){  
      let points = '';
      let direction = ""; 
      let lastPoint =  route.coordinates[route.coordinates.length-1];

      for (let i=1; i<route.coordinates.length; i++){
        if(direction !== route.path[i]|| 
          direction !== route.path[i-2] ){ 
          points += this.normalizePointInSVG(route.coordinates[i-1].x, offset)+","+
                 this.normalizePointInSVG(route.coordinates[i-1].y,0)+" ";  
          direction = route.path[i]; 
        }
      }
      points += this.normalizePointInSVG(lastPoint.x, offset)+","+
                this.normalizePointInSVG(lastPoint.y,0)+" "; 
      
      let output=[];

      if(type=== "lines"){
        output = [" <polyline",
                      "points='"+points+"'",
                      "stroke='"+color+"'",
                      "stroke-width='1mm'",
                      "fill='none'/>",
                ].join(" "); 
      }else{
 
          output = ["<circle cx='"+this.normalizePointInSVG(route.coordinates[0].x, offset)+"'",
                        "cy='"+this.normalizePointInSVG(route.coordinates[0].y,0)+"'",
                        "r='3mm'", 
                        "fill='"+color+"'/>"
                    ].join(" ");
          
        
      }

    return output;
  }

  getInsulationLines(route,color,offset){  
      let points = '';
      let direction = "";  

      for (let i=2; i<route.coordinates.length; i++){
        if(direction !== route.path[i]|| 
          direction !== route.path[i-2] ){ 
          points += this.normalizePointInSVG(route.coordinates[i-1].x, offset)+","+
                 this.normalizePointInSVG(route.coordinates[i-1].y,0)+" ";  
          direction = route.path[i]; 
        }
      } 
      
      let output = [" <polyline",
                      "points='"+points+"'",
                      "stroke='"+color+"'",
                      "stroke-width='1.8mm'",
                      "fill='none'/>"].join(" "); 
    return output;
  }
 
 

  componentDidMount(){ 
 


     conductiveThread = "";
     conductivePoints = "";
     insulationThread = "";

     conductiveThread2 = ""; 
     insulationThread2 = "";
    let routes = this.props.designer.state.routes || [];
    let component = this;  
    let circleThumb = ["<circle cx='329' ",
                      "cy='570' ",
                      "r='8mm' ", 
                      "fill='#ec971f'/>",
                      ].join(" ");

    let pattern = `<?xml version="1.0" encoding="utf-8"?>
    <svg version="1.1"   xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 665 842" style="enable-background:new 0 0 665 842;" xml:space="preserve">
        <rect style="opacity:0;fill:#FFFFFF;stroke:#FFFFFF;stroke-miterlimit:10;" width="665" height="842"/>`

    let handStrock = `<path d="M134.2,691.8" transform="translate(0.75 0.75)" style="fill:#fff;stroke:#000;stroke-miterlimit:10;stroke-width:2px"/><path d="M287,226.5" transform="translate(0.75 0.75)" style="fill:#fff;stroke:#000;stroke-miterlimit:10;stroke-width:3px"/><path d="M134.2,691.8" transform="translate(0.75 0.75)" style="fill:none;stroke:#231f20;stroke-miterlimit:10"/><path d="M604.4,825s32.7-200.6,37.2-264c4.7-65.3,2-388.9,2-392.1,0-24.2-15.3-44-34.1-44-19.31,0-36.1,19.79-36.1,44V312l-2.85,3.5L567.7,312V97.2c0-24.3-17-44-38-44s-38,19.7-38,44l-.2,171.7-2.75,3-2.75-3V68.9c0-24.2-14.37-44-37.7-44-21,0-38,19.7-38,44v200l-2.7,3-2.9-3V97.2c0-24.3-17-44-38-44a35.41,35.41,0,0,0-24,9.8,43.36,43.36,0,0,0-11.6,18.8,45,45,0,0,0-11.6-18.7,34.88,34.88,0,0,0-24-9.9c-21,0-38,19.7-38,44V269.4l-2.85,3.2-2.85-3.2V68.9c0-24.3-17-44-38-44s-38,19.7-38,44V269.3l-2.85,3.2-2.85-3.2V97.2c0-24.3-17-44-38-44s-38,19.7-38,44V312.9l-2.8,3.2-2.8-3.2V169a49.72,49.72,0,0,0-10.4-31c-6.6-8.3-15.6-13-24.7-13-19.1,0-35.2,20.1-35.2,44,0,3.2-3.2,319.4,2,392,4.6,63.5,37.2,264,37.2,264Z" transform="translate(0.75 0.75)" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:2px"/>`;
    let oval = `<ellipse cx="290.95" cy="469.45" rx="37.9" ry="97.6" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:2px"/>`
    

    let pattern2 = `<?xml version="1.0" encoding="utf-8"?>
    <svg version="1.1"   xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 665 842" style="enable-background:new 0 0 665 842;" xml:space="preserve"> 
    <rect style="fill:#FFFFFF;fill-opacity:0;" width="665" height="842"/>
    <path style="fill:none;stroke:#231F20;stroke-miterlimit:10;" d="M134.9,692.6"/>
    <path style="fill:none;stroke:#000000;stroke-width:1.5;stroke-miterlimit:10;" d="M208.1,696.5c0,0,26.7-5.3,37.9-13.3
      c0.5-0.4,1-0.8,1.4-1.2c36.6-32,36.4-100.3,55.1-130.3c4.4-7.3,10.8-13.3,18.3-17.3c6.1-3,12.8-4.5,19.6-4.3
      c16.7,0.3,32.2,8.5,35.8,10c3.6-1.4,19.2-9.7,35.8-10c6.8-0.2,13.5,1.2,19.6,4.3c7.5,4,13.9,10,18.3,17.3
      c18.7,30,18.5,98.3,55.1,130.3c0.5,0.4,1,0.8,1.4,1.2c11.1,8,37.9,13.3,37.9,13.3c-3.4,42.8-53.1,125.9-168.1,127.6l0,0
      C365.3,824.3,232.8,821.4,208.1,696.5z"/>
      <path style="fill:#5B09DB;" d="M431.4,157.4h-8.7l-3,7.6h-1.7l8.6-21.5h1l8.4,21.5h-1.7L431.4,157.4z M423.3,156h7.7l-2.9-7.7
        c-0.2-0.6-0.5-1.4-0.9-2.5c-0.3,0.9-0.6,1.8-0.9,2.5L423.3,156z"/>
      <path style="fill:#5B09DB;" d="M420,233.3h5.9c2.6,0,4.6,0.4,5.8,1.3s1.9,2.3,1.9,4.1c0,1.2-0.4,2.3-1.1,3.1s-1.9,1.4-3.3,1.6v0.1
        c1.7,0.3,3,0.8,3.8,1.6c0.8,0.8,1.2,2,1.2,3.4c0,2-0.7,3.5-2,4.6s-3.2,1.6-5.6,1.6H420V233.3z M421.5,242.8h4.7c2,0,3.5-0.3,4.4-1
        c0.9-0.7,1.4-1.7,1.4-3.1s-0.5-2.5-1.5-3.1c-1-0.6-2.6-1-4.6-1h-4.3V242.8z M421.5,244.1v9.2h5c4,0,5.9-1.6,5.9-4.8
        c0-2.9-2.1-4.4-6.3-4.4H421.5z"/>
      <path style="fill:#5B09DB;" d="M429.5,326c-2.7,0-4.8,0.9-6.3,2.6s-2.3,4.1-2.3,7.1c0,3.1,0.7,5.4,2.2,7.1s3.5,2.5,6.2,2.5
        c1.8,0,3.4-0.2,5-0.7v1.3c-1.4,0.5-3.2,0.7-5.3,0.7c-3,0-5.4-1-7.1-2.9s-2.6-4.7-2.6-8.1c0-2.2,0.4-4.1,1.2-5.8s2-2.9,3.6-3.8
        c1.5-0.9,3.3-1.4,5.4-1.4c2.1,0,4,0.4,5.6,1.2l-0.6,1.3C432.8,326.4,431.2,326,429.5,326z"/>
      <path style="fill:none;stroke:#000000;stroke-width:1.5;stroke-miterlimit:10;" d="M139.2,545.3c0,0,8.5-23.6,29.3-38.6
        l145.9-114.4l25,34.6L185.1,529.7C164.3,544.7,139.2,545.3,139.2,545.3z"/>
      <path style="fill:none;stroke:#000000;stroke-width:1.5;stroke-miterlimit:10;" d="M539.5,255.9c0,0-25,0.7-45.8,15.7L314.4,392.4
        l25,34.6l170.9-132.5C531,279.4,539.5,255.9,539.5,255.9z"/>
      <path style="fill:none;stroke:#000000;stroke-width:1.5;stroke-miterlimit:10;" d="M539.6,161.4c0,0-25,0.7-45.8,15.7L339.4,279.8
        l25,34.6L510.4,200C531,184.9,539.6,161.4,539.6,161.4z"/>
      <path style="fill:none;stroke:#000000;stroke-width:1.5;stroke-miterlimit:10;" d="M139.3,450.8c0,0,8.5-23.6,29.3-38.6
        l170.9-132.5l25,34.6L185.1,435.2C164.3,450.1,139.3,450.8,139.3,450.8z"/>
      <path style="fill:none;stroke:#000000;stroke-width:1.5;stroke-miterlimit:10;" d="M172.6,339.2c0,0,11.2-25.5,35.1-42.8
        l169.3-131.3l25,34.6L224.2,319.4C200.3,336.6,172.6,339.2,172.6,339.2z"/>
      <path style="fill:none;stroke:#000000;stroke-width:1.5;stroke-miterlimit:10;" d="M539.6,73.8c0,0-25,0.7-45.8,15.7l-116.9,75.6
        l25,34.6l108.4-87.3C531,97.4,539.6,73.8,539.6,73.8z"/>`;
 

    for (var i = 0; i < routes.length; i++) {

      if(routes[i].id !==1){ 
        conductiveThread += this.getConductiveLines(routes[i].data,"#ff004e","lines",0);
        if(routes[i].id !==2){
          conductivePoints += this.getConductiveLines(routes[i].data,"#ec971f","points",0);
        }
        insulationThread += this.getInsulationLines(routes[i].data,"#17c0b7",0); 
      }else{
        conductiveThread2 += this.getConductiveLines(routes[i].data,"#ff004e","lines", -620); 
        insulationThread2 += this.getInsulationLines(routes[i].data,"#17c0b7", -620); 
      }
    }
    conductiveThread = pattern+handStrock+oval+conductiveThread+"</svg>";  
    var conductiveLayerImg = component.refs.conductiveLayer;
    conductiveLayerImg.setAttribute( "src", "data:image/svg+xml,"+ encodeURIComponent(conductiveThread) ); 
    conductiveLayerImg.onload = function(){ 
      conductiveLayerImg.width = 665;
      conductiveLayerImg.height = 842; 
    }  
    

    insulationThread = pattern+insulationThread+conductivePoints+"</svg>";
    var insulationLayerImg = component.refs.insulationLayer;
    insulationLayerImg.setAttribute( "src", "data:image/svg+xml,"+ encodeURIComponent(insulationThread) ); 
    insulationLayerImg.onload = function(){ 
      insulationLayerImg.width = 665;
      insulationLayerImg.height = 842; 
    } 

    conductiveThread2 = pattern2+conductiveThread2+"</svg>";  
    var conductiveLayerImg2 = component.refs.conductiveLayer2;
    conductiveLayerImg2.setAttribute( "src", "data:image/svg+xml,"+ encodeURIComponent(conductiveThread2) ); 
    conductiveLayerImg2.onload = function(){ 
      conductiveLayerImg2.width = 665;
      conductiveLayerImg2.height = 842; 
    }  

    insulationThread2 = pattern+insulationThread2+circleThumb+"</svg>";
    var insulationLayerImg2 = component.refs.insulationLayer2;
    insulationLayerImg2.setAttribute( "src", "data:image/svg+xml,"+ encodeURIComponent(insulationThread2) ); 
    insulationLayerImg2.onload = function(){ 
      insulationLayerImg2.width = 665;
      insulationLayerImg2.height = 842; 
 
    }  
  } 

   

  handleClick(){    
    var zip = new JSZip();      
    zip.file("1.A Glove - Insulation File.svg", conductiveThread ); 
    zip.file("1.B Glove - Conductive File.svg", insulationThread );
    zip.file("2.A Thumb - Insulation File.svg", conductiveThread2 ); 
    zip.file("2.B Thumb - Conductive File.svg", insulationThread2 );
    zip.generateAsync({type:"blob"}).then(function (blob) {  
         FileSaver.saveAs(blob, "PatternFiles.zip");                          
    }, function (err) { 
    
    });
  }
 

	render() {   
     
    
         
        return (  
           
              <div className="col" id="step-download"  >
                <div className="row"> 
                    <a className="downloadBtn float-right" onClick={this.handleClick} style={{margin: "0px auto"}}>
                      <img alt="download" src={require("../img/downloadBtn.svg")}/>
                      <p>DOWNLOAD</p>
                    </a>  
                </div>
                <div className="row marginTop25">

                  <div className="col-md-6">
                    <div className="ribbon-box">
                      <span className="ribbon"><span>Glove Embroidery Files</span></span>
                      <div className="ribbon-box-inside">
                        <div className="fileA layer">
                          <div className="title">Glove - Conductive File</div>
                          <img alt="" ref="conductiveLayer"/>
                        </div>
                        <div className="fileB layer down">
                          <div className="title">Glove - Insulation File</div>
                          <img alt="" ref="insulationLayer" className="transparency"/>
                        </div>
                        <div className="isoHoop">
                          <img alt="" src={require("../img/isometricHoop.svg")}/>
                        </div>
                        <div className="hoop">
                          <span>400mm <br/>x <br/>260mm</span>
                          <img alt="" src={require("../img/hoop.svg")}/>
                        </div>
                      </div>
                    </div> 
                  </div>

                  <div className="col-md-6">
                    <div className="ribbon-box">
                      <span className="ribbon"><span>Thumb Embroidery Files</span></span>
                      <div className="ribbon-box-inside">
                        <div className="fileA layer">
                          <div className="title">Thumb - Conductive File</div>
                          <img alt="" ref="conductiveLayer2" />
                        </div>
                        <div className="fileB layer down">
                          <div className="title">Thumb - Insulation File</div>
                          <img alt="" ref="insulationLayer2" className="transparency"/>
                        </div>
                        <div className="isoHoop scale">
                          <img alt="" src={require("../img/isometricHoop.svg")}/>
                        </div>
                        <div className="hoop">
                          <span>255mm <br/>x <br/>145mm</span>
                          <img alt="" src={require("../img/hoop.svg")}/>
                        </div>
                      </div>
                    </div> 
                  </div>



{/*                      <div className="col-3">
                        <div className="ribbon-box">
                          <span className="ribbon"><span>1.a</span></span>
                          <div className="ribbon-box-inside">
                            <div className="img">
                              <div className="titleFile">Glove Conductive Lines</div>
                              <img alt="" ref="conductiveLayer" id="conductiveLayer" />
                            </div>
                            <div className="hoop">
                              <span>400mm <br/>x <br/>260mm</span>
                              <img alt="" src={require("../img/hoop.svg")}/>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-3">
                        <div className="ribbon-box">
                          <span className="ribbon"><span>1.b</span></span>
                          <div className="ribbon-box-inside"> 
                            <div className="img">
                              <div className="titleFile">Glove Insulation Lines</div>
                              <img alt="" ref="insulationLayer" id="insulationLayer" />
                            </div>
                            <div className="hoop">
                              <span>400mm <br/>x <br/>260mm</span>
                              <img alt="" src={require("../img/hoop.svg")}/>
                            </div>
                          </div>
                        </div>
                      </div>
                   
                      <div className="col-3">
                        <div className="ribbon-box">
                          <span className="ribbon"><span>2.a</span></span>
                          <div className="ribbon-box-inside">
                              <div className="img">
                                <div className="titleFile">Thumb Conductive Lines</div>
                                <img alt="" ref="conductiveLayer2" id="conductiveLayer2" />
                              </div>
                              <div className="hoop">
                                <span>255mm <br/>x <br/>145mm</span>
                                <img alt="" src={require("../img/hoop.svg")}/>
                              </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-3">
                        <div className="ribbon-box">
                          <span className="ribbon"><span>2.b</span></span>
                          <div className="ribbon-box-inside">
                            <div className="img">
                              <div className="titleFile">Thumb Insulation Lines</div>
                              <img alt="" ref="insulationLayer2" id="insulationLayer2" />
                            </div>
                            <div className="hoop">
                              <span>255mm <br/>x <br/>145mm</span>
                              <img alt="" src={require("../img/hoop.svg")}/>
                            </div>
                          </div>
                        </div>
                      </div>*/}
                    
                   
                </div>
                <div className="row h-100 " style={{margin: 15+"px" , marginTop: 60+"px" , marginBottom: 60+"px"}}>
                  <div className="col">
                    <video width="100%" height="auto" controls>
                      <source src={require('../audio/SG Maker.mp4')} type="video/mp4" />  
                    </video>
                  </div>
                </div>
              </div>  
            
        );
	}
} 

