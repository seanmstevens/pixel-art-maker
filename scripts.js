var curColor;
var curDown;
var eraserEnabled;
var paintbucketEnabled;

function enableEraser(elem) {
    eraserEnabled = true;
    $(elem).addClass('eraser');
    $('.brush-color').removeAttr('style').addClass('eraser');
}

function disableEraser(elem) {
    eraserEnabled = false;
    $(elem).removeClass('eraser');
    $('.brush-color').removeAttr('style').removeClass('eraser');
}

$('.grid-element').on({mousedown: function(e) {
                        e.preventDefault();
                        curDown = true;
                        if (eraserEnabled === true) {
                            $(this).removeAttr('style');
                        } else {
                            $(this).css({'background': curColor,
                                        'border-color': curColor});
                        }
                        $('.grid-element').mouseenter(function() {
                            if (curDown === true) {
                                if (eraserEnabled === true) {
                                    $(this).removeAttr('style');
                                } else {
                                    $(this).css({'background': curColor,
                                                 'border-color': curColor});
                                }
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
    if (!$(this).hasClass('eraser')) {
        eraserEnabled = false;
        e.preventDefault();
        curColor = $(this).css('background-color');
        $('.brush-color').css({'background': curColor});
    }
});

$('.white').on({dblclick: function(e) {
                    if (eraserEnabled === true) {
                        disableEraser(this);
                    } else {
                        enableEraser(this);
                    }
                },
                click: function() {
                    if ($(this).hasClass('eraser')) {
                        enableEraser();
                    }
                }
});

$('.user-selected').change(function(e) {
    curColor = $(this).val();
    $('.brush-color').css({'background': curColor});
    $('.user-swatch').css({'background': curColor});
})

$('#reset').click(function() {
    $('.grid-element').removeAttr('style');
});

/***** Flood Fill *****/

$('#paintbucket').click(function(e) {
    paintbucketEnabled = true;
});

if (paintbucketEnabled === true) {
    $('.grid-element').click(function(e) {
        $(this).siblings()
    });
}

/* LocalStorage */

