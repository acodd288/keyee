const btoa = require('btoa')

const dir = process.env.HOME + '/projects';

let projects = {};

export function loadProject(url) {
  let name = btoa(url);
  let projectDir = dir + '/' + name;
  projects[url] = projectDir;
  let cmd = 'git clone ' + url + ' ' + name;
  child_process.execSync(cmd, {cwd: dir});
}

export function getProjectLocation(url) {
  if (!url in projects) {
    throw new Error("Project not found");
  }
  else {
    return projects[url];
  }
}
