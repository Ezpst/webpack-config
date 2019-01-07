import '../css/style.css';  // 导入css
import '../css/blue.scss'; // 导入scss

const hello = require('./hello');
document.querySelector('#root').appendChild(hello());

function two() {
    let element = document.createElement('div');
    element.innerHTML = '我是第二个入口文件';
    return element;
}

document.getElementById('root').appendChild(two());