import React from 'react';
import {Carousel} from './CarouselDirections';   
  
 
export class Directions extends React.Component{
  constructor(props) {  
    super(props); 
    this.state = { title: "Tools & materials you will need"};
    this.handleBackClick = this.handleBackClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
  } 

  handleNextClick() {  
    this.props.wizard.setState({step:4});
  }

  handleBackClick() { 
    this.props.wizard.setState({step:2}); 
  } 
 

  render() {  
    let style = {visibility:"hidden", opacity:1}
    if(this.props.status ==="active"){
      style.visibility = "visible";
      style.opacity = 1;
      style.zIndex = 100;
    }
    return ( 

        <div  id="step-directions"   className="col pad-30-h panel" >  
          <div className="row frame toolBar" style={{height: "57px"}}>  
                  <div className="col"> 
                    <a className="navButton back" onClick={this.handleBackClick} >
                          <img  alt="Step Before" src={require('../img/arrow.svg')}/>
                    </a>
                    <div className="flowLabel">
                      <span>
                        Design Glove
                      </span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mainTitle">
                        {this.state.title}             
                    </div>
                  </div>
                  <div className="col"> 
                    <a ref="nextBtn" className="navButton next " onClick={this.handleNextClick} >
                        <img  alt="Step Before" src={require('../img/arrowNext.svg')}/>
                    </a>  
                    <div className="flowLabel right">
                       <span>
                        Test Glove
                      </span>
                    </div>
                  </div> 
          </div>

          <div className="row"  id="gridWrapper">
            <div className="col carousel-root">
              <Carousel directions={this} />
            </div> 
          </div>   
        </div> 

    );
  }
}