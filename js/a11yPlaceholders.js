/*********************************************************
 * a11yPlaceholders.js - a library to fix some screenreaders
 * reading placeholder text as if it was the form field's
 * value.  This is an issue with (but not necessarily only with) the following
 * browser/screenreader pairs:
 * 
 * - Voiceover/Safari
 * - NVDA/Edge
 * 
 * The fix basically just removes the placeholder text onfocus, and puts it back
 * onblur (which, interestingly, is the default behaviour of IE <= 11).  
 * You should, then, *never* put anything that should be read by the screen
 * reader in the placeholder attribute.
 * 
 * by Zoltan Hawryluk (zoltan.dulac@gmail.com)
 * 
 * Latest version available at:
 * - https://github.com/zoltan-dulac/a11y-examples
 * 
 * Licensed under the MIT License
 * - https://opensource.org/licenses/MIT
 ********************************************************/

var a11yPlaceholders = new function () {
	var me = this,
		bodyEl = document.body;
	
	me.init = function () {
		if (bodyEl.classList.contains('a11y-fix-placeholder')) {
			bodyEl.addEventListener('focus', handleInputFocusEvent, true);
			bodyEl.addEventListener('blur', handleInputBlurEvent, true);
		}
	}
	
	function isPlaceholderElement(el) {
		return (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA')
	}
	
	function handleInputFocusEvent(e) {
		var target = e.target;
		
		if (isPlaceholderElement(target) && target.placeholder) {
			target.dataset.a11yPlaceholder = target.placeholder;
			target.placeholder = '';
			// Safari needs to force a repaint (happens with textareas, but 
			// do it for all placeholder element, just in case).
			target.classList.add('placeholder-removed');
		}
	}
	
	function handleInputBlurEvent(e) {
		var target = e.target;
		if (isPlaceholderElement(target) && target.dataset.a11yPlaceholder) {
			
			/*
			 * The timeout is to prevent Chrome with NVDA reading out placeholder
			 * text as tabbing out.
			 */
			setTimeout(function () {
				target.placeholder = target.dataset.a11yPlaceholder;
				target.dataset.a11yPlaceholder = '';
				
				// Safari needs to force a repaint (happens with textareas, but 
				// do it for all placeholder element, just in case).
				target.classList.remove('placeholder-removed');
			}, 1);
			
		}
	}
}

a11yPlaceholders.init();
