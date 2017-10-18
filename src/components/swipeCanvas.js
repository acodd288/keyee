import React, {Component} from 'react'
import {swipe_end} from '../actions'
import {swipeClick} from '../actions/swipe'

const styles = {
  top: 0,
  left: 0,
  position: 'absolute'
}

class SwipeCanvas extends Component {
  constructor(props) {
    super(props);
    this.points = [];
    this.swipeStartTime = null;
  }
  componentDidMount() {
    this.draw();
  }
  componentDidUpdate(prevProps, prevState) {
    this.draw();
  }
  draw() {
    var ctx = this.refs.canvas.getContext("2d");

    ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
    ctx.strokeStyle="#00FF00";
    this.props.keyboardLayout.keys.forEach(({rect, keyboardRect}) => {
      ctx.strokeRect(rect.left - keyboardRect.left,rect.top - keyboardRect.top,rect.width, rect.height)
    });
    ctx.beginPath();
    this.points.forEach((e, i) => {
      let x = e.x;
      let y = e.y;
      if (i === 0) {
        ctx.moveTo(x,y);
      }
      else {
        ctx.lineTo(x,y);
      }
    });
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle="#FF0000";
    this.props.corners.forEach(({x,y}) => ctx.fillRect(x-2,y-2,4,4));

    ctx.fillStyle="#00FF00";
    this.points.forEach(({x,y}) => ctx.fillRect(x-1,y-1,2,2));
  }

  getPointFromEvent(event){
    if (event.changedTouches) {
      let {clientX, clientY} = event.changedTouches[0];
      var rect = document.getElementById('canvas').getBoundingClientRect();
      return {x:clientX - rect.left, y:clientY - rect.top};
    }
    else {
      return undefined;
    }
  }

  recordTouch(event) {
    let point = this.getPointFromEvent(event);
    if (point) {
      this.points.push(point);
      this.draw();
    }
  }

  onTouchStart(event) {
    this.points = [];
    this.swipeStartTime = event.timeStamp;
    this.recordTouch(event);
    this.draw();
  }

  onTouchMove(event) {
    this.recordTouch(event);
  }

  onTouchEnd(event) {
    this.recordTouch(event);
    if (event.timeStamp - this.swipeStartTime < 200) {
      // It's a click!
      let point = this.points[this.points.length - 1]
      this.props.dispatch(swipeClick(point));
      this.points = [];
    }
    else {
      this.props.dispatch(swipe_end(this.points));
    }
    this.swipeStartTime = null;
    this.draw();
  }

  render() {
    let {height, width} = this.props;
    return (
      <canvas id='canvas' ref='canvas' style={styles} width={width} height={height}
       onTouchStart={(e) => this.onTouchStart(e)}
       onTouchMove={(e) => this.onTouchMove(e)}
       onTouchEnd={(e) => this.onTouchEnd(e)}
       />
    );
  }
}

export default SwipeCanvas;
