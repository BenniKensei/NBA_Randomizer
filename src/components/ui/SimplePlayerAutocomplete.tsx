import React, { useState, useEffect, useRef } from 'react';
import { filterPlayers, type PlayerInfo } from '../../constants/nbaPlayers';

interface SimplePlayerAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
}

export function SimplePlayerAutocomplete({
  value,
  onChange,
  placeholder = "Enter player name",
  maxLength = 50,
  className = "",
  disabled = false
}: SimplePlayerAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<PlayerInfo[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [justSelected, setJustSelected] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Don't show suggestions if we just selected a player
    if (justSelected) {
      setJustSelected(false);
      return;
    }
    
    if (value.trim().length >= 2) {
      const filtered = filterPlayers(value);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [value, justSelected]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          selectPlayer(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectPlayer = (player: PlayerInfo) => {
    setJustSelected(true);
    onChange(player.name);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    
    // Blur the input to fully close the dropdown
    if (wrapperRef.current) {
      const input = wrapperRef.current.querySelector('input');
      if (input) {
        input.blur();
      }
    }
  };

  // Force input field to show suggestions again when user types after selection
  const handleInputChange = (newValue: string) => {
    setJustSelected(false); // User is typing, not selecting
    onChange(newValue);
    // If user is typing, show suggestions if criteria met
    if (newValue.trim().length >= 2) {
      const filtered = filterPlayers(newValue);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    }
  };

  // Handle focus - only show suggestions if there's text and user is actively typing
  const handleFocus = () => {
    if (value.trim().length >= 2 && !justSelected) {
      const filtered = filterPlayers(value);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className={className}
        autoComplete="off"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 z-[9999] mt-1 bg-white border-2 border-slate-300 rounded-lg shadow-2xl max-h-[200px] md:max-h-[280px] overflow-y-auto">
          {suggestions.map((player, index) => (
            <button
              key={`${player.name}-${index}`}
              type="button"
              onClick={() => selectPlayer(player)}
              className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-all duration-150 border-b border-slate-200 last:border-b-0 ${
                index === selectedIndex ? 'bg-slate-100 ring-2 ring-inset ring-slate-400' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex flex-col">
                    <span className="text-slate-900 font-semibold text-base">
                      {player.name}
                    </span>
                  </div>
                </div>
                <div 
                  className="px-3 py-1.5 rounded-md text-sm font-bold tracking-wide flex-shrink-0 bg-slate-100 text-slate-700"
                >
                  {player.position}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
