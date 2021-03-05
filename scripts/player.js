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
     */
    move(pressedKeys){
        var i = 0;
        let tile = this.getTileID();
        let upLeftTile = tile - this.map.widthTiles - 1;
        let downLeftTile = tile + this.map.widthTiles - 1;
        let leftTile = tile - 1;
        if(this.map.children[tile].isEnd){
            if(this.colFkt(this.map.children[tile],this)){
                console.log("FINISHED MAZE");
                return;
            }
        }
        //Moving Up
        if(pressedKeys["87"] ||pressedKeys["38"]){
            this.y -= this.speed;
            for(i = 0; i < 3; i++){
                if(this.map.children[upLeftTile+i].isSolid){
                    if(this.colFkt(this.map.children[upLeftTile+i],this)){
                        this.y = this.map.children[upLeftTile+i].y + 15;
                    }
                }
            }
            for(i = 0; i < 3; i++){
                if(this.map.children[downLeftTile+i].isSolid){
                    if(this.colFkt(this.map.children[downLeftTile+i],this)){
                        this.y = this.map.children[downLeftTile+i].y + 15;
                    }
                }
            }
            for(i = 0; i < 3; i++){
                if(this.map.children[leftTile+i].isSolid){
                    if(this.colFkt(this.map.children[leftTile+i],this)){
                        this.y = this.map.children[leftTile+i].y + 15;
                    }
                }
            }
        }
        //Moving Down
        if(pressedKeys["83"]||pressedKeys["40"]){
            this.y += this.speed;
            for(i = 0; i < 3; i++){
                if(this.map.children[upLeftTile+i].isSolid){
                    if(this.colFkt(this.map.children[upLeftTile+i],this)){
                        this.y = this.map.children[upLeftTile+i].y - 5;
                    }
                }
            }
            for(i = 0; i < 3; i++){
                if(this.map.children[downLeftTile+i].isSolid){
                    if(this.colFkt(this.map.children[downLeftTile+i],this)){
                        this.y = this.map.children[downLeftTile+i].y - 5;
                    }
                }
            }
            for(i = 0; i < 3; i++){
                if(this.map.children[leftTile+i].isSolid){
                    if(this.colFkt(this.map.children[leftTile+i],this)){
                        this.y = this.map.children[leftTile+i].y - 5;
                    }
                }
            }
        }
        //Moving Right
        if(pressedKeys["68"]||pressedKeys["39"]){
            this.x += this.speed;
            for(i = 0; i < 3; i++){
                if(this.map.children[upLeftTile+i].isSolid){
                    if(this.colFkt(this.map.children[upLeftTile+i],this)){
                        this.x = this.map.children[upLeftTile+i].x - 5;
                    }
                }
            }
            for(i = 0; i < 3; i++){
                if(this.map.children[downLeftTile+i].isSolid){
                    if(this.colFkt(this.map.children[downLeftTile+i],this)){
                        this.x = this.map.children[downLeftTile+i].x - 5;
                    }
                }
            }
            for(i = 0; i < 3; i++){
                if(this.map.children[leftTile+i].isSolid){
                    if(this.colFkt(this.map.children[leftTile+i],this)){
                        this.x = this.map.children[leftTile+i].x - 5;
                    }
                }
            }
        }
        //Moving Left
        if(pressedKeys["65"]||pressedKeys["37"]){
            this.x -= this.speed;
            for(i = 0; i < 3; i++){
                if(this.map.children[upLeftTile+i].isSolid){
                    if(this.colFkt(this.map.children[upLeftTile+i],this)){
                        this.x = this.map.children[upLeftTile+i].x + 15;
                    }
                }
            }
            for(i = 0; i < 3; i++){
                if(this.map.children[downLeftTile+i].isSolid){
                    if(this.colFkt(this.map.children[downLeftTile+i],this)){
                        this.x = this.map.children[downLeftTile+i].x + 15;
                    }
                }
            }
            for(i = 0; i < 3; i++){
                if(this.map.children[leftTile+i].isSolid){
                    if(this.colFkt(this.map.children[leftTile+i],this)){
                        this.x = this.map.children[leftTile+i].x + 15;
                    }
                }
            }
        }
    }

    getTileID(){
        let tileX = Math.floor(this.x / 10);
        let tileY = Math.floor(this.y / 10);
        tileY = tileY == this.map.widthTiles ? this.map.widthTiles -1 : tileY;
        tileX = tileX == this.map.widthTiles ? this.map.widthTiles -1 : tileX;
        let tileIndex = tileY * this.map.widthTiles + tileX;
        return tileIndex;
    }
}