class Player extends PIXI.Sprite{
    constructor(posX,posY,texture,map,collisionFkt){
        super(texture)
        this.anchor.set(0.5)
        this.x = posX;
        this.y = posY;
        this.zIndex = 4;
        this.speed = 5;
        this.map = map;
        this.colFkt = collisionFkt;
        this.hitBox = "rectangular";
    }

    /**
     * Moves the player an checks if it hits a wall
     * @param {Object} pressedKeys The keys which are pressed
     * @param {PIXI.Container} this.map The this.map
     */
    move(pressedKeys){
        var i = 0;
        let tile = this.getTileID();
        //Moving Up
        if(pressedKeys["87"] ||pressedKeys["38"]){
            this.y -= this.speed;
            let upTileID = tile - this.map.widthTiles*3 < 0 ? 0 : tile - this.map.widthTiles*3;
            if(this.map.children[upTileID].isSolid){
                if(this.colFkt(this.map.children[upTileID],this)){
                    this.y = this.map.children[upTileID].y + 15;
                }
            }
            if(this.map.children[upTileID].isEnd){
                if(this.colFkt(this.map.children[upTileID],this)){
                    console.log("FINISHED MAZE");
                }
            }
        }
        //Moving Down
        if(pressedKeys["83"]||pressedKeys["40"]){
            this.y += this.speed;
            if(this.map.children[tile + (this.map.widthTiles*3)].isSolid){
                if(this.colFkt(this.map.children[tile + (this.map.widthTiles*3)],this)){
                    this.y = this.map.children[tile + (this.map.widthTiles*3)].y + 15;
                }
            }
            if(this.map.children[tile + this.map.widthTiles].isEnd){
                if(this.colFkt(this.map.children[tile + (this.map.widthTiles*3)],this)){
                    console.log("FINISHED MAZE");
                }
            }
        }
        //Moving Right
        if(pressedKeys["68"]||pressedKeys["39"]){
            this.x += this.speed;
            for(i = 0; i < this.map.children.length; i++){
                if(this.map.children[i].isSolid){
                    if(this.colFkt(this.map.children[i],this)){
                        this.x = this.map.children[i].x - 5;
                    }
                }
                if(this.map.children[i].isEnd){
                    if(this.colFkt(this.map.children[i],this)){
                        console.log("FINISHED MAZE");
                    }
                }
            }
        }
        //Moving Left
        if(pressedKeys["65"]||pressedKeys["37"]){
            this.x -= this.speed;
            for(i = 0; i < this.map.children.length; i++){
                if(this.map.children[i].isSolid){
                    if(this.colFkt(this.map.children[i],this)){
                        this.x = this.map.children[i].x + 15;
                    }
                }
                if(this.map.children[i].isEnd){
                    if(this.colFkt(this.map.children[i],this)){
                        console.log("FINISHED MAZE");
                    }
                }
            }
        }
    }
    getTileID(){
        let tileX = Math.floor(this.x / 10);
        let tileY = Math.floor(this.y / 10);
        tileY = tileY == this.map.widthTiles ? this.map.widthTiles -1  : tileY;
        tileX = tileX == this.map.widthTiles ? this.map.widthTiles -1 : tileX;
        let tileIndex = tileY * this.map.widthTiles + tileX;
        return tileIndex;
    }
}