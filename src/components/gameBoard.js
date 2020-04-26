import React, { Component } from "react";
import {
  generateGrid,
  retrieveNextGeneration,
  retrieveCellNeighbors,
} from "../gameOfLife/gameOfLife";

let actionsToExecute = [];

class GameBoard extends Component {
  /*
  Component constructor
  */
  constructor() {
    super();

    // Initializing component state
    this.state = {
      board: generateGrid(50, 50),
      notify: false,
    };
  }

  componentDidMount() {
    // Starting game
    this._nextStep();
  }
  /*
   Executing next step of game 
  */
  _nextStep() {
    // Setting timeout wait before executing next step
    setTimeout(() => {
      let board = this.state.board;

      for (let i = 0; i < actionsToExecute.length; i++) {
        let action = actionsToExecute.pop();
        let neighbors = retrieveCellNeighbors(board, action[0], action[1]);

        for (let neighbor of neighbors) {
          neighbor.alive = true;
        }
        board[action[0]][action[0]].alive = true;
      }

      // Executing next step
      this.setState({
        board: retrieveNextGeneration(board),
      });

      // Setting time for next step execution
      this._nextStep();
    }, 200);
  }

  /*
  Rendering component
  */
  render() {
    return <div className="Board">{this._renderBoard()}</div>;
  }

  /*
    Rendering board
    */
  _renderBoard() {
    return (
      <table>
        {this._renderTableHead() /*Rendering table head*/}
        {this._renderTableBody() /*Rendering table body*/}
      </table>
    );
  }

  /*
    Rendering table head
    */
  _renderTableHead() {
    return null;
  }

  _wakeUp(rowidx, colidx) {
    actionsToExecute.push([rowidx, colidx]);
    this.setState({ notify: !this.state.notify });
  }

  /*
    Rendering table body
    */
  _renderTableBody() {
    return (
      <tbody>
        {this.state.board.map((row, rowidx) => {
          return (
            // Creating table row
            <tr key={rowidx}>
              {
                // Creating row cells
                this.state.board[rowidx].map((col, colidx) => {
                  if (this.state.board[rowidx][colidx].alive) {
                    return <td className="alive" key={colidx}></td>;
                  } else {
                    return (
                      <td
                        onClick={this._wakeUp.bind(this, rowidx, colidx)}
                        className="dead"
                        key={colidx}
                      ></td>
                    );
                  }
                }, this)
              }
            </tr>
          );
        }, this)}{" "}
      </tbody>
    );
  }
}

export default GameBoard;
