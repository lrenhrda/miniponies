(function() {
  jQuery(function() {
    $.miniPonies = function(options) {
      var appearAnimateProperties, disappearAnimateProperties, ponyCss, state;
      this.defaults = {
        divClass: 'js-mp_pony',
        stride: 10,
        walkEasing: 'linear',
        onWalk: function() {},
        onHalt: function() {},
        restingFromRightImg: '/images/blank-standing-from right.gif',
        restingFromLeftImg: '/images/blank-standing-from-left.gif',
        walkingFromRightImg: '/images/blank-from right.gif',
        walkingFromLeftImg: '/images/blank-from-left.gif',
        maxMove: 500,
        minMove: 20
      };
      ponyCss = {
        display: 'block',
        position: 'fixed',
        top: 100,
        left: 100,
        opacity: 1,
        'z-index': 99999
      };
      appearAnimateProperties = {
        opacity: 1
      };
      disappearAnimateProperties = {
        opacity: 0
      };
      this.settings = {};
      this.$element = $('body');
      this.$pony = $('<div>');
      state = 'hidden';
      this.direction = -1;
      this.setState = function(_state) {
        state = _state;
        return console.log(state);
      };
      this.getState = function() {
        return state;
      };
      this.getBounds = function() {
        return {
          x: $(window).width(),
          y: $(window).height()
        };
      };
      this.getPosition = function() {
        var p;
        p = this.$pony.position();
        return {
          x: p.left,
          y: p.top
        };
      };
      this.getPonySize = function() {
        return {
          width: this.$pony.width(),
          height: this.$pony.height()
        };
      };
      this.ponyInBounds = function() {
        var b, p, s;
        p = this.getPosition();
        b = this.getBounds();
        s = this.getPonySize();
        return (p.x >= 0 && p.x < (b.x - s.width)) && (p.y >= 0 && p.y < (b.y - s.height));
      };
      this.getSetting = function(key) {
        return this.settings[key];
      };
      this.callSettingFunction = function(name, args) {
        if (args == null) {
          args = [];
        }
        return this.settings[name].apply(this, args);
      };
      this.polarToCart = function(d, a) {
        return {
          x: d * Math.cos(a),
          y: d * Math.sin(a)
        };
      };
      this.cartToPolar = function(orig, dest) {
        var dx, dy;
        dx = dest.x - orig.x;
        dy = dest.y - orig.y;
        return {
          r: Math.pow(Math.pow(dx, 2) + Math.pow(dy, 2), .5) * (180 / Math.PI),
          d: Math.atan(dy / dx)
        };
      };
      this.getDestinationCoordinates = function(distance, angle) {
        var coords;
        coords = this.polarToCart(distance, angle);
        return {
          x: this.$pony.position().left + coords.x,
          y: this.$pony.position().top + coords.y
        };
      };
      this.randomVector = function() {
        return {
          dist: Math.floor(Math.random() * 200) + 50,
          angle: Math.floor(Math.random() * 360)
        };
      };
      this.randomLocationInBounds = function() {
        var b;
        b = this.getBounds();
        return {
          x: Math.floor(Math.random() * b.x),
          y: Math.floor(Math.random() * b.y)
        };
      };
      this.getPonySpeed = function(dist) {
        return (dist / this.getSetting('stride')) * 100;
      };
      this.recenterPony = function() {
        var currentLoc, randLoc;
        console.log("ERMAGERD PERNY MERST BER RECERNTERD!");
        randLoc = this.randomLocationInBounds();
        currentLoc = this.$pony.position();
        return this.animatePony(randLoc, 500);
      };
      this.randomDirection = function() {
        var _ref;
        return (_ref = Math.random() < 0.5) != null ? _ref : -{
          1: 1
        };
      };
      this.getPonyDirection = function(current, destination) {
        var _ref;
        return (_ref = current.x < destination.x) != null ? _ref : {
          1: -1
        };
      };
      this.setPonyImage = function(loc) {
        return this.$pony.html('<img src="' + loc + '">');
      };
      this.animatePony = function(coords, speed) {
        var _this = this;
        this.direction = this.getPonyDirection(this.getPosition(), coords);
        return this.$pony.animate({
          top: coords.y,
          left: coords.x
        }, {
          duration: speed,
          easing: this.getSetting('walkEasing'),
          start: function() {
            if (_this.direction === false) {
              return _this.setPonyImage(_this.getSetting('walkingFromRightImg'));
            } else {
              return _this.setPonyImage(_this.getSetting('walkingFromLeftImg'));
            }
          },
          done: function() {
            if (_this.direction === false) {
              _this.setPonyImage(_this.getSetting('restingFromRightImg'));
            } else {
              _this.setPonyImage(_this.getSetting('restingFromLeftImg'));
            }
            if (!_this.ponyInBounds()) {
              return _this.recenterPony();
            }
          }
        });
      };
      this.init = function() {
        var _this = this;
        $(window).on('resize', function() {
          if (!_this.ponyInBounds()) {
            return _this.recenterPony();
          }
        });
        this.settings = $.extend({}, this.defaults, options);
        this.$pony.attr('class', this.getSetting('divClass'));
        this.direction = 1;
        if (this.direction > 0) {
          this.setPonyImage(this.getSetting('restingFromLeftImg'));
        } else {
          this.setPonyImage(this.getSetting('restingFromRightImg'));
        }
        this.$container = this.$element;
        this.$pony.css(ponyCss);
        this.$container.append(this.$pony);
        this.$pony.on('mouseenter', function() {
          var coords, speed, v;
          if (_this.$pony.is(':animated')) {
            return false;
          } else {
            v = _this.randomVector();
            coords = _this.getDestinationCoordinates(v.dist, v.angle);
            coords = {
              x: Math.abs(coords.x),
              y: Math.abs(coords.y)
            };
            speed = _this.getPonySpeed(v.dist);
            console.log(coords);
            return _this.animatePony(coords, speed);
          }
        });
        return this.setState('ready');
      };
      this.init();
      return this;
    };
    $.miniPony = $.miniPonies;
    return $.fn.miniPony = $.fn.miniPonies;
  });

}).call(this);
