import Promise from 'bluebird';
import Request from 'request';

const authUrl = 'https://identity.open.softlayer.com/v3/auth/tokens';

// Access Points
// https://dal.objectstorage.open.softlayer.com
// https://lon.objectstorage.open.softlayer.com

class ObjectStorage {
  constructor(credentialsFile, userId, password, projectId, accessPoint){
    this.credentials = require(credentialsFile);
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
    return this.query({url, method, headers, json: true});
  }
  list(container){
    const url = `${this.endpoint}/${container}`;
    const method = 'get';
    const headers = {'x-auth-token': this.token};
    return this.query({url, method, headers, json: true});
  }
  unlock(container){
    const url = `${this.endpoint}/${container}`;
    const method = 'post';
    const headers = {'x-auth-token': this.token, 'x-container-read': '.r:*, .rlistings'};
    return this.query({url, method, headers, json: true});
  }
  upload(container, filename, {mimetype, buffer, size}){
    const url = `${this.endpoint}/${container}/${filename}`;
    const method = 'put';
    const headers = {'x-auth-token': this.token, 'content_type': mimetype, 'content-length': size};
    return this.query({url, method, headers, body: buffer});
  }
  query(options){
    return R(options)
    .catch(AuthenticationError, e => {
      this.credentials.auth.identity.password.user.id = this.userId;
      this.credentials.auth.identity.password.user.password = this.password;
      this.credentials.auth.scope.project.id = this.projectId;
      const authOptions = {url: authUrl, method: 'post', body: this.credentials, json: true};
      return R(authOptions)
      .then(({response, body}) => {
        this.token = options.headers['x-auth-token'] = response.headers['x-subject-token'];
        return R(options);
      });
    });
  }
}

// -------------------------------------------------------------------------- //

module.exports = ObjectStorage;

// -------------------------------------------------------------------------- //

function R(options){
  return new Promise((resolve, reject) => {
    Request(options, (err, response, body) => {
      if(err){
        reject({err, response});
      }else if(response.statusCode === 401){
        reject(new AuthenticationError());
      }else{
        resolve({response, body});
      }
    });
  });
}

// -------------------------------------------------------------------------- //

class AuthenticationError extends Error{
  constructor(message, fileName, lineNumber){
    super(message, fileName, lineNumber);
  }
}

// -------------------------------------------------------------------------- //
