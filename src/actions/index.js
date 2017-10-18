
export const swipe_start = () => {
  return {
    type: 'SWIPE_START'
  }
}

export const swipe_move = (key, timestamp) => {
  return {
    type: 'SWIPE_MOVE',
    key,
    timestamp
  }
}

export const swipe_end = (touches) => {
  return {
    type: 'SWIPE_END',
    touches
  }
}
