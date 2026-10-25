var KEY='ielts_reading_test_v2',TOTAL=3600,NP=3,ACCESS='90ea711e-8154-4a1d-9ee5-a59a7937a79f',URLW='https://api.web3forms.com/submit';
var OFF={1:0,2:13,3:26};
var R={'1':[{n:1,k:'radio',name:'p1q1'},{n:2,k:'radio',name:'p1q2'},{n:3,k:'radio',name:'p1q3'},{n:4,k:'radio',name:'p1q4'},{n:5,k:'radio',name:'p1q5'},{n:6,k:'radio',name:'p1q6'},{n:7,k:'text',id:'p1g7'},{n:8,k:'text',id:'p1g8'},{n:9,k:'text',id:'p1g9'},{n:10,k:'text',id:'p1g10'},{n:11,k:'text',id:'p1g11'},{n:12,k:'text',id:'p1g12'},{n:13,k:'text',id:'p1g13'}],'2':[{n:1,k:'zone',id:'p2dz1'},{n:2,k:'zone',id:'p2dz2'},{n:3,k:'zone',id:'p2dz3'},{n:4,k:'zone',id:'p2dz4'},{n:5,k:'zone',id:'p2dz5'},{n:6,k:'zone',id:'p2dz6'},{n:7,k:'text',id:'p2g7'},{n:8,k:'text',id:'p2g8'},{n:9,k:'text',id:'p2g9'},{n:10,k:'text',id:'p2g10'},{n:11,k:'text',id:'p2g11'},{n:12,k:'check'},{n:13,k:'check'}],'3':[{n:1,k:'radio',name:'p3q1'},{n:2,k:'radio',name:'p3q2'},{n:3,k:'radio',name:'p3q3'},{n:4,k:'radio',name:'p3q4'},{n:5,k:'radio',name:'p3q5'},{n:6,k:'radio',name:'p3q6'},{n:7,k:'radio',name:'p3q7'},{n:8,k:'radio',name:'p3q8'},{n:9,k:'radio',name:'p3q9'},{n:10,k:'radio',name:'p3q10'},{n:11,k:'zone',id:'p3dz11'},{n:12,k:'zone',id:'p3dz12'},{n:13,k:'zone',id:'p3dz13'},{n:14,k:'zone',id:'p3dz14'}]};
var NQ={1:13,2:13,3:14};
var S={name:'',start:0,last:0,secs:[0,0,0],active:1,flags:{},ans:{radios:{},texts:{},zones:{},checks:[]},annots:{},an:0,submitted:false,running:false};
var curQ={1:1,2:1,3:1},sel=null,dragId=null,timerH=null,scrollPos={},rng=null,nbk=null;
function $(i){return document.getElementById(i);}
function GN(P,n){return OFF[P]+n;}
function chipIn(z){return z.querySelector('.chip');}
function checkVals(){var a=[];document.querySelectorAll('input[name=p2c1213]:checked').forEach(function(c){a.push(c.value);});return a;}
function getVal(P,it){
 if(it.k=='radio'){var c=document.querySelector('input[name='+it.name+']:checked');return c?c.value:'';}
 if(it.k=='text')return $(it.id).value.trim();
 if(it.k=='zone'){var ch=chipIn($(it.id));return ch?ch.dataset.label:'';}
 var v=checkVals();return it.n==12?v.join(', '):(v.length>=2?v.join(', '):'');
}
function answered(P,it){
 if(it.k=='check'){var l=checkVals().length;return it.n==12?l>=1:l>=2;}
 return getVal(P,it)!=='';
}
function fmt(s){s=Math.round(s);var m=Math.floor(s/60),x=s%60;return (m<10?'0':'')+m+':'+(x<10?'0':'')+x;}
function collect(){
 var a={radios:{},texts:{},zones:{},checks:checkVals()};
 document.querySelectorAll('input[type=radio]:checked').forEach(function(r){a.radios[r.name]=r.value;});
 document.querySelectorAll('.gap').forEach(function(g){if(g.value)a.texts[g.id]=g.value;});
 document.querySelectorAll('.dz').forEach(function(z){var c=chipIn(z);if(c)a.zones[z.id]=c.id;});
 return a;
}
function restore(a){
 Object.keys(a.radios||{}).forEach(function(n){var e=document.querySelector('input[name='+n+'][value="'+a.radios[n]+'"]');if(e)e.checked=true;});
 Object.keys(a.texts||{}).forEach(function(i){if($(i))$(i).value=a.texts[i];});
 Object.keys(a.zones||{}).forEach(function(z){if($(z)&&$(a.zones[z]))$(z).appendChild($(a.zones[z]));});
 document.querySelectorAll('input[name=p2c1213]').forEach(function(c){c.checked=(a.checks||[]).indexOf(c.value)>=0;});
}
function save(){S.ans=collect();try{localStorage.setItem(KEY,JSON.stringify(S));var s=$('saved');s.classList.add('on');clearTimeout(save.t);save.t=setTimeout(function(){s.classList.remove('on');},1200);}catch(e){}}
function refresh(){
 for(var P=1;P<=NP;P++){var done=0;
  R[P].forEach(function(it){var ok=answered(P,it);if(ok)done++;
   var b=$('nb'+P+'_'+it.n);b.className='nb'+(ok?' ans':'')+(it.n==curQ[P]&&S.active==P?' cur':'')+(S.flags[P+'-'+it.n]?' flag':'');});
  $('cnt'+P).textContent=done+' of '+NQ[P];
  $('pt'+P).className='pt'+(S.active==P?' act':'');}
 document.querySelectorAll('.dz').forEach(function(d){d.querySelector('.zn').style.display=chipIn(d)?'none':'';});
}
function changed(){refresh();if(S.running)save();}
function showPart(P){
 var cp=S.active;scrollPos[cp]=[$('left'+cp).scrollTop,$('right'+cp).scrollTop];
 tickTime();
 S.active=P;
 document.querySelectorAll('.partview').forEach(function(v){v.classList.remove('on');});
 $('view'+P).classList.add('on');
 var sp=scrollPos[P];if(sp){$('left'+P).scrollTop=sp[0];$('right'+P).scrollTop=sp[1];}
 closeBox();$('tip').style.display='none';
 refresh();if(S.running)save();
}
function target(P,n){
 var it=R[P].filter(function(x){return x.n==n;})[0];
 if(it.k=='radio')return $('p'+P+'qq'+n);if(it.k=='text'||it.k=='zone')return $(it.id);return $('p2qq12');
}
function goQ(P,n){if(S.active!=P)showPart(P);curQ[P]=n;var e=target(P,n);e.scrollIntoView({behavior:'smooth',block:'center'});if(e.classList.contains('gap'))e.focus();refresh();}
function step(d){var P=S.active,n=curQ[P]+d;
 if(n>NQ[P]){if(P<NP){showPart(P+1);goQ(P+1,1);}return;}
 if(n<1){if(P>1){showPart(P-1);goQ(P-1,NQ[P-1]);}return;}
 goQ(P,n);}
