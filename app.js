// Camino a Doomsday — web sin compilación. Firebase se carga solo si se configura.
const movies = [
['ffh','Spider-Man: Far From Home',2019,'Película','media','El mundo después de Endgame.'],
['wv','WandaVision',2021,'Serie','alta','Wanda, sus poderes y el destino de Visión.'],
['fatws','The Falcon and the Winter Soldier',2021,'Serie','alta','El nuevo Capitán América y Bucky.'],
['loki1','Loki — Temporada 1',2021,'Serie','alta','La TVA, las variantes y el multiverso.'],
['bw','Black Widow',2021,'Película','media','Conoce a Yelena y Red Guardian.'],
['wi1','What If...? — Temporada 1',2021,'Serie','baja','Universos alternativos animados.'],
['shang','Shang-Chi and the Legend of the Ten Rings',2021,'Película','media','Los Diez Anillos y nuevos héroes.'],
['eternals','Eternals',2021,'Película','baja','Una nueva parte de la mitología cósmica.'],
['hawkeye','Hawkeye',2021,'Serie','media','Clint, Kate Bishop y Yelena.'],
['nwh','Spider-Man: No Way Home',2021,'Película','alta','Conexiones entre distintas realidades.'],
['moon','Moon Knight',2022,'Serie','baja','Un rincón sobrenatural del MCU.'],
['ds2','Doctor Strange in the Multiverse of Madness',2022,'Película','alta','Universos paralelos e incursiones.'],
['msm','Ms. Marvel',2022,'Serie','media','Kamala Khan y nuevas conexiones mutantes.'],
['thor4','Thor: Love and Thunder',2022,'Película','media','La situación de Thor después de Endgame.'],
['groot','I Am Groot — Temporadas 1 y 2',2022,'Especial','baja','Cortos independientes de Groot (2022–2023).'],
['shehulk','She-Hulk: Attorney at Law',2022,'Serie','baja','La vertiente jurídica y urbana del MCU.'],
['werewolf','Werewolf by Night',2022,'Especial','baja','Criaturas y horror en Marvel.'],
['wakanda','Black Panther: Wakanda Forever',2022,'Película','alta','El futuro de Wakanda y Namor.'],
['holiday','The Guardians of the Galaxy Holiday Special',2022,'Especial','baja','Puente entre las aventuras de los Guardianes.'],
['quantum','Ant-Man and the Wasp: Quantumania',2023,'Película','media','Reino Cuántico y una línea del multiverso.'],
['gotg3','Guardians of the Galaxy Vol. 3',2023,'Película','media','El nuevo destino de los Guardianes.'],
['secret','Secret Invasion',2023,'Serie','baja','Conflictos de Skrulls en la Tierra.'],
['loki2','Loki — Temporada 2',2023,'Serie','alta','Las líneas temporales y su funcionamiento.'],
['marvels','The Marvels',2023,'Película','media','Las heroínas Marvel y conexiones entre realidades.'],
['wi2','What If...? — Temporada 2',2023,'Serie','baja','Más historias alternativas.'],
['echo','Echo',2024,'Serie','baja','Maya López y Kingpin.'],
['deadpool','Deadpool & Wolverine',2024,'Película','alta','La TVA y el legado mutante de Fox.'],
['agatha','Agatha All Along',2024,'Serie','media','Continuación del arco mágico de WandaVision.'],
['wi3','What If...? — Temporada 3',2024,'Serie','baja','Otra entrega de realidades alternativas.'],
['cap4','Captain America: Brave New World',2025,'Película','alta','Sam Wilson y los conflictos políticos actuales.'],
['dare1','Daredevil: Born Again — Temporada 1',2025,'Serie','media','El nuevo estado de Nueva York.'],
['thunder','Thunderbolts*',2025,'Película','alta','La formación de los New Avengers.'],
['ironheart','Ironheart',2025,'Serie','baja','Riri Williams después de Wakanda.'],
['fantastic','The Fantastic Four: First Steps',2025,'Película','alta','La llegada de los Cuatro Fantásticos.'],
['eyes','Eyes of Wakanda',2025,'Serie','baja','Historias del legado de Wakanda.'],
['zombies','Marvel Zombies',2025,'Serie','baja','Una realidad alternativa de terror.'],
['friendly','Your Friendly Neighborhood Spider-Man — T1',2025,'Serie','baja','Otra interpretación animada de Peter.'],
['wonder','Wonder Man',2026,'Serie','baja','Presenta a Simon Williams.'],
['dare2','Daredevil: Born Again — Temporada 2',2026,'Serie','media','Continuación de la historia de Daredevil.'],
['punisher','The Punisher: One Last Kill',2026,'Especial','media','Una nueva historia de Frank Castle.'],
['spidey4','Spider-Man: Brand New Day',2026,'Película','media','La siguiente etapa de Peter Parker.'],
['vision','VisionQuest',2026,'Serie','media','La historia de Visión después de WandaVision.']
].map(([id,name,year,type,priority,description])=>({id,name,year,type,priority,description}));
const xmen=[['x1','X-Men',2000],['x2','X2: X-Men United',2003],['x3','X-Men: The Last Stand',2006],['xf','X-Men: First Class',2011],['xd','X-Men: Days of Future Past',2014],['xa','X-Men: Apocalypse',2016],['log','Logan',2017],['dark','Dark Phoenix',2019]].map(([id,name,year])=>({id,name,year,type:'Película',priority:'media',description:'Saga X-Men (Fox).'}));
const all=[...movies,...xmen];
const $=id=>document.getElementById(id);
const storageKey='doomsday-family-v1';
const cleanState=raw=>Object.fromEntries(all.filter(m=>raw?.[m.id]===true).map(m=>[m.id,true]));
let local={};try{local=cleanState(JSON.parse(localStorage.getItem(storageKey)||'{}'));}catch{}
let checked={...local};let sync=null;let room=null;let unsubscribe=null;let ready=false;
let fb=null;const config=window.FIREBASE_CONFIG;
const hasFirebase=!!(config&&config.apiKey&&config.projectId&&config.authDomain&&config.appId);
const idPattern=/^[A-Za-z0-9_-]{32}$/;
const params=new URLSearchParams(location.search);const requestedRoom=params.get('sala');
const setStatus=(message,level='')=>{const el=$('syncStatus');el.textContent=message;el.className='status '+level};
function persist(){if(!room){local={...checked};try{localStorage.setItem(storageKey,JSON.stringify(local))}catch{}}}
function renderStats(){const count=xs=>xs.filter(m=>!!checked[m.id]).length;const total=count(movies),must=movies.filter(m=>m.priority==='alta'),doneMust=count(must);$('totalNum').textContent=`${total}/${movies.length}`;$('mustNum').textContent=`${doneMust}/${must.length}`;$('totalPct').textContent=`${Math.round(100*total/movies.length)}%`;$('mustPct').textContent=`${Math.round(100*doneMust/must.length)}%`;$('totalBar').style.width=`${100*total/movies.length}%`;$('mustBar').style.width=`${100*doneMust/must.length}%`}
function card(item){const label=document.createElement('label');label.className='entry'+(checked[item.id]?' done':'');const cb=document.createElement('input');cb.type='checkbox';cb.checked=!!checked[item.id];cb.setAttribute('aria-label',`Marcar ${item.name} como visto`);cb.addEventListener('change',()=>changeItem(item.id,cb.checked));const div=document.createElement('div'),h=document.createElement('h3');h.textContent=item.name;const detail=document.createElement('div');detail.className='detail';const dot=document.createElement('i');dot.className='dot '+item.priority;detail.append(dot,document.createTextNode(`${item.year} · ${item.type}`));const p=document.createElement('p');p.textContent=item.description;div.append(h,detail,p);label.append(cb,div);return label}
function render(){renderStats();const text=$('search').value.trim().toLocaleLowerCase('es');const pr=$('priority').value,ty=$('type').value,yr=$('year').value,pending=$('pending').checked;const subset=movies.filter(m=>(!text||m.name.toLocaleLowerCase('es').includes(text))&&(pr==='all'||m.priority===pr)&&(ty==='all'||m.type===ty)&&(yr==='all'||String(m.year)===yr)&&(!pending||!checked[m.id]));$('visibleCount').textContent=`${subset.length} título${subset.length===1?'':'s'} en esta vista`;
const root=$('catalog');root.replaceChildren();if(!subset.length){const d=document.createElement('div');d.className='blank';d.textContent='No hay títulos con estos filtros. 🎉';root.append(d)}else for(const year of [...new Set(subset.map(m=>m.year))]){const wrap=document.createElement('section'),head=document.createElement('div'),h=document.createElement('h2'),grid=document.createElement('div');head.className='year';h.textContent=year;head.append(h);grid.className='entries';subset.filter(m=>m.year===year).forEach(m=>grid.append(card(m)));wrap.append(head,grid);root.append(wrap)}const lg=$('legacy');lg.replaceChildren(...xmen.map(card));}
async function changeItem(id,val){if(room&&!ready){setStatus('Aún conectando con la sala. Inténtalo de nuevo.','error');render();return}const old=!!checked[id];if(val)checked[id]=true;else delete checked[id];persist();render();if(room&&sync){try{await sync.setItem(room,id,val)}catch(err){if(old)checked[id]=true;else delete checked[id];render();setStatus('No se pudo guardar en la sala: '+err.message,'error')}}}
function modal(title,txt,ok='Continuar'){return new Promise(resolve=>{const d=$('dialog');$('dialogTitle').textContent=title;$('dialogText').textContent=txt;$('confirmDialog').textContent=ok;const finish=value=>{d.close();$('confirmDialog').removeEventListener('click',yes);$('cancelDialog').removeEventListener('click',no);d.removeEventListener('cancel',escape);resolve(value)};const yes=()=>finish(true),no=()=>finish(false),escape=e=>{e.preventDefault();finish(false)};$('confirmDialog').addEventListener('click',yes);$('cancelDialog').addEventListener('click',no);d.addEventListener('cancel',escape);d.showModal()})}
const randomRoom=()=>{const b=new Uint8Array(24);crypto.getRandomValues(b);return btoa(String.fromCharCode(...b)).replaceAll('+','-').replaceAll('/','_').replaceAll('=','')};
const roomUrl=id=>{const url=new URL(location.href);url.searchParams.set('sala',id);return url.href};
function roomButtons(isRoom){$('createRoomBtn').classList.toggle('hidden',isRoom);$('copyRoomBtn').classList.toggle('hidden',!isRoom);$('leaveRoomBtn').classList.toggle('hidden',!isRoom)}
async function loadFirebase(){if(fb)return fb;const [{initializeApp},{getAuth,signInAnonymously},{getFirestore,collection,doc,setDoc,serverTimestamp,onSnapshot,writeBatch}]=await Promise.all([
import('https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js'),
import('https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js'),
import('https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js')]);
const app=initializeApp(config),auth=getAuth(app),db=getFirestore(app);await signInAnonymously(auth);fb={
watch(id,onData,onError){return onSnapshot(collection(db,'rooms',id,'items'),snap=>{const state={};snap.forEach(d=>{if(d.data().checked===true)state[d.id]=true});onData(cleanState(state))},onError)},
setItem(id,item,value){return setDoc(doc(db,'rooms',id,'items',item),{checked:!!value,updatedAt:serverTimestamp()})},
async seed(id,keys){const batches=[];for(let i=0;i<keys.length;i+=400){const batch=writeBatch(db);for(const key of keys.slice(i,i+400))batch.set(doc(db,'rooms',id,'items',key),{checked:true,updatedAt:serverTimestamp()});batches.push(batch.commit())}await Promise.all(batches)}
};return fb}
async function joinRoom(id,seed=false){if(!idPattern.test(id)){setStatus('El enlace contiene un identificador de sala inválido.','error');return}if(!hasFirebase){setStatus('La sala necesita Firebase. Configura firebase-config.js antes de compartirla.','error');$('roomInfo').textContent='Abre el archivo README.md para ver los pasos.';return}setStatus('Conectando con la sala…');try{const api=await loadFirebase();sync=api;if(unsubscribe)unsubscribe();room=id;ready=false;const previous=seed?Object.keys({...local,...checked}).filter(k=>checked[k]):[];if(seed&&previous.length)await api.seed(id,previous);
unsubscribe=api.watch(id,state=>{checked=state;ready=true;render();setStatus('✓ Sala sincronizada. Las marcas se actualizan en ambos dispositivos.','online')},err=>{ready=false;setStatus('Error de sincronización: '+err.message,'error')});history.replaceState(null,'',roomUrl(id));roomButtons(true);$('roomInfo').textContent='Cualquiera con este enlace puede editar el progreso. Guárdalo y compártelo solo con tu familia.'}catch(err){room=null;ready=false;checked={...local};render();roomButtons(false);setStatus('No se pudo conectar: '+err.message,'error')}}
function leaveRoom(){if(unsubscribe){unsubscribe();unsubscribe=null}room=null;ready=false;checked={...local};const u=new URL(location.href);u.searchParams.delete('sala');history.replaceState(null,'',u.href);roomButtons(false);$('roomInfo').textContent='Ahora estás usando el progreso individual de este navegador.';setStatus('Modo individual: las marcas se guardan en este dispositivo.');render()}
$('createRoomBtn').addEventListener('click',async()=>{if(!hasFirebase){await modal('Activar la sincronización','La web ya funciona individualmente. Para compartir las marcas necesitas activar Firebase gratuito siguiendo README.md.','Entendido');return}if(location.protocol==='file:'){await modal('Publica la web primero','Abre la página desde GitHub Pages (https://...) antes de crear la sala compartida.','Entendido');return}const ok=await modal('Crear una sala familiar','Se creará un enlace privado y aleatorio. Las marcas individuales que ya tienes se copiarán a esta nueva sala. ¿Continuar?','Crear sala');if(ok)await joinRoom(randomRoom(),true)});
$('copyRoomBtn').addEventListener('click',async()=>{const link=roomUrl(room);try{await navigator.clipboard.writeText(link);setStatus('Enlace copiado. Envíalo por WhatsApp.','online')}catch{await modal('Copia este enlace',link,'Entendido')}});
$('leaveRoomBtn').addEventListener('click',async()=>{if(await modal('Salir de la sala','Regresarás a las marcas individuales guardadas anteriormente en este dispositivo. La sala compartida no se borra.','Salir'))leaveRoom()});
$('resetBtn').addEventListener('click',async()=>{if(!await modal('¿Reiniciar las marcas?','Se desmarcarán todos los títulos, incluidos los X-Men. Si estás en sala compartida, el cambio afectará a los dos.','Sí, reiniciar'))return;if(room){if(!ready)return;setStatus('Reiniciando las marcas compartidas…');for(const m of all){if(checked[m.id])await sync.setItem(room,m.id,false)}setStatus('Progreso reiniciado.','online')}else{checked={};persist();render()}});
$('exportBtn').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({version:1,date:new Date().toISOString(),checked},null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='marvel-doomsday-progreso.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1500)});
$('importBtn').addEventListener('click',()=>$('importFile').click());
$('importFile').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{const data=JSON.parse(await f.text());if(!data.checked||typeof data.checked!=='object'||Array.isArray(data.checked))throw Error('Formato de archivo incorrecto');const importState=cleanState(data.checked);if(!await modal('Importar progreso',`Se recuperarán ${Object.keys(importState).length} títulos vistos. Las marcas actuales serán reemplazadas${room?' para ambos dispositivos':''}.`,'Importar'))return;if(room){if(!ready)throw Error('Sala desconectada');for(const m of all)await sync.setItem(room,m.id,!!importState[m.id])}else{checked=importState;persist();render()}}catch(err){await modal('No se pudo importar',err.message,'Entendido')}finally{e.target.value=''}});
['search','priority','type','year','pending'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change',render));
for(const y of [...new Set(movies.map(m=>m.year))]){const op=document.createElement('option');op.value=y;op.textContent=y;$('year').append(op)}
render();
if(requestedRoom){joinRoom(requestedRoom)}else if(hasFirebase){$('roomInfo').textContent='Firebase configurado. Puedes crear una sala compartida cuando quieras.'}
