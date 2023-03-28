import {
  fileHost
} from './../config/config'

const getFileUrl = (path) => {
  if (path.indexOf("http") != -1) {
    return path
  }
  return fileHost + "/grj/" + path
}

module.exports = {
  getFileUrl
}