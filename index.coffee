
module.exports = class Dialog
  view: __dirname
  name: 'k-dialog'
  keydownSet: false

  destroy: ->
    @removeKeydownEvent()
    window.removeEventListener 'popstate', @backbuttonpressed

  create: ->
    @model.on 'change', 'show', @showChanged
    window.addEventListener 'popstate', @backbuttonpressed
    
    if @model.get('show')
      @show()

  backbuttonpressed: =>
    @hide(null, true)

  autofocus: =>
    el = @inner.querySelectorAll('[autofocus]')

    if el?[0]
      el?[0].focus()
      true

  showChanged: (val, oldval) =>
    if val
      @show()

  setKeydownEvent: =>
    # don't set if we are sticly
    return if @model.get('sticky') || @keydownSet

    @keydownSet = true

    # use document.body since k-popup should be handled first and it uses document
    document.body.addEventListener 'keydown', @keydown, true

  removeKeydownEvent: =>
    return if @model.get('sticky')

    @keydownSet = false

    document.body.removeEventListener 'keydown', @keydown, true

  setzIndex: => 
    # deterrmine correct z-index
    if @thisdialog
      els = document.querySelectorAll('.k-overlay')
      max = 9000
      for el in els
        if el.zindex > max
          max = el.zindex

      @thisdialog.zindex = max + 1
      @model.set 'zindex', @thisdialog.zindex

  show: (e) =>
    e and e.preventDefault()
    e and e.stopPropagation()
    @setKeydownEvent()
    @setzIndex()

    focused = @autofocus()

    # if we didn't autofocus to an element, focus into the pane
    if !focused
      @outer.focus()


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

      if e.target?.nodeName in ['INPUT', 'TEXTAREA'] && !@model.get('exitWithEsc')
        return

      e.stopPropagation()
      @hide()
