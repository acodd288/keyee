import React, { Component } from 'react';
import BigKeyboard from './bigKeyboard';
import Buffer from './buffer';
import { connect } from 'react-redux'
import atob from 'atob'
import {fetchProject} from '../actions/project'

const styles = {
  position:'absolute',
  height:'100%',
  width:'100%',
  overflow:'hidden'
}

const keyboardStyle = {
  position:'absolute',
  bottom:'0',
  left:'0',
  height:'35%',
  width:'100%',
  textAlign:'center'
}

const bufferStyle = {
  position:'absolute',
  top:0,
  left:0,
  height:'65%',
  width:'100%',
  overflow:'scroll',
}

class FileEditor extends Component {
  componentDidMount(){
    let urlProjectName = atob(this.props.match.params.projectName);
    this.props.dispatch(fetchProject(urlProjectName));
  }

  render() {

    return (
      <div style={styles} className="FileEditor">
        <div style={bufferStyle}>
          <Buffer match={this.props.match}/>
        </div>
        <div style={keyboardStyle}>
          <BigKeyboard/>
          <br/>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  }
}

const componentConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileEditor)


export default componentConnect;
