const reference = window.GDT_REFERENCE;
const genres = reference.genres;
const audiences = reference.audiences;
const topics = reference.topics;
const platforms = reference.platforms;
const sliderPresets = {
  Action: [[100, 80, 0], [0, 80, 100], [0, 100, 80]],
  Adventure: [[0, 80, 100], [100, 0, 0], [100, 80, 0]],
  RPG: [[0, 80, 100], [100, 80, 0], [100, 100, 80]],
  Simulation: [[80, 100, 0], [0, 80, 100], [0, 100, 80]],
  Strategy: [[100, 100, 0], [0, 0, 100], [100, 100, 80]],
  Casual: [[0, 100, 0], [0, 100, 0], [0, 50, 100]]
};
const phaseLabels = [
  ['Motore', 'Gameplay', 'Storia / Missioni'],
  ['Dialoghi', 'Level design', 'IA'],
  ['Mondo', 'Grafica', 'Audio']
];
const genreNames = {Action: 'Azione', Adventure: 'Avventura', RPG: 'RPG', Simulation: 'Simulazione', Strategy: 'Strategia', Casual: 'Casual'};
const audienceNames = {Everyone: 'Tutti', Young: 'Giovani', Mature: 'Adulti'};
const storageKey = 'gdt-selected-topics-v2';
const $ = id => document.getElementById(id);
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
const fitLevel = value => value >= .95 ? 3 : value >= .85 ? 2 : value >= .75 ? 1 : value >= .65 ? 0 : -1;
const fitPoints = level => ({3: 100, 2: 80, 1: 60, 0: 30, '-1': 0})[level];
const fitText = level => ({3: '+++', 2: '++', 1: '+', 0: '--', '-1': '---'})[level];
const fitClass = level => level >= 2 ? 'positive' : level === 1 ? 'neutral' : 'negative';
const topicNames = new Set(topics.map(row => row[0]));
let selectedTopics = new Set();
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (Array.isArray(saved)) {
    selectedTopics = new Set(saved.filter(name => topicNames.has(name)));
  } else {
    const previous = JSON.parse(localStorage.getItem('devdeck-topics-v1'));
    if (Array.isArray(previous) && previous.length < topics.length) {
      selectedTopics = new Set(previous.filter(name => topicNames.has(name)));
    }
  }
} catch (_) {
  selectedTopics = new Set();
}
let rankedResults = [];
let visibleCount = 0;
const pageSize = 24;

function saveTopics() {
  try { localStorage.setItem(storageKey, JSON.stringify([...selectedTopics])); } catch (_) {}
}

function renderTopicChoices() {
  const query = $('topicSearch').value.trim().toLocaleLowerCase('it');
  const visible = topics.filter(row => row[0].toLocaleLowerCase('it').includes(query));
  $('selectedTopicCount').textContent = selectedTopics.size ? `${selectedTopics.size} selezionati` : 'Tutti';
  $('allTopics').classList.toggle('active', !selectedTopics.size);
  $('topicChoices').innerHTML = visible.length
    ? visible.map(row => `<button type="button" class="topic-choice ${selectedTopics.has(row[0]) ? 'selected' : ''}" data-topic="${escapeHTML(row[0])}" aria-pressed="${selectedTopics.has(row[0])}"><span class="choice-check" aria-hidden="true">${selectedTopics.has(row[0]) ? '✓' : ''}</span>${escapeHTML(row[0])}</button>`).join('')
    : '<p class="no-topics">Nessun tema trovato.</p>';
}

function candidate(topic, genre, platform, audience) {
  const genreIndex = genres.indexOf(genre) + 1;
  const audienceIndex = audiences.indexOf(audience) + 7;
  const checks = [
    fitLevel(topic[genreIndex]),
    fitLevel(platform[genreIndex]),
    fitLevel(topic[audienceIndex]),
    fitLevel(platform[audienceIndex])
  ];
  const total = checks.reduce((sum, level) => sum + fitPoints(level), 0);
  return {topic: topic[0], genre, platform: platform[0], audience, checks, total};
}

