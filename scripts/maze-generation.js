class MazeGenerator{
    constructor(width,height,methode){
        this.mazeHeight = height;
        this.mazeWidth = width;
        this.maze = [];
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

    generateMaze(method){
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