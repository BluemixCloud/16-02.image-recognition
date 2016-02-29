import Promise from 'bluebird';
import Request from 'request';
import credentials from './credentials.json';

// -------------------------------------------------------------------------- //
// -------------------------------------------------------------------------- //
// -------------------------------------------------------------------------- //

function getToken(uid, pwd, pid){
  return new Promise((resolve, reject) => {

    credentials.auth.identity.password.user.id = uid;
    credentials.auth.identity.password.user.password = pwd;
    credentials.auth.scope.project.id = pid;
    const url = 'https://identity.open.softlayer.com/v3/auth/tokens';
    const o = {url, method: 'post', body: credentials, json: true};

    Request(o, (err, res, body) => {
      let token = res.headers['x-subject-token'];
      let endpoint;

      body.token.catalog.forEach(c => {
        if(c.type === 'object-store'){
          c.endpoints.forEach(e => {
            if(e.region === 'dallas' && e.interface === 'public'){
              endpoint = e.url;
            }
          });
        }
      });

      if(err)
        reject(err);
      else
        resolve({token, endpoint});
    });
  });
}

// -------------------------------------------------------------------------- //
// -------------------------------------------------------------------------- //
// -------------------------------------------------------------------------- //

function list(container, {endpoint, token}){
  return new Promise((resolve, reject) => {

    const url = endpoint + '/' + container;
    const o = {url, method: 'get', json:true};

    Request(o, (err, res, body) => {
      if(err)
        reject(err);
      else
        resolve(body);
    });
  });
}

// -------------------------------------------------------------------------- //
// -------------------------------------------------------------------------- //
// -------------------------------------------------------------------------- //

function create(container, {endpoint, token}){
  return new Promise((resolve, reject) => {

    const url = endpoint + '/' + container;
    const headers = {'x-auth-token': token};
    const o = {url, method: 'put', headers, json:true};

    Request(o, (err, res, body) => {
      if(err)
        reject(err);
      else
        resolve(body);
    });
  });
}

// -------------------------------------------------------------------------- //
// -------------------------------------------------------------------------- //
// -------------------------------------------------------------------------- //

function read(container, {endpoint, token}){
  return new Promise((resolve, reject) => {

    const url = endpoint + '/' + container;
    const headers = {'x-auth-token': token, 'x-container-read': '.r:*, .rlistings'};
    const o = {url, method: 'post', headers, json:true};

    Request(o, (err, res, body) => {
      if(err)
        reject(err);
      else
        resolve(body);
    });
  });
}

// -------------------------------------------------------------------------- //
// -------------------------------------------------------------------------- //
// -------------------------------------------------------------------------- //

var cc = 'beta';
var tt;

getToken('52f3669377494493b17b2d804ff62f24', 'Pw8jV?M?2lSew&Fe', 'cd07aefb3a944d679e97ed0b37e39569')
.then(function(t){
  tt = t;
  return create(cc, tt);
})
.then(function(t){
  return read(cc, tt);
})
.then(function(t){
  return list(cc, tt);
})
.then(function(d){
  console.log('+-+-+-', d);
});

// -------------------------------------------------------------------------- //
// -------------------------------------------------------------------------- //
// -------------------------------------------------------------------------- //
