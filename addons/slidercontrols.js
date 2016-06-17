/**
* jQuery Plugin for adding events to bootstrap prev and next controls using swipejs
**/
(function() {
  function Controls($el, options) {
    this.slider = $el.data("Swipe");
    this.$el = $el;
    this.options = options;
    this.init();
    this.$el.bind("swipe.kill", $.proxy(this.kill, this));
  }
  
  Controls.prototype = {
    init: function() {
      if(!this.slider) return;
      
      this.numSlides = this.slider.getNumSlides()
      
      if(this.options.selector) {
        this.controls = $(this.options.selector);
      }
      else this.controls = $(".carousel-control", this.$el);

      if(this.controls.length == 0) this.controls = $(".carousel-control", this.$el.parent());
      if(this.controls.length == 0) {
        return;
      }
      
      if(this.numSlides == 1) {
        this.controls.addClass("inactive").hide();
      }
      else {
        this.controls.show();
        this.checkActive();
      }
      
      this.originalCallback = this.slider.options.callback;
      this.slider.options.callback = $.proxy(this.callback, this);
      
      var _this = this;
      this.controls.on("click", function(e) {
        e.preventDefault();
        
        if($(this).attr("data-slide") == "prev") {
          _this.slider.prev();
          _this.checkActive();
        }
        else {
          _this.slider.next();
          _this.checkActive();          
        }
      })
    },
    checkActive: function() {
      if(this.slider.options.continuous) return;
      
      this.controls.removeClass("inactive");

      if(!this.slider.options.continous && this.slider.getPos() == 0) {
        this.controls.filter('[data-slide="prev"]').addClass("inactive");
      }
      if(!this.slider.options.continous && this.slider.getPos() == this.numSlides - 1) {
        this.controls.filter('[data-slide="next"]').addClass("inactive");
      }
    },
    kill: function() {
      this.controls.unbind("click");
      this.controls.hide();
      this.$el.unbind("swipe.kill");      
    },
    callback: function(pos) {
      if(this.originalCallback) this.originalCallback.call(null, pos);
      this.checkActive();
    }
  }
  
  $.fn.controls = function(options) {
    var defaults = {selector:null};
    options = $.extend(defaults, options);
    
    var matched = $(this);

    matched.each(function() {
      new Controls($(this), options)
    });
    return matched;
  }
})();