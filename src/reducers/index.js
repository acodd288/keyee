import { combineReducers } from 'redux'
import {swipe} from './swipe'
import buffer from './buffer'
import keyboard from './keyboard'
import project from './project'

export const keyboardApp = combineReducers({
  buffer,
  swipe,
  keyboard,
  project
})

export default keyboardApp
