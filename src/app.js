'use strict';

let moment = require('moment');
let today = moment(new Date()).locale('ru');
appIndex.textContent = today.format("DD MMM YYYY");


getLogin.onclick = function () {
  import('./login')
    .then(login => {
      console.log('Import Login');
      return login.default();
    })
    .catch(err => {
      console.log(`Eroor ${err}`);
    });
};