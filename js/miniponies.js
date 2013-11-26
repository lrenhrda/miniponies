(function() {
  var Coordinate, Path, Pony, RandomCoordinate, Ticker,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Ticker = (function() {
    function Ticker(chance) {
      var _this = this;
      this.chance = chance != null ? chance : 50;
      if (window.ee == null) {
        window.ee = new EventEmitter();
      }
      this.timer = setInterval(function() {
        if (_.random(100) < _this.chance) {
          return window.ee.emitEvent('tick');
        }
      }, 1000);
    }

    return Ticker;

  })();

  Coordinate = (function() {
    function Coordinate(x, y) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
    }

    Coordinate.prototype.getQuadrant = function() {
      if (this.x > 0 && this.y > 0) {
        return 0;
      }
      if (this.x < 0 && this.y > 0) {
        return 180;
      }
      if (this.x < 0 && this.y < 0) {
        return 180;
      }
      if (this.x > 0 && this.y < 0) {
        return 360;
      }
    };

    return Coordinate;

  })();

  RandomCoordinate = (function() {
    function RandomCoordinate(options) {
      this.options = options;
      if (this.options.originBound === null) {
        this.options.originBound = new Coordinate();
      }
      if (this.options.extentBound === null) {
        this.options.extentBound = new Coordinate($(window).width(), $(window).height());
      }
      return new Coordinate(this.randomizeX(), this.randomizeY());
    }

    RandomCoordinate.prototype.randomizeX = function() {
      return _.random(this.options.originBound.x, this.options.extentBound.x);
    };

    RandomCoordinate.prototype.randomizeY = function() {
      return _.random(this.options.originBound.y, this.options.extentBound.y);
    };

    return RandomCoordinate;

  })();

  Path = (function() {
    function Path(a, b) {
      this.a = a;
      this.b = b;
      this.delta = new Coordinate(this.b.x - this.a.x, this.b.y - this.a.y);
      this.length = Math.sqrt(Math.pow(this.delta.x, 2) + Math.pow(this.delta.y, 2));
    }

    Path.prototype.angle = function(radians) {
      var m, t;
      if (radians == null) {
        radians = false;
      }
      if (radians) {
        m = 1;
      } else {
        m = 180 / Math.PI;
      }
      t = Math.atan(this.delta.y / this.delta.x) * m;
      return t + this.delta.getQuadrant();
    };

    Path.prototype.direction = function() {
      var a;
      a = this.angle();
      if (a > 45 && a <= 135) {
        return 'up';
      }
      if (a > 135 && a <= 225) {
        return 'left';
      }
      if (a > 225 && a <= 315) {
        return 'down';
      }
      if (a > 315 || a <= 45) {
        return 'right';
      }
    };

    Path.prototype.hDirection = function() {
      if (this.delta.x > 0) {
        return 'right';
      }
      if (this.delta.x < 0) {
        return 'left';
      }
      if (this.delta.x === 0) {
        return false;
      }
    };

    Path.prototype.vDirection = function() {
      if (this.delta.y > 0) {
        return 'up';
      }
      if (this.delta.y < 0) {
        return 'down';
      }
      if (this.delta.y === 0) {
        return false;
      }
    };

    Path.prototype.info = function() {
      return {
        delta: this.delta,
        angle: this.angle(),
        length: this.length,
        direction: this.direction(),
        hDirection: this.hDirection(),
        vDirection: this.vDirection()
      };
    };

    return Path;

  })();

  Pony = (function() {
    function Pony(options) {
      this.options = options;
      this.touch = __bind(this.touch, this);
      this.kick = __bind(this.kick, this);
      this.settings = _.extend({}, this.defaults, this.options);
      this.state = 'ready';
      this.pwny = $('<div>').addClass('js-mp_pony').css(this.ponyCSS);
      if (this.settings.shadow) {
        this.pwny.addClass('shadow');
      }
      this.cel = $('body');
      this.ticker = new Ticker(5);
      this.createPony();
    }

    Pony.prototype.defaults = {
      stayInBounds: true,
      shadow: true,
      standing: {
        right: '/images/curly-brace/curly_brace-standing-from_left.gif',
        left: '/images/curly-brace/curly_brace-standing-from_right.gif'
      },
      locomotion: {
        trotting: {
          speed: 100,
          right: '/images/curly-brace/curly_brace-trotting-from_left.gif',
          left: '/images/curly-brace/curly_brace-trotting-from_right.gif'
        },
        galloping: {
          speed: 500
        }
      },
      interactions: {
        kick: 'kick',
        touch: 'touch'
      }
    };

    Pony.prototype.ponyCSS = {
      display: 'block',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 99999
    };

    Pony.prototype.createPony = function() {
      var _this = this;
      this.pwny.appendTo(this.cel);
      this.pwny.html('<img src="' + this.settings.standing.right + '">');
      return _.each(this.settings.interactions, function(b, i) {
        return _this.pwny.on(i, _this[b]);
      });
    };

    Pony.prototype.setPosition = function(c) {
      this.pwny.css('top', c.x);
      return this.pwny.css('left', c.y);
    };

    Pony.prototype.getPosition = function() {
      return new Coordinate(this.pwny.position().left, this.pwny.position().top);
    };

    Pony.prototype.getSpeed = function(locomotion) {
      return this.settings.locomotion[locomotion].speed;
    };

    Pony.prototype.setState = function(s) {
      return this.state = s;
    };

    Pony.prototype.getState = function() {
      return this.state;
    };

    Pony.prototype.getBounds = function() {
      return {
        w: $(window).width() - this.pwny.width(),
        h: $(window).height() - this.pwny.height()
      };
    };

    Pony.prototype.kick = function() {
      var c;
      c = new RandomCoordinate({
        originBound: new Coordinate(),
        extentBound: new Coordinate(this.getBounds().w, this.getBounds().h)
      });
      this.path = new Path(this.getPosition(), c);
      return this.wink();
    };

    Pony.prototype.touch = function() {
      var c;
      c = new RandomCoordinate({
        originBound: new Coordinate(),
        extentBound: new Coordinate(this.getBounds().w, this.getBounds().h)
      });
      this.path = new Path(this.getPosition(), c);
      return this.animate('trotting');
    };

    Pony.prototype.animate = function(locomotion) {
      var done, gif, s,
        _this = this;
      s = (this.path.length / this.getSpeed(locomotion)) * 1000;
      this.pwny.stop();
      if (this.path) {
        gif = this.settings.locomotion[locomotion][this.path.hDirection()];
        done = this.settings.standing[this.path.hDirection()];
        this.setState('animating');
        $('img', this.pwny).attr('src', gif);
        return this.pwny.animate({
          left: this.path.b.x,
          top: this.path.b.y
        }, {
          duration: s,
          easing: 'linear',
          done: function() {
            $('img', _this.pwny).attr('src', done);
            return _this.setState('ready');
          }
        });
      }
    };

    Pony.prototype.wink = function() {
      var done;
      if (this.path) {
        done = this.settings.standing[this.path.hDirection()];
        this.pwny.stop();
        this.pwny.css({
          left: this.path.b.x,
          top: this.path.b.y
        });
        $('img', this.pwny).attr('src', done);
        return this.setState('ready');
      }
    };

    return Pony;

  })();

  $(function() {
    var p, t;
    p = new Pony();
    t = new Ticker(5);
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
