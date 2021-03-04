class Maze{
    constructor(){
        var that = this;
        this.mazeHeight = 25;
        this.mazeWidth = 40;
        this.generator;

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

            let select = new PIXI.Sprite(new PIXI.Texture(this.app.loader.resources.select.texture, new PIXI.Rectangle(0,75,100,25)));
            select.x = 300;
            select.y = 225;
            this.startScreen.addChild(select);

            select = new PIXI.Sprite(new PIXI.Texture(this.app.loader.resources.select.texture, new PIXI.Rectangle(0,75,100,25)));
            select.x = 450;
            select.y = 225;
            this.startScreen.addChild(select);

            button = new PIXI.Sprite(this.app.loader.resources.genBtn.texture);
            button.x = 250;
            button.y = 500;
            button.interactive = true;
            button.buttonMode = true;
            button.on("pointerup",()=>{this.startScreen.visible = false;
                                       this.generator = new MazeGenerator(this.mazeWidth,this.mazeHeight,"ReverseDFS");
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