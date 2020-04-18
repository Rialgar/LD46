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
        this.color = color;
        this.drops = 0;
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
            return;
        }

        const diff = vector.difference(prize.position, this.position);
        const dist = vector.length(diff);

        if(dist < 30 + this.size){
            prize.health -= this.dmg;
            this.alive = false;
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

    static Small = {};
    static Medium = {size: 15, maxHP: 2};
    static Big = {size: 20, maxHP: 3};
    static Boss1 = {size: 50, maxHP: 100, speed: 20, dmg: 40};
}