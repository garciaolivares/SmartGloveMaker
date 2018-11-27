import React from 'react'; 
import {SensorView} from './SensorView';
import {Download} from './Download';  
let moment = require('moment');
 
let iteration =0;  
let gridGraph = [];

const widgetGlove =   {
                      sensors:{
                         1:{ startPoint: [935,560], endPin: "thumb" },
                         2:{ startPoint: [265,550], endPin: "VOL"   },
                         3:{ startPoint: [286,101], endPin: "2"     },
                         4:{ startPoint: [286,164], endPin: "3"     },
                         5:{ startPoint: [286,226], endPin: "4"     },
                         6:{ startPoint: [213,68],  endPin: "7"     },
                         7:{ startPoint: [213,139], endPin: "5"     },
                         8:{ startPoint: [213,211], endPin: "6"     },
                         9:{ startPoint: [132,101], endPin: "10"    },
                        10:{ startPoint: [132,164], endPin: "9"    },
                        11:{ startPoint: [132,226], endPin: "8"    },
                        12:{ startPoint: [55,165],  endPin: "11"   },
                        13:{ startPoint: [55,221],  endPin: "13"   },
                        14:{ startPoint: [55,276],  endPin: "12"   },
                        //15:{ startPoint: [365,135], endPin: "TX"   },
                        16:{ startPoint: [360,75], endPin: "A3"   },
                        //17:{ startPoint: [452,100], endPin: "A5"   },
                        18:{ startPoint: [445,49],  endPin: "A2"   },
                        //19:{ startPoint: [531,135], endPin: "A3"   },
                        20:{ startPoint: [525,75], endPin: "A1"   },
                        //21:{ startPoint: [609,199], endPin: "A1"   },
                        22:{ startPoint: [609,144], endPin: "A0"   },
                      },

                      controller:{
                        "thumb":{endPoint:[960,810], static: true},
                        "RX":   {endPoint:[73,0]}, 
                        "TX":   {endPoint:[70,-21]},
                        "2":    {endPoint:[61,-40]},
                        "3":    {endPoint:[55,-55]},
                        "4":    {endPoint:[35,-67]},
                        "GND":  {endPoint:[10,-73]},
                        "VOL":  {endPoint:[-10,-73]},
                        "5":    {endPoint:[-35,-67]},
                        "6":    {endPoint:[-55,-55]},
                        "7":    {endPoint:[-61,-40]},
                        "8":    {endPoint:[-70,-21]},
                        "9":    {endPoint:[-73,0]}, //***
                        "10":   {endPoint:[-70,20]},//***
                        "11":   {endPoint:[-61,40]},
                        "12":   {endPoint:[-55,55]},
                        "13":   {endPoint:[-35,67]},
                        "A0":   {endPoint:[-10,73]},
                        "A1":   {endPoint:[10,73]},
                        "A2":   {endPoint:[35,67]},
                        "A3":   {endPoint:[55,55]},
                        "A4":   {endPoint:[61,40]},
                        "A5":   {endPoint:[75,21]}, //**
                      },

                      controllerCenterPoint: [182,700], //202,700 --- 
                      controllerPixelSize: 142
                  }

export class SVGRender extends React.Component{

  normalizePointInSVG (point){ 
    return point*this.props.designer.state.unit+((this.props.designer.state.unit-1)/2);
  }

  render() {
     let unit = this.props.designer.state.unit;
     let path = this.props.data.data; 
     let points = '';
     let direction = ""; 
     let lastPoint =  path.coordinates[path.coordinates.length-1];
     for (let i=1; i<path.coordinates.length; i++){
       if(direction !== path.path[i]|| 
         direction !== path.path[i-2] ){ 
           points += this.normalizePointInSVG(path.coordinates[i-1].x)+","+
                 this.normalizePointInSVG(path.coordinates[i-1].y)+" ";  
           direction = path.path[i]; 
       }
     }
     points += this.normalizePointInSVG(lastPoint.x)+","+
           this.normalizePointInSVG(lastPoint.y)+" "; 
           
    return ( 
      <a>
        <polyline points={points}
               stroke={path.color}
               strokeWidth="2px"
               fill= {"none"} 
               className={path.class}/>

        <circle cx={this.normalizePointInSVG(path.coordinates[0].x)}
                cy={this.normalizePointInSVG(path.coordinates[0].y)}
                r={unit*0.7}   
                fill="green"
                className={path.class}/>
        <circle cx={this.normalizePointInSVG(lastPoint.x)}
                cy={this.normalizePointInSVG(lastPoint.y)}
                r={unit/2}  
                fill="#0e33c2"
                className={path.class}/>
      </a>
    );
  }
}


