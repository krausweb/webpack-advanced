'use strict';

import welcome from './welcome';

// include via cdn (webpack.config.js)
import $ from 'jquery';

// include via alias (webpack.config.js)
const oldJs = require('imports-loader?myName=>"Alex"!exports-loader?TestOld!myOldFiles');
// or add old.js file
// import old from 'imports-loader?myName=>"Alex"!exports-loader?FooOld!myOldFiles';

// jQuery	imports-loader?&=jquery!myOldFiles;
// exports-loader?myData=>'test'!myOldFiles

oldJs('Old function was included', 'appHome', false);
//TestOld('Second Old function');

new Vue({
  el: '#appVue',
  data: {
    msg: 'JS include'
  }
});

$('#appJQuery').text('Import jQuery via external URL');

welcome('home');

export {welcome, oldJs};