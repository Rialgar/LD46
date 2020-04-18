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
                aim: 0,
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
        this.checkMousePos();
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
        const {x: x0, y: y0} = data.sticks[0];
        const {x: x1, y: y1} = data.sticks[1];
        this.data.player.movement = {
            x: Math.abs(x0) > threshold ? x0 : 0,
            y: Math.abs(y0) > threshold ? y0 : 0
        }
        if([x1, y1].some(v => Math.abs(v) > threshold)){
            this.data.player.aim = Math.atan2(y1, x1);
        }

        this.data.usingGamePad = [x0, y0, x1, y1].some(v => Math.abs(v) > threshold);
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

    checkMousePos: function() {
        if(!this.data.usingGamePad){
            let {x, y} = this.app.mouse;
            x -= Math.floor(this.app.width/2) + this.data.camera.positon.x + this.data.player.positon.x;
            y -= Math.floor(this.app.height/2) + this.data.camera.positon.y + this.data.player.positon.y;
            this.data.player.aim = Math.atan2(y, x);
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
        const aimDist = 10;
        const aimLength = 15;
        const aimWidth = Math.PI / 10;

        const transformBefore = ctx.getTransform();
        ctx.translate(Math.round(x), Math.round(y));

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        
        ctx.rotate(this.data.player.aim);

        ctx.beginPath();
        ctx.arc(0, 0, radius + aimDist, -aimWidth, aimWidth);
        ctx.lineTo(radius + aimDist + aimLength, 0);
        ctx.closePath();
        ctx.fill();

        ctx.setTransform(transformBefore);
    }
}

export default Game;