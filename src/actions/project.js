import fetch from 'isomorphic-fetch'
import btoa from 'btoa'


export const INVALIDATE_PROJECT = 'INVALIDATE_PROJECT'

export function invalidateProject(name) {
  return {
    type: INVALIDATE_PROJECT,
    name
  }
}

export const REQUEST_PROJECT = 'REQUEST_PROJECT'

function requestProject(name) {
  return {
    type: REQUEST_PROJECT,
    name
  }
}

export const RECEIVE_PROJECT = 'RECEIVE_PROJECT'

function receiveProject(name, files) {
  return {
    type: RECEIVE_PROJECT,
    name,
    files,
    receivedAt: Date.now()
  }
}

export function fetchProject(name) {
  return function (dispatch) {
    dispatch(requestProject(name))
    return fetch('/api/readdirectory/' + btoa(name))
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(files =>
        dispatch(receiveProject(name, files))
      )
  }
}
