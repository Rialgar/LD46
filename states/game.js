const sqrt05 = Math.sqrt(0.5);

const Game = {
    create: function() { 
        console.log('Game create');        

        this.data = {
            usingGamePad: false,
            player: {
                positon: {
                    x:0, y:0
                },
                movement: {
                    x:0, y:0
                },
                speed: 500
            },
            camera: {
                positon: {
                    x:0, y:0
                }
            }
        }

        window.__debug = {game: this};
    },  
    resize: function() { },

    step: function(dt) {
        this.checkKeysAndButtons();
        this.updatePlayer(dt);
    },
    render: function(dt) {
        const ctx = this.app.layer.context;
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0,this.app.width, this.app.height);
        
        const transformBefore = ctx.getTransform();

        const {x, y} = this.data.camera.positon;

        ctx.translate(Math.floor(x + this.app.width/2), Math.floor(y + this.app.height/2));

        this.drawPlayer(ctx);

        ctx.setTransform(transformBefore);
    },
  
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
    gamepadhold: function(data) { },
    gamepadup: function(data) { },

    gamepadmove: function(data) {
        const threshold = 0.2;
        const {x, y} = data.sticks[0];        
        this.data.player.movement = {
            x: Math.abs(x) > threshold ? console.log({x}) || x : 0,
            y: Math.abs(y) > threshold ? console.log({y}) || y : 0
        }
        if(this.data.player.movement.x !== 0 || this.data.player.movement.y !== 0){
            this.data.usingGamePad = true;
        }
    },

    //custom functions
    checkKeysAndButtons: function(){
        if(!this.data.usingGamePad){
            let x = 0, y = 0;
            if(this.app.keyboard.keys.up || this.app.keyboard.keys.w){
                y -=1;
            }
            if(this.app.keyboard.keys.down || this.app.keyboard.keys.s){
                y +=1;
            }
            if(this.app.keyboard.keys.left || this.app.keyboard.keys.a){
                x -=1;
            }
            if(this.app.keyboard.keys.right || this.app.keyboard.keys.d){
                x +=1;
            }
            if(x !== 0 && y !== 0){
                x *= sqrt05;
                y *= sqrt05;
            }
            this.data.player.movement = {x, y};
        }
    },

    updatePlayer: function(dt) {
        const {positon, movement, speed} = this.data.player;
        positon.x += movement.x * speed * dt;
        positon.y += movement.y * speed * dt;
    },

    drawPlayer: function(ctx){
        ctx.fillStyle = 'white';

        const {x, y} = this.data.player.positon;
        const radius = 20;

        ctx.beginPath();
        ctx.arc(Math.round(x), Math.round(y), radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }
}

export default Game;