function compareResults(a, b) {
  return b.total - a.total
    || b.checks[0] - a.checks[0]
    || b.checks[1] - a.checks[1]
    || a.topic.localeCompare(b.topic, 'it')
    || a.genre.localeCompare(b.genre, 'it')
    || a.platform.localeCompare(b.platform, 'it');
}

function buildRanking() {
  const genreFilter = $('genreFilter').value;
  const platformFilter = $('platformFilter').value;
  const audience = $('audienceFilter').value;
  const platformRows = platformFilter === 'best' || platformFilter === 'all'
    ? platforms
    : platforms.filter(row => row[0] === platformFilter);
  const result = [];
  for (const topic of topics) {
    if (selectedTopics.size && !selectedTopics.has(topic[0])) continue;
    for (const genre of genres) {
      if (genreFilter !== 'all' && genreFilter !== genre) continue;
      const matches = platformRows.map(platform => candidate(topic, genre, platform, audience));
      if (platformFilter === 'best') {
        matches.sort(compareResults);
        result.push(matches[0]);
      } else {
        result.push(...matches);
      }
    }
  }
  result.sort(compareResults);
  return result;
}

function checkMarkup(label, level) {
  return `<div class="check-item"><span>${label}</span><strong class="fit ${fitClass(level)}">${fitText(level)}</strong><span class="check-meter" aria-hidden="true"><i class="${fitClass(level)}" style="height:${fitPoints(level)}%"></i></span><small>${fitPoints(level)} / 100</small></div>`;
}

function phasesMarkup(genre) {
  return sliderPresets[genre].map((values, phase) => `
    <div class="phase-card"><h4>Fase ${phase + 1}</h4>
      ${values.map((value, index) => `<div class="slider-row"><span>${phaseLabels[phase][index]}</span><div class="slider-track"><i style="width:${value}%"></i></div><strong>${value}%</strong></div>`).join('')}
    </div>`).join('');
}

function resultMarkup(game, index) {
  const percent = Math.round(game.total / 4);
  const [topicGenre, platformGenre, topicAudience, platformAudience] = game.checks;
  return `<article class="result-card">
    <div class="result-top"><span class="rank">#${String(index + 1).padStart(2, '0')}</span><div class="result-title"><h3>${escapeHTML(game.topic)} <span>×</span> ${genreNames[game.genre]}</h3><p>${escapeHTML(game.platform)} <span>·</span> Pubblico: ${audienceNames[game.audience]}</p></div><div class="result-score"><strong>${percent}%</strong><span>compatibilità</span></div></div>
    <div class="result-strip"><span>Tema / genere <b class="${fitClass(topicGenre)}">${fitText(topicGenre)}</b></span><span>Genere / console <b class="${fitClass(platformGenre)}">${fitText(platformGenre)}</b></span><span>${game.total} / 400 punti</span></div>
    <details class="result-details"><summary>Vedi compatibilità e 3 fasi <span aria-hidden="true">⌄</span></summary>
      <div class="details-content"><div class="details-heading"><h4>Perché è in classifica</h4><p>Quattro compatibilità, fino a 100 punti ciascuna.</p></div>
        <div class="checks-grid">${checkMarkup('Tema × genere', topicGenre)}${checkMarkup('Genere × console', platformGenre)}${checkMarkup('Tema × pubblico', topicAudience)}${checkMarkup('Console × pubblico', platformAudience)}</div>
        <div class="details-heading phase-heading"><h4>Le 3 fasi · ${genreNames[game.genre]}</h4><p>Posizioni iniziali dei cursori in base al genere.</p></div>
        <div class="phases-grid">${phasesMarkup(game.genre)}</div>
        <p class="phase-note">I cursori sono una guida: adatta il piano a dimensione, funzionalità e personale del tuo gioco.</p>
      </div>
    </details>
  </article>`;
}

