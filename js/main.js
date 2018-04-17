$(document).ready(function() {
// variables
var ww = $(window).width();


$(window).resize(function() { 
	if ($(window).width() < 650) { 
		$(".topics").hide(); 
	} else { 
		$(".topics").show();
} 
})

// OVERLAY 
  $(".menu").click(function(event) {
    event.preventDefault();
    $(".overlay").toggleClass("open");
    $(".menu").toggleClass("open");
    $(".lp-text").toggleClass("hidden");
  });




});