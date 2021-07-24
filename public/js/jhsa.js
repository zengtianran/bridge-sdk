(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.jhsa = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var HsaSdk = function HsaSdk() {
    _classCallCheck(this, HsaSdk);
  };

  var jhsa = new HsaSdk();

  return jhsa;

})));
//# sourceMappingURL=jhsa.js.map
