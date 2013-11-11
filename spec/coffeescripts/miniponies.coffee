describe 'Mini Ponies', ->
  options =
    message: 'Hello World'

  beforeEach ->
    loadFixtures 'fragment.html'
    @$element = $( '#fixtures' )

  describe 'plugin behavior', ->
    # it 'should be available on the jQuery object', ->
    #   expect( $.fn.miniPonies ).toBeDefined()

    # it 'should be chainable', ->
      # expect( @$element.miniPonies() ).toBe @$element

    it 'should offers default values', ->
      plugin = new $.miniPonies()

      expect( plugin.defaults ).toBeDefined()

    it 'should overwrites the settings', ->
      plugin = new $.miniPonies( options )

      expect( plugin.settings.message ).toBe( options.message )

  describe 'plugin state', ->
    beforeEach ->
      @plugin = new $.miniPonies()

    it 'should have a ready state', ->
      expect( @plugin.getState() ).toBe 'ready'

    it 'should be updatable', ->
      @plugin.setState( 'new state' )

      expect( @plugin.getState() ).toBe 'new state'