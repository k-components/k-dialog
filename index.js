// Generated by CoffeeScript 1.8.0
(function() {
  var Dialog,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = Dialog = (function() {
    function Dialog() {
      this.keydown = __bind(this.keydown, this);
      this.click = __bind(this.click, this);
      this.hide = __bind(this.hide, this);
      this.autofocus = __bind(this.autofocus, this);
    }

    Dialog.prototype.view = __dirname;

    Dialog.prototype.name = 'k-dialog';

    Dialog.prototype.create = function() {
      return this.model.on('change', 'show', this.autofocus);
    };

    Dialog.prototype.autofocus = function() {
      var autofocus, el, _ref;
      if ((_ref = this.inner) != null ? _ref.querySelectorAll : void 0) {
        el = this.inner.querySelectorAll('[autofocus]');
        autofocus = el != null ? el[0] : void 0;
        return autofocus != null ? autofocus.focus() : void 0;
      }
    };

    Dialog.prototype.show = function(e) {
      e && e.preventDefault();
      e && e.stopPropagation();
      return this.model.set('show', true);
    };

    Dialog.prototype.hide = function(e) {
      var h;
      h = (function(_this) {
        return function() {
          _this.model.del('show');
          return _this.model.del('hiding');
        };
      })(this);
      this.model.set('hiding', true);
      return setTimeout(h, 510);
    };

    Dialog.prototype.click = function(e) {
      var _ref;
      if ((e != null ? (_ref = e.target) != null ? _ref.getAttribute('data-hide') : void 0 : void 0) === '1') {
        return this.hide();
      }
    };

    Dialog.prototype.keydown = function(e) {
      var key;
      key = e.keyCode || e.which;
      if (key === 27) {
        return this.hide();
      }
    };

    return Dialog;

  })();

}).call(this);
