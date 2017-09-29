import React, { Component } from 'react';
import { connect } from 'react-redux'
import {fetchProject} from '../actions/project'
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
          <Folder name={project.files.path} children={project.files.children}/>
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
