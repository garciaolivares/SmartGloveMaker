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
 
  getConductiveLines(route,color,offset){    
      let  output = [" <line",
                      "x1='"+(parseInt(route.x1) + offset)+"'",
                      "y1='"+route.y1+"'",
                      "x2='"+(parseInt(route.x2) + offset)+"'",
                      "y2='"+route.y2+"'",
                      "stroke='"+color+"'",
                      "stroke-width='1mm'",
                      "fill='none'/>",
                ].join(" ");  
    return output;
  }

  getConductiveButtons(button,color,type,offset){   
      let output = ["<circle cx='"+button.startPoint[0]+"'",
                        "cy='"+button.startPoint[1]+"'",
                        "r='3mm'", 
                        "fill='"+color+"'/>"
                    ].join(" "); 
    return output;
  }

  getInsulationLines(route,color,offset){   
      let output = [" <line",
                      "x1='"+(parseInt(route.x1) + offset)+"'",
                      "y1='"+route.y1+"'",
                      "x2='"+(parseInt(route.x2) + offset)+"'",
                      "y2='"+route.y2+"'",
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
    let routes = this.props.designer.state.wires || [];
    let buttons = this.props.designer.state.buttonsPosition || [];
    let component = this;  
    let circleThumb = ["<circle cx='300' ",
                      "cy='560' ",
                      "r='8mm' ", 
                      "fill='#ec971f'/>",
                      ].join(" ");

    let pattern = `<?xml version="1.0" encoding="utf-8"?>
    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 630.2 802.2"><path d="M270.8,202.4" transform="translate(1.35 0.15)" style="fill:#fff;stroke:#000;stroke-miterlimit:10;stroke-width:3px"/><path d="M588.2,800.8l1.4-8.7c.9-5.6,2.2-13.7,3.8-23.6s3.4-21.6,5.4-34.5,4.1-26.9,6.3-41.4,4.4-29.5,6.5-44.4,4.2-29.5,6-43.4,3.5-26.9,4.8-38.5,2.3-21.6,2.9-29.5c.6-8.2,1.1-20.4,1.4-35.5s.7-33.1.9-52.9.3-41.3.4-63.6.1-45.1.1-67.4-.1-44.2-.2-64.5-.2-38.9-.3-54.8-.2-29.1-.2-38.3-.1-14.7-.1-15.1a50.6,50.6,0,0,0-.7-8.8,54.55,54.55,0,0,0-2-8.2,62.14,62.14,0,0,0-3.1-7.5,40.12,40.12,0,0,0-4.2-6.5,36.79,36.79,0,0,0-5-5.4,32.2,32.2,0,0,0-5.8-4.1,29.64,29.64,0,0,0-6.4-2.6,26.11,26.11,0,0,0-6.9-.9,28.2,28.2,0,0,0-7.1.9,34.36,34.36,0,0,0-6.7,2.6,31,31,0,0,0-6.1,4.1,45.89,45.89,0,0,0-5.4,5.4,41.79,41.79,0,0,0-4.5,6.5,42.77,42.77,0,0,0-3.4,7.5,54.91,54.91,0,0,0-2.2,8.2,50.52,50.52,0,0,0-.8,8.8V287.9l-.4.4-.4.4-.4.4-.4.4-.4.4-.4.4-.4.4-.4.4-.4-.4-.3-.4-.4-.4-.3-.4-.3-.4-.4-.4-.3-.4-.3-.4V73.1a52.6,52.6,0,0,0-.8-8.9,56.22,56.22,0,0,0-2.2-8.3,39.47,39.47,0,0,0-3.5-7.5,44.49,44.49,0,0,0-4.6-6.5,40.75,40.75,0,0,0-5.6-5.4,39.59,39.59,0,0,0-6.5-4.1,37.91,37.91,0,0,0-7.1-2.6,32.47,32.47,0,0,0-7.7-.9,32.7,32.7,0,0,0-14.8,3.5,37.27,37.27,0,0,0-6.5,4.1,40.75,40.75,0,0,0-5.6,5.4,42.38,42.38,0,0,0-4.6,6.5,51.84,51.84,0,0,0-3.5,7.5,46.07,46.07,0,0,0-2.2,8.3,51.68,51.68,0,0,0-.8,8.9v172l-.4.4-.3.4-.4.4-.4.4-.4.4-.3.4-.4.4-.4.4-.4-.4-.3-.4-.4-.4-.4-.4-.4-.4-.3-.4-.4-.4-.4-.4V45.1a50.6,50.6,0,0,0-.7-8.8,51.7,51.7,0,0,0-1.9-8.2,49.74,49.74,0,0,0-3.2-7.5,48.78,48.78,0,0,0-4.3-6.5,34.47,34.47,0,0,0-5.4-5.4,33.15,33.15,0,0,0-6.4-4.1A36,36,0,0,0,439.8,2a37,37,0,0,0-8.3-.9,32.7,32.7,0,0,0-14.8,3.5,41.41,41.41,0,0,0-6.5,4.1,35.77,35.77,0,0,0-5.6,5.4,42.38,42.38,0,0,0-4.6,6.5,49.14,49.14,0,0,0-3,7,44,44,0,0,0-2.2,8.3,51.68,51.68,0,0,0-.8,8.9v200l-.3.4-.3.4-.3.4-.3.4-.3.4-.5.2-.3.4-.3.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4V73.1a52.6,52.6,0,0,0-.8-8.9,56.21,56.21,0,0,0-2.2-8.3,39.48,39.48,0,0,0-3.5-7.5,44.49,44.49,0,0,0-4.6-6.5,40.75,40.75,0,0,0-5.6-5.4,39.59,39.59,0,0,0-6.5-4.1,37.91,37.91,0,0,0-7.1-2.6,32.47,32.47,0,0,0-7.7-.9c-1.1,0-2.2.1-3.3.2a30.62,30.62,0,0,0-3.2.5c-1.1.2-2.1.5-3.2.8s-2.1.7-3.1,1.1-2,.9-3,1.4-1.9,1.1-2.9,1.7-1.9,1.3-2.8,2a27.46,27.46,0,0,0-2.6,2.2c-.7.6-1.3,1.3-1.9,1.9s-1.2,1.4-1.8,2.1-1.1,1.4-1.7,2.2-1,1.5-1.5,2.3-1,1.6-1.4,2.4-.9,1.7-1.2,2.5-.8,1.7-1.1,2.6-.7,1.8-.9,2.7c-.3-.9-.6-1.8-1-2.7a20.29,20.29,0,0,0-1.1-2.6,19.65,19.65,0,0,0-1.3-2.5c-.4-.8-.9-1.6-1.4-2.4s-1-1.6-1.5-2.3-1.1-1.5-1.7-2.2l-1.8-2.1a17,17,0,0,0-1.9-1.9,33.25,33.25,0,0,0-5.4-4.3,27.55,27.55,0,0,0-2.9-1.7c-1-.5-2-1-3-1.4s-2.1-.8-3.1-1.1a29.92,29.92,0,0,0-3.2-.8c-1.1-.2-2.1-.4-3.2-.5s-2.2-.2-3.3-.2A32.7,32.7,0,0,0,264,32.3a37.27,37.27,0,0,0-6.5,4.1,40.75,40.75,0,0,0-5.6,5.4,42.38,42.38,0,0,0-4.6,6.5,51.83,51.83,0,0,0-3.5,7.5,46.07,46.07,0,0,0-2.2,8.3,51.68,51.68,0,0,0-.8,8.9V245l-.4.4-.4.4-.4.4-.4.4-.4.4-.4.4-.4.4-.4.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4V44.8a52.6,52.6,0,0,0-.8-8.9,56.2,56.2,0,0,0-2.2-8.3,39.48,39.48,0,0,0-3.5-7.5,44.49,44.49,0,0,0-4.6-6.5,40.75,40.75,0,0,0-5.6-5.4,39.59,39.59,0,0,0-6.5-4.1A32.7,32.7,0,0,0,196.4.6a32.47,32.47,0,0,0-7.7.9,33.38,33.38,0,0,0-7.1,2.6,41.41,41.41,0,0,0-6.5,4.1,35.77,35.77,0,0,0-5.6,5.4,42.38,42.38,0,0,0-4.6,6.5,51.83,51.83,0,0,0-3.5,7.5,46.07,46.07,0,0,0-2.2,8.3,51.68,51.68,0,0,0-.8,8.9V245.2l-.4.4-.4.4-.4.4-.4.4-.4.4-.4.4-.4.4-.4.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4V73.1a52.6,52.6,0,0,0-.8-8.9,56.2,56.2,0,0,0-2.2-8.3,39.48,39.48,0,0,0-3.5-7.5,44.49,44.49,0,0,0-4.6-6.5,40.75,40.75,0,0,0-5.6-5.4,39.59,39.59,0,0,0-6.5-4.1,37.91,37.91,0,0,0-7.1-2.6,33.39,33.39,0,0,0-15.4,0,33.38,33.38,0,0,0-7.1,2.6,37.27,37.27,0,0,0-6.5,4.1,40.75,40.75,0,0,0-5.6,5.4,42.38,42.38,0,0,0-4.6,6.5A51.83,51.83,0,0,0,79,55.9a46.07,46.07,0,0,0-2.2,8.3,51.68,51.68,0,0,0-.8,8.9v216l-.3.4-.3.4-.3.4-.4.4-.3.4-.3.4-.3.4-.4.4-.3-.4-.3-.4-.3-.4-.4-.4-.3-.4-.3-.4-.3-.4-.4-.4v-144c0-1.4-.1-2.9-.2-4.3s-.3-2.8-.5-4.2-.5-2.8-.8-4.1a26.43,26.43,0,0,0-1.2-4,31.21,31.21,0,0,0-1.5-3.9,25.28,25.28,0,0,0-1.8-3.7,40.5,40.5,0,0,0-2.1-3.5,34.33,34.33,0,0,0-2.4-3.3,35.84,35.84,0,0,0-2.6-2.9,34.46,34.46,0,0,0-2.8-2.6,33,33,0,0,0-3-2.2c-1.1-.7-2-1.3-3.1-1.9s-2.1-1-3.2-1.5a21.29,21.29,0,0,0-3.3-1.1,18.57,18.57,0,0,0-3.4-.6c-1.1-.1-2.3-.2-3.4-.2a27.43,27.43,0,0,0-7,.9,31.25,31.25,0,0,0-6.6,2.6,33.58,33.58,0,0,0-6,4.1,38,38,0,0,0-5.2,5.4,40.66,40.66,0,0,0-4.3,6.5,51.42,51.42,0,0,0-3.3,7.5A54.72,54.72,0,0,0,1,136.3a50.6,50.6,0,0,0-.7,8.8c0,.4-.1,5.7-.1,14.8s-.2,22-.3,37.6-.2,33.9-.3,53.9-.2,41.5-.2,63.7V382c0,22.1.2,43.7.4,63.7s.5,38.3.9,53.9.9,28.5,1.6,37.6c.6,7.9,1.6,18,2.9,29.6s3,24.6,4.8,38.5,3.9,28.5,6,43.4,4.4,29.9,6.5,44.4,4.3,28.5,6.3,41.4,3.8,24.6,5.4,34.5,2.9,18,3.8,23.6l1.4,8.7H588.2Z" transform="translate(1.35 0.15)" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:1.5px"/><path d="M274,347a16,16,0,0,1,7.6,2,26.18,26.18,0,0,1,7.1,5.7,49.4,49.4,0,0,1,6.4,9,88.06,88.06,0,0,1,5.6,11.9,128.25,128.25,0,0,1,4.6,14.4c1.3,5.1,2.5,10.7,3.5,16.6s1.7,12,2.2,18.3.8,12.9.8,19.7-.3,13.3-.8,19.7-1.2,12.5-2.2,18.3-2.1,11.4-3.5,16.6a143.89,143.89,0,0,1-4.6,14.4,88.06,88.06,0,0,1-5.6,11.9,54.77,54.77,0,0,1-6.4,9,24.76,24.76,0,0,1-7.1,5.7,16.28,16.28,0,0,1-7.6,2,16,16,0,0,1-7.6-2,26.18,26.18,0,0,1-7.1-5.7,49.4,49.4,0,0,1-6.4-9,88.06,88.06,0,0,1-5.6-11.9,128.25,128.25,0,0,1-4.6-14.4c-1.3-5.1-2.5-10.7-3.5-16.6s-1.7-12-2.2-18.3-.8-12.9-.8-19.7.3-13.3.8-19.7,1.2-12.5,2.2-18.3,2.1-11.4,3.5-16.6a143.89,143.89,0,0,1,4.6-14.4,88.06,88.06,0,0,1,5.6-11.9,54.76,54.76,0,0,1,6.4-9,24.76,24.76,0,0,1,7.1-5.7A15.18,15.18,0,0,1,274,347Z" transform="translate(1.35 0.15)" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:1.5px"/><path d="M270.8,202.4" transform="translate(1.35 0.15)" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:3px"/>`

   
    

    let pattern2 = `<?xml version="1.0" encoding="utf-8"?>
    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 630.4 803.09"><path d="M185.75,671.7a11.33,11.33,0,0,1,1.2-.2c.8-.2,1.8-.4,3.2-.7s2.9-.7,4.7-1.1,3.7-1,5.7-1.6,4.1-1.2,6.2-1.9,4.2-1.5,6.3-2.3,4-1.7,5.8-2.6a35.85,35.85,0,0,0,4.8-2.9c.1,0,.1-.1.2-.1s.1-.1.2-.2.1-.1.2-.1l.2-.2.2-.2c.1,0,.1-.1.2-.1s.1-.1.2-.2.1-.1.2-.1a74.58,74.58,0,0,0,12.1-13.6,110.69,110.69,0,0,0,9.3-16.1,172.4,172.4,0,0,0,7.2-17.7c2.1-6.1,4-12.3,5.7-18.5s3.3-12.4,4.8-18.4,3.1-11.9,4.6-17.5,3.3-10.8,5.1-15.6a86.06,86.06,0,0,1,6.2-12.9c.6-1,1.3-2,2-3s1.4-1.9,2.1-2.7a26.22,26.22,0,0,1,2.2-2.5,23.91,23.91,0,0,1,2.3-2.2c.8-.7,1.5-1.4,2.3-2l2.4-1.8a21.28,21.28,0,0,1,2.5-1.6c.8-.5,1.7-1,2.5-1.4a25.57,25.57,0,0,1,2.4-1.1,23.4,23.4,0,0,1,2.4-.9,22.5,22.5,0,0,0,2.4-.8c.8-.2,1.6-.4,2.5-.6a18.66,18.66,0,0,1,2.5-.4l2.5-.3a20.91,20.91,0,0,1,2.5-.1h2.5a42.06,42.06,0,0,1,6.2.5c2,.3,4,.6,5.9,1s3.8.9,5.6,1.4,3.5,1.1,5.1,1.6,3.1,1.1,4.5,1.7,2.6,1.1,3.7,1.6,2.1.9,2.9,1.3a8.7,8.7,0,0,0,1.9.8c.4-.2,1.1-.5,1.9-.8s1.8-.8,2.9-1.3,2.4-1,3.8-1.6,2.9-1.1,4.5-1.7,3.3-1.1,5.1-1.7,3.7-1,5.6-1.4a55.85,55.85,0,0,1,5.9-1c2-.3,4.1-.4,6.2-.5h2.5c.8,0,1.7.1,2.5.1l2.5.3c.8.1,1.6.3,2.5.4s1.6.4,2.5.6a22.51,22.51,0,0,1,2.4.8l2.4.9a25.57,25.57,0,0,1,2.4,1.1,20.13,20.13,0,0,1,2.5,1.4c.8.5,1.7,1,2.5,1.6l2.4,1.8a22,22,0,0,1,2.3,2c.8.7,1.5,1.5,2.3,2.2s1.5,1.6,2.2,2.5l2.1,2.7a22.35,22.35,0,0,1,2,3,77.31,77.31,0,0,1,6.2,12.9c1.9,4.8,3.5,10.1,5.1,15.6s3.1,11.4,4.6,17.5,3.1,12.2,4.8,18.4,3.6,12.4,5.7,18.5a163.69,163.69,0,0,0,7.2,17.7,110.68,110.68,0,0,0,9.3,16.1A74.58,74.58,0,0,0,483,657.1c.1,0,.1.1.2.1s.1.1.2.2.1.1.2.1l.2.2.2.2c.1,0,.1.1.2.1s.1.1.2.2.1.1.2.1a35.85,35.85,0,0,0,4.8,2.9c1.8.9,3.8,1.8,5.8,2.6s4.2,1.6,6.3,2.3,4.2,1.3,6.2,1.9,3.9,1.1,5.7,1.6,3.4.8,4.7,1.1,2.4.5,3.2.7a5.6,5.6,0,0,0,1.2.2,86.21,86.21,0,0,1-3.5,17.7,133.15,133.15,0,0,1-8,20.1,139.06,139.06,0,0,1-12.8,21,159.15,159.15,0,0,1-17.8,20.5,165.08,165.08,0,0,1-51.6,33.8,185.14,185.14,0,0,1-34.2,10.4,217.36,217.36,0,0,1-40.1,4.2h0c-1.4,0-4.6,0-9.3-.3s-10.9-.9-18.1-2a214.56,214.56,0,0,1-24.1-5.1,218.64,218.64,0,0,1-27.4-9.5,169.28,169.28,0,0,1-28.1-15.4,142,142,0,0,1-47.3-54A163,163,0,0,1,185.75,671.7Z" transform="translate(0.75 0.75)" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:1.5px"/><path d="M398.55,128.5h-8.8l-.4.9-.4.9-.4,1-.4.9-.4.9-.4,1-.4.9-.4.9h-1.6l1.1-2.7,1.1-2.7,1.1-2.7,1.1-2.7,1.1-2.7,1.1-2.7,1.1-2.7,1.1-2.7h.8l1.1,2.7,1.1,2.7,1,2.7,1.1,2.7,1,2.7,1.1,2.7,1.1,2.7,1,2.7h-1.6l-.4-.9-.4-.9-.4-1-.4-.9-.4-.9-.4-1-.4-.9Zm-8.1-1.4h8l-.4-1-.4-1-.4-1-.4-1-.4-1-.4-1-.4-1-.4-1a.35.35,0,0,0-.1-.2c0-.1-.1-.2-.1-.3s-.1-.2-.1-.3-.1-.2-.1-.3-.1-.2-.1-.3-.1-.2-.1-.3-.1-.2-.1-.4-.1-.3-.1-.4c0,.1-.1.2-.1.3s-.1.2-.1.3-.1.2-.1.3-.1.2-.1.3-.1.2-.1.3-.1.2-.1.3-.1.2-.1.3-.1.2-.1.3l-.4,1-.4,1-.4,1-.4,1-.4,1-.4,1-.4,1Z" transform="translate(0.75 0.75)"/><path d="M387.25,204.3h6.5a2.77,2.77,0,0,1,.9.1c.3,0,.6.1.8.1s.5.1.8.1.5.1.7.2.4.1.6.2l.6.3c.2.1.3.2.5.3a.78.78,0,0,1,.4.4l.4.4a2.19,2.19,0,0,1,.3.5c.1.2.2.3.3.5a1.69,1.69,0,0,1,.2.5c.1.2.1.4.2.6s.1.4.1.6v1.1a.6.6,0,0,1-.1.4c0,.1-.1.3-.1.4s-.1.3-.1.4a.76.76,0,0,1-.2.4c-.1.1-.1.2-.2.4a.77.77,0,0,1-.2.3c-.1.1-.2.2-.2.3l-.3.3-.3.3a.52.52,0,0,1-.4.2.76.76,0,0,1-.4.2c-.1.1-.3.1-.4.2s-.3.1-.5.2-.3.1-.5.1-.3.1-.5.1h0c.2,0,.4.1.6.1s.4.1.6.1.4.1.5.2.3.1.5.2.3.1.5.2a.76.76,0,0,0,.4.2c.1.1.3.2.4.3l.3.3.3.3a.52.52,0,0,1,.2.4c.1.1.1.3.2.4s.1.3.2.4a.6.6,0,0,1,.1.4,4.33,4.33,0,0,1,.1.5.9.9,0,0,0,.1.5v1.2c0,.2-.1.5-.1.7a1.42,1.42,0,0,1-.2.6c-.1.2-.1.4-.2.6l-.3.6c-.1.2-.2.3-.3.5s-.3.3-.4.5a1,1,0,0,1-.5.4c-.2.1-.3.3-.5.4l-.6.3-.6.3a1.45,1.45,0,0,1-.7.2,1.45,1.45,0,0,0-.7.2c-.3,0-.5.1-.8.1s-.5.1-.8.1h-7.3V206.9l.1-2.6Zm1.4,9.6h6.2a1.27,1.27,0,0,0,.6-.1,1.27,1.27,0,0,1,.6-.1,4.33,4.33,0,0,0,.5-.1,1.69,1.69,0,0,0,.5-.2c.1-.1.3-.1.4-.2a.76.76,0,0,1,.4-.2l.3-.3.3-.3c.1-.1.2-.2.2-.3s.1-.2.2-.4.1-.3.2-.4.1-.3.1-.4.1-.3.1-.5v-1a.9.9,0,0,0-.1-.5c0-.2-.1-.3-.1-.4a.76.76,0,0,0-.2-.4c-.1-.1-.1-.3-.2-.4l-.3-.3-.3-.3a.52.52,0,0,0-.4-.2.52.52,0,0,1-.4-.2c-.1-.1-.3-.1-.5-.2s-.3-.1-.5-.2a1.27,1.27,0,0,0-.6-.1c-.2,0-.4-.1-.6-.1s-.4-.1-.6-.1a1.7,1.7,0,0,1-.7-.1H389v7l-.4,1Zm0,1.3v9.1h4.8a6.15,6.15,0,0,0,1.4-.1c.4-.1.8-.1,1.2-.2a3,3,0,0,0,1-.4,2.18,2.18,0,0,0,.8-.5c.2-.2.5-.4.6-.7a3.51,3.51,0,0,1,.5-.8c.1-.3.2-.6.3-1a4.1,4.1,0,0,0,.1-1.1,3.08,3.08,0,0,0-.1-1l-.3-.9a3.51,3.51,0,0,0-.5-.8,2,2,0,0,0-.7-.6c-.3-.2-.6-.3-.9-.5a3.54,3.54,0,0,0-1.1-.3,5.07,5.07,0,0,0-1.3-.2c-.5,0-1-.1-1.5-.1h-4.3Z" transform="translate(0.75 0.75)"/><path d="M396.65,297h-1c-.3,0-.6.1-.9.1s-.6.1-.9.2a6.9,6.9,0,0,0-.8.3,5.89,5.89,0,0,0-.8.4,5.75,5.75,0,0,1-.7.4,2.65,2.65,0,0,0-.6.5l-.6.6a1.79,1.79,0,0,0-.5.7c-.2.2-.3.5-.5.7s-.3.5-.4.8l-.3.9-.3.9c-.1.3-.1.6-.2,1s-.1.7-.1,1v2.2c0,.4.1.7.1,1.1a3.55,3.55,0,0,0,.2,1c.1.3.1.6.2.9a6.89,6.89,0,0,0,.3.8,5.89,5.89,0,0,0,.4.8,1.79,1.79,0,0,0,.5.7c.2.2.3.5.5.7l.6.6a2.65,2.65,0,0,0,.6.5,4.35,4.35,0,0,0,.7.4c.2.1.5.2.7.3a6.88,6.88,0,0,0,.8.3c.3.1.6.1.9.2a2.77,2.77,0,0,0,.9.1h2.3a6185004705110.91,6185004705110.91,0,0,1,1.2-.2c.2,0,.4-.1.6-.1s.4-.1.6-.1.4-.1.6-.1.4-.1.6-.2V317c-.2.1-.4.1-.5.2a1.27,1.27,0,0,1-.6.1c-.2,0-.4.1-.6.1s-.4.1-.6.1-.4.1-.7.1a1.7,1.7,0,0,0-.7.1H395c-.4,0-.7-.1-1-.1s-.7-.1-1-.2l-.9-.3c-.3-.1-.6-.3-.9-.4a3.51,3.51,0,0,1-.8-.5,4.35,4.35,0,0,1-.7-.6,4.62,4.62,0,0,1-.7-.7,5.54,5.54,0,0,1-.6-.8,3.51,3.51,0,0,1-.5-.8,3.55,3.55,0,0,1-.4-.9,10.39,10.39,0,0,1-.4-1c-.1-.3-.2-.7-.3-1.1a4.25,4.25,0,0,1-.2-1.1,4.87,4.87,0,0,1-.1-1.2v-2a2.2,2.2,0,0,1,.1-.8c0-.3.1-.5.1-.8s.1-.5.1-.7a1.85,1.85,0,0,1,.2-.7c.1-.2.1-.5.2-.7a1.45,1.45,0,0,0,.2-.7l.3-.6.3-.6a2.09,2.09,0,0,1,.4-.6,2.18,2.18,0,0,1,.4-.5c.1-.2.3-.3.4-.5s.3-.3.5-.5.3-.3.5-.4a2.18,2.18,0,0,0,.5-.4,2.09,2.09,0,0,0,.6-.4l.6-.3.6-.3a1.42,1.42,0,0,1,.6-.2,6.37,6.37,0,0,1,.7-.2c.2-.1.5-.1.7-.2s.5-.1.7-.1.5-.1.7-.1h1.6a2.2,2.2,0,0,1,.8.1c.2,0,.5.1.7.1s.5.1.7.1.5.1.7.2a6.37,6.37,0,0,0,.7.2,1.42,1.42,0,0,0,.6.2l.6.3-.1.2-.1.2-.1.2-.1.2-.1.2-.1.2-.1.2-.1.2a12647185.44,12647185.44,0,0,1-1.2-.4c-.2-.1-.4-.1-.6-.2s-.4-.1-.6-.2-.4-.1-.6-.1-.4-.1-.6-.1a1.27,1.27,0,0,1-.6-.1C397.05,297,396.85,297,396.65,297Z" transform="translate(0.75 0.75)"/><path d="M106.45,516.3a5.45,5.45,0,0,1,.4-1c.3-.7.7-1.7,1.2-2.9s1.3-2.7,2.1-4.3,1.9-3.5,3.1-5.4,2.5-4,4-6.1a71.39,71.39,0,0,1,5.1-6.4c1.9-2.2,3.9-4.3,6.1-6.4a71.52,71.52,0,0,1,7.2-6l18.2-14.3,18.2-14.3,18.2-14.3,18.2-14.3,18.2-14.3,18.2-14.3,18.2-14.3,18.2-14.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3-19.3,12.9-19.3,12.9-19.3,12.9-18.7,12.9-19.3,12.8-19.3,12.9L171.55,488l-19.3,12.9a74.49,74.49,0,0,1-7.9,5,72.41,72.41,0,0,1-8,3.8c-2.6,1.1-5.2,2-7.7,2.8s-4.9,1.4-7.1,1.9-4.3.9-6.1,1.2-3.4.5-4.8.7-2.4.2-3.1.3A3.14,3.14,0,0,0,106.45,516.3Z" transform="translate(0.75 0.75)" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:1.5px"/><path d="M506.75,226.9a8.66,8.66,0,0,0-1.1.1,22.41,22.41,0,0,0-3.1.3c-1.3.2-2.9.4-4.8.7s-3.9.7-6.1,1.2-4.6,1.1-7.1,1.9-5.1,1.7-7.7,2.8a82.14,82.14,0,0,0-8,3.8,74.5,74.5,0,0,0-7.9,5l-22.4,15.1-22.4,15.1L393.75,288l-22.4,15.1L349,318.2l-22.5,15-22.4,15.1-22.4,15.1,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,21.4-16.6,21.4-16.6,21.4-16.6L392,331.4l21.4-16.6,21.4-16.6,21.4-16.6,21.4-16.6a71.52,71.52,0,0,0,7.2-6,72.72,72.72,0,0,0,6.1-6.4c1.9-2.2,3.5-4.3,5.1-6.4a57.44,57.44,0,0,0,4-6.1c1.2-1.9,2.2-3.8,3.1-5.4a41.25,41.25,0,0,0,2.1-4.3c.5-1.2,1-2.2,1.3-2.9Z" transform="translate(0.75 0.75)" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:1.5px"/><path d="M506.75,132.4a8.66,8.66,0,0,0-1.1.1,22.41,22.41,0,0,0-3.1.3c-1.3.2-2.9.4-4.8.7s-3.9.7-6.1,1.2-4.6,1.1-7.1,1.9-5.1,1.7-7.7,2.8a82.14,82.14,0,0,0-8,3.8,74.5,74.5,0,0,0-7.9,5l-19.3,12.9-19.3,12.8-19.3,12.9-19.3,12.9-19.3,12.6-19.3,12.9L325.85,238l-19.3,12.9,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,18.2-14.3,18.2-14.3,18.2-14.3,18.2-14.3,18.2-14.3,18.2-14.3,18.2-14.3,18.2-14.3a71.52,71.52,0,0,0,7.2-6c2.2-2.1,4.3-4.3,6.1-6.4s3.5-4.3,5.1-6.5a69.78,69.78,0,0,0,4-6.1c1.2-1.9,2.2-3.8,3.1-5.4a41.25,41.25,0,0,0,2.1-4.3c.6-1.2,1-2.2,1.3-2.9C506.65,132.7,506.75,132.4,506.75,132.4Z" transform="translate(0.75 0.75)" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:1.5px"/><path d="M106.45,421.9a5.45,5.45,0,0,1,.4-1c.3-.7.7-1.7,1.2-2.9s1.3-2.7,2.1-4.3,1.9-3.5,3.1-5.4,2.5-4,4-6.1a71.39,71.39,0,0,1,5.1-6.4c1.9-2.1,3.9-4.3,6.1-6.4a71.52,71.52,0,0,1,7.2-6L157,366.9l21.3-16.6,21.4-16.5L221,317.2l21.3-16.5,21.4-16.5L285,267.6l21.4-16.5,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3-22.4,15.1-22.4,15.1-22.4,15.1-22.4,15.1-22,15.1-22.5,15-22.4,15.1-22.4,15.1a67.84,67.84,0,0,1-7.9,4.9c-2.7,1.4-5.4,2.7-8,3.8s-5.2,2-7.7,2.8-4.9,1.4-7.1,1.9-4.3.9-6.1,1.2-3.4.5-4.8.7-2.4.2-3.1.3A5,5,0,0,0,106.45,421.9Z" transform="translate(0.75 0.75)" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:1.5px"/><path d="M139.75,310.3s.2-.4.5-1.1.9-1.8,1.6-3.1,1.6-2.9,2.7-4.7,2.3-3.8,3.8-5.9,3.1-4.4,4.9-6.7,3.8-4.7,6-7.2a97.79,97.79,0,0,1,7.2-7.2,95.68,95.68,0,0,1,8.4-6.8l21.2-16.4,21.2-16.4,21.2-16.4,21.2-16.4,21.2-16.4,21.2-16.4,21.2-16.4,21.2-16.4,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3-22.2,15-22.2,15-22.2,15-22.2,15-22.2,15-22.2,15-22.2,15-22.2,15a99.32,99.32,0,0,1-9.1,5.8c-3,1.7-6.1,3.2-9.1,4.6s-5.9,2.5-8.7,3.5-5.5,1.8-7.9,2.5-4.8,1.3-6.8,1.7-3.8.8-5.3,1.1-2.7.4-3.5.5A3.47,3.47,0,0,0,139.75,310.3Z" transform="translate(0.75 0.75)" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:1.5px"/><path d="M506.75,44.9a8.66,8.66,0,0,0-1.1.1,22.41,22.41,0,0,0-3.1.3c-1.3.1-2.9.4-4.8.7s-3.9.7-6.1,1.2-4.6,1.1-7.1,1.9-5.1,1.7-7.7,2.8a82.13,82.13,0,0,0-8,3.8,74.5,74.5,0,0,0-7.9,5l-14.6,9.4-14.6,9.4L417.15,89l-14.6,9.4L388,107.8l-14.6,9.5-14.6,9.4-14.6,9.4,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,3.1,4.3,13.5-10.9,13.6-10.9,13.5-10.9,13.6-10.9,13.5-10.9,13.6-10.9,13.6-10.9,13.5-10.9a71.52,71.52,0,0,0,7.2-6,72.71,72.71,0,0,0,6.1-6.4c1.9-2.2,3.5-4.3,5.1-6.4s2.9-4.2,4-6.1,2.2-3.8,3.1-5.4a41.25,41.25,0,0,0,2.1-4.3c.5-1.2,1-2.2,1.3-2.9A4.43,4.43,0,0,0,506.75,44.9Z" transform="translate(0.75 0.75)" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:1.5px"/>`;
 

    for (let wire in routes) {
    
      if(routes[wire].x1 <= 630.2 || routes[wire].x2 <= 630.2 ){      
        conductiveThread += this.getConductiveLines(routes[wire],"#ff004e",0); 
        insulationThread += this.getInsulationLines(routes[wire],"#17c0b7",0);
      }else{
          console.log(routes[wire])
        conductiveThread2 += this.getConductiveLines(routes[wire],"#ff004e",-630.2); 
        insulationThread2 += this.getInsulationLines(routes[wire],"#17c0b7",-630.2);
      }
    }

    for(let button in buttons){
      conductivePoints += this.getConductiveButtons(buttons[button],"#ec971f",0);
    }

    conductiveThread = pattern+conductiveThread+"</svg>";  
    var conductiveLayerImg = component.refs.conductiveLayer;
    conductiveLayerImg.setAttribute( "src", "data:image/svg+xml,"+ encodeURIComponent(conductiveThread) ); 
    conductiveLayerImg.onload = function(){ 
      conductiveLayerImg.width = 630.2;
      conductiveLayerImg.height = 802.2; 
    }  
    

    insulationThread = pattern+insulationThread+conductivePoints+"</svg>";
    var insulationLayerImg = component.refs.insulationLayer;
    insulationLayerImg.setAttribute( "src", "data:image/svg+xml,"+ encodeURIComponent(insulationThread) ); 
    insulationLayerImg.onload = function(){ 
      insulationLayerImg.width = 630.2;
      insulationLayerImg.height = 802.2; 
    } 

    conductiveThread2 = pattern2+conductiveThread2+"</svg>";  
    var conductiveLayerImg2 = component.refs.conductiveLayer2;
    conductiveLayerImg2.setAttribute( "src", "data:image/svg+xml,"+ encodeURIComponent(conductiveThread2) ); 
    conductiveLayerImg2.onload = function(){ 
      conductiveLayerImg2.width = 630.2;
      conductiveLayerImg2.height = 802.2; 
    }  

    insulationThread2 = pattern2+insulationThread2+circleThumb+"</svg>";
    var insulationLayerImg2 = component.refs.insulationLayer2;
    insulationLayerImg2.setAttribute( "src", "data:image/svg+xml,"+ encodeURIComponent(insulationThread2) ); 
    insulationLayerImg2.onload = function(){ 
      insulationLayerImg2.width = 630.2;
      insulationLayerImg2.height = 802.2; 
 
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

