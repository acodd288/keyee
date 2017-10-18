import React from 'react'
import Cursor from './cursor'

const LineByChar = ({line, startPosition}) => {
  return (<span style={{width:'100%'}} data-position={startPosition}>
    {line}
  </span>);
}

const BufferLine = ({line, startPosition, cursorPosition}) => {
    let cursorPositionOnLine = cursorPosition - startPosition;
    // Cursor line
    if (cursorPositionOnLine >= 0 &&
      cursorPositionOnLine <= line.length)  {
      let before = line.substring(0,cursorPositionOnLine);
      let after = line.substring(cursorPositionOnLine);
      return (<div>
          <LineByChar line={before} startPosition={startPosition}/>
          <Cursor/>
          <LineByChar line={after} startPosition={cursorPosition}/>
        </div>
      );
    }
    else if (line === "") {
      return (<div>
        <span style={{width:'100%'}} data-position={startPosition}>
          <br/>
        </span>
      </div>)
    }
    else {
      return (
        <div>
          <LineByChar line={line} startPosition={startPosition}/>
        </div>
      );
    }
}

export default BufferLine;
