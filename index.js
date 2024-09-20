/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */

let Dialog;
module.exports = (Dialog = (function () {
  Dialog = class Dialog {
    constructor() {
      this.setExitWithEsc = this.setExitWithEsc.bind(this);
      this.backbuttonpressed = this.backbuttonpressed.bind(this);
      this.autofocus = this.autofocus.bind(this);
      this.setKeydownEvent = this.setKeydownEvent.bind(this);
      this.removeKeydownEvent = this.removeKeydownEvent.bind(this);
      this.setzIndex = this.setzIndex.bind(this);
      this.showChanged = this.showChanged.bind(this);
      this.show = this.show.bind(this);
      this.hide = this.hide.bind(this);
      this.click = this.click.bind(this);
      this.keydown = this.keydown.bind(this);
      this.removeBackButtonEventListener = this.removeBackButtonEventListener.bind(this);
      this.addBackButtonEventListener = this.addBackButtonEventListener.bind(this);
    }

    static initClass() {
      this.prototype.view = __dirname;
      this.prototype.name = 'k-dialog';
      this.prototype.keydownSet = false;
      this.prototype.listener = null;
    }

    destroy() {
      this.removeKeydownEvent();

      if (this.listener) {
        this.model.removeListener('change', this.listener);
      }

      this.listener = null;
      this.removeBackButtonEventListener()
      return this.inner = (this.outer = (this.thisdialog = null));
    }

    create() {
      // console.log('create', this.model.get('from'))
      if (this.listener) {
        this.model.removeListener('change', this.listener);
      }

      this.listener = this.model.on('change', 'show', this.showChanged);

      this.addBackButtonEventListener();

      if (this.model.get('show')) {
        return this.show();
      }
    }

    removeBackButtonEventListener() {
      window.removeEventListener('popstate', this.backbuttonpressed);

      const index = window.kDialogStack.findIndex(listener => listener == this.backbuttonpressed)

      if (index != -1) {
        window.kDialogStack.splice(index);
      }
    }

    // We need to reverse the order of popstate events on window so that the last added event firest first
    addBackButtonEventListener() {
      window.kDialogStack = window.kDialogStack || [];

      // Remove
      window.kDialogStack.forEach(listener => {
        window.removeEventListener('popstate', listener);
      });

      window.addEventListener('popstate', this.backbuttonpressed);

      // Add back
      window.kDialogStack.forEach(listener => {
        window.addEventListener('popstate', listener);
      });

      window.kDialogStack.push(this.backbuttonpressed);
    }

    setExitWithEsc(v) {
      return this.model.set('exitWithEsc', v);
    }

    backbuttonpressed(e) {
      e.stopImmediatePropagation();
      return this.hide(e, true);
    }

    autofocus() {
      const el = this.inner != null ? this.inner.querySelectorAll('[autofocus]') : undefined;

      if (el != null ? el[0] : undefined) {
        if (el != null) {
          el[0].focus();
        }
        return true;
      }
    }

    setKeydownEvent() {
      // don't set if we are sticly
      if (this.model.get('sticky') || this.keydownSet) { return; }

      this.keydownSet = true;

      // use document.body since k-popup should be handled first and it uses document

      if (this.model.get('ontop')) {
        return window.addEventListener('keydown', this.keydown, true);
      } else {
        return document.body.addEventListener('keydown', this.keydown, true);
      }
    }

    removeKeydownEvent() {
      if (this.model.get('sticky')) { return; }

      this.keydownSet = false;

      if (this.model.get('ontop')) {
        return window.removeEventListener('keydown', this.keydown, true);
      } else {
        return document.body.removeEventListener('keydown', this.keydown, true);
      }
    }

    setzIndex() {
      // deterrmine correct z-index
      if (this.thisdialog && !this.model.get('static')) {
        let zindex;
        const els = document.querySelectorAll('.k-overlay, .k-popup-wrap');
        let max = 9000;

        for (var el of Array.from(els)) {
          var style = window.getComputedStyle(el);
          var zIndexComputed = style.getPropertyValue('z-index');
          zindex = el.zindex || (zIndexComputed && parseInt(zIndexComputed, 10));
          if (zindex > max) {
            max = zindex;
          }
        }

        this.thisdialog.zindex = max + 1;
        return this.model.set('zindex', this.thisdialog.zindex);
      }
    }

    showChanged(val, oldval) {
      if (val) {
        return this.show();
      }
    }

    show(e) {
      e && e.preventDefault();
      e && e.stopPropagation();
      this.setKeydownEvent();
      this.setzIndex();

      const focused = this.autofocus();

      // if we didn't autofocus to an element, focus into the pane
      if (!focused && !this.model.get('static') && this.outer) {
        return this.outer.focus();
      }
    }


    hide(e, backbuttonpressed) {
      if (backbuttonpressed == null) { backbuttonpressed = false; }
      this.removeKeydownEvent();
      if (e) { e.stopPropagation(); }
      document.activeElement.blur();

      if (this.model.get('noanimation')) {
        return this.emit('cancel', backbuttonpressed);
      } else {

        const h = () => {
          this.model.del('hiding');
          return this.emit('cancel', backbuttonpressed);
        };

        this.model.set('hiding', true);
        return setTimeout(h, 180);
      }
    }

    click(e) {
      // don't if we are sticly
      if (this.model.get('sticky')) { return; }

      if (__guard__(e != null ? e.target : undefined, x => x.getAttribute('data-hidedialog')) === '1') { return this.hide(e); }
    }

    keydown(e) {
      const key = e.keyCode || e.which;
      if (key === 27) {
        // apply this only to the topmost k-dialog
        const els = document.querySelectorAll('.k-overlay');
        for (var el of Array.from(els)) {
          if (el.zindex > (this.thisdialog != null ? this.thisdialog.zindex : undefined)) {
            return;
          }
        }

        if (['INPUT', 'TEXTAREA'].includes(e.target != null ? e.target.nodeName : undefined) && !this.model.get('exitWithEsc')) {
          return;
        }

        e.stopPropagation();
        return this.hide();
      }
    }
  };
  Dialog.initClass();
  return Dialog;
})());

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}