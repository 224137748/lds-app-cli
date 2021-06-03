import './css/style.less';
import { message } from './js/hello';

console.log(message);
/**
 * 让当前模块和引入的模块支持热更新
 * 详情参考：https://www.webpackjs.com/api/hot-module-replacement/
 */
if (module.hot) {
  module.hot.accept();
  module.hot.accept('./js/hello.js');
}