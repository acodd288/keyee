import React, { Component } from 'react';
import Keyboard from './keyboard';
import Buffer from './buffer';

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
  overflow:'scroll'
}

class FileEditor extends Component {
  render() {
    return (
      <div style={styles} className="FileEditor">
        <div style={bufferStyle}>
          <Buffer match={this.props.match}/>
        </div>
        <div style={keyboardStyle}>
          <Keyboard/>
          <br/>
        </div>
      </div>
    );
  }
}



export default FileEditor;
