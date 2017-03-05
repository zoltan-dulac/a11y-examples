var a11yFormHelpers = new function () {
	
	var 
		me = this,
		dummyFocusEl;

	/**
	 * Focuses on an element, and scrolls the window if there is an element on
	 * top of the focused element so the user can see what is being focused.
	 *
	 * @param {object} element - The element being focused
	 */
	me.focusAndScrollToView = function (element) {
		
		var elementRect = element.getBoundingClientRect(),
			elementOnTop = document.elementFromPoint(elementRect.left, elementRect.top),
			focusCurrentEl = (document.activeElement === element),
			timeDelay = focusCurrentEl ? 500 : 1;
		
		if (focusCurrentEl) {
			dummyFocusEl.focus();
		}
		
		// If we do not pause for half a second, Voiceover will not read out
		// where it is focused.  There doesn't seem to be any other
		// workaround for this.
		setTimeout(function () {
			element.focus();

			if (elementOnTop && elementOnTop !== element) {
				var topElRect = elementOnTop.getBoundingClientRect();
				window.scrollBy(0, topElRect.top - topElRect.bottom);
			}
		}, 500)
	};
	
	function inputChangeEvent( event )  {
		var target = event.target;
		if (target.validity && target.validity.valid) {
			var errorEl = document.getElementById(target.name + '-error');
			
			if (errorEl) {
				errorEl.parentNode.removeChild(errorEl);
			}
		}
	}
	
	function submitEvent ( event ) {
		var target = event.target;
		if ( target.classList.contains('suppress-bubbles') && !this.checkValidity() ) {
			event.preventDefault();
		}
	}
	
	function formButtonClickEvent ( event ) {
		var target = event.target,
			form = target.form,	
			invalidFields,
			doSuppressBubbles = form.classList.contains('suppress-bubbles'),
			errorClasses = !doSuppressBubbles ? 'visually-hidden' : '';
		
		if 
		(
			(target.nodeName === 'BUTTON' && target.type !== 'button') ||
			(target.nodeName === 'INPUT' && target.type === 'submit')
		) {
			
			var errorMessages = form.querySelectorAll( ".error-message" ),
				parent;
	
			invalidFields = form.querySelectorAll( ":invalid:not(fieldset)" );
			// Remove any existing messages
			for ( var i = 0; i < errorMessages.length; i++ ) {
				errorMessages[ i ].parentNode.removeChild( errorMessages[ i ] );
			}
	
			for ( var i = 0; i < invalidFields.length; i++ ) {
				var field = invalidFields[ i ];
				var errorID = field.name + '-error';
				parent = field.parentNode;
				parent.insertAdjacentHTML( "beforeend",
				'<div id="' + errorID + '" class="error-message ' +
					errorClasses + '">' + 
					field.validationMessage +
					'</div>' );
				field.setAttribute('aria-describedby', errorID);
			}
		}
	
		// If there are errors, give focus to the first invalid field
		if ( invalidFields && invalidFields.length > 0 ) {
			me.focusAndScrollToView(invalidFields[ 0 ]);
		}
	}
	
	function invalidEvent ( event ) {
		var target = event.target,
			form = target.form;
		if ( form.classList.contains('suppress-bubbles') && !target.validity.valid ) {
			event.preventDefault();
		}
	}
	
	function replaceValidationUI() {
		dummyFocusEl = document.createElement('div');
		dummyFocusEl.tabIndex ='-1';
		dummyFocusEl.className = 'visually-hidden';
		dummyFocusEl.innerHTML=('x');
		document.body.appendChild(dummyFocusEl);
		
		// Suppress the default bubbles
		document.addEventListener( "invalid", invalidEvent, true );
		
		document.addEventListener( 'input', inputChangeEvent, true);
	
		// Support Safari, iOS Safari, and the Android browser—each of which do not prevent
		// form submissions by default
		document.addEventListener( "submit", submitEvent);
	
		document.addEventListener( "click", formButtonClickEvent);
	}
	
	me.init = function () {
		replaceValidationUI( );
	};
};


a11yFormHelpers.init();
