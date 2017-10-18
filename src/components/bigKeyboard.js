import React, { Component } from 'react'
import { connect } from 'react-redux'
import { swipe_end } from '../actions'
import { addWord } from '../actions/buffer'
import { setSwipeKeyboardLayout } from '../actions/swipe'
import Key from './key'
import Suggestions from './suggestions'
import SwipeCanvas from './swipeCanvas'
import _ from 'underscore'

const styles = {
  userSelect: "none",
  fontSize: '20px',
  position: 'absolute',
  left:'50%',
  margin:0,
  width:'100%',
  transform: 'translate(-50%,0)'
}

const space = {displayHtml:'\u00a0', text: ' '};
const enter = {displayHtml:'\u23CE', text: '\n'};
const backspace = {displayHtml:'\u232B', text: 'BACKSPACE'};
const moveLeft = {displayHtml:'\u2190', text: 'MOVE_LEFT'};
const moveRight = {displayHtml:'\u2192', text: 'MOVE_RIGHT'};
const capsLock = {displayHtml:'\u21D1', text: 'CAPSLOCK'};
const numberSymbols = {displayHtml:'?123', text: 'NUMBER_SYMBOLS'};

const qwerty = [
  Array.from('QWERTYUIOP'),
  Array.from('ASDFGHJKL'),
  [capsLock, ...Array.from('ZXCVBNM')],
  [numberSymbols, space, enter, backspace],
  [moveLeft, moveRight]
]

const qwertyLowerCase = qwerty.map(row =>
  row.map(e => {
  if (e.toLowerCase) {
    return e.toLowerCase();
  }
  else {
    return e;
  }
}));

const numberSymbolsKeys = [
  Array.from('1234567890'),
  Array.from('<>[]{}()'),
  Array.from('=+-*/'),
  [numberSymbols, ...Array.from(',\'"\\.;')],
]

function isBold(probability) {
  return probability > 0.8
}

function center(rect, baseRect) {
  return {
    y: (rect.bottom + rect.top)/2 - baseRect.top,
    x: (rect.left + rect.right)/2 - baseRect.left
  }
}

class BigKeyboard extends Component {
  componentDidMount() {
    this.reloadKeyboardLayout();
  }

  reloadKeyboardLayout() {
    let keyboard = this.refs.keyboard;
    let rect = keyboard.getBoundingClientRect();
    let keys = Array.from(keyboard.getElementsByClassName('key')).map(ele => {
      let keyRect = ele.getBoundingClientRect()
      return {
        rect: keyRect,
        keyboardRect: rect,
        center:center(keyRect, rect),
        key:ele.getAttribute('data-swipe')};
      });
    let stage = {x:rect.right - rect.left, y:rect.bottom - rect.top};
    let keyboardLayout = {stage, keys};
    this.props.dispatch(setSwipeKeyboardLayout(keyboardLayout));
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.keyboard, this.props.keyboard)) {
      this.reloadKeyboardLayout();
    }
  }

  render() {
    const add_suggestion = (word) => {
      this.props.dispatch(addWord(word));
      this.props.dispatch(swipe_end([]));
    }

    let keys;

    if (this.props.keyboard.numberSymbols) {
      keys = numberSymbolsKeys;
    }
    else if (this.props.keyboard.capsLock) {
      keys = qwerty;
    }
    else {
      keys = qwertyLowerCase;
    }

    return (
      <div>

        <div>
          <Suggestions
            suggestions={this.props.swipe.suggestions}
            isBold={isBold}
            onClick={add_suggestion}/>
        </div>
        <div style={styles} ref="keyboard" className="Keyboard">
          <SwipeCanvas
            corners={this.props.swipe.corners}
            width={this.props.swipe.keyboardLayout.stage.x}
            height={this.props.swipe.keyboardLayout.stage.y}
            dispatch={this.props.dispatch}
            keyboardLayout={this.props.swipe.keyboardLayout}/>

          {keys.map((row, index) => (
            <div key={index}>
              {row.map(letter => (
                <Key key={letter.text || letter} keyA={letter}/>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  let {swipe, keyboard} = state;
  return {
    swipe,
    keyboard
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  }
}

const BigKeyboardConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)(BigKeyboard)

export default BigKeyboardConnect
