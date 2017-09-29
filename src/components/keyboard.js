import React, { Component } from 'react'
import { connect } from 'react-redux'
import { swipe_start, swipe_move, swipe_end } from '../actions'
import { addText, removeText, moveCursor } from '../actions/buffer'
import { setCapslock } from '../actions/keyboard'
import Key from './key'
import Suggestions from './suggestions'

const styles = {
  userSelect: "none"
}

const space = {displayHtml:'\u00a0', text: ' '};
const enter = {displayHtml:'\u23CE', text: '\n'};
const backspace = {displayHtml:'\u232B', text: 'BACKSPACE'};
const moveLeft = {displayHtml:'\u2190', text: 'MOVE_LEFT'};
const moveRight = {displayHtml:'\u2192', text: 'MOVE_RIGHT'};
const capsLock = {displayHtml:'\u21D1', text: 'CAPSLOCK'};

const qwerty = [
  Array.from('QWERTYUIOP'),
  Array.from('ASDFGHJKL'),
  Array.from('({ZXCVBNM})'),
  [...Array.from('<[,\'"\\'), space, ...Array.from('.;]>'), enter, backspace],
  [capsLock, moveLeft, moveRight]
]

function handle_swipe_move(event, swipe_move) {
  let changedTouch = event.changedTouches[0];
  let elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
  if (elem && elem.getAttribute('data-swipe')) {
    swipe_move(elem.getAttribute('data-swipe'), event.timeStamp)
  }
}


function isBold(probability) {
  return probability > 0.8
}

function maybeAddSpace(currentBuffer, suggestion) {
  if (currentBuffer.isValid) {
    let previousChar = currentBuffer.content[currentBuffer.cursorPosition - 1];
    if (currentBuffer.cursorPosition === 0 || previousChar === ' ' || previousChar === '.' || previousChar === '\n') {

    }
    else {
      suggestion = ' ' + suggestion;
    }
  }
  return suggestion;
}

class Keyboard extends Component {
  render() {
    const add_suggestion = (word) => {
      this.props.addText(maybeAddSpace(this.props.buffer.current, word));
      this.props.swipe_end();
    }

    const pressKey = (key) => {
      if (key === 'BACKSPACE') {
        let {cursorPosition} = this.props.buffer.current;
        this.props.removeText({start:cursorPosition-1, end:cursorPosition});
      }
      else if (key === 'MOVE_LEFT') {
        let {cursorPosition} = this.props.buffer.current;
        this.props.moveCursor(Math.max(0, cursorPosition-1));
      }
      else if (key === 'MOVE_RIGHT') {
        let {cursorPosition, content} = this.props.buffer.current;
        this.props.moveCursor(Math.min(content.length, cursorPosition+1));
      }
      else if (key === 'CAPSLOCK') {
        this.props.setCapslock(!this.props.keyboard.capsLock);
      }
      else {
        if (!this.props.keyboard.capsLock) {
          key = key.toLowerCase();
        }
        this.props.addText(key);
      }
      this.props.swipe_end();
    }

    const handle_swipe_end = (event, suggestions) => {
      try {
        if (isBold(suggestions[0].probability)) {
          add_suggestion(suggestions[0].word);
        }
      }
      catch (e) {

      }
      this.props.swipe_end();
    }

    let keys = this.props.swipe.keys.map(val=>val.key);
    if (keys.length === 0) {
      keys = ".";
    }

    return (
      <div>
        <div style={styles} className="Keyboard"
          onTouchStart={(e) => this.props.swipe_start()}
          onTouchMove={(e) => handle_swipe_move(e, this.props.swipe_move)}
          onTouchEnd={(e) => handle_swipe_end(e, this.props.swipe.suggestions)}>

          <div>
            <Suggestions
              suggestions={this.props.swipe.suggestions}
              isBold={isBold}
              onClick={add_suggestion}/>
          </div>
          {qwerty.map((row, index) => (
            <div key={index}>
              {row.map(letter => (
                <Key key={letter.text || letter} keyA={letter} pressKey={pressKey} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state
}

const mapDispatchToProps = dispatch => {
  return {
    swipe_move: (key, timestamp) => {
      dispatch(swipe_move(key, timestamp))
    },
    swipe_end: () => {
      dispatch(swipe_end())
    },
    swipe_start: () => {
      dispatch(swipe_start())
    },
    addText: (text) => {
      dispatch(addText(text))
    },
    removeText: (range) => {
      dispatch(removeText(range))
    },
    moveCursor: (position) => {
      dispatch(moveCursor(position))
    },
    setCapslock: (state) => {
      dispatch(setCapslock(state))
    }
  }
}

const KeyboardConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)(Keyboard)

export default KeyboardConnect
