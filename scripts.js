let curColor;
let curDown;
let eraserEnabled;
let paintbucketEnabled;
let rows;
let cols;

/* Generate Grid */

function genGrid(x, y) {
    const $row = $('<div />', {
        'class': 'row'
    });
    const $square = $('<div />', {
        'class': 'grid-element'
    });
    $('.canvas').empty();
    rows = y;
    cols = x;
    if ($(window).width() >= 1050) {
        for (let i = 0; i < x; i++) {
            $row.append($square.clone(true, true));
        }
        for (let j = 0; j < y; j++) {
            $row.attr('class', 'row _' + j);
            $('.canvas').append($row.clone(true, true));
        }
    } else {
        cols = ($(window).width() - 250) / 16;
        for (let i = 0; i < cols; i++) {
            $row.append($square.clone(true, true));
        }
        for (let j = 0; j < y; j++) {
            $row.attr('class', 'row _' + j);
            $('.canvas').append($row.clone(true, true));
        }
    }
}

genGrid(50, 25);

$('#grid-cols, #grid-rows').change(function() {
    rows = $('#grid-rows').val();
    cols = $('#grid-cols').val();
    genGrid(cols, rows);
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
                            $(this).removeAttr('style').removeClass('painted');
                        } else {
                            $(this).css({'background': curColor,
                                        'border-color': curColor}).addClass('painted');
                        }
                        $('.grid-element').mouseenter(function() {
                            if (curDown === true) {
                                if (eraserEnabled === true) {
                                    $(this).removeAttr('style').removeClass('painted');
                                } else {
                                    $(this).css({'background': curColor,
                                                 'border-color': curColor}).addClass('painted');
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
    $('.white').removeClass('eraser');
    curColor = null;
    $('#grid-rows').val(25);
    $('#grid-cols').val(50);
    genGrid(50, 25);
});

$('#clear').click(function() {
    $('.grid-element').removeAttr('style class').addClass('grid-element');
})

$('#resize').click(function() {
    $('.resize-params-container').toggleClass('visible');
});

$('body').click(function(e) {
    if ($(e.target).closest('.resize-params-container').length === 0 && e.target.id !== 'resize') {
        $('.resize-params-container').removeClass('visible');
    }
});

/***** Flood Fill *****/

$('#paintbucket').click(function(e) {
    paintbucketEnabled = true;
});

if (paintbucketEnabled === true) {
    const pixelStack = [];
    $('.grid-element').click(function(e) {
        const row = $(this).parent();
    });
}

/* LocalStorage */

$('#save').click(function() {
    const masterCopy = {};
    masterCopy['width'] = cols;
    masterCopy['height'] = rows;
    $('.grid-element').map(function(idx) {
        if ($(this).hasClass('painted')) {
            masterCopy[idx] = $(this).css('background-color');
        } else {
            masterCopy[idx] = null;
        }
        return localStorage.setItem("masterCopy", JSON.stringify(masterCopy));
    });
});

$('#load').click(function() {
    const masterCopy = localStorage.getItem('masterCopy');
    genGrid(JSON.parse(masterCopy)['width'], JSON.parse(masterCopy)['height']);
    const grid = $('.grid-element');
    JSON.parse(masterCopy, function(key, value) {
        if (value !== null) {
            grid.eq(key).css({'background-color': value,
                              'border-color': value});
            grid.eq(key).addClass('painted');
        }
    });
});
