import React from 'react';
import { User, MoveRight } from 'lucide-react';
import { POSITIONS } from '@/constants/gameData';
import { Roster } from '@/types';

interface RosterDisplayProps {
  playerNum: 1 | 2;
  roster: Roster;
  gameFinished: boolean;
  gameStarted: boolean;
  pickIndex: number;
  onMovePlayer: (fromIndex: number, toIndex: number) => void;
  moveUsed: boolean;
  selectedPlayerToMove: number | null;
  setSelectedPlayerToMove: (index: number | null) => void;
  currentPlayer: 1 | 2;
  moveEnabled: boolean;
  isOnlineMode?: boolean;
  myPlayerNumber?: number | null;
  playerName?: string;
}

export const RosterDisplay: React.FC<RosterDisplayProps> = ({
  playerNum,
  roster,
  gameFinished,
  gameStarted,
  pickIndex,
  onMovePlayer,
  moveUsed,
  selectedPlayerToMove,
  setSelectedPlayerToMove,
  currentPlayer,
  moveEnabled,
  isOnlineMode = false,
  myPlayerNumber = null,
  playerName
}) => {
  const isPlayerTurn = !gameFinished && gameStarted && currentPlayer === playerNum;
  
  // In online mode, only allow moving your own roster
  const isMyRoster = isOnlineMode ? playerNum === myPlayerNumber : true;
  
  const handleSlotClick = (idx: number) => {
    if (!moveEnabled || moveUsed || !isMyRoster || playerNum !== currentPlayer || gameFinished) return;
    
    const player = roster[idx];
    
    if (selectedPlayerToMove === null) {
      // Select a player to move
      if (player) {
        setSelectedPlayerToMove(idx);
      }
    } else {
      // Move to empty slot or deselect
      if (idx === selectedPlayerToMove) {
        setSelectedPlayerToMove(null);
      } else if (!player) {
        onMovePlayer(selectedPlayerToMove, idx);
      }
    }
  };
  
  return (
    <div className="flex flex-col gap-2">
      <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 ${playerNum === 1 ? 'text-blue-600' : 'text-red-600'}`}>
        <User size={24} /> {playerName || `Player ${playerNum}`}
        {isPlayerTurn && (
          <span className="text-xs bg-orange-400 text-orange-900 px-2 py-1 rounded-full font-bold animate-pulse">
            Drafting...
          </span>
        )}
      </h3>
      {POSITIONS.map((pos, idx) => {
        const player = roster[idx];
        const isSelected = selectedPlayerToMove === idx && playerNum === currentPlayer && isMyRoster;
        const canMove = moveEnabled && !moveUsed && playerNum === currentPlayer && !gameFinished && isMyRoster;
        const isMovable = canMove && player && selectedPlayerToMove === null;
        const isMoveTarget = canMove && selectedPlayerToMove !== null && !player && selectedPlayerToMove !== idx;
        
        // For 6th Man position, show only the decade (remove parentheses content)
        const displayEra = player && idx === 5 ? player.era.split(' ')[0] : player?.era;
        
        return (
          <div 
            key={pos} 
            onClick={() => handleSlotClick(idx)}
            className={`
              relative p-3 rounded-lg border-2 transition-all
              ${isSelected ? 'ring-4 ring-green-400 border-green-400 bg-green-50' : ''}
              ${isMovable ? 'cursor-pointer hover:border-green-400 hover:shadow-lg' : ''}
              ${isMoveTarget ? 'cursor-pointer border-dashed border-green-400 bg-green-50 hover:bg-green-100' : ''}
              ${player 
                ? isPlayerTurn && !isSelected
                  ? 'bg-orange-50 border-orange-300 ring-2 ring-orange-200'
                  : !isSelected && 'bg-white border-slate-200 shadow-sm'
                : !isMoveTarget && 'bg-slate-50 border-slate-100 text-slate-400'}
            `}
          >
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded flex-shrink-0">{pos}</span>
              <div className="flex gap-1 items-center flex-shrink-0">
                {player && (
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap">{displayEra}</span>
                )}
                {isMovable && (
                  <MoveRight size={14} className="text-green-600 flex-shrink-0" />
                )}
                {isMoveTarget && (
                  <span className="text-xs text-green-600 font-bold whitespace-nowrap">Move here</span>
                )}
              </div>
            </div>
            
            {player ? (
              <div className="mt-1">
                <div className="font-bold text-slate-800 text-lg leading-tight break-words">
                  {player.name}
                  {isSelected && <span className="ml-2 text-green-600 text-sm whitespace-nowrap">✓ Selected</span>}
                </div>
                <div className="text-sm text-slate-500 font-medium break-words">{player.team}</div>
              </div>
            ) : (
              <div className="mt-2 text-center italic text-sm">
                {isMoveTarget ? 'Click to move here' : 'Empty Slot'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
