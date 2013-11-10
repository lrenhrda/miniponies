(function() {
  jQuery(function() {
    $.miniPonies = function(element, options) {
      var appearAnimateProperties, disappearAnimateProperties, ponyCss, state;
      this.defaults = {
        element: element,
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
      this.$element = $(element);
      this.origin = {
        x: 0,
        y: 0
      };
      this.bounds = {
        x: this.origin.x + $(window).width(),
        y: this.origin.y + $(window).height()
      };
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
        return {
          x: 100,
          y: 100
        };
      };
      this.getPonySpeed = function(dist) {
        return (dist / this.getSetting('stride')) * 100;
      };
      this.recenterPony = function() {
        var currentLoc, randLoc;
        randLoc = this.randomLocationInBounds();
        currentLoc = this.$pony.position();
        return this.animatePony(randLoc, 500);
      };
      this.ponyInBounds = function() {
        var pl, pt;
        pt = this.$pony.position().top;
        pl = this.$pony.position().left;
        return (pt > this.origin.y && pt < (this.bounds.y - this.$pony.height())) && (pl > this.origin.x && pl < (this.bounds.x - this.$pony.width()));
      };
      this.randomDirection = function() {
        var _ref;
        return (_ref = Math.random() < 0.5) != null ? _ref : -{
          1: 1
        };
      };
      this.getPonyDirection = function(current, destination) {
        if (current.x < destination.x) {
          return 1;
        } else {
          return -1;
        }
      };
      this.getPonyCoords = function() {
        return {
          x: this.$pony.position().left,
          y: this.$pony.position().top
        };
      };
      this.setPonyImage = function(loc) {
        return this.$pony.html('<img src="' + loc + '">');
      };
      this.animatePony = function(coords, speed) {
        var _this = this;
        this.direction = this.getPonyDirection(this.getPonyCoords(), coords);
        console.log(this.getPonyCoords().x + ", " + coords.x, this.direction);
        return this.$pony.animate({
          top: coords.y,
          left: coords.x
        }, {
          duration: speed,
          easing: this.getSetting('walkEasing'),
          start: function() {
            if (_this.direction < 0) {
              return _this.setPonyImage(_this.getSetting('walkingFromRightImg'));
            } else {
              return _this.setPonyImage(_this.getSetting('walkingFromLeftImg'));
            }
          },
          done: function() {
            if (_this.direction < 0) {
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
        this.settings = $.extend({}, this.defaults, options);
        this.$pony.attr('class', this.getSetting('divClass'));
        this.direction = 1;
        if (this.direction > 0) {
          this.setPonyImage(this.getSetting('restingFromLeftImg'));
        } else {
          this.setPonyImage(this.getSetting('restingFromRightImg'));
        }
        this.$container = $(this.getSetting('element'));
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
