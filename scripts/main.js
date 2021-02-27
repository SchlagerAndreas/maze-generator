window.onload = function(){
    maze = new Maze(40,25);
    maze.setup();
    maze.generateMaze();
    maze.renderMaze();
}