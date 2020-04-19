import * as vectors from './utils/vectors.js';

export default class Particle {
    constructor({x, y, speed=150, minLifetime = 0.15, maxLifetime = 0.5, r=255, g=255, b=255, maxAlpha=0.5}){
        this.position = {x, y};
        this.lifetime = minLifetime + Math.random() * (maxLifetime - minLifetime);
        this.age = 0;
        this.alive = true;
        this.color = {r,g,b};
        this.maxAlpha = maxAlpha;

        const angle = Math.random() * 2 * Math.PI;
        const length = Math.random() * speed;
        this.movement = {
            x: Math.cos(angle) * length,
            y: Math.sin(angle) * length
        }
    };

    update(dt){
        vectors.addInPlace(this.position, vectors.scale(this.movement, dt));
        vectors.scaleInPlace(this.movement, Math.max(0, 1 - 5*dt));
        this.age += dt;
        this.alive = this.age < this.lifetime;
    };

    draw(ctx){

        ctx.save();
        ctx.translate(this.position.x, this.position.y);

        const alpha = this.maxAlpha * Math.max(0, 1 - this.age/this.lifetime);
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 5);
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
        ctx.fillStyle = gradient;

        ctx.fillRect(-5, -5, 10, 10);

        ctx.restore();
    };
}