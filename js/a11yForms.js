var a11yForms = new function () {
	var me = this;
	
	me.focusAndScrollToView(element) {
		element.focus();

		var
			elementRect = element.getBoundingClientRect(),
			elementOnTop = document.elementFromPoint(elementRect.left, elementRect.top);

		/*
		 * If this element is visually hidden (e.g. if this is using some sort of
		 * hack to style the form widget, then assume we're okay)
		 */
		if (elementRect.width === 1 && elementRect.height === 1) {
			return;
		}

		/*
		 * Let's assume we have to move this from underneath some fixed position
		 * object.
		 */
		if (elementOnTop && elementOnTop !== element) {
			var topElRect = elementOnTop.getBoundingClientRect();
			window.scrollBy(0, topElRect.top - topElRect.bottom);
		}
	},

	/*
	 * Focuses the first invalid field in a form.  If a screen reader is being
	 * used, it will inform the user that this element is invalid.  Pro tip:
	 * use an `aria-describedby` to link the form element to an error message
	 * for more a11y goodness.
	 * 
	 * Parameters: 
	 *   formElement - the form's DOM node
	 *   options - an optional object with the following properties:
	 *   - firstValid: if true, this will force the form to focus on the
	 *     first formField whether it is invalid or not.
	 */
	me.applyFormFocus(formElement, options) {
		var isFormInvalid = false,
			formField,
			i;
		
		options = options || {};

		if (formElement) {
			var formFields = formElement.elements;
			for (i = 0; i < formFields.length; i += 1) {
				formField = formFields[i];
				// If the form is invalid, we must focus the first invalid one (or
				// the first valid one if option.firstValue === true). Since fieldsets
				// are part of the elements array, we must exclude those.
				if (formField.nodeName !== 'FIELDSET' && (options.firstValid || formField.getAttribute('aria-invalid') || !formField.validity.valid)) {
					isFormInvalid = true;
					if (document.activeElement === formField) {
						this.focusAndScrollToView(formFields[i + 1]);

						// If we do not pause for half a second, Voiceover/Safari 9 will not read out
						// where it is focused.
						setTimeout(() => {
							if (formField) {
								this.focusAndScrollToView(formField);
							}
						}, 500);
					} else {
						this.focusAndScrollToView(formField);
					}
					break;
				}
			}
		}
	},