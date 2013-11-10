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
      element     : element
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
    @$element = $ element

    @origin = 
      x: 0
      y: 0

    @bounds = 
      x: @origin.x + $(window).width()
      y: @origin.y + $(window).height()

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
      {
        x: 100
        y: 100
      }

    @getPonySpeed = (dist)->
      (dist / @getSetting('stride')) * 100

    @recenterPony = ->
      randLoc = @randomLocationInBounds()
      currentLoc = @$pony.position()
      # distance = @cartToPolar({
      #   x: currentLoc.left
      #   y: currentLoc.top
      # }, randLoc).d
      # @animatePony(randLoc, @getPonySpeed(distance))
      @animatePony(randLoc, 500)

    # Is the pony within the container bounds?
    @ponyInBounds = ->
      pt = @$pony.position().top
      pl = @$pony.position().left
      (pt > @origin.y && pt < (@bounds.y - @$pony.height())) && (pl > @origin.x && pl < (@bounds.x - @$pony.width()))

    @randomDirection = -> Math.random() < 0.5 ? -1 : 1

    # Which way is the pony traveling?
    # Returns 1 for left-to-right, -1 for right-to-left.
    @getPonyDirection = (current, destination)->
      if (current.x < destination.x) 
        return 1
      else return -1

    @getPonyCoords = ->
      {
        x: @$pony.position().left
        y: @$pony.position().top
      }

    @setPonyImage = (loc)->
      @$pony.html('<img src="' + loc + '">')

    # Move the pony
    @animatePony = (coords, speed)->
      # TODO: use this function to delegate to a variety of more specific kinds of animations (flyPony, winkPony, etc.)
      @direction = @getPonyDirection(@getPonyCoords(), coords)
      console.log(@getPonyCoords().x + ", " + coords.x, @direction)
      @$pony.animate
        top: coords.y
        left: coords.x
      , {
          duration: speed
          easing: @getSetting('walkEasing')
          start: =>
            if @direction < 0
              @setPonyImage(@getSetting('walkingFromRightImg'))
            else
              @setPonyImage(@getSetting('walkingFromLeftImg'))
          done: =>
            if @direction < 0
              @setPonyImage(@getSetting('restingFromRightImg'))
            else
              @setPonyImage(@getSetting('restingFromLeftImg'))

            if !@ponyInBounds()
              @recenterPony()
        }

    @init = ->
      @settings = $.extend( {}, @defaults, options )
      @$pony.attr 'class', @getSetting('divClass')
      @direction = 1
      if(@direction > 0)
        @setPonyImage(@getSetting('restingFromLeftImg'))
      else 
        @setPonyImage(@getSetting('restingFromRightImg'))
      @$container = $ @getSetting('element')
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