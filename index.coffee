
module.exports = class Dialog
	view: __dirname
	name: 'k-dialog'

	destroy: ->
		console.log 'destroy'
		document.removeEventListener 'keydown', @keydown, true

	create: ->
		@model.on 'change', 'show', @autofocus
		document.addEventListener 'keydown', @keydown, true

	autofocus: =>
		if @inner?.querySelectorAll
			el = @inner.querySelectorAll('[autofocus]')
			autofocus = el?[0]
			autofocus?.focus()

	show: (e) ->
		e and e.preventDefault()
		e and e.stopPropagation()
		@model.set 'show', true

	hide: (e) =>
		h = =>
			@model.del 'show'
			@model.del 'hiding'

		@model.set 'hiding', true
		setTimeout h, 510

	click: (e) =>
		@hide() if e?.target?.getAttribute('data-hide') is '1'

	keydown: (e) =>
		key = e.keyCode or e.which
		@hide() if key is 27
