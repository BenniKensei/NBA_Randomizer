'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Users, Home, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';
import { RosterDisplay } from '@/components/game/RosterDisplay';
import { StartScreen } from '@/components/game/StartScreen';
import { EndScreen } from '@/components/game/EndScreen';
import { SpinnerCard } from '@/components/game/SpinnerCard';
import { TEAMS, ERAS, POSITIONS } from '@/constants/gameData';
import { SpinResult, Player, Roster } from '@/types';
import { buttonPress } from '@/lib/animations';

export default function Game() {
  // Game State
  const [gameStarted, setGameStarted] = useState(false);
  const [pickIndex, setPickIndex] = useState(0);
  const [p1Roster, setP1Roster] = useState<Roster>(Array(6).fill(null));
  const [p2Roster, setP2Roster] = useState<Roster>(Array(6).fill(null));
  const [gameFinished, setGameFinished] = useState(false);
  const [activeEras, setActiveEras] = useState<string[]>(ERAS);
  const [noDuplicatesMode, setNoDuplicatesMode] = useState(false);
  const [usedTeams, setUsedTeams] = useState<string[]>([]);
  const [p1SkipUsed, setP1SkipUsed] = useState(false);
  const [p2SkipUsed, setP2SkipUsed] = useState(false);
  const [p1MoveUsed, setP1MoveUsed] = useState(false);
  const [p2MoveUsed, setP2MoveUsed] = useState(false);
  const [selectedPlayerToMove, setSelectedPlayerToMove] = useState<number | null>(null);
  const [skipEnabled, setSkipEnabled] = useState(true);
  const [moveEnabled, setMoveEnabled] = useState(true);

  // Spin State
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [draftInput, setDraftInput] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  // Derived State
  const currentPlayer = (pickIndex % 2 === 0 ? 1 : 2) as 1 | 2;
  const picksPerPlayer = Math.floor(pickIndex / 2) + (pickIndex % 2);
  const currentRoster = currentPlayer === 1 ? p1Roster : p2Roster;
  const availablePositions = POSITIONS.filter((_, idx) => currentRoster[idx] === null);

  // Refs for animation intervals
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load game state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('nba-draft-game');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setGameStarted(parsed.gameStarted || false);
        setPickIndex(parsed.pickIndex || 0);
        setP1Roster(parsed.p1Roster || Array(6).fill(null));
        setP2Roster(parsed.p2Roster || Array(6).fill(null));
        setGameFinished(parsed.gameFinished || false);
      } catch (e) {
        console.error('Failed to load saved game:', e);
      }
    }
  }, []);

  // Save game state to localStorage
  useEffect(() => {
    if (gameStarted || gameFinished) {
      localStorage.setItem('nba-draft-game', JSON.stringify({
        gameStarted,
        pickIndex,
        p1Roster,
        p2Roster,
        gameFinished
      }));
    }
  }, [gameStarted, pickIndex, p1Roster, p2Roster, gameFinished]);

  const startGame = (selectedEras?: string[], noDuplicates?: boolean, skipEnabledSetting?: boolean, moveEnabledSetting?: boolean) => {
    setGameStarted(true);
    setPickIndex(0);
    setP1Roster(Array(6).fill(null));
    setP2Roster(Array(6).fill(null));
    setGameFinished(false);
    setSpinResult(null);
    setDraftInput("");
    setSelectedPosition(null);
    setUsedTeams([]);
    setP1SkipUsed(false);
    setP2SkipUsed(false);
    setP1MoveUsed(false);
    setP2MoveUsed(false);
    setSelectedPlayerToMove(null);
    if (selectedEras) {
      setActiveEras(selectedEras);
    }
    if (noDuplicates !== undefined) {
      setNoDuplicatesMode(noDuplicates);
    }
    if (skipEnabledSetting !== undefined) {
      setSkipEnabled(skipEnabledSetting);
    }
    if (moveEnabledSetting !== undefined) {
      setMoveEnabled(moveEnabledSetting);
    }
  };

  const backToMenu = () => {
    setGameStarted(false);
    setPickIndex(0);
    setP1Roster(Array(6).fill(null));
    setP2Roster(Array(6).fill(null));
    setGameFinished(false);
    setSpinResult(null);
    setDraftInput("");
    setSelectedPosition(null);
    setActiveEras(ERAS);
    setNoDuplicatesMode(false);
    setUsedTeams([]);
    setP1SkipUsed(false);
    setP2SkipUsed(false);
    setP1MoveUsed(false);
    setP2MoveUsed(false);
    setSelectedPlayerToMove(null);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, callback: () => void) => {
    const target = e.currentTarget;
    buttonPress(target);
    setTimeout(callback, 100);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the game? All progress will be lost.')) {
      startGame();
    }
  };

  const handleSpin = () => {
    setIsSpinning(true);
    setSpinResult(null);
    
    let counter = 0;
    const maxSpins = 20;
    
    spinIntervalRef.current = setInterval(() => {
      const randomTeam = TEAMS[Math.floor(Math.random() * TEAMS.length)];
      const randomEra = ERAS[Math.floor(Math.random() * ERAS.length)];
      setSpinResult({ team: randomTeam, era: randomEra });
      
      counter++;
      if (counter >= maxSpins) {
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
        finalizeSpin();
      }
    }, 100);
  };

  const finalizeSpin = () => {
    let availableTeams = TEAMS;

    if (noDuplicatesMode) {
      availableTeams = TEAMS.filter(team => !usedTeams.includes(team.name));
      if (availableTeams.length === 0) availableTeams = TEAMS;
    }

    const finalTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
    const finalEra = activeEras[Math.floor(Math.random() * activeEras.length)];
    setSpinResult({ team: finalTeam, era: finalEra });
    setIsSpinning(false);
  };

  const submitPick = () => {
    if (!draftInput.trim() || !spinResult || !selectedPosition) return;

    const posIndex = POSITIONS.indexOf(selectedPosition);
    const pickData: Player = {
      name: draftInput.trim(),
      team: spinResult.team.name,
      era: spinResult.era,
      position: selectedPosition
    };

    if (currentPlayer === 1) {
      const newRoster = [...p1Roster];
      newRoster[posIndex] = pickData;
      setP1Roster(newRoster);
    } else {
      const newRoster = [...p2Roster];
      newRoster[posIndex] = pickData;
      setP2Roster(newRoster);
    }

    if (noDuplicatesMode) {
      setUsedTeams(prev => [...prev, spinResult.team.name]);
    }

    setDraftInput("");
    setSpinResult(null);
    setSelectedPosition(null);

    if (pickIndex === 11) {
      setGameFinished(true);
    } else {
      setPickIndex(prev => prev + 1);
    }
  };

  const skipTeam = () => {
    const currentSkipUsed = currentPlayer === 1 ? p1SkipUsed : p2SkipUsed;
    if (!spinResult || currentSkipUsed) return;
    
    let availableTeams = TEAMS.filter(team => team.name !== spinResult.team.name);
    if (noDuplicatesMode) {
      availableTeams = availableTeams.filter(team => !usedTeams.includes(team.name));
    }
    if (availableTeams.length === 0) return;
    
    const newTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
    setSpinResult({ ...spinResult, team: newTeam });
    
    if (currentPlayer === 1) {
      setP1SkipUsed(true);
    } else {
      setP2SkipUsed(true);
    }
  };

  const skipEra = () => {
    const currentSkipUsed = currentPlayer === 1 ? p1SkipUsed : p2SkipUsed;
    if (!spinResult || currentSkipUsed) return;
    
    const availableEras = activeEras.filter(era => era !== spinResult.era);
    if (availableEras.length === 0) return;
    
    const newEra = availableEras[Math.floor(Math.random() * availableEras.length)];
    setSpinResult({ ...spinResult, era: newEra });
    
    if (currentPlayer === 1) {
      setP1SkipUsed(true);
    } else {
      setP2SkipUsed(true);
    }
  };

  const handleMovePlayer = (fromIndex: number, toIndex: number) => {
    if (gameFinished) return;
    
    const moveUsed = currentPlayer === 1 ? p1MoveUsed : p2MoveUsed;
    if (moveUsed) return;

    const currentRosterState = currentPlayer === 1 ? p1Roster : p2Roster;
    
    // Check if source has a player and destination is empty
    if (!currentRosterState[fromIndex] || currentRosterState[toIndex]) return;

    const newRoster = [...currentRosterState];
    const player = newRoster[fromIndex]!;
    
    // Update player's position
    newRoster[toIndex] = { ...player, position: POSITIONS[toIndex] };
    newRoster[fromIndex] = null;

    if (currentPlayer === 1) {
      setP1Roster(newRoster);
      setP1MoveUsed(true);
    } else {
      setP2Roster(newRoster);
      setP2MoveUsed(true);
    }

    setSelectedPlayerToMove(null);
  };

  // Clean up intervals
  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
    };
  }, []);

  // Render Views
  if (!gameStarted) {
    return <StartScreen onStart={startGame} />;
  }

  if (gameFinished) {
    return <EndScreen p1Roster={p1Roster} p2Roster={p2Roster} onRestart={startGame} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-slate-50 to-red-100 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 shadow-md sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 font-bold text-slate-800">
            <Users size={20} className="text-orange-500" />
            <span>Round {Math.floor(pickIndex / 2) + 1}/6</span>
          </div>
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <div className="font-black text-xl tracking-tighter text-slate-900">NBA RANDOMIZER</div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => handleButtonClick(e, handleReset)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 border border-slate-300 hover:border-red-300 active:scale-95"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
            <button 
              onClick={(e) => handleButtonClick(e, backToMenu)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50 border border-slate-300 hover:border-blue-300 active:scale-95"
            >
              <Home size={16} />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Roster (Player 1) */}
          <div className="hidden lg:flex lg:flex-col lg:col-span-3">
            <Card className="p-4 flex-1 border-t-4 border-t-blue-500 shadow-xl overflow-y-auto">
              <RosterDisplay 
                playerNum={1} 
                roster={p1Roster} 
                gameFinished={gameFinished}
                gameStarted={gameStarted}
                pickIndex={pickIndex}
                onMovePlayer={handleMovePlayer}
                moveUsed={p1MoveUsed}
                selectedPlayerToMove={selectedPlayerToMove}
                setSelectedPlayerToMove={setSelectedPlayerToMove}
                currentPlayer={currentPlayer}
                moveEnabled={moveEnabled}
              />
            </Card>
            
            {/* Player 1 Actions Panel */}
            {(skipEnabled || moveEnabled) && (
            <Card className="p-3 flex-shrink-0 border-l-4 border-l-blue-500 shadow-lg">
              <div className="space-y-2">
                {skipEnabled && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">SKIP</span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${p1SkipUsed ? 'bg-slate-200 text-slate-400 line-through' : 'bg-blue-100 text-blue-700'}`}>
                    {p1SkipUsed ? 'Used' : 'Available'}
                  </span>
                </div>
                )}
                {moveEnabled && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">MOVE</span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${p1MoveUsed ? 'bg-slate-200 text-slate-400 line-through' : 'bg-blue-100 text-blue-700'}`}>
                    {p1MoveUsed ? 'Used' : 'Available'}
                  </span>
                </div>
                )}
              </div>
            </Card>
            )}
          </div>

          {/* Center Action Zone */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Turn Indicator */}
            <div className={`
              text-center py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-top
              ${currentPlayer === 1 ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-red-600 to-red-500'}
            `}>
              <span className="text-lg">Player {currentPlayer}&apos;s Turn to Draft</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg ml-3 text-base font-black">
                Pick {picksPerPlayer}/6
              </span>
            </div>

            {/* The Randomizer Card */}
            <SpinnerCard
              isSpinning={isSpinning}
              spinResult={spinResult}
              selectedPosition={selectedPosition}
              availablePositions={availablePositions}
              draftInput={draftInput}
              onSpin={handleSpin}
              onInputChange={setDraftInput}
              onPositionSelect={setSelectedPosition}
              onSubmit={submitPick}
              onSkipTeam={skipTeam}
              onSkipEra={skipEra}
              skipUsed={currentPlayer === 1 ? p1SkipUsed : p2SkipUsed}
              skipEnabled={skipEnabled}
            />

            {/* Mobile View Rosters */}
            <div className="lg:hidden grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border-2 border-blue-200 shadow-md">
                <div className="text-center font-bold text-blue-800 text-sm mb-2">Player 1</div>
                {p1Roster.map((p, i) => (
                  <div 
                    key={i} 
                    className={`text-xs p-2 mb-1 rounded transition-all ${
                      p ? 'bg-white shadow-sm font-medium' : 'bg-blue-100 text-blue-300'
                    }`}
                  >
                    {p ? `${POSITIONS[i]}: ${p.name}` : `${POSITIONS[i]}: -`}
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg border-2 border-red-200 shadow-md">
                <div className="text-center font-bold text-red-800 text-sm mb-2">Player 2</div>
                {p2Roster.map((p, i) => (
                  <div 
                    key={i} 
                    className={`text-xs p-2 mb-1 rounded transition-all ${
                      p ? 'bg-white shadow-sm font-medium' : 'bg-red-100 text-red-300'
                    }`}
                  >
                    {p ? `${POSITIONS[i]}: ${p.name}` : `${POSITIONS[i]}: -`}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Roster (Player 2) */}
          <div className="hidden lg:flex lg:flex-col lg:col-span-3">
            <Card className="p-4 flex-1 border-t-4 border-t-red-500 shadow-xl overflow-y-auto">
              <RosterDisplay 
                playerNum={2}
                roster={p2Roster}
                gameFinished={gameFinished}
                gameStarted={gameStarted}
                pickIndex={pickIndex}
                onMovePlayer={handleMovePlayer}
                moveUsed={p2MoveUsed}
                selectedPlayerToMove={selectedPlayerToMove}
                setSelectedPlayerToMove={setSelectedPlayerToMove}
                currentPlayer={currentPlayer}
                moveEnabled={moveEnabled}
              />
            </Card>
            
            {/* Player 2 Actions Panel */}
            {(skipEnabled || moveEnabled) && (
            <Card className="p-3 flex-shrink-0 border-l-4 border-l-red-500 shadow-lg">
              <div className="space-y-2">
                {skipEnabled && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">SKIP</span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${p2SkipUsed ? 'bg-slate-200 text-slate-400 line-through' : 'bg-red-100 text-red-700'}`}>
                    {p2SkipUsed ? 'Used' : 'Available'}
                  </span>
                </div>
                )}
                {moveEnabled && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">MOVE</span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${p2MoveUsed ? 'bg-slate-200 text-slate-400 line-through' : 'bg-red-100 text-red-700'}`}>
                    {p2MoveUsed ? 'Used' : 'Available'}
                  </span>
                </div>
                )}
              </div>
            </Card>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
