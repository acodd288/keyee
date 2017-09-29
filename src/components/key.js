import React from 'react'

const styles = {
  margin: "3px"
}

const Key = ({keyA, pressKey, onMouseOver, onMouseLeave}) => {
  let displayHtml, text;
  if (typeof keyA === "string") {
    displayHtml = keyA;
    text = keyA;
  }
  else {
    displayHtml = keyA.displayHtml;
    text = keyA.text;
  }
  return (
    <button style={styles} onClick={()=>pressKey(text)} data-swipe={text}>
        {displayHtml}
    </button>
  );
}

export default Key;
