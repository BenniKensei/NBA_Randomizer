import React, { useEffect, useRef } from 'react';
import { Shuffle, Clock, SkipForward } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SpinResult } from '@/types';
import { cardReveal, popInGrid } from '@/lib/animations';

interface SpinnerCardProps {
  isSpinning: boolean;
  spinResult: SpinResult | null;
  selectedPosition: string | null;
  availablePositions: string[];
  draftInput: string;
  onSpin: () => void;
  onInputChange: (value: string) => void;
  onPositionSelect: (position: string) => void;
  onSubmit: () => void;
  onSkipTeam: () => void;
  onSkipEra: () => void;
  skipUsed: boolean;
  skipEnabled: boolean;
}

export const SpinnerCard: React.FC<SpinnerCardProps> = ({
  isSpinning,
  spinResult,
  selectedPosition,
  availablePositions,
  draftInput,
  onSpin,
  onInputChange,
  onPositionSelect,
  onSubmit,
  onSkipTeam,
  onSkipEra,
  skipUsed,
  skipEnabled
}) => {
  const resultCardsRef = useRef<HTMLDivElement>(null);
  const positionGridRef = useRef<HTMLDivElement>(null);

  // Animate result cards when spin completes
  useEffect(() => {
    if (!isSpinning && spinResult && resultCardsRef.current) {
      cardReveal(resultCardsRef.current.children, { delay: 150, duration: 600 });
    }
  }, [isSpinning, spinResult]);

  // Animate position buttons when they appear
  useEffect(() => {
    if (spinResult && !isSpinning && positionGridRef.current) {
      popInGrid(positionGridRef.current.children, { from: 'center', delay: 80, duration: 500 });
    }
  }, [spinResult, isSpinning]);
  return (
    <Card className="p-8 text-center flex flex-col items-center justify-center min-h-[380px] shadow-2xl">
      {!spinResult && !isSpinning ? (
        <div className="animate-in fade-in zoom-in duration-300">
          <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-8 rounded-full mb-6 inline-block shadow-lg relative overflow-hidden border-[3px] border-black">
            {/* Basketball lines */}
            <div className="absolute top-[50%] left-0 right-0 h-[3px] bg-black opacity-30 rounded-full"></div>
            <div className="absolute top-0 bottom-0 left-[50%] w-[3px] bg-black opacity-30 rounded-full"></div>
            {/* Curved basketball seams */}
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
              <path d="M 20 10 Q 35 30, 35 50 T 20 90" stroke="black" strokeWidth="2" fill="none"/>
              <path d="M 80 10 Q 65 30, 65 50 T 80 90" stroke="black" strokeWidth="2" fill="none"/>
            </svg>
            <Shuffle size={56} className="animate-pulse text-white relative z-10 drop-shadow-lg" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Ready to Roll</h2>
          <p className="text-slate-500 mb-6 text-lg">
            Spin to get your <strong className="text-slate-800">Team & Era</strong> constraint, then pick your position.
          </p>
          <Button onClick={onSpin} className="w-full text-lg h-16 shadow-xl hover:shadow-2xl transition-all">
            🎲 SPIN WHEEL
          </Button>
        </div>
      ) : (
        <div className="w-full">
          {/* Result Display */}
          <div ref={resultCardsRef} className="space-y-4 mb-8">
            <div className={`p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border-2 border-slate-200 shadow-md transition-all ${isSpinning ? 'animate-pulse scale-105' : 'animate-in fade-in scale-in duration-500'}`}>
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Team Constraint</div>
                {!isSpinning && spinResult && skipEnabled && (
                  <button
                    onClick={onSkipTeam}
                    disabled={skipUsed}
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded transition-all ${
                      skipUsed
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                    title={skipUsed ? 'Skip already used' : 'Skip team (once per player)'}
                  >
                    <SkipForward size={14} />
                    {skipUsed && <span className="line-through">Skip</span>}
                    {!skipUsed && <span>Skip</span>}
                  </button>
                )}
              </div>
              <div className={`text-3xl md:text-4xl font-black leading-tight ${spinResult?.team.color || 'text-slate-800'} transition-colors duration-300`}>
                {spinResult?.team.name || "..."}
              </div>
            </div>

            <div className={`p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border-2 border-slate-200 shadow-md transition-all ${isSpinning ? 'animate-pulse scale-105' : 'animate-in fade-in scale-in duration-500 delay-100'}`}>
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time Period</div>
                {!isSpinning && spinResult && skipEnabled && (
                  <button
                    onClick={onSkipEra}
                    disabled={skipUsed}
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded transition-all ${
                      skipUsed
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                    title={skipUsed ? 'Skip already used' : 'Skip era (once per player)'}
                  >
                    <SkipForward size={14} />
                    {skipUsed && <span className="line-through">Skip</span>}
                    {!skipUsed && <span>Skip</span>}
                  </button>
                )}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-slate-700 flex items-center justify-center gap-3">
                <Clock size={28} className="text-slate-400" />
                {spinResult?.era || "..."}
              </div>
            </div>
          </div>

          {/* Input Phase */}
          {!isSpinning && spinResult && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
              {/* Position Selector */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-600 mb-2">
                  Select Position:
                </label>
                <div ref={positionGridRef} className="grid grid-cols-3 gap-2">
                  {availablePositions.map((pos) => (
                    <button
                      key={pos}
                      onClick={() => onPositionSelect(pos)}
                      className={`
                        px-4 py-3 rounded-lg font-bold text-sm transition-all
                        ${
                          selectedPosition === pos
                            ? 'bg-orange-500 text-white ring-2 ring-orange-300 scale-105'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
                        }
                      `}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Player Name Input */}
              {selectedPosition && (
                <>
                  <input
                    type="text"
                    value={draftInput}
                    onChange={(e) => onInputChange(e.target.value)}
                    placeholder={`Name a ${spinResult.team.name} ${selectedPosition}...`}
                    className="w-full p-4 text-lg border-2 border-slate-300 rounded-lg mb-4 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-center font-bold text-slate-800 placeholder:font-normal placeholder:text-slate-400"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSubmit()}
                  />
                  <Button 
                    onClick={onSubmit} 
                    disabled={!draftInput.trim()} 
                    className="w-full h-14 text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    🔒 Lock In Pick
                  </Button>
                </>
              )}
            </div>
          )}
          
          {isSpinning && (
            <div className="text-slate-400 font-bold text-lg animate-pulse">
              ⚡ Randomizing...
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
