import fetch from 'isomorphic-fetch'
import btoa from 'btoa'
import {setWordPriors} from './swipe'


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
  return function (dispatch, getState) {
    dispatch(requestProject(name))
    return fetch('/api/readdirectory/' + btoa(name))
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(({files, words}) => {
        let wordPriors = getState().swipe.wordPriors;
        wordPriors = [...wordPriors, ...words.map(e=>({word:e, probability:1}))];
        dispatch(setWordPriors(wordPriors));
        dispatch(receiveProject(name, files))
      }
      )
  }
}

export const EXPAND_FILE = 'EXPAND_FILE'

export function expandFile(path, state) {
  return {
    type: EXPAND_FILE,
    path,
    state
  }
}
