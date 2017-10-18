import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import FileEditor from './components/fileEditor'
import Home from './components/home'
import ProjectView from './components/projectView'
import './App.css';


class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home}/>
          <Route path="/editfile/:projectName/:path" component={FileEditor}/>
          <Route path="/viewproject/:path" component={ProjectView}/>
        </div>
      </Router>
    );
  }
}



export default App;