export class Designer extends React.Component{
  constructor(props) {  
    super(props); 
    this.state = {   
      routes: [],
      height: 0,
      width:0,
      startPoints:[],
      endPoints:[], 
      unit:0,
      gridGraph:[],
      isFlipped:false, 
      flow: 1,
      title: "Choose the buttons you will need",
      modalOpen: false,
      warning:"",
      activeSensors: [1,2],   
      
    }; 
      this.handleBackClick = this.handleBackClick.bind(this);
      this.handleNextClick = this.handleNextClick.bind(this); 
  } 

  autoRouting(originalSet,subSet, obstacles){ 
   
    if(this.state.gridGraph===[]){
        return [];
    }

    this.clearGrid();

    for(let obs in obstacles){
      this.setObstacles(obstacles[obs].data); 
    } 

    let routesFinalOutput = []; 
    //this.clearGrid(); 

    let completed = true;
    //iterates each element of the coordinatesSet 
    for(let key = 0; key<subSet.length; key++){ 
      let route = subSet[key].points; 
      let id = subSet[key].id;  
      //storage multiple conected lines A to B to C 
      let tempRoutes = [];
       

      this.avoidOverlaping(originalSet, subSet[key].id);
      for(let step = 0; step<route.length; step++){ 
        iteration++;
        if(step < (route.length-1)){ 
          let s = route[step];
          let e = route[step+1];  
          this.setStart(s);
          this.setEnd(e);
          let output = this.findShortestPath(s,e);  
          if(output !== false){
            output.color = "#ff004e";
            output.class = "redWire";
            tempRoutes.push(output);
            this.setObstacles(output);  
          } else{ 
            completed = false; 
            break;
          }
        }
      }
      
      for(let line in tempRoutes){ 
        routesFinalOutput.push({id: id, data:tempRoutes[line] }); 
      } 
      if(completed === false){ 
        break;
      } 
    }

    if(completed === false ){
      completed = true;
      for(let r in routesFinalOutput){   
        this.removeObstacles(routesFinalOutput[r].data); 
      }  
      return [] 
    }

 
    return routesFinalOutput;
  }
  
  avoidOverlaping(set, id){ 
    for(let key = 0; key<set.length; key++){
      let pin = set[key].points;
      (set[key].id === id)?
          this.updateTemporalObstacles(pin, 'Empty'):
          this.updateTemporalObstacles(pin, 'Obstacle');
    }
  }

  setStart(coord){
   gridGraph[coord.y][coord.x] = (gridGraph[coord.y][coord.x] !== 'Obstacle')?  'Start': 'Start'; 
  }

  setEnd(coord){
    gridGraph[coord.y][coord.x] = 'End';  
  }

  clearGrid(){  
    for (let y = 0; y < this.state.gridHeight; y++) {  
      for (let x = 0; x < this.state.gridWidth; x++) {  
        if(!(gridGraph[y][x] === 'OuterObstacle')){
          gridGraph[y][x] ="Empty"; 
        } 
      }
    }  
  }

  updateTemporalObstacles(obstacles, status){  
    for(let key = 0; key<obstacles.length; key++){ 
      let obstacle = obstacles[key];   
      let X = obstacle.x;
      let Y = obstacle.y;
      //Restart grid for new the path calculation 
      for(let i = -1; i<2; i++){
        for(let j = -1; j<2; j++){ 
          if(!(gridGraph[Y+i][X+j] === 'OuterObstacle')){
            gridGraph[Y+i][X+j]= status;  
          } 
        } 
      }
    }  
  }  

