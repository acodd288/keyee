import React from 'react'
import {
  Link
} from 'react-router-dom'
import btoa from 'btoa'

const Folder = ({name, children}) => {
  if (!children) {
    return (
      <div>
        <Link to={'/editfile/'+btoa(name)}>{name}</Link>
      </div>
    );
  }
  else {
    return (
      <div>
      <span>></span>
      <span>
        {name}
        <div>
          {children.map((e, i) => {
              return (
                <Folder key={i} name={e.path} children={e.children}/>
              );
            }
          )}
        </div>
      </span>
      </div>
    );
  }
}

export default Folder;
