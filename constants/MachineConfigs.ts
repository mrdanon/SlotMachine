export const MACHINE_CONFIGS = {
  fruit: {
    name: 'Fruit Machine',
    spinCost: 25,
    symbols: ['🍎', '🍌', '🍇', '🍋', '🍒'],
    symbolWeights: [30, 30, 30, 30, 30], // Equal weights, easier to win
    combinations: {
      three: {
        '🍒': 100,    // Three cherries
        '🍎': 75,     // Three apples
        '🍌': 75,     // Three bananas
        '🍇': 75,     // Three grapes
        '🍋': 75,     // Three lemons
      },
      two: {
        '🍒': 20,     // Two cherries
        default: 10,  // Any two matching symbols
      }
    }
  },
  diamond: {
    name: 'Diamond Machine',
    spinCost: 75,
    symbols: ['💎', '💍', '👑', '💰', '⭐'],
    symbolWeights: [10, 15, 20, 25, 30], // Medium difficulty
    combinations: {
      three: {
        '💎': 500,    // Three diamonds
        '💍': 400,    // Three rings
        '👑': 300,    // Three crowns
        '💰': 250,    // Three money bags
        '⭐': 200,    // Three stars
      },
      two: {
        '💎': 50,     // Two diamonds
        '💍': 40,     // Two rings
        default: 25,  // Any two matching symbols
      }
    }
  },
  classic: {
    name: 'Classic Machine',
    spinCost: 150,
    symbols: ['7️⃣', '👾', '🎱', '🎰', '♠️'],
    symbolWeights: [5, 10, 15, 35, 35], // Hardest to win valuable symbols
    combinations: {
      three: {
        '7️⃣': 2000,   // Three 7s
        '👾': 1000,   // Three aliens
        '🎱': 500,    // Three 8 balls
        '🎰': 400,    // Three slots
        '♠️': 300,    // Three spades
      },
      two: {
        '7️⃣': 100,    // Two 7s
        '👾': 75,     // Two aliens
        '🎱': 50,     // Two 8 balls
        default: 25,  // Any two matching symbols
      }
    }
  }
}; 