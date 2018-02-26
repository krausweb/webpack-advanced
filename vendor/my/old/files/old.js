'use strict';

function FooOld (data, itemId = false, alertCall = true) {
  if (alertCall) {
    alert(data)
  }
  if (itemId) {
    document.getElementById(itemId).textContent = data;
  }

  console.log(data);
}

function TestOld(msg) {
  alert(msg);
}