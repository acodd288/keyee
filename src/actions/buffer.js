import fetch from 'isomorphic-fetch'
import btoa from 'btoa'


export const INVALIDATE_FILE = 'INVALIDATE_FILE'

export function invalidateFile(file) {
  return {
    type: INVALIDATE_FILE,
    file
  }
}

export const REQUEST_FILE = 'REQUEST_FILE'

function requestFile(file) {
  return {
    type: REQUEST_FILE,
    file
  }
}

export const RECEIVE_FILE = 'RECEIVE_FILE'

function receiveFile(file, content) {
  return {
    type: RECEIVE_FILE,
    file,
    content,
    receivedAt: Date.now()
  }
}

export const ADD_TEXT = 'ADD_TEXT'

export function addText(text) {
  return {
    type: ADD_TEXT,
    text
  }
}

export const REMOVE_TEXT = 'REMOVE_TEXT'

export function removeText(range) {
  return {
    type: REMOVE_TEXT,
    range
  }
}

export const MOVE_CURSOR = 'MOVE_CURSOR'

export function moveCursor(position) {
  return {
    type: MOVE_CURSOR,
    position
  }
}

export const REQUEST_WRITE_FILE = 'REQUEST_WRITE_FILE'

function requestWriteFile(buffer) {
  return {
    type: REQUEST_WRITE_FILE,
    buffer
  }
}

export const CONFIRM_WRITE_FILE = 'CONFIRM_WRITE_FILE'

function confirmWriteFile(buffer) {
  return {
    type: CONFIRM_WRITE_FILE,
    buffer
  }
}



export function fetchFile(file) {
  return function (dispatch) {
    dispatch(requestFile(file))
    return fetch('/api/readfile/' + btoa(file))
      .then(
        response => response.text(),
        error => console.log('An error occured.', error)
      )
      .then(content =>
        dispatch(receiveFile(file, content))
      )
  }
}

function shouldFetchFile(state, file) {
  const buffer = state.buffer.current;
  if (!buffer) {
    return true
  } else if (buffer.isFetching) {
    return false
  } else {
    return !buffer.isValid
  }
}

export function fetchFileIfNeeded(file) {
  return (dispatch, getState) => {
    if (shouldFetchFile(getState(),file)) {
      return dispatch(fetchFile(file))
    }
  }
}

export function writeFile(buffer) {
  return function (dispatch) {
    dispatch(requestWriteFile(buffer));
    return fetch('/api/writefile/' + btoa(buffer.fileName),
      {
        method:'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({data:buffer.content})
      })
      .then(
        response => response.ok,
        error => console.log('An error occured.', error)
      )
      .then(isOk =>
        dispatch(confirmWriteFile(buffer))
      )
  }
}
