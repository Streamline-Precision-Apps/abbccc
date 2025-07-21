import { create } from 'zustand';

export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[];

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
  isGameOver: boolean;
}

export interface GameActions {
  makeMove: (index: number) => void;
  resetGame: () => void;
}

export type TicTacToeStore = GameState & GameActions;

const WINNING_PATTERNS = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top-left to bottom-right
  [2, 4, 6], // diagonal top-right to bottom-left
];

/**
 * Check if there's a winner on the board
 */
const checkWinner = (board: Board): Player | null => {
  for (const [a, b, c] of WINNING_PATTERNS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player;
    }
  }
  return null;
};

/**
 * Check if the board is full (draw condition)
 */
const isBoardFull = (board: Board): boolean => {
  return board.every(cell => cell !== null);
};

/**
 * Create initial game state
 */
const createInitialState = (): GameState => ({
  board: Array(9).fill(null),
  currentPlayer: 'X',
  winner: null,
  isDraw: false,
  isGameOver: false,
});

export const useTicTacToeStore = create<TicTacToeStore>((set, get) => ({
  ...createInitialState(),
  
  makeMove: (index: number) => {
    const { board, currentPlayer, isGameOver } = get();
    
    // Don't allow moves if game is over or cell is already occupied
    if (isGameOver || board[index] !== null) {
      return;
    }
    
    // Make the move
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    
    // Check for winner
    const winner = checkWinner(newBoard);
    const isDraw = !winner && isBoardFull(newBoard);
    const newIsGameOver = winner !== null || isDraw;
    
    set({
      board: newBoard,
      currentPlayer: newIsGameOver ? currentPlayer : currentPlayer === 'X' ? 'O' : 'X',
      winner,
      isDraw,
      isGameOver: newIsGameOver,
    });
  },
  
  resetGame: () => {
    set(createInitialState());
  },
}));