function appendResults() {
  const nextCount = Math.min(visibleCount + pageSize, rankedResults.length);
  $('results').insertAdjacentHTML('beforeend', rankedResults.slice(visibleCount, nextCount).map((game, index) => resultMarkup(game, visibleCount + index)).join(''));
  visibleCount = nextCount;
  $('showMore').hidden = visibleCount >= rankedResults.length;
  if (!$('showMore').hidden) $('showMore').textContent = `Mostra altri risultati (${visibleCount} di ${rankedResults.length})`;
}

function renderRanking() {
  rankedResults = buildRanking();
  visibleCount = 0;
  $('results').innerHTML = '';
  $('resultSummary').textContent = `${rankedResults.length.toLocaleString('it-IT')} combinazioni trovate${selectedTopics.size ? ` per ${selectedTopics.size} temi` : ''}.`;
  if (rankedResults.length) appendResults();
  else {
    $('results').innerHTML = '<div class="empty-results">Nessuna combinazione trovata. Cambia i filtri per riprovare.</div>';
    $('showMore').hidden = true;
  }
}

function tableMarkup(rows, labels, startIndex) {
  return `<thead><tr><th scope="col">Nome</th>${labels.map(label => `<th scope="col">${escapeHTML(label)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr><th scope="row">${escapeHTML(row[0])}</th>${labels.map((_, index) => { const level = fitLevel(row[startIndex + index]); return `<td><span class="fit ${fitClass(level)}">${fitText(level)}</span></td>`; }).join('')}</tr>`).join('')}</tbody>`;
}

function renderTables() {
  const genreLabels = genres.map(genre => genreNames[genre]);
  const audienceLabels = audiences.map(audience => audienceNames[audience]);
  $('topicTable').innerHTML = tableMarkup(topics, genreLabels, 1);
  $('platformTable').innerHTML = tableMarkup(platforms, genreLabels, 1);
  $('topicAudienceTable').innerHTML = tableMarkup(topics, audienceLabels, 7);
  $('platformAudienceTable').innerHTML = tableMarkup(platforms, audienceLabels, 7);
}

function init() {
  $('genreFilter').insertAdjacentHTML('beforeend', genres.map(genre => `<option value="${genre}">${genreNames[genre]}</option>`).join(''));
  $('platformFilter').insertAdjacentHTML('beforeend', platforms.map(row => `<option value="${escapeHTML(row[0])}">${escapeHTML(row[0])}</option>`).join(''));
  $('topicSearch').addEventListener('input', renderTopicChoices);
  $('topicChoices').addEventListener('click', event => {
    const choice = event.target.closest('[data-topic]');
    if (!choice) return;
    const topic = choice.dataset.topic;
    if (selectedTopics.has(topic)) selectedTopics.delete(topic);
    else selectedTopics.add(topic);
    saveTopics();
    renderTopicChoices();
    renderRanking();
  });
  $('allTopics').addEventListener('click', () => {
    selectedTopics.clear();
    saveTopics();
    renderTopicChoices();
    renderRanking();
  });
  $('visibleTopics').addEventListener('click', () => {
    const query = $('topicSearch').value.trim().toLocaleLowerCase('it');
    for (const row of topics) if (row[0].toLocaleLowerCase('it').includes(query)) selectedTopics.add(row[0]);
    saveTopics();
    renderTopicChoices();
    renderRanking();
  });
  for (const id of ['genreFilter', 'platformFilter', 'audienceFilter']) $(id).addEventListener('change', renderRanking);
  $('resetFilters').addEventListener('click', () => {
    selectedTopics.clear();
    $('topicSearch').value = '';
    $('genreFilter').value = 'all';
    $('platformFilter').value = 'best';
    $('audienceFilter').value = 'Everyone';
    saveTopics();
    renderTopicChoices();
    renderRanking();
  });
  $('showMore').addEventListener('click', appendResults);
  renderTopicChoices();
  renderRanking();
  renderTables();
}

init();
