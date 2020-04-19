import Enemy from '../Enemy.js';
import Particle from '../Particle.js';
import '../utils/partition.js';

import * as vectors from '../utils/vectors.js';
import {drawEye} from '../utils/eyes.js';
let maxDt= 0;
const sqrt05 = Math.sqrt(0.5);
const waves = [
    [
        Enemy.Small, Enemy.Small, 2,
        Enemy.Small, Enemy.Small, Enemy.Small, Enemy.Small
    ],
    [
        Enemy.Medium, Enemy.Medium, 2,
        Enemy.Medium, Enemy.Medium, Enemy.Small, Enemy.Small
    ],
    [
        Enemy.Big, Enemy.Big, 2,
        Enemy.Medium, Enemy.Big, Enemy.Big, Enemy.Small, Enemy.Small
    ],
    [
        Enemy.Big, Enemy.Big, Enemy.Big, 2,
        Enemy.Medium, Enemy.Medium, Enemy.Medium, Enemy.Medium, Enemy.Small, Enemy.Small, Enemy.Small, Enemy.Small
    ],
    [
        Enemy.Small, Enemy.Small, Enemy.Small, Enemy.Small, Enemy.Boss1, 10,
        Enemy.Small, Enemy.Small, Enemy.Small, Enemy.Small, 3,
        Enemy.Small, Enemy.Small, Enemy.Small, 3,
        Enemy.Small, Enemy.Small, Enemy.Small, 3,
        Enemy.Small, Enemy.Small, 2,
        Enemy.Small, Enemy.Small, 2,
        Enemy.Small, Enemy.Small, 2,
        Enemy.Small, Enemy.Small, 2,
        Enemy.Small, Enemy.Small, 2,
        Enemy.Small, Enemy.Small, 2,
        Enemy.Small, Enemy.Small, 2,
        Enemy.Small, Enemy.Small, 2,
        Enemy.Small, Enemy.Small
    ]
];
const spawnDistance = 1000;

