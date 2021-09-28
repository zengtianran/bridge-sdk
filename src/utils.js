
const _ua = window.navigator.userAgent
/**
 * 判断类型
 * @param {*} type
 */
function isType(type) {
  return function(val) {
    return Object.prototype.toString.call(val) === `[object ${type}]`
  }
}
export default {
  ua: _ua,
  isIOS() {
    return /(iPhone|iPad|iPod|iOS)/i.test(_ua)
  },
  isAndroid() {
    return /(Android)/i.test(_ua)
  },
  isWebView() {
    return window && window.hasOwnProperty('document')
  },
  isAndroidWebView() {
    return _ua.indexOf('Android') !== -1 || _ua.indexOf('Adr') > -1
  },
  isApp() {
    return _ua.indexOf('COM_MSTPAY') > -1
  },
  isWX() {
    return /MicroMessenger/i.test(_ua)
  },
  isAlipay() {
    return /Alipay/i.test(_ua)
  },
  isString: isType('String'),
  isFunction: isType('Function')
}
