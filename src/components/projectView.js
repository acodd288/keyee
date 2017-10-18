import React, { Component } from 'react';
import { connect } from 'react-redux'
import {fetchProject, expandFile} from '../actions/project'
import Folder from './folder'
import atob from 'atob'

function getRequestedProjectName(props) {
  try {
    return atob(props.match.params.path);
  }
  catch (e) {
    return "";
  }
}

class ProjectView extends Component {
  componentDidMount() {
      let name = getRequestedProjectName(this.props);
      this.props.dispatch(fetchProject(name))
  }

  componentDidUpdate(prevProps) {
    let name = getRequestedProjectName(this.props);
    if (name !== getRequestedProjectName(prevProps)) {
      this.props.dispatch(fetchProject(name))
    }
  }

  render() {
    let {project} = this.props;
    if (project.isFetching) {
      return (<div>Loading...</div>)
    }
    else if (!project.isValid ||
      getRequestedProjectName(this.props) !== project.name) {
      return (<div>Invalid project</div>)
    }
    else {
      return (
        <div style={{overflow:'scroll'}}>

          <Folder
            file={project.files}
            expand={(path, state) => this.props.dispatch(expandFile(path, state))}
            expandList={project.expandList}
            projectName={this.props.project.name}/>
          </div>
      );
    }
  }
}


const mapStateToProps = state => {
  return state
}

const mapDispatchToProps = dispatch => {
  return { dispatch }
}

const ProjectViewConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectView)

export default ProjectViewConnect;
