#
# Name    : Mini Ponies
# Author  : Lauren Herda, http://www.herda.me, @lrenhrda
# Version : 0.1.0
# Repo    : https://github.com/lrenhrda/miniponies
# Website : http://miniponi.es/
#

jQuery ->
  $.miniPonies = ( options ) ->

    # plugin defaults
    @defaults = {
      divClass    : 'js-mp_pony'            # string, class for pony div
      stride      : 10                      # number, pixels pony travels per millisecond
      walkEasing  : 'linear'                      # string, easing equation for walking pony
      onWalk      : ->                      # Function(pony), called when pony walks
      onHalt      : ->                      # Function(pony), called when pony stops walking
      restingFromRightImg: '/images/blank-standing-from right.gif'
      restingFromLeftImg: '/images/blank-standing-from-left.gif'
      walkingFromRightImg: '/images/blank-from right.gif'
      walkingFromLeftImg: '/images/blank-from-left.gif'
      maxMove     : 500
      minMove     : 20
    }

    # default pony CSS
    ponyCss = 
      display   : 'block'
      position  : 'fixed'
      top       : 100
      left      : 100
      opacity   : 1
      'z-index' : 99999

    appearAnimateProperties =
      opacity: 1

    disappearAnimateProperties = 
      opacity: 0

    # plugin settings
    @settings = {}

    # jQuery version of DOM element attached to the plugin
    @$element = $ 'body'

    @$pony = $ '<div>'

    # current state
    state = 'hidden'

    # current direction
    @direction = -1

    # set current state
    @setState = ( _state ) -> 
      state = _state
      console.log(state)

    #get current state
    @getState = -> state

    @getBounds = ->
      x: $(window).width()
      y: $(window).height()

    @getPosition = ->
      p = @$pony.position()
      {
        x: p.left
        y: p.top
      }

    @getPonySize = ->
      {
        width: @$pony.width()
        height: @$pony.height()
      }

    # Is the pony within the container bounds?
    @ponyInBounds = ->
      p = @getPosition()
      b = @getBounds()
      s = @getPonySize()
      (p.x >= 0 && p.x < (b.x - s.width)) && (p.y >= 0 && p.y < (b.y - s.height))

    # get particular plugin setting
    @getSetting = ( key ) ->
      @settings[ key ]

    # call one of the plugin setting functions
    @callSettingFunction = ( name, args = [] ) ->
      @settings[name].apply( this, args )

    @polarToCart = (d, a)->
      {
        x: d * Math.cos(a)
        y: d * Math.sin(a)
      }

    @cartToPolar = (orig, dest)->
      dx = dest.x - orig.x
      dy = dest.y - orig.y
      {
        r: Math.pow((Math.pow(dx, 2) + Math.pow(dy, 2)), .5) * (180/Math.PI)
        d: Math.atan(dy / dx)
      }

    # adds destination coordinates 
    @getDestinationCoordinates = (distance, angle)->
      coords = @polarToCart(distance, angle)
      {
        x: @$pony.position().left + coords.x
        y: @$pony.position().top + coords.y
      }

    @randomVector = ->
      {
        dist: Math.floor(Math.random() * 200) + 50
        angle: Math.floor(Math.random() * 360)
      }

    # TODO: make this return a random location within the bounds
    @randomLocationInBounds = ->
      b = @getBounds()
      {
        x: Math.floor(Math.random() * b.x)
        y: Math.floor(Math.random() * b.y)
      }

    @getPonySpeed = (dist)->
      (dist / @getSetting('stride')) * 100

    @recenterPony = ->
      console.log "ERMAGERD PERNY MERST BER RECERNTERD!"
      randLoc = @randomLocationInBounds()
      currentLoc = @$pony.position()
      @animatePony(randLoc, 500)

    @randomDirection = -> Math.random() < 0.5 ? -1 : 1

    # Which way is the pony traveling?
    # Returns 1 for left-to-right, -1 for right-to-left.
    @getPonyDirection = (current, destination)-> (current.x < destination.x) ? 1 : -1

    @setPonyImage = (loc)->
      @$pony.html('<img src="' + loc + '">')

    # Move the pony
    @animatePony = (coords, speed)->
      # TODO: use this function to delegate to a variety of more 
      # specific kinds of animations (flyPony, winkPony, etc.)
      @direction = @getPonyDirection(@getPosition(), coords)
      @$pony.animate
        top: coords.y
        left: coords.x
      , {
          duration: speed
          easing: @getSetting('walkEasing')
          start: =>
            if @direction == false
              @setPonyImage(@getSetting('walkingFromRightImg'))
            else
              @setPonyImage(@getSetting('walkingFromLeftImg'))
          done: =>
            if @direction == false
              @setPonyImage(@getSetting('restingFromRightImg'))
            else
              @setPonyImage(@getSetting('restingFromLeftImg'))

            if !@ponyInBounds()
              @recenterPony()
        }

    @init = ->
      $(window).on 'resize', =>
        if !@ponyInBounds()
          @recenterPony()
      @settings = $.extend( {}, @defaults, options )
      @$pony.attr 'class', @getSetting('divClass')
      @direction = 1
      if(@direction > 0)
        @setPonyImage(@getSetting('restingFromLeftImg'))
      else 
        @setPonyImage(@getSetting('restingFromRightImg'))
      @$container = @$element
      @$pony.css(ponyCss)
      @$container.append @$pony
      @$pony.on 'mouseenter', =>
        if @$pony.is(':animated')
          false
        else
          v = @randomVector()
          coords = @getDestinationCoordinates(v.dist, v.angle)
          coords = {
            x: Math.abs(coords.x)
            y: Math.abs(coords.y)
          }
          speed = @getPonySpeed(v.dist)
          console.log(coords)
          @animatePony(coords, speed)
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