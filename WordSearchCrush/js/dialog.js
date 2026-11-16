// Dialog helpers: a jQuery form serializer plus small modal dialogs
// (Dialog, Dialogs.alert, Dialogs.confirm, Dialogs.modal).
//
// Expects jQuery. Dialog and Dialogs are globals used by other scripts.


/**
 * Stores `value` under `container[key]`. The first value is stored as is;
 * when the same key is added again, the values are collected into an array.
 */
function addFormValue(container, key, value) {
	if (container[key] === undefined) {
		container[key] = value
	} else if (Array.isArray(container[key])) {
		container[key].push(value)
	} else {
		container[key] = [container[key], value]
	}
}


/**
 * Collects a form's fields into an object.
 *
 * - A field name used more than once becomes an array of its values.
 * - A name like `items[0]` is grouped under `items` using the bracketed text as the key.
 *   Only the first pair of brackets is used.
 */
$.fn.serializeObject = function () {
	const result = {}

	this.serializeArray().forEach(({ name, value }) => {
		const fieldValue = value || ''
		const [baseName, subKey] = name.split(/\[([^\]]*)\]/g)

		if (subKey === undefined) {
			addFormValue(result, name, fieldValue)
		} else {
			result[baseName] = result[baseName] || []
			addFormValue(result[baseName], subKey, fieldValue)
		}
	})

	return result
}


/** Removes the dialog that contains the given element. */
function closeDialog(element) {
	$(element).closest('.dialog-wrapper').remove()
}


/**
 * Builds a footer button. Clicking it passes the form's values to `onClick`
 * and then closes the dialog, unless `onClick` returns false.
 */
function createDialogButton(label, onClick, isPrimary) {
	return $('<button type="button" />')
		.addClass(isPrimary ? 'primary' : '')
		.text(label)
		.on('click', event => {
			const formData = $(event.currentTarget).closest('form').serializeObject()

			if (onClick(formData) === false) return

			closeDialog(event.currentTarget)
		})
}


/**
 * Adds a dialog to the page and returns it as a jQuery object.
 *
 * @param {string} content HTML for the dialog body. It is inserted as HTML,
 *   so escape any untrusted text before passing it in.
 * @param {Object<string, Function>} buttons Button label -> click handler.
 *   The first entry is the primary button. A handler receives the form's values
 *   and can return false to keep the dialog open.
 * @param {string} [title]
 */
function Dialog(content, buttons, title) {
	const buttonElements = Object.keys(buttons || {})
		.filter(label => buttons[label])
		.map((label, index) => createDialogButton(label, buttons[label], index === 0))
		// The primary button is listed last in the footer.
		.reverse()

	const dialog = $('<dialog/>').addClass('dialog-wrapper').append(
		$('<form/>').addClass('dialog-box').append(
			$('<header />').addClass('dialog-header').append(
				$('<h1 />').text(title || ''),
				$('<i class="dialog-close"></i>').on('click', event => closeDialog(event.currentTarget))
			),
			$('<main />').addClass('dialog-content').html(content),
			$('<footer />').addClass('dialog-footer').append(buttonElements)
		)
	)

	$('body').append(dialog)
	return dialog
}


const Dialogs = {

	/** A message with a single "close" button. `callback` runs when that button is clicked. */
	alert(content, title, callback) {
		return Dialog(content, {
			close() {
				if (callback) callback()
			},
		}, title)
	},

	/** An OK / cancel prompt. Each callback is optional. */
	confirm(content, okCallback, cancelCallback, title) {
		return Dialog(content, {
			OK() {
				if (okCallback) okCallback()
			},
			cancel() {
				if (cancelCallback) cancelCallback()
			},
		}, title)
	},

	/** A dialog with your own buttons. See Dialog. */
	modal: Dialog,
}