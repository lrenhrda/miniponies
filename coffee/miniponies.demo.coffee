$ ->
  p = new MiniPonies.Pony()
  t = new MiniPonies.Ticker(5) # 5/100 chance that the ticker will fire
  window.ee.addListener 'tick', ->
    if p.getState() == 'ready' then p.pwny.trigger('touch')
  p.pwny.on 'mouseenter', ->
    p.pwny.trigger('touch')
  p.pwny.on 'mousedown', ->
    p.pwny.trigger('kick')