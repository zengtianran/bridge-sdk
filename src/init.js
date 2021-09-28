/**
 * 方法调用入口
 * @param {*} callback 回调函数
 */
export function setupWebViewJavascriptBridge(callback) {
  try {
    if (window.WebViewJavascriptBridge) {
      callback(window.WebViewJavascriptBridge)
    } else {
      throw Error('jsBridge未注入成功，请刷新重试')
    }
  } catch (error) {
    throw Error('jsBridge未注入成功，请刷新重试')
  }
}
