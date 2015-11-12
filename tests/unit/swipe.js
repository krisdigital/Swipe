function killSwipe() {
  if(window.mySwipe) window.mySwipe.kill();
  window.mySwipe = null;
}
document.write("<p>Attaching Click Handler!</p>")
$(".swipe-wrap > div button").on("click", function(e) {
  $(this).html("Clicked");
})

QUnit.test( "Number of slides initially", function( assert ) {
  var done = assert.async();
  killSwipe();
  
  window.mySwipe = new Swipe(document.getElementById('slider'), {});
  
  assert.ok( $(".swipe-wrap > div").length == 9, "Number of slides still the same!" );
  done();
});


QUnit.test( "Number of slides after kill", function( assert ) {
  var done = assert.async();
  
  killSwipe();
  
  window.mySwipe = new Swipe(document.getElementById('slider'), {});
  
  killSwipe();
  
  assert.ok( $(".swipe-wrap > div").length == 9, "After destroy, still the same number of slides!" );
  done();
});


QUnit.test( "Number of slides after pair 2 and restore", function( assert ) {
  var done = assert.async();
  killSwipe();
  
  window.mySwipe = new Swipe(document.getElementById('slider'), {
    pair:2,
  });
  
  assert.ok( $(".swipe-wrap > div").length == 5, "A pairing of 2 gives us 5 slides!" );
  
  killSwipe();
  
  assert.ok( $(".swipe-wrap > div").length == 9, "After destroy we have 9 again!" );
  done();
});



QUnit.test( "Event-Handler is still on after pairing..", function( assert ) {
  killSwipe();
  
  window.mySwipe = new Swipe(document.getElementById('slider'), {
    pair:4
  });
  
  killSwipe();
  
  var eventOk = true;
  $(".swipe-wrap > div button").trigger("click").each(function() {
    if($(this).html() !== "Clicked") eventOk = false
  });
  
  assert.ok( eventOk, "All events are still on!" );
});