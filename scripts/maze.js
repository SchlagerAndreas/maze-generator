class Maze{
    constructor(width,height){
        var that = this;
        this.mazeHeight = height;
        this.mazeWidth = width;
        this.pressedKeys = {};
        this.maze = [];
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

    setup(){
        for(let y = 0; y < this.mazeHeight; y++){
            let row = [];
            for(let x = 0; x < this.mazeWidth; x++){
                let cell = new Cell(x,y);
                row.push(cell);
            }
            this.maze.push(row);
        }
    }

    generateMaze(startNode){
        let mazeStack = [];
        mazeStack.unshift(this.maze[0][0])
        while(mazeStack.length > 0){
            let curCell = mazeStack[0];
            curCell.visited = true;
            let neighbours = this.getNeighbours(curCell);
            if(neighbours.length > 0){
                let tmp = Math.floor(Math.random() * neighbours.length);
                let nextCell = this.maze[neighbours[tmp].y][neighbours[tmp].x];
                curCell.setConnection(neighbours[tmp].direction);
                mazeStack.unshift(nextCell);
                nextCell.setConnection(neighbours[tmp].invDirection);
            }
            else{
                mazeStack.shift();
            }
        }
    }


    getNeighbours(cell){
        let ret = [];
        if(cell.x + 1 < this.mazeWidth && !this.maze[cell.y][cell.x + 1].visited){
            ret.push({x: cell.x + 1, y: cell.y, direction: "right", invDirection: "left"});
        }
        if(cell.x - 1 >= 0 && !this.maze[cell.y][cell.x - 1].visited){
            ret.push({x: cell.x - 1, y: cell.y, direction: "left", invDirection: "right"});
        }
        if(cell.y + 1 < this.mazeHeight && !this.maze[cell.y + 1][cell.x].visited){
            ret.push({x: cell.x, y: cell.y +1, direction: "down", invDirection: "up"});
        }
        if(cell.y - 1 >= 0 && !this.maze[cell.y - 1][cell.x].visited){
            ret.push({x: cell.x, y: cell.y - 1, direction: "up", invDirection: "down"});
        }
        return ret;
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

                if(this.maze[y][x].connections.up){
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

                if(this.maze[y][x].connections.left){
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

                tmp = new PIXI.Sprite(this.app.loader.resources["path"].texture);
                tmp.anchor.set(0);
                tmp.x = x * 30 + 10;
                tmp.y = y * 30 + 10;
                this.mazeContainer.addChild(tmp);

                if(this.maze[y][x].connections.right){
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

                if(this.maze[y][x].connections.down){
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

class Cell{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.visited = false;
        this.connections = {
            up: false,
            down: false,
            right: false,
            left: false
        }
    }

    setConnection(direction){
        if(direction == "up"){
            this.connections.up = true;
        }
        else if(direction == "down"){
            this.connections.down = true;
        }
        else if(direction == "right"){
            this.connections.right = true;
        }
        else if(direction == "left"){
            this.connections.left = true;
        }
    }
}