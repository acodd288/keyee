import React from 'react'

const styles = {
  margin: "3px",
  fontSize: '20px'
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
    <button className='key' style={styles} data-swipe={text}>
        {displayHtml}
    </button>
  );
}

export default Key;
