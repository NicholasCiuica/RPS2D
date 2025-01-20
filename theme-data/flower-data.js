const flowerData = {
  factions: [
    {
      name: 'cherry blossom',
      symbol: '🌸',
    },
    {
      name: 'sunflower',
      symbol: '🌻',
    },
    {
      name: 'rose',
      symbol: '🌹',
    },
    {
      name: 'daisy',
      symbol: '🌼',
    },
    {
      name: 'tulip',
      symbol: '🌷',
    },
  ],
  rules: [
    {
      winner: 'cherry blossom',
      loser: ['sunflower', 'rose'],
    },
    {
      winner: 'sunflower',
      loser: ['rose', 'daisy'],
    },
    {
      winner: 'rose',
      loser: ['daisy', 'tulip'],
    },
    {
      winner: 'daisy',
      loser: ['tulip', 'cherry blossom'],
    },
    {
      winner: 'tulip',
      loser: ['cherry blossom', 'sunflower'],
    },
  ]
};