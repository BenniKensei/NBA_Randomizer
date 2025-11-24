import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Users, Copy, Check } from 'lucide-react';

interface MultiplayerSetupProps {
  onCreateGame: () => void;
  onJoinGame: (gameId: string) => void;
  gameUrl?: string;
  isWaitingForPlayer?: boolean;
}

export function MultiplayerSetup({ 
  onCreateGame, 
  onJoinGame, 
  gameUrl,
  isWaitingForPlayer 
}: MultiplayerSetupProps) {
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (gameUrl) {
      // Fallback method that works in all browsers
      const textArea = document.createElement('textarea');
      textArea.value = gameUrl;
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
    }
  };

  const handleJoin = () => {
    if (joinCode.trim().length === 6) {
      onJoinGame(joinCode.trim().toUpperCase());
    }
  };

  if (isWaitingForPlayer && gameUrl) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700">
        <div className="text-center mb-6">
          <Users className="w-12 h-12 text-orange-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Waiting for Player 2...</h3>
          <p className="text-slate-400 text-sm">Share this link with your friend</p>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={gameUrl}
              readOnly
              className="flex-1 bg-slate-800 text-white px-3 py-2 rounded border border-slate-600 text-sm"
            />
            <Button
              onClick={handleCopyLink}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-4"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
        
        <p className="text-slate-500 text-xs text-center">
          Game Code: <span className="font-bold text-orange-500 text-lg">{gameUrl.split('game=')[1]}</span>
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
          <div>
            <Button
              onClick={onCreateGame}
              className="w-full py-4 text-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              Create Online Game
            </Button>
            <p className="text-slate-400 text-xs mt-2 text-center">
              Create a game and share the link with a friend
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
                disabled={joinCode.length !== 6}
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
