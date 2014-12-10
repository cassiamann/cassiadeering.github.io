$(document).ready(function(){
    var blue = document.getElementById("blue");
    var outIn = 'in';

    //  var i = false;
     
    // $('#menu-icon').click(function() {
         
    //     $('.drop-down').stop(true, false).slideToggle(200);
 
    // }); 

    var startX, curX, startY, curY; // Variables
    var newXScroll, newYScroll, genXScroll; // More Variables!
     
    // Change the height of the sidebar, as well as a few things to do with the main content area, so the user
    // can actually scroll in the content area.
    function sideBarHeight() { 
     
        var docHeight = $(document).height();
        var winHeight = $(window).height();
         
        $('.slide-in').height(winHeight);
        $('#main-container').height(winHeight);
        $('#sub-container').height($('#sub-container').height());
    } 
     
    // Run the function on resize and when the page loads!
    $(window).resize(function() {
        sideBarHeight();
    }); 
    sideBarHeight();

    Hammer(document.getElementById("main-container")).on("swipeleft", function() {
          //$(blue).animate({left: "-=100"}, 500)  

           $('.slide-in').toggleClass('on');       
        $('#main-container').toggleClass('on');
        outIn = 'in';
          
    });
    
    Hammer(document.getElementById("main-container")).on("swiperight", function() {
          //$(blue).animate({left: "+=100"}, 500)  
          $('.slide-in').toggleClass('on');       
          $('#main-container').toggleClass('on');
          outIn = 'out';
    });

    function runAnimation() {
 
    if(outIn == 'out') {
         
        $('.slide-in').toggleClass('on');
        $('#main-container').toggleClass('on'); 
        outIn = 'in';
         
    } else if(outIn == 'in') {
     
        $('.slide-in').toggleClass('on');   
        $('#main-container').toggleClass('on'); 
        outIn = 'out';
         
    }
 
}
$('.menu-icon')[0].addEventListener('touchend', function(e) {
    $('.slide-in').toggleClass('on');       
    $('#main-container').toggleClass('on');
});
 
$('.menu-icon').click(function() {
    $('.slide-in').toggleClass('on');       
    $('#main-container').toggleClass('on');
});
});
