var curColor;
var curDown;
var eraserEnabled;
var paintbucketEnabled;

/* Generate Grid */

function genGrid(x, y) {
    var $row = $('<div />', {
        'class': 'row'
    });
    var $square = $('<div />', {
        'class': 'grid-element'
    });
    $('.canvas').empty();
    for (let i = 0; i < x; i++) {
        $row.append($square.clone(true, true));
    }
    for (let j = 0; j < y; j++) {
        $('.canvas').append($row.clone(true, true));
    }
}

genGrid(50, 25);

$('#grid-cols, #grid-rows').change(function() {
    genGrid($('#grid-cols').val(), $('#grid-rows').val());
});

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

$(document.body).on({mousedown: function(e) {
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
}, '.grid-element');
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
                        curColor = $(this).css('background-color');
                        $('.brush-color').css({'background': curColor});
                    } else {
                        enableEraser(this);
                    }
                },
                click: function() {
                    if ($(this).hasClass('eraser')) {
                        enableEraser();
                    } else {
                        curColor = $(this).css('background-color');
                        $('.brush-color').css({'background': curColor});
                    }
                }
});

$('.user-selected').on("change click", function(e) {
    if (!$(this).hasClass('eraser')) {
        eraserEnabled = false;
        curColor = $(this).val();
        $('.brush-color').css({'background': curColor});
        $('.user-swatch').css({'background': curColor});
    }
})

$('#reset').click(function() {
    $('.grid-element').removeAttr('style');
    disableEraser();
    genGrid(50, 25);
});

$('#resize').click(function() {
    $('.resize-params-container').toggleClass('visible');
})

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
