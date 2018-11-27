import React from 'react';
import ReactDOM from 'react-dom';
import './css/bootstrap.css';
import './css/index.css';
import './css/fonts.css';
import {Wizard} from './components/Wizard';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }  

  render(){ 
    return( 
       <Wizard/>
    );
  }
}
 
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
