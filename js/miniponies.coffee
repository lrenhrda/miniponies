#
# Name    : Mini Ponies
# Author  : Lauren Herda, http://www.herda.me, @lrenhrda
# Version : 0.1.0
# Repo    : https://github.com/lrenhrda/miniponies
# Website : http://miniponi.es/
#

jQuery ->
  $.miniPonies = ( element, options ) ->

    # plugin defaults
    @defaults = {
      element     : 'body'        # string, selector for container element
      divClass    : 'js-mp_pony'  # string, class for pony div
      walkSpeed   : 600           # number, speed of pony when walking
      walkEasing  : ''            # string, easing equation for walking pony
      onWalk      : ->            # Function(pony), called when pony walks
      onHalt      : ->            # Function(pony), called when pony stops walking
      restingImg  : '/images/nopony.gif'
      maxMove     : 500
      minMove     : 50
    }

    # default pony CSS
    ponyCss = 
      display   : 'block'
      position  : 'fixed'
      top       : 0
      left      : 0
      opacity   : 1
      'z-index' : 99999

    appearAnimateProperties =
      opacity: 1

    disappearAnimateProperties = 
      opacity: 0

    # plugin settings
    @settings = {}

    # jQuery version of DOM element attached to the plugin
    @$element = $ element

    @pony = $ '<div>'

    # current state
    state = 'hidden'

    # set current state
    @setState = ( _state ) -> state = _state

    #get current state
    @getState = -> state

    # get particular plugin setting
    @getSetting = ( key ) ->
      @settings[ key ]

    # call one of the plugin setting functions
    @callSettingFunction = ( name, args = [] ) ->
      @settings[name].apply( this, args )

    @move = ->
      newTopPos = Math.floor(Math.random() * @getSetting('maxMove')) + @getSetting('minMove')
      newLeftPos = Math.floor(Math.random() * @getSetting('maxMove')) + @getSetting('minMove')
      console.log @pony.position()
      @pony.animate
        top: newTopPos
        left: newLeftPos
      , @getSetting('walkSpeed')

    @init = ->
      @settings = $.extend( {}, @defaults, options )
      @pony.attr 'class', @getSetting('divClass')
      @pony.html '<img src="' + @getSetting('restingImg') + '">'
      @$container = $ @getSetting('element')
      @pony.css(ponyCss)
      @$container.append @pony
      @move()
      @setState 'ready'

    # initialise the plugin
    @init()

    # make the plugin chainable
    this

  # default plugin settings
  # $.miniPonies::defaults =
  #     element: 'body'

  # $.fn.miniPonies = ( options ) ->
  #   this.each ->
  #     if $( this ).data( 'miniPonies' ) is undefined
  #       plugin = new $.miniPonies( this, options )
  #       $( this).data( 'miniPonies', plugin )

  $.miniPony = $.miniPonies
  $.fn.miniPony = $.fn.miniPonies