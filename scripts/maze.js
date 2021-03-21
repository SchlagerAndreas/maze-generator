class Maze{
    constructor(){
        var that = this;
        this.mazeHeight = 25;
        this.mazeWidth = 40;
        this.mazeTheme = "BlackWhite";
        this.mazeGenerationMethod = "RecursiveDFS";
        this.startTime;
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
        this.app.loader.add("player","player.png")
                       .add("plBtn","plus-button.png")
                       .add("minBtn","minus-button.png")
                       .add("genBtn","generate-button.png")
                       .add("exitBtn","exit-button.png")
                       .add("retBtn","return-button.png")                       
                       .add("select","select.png")
                       .add("shade","shade.png")
                       .add("hedgeTheme","hedgemaze-theme.png")
                       .add("blackwhiteTheme","blackwhite-theme.png")
                       .add("lavalakeTheme","lavalake-theme.png")
                       .add("background","background.png")
                       .add("endFlag","endFlag.png");
        this.app.loader.onComplete.add(function(){that.createScreens()})
        this.app.loader.load();
    }

    createScreens(){
        let textstyle = {fontFamily : 'Arial', fontSize: 100, fill : /*0xdca577*/ 0x83ffa0, align : 'center'}
        //Start Screen
        {
            let background = new PIXI.Sprite(this.app.loader.resources.background.texture);
            background.anchor.set(0);
            background.x = 0;
            background.y = 0;
            this.startScreen.addChild(background);

            let text = new PIXI.Text('Generate Maze',textstyle)
            text.anchor.set(0);
            text.width = 200;
            text.height = 50;
            text.x = 200;
            text.y = 25;
            this.startScreen.addChild(text);


            let setSize = new PIXI.Container()

            text = new PIXI.Text('Set Size',textstyle);
            text.anchor.set(0);
            text.width = 125;
            text.height = 25;
            text.x = 50;
            text.y = 0;
            setSize.addChild(text);

            let option = new PIXI.Container();

            text = new PIXI.Text('Width',textstyle)
            text.anchor.set(0);
            text.width = 50;
            text.height = 25;
            text.x = 0;
            text.y = 50;
            option.addChild(text);

            text = new PIXI.Text('Height',textstyle)
            text.anchor.set(0);
            text.width = 50;
            text.height = 25;
            text.x = 0;
            text.y = 100;
            option.addChild(text);

            let button = new PIXI.Sprite(this.app.loader.resources.minBtn.texture);
            button.anchor.set(0);
            button.x = 75;
            button.y = 50;
            button.interactive = true;
            button.buttonMode = true;
            button.on("pointerup",()=>{this.mazeWidth = this.mazeWidth - 1 == 0 ? 40 : this.mazeWidth - 1;
                                       this.startScreen.children[2].children[1].children[6].width = this.mazeWidth < 10 ? 25 : 50;
                                       this.startScreen.children[2].children[1].children[6].x = this.mazeWidth < 10 ? 145 : 120;
                                       this.startScreen.children[2].children[1].children[6].text = this.mazeWidth;})
            option.addChild(button);

            button = new PIXI.Sprite(this.app.loader.resources.plBtn.texture);
            button.anchor.set(0)
            button.x = 200;
            button.y = 50;
            button.interactive = true;
            button.buttonMode = true;
            button.on("pointerup",()=>{this.mazeWidth = this.mazeWidth + 1 == 41 ? 1 : this.mazeWidth + 1;
                                       this.startScreen.children[2].children[1].children[6].width = this.mazeWidth < 10 ? 25 : 50;
                                       this.startScreen.children[2].children[1].children[6].x = this.mazeWidth < 10 ? 145 : 120;
                                       this.startScreen.children[2].children[1].children[6].text = this.mazeWidth;})
            option.addChild(button);

            button = new PIXI.Sprite(this.app.loader.resources.minBtn.texture);
            button.x = 75;
            button.y = 100;
            button.interactive = true;
            button.buttonMode = true;
            button.on("pointerup",()=>{this.mazeHeight = this.mazeHeight - 1 == 0 ? 25 : this.mazeHeight - 1;
                                       this.startScreen.children[2].children[1].children[7].width = this.mazeHeight < 10 ? 25 : 50;
                                       this.startScreen.children[2].children[1].children[7].x = this.mazeHeight < 10 ? 145 : 120;
                                       this.startScreen.children[2].children[1].children[7].text = this.mazeHeight;})
            option.addChild(button);

            button = new PIXI.Sprite(this.app.loader.resources.plBtn.texture);
            button.x = 200;
            button.y = 100;
            button.interactive = true;
            button.buttonMode = true;
            button.on("pointerup",()=>{this.mazeHeight = this.mazeHeight + 1 == 26 ? 1 : this.mazeHeight + 1;
                                       this.startScreen.children[2].children[1].children[7].width = this.mazeHeight < 10 ? 25 : 50;
                                       this.startScreen.children[2].children[1].children[7].x = this.mazeHeight < 10 ? 145 : 120;
                                       this.startScreen.children[2].children[1].children[7].text = this.mazeHeight;})
            option.addChild(button);

            text = new PIXI.Text('40',textstyle)
            text.anchor.set(0);
            text.width = 50;
            text.height = 25;
            text.x = 125;
            text.y = 50;
            option.addChild(text);

            text = new PIXI.Text('25',textstyle)
            text.anchor.set(0);
            text.width = 50;
            text.height = 25;
            text.x = 125;
            text.y = 100;
            option.addChild(text);

            setSize.addChild(option)
            setSize.width = 225;
            setSize.x = 50;
            setSize.y = 150;
            this.startScreen.addChild(setSize);

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
            button.x = 200;
            button.y = 500;
            button.interactive = true;
            button.buttonMode = true;
            button.on("pointerup",()=>{this.startScreen.visible = false;
                                       this.generator = new MazeGenerator(this.mazeWidth,this.mazeHeight,this.mazeGenerationMethod);
                                       this.generator.setup();
                                       this.generator.generateMaze();
                                       this.drawMaze();
                                       this.startTime = new Date().getTime()})
            this.startScreen.addChild(button);


            this.startScreen.width = 600;
            this.startScreen.height = 600;
            this.startScreen.x = 300;
            this.startScreen.y = 75;
            this.app.stage.addChild(this.startScreen);
        }
        //Pause Screen
        {
            let background = new PIXI.Sprite(this.app.loader.resources.background.texture);
            background.anchor.set(0);
            background.x = 0;
            background.y = 0;
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
            let background = new PIXI.Sprite(this.app.loader.resources.background.texture);
            background.anchor.set(0);
            background.x = 0;
            background.y = 0;
            this.finishScreen.addChild(background);

            let text = new PIXI.Text('Maze finished',textstyle)
            text.anchor.set(0);
            text.width = 200;
            text.height = 50;
            text.x = 200;
            text.y = 100;
            this.finishScreen.addChild(text);

            text = new PIXI.Text('Your time was XX:XX:XX',textstyle)
            text.anchor.set(0);
            text.width = 150;
            text.height = 25;
            text.x = 225;
            text.y = 200;
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
        let textureSheet = {
            wallTexture : [],
            pathTexture : [],
            endTexture : {}
        };
        switch(this.mazeTheme){
            case "Hedge Maze" : 
                for(let i = 0; i < 2; i++){
                    textureSheet.wallTexture[i] = new PIXI.Texture(this.app.loader.resources.hedgeTheme.texture,new PIXI.Rectangle(i*10,10,10,10))
                    textureSheet.pathTexture[i] = new PIXI.Texture(this.app.loader.resources.hedgeTheme.texture,new PIXI.Rectangle(i*10,0,10,10))
                }
                break;
            case "Lava Lake" : 
                for(let i = 0; i < 2; i++){
                    textureSheet.wallTexture[i] = new PIXI.Texture(this.app.loader.resources.lavalakeTheme.texture,new PIXI.Rectangle(i*10,10,10,10))
                    textureSheet.pathTexture[i] = new PIXI.Texture(this.app.loader.resources.lavalakeTheme.texture,new PIXI.Rectangle(i*10,0,10,10))
                }
                break;
            default : 
                for(let i = 0; i < 2; i++){
                    textureSheet.wallTexture[i] = new PIXI.Texture(this.app.loader.resources.blackwhiteTheme.texture,new PIXI.Rectangle(i*10,10,10,10))
                    textureSheet.pathTexture[i] = new PIXI.Texture(this.app.loader.resources.blackwhiteTheme.texture,new PIXI.Rectangle(i*10,0,10,10))
                }
                break;
        }
        textureSheet.endTexture = this.app.loader.resources.endFlag.texture
        this.mazeContainer.sortableChildren = true;
        for(var y = 0; y < this.mazeHeight; y++){
            for(var x = 0; x < this.mazeWidth; x++){
                for(var i = 0; i < 9; i++){
                    let tmp;
                    if(x == this.mazeWidth - 1 && y == this.mazeHeight - 1 && i == 4){
                        tmp = new Tile(textureSheet,this.generator.maze[y][x],4,true);
                    }
                    else{
                        tmp = new Tile(textureSheet,this.generator.maze[y][x],i);
                    }
                    tmp.zIndex = 3 * x + (i % 3) + (3 * y + Math.floor(i/3)) * this.mazeWidth * 3
                    this.mazeContainer.addChild(tmp);
                }
            }
        }
        this.mazeContainer.widthTiles = this.mazeWidth * 3;
        this.mazeContainer.heightTiles = this.mazeHeight * 3;
        this.mazeContainer.visible = true;
        this.mazeContainer.sortChildren();
        this.mazeContainer.x = 1200 / 2 - this.mazeWidth * 15;
        this.mazeContainer.y = 750 / 2 - this.mazeHeight * 15;
        this.mazeContainer.cacheAsBitmap = true;
        this.app.stage.addChild(this.mazeContainer);

        this.player = new Player( this.mazeContainer.x + 15,this.mazeContainer.y+15,this.app.loader.resources["player"].texture,this.mazeContainer,(object1,object2) => {return this.isColiding(object1,object2);})
        this.app.stage.addChild(this.player);

        this.app.ticker.add(this.tickerFun);
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

    getTime(){
        let difTime = new Date().getTime() - this.startTime;
        let hours = Math.floor((difTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((difTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((difTime % (1000 * 60)) / 1000);

        this.finishScreen.children[2].text = "Your time was " + (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    }
    
    pauseUpdateLoop(reason){
        this.app.ticker.remove(this.tickerFun);
        if(reason == "pause"){
            this.mazeContainer.visible = false;
            this.player.visible = false;
            this.pauseScreen.visible = true;
        }
        else if(reason == "finished"){
            this.getTime();
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
    constructor(textureSheet,cell,tileID,isEnd = false){
        super();        
        this.x = cell.x * 30 + 10 * (tileID % 3);
        this.y = cell.y * 30 + 10 * Math.floor(tileID / 3);
        this.textures = textureSheet;
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
                    tmp = new PIXI.Sprite(this.textures.wallTexture[0])
                    tmp.anchor.set(0);
                    tmp.x = 0;
                    tmp.y = 0;
                    this.addChild(tmp)
                    if(cell.connections.up){
                        tmp = new PIXI.Sprite(this.textures.wallTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = 1/2 * Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    if(cell.connections.left){
                        tmp = new PIXI.Sprite(this.textures.wallTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    break;
                }
            case 1:
                {
                    if(cell.connections.up){
                        this.isSolid = false;
                        tmp = new PIXI.Sprite(this.textures.pathTexture[0])
                        tmp.anchor.set(0); 
                        tmp.x = 0;
                        tmp.y = 0;
                        this.addChild(tmp)
                        tmp = new PIXI.Sprite(this.textures.pathTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = 1/2 * Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                        tmp = new PIXI.Sprite(this.textures.pathTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = 3/2 * Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    else{
                        this.isSolid = true;
                        tmp = new PIXI.Sprite(this.textures.wallTexture[0])
                        tmp.anchor.set(0); 
                        tmp.x = 0;
                        tmp.y = 0;
                        this.addChild(tmp)
                        tmp = new PIXI.Sprite(this.textures.wallTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    break;
                }
            case 2:
                {
                    this.isSolid = true;
                    tmp = new PIXI.Sprite(this.textures.wallTexture[0])
                    tmp.anchor.set(0);
                    tmp.x = 0;
                    tmp.y = 0;
                    this.addChild(tmp)
                    if(cell.connections.up){
                        tmp = new PIXI.Sprite(this.textures.wallTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = 3/2 * Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    if(cell.connections.right){
                        tmp = new PIXI.Sprite(this.textures.wallTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    break;
                }
            case 3:
                {
                    if(cell.connections.left){
                        this.isSolid = false;
                        tmp = new PIXI.Sprite(this.textures.pathTexture[0])
                        tmp.anchor.set(0); 
                        tmp.x = 0;
                        tmp.y = 0;
                        this.addChild(tmp)
                        tmp = new PIXI.Sprite(this.textures.pathTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                        tmp = new PIXI.Sprite(this.textures.pathTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = 2 * Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    else{
                        this.isSolid = true;
                        tmp = new PIXI.Sprite(this.textures.wallTexture[0])
                        tmp.anchor.set(0); 
                        tmp.x = 0;
                        tmp.y = 0;
                        this.addChild(tmp)
                        tmp = new PIXI.Sprite(this.textures.wallTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = 1/2 * Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    break;
                }
            case 4:
                {
                    this.isSolid = false;
                    tmp = new PIXI.Sprite(this.textures.pathTexture[0])
                    tmp.anchor.set(0);
                    tmp.x = 0;
                    tmp.y = 0;
                    this.addChild(tmp)
                    if(!cell.connections.up){
                        tmp = new PIXI.Sprite(this.textures.pathTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    if(!cell.connections.left){
                        tmp = new PIXI.Sprite(this.textures.pathTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = 1/2 * Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    if(!cell.connections.right){
                        tmp = new PIXI.Sprite(this.textures.pathTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = 3/2 * Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    if(!cell.connections.down){
                        tmp = new PIXI.Sprite(this.textures.pathTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = 2 * Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    if(this.isEnd){
                        tmp = new PIXI.Sprite(this.textures.endTexture)
                        tmp.anchor.set(0);
                        tmp.x = 0;
                        tmp.y = 0;
                        this.addChild(tmp)
                    }
                    break;
                }
            case 5:
                {
                    if(cell.connections.right){
                        this.isSolid = false;
                        tmp = new PIXI.Sprite(this.textures.pathTexture[0])
                        tmp.anchor.set(0); 
                        tmp.x = 0;
                        tmp.y = 0;
                        this.addChild(tmp)
                        tmp = new PIXI.Sprite(this.textures.pathTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                        tmp = new PIXI.Sprite(this.textures.pathTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = 2 * Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    else{
                        this.isSolid = true;
                        tmp = new PIXI.Sprite(this.textures.wallTexture[0])
                        tmp.anchor.set(0); 
                        tmp.x = 0;
                        tmp.y = 0;
                        this.addChild(tmp)
                        tmp = new PIXI.Sprite(this.textures.wallTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = 3/2 * Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    break;
                }
            case 6:
                {
                    this.isSolid = true;
                    tmp = new PIXI.Sprite(this.textures.wallTexture[0])
                    tmp.anchor.set(0);
                    tmp.x = 0;
                    tmp.y = 0;
                    this.addChild(tmp)
                    if(cell.connections.down){
                        tmp = new PIXI.Sprite(this.textures.wallTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = 1/2 * Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    if(cell.connections.left){
                        tmp = new PIXI.Sprite(this.textures.wallTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = 2 * Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    break;
                }
            case 7:
                {
                    if(cell.connections.down){
                        this.isSolid = false;
                        tmp = new PIXI.Sprite(this.textures.pathTexture[0])
                        tmp.anchor.set(0); 
                        tmp.x = 0;
                        tmp.y = 0;
                        this.addChild(tmp)
                        tmp = new PIXI.Sprite(this.textures.pathTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = 1/2 * Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                        tmp = new PIXI.Sprite(this.textures.pathTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = 3/2 * Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    else{
                        this.isSolid = true;
                        tmp = new PIXI.Sprite(this.textures.wallTexture[0])
                        tmp.anchor.set(0); 
                        tmp.x = 0;
                        tmp.y = 0;
                        this.addChild(tmp)
                        tmp = new PIXI.Sprite(this.textures.wallTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = 2 * Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    break;
                }
            case 8:
                {
                    this.isSolid = true;
                    tmp = new PIXI.Sprite(this.textures.wallTexture[0])
                    tmp.anchor.set(0);
                    tmp.x = 0;
                    tmp.y = 0;
                    this.addChild(tmp)
                    if(cell.connections.down){
                        tmp = new PIXI.Sprite(this.textures.wallTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = 3/2 * Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    if(cell.connections.right){
                        tmp = new PIXI.Sprite(this.textures.wallTexture[1])
                        tmp.anchor.set(0);
                        tmp.pivot.set(5);
                        tmp.rotation = 2 * Math.PI 
                        tmp.x = 5;
                        tmp.y = 5;
                        this.addChild(tmp)
                    }
                    break;
                }
        }
    }
}