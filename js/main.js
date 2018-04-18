$(document).ready(function() {
// variables
var ww = $(window).width();


$(window).resize(function() { 
	if ($(window).width() < 650) { 
		$(".main-nav").hide(); 
    $(".menu").show();
	} else { 
		$(".main-nav").show();
    $(".menu").hide();
} 
})

// OVERLAY 
  $(".menu").click(function(event) {
    event.preventDefault();
    $(".overlay").toggleClass("open");
    $(".menu").toggleClass("open");
    $(".landing-page-intro").toggleClass("hidden");
  });




});