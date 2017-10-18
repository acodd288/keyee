import {
  SET_WORD_PRIORS,
  SWIPE_TOUCH,
  SWIPE_CLICK,
  SWIPE_KEYBOARD_LAYOUT} from '../actions/swipe'
import {
  cornersFromTouches,
  getCandidates} from './swipe/curvature'

export function calculateWordProbability(word, keys) {
  const MissingWordLetterCost = -10;
  const MissingKeyCost = -1;
  const MatchBenefit = 10;
  // base case
  if (keys.length === 0) {
    return word.length * MissingWordLetterCost;
  }
  if (word.length === 0) {
    return keys.length * MissingKeyCost;
  }

  // recursive case
  if (word[0].toLowerCase() === keys[0].key.toLowerCase()) {
    return MatchBenefit +
      Math.max(
        // single key press
        calculateWordProbability(word.slice(1), keys.slice(1)),
        // multiple key press
        calculateWordProbability(word.slice(1), keys)
        );
  }
  else {
    return Math.max(
      // unmatched word letter
      MissingWordLetterCost + calculateWordProbability(word.slice(1),keys),
      // unmatched key
      MissingKeyCost + calculateWordProbability(word,keys.slice(1))
    );
  }
}

export function normalizeProbability(list) {
  let sum = list.reduce((acc, val) => acc + val.probability);
  return list.map(val => {
    return {...val, probability:val.probability/sum}
  });
}

export function normalize(list) {
  let min = list.reduce((acc, val) => Math.min(acc,val), 0);
  list = list.map(val=>val-min);
  let sum = list.reduce((acc, val) => acc + val, 0);
  return list.map(val => val/sum);
}


export function arrayMultiply(list1, list2) {
  if (list1.length !== list2.length) {
    throw new Error("Lists must be the same length");
  }

  return list1.map((val, i) => val * list2[i]);
}

export function generateSuggestions(wordPriors, keys) {
  let words = wordPriors.map(val => val.word);
  let priors = wordPriors.map(val => val.probability);
  priors = normalize(priors);
  let likelihood = words.map( val =>
    calculateWordProbability(val.split(""),keys));
  likelihood = normalize(likelihood);
  let posterior = arrayMultiply(likelihood,priors);
  posterior = normalize(posterior);
  let wordPosterior = words.map((val, i) =>
    ({word:val, probability:posterior[i]}));
  //maximize posterior
  wordPosterior.sort((a,b)=> b.probability - a.probability);
  return wordPosterior.slice(0,2);
}

export function pressKey(state, action) {
  let key = action.key;
  let start = action.timestamp;
  let end = action.timestamp;
  let previousKeys = state.slice(0, state.length-1);
  if (state.length !== 0) {
    let last = state[state.length-1];
    if (last.key === action.key) {
      start = last.start;
    }
    else {
      previousKeys = state;
    }
  }
  return [...previousKeys, {key ,start ,end}];
}

export const swipe = (state =
  {
    keys:[],
    suggestions:[],
    wordPriors:[],
    touches:[],
    simulatePath:[],
    corners:[],
    keyboardLayout:{stage:{x:0,y:0}, keys:[]}
  }, action) => {
  let suggestions = [];
  let touches;
  switch (action.type) {
    case 'SWIPE_START':
      return {...state, keys:[], touches:[], corners:[]};
    case 'SWIPE_MOVE':
      let keys = pressKey(state.keys, action);
      suggestions = generateSuggestions(state.wordPriors, keys);
      // return {...state, keys, suggestions};
      return state;
    case 'SWIPE_END':
      ({touches} = action);
      suggestions = getCandidates(touches, state.wordPriors, state.keyboardLayout.keys).slice(0,4)
      let corners = cornersFromTouches(touches);
      return {...state, touches, suggestions, corners};
    case SWIPE_CLICK:
      // let key = findClosestLetter(action,  state.keyboardLayout.keys);
      return {...state};
    case SWIPE_TOUCH:
      touches = [...state.touches, {x:action.x, y:action.y}];
      // suggestions = generateSuggestionsFromTouches(touches, state.keyboardLayout.keys, state.wordPriors)
      return {...state, touches, suggestions};
    case SET_WORD_PRIORS:
      return {...state, wordPriors: action.wordPriors};
    case SWIPE_KEYBOARD_LAYOUT:
      return {...state, keyboardLayout: action.layout};
    default:
      return state;
  }
}
