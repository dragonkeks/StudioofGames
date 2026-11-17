export const GAME_TYPES = {
  quiz:{name:'Wissensquiz',icon:'◈',desc:'Fragen mit Textantworten, Buzzer oder Moderatorwertung'},
  choice:{name:'Multiple Choice',icon:'▦',desc:'Fragen mit 2–6 Antwortmöglichkeiten'},
  estimate:{name:'Schätzfragen',icon:'≋',desc:'Zahlen schätzen; Abweichungen vergleichen'},
  music:{name:'Musik & Medien',icon:'♫',desc:'Audio-/Videorunden und Titel erraten'},
  manual:{name:'Challenge',icon:'⚑',desc:'Sport, Geschicklichkeit und freie Aufgaben'},
  collection:{name:'Sammelkarten',icon:'✷',desc:'Kategorien und Aufgaben sammeln'},
  wager:{name:'Risikorunde',icon:'◆',desc:'Punkte oder Münzen einsetzen; manuelle Auswertung'}
};
export const ANSWER_MODES = {buzz:'Buzzer',text:'Handy-Eingabe',choice:'Auswahl am Handy',host:'Moderator entscheidet',both:'Buzzer & Eingabe'};
export const THEMES = [
  {id:'sunset',name:'Neon Sunset',primary:'#ff728c',secondary:'#ffc36c',bg:'#121427'},
  {id:'lagoon',name:'Electric Lagoon',primary:'#58dbcd',secondary:'#7d9eff',bg:'#101e2e'},
  {id:'violet',name:'Electric Violet',primary:'#b69cff',secondary:'#fb87c2',bg:'#171427'},
  {id:'gold',name:'Golden Night',primary:'#f3c46e',secondary:'#f29c86',bg:'#1b1922'}
];
export const uid = () => Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4);
export const clone = value => JSON.parse(JSON.stringify(value));
export const esc = value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const toInt = (value,min=0,max=1000000)=>Math.min(max,Math.max(min,Math.round(Number(value)||0)));
export const safeUrl = value=>{try{const u=new URL(String(value));return (u.protocol==='https:'||u.protocol==='http:')?u.href:'';}catch{return '';}};
export const friendlyDate = value=>new Date(value||Date.now()).toLocaleDateString('de-DE',{day:'2-digit',month:'short',year:'numeric'});
export const DEFAULT_QUESTIONS=[{id:uid(),text:'Wie heißt die Hauptstadt Portugals?',answer:'Lissabon',options:['Lissabon','Porto','Faro','Coimbra'],mediaType:'',mediaUrl:''}];
export function newGame(type='quiz',i=0){const names={quiz:'Wissen ist Macht',choice:'Vier Möglichkeiten',estimate:'Schätz dich glücklich',music:'Musik-Massaker',manual:'Geschicklichkeitsduell',collection:'Sammelkarten',wager:'Alles oder nichts'};return {
  id:uid(),type,title:names[type]||'Neues Spiel',description:'',winPoints:i+1,scoreMode:'inherit',answerMode: type==='choice'?'choice':type==='manual'?'host':type==='wager'?'choice':'buzz',
  questions:type==='manual'?[{id:uid(),text:'Beschreibe hier die Aufgabe oder Challenge.',answer:'',options:[],mediaType:'',mediaUrl:''}]:type==='wager'?[{id:uid(),text:'Welche Antwort ist richtig?',answer:'A',options:['Antwort A','Antwort B','Antwort C','Antwort D'],mediaType:'',mediaUrl:''}]:clone(DEFAULT_QUESTIONS),
  target:5,correctPoints:1,wrongPoints:0,coinWin:0,coinCorrect:0,seconds:30,showResponses:true,
  estimateTolerance:10,collectionNames:['Sport','Geografie','Wissen'],wagerBonus:10,allowSkip:true
};}
export function createShow(name='Meine Gameshow') {let g1=newGame('quiz',0),g2=newGame('choice',1),g3=newGame('manual',2);g2.title='Vier Antworten';g3.title='Die große Challenge';return {
 id:uid(),name,subtitle:'Die Show gehört euch.',dateCreated:Date.now(),dateUpdated:Date.now(),theme:'sunset',
 settings:{scoreMode:'bonus',coinsEnabled:false,participants:'teams',revealAnswers:true},
 teams:[{id:'team-a',name:'Team Pink',color:'#ff728c'},{id:'team-b',name:'Team Türkis',color:'#58dbcd'}],
 games:[g1,g2,g3]};}
