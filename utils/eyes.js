import * as vector from './vectors.js';

export function drawEye({x, y, radius, color, target}, ctx){
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'white';

    ctx.save();
    ctx.translate(x, y)    

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    
    ctx.save();
    ctx.clip();

    const dir = vector.difference(target, {x,y});
    const dist = vector.length(dir);
    vector.scaleInPlace(dir, (radius*3/7)/dist);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(dir.x, dir.y, radius/2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(dir.x, dir.y, radius/3, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
}