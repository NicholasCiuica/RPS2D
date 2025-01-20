class Grid {
  constructor(rows, columns, factions, rules) {
    this.rows = rows;
    this.columns = columns;

    this.surroundingCells = [
      {row: -1, column: -1},
      {row: 0, column: -1},
      {row: 1, column: -1},
      {row: -1, column: 0},
      {row: 1, column: 0},
      {row: -1, column: 1},
      {row: 0, column: 1},
      {row: 1, column: 1}
    ];

    //see data files for syntax specifications
    this.factions = factions;
    this.rules = rules;

    this.cells = [];
    for(let r = 0; r < rows; r++) {
      for(let c = 0; c < columns; c++) {
        this.cells.push( new Cell(r, c));
      }
    }
    this.randomizeFactions();
  }

  randomizeFactions() {
    this.cells.forEach(cell => {
      cell.faction = this.factions[Math.floor(Math.random() * this.factions.length)];
    });
  }

  getSurroundingFactions(cell) {
    let surroundingFactions = {};
    this.factions.forEach(faction => {
      surroundingFactions[faction.name] = 0;
    });
    
    this.surroundingCells.forEach(surroundingCell => {
      let currentRow = cell.row + surroundingCell.row;
      let currentColumn = cell.column + surroundingCell.column;
      if(currentRow < 0) {
        currentRow += this.rows;
      } else if(currentRow >= this.rows) {
        currentRow -= this.rows;
      }
      if(currentColumn < 0) {
        currentColumn += this.columns;
      } else if(currentColumn >= this.columns) {
        currentColumn -= this.columns;
      }
      const currentFactionName = this.cells[currentRow * this.columns + currentColumn].faction.name;
      surroundingFactions[currentFactionName]++;
    });
    
    return surroundingFactions;
  }

  getFactionCounts() {
    const factionCounts = {};
    this.factions.forEach(faction => {
      factionCounts[faction.name] = 0;
    });
    this.cells.forEach(cell => {
      factionCounts[cell.faction.name]++;
    });
    return factionCounts;
  }

  update() {
    const cellsToConvert = [];
    
    this.factions.forEach(faction => {
      const cellGroup = { cells: [], name: faction.name };
      cellsToConvert.push(cellGroup);
    });

    //if a cell is surrounded by more than 2 of a dominating faction, it gets converted
    this.cells.forEach(cell => {
      const surroundingFactions = this.getSurroundingFactions(cell);
      const relevantRules = this.rules.filter(rule => rule.loser.includes(cell.faction.name));
      relevantRules.forEach(rule => {
        if(surroundingFactions[rule.winner] > 2) {
          cellsToConvert.find(cellGroup => cellGroup.name == rule.winner).cells.push(cell);
        }
      });
    });

    cellsToConvert.forEach(cellGroup => {
      cellGroup.cells.forEach(cell => {
        cell.faction = this.factions.find(faction => faction.name == cellGroup.name);
      });
    });
  }
}