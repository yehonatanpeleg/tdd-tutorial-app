describe("Generate Game Of Life Grid", function name() {
  const generateGrid = require("../../gameOfLife/gameOfLife").generateGrid;

  it("should return a grid with 5 on 5", function () {
    expect(generateGrid(5, 5).length).toEqual(5);
    expect(generateGrid(5, 5)[0].length).toEqual(5);
  });

  it("should return a grid with 10 on 8", function () {
    expect(generateGrid(10, 8).length).toEqual(10);
    expect(generateGrid(10, 8)[0].length).toEqual(8);
  });

  it("should return a grid with cell elements", function () {
    expect(generateGrid(10, 8)[5][2].alive).toBeDefined();
    expect(generateGrid(10, 8)[5][2].location.row).toBeDefined();
    expect(generateGrid(10, 8)[5][2].location.col).toBeDefined();
  });

  it("should return a grid with cell elements with correct values", function () {
    expect(generateGrid(10, 8)[5][2].alive).toBeFalsy();
    expect(generateGrid(10, 8)[5][2].location.row).toEqual(5);
    expect(generateGrid(10, 8)[5][2].location.col).toEqual(2);
    expect(generateGrid(10, 8)[5][6].alive).toBeFalsy();
    expect(generateGrid(10, 8)[5][6].location.row).toEqual(5);
    expect(generateGrid(10, 8)[5][6].location.col).toEqual(6);
  });
});

describe("Retrieve Cell And Neighbors", function name() {
  const generateGrid = require("../../gameOfLife/gameOfLife").generateGrid;
  const retrieveCellNeighbors = require("../../gameOfLife/gameOfLife")
    .retrieveCellNeighbors;
  var grid;

  beforeEach(function name() {
    grid = generateGrid(5, 7);
  });

  it("should return correct number of  neighbors", function () {
    expect(retrieveCellNeighbors(grid, 0, 0).length).toEqual(3);
    expect(retrieveCellNeighbors(grid, 4, 5).length).toEqual(5);
    expect(retrieveCellNeighbors(grid, 2, 2).length).toEqual(8);
  });

  it("should return correct neighbors", function () {
    expect(retrieveCellNeighbors(grid, 0, 0)).toContain({
      alive: false,
      location: {
        row: 0,
        col: 1,
      },
    });
    expect(retrieveCellNeighbors(grid, 0, 0)).toContain({
      alive: false,
      location: {
        row: 1,
        col: 0,
      },
    });
    expect(retrieveCellNeighbors(grid, 0, 0)).toContain({
      alive: false,
      location: {
        row: 1,
        col: 1,
      },
    });
    expect(retrieveCellNeighbors(grid, 4, 6)).toContain({
      alive: false,
      location: {
        row: 3,
        col: 6,
      },
    });

    expect(
      retrieveCellNeighbors(grid, 5, 6).includes({
        alive: false,
        location: {
          row: 5,
          col: 6,
        },
      })
    ).toBeFalsy();
  });
});

describe("Retrieve next generation", function name() {
  const generateGrid = require("../../gameOfLife/gameOfLife").generateGrid;
  const retrieveCellNeighbors = require("../../gameOfLife/gameOfLife")
    .retrieveCellNeighbors;
  const retrieveNextGeneration = require("../../gameOfLife/gameOfLife")
    .retrieveNextGeneration;
  var grid;

  beforeEach(function name() {
    grid = generateGrid(5, 7);
  });

  it("should return grid with same length", function () {
    expect(retrieveNextGeneration(grid).length).toEqual(5);
    expect(retrieveNextGeneration(grid)[0].length).toEqual(7);
  });

  it("cell [2][3] need to die of loneliness", function () {
    grid[2][3].alive = true;
    expect(retrieveNextGeneration(grid)[2][3].alive).toBeFalsy();
  });

  it("cell [2][3] need to die of crowdedness", function () {
    grid[2][3].alive = true;
    grid[1][3].alive = true;
    grid[1][2].alive = true;
    grid[3][3].alive = true;
    expect(retrieveNextGeneration(grid)[2][3].alive).toBeFalsy();
  });

  it("cell [2][3] need to reborn", function () {
    grid[2][3].alive = false;
    grid[1][3].alive = true;
    grid[1][2].alive = true;
    grid[3][3].alive = true;
    expect(retrieveNextGeneration(grid)[2][3].alive).toBeTruthy();
  });

  it("cell [4][4] need to die of loneliness", function () {
    grid[4][4].alive = true;
    grid[4][3].alive = true;
    expect(retrieveNextGeneration(grid)[2][3].alive).toBeFalsy();
  });

  it("cell [4][4] need to die of crowdedness", function () {
    grid[4][4].alive = true;
    grid[3][5].alive = true;
    grid[4][5].alive = true;
    grid[4][3].alive = true;
    expect(retrieveNextGeneration(grid)[4][4].alive).toBeFalsy();
  });

  it("cell [4][4] need to reborn", function () {
    grid[4][4].alive = false;
    grid[3][5].alive = true;
    grid[4][5].alive = true;
    grid[4][3].alive = true;
    expect(retrieveNextGeneration(grid)[4][4].alive).toBeTruthy();
  });
});
