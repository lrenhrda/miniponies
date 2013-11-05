(function() {
  jQuery(function() {
    $.miniPonies = function(element, options) {
      var state;
      this.defaults = {
        divClass: 'js-mp_pony',
        moveSpeed: 600,
        moveEasing: ''
      };
      state = '';
      this.settings = {};
      this.$element = $(element);
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
      this.init = function() {
        this.settings = $.extend({}, this.defaults, options);
        return this.setState('ready');
      };
      this.init();
      return this;
    };
    $.miniPonies.prototype.defaults = {
      message: 'Hello world'
    };
    return $.fn.miniPonies = function(options) {
      return this.each(function() {
        var plugin;
        if ($(this).data('miniPonies') === void 0) {
          plugin = new $.miniPonies(this, options);
          return $(this).data('miniPonies', plugin);
        }
      });
    };
  });

}).call(this);
