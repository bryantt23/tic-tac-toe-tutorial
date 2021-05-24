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
      // const boardRow = document.createElement('div');
      // boardRow.className = 'board-row';
      const arr = [];
      for (let j = 0; j < 3; j++) {
        let square = this.renderSquare(index);
        arr.push(square);
        index++;
      }

      const boardRow = (
        <div className='board-row' key={i}>
          {arr.map(child => {
            console.log(
              '🚀 ~ file: index.js ~ line 45 ~ Board ~ buildBoard ~ boardIndex',
              boardIndex
            );

            return <span key={boardIndex++}> {child}</span>;
          })}
        </div>
      );
      boardArr.push(boardRow);

      // div.appendChild(boardRow);
    }
    // return <div></div>;
    return <div>{boardArr}</div>;
  }

  render() {
    return this.buildBoard();
    // return (
    //   <div>
    //     <div className='board-row'>
    //       {this.renderSquare(0)}
    //       {this.renderSquare(1)}
    //       {this.renderSquare(2)}
    //     </div>
    //     <div className='board-row'>
    //       {this.renderSquare(3)}
    //       {this.renderSquare(4)}
    //       {this.renderSquare(5)}
    //     </div>
    //     <div className='board-row'>
    //       {this.renderSquare(6)}
    //       {this.renderSquare(7)}
    //       {this.renderSquare(8)}
    //     </div>
    //   </div>
    // );
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
      selectedIndex: null
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
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      console.log(
        '🚀 ~ file: index.js ~ line 91 ~ Game ~ moves ~ step, move',
        step,
        move
      );
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
              console.log(
                '🚀 ~ file: index.js ~ line 97 ~ Game ~ moves ~ e',
                e
              );
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
          <div>{status}</div>
          <ol>{moves}</ol>
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
      return squares[a];
    }
  }
  return null;
}

ReactDOM.render(<Game />, document.getElementById('root'));
