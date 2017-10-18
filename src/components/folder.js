import React from 'react'
import {
  Link
} from 'react-router-dom'
import btoa from 'btoa'

const Folder = ({file, expand, expandList, projectName}) => {
  let name = file.path;
  if (!file.children) {
    return (
      <div>
        <Link to={'/editfile/'+btoa(projectName)+'/'+btoa(name)}>{name}</Link>
      </div>
    );
  }
  else if (expandList.indexOf(file.path) === -1) {
    return (
      <div>
      <span onClick={() => expand(name, true)}>></span>
      <span>
        {name}
      </span>
      </div>
    );
  }
  else {
    return (
      <div>
      <span onClick={() => expand(name, false)}>></span>
      <span>
        {name}
        <div>
          {file.children.map((e, i) => {
              return (
                <Folder key={i}
                  file={e}
                  expand={expand}
                  expandList={expandList}
                  projectName={projectName}/>
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
