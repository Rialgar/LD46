import './lib/playground.js';

import Game from './states/game.js';
import TextState from './states/text.js'

const Help = TextState([
    "Move - WASD or Left Stick",
    "Aim - Mouse or Right Stick",
    "Shoot - Left Mouse or Right Trigger",
    "",
    "Press any key or gamepad button", "to continue."
], 'start');

const Start = TextState([
    "Keep the target thingy alive!",
    "Protect and feed it!",
    "",
    "Press any key or gamepad button", "to start.",
    "",
    "F1 anytime for controls."
], 'start');

const Lost = TextState([
    "Aw, you lost.",
    "",
    "Press any key or gamepad button", "to restart."
], 'restart');

const app = playground({
    preload: function() { },  
    create: function() { 
        this.layer.canvas.id = 'game';
    },  
    ready: function() {
        this.setState(Start)
    },
    resize: function() { },

    step: function(dt) { },
    render: function(dt) { },

    createstate: function() { },
    enterstate: function() { },
    leavestate: function() { },

    keydown: function(data) {
        if( data.key === "f1"){
            this.setState(Help);
        }
    },

    //custom functions

    loose: function(){
        this.setState(Lost);
    },

    start: function(){
        this.setState(Game);
    },

    restart: function(){
        Game.create();
        this.setState(Game);
    }
});