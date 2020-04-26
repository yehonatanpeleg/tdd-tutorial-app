var lodash = require("lodash");

function generateGrid(rows, cols) {
  // Creating grid
  var grid = new Array(rows).fill(0);
  grid = grid.map((element) => {
    return new Array(cols).fill(0);
  });

  // Initializing grid
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[i].length; j++) {
      grid[i][j] = {
        alive: false,
        location: {
          row: i,
          col: j,
        },
      };
    }
  }

  // Randomizing how many cells to wake up
  let numberOfCellsToInitialize = Math.floor(Math.random() * (rows * cols));

  // Randomizing which cells to wake up
  for (let i = 0; i < numberOfCellsToInitialize; i++) {
    let row = Math.floor(Math.random() * (rows - 1));
    let col = Math.floor(Math.random() * (cols - 1));
    grid[row][col].alive = true;
  }

  return grid;
}

function retrieveCellNeighbors(grid, cellRow, cellCol) {
  // Initializing neighbors
  var neighbors = [];

  for (var i = cellRow - 1; i <= cellRow + 1; i++) {
    for (var j = cellCol - 1; j <= cellCol + 1; j++) {
      if (
        !(i === cellRow && j == cellCol) &&
        0 <= i &&
        i < grid.length &&
        0 <= j &&
        j < grid[0].length
      ) {
        neighbors.push(grid[i][j]);
      }
    }
  }

  return neighbors;
}

function countAliveNeighbors(neighbors) {
  // Initializing
  var aliveCount = 0;

  // Counting number of alive neighbors
  for (let neighbor of neighbors) {
    if (neighbor.alive) {
      aliveCount++;
    }
  }

  return aliveCount;
}

function retrieveNextGeneration(grid) {
  // Generating new grid from old grid
  var newGrid = lodash.cloneDeep(grid);

  // Calculating next generation
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[0].length; j++) {
      // Retrieving count of alive neighbors
      var neighborsAlive = countAliveNeighbors(
        retrieveCellNeighbors(grid, i, j)
      );

      // If current cell alive, it can die of loneliness or crowdedness
      if (grid[i][j].alive && (neighborsAlive <= 1 || neighborsAlive >= 3)) {
        newGrid[i][j].alive = false;
      }
      // If current cell dead, it can be reborn
      else if (!grid[i][j].alive && neighborsAlive === 3) {
        newGrid[i][j].alive = true;
      }
    }
  }

  return newGrid;
}

module.exports.generateGrid = generateGrid;
module.exports.retrieveCellNeighbors = retrieveCellNeighbors;
module.exports.retrieveNextGeneration = retrieveNextGeneration;