function toggleFlag(){var k=S.active+'-'+curQ[S.active];S.flags[k]=!S.flags[k];changed();}
function bankOf(chip){return $(chip.dataset.bank);}
function place(z,chip){var o=chipIn(z);if(o&&o!==chip)bankOf(o).appendChild(o);z.appendChild(chip);chip.classList.remove('sel');sel=null;curQ[+z.dataset.part]=+z.dataset.q;changed();}
function dragS(e){dragId=e.target.closest('.chip').id;e.dataTransfer.setData('text/plain',dragId);}
function drop(e,z){e.preventDefault();z.classList.remove('over');var c=$(e.dataTransfer.getData('text/plain')||dragId);if(c)place(z,c);}
function dropBank(e){e.preventDefault();var c=$(e.dataTransfer.getData('text/plain')||dragId);if(c){bankOf(c).appendChild(c);changed();}}
function chipClick(c){if(sel&&sel!==c)sel.classList.remove('sel');if(c.parentNode.classList.contains('dz')&&!sel){return;}sel=c.classList.contains('sel')?null:c;c.classList.toggle('sel');}
function zoneClick(z){if(sel&&sel.dataset.bank.charAt(1)==z.dataset.part)place(z,sel);}
function bankClick(e){if(sel&&e.target.classList.contains('bank')&&e.target.id===sel.dataset.bank){bankOf(sel).appendChild(sel);sel.classList.remove('sel');sel=null;changed();}}
document.addEventListener('dragenter',function(e){var z=e.target.closest&&e.target.closest('.dz');if(z)z.classList.add('over');});
document.addEventListener('dragleave',function(e){var z=e.target.closest&&e.target.closest('.dz');if(z)z.classList.remove('over');});
document.addEventListener('input',function(e){if(e.target.classList.contains('gap')){curQ[+e.target.id.charAt(1)]=+e.target.id.slice(3);changed();}});
document.addEventListener('focusin',function(e){if(e.target.classList&&e.target.classList.contains('gap')){curQ[+e.target.id.charAt(1)]=+e.target.id.slice(3);refresh();}});
document.addEventListener('change',function(e){var t=e.target;
 if(t.type=='radio'){curQ[+t.name.charAt(1)]=+t.name.slice(3);}
 if(t.name=='p2c1213'){if(checkVals().length>2)t.checked=false;curQ[2]=checkVals().length>=2?13:12;}
 changed();});
