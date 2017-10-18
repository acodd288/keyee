import React from 'react';
import {
  Link
} from 'react-router-dom'
import btoa from 'btoa'

function home() {
  return (
    <div>
      <div>
      <Link to='/viewproject/L2hvbWUvYWNvZGQvdy90ZXN0cHJvag=='>test proj</Link>
      </div>
      <div>
        <Link to={'/viewproject/'+btoa('/home/acodd/w/keyboard-clone')}>keyboard-clone</Link>
      </div>
    </div>);
}

export default home;
