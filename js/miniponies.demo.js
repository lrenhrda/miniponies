(function() {
  $(function() {
    var p, t;
    p = new MiniPonies.Pony();
    t = new MiniPonies.Ticker(5);
    window.ee.addListener('tick', function() {
      if (p.getState() === 'ready') {
        return p.pwny.trigger('touch');
      }
    });
    p.pwny.on('mouseenter', function() {
      return p.pwny.trigger('touch');
    });
    return p.pwny.on('mousedown', function() {
      return p.pwny.trigger('kick');
    });
  });

}).call(this);
