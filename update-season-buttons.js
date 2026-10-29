// update-season-buttons.js

function updateSeasonButtons(currentSeason, seasonImages) {
  document.querySelectorAll('.btn-season').forEach(btn => {
    const season = btn.dataset.season;
    btn.src = (season === currentSeason)
      ? seasonImages[season].active
      : seasonImages[season].normal;
  });
}
