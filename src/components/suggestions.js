import React from 'react'

const Suggestions = ({suggestions, onClick, isBold}) => {
  suggestions = suggestions.slice(0,2);

  let genStyles = (suggestion) => {
    if (isBold(suggestion.probability)) {
      return {
        fontWeight:'bold'
      };
    }
    else {
      return {};
    }
  }
  let x;
  if(suggestions.length === 0) {
    x = ".";
  }
  else {
    x = suggestions.map((val, i) =>
    (<button
      key={i}
      style={genStyles(val)}
      onClick={() => onClick(val.word)}>
      {val.word}
    </button>));
  }

  return (
    <div>
      <span>
        {x}
      </span>
    </div>
  )
}


export default Suggestions;