  setObstacles(obstacles){ 

    this.updateTemporalObstacles([obstacles.coordinates[0]], 'Obstacle'); 
    this.updateTemporalObstacles([obstacles.coordinates[obstacles.coordinates.length-1]], 'Obstacle'); 

    for(let key = 0; key<obstacles.coordinates.length; key++){ 
      let X = obstacles.coordinates[key].x;
      let Y = obstacles.coordinates[key].y;  

      if(gridGraph[Y][X]!== 'OuterObstacle'){
        gridGraph[Y][X] = 'Obstacle';
      } 
      if(obstacles.path[key]==='SouthEast'){
        if(gridGraph[Y][X+1]!== 'OuterObstacle') { 
          gridGraph[Y][X+1]='Obstacle'
        }
        if(gridGraph[Y+1][X]!== 'OuterObstacle') { 
          gridGraph[Y+1][X]='Obstacle'
        }  
      }else if(obstacles.path[key]==='SouthWest'){
        if(gridGraph[Y][X-1]!== 'OuterObstacle') { 
          gridGraph[Y][X-1]='Obstacle'
        }
        if(gridGraph[Y+1][X]!== 'OuterObstacle') { 
          gridGraph[Y+1][X]='Obstacle'
        } 
      }else if(obstacles.path[key]==='NorthWest'){ 
        if(gridGraph[Y][X-1]!== 'OuterObstacle') { 
          gridGraph[Y][X-1]='Obstacle'
        }
        if(gridGraph[Y-1][X]!== 'OuterObstacle') { 
          gridGraph[Y-1][X]='Obstacle'
        } 
      }else if(obstacles.path[key]==='NorthEast'){
        if(gridGraph[Y][X+1]!== 'OuterObstacle') { 
          gridGraph[Y][X+1]='Obstacle'
        }
        if(gridGraph[Y-1][X]!== 'OuterObstacle') { 
          gridGraph[Y-1][X]='Obstacle'
        } 
      }
    } 
  }

  removeObstacles(obstacles){

    for(let key = 0; key<obstacles.coordinates.length; key++){ 
      let X = obstacles.coordinates[key].x;
      let Y = obstacles.coordinates[key].y;  

      if(gridGraph[Y][X]=== 'Obstacle'){
        gridGraph[Y][X] = 'Empty'
      }    
      if(obstacles.path[key]==='SouthEast'){
        if(gridGraph[Y][X+1]!== 'OuterObstacle' ){ gridGraph[Y][X+1] = 'Empty'}; 
        if(gridGraph[Y+1][X]!== 'OuterObstacle' ){ gridGraph[Y+1][X] = 'Empty'};   
      }else if(obstacles.path[key]==='SouthWest'){
        if(gridGraph[Y][X-1]!== 'OuterObstacle' ){ gridGraph[Y][X-1] = 'Empty'}; 
        if(gridGraph[Y+1][X]!== 'OuterObstacle' ){ gridGraph[Y+1][X] = 'Empty'};  
      }else if(obstacles.path[key]==='NorthWest'){ 
        if(gridGraph[Y][X-1]!== 'OuterObstacle' ){ gridGraph[Y][X-1] = 'Empty'}; 
        if(gridGraph[Y-1][X]!== 'OuterObstacle' ){ gridGraph[Y-1][X] = 'Empty'};  
      }else if(obstacles.path[key]==='NorthEast'){
        if(gridGraph[Y][X+1]!== 'OuterObstacle' ){ gridGraph[Y][X+1] = 'Empty'}; 
        if(gridGraph[Y-1][X]!== 'OuterObstacle' ){ gridGraph[Y-1][X] = 'Empty'};  
      }  
    } 
  }

  /******************************************************/

