
	$.fn.serializeObject = function() {
		var o = {}, a = this.serializeArray();
		$.each(a, function() {
			var key = this.name
			var s = this.name.split(/\[([^\]]*)\]/g)
			if (s.length > 1) {
				key = s[0]
				if (!o[key]) {
					o[key] = []
				}
				if (o[key][s[1]] !== undefined) {
					if (!o[key][s[1]].push) {
						o[key][s[1]] = [o[key][s[1]]];
					}
					o[key][s[1]].push(this.value || '');
				} else {
					o[key][s[1]] = this.value || ''
				}
			} else if (o[key] !== undefined) {
				if (!o[key].push) {
					o[key] = [o[key]];
				}
				o[key].push(this.value || '');
			} else {
				o[key] = this.value || '';
			}
		});
		return o;
	};


	Dialog = function(content, buttonsObject, title) {
		var buttonsArray = [],
		    primary = 'primary'
		for(var i in buttonsObject) {
			if (buttonsObject[i]) {
				buttonsArray.unshift(
					$('<button type="button" />').addClass(primary).text(i)
					.click(
						(function(i) {
							return function(e) {
								e.preventDefault();
								if (buttonsObject[i]) {
									if (buttonsObject[i]( $(this).closest('form').serializeObject() ) === false) {
										return;
									}
								}
								$(this).closest('.dialog-wrapper').remove();
							}
						})(i)
					)
				)
				primary = ''
			}
		}

		var dialog = $('<dialog/>').addClass('dialog-wrapper').append(
			$('<form/>').addClass('dialog-box').append(
				$('<header />').addClass('dialog-header').append(
					$('<h1 />').text(title || ''),
					$('<i class="dialog-close"></i>').click(function() {
						$(this).closest('.dialog-wrapper').remove();
					})
				),
				$('<main />').addClass('dialog-content').html(content),
				$('<footer />').addClass('dialog-footer').append(buttonsArray)
			)
		)
		$('body').append(dialog)
		return dialog
	}


	var Dialogs = {}


	Dialogs.alert = function(content, title, callback) {
		return Dialog(
			content,
			{
				close: function() {
					if (callback) {
						callback()
					}
					$(this).closest('.dialog-wrapper').remove()
				}
			},
			title
		)
	}

	Dialogs.confirm = function(content, okCallback, cancelCallback, title) {
		return Dialog(
			content,
			{
				OK: function() {
					if (okCallback) {
						okCallback()
					}
					$(this).closest('.dialog-wrapper').remove();
				},
				cancel: function() {
					if (cancelCallback) {
						cancelCallback()
					}
					$(this).closest('.dialog-wrapper').remove()
				}
			},
			title
		)
	}

	Dialogs.modal = function(content, buttons, title) {
		return Dialog(
			content,
			buttons,
			title
		)
	}


	//confirm('Are you sure you want to clear this image?', function() { alert('test') }, function() { alert('fail') })
