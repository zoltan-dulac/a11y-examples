/*********************************************************
 * fixFirefoxFlexbox.js v0.1.15 - a library fix Firefox's
 * keyboard tabbing of flexbox CSS `order` elements.
 * 
 * by Zoltan Hawryluk (zoltan.dulac@gmail.com)
 * Licensed under the MIT License
 * 
 * https://opensource.org/licenses/MIT
 ********************************************************/

(function (root, factory) {
	// AMD
	if(typeof define === "function" && define.amd) {
		define(["a11y-examples"], factory);
	// no AMD
	} else {
		root.fixFirefoxFlexbox = factory(root.allyExamples);
	}
}(this, function(a11yExamples) {
	var fixFirefoxFlexbox = new function () {
		var me = this,
			userAgent = navigator.userAgent;
			isFirefoxDesktop = userAgent.indexOf('Firefox') > -1 && userAgent.indexOf('Mobile') == -1,
			bodyEl = document.body,

			// This selector should contain all the tabbable elements that can be in
			// a document.  We need to ensure we are not including the ones with
			// tabindex="-1", of course.  Note that :enabled is used to match all
			// form elements that are enabled (i.e. not disabled), but we still need
			// the :not([tabindex="-1"]) since fieldsets are included (I don't know
			// why, but it is what it is).
			tabbableElsSelector = 'a[href]:not([tabindex="-1"]), ' +
				'area:not([tabindex="-1"]), [role="button"]:not([tabindex="-1"]), ' +
				'[role="link"]:not([tabindex="-1"]), iframe:not([tabindex="-1"]), ' +
				'[contentEditable=true]:not([tabindex="-1"]), '+
				':enabled:not([tabindex="-1"])',

			// This is the max amount a tabindex can have according to
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
			tabIndexMax = 32767;

		function fixFirefoxFlexbox() {
			bodyEl.addEventListener('focus', handleFirefoxFocusEvent, true);
			bodyEl.addEventListener('blur', handleFirefoxBlurEvent, true);
			bodyEl.addEventListener('keypress', handleFirefoxKeypressEvent, true);
		}

		function isTabbable(el) {
			return (
				!el.hidden &&
				el.offsetParent !== null
			);
		}

		function setTabIndex(el, val) {
			el.dataset.fixFirefoxFlexboxOrigTabIndex = el.tabIndex;
			el.tabIndex = val;
		}

		function unsetTabIndex(el) {
			var defaultTabIndex = el.dataset.fixFirefoxFlexboxOrigTabIndex;

			if (defaultTabIndex !== undefined) {
				el.tabIndex = defaultTabIndex;
			}
		}

		function clearAndFindIndex(tabbableEls, target) {
			var i, index;
			for (i = 0; i < tabbableEls.length; i++) {
				var el = tabbableEls[i];

				unsetTabIndex(el);
				if (el === target) {
					index = i;
				}
			}

			return index;
		}

		function handleFirefoxKeypressEvent(e) {
			if (e.key === 'Tab') {
				var tabbableEls = document.querySelectorAll(tabbableElsSelector),
					lastTabbableEl = tabbableEls[tabbableEls.length - 1],
					target = e.target;

				// if this is the last tabbable element, we want to make sure we tab
				// outside of the web page (i.e. the browser UI), so we clear all
				// tabIndexes.
				if (document.activeElement === lastTabbableEl) {
					handleFirefoxBlurEvent(e);
				}
			}
		}

		function handleFirefoxBlurEvent(e) {
			var target = e.target,
				tabbableEls = document.querySelectorAll(tabbableElsSelector);

			clearAndFindIndex(tabbableEls, target);
		}

		function getClosestTabbable(els, index, dir) {
			var i, r;

			for (i = index + dir, r = els[i]; r; i += dir, r = els[i]) {
				if (isTabbable(r)) {
					return r;
				}
			}

			return null;
		}

		function handleFirefoxFocusEvent(e) {
			var target = e.target,
				tabbableEls = document.querySelectorAll(tabbableElsSelector),
				index = clearAndFindIndex(tabbableEls, target),
				prevTabbable = getClosestTabbable(tabbableEls, index, -1),
				nextTabbable = getClosestTabbable(tabbableEls, index, 1);

				if (prevTabbable) {
					setTabIndex(prevTabbable, tabIndexMax - 2);
				}

				if (nextTabbable) {
					setTabIndex(nextTabbable, tabIndexMax);
				}

				// since it is possible to have anything with a tabIndex of -1 to hav
				// focus programmatically, we need to ensure we check this condition.
				if (target.tabIndex !== -1) {
					setTabIndex(target, tabIndexMax - 1);
				}

		}

		me.init = function () {
			if (isFirefoxDesktop && bodyEl.classList.contains('a11y-fix-firefox-flexbox')) {
				fixFirefoxFlexbox();
			}
		};
	};

	fixFirefoxFlexbox.init();
}) );
