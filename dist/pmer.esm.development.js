var mid = 0; // 消息id

var MESSAGE_TIMEOUT = new Error('PMER_POST_MESSAGE_TIMEOUT');
var MESSAGE_IDENT = 'PMER_MESSAGE_IDENT';

function getReplyType(type) {
  return "PMER_REPLY::".concat(type);
} // 阻止消息超时时抛出promise rejection异常


window.addEventListener('unhandledrejection', function (event) {
  if (event.reason === MESSAGE_TIMEOUT) {
    event.preventDefault();
  }
});
/**
 * 发送消息
 * @param {Window} target 目标窗口, window.opener/window.parent/HTMLIFrameElement.contentWindow...
 * @param {string} type 消息类型
 * @param {any} message 消息体
 * @param {string} 可选，targetOrigin
 * @param {Transferable[]} 可选，transfer
 *
 * @return {Promise<any>} 返回promise，如果有收到回复消息，将会触发promose回调，否则60s后超时拒绝
 *
 * @example
 * postMessage(winodw.opener, 'MSG_TYPE', 'anything')
 *      .then(data => console.log('receive data:', data));
 */

function postMessage(target, type, message) {
  var targetOrigin = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '*';
  var transfer = arguments.length > 4 ? arguments[4] : undefined;
  return new Promise(function (resolve, reject) {
    // 我们发出消息，同时附带一个id标记
    var id = mid++;
    var timer;
    target.postMessage({
      __ident__: MESSAGE_IDENT,
      id: id,
      type: type,
      message: message
    }, targetOrigin, transfer);
    var cancel = addListenerOnce(getReplyType(type), function (data) {
      clearTimeout(timer);
      resolve(data);
    }, id);
    timer = setTimeout(function () {
      cancel();
      reject(MESSAGE_TIMEOUT);
    }, 60 * 1000);
  });
}
/**
 * 添加消息监听
 * @param {string|Array} msgTypes 要监听的消息类型，*表示任何消息
 * @param {function} listener 监听方法
 * @param {number} id 消息id，如果传递了id，那么必须id一致才会认为是正确的消息回复
 *
 * @return {function} 返回移除监听的方法
 *
 * @example
 * addListener('MSG_TYPE', (message, event) => {});
 */

function addListener(msgTypes, listener, id) {
  function receiveMessage(event) {
    if (typeof event.data === 'object') {
      var _event$data = event.data,
          replyId = _event$data.id,
          type = _event$data.type,
          _message = _event$data.message,
          __ident__ = _event$data.__ident__;

      if (!Array.isArray(msgTypes)) {
        msgTypes = [msgTypes];
      } // 确保消息的type、id值是我们说希望监听的


      if (__ident__ === MESSAGE_IDENT && msgTypes.length && msgTypes.some(function (item) {
        return item === '*' || item === type;
      }) && (!id || replyId === id)) {
        var returnData = listener(_message, event); // 如果监听方法返回了数据，那么我们将数据当作相应结果再postMessage回去

        if (typeof returnData !== 'undefined' && event.source) {
          var replyMessage = function replyMessage(message) {
            event.source.postMessage({
              __ident__: MESSAGE_IDENT,
              id: id,
              type: getReplyType(type),
              message: message
            }, event.origin);
          }; // 可能是promise


          if (typeof returnData === 'object' && typeof returnData.then === 'function') {
            returnData.then(replyMessage);
          } else {
            replyMessage(returnData);
          }
        }
      }
    }
  }

  function removeListener() {
    window.removeEventListener('message', receiveMessage, false);
  }

  window.addEventListener('message', receiveMessage, false);
  return removeListener;
}
/**
 * 添加单次消息监听（收到一次消息后即移除）
 * @param {string|Array} msgTypes 要监听的消息类型，*表示任何消息
 * @param {function} listener 监听方法
 * @param {number} id 消息id，如果传递了id，那么必须id一致才会认为是正确的消息回复
 *
 * @return {function} 返回移除监听的方法
 *
 * @example
 * addListener('MSG_TYPE', (message, event) => {});
 */

function addListenerOnce(msgTypes, listener, id) {
  var cancel = addListener(msgTypes, function () {
    cancel();
    return listener.apply(void 0, arguments);
  }, id);
  return cancel;
}

export { addListener, addListenerOnce, mid, postMessage };