  // Start location will be in the following format:
  // [distanceFromTop, distanceFromLeft]
 findShortestPath(startCoordinates, endCoordinates) { 

      let distanceFromLeft = startCoordinates.x;
      let distanceFromTop = startCoordinates.y;

      // Each "location" will store its coordinates
      // and the shortest path required to arrive there
      let location = {
        distanceFromTop: distanceFromTop,
        distanceFromLeft: distanceFromLeft,
        path: [],
        status: 'Start',
        coordinates:[]
    };

      // Initialize the queue with the start location already inside
      let queue = [location]; 
     
    while (queue.length > 0) { 
      // Take the first location off the queue
      let currentLocation = queue.shift();  
        let directions = ["South", "East","North","West","SouthEast", "NorthEast","NorthWest","SouthWest"];
        for( let dir in directions){
          let newLocation = this.exploreInDirection(currentLocation, directions[dir]);
            if (newLocation.status === 'End') { 
              newLocation.coordinates.push(endCoordinates); 
              return newLocation;
            } else if (newLocation.status === 'Valid') {
              queue.push(newLocation);
            }
      }
    }  
    // No valid path found
    return false;
  };

  // This function will check a location's status
  // (a location is "valid" if it is on the grid, is not an "obstacle",
  // and has not yet been visited by our algorithm)
  // Returns "Valid", "Invalid", "Blocked", or "End"
  locationStatus(location) { 
      let dft = location.distanceFromTop;
      let dfl = location.distanceFromLeft;  

      if (dfl < 0 ||
          dfl >= this.state.gridWidth ||
          dft < 0 ||
          dft >= this.state.gridHeight) {

        // location is not on the grid--return false
        return 'Invalid';
      }else if(gridGraph[dft][dfl] === 'OuterObstacle'){
        return 'Invalid';
      } else if (gridGraph[dft][dfl] === 'End') { 
        return 'End';
      } else if (gridGraph[dft][dfl] === 'Obstacle') {
        // location is  an obstacle 
        return 'Blocked';
      }else if (gridGraph[dft][dfl] === 'Visited'+iteration) {
        // location has been visited by this itaration
        return 'Blocked';
      } else {
        return 'Valid';
      }
  };


     
  // Explores the grid from the given location in the given
  // direction
  exploreInDirection(currentLocation, direction) {
    let newPath = currentLocation.path.slice();
    newPath.push(direction);

    let newCoordinetes = currentLocation.coordinates.slice();
    newCoordinetes.push({x:currentLocation.distanceFromLeft, y:currentLocation.distanceFromTop});

    let dft = currentLocation.distanceFromTop;
    let dfl = currentLocation.distanceFromLeft;

    switch(direction){
      case 'North': dft -= 1; break;
      case 'East':  dfl += 1; break;
      case 'South': dft += 1; break;
      case 'West':  dfl -= 1; break;
      case 'NorthEast': dft -= 1; dfl += 1;  break;
      case 'SouthEast': dft += 1; dfl += 1;  break;
      case 'SouthWest': dft += 1;  dfl -= 1; break;
      case 'NorthWest': dft -= 1; dfl -= 1; break;
      default:
    }
   
    let newLocation = {
      distanceFromTop: dft,
      distanceFromLeft: dfl,
      path: newPath,
      status: 'Unknown',
      coordinates: newCoordinetes
    };
    newLocation.status = this.locationStatus(newLocation);

    // If this new location is valid, mark it as 'Visited'

     

    if (newLocation.status === 'Valid') { 
      gridGraph[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited'+iteration;
    }
    return newLocation;
  };  

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  normalizePointInSVG (point){ 
    return point*this.state.unit+((this.state.unit-2)/2);
  }

  normalizePoint(point){ 
    return point*this.state.unit;
  }

  navPrev(){ 
    return (
      <a className="navButton back " onClick={this.handleBackClick} >
              <img  alt="Step Before" src={require('../img/arrow.svg')}/>
        </a>
      );
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
  
  handleBackClick() { 
    if(this.state.flow>1){ 
      this.setState({ flow:  this.state.flow - 1 }); 
    } 
    else if(this.state.flow === 1){
      this.props.wizard.setState({step:1});
    } 
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
                                                "Wiring Diagram"
                      } 
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="title">
                    {this.state.flow === 1? "Choose Buttons":
                     this.state.flow === 2? "Wiring Diagram":
                                            "Embroidery Files"
                    }                    
                  </div>
                </div>
                <div className="col"> 
                  {this.navNext()}
                  <div className="flowLabel right">
                     <span>{
                      this.state.flow === 1? "Wiring Diagram":
                      this.state.flow === 2? "Embroidery Files": "Build Glove"
                      }
                    </span>
                  </div>
                </div> 
        </div>

        <div className={"row "+(this.state.flow !== 3? "frame":"")}  id="gridWrapper"> 
          {this.state.flow === 1? 
            <SensorViews  designer={this}/>:
           this.state.flow === 2?
            <RoutingView ref="wiring" designer={this} />:
            <Download    designer={this}/> } 
        </div>   
      </div> 
      );
  }  
}

 


