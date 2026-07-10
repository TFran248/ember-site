import { initGame } from './game.js'
import { initShare } from './share.js'

const app = document.getElementById('app')

// Initialize game
const gameState = initGame(app)

// Initialize share functionality
initShare(gameState)

// Log share URL for testing
console.log('Share URL:', window.location.href)
