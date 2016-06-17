/**
* jQuery Plugin for swipejs, adding lazy load to images having the data-src attribute
**/

(function() {
  function Lazy($el) {
    this.slider = $el.data("Swipe");
    this.$el = $el;
    this.init();
    this.$el.bind("swipe.kill", $.proxy(this.kill, this));
  }
  
  Lazy.prototype = {
    init: function() {
      if(!this.slider) return;
      
      this.numSlides = this.slider.getNumSlides();
      this.pos = this.slider.getPos();
      
      this.originalCallback = this.slider.options.callback
      this.slider.options.callback = $.proxy(this.callback, this);
      
      this.callback(this.pos);
    },
    kill: function() {
      this.$el.unbind("swipe.kill");
    },
    callback: function(pos) {
      if(this.originalCallback) this.originalCallback(pos);
      
      if(this.numSlides == 2) {
        this.loadImageAtPos(pos);
        this.loadImageAtPos(pos + 2);
      }
      else this.loadImageAtPos(pos);
    },
    loadImageAtPos: function(pos) {
      var _this = this;
      $(".swipe-wrap > div", this.$el).eq(pos).find("img[data-src]").each(function() {
        var updateNotLoaded = function() {
          var $loadedImg = $(".swipe-wrap > div img[data-src].loaded", _this.$el).first();
          if($loadedImg.length == 0) return;
          
          _this.slideWidth = $loadedImg.width();
          _this.slideHeight = $loadedImg.height();
          $(".swipe-wrap > div img[data-src]", _this.$el).not(".loaded").css({width: _this.slideWidth + "px", height: _this.slideHeight + "px"});
        }
        updateNotLoaded.call(this);
        
        $(this).off("load.sliderlazy").on("load.sliderlazy", function() {
          $(this).addClass("loaded").css({height:"", width:""});
          _this.$el.trigger("slider.lazyloaded", {img: this, pos: pos, slider: _this});
          updateNotLoaded.call(this);
        });
        
        _this.$el.trigger("slider.lazyload", {pos: pos, slider: _this});
        
        $(this).lazyload();
      });
    }
  }
  
  $.fn.lazy = function() {
    var matched = $(this);

    matched.each(function() {
      new Lazy($(this));
    });
    return matched;
  }
  
})();