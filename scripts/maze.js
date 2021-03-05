class Maze{
    constructor(){
        var that = this;
        this.mazeHeight = 25;
        this.mazeWidth = 40;
        this.mazeTheme;
        this.mazeGenerationMethod;
        this.generator;

        this.themes = ["BlackWhite","Hedge Maze","TestTheme","TestTheme2"];
        this.methods = ["RecursiveDFS","TestMethod","TestMethod2"];

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

        this.tickerFun = ()=>{this.gameLoop()};


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
                       .add("wall","black-tile.png");
        this.app.loader.onComplete.add(function(){that.createScreens()})
        this.app.loader.load();
    }

    createScreens(){
        let fontsize = 100;
        //Start Screen
        {
            let background = new PIXI.Graphics();
            background.beginFill(0xababab);
            background.drawRect(0, 0, 600, 600);
            background.endFill();     
            this.startScreen.addChild(background);

            let text = new PIXI.Text('Generate Maze',{fontFamily : 'Arial', fontSize: fontsize, fill : 0x0a0a0a, align : 'center'})
            text.anchor.set(0);
            text.width = 200;
            text.height = 50;
            text.x = 200;
            text.y = 25;
            this.startScreen.addChild(text);

            text = new PIXI.Text('Set Size',{fontFamily : 'Arial', fontSize: fontsize, fill : 0x0a0a0a, align : 'center'})
            text.anchor.set(0);
            text.width = 50;
            text.height = 25;
            text.x = 120;
            text.y = 150;
            this.startScreen.addChild(text);

            text = new PIXI.Text('Width',{fontFamily : 'Arial', fontSize: fontsize, fill : 0x0a0a0a, align : 'center'})
            text.anchor.set(0);
            text.width = 50;
            text.height = 25;
            text.x = 25;
            text.y = 200;
            this.startScreen.addChild(text);

            text = new PIXI.Text('Height',{fontFamily : 'Arial', fontSize: fontsize, fill : 0x0a0a0a, align : 'center'})
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

            text = new PIXI.Text('40',{fontFamily : 'Arial', fontSize: fontsize, fill : 0x0a0a0a, align : 'center'})
            text.anchor.set(0);
            text.width = 50;
            text.height = 25;
            text.x = 120;
            text.y = 200;
            this.startScreen.addChild(text);

              text = new PIXI.Text('25',{fontFamily : 'Arial', fontSize: fontsize, fill : 0x0a0a0a, align : 'center'})
            text.anchor.set(0);
            text.width = 50;
            text.height = 25;
            text.x = 120;
            text.y = 250;
            this.startScreen.addChild(text);

            //Theme Select
            {
                let select = new PIXI.Container();
                let button = new PIXI.Sprite(new PIXI.Texture(this.app.loader.resources.select.texture, new PIXI.Rectangle(0,75,100,25)));
                button.x = 0;
                button.y = 0;
                button.usedTexture = "closed";
                button.interactive = true;
                button.buttonMode = true;
                button.on("pointerup",()=>{for(let i = 2; i <= this.startScreen.children[11].children.length - 1;i++){
                                           this.startScreen.children[11].children[i].visible = !this.startScreen.children[11].children[i].visible;}
                                           this.startScreen.children[11].children[0].texture = this.startScreen.children[11].children[0].usedTexture == "closed" ? new PIXI.Texture(this.app.loader.resources.select.texture, new PIXI.Rectangle(0,0,100,25)) : new PIXI.Texture(this.app.loader.resources.select.texture, new PIXI.Rectangle(0,75,100,25));
                                           this.startScreen.children[11].children[0].usedTexture = this.startScreen.children[11].children[0].usedTexture == "closed" ? "opened" : "closed";
                                           this.startScreen.children[11].children[1].text = this.startScreen.children[11].children[1].text == "Themes ⯆" ? "Themes ⯅" : "Themes ⯆"})
                select.addChild(button);

                let text = new PIXI.Text('Themes ⯆',{fontFamily : 'Arial', fontSize: fontsize, fill : 0x0a0a0a, align : 'center'})
                text.width = 80;
                text.height = 13;
                text.x = 10;
                text.y = 6;
                select.addChild(text);

                let i = 0;
                for(i = 0; i < this.themes.length-1; i++){
                    let themeID = i;
                    button = new PIXI.Sprite(new PIXI.Texture(this.app.loader.resources.select.texture, new PIXI.Rectangle(0,25,100,25)));
                    button.x = 0;
                    button.y = 0 + 25 * (i+1);
                    button.interactive = true;
                    button.buttonMode = true;
                    button.visible = false;
                    button.on("pointerup",()=>{this.mazeTheme = this.themes[themeID];
                                               this.startScreen.children[11].children[2 * this.themes.length + 2].y = 0 + 25 * (themeID+1);})
                    select.addChild(button);
    
                    text = new PIXI.Text(this.themes[i],{fontFamily : 'Arial', fontSize: fontsize, fill : 0x0a0a0a, align : 'center'})
                    text.width = 80;
                    text.height = 13;
                    text.x = 10;
                    text.y = 6 + 25 * (i+1);
                    text.visible = false;
                    select.addChild(text);
                }

                button = new PIXI.Sprite(new PIXI.Texture(this.app.loader.resources.select.texture, new PIXI.Rectangle(0,50,100,25)));
                button.x = 0;
                button.y = 0 + 25 * (i+1);
                button.interactive = true;
                button.buttonMode = true;
                button.visible = false;
                button.on("pointerup",()=>{this.mazeTheme = this.themes[i];
                                           this.startScreen.children[11].children[2 * this.themes.length + 2].y = 0 + 25 * (i+1);})
                select.addChild(button);

                text = new PIXI.Text(this.themes[i],{fontFamily : 'Arial', fontSize: fontsize, fill : 0x0a0a0a, align : 'center'})
                text.width = 80;
                text.height = 13;
                text.x = 10;
                text.y = 6 + 25 * (i+1);
                text.visible = false;
                select.addChild(text);

                let shade = new PIXI.Sprite(this.app.loader.resources.shade.texture)
                shade.x = 0;
                shade.y = 25;
                shade.visible = false;
                select.addChild(shade);

                select.x = 300;
                select.y = 225;
                this.startScreen.addChild(select);
            }
            
            //Method Select
            {
                let select = new PIXI.Container();
                let button = new PIXI.Sprite(new PIXI.Texture(this.app.loader.resources.select.texture, new PIXI.Rectangle(0,75,100,25)));
                button.x = 0;
                button.y = 0;
                button.usedTexture = "closed";
                button.interactive = true;
                button.buttonMode = true;
                button.on("pointerup",()=>{for(let i = 2; i <= this.startScreen.children[12].children.length - 1;i++){
                                           this.startScreen.children[12].children[i].visible = !this.startScreen.children[12].children[i].visible;}
                                           this.startScreen.children[12].children[0].texture = this.startScreen.children[12].children[0].usedTexture == "closed" ? new PIXI.Texture(this.app.loader.resources.select.texture, new PIXI.Rectangle(0,0,100,25)) : new PIXI.Texture(this.app.loader.resources.select.texture, new PIXI.Rectangle(0,75,100,25));
                                           this.startScreen.children[12].children[0].usedTexture = this.startScreen.children[12].children[0].usedTexture == "closed" ? "opened" : "closed";
                                           this.startScreen.children[12].children[1].text = this.startScreen.children[12].children[1].text == "Method ⯆" ? "Method ⯅" : "Method ⯆"})
                select.addChild(button);

                let text = new PIXI.Text('Method ⯆',{fontFamily : 'Arial', fontSize: fontsize, fill : 0x0a0a0a, align : 'center'})
                text.width = 80;
                text.height = 13;
                text.x = 10;
                text.y = 6;
                select.addChild(text);

                let i = 0;
                for(i = 0; i < this.methods.length-1; i++){
                    let themeID = i;
                    button = new PIXI.Sprite(new PIXI.Texture(this.app.loader.resources.select.texture, new PIXI.Rectangle(0,25,100,25)));
                    button.x = 0;
                    button.y = 0 + 25 * (i+1);
                    button.interactive = true;
                    button.buttonMode = true;
                    button.visible = false;
                    button.on("pointerup",()=>{this.mazeGenerationMethod = this.methods[themeID];
                                               this.startScreen.children[12].children[2 * this.methods.length + 2].y = 0 + 25 * (themeID+1);
                                               console.log(this.mazeGenerationMethod)})
                    select.addChild(button);
    
                    text = new PIXI.Text(this.methods[i],{fontFamily : 'Arial', fontSize: fontsize, fill : 0x0a0a0a, align : 'center'})
                    text.width = 80;
                    text.height = 13;
                    text.x = 10;
                    text.y = 6 + 25 * (i+1);
                    text.visible = false;
                    select.addChild(text);
                }

                button = new PIXI.Sprite(new PIXI.Texture(this.app.loader.resources.select.texture, new PIXI.Rectangle(0,50,100,25)));
                button.x = 0;
                button.y = 0 + 25 * (i+1);
                button.interactive = true;
                button.buttonMode = true;
                button.visible = false;
                button.on("pointerup",()=>{this.mazeGenerationMethod = this.methods[i];
                                           this.startScreen.children[12].children[2 * this.methods.length + 2].y = 0 + 25 * (i+1);
                                           console.log(this.mazeGenerationMethod)})
                select.addChild(button);

                text = new PIXI.Text(this.methods[i],{fontFamily : 'Arial', fontSize: fontsize, fill : 0x0a0a0a, align : 'center'})
                text.width = 80;
                text.height = 13;
                text.x = 10;
                text.y = 6 + 25 * (i+1);
                text.visible = false;
                select.addChild(text);

                let shade = new PIXI.Sprite(this.app.loader.resources.shade.texture)
                shade.x = 0;
                shade.y = 25;
                shade.visible = false;
                select.addChild(shade);

                select.x = 450;
                select.y = 225;
                this.startScreen.addChild(select);
            }

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
    }

    drawMaze(){ 
        let wallTexture = this.mazeTheme == "Hedge Maze" ? this.app.loader.resources["bush"].texture : this.app.loader.resources["wall"].texture;
        let pathTexture = this.mazeTheme == "Hedge Maze" ? this.app.loader.resources["dirtpath"].texture :  this.app.loader.resources["path"].texture;
        this.mazeContainer.sortableChildren = true;
        for(var y = 0; y < this.mazeHeight; y++){
            for(var x = 0; x < this.mazeWidth; x++){
                let tmp = new PIXI.Sprite(wallTexture);
                tmp.anchor.set(0);
                tmp.isSolid = true;
                tmp.x = x * 30;
                tmp.y = y * 30;
                tmp.zIndex = 3*x + 3*y * this.mazeWidth * 3;
                this.mazeContainer.addChild(tmp);

                if(this.generator.maze[y][x].connections.up){
                    tmp = new PIXI.Sprite(pathTexture);
                    tmp.isSolid = false;
                }
                else{
                    tmp = new PIXI.Sprite(wallTexture);
                    tmp.isSolid = true;
                }
                tmp.anchor.set(0);
                tmp.x = x * 30 + 10;
                tmp.y = y * 30;
                tmp.zIndex = (3*x+1) + 3*y * this.mazeWidth * 3;
                this.mazeContainer.addChild(tmp);

                tmp = new PIXI.Sprite(wallTexture);
                tmp.anchor.set(0);
                tmp.isSolid = true;
                tmp.x = x * 30 + 20;
                tmp.y = y * 30;
                tmp.zIndex = (3*x+2) + 3*y * this.mazeWidth * 3;
                this.mazeContainer.addChild(tmp);

                if(this.generator.maze[y][x].connections.left){
                    tmp = new PIXI.Sprite(pathTexture);
                    tmp.isSolid = false;
                }
                else{
                    tmp = new PIXI.Sprite(wallTexture);
                    tmp.isSolid = true;
                }
                tmp.anchor.set(0);
                tmp.x = x * 30;
                tmp.y = y * 30 + 10;
                tmp.zIndex = 3*x + (3*y+1) * this.mazeWidth * 3;
                this.mazeContainer.addChild(tmp);

                
                if(x == this.mazeWidth -1 && y == this.mazeHeight -1){
                    tmp = new PIXI.Sprite(this.app.loader.resources["end"].texture);
                    tmp.isEnd = true;
                }
                else{
                    tmp = new PIXI.Sprite(pathTexture);
                }
                tmp.isSolid = false;
                tmp.anchor.set(0);
                tmp.x = x * 30 + 10;
                tmp.y = y * 30 + 10;
                tmp.zIndex = (3*x+1) + (3*y+1) * this.mazeWidth * 3;
                this.mazeContainer.addChild(tmp);

                if(this.generator.maze[y][x].connections.right){
                    tmp = new PIXI.Sprite(pathTexture);
                    tmp.isSolid = false;
                }
                else{
                    tmp = new PIXI.Sprite(wallTexture);
                    tmp.isSolid = true;
                }
                tmp.anchor.set(0);
                tmp.x = x * 30 + 20;
                tmp.y = y * 30 + 10;
                tmp.zIndex = (3*x+2) + (3*y+1) * this.mazeWidth * 3;
                this.mazeContainer.addChild(tmp);

                tmp = new PIXI.Sprite(wallTexture);
                tmp.anchor.set(0);
                tmp.isSolid = true;
                tmp.x = x * 30;
                tmp.y = y * 30 + 20;
                tmp.zIndex = 3*x + (3*y+2) * this.mazeWidth * 3;
                this.mazeContainer.addChild(tmp);

                if(this.generator.maze[y][x].connections.down){
                    tmp = new PIXI.Sprite(pathTexture);
                }
                else{
                    tmp = new PIXI.Sprite(wallTexture);
                    tmp.isSolid = true;
                }
                tmp.anchor.set(0);
                tmp.x = x * 30 + 10;
                tmp.y = y * 30 + 20;
                tmp.zIndex = (3*x+1) + (3*y+2) * this.mazeWidth * 3;
                this.mazeContainer.addChild(tmp);

                tmp = new PIXI.Sprite(wallTexture);
                tmp.anchor.set(0);
                tmp.isSolid = true;
                tmp.x = x * 30 + 20;
                tmp.y = y * 30 + 20;
                tmp.zIndex = (3*x+2) + (3*y+2) * this.mazeWidth * 3;
                this.mazeContainer.addChild(tmp);
            }
        }
        this.mazeContainer.widthTiles = this.mazeWidth * 3;
        this.mazeContainer.heightTiles = this.mazeHeight * 3;
        this.mazeContainer.sortChildren();
        this.app.stage.addChild(this.mazeContainer);
        this.player = new Player(15,15,this.app.loader.resources["player"].texture,this.mazeContainer,(object1,object2) => {return this.isColiding(object1,object2);})
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
        this.player.move(this.pressedKeys);
    }
}