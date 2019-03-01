import './style.css';  // 导入css
import './blue.scss'; // 导入scss

const hello = require('../../assets/js/hello');
document.querySelector('#root').appendChild(hello());

function two() {
    let element = document.createElement('div');
    element.innerHTML = '我是第二个入口文件';
    return element;
}

document.getElementById('root').appendChild(two());