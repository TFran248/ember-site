const STORAGE_KEY = 'ember-game-stats'

export function getGameStats() {
  try {
    const stats = localStorage.getItem(STORAGE_KEY)
    return stats ? JSON.parse(stats) : { bestScore: 0, streak: 0, lastPlayedDate: null }
  } catch (e) {
    console.error('Storage read failed:', e)
    return { bestScore: 0, streak: 0, lastPlayedDate: null }
  }
}

export function saveGameStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch (e) {
    console.error('Storage write failed:', e)
  }
}

export function resetDailyIfNeeded() {
  const stats = getGameStats()
  const lastPlayed = stats.lastPlayedDate ? new Date(stats.lastPlayedDate) : null
  const today = new Date().toDateString()

  if (lastPlayed && lastPlayed.toDateString() === today) {
    return // Already played today, no reset needed
  }

  // It's a new day - increment streak and reset score
  if (lastPlayed) {
    const daysSince = Math.floor((Date.now() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24))
    if (daysSince === 1) {
      stats.streak = (stats.streak || 0) + 1
    } else if (daysSince > 1) {
      stats.streak = 1 // Streak broken, reset to 1
    }
  } else {
    stats.streak = 1
  }

  saveGameStats(stats)
}