export function demoShow(){const s=createShow('MÁLAGA GAMES · Neue Edition');s.subtitle='Die Finca Show · neu gedacht';s.teams[0].name='Herausforderer';s.teams[1].name='Showowner';const descriptors=[
 ['quiz','Wahrheit oder Wahnsinn',1],['manual','Bring mir die Antwort',2],['music','Musik-Massaker',3],['manual','Padel-Tic-Tac-Toe',4],['estimate','Schätz dich ins Aus',5],['manual','Das perfekte Timing',6],['manual','Finca-Hindernisparcours',7],['wager','Alles oder nichts',8],['collection','Das große Finale',9]
 ];s.games=descriptors.map(([t,n,p],i)=>{let g=newGame(t,i);g.title=n;g.winPoints=p;if(t==='collection')g.collectionNames=['Geografie','Geschichte','Sprachen','Politik','Sport','Naturwissenschaften','Film & Fernsehen'];if(t==='wager')g.description='Jedes Team startet mit eigenem Einsatzkonto. Spezialregeln werden in einer späteren Modulversion ergänzt.';return g;});return s;}
export function showPublic(session,show){
 const game=show.games[session.gameIndex]||null;
 const q=game?.questions[session.questionIndex]||null;
 return {
  sessionId:session.id,showId:show.id,showName:show.name,subtitle:show.subtitle,theme:show.theme,teams:show.teams,
  phase:session.phase,gameIndex:session.gameIndex,gameTitle:game?.title||'',gameType:game?.type||'',gameWinPoints:game?.winPoints||0,
  questionIndex:session.questionIndex,questionTotal:game?.questions.length||0,questionToken:session.questionToken,
  prompt:session.phase!=='lobby'&&q?q.text:'',options:q&&session.phase!=='lobby'&&['choice','wager'].includes(game?.type)?q.options||[]:[],
  mediaType:q&&session.phase!=='lobby'?q.mediaType:'',mediaUrl:q&&session.phase!=='lobby'?safeUrl(q.mediaUrl):'',
  answerRevealed:session.revealed,answer:session.revealed?(q?.answer||''):'',
  answerMode:game?.answerMode||'host',buzzOpen:session.buzzOpen,entryOpen:session.entryOpen,showResponses:!!game?.showResponses,
  scoreboard:session.scoreboard,gameScores:session.gameScores,coinsEnabled:show.settings.coinsEnabled,
  results:session.results,collected:session.collected||{},wagerBanks:session.banks||null,roundMessage:session.roundMessage,updatedAt:Date.now()
 };
}
export function newSession(show){return {id:uid().slice(0,8).toUpperCase(),showId:show.id,showSnapshot:clone(show),created:Date.now(),updated:Date.now(),phase:'lobby',gameIndex:0,questionIndex:0,questionToken:uid(),revealed:false,buzzOpen:false,entryOpen:false,roundMessage:'',scoreboard:Object.fromEntries(show.teams.map(t=>[t.id,{points:0,coins:0}])),gameScores:Object.fromEntries(show.teams.map(t=>[t.id,0])),results:{},history:[],winner:null,finished:false};}
export function normalizeShow(input){
 if(!input||typeof input!=='object'||!Array.isArray(input.games)||!Array.isArray(input.teams))throw Error('Ungültige Show-Datei.');
 const base=createShow();const clean={...base,...clone(input)};
 clean.id=String(clean.id||uid()).replace(/[^A-Za-z0-9_-]/g,'').slice(0,60)||uid();clean.name=String(clean.name||'Meine Show').slice(0,100);clean.subtitle=String(clean.subtitle||'').slice(0,180);
 clean.settings={...base.settings,...(clean.settings||{})};clean.theme=THEMES.some(t=>t.id===clean.theme)?clean.theme:'sunset';
 clean.teams=clean.teams.slice(0,6).map((t,i)=>({id:String(t.id||'team-'+i).replace(/[^a-zA-Z0-9_-]/g,'').slice(0,40),name:String(t.name||'Team '+(i+1)).slice(0,60),color:/^#[a-f0-9]{6}$/i.test(t.color||'')?t.color:THEMES[i%THEMES.length].primary}));
 if(clean.teams.length<2)throw Error('Eine Show benötigt mindestens zwei Teams.');
 clean.games=clean.games.slice(0,50).map((g,i)=>{
  let result={...newGame(GAME_TYPES[g.type]?g.type:'quiz',i),...g};result.id=String(result.id||uid()).replace(/[^A-Za-z0-9_-]/g,'').slice(0,60)||uid();result.title=String(result.title||'Spiel '+(i+1)).slice(0,100);
  result.winPoints=toInt(result.winPoints,0,9999);result.correctPoints=toInt(result.correctPoints,0,9999);result.wrongPoints=toInt(result.wrongPoints,0,9999);result.coinWin=toInt(result.coinWin,0,9999);result.coinCorrect=toInt(result.coinCorrect,0,9999);result.seconds=toInt(result.seconds,0,3600);
  result.questions=(Array.isArray(g.questions)?g.questions:[]).slice(0,200).map(q=>({id:String(q.id||uid()).replace(/[^A-Za-z0-9_-]/g,'').slice(0,60)||uid(),text:String(q.text||'').slice(0,2000),answer:String(q.answer||'').slice(0,1000),options:(Array.isArray(q.options)?q.options:[]).slice(0,6).map(x=>String(x).slice(0,240)),mediaType:['','image','audio','video'].includes(q.mediaType)?q.mediaType:'',mediaUrl:safeUrl(q.mediaUrl)}));
  return result;
 });return clean;
}
export function fromMalagaBackup(data){
 if(!data?.questions?.questions)throw Error('Die Datei enthält keinen älteren MÁLAGA-GAMES-Fragenpool.');
 const out=demoShow();const legacy=data.questions.questions;
 const keys=['1','2','3',null,'5',null,null,'8'];
 for(let i=0;i<out.games.length;i++){
  const g=out.games[i];const old=legacy[keys[i]];
  if(Array.isArray(old)&&old.length)g.questions=old.map(q=>({id:uid(),text:String(q.text||''),answer:String(q.answer||''),options:Array.isArray(q.choices)?q.choices:[],mediaType:'',mediaUrl:''}));
 }
 const f=out.games[8];const cats=['Geografie','Geschichte','Sprachen','Politik','Sport','Naturwissenschaften','Film & Fernsehen'];
 f.collectionNames=cats;f.questions=cats.flatMap(c=>(legacy['9:'+c]||[]).map(q=>({id:uid(),text:`[${c}] ${q.text||''}`,answer:String(q.answer||''),options:[],mediaType:'',mediaUrl:''})));
 // Separate wheel questions become a standalone knowledge game, preserving their categories.
 const drawn=cats.flatMap(c=>(legacy['teams:'+c]||[]).map(q=>({id:uid(),text:`[${c}] ${q.text||''}`,answer:String(q.answer||''),options:[],mediaType:'',mediaUrl:''})));
 if(drawn.length){const draw=newGame('quiz');draw.title='Teamauslosung · Fragenpool';draw.winPoints=0;draw.questions=drawn;out.games.unshift(draw);}
 out.name='MÁLAGA GAMES · Import';out.id=uid();out.dateUpdated=Date.now();return out;
}
