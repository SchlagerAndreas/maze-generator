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

        button = new PIXI.Sprite(new PIXI.Texture(this.selectTexture, new PIXI.Rectangle(0,90,100,30)));
        button.x = 0;
        button.y = 0;
        button.interactive = true;
        button.buttonMode = true;
        button.on("pointerup",()=>{this.openCloseSelect()})
        this.addChild(button);

        text = new PIXI.Text(this.title + ' ▼',this.textStyle);
        text.width = 80;
        text.height = 15;
        text.x = 10;
        text.y = 6;
        this.addChild(text);

        let i = 0;
        for(i = 0; i < this.options.length-1; i++){
            let optionsID = i;
            button = new PIXI.Sprite(new PIXI.Texture(this.selectTexture, new PIXI.Rectangle(0,30,100,30)));
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
            text.height = 15;
            text.x = 10;
            text.y = 6 + 25 * (i+1);
            text.visible = false;
            this.addChild(text);
        }

        button = new PIXI.Sprite(new PIXI.Texture(this.selectTexture, new PIXI.Rectangle(0,60,100,30)));
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
        text.height = 15;
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

 class Button extends PIXI.Container{
    constructor(title,textstyle,texture,btnBorder,onClickFunction){
        super();
        this.title = title;
        this.textstyle = textstyle;
        this.texture = texture;
        this.btnBorder = btnBorder;
        this.cbFct = onClickFunction;
        this.createButton();
    }
    createButton(){
            let button = new PIXI.Sprite(this.texture);
            button.anchor.set(0);
            button.x = button.y = 0;
            button.interactive = true;
            button.buttonMode = true;
            button.on("pointerup",()=>{this.cbFct()});
            this.addChild(button);
            
            let text = new PIXI.BitmapText(this.title,{
                fontName: "Digiffiti",
                fontSize: 32,
                align: "center"
              });
            text.anchor.set(0);
            text.pivot.set(0);
            text.rotation = Math.PI;
            text.height = this.texture.height - this.btnBorder.top - this.btnBorder.bottom;
            text.width =  this.texture.width - this.btnBorder.left - this.btnBorder.right;
            text.y = this.btnBorder.top;
            text.x = this.btnBorder.left;
            this.addChild(text);
    }
 }
