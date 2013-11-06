(function() {
  jQuery(function() {
    $.miniPonies = function(element, options) {
      var appearAnimateProperties, disappearAnimateProperties, ponyCss, state;
      this.defaults = {
        element: 'body',
        divClass: 'js-mp_pony',
        walkSpeed: 600,
        walkEasing: '',
        onWalk: function() {},
        onHalt: function() {},
        restingImg: '/images/nopony.gif',
        maxMove: 500,
        minMove: 50
      };
      ponyCss = {
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0,
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
      this.pony = $('<div>');
      state = 'hidden';
      this.setState = function(_state) {
        return state = _state;
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
      this.move = function() {
        var newLeftPos, newTopPos;
        newTopPos = Math.floor(Math.random() * this.getSetting('maxMove')) + this.getSetting('minMove');
        newLeftPos = Math.floor(Math.random() * this.getSetting('maxMove')) + this.getSetting('minMove');
        console.log(this.pony.position());
        return this.pony.animate({
          top: newTopPos,
          left: newLeftPos
        }, this.getSetting('walkSpeed'));
      };
      this.init = function() {
        this.settings = $.extend({}, this.defaults, options);
        this.pony.attr('class', this.getSetting('divClass'));
        this.pony.html('<img src="' + this.getSetting('restingImg') + '">');
        this.$container = $(this.getSetting('element'));
        this.pony.css(ponyCss);
        this.$container.append(this.pony);
        this.move();
        return this.setState('ready');
      };
      this.init();
      return this;
    };
    $.miniPony = $.miniPonies;
    return $.fn.miniPony = $.fn.miniPonies;
  });

}).call(this);
