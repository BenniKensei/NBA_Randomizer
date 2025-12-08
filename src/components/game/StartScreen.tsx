import React, { useEffect, useRef, useState } from 'react';
import { Trophy, Settings, Users, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MultiplayerSetup } from '@/components/game/MultiplayerSetup';
import { FloatingParticles } from '@/components/ui/FloatingParticles';
import { staggerFadeIn } from '@/lib/animations';
import { ERAS } from '@/constants/gameData';

interface StartScreenProps {
  onStart: (selectedEras: string[], noDuplicates: boolean, skipEnabled: boolean, moveEnabled: boolean) => void;
  hasStartedDraft?: boolean;
  onContinue?: () => void;
  onCreateOnlineGame?: (playerName: string) => void;
  onJoinOnlineGame?: (gameId: string, playerName: string) => void;
  multiplayerGameUrl?: string;
  isWaitingForPlayer?: boolean;
  hasActiveOnlineGame?: boolean;
}

export function StartScreen({ 
  onStart, 
  hasStartedDraft, 
  onContinue,
  onCreateOnlineGame,
  onJoinOnlineGame,
  multiplayerGameUrl,
  isWaitingForPlayer,
  hasActiveOnlineGame
}: StartScreenProps): JSX.Element {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [gameMode, setGameMode] = useState<'local' | 'online' | null>(null);
  const [selectedEras, setSelectedEras] = useState<string[]>(ERAS);
  const [noDuplicates, setNoDuplicates] = useState(false);
  const [skipEnabled, setSkipEnabled] = useState(true);
  const [moveEnabled, setMoveEnabled] = useState(true);

  // Reset to mode selection when hasStartedDraft becomes false
  useEffect(() => {
    if (!hasStartedDraft) {
      setGameMode(null);
    }
  }, [hasStartedDraft]);

  useEffect(() => {
    if (contentRef.current) {
      staggerFadeIn(contentRef.current.children, { delay: 200, duration: 800 });
    }
  }, []);

  const toggleEra = (era: string) => {
    setSelectedEras(prev => 
      prev.includes(era) 
        ? prev.filter(e => e !== era)
        : [...prev, era]
    );
  };

  const selectAll = () => setSelectedEras(ERAS);
  const deselectAll = () => setSelectedEras([]);

  const handleStart = () => {
    if (selectedEras.length === 0) {
      alert('Please select at least one era!');
      return;
    }
    onStart(selectedEras, noDuplicates, skipEnabled, moveEnabled);
  };

  const handleCreateOnlineGame = (playerName: string) => {
    if (selectedEras.length === 0) {
      alert('Please select at least one era!');
      return;
    }
    if (onCreateOnlineGame) {
      onCreateOnlineGame(playerName);
    }
  };

  const handleJoinOnlineGame = (gameId: string, playerName: string) => {
    if (onJoinOnlineGame) {
      onJoinOnlineGame(gameId, playerName);
    }
  };

  // Show mode selection if no mode is selected yet
  if (!gameMode && !hasStartedDraft && !isWaitingForPlayer && !hasActiveOnlineGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <FloatingParticles />
        <div ref={contentRef} className="max-w-md w-full text-center relative z-10">
          <div className="mb-8 flex justify-center text-red-600">
            <Trophy size={80} strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
            NBA DRAFT<br/>RANDOMIZER
          </h1>
          <p className="text-slate-300 mb-8 text-lg leading-relaxed">
            Spin for a random <span className="font-bold text-red-600">Team & Era</span>, then draft your best player for each position.
          </p>

          <div className="space-y-4 mb-6">
            <Button
              onClick={() => setGameMode('local')}
              className="w-full py-6 text-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow flex items-center justify-center gap-3"
            >
              <Gamepad2 size={24} />
              Local Multiplayer
            </Button>
            
            <Button
              onClick={() => setGameMode('online')}
              className="w-full py-6 text-xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 flex items-center justify-center gap-3"
            >
              <Users size={24} />
              Online Multiplayer
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Show mode selection with Continue button if there's an active online game
  if (!gameMode && hasActiveOnlineGame && !isWaitingForPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <FloatingParticles />
        <div ref={contentRef} className="max-w-md w-full text-center relative z-10">
          <div className="mb-8 flex justify-center text-red-600">
            <Trophy size={80} strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
            NBA DRAFT<br/>RANDOMIZER
          </h1>
          <p className="text-slate-300 mb-8 text-lg leading-relaxed">
            Spin for a random <span className="font-bold text-red-600">Team & Era</span>, then draft your best player for each position.
          </p>

          <div className="space-y-4 mb-6">
            {/* Continue Online Draft button */}
            <Button
              onClick={onContinue}
              className="w-full py-6 text-xl shadow-xl shadow-green-500/30 hover:shadow-green-500/50 transition-shadow bg-green-600 hover:bg-green-700 flex items-center justify-center gap-3"
            >
              <Users size={24} />
              Continue Online Draft
            </Button>
            
            <Button
              onClick={() => setGameMode('local')}
              className="w-full py-6 text-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow flex items-center justify-center gap-3"
            >
              <Gamepad2 size={24} />
              Local Multiplayer
            </Button>
            
            <Button
              onClick={() => setGameMode('online')}
              className="w-full py-6 text-xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 flex items-center justify-center gap-3"
            >
              <Users size={24} />
              New Online Game
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <FloatingParticles />
      <div ref={contentRef} className="max-w-md w-full text-center relative z-10">
        <div className="mb-8 flex justify-center text-red-600">
          <Trophy size={80} strokeWidth={1.5} />
        </div>
        <h1 className="text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
          NBA DRAFT<br/>RANDOMIZER
        </h1>
        <p className="text-slate-300 mb-8 text-lg leading-relaxed">
          Spin for a random <span className="font-bold text-red-600">Team & Era</span>, then draft your best player for each position.
          {gameMode && (
            <>
              <br/>
              <span className="text-sm font-medium mt-3 block text-slate-400 bg-slate-800/50 py-2 px-4 rounded-lg inline-block">
                {hasActiveOnlineGame || gameMode === 'online' ? '🌐 Online Multiplayer' : '🏀 1v1 Local Multiplayer'}
              </span>
            </>
          )}
        </p>

        {/* Back button when in mode selection */}
        {gameMode && (
          <button
            onClick={() => setGameMode(null)}
            className="w-full mb-4 text-slate-400 hover:text-white transition-colors text-sm"
          >
            ← Back to mode selection
          </button>
        )}

        {/* Show multiplayer setup for online mode */}
        {gameMode === 'online' && !isWaitingForPlayer && (
          <>
            {!showSettings && (
              <MultiplayerSetup
                onCreateGame={handleCreateOnlineGame}
                onJoinGame={handleJoinOnlineGame}
                gameUrl={multiplayerGameUrl}
                isWaitingForPlayer={isWaitingForPlayer}
              />
            )}
          </>
        )}
        
        {/* Show waiting screen when waiting for player */}
        {gameMode === 'online' && isWaitingForPlayer && (
          <MultiplayerSetup
            onCreateGame={handleCreateOnlineGame}
            onJoinGame={handleJoinOnlineGame}
            gameUrl={multiplayerGameUrl}
            isWaitingForPlayer={isWaitingForPlayer}
          />
        )}
        
        {/* Settings Button - only show for local mode or when configuring online game */}
        {(gameMode === 'local' || (gameMode === 'online' && !isWaitingForPlayer)) && (
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full mb-4 flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-700/50 py-3 px-4 rounded-lg"
          >
            <Settings size={20} />
            <span className="font-medium">Game Settings</span>
          </button>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-6 bg-slate-800/80 rounded-lg p-5 text-left backdrop-blur-sm border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold text-lg">Select Eras</h3>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  Select All
                </button>
                <span className="text-slate-600">|</span>
                <button
                  onClick={deselectAll}
                  className="text-xs text-red-400 hover:text-red-300 font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {ERAS.map((era) => (
                <label
                  key={era}
                  className="flex items-center gap-3 p-2 rounded hover:bg-slate-700/50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedEras.includes(era)}
                    onChange={() => toggleEra(era)}
                    className="w-4 h-4 rounded border-slate-600 text-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 bg-slate-700 cursor-pointer"
                  />
                  <span className="text-slate-200 text-sm font-medium">{era}</span>
                </label>
              ))}
            </div>
            
            <div className="mt-4 text-center text-xs text-slate-400">
              {selectedEras.length} / {ERAS.length} eras selected
            </div>
            
            {/* Game Features */}
            <div className="mt-5 pt-4 border-t border-slate-700 space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={noDuplicates}
                  onChange={(e) => setNoDuplicates(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 text-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 bg-slate-700 cursor-pointer"
                />
                <div className="flex-1">
                  <span className="text-slate-200 text-sm font-bold block">No Duplicate Teams</span>
                  <span className="text-slate-400 text-xs">Each team can only appear once per roster</span>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={skipEnabled}
                  onChange={(e) => setSkipEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 text-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 bg-slate-700 cursor-pointer"
                />
                <div className="flex-1">
                  <span className="text-slate-200 text-sm font-bold block">Enable Skip Ability</span>
                  <span className="text-slate-400 text-xs">Each player can skip one team or era per game</span>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={moveEnabled}
                  onChange={(e) => setMoveEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 text-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 bg-slate-700 cursor-pointer"
                />
                <div className="flex-1">
                  <span className="text-slate-200 text-sm font-bold block">Enable Move Ability</span>
                  <span className="text-slate-400 text-xs">Each player can move one drafted player to an empty slot per game</span>
                </div>
              </label>
            </div>
          </div>
        )}
        
        {/* Continue Draft button - only for local/resumed games */}
        {hasStartedDraft && onContinue && gameMode === 'local' && (
          <Button onClick={onContinue} className="w-full py-5 text-xl mb-4 shadow-xl shadow-green-500/30 hover:shadow-green-500/50 transition-shadow bg-green-600 hover:bg-green-700">
            Continue Draft
          </Button>
        )}
        
        {/* Show start button for local mode */}
        {gameMode === 'local' && !isWaitingForPlayer && (
          <Button onClick={handleStart} className="w-full py-5 text-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow">
            Start Draft
          </Button>
        )}
        
        {/* Fallback: If no mode selected and we're in the main render, show mode selection */}
        {!gameMode && !isWaitingForPlayer && (
          <div className="space-y-4 mb-6">
            <Button
              onClick={() => setGameMode('local')}
              className="w-full py-6 text-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow flex items-center justify-center gap-3"
            >
              <Gamepad2 size={24} />
              Local Multiplayer
            </Button>
            
            <Button
              onClick={() => setGameMode('online')}
              className="w-full py-6 text-xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 flex items-center justify-center gap-3"
            >
              <Users size={24} />
              Online Multiplayer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
