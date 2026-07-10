export function initShare(gameState) {
  // Add share URL parameters if present
  const params = new URLSearchParams(window.location.search)
  const referrer = params.get('ref')

  if (referrer) {
    console.log('Visited via share from:', referrer)
    // Track this acquisition in analytics if needed
  }

  // Update share button to include tracking
  const shareBtn = document.getElementById('share-btn')
  if (shareBtn) {
    shareBtn.addEventListener('click', (e) => {
      e.preventDefault()
      const shareUrl = `${window.location.origin}?ref=${btoa(new Date().getTime())}`
      const text = `🔥 I scored ${gameState.score} points in Ember! Can you beat my score?`

      if (navigator.share) {
        navigator.share({
          title: 'Ember - Daily Game',
          text: text,
          url: shareUrl
        })
      } else {
        navigator.clipboard.writeText(`${text}\n${shareUrl}`)
        alert('Share link copied!')
      }
    })
  }
}
