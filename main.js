import './lib/playground.js';

import Game from './states/game.js';

var app = playground({
    preload: function() { },  
    create: function() { 
        this.layer.canvas.id = 'game';
    },  
    ready: function() {
        this.setState(Game);
    },
    resize: function() { },

    step: function(dt) { },
    render: function(dt) { },
  
    createstate: function() { },
    enterstate: function() { },
    leavestate: function() { },
  
    keydown: function(data) { },
    keyup: function(data) { },
  
    pointerdown: function(data) { },
    pointerup: function(data) { },
    pointermove: function(data) { },
    pointerwheel: function(data) { },
  
    mousedown: function(data) { },
    mouseup: function(data) { },
    mousemove: function(data) { },
  
    touchstart: function(data) { },
    touchend: function(data) { },
    touchmove: function(data) { },
  
    gamepaddown: function(data) { },
    gamepadup: function(data) { },
    gamepadmove: function(data) { }
  });