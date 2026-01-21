/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */

const util = require('sc-util')

let Dialog;
module.exports = (Dialog = (function () {
	Dialog = class Dialog {
		constructor() {
			this.setExitWithEsc = this.setExitWithEsc.bind(this);
			this.backbuttonpressed = this.backbuttonpressed.bind(this);
			this.autofocus = this.autofocus.bind(this);
			this.setzIndex = this.setzIndex.bind(this);
			this.showChanged = this.showChanged.bind(this);
			this.show = this.show.bind(this);
			this.hide = this.hide.bind(this);
			this.click = this.click.bind(this);
			this.keydown = this.keydown.bind(this);
			this.removeWindowEventListeners = this.removeWindowEventListeners.bind(this);
			this.addWindowEventListeners = this.addWindowEventListeners.bind(this);
			this.zoomMousewheel = this.zoomMousewheel.bind(this);
			this.zoomKeyup = this.zoomKeyup.bind(this);
			this.zoomkeydown = this.zoomkeydown.bind(this);
		}

		static initClass() {
			this.prototype.view = __dirname;
			this.prototype.name = 'k-dialog';
			this.prototype.keydownSet = false;
			this.prototype.listener = null;
		}

		destroy() {
			this.removeWindowEventListeners();

			if (this.listener) {
				this.model.removeListener('change', this.listener);
			}

			this.listener = null;
			return this.inner = (this.outer = (this.thisdialog = null));
		}

		create() {
			// console.log('create', this.model.get('from'))
			if (this.listener) {
				this.model.removeListener('change', this.listener);
			}

			this.listener = this.model.on('change', 'show', this.showChanged);

			this.dom.on("keydown", window, this.zoomkeydown, true);
			this.dom.on("keyup", window, this.zoomKeyup, true);

			this.dom.on("mousewheel", this.thisdialog, this.zoomMousewheel, false);

			if (this.model.get('show')) {
				return this.show();
			}
		}

		zoomMousewheel(e) {
			// Zoom
			if (this.ctrlKeyDown) {
				e.preventDefault();
				e.stopImmediatePropagation();

				// Increase Zoom?	
				let zoomIn = e.deltaY < 0;
				const doWeWantZoom1 = document.querySelector('email-view') || document.querySelector('.ticket-textbody');
				const doWeWantZoom2 = document.querySelector('.k-prose-content.k-prose-content-doc');

				if (doWeWantZoom1 || doWeWantZoom2) {

					if (doWeWantZoom1) {
						let zoom = this.model.root.get('_page.zoom') || 1.0;
						zoom = zoomIn? zoom + 0.1 : zoom - 0.1;
						this.model.root.set('_page.zoom', zoom)
						this.model.toast('info', `${Math.round(zoom * 100)}%`)
					}
					else {
						this.page.emit('change-zoom', (zoomIn ? 1 : -1));
					}
				}			
			}
		}

		zoomKeyup(e) {
			if (!e.ctrlKey && e.key == 'Control') {
				this.ctrlKeyDown = false;
			}
		}

		zoomkeydown(e) {
			if (e.ctrlKey && e.key == 'Control') {
				this.ctrlKeyDown = true;
			}
		}




		removeWindowEventListeners() {
			// Remove from window
			window.removeEventListener('popstate', this.backbuttonpressed, true);
			window.removeEventListener('keydown', this.keydown, true);

			// Remove from stack
			if (window.kDialogStack) {
				const index = window.kDialogStack.findIndex(listeners => listeners.keydown == this.keydown)
				// console.log('removeWindowEventListeners', this, { index }, window.kDialogStack)

				if (index != -1) {
					window.kDialogStack.splice(index, 1);
				}
			}

			// util.removeEventFromWindow('popstate', this.backbuttonpressed)
			// util.removeEventFromWindow('keydown', this.keydown)
		}

		// Keep the order of the events on DOM the same as the dialogs are on the screen
		addWindowEventListeners() {
			// util.addEventToWindow('popstate', this.backbuttonpressed)
			// util.addEventToWindow('keydown', this.keydown)
			// return;

			window.kDialogStack = window.kDialogStack || [];

			// See if we already are in the stack - if so, don't attach again
			const found = window.kDialogStack.find(listeners => listeners.keydown == this.keydown);
			// console.log('addWindowEventListeners this', this);
			// console.log('addWindowEventListeners found', { found }, window.kDialogStack);
			// console.log('this.backbuttonpressed',  this.backbuttonpressed);
			// console.log('this.keydown',  this.keydown);

			if (found) {
				return;
			}

			// First detach the listeners from window
			window.kDialogStack.forEach(listeners => {
				window.removeEventListener('popstate', listeners.popstate, true);
				window.removeEventListener('keydown', listeners.keydown, true);
			});

			// Add our listener to the window so it fires first
			window.addEventListener('popstate', this.backbuttonpressed, true);
			window.addEventListener('keydown', this.keydown, true);

			// Add the rest of the listeners to the window
			window.kDialogStack.forEach(listeners => {
				window.addEventListener('popstate', listeners.popstate, true);
				window.addEventListener('keydown', listeners.keydown, true);
			});

			// Add our listener to stack (as first, so that the order on the stack and window are the same)
			window.kDialogStack.unshift({
				popstate: this.backbuttonpressed,
				keydown: this.keydown
			});
		}

		backbuttonpressed(e) {
			e.stopImmediatePropagation();
			return this.hide(e, true);
		}

		keydown(e) {
			if (e.key === 'Escape') {

				if ((['INPUT', 'TEXTAREA'].includes(e.target.nodeName) || document.activeElement.isContentEditable) && !this.model.get('exitWithEsc')) {
					return;
				}

				e.stopImmediatePropagation();
				return this.hide();
			}
		}

		click(e) {
			// don't if we are sticly
			if (this.model.get('sticky')) { return; }

			if (__guard__(e != null ? e.target : undefined, x => x.getAttribute('data-hidedialog')) === '1') { return this.hide(e); }
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

		setExitWithEsc(v) {
			return this.model.set('exitWithEsc', v);
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
				// console.log('this.thisdialog.zindex', this.thisdialog.zindex)
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
			this.addWindowEventListeners();
			this.setzIndex();

			const focused = this.autofocus();

			// if we didn't autofocus to an element, focus into the pane
			if (!focused && !this.model.get('static') && this.outer) {
				return this.outer.focus();
			}
		}


		hide(e, backbuttonpressed) {
			// Check from the parent if we can hide this dialog
			// TODO: Is there a better way to do this?
			if (this.parent.canHideDialog && !this.parent.canHideDialog()) {
				return false;
			}

			if (backbuttonpressed == null) { backbuttonpressed = false; }
			this.removeWindowEventListeners();
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
	};
	Dialog.initClass();
	return Dialog;
})());

function __guard__(value, transform) {
	return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}