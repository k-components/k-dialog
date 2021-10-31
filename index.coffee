
module.exports = class Dialog
  view: __dirname
  name: 'k-dialog'
  keydownSet: false
  listener: null

  destroy: ->
    @removeKeydownEvent()

    if @listener
      @model.removeListener 'change', @listener

    @listener = null
    window.removeEventListener 'popstate', @backbuttonpressed
    @inner = @outer = @thisdialog = null

  create: ->
    if @listener
      @model.removeListener 'change', @listener

    @listener = @model.on 'change', 'show', @showChanged
    window.addEventListener 'popstate', @backbuttonpressed
    
    if @model.get('show')
      @show()

  setExitWithEsc: (v) =>
    @model.set 'exitWithEsc', v

  backbuttonpressed: =>
    @hide(null, true)

  autofocus: =>
    el = @inner?.querySelectorAll('[autofocus]')

    if el?[0]
      el?[0].focus()
      true

  setKeydownEvent: =>
    # don't set if we are sticly
    return if @model.get('sticky') || @keydownSet

    @keydownSet = true

    # use document.body since k-popup should be handled first and it uses document

    if @model.get('ontop')
      window.addEventListener 'keydown', @keydown, true
    else
      document.body.addEventListener 'keydown', @keydown, true

  removeKeydownEvent: =>
    return if @model.get('sticky')

    @keydownSet = false

    if @model.get('ontop')
      window.removeEventListener 'keydown', @keydown, true
    else
      document.body.removeEventListener 'keydown', @keydown, true

  setzIndex: => 
    # deterrmine correct z-index
    if @thisdialog && !@model.get('static')
      els = document.querySelectorAll('.k-overlay, .k-popup-wrap') 
      max = 9000

      for el in els
        style = window.getComputedStyle(el)
        zIndexComputed = style.getPropertyValue('z-index')
        zindex = el.zindex || (zIndexComputed && parseInt(zIndexComputed, 10))
        if zindex > max
          max = zindex

      @thisdialog.zindex = max + 1
      @model.set 'zindex', @thisdialog.zindex

  showChanged: (val, oldval) =>
    # console.log val, oldval

    # if oldval && !val
    #   console.trace()

    if val
      @show()

  show: (e) =>
    e and e.preventDefault()
    e and e.stopPropagation()
    @setKeydownEvent()
    @setzIndex()

    focused = @autofocus()

    # if we didn't autofocus to an element, focus into the pane
    if !focused && !@model.get('static') && @outer
      @outer.focus()


  hide: (e, backbuttonpressed = false) =>
    @removeKeydownEvent()
    e.stopPropagation() if e
    document.activeElement.blur()

    if @model.get('noanimation')
      @emit('cancel', backbuttonpressed)
    else

      h = =>
        @model.del 'hiding'
        @emit('cancel', backbuttonpressed)

      @model.set 'hiding', true
      setTimeout h, 180

  click: (e) =>
    # don't if we are sticly
    return if @model.get('sticky')

    @hide(e) if e?.target?.getAttribute('data-hidedialog') is '1'

  keydown: (e) =>
    key = e.keyCode or e.which
    if key is 27
      # apply this only to the topmost k-dialog
      els = document.querySelectorAll('.k-overlay')
      for el in els
        if el.zindex > @thisdialog?.zindex
          return

      if e.target?.nodeName in ['INPUT', 'TEXTAREA'] && !@model.get('exitWithEsc')
        return

      e.stopPropagation()
      @hide()
