import {writeFile} from '../actions/buffer'

const writeFileMiddleware = store => next => action => {
  let before = store.getState().buffer.current;
  let result = next(action);
  let after = store.getState().buffer.current;
  if (before.isValid &&
    after.isValid &&
    before.fileName === after.fileName &&
    before.content !== after.content) {
    store.dispatch(writeFile(after));
  }
  return result
}

export default writeFileMiddleware;
