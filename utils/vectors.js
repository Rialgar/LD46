export const distance = ({x:x1, y:y1}, {x:x2, y:y2}) => {
    const dx = x2-x1, dy = y2-y1;
    return Math.sqrt(dx*dx + dy*dy);
};

export const length = ({x,y}) => {
    return Math.sqrt(x*x + y*y);
};

export const difference = ({x: x1,y: y1},{x: x2,y: y2}) => {
    return {x: x1-x2, y: y1-y2};
};

export const scale = ({x, y}, factor) => {
    return {x: x*factor, y: y*factor};
}

export const scaleInPlace = (target, factor) => {
    target.x *= factor;
    target.y *= factor;
    return target;
}

export const add = ({x: x1,y: y1},{x: x2,y: y2}) => {
    return {x: x1+x2, y: y1+y2};
};

export const addRandom = ({x, y}, range) => {
    return {x: x+Math.random()*range-range/2, y: y+Math.random()*range-range/2};
};

export const addInPlace = (target, change) => {
    target.x += change.x;
    target.y += change.y;
    return target;
}