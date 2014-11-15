
module.exports = class Dialog
	view: __dirname
	name: 'd-dialog'

	create: ->
		@model.on 'change', 'show', @autofocus

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
		@model.del 'show'

	click: (e) =>
		@hide() if e?.target?.getAttribute('data-hide') is '1'

	keydown: (e) =>
		key = e.keyCode or e.which
		@hide() if key is 27
