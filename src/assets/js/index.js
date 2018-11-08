//index.js 
import '../css/style.css';  // 导入css
import '../css/blue.scss'; // 导入scss

const hello = require('./hello');
document.querySelector('#root').appendChild(hello());