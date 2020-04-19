import './lib/playground.js';

import Game from './states/game.js';
import TextState from './states/text.js'

const Help = TextState([
    "Move - WASD/Arrows", "or Left Stick",
    "",
    "Aim - Mouse", " or Right Stick",
    "",
    "Shoot - Left Mouse/Space", " or Right Trigger",
    "",
    "Enemies drop food, bring it to 3-eyes",
    "",
    "Press enter, space or start", "to continue."
], 'start');

const Start = TextState([
    "Keep 3-eyes alive!",
    "Protect and feed it!",
    "",
    "Press enter, space or start", "to start.",
    "",
    "F1 anytime for controls."
], 'start');

const Lost = TextState([
    "Aw, you lost.",
    "",
    "Press enter, space or start", "to restart."
], 'restart');

const Won = TextState([
    "Yay, you won!",
    "",
    "Press enter, space or start", "to restart."
], 'restart');

const app = playground({
    preload: function() { },
    create: function() {
        this.layer.canvas.id = 'game';
        this.loadSounds("shoot.wav", "boom.wav", "hit.wav", "hit2.wav");
        this.sound.alias('shoot_s', 'shoot', 0.2, 1);
        this.sound.alias('boom_s', 'boom', 0.2, 1);
        this.sound.alias('hit_s', 'hit', 0.1, 1);
        this.sound.alias('hit2_s', 'hit2', 0.2, 1);
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
            this.help();
        }
    },

    //custom functions

    help: function(){
        this.setState(Help);
    },

    loose: function(){
        this.setState(Lost);
    },

    win: function(){
        this.setState(Won);
    },

    start: function(){
        this.setState(Game);
    },

    restart: function(){
        Game.create();
        this.setState(Game);
    }
});