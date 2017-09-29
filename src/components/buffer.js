import React, { Component } from 'react'
import { connect } from 'react-redux'
import atob from 'atob'
import Cursor from './cursor'
import {fetchFile} from '../actions/buffer'

const styles = {
  whiteSpace:'pre'
}


function getRequestedFilename(props) {
  try {
    return atob(props.match.params.path);
  }
  catch (e) {
    return "";
  }
}

class Buffer extends Component {
  componentDidMount() {
      let file = getRequestedFilename(this.props);
      this.props.dispatch(fetchFile(file))
  }

  componentDidUpdate(prevProps) {
    let file = getRequestedFilename(this.props);
    if (file !== getRequestedFilename(prevProps)) {
      this.props.dispatch(fetchFile(file))
    }
  }

  render() {
    let {current} = this.props.buffer;
    if (!current.isValid ||
      getRequestedFilename(this.props) !== current.fileName) {
      return (<div>Invalid file</div>)
    }
    else if (current.isFetching) {
      return (<div>Loading...</div>)
    }
    else {
      let text = current.content;
      let {cursorPosition} = current;
      let textBeforeCursor = text.substring(0,cursorPosition);
      let linesBeforeCursor = textBeforeCursor.split("\n");
      let cursorLine = linesBeforeCursor.length - 1;
      let cursorPositionOnLine = linesBeforeCursor[cursorLine].length;
      let lines = text.split("\n");
      return (
        <div style={styles}>
          <div>{current.fileName}</div>
          <div>
              {lines.map((e, i) => {
                if (i !== cursorLine) {
                  return (<div key={i}>{e}</div>);
                }
                else {
                  return (<div key={i}>
                    <span>{e.substring(0,cursorPositionOnLine)}</span>
                    <Cursor/>
                    <span>{e.substring(cursorPositionOnLine)}</span>
                  </div>)
                }
              })}
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return state
}

const mapDispatchToProps = dispatch => {
  return { dispatch
  }
}

const BufferConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)(Buffer)

export default BufferConnect;
