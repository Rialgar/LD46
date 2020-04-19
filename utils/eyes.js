import * as vectors from './vectors.js';

const sqrt3 = Math.sqrt(3);
const eyes = {

};

export function drawEye({position:{x, y}, radius, color, target, angry = false, alpha=1}, ctx){
    ctx.save();
    ctx.translate(x, y);

    if(alpha < 1){
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.fillStyle = 'black';

        ctx.beginPath();
        if(angry){
            ctx.arc(0, 0, radius, -Math.PI/6, Math.PI*7/6);
            ctx.arc(0, -2*radius, sqrt3*radius, Math.PI * 2/3, Math.PI / 3, true);
        } else {
            ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        const spec = {position: {x: 0, y: 0}, radius, color, target: vectors.difference(target, {x, y}), angry};
        const key = JSON.stringify(spec);
        if(!eyes[key]){
            const hidden = document.createElement('canvas');

            hidden.width = 2*radius + 2;
            hidden.height = 2*radius + 2;
            const ctx2 = hidden.getContext('2d');
            ctx2.clearRect(0, 0, 2*radius + 2, 2*radius + 2);
            ctx2.save();
            ctx2.translate(radius+1, radius+1);

            drawEye(spec, ctx2);

            ctx2.restore();
            eyes[key] = hidden;
        }

        ctx.globalAlpha = alpha;
        ctx.drawImage(eyes[key], -radius-1, -radius-1);
        ctx.globalAlpha = 1;
    } else {
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';
    
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
    
        const dir = vectors.difference(target, {x,y});
        const dist = vectors.length(dir);
        vectors.scaleInPlace(dir, (radius*1/4)/dist);
    
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
    }

    ctx.restore();
}