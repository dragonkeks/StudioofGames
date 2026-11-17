/* SHOWSTUDIO sync adapter. The new paths are intentionally separate from MÁLAGA GAMES /rooms. */
const PREFIX='showstudio:v1:';
const storageKey=id=>PREFIX+'session:'+id;
const membersKey=id=>PREFIX+'members:'+id;
const answersKey=id=>PREFIX+'answers:'+id;
const buzzerKey=id=>PREFIX+'buzz:'+id;
const load=key=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}};
const save=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
export function localSync(id,listener){
 const channel=typeof BroadcastChannel!=='undefined'?new BroadcastChannel('showstudio:'+id):null;
 const notify=()=>listener({session:load(storageKey(id)),members:load(membersKey(id))||{},answers:load(answersKey(id))||{},buzz:load(buzzerKey(id))});
 const onStorage=ev=>{if(ev.key?.startsWith(PREFIX))notify();};
 channel?.addEventListener('message',notify);window.addEventListener('storage',onStorage);
 const pulse=()=>{channel?.postMessage('updated');notify();};
 return {
  mode:'local',ready:Promise.resolve(),read:notify,
  hostSave:async(session)=>{save(storageKey(id),session);pulse()},
  join:async(name,teamId)=>{const pid='local-'+Math.random().toString(36).slice(2,8),items=load(membersKey(id))||{};items[pid]={name,teamId,joinedAt:Date.now()};save(membersKey(id),items);pulse();return pid;},
  answer:async(pid,value,questionToken,teamId)=>{const a=load(answersKey(id))||{};a[pid]={value,questionToken,teamId,at:Date.now()};save(answersKey(id),a);pulse()},
  buzz:async(pid,teamId,name)=>{if(load(buzzerKey(id)))return false;save(buzzerKey(id),{uid:pid,teamId,name,at:Date.now()});pulse();return true},
  clearBuzz:async()=>{localStorage.removeItem(buzzerKey(id));pulse()},
  clearAnswers:async()=>{save(answersKey(id),{});pulse()},
  close:()=>{channel?.close();window.removeEventListener('storage',onStorage)}
 };
}
const cfg=()=>window.SHOWSTUDIO_FIREBASE_CONFIG||{};
export const hasCloudConfig=()=>!!(cfg().apiKey&&cfg().authDomain&&cfg().databaseURL&&cfg().projectId&&cfg().appId);
let clientPromise=null;
export async function firebaseClient(){
 if(!hasCloudConfig())throw Error('Firebase-Konfiguration fehlt. Bitte zuerst firebase-config.js einrichten.');
 if(clientPromise)return clientPromise;
 clientPromise=(async()=>{
  const ver='11.10.0';
  const [a,b,c]=await Promise.all([
   import(`https://www.gstatic.com/firebasejs/${ver}/firebase-app.js`),
   import(`https://www.gstatic.com/firebasejs/${ver}/firebase-auth.js`),
   import(`https://www.gstatic.com/firebasejs/${ver}/firebase-database.js`)
  ]);
  const app=a.initializeApp(cfg(), 'showstudio-next'),auth=b.getAuth(app),db=c.getDatabase(app);
  return {auth,db,A:b,D:c};
 })().catch(e=>{clientPromise=null;throw e});return clientPromise;
}
export async function currentCloudUser(){const c=await firebaseClient();return new Promise(resolve=>{const unsub=c.A.onAuthStateChanged(c.auth,u=>{unsub();resolve(u)});});}
export async function ensureAnonymous(){const c=await firebaseClient();let u=await currentCloudUser();if(!u)u=(await c.A.signInAnonymously(c.auth)).user;return u;}
export async function cloudLogin(email,password){const c=await firebaseClient();return (await c.A.signInWithEmailAndPassword(c.auth,email,password)).user;}
export async function cloudLogout(){const c=await firebaseClient();await c.A.signOut(c.auth);}
const base=id=>`showstudioV1/sessions/${id}`;
export async function cloudCreate(session,publicState){
 const c=await firebaseClient(),u=await currentCloudUser();
 if(!u||u.isAnonymous)throw Error('Für Live-Shows bitte als Moderator mit E-Mail und Passwort anmelden.');
 await c.D.set(c.D.ref(c.db,`${base(session.id)}/hostUid`),u.uid);
 await c.D.set(c.D.ref(c.db,`${base(session.id)}/private`),session);
 await c.D.set(c.D.ref(c.db,`${base(session.id)}/public`),publicState);
 await c.D.set(c.D.ref(c.db,`${base(session.id)}/createdAt`),Date.now());
}
export async function cloudSync(id,role,listener){
 const c=await firebaseClient(),u=await ensureAnonymous();const unsubs=[];
 const readChild=(path,key)=>{
  unsubs.push(c.D.onValue(c.D.ref(c.db,`${base(id)}/${path}`), snap=>listener({[key]:snap.val()}), err=>listener({error:err.message})));
 };
 readChild('public','public');readChild('buzz','buzz');
 if(role==='host'&&!u.isAnonymous){readChild('private','session');readChild('players','members');readChild('answers','answers');}
 return {
  mode:'cloud',user:u,ready:Promise.resolve(),read:()=>{},
  hostSave:async(session,publicState)=>{
   const who=await currentCloudUser();if(!who||who.isAnonymous)throw Error('Moderator-Anmeldung erforderlich.');
   await c.D.set(c.D.ref(c.db,`${base(id)}/private`),session);
   await c.D.set(c.D.ref(c.db,`${base(id)}/public`),publicState);
   await c.D.set(c.D.ref(c.db,`${base(id)}/updatedAt`),Date.now());
  },
  join:async(name,teamId)=>{const who=await ensureAnonymous();if(!who.isAnonymous)throw Error('Spieler müssen die Handyansicht in einem privaten Browserfenster öffnen.');await c.D.set(c.D.ref(c.db,`${base(id)}/players/${who.uid}`),{name,teamId,joinedAt:Date.now()});return who.uid;},
  answer:async(pid,value,questionToken,teamId)=>c.D.set(c.D.ref(c.db,`${base(id)}/answers/${pid}`),{value:String(value).slice(0,500),questionToken,teamId,at:Date.now()}),
  buzz:async(pid,teamId,name)=>{const result=await c.D.runTransaction(c.D.ref(c.db,`${base(id)}/buzz`),present=>present===null?{uid:pid,teamId,name,at:Date.now()}:undefined,{applyLocally:false});return result.committed},
  clearBuzz:()=>c.D.remove(c.D.ref(c.db,`${base(id)}/buzz`)),
  clearAnswers:()=>c.D.remove(c.D.ref(c.db,`${base(id)}/answers`)),
  close:()=>unsubs.forEach(f=>f())
 };
}
export async function saveCloudTemplate(show){const c=await firebaseClient(),u=await currentCloudUser();if(!u||u.isAnonymous)throw Error('Moderator-Anmeldung notwendig.');await c.D.set(c.D.ref(c.db,`showstudioV1/templates/${u.uid}/${show.id}`),show);}
export async function loadCloudTemplates(){const c=await firebaseClient(),u=await currentCloudUser();if(!u||u.isAnonymous)throw Error('Moderator-Anmeldung notwendig.');const s=await c.D.get(c.D.ref(c.db,`showstudioV1/templates/${u.uid}`));return Object.values(s.val()||{});}
