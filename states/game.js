const sqrt05 = Math.sqrt(0.5);

const Game = {
    create: function() { 
        this.data = {
            usingGamePad: false,
            usingKeyBoard: false,
            player: {
                position: {
                    x:0, y:0
                },
                movement: {
                    x:0, y:0
                },
                aim: 0,
                speed: 500
            },
            camera: {
                position: {
                    x:0, y:0
                }
            },
            bulletSpeed: 1000,
            bulletSpacing: 0.1,
            bulletTimeout: 0,
            bullets: []
        }

        window.__debug = {game: this};
    },  
    resize: function() { },

    step: function(dt) {
        this.checkKeysAndButtons();
        this.checkMousePos();
        this.updateBullets(dt);
        this.updatePlayer(dt);
        if(this.data.bulletTimeout >= 0){
            this.data.bulletTimeout -= dt;
        }
    },
    render: function(dt) {
        const ctx = this.app.layer.context;
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0,this.app.width, this.app.height);
        
        const transformBefore = ctx.getTransform();

        const {x, y} = this.data.camera.position;

        ctx.translate(Math.floor(x + this.app.width/2), Math.floor(y + this.app.height/2));

        this.drawPlayer(ctx);
        this.drawBullets(ctx);

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

        if([x0, y0].some(v => Math.abs(v) > threshold)){
            this.data.player.movement = {
                x: x0,
                y: y0
            }
        } else {
            this.data.player.movement = {
                x: 0,
                y: 0
            }
        }
        if([x1, y1].some(v => Math.abs(v) > threshold)){
            this.data.player.aim = Math.atan2(y1, x1);
        }

        this.data.usingGamePad = [x0, y0, x1, y1].some(v => Math.abs(v) > threshold);
    },

    //custom functions
    checkKeysAndButtons: function(){
        if(this.data.usingGamePad){
            this.data.usingKeyBoard = false;            
        } else {
            if(this.app.keyboard.any || this.app.mouse.left){
                this.data.usingKeyBoard = true;
            }
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
            if(this.app.mouse.left){
                this.spawnBullets();
            }
        }
      
        if(!this.data.usingKeyBoard && this.app.gamepads[0]){
            if(this.app.gamepads[0].buttons.r2){
                this.spawnBullets();
            }
        }
    },

    checkMousePos: function() {
        if(!this.data.usingGamePad && this.data.usingKeyBoard){
            let {x, y} = this.app.mouse;
            x -= Math.floor(this.app.width/2) + this.data.camera.position.x + this.data.player.position.x;
            y -= Math.floor(this.app.height/2) + this.data.camera.position.y + this.data.player.position.y;
            this.data.player.aim = Math.atan2(y, x);
        }
    },

    updateMovable: function({position, movement, speed}, dt){
        position.x += movement.x * speed * dt;
        position.y += movement.y * speed * dt;
    },

    updatePlayer: function(dt) {
        this.updateMovable(this.data.player, dt);
    },

    drawPlayer: function(ctx){
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;

        const {x, y} = this.data.player.position;
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
        ctx.stroke();

        
        ctx.rotate(this.data.player.aim);

        ctx.beginPath();
        ctx.arc(0, 0, radius + aimDist, -aimWidth, aimWidth);
        ctx.lineTo(radius + aimDist + aimLength, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.setTransform(transformBefore);
    },
    
    spawnBullets: function(){
        const {position: {x, y}, aim} = this.data.player;

        let count = 0;
        while(this.data.bulletTimeout <= 0){
            const bullet = {
                position: {x, y},
                movement: {
                    x: Math.cos(aim),
                    y: Math.sin(aim)
                },
                speed: this.data.bulletSpeed,
                aim,
                age: 0
            }
            this.updateMovable(bullet, -this.data.bulletTimeout);
            this.data.bullets.push(bullet);            
            this.data.bulletTimeout += this.data.bulletSpacing;
        }
    },

    updateBullets: function(dt){
        const maxAge = 5;

        this.data.bullets.forEach(bullet => {
            this.updateMovable(bullet, dt);
            bullet.age += dt;
        } );
        this.data.bullets = this.data.bullets.filter( bullet => bullet.age < maxAge)
    },

    drawBullets: function(ctx){
        ctx.fillStyle = 'white';

        this.data.bullets.forEach(bullet => {
            const {x, y} = bullet.position;
            const radius = 5;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        } );
    }
}

export default Game;