import { initMixin } from './initCore'
import { callApp, registerApp } from './invoke'

const age = {}
console.log(age)

class HsaSdk {
  constructor() {
    this._init()
  }
  _init() {
    /**
     * bridge初始化，定义与原生通讯相关方法
     */
    initMixin()
  }
  /**
   * 调用APP注册方法
   * @param {*} method
   * @param {*} params
   */
  call(method, params) {
    return new Promise((resolve, reject) => {
      callApp(method, params, (data) => {
        // data, 原生回调数据:todo处理数据格式
        resolve(data)
      })
    })
  }
  /**
   * JS注册方法供APP调
   * @param {*} method 注册方法
   */
  register(method) {
    return new Promise((resolve, reject) => {
      registerApp(method, function(data, responseCallback) {
        // data: 原生调用JS方法成功，返回数据\参数；接收原⽣传过来数据，并处理逻辑
        // responseCallback: 逻辑处理完执行原生回调,回调数据给原⽣ responseCallback({})
        resolve(data, responseCallback)
      })
    })
  }
  /**
   * 定义具体标准方法(刷脸验证)
   */
  faceVerify() {

  }
}
export default new HsaSdk()
