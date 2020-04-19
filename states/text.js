const TextState = (lines, funcName) => ({
    create: function() { },
    resize: function() { },

    step: function(dt) { },
    render: function(dt) {
        const ctx = this.app.layer.context;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.app.width, this.app.height);
        this.drawText(ctx);
    },

    keydown: function(data) {
        if(data.key === "enter" || data.key === "space"){
            this.app[funcName]();
        }
    },
    keyup: function(data) { },

    mousedown: function(data) { },
    mouseup: function(data) { },
    mousemove: function(data) { },

    gamepaddown: function(data) {
        if(data.button === "start") {
            this.app[funcName]();
        };
    },
    gamepadhold: function(data) { },
    gamepadup: function(data) { },
    gamepadmove: function(data) { },

    drawText: function(ctx){
        const fontSize = Math.min(this.app.height/20, this.app.width/40);
        const lineHeight = fontSize * 1.5;
        const totalHeight = lines.length * lineHeight;
        const center = this.app.width/2;

        lines.forEach((line, index) => {
            const top = this.app.height/2 - totalHeight/2 + index*lineHeight;

            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = 'white';
            ctx.font = `${fontSize}px 'Press Start 2P'`;
            ctx.fillText(line, center, top);
        });
    }
});

export default TextState;