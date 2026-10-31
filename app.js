const $=id=>document.getElementById(id);
const STORE='lh_products_v1',SETTINGS='lh_settings_v1';
const fmt=n=>Number(n||0).toLocaleString('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:2});
const num=v=>Math.max(0,Number(v)||0);
let products=read(STORE,[]),settings=read(SETTINGS,{budget:5000,minProfit:150,notifications:false});
function read(k,f){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
function persist(){localStorage.setItem(STORE,JSON.stringify(products));render()}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2300)}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function margin(p){return num(p.sell)-num(p.buy)-num(p.costs)-num(p.shipping)}
function statusClass(s){return s==='Ausverkauft'?'soldout':s==='Vorbestellung'?'preorder':''}
function render(){
 const hot=products.filter(p=>margin(p)>=settings.minProfit&&p.status!=='Ausverkauft');
 const potential=hot.reduce((a,p)=>a+margin(p),0);
 $('metricTracked').textContent=products.length;$('metricHot').textContent=hot.length;$('metricPotential').textContent=fmt(potential);
 $('dashTracked').textContent=products.length;$('dashHot').textContent=hot.length;$('dashBudget').textContent=fmt(settings.budget);
 $('lastUpdated').textContent=products.length?new Date(Math.max(...products.map(p=>p.updated||0))).toLocaleDateString('de-DE'):'Noch keine';
 $('watchCount').textContent=products.length;
 const top=[...hot].sort((a,b)=>margin(b)-margin(a)).slice(0,4);
 $('topDeals').innerHTML=top.length?top.map(p=>`<div class="deal-row"><div><b>${esc(p.name)}</b><small>${esc(p.category)} · ${esc(p.shop||'Händler offen')} · ${esc(p.status)}</small></div><div class="deal-profit">+${fmt(margin(p))}<small>kalkuliert / Stück</small></div></div>`).join(''):'<div class="empty">Noch keine Deal-Kandidaten. Produkte hinzufügen und realistische Kosten eintragen.</div>';
 filterProducts();
}
function filterProducts(){
 const q=$('searchInput').value.toLowerCase(),cat=$('filterCategory').value,st=$('filterStatus').value;
 const arr=products.filter(p=>(!q||[p.name,p.category,p.shop,p.notes].join(' ').toLowerCase().includes(q))&&(!cat||p.category===cat)&&(!st||p.status===st));
 $('watchlist').innerHTML=arr.length?arr.map(p=>`<article class="watch-card"><div class="watch-main"><h3>${esc(p.name)}</h3><div class="watch-meta">${esc(p.category)} · ${esc(p.shop||'Kein Händler hinterlegt')}</div><span class="status ${statusClass(p.status)}">${esc(p.status)}</span><div class="watch-stats"><span>Max. Einkauf<b>${fmt(p.buy)}</b></span><span>Verkaufsschätzung<b>${fmt(p.sell)}</b></span><span>Überschuss*<b style="color:${margin(p)>=settings.minProfit?'var(--green)':margin(p)>0?'var(--amber)':'var(--red)'}">${fmt(margin(p))}</b></span></div>${p.notes?`<div class="watch-meta" style="margin-top:9px">Notiz: ${esc(p.notes)}</div>`:''}${p.updated?`<div class="watch-meta" style="margin-top:5px">Zuletzt bearbeitet: ${new Date(p.updated).toLocaleString('de-DE')}</div>`:''}</div><div class="card-actions">${p.url?`<button class="mini-btn" data-open="${p.id}">Shop ↗</button>`:''}<button class="mini-btn" data-edit="${p.id}">Bearbeiten</button><button class="mini-btn delete" data-del="${p.id}">Löschen</button></div></article>`).join(''):'<div class="empty">Keine passenden Produkte gefunden.</div>';
 document.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{if(confirm('Produkt wirklich löschen?')){products=products.filter(p=>p.id!==b.dataset.del);persist();toast('Produkt gelöscht.')}});
 document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{const p=products.find(x=>x.id===b.dataset.open);if(p?.url)window.open(p.url,'_blank','noopener,noreferrer')});
 document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>openProduct(products.find(x=>x.id===b.dataset.edit)));
}
function showTab(name){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+name));document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===name));window.scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>showTab(t.dataset.tab));
document.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>showTab(b.dataset.goto));
$('quickAdd').onclick=$('addProduct').onclick=()=>openProduct();
function openProduct(p=null){
 const f=$('productForm');f.reset();f.elements.id.value=p?.id||'';$('modalTitle').textContent=p?'Produkt bearbeiten':'Produkt hinzufügen';
 for(const k of ['name','category','status','shop','url','notes'])if(p&&f.elements[k])f.elements[k].value=p[k]??'';
 if(p){f.elements.buy.value=p.buy;f.elements.sell.value=p.sell;f.elements.costs.value=p.costs;f.elements.shipping.value=p.shipping}
 $('productModal').showModal();
}
$('closeModal').onclick=$('cancelModal').onclick=()=>$('productModal').close();
$('productForm').onsubmit=e=>{e.preventDefault();const f=e.currentTarget,d=new FormData(f),id=d.get('id');const p={id:id||crypto.randomUUID(),name:d.get('name').trim(),category:d.get('category'),status:d.get('status'),shop:d.get('shop').trim(),url:d.get('url').trim(),buy:num(d.get('buy')),sell:num(d.get('sell')),costs:num(d.get('costs')),shipping:num(d.get('shipping')),notes:d.get('notes').trim(),updated:Date.now()};if(p.url&&!/^https?:\/\//i.test(p.url)){toast('Bitte einen gültigen http(s)-Link eintragen.');return}if(id)products=products.map(x=>x.id===id?p:x);else products.unshift(p);persist();$('productModal').close();toast('Watchlist gespeichert.');};
['searchInput','filterCategory','filterStatus'].forEach(id=>$(id).addEventListener(id==='searchInput'?'input':'change',filterProducts));

function calc(){const buy=num($('calcBuy').value),sell=num($('calcSell').value),fees=num($('calcFees').value),ship=num($('calcShip').value),other=num($('calcOther').value),qty=Math.max(1,Number($('calcQty').value)||1),profit=sell-buy-fees-ship-other,roi=buy?profit/buy*100:0;$('calcProfit').textContent=fmt(profit);$('calcTotal').textContent=fmt(profit*qty);$('calcRoi').textContent=roi.toLocaleString('de-DE',{maximumFractionDigits:1})+' %';$('calcProfit').style.color=profit>=settings.minProfit?'var(--green)':profit>0?'var(--amber)':'var(--red)';const v=$('calcVerdict');v.className='verdict '+(profit>=settings.minProfit?'good':profit>0?'warn':'bad');v.textContent=profit>=settings.minProfit?'Zielmarge erreicht – Nachfrage, Daten und Händlerbedingungen vor dem Kauf prüfen.':profit>0?'Positiver Überschuss, aber unter deiner Mindestzielmarge.':'Kein positiver Überschuss – nicht auf Basis dieser Zahlen kaufen.';return{buy,sell,costs:fees+other,shipping:ship,profit,qty}}
['calcBuy','calcSell','calcFees','calcShip','calcOther','calcQty'].forEach(id=>$(id).addEventListener('input',calc));
$('saveCalc').onclick=()=>{const c=calc();openProduct({name:'Neue Kalkulation',category:'Sonstiges',status:'Beobachten',shop:'',url:'',buy:c.buy,sell:c.sell,costs:c.costs,shipping:c.shipping,notes:'Aus Gewinnrechner übernommen.'})};

$('settingsBtn').onclick=()=>{const f=$('settingsForm');f.elements.budget.value=settings.budget;f.elements.minProfit.value=settings.minProfit;f.elements.notifications.checked=!!settings.notifications;$('settingsModal').showModal()};
$('closeSettings').onclick=$('cancelSettings').onclick=()=>$('settingsModal').close();
$('settingsForm').onsubmit=async e=>{e.preventDefault();const f=e.currentTarget;settings={budget:num(f.elements.budget.value),minProfit:num(f.elements.minProfit.value),notifications:f.elements.notifications.checked};localStorage.setItem(SETTINGS,JSON.stringify(settings));if(settings.notifications&&'Notification'in window){const perm=await Notification.requestPermission();if(perm!=='granted')settings.notifications=false}localStorage.setItem(SETTINGS,JSON.stringify(settings));$('settingsModal').close();render();calc();toast('Einstellungen gespeichert.')};

$('exportBtn').onclick=()=>{const data={app:'Limited Hunter',version:1,exportedAt:new Date().toISOString(),settings,products};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='limited-hunter-backup.json';a.click();URL.revokeObjectURL(a.href);toast('Backup exportiert.')};
$('importBtn').onclick=()=>$('importFile').click();
$('importFile').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{const data=JSON.parse(await file.text());if(!Array.isArray(data.products))throw Error();if(confirm('Import ersetzt deine aktuelle Watchlist. Fortfahren?')){products=data.products;settings=data.settings||settings;localStorage.setItem(STORE,JSON.stringify(products));localStorage.setItem(SETTINGS,JSON.stringify(settings));render();calc();toast('Backup importiert.')}}catch{toast('Backup-Datei ist ungültig.')}e.target.value=''};
$('resetBtn').onclick=()=>{if(confirm('Alle lokalen Produkte und Einstellungen löschen?')){products=[];settings={budget:5000,minProfit:150,notifications:false};localStorage.setItem(STORE,'[]');localStorage.setItem(SETTINGS,JSON.stringify(settings));render();calc();toast('Lokale Daten zurückgesetzt.')}};

render();calc();
if('serviceWorker'in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
