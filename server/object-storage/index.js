import Request from './request';

// Access Points
// https://dal.objectstorage.open.softlayer.com
// https://lon.objectstorage.open.softlayer.com

class ObjectStorage {
  constructor(userId, password, projectId, accessPoint = 'https://dal.objectstorage.open.softlayer.com'){
    this.credentials = require('./credentials.json');
    this.userId = userId;
    this.password = password;
    this.projectId = projectId;
    this.endpoint = `${accessPoint}/v1/AUTH_${projectId}`;
    this.token = null;
  }
  create(container){
    const url = `${this.endpoint}/${container}`;
    const method = 'put';
    const headers = {'x-auth-token': this.token};
    return Request({url, method, headers, json: true}, this);
  }
  list(container){
    const url = `${this.endpoint}/${container}`;
    const method = 'get';
    const headers = {'x-auth-token': this.token};
    return Request({url, method, headers, json: true}, this);
  }
  unlock(container){
    const url = `${this.endpoint}/${container}`;
    const method = 'post';
    const headers = {'x-auth-token': this.token, 'x-container-read': '.r:*, .rlistings'};
    return Request({url, method, headers, json: true}, this);
  }
  upload(container, filename, {mimetype, buffer, size}){
    const url = `${this.endpoint}/${container}/${filename}`;
    const method = 'put';
    const headers = {'x-auth-token': this.token, 'content_type': mimetype, 'content-length': size};
    return Request({url, method, headers, body: buffer}, this);
  }
}

module.exports = ObjectStorage;
