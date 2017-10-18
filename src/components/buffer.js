import React, { Component } from 'react'
import { connect } from 'react-redux'
import atob from 'atob'
import BufferLine from './bufferLine'
import {fetchFile, moveCursor} from '../actions/buffer'

const styles = {
  whiteSpace:'pre',
  userSelect:'none'
}

function getRequestedFilename(props) {
  try {
    return atob(props.match.params.path);
  }
  catch (e) {
    return "";
  }
}

function handleMove(event, dispatch) {
  try {
    let changedTouch = event.changedTouches[0];
    let range = document.caretRangeFromPoint(changedTouch.clientX, changedTouch.clientY);
    let span;
    if (range.startContainer.nodeName === "#text") {
      span = range.startContainer.parentElement;
    }
    else {
      span = range.startContainer;
    }
    let start = parseInt(span.getAttribute('data-position'), 10);
    let offset = range.startOffset;
    dispatch(moveCursor(start + offset));
  }
  catch(e) {
    console.log(e)
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
      let lines = text.split("\n");
      let lineStartPositions =
        lines.reduce((acc, v) => {
          return acc.concat([acc[acc.length - 1] + v.length + 1]);
        }, [0])
      return (
        <div style={styles}>
          <div>{current.fileName}</div>
          <div onTouchEnd={(e) => handleMove(e, this.props.dispatch)}>
              {lines.map((e, i) => (
                <BufferLine key={i} line={e}
                  startPosition={lineStartPositions[i]}
                  cursorPosition={cursorPosition}/>))}
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    buffer: state.buffer
  }
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
