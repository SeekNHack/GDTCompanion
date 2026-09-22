const TOPICS = [
  ['Fantasy','RPG',9,'High'],['Sci-Fi','Strategy',9,'High'],['History','Strategy',8,'High'],['Business','Simulation',8,'High'],['Life','Simulation',8,'High'],['School','Casual',8,'Medium'],['Sports','Simulation',8,'High'],['Pirates','Adventure',8,'High'],['Medieval','RPG',8,'High'],['Post-Apocalyptic','Action',8,'High'],['Space','Strategy',8,'High'],['Detective','Adventure',8,'High'],['Horror','Adventure',8,'High'],['Military','Action',7,'High'],['Romance','Casual',7,'Medium'],['Comedy','Casual',7,'Medium'],['Zombies','Action',7,'High'],['Music','Casual',7,'Medium'],['Fashion','Casual',7,'Medium'],['Cooking','Simulation',7,'Medium'],['Airport','Simulation',7,'Medium'],['Aliens','Action',7,'High'],['Robots','Action',7,'High'],['Time Travel','Adventure',7,'High'],['Werewolf','RPG',7,'High'],['Vampire','RPG',7,'High'],['Ninja','Action',7,'High'],['Spy','Action',7,'High'],['Dungeon','RPG',7,'High'],['Monster','RPG',7,'High'],['Virtual Pet','Casual',7,'Low'],['Card Game','Casual',7,'Low'],['Cyberpunk','Action',8,'High'],['Postmodern','Adventure',6,'High'],['Government','Simulation',6,'Medium'],['Transport','Simulation',7,'Medium'],['Wild West','Adventure',7,'High'],['Martial Arts','Action',7,'High'],['Fantasy','Adventure',8,'High'],['Sci-Fi','Action',8,'High'],['History','Adventure',7,'High'],['Horror','Action',7,'High'],['Detective','Simulation',6,'Medium'],['Sports','Action',7,'High'],['Business','Strategy',7,'High'],['Life','Casual',7,'Medium'],['School','Simulation',6,'Medium'],['Cooking','Casual',7,'Medium'],['Music','Simulation',6,'Medium'],['Pirates','RPG',7,'High'],['Medieval','Strategy',7,'High']
];
const PLATFORMS = [['PC','PC',9],['G64','G64',7],['TES','TES',8],['Master V','Master V',6],['Game Link','Game Link',8],['Vena Gear','Vena Gear',7],['DreamVast','DreamVast',8],['PlaySystem','PlaySystem',9],['MBox','MBox',9],['GS','GS',8],['Playsystem 2','Playsystem 2',9],['MBox 360','MBox 360',9],['Nuu','Nuu',8],['Vena Gear Next','Vena Gear Next',8],['GameSphere','GameSphere',8],['PlaySystem 3','PlaySystem 3',9],['MBox One','MBox One',9]];
const GENRES = ['Action','Adventure','RPG','Simulation','Strategy','Casual'];
const STORAGE_KEY = 'devdeck-topics-v1';
const defaultTopics = [...new Set(TOPICS.map(x=>x[0]))];
let selectedTopics = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultTopics)));
let filteredTopics = TOPICS;

