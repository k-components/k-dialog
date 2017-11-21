
module.exports = class Dialog
  view: __dirname
  name: 'k-dialog'

  destroy: ->
    @removeKeydownEvent()

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
    # don't set if we are sticly
    return if @model.get('sticky')

    # use document.body since k-popup should be handled first and it uses document
    document.body.addEventListener 'keydown', @keydown, true

  removeKeydownEvent: =>
    return if @model.get('sticky')
    document.body.removeEventListener 'keydown', @keydown, true

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
    # don't if we are sticly
    return if @model.get('sticky')

    @hide(e) if e?.target?.getAttribute('data-hide') is '1'

  keydown: (e) =>
    key = e.keyCode or e.which
    if key is 27
      e.stopPropagation()
      @hide()
