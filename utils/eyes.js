import * as vector from './vectors.js';

const sqrt3 = Math.sqrt(3);

export function drawEye({x, y, radius, color, target, angry = false}, ctx){
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'white';

    ctx.save();
    ctx.translate(x, y)    

    ctx.beginPath();
    if(angry){
        ctx.arc(0, 0, radius, -Math.PI/6, Math.PI*7/6);
        ctx.arc(0, -2*radius, sqrt3*radius, Math.PI * 2/3, Math.PI / 3, true);
    } else {
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    }
    ctx.closePath();
    ctx.fill();
    
    ctx.save();
    ctx.clip();

    const dir = vector.difference(target, {x,y});
    const dist = vector.length(dir);
    vector.scaleInPlace(dir, (radius*1/4)/dist);

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
    if(angry){
        ctx.arc(0, 0, radius, -Math.PI/6, Math.PI*7/6);
        ctx.arc(0, -2*radius, sqrt3*radius, Math.PI * 2/3, Math.PI / 3, true);
    } else {
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
}