const $ = id => document.getElementById(id);
function scoreFor(topic, genre, platform){
  const match = TOPICS.find(x=>x[0]===topic && x[1]===genre);
  if(!match) return null;
  const plat = PLATFORMS.find(x=>x[0]===platform);
  const base = match[2], platformScore = plat ? plat[2] : 8;
  const synergy = ((base + platformScore) / 2) + (genre==='RPG' && ['Fantasy','Medieval','Dungeon','Vampire','Werewolf'].includes(topic) ? 1 : 0);
  return Math.min(10, Math.round(synergy*10)/10);
}
function fillSelects(){
  $('platformFilter').innerHTML = '<option value="all">All platforms</option>' + PLATFORMS.map(p=>`<option value="${p[0]}">${p[1]}</option>`).join('');
  $('genreFilter').innerHTML = '<option value="all">All genres</option>' + GENRES.map(g=>`<option value="${g}">${g}</option>`).join('');
}
function persist(){ localStorage.setItem(STORAGE_KEY, JSON.stringify([...selectedTopics])); }
function renderChips(){
  const query = $('topicSearch').value.toLowerCase();
  const unique = [...new Set(TOPICS.map(x=>x[0]))].filter(t=>t.toLowerCase().includes(query));
  $('topicChips').innerHTML = unique.map(t=>`<button class="chip ${selectedTopics.has(t)?'selected':''}" data-topic="${t}">${t}</button>`).join('');
  $('topicCount').textContent = `${selectedTopics.size} selected`;
  document.querySelectorAll('[data-topic]').forEach(btn=>btn.addEventListener('click',()=>{selectedTopics.has(btn.dataset.topic)?selectedTopics.delete(btn.dataset.topic):selectedTopics.add(btn.dataset.topic);persist();renderChips();renderResults();renderManager();}));
}
function renderResults(){
  const platform = $('platformFilter').value, genre = $('genreFilter').value, sort = $('sortFilter').value;
  let rows=[];
  selectedTopics.forEach(topic=>{GENRES.filter(g=>genre==='all'||g===genre).forEach(g=>{const score=scoreFor(topic,g,platform==='all'?'PC':platform);if(score)rows.push({topic,genre:g,score,platform:platform==='all'?'PC / recommended':platform, audience:TOPICS.find(x=>x[0]===topic&&x[1]===g)?.[3]||'Medium'});});});
  rows.sort((a,b)=>sort==='alpha'?a.topic.localeCompare(b.topic):sort==='sales'?b.score-a.score+(b.audience==='High'?0.2:0):b.score-a.score);
  $('resultCount').textContent=rows.length;
  $('results').innerHTML=rows.slice(0,24).map((r,i)=>`<article class="result-card"><span class="rank">#${String(i+1).padStart(2,'0')}</span><span class="eyebrow">${r.platform}</span><h4>${r.topic} <span class="muted">×</span> ${r.genre}</h4><div class="result-meta">Recommended audience: ${r.audience}</div><div class="score-row"><div class="score-bar"><i style="width:${r.score*10}%"></i></div><span class="score">${r.score.toFixed(1)} / 10</span></div><div class="tags"><span class="tag orange">${r.score>=8.5?'GREAT COMBO':'GOOD COMBO'}</span><span class="tag">${r.audience} audience</span></div></article>`).join('') || '<div class="empty">No combinations found. Try enabling more topics or changing a filter.</div>';
}
function renderManager(){
  const topics=[...new Set(TOPICS.map(x=>x[0]))];
  $('topicManager').innerHTML=topics.map(t=>`<div class="manager-item"><label for="m-${t}">${t}</label><input id="m-${t}" type="checkbox" data-topic="${t}" ${selectedTopics.has(t)?'checked':''}></div>`).join('');
  document.querySelectorAll('#topicManager [data-topic]').forEach(i=>i.addEventListener('change',()=>{i.checked?selectedTopics.add(i.dataset.topic):selectedTopics.delete(i.dataset.topic);persist();renderChips();renderResults();renderManager();}));
}
function showView(view){document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));$(`${view}View`).classList.remove('hidden');document.querySelectorAll('.nav-link').forEach(n=>n.classList.toggle('active',n.dataset.view===view));}
fillSelects();renderChips();renderResults();renderManager();
$('topicSearch').addEventListener('input',renderChips);$('platformFilter').addEventListener('change',renderResults);$('genreFilter').addEventListener('change',renderResults);$('sortFilter').addEventListener('change',renderResults);
$('selectAll').addEventListener('click',()=>{selectedTopics=new Set(defaultTopics);persist();renderChips();renderResults();renderManager();});
$('resetBtn').addEventListener('click',()=>{$('topicSearch').value='';$('platformFilter').value='all';$('genreFilter').value='all';$('sortFilter').value='score';selectedTopics=new Set(defaultTopics);persist();renderChips();renderResults();renderManager();});
document.querySelectorAll('.nav-link').forEach(n=>n.addEventListener('click',()=>showView(n.dataset.view)));
