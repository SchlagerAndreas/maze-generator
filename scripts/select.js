 class Select extends PIXI.Container{
     constructor(title,options,selectTexture,shadeTexture,textStyle,onOptionClickFunction){
         super();
         this.title = title;
         this.options = options;
         this.selectTexture = selectTexture;
         this.shadeTexture = shadeTexture;
         this.textStyle = textStyle;
         this.onOptClkFct = onOptionClickFunction;
         this.isOpen = false;
         this.createSelect();
     }

     createSelect(){
        let button;
        let text;

        button = new PIXI.Sprite(new PIXI.Texture(this.selectTexture, new PIXI.Rectangle(0,75,100,25)));
        button.x = 0;
        button.y = 0;
        button.interactive = true;
        button.buttonMode = true;
        button.on("pointerup",()=>{this.openCloseSelect()})
        this.addChild(button);

        text = new PIXI.Text(this.title + ' ▼',this.textStyle);
        text.width = 80;
        text.height = 13;
        text.x = 10;
        text.y = 6;
        this.addChild(text);

        let i = 0;
        for(i = 0; i < this.options.length-1; i++){
            let optionsID = i;
            button = new PIXI.Sprite(new PIXI.Texture(this.selectTexture, new PIXI.Rectangle(0,25,100,25)));
            button.x = 0;
            button.y = 0 + 25 * (i+1);
            button.interactive = true;
            button.buttonMode = true;
            button.visible = false;
            button.on("pointerup",()=>{this.onOptClkFct(optionsID);
                                       this.openCloseSelect();
                                       this.children[2 * this.options.length + 2].y = 0 + 25 * (optionsID+1);})
            this.addChild(button);

            text = new PIXI.Text(this.options[i],this.textStyle)
            text.width = 80;
            text.height = 13;
            text.x = 10;
            text.y = 6 + 25 * (i+1);
            text.visible = false;
            this.addChild(text);
        }

        button = new PIXI.Sprite(new PIXI.Texture(this.selectTexture, new PIXI.Rectangle(0,50,100,25)));
        button.x = 0;
        button.y = 0 + 25 * (i+1);
        button.interactive = true;
        button.buttonMode = true;
        button.visible = false;
        button.on("pointerup",()=>{this.onOptClkFct(i);
                                   this.openCloseSelect();
                                   this.children[2 * this.options.length + 2].y = 0 + 25 * (i+1);})

        this.addChild(button);

        text = new PIXI.Text(this.options[i],this.textStyle)
        text.width = 80;
        text.height = 13;
        text.x = 10;
        text.y = 6 + 25 * (i+1);
        text.visible = false;
        this.addChild(text);

        let shade = new PIXI.Sprite(this.shadeTexture)
        shade.x = 0;
        shade.y = 25;
        shade.visible = false;
        this.addChild(shade);
     }

     openCloseSelect(){
         for(let i = 2; i <= this.children.length - 1; i++){
             this.children[i].visible = !this.children[i].visible;
         }
         if(this.isOpen){
            //this.children[0].texture = new PIXI.Sprite(new PIXI.Texture(this.selectTexture, new PIXI.Rectangle(0,75,100,25)));
            this.children[1].text = this.title + " ▼"
         }
         else{
            //this.children[0].texture = new PIXI.Sprite(new PIXI.Texture(this.selectTexture, new PIXI.Rectangle(0,0,100,25)));
            this.children[1].text = this.title + " ▲"
         }
         this.isOpen = !this.isOpen;
     }
 }
