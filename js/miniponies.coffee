#
# Name    : Mini Ponies
# Author  : Lauren Herda, http://www.herda.me, @lrenhrda
# Version : 0.1.0
# Repo    : https://github.com/lrenhrda/miniponies
# Website : http://miniponi.es/
#

jQuery ->
  $.miniPony = ( element, options ) ->

    # plugin defaults
    @defaults = {
      divClass    : 'js-mp_pony'  # class for pony div
      moveSpeed   : 600           # speed of pony when moving
      moveEasing  : ''
    }

    # current state
    state = ''

    # plugin settings
    @settings = {}

    # jQuery version of DOM element attached to the plugin
    @$element = $ element

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

    @init = ->
      @settings = $.extend( {}, @defaults, options )

      @setState 'ready'

    # initialise the plugin
    @init()

    # make the plugin chainable
    this

  # default plugin settings
  $.pluginName::defaults =
      message: 'Hello world'  # option description

  $.fn.pluginName = ( options ) ->
    this.each ->
      if $( this ).data( 'pluginName' ) is undefined
        plugin = new $.pluginName( this, options )
        $( this).data( 'pluginName', plugin )