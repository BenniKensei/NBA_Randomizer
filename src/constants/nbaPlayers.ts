// Comprehensive NBA players list (1960s - Present)
// Includes legends and current players for all eras with positions and teams
// This avoids API rate limits and loads instantly

export interface PlayerInfo {
  name: string;
  position: string;
  team: string;
  teamColor: string;
  teamHistory: string[]; // All teams this player has played for
}

export const NBA_PLAYERS: PlayerInfo[] = [
  // Modern Era Stars (2020s)
  { name: "Victor Wembanyama", position: "C", team: "SAS", teamColor: "#C4CED4", teamHistory: ["SAS"] },
  { name: "Chet Holmgren", position: "C", team: "OKC", teamColor: "#007AC1", teamHistory: ["OKC"] },
  { name: "Paolo Banchero", position: "F", team: "ORL", teamColor: "#0077C0", teamHistory: ["ORL"] },
  { name: "Scoot Henderson", position: "G", team: "POR", teamColor: "#E03A3E", teamHistory: ["POR"] },
  { name: "Brandon Miller", position: "F", team: "CHA", teamColor: "#1D1160", teamHistory: ["CHA"] },
  { name: "Amen Thompson", position: "G", team: "HOU", teamColor: "#CE1141", teamHistory: ["HOU"] },
  { name: "Ausar Thompson", position: "F", team: "DET", teamColor: "#C8102E", teamHistory: ["DET"] },
  { name: "Anthony Edwards", position: "G", team: "MIN", teamColor: "#0C2340", teamHistory: ["MIN"] },
  { name: "Lamelo Ball", position: "G", team: "CHA", teamColor: "#1D1160", teamHistory: ["CHA"] },
  { name: "Ja Morant", position: "G", team: "MEM", teamColor: "#5D76A9", teamHistory: ["MEM"] },
  { name: "Zion Williamson", position: "F", team: "NOP", teamColor: "#0C2340", teamHistory: ["NOP"] },
  { name: "Luka Doncic", position: "G-F", team: "DAL", teamColor: "#00538C", teamHistory: ["DAL"] },
  { name: "Trae Young", position: "G", team: "ATL", teamColor: "#E03A3E", teamHistory: ["ATL"] },
  { name: "Devin Booker", position: "G", team: "PHX", teamColor: "#1D1160", teamHistory: ["PHX"] },
  { name: "Donovan Mitchell", position: "G", team: "CLE", teamColor: "#860038", teamHistory: ["CLE"] },
  { name: "Jayson Tatum", position: "F", team: "BOS", teamColor: "#007A33", teamHistory: ["BOS"] },
  { name: "Jaylen Brown", position: "G-F", team: "BOS", teamColor: "#007A33", teamHistory: ["BOS"] },
  { name: "Shai Gilgeous-Alexander", position: "G", team: "OKC", teamColor: "#007AC1", teamHistory: ["OKC"] },
  { name: "Tyrese Maxey", position: "G", team: "PHI", teamColor: "#006BB6", teamHistory: ["PHI"] },
  { name: "Tyrese Haliburton", position: "G", team: "IND", teamColor: "#002D62", teamHistory: ["IND"] },
  { name: "Nikola Jokic", position: "C", team: "DEN", teamColor: "#0E2240", teamHistory: ["DEN"] },
  { name: "Joel Embiid", position: "C", team: "PHI", teamColor: "#006BB6", teamHistory: ["PHI"] },
  { name: "Giannis Antetokounmpo", position: "F", team: "MIL", teamColor: "#00471B", teamHistory: ["MIL"] },
  { name: "Damian Lillard", position: "G", team: "MIL", teamColor: "#00471B", teamHistory: ["MIL"] },
  
  // 2010s Stars
  { name: "Stephen Curry", position: "G", team: "GSW", teamColor: "#1D428A", teamHistory: ["GSW"] },
  { name: "Klay Thompson", position: "G", team: "DAL", teamColor: "#00538C", teamHistory: ["GSW", "DAL"] },
  { name: "Draymond Green", position: "F", team: "GSW", teamColor: "#1D428A", teamHistory: ["GSW"] },
  { name: "Kevin Durant", position: "F", team: "PHX", teamColor: "#1D1160", teamHistory: ["OKC", "GSW", "BKN", "PHX"] },
  { name: "James Harden", position: "G", team: "LAC", teamColor: "#C8102E", teamHistory: ["OKC", "HOU", "BKN", "PHI", "LAC"] },
  { name: "Russell Westbrook", position: "G", team: "DEN", teamColor: "#0E2240", teamHistory: ["OKC", "HOU", "WAS", "LAL", "LAC", "DEN"] },
  { name: "Kyrie Irving", position: "G", team: "DAL", teamColor: "#00538C", teamHistory: ["CLE", "BOS", "BKN", "DAL"] },
  { name: "Kawhi Leonard", position: "F", team: "LAC", teamColor: "#C8102E", teamHistory: ["SAS", "TOR", "LAC"] },
  { name: "Paul George", position: "F", team: "PHI", teamColor: "#006BB6", teamHistory: ["IND", "OKC", "LAC", "PHI"] },
  { name: "Jimmy Butler", position: "F", team: "MIA", teamColor: "#98002E", teamHistory: ["CHI", "MIN", "PHI", "MIA"] },
  { name: "Anthony Davis", position: "F-C", team: "LAL", teamColor: "#552583", teamHistory: ["NOP", "LAL"] },
  { name: "Karl-Anthony Towns", position: "C", team: "NYK", teamColor: "#006BB6", teamHistory: ["MIN", "NYK"] },
  { name: "DeMar DeRozan", position: "G-F", team: "SAC", teamColor: "#5A2D81", teamHistory: ["TOR", "SAS", "CHI", "SAC"] },
  { name: "Kyle Lowry", position: "G", team: "PHI", teamColor: "#006BB6", teamHistory: ["MEM", "HOU", "TOR", "MIA", "PHI"] },
  { name: "Chris Paul", position: "G", team: "SAS", teamColor: "#C4CED4", teamHistory: ["NOP", "LAC", "HOU", "OKC", "PHX", "GSW", "SAS"] },
  
  // 2000s-2010s Legends
  { name: "LeBron James", position: "F", team: "LAL", teamColor: "#552583", teamHistory: ["CLE", "MIA", "LAL"] },
  { name: "Kobe Bryant", position: "G", team: "LAL", teamColor: "#552583", teamHistory: ["LAL"] },
  { name: "Tim Duncan", position: "F-C", team: "SAS", teamColor: "#C4CED4", teamHistory: ["SAS"] },
  { name: "Dirk Nowitzki", position: "F", team: "DAL", teamColor: "#00538C", teamHistory: ["DAL"] },
  { name: "Kevin Garnett", position: "F-C", team: "BOS", teamColor: "#007A33", teamHistory: ["MIN", "BOS", "BKN"] },
  { name: "Paul Pierce", position: "F", team: "BOS", teamColor: "#007A33", teamHistory: ["BOS", "BKN", "WAS", "LAC"] },
  { name: "Ray Allen", position: "G", team: "MIA", teamColor: "#98002E", teamHistory: ["MIL", "SEA", "BOS", "MIA"] },
  { name: "Dwyane Wade", position: "G", team: "MIA", teamColor: "#98002E", teamHistory: ["MIA", "CHI", "CLE"] },
  { name: "Tony Parker", position: "G", team: "SAS", teamColor: "#C4CED4", teamHistory: ["SAS", "CHA"] },
  { name: "Manu Ginobili", position: "G", team: "SAS", teamColor: "#C4CED4", teamHistory: ["SAS"] },
  { name: "Steve Nash", position: "G", team: "PHX", teamColor: "#1D1160", teamHistory: ["PHX", "DAL", "LAL"] },
  { name: "Jason Kidd", position: "G", team: "DAL", teamColor: "#00538C", teamHistory: ["DAL", "PHX", "NJ", "NYK"] },
  { name: "Vince Carter", position: "G-F", team: "TOR", teamColor: "#CE1141", teamHistory: ["TOR", "NJ", "ORL", "PHX", "DAL", "MEM", "SAC", "ATL"] },
  { name: "Tracy McGrady", position: "F-G", team: "HOU", teamColor: "#CE1141", teamHistory: ["TOR", "ORL", "HOU", "NYK", "DET", "ATL", "SAS"] },
  { name: "Allen Iverson", position: "G", team: "PHI", teamColor: "#006BB6", teamHistory: ["PHI", "DEN", "DET", "MEM"] },
  { name: "Shaquille O'Neal", position: "C", team: "LAL", teamColor: "#552583", teamHistory: ["ORL", "LAL", "MIA", "PHX", "CLE", "BOS"] },
  { name: "Yao Ming", position: "C", team: "HOU", teamColor: "#CE1141", teamHistory: ["HOU"] },
  { name: "Pau Gasol", position: "F-C", team: "LAL", teamColor: "#552583", teamHistory: ["MEM", "LAL", "CHI", "SAS", "MIL"] },
  { name: "Chris Bosh", position: "F-C", team: "MIA", teamColor: "#98002E", teamHistory: ["TOR", "MIA"] },
  { name: "Amar'e Stoudemire", position: "F-C", team: "PHX", teamColor: "#1D1160", teamHistory: ["PHX", "NYK", "DAL", "MIA"] },
  
  // 1990s-2000s Stars
  { name: "Michael Jordan", position: "G", team: "CHI", teamColor: "#CE1141", teamHistory: ["CHI", "WAS"] },
  { name: "Scottie Pippen", position: "F", team: "CHI", teamColor: "#CE1141", teamHistory: ["CHI", "HOU", "POR"] },
  { name: "Dennis Rodman", position: "F", team: "CHI", teamColor: "#CE1141", teamHistory: ["DET", "SAS", "CHI", "LAL", "DAL"] },
  { name: "Karl Malone", position: "F", team: "UTA", teamColor: "#002B5C", teamHistory: ["UTA", "LAL"] },
  { name: "John Stockton", position: "G", team: "UTA", teamColor: "#002B5C", teamHistory: ["UTA"] },
  { name: "Gary Payton", position: "G", team: "SEA", teamColor: "#00653A", teamHistory: ["SEA", "MIL", "LAL", "BOS", "MIA"] },
  { name: "Shawn Kemp", position: "F", team: "SEA", teamColor: "#00653A", teamHistory: ["SEA", "CLE", "POR", "ORL"] },
  { name: "Charles Barkley", position: "F", team: "PHX", teamColor: "#1D1160", teamHistory: ["PHI", "PHX", "HOU"] },
  { name: "Hakeem Olajuwon", position: "C", team: "HOU", teamColor: "#CE1141", teamHistory: ["HOU", "TOR"] },
  { name: "David Robinson", position: "C", team: "SAS", teamColor: "#C4CED4", teamHistory: ["SAS"] },
  { name: "Patrick Ewing", position: "C", team: "NYK", teamColor: "#006BB6", teamHistory: ["NYK", "SEA", "ORL"] },
  { name: "Reggie Miller", position: "G", team: "IND", teamColor: "#002D62", teamHistory: ["IND"] },
  { name: "Grant Hill", position: "F", team: "DET", teamColor: "#C8102E", teamHistory: ["DET", "ORL", "PHX"] },
  { name: "Penny Hardaway", position: "G", team: "ORL", teamColor: "#0077C0", teamHistory: ["ORL", "PHX", "NYK", "MIA"] },
  { name: "Alonzo Mourning", position: "C", team: "MIA", teamColor: "#98002E", teamHistory: ["CHA", "MIA", "NJ"] },
  { name: "Dikembe Mutombo", position: "C", team: "DEN", teamColor: "#0E2240", teamHistory: ["DEN", "ATL", "PHI", "NJ", "NYK", "HOU"] },
  
  // 1980s-1990s Legends
  { name: "Magic Johnson", position: "G", team: "LAL", teamColor: "#552583", teamHistory: ["LAL"] },
  { name: "Larry Bird", position: "F", team: "BOS", teamColor: "#007A33", teamHistory: ["BOS"] },
  { name: "Isiah Thomas", position: "G", team: "DET", teamColor: "#C8102E", teamHistory: ["DET"] },
  { name: "Clyde Drexler", position: "G", team: "POR", teamColor: "#E03A3E", teamHistory: ["POR", "HOU"] },
  { name: "Dominique Wilkins", position: "F", team: "ATL", teamColor: "#E03A3E", teamHistory: ["ATL", "LAC", "BOS", "SAS", "ORL"] },
  { name: "James Worthy", position: "F", team: "LAL", teamColor: "#552583", teamHistory: ["LAL"] },
  { name: "Kevin McHale", position: "F-C", team: "BOS", teamColor: "#007A33", teamHistory: ["BOS"] },
  { name: "Robert Parish", position: "C", team: "BOS", teamColor: "#007A33", teamHistory: ["GSW", "BOS", "CHA", "CHI"] },
  { name: "Moses Malone", position: "C", team: "PHI", teamColor: "#006BB6", teamHistory: ["BUF", "HOU", "PHI", "WAS", "ATL", "MIL", "SAS"] },
  { name: "Julius Erving", position: "F", team: "PHI", teamColor: "#006BB6", teamHistory: ["PHI"] },
  
  // 1970s-1980s Stars
  { name: "Kareem Abdul-Jabbar", position: "C", team: "LAL", teamColor: "#552583", teamHistory: ["MIL", "LAL"] },
  { name: "George Gervin", position: "G", team: "SAS", teamColor: "#C4CED4", teamHistory: ["SAS", "CHI"] },
  { name: "Pete Maravich", position: "G", team: "NOP", teamColor: "#0C2340", teamHistory: ["ATL", "NOP", "UTA", "BOS"] },
  { name: "Bob McAdoo", position: "C-F", team: "BUF", teamColor: "#0077C0", teamHistory: ["BUF", "NYK", "BOS", "DET", "NJ", "LAL", "PHI"] },
  { name: "Rick Barry", position: "F", team: "GSW", teamColor: "#1D428A", teamHistory: ["GSW", "HOU"] },
  { name: "Walt Frazier", position: "G", team: "NYK", teamColor: "#006BB6", teamHistory: ["NYK", "CLE"] },
  { name: "Earl Monroe", position: "G", team: "NYK", teamColor: "#006BB6", teamHistory: ["BAL", "NYK"] },
  { name: "Bill Walton", position: "C", team: "POR", teamColor: "#E03A3E", teamHistory: ["POR", "LAC", "BOS"] },
  
  // 1960s-1970s Legends
  { name: "Wilt Chamberlain", position: "C", team: "LAL", teamColor: "#552583", teamHistory: ["PHI", "SF", "LAL"] },
  { name: "Bill Russell", position: "C", team: "BOS", teamColor: "#007A33", teamHistory: ["BOS"] },
  { name: "Oscar Robertson", position: "G", team: "MIL", teamColor: "#00471B", teamHistory: ["CIN", "MIL"] },
  { name: "Jerry West", position: "G", team: "LAL", teamColor: "#552583", teamHistory: ["LAL"] },
  { name: "Elgin Baylor", position: "F", team: "LAL", teamColor: "#552583", teamHistory: ["LAL"] },
  { name: "Bob Cousy", position: "G", team: "BOS", teamColor: "#007A33", teamHistory: ["BOS", "CIN"] },
  { name: "Sam Jones", position: "G", team: "BOS", teamColor: "#007A33", teamHistory: ["BOS"] },
  { name: "John Havlicek", position: "F-G", team: "BOS", teamColor: "#007A33", teamHistory: ["BOS"] },
  { name: "Willis Reed", position: "C-F", team: "NYK", teamColor: "#006BB6", teamHistory: ["NYK"] },
  { name: "Dave DeBusschere", position: "F", team: "NYK", teamColor: "#006BB6", teamHistory: ["DET", "NYK"] },
  
  // Additional Lakers Legends
  { name: "Shaquille O'Neal", position: "C", team: "LAL", teamColor: "#552583", teamHistory: ["ORL", "LAL", "MIA", "PHX", "CLE", "BOS"] },
  { name: "Pau Gasol", position: "F-C", team: "LAL", teamColor: "#552583", teamHistory: ["MEM", "LAL", "CHI", "SAS", "MIL"] },
  { name: "Derek Fisher", position: "G", team: "LAL", teamColor: "#552583", teamHistory: ["LAL", "GSW", "UTA", "DAL", "OKC"] },
  { name: "Michael Cooper", position: "G-F", team: "LAL", teamColor: "#552583", teamHistory: ["LAL"] },
  
  // Additional Celtics Legends
  { name: "Kevin Garnett", position: "F-C", team: "BOS", teamColor: "#007A33", teamHistory: ["MIN", "BOS", "BKN"] },
  { name: "Paul Pierce", position: "F", team: "BOS", teamColor: "#007A33", teamHistory: ["BOS", "BKN", "WAS", "LAC"] },
  { name: "Ray Allen", position: "G", team: "BOS", teamColor: "#007A33", teamHistory: ["MIL", "SEA", "BOS", "MIA"] },
  { name: "Rajon Rondo", position: "G", team: "BOS", teamColor: "#007A33", teamHistory: ["BOS", "DAL", "SAC", "CHI", "NOP", "LAL", "ATL", "LAC", "CLE"] },
  
  // Additional Bulls Legends
  { name: "Derrick Rose", position: "G", team: "CHI", teamColor: "#CE1141", teamHistory: ["CHI", "NYK", "CLE", "MIN", "DET", "MEM"] },
  { name: "Luol Deng", position: "F", team: "CHI", teamColor: "#CE1141", teamHistory: ["CHI", "CLE", "MIA", "LAL", "MIN"] },
  { name: "Joakim Noah", position: "C", team: "CHI", teamColor: "#CE1141", teamHistory: ["CHI", "NYK", "MEM", "LAC"] },
  { name: "Ben Gordon", position: "G", team: "CHI", teamColor: "#CE1141", teamHistory: ["CHI", "DET", "CHA", "ORL"] },
  
  // Additional Warriors Legends
  { name: "Chris Mullin", position: "F", team: "GSW", teamColor: "#1D428A", teamHistory: ["GSW", "IND"] },
  { name: "Tim Hardaway", position: "G", team: "GSW", teamColor: "#1D428A", teamHistory: ["GSW", "MIA", "DAL", "DEN", "IND"] },
  { name: "Mitch Richmond", position: "G", team: "GSW", teamColor: "#1D428A", teamHistory: ["GSW", "SAC", "WAS", "LAL"] },
  { name: "Andre Iguodala", position: "F", team: "GSW", teamColor: "#1D428A", teamHistory: ["PHI", "DEN", "GSW", "MIA"] },
  
  // Additional Spurs Legends
  { name: "Tim Duncan", position: "F-C", team: "SAS", teamColor: "#C4CED4", teamHistory: ["SAS"] },
  { name: "Tony Parker", position: "G", team: "SAS", teamColor: "#C4CED4", teamHistory: ["SAS", "CHA"] },
  { name: "Manu Ginobili", position: "G", team: "SAS", teamColor: "#C4CED4", teamHistory: ["SAS"] },
  { name: "David Robinson", position: "C", team: "SAS", teamColor: "#C4CED4", teamHistory: ["SAS"] },
  { name: "Kawhi Leonard", position: "F", team: "SAS", teamColor: "#C4CED4", teamHistory: ["SAS", "TOR", "LAC"] },
  
  // Additional Heat Legends
  { name: "Dwyane Wade", position: "G", team: "MIA", teamColor: "#98002E", teamHistory: ["MIA", "CHI", "CLE"] },
  { name: "Alonzo Mourning", position: "C", team: "MIA", teamColor: "#98002E", teamHistory: ["CHA", "MIA", "NJ"] },
  { name: "Chris Bosh", position: "F-C", team: "MIA", teamColor: "#98002E", teamHistory: ["TOR", "MIA"] },
  { name: "Udonis Haslem", position: "F", team: "MIA", teamColor: "#98002E", teamHistory: ["MIA"] },
  
  // Additional Pistons Legends (Bad Boys Era)
  { name: "Isiah Thomas", position: "G", team: "DET", teamColor: "#C8102E", teamHistory: ["DET"] },
  { name: "Joe Dumars", position: "G", team: "DET", teamColor: "#C8102E", teamHistory: ["DET"] },
  { name: "Ben Wallace", position: "C", team: "DET", teamColor: "#C8102E", teamHistory: ["WAS", "ORL", "DET", "CHI", "CLE"] },
  { name: "Chauncey Billups", position: "G", team: "DET", teamColor: "#C8102E", teamHistory: ["BOS", "TOR", "DEN", "MIN", "DET", "NYK", "LAC"] },
  { name: "Rasheed Wallace", position: "F-C", team: "DET", teamColor: "#C8102E", teamHistory: ["WAS", "POR", "ATL", "DET", "BOS", "NYK"] },
  
  // Additional Rockets Legends
  { name: "Hakeem Olajuwon", position: "C", team: "HOU", teamColor: "#CE1141", teamHistory: ["HOU", "TOR"] },
  { name: "Clyde Drexler", position: "G", team: "HOU", teamColor: "#CE1141", teamHistory: ["POR", "HOU"] },
  { name: "Tracy McGrady", position: "F-G", team: "HOU", teamColor: "#CE1141", teamHistory: ["TOR", "ORL", "HOU", "NYK", "DET", "ATL", "SAS"] },
  { name: "Yao Ming", position: "C", team: "HOU", teamColor: "#CE1141", teamHistory: ["HOU"] },
  
  // Additional 76ers Legends
  { name: "Allen Iverson", position: "G", team: "PHI", teamColor: "#006BB6", teamHistory: ["PHI", "DEN", "DET", "MEM"] },
  { name: "Julius Erving", position: "F", team: "PHI", teamColor: "#006BB6", teamHistory: ["PHI"] },
  { name: "Moses Malone", position: "C", team: "PHI", teamColor: "#006BB6", teamHistory: ["BUF", "HOU", "PHI", "WAS", "ATL", "MIL", "SAS"] },
  { name: "Charles Barkley", position: "F", team: "PHI", teamColor: "#006BB6", teamHistory: ["PHI", "PHX", "HOU"] },
  
  // Additional Mavericks Legends  
  { name: "Dirk Nowitzki", position: "F", team: "DAL", teamColor: "#00538C", teamHistory: ["DAL"] },
  { name: "Jason Kidd", position: "G", team: "DAL", teamColor: "#00538C", teamHistory: ["DAL", "PHX", "NJ", "NYK"] },
  { name: "Jason Terry", position: "G", team: "DAL", teamColor: "#00538C", teamHistory: ["ATL", "DAL", "BOS", "SAC", "HOU", "MIL"] },
  { name: "Steve Nash", position: "G", team: "DAL", teamColor: "#00538C", teamHistory: ["PHX", "DAL", "LAL"] },
  
  // Additional Knicks Legends
  { name: "Patrick Ewing", position: "C", team: "NYK", teamColor: "#006BB6", teamHistory: ["NYK", "SEA", "ORL"] },
  { name: "Walt Frazier", position: "G", team: "NYK", teamColor: "#006BB6", teamHistory: ["NYK", "CLE"] },
  { name: "Willis Reed", position: "C-F", team: "NYK", teamColor: "#006BB6", teamHistory: ["NYK"] },
  { name: "Carmelo Anthony", position: "F", team: "NYK", teamColor: "#006BB6", teamHistory: ["DEN", "NYK", "OKC", "HOU", "POR", "LAL"] },
];

// Filter function for autocomplete
export function filterPlayers(searchTerm: string): PlayerInfo[] {
  const term = searchTerm.toLowerCase().trim();
  
  if (!term || term.length < 2) return [];
  
  // Filter and remove duplicates by player name
  const filtered = NBA_PLAYERS.filter(player => player.name.toLowerCase().includes(term));
  const uniquePlayers = filtered.filter((player, index, self) => 
    index === self.findIndex(p => p.name.toLowerCase() === player.name.toLowerCase())
  );
  
  return uniquePlayers;
}

// Validate if a player has played for a specific team
export function validatePlayerTeam(playerName: string, teamAbbreviation: string): boolean {
  const player = NBA_PLAYERS.find(p => p.name.toLowerCase() === playerName.toLowerCase());
  
  if (!player) {
    // Player not found in database - REJECT IT
    return false;
  }
  
  // Check if the team abbreviation is in the player's team history
  return player.teamHistory.some(
    team => team.toUpperCase() === teamAbbreviation.toUpperCase()
  );
}

// Get player info by name
export function getPlayerByName(playerName: string): PlayerInfo | undefined {
  return NBA_PLAYERS.find(p => p.name.toLowerCase() === playerName.toLowerCase());
}