const Game = {
    create: function() {
        this.data = {
            usingGamePad: false,
            usingKeyBoard: false,
            player: {
                position: {
                    x:0, y:-100
                },
                movement: {
                    x:0, y:0
                },
                aim: 0,
                speed: 500,
                food: 0
            },
            camera: {
                position: {
                    x:0, y:0
                }
            },
            bulletSpeed: 1000,
            bulletSpacing: 0.1,
            bulletTimeout: 0,
            bullets: [],
            prize: {
                position: {
                    x:0,
                    y:0
                },
                health: 60
            },
            enemies: [],
            drops: [],
            corpses: [],
            particles: [],
            nextWave: 0,
            currentWave: {
                index: 0,
                finished: true,
                enemyIndex: 0
            },
            winTimeout: 10,
            screenshake: 0,
            damageShake: 0
        }

        window.__debug = {game: this};
    },

    step: function(dt) {
        const healthScale = 1;

        this.checkKeysAndButtons();
        this.checkMousePos();
        this.updatePlayer(dt);
        this.updateEnemies(dt);
        this.updateBullets(dt);
        this.updateDrops(dt);
        this.updateCorpses(dt);
        this.updateParticles(dt);

        if(this.data.bulletTimeout >= 0){
            this.data.bulletTimeout -= dt;
        }
        this.data.prize.health -= dt * healthScale;
        if(this.data.prize.health < 0){
            this.app.loose();
            return;
        }

        if(this.data.enemies.length == 0 && this.data.currentWave.finished){
            if(waves.length > this.data.nextWave) {
                this.spawnWave(this.data.nextWave);
                this.data.nextWave++;
            } else if(this.data.winTimeout <= 0){
                this.app.win();
            } else {
                this.data.winTimeout -= dt;
            }
        }
        this.updateWave(dt);

        this.data.screenshake *= Math.max(0, 1 - 5*dt);
        this.data.damageShake *= Math.max(0, 1 - 5*dt);

        maxDt = Math.max(maxDt, dt);
        console.log(maxDt);
    },

    render: function(dt) {
        const ctx = this.app.layer.context;
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0,this.app.width, this.app.height);

        ctx.save();

        const {x, y} = this.data.camera.position;

        ctx.translate(x + this.app.width/2 + Math.random() * this.data.screenshake - this.data.screenshake/2, y + this.app.height/2  + Math.random() * this.data.screenshake - this.data.screenshake/2);

        this.drawCorpses(ctx);
        this.drawPrize(ctx);
        this.drawEnemies(ctx);
        this.drawBullets(ctx);
        this.drawDrops(ctx);
        this.drawParticles(ctx);
        this.drawPlayer(ctx);

        ctx.restore();
    },

    keydown: function(data) {
        if(data.key === "enter"){
            this.app.help();
        }
    },
    keyup: function(data) { },

    mousedown: function(data) { },
    mouseup: function(data) { },
    mousemove: function(data) { },

    gamepaddown: function(data) {
        if(data.button === "start"){
            this.app.help();
        }
    },
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
            if(this.app.mouse.left || this.app.keyboard.keys.space){
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
        vectors.addInPlace(position, vectors.scale(movement, speed*dt));
    },

    updatePlayer: function(dt) {
        this.updateMovable(this.data.player, dt);
        const dist = vectors.distance(this.data.player.position, this.data.prize.position);
        if(dist < 30){
            const delta = Math.min(60 - this.data.prize.health, this.data.player.food)
            this.data.prize.health += delta;
            this.data.player.food -= delta;
        }
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

        ctx.save();
        ctx.translate(x, y);

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(0, 0, radius * this.data.player.food / 30, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();

        ctx.rotate(this.data.player.aim);

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(0, 0, radius + aimDist, -aimWidth, aimWidth);
        ctx.lineTo(radius + aimDist + aimLength, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    },

    spawnBullets: function(){
        const {position, aim} = this.data.player;

        const movement = {
            x: Math.cos(aim),
            y: Math.sin(aim)
        };
        const spawnPos = vectors.add(position, vectors.scale(movement, 45));

        while(this.data.bulletTimeout <= 0){
            const bullet = {
                position: {... spawnPos},
                movement,
                speed: this.data.bulletSpeed,
                aim,
                age: 0,
                hasHit: false
            }
            this.updateMovable(bullet, -this.data.bulletTimeout);
            this.data.bullets.push(bullet);
            this.data.bulletTimeout += this.data.bulletSpacing;
            this.data.screenshake += 1;
            
            this.data.particles.push(
                new Particle({...spawnPos}),
                new Particle({...spawnPos}),
                new Particle({...spawnPos}),
                new Particle({...spawnPos}),
                new Particle({...spawnPos})
            )
        }
    },

    updateBullets: function(dt){
        const maxAge = 5;

        this.data.bullets.forEach(bullet => {
            this.updateMovable(bullet, dt);
            bullet.age += dt;
        } );
        this.data.bullets.filter(bullet => bullet.hasHit).forEach(bullet => {
            this.data.particles.push(
                new Particle({...bullet.position}),
                new Particle({...bullet.position}),
                new Particle({...bullet.position}),
                new Particle({...bullet.position}),
                new Particle({...bullet.position})
            );
        });
        this.data.bullets = this.data.bullets.filter( bullet => bullet.age < maxAge && !bullet.hasHit);
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
    },

    drawPrize: function(ctx){
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;

        const {x, y} = this.data.prize.position;

        ctx.save();
        ctx.translate(x, y);

        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(0, 0, this.data.prize.health/2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();

        ctx.restore();

        const eyes = [
            {x: x-25, y: y+3},
            {x: x+25, y: y+3},
            {x: x, y: y-25}
        ]

        if(this.data.damageShake < 0.5){            
            eyes.forEach(eye => drawEye({...eye, radius: 15, color: 'green', target: this.data.player.position}, ctx))
        } else {
            eyes.forEach(eye => drawEye({...eye, radius: 15, color: 'red', target: vectors.addRandom(eye, this.data.damageShake)}, ctx))
        }
    },

    updateEnemies: function(dt){
        this.data.enemies.forEach(enemy => enemy.update(dt, this.data.prize.position, this.data.bullets));
        const [alive, dead] = this.data.enemies.partition(enemy => enemy.alive);
        this.data.enemies = alive;
        dead.forEach(enemy => {
            this.spawnDrops(enemy);
            this.data.corpses.push(... enemy.corpse);
            for(let i = 0; i < 4*enemy.size; i++){            
                this.data.particles.push(
                    new Particle({...enemy.position, speed: 10 * Math.min(200, enemy.drops), minLifetime: 1, maxLifetime1: 3, maxAlpha: 1})
                )
            }
            this.data.prize.health -= enemy.dmgDealt;
            this.data.screenshake += enemy.size/2 + enemy.dmgDealt * 5;
            this.data.damageShake += enemy.dmgDealt * 2;
        });
    },

    drawEnemies: function(ctx){
        this.data.enemies.forEach(enemy => enemy.render(ctx, this.data.prize.position));
    },

    spawnWave: function(index){
        this.data.currentWave = {
            index: index,
            finished: false,
            enemyIndex: 0,
            timeout: 0
        }
    },

    updateWave: function(dt){
        if(this.data.currentWave.timeout <= 0){
            let spec = waves[this.data.currentWave.index][this.data.currentWave.enemyIndex];
            while(typeof spec === 'object'){
                const angle = Math.random() * Math.PI * 2;
                const x = Math.sin(angle) * spawnDistance;
                const y = Math.cos(angle) * spawnDistance;

                this.data.enemies.push(new Enemy({... spec, x, y}));

                this.data.currentWave.enemyIndex++;
                spec = waves[this.data.currentWave.index][this.data.currentWave.enemyIndex];
            }
            if(typeof spec === 'number'){
                this.data.currentWave.timeout = spec;
                this.data.currentWave.enemyIndex++;
            } else {
                this.data.currentWave.finished = true;
            }
        } else {
            this.data.currentWave.timeout -= dt;
        }
    },

    spawnDrops: function({position, drops}){
        for(let i = 0; i < drops; i++){
            const drop = {
                position: {... position},
                movement: {},
                speed: 1,
                collected: false
            }
            const angle = Math.random() * Math.PI * 2;
            drop.movement = vectors.scaleInPlace({
                x: Math.sin(angle),
                y: Math.cos(angle)
            }, Math.random() * 10 * Math.min(200, drops));
            this.data.drops.push(drop)
        }
    },

    updateDrops: function(dt){
        this.data.drops.forEach(drop => {
            this.updateMovable(drop, dt);
            vectors.scaleInPlace(drop.movement, Math.max(0, 1-5*dt));

            const diff = vectors.difference(this.data.player.position, drop.position);
            const dist = vectors.length(diff);
            if(this.data.player.food < 30){
                if(dist <= 22){
                    drop.collected = true;
                    this.data.player.food += 0.2;
                } else if(dist < 100){
                    vectors.addInPlace(drop.movement, vectors.scale(diff, dt * 300000 / dist / dist));
                }
            }

        });
        this.data.drops = this.data.drops.filter(drop => !drop.collected);
    },

    drawDrops: function(ctx){
        this.data.drops.forEach(drop => {
            ctx.fillStyle = 'green';

            ctx.beginPath();
            ctx.arc(drop.position.x, drop.position.y, 5, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        });
    },

    updateCorpses: function(dt){
        this.data.corpses.forEach(corpse => {
            this.updateMovable(corpse, dt);
            vectors.scaleInPlace(corpse.movement, Math.max(0, 1-5*dt));
            corpse.age += dt;
        });
    },

    drawCorpses: function(ctx){
        this.data.corpses.forEach(corpse => {
            const alpha = Math.max(0.1, 1 - corpse.age/5);
            const color = Math.floor(alpha * 255);
            ctx.strokeStyle = `rgb(${color}, ${color}, ${color})`;
            ctx.lineWidth = 4;

            ctx.beginPath();
            ctx.arc(corpse.position.x, corpse.position.y, corpse.size, corpse.from, corpse.to);
            ctx.stroke();
        });
    },

    updateParticles: function(dt){
        this.data.particles.forEach(part => part.update(dt));
        this.data.particles = this.data.particles.filter(part => part.alive);
    },

    drawParticles: function(ctx){
        this.data.particles.forEach(part => part.draw(ctx));
    },
}

export default Game;