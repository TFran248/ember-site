import { getGameStats, saveGameStats, resetDailyIfNeeded } from './storage.js'

export function initGame(container) {
  // Reset game if it's a new day
  resetDailyIfNeeded()

  const gameState = {
    score: 0,
    bestScore: getGameStats().bestScore || 0,
    streak: getGameStats().streak || 0,
    gameActive: true,
    startTime: Date.now()
  }

  renderGame(container, gameState)

  return gameState
}

function renderGame(container, gameState) {
  container.innerHTML = `
    <div class="game-container">
      <header>
        <h1>🔥 Ember</h1>
        <p class="tagline">Daily Challenge</p>
      </header>

      <main>
        <div class="stats">
          <div class="stat-box">
            <span class="label">Today's Score</span>
            <span class="value" id="score">${gameState.score}</span>
          </div>
          <div class="stat-box">
            <span class="label">Best Score</span>
            <span class="value">${gameState.bestScore}</span>
          </div>
          <div class="stat-box">
            <span class="label">🔥 Streak</span>
            <span class="value">${gameState.streak}</span>
          </div>
        </div>

        <div class="game-board" id="board">
          ${renderBoard(gameState)}
        </div>

        <div class="actions">
          <button id="share-btn" class="btn btn-primary">📤 Share Result</button>
          <button id="reset-btn" class="btn btn-secondary">🔄 New Game</button>
        </div>
      </main>

      <footer>
        <p>Play daily to build your streak. Every share counts as an acquisition!</p>
      </footer>
    </div>
  `

  // Attach event listeners
  document.getElementById('share-btn').addEventListener('click', () => {
    shareGame(gameState)
  })

  document.getElementById('reset-btn').addEventListener('click', () => {
    gameState.score = 0
    gameState.gameActive = true
    updateScore(gameState)
    renderGame(container, gameState)
  })

  // Make board interactive
  setupBoardInteractions(gameState, container)
}

function renderBoard(gameState) {
  let board = ''
  for (let i = 0; i < 4; i++) {
    board += `<div class="tile" data-index="${i}"></div>`
  }
  return board
}

function setupBoardInteractions(gameState, container) {
  const tiles = container.querySelectorAll('.tile')
  tiles.forEach((tile, index) => {
    tile.addEventListener('click', () => {
      if (gameState.gameActive) {
        gameState.score += Math.floor(Math.random() * 20) + 10
        updateScore(gameState)
        tile.classList.add('active')
        setTimeout(() => tile.classList.remove('active'), 200)
      }
    })
  })
}

function updateScore(gameState) {
  const scoreEl = document.getElementById('score')
  if (scoreEl) {
    scoreEl.textContent = gameState.score
  }

  // Update best score
  if (gameState.score > gameState.bestScore) {
    gameState.bestScore = gameState.score
  }

  saveGameStats({
    bestScore: gameState.bestScore,
    score: gameState.score,
    streak: gameState.streak,
    lastPlayedDate: new Date().toISOString()
  })
}

function shareGame(gameState) {
  const text = `🔥 I scored ${gameState.score} points in Ember! Can you beat my score? ${gameState.score > gameState.bestScore ? '🏆 New personal best!' : ''}`
  const url = window.location.href

  if (navigator.share) {
    navigator.share({
      title: 'Ember - Daily Game',
      text: text,
      url: url
    }).catch(err => console.log('Share failed:', err))
  } else {
    // Fallback: copy to clipboard
    const shareText = `${text}\n${url}`
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Score copied to clipboard!')
    })
  }
}
