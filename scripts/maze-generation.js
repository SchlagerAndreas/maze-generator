class MazeGenerator{
    constructor(width,height,method){
        this.mazeHeight = height;
        this.mazeWidth = width;
        this.method = method;
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

    generateMaze(){
        if(this.method == "RecursiveDFS"){
            let mazeStack = [];
            mazeStack.unshift(this.maze[0][0])
            while(mazeStack.length > 0){
                let curCell = mazeStack[0];
                curCell.visited = true;
                let neighbours = this.getNotVisitedNeighbours(curCell);
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
        else if(this.method == "Prims Algorithm"){
            let neighbours = [];
            let curCell = this.maze[0][0]
            do{
                curCell.visited = true;
                let curNeighbours = this.getNotVisitedNeighbours(curCell);
                for(let i = 0; i < curNeighbours.length; i++){
                    if(!neighbours.includes(this.maze[curNeighbours[i].y][curNeighbours[i].x])){
                        neighbours.push(this.maze[curNeighbours[i].y][curNeighbours[i].x]);
                    }
                }
                if(neighbours.length > 0){
                    let tmp = Math.floor(Math.random() * neighbours.length);
                    curCell = neighbours[tmp];
                    neighbours.splice(tmp,1);
                    curNeighbours = this.getVisitedNeighbours(curCell);
                    if(curNeighbours.length > 0){
                        tmp = Math.floor(Math.random() * curNeighbours.length);
                        curCell.setConnection(curNeighbours[tmp].direction);
                        this.maze[curNeighbours[tmp].y][curNeighbours[tmp].x].setConnection(curNeighbours[tmp].invDirection);
                    }
                }
            }while(neighbours.length > 0)
        }
        else if(this.method == "Wilsons Algorithm"){
            this.maze[0][0].visited = true;
            for(let y = 0; y < this.mazeHeight; y++){
                for(let x = 0; x < this.mazeWidth; x++){
                    if(!this.maze[y][x].visited){
                        let curCell = this.maze[y][x];
                        let path = [];
                        while(1){
                            path.push(curCell);
                            let neighbours = this.getAllNeighbours(curCell);
                            let tmp = Math.floor(Math.random() * neighbours.length);
                            let nextCell = this.maze[neighbours[tmp].y][neighbours[tmp].x];
                            if(nextCell.visited){
                                curCell.setConnection(neighbours[tmp].direction);
                                nextCell.setConnection(neighbours[tmp].invDirection);
                                for(let i = 0; i < path.length; i++){
                                    path[i].visited = true;
                                }
                                break;
                            }
                            else if(path.includes(nextCell)){
                                let index = path.indexOf(nextCell);
                                for(let i = index; i < path.length; i++){
                                   path[i].resetConnections(); 
                                }
                                if(index-1 >= 0){
                                    let beforeCell = path[index-1];
                                    let divX = beforeCell.x - nextCell.x;
                                    let divY = beforeCell.y - nextCell.y;
                                    if(divY > 0){
                                        nextCell.setConnection("down");
                                    }
                                    else if(divY < 0){
                                        nextCell.setConnection("up");
                                    }
                                    else{
                                        if(divX > 0){
                                            nextCell.setConnection("right");
                                        }
                                        else if(divX < 0){
                                            nextCell.setConnection("left");
                                        }
                                    }
                                }
                                path.splice(index,path.length-index+1);
                                curCell = nextCell;
                            }
                            else{
                                curCell.setConnection(neighbours[tmp].direction);
                                nextCell.setConnection(neighbours[tmp].invDirection);
                                curCell = nextCell;
                            }
                        }
                    }
                }
            }
        }
    }

    getAllNeighbours(cell){
        let ret = [];
        if(cell.x + 1 < this.mazeWidth){
            ret.push({x: cell.x + 1, y: cell.y, direction: "right", invDirection: "left"});
        }
        if(cell.x - 1 >= 0){
            ret.push({x: cell.x - 1, y: cell.y, direction: "left", invDirection: "right"});
        }
        if(cell.y + 1 < this.mazeHeight){
            ret.push({x: cell.x, y: cell.y +1, direction: "down", invDirection: "up"});
        }
        if(cell.y - 1 >= 0){
            ret.push({x: cell.x, y: cell.y - 1, direction: "up", invDirection: "down"});
        }
        return ret;
    }

    getNotVisitedNeighbours(cell){
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

    getVisitedNeighbours(cell){
        let ret = [];
        if(cell.x + 1 < this.mazeWidth && this.maze[cell.y][cell.x + 1].visited){
            ret.push({x: cell.x + 1, y: cell.y, direction: "right", invDirection: "left"});
        }
        if(cell.x - 1 >= 0 && this.maze[cell.y][cell.x - 1].visited){
            ret.push({x: cell.x - 1, y: cell.y, direction: "left", invDirection: "right"});
        }
        if(cell.y + 1 < this.mazeHeight && this.maze[cell.y + 1][cell.x].visited){
            ret.push({x: cell.x, y: cell.y +1, direction: "down", invDirection: "up"});
        }
        if(cell.y - 1 >= 0 && this.maze[cell.y - 1][cell.x].visited){
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

    resetConnections(){
        this.connections.up = false;
        this.connections.down = false;
        this.connections.left = false;
        this.connections.right = false;
    }
}