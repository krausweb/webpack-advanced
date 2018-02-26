'use strict';

import welcome from './welcome';
// if need create [name].css via JS script !!!
import './index.sass';
// if need styles in JS
//import '!style-loader!css-loader!resolve-url-loader!sass-loader?sourceMap!./styles.sass';
// in this case - use absolute url path, example /js/img/myimg.jpg
//import '!style-loader!css-loader!sass-loader?sourceMap!./styles.sass';
import template from './block.jade';



if (document.querySelector('#news')) {
  news.textContent = 'Text inserted via index.js';
}

//welcome('Text via /js/index.js');

class Index {
  constructor (options) {
    this.elem = document.createElement('div');
    this.elem.innerHTML = template(options);
    this.elem.className = options.class;
    this.elem.title = options.title;

    let sassTag = document.querySelector('#news');
    console.log(sassTag);
    //this.elem.appendChild('Text via index.js -> class Index');
  }
}



export {welcome, Index};