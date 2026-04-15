import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Users, Copy, Check } from 'lucide-react';

interface MultiplayerSetupProps {
  /** Creates a new multiplayer room for the current host. */
  onCreateGame: (playerName: string) => void;
  /** Joins a remote room using the game code entered by the user. */
  onJoinGame: (gameId: string, playerName: string) => void;
  gameUrl?: string;
  isWaitingForPlayer?: boolean;
}

/**
 * Multiplayer lobby and join form.
 * It intentionally keeps the join code UX simple because the room code is the
 * only identifier players need to share outside the app.
 */
export function MultiplayerSetup({ 
  onCreateGame, 
  onJoinGame, 
  gameUrl,
  isWaitingForPlayer 
}: MultiplayerSetupProps) {
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [copied, setCopied] = useState(false);

  /**
   * Accepts only fully-formed room codes and non-empty names so we fail fast
   * before hitting Firebase with a malformed join request.
   */
  const handleJoin = () => {
    if (joinCode.trim().length === 6 && playerName.trim()) {
      onJoinGame(joinCode.trim().toUpperCase(), playerName.trim());
    }
  };

  /**
   * Uses the legacy clipboard fallback so sharing works even in browsers that
   * do not support the modern async clipboard API in this context.
   */
  const handleCopyCode = (code: string) => {
    // Fallback method that works in all browsers
    const textArea = document.createElement('textarea');
    textArea.value = code;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
    
    document.body.removeChild(textArea);
  };

  if (isWaitingForPlayer && gameUrl) {
    // The room code is encoded in the shareable URL so the waiting state can be
    // restored from a copied link without exposing extra session data.
    const gameCode = gameUrl.split('game=')[1];
    
    return (
      <div className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700">
        <div className="text-center mb-6">
          <Users className="w-12 h-12 text-orange-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Waiting for Player 2...</h3>
          <p className="text-slate-400 text-sm">Share this code with your friend</p>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-6 mb-4">
          <p className="text-slate-400 text-xs text-center mb-2">Game Code</p>
          <div className="flex items-center justify-center gap-3">
            <span className="font-bold text-orange-500 text-4xl tracking-widest font-mono">{gameCode}</span>
            <Button
              onClick={() => handleCopyCode(gameCode)}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-4"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          </div>
        </div>
        
        <p className="text-slate-400 text-xs text-center">
          Player 2 should enter this code on the join screen
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Users className="text-orange-500" />
          Online Multiplayer
        </h3>
        
        <div className="space-y-4">
          {/* Single Name Input at the top */}
          <div>
            <label className="block text-slate-300 text-sm font-bold mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Create Game Button */}
          <div>
            <Button
              onClick={() => onCreateGame(playerName.trim())}
              disabled={!playerName.trim()}
              className="w-full py-4 text-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              Create Online Game
            </Button>
            <p className="text-slate-400 text-xs mt-2 text-center">
              Create a game and share the code with a friend
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">or</span>
            </div>
          </div>
          
          {/* Join Game Section */}
          <div>
            <label className="block text-slate-300 text-sm font-bold mb-2">
              Join Game Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="flex-1 bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-orange-500 focus:outline-none text-center text-lg font-mono tracking-widest"
              />
              <Button
                onClick={handleJoin}
                disabled={joinCode.length !== 6 || !playerName.trim()}
                className="px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed"
              >
                Join
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
