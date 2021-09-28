// 如果非JS自动处理init初始化注入js模块又原生内置加载注入方法initMixin
// 引入初始化函数
import { setupWebViewJavascriptBridge } from './init'
/**
 * 调用APP方法
 * @param {*} method 调用方法名
 * @param {*} params 方法参数
 * @param {*} callback 成功回调函数
 */
export function callApp(method, params, callback) {
  setupWebViewJavascriptBridge(function(bridge) {
    bridge.callHandler(method, params, callback)
  })
}
/**
 *  注册方法供原生调用
 * @param {*} method 注册方法名
 * @param {*} callback 处理函数
 */
export function registerApp(method, callback) {
  setupWebViewJavascriptBridge(function(bridge) {
    bridge.registerHandler(method, callback)
  })
}
