Array.prototype.partition = function(predicate){
    const out = [[],[]];
    this.forEach(element => {
        if(predicate(element)){
            out[0].push(element);
        } else {
            out[1].push(element);
        }
    });
    return out;
}