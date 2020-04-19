import * as vectors from './utils/vectors.js';
import {drawEye} from './utils/eyes.js';

export default class Enemy {
    constructor({x, y, size = 10, speed = 100, maxHP = 1, dmg = 5, r = 255, g = 0, b = 0}){
        this.alive = true;
        this.position = {x, y};
        this.size = size;
        this.speed = speed;
        this.maxHP = maxHP;
        this.hp = maxHP;
        this.dmg = dmg;
        this.dmgDealt = 0;
        this.color = {r, g, b};
        this.drops = 0;
        this.corpse = [];
    }

    update(dt, target, bullets){
        const bulletHits = bullets.filter( bullet => !bullet.hasHit && vectors.distance(this.position, bullet.position) < this.size);
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

        const diff = vectors.difference(target, this.position);
        const dist = vectors.length(diff);

        if(dist < 30 + this.size){
            this.alive = false;
            this.dmgDealt = this.dmg;
            return;
        }

        vectors.addInPlace(this.position, vectors.scale(diff, this.speed * dt / dist));
    };

    render(ctx, target, drawDistance){
        const {r,g,b} = this.color;
        const distO = vectors.length(this.position);        
        if(distO > drawDistance + this.size){
            ctx.save();

            const angle = Math.atan2(this.position.y, this.position.x);
            ctx.rotate(angle);

            const gradDist = 500;
            const gradient = ctx.createRadialGradient(drawDistance - 4 + gradDist, 0, gradDist, drawDistance - 4 + gradDist, 0, gradDist + 5 + 5 *Math.sqrt(this.size));
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${1 - (distO-drawDistance)/600})`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 20;

            ctx.beginPath();
            ctx.arc(0, 0, drawDistance - 22, - Math.PI, Math.PI);
            ctx.stroke();

            ctx.restore();
        }

        ctx.save();
        ctx.translate(this.position.x, this.position.y);

        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`;
        ctx.beginPath();
        ctx.arc(0, 0, this.size*this.hp/this.maxHP, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, 2*Math.PI);
        ctx.closePath();
        ctx.stroke();

        ctx.restore();

        const dir = vectors.difference(target, this.position);
        const dist = vectors.length(dir);
        vectors.scaleInPlace(dir, this.size*2/3/dist);

        drawEye({... vectors.add(this.position, dir), radius: this.size/2, color: `rgba(${r}, ${g}, ${b}, 1)`, target}, ctx);
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
            vectors.scaleInPlace(movement, 6*(1-r*r)*this.size);

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