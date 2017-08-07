var curColor;
var curDown;

$('.grid-element').on({mousedown: function(e) {
                        e.preventDefault();
                        curDown = true;
                        $(this).css({'background': curColor,
                                     'border-color': curColor});
                        $('.grid-element').mouseenter(function() {
                            if (curDown === true) {
                                $(this).css({'background': curColor,
                                            'border-color': curColor});
                                }
                            });
                        },
                        mouseup: function() {
                            curDown = false;
                    }
});

$('.canvas').mouseleave(function() {
    curDown = false;
});

$('.swatch').click(function(e) {
    e.preventDefault();
    curColor = $(this).css('background-color');
    $('.brush-color').css({'background': curColor});
});

$('#reset').click(function() {
    $('.grid-element').removeAttr('style');
});

