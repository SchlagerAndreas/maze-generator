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
        this.app.loader.baseUrl = "graphics/";
        this.app.loader.add('digifitti', 'fonts/digiffiti.fnt')
                       .add("player","other/player.png")      
                       .add("select","ui/select.png")
                       .add("shade","ui/shade.png")
                       .add("hedgeTheme","mazeThemes/hedgemaze-theme.png")
                       .add("blackwhiteTheme","mazeThemes/blackwhite-theme.png")
                       .add("lavalakeTheme","mazeThemes/lavalake-theme.png")
                       .add("background","ui/background.png")
                       .add("button","ui/button.png")
                       .add("sBtn","ui/smallButton.png")
                       .add("endFlag","other/endFlag.png");
        this.app.loader.onComplete.add(function(){that.createScreens()})
        this.app.loader.load();
    }

    createScreens(){
        let textstyle = {fontFamily : 'Arial', fontSize: 100, fill : /*0xdca577*/ 0x83ffa0, align : 'center'}
        let smallBtnBorder = {top:8,bottom:8,left:10,right:10};
        let normalButtonBorder = {top:10,bottom:10,left:18,right:18};
        //Start Screen
        {
            let background = new PIXI.Sprite(this.app.loader.resources.background.texture);
            background.anchor.set(0);
            background.x = 0;
            background.y = 0;
            this.startScreen.addChild(background);

            let text = new PIXI.BitmapText("G E N E R A T E  M A Z E",{
                fontName: "Digiffiti",
                fontSize: 32,
                align: "center"
              });
            text.anchor.set(0);
            text.pivot.set(0);
            text.rotation = Math.PI;
            text.height = 75;
            text.width =  250;
            text.y = 25;
            text.x = 175;
            this.startScreen.addChild(text);

            let setSize = new PIXI.Container()

            text = new PIXI.BitmapText("SET SIZE",{
                fontName: "Digiffiti",
                fontSize: 32,
                align: "center"
              });
            text.anchor.set(0);
            text.pivot.set(0);
            text.rotation = Math.PI;
            text.height = 40;
            text.width =  150;
            text.y = 0;
            text.x = 25;
            setSize.addChild(text);

            let option = new PIXI.Container();

            text = new PIXI.BitmapText("WIDTH",{
                fontName: "Digiffiti",
                fontSize: 32,
                align: "center"
              });
            text.anchor.set(0);
            text.pivot.set(0);
            text.rotation = Math.PI;
            text.height = 30;
            text.width =  80;
            text.y = 0;
            text.x = 0;
            option.addChild(text);

            let button = new Button("-",textstyle,this.app.loader.resources.sBtn.texture,smallBtnBorder,()=>{this.mazeWidth = this.mazeWidth - 1 == 0 ? 40 : this.mazeWidth - 1;
                                                                                                                        this.startScreen.children[2].children[1].children[3].width = this.mazeWidth < 10 ? 40 : 80;
                                                                                                                        this.startScreen.children[2].children[1].children[3].x = this.mazeWidth < 10 ? 170 : 130;
                                                                                                                        this.startScreen.children[2].children[1].children[3].text = this.mazeWidth;})
            button.x = 90;
            button.y = 0;
            option.addChild(button);

            button = new Button("+",textstyle,this.app.loader.resources.sBtn.texture,smallBtnBorder,()=>{this.mazeWidth = this.mazeWidth + 1 == 41 ? 1 : this.mazeWidth + 1;
                                                                                                            this.startScreen.children[2].children[1].children[3].width = this.mazeWidth < 10 ? 40 : 80;
                                                                                                            this.startScreen.children[2].children[1].children[3].x = this.mazeWidth < 10 ? 170 : 130;
                                                                                                            this.startScreen.children[2].children[1].children[3].text = this.mazeWidth;});
            button.x = 220;
            button.y = 0;
            option.addChild(button);

            text = new PIXI.Text('40',textstyle)
            text.anchor.set(0);
            text.width = 80;
            text.height = 30;
            text.x = 130;
            text.y = 0;
            option.addChild(text);

            option.height = 30;
            option.width = 200;
            option.x = 0;
            option.y = 50;
            setSize.addChild(option);

            option = new PIXI.Container();

            text = new PIXI.BitmapText("HEIGHT",{
                fontName: "Digiffiti",
                fontSize: 32,
                align: "center"
              });
            text.anchor.set(0);
            text.pivot.set(0);
            text.rotation = Math.PI;
            text.height = 30;
            text.width =  80;
            text.y = 0;
            text.x = 0;
            option.addChild(text);

            button = new Button("-",textstyle,this.app.loader.resources.sBtn.texture,smallBtnBorder,()=>{this.mazeHeight = this.mazeHeight - 1 == 0 ? 25 : this.mazeHeight - 1;
                                                                                                         this.startScreen.children[2].children[2].children[3].width = this.mazeHeight < 10 ? 40 : 80;
                                                                                                         this.startScreen.children[2].children[2].children[3].x = this.mazeHeight < 10 ? 170 : 130;
                                                                                                         this.startScreen.children[2].children[2].children[3].text = this.mazeHeight;});
            button.x = 90;                              
            button.y = 0;
            option.addChild(button);

            button = new Button("+",textstyle,this.app.loader.resources.sBtn.texture,smallBtnBorder,()=>{this.mazeHeight = this.mazeHeight + 1 == 26 ? 1 : this.mazeHeight + 1;
                                                                                                         this.startScreen.children[2].children[2].children[3].width = this.mazeHeight < 10 ? 40 : 80;
                                                                                                         this.startScreen.children[2].children[2].children[3].x = this.mazeHeight < 10 ? 170 : 130;
                                                                                                         this.startScreen.children[2].children[2].children[3].text = this.mazeHeight;});
            button.x = 220;
            button.y = 0;
            option.addChild(button);

            text = new PIXI.Text('25',textstyle)
            text.anchor.set(0);
            text.width = 80;
            text.height = 30;
            text.x = 130;
            text.y = 0;
            option.addChild(text);

            option.height = 30;
            option.width = 200;
            option.x = 0;
            option.y = 110;
            setSize.addChild(option);

            setSize.width = 250;
            setSize.height = 200;
            setSize.x = 50;
            setSize.y = 150;
            this.startScreen.addChild(setSize);
 
            let select = new Select("Themes",this.themes,this.app.loader.resources.select.texture,this.app.loader.resources.shade.texture,textstyle,(id)=>{this.mazeTheme = this.themes[id]})
            select.x = 320;
            select.y = 270;
            this.startScreen.addChild(select);
            
            select = new Select("Method",this.methods,this.app.loader.resources.select.texture,this.app.loader.resources.shade.texture,textstyle,(id)=>{this.mazeGenerationMethod = this.methods[id]})
            select.x = 470;
            select.y = 270;
            this.startScreen.addChild(select);

            button = new Button("GENERATE",textstyle,this.app.loader.resources.button.texture,normalButtonBorder,()=>{this.startScreen.visible = false;
                                                                                                      this.generator = new MazeGenerator(this.mazeWidth,this.mazeHeight,this.mazeGenerationMethod);
                                                                                                      this.generator.setup();
                                                                                                      this.generator.generateMaze();
                                                                                                      this.drawMaze();
                                                                                                      this.startTime = new Date().getTime()});
            button.x = 200;
            button.y = 500;
            this.startScreen.addChild(button)


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

            let text = new PIXI.BitmapText("PAUSE",{
                fontName: "Digiffiti",
                fontSize: 32,
                align: "center"
              });
            text.anchor.set(0);
            text.pivot.set(0);
            text.rotation = Math.PI;
            text.height = 50;
            text.width =  200;
            text.y = 25;
            text.x = 200;
            this.pauseScreen.addChild(text);

            let button = new Button("RETURN",textstyle,this.app.loader.resources.button.texture,normalButtonBorder,()=>{this.app.ticker.add(this.tickerFun);
                                                                                                                        this.pauseScreen.visible = false;
                                                                                                                        this.mazeContainer.visible = true;
                                                                                                                        this.player.visible = true;});
            button.x = 200;                                                                                                        
            button.y = 250;
            this.pauseScreen.addChild(button)
            
            button = new Button("EXIT",textstyle,this.app.loader.resources.button.texture,normalButtonBorder,()=>{this.resetMazeValues()
                                                                                                                      this.pauseScreen.visible = false;
                                                                                                                      this.startScreen.visible = true;});
            button.x = 200;                                                                                                                                                                                                                 
            button.y = 350;
            this.pauseScreen.addChild(button)

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

            let text = new PIXI.BitmapText("MAZE FINISHED",{
                fontName: "Digiffiti",
                fontSize: 32,
                align: "center"
            });
            text.anchor.set(0);
            text.pivot.set(0);
            text.rotation = Math.PI;
            text.height = 50;
            text.width =  200;
            text.y = 100;
            text.x = 200;
            this.finishScreen.addChild(text);

            // text = new PIXI.Text('Your time was XX:XX:XX',textstyle)
            // text.anchor.set(0);
            // text.width = 150;
            // text.height = 25;
            // text.x = 225;
            // text.y = 200;
            // this.finishScreen.addChild(text);

            text = new PIXI.BitmapText("YOUR TIME WAS XX:XX:XX",{
                fontName: "Digiffiti",
                fontSize: 32,
                align: "center"
            });
            text.anchor.set(0);
            text.pivot.set(0);
            text.rotation = Math.PI;
            text.height = 50;
            text.width =  300;
            text.y = 225;
            text.x = 150;
            this.finishScreen.addChild(text);

            let button = new Button("EXIT",textstyle,this.app.loader.resources.button.texture,normalButtonBorder,()=>{this.resetMazeValues()
                                                                                                                      this.finishScreen.visible = false;
                                                                                                                      this.startScreen.visible = true;});
            button.x = 200;                                                                                                                                                                                                                 
            button.y = 350;
            this.finishScreen.addChild(button)

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

        this.finishScreen.children[2].text = "YOUR TIME WAS:  " + (hours < 10 ? "0" + hours : hours) + ": " + (minutes < 10 ? "0" + minutes : minutes) + ": " + (seconds < 10 ? "0" + seconds : seconds);
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