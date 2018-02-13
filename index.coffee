
module.exports = class Dialog
  view: __dirname
  name: 'k-dialog'

  destroy: ->
    @removeKeydownEvent()
    window.removeEventListener 'popstate', @backbuttonpressed

  init: ->

  create: ->
    @model.on 'change', 'show', @autofocus
    @autofocus()
    window.addEventListener 'popstate', @backbuttonpressed

    # deterrmine correct z-index
    els = document.querySelectorAll('.k-overlay')
    max = 9000
    for el in els
      if el.zindex > max
        max = el.zindex

    @thisdialog.zindex = max + 1
    @model.set 'zindex', @thisdialog.zindex

    if @model.get('show')
      @setKeydownEvent();

  backbuttonpressed: =>
    @hide(null, true)

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

  hide: (e, backbuttonpressed = false) =>
    @removeKeydownEvent()
    e.stopPropagation() if e
    document.activeElement.blur()

    h = =>
      @model.del 'show'
      @model.del 'hiding'
      @emit('cancel', backbuttonpressed)

    @model.set 'hiding', true
    setTimeout h, 510

  click: (e) =>
    # don't if we are sticly
    return if @model.get('sticky')

    @hide(e) if e?.target?.getAttribute('data-hide') is '1'

  keydown: (e) =>
    key = e.keyCode or e.which
    if key is 27
      # apply this only to the topmost k-dialog
      els = document.querySelectorAll('.k-overlay')
      for el in els
        if el.zindex > @thisdialog.zindex
          return

      e.stopPropagation()
      @hide()
