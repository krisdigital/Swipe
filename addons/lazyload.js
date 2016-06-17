(function() {
  $.fn.lazyload = function() {
    var matched = $(this);
    var totalCount = 0,
        loadedCount = 0;

    matched.each(function() {      
      if($(this).is("[data-src]")) {
        loadImg($(this));
      }
      else {
        $("img[data-src]", $(this)).each(function() {
          loadImg($(this));
        }); 
      }
    });
    
   
    function loadImg($this) {
      if($this.attr("src") == $this.attr("data-src")) return;
      
      totalCount++;
      
      $this.off("load.lazyload").on("load.lazyload", function() {
        loadedCount++;

        $this.addClass("loaded").trigger("imageloaded.lazyload", $this);
        if(totalCount == loadedCount) $this.trigger("allimagesloaded.lazyload");
      }).attr("src", $this.attr("data-src"));
      
    }
    
    return matched;
  }
})();