class RoutingView extends React.Component{

  constructor(props) {  
    super(props); 
    this.handleRecalculatePath = this.handleRecalculatePath.bind(this);  
    this.oldtime = null;
  } 

  componentDidMount(){ 
    let component = this;
    component.props.designer.setState({gridGraph:[]})
    component.loadImages();
  }

  handleRecalculatePath(){
    this.refs.loader.classList.remove("hidden"); 
    this.loadImages();
  }

  drawObstacles(){
    let canvas = this.refs.canvas;
    let ctx = canvas.getContext('2d'); 
    for (let y = 0; y < this.props.designer.state.gridHeight; y++) {  
        for (let x = 0; x < this.props.designer.state.gridWidth; x++) { 
          if(gridGraph[y][x] === 'OuterObstacle'){
            ctx.fillStyle = 'rgb(255,0,0)'; 
            ctx.fillRect(this.props.designer.normalizePoint(x)*10-1,this.props.designer.normalizePoint(y)*10-1,this.props.designer.state.unit*10-1,this.props.designer.state.unit*10-1); 
          } 
          if(gridGraph[y][x] === 'Obstacle'){
            ctx.fillStyle = 'rgb(0,255,0)'; 
            ctx.fillRect(this.props.designer.normalizePoint(x)*10-1,this.props.designer.normalizePoint(y)*10-1,this.props.designer.state.unit*10-1,this.props.designer.state.unit*10-1); 
          } 
        }
    } 
  } 

  chunkArray(array, chunk_size){
    let index = 0;
    let arrayLength = array.length;
    let tempArray = [];
    
    for (index = 0; index < arrayLength; index += chunk_size) {
        let chunk = array.slice(index, index+chunk_size);
        // Do something if you want with the group
        tempArray.push(chunk);
    }
    return tempArray;
}

