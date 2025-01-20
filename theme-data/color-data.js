const colorData = {
  factions: [
    {
      name: 'red',
      symbol: '🟥',
    },
    {
      name: 'yellow',
      symbol: '🟨',
    },
    {
      name: 'green',
      symbol: '🟩',
    },
    {
      name: 'blue',
      symbol: '🟦',
    },
  ],
  rules: [
    {
      winner: 'red',
      loser: ['yellow', 'green'],
    },
    {
      winner: 'yellow',
      loser: ['green', 'blue'],
    },
    {
      winner: 'green',
      loser: ['blue'],
    },
    {
      winner: 'blue',
      loser: ['red'],
    },
  ]
};