/*********************************************************
 * fixFirefoxFlexbox.js v0.1.11 - a library fix Firefox's
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
		define(["fixFirefoxFlexbox"], factory);
	// no AMD
	} else {
		root.fixFirefoxFlexbox = factory(root.postal);
	}
}(this, function(postal) {
	var fixFirefoxFlexbox = new function () {
		console.log(userAgent)
		var me = this,
			userAgent = navigator.userAgent,
			firefoxIndex = userAgent.indexOf('Firefox'),
			isFirefoxDesktop = firefoxIndex > -1 && userAgent.indexOf('Mobile') == -1,
			firefoxVersion = isFirefoxDesktop ? parseFloat(userAgent.substr(firefoxIndex + 8)) : -1,
			isBadFirefox = firefoxVersion !== -1 && firefoxVersion >= 56,
			bodyEl = document.body,
			tabbableElsSelector = 'a[href]:not([tabindex="-1"]), ' + 
				'area:not([tabindex="-1"]), [role="button"]:not([tabindex="-1"]), ' + 
				'[role="link"]:not([tabindex="-1"]), iframe:not([tabindex="-1"]), ' +
				'[contentEditable=true]:not([tabindex="-1"]), :enabled',
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
				document.defaultView.getComputedStyle(el, null).display !== 'none'
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
				
				setTabIndex(target, tabIndexMax - 1);
				
		}
		
		me.init = function () {
			if (isBadFirefox && bodyEl.classList.contains('a11y-fix-firefox-flexbox')) {
				fixFirefoxFlexbox();
			}
		};
	};
	
	fixFirefoxFlexbox.init();
}) );