  processImages(img){ 

    //Getting the current dimensions from user's screen 
    let container = document.getElementById("gridWrapper"); 
    let component = this;
    let designer = this.props.designer; 

    let width = Math.ceil(container.clientHeight*(img.width/img.height)); 
    let height = container.clientHeight;

    let scaleFactor;  //842 is the natural size of pattern glove file
   
    width>1191? (scaleFactor = 1191/width) :
                (scaleFactor = width/1191);


    const unit = ((width*scaleFactor)/(140*scaleFactor)); 
    let canvas = document.getElementById("canvas") || document.createElement('canvas');
    canvas.width = width;
    canvas.height = height; 

    let ctx = canvas.getContext('2d'); 
    ctx.drawImage(img, 0, 0, width, height);
    ctx.scale(0.1, 0.1 ); 
    ctx.strokeStyle  = 'rgb(0,0,0)';
    ctx.fillStyle = 'rgba(0,0,0,0)';
 
    let gridWidth = 0;
    let gridHeight = 0;
    for (let y = 0; y < height; y=y+unit, gridHeight++) {  
      gridGraph[gridHeight]=[];
      gridWidth=0;
      for (let x = 0; x < width; x=x+unit, gridWidth++) {  
        let density = this.chunkArray(ctx.getImageData(x, y, unit, unit).data, 4)
          .filter(function(val){ 
                    return ( val.toString() !=="255,255,255,255" )
          }).length; 
        if(density > 10 ){
            gridGraph[gridHeight][gridWidth] = 'OuterObstacle'; 
        }else{ 
          ctx.strokeRect(x*10-1,y*10-1,unit*10,unit*10);
          gridGraph[gridHeight][gridWidth] = 'Empty'; 
        }
      } 
    }


    //Calculate obstacles from Controller

    let X = widgetGlove.controllerCenterPoint[0];
    let Y = widgetGlove.controllerCenterPoint[1];

    X = Math.ceil(((X*scaleFactor)/unit)-(scaleFactor/2));
    Y = Math.ceil(((Y*scaleFactor)/unit)-(scaleFactor/2));

    let r= (Math.round(((widgetGlove.controllerPixelSize*scaleFactor)/unit)/2)); 

    for (let i = -r; i < r; i++) {
      for (let j = -r; j < r; j++) {
        if(Math.sqrt(((X+i)-X)*((X+i)-X) + ((Y+j)-Y)*((Y+j)-Y)) < r){
           gridGraph[Y+j][X+i] = 'OuterObstacle';
        }
      }
    }

    let halfSize = (widgetGlove.controllerPixelSize/2);
    let topLilypad = Math.ceil(((widgetGlove.controllerCenterPoint[1]-halfSize)*scaleFactor)+(unit/2));
    let leftLilypad = Math.ceil(((widgetGlove.controllerCenterPoint[0]-halfSize)*scaleFactor)+(unit/2));
    this.refs.lilypad.style.width = Math.floor(widgetGlove.controllerPixelSize*scaleFactor)+"px";
    this.refs.lilypad.style.height = Math.floor(widgetGlove.controllerPixelSize*scaleFactor)+"px";
    this.refs.lilypad.style.top = topLilypad+"px";
    this.refs.lilypad.style.left = leftLilypad+"px"; 
 
    designer.setState({gridGraph: gridGraph});
    designer.setState({scaleFactor: scaleFactor});  
    designer.setState({gridHeight: gridHeight});
    designer.setState({gridWidth: gridWidth});
    designer.setState({height: height});
    designer.setState({width: width});
    designer.setState({unit: unit});   
    
    
     
    return{
            activeSensors: component.props.designer.state.activeSensors,
            //activeSensors: this.randomSensors(17),    // attribute for testing random traces
            scaleFactor: scaleFactor,
            unit:unit
          } 
  }


  randomSensors(n){
    let activeSensors = [];
       for (let i = 1 ; i < n+1; i++) {
          let random = Math.floor(Math.random()*(22-2+1)+2);
          if(!(activeSensors.includes(random)||random === 15||random === 17||random === 19||random === 21)){
            activeSensors.push(random)
          }else{
            i--;
          }
       }

       return activeSensors;
  }


  getRoutingSet(params){ 
    let activeSensors = params.activeSensors; 
    let scaleFactor = params.scaleFactor;
    let unit = params.unit;
    let routingSet =[];  

    for(let i = 0; i< activeSensors.length; i++){  
      let route;   
      let sensor = widgetGlove.sensors[activeSensors[i]];
      let startPoint = sensor.startPoint;
      let endPoint=  widgetGlove.controller[sensor.endPin].endPoint;

      let spx= Math.ceil(((startPoint[0]*scaleFactor)/unit)-(scaleFactor/2));
      let spy= Math.ceil(((startPoint[1]*scaleFactor)/unit)-(scaleFactor/2));
      let epx;
      let epy;

     if(widgetGlove.controller[sensor.endPin].static !== true){
        epx =  Math.ceil((((widgetGlove.controllerCenterPoint[0]+endPoint[0])*scaleFactor)/unit)-(scaleFactor/2));
        epy =  Math.ceil((((widgetGlove.controllerCenterPoint[1]+endPoint[1])*scaleFactor)/unit)-(scaleFactor/2)); 
     }else{
        epx =  Math.ceil(((endPoint[0]*scaleFactor)/unit)-(scaleFactor/2));
        epy =  Math.ceil(((endPoint[1]*scaleFactor)/unit)-(scaleFactor/2));
     }  

      route = { points: [  
                  { x:Math.round(spx), 
                    y:Math.round(spy)
                  }, 
                  { x:Math.round(epx), 
                    y:Math.round(epy)
                  }
                ],
                id: activeSensors[i] 
              } 
      routingSet.push(route);
    } 


    return routingSet;
  }