var dv=null;
document.addEventListener('mousedown',function(e){if(e.target.classList.contains('divider')){dv=e.target;document.body.style.userSelect='none';}});
document.addEventListener('mouseup',function(){dv=null;document.body.style.userSelect='';});
document.addEventListener('mousemove',function(e){if(dv){dv.parentNode.querySelector('.left').style.width=Math.min(80,Math.max(20,e.clientX/window.innerWidth*100))+'%';}});
var tip=$('tip');
function okText(n){var p=n.parentNode;return !(p&&p.closest&&p.closest('.dz,.chip,.gap,.ni,#tip,#nbx,textarea,button'));}
function texts(root){var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),a=[],n;while(n=w.nextNode()){if(okText(n))a.push(n);}return a;}
function offs(root){var pos=0,m=[];texts(root).forEach(function(n){m.push({n:n,s:pos});pos+=n.nodeValue.length;});return m;}
function inMark(n){return !!n.parentNode.closest('mark.hl');}
function paneOf(node){var el=node.nodeType==1?node:node.parentNode;return el?el.closest('.pane'):null;}
function wrapPart(n,s,e,aid){var t=n.nodeValue;if(!t.slice(s,e).trim())return null;var mid=n;if(e<t.length)n.splitText(e);if(s>0)mid=n.splitText(s);var m=document.createElement('mark');m.className='hl';m.setAttribute('data-aid',aid);mid.parentNode.insertBefore(m,mid);m.appendChild(mid);return m;}
function createAnn(r){
 var root=paneOf(r.startContainer);if(!root||root!==paneOf(r.endContainer))return null;
 var items=[];
 offs(root).forEach(function(o){if(!r.intersectsNode(o.n))return;
  var len=o.n.nodeValue.length,ls=o.n===r.startContainer?r.startOffset:0,le=o.n===r.endContainer?r.endOffset:len;
  if(le<=ls||inMark(o.n)||!o.n.nodeValue.slice(ls,le).trim())return;
  items.push({n:o.n,ls:ls,le:le,s:o.s});});
 if(!items.length)return null;
 var aid='a'+(++S.an),f=items[0],l=items[items.length-1];
 S.annots[aid]={root:root.id,a:f.s+f.ls,b:l.s+l.le,note:''};
 items.forEach(function(it){wrapPart(it.n,it.ls,it.le,aid);});
 return aid;
}
function icon(k){
 document.querySelectorAll('.ni[data-aid="'+k+'"]').forEach(function(x){x.remove();});
 var a=S.annots[k],ms=document.querySelectorAll('mark.hl[data-aid="'+k+'"]');
 ms.forEach(function(m){m.classList.toggle('has-note',!!(a&&a.note));});
 if(a&&a.note&&ms.length){var last=ms[ms.length-1],i=document.createElement('span');i.className='ni';i.setAttribute('data-aid',k);i.textContent='📝';i.title=a.note;last.parentNode.insertBefore(i,last.nextSibling);}
}
function removeAnn(k){
 document.querySelectorAll('.ni[data-aid="'+k+'"]').forEach(function(x){x.remove();});
 document.querySelectorAll('mark.hl[data-aid="'+k+'"]').forEach(function(m){var p=m.parentNode;while(m.firstChild)p.insertBefore(m.firstChild,m);p.removeChild(m);p.normalize();});
 delete S.annots[k];
}
function applyAnnots(){
 Object.keys(S.annots).forEach(function(k){var a=S.annots[k],root=$(a.root);if(!root)return;
  offs(root).forEach(function(o){var len=o.n.nodeValue.length;if(o.s+len<=a.a||o.s>=a.b)return;if(inMark(o.n))return;
   wrapPart(o.n,Math.max(a.a,o.s)-o.s,Math.min(a.b,o.s+len)-o.s,k);});
  icon(k);});
}
function hitAids(r){var s={};document.querySelectorAll('mark.hl').forEach(function(m){if(r.intersectsNode(m))s[m.getAttribute('data-aid')]=1;});return Object.keys(s);}
function endSel(){var s=window.getSelection();if(s)s.removeAllRanges();tip.style.display='none';}
function doHL(){if(!rng)return;createAnn(rng);endSel();save();}
function doClear(){if(!rng)return;hitAids(rng).forEach(removeAnn);endSel();save();}
function doNote(){
 if(!rng)return;
 var rect=rng.getBoundingClientRect(),ids=hitAids(rng),k=ids[0]||createAnn(rng);
 endSel();
 if(k){save();openBox(k,rect);}
}
function openBox(k,a){
 nbk=k;var r=a.getBoundingClientRect?a.getBoundingClientRect():a,b=$('nbx');
 b.style.display='block';$('nbt').value=(S.annots[k]||{}).note||'';
 b.style.left=Math.min(window.innerWidth-290,Math.max(8,r.left))+'px';
 b.style.top=Math.min(window.innerHeight-210,r.bottom+6)+'px';
 $('nbt').focus();
}
function closeBox(){$('nbx').style.display='none';nbk=null;}
function saveNote(){if(nbk&&S.annots[nbk]){S.annots[nbk].note=$('nbt').value.trim();icon(nbk);}closeBox();save();}
function delAnn(){if(nbk)removeAnn(nbk);closeBox();save();}
function selCheck(){
 var s=window.getSelection();
 if(!s||!s.rangeCount||s.isCollapsed||!s.toString().trim()){tip.style.display='none';return;}
 var r=s.getRangeAt(0),p1=paneOf(r.startContainer),p2=paneOf(r.endContainer);
 if(!p1||p1!==p2){tip.style.display='none';return;}
 var c=r.commonAncestorContainer,el=c.nodeType==1?c:c.parentNode;
 if(el.closest('#nbx,#tip,.dz,.chip,textarea,input')){tip.style.display='none';return;}
 rng=r.cloneRange();
 var b=r.getBoundingClientRect();
 tip.style.display='block';
 tip.style.left=Math.max(8,Math.min(window.innerWidth-190,b.left))+'px';
 tip.style.top=Math.max(60,b.top-40)+'px';
}
document.addEventListener('mouseup',function(e){if(e.target.closest&&e.target.closest('#tip,#nbx'))return;setTimeout(selCheck,0);});
document.addEventListener('touchend',function(e){if(e.target.closest&&e.target.closest('#tip,#nbx'))return;setTimeout(selCheck,350);});
document.addEventListener('mousedown',function(e){
 if($('nbx').style.display==='block'&&!e.target.closest('#nbx')&&!e.target.closest('.ni'))saveNote();
 if(!e.target.closest('#tip'))tip.style.display='none';
});
document.addEventListener('click',function(e){
 var t=e.target;if(!t.closest)return;
 var ni=t.closest('.ni');
 if(ni){e.preventDefault();e.stopPropagation();openBox(ni.getAttribute('data-aid'),ni);return;}
 var s=window.getSelection(),lb=t.closest('label.opt');
 if(lb&&s&&!s.isCollapsed&&String(s).trim()&&lb.contains(s.anchorNode)&&lb.contains(s.focusNode)){e.preventDefault();return;}
 var m=t.closest('mark.hl');
 if(m&&!m.closest('label')&&s&&s.isCollapsed){openBox(m.getAttribute('data-aid'),m);}
},true);
function tickTime(){var now=Date.now();if(S.running){S.secs[S.active-1]+=Math.max(0,(now-S.last)/1000);}S.last=now;}
function tick(){
 tickTime();
 var rem=Math.max(0,TOTAL-(Date.now()-S.start)/1000),t=$('timer');
 if(rem>300){t.textContent=Math.ceil(rem/60)+' minutes left';t.className='';}else{t.textContent=fmt(rem)+' left';t.className='warn';}
 save();
 if(rem<=0){submitTest(true);}
}
function startTimer(){S.running=true;S.last=Date.now();clearInterval(timerH);timerH=setInterval(tick,1000);tick();}
function startTest(){
 var n=$('nameIn').value.trim();if(!n){$('nameErr').textContent='Please enter your full name.';return;}
 S.name=n;S.start=Date.now();S.last=S.start;$('ovStart').classList.remove('on');$('who').textContent=n;
 showPart(1);startTimer();
}
function unansweredCount(){var c=0;for(var P=1;P<=NP;P++)R[P].forEach(function(it){if(!answered(P,it))c++;});return c;}
function where(r){return 'Part '+r.charAt(r.length-1)+(r.indexOf('left')==0?' passage':' questions');}
function report(auto){
 tickTime();
 var NL=String.fromCharCode(10);
 var sum=S.secs[0]+S.secs[1]+S.secs[2];
 var secs=S.secs.slice();if(sum>TOTAL){secs[S.active-1]-=(sum-TOTAL);if(secs[S.active-1]<0)secs[S.active-1]=0;}
 var tot=secs[0]+secs[1]+secs[2];
 var L=[];L.push('Student: '+S.name);L.push('Submitted: '+(auto?'automatically when time ran out':'by the student'));
 L.push('Total time used: '+fmt(tot)+' of 60:00');
 for(var P=1;P<=NP;P++)L.push('Part '+P+' time: '+fmt(secs[P-1]));
 L.push('Unanswered questions: '+unansweredCount());
 var G=grade();L.push('SCORE: '+G.tot+'/40 (Band '+G.band+')  |  Part 1: '+G.parts[0]+'/13  Part 2: '+G.parts[1]+'/13  Part 3: '+G.parts[2]+'/14');
 for(var P=1;P<=NP;P++){L.push('');L.push('--- PART '+P+' ---');
  R[P].forEach(function(it){if(it.k=='check'&&it.n==13)return;
   var lab=it.k=='check'?(GN(P,12)+'-'+GN(P,13)):GN(P,it.n);var v=getVal(P,it);
   var flag=S.flags[P+'-'+it.n]?' [flagged]':'';
   var x=G.m[P+'-'+it.n],mk=x.max==2?'  ['+x.pts+'/2, answer: '+x.right+']':(x.pts?'  [correct]':'  [wrong, answer: '+x.right+']');
   L.push('Q'+lab+': '+(v===''?'(blank)':v)+mk+flag);});}
 var ks=Object.keys(S.annots||{}),np=0,nq=0,nn=0,rows=[];
 ks.forEach(function(k){var a=S.annots[k],t=[];
  document.querySelectorAll('mark.hl[data-aid="'+k+'"]').forEach(function(m){t.push(m.textContent.trim());});
  var txt=t.join(' ');if(txt.length>400)txt=txt.slice(0,400)+'...';
  if(a.root.indexOf('left')==0)np++;else nq++;
  if(a.note)nn++;
  rows.push(where(a.root)+': "'+txt+'"'+(a.note?'  NOTE: '+a.note:''));});
 L.push('');L.push('--- HIGHLIGHTS AND NOTES ---');
 L.push('Highlights in passages: '+np+' | in questions: '+nq+' | with notes: '+nn);
 rows.sort();rows.forEach(function(x){L.push(x);});
 return {text:L.join(NL),secs:secs,tot:tot,np:np,nq:nq,nn:nn};
}
var lastReport=null;
function submitTest(auto){
 if(S.submitted)return;
 if(!auto){var u=unansweredCount();if(!confirm((u?'You have '+u+' unanswered question(s). ':'')+'Submit your test now? You cannot change your answers after submitting.'))return;}
 lastReport=report(auto);S.running=false;clearInterval(timerH);save();sendReport();
}
function fieldsOf(r){return {access_key:ACCESS,subject:'IELTS Reading Test: '+S.name,from_name:'IELTS Reading Test',name:S.name,total_time:fmt(r.tot),part_1_time:fmt(r.secs[0]),part_2_time:fmt(r.secs[1]),part_3_time:fmt(r.secs[2]),message:r.text};}
function postForm(f){var fd=new FormData();Object.keys(f).forEach(function(k){fd.append(k,f[k]);});return fetch(URLW,{method:'POST',headers:{'Accept':'application/json'},body:fd});}
function postJson(f){return fetch(URLW,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(f)});}
function okRes(x){return x.json().then(function(j){if(j&&j.success)return j;throw new Error((j&&j.message)||('HTTP '+x.status));});}
function sendReport(){
 var r=lastReport,f=fieldsOf(r);
 $('ovSend').classList.add('on');$('sendMsg').textContent='Sending your answers...';$('sendBtns').style.display='none';$('copyMsg').textContent='';
 postForm(f).then(okRes).catch(function(){return postJson(f).then(okRes);}).then(function(){
  S.submitted=true;save();$('ovSend').classList.remove('on');renderResults();$('ovDone').classList.add('on');
  $('doneTime').textContent='Total time: '+fmt(r.tot)+'  |  Part 1: '+fmt(r.secs[0])+'  |  Part 2: '+fmt(r.secs[1])+'  |  Part 3: '+fmt(r.secs[2]);
 }).catch(function(e){
  var m=document.createElement('span');m.className='err';m.textContent='Your answers could not be sent ('+String(e.message||e)+'). Your progress is still saved. Press Try again, or use Download backup or Copy answers and send them to your teacher.';
  var box=$('sendMsg');box.textContent='';box.appendChild(m);$('sendBtns').style.display='block';
 });
}
function backup(){var b=new Blob([lastReport.text],{type:'text/plain'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='IELTS_Reading_'+S.name.replace(/[^A-Za-z0-9]+/g,'_')+'.txt';a.click();}
function copyReport(){
 var t=lastReport.text;
 function fb(){var x=document.createElement('textarea');x.value=t;document.body.appendChild(x);x.select();try{document.execCommand('copy');}catch(e){}document.body.removeChild(x);$('copyMsg').textContent='Copied.';}
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){$('copyMsg').textContent='Copied.';},fb);}else{fb();}
}
function newAttempt(){try{localStorage.removeItem(KEY);}catch(e){}location.reload();}
(function init(){
 var raw=null;try{raw=localStorage.getItem(KEY);}catch(e){}
 if(raw){try{var st=JSON.parse(raw);
  if(st&&st.name&&st.start){S=st;S.annots=S.annots||{};S.an=S.an||0;restore(S.ans);$('who').textContent=S.name;
   if(S.submitted){$('ovStart').classList.remove('on');renderResults();$('ovDone').classList.add('on');$('doneTime').textContent='Your answers were sent.';return;}
   $('ovStart').classList.remove('on');var P=S.active||1;S.active=P;
   document.querySelectorAll('.partview').forEach(function(v){v.classList.remove('on');});$('view'+P).classList.add('on');
   applyAnnots();refresh();
   var gap=(Date.now()-st.last)/1000;S.secs[P-1]+=Math.max(0,gap);S.last=Date.now();
   startTimer();$('ovResume').classList.add('on');setTimeout(function(){$('ovResume').classList.remove('on');},2500);return;}}catch(e){}}
 showPart(1);refresh();
})();
function AKD(){if(!AKD.v){var b=atob(AK_RAW),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);AKD.v=JSON.parse(new TextDecoder().decode(u));}return AKD.v;}
function norm(v){return String(v).toLowerCase().replace(/[\-‐-—]/g,' ').replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ').trim();}
function bandOf(s){var t=[[39,9],[37,8.5],[35,8],[33,7.5],[30,7],[27,6.5],[23,6],[19,5.5],[15,5],[13,4.5],[10,4],[8,3.5],[6,3],[4,2.5]];for(var i=0;i<t.length;i++)if(s>=t[i][0])return t[i][1].toFixed(1);return s>0?'2.0':'0';}
function grade(){
 var K=AKD().q,m={},tot=0,parts=[0,0,0];
 for(var P=1;P<=NP;P++)R[P].forEach(function(it){
  if(it.k=='check'){if(it.n==13)return;var g=GN(P,12),k=K[g],ch=checkVals(),got=0;
   ch.forEach(function(c){if(k.a.indexOf(c)>=0)got++;});got=Math.min(got,2);
   m[P+'-'+it.n]={q:g+'–'+(g+1),your:ch.join(', '),right:k.a.join(', '),pts:got,max:2,e:k.e,P:P};tot+=got;parts[P-1]+=got;return;}
  var g=GN(P,it.n),k=K[g],v=getVal(P,it);
  var ok=v!==''&&k.a.some(function(a){return it.k=='text'?norm(a)===norm(v):a===v;});
  m[P+'-'+it.n]={q:String(g),your:v,right:k.a[0],pts:ok?1:0,max:1,e:k.e,P:P};if(ok){tot++;parts[P-1]++;}
 });
 return {m:m,tot:tot,parts:parts,band:bandOf(tot)};
}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function renderResults(){
 var G=grade(),h=[];
 h.push("<div class='score'><div class='big'>"+G.tot+"<span>/40</span></div><div><div class='band'>Band "+G.band+"</div><div class='pp'>Part 1: "+G.parts[0]+"/13 &nbsp;|&nbsp; Part 2: "+G.parts[1]+"/13 &nbsp;|&nbsp; Part 3: "+G.parts[2]+"/14</div></div></div>");
 h.push("<p class='rhint'>Click a question to see the explanation.</p>");
 for(var P=1;P<=NP;P++){h.push("<h3 class='rpart'>Part "+P+"</h3>");
  R[P].forEach(function(it){var x=G.m[P+'-'+it.n];if(!x)return;
   var cls=x.pts==x.max?'ok':(x.pts>0?'half':'bad'),mk=x.max==2?(x.pts+'/2'):(x.pts?'✓':'✗');
   h.push("<details class='rq "+cls+"'><summary><span class='rn'>"+x.q+"</span><span class='rm'>"+mk+"</span><span class='ry'>Your answer: <b>"+(x.your===''?'<i>(blank)</i>':esc(x.your))+"</b></span><span class='rc'>Correct: <b>"+esc(x.right)+"</b></span></summary><div class='rex'>"+x.e+"</div></details>");});}
 h.push("<div class='rtips'>"+AKD().tips+"</div>");
 $('resBody').innerHTML=h.join('');
}
