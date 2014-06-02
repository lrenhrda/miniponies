window.MiniPonies = { }

class MiniPonies.Ticker
  constructor: (@chance = 50)->
    window.ee ?= new EventEmitter()
    @timer = setInterval =>
      if _.random(100) < @chance then window.ee.emitEvent('tick')
    , 1000

  # addListener: (...)->
    # window.ee.addListener(...)

class MiniPonies.Coordinate
  constructor: (@x = 0, @y = 0)->

  getQuadrant: ->
    # Quadrant I
    if @x > 0 and @y > 0
      return 0
    # Quadrant II
    if @x < 0 and @y > 0
      return 180
    # Quadrant III
    if @x < 0 and @y < 0
      return 180
    # Quadrant IV
    if @x > 0 and @y < 0
      return 360


class MiniPonies.RandomCoordinate

  # Returns a new (randomized) Coordinate object, instead of itself.
  constructor: (@options)->
    if @options.originBound == null then @options.originBound = new MiniPonies.Coordinate()
    if @options.extentBound == null then @options.extentBound = new MiniPonies.Coordinate($(window).width(), $(window).height())
    return new MiniPonies.Coordinate(@randomizeX(), @randomizeY())

  randomizeX: ->
    _.random(@options.originBound.x, @options.extentBound.x)
    
  randomizeY: ->
    _.random(@options.originBound.y, @options.extentBound.y)
    

class MiniPonies.Path
  constructor: (@a, @b)->
    # @a is origin
    # @b is point
    @delta = new MiniPonies.Coordinate(@b.x - @a.x, @b.y - @a.y)
    @length = Math.sqrt(Math.pow(@delta.x, 2) + Math.pow(@delta.y, 2))

  angle: (radians = false)->

    if radians 
      m = 1
    else 
      m = (180 / Math.PI)

    t = Math.atan(@delta.y / @delta.x) * m
    t + @delta.getQuadrant()

  # Cardinal direction of motion
  direction: ->
    a = @angle()
    if a > 45 and a <= 135
      return 'up'
    if a > 135 and a <= 225
      return 'left'
    if a > 225 and a <= 315
      return 'down'
    if a > 315 or a <= 45
      return 'right'

  # Horizontal direction of motion
  hDirection: ->
    if @delta.x > 0
      return 'right'
    if @delta.x < 0
      return 'left'
    if @delta.x == 0
      return false

  # Vertical direction of motion
  vDirection: ->
    if @delta.y > 0
      return 'up'
    if @delta.y < 0
      return 'down'
    if @delta.y == 0
      return false

  # Handy info about the object
  info: ->
    delta: @delta
    angle: @angle()
    length: @length
    direction: @direction()
    hDirection: @hDirection()
    vDirection: @vDirection()


# class Vector
#   constructor: (@length = null)->
#     if @length == null then @length = _random.()
#     return new Path()

class MiniPonies.Pony
  constructor: (@options)->
    @settings = _.extend({}, @defaults, @options)
    @state = 'ready'
    @pwny = $('<div>') # Pony element
      .addClass('js-mp_pony')
      .css(@ponyCSS)
    if @settings.shadow then @pwny.addClass('shadow')
    @cel = $ 'body'  # Container element
    @ticker = new MiniPonies.Ticker(5)
    @createPony()

  defaults:
    stayInBounds: true
    shadow: true
    standing:
      right: '/images/curly-brace/curly_brace-standing-from_left.gif'
      left: '/images/curly-brace/curly_brace-standing-from_right.gif'
    locomotion:
      trotting:
        speed: 100
        right: '/images/curly-brace/curly_brace-trotting-from_left.gif'
        left: '/images/curly-brace/curly_brace-trotting-from_right.gif'
      galloping:
        speed: 500
    interactions:
      kick: 'kick'
      touch: 'touch'

  ponyCSS: 
    display: 'block'
    position: 'fixed'
    top: 0
    left: 0
    zIndex: 99999
    # width: '100px'
    # height: '100px'

  createPony: ->
    @pwny.appendTo @cel
    @pwny.html '<img src="'+@settings.standing.right+'">'
    _.each @settings.interactions, (b, i)=>
      @pwny.on i, @[b]

  setPosition: (c)->
    @pwny.css('top', c.x)
    @pwny.css('left', c.y)

  getPosition: ->
    return new MiniPonies.Coordinate(@pwny.position().left, @pwny.position().top)
    
  getSpeed: (locomotion)->
    @settings.locomotion[locomotion].speed

  setState: (s)->
    @state = s

  getState: ->
    @state

  getBounds: ->
    w: $(window).width() - @pwny.width()
    h: $(window).height() - @pwny.height()

  # Interactions that the pony responds to

  kick: =>
    c = new MiniPonies.RandomCoordinate
      originBound: new MiniPonies.Coordinate()
      extentBound: new MiniPonies.Coordinate(@getBounds().w, @getBounds().h)
    @path = new MiniPonies.Path(@getPosition(), c)
    # @animate('galloping')
    @wink()

  touch: =>
    c = new MiniPonies.RandomCoordinate
      originBound: new MiniPonies.Coordinate()
      extentBound: new MiniPonies.Coordinate(@getBounds().w, @getBounds().h)
    @path = new MiniPonies.Path(@getPosition(), c)
    @animate('trotting')

  # Animations that the pony can do

  animate: (locomotion)->
    s = (@path.length / @getSpeed(locomotion)) * 1000
    @pwny.stop()
    if @path 
      gif = @settings.locomotion[locomotion][@path.hDirection()]
      done = @settings.standing[@path.hDirection()]
      @setState('animating')
      $('img', @pwny).attr 'src', gif
      @pwny.animate
        left: @path.b.x
        top: @path.b.y
      , 
        duration: s
        easing: 'linear'
        done: =>
          $('img', @pwny).attr 'src', done
          @setState 'ready'

  wink: ->
    if @path
      done = @settings.standing[@path.hDirection()]
      @pwny.stop() 
      @pwny.css
        left: @path.b.x
        top: @path.b.y
      $('img', @pwny).attr 'src', done
      @setState 'ready'