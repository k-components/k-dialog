
module.exports = class Dialog
  view: __dirname
  name: 'k-dialog'

  destroy: ->
    document.removeEventListener 'keydown', @keydown, true

  create: ->
    @model.on 'change', 'show', @autofocus
    @autofocus()
    if @model.get('show')
      @setKeydownEvent();

  autofocus: =>
    if @inner?.querySelectorAll
      el = @inner.querySelectorAll('[autofocus]')
      autofocus = el?[0]
      autofocus?.focus()

  setKeydownEvent: =>
    document.addEventListener 'keydown', @keydown, true

  removeKeydownEvent: =>
    document.removeEventListener 'keydown', @keydown

  show: (e) =>
    e and e.preventDefault()
    e and e.stopPropagation()
    @model.set 'show', true
    @setKeydownEvent()

  hide: (e) =>
    @removeKeydownEvent()
    e.stopPropagation() if e
    document.activeElement.blur()

    h = =>
      @model.del 'show'
      @model.del 'hiding'
      @emit('cancel')

    @model.set 'hiding', true
    setTimeout h, 510

  click: (e) =>
    @hide(e) if e?.target?.getAttribute('data-hide') is '1'

  keydown: (e) =>
    key = e.keyCode or e.which
    @hide(e) if key is 27
