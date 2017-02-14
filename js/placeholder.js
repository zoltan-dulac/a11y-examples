var a11yPlaceholders = new function () {
	var me = this,
		bodyEl = document.body;
	
	me.init = function () {
		bodyEl.addEventListener('focus', handleInputFocusEvent, true);
		bodyEl.addEventListener('blur', handleInputBlurEvent, true);
	}
	
	function handleInputFocusEvent(e) {
		var target = e.target;
		
		if (target.nodeName === 'INPUT' && target.placeholder) {
			target.dataset.a11yPlaceholder = target.placeholder;
			target.placeholder = '';
		}
	}
	
	function handleInputBlurEvent(e) {
		var target = e.target;
		
		if (target.nodeName === 'INPUT' && target.dataset.a11yPlaceholder) {
			target.placeholder = target.dataset.a11yPlaceholder;
			target.dataset.a11yPlaceholder = '';
		}
	}
}

a11yPlaceholders.init();
