'use client';

import { useTicTacToeStore } from '@/lib/tic-tac-toe-store';

/**
 * Individual cell component for the tic-tac-toe board
 */
const Cell = ({ index, value, onClick }: { 
  index: number; 
  value: string | null; 
  onClick: () => void;
}) => {
  return (
    <button
      className="w-20 h-20 border-2 border-gray-400 bg-white hover:bg-gray-50 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 text-2xl font-bold text-gray-800 transition-colors duration-200
                 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={value !== null}
      aria-label={`Cell ${index + 1}${value ? `, contains ${value}` : ', empty'}`}
    >
      {value}
    </button>
  );
};

/**
 * Game status display component
 */
const GameStatus = ({ 
  winner, 
  isDraw, 
  currentPlayer, 
  isGameOver 
}: { 
  winner: string | null; 
  isDraw: boolean; 
  currentPlayer: string; 
  isGameOver: boolean;
}) => {
  if (winner) {
    return (
      <div className="text-2xl font-bold text-green-600">
        Player {winner} wins! 🎉
      </div>
    );
  }
  
  if (isDraw) {
    return (
      <div className="text-2xl font-bold text-yellow-600">
        It&apos;s a draw! 🤝
      </div>
    );
  }
  
  return (
    <div className="text-xl font-semibold text-gray-700">
      Current player: <span className="text-blue-600">{currentPlayer}</span>
    </div>
  );
};

/**
 * Main tic-tac-toe game component
 */
export default function TicTacToePage() {
  const { 
    board, 
    currentPlayer, 
    winner, 
    isDraw, 
    isGameOver, 
    makeMove, 
    resetGame 
  } = useTicTacToeStore();

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Tic Tac Toe
          </h1>
          
          <GameStatus 
            winner={winner}
            isDraw={isDraw}
            currentPlayer={currentPlayer}
            isGameOver={isGameOver}
          />
          
          <div className="mt-8 mb-8">
            <div className="grid grid-cols-3 gap-1 max-w-xs mx-auto bg-gray-400 p-1">
              {board.map((cell, index) => (
                <Cell
                  key={index}
                  index={index}
                  value={cell}
                  onClick={() => makeMove(index)}
                />
              ))}
            </div>
          </div>
          
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 
                       rounded-lg transition-colors duration-200 focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={resetGame}
          >
            New Game
          </button>
          
          <div className="mt-8 text-sm text-gray-600">
            <p>Click on empty cells to make your move!</p>
          </div>
        </div>
      </div>
    </div>
  );
}