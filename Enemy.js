const getDistance = ({x:x1, y:y1}, {x:x2, y:y2}) => {
    const dx = x2-x1, dy = y2-y1;
    return Math.sqrt(dx*dx + dy*dy);
}

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
    }

    update(dt, prize, bullets){
        const bulletHits = bullets.filter( bullet => !bullet.hasHit && getDistance(this.position, bullet.position) < this.size);
        bulletHits.forEach(bullet => {
            bullet.hasHit = true;
            this.hp--;
        });
        if(this.hp <= 0){
            this.alive = false;
            return;
        }

        const {x: tx, y: ty} = prize.position;
        const {x, y} = this.position;
        const dx = tx-x;
        const dy = ty-y;
        const distance = Math.sqrt(dx*dx + dy*dy);

        if(distance < 30 + this.size){
            prize.health -= this.dmg;
            this.alive = false;
            return;
        }

        this.position.x += dx / distance * this.speed * dt;
        this.position.y += dy / distance * this.speed * dt;
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
}