  multiDimensionalUnique(arr) {
      let uniques = [];
      let itemsFound = {};
      for(let i = 0, l = arr.length; i < l; i++) {
          let stringified = JSON.stringify(arr[i]);
          if(itemsFound[stringified]) { continue; }
          uniques.push(arr[i]);
          itemsFound[stringified] = true;
      }
      return uniques;
  }

 
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


  calculateRoutes(routingSet, component, params){ 

    let candidateRoutes= [];
    //Calculate best route for each path --- Global Variable Routes contains all best paths for each path
    for (let i = 0; i < routingSet.length; i++) {  
      let item = routingSet[i]; 
      let shortest;
      component.props.designer.setStart(item.points[0]);
      component.props.designer.setEnd(item.points[1]);
      shortest = component.props.designer.findShortestPath(item.points[0],item.points[1]);

      if(shortest !== false){ 
        shortest.id = routingSet[i].id
      }
      candidateRoutes = candidateRoutes.concat(shortest); 
      component.props.designer.clearGrid();
    }  

    if(candidateRoutes.includes(false)){ 
      return []
    }

    //Detect conflict among paths  
    let conflictedPaths = []; 
    for (let i = 0; i < candidateRoutes.length; i++) {
      let conflict =[candidateRoutes[i].id];  
      for(let j =0; j<candidateRoutes[i].coordinates.length; j++){
        let point = candidateRoutes[i].coordinates[j]
        for (let k = 0; k < candidateRoutes.length; k++) {  
          if (  (candidateRoutes[i].id !== candidateRoutes[k].id)  &&
                (!conflict.includes(candidateRoutes[k].id))  && 
                candidateRoutes[k].coordinates.filter(function(coordinates) {
                  return ( coordinates.x === point.x && coordinates.y === point.y ); 
                }).length > 0) {
            conflict.push(candidateRoutes[k].id);
            break; 
          }
        }
      }  
      conflictedPaths.push(conflict.sort());
    }

    //Reduce conflict
    conflictedPaths = component.multiDimensionalUnique(conflictedPaths); 
    let auxArray = []
    for (let m = 0; m < conflictedPaths.length; m++) {
      let subSet = conflictedPaths[m];
      for (let s = 0; s < subSet.length; s++){
        for(let k = 0; k< conflictedPaths.length; k++){ 
          if(conflictedPaths[k].includes(subSet[s])){
              subSet = component.multiDimensionalUnique(subSet.concat(conflictedPaths[k]))
                                .sort(function(a, b){return a - b});  
          }
        }
      }
      auxArray.push(subSet);
    }
    

    //Delete duplicates
    conflictedPaths =  component.multiDimensionalUnique(auxArray); 
    let routesFinalOutput =[]; 
    for (let n = 0; n < 100; n++) {
      let conflictedPathsPermutations = this.shuffleArray(conflictedPaths);
      let routes = [];
      
      //Split the total set of routes into smaller chunks 
      for(let w = 0; w < conflictedPathsPermutations.length; w++){ 
        //Extract routes from each chunk
        let subRoutingSet = [];
        for (let z = 0; z < conflictedPathsPermutations[w].length; z++) {
            let key = routingSet.find(function (obj) { return obj.id === conflictedPathsPermutations[w][z]; });
            subRoutingSet.push(key);
        }   
        let permutations = this.shuffleArray(this.permutations(conflictedPathsPermutations[w])); 
        

        for(let p = 0; p< permutations.length; p++){
             
            //sort the list by permutation[p]
            subRoutingSet = component.findPartialPaths(permutations[p], subRoutingSet);
            routes = component.props.designer.autoRouting(routingSet, subRoutingSet , routesFinalOutput);

            if(routes.length>0){
              break;
            }
        }
        routesFinalOutput = routesFinalOutput.concat(routes); 
      }

      if(routesFinalOutput.length === routingSet.length){
        let ms = moment(moment(),"X").diff(moment(this.oldtime,"X"));
        let expiration = moment.duration(ms);  
        console.log(params.activeSensors, expiration.asMilliseconds())
        break;
      }else{
         routesFinalOutput =[];
      }
    }
    return routesFinalOutput;

  }

