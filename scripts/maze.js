class Maze{
    constructor(){
        var that = this;
        this.mazeHeight = 25;
        this.mazeWidth = 40;
        this.generator = new MazeGenerator(this.mazeWidth,this.mazeHeight);
        this.generator.setup();
        this.generator.generateMaze();
        this.renderMaze();

        this.pressedKeys = {};

        this.player;
        this.mazeContainer = new PIXI.Container();
        this.app;

        this.tickerFun = ()=>{this.gameLoop()};


        this.templELKeyDown = function(e){that.keysDown(e)};
        this.templELKeyUp = function(e){that.keysUp(e)};
        window.addEventListener("keydown", that.templELKeyDown);
        window.addEventListener("keyup", that.templELKeyUp);
    }

    keysDown(e){
        this.pressedKeys[e.keyCode] = true;
    }
    
    keysUp(e){
        this.pressedKeys[e.keyCode] = false;
    }

    renderMaze(){
        var that = this;
        this.app = new PIXI.Application(
            {
                width: 1200,
                height: 750,
                transparent: true,
            }
        );
        document.querySelector("#mazeDiv").appendChild(this.app.view);


        this.app.loader.baseUrl = "graphics";
        this.app.loader.add("path","white-tile.png")
                       .add("player","player.png")
                       .add("end","red-tile.png")
                       .add("wall","black-tile.png");
        this.app.loader.onComplete.add(function(){that.drawMaze()})
        this.app.loader.load();
    }

    drawMaze(){
        for(var y = 0; y < this.mazeHeight; y++){
            for(var x = 0; x < this.mazeWidth; x++){
                
                let tmp = new PIXI.Sprite(this.app.loader.resources["wall"].texture);
                tmp.anchor.set(0);
                tmp.isSolid = true;
                tmp.x = x * 30;
                tmp.y = y * 30; 
                this.mazeContainer.addChild(tmp);

                if(this.generator.maze[y][x].connections.up){
                    tmp = new PIXI.Sprite(this.app.loader.resources["path"].texture);
                }
                else{
                    tmp = new PIXI.Sprite(this.app.loader.resources["wall"].texture);
                    tmp.isSolid = true;
                }
                tmp.anchor.set(0);
                tmp.x = x * 30 + 10;
                tmp.y = y * 30;
                this.mazeContainer.addChild(tmp);

                tmp = new PIXI.Sprite(this.app.loader.resources["wall"].texture);
                tmp.anchor.set(0);
                tmp.isSolid = true;
                tmp.x = x * 30 + 20;
                tmp.y = y * 30;
                this.mazeContainer.addChild(tmp);

                if(this.generator.maze[y][x].connections.left){
                    tmp = new PIXI.Sprite(this.app.loader.resources["path"].texture);
                }
                else{
                    tmp = new PIXI.Sprite(this.app.loader.resources["wall"].texture);
                    tmp.isSolid = true;
                }
                tmp.anchor.set(0);
                tmp.x = x * 30;
                tmp.y = y * 30 + 10;
                this.mazeContainer.addChild(tmp);

                
                if(x == this.mazeWidth -1 && y == this.mazeHeight -1){
                    tmp = new PIXI.Sprite(this.app.loader.resources["end"].texture);
                    tmp.isEnd = true;
                }
                else{
                    tmp = new PIXI.Sprite(this.app.loader.resources["path"].texture);
                }
                tmp.anchor.set(0);
                tmp.x = x * 30 + 10;
                tmp.y = y * 30 + 10;
                this.mazeContainer.addChild(tmp);

                if(this.generator.maze[y][x].connections.right){
                    tmp = new PIXI.Sprite(this.app.loader.resources["path"].texture);
                }
                else{
                    tmp = new PIXI.Sprite(this.app.loader.resources["wall"].texture);
                    tmp.isSolid = true;
                }
                tmp.anchor.set(0);
                tmp.x = x * 30 + 20;
                tmp.y = y * 30 + 10;
                this.mazeContainer.addChild(tmp);

                tmp = new PIXI.Sprite(this.app.loader.resources["wall"].texture);
                tmp.anchor.set(0);
                tmp.isSolid = true;
                tmp.x = x * 30;
                tmp.y = y * 30 + 20;
                this.mazeContainer.addChild(tmp);

                if(this.generator.maze[y][x].connections.down){
                    tmp = new PIXI.Sprite(this.app.loader.resources["path"].texture);
                }
                else{
                    tmp = new PIXI.Sprite(this.app.loader.resources["wall"].texture);
                    tmp.isSolid = true;
                }
                tmp.anchor.set(0);
                tmp.x = x * 30 + 10;
                tmp.y = y * 30 + 20;
                this.mazeContainer.addChild(tmp);

                tmp = new PIXI.Sprite(this.app.loader.resources["wall"].texture);
                tmp.anchor.set(0);
                tmp.isSolid = true;
                tmp.x = x * 30 + 20;
                tmp.y = y * 30 + 20;
                this.mazeContainer.addChild(tmp);
            }
        }
        this.app.stage.addChild(this.mazeContainer);
        this.player = new Player(15,15,this.app.loader.resources["player"].texture,(object1,object2) => {return this.isColiding(object1,object2);})
        this.app.stage.addChild(this.player);

        this.app.ticker.add(this.tickerFun);
    }

    isColiding(object1,object2){
        if(object1 != undefined && object2 != undefined){
            var rec1 = object1.getBounds();
            var rec2 = object2.getBounds();
            return rec1.contains(rec2.x,rec2.y) ||
                   rec1.contains(rec2.x + rec2.width,rec2.y) ||
                   rec1.contains(rec2.x,rec2.y+rec2.height) ||
                   rec1.contains(rec2.x + rec2.width, rec2.y + rec2.height);
        }
        else{
            return false;
        }
    }
    
    gameLoop(){
        this.player.move(this.pressedKeys,this.mazeContainer)
    }
}