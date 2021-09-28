/**
 * 初始化WebViewJsBridge
 */
import bridge from './core'
export function initMixin() {
  if (!window.WebViewJavascriptBridge) {
    window.WebViewJavascriptBridge = {
      registerHandler: bridge.registerHandler,
      callHandler: bridge.callHandler,
      _handleMessageFromNative: bridge._handleMessageFromNative,
      _fetchQueue: bridge._fetchQueue
    }
  }
}
