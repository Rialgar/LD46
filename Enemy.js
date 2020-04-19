import * as vector from './utils/vectors.js';

export default class Enemy {
    constructor({x, y, size = 10, speed = 100, maxHP = 1, dmg = 5, color = 'red'}){
        this.alive = true;
        this.position = {x, y};
        this.size = size;
        this.speed = speed;
        this.maxHP = maxHP;
        this.hp = maxHP;
        this.dmg = dmg;
        this.dmgDealt = 0;
        this.color = color;
        this.drops = 0;
        this.corpse = [];
    }

    update(dt, prize, bullets){
        const bulletHits = bullets.filter( bullet => !bullet.hasHit && vector.distance(this.position, bullet.position) < this.size);
        bulletHits.forEach(bullet => {
            bullet.hasHit = true;
            this.hp--;
        });
        if(this.hp <= 0){
            this.alive = false;
            const r = Math.random() * Math.random();
            this.drops = Math.floor((1 - r*r) * (this.maxHP * 5 + 1));
            this.createCorpse();
            return;
        }

        const diff = vector.difference(prize.position, this.position);
        const dist = vector.length(diff);

        if(dist < 30 + this.size){
            this.alive = false;
            this.dmgDealt = this.dmg;
            return;
        }

        vector.addInPlace(this.position, vector.scale(diff, this.speed * dt / dist));
    };

    render(ctx){
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;

        ctx.save();
        ctx.translate(this.position.x, this.position.y);

        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size*this.hp/this.maxHP, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, 2*Math.PI);
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
    };

    createCorpse(){
        const pieceCount = Math.ceil(3 + this.size/20 + Math.random() * this.size/20);
        const angles = [];
        const average = Math.PI * 2 / pieceCount;
        for(let i = 0; i < pieceCount; i++){
            angles[i] = i * average + Math.random() *  average/2 - average/4;            
        }
        for(let i = 0; i < pieceCount; i++){
            const from = angles[i];
            let to = angles[(i+1) % angles.length];
            if(to < from){
                to += 2*Math.PI;
            }
            const direction = (from+to) / 2;
            const movement = {
                x: Math.cos(direction),
                y: Math.sin(direction)
            }
            const r = Math.random();
            vector.scaleInPlace(movement, 4*(1-r*r)*this.size);

            this.corpse.push({
                position: {... this.position},
                from,
                to,
                size: this.size,
                movement,
                speed: 1,
                age: 0
            })
        }
    };

    static Small = {};
    static Medium = {size: 15, maxHP: 2};
    static Big = {size: 20, maxHP: 3};
    static Boss1 = {size: 50, maxHP: 100, speed: 20, dmg: 40};
}