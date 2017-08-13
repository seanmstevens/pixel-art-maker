let curColor, curDown, eraserEnabled, eyedropperEnabled, paintbucketEnabled, rows, cols;
let gridValues = {};

/* Generate Grid */

function genGrid(x = null, y = null) {
    const $row = $('<div />', {
        'class': 'row'
    });
    const $square = $('<div />', {
        'class': 'grid-element'
    });
    $('.canvas').empty();
    rows = Math.floor(($(window).height() - 220) / 16);
    cols = Math.floor(($(window).width() - 440) / 16);
    if (x && y) {
        $('#grid-cols').val(x);
        $('#grid-rows').val(y);
        $('#col-size-indicator').text(x);
        $('#row-size-indicator').text(y);
        for (let i = 0; i < x; i++) {
            $row.append($square.clone(true, true));
        }
        for (let j = 0; j < y; j++) {
            $row.attr('class', 'row _' + j);
            $('.canvas').append($row.clone(true, true));
        }
    } else {
        $('#grid-cols').val(cols);
        $('#grid-rows').val(rows);
        $('#col-size-indicator').text(cols);
        $('#row-size-indicator').text(rows);
        for (let i = 0; i < cols; i++) {
            $row.append($square.clone(true, true));
        }
        for (let j = 0; j < rows; j++) {
            $row.attr('class', 'row _' + j);
            $('.canvas').append($row.clone(true, true));
        }
    }
}

// Generating the first grid and setting the maximum canvas width according to window size
genGrid();
$('#grid-cols').attr('max', Math.floor(($(window).width() - 220) / 16));

$('#grid-cols, #grid-rows').on({
    mouseup: function() {
        cols = $('#grid-cols').val();
        rows = $('#grid-rows').val();
        genGrid(cols, rows);
    },
    input: function() {
        $('#col-size-indicator').text($('#grid-cols').val());
        $('#row-size-indicator').text($('#grid-rows').val());    
    }
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

function enablePaintbucket() {
    paintbucketEnabled = true;
    $('#paintbucket').addClass('active');
}

function disablePaintbucket() {
    paintbucketEnabled = false;
    $('#paintbucket').removeClass('active');
}

function enableEyedropper() {
    eyedropperEnabled = true;
    $('#eyedropper').addClass('active');
}

function disableEyedropper() {
    eyedropperEnabled = false;
    $('#eyedropper').removeClass('active');
}

$(document.body).on({
    mousedown: function(e) {
        e.preventDefault();
        curDown = true;
        if (paintbucketEnabled) {
            $x = $(this).siblings().addBack().index(this);
            $y = $(this).parent().siblings().addBack().index($(this).parent());
            floodStart($x, $y);
        } else {
            if (eyedropperEnabled && $(this).hasClass('painted') && !eraserEnabled) {
                curColor = $(this).css('background-color');
                $('.brush-color').css({'background': curColor});
                disableEyedropper();
            }
            if (eraserEnabled) {
                $(this).removeAttr('style').removeClass('painted');
            } else {
                $(this).css({'background': curColor,
                            'border-color': curColor}).addClass('painted');
            }
            $('.grid-element').mouseenter(function() {
                if (curDown) {
                    if (eraserEnabled) {
                        $(this).removeAttr('style').removeClass('painted');
                    } else {
                        $(this).css({'background': curColor,
                                        'border-color': curColor}).addClass('painted');
                    }
                }
            });
        }
    },
    mouseup: function() {
        curDown = false;
    },
}, '.grid-element');

$('.canvas').mouseleave(function() {
    curDown = false;
});

$('.swatch').click(function(e) {
    disableEyedropper();
    if (!$(this).hasClass('eraser')) {
        eraserEnabled = false;
        e.preventDefault();
        curColor = $(this).css('background-color');
        $('.brush-color').css({'background': curColor});
    }
});

$('.white').on({
    dblclick: function() {
        if (eraserEnabled) {
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

// User-Selected Swatch
$('.user-selected').on("change click", function(e) {
    if (!$(this).hasClass('eraser')) {
        eraserEnabled = false;
        curColor = $(this).val();
        $('.brush-color').css({'background': curColor});
        $('.user-swatch').css({'background': curColor});
    }
});

// Reset ALL Canvas Properties
$('#reset').click(function() {
    $('.grid-element').removeAttr('style');
    disableEraser();
    disableEyedropper();
    disablePaintbucket();
    $('.white').removeClass('eraser');
    curColor = null;
    genGrid();
});

$('#clear').click(function() {
    disableEyedropper();
    disablePaintbucket();
    $('.grid-element').removeAttr('style class').addClass('grid-element');
});

$('#eyedropper').click(function() {
    if (eyedropperEnabled) {
        disableEyedropper();
    } else {
        enableEyedropper();
    }
});

$('#paintbucket').click(function() {
    if (paintbucketEnabled) {
        disablePaintbucket();
    } else {
        enablePaintbucket();
    }
});

// $('.grid-element').click(function(e) {
//     targetColor = $(this).css('background-color');
//     $x = $(this).siblings().addBack().index(this);
//     $y = $(this).parent().siblings().addBack().index($(this).parent());
//     pixelPos = [$x, $y];
//     console.log('pixel: ' + $x, 'row: ' + $y);
// });

function floodStart(x, y) {
    const pixelStack = [];
    floodFill(x, y);
    
    function floodFill(x, y){
        pixelStack.push([x, y]);
        fillPixel(x, y);
    
        while (x > 0 || y > 0 || x < cols || y < rows || pixelStack.length) {
            toFill = pixelStack.pop();
            console.log(toFill);
            fillPixel(toFill[0], toFill[1]);
        }
    }
    
    function fillPixel(x, y){
        if (!alreadyFilled(x, y)) {
            fill(x, y);
        }
        if (!alreadyFilled(x, y-1)) pixelStack.push([x, y-1]);
        if (!alreadyFilled(x+1, y)) pixelStack.push([x+1, y]);
        if (!alreadyFilled(x, y+1)) pixelStack.push([x, y+1]);
        if (!alreadyFilled(x-1, y)) pixelStack.push([x-1, y]);
    }
    
    function fill(x, y){
        pixel = $('.canvas').children().eq(y).children().eq(x);
        pixel.css({'background-color': curColor,
                   'border-color': curColor});
        pixel.addClass('painted');   
    }
    
    function alreadyFilled(x, y){
        // this functions checks to see if our square has been filled already
        pixel = $('.canvas').children().eq(y).children().eq(x);
        return $(pixel).hasClass('painted');
    }
}

function alreadyFilled(x, y) {
}

$('#resize').click(function() {
    $('.resize-params-container').addClass('visible');
    $(this).addClass('active');
});

$('html').click(function(e) {
    if ($(e.target).closest('.resize-params-container').length === 0 && e.target.id !== 'resize') {
        $('.resize-params-container').removeClass('visible');
        $('#resize').removeClass('active');
    }
});

/***** Flood Fill *****/


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
