import React from 'react';
import {
  Link
} from 'react-router-dom'
import btoa from 'btoa'

function home() {
  return (
    <div>
      <div>
      <Link to={'/viewproject/' + btoa('/home/simple/projects/testproj')}>test proj</Link>
      </div>
      <div>
        <Link to={'/viewproject/'+btoa('/home/simple/projects/keyee')}>keyee</Link>
      </div>
    </div>);
}

export default home;
