var a11yHelpers = new function () {
	var me = this,
		userAgent = navigator.userAgent;
		isFirefoxDesktop = userAgent.indexOf('Firefox') > -1 && userAgent.indexOf('Mobile') == -1,
		bodyEl = document.body,
		// We cache this lookup, since it returns a live node list and is *always*
		// up-to-date with the document (unlike jQuery).
		tabbableElsList = document.querySelectorAll('[tabindex="0"], a, :enabled'),
		// This is the max amount a tabindex can have according to 
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
		tabIndexMax = 32767;
	
	function fixFirefoxFlexbox() {
		bodyEl.addEventListener('focus', handleFirefoxFocusEvent, true);
		bodyEl.addEventListener('blur', handleFirefoxBlurEvent, true);
		bodyEl.addEventListener('keypress', handleFirefoxKeypressEvent, true);
	}
	
	function setTabIndex(el, val) {
		el.dataset.a11yHelpersOrigTabIndex = el.tabIndex;
		el.tabIndex = val;
	}
	
	function unsetTabIndex(el) {
		var defaultTabIndex = el.dataset.a11yHelpersOrigTabIndex;
		
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
				
			var lastTabbableEl = tabbableElsList[tabbableElsList.length - 1],
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
			tabbableEls = [].slice.call(tabbableElsList);
		
		clearAndFindIndex(tabbableEls, target);
	}
	
	function handleFirefoxFocusEvent(e) {
		var target = e.target,
			tabbableEls = [].slice.call(tabbableElsList),
			index = clearAndFindIndex(tabbableEls, target);
			
			if (index !== 0) {
				setTabIndex(tabbableEls[index - 1], tabIndexMax - 2);
			} 
			
			if (index !== tabbableEls.length - 1) {
				setTabIndex(tabbableEls[index + 1], tabIndexMax);
			}
			
			setTabIndex(tabbableEls[index], tabIndexMax - 1);
			
	}
	
	me.init = function () {
		if (isFirefoxDesktop && bodyEl.classList.contains('a11y-fix-firefox-flexbox')) {
			fixFirefoxFlexbox();
		}
	};
};

a11yHelpers.init();
