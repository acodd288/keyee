import fetch from 'isomorphic-fetch'

export function trackSwipe(swipe) {
  fetch('/api/trackswipe/',
    {
      method:'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({data:swipe})
    })
    .then(
      response => response.ok,
      error => console.log('An error occured.', error)
    )
}


const swipeTrackerMiddleware = store => next => action => {
  let result = next(action);
  let swipe = store.getState().swipe;
  if (action.type === 'SWIPE_END') {
    trackSwipe(swipe);
  }
  return result
}

export default swipeTrackerMiddleware;
