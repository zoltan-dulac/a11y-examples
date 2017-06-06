var toggleButton = new function () {
	var me = this;
	
	function clickButtonHandler(e) {
		var target = e.target,
			containerEl = target.parentNode;
			contentEl = document.getElementById(`${target.id}-content`),
			classList = contentEl.classList,
			tempToggleArea = containerEl.getElementsByClassName('toggle-temp-focus-area')[0];
		
		classList.toggle('visible');
		
		if (classList.contains('visible')) {
			target.innerHTML="Hide Content";
		} else {
			target.innerHTML="Show Content";
		}
			
	}
	
	me.init = function () {
		document.body.addEventListener('click', clickButtonHandler);
	}
}

toggleButton.init();
