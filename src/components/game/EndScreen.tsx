import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RosterDisplay } from '@/components/game/RosterDisplay';
import { Roster } from '@/types';

interface EndScreenProps {
  p1Roster: Roster;
  p2Roster: Roster;
  onRestart: () => void;
}

export const EndScreen: React.FC<EndScreenProps> = ({ p1Roster, p2Roster, onRestart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2 animate-in fade-in slide-in-from-top duration-500">
            🏆 DRAFT COMPLETE 🏆
          </h1>
          <p className="text-slate-600 text-lg">Compare your rosters! Who has the better squad?</p>
          <Button onClick={onRestart} variant="outline" className="mt-6 shadow-lg hover:shadow-xl transition-shadow">
            <RotateCcw size={18} /> Play Again
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom duration-700">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <RosterDisplay 
              playerNum={1} 
              roster={p1Roster} 
              gameFinished={true} 
              gameStarted={false} 
              pickIndex={0}
              onMovePlayer={() => {}}
              moveUsed={false}
              selectedPlayerToMove={null}
              setSelectedPlayerToMove={() => {}}
              currentPlayer={1}
              moveEnabled={false}
            />
          </Card>
          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <RosterDisplay 
              playerNum={2} 
              roster={p2Roster} 
              gameFinished={true} 
              gameStarted={false} 
              pickIndex={0}
              onMovePlayer={() => {}}
              moveUsed={false}
              selectedPlayerToMove={null}
              setSelectedPlayerToMove={() => {}}
              currentPlayer={2}
              moveEnabled={false}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