  findPartialPaths(arr , subRoutingSet){
    return arr.map((per) => subRoutingSet.find((o) => o.id === per));
  }

  permutations(array){
    const permutator = (inputArr) => {
      let result = []; 
      const permute = (arr, m = []) => {
        if (arr.length === 0) {
          result.push(m)
        } else {
          for (let i = 0; i < arr.length; i++) {
            let curr = arr.slice();
            let next = curr.splice(i, 1);
            permute(curr.slice(), m.concat(next))
         }
       }
     } 
     permute(inputArr);
     return result;
    }
    return permutator(array);
  }

  

  loadImages() { 
    this.oldtime = moment(); 
    let component = this;  
    let img = document.createElement("img");
    img.src = require('../img/glovePattern.svg');
    img.onload = function(){
      
      gridGraph = []; 
      let params = component.processImages(img);
      console.log(params.activeSensors);
      let routingSet = component.getRoutingSet(params);  
      let routesFinalOutput = component.calculateRoutes(routingSet, component, params); 

      //component.drawObstacles();
      
      component.refs.loader.classList.add("hidden"); 
      component.props.designer.setState({routes: routesFinalOutput}); 
    }  
  }

  render (){  
      return(
      <div className="col grid routingViewWrapper">
        <div className="loader h-100" ref="loader"> 
          <div style={{width:"100%",height:"100%"}}>
              <div   className="ball-grid-pulse">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <span className="leader-text">Generating Wiring</span>
          </div>
        </div>
        <div className="btnWiring" onClick={this.handleRecalculatePath}>
            <img  alt="" src={require('../img/routing.svg')}/> <span>Recalculate<br/>Wiring</span>
        </div>

        <div className="scroll">
          <div className="mainWrapper" style={{width: this.props.designer.state.width, height:this.props.designer.state.height-6}}>
            <div className="canvasWrapper h-100" > 
              <canvas  ref="canvas" id="canvas"/> 
            </div> 
            <div className="patternWrapper h-100">
              <object 
                type="image/svg+xml" 
                data={require('../img/glovePatternStroke.svg')} 
                width={this.props.designer.state.width} height={this.props.designer.state.height}>
              </object> 
            </div>
            <div id="handSVGWrapper" className="h-100" > 
              <div id="handSVG"> 
                <svg  width={this.props.designer.state.width}
                      height={this.props.designer.state.height}>
                  {this.props.designer.state.routes.map(item => ( 
                    <React.Fragment key={item.id}>
                       <SVGRender designer={this.props.designer} data={item}/>
                    </React.Fragment>
                  ))}
                </svg> 
              </div>
            </div> 
            <div className = "lilypadWrapper">
              <img  ref="lilypad" id="lilypad" alt="lilypad" src={require('../img/lilypad.svg')}  /> 
            </div>
          </div>
        </div>
        
      </div>
      );
  }
}

class SensorViews extends React.Component{
  constructor(props){
    super(props);
    this.state = {height:0}
  } 

  componentDidMount(){
    //Getting the current dimensions from user's screen 
    let container = document.getElementById("gridWrapper");   
    let height = container.clientHeight;
    this.setState({height:height});
  }

  render (){   
      return(
      <div ref="sensorView"  className="col grid panel" style={{opacity:1}}> 
         <SensorView wizard={this.props.wizard} designer={this.props.designer}  height={this.state.height} />
      </div>
      );
  }
}


