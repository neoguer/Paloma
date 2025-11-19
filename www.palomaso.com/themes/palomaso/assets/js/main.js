var nav_main = $("#navbar-main");
//var bp_md = 768;
var menu_bp = 1380;

function split_char( elms, direct )
{
    if ( direct == 1) {
        var count = 0;
        $.each($(elms) , function ( index, target ) {
            var $target = $(target);
            var arr_title = ( $target.text() ).split("");
            $target.text("");
            $.each(arr_title , function ( index, value ) {
                $("<span>"+value+"</span>").appendTo(target)
                    .addClass("word word-"+index)
                    .attr('style','-webkit-animation-delay:'+ (0.05*count) +'s;animation-delay:'+ (0.05*count) +"s");
                count++;
            });
        });
    }
    else if ( direct == -1) {
        var $target = $(elms);
        var arr_title = ( $target.text() ).split("");
        var count = arr_title.length;
        $target.text("");
        $.each(arr_title , function ( index, value ) {
            $("<span>"+value+"</span>").appendTo($target)
                .addClass("word word-"+index)
                .attr('style','-webkit-animation-delay:'+ (0.05*count) +'s;animation-delay:'+ (0.05*count) +"s");
            count--;
        });
    }
}

// init of opening animation - chinese
function init_opening_ani_tc()
{

    var len_poem_tc = [7,4,9];
    for (var i=0; i< len_poem_tc.length; i++) {
        var block = $("<div>").appendTo($(".b-poem")).addClass("line line-"+i);
        for (var j=0; j< len_poem_tc[i]; j++) {
            $("<div>").addClass("word word-"+j).appendTo(block);
        }
    }
}

// init of opening animation - english
function init_opening_ani_en()
{
    split_char(".b-poem-en .line-0", 1);
    split_char(".b-poem-en .line-1", -1);
    split_char(".b-poem-en .line-2", 1);
    split_char(".b-poem-en .line-3", -1);
}


function play_opening_ani_tc()
{
    var $target_word = $(".line-0 .word-2, .line-0 .word-4"),
        $other_word = $(".word").not($target_word);

    var duration = 1.5;
    var tl = new TimelineLite({ onComplete: complete_opening_ani });
    tl.fromTo($(".s-opening"), 1.4, { opacity: 0, scale: 1.04}, { opacity: 1, scale:1 })
        .set($(".line-0"),{className:"+=ani-txt-blur"})
        .fromTo($(".line-0"), duration, { y: 20 }, { y:0 })

        .set($(".line-1"),{className:"+=ani-txt-blur"}, "-=0.5")
        .fromTo($(".line-1"), duration, { y: 20 }, { y:0 }, "-=0.5")

        .set($(".line-2"),{className:"+=ani-txt-blur"}, "-=0.5")
        .fromTo($(".line-2"), duration, { y: 20 }, { y:0 }, "-=0.5")

        .set($(".line") ,{className:"+=no-ani"}, "+=0.5")

        .to($other_word , duration, { opacity: 0 }, "+=2")
        .to($target_word, duration, { opacity: 0 }, "+=0")

        .to($(".s-opening"), 1.2, { opacity: 0, scale: 1.04},"+=0")
        .play();
}

function play_opening_ani_en()
{
    var tl = new TimelineLite({ onComplete: complete_opening_ani });
    var duration = 1.5;
    tl.fromTo($(".s-opening"), 1.4, { opacity: 0, scale: 1.04}, { opacity: 1, scale:1 })
        .set($(".line-0"),{className:"+=ani-txt-blur"})
        .fromTo($(".line-0"), duration, { y: 20 }, { y:0 })

        .set($(".line-1"),{className:"+=ani-txt-blur"}, "-=1.5")
        .fromTo($(".line-1"), duration, { y: 20 }, { y:0 }, "-=1.5")

        .set($(".line-2"),{className:"+=ani-txt-blur"}, "-=1.2")
        .fromTo($(".line-2"), duration, { y: 20 }, { y:0 }, "-=1.2")

        .set($(".line-3"),{className:"+=ani-txt-blur"}, "-=0.9")
        .fromTo($(".line-3"), duration, { y: 20 }, { y:0 }, "-=0.9")

        .fromTo($(".line-4"), 1, { opacity:0, y: 20 }, { opacity:1, y:0 }, "-=1")

        .to($(".s-opening"), 1.2, { opacity: 0, scale: 1.04},"+=2.8")
        .play();
}

function play_opening_ani()
{

    if ( $(".b-poem-tc").length > 0) {
        play_opening_ani_tc();
    } else if ( $(".b-poem-en").length > 0) {
        play_opening_ani_en();
    }
}

function complete_opening_ani()
{
    $("html").removeClass("_playing-opening");
    $(".s-opening").remove();
    show_s_home();
}

function show_s_home()
{

    $s_home = $(".s-home .b-video-data");
    var tl = new TimelineLite({ onComplete: function () {
            // open menu
        if ( $(window).width() > menu_bp ) {
            $("html").addClass("_open-menu");
            $(".m-main-wrapper").fadeIn();
        }
    }});
    tl.fromTo($s_home, 1.4, { opacity: 0, scale: 1.04}, { opacity: 1, scale:1 });
    $.each($(".b-video-data").children(), function (i,elm) {
        var delay = ( i==0 ) ? "-=0.5": "-=0.8";
        tl.fromTo(elm, 1, { opacity: 0, y: 20 }, { opacity: 1, y:0 }, delay);
    });
    tl.play();
}

$(document).ready(function (e) {
    if ($(".wrapper-home").length > 0) {
        $("html").addClass("_playing-opening");
        if ( $(".b-poem-tc").length > 0) {
            init_opening_ani_tc();
        } else if ( $(".b-poem-en").length > 0) {
            init_opening_ani_en();
        }
    }

    $(".row-collapse").click(function (e) {
        if ( $(e.target).parents(".collapse").length <= 0 && !$(this).hasClass("collapse") ) {
            $(this).find(".collapse").collapse("toggle");
            $(this).find(".btn-collapse").toggleClass("active");
        }
    });

    $(".btn-m-toggle, .m-main-wrapper").click(function (e) {
        $("html").toggleClass("_open-menu");
        $("html").hasClass("_open-menu") ? $(".m-main-wrapper").fadeIn() : $(".m-main-wrapper").fadeOut();
    });

});

$(window).load(function (e) {

    if ($(".b-poem").length > 0) {
        setTimeout(play_opening_ani, 400);
    }

});


window.onscroll = function() {scrollFunction()};

function scrollFunction() {

    let nav = $(".nav");

    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        nav.addClass('solid-color');
    } else {
        nav.removeClass('solid-color');
    }
}
