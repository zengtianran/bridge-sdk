
import utils from './utils'
// 本地运行中的方法队列
var sendMessageQueue = []
// 用于保存APP环境注册的方法，原生只能调用本地注册的方法集合，key是方法名，value是这个方法对应的回调
var messageHandlers = {}
// 原生调用完方法后，会执行对应的回调ID，并删除
var responseCallbacks = {}
// 递增唯一ID
var uniqueId = 1
// 原生调用H5方法时，通过异步回调执行，加强安全性
var dispatchMessagesWithTimeoutSafety = true

// jsBridge通信协议名称
var CUSTOM_PROTOCOL_SCHEME = 'https'
// iframe连接方法
var QUEUE_HAS_MESSAGE = '__wvjs_queue_message__'

/**
 * 注册函数，供原生调用
 * @param {String} handlerName 注册方法名
 * @param {Function} handler 处理函数
 */
function registerHandler(handlerName, handler) {
  // 判断参数格式
  if (!handlerName || typeof handlerName !== 'string' || typeof handler !== 'function') {
    return
  }
  messageHandlers[handlerName] = handler
}
/**
 * 调用原生暴露方法
 * @param {String} handlerName 调用方法名
 * @param {JSON} data 传递参数
 * @param {Function} responseCallback 原生执行完回调函数
 */
function callHandler(handlerName, data, responseCallback) {
  // 判断处理传递参数
  if (arguments.length === 2 && typeof data === 'function') {
    responseCallback = data
    data = {}
  }
  // 发送消息
  _doSend({ handlerName: handlerName, data: data }, responseCallback)
}
/**
 * 当本地调用callHandle, 通过url scheme通知了原生
 * 原生通过调用这个方法来获取当前正在调用的方法队列
 */
function _fetchQueue() {
  const messageQueueString = JSON.stringify(sendMessageQueue)
  sendMessageQueue = []
  return messageQueueString
}
/**
 * 原生调用H5注册方法或者调用回调方法
 * @param {json} messageJson 对应的调用方法详情
 */
function _handleMessageFromNative(messageJson) {
  if (dispatchMessagesWithTimeoutSafety) {
    setTimeout(_doDispatchMessagesFromNative)
  } else {
    _doDispatchMessagesFromNative()
  }
  function _doDispatchMessagesFromNative() {
    let message
    try {
      if (typeof messageJson === 'string') {
        message = JSON.parse(messageJson)
      } else {
        message = messageJson
      }
    } catch (error) {
      // 方法信息格式错误
      throw new Error('原生调用H5方法出错，传入参数有误')
    }
    let responseCallback
    if (message.responseId) {
      // h5 callHandle调用原生，原生执行完，通知H5执行回调，回调函数ID是responseId
      responseCallback = responseCallbacks[message.responseId]
      if (!responseCallback) {
        return
      }
      responseCallback && responseCallback(message.data)
      delete responseCallbacks[message.responseId]
    } else {
      // 原生主动执行H5函数
      if (message.callbackId) {
        // 判断是否有回调
        // 如果需要本地函数执行回调通知原生，那么在本地注册回调函数在通知原生
        const callbackResponseId = message.callbackId
        responseCallback = function(responseData) {
          // H5回调执行完，再回调通知原生，通过_doSend发送原生触发回调。
          _doSend({
            handlerName: message.handlerName,
            responseId: callbackResponseId,
            responseData: responseData
          })
        }
      }
      // 从本地注册列表中获取方法
      const handler = messageHandlers[message.handlerName]
      const data = message.data
      if (handler) {
        // 执行本地注册方法并传入参数和回调
        handler(data, responseCallback)
      } else {
        throw new Error('本地未注册此方法')
      }
    }
  }
}
/**
 * JS调用原生方法前，消息发送到原生
 * @param {Object} message 调用的消息内容含方法名和参数
 * @param {Function} responseCallback 调用完方法后回调函数
 */
function _doSend(message, responseCallback) {
  if (responseCallback) {
    const callbackId = _genCallbackId()
    // 存储消息回调ID
    responseCallbacks[callbackId] = responseCallback
    // 把消息对应的回调ID和消息一起发送
    message['callbackId'] = callbackId
  }
  let _src
  if (utils.isIOS()) {
    // ios中不需拦截url参数数据，通过拦截url scheme
    // 将调用的方法详情存入消息队列中，原生主动获取
    sendMessageQueue.push(message)
    _src = getUri()
  } else {
    // android做兼容处理，将参数拼接到URL中
    _src = getUri(message)
  }
  // 触发url scheme,通过iframe跳转scheme,发送数据
  _sendMessage(_src)
}
/**
 * 生成回调函数唯一ID
 */
function _genCallbackId() {
  return `cb_${uniqueId++}_${new Date().getTime()}`
}
/**
 * 获取URL scheme,兼容android做法，安卓中不能获取JS函数返回值，通过协议传输
 * @param {Object} message 传递参数数据
 */
function getUri(message) {
  let uri = `${CUSTOM_PROTOCOL_SCHEME}://${QUEUE_HAS_MESSAGE}`
  if (message) {
    // callbackId作为端口号传递
    let callbackId, method, params
    if (message.callbackId) {
      // H5主动调用原生方法回调
      callbackId = message.callbackId
      method = message.handlerName
      params = message.data
    } else if (message.responseId) {
      // 原生调用H5方法后，H5回调
      callbackId = message.responseId
      method = message.handlerName
      params = message.responseData
    }
    params = getParams(params)
    uri += ':' + callbackId + '/' + method + '?' + params
  }
  return uri
}
/**
 * 对象转换成字符串
 * @param {Object} obj 对象数据
 */
function getParams(obj) {
  if (obj && typeof obj === 'object') {
    return JSON.stringify(obj)
  }
  return obj || ''
}
/**
 * 调用iframe发送数据
 */
const _sendMessage = (function() {
  let mesIframe = null
  return function(src) {
    if (!mesIframe) {
      mesIframe = document.createElement('iframe')
      mesIframe.style.display = 'none'
      document.documentElement.appendChild(mesIframe)
    }
    mesIframe.src = src
  }
})()
export default {
  registerHandler,
  callHandler,
  _handleMessageFromNative,
  _fetchQueue
}
