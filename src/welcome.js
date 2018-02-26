'use strict';

export default function (message) {
  if (NODE_ENV == 'development') {
    console.log(message);
  }

  //document.querySelector('#content').textContent = `Write ${message}`;
  //debugger;
  alert(`Welcome. ${message}`);
}