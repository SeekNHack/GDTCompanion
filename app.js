const TOPICS = [
  ['Fantasy','RPG',9,'High'],['Sci-Fi','Strategy',9,'High'],['History','Strategy',8,'High'],['Business','Simulation',8,'High'],['Life','Simulation',8,'High'],['School','Casual',8,'Medium'],['Sports','Simulation',8,'High'],['Pirates','Adventure',8,'High'],['Medieval','RPG',8,'High'],['Post-Apocalyptic','Action',8,'High'],['Space','Strategy',8,'High'],['Detective','Adventure',8,'High'],['Horror','Adventure',8,'High'],['Military','Action',7,'High'],['Romance','Casual',7,'Medium'],['Comedy','Casual',7,'Medium'],['Zombies','Action',7,'High'],['Music','Casual',7,'Medium'],['Fashion','Casual',7,'Medium'],['Cooking','Simulation',7,'Medium'],['Airport','Simulation',7,'Medium'],['Aliens','Action',7,'High'],['Robots','Action',7,'High'],['Time Travel','Adventure',7,'High'],['Werewolf','RPG',7,'High'],['Vampire','RPG',7,'High'],['Ninja','Action',7,'High'],['Spy','Action',7,'High'],['Dungeon','RPG',7,'High'],['Monster','RPG',7,'High'],['Virtual Pet','Casual',7,'Low'],['Card Game','Casual',7,'Low'],['Cyberpunk','Action',8,'High'],['Postmodern','Adventure',6,'High'],['Government','Simulation',6,'Medium'],['Transport','Simulation',7,'Medium'],['Wild West','Adventure',7,'High'],['Martial Arts','Action',7,'High'],['Fantasy','Adventure',8,'High'],['Sci-Fi','Action',8,'High'],['History','Adventure',7,'High'],['Horror','Action',7,'High'],['Detective','Simulation',6,'Medium'],['Sports','Action',7,'High'],['Business','Strategy',7,'High'],['Life','Casual',7,'Medium'],['School','Simulation',6,'Medium'],['Cooking','Casual',7,'Medium'],['Music','Simulation',6,'Medium'],['Pirates','RPG',7,'High'],['Medieval','Strategy',7,'High']
];
const PLATFORMS = [['PC','PC',9],['G64','G64',7],['TES','TES',8],['Master V','Master V',6],['Game Link','Game Link',8],['Vena Gear','Vena Gear',7],['DreamVast','DreamVast',8],['PlaySystem','PlaySystem',9],['MBox','MBox',9],['GS','GS',8],['Playsystem 2','Playsystem 2',9],['MBox 360','MBox 360',9],['Nuu','Nuu',8],['Vena Gear Next','Vena Gear Next',8],['GameSphere','GameSphere',8],['PlaySystem 3','PlaySystem 3',9],['MBox One','MBox One',9]];
const GENRES = ['Action','Adventure','RPG','Simulation','Strategy','Casual'];
const AUDIENCES = ['Everyone','Young','Mature'];
const GAME_SIZES = ['Small','Medium','Large','AAA'];
const SLIDER_VALUES = {Action:[[100,80,0],[0,80,100],[0,100,80]],Adventure:[[0,80,100],[100,0,0],[100,80,0]],RPG:[[0,80,100],[100,80,0],[100,100,80]],Simulation:[[80,100,0],[0,80,100],[0,100,80]],Strategy:[[100,100,0],[0,0,100],[100,100,80]],Casual:[[0,100,0],[0,100,0],[0,50,100]]};
const PHASE_LABELS = [['Engine','Gameplay','Story / Quests'],['Dialogues','Level Design','AI'],['World Design','Graphics','Sound']];
const STORAGE_KEY = 'devdeck-topics-v1';
const $ = id => document.getElementById(id);
const REF = window.GDT_REFERENCE || {genres:GENRES, audiences:['Young','Everyone','Mature'], topics:[], platforms:[], adjustments:{}};
const REF_GENRES = REF.genres;
const REF_TOPIC_BY_NAME = new Map(REF.topics.map(row=>[row[0],row]));
const REF_PLATFORM_BY_NAME = new Map(REF.platforms.map(row=>[row[0],row]));
const ALIASES = {'Pirates':'Pirate','Post-Apocalyptic':'Post Apocalyptic','Airport':'Airplane','G64':'Govodore 64','GameSphere':'Game Sphere','MBox 360':'mBox 360','MBox':'mBox','PlaySystem':'Playsystem','PlaySystem 3':'Playsystem 3','Vena Gear Next':'Vena Oasis'};
const canonicalTopic = topic => ALIASES[topic] || topic;
const canonicalPlatform = platform => ALIASES[platform] || platform;
const defaultTopics = [...new Set((REF.topics.length ? REF.topics.map(row=>row[0]) : TOPICS.map(x=>x[0])))];
const storedTopics = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
let selectedTopics = new Set((storedTopics || defaultTopics).map(canonicalTopic).filter(topic=>defaultTopics.includes(topic)));
if(!storedTopics) localStorage.setItem(STORAGE_KEY, JSON.stringify([...selectedTopics]));
const GREAT_TOPICS = {
  Action:['Post-Apocalyptic','Military','Aliens','Robots','Cyberpunk','Ninja','Martial Arts','Zombies'],
  Adventure:['Pirates','Detective','Horror','Time Travel','Wild West','History'],
  RPG:['Fantasy','Medieval','Dungeon','Vampire','Werewolf','Monster','Pirates'],
  Simulation:['Business','Life','Sports','Cooking','Airport','Transport'],
  Strategy:['Sci-Fi','History','Space','Business','Military','Robots'],
  Casual:['School','Romance','Comedy','Music','Fashion','Cooking','Virtual Pet','Card Game','Life']
};
function fitFor(topic,genre){
  const row=REF_TOPIC_BY_NAME.get(canonicalTopic(topic));
  const exactIndex=REF_GENRES.indexOf(genre);
  if(row && exactIndex>=0) return normalizedFit(row[1+exactIndex]);
  const match=TOPICS.find(x=>x[0]===topic&&x[1]===genre);
  if(GREAT_TOPICS[genre]?.includes(topic)) return match?.[2]>=8?3:2;
  if(match) return match[2]>=8?2:1;
  if(GREAT_TOPICS[genre]?.some(t=>topic.includes(t)||t.includes(topic))) return 1;
  return -1;
}
function normalizedFit(value){return value>=.95?3:value>=.85?2:value>=.75?1:value>=.65?0:-1;}
function fitPoints(value){return ({3:100,2:80,1:60,0:30,'-1':0})[value] ?? 0;}
function scoreClass(value){return value>=80?'score-good':value>=60?'score-ok':value>=30?'score-low':'score-bad';}
function effectivePriority(topic,genre){
  const base=REF.basePriorities?.[genre] || Array(9).fill(.8);
  const adjustment=REF.adjustments?.[topic]?.[genre];
  return base.map((value,index)=>adjustment?.[index] ?? value);
}
function prioritySlider(topic,genre){
  const values=effectivePriority(canonicalTopic(topic),genre);
  return [0,1,2].map(phase=>{
    const group=values.slice(phase*3,phase*3+3), peak=Math.max(...group,0.01);
    return group.map(value=>Math.round(value/peak*100));
  });
}
function fitLabel(value){return value===3?'+++':value===2?'++':value===1?'+':value===0?'--':'---';}
function fitClass(value){return value>=3?'fit-3':value===2?'fit-2':value===1?'fit-1':value===0?'fit-0':'fit-neg';}
function audienceFit(topic,audience){
  const row=REF_TOPIC_BY_NAME.get(canonicalTopic(topic));
  const audienceIndex=['Young','Everyone','Mature'].indexOf(audience);
  if(row && audienceIndex>=0) return normalizedFit(row[7+audienceIndex]);
  const source=TOPICS.find(x=>x[0]===topic);
  const young=['School','Virtual Pet','Card Game','Fantasy','Sports','Comedy','Music','Fashion','Cooking'];
  const mature=['Horror','Military','Cyberpunk','Business','Government','Detective','Post-Apocalyptic','Spy','History'];
  if((audience==='Young'&&young.includes(topic))||(audience==='Mature'&&mature.includes(topic))) return 3;
  if(audience==='Everyone'&&source?.[3]==='High') return 3;
  if(source?.[3]==='Medium'||audience==='Everyone') return 2;
  return audience===source?.[3]?2:1;
}
function platformAudienceFit(platform,audience){
  const row=REF_PLATFORM_BY_NAME.get(canonicalPlatform(platform));
  const audienceIndex=['Young','Everyone','Mature'].indexOf(audience);
  if(row && audienceIndex>=0) return normalizedFit(row[7+audienceIndex]);
  const young=['Game Link','Vena Gear','Master V','Nuu','GameSphere'];
  const mature=['PC','TES','DreamVast','PlaySystem','MBox','Playsystem 2','MBox 360','PlaySystem 3','MBox One'];
  if(audience==='Young'&&young.includes(platform)) return 3;
  if(audience==='Mature'&&mature.includes(platform)) return 3;
  return audience==='Everyone'?3:1;
}
function scoreFor(topic, genre, platform){
  const fit=fitFor(topic,genre);
  const plat = REF_PLATFORM_BY_NAME.get(canonicalPlatform(platform));
  const platformScore = plat ? plat[1+REF_GENRES.indexOf(genre)]*10 : 8;
  const genreWeight = ['RPG','Strategy','Adventure'].includes(genre) ? 1 : 0;
  const synergy = 5.2 + fit*1.05 + platformScore*.22 + genreWeight*.25;
  return Math.min(10,Math.max(5,Math.round(synergy*10)/10));
}
function recommendedPlatform(genre,audience){
  return REF.platforms.map(row=>({name:row[0],genreFit:normalizedFit(row[1+REF_GENRES.indexOf(genre)]),audienceFit:platformAudienceFit(row[0],audience)})).sort((a,b)=>(fitPoints(b.genreFit)+fitPoints(b.audienceFit))-(fitPoints(a.genreFit)+fitPoints(a.audienceFit)))[0];
}
function buildGame(topic,genre,platform,audience,size){
  const topicGenre=fitFor(topic,genre);
  const topicAudience=audienceFit(topic,audience);
  const recommended=platform==='all'?recommendedPlatform(genre,audience):null;
  const chosenPlatform=platform==='all'?recommended.name:platform;
  const platformGenre=platform==='all'?recommended.genreFit:platformScoreForGenre(platform,genre);
  const platformAudience=platform==='all'?recommended.audienceFit:platformAudienceFit(platform,audience);
  const sizeMultiplier={Small:1,Medium:1.2,Large:1.4,AAA:1.8}[size]||1;
  const breakdown={topicGenre:fitPoints(topicGenre),platformGenre:fitPoints(platformGenre),topicAudience:fitPoints(topicAudience),platformAudience:fitPoints(platformAudience)};
  const totalScore=breakdown.topicGenre+breakdown.platformGenre+breakdown.topicAudience+breakdown.platformAudience;
  const score=Math.round(totalScore/40*10)/10;
  return {topic,genre,platform:chosenPlatform,platformLabel:platform==='all'?'Suggested platform':'Selected platform',platformWasSuggested:platform==='all',audience,size,score,totalScore,sizeMultiplier,compat:{topicGenre,topicAudience,platformGenre,platformAudience},breakdown};
}
function platformScoreForGenre(platform,genre){
  const row=REF_PLATFORM_BY_NAME.get(canonicalPlatform(platform));
  const exactIndex=REF_GENRES.indexOf(genre);
  if(row && exactIndex>=0) return normalizedFit(row[1+exactIndex]);
  const strong=['Action','Adventure','RPG'];
  const p=PLATFORMS.find(x=>x[0]===platform);
  if(!p) return 1;
  return p[2]>=9?(strong.includes(genre)?3:2):p[2]>=8?(strong.includes(genre)?2:1):1;
}
function renderAnalysis(){
  const topicCandidates=[...selectedTopics];
  if(!topicCandidates.length){$('analysisResult').classList.remove('hidden');$('analysisResult').innerHTML='<div class="analysis-empty"><strong>Select at least one topic first.</strong><span>Go back to Your topics and choose the topics available in your game.</span></div>';return;}
  const platform=$('platformFilter').value, audience=$('audienceFilter').value, size=$('sizeFilter').value, selectedGenre=$('genreFilter').value;
  const candidates=[];
  topicCandidates.forEach(topic=>{(selectedGenre==='all'?GENRES:[selectedGenre]).forEach(genre=>candidates.push(buildGame(topic,genre,platform,audience,size)));});
  candidates.sort((a,b)=>b.score-a.score);
  const result=candidates[0];
  const slider=prioritySlider(result.topic,result.genre);
  $('analysisResult').classList.remove('hidden');
  $('analysisResult').innerHTML=`<div class="analysis-header"><div><span class="eyebrow">03 / GAME PLAN</span><h2>${result.topic} <em>×</em> ${result.genre}</h2><p>${result.size} game · ${result.platform} · ${result.audience} audience</p></div><div class="analysis-score"><span>ESTIMATED FIT</span><strong>${result.score.toFixed(1)}</strong><small>/ 10</small></div></div><div class="analysis-body"><div class="compatibility-panel"><div class="subheading"><span class="eyebrow">COMPATIBILITY BREAKDOWN</span><span class="legend">+++ best · --- avoid</span></div>${[['Topic × Genre',result.compat.topicGenre],['Topic × Audience',result.compat.topicAudience],['Platform × Genre',result.compat.platformGenre],['Platform × Audience',result.compat.platformAudience]].map(x=>`<div class="compatibility-line"><span>${x[0]}</span><b class="fit-${x[1]>=3?'3':x[1]===2?'2':x[1]===1?'1':x[1]===0?'0':'neg'}">${fitLabel(x[1])}</b><i><em style="width:${Math.max(8,(x[1]+1)*25)}%"></em></i></div>`).join('')}</div><div class="why-panel"><span class="eyebrow">WHY THIS PICK</span><h3>${result.score>=8?'Strong setup':'Best available setup'}</h3><p>The planner selected the highest-scoring topic from your available topics for this setup. Use the phase plan as a starting preset and keep the game’s graphics, staff skills and current high score in mind.</p><button class="text-button" id="showAllPlans">Compare all matching topics →</button></div></div><div class="phase-plan"><div class="subheading"><div><span class="eyebrow">DEVELOPMENT PHASES</span><h3>Slider starting points</h3></div><span class="legend">${result.topic} × ${result.genre} preset · ${result.size} game</span></div><div class="phase-cards">${slider.map((values,index)=>`<div class="phase-plan-card"><span class="eyebrow">PHASE ${index+1}</span>${PHASE_LABELS[index].map((label,i)=>`<div class="phase-row"><span>${label}</span><div><i style="width:${values[i]}%"></i></div><b>${values[i]}%</b></div>`).join('')}</div>`).join('')}</div><small class="plan-disclaimer">These are the consolidated topic and genre values. Graphics features, employee specialisation, bugs and the Target High Score can still change the final result.</small></div>`;
  $('showAllPlans').addEventListener('click',()=>{$('results').scrollIntoView({behavior:'smooth',block:'start'});});
}
function fillSelects(){
  const platforms=REF.platforms.length?REF.platforms.map(p=>[p[0],p[0]]):PLATFORMS;
  $('platformFilter').innerHTML = '<option value="all">All platforms</option>' + platforms.map(p=>`<option value="${p[0]}">${p[1]}</option>`).join('');
  $('genreFilter').innerHTML = '<option value="all">All genres</option>' + GENRES.map(g=>`<option value="${g}">${g}</option>`).join('');
  $('audienceFilter').innerHTML = AUDIENCES.map(a=>`<option value="${a}">${a}</option>`).join('');
  $('sizeFilter').innerHTML = GAME_SIZES.map(s=>`<option value="${s}">${s} game</option>`).join('');
}
function persist(){ localStorage.setItem(STORAGE_KEY, JSON.stringify([...selectedTopics])); }
function renderChips(){
  const query = $('topicSearch').value.toLowerCase();
  const unique = defaultTopics.filter(t=>t.toLowerCase().includes(query));
  $('topicChips').innerHTML = unique.map(t=>`<button type="button" aria-pressed="${selectedTopics.has(t)}" class="topic-choice ${selectedTopics.has(t)?'selected':''}" data-topic="${t}"><span class="topic-choice-mark">${selectedTopics.has(t)?'✓':'+'}</span><span>${t}</span></button>`).join('');
  $('topicCount').textContent = `${selectedTopics.size} selected`;
  document.querySelectorAll('#topicChips [data-topic]').forEach(btn=>btn.addEventListener('click',()=>{selectedTopics.has(btn.dataset.topic)?selectedTopics.delete(btn.dataset.topic):selectedTopics.add(btn.dataset.topic);persist();renderChips();renderResults();renderManager();}));
}
function renderGenreOptions(){
  const value=$('genreFilter').value;
  $('genreOptions').innerHTML=`<button class="genre-option ${value==='all'?'active':''}" data-genre="all">All</button>`+GENRES.map(g=>`<button class="genre-option ${value===g?'active':''}" data-genre="${g}">${g}</button>`).join('');
  document.querySelectorAll('#genreOptions [data-genre]').forEach(btn=>btn.addEventListener('click',()=>{$('genreFilter').value=btn.dataset.genre;renderGenreOptions();renderResults();}));
}
function resultDetails(game){
  const slider=prioritySlider(game.topic,game.genre);
  const checks=[['Topic × Genre',game.compat.topicGenre,game.breakdown.topicGenre],['Genre × Platform',game.compat.platformGenre,game.breakdown.platformGenre],['Topic × Audience',game.compat.topicAudience,game.breakdown.topicAudience],['Platform × Audience',game.compat.platformAudience,game.breakdown.platformAudience]];
  return `<div class="result-details-content"><div class="detail-score-head"><div><span class="eyebrow">TOTAL COMPATIBILITY</span><strong>${game.totalScore} <small>/ 400</small></strong></div><span class="detail-score-grade ${scoreClass(game.score*10)}">${game.score.toFixed(1)} / 10</span></div><div class="detail-platform"><span>${game.platformLabel}</span><strong>${game.platform}</strong></div><div class="detail-checks">${checks.map(([label,value,points])=>`<div class="detail-check"><div class="detail-check-label"><span>${label}</span><b class="${fitClass(value)}">${fitLabel(value)}</b></div><div class="detail-score-bar"><i class="${scoreClass(points)}" style="width:${points}%"></i></div><strong>${points}<small> pts</small></strong></div>`).join('')}</div><div class="detail-plan"><div class="detail-plan-heading"><span class="eyebrow">DEVELOPMENT PLAN</span><span>${game.size} · ${game.audience}</span></div><div class="detail-phases">${slider.map((values,index)=>`<div><strong>Phase ${index+1}</strong><span>${PHASE_LABELS[index].map((label,i)=>`<em><b>${label}</b><i><u style="width:${values[i]}%"></u></i>${values[i]}%</em>`).join('')}</span></div>`).join('')}</div></div></div>`;
}
function renderResults(){
  const platform = $('platformFilter').value, genre = $('genreFilter').value, audience = $('audienceFilter').value, size = $('sizeFilter').value, sort = $('sortFilter').value;
  let rows=[];
  selectedTopics.forEach(topic=>{GENRES.filter(g=>genre==='all'||g===genre).forEach(g=>{const game=buildGame(topic,g,platform,audience,size);if(game.score)rows.push(game);});});
  rows.sort((a,b)=>sort==='alpha'?a.topic.localeCompare(b.topic):b.totalScore-a.totalScore);
  $('resultCount').textContent=rows.length;
  $('results').innerHTML=rows.slice(0,24).map((r,i)=>`<article class="result-card"><span class="rank">#${String(i+1).padStart(2,'0')}</span><span class="eyebrow">${r.platformLabel}: ${r.platform}</span><h4>${r.topic} <span class="muted">×</span> ${r.genre}</h4><div class="result-meta">${r.size} game · ${r.audience} audience</div><div class="score-row"><div class="score-bar"><i style="width:${r.score*10}%"></i></div><span class="score">${r.totalScore} / 400</span></div><div class="result-score-label"><strong>${r.score.toFixed(1)} / 10</strong><span>combined fit score</span></div><div class="tags"><span class="tag orange">${fitFor(r.topic,r.genre)>=3?'GREAT COMBO':fitFor(r.topic,r.genre)>=2?'GOOD COMBO':'OKAY COMBO'}</span><span class="tag">${fitLabel(fitFor(r.topic,r.genre))}</span></div><button type="button" class="result-toggle" aria-expanded="false">View score breakdown <span>+</span></button><div class="result-details" hidden>${resultDetails(r)}</div></article>`).join('') || '<div class="empty">No combinations found. Try enabling more topics or changing a filter.</div>';
  document.querySelectorAll('.result-toggle').forEach(button=>button.addEventListener('click',()=>{const details=button.nextElementSibling;const open=details.hidden;details.hidden=!open;button.setAttribute('aria-expanded',String(open));button.innerHTML=open?'Hide breakdown <span>−</span>':'View breakdown <span>+</span>';}));
}
function renderReference(){
  const query=($('referenceSearch')?.value||'').toLowerCase();
  const topics=defaultTopics.filter(t=>t.toLowerCase().includes(query));
  $('topicMatrix').innerHTML=`<thead><tr><th>Topic</th>${REF_GENRES.map(g=>`<th>${g}</th>`).join('')}</tr></thead><tbody>${topics.map(t=>`<tr><td>${t}</td>${REF_GENRES.map(g=>{const v=fitFor(t,g);return `<td class="${fitClass(v)}">${fitLabel(v)}</td>`}).join('')}</tr>`).join('')}</tbody>`;
  $('platformMatrix').innerHTML=`<thead><tr><th>Platform</th>${REF_GENRES.map(g=>`<th>${g}</th>`).join('')}</tr></thead><tbody>${REF.platforms.map(p=>`<tr><td>${p[0]}</td>${REF_GENRES.map((g,i)=>{const v=normalizedFit(p[1+i]);return `<td class="${fitClass(v)}">${fitLabel(v)}</td>`}).join('')}</tr>`).join('')}</tbody>`;
  $('audienceTopicMatrix').innerHTML=`<thead><tr><th>Topic</th>${['Everyone','Young','Mature'].map(a=>`<th>${a}</th>`).join('')}</tr></thead><tbody>${defaultTopics.map(t=>`<tr><td>${t}</td>${['Everyone','Young','Mature'].map(a=>{const v=audienceFit(t,a);return `<td class="${fitClass(v)}">${fitLabel(v)}</td>`}).join('')}</tr>`).join('')}</tbody>`;
  $('audiencePlatformMatrix').innerHTML=`<thead><tr><th>Platform</th>${['Everyone','Young','Mature'].map(a=>`<th>${a}</th>`).join('')}</tr></thead><tbody>${REF.platforms.map(p=>`<tr><td>${p[0]}</td>${['Everyone','Young','Mature'].map(a=>{const v=platformAudienceFit(p[0],a);return `<td class="${fitClass(v)}">${fitLabel(v)}</td>`}).join('')}</tr>`).join('')}</tbody>`;
  const sliderRows={Action:[[100,80,0],[0,80,100],[0,100,80]],Adventure:[[0,80,100],[100,0,0],[100,80,0]],RPG:[[0,80,100],[100,80,0],[100,100,80]],Simulation:[[80,100,0],[0,80,100],[0,100,80]],Strategy:[[100,100,0],[0,0,100],[100,100,80]],Casual:[[0,100,0],[0,100,0],[0,50,100]]};
  const names=[['Engine','Gameplay','Story'],['Dialogues','Level Design','AI'],['World Design','Graphics','Sound']];
  $('sliderMatrix').innerHTML=`<thead><tr><th>Genre</th><th>Phase 1</th><th>Phase 2</th><th>Phase 3</th></tr></thead><tbody>${GENRES.map(g=>`<tr><td>${g}</td>${sliderRows[g].map((v,i)=>`<td title="${names[i].join(' / ')}">${v.join(' / ')}</td>`).join('')}</tr>`).join('')}</tbody>`;
  const priorityRows=[];
  defaultTopics.forEach(topic=>GENRES.forEach(genre=>priorityRows.push(`<tr><td>${topic}</td><td>${genre}</td>${prioritySlider(topic,genre).flat().map(v=>`<td>${v}%</td>`).join('')}</tr>`)));
  $('priorityMatrix').innerHTML=`<thead><tr><th>Topic</th><th>Genre</th>${['Engine','Gameplay','Story','Dialogues','Level Design','AI','World Design','Graphics','Sound'].map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${priorityRows.join('')}</tbody>`;
}
function renderManager(){
  const topics=defaultTopics;
  $('topicManager').innerHTML=`<div class="manager-toolbar"><div><span class="eyebrow">TOPIC COLLECTION</span><strong>${selectedTopics.size} of ${topics.length} active</strong></div><div class="manager-actions"><button class="manager-action" id="managerSelectAll">Select all</button><button class="manager-action muted-action" id="managerClearAll">Clear all</button></div></div><div class="manager-grid">${topics.map((t,i)=>`<button class="manager-item ${selectedTopics.has(t)?'selected':''}" data-topic="${t}"><span class="manager-index">${String(i+1).padStart(2,'0')}</span><span class="manager-name">${t}</span><span class="manager-state">${selectedTopics.has(t)?'✓':''}</span></button>`).join('')}</div>`;
  document.querySelectorAll('#topicManager .manager-item').forEach(item=>item.addEventListener('click',()=>{selectedTopics.has(item.dataset.topic)?selectedTopics.delete(item.dataset.topic):selectedTopics.add(item.dataset.topic);persist();renderChips();renderResults();renderManager();}));
  $('managerSelectAll').addEventListener('click',()=>{selectedTopics=new Set(defaultTopics);persist();renderChips();renderResults();renderManager();});
  $('managerClearAll').addEventListener('click',()=>{selectedTopics=new Set();persist();renderChips();renderResults();renderManager();});
}
function showView(view){document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));$(`${view}View`).classList.remove('hidden');document.querySelectorAll('.nav-link').forEach(n=>n.classList.toggle('active',n.dataset.view===view));}
fillSelects();renderGenreOptions();renderChips();renderResults();renderManager();renderReference();
$('topicSearch').addEventListener('input',renderChips);$('platformFilter').addEventListener('change',renderResults);$('genreFilter').addEventListener('change',renderResults);$('audienceFilter').addEventListener('change',renderResults);$('sizeFilter').addEventListener('change',renderResults);$('sortFilter').addEventListener('change',renderResults);
$('genreFilter').addEventListener('change',renderGenreOptions);$('referenceSearch').addEventListener('input',renderReference);
$('selectAll').addEventListener('click',()=>{selectedTopics=new Set(defaultTopics);persist();renderChips();renderResults();renderManager();});
$('selectVisibleTopics').addEventListener('click',()=>{const query=$('topicSearch').value.toLowerCase();defaultTopics.filter(t=>t.toLowerCase().includes(query)).forEach(t=>selectedTopics.add(t));persist();renderChips();renderResults();renderManager();});
$('clearTopics').addEventListener('click',()=>{selectedTopics=new Set();persist();renderChips();renderResults();renderManager();});
$('analyzeBtn').addEventListener('click',renderAnalysis);
$('resetBtn').addEventListener('click',()=>{$('topicSearch').value='';$('platformFilter').value='all';$('genreFilter').value='all';$('audienceFilter').value='Everyone';$('sizeFilter').value='Small';$('sortFilter').value='score';selectedTopics=new Set(defaultTopics);persist();renderGenreOptions();renderChips();renderResults();renderManager();$('analysisResult').classList.add('hidden');});
document.querySelectorAll('.nav-link').forEach(n=>n.addEventListener('click',()=>{showView(n.dataset.view);if(n.dataset.view==='reference')renderReference();}));
