class Player extends PIXI.Sprite{
    constructor(posX,posY,texture,collisionFkt){
        super(texture)
        this.anchor.set(0.5)
        this.x = posX;
        this.y = posY;
        this.zIndex = 4;
        this.speed = 5;
        this.colFkt = collisionFkt;
        this.hitBox = "rectangular";
    }

    /**
     * Moves the player an checks if it hits a wall
     * @param {Object} pressedKeys The keys which are pressed
     * @param {PIXI.Container} map The map
     */
    move(pressedKeys,map){
        var i = 0;
        //Moving Up
        if(pressedKeys["87"] ||pressedKeys["38"]){
            this.y -= this.speed;
            for(i = 0; i < map.children.length; i++){
                if(map.children[i].isSolid){
                    if(this.colFkt(map.children[i],this)){
                        this.y = map.children[i].y + 15;
                    }
                }
            }
        }
        //Moving Down
        if(pressedKeys["83"]||pressedKeys["40"]){
            this.y += this.speed;
            for(i = 0; i < map.children.length; i++){
                if(map.children[i].isSolid){
                    if(this.colFkt(map.children[i],this)){
                        this.y = map.children[i].y - 5;
                    }
                }
            }
        }
        //Moving Right
        if(pressedKeys["68"]||pressedKeys["39"]){
            this.x += this.speed;
            for(i = 0; i < map.children.length; i++){
                if(map.children[i].isSolid){
                    if(this.colFkt(map.children[i],this)){
                        this.x = map.children[i].x - 5;
                    }
                }
            }
        }
        //Moving Left
        if(pressedKeys["65"]||pressedKeys["37"]){
            this.x -= this.speed;
            for(i = 0; i < map.children.length; i++){
                if(map.children[i].isSolid){
                    if(this.colFkt(map.children[i],this)){
                        this.x = map.children[i].x + 15;
                    }
                }
            }
        }
        for(i = 0; i < map.children.length; i++){
            if(map.children[i].isEnd){
                if(this.colFkt(map.children[i],this)){
                    console.log("FINISHED MAZE");
                }
            }
        }
    }
}