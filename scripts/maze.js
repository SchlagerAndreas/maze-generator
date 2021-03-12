class Maze{
    constructor(){
        var that = this;
        this.mazeHeight = 25;
        this.mazeWidth = 40;
        this.mazeTheme = "BlackWhite";
        this.mazeGenerationMethod = "RecursiveDFS";
        this.generator;

        this.themes = ["BlackWhite","Hedge Maze","Lava Lake"];
        this.methods = ["RecursiveDFS","Prims Algorithm","Wilsons Algorithm"];

        //Screens
        this.startScreen = new PIXI.Container();
        this.pauseScreen = new PIXI.Container();
        this.finishScreen = new PIXI.Container();

        this.pressedKeys = {};

        this.player;
        this.mazeContainer = new PIXI.Container();
        this.app = new PIXI.Application(
            {
                width: 1200,
                height: 750,
                transparent: true,
            }
        );
        document.querySelector("#mazeDiv").appendChild(this.app.view);

        this.tickerFun = ()=>{this.updateLoop()};


        this.templELKeyDown = function(e){that.keysDown(e)};
        this.templELKeyUp = function(e){that.keysUp(e)};
        window.addEventListener("keydown", that.templELKeyDown);
        window.addEventListener("keyup", that.templELKeyUp);

        
        this.loadGraphics();
    }

    keysDown(e){
        this.pressedKeys[e.keyCode] = true;
    }
    
    keysUp(e){
        this.pressedKeys[e.keyCode] = false;
    }

    loadGraphics(){
        var that = this;
        this.app.loader.baseUrl = "graphics";
        this.app.loader.add("path","white-tile.png")
                       .add("player","player.png")
                       .add("end","red-tile.png")
                       .add("greenTile","green-tile.png")
                       .add("plBtn","plus-button.png")
                       .add("minBtn","minus-button.png")
                       .add("genBtn","generate-button.png")
                       .add("select","select.png")
                       .add("shade","shade.png")
                       .add("bush","bush.png")
                       .add("dirtpath","path.png")
                       .add("exitBtn","exit-button.png")
                       .add("retBtn","return-button.png")
                       .add("lava","lava.png")
                       .add("basalt","basalt.png")
                       .add("hedgeTheme","hedgemaze-theme.png")
                       .add("endFlag","endFlag.png")
                       .add("wall","black-tile.png");
        this.app.loader.onComplete.add(function(){that.createScreens()})
        this.app.loader.load();
    }

    createScreens(){
        let textstyle = {fontFamily : 'Arial', fontSize: 100, fill : 0x0a0a0a, align : 'center'}
        //Start Screen
        {
            let background = new PIXI.Graphics();
            background.beginFill(0xababab);
            background.drawRect(0, 0, 600, 600);
            background.endFill();     
            this.startScreen.addChild(background);

            let text = new PIXI.Text('Generate Maze',textstyle)
            text.anchor.set(0);
            text.width = 200;
            text.height = 50;
            text.x = 200;
            text.y = 25;
            this.startScreen.addChild(text);

            text = new PIXI.Text('Set Size',textstyle)
            text.anchor.set(0);
            text.width = 50;
            text.height = 25;
            text.x = 120;
            text.y = 150;
            this.startScreen.addChild(text);

            text = new PIXI.Text('Width',textstyle)
            text.anchor.set(0);
            text.width = 50;
            text.height = 25;
            text.x = 25;
            text.y = 200;
            this.startScreen.addChild(text);

            text = new PIXI.Text('Height',textstyle)
            text.anchor.set(0);
            text.width = 50;
            text.height = 25;
            text.x = 25;
            text.y = 250;
            this.startScreen.addChild(text);

            let button = new PIXI.Sprite(this.app.loader.resources.minBtn.texture);
            button.x = 85;
            button.y = 200;
            button.interactive = true;
            button.buttonMode = true;
            button.on("pointerup",()=>{this.mazeWidth = this.mazeWidth - 1 == 0 ? 40 : this.mazeWidth - 1;
                                       this.startScreen.children[9].width = this.mazeWidth < 10 ? 25 : 50;
                                       this.startScreen.children[9].x = this.mazeWidth < 10 ? 145 : 120;
                                       this.startScreen.children[9].text = this.mazeWidth;})
            this.startScreen.addChild(button);

            button = new PIXI.Sprite(this.app.loader.resources.plBtn.texture);
            button.x = 180;
            button.y = 200;
            button.interactive = true;
            button.buttonMode = true;
            button.on("pointerup",()=>{this.mazeWidth = this.mazeWidth + 1 == 41 ? 1 : this.mazeWidth + 1;
                                       this.startScreen.children[9].width = this.mazeWidth < 10 ? 25 : 50;
                                       this.startScreen.children[9].x = this.mazeWidth < 10 ? 145 : 120;
                                       this.startScreen.children[9].text = this.mazeWidth;})
            this.startScreen.addChild(button);

            button = new PIXI.Sprite(this.app.loader.resources.minBtn.texture);
            button.x = 85;
            button.y = 250;
            button.interactive = true;
            button.buttonMode = true;
            button.on("pointerup",()=>{this.mazeHeight = this.mazeHeight - 1 == 0 ? 25 : this.mazeHeight - 1;
                                       this.startScreen.children[10].width = this.mazeHeight < 10 ? 25 : 50;
                                       this.startScreen.children[10].x = this.mazeHeight < 10 ? 145 : 120;
                                       this.startScreen.children[10].text = this.mazeHeight;})
            this.startScreen.addChild(button);

            button = new PIXI.Sprite(this.app.loader.resources.plBtn.texture);
            button.x = 180;
            button.y = 250;
            button.interactive = true;
            button.buttonMode = true;
            button.on("pointerup",()=>{this.mazeHeight = this.mazeHeight + 1 == 26 ? 1 : this.mazeHeight + 1;
                                       this.startScreen.children[10].width = this.mazeHeight < 10 ? 25 : 50;
                                       this.startScreen.children[10].x = this.mazeHeight < 10 ? 145 : 120;
                                       this.startScreen.children[10].text = this.mazeHeight;})
            this.startScreen.addChild(button);

            text = new PIXI.Text('40',textstyle)
            text.anchor.set(0);
            text.width = 50;
            text.height = 25;
            text.x = 120;
            text.y = 200;
            this.startScreen.addChild(text);

              text = new PIXI.Text('25',textstyle)
            text.anchor.set(0);
            text.width = 50;
            text.height = 25;
            text.x = 120;
            text.y = 250;
            this.startScreen.addChild(text);

            //Theme Select
            {
                
                let select = new Select("Themes",this.themes,this.app.loader.resources.select.texture,this.app.loader.resources.shade.texture,textstyle,(id)=>{this.mazeTheme = this.themes[id]})
                select.x = 300;
                select.y = 225;
                this.startScreen.addChild(select);
            }
            
            let select = new Select("Method",this.methods,this.app.loader.resources.select.texture,this.app.loader.resources.shade.texture,textstyle,(id)=>{this.mazeGenerationMethod = this.methods[id]})
            select.x = 450;
            select.y = 225;
            this.startScreen.addChild(select);

            button = new PIXI.Sprite(this.app.loader.resources.genBtn.texture);
            button.x = 250;
            button.y = 500;
            button.interactive = true;
            button.buttonMode = true;
            button.on("pointerup",()=>{this.startScreen.visible = false;
                                       this.generator = new MazeGenerator(this.mazeWidth,this.mazeHeight,this.mazeGenerationMethod);
                                       this.generator.setup();
                                       this.generator.generateMaze();
                                       this.drawMaze();})
            this.startScreen.addChild(button);


            this.startScreen.width = 600;
            this.startScreen.height = 600;
            this.startScreen.x = 300;
            this.startScreen.y = 75;
            this.app.stage.addChild(this.startScreen);
        }
        //Pause Screen
        {
            let background = new PIXI.Graphics();
            background.beginFill(0xababab);
            background.drawRect(0, 0, 600, 600);
            background.endFill();     
            this.pauseScreen.addChild(background);

            let text = new PIXI.Text('Pause',textstyle)
            text.anchor.set(0);
            text.width = 200;
            text.height = 50;
            text.x = 200;
            text.y = 25;
            this.pauseScreen.addChild(text);

            let button = new PIXI.Sprite(this.app.loader.resources.retBtn.texture);
            button.anchor.set(0);
            button.x = 250;
            button.y = 250;
            button.interactive = true;
            button.buttonMode = true;
            button.on("pointerup",()=>{this.app.ticker.add(this.tickerFun);
                                       this.pauseScreen.visible = false;
                                       this.mazeContainer.visible = true;
                                       this.player.visible = true;})
            this.pauseScreen.addChild(button);

            button = new PIXI.Sprite(this.app.loader.resources.exitBtn.texture);
            button.anchor.set(0);
            button.x = 250;
            button.y = 350;
            button.interactive = true;
            button.buttonMode = true;
            button.on("pointerup",()=>{this.resetMazeValues()
                                       this.pauseScreen.visible = false;
                                       this.startScreen.visible = true;})
            this.pauseScreen.addChild(button);
            this.pauseScreen.width = 600;
            this.pauseScreen.height = 600;
            this.pauseScreen.x = 300;
            this.pauseScreen.y = 75;
            this.pauseScreen.visible = false;
            this.app.stage.addChild(this.pauseScreen)

        }
        //Finish Screen
        {
            let background = new PIXI.Graphics();
            background.beginFill(0xababab);
            background.drawRect(0, 0, 600, 600);
            background.endFill();     
            this.finishScreen.addChild(background);

            let text = new PIXI.Text('Maze finished',textstyle)
            text.anchor.set(0);
            text.width = 200;
            text.height = 50;
            text.x = 200;
            text.y = 100;
            this.finishScreen.addChild(text);

            let button = new PIXI.Sprite(this.app.loader.resources.exitBtn.texture);
            button.anchor.set(0);
            button.x = 250;
            button.y = 450;
            button.interactive = true;
            button.buttonMode = true;
            button.on("pointerup",()=>{this.resetMazeValues()
                                       this.finishScreen.visible = false;
                                       this.startScreen.visible = true;})
            this.finishScreen.addChild(button);
            this.finishScreen.width = 600;
            this.finishScreen.height = 600;
            this.finishScreen.x = 300;
            this.finishScreen.y = 75;
            this.finishScreen.visible = false;
            this.app.stage.addChild(this.finishScreen)
        }
    }

    drawMaze(){ 
        let wallTexture = [];
        let pathTexture = [];
        switch(this.mazeTheme){
            case "Hedge Maze" : 
                for(let i = 0; i < 2; i++){
                    wallTexture[i] = new PIXI.Texture(this.app.loader.resources.hedgeTheme.texture,new PIXI.Rectangle(i*10,10,10,10))
                    pathTexture[i] = new PIXI.Texture(this.app.loader.resources.hedgeTheme.texture,new PIXI.Rectangle(i*10,0,10,10))
                }
                break;
            case "Lava Lake" : wallTexture = this.app.loader.resources.lava.texture; pathTexture = this.app.loader.resources.basalt.texture; break;
            default : wallTexture = this.app.loader.resources.wall.texture; pathTexture = this.app.loader.resources.path.texture; break;
        }
        let textureSheet = this.createTileTextures(wallTexture,pathTexture)
        this.mazeContainer.sortableChildren = true;
        for(var y = 0; y < this.mazeHeight; y++){
            for(var x = 0; x < this.mazeWidth; x++){
                let tmp = new Tile(textureSheet,this.app.loader.resources.endFlag.texture,this.generator.maze[y][x],0);
                tmp.zIndex = 3*x + 3*y * this.mazeWidth * 3;
                this.mazeContainer.addChild(tmp);
                
                tmp = new Tile(textureSheet,this.app.loader.resources.endFlag.texture,this.generator.maze[y][x],1);
                tmp.zIndex = (3*x+1) + 3*y * this.mazeWidth * 3;
                this.mazeContainer.addChild(tmp);

                tmp = new Tile(textureSheet,this.app.loader.resources.endFlag.texture,this.generator.maze[y][x],2);
                tmp.zIndex = (3*x+2) + 3*y * this.mazeWidth * 3;
                this.mazeContainer.addChild(tmp);

                tmp = new Tile(textureSheet,this.app.loader.resources.endFlag.texture,this.generator.maze[y][x],3);
                tmp.zIndex = 3*x + (3*y+1) * this.mazeWidth * 3;
                this.mazeContainer.addChild(tmp);

                if(x == this.mazeWidth - 1 && y == this.mazeHeight - 1){
                    tmp = new Tile(textureSheet,this.app.loader.resources.endFlag.texture,this.generator.maze[y][x],4,true);
                }
                else{
                    tmp = new Tile(textureSheet,this.app.loader.resources.endFlag.texture,this.generator.maze[y][x],4);
                }
                tmp.zIndex = (3*x+1) + (3*y+1) * this.mazeWidth * 3;
                this.mazeContainer.addChild(tmp);

                tmp = new Tile(textureSheet,this.app.loader.resources.endFlag.texture,this.generator.maze[y][x],5);
                tmp.zIndex = (3*x+2) + (3*y+1) * this.mazeWidth * 3;
                this.mazeContainer.addChild(tmp);

                tmp = new Tile(textureSheet,this.app.loader.resources.endFlag.texture,this.generator.maze[y][x],6);
                tmp.zIndex = 3*x + (3*y+2) * this.mazeWidth * 3;
                this.mazeContainer.addChild(tmp);

                tmp = new Tile(textureSheet,this.app.loader.resources.endFlag.texture,this.generator.maze[y][x],7);
                tmp.zIndex = (3*x+1) + (3*y+2) * this.mazeWidth * 3;
                this.mazeContainer.addChild(tmp);

                tmp = new Tile(textureSheet,this.app.loader.resources.endFlag.texture,this.generator.maze[y][x],8);
                tmp.zIndex = (3*x+2) + (3*y+2) * this.mazeWidth * 3;
                this.mazeContainer.addChild(tmp);
            }
        }
        this.mazeContainer.widthTiles = this.mazeWidth * 3;
        this.mazeContainer.heightTiles = this.mazeHeight * 3;
        this.mazeContainer.visible = true;
        this.mazeContainer.sortChildren();
        this.app.stage.addChild(this.mazeContainer);

        this.player = new Player(15,15,this.app.loader.resources["player"].texture,this.mazeContainer,(object1,object2) => {return this.isColiding(object1,object2);})
        this.app.stage.addChild(this.player);

        this.app.ticker.add(this.tickerFun);
    }

    createTileTextures(wallTextures,pathTextures){
        let textureSheet = {};
        let tmp;
        let baseSpr;
        let edgeSpr;
        //Wall Textures
        {
            baseSpr = new PIXI.Sprite(wallTextures[0]);
            baseSpr.anchor.set(0)
            baseSpr.x = 0;
            baseSpr.y = 0;
            //Central
            {
                tmp = new PIXI.Container();
                tmp.x = 0;
                tmp.y = 0;
                tmp.addChild(baseSpr);
                textureSheet.wallCenter = this.app.renderer.generateTexture(tmp);
            }
            //Edge
            {
                tmp = new PIXI.Container();
                tmp.x = 0;
                tmp.y = 0;
                tmp.addChild(baseSpr);

                edgeSpr = new PIXI.Sprite(wallTextures[1]);
                edgeSpr.anchor.set(0);
                edgeSpr.pivot.set(5,5);
                edgeSpr.rotation = 1/2 * Math.PI;
                edgeSpr.x = 5;
                edgeSpr.y = 5;
                tmp.addChild(edgeSpr);
                textureSheet.wallEdge = this.app.renderer.generateTexture(tmp);
            }
            //Corner
            {
                tmp = new PIXI.Container();
                tmp.x = 0;
                tmp.y = 0;
                tmp.addChild(baseSpr);

                edgeSpr = new PIXI.Sprite(wallTextures[1]);
                edgeSpr.anchor.set(0);
                edgeSpr.pivot.set(5,5);
                edgeSpr.rotation = 1/2 * Math.PI;
                edgeSpr.x = 5;
                edgeSpr.y = 5;
                tmp.addChild(edgeSpr);

                edgeSpr = new PIXI.Sprite(wallTextures[1]);
                edgeSpr.anchor.set(0);
                edgeSpr.pivot.set(5,5);
                edgeSpr.rotation = Math.PI;
                edgeSpr.x = 5;
                edgeSpr.y = 5;
                tmp.addChild(edgeSpr);
                textureSheet.wallCorner = this.app.renderer.generateTexture(tmp);
            }
        }
        
        //Path Textures
        {
            baseSpr = new PIXI.Sprite(pathTextures[0]);
            baseSpr.anchor.set(0)
            baseSpr.x = 0;
            baseSpr.y = 0;
            //Central
            {
                tmp = new PIXI.Container();
                tmp.x = 0;
                tmp.y = 0;
                tmp.addChild(baseSpr);
                textureSheet.pathCenter = this.app.renderer.generateTexture(tmp);
            }
            //Edge
            {
                tmp = new PIXI.Container();
                tmp.x = 0;
                tmp.y = 0;
                tmp.addChild(baseSpr);

                edgeSpr = new PIXI.Sprite(pathTextures[1]);
                edgeSpr.anchor.set(0);
                edgeSpr.pivot.set(5,5);
                edgeSpr.rotation = 1/2 * Math.PI;
                edgeSpr.x = 5;
                edgeSpr.y = 5;
                tmp.addChild(edgeSpr);
                textureSheet.pathEdge = this.app.renderer.generateTexture(tmp);
            }
            //Corner
            {
                tmp = new PIXI.Container();
                tmp.x = 0;
                tmp.y = 0;
                tmp.addChild(baseSpr);

                edgeSpr = new PIXI.Sprite(pathTextures[1]);
                edgeSpr.anchor.set(0);
                edgeSpr.pivot.set(5,5);
                edgeSpr.rotation = 3/2 * Math.PI;
                edgeSpr.x = 5;
                edgeSpr.y = 5;
                tmp.addChild(edgeSpr);

                edgeSpr = new PIXI.Sprite(pathTextures[1]);
                edgeSpr.anchor.set(0);
                edgeSpr.pivot.set(5,5);
                edgeSpr.rotation = 0;
                edgeSpr.x = 5;
                edgeSpr.y = 5;
                tmp.addChild(edgeSpr);
                textureSheet.pathCorner = this.app.renderer.generateTexture(tmp);
            }
            //Passage
            {
                tmp = new PIXI.Container();
                tmp.x = 0;
                tmp.y = 0;
                tmp.addChild(baseSpr);

                edgeSpr = new PIXI.Sprite(pathTextures[1]);
                edgeSpr.anchor.set(0);
                edgeSpr.pivot.set(5,5);
                edgeSpr.rotation = 0;
                edgeSpr.x = 5;
                edgeSpr.y = 5;
                tmp.addChild(edgeSpr);

                edgeSpr = new PIXI.Sprite(pathTextures[1]);
                edgeSpr.anchor.set(0);
                edgeSpr.pivot.set(5,5);
                edgeSpr.rotation =Math.PI;
                edgeSpr.x = 5;
                edgeSpr.y = 5;
                tmp.addChild(edgeSpr);
                textureSheet.pathPassage = this.app.renderer.generateTexture(tmp);
            }
            //DeadEnd
            {
                tmp = new PIXI.Container();
                tmp.x = 0;
                tmp.y = 0;
                tmp.addChild(baseSpr);

                edgeSpr = new PIXI.Sprite(pathTextures[1]);
                edgeSpr.anchor.set(0);
                edgeSpr.pivot.set(5,5);
                edgeSpr.rotation = 1/2 * Math.PI;
                edgeSpr.x = 5;
                edgeSpr.y = 5;
                tmp.addChild(edgeSpr);

                edgeSpr = new PIXI.Sprite(pathTextures[1]);
                edgeSpr.anchor.set(0);
                edgeSpr.pivot.set(5,5);
                edgeSpr.rotation = Math.PI;
                edgeSpr.x = 5;
                edgeSpr.y = 5;
                tmp.addChild(edgeSpr);

                edgeSpr = new PIXI.Sprite(pathTextures[1]);
                edgeSpr.anchor.set(0);
                edgeSpr.pivot.set(5,5);
                edgeSpr.rotation = 3/2 * Math.PI;
                edgeSpr.x = 5;
                edgeSpr.y = 5;
                tmp.addChild(edgeSpr);
                textureSheet.pathDeadEnd = this.app.renderer.generateTexture(tmp);
            }

        }
        return textureSheet;

    }

    resetMazeValues(){
        for(let i = 0; i < this.mazeContainer.children.length; i++){
            this.mazeContainer.children[i].destroy();
        }
        this.mazeContainer = new PIXI.Container();
        for(var key in this.pressedKeys) {
            this.pressedKeys[key] = false;
        }
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
    
    pauseUpdateLoop(reason){
        this.app.ticker.remove(this.tickerFun);
        if(reason == "pause"){
            this.mazeContainer.visible = false;
            this.player.visible = false;
            this.pauseScreen.visible = true;
        }
        else if(reason == "finished"){
            this.mazeContainer.visible = false;
            this.player.visible = false;
            this.finishScreen.visible = true;
        }
    }

    updateLoop(){
        if(this.player.move(this.pressedKeys)){
            this.pauseUpdateLoop("finished");
        }
        if(this.pressedKeys["27"]){
            this.pauseUpdateLoop("pause");  
        }
        document.getElementById("FPS").innerHTML = "FPS: " + Math.round(this.app.ticker.FPS);
    }  
}

class Tile extends PIXI.Container{
    constructor(textureSheet,endFlag,cell,tileID,isEnd = false){
        super();        
        this.x = cell.x * 30 + 10 * (tileID % 3);
        this.y = cell.y * 30 + 10 * Math.floor(tileID / 3);
        this.textures = textureSheet;
        this.endFlag = endFlag;
        this.id = tileID;
        this.isEnd = isEnd;
        this.createTile(cell);
    }

    createTile(cell){
        let tmp;
        switch(this.id){
            case 0:
                {
                    this.isSolid = true;
                    if(cell.connections.up){
                        if(cell.connections.left){
                            tmp = new PIXI.Sprite(this.textures.wallCorner);
                            tmp.anchor.set(0)
                            tmp.x = 0;
                            tmp.y = 0;
                            this.addChild(tmp)
                        }
                        else{
                            tmp = new PIXI.Sprite(this.textures.wallEdge);
                            tmp.anchor.set(0)
                            tmp.x = 0;
                            tmp.y = 0;
                            this.addChild(tmp)
                        }
                    }
                    else if(cell.connections.left){
                        tmp = new PIXI.Sprite(this.textures.wallEdge);
                        tmp.anchor.set(0)
                        tmp.pivot.set(5,5);
                        tmp.rotation = 1/2 * Math.PI;
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    else{
                        tmp = new PIXI.Sprite(this.textures.wallCenter);
                        tmp.anchor.set(0)
                        tmp.x = 0;
                        tmp.y = 0;
                        this.addChild(tmp)
                    }
                    break;
                }
            case 1:
                {
                    if(cell.connections.up){
                        this.isSolid = false;
                        tmp = new PIXI.Sprite(this.textures.pathPassage);
                        tmp.anchor.set(0);
                        tmp.pivot.set(5,5);
                        tmp.rotation = 1/2 * Math.PI;
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp);
                    }
                    else{
                        this.isSolid = true;
                        tmp = new PIXI.Sprite(this.textures.wallEdge);
                        tmp.anchor.set(0);
                        tmp.pivot.set(5,5);
                        tmp.rotation = 1/2 * Math.PI;
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp);
                    }
                    break;
                }
            case 2:
                {
                    this.isSolid = true;
                    if(cell.connections.up){
                        if(cell.connections.right){
                            tmp = new PIXI.Sprite(this.textures.wallCorner);
                            tmp.anchor.set(0)
                            tmp.pivot.set(5,5);
                            tmp.rotation = 1/2 * Math.PI;
                            tmp.x = 5;
                            tmp.y = 5;
                            this.addChild(tmp)
                        }
                        else{
                            tmp = new PIXI.Sprite(this.textures.wallEdge);
                            tmp.anchor.set(0)
                            tmp.pivot.set(5,5);
                            tmp.rotation = Math.PI;
                            tmp.x = 5;
                            tmp.y = 5;
                            this.addChild(tmp)
                        }
                    }
                    else if(cell.connections.right){
                        tmp = new PIXI.Sprite(this.textures.wallEdge);
                        tmp.anchor.set(0)
                        tmp.pivot.set(5,5);
                        tmp.rotation = 1/2 * Math.PI;
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    else{
                        tmp = new PIXI.Sprite(this.textures.wallCenter);
                        tmp.anchor.set(0)
                        tmp.x = 0;
                        tmp.y = 0;
                        this.addChild(tmp)
                    }
                    break;
                }
            case 3:
                {
                    if(cell.connections.left){
                        this.isSolid = false;
                        tmp = new PIXI.Sprite(this.textures.pathPassage);
                        tmp.anchor.set(0);
                        tmp.x = 0;
                        tmp.y = 0;
                        this.addChild(tmp);
                    }
                    else{
                        this.isSolid = true;
                        tmp = new PIXI.Sprite(this.textures.wallEdge);
                        tmp.anchor.set(0);
                        tmp.x = 0;
                        tmp.y = 0;
                        this.addChild(tmp);
                    }
                    break;
                }
            case 4:
                {
                    this.isSolid = false;
                    if(cell.connections.up){
                        if(cell.connections.right){
                            if(cell.connections.down){
                                if(cell.connections.left){
                                    tmp = new PIXI.Sprite(this.textures.pathCenter);
                                    tmp.anchor.set(0);
                                    tmp.x = 0;
                                    tmp.y = 0;
                                    this.addChild(tmp);
                                }
                                else{
                                    tmp = new PIXI.Sprite(this.textures.pathEdge);
                                    tmp.anchor.set(0);
                                    tmp.x = 0;
                                    tmp.y = 0;
                                    this.addChild(tmp);
                                }
                            }
                            else if(cell.connections.left){
                                tmp = new PIXI.Sprite(this.textures.pathEdge);
                                tmp.anchor.set(0);
                                tmp.pivot.set(5,5);
                                tmp.rotation = 3/2 * Math.PI
                                tmp.x = 5;
                                tmp.y = 5;
                                this.addChild(tmp);
                            }
                            else{
                                tmp = new PIXI.Sprite(this.textures.pathCorner);
                                tmp.anchor.set(0)
                                tmp.pivot.set(5,5);
                                tmp.rotation = 1/2 * Math.PI
                                tmp.x = 5;
                                tmp.y = 5;
                                this.addChild(tmp);
                            }
                        }
                        else if(cell.connections.left){
                            if(cell.connections.down){
                                tmp = new PIXI.Sprite(this.textures.pathEdge);
                                tmp.anchor.set(0);
                                tmp.pivot.set(5,5);
                                tmp.rotation =  Math.PI
                                tmp.x = 5;
                                tmp.y = 5;
                                this.addChild(tmp);
                               
                            }
                            else{
                                tmp = new PIXI.Sprite(this.textures.pathCorner);
                                tmp.x = 0;
                                tmp.y = 0;
                                this.addChild(tmp);
                                tmp.anchor.set(0);
                            }
                        }
                        else if(cell.connections.down){
                            tmp = new PIXI.Sprite(this.textures.pathPassage);
                            tmp.anchor.set(0)
                            tmp.pivot.set(5,5);
                            tmp.rotation = 1/2 * Math.PI
                            tmp.x = 5;
                            tmp.y = 5;
                            this.addChild(tmp);
                        }
                        else{
                            tmp = new PIXI.Sprite(this.textures.pathDeadEnd);
                            tmp.anchor.set(0)
                            tmp.pivot.set(5,5);
                            tmp.rotation = Math.PI
                            tmp.x = 5;
                            tmp.y = 5;
                            this.addChild(tmp);
                        }
                    }
                    else if(cell.connections.down){
                        if(cell.connections.right){
                            if(cell.connections.left){
                                tmp = new PIXI.Sprite(this.textures.pathEdge);
                                tmp.anchor.set(0)
                                tmp.pivot.set(5,5);
                                tmp.rotation = 1/2 * Math.PI
                                tmp.x = 5;
                                tmp.y = 5;
                                this.addChild(tmp);
                            }
                            else{
                                tmp = new PIXI.Sprite(this.textures.pathCorner);
                                tmp.anchor.set(0)
                                tmp.pivot.set(5,5);
                                tmp.rotation = Math.PI
                                tmp.x = 5;
                                tmp.y = 5;
                                this.addChild(tmp);
                            }
                        }
                        else if(cell.connections.left){
                            tmp = new PIXI.Sprite(this.textures.pathCorner);
                                tmp.anchor.set(0)
                                tmp.pivot.set(5,5);
                                tmp.rotation = 3/2 * Math.PI
                                tmp.x = 5;
                                tmp.y = 5;
                                this.addChild(tmp);
                        }
                        else{
                            tmp = new PIXI.Sprite(this.textures.pathDeadEnd);
                            tmp.anchor.set(0)
                            tmp.x = 0;
                            tmp.y = 0;
                            this.addChild(tmp);
                        }
                    }
                    else if(cell.connections.right){
                        if(cell.connections.left){
                            tmp = new PIXI.Sprite(this.textures.pathPassage);
                            tmp.anchor.set(0)
                            tmp.x = 0;
                            tmp.y = 0;
                            this.addChild(tmp);
                        }
                        else{
                            tmp = new PIXI.Sprite(this.textures.pathDeadEnd);
                            tmp.anchor.set(0)
                            tmp.pivot.set(5,5);
                            tmp.rotation = 3/2*  Math.PI
                            tmp.x = 5;
                            tmp.y = 5;
                            this.addChild(tmp);
                        }
                    }
                    else{
                        tmp = new PIXI.Sprite(this.textures.pathDeadEnd);
                        tmp.anchor.set(0)
                        tmp.pivot.set(5,5);
                        tmp.rotation = 1/2 * Math.PI
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp);
                    }
                    if(this.isEnd){
                        tmp = new PIXI.Sprite(this.endFlag);
                        tmp.anchor.set(0);
                        tmp.x = 0;
                        tmp.y = 0;
                        this.addChild(tmp);
                    }
                    break;
                }
            case 5:
                {
                    if(cell.connections.right){
                        this.isSolid = false;
                        tmp = new PIXI.Sprite(this.textures.pathPassage);
                        tmp.anchor.set(0);
                        tmp.x = 0;
                        tmp.y = 0;
                        this.addChild(tmp);
                    }
                    else{
                        this.isSolid = true;
                        tmp = new PIXI.Sprite(this.textures.wallEdge);
                        tmp.anchor.set(0);
                        tmp.pivot.set(5,5);
                        tmp.rotation = Math.PI
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp);
                    }
                    break;
                }
            case 6:
                {
                    this.isSolid = true;
                    if(cell.connections.down){
                        if(cell.connections.left){
                            tmp = new PIXI.Sprite(this.textures.wallCorner);
                            tmp.anchor.set(0)
                            tmp.pivot.set(5,5);
                            tmp.rotation = 3/2 * Math.PI;
                            tmp.x = 5;
                            tmp.y = 5;
                            this.addChild(tmp)
                        }
                        else{
                            tmp = new PIXI.Sprite(this.textures.wallEdge);
                            tmp.anchor.set(0);
                            tmp.x = 0;
                            tmp.y = 0;
                            this.addChild(tmp)
                        }
                    }
                    else if(cell.connections.left){
                        tmp = new PIXI.Sprite(this.textures.wallEdge);
                        tmp.anchor.set(0)
                        tmp.pivot.set(5,5);
                        tmp.rotation = 3/2 * Math.PI;
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    else{
                        tmp = new PIXI.Sprite(this.textures.wallCenter);
                        tmp.anchor.set(0)
                        tmp.x = 0;
                        tmp.y = 0;
                        this.addChild(tmp)
                    }
                    break;
                }
            case 7:
                {
                    if(cell.connections.down){
                        this.isSolid = false;
                        tmp = new PIXI.Sprite(this.textures.pathPassage);
                        tmp.anchor.set(0);
                        tmp.pivot.set(5,5);
                        tmp.rotation = 1/2 * Math.PI;
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp);
                    }
                    else{
                        this.isSolid = true;
                        tmp = new PIXI.Sprite(this.textures.wallEdge);
                        tmp.anchor.set(0);
                        tmp.pivot.set(5,5);
                        tmp.rotation = 3/2 * Math.PI;
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp);
                    }
                    break;
                }
            case 8:
                {
                    this.isSolid = true;
                    if(cell.connections.down){
                        if(cell.connections.right){
                            tmp = new PIXI.Sprite(this.textures.wallCorner);
                            tmp.anchor.set(0)
                            tmp.pivot.set(5,5);
                            tmp.rotation = Math.PI;
                            tmp.x = 5;
                            tmp.y = 5;
                            this.addChild(tmp)
                        }
                        else{
                            tmp = new PIXI.Sprite(this.textures.wallEdge);
                            tmp.anchor.set(0)
                            tmp.pivot.set(5,5);
                            tmp.rotation = Math.PI;
                            tmp.x = 5;
                            tmp.y = 5;
                            this.addChild(tmp)
                        }
                    }
                    else if(cell.connections.right){
                        tmp = new PIXI.Sprite(this.textures.wallEdge);
                        tmp.anchor.set(0)
                        tmp.pivot.set(5,5);
                        tmp.rotation = 3/2 * Math.PI;
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    else{
                        tmp = new PIXI.Sprite(this.textures.wallCenter);
                        tmp.anchor.set(0)
                        tmp.x = 0;
                        tmp.y = 0;
                        this.addChild(tmp)
                    }
                    break;
                }
        }
    }
}