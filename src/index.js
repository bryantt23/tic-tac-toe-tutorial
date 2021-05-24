import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className='square' onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  buildBoard() {
    const size = 3;

    let index = 0,
      boardIndex = 0;
    const boardArr = [];

    for (let i = 0; i < size; i++) {
      const arr = [];
      for (let j = 0; j < 3; j++) {
        let square = this.renderSquare(index);
        arr.push(square);
        index++;
      }

      const boardRow = (
        <div className='board-row' key={i}>
          {arr.map(child => (
            <span key={boardIndex++}> {child}</span>
          ))}
        </div>
      );
      boardArr.push(boardRow);
    }
    return <div>{boardArr}</div>;
  }

  render() {
    return this.buildBoard();
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      xIsNext: true,
      r: null,
      c: null,
      selectedIndex: null,
      movesAscOrder: true
    };
  }

  handleClick = i => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    const r = Math.floor(i / 3),
      c = i % 3;

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{ squares: squares, row: r, col: c }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      selectedIndex: null
    });
  };

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const obj = calculateWinner(current.squares);
    const winner = !obj ? null : obj.winner;

    const moves = history.map((step, move) => {
      const desc = move
        ? 'Go to move #' + move + ' row: ' + step.row + ' col: ' + step.col
        : 'Go to game start';
      return (
        <li key={move}>
          <button
            style={{
              backgroundColor:
                this.state.selectedIndex === move ? 'green' : null
            }}
            onClick={e => {
              this.jumpTo(move);
              this.setState({ selectedIndex: move });
            }}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className='game'>
        <div className='game-board'>
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className='game-info'>
          <button
            onClick={() => {
              this.setState({ movesAscOrder: !this.state.movesAscOrder });
            }}
          >
            Change moves to{' '}
            {this.state.movesAscOrder ? 'descending' : 'ascending'} order
          </button>

          <div>{status}</div>
          <ol>{this.state.movesAscOrder ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a] };
    }
  }
  return null;
}

ReactDOM.render(<Game />, document.getElementById('root'));
