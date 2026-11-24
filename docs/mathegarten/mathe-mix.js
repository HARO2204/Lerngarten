const MathMix=(()=>{
const types={add:'Plusaufgaben',sub:'Minusaufgaben',mul:'Malaufgaben',div:'Geteiltaufgaben',dots:'Punktebilder · Malrechnen',family:'Aufgabenfamilien · Mal und Geteilt',jumps:'Malrechnen am Zahlenstrahl',missing:'Ergänzungsaufgaben',neighbors:'Nachbarzahlen',sequence:'Zahlenfolgen',snake:'Kopfrechenschlangen',house:'Mathehäuser',pyramid:'Zahlenpyramiden',lovers:'Verliebte Zahlen · zur 10',story:'Sachaufgaben'};
const defaults=()=>({version:1,max:100,level:2,seed:1,shuffle:false,answerSnake:false,fontScale:1,tables:[2,4,5],counts:{add:4,sub:4,mul:2,div:2,dots:0,family:0,jumps:0,missing:2,neighbors:0,sequence:0,snake:1,house:1,pyramid:1,lovers:0,story:0}});
function normalize(s){
if(!s||typeof s!=='object'||!s.counts||typeof s.counts!=='object')return s;
return {...s,fontScale:s.fontScale===undefined?1:s.fontScale,answerSnake:s.answerSnake===undefined?false:s.answerSnake,tables:s.tables===undefined?[2,4,5]:s.tables,counts:{mul:0,div:0,dots:0,family:0,jumps:0,...s.counts}};
}
function valid(s){s=normalize(s);return !!s&&s.version===1&&[10,20,50,100,1000].includes(s.max)&&[1,2,3].includes(s.level)&&Number.isInteger(s.seed)&&typeof s.shuffle==='boolean'&&typeof s.answerSnake==='boolean'&&[1,1.2,1.4].includes(s.fontScale)&&Array.isArray(s.tables)&&s.tables.length>0&&s.tables.every(n=>Number.isInteger(n)&&n>=1&&n<=10)&&new Set(s.tables).size===s.tables.length&&s.counts&&Object.keys(s.counts).every(k=>Object.hasOwn(types,k))&&Object.keys(types).every(k=>Number.isInteger(s.counts[k])&&s.counts[k]>=0&&s.counts[k]<=20)&&Object.values(s.counts).reduce((a,n)=>a+n,0)>=1&&Object.values(s.counts).reduce((a,n)=>a+n,0)<=60}
function build(s){s=normalize(s);if(s&&Array.isArray(s.tables)&&s.tables.length===0)throw Error('Wähle mindestens eine Einmaleinsreihe.');if(!valid(s))throw Error('Wähle insgesamt 1 bis 60 Aufgaben, je Aufgabenart höchstens 20.');let seed=s.seed;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296},int=(a,b)=>a+Math.floor(random()*(b-a+1)),pick=a=>a[int(0,a.length-1)],tasks=[];
const facts=[];
for(const table of s.tables)for(let factor=1;factor<=10;factor++){
if(table*factor<=s.max)facts.push({table,factor});
}
if((s.counts.mul||s.counts.div||s.counts.dots||s.counts.family||s.counts.jumps)&&!facts.length)throw Error('Für diese Reihen ist der Zahlenraum zu klein. Wähle einen größeren Zahlenraum oder eine kleinere Reihe.');
function equation(op){for(let i=0;i<100;i++){const a=int(0,s.max),limit=op==='+'?s.max-a:a;if(limit<1)continue;const b=int(1,s.level===1?Math.min(9,limit):limit),result=op==='+'?a+b:a-b,easy=op==='+'?a%10+b%10<10:a%10>=b%10;if(s.level===1&&!easy)continue;return{a,b,result,op}}return{a:1,b:1,result:op==='+'?2:0,op}}
for(const [type,count]of Object.entries(s.counts))for(let j=0;j<count;j++){let t={type};
if(type==='family'){
const choices=facts.filter(f=>f.factor!==f.table);
const {table,factor}=pick(choices.length?choices:facts);
Object.assign(t,{a:factor,b:table,result:factor*table});
t.numbers=[t.a,t.b,t.result];
for(let i=2;i>0;i--){const k=int(0,i);[t.numbers[i],t.numbers[k]]=[t.numbers[k],t.numbers[i]]}
}
if(type==='mul'||type==='div'||type==='dots'||type==='jumps'){
const {table,factor}=pick(facts);
Object.assign(t,type!=='div'?{a:factor,b:table,result:factor*table,op:'·'}:{a:factor*table,b:table,result:factor,op:':'});
t.slot='result';
}
if(['add','sub','missing','story'].includes(type)){Object.assign(t,equation(type==='add'?'+':type==='sub'?'-':pick(['+','-'])));t.slot=type==='missing'?pick(['a','b']):'result';if(type==='story')t.question=t.op==='+'?'Für eine Themenwand liegen '+t.a+' Bildkarten bereit. Es kommen '+t.b+' dazu. Wie viele sind es jetzt?':'In einer Box liegen '+t.a+' Stifte. '+t.b+' werden herausgenommen. Wie viele bleiben?'}
if(type==='neighbors')t.value=int(1,s.max-1);
if(type==='sequence'){t.step=pick([1,2,5,10,100].filter(n=>4*n<=s.max));t.start=int(0,s.max-4*t.step);t.values=Array.from({length:5},(_,i)=>t.start+i*t.step)}
if(type==='snake'){t.values=[int(0,s.max)];t.ops=[];for(let n=0;n<4;n++){const a=t.values[n],op=a===0?'+':a===s.max?'-':pick(['+','-']),limit=op==='+'?s.max-a:a,b=int(1,Math.min(limit,s.level===1?5:Math.max(2,Math.floor(s.max/4))));t.ops.push({op,b});t.values.push(op==='+'?a+b:a-b)}}
if(type==='house'){t.total=int(2,s.max);t.rows=Array.from({length:4},()=>{const a=int(0,t.total);return[a,t.total-a]})}
if(type==='pyramid'){const lim=Math.max(1,Math.floor(s.max/4));t.base=[int(0,lim),int(0,lim),int(0,lim)];if(t.base.every(v=>v===0))t.base[1]=1;t.mid=[t.base[0]+t.base[1],t.base[1]+t.base[2]];t.top=t.mid[0]+t.mid[1]}
if(type==='lovers'){t.left=int(0,10);t.right=10-t.left}
tasks.push(t)}
if(s.shuffle)for(let i=tasks.length-1;i>0;i--){const j=int(0,i);[tasks[i],tasks[j]]=[tasks[j],tasks[i]]}tasks.forEach((t,i)=>t.index=i+1);return{s:{...s,counts:{...s.counts}},tasks}}
function solutionSnake(p,values,seed){
if(!values.length)return;
const numbers=[...values];
for(let i=numbers.length-1;i>0;i--){
seed=(Math.imul(seed,1664525)+1013904223)>>>0;
const j=seed%(i+1);
[numbers[i],numbers[j]]=[numbers[j],numbers[i]];
}
p.text(40,661,'Lösungsschlange · Finde die passenden Zahlen.',11,true);
const positions=numbers.map((value,index)=>{
const row=Math.floor(index/8),column=index%8;
return {value,x:79+(row%2?7-column:column)*62,y:688+row*38};
});
for(let i=1;i<positions.length;i++){
const previous=positions[i-1],current=positions[i];
if(previous.y===current.y)p.line(previous.x,previous.y,current.x,current.y,'#8ba774',16);
else p.path('M '+previous.x+' '+previous.y+' Q '+(previous.x+30)+' '+((previous.y+current.y)/2)+' '+current.x+' '+current.y,'#8ba774',16);
}
p.circle(48,688,15,'#8ba774');
p.circle(44,682,2,'#203d36');
p.line(33,693,28,695,'#567348',1);
for(const position of positions){
p.circle(position.x,position.y,17,'#edf3e5');
p.text(position.x,position.y+5,position.value,13,true,'#203d36','middle');
}
}
function pages(model,solutions=false,title='Mein Mathe-Mix'){const all=[],s=model.s,scale=s.fontScale||1,subtitle='Zahlenraum 0 bis '+s.max+' · '+['Mit viel Hilfe','Mit wenig Hilfe','Selbstständig'][s.level-1];for(const answer of solutions?[false,true]:[false]){let p=MathA4.page(title,subtitle,{solution:answer}),y=151,pending=0,col=0,pageNumber=1,pageValues=[];const contentBottom=s.answerSnake?640:750;function flush(){if(col){y+=pending+14;col=0;pending=0}}function finish(){flush();if(s.answerSnake)solutionSnake(p,pageValues,s.seed+pageNumber);p.text(40,774,answer?'Lösungen zum selben Aufgabenblatt.':'___ Ich habe meine Ergebnisse überprüft.',9);all.push(p.finish())}function newPage(){finish();pageNumber++;p=MathA4.page(title,subtitle,{solution:answer,continuation:true});y=151;pending=0;col=0;pageValues=[]}
for(const t of model.tasks){const full=scale>1||['snake','sequence','story','family','jumps'].includes(t.type),baseHeight=t.type==='jumps'?228:t.type==='family'?246:t.type==='dots'?244:t.type==='snake'?100:t.type==='sequence'?66:t.type==='house'?191:t.type==='pyramid'?160:t.type==='lovers'?131:t.type==='story'?MathA4.wrap(t.index+'. '+t.question,515/scale,12.5).length*17.5+82:64,height=baseHeight*scale;if(full)flush();if(y+height>contentBottom)newPage();if(['add','sub','mul','div','dots','missing'].includes(t.type))pageValues.push(t.slot==='a'?t.a:t.slot==='b'?t.b:t.result);const x=40+(full?0:col*265),w=(full?515:250)/scale;p.beginGroup(x,y,scale);const titles={add:'Rechne plus.',sub:'Rechne minus.',mul:'Rechne mal.',div:'Rechne geteilt.',dots:'Zähle die Reihen und rechne mal.',family:'Finde die Aufgabenfamilie.',jumps:'Rechne mit gleich großen Sprüngen.',missing:'Ergänze.',neighbors:'Vorher und nachher.',sequence:'Setze die Folge fort.',snake:'Rechne im Kopf weiter.',house:'Jede Etage ergibt die Dachzahl.',pyramid:'Oben steht die Summe der zwei Steine darunter.',lovers:'Zusammen sind wir 10.',story:'Lies und rechne.'};p.para(x,y,t.index+'. '+titles[t.type],w,t.type==='pyramid'?10.5:11.5,true,1.25);
if(['add','sub','mul','div','missing'].includes(t.type)){const text=(t.slot==='a'&&!answer?'____':t.a)+' '+t.op+' '+(t.slot==='b'&&!answer?'____':t.b)+' = '+(t.slot==='result'&&!answer?'____':t.result);p.text(x,y+39,text,Math.min(19,w/Math.max(1,MathA4.width(text,1))),false)}
if(t.type==='jumps'){
const left=x+18,right=x+w-20,lineY=y+115,unit=(right-left)/t.result;
const step=t.b,factor=t.a,showJumps=answer||s.level!==2;
p.text(x+18,y+39,s.level===2?'Zeichne '+factor+' Sprünge mit je '+step+' Schritten.':s.level===3?'Finde eine Malaufgabe und die passende Geteiltaufgabe.':'Lies die Sprünge und ergänze die Malaufgabe.',12);
p.line(left,lineY,right+5,lineY);
p.path('M '+(right+5)+' '+lineY+' l -5 -3 l 0 6 Z','#64785b',.5,'#64785b');
for(let value=0;value<=t.result;value++){
const xx=left+value*unit,major=value%step===0;
p.line(xx,lineY-(major?5:2),xx,lineY+(major?5:2));
if(major)p.text(xx,lineY+21,value===t.result&&!answer&&s.level<3?'?':value,10,false,'#243e35','middle');
}
if(showJumps)for(let i=0;i<factor;i++)p.arc(left+i*step*unit,left+(i+1)*step*unit,lineY,43,'+'+step);
if(s.level<3){
p.text(x+18,y+175,(answer||s.level===2?factor:'___')+' · '+(answer||s.level===2?step:'___')+' = '+(answer?t.result:'___'),18);
}else{
p.text(x+18,y+172,answer?factor+' · '+step+' = '+t.result:'___ · ___ = ___',18);
p.text(x+18,y+207,answer?t.result+' : '+step+' = '+factor:'___ : ___ = ___',18);
}
}
if(t.type==='family'){
const rows=[[t.a,'·',t.b,t.result],[t.b,'·',t.a,t.result],[t.result,':',t.a,t.b],[t.result,':',t.b,t.a]];
if(s.level===1){
for(let row=0;row<t.a;row++)for(let column=0;column<t.b;column++)p.circle(x+18+column*13,y+58+row*13,2.7,'#345e48');
p.text(x+18,y+213,t.a+(t.a===1?' Reihe':' Reihen')+' mit je '+t.b+' Punkten',11);
}else{
p.text(x+18,y+43,(s.level===3?'Deine Zahlen: ':'Diese Zahlen gehören zusammen: ')+t.numbers.join(' · '),13,true);
}
rows.forEach((row,index)=>{
const values=[...row];
if(!answer){
if(s.level===1)values[3]='___';
else if(s.level===2)values[[0,2,2,3][index]]='___';
else{values[0]='___';values[2]='___';values[3]='___'}
}
const left=s.level===1?x+175:x+18,top=s.level===1?y+64:y+80;
p.text(left,top+index*37,values[0]+' '+values[1]+' '+values[2]+' = '+values[3],16);
});
}
if(t.type==='dots'){
const step=15,left=x+24,top=y+37;
for(let row=0;row<t.a;row++)for(let column=0;column<t.b;column++)p.circle(left+column*step,top+row*step,3,'#345e48');
p.text(x,y+204,(answer||s.level===1?t.a:'___')+(t.a===1&&(answer||s.level===1)?' Reihe mit je ':' Reihen mit je ')+(answer||s.level===1?t.b:'___')+' Punkten',12);
p.text(x,y+231,(answer||s.level===1?t.a:'___')+' · '+(answer||s.level===1?t.b:'___')+' = '+(answer?t.result:'___'),18);
}
if(t.type==='neighbors')p.text(x,y+39,(answer?t.value-1:'____')+' | '+t.value+' | '+(answer?t.value+1:'____'),18);
if(t.type==='sequence')p.text(x,y+42,t.values.map((n,i)=>answer||i<3?n:'____').join(' · '),18);
if(t.type==='snake'){const box=Math.min(61,(w-4*28)/5),gap=(w-5*box)/4,top=y+37;for(let i=0;i<5;i++){const xx=x+i*(box+gap);p.rect(xx,top,box,32,'#f4f6ec','#92a084',7);p.text(xx+box/2,top+22,answer||i===0||(s.level===1&&i===1)?t.values[i]:'___',16,false,'#243e35','middle');if(i<4){p.line(xx+box+3,top+16,xx+box+gap-4,top+16);p.path(`M ${xx+box+gap-4} ${top+16} l -5 -3 l 0 6 Z`,'#64785b',.5,'#64785b');p.text(xx+box+gap/2,top+7,t.ops[i].op+t.ops[i].b,11,true,'#243e35','middle')}}}
if(t.type==='house'){const left=x+25,ww=200,top=y+54;p.path(`M ${left} ${top} L ${left+ww/2} ${top-30} L ${left+ww} ${top} Z`,'#839679',1,'#edf2e5');p.text(left+ww/2,top-8,t.total,16,true,'#243e35','middle');for(let r=0;r<4;r++)for(let c=0;c<2;c++){p.rect(left+c*ww/2,top+r*28,ww/2,28);const given=c===r%2||(s.level===1&&r===0);p.text(left+(c+.5)*ww/2,top+r*28+20,answer||given?t.rows[r][c]:'___',15,false,'#243e35','middle')}}
if(t.type==='pyramid'){const bw=68,bh=31,top=y+41,left=x+17;const rows=[[t.top],t.mid,t.base];for(let r=0;r<3;r++)for(let c=0;c<rows[r].length;c++){const xx=left+(2-r)*bw/2+c*bw,yy=top+r*bh;p.rect(xx,yy,bw,bh,'#f4f6ec');const shown=answer||(s.level<3?r===2||(s.level===1&&r===1&&c===0):r===0||(r===2&&c!==1));p.text(xx+bw/2,yy+22,shown?rows[r][c]:'___',15,false,'#243e35','middle')}}
if(t.type==='lovers'){const cx=x+125,top=y+32;p.path(`M ${cx} ${top+73} C ${cx-105} ${top+20} ${cx-55} ${top-24} ${cx} ${top+9} C ${cx+55} ${top-24} ${cx+105} ${top+20} ${cx} ${top+73} Z`,'#a06d78',1,'#f7e6e9');p.line(cx,top+12,cx,top+58,'#b88991',.6,'2 2');p.text(cx-29,top+38,t.left,19,true,'#6a3e48','middle');p.text(cx+29,top+38,answer?t.right:'___',19,true,'#6a3e48','middle')}
if(t.type==='story'){let yy=p.para(x,y+26,t.question,w,12.5)+8;p.text(x,yy,'Rechnung: '+(answer?t.a+' '+t.op+' '+t.b+' = '+t.result:''),12.5);p.line(x,yy+9,x+w,yy+9);p.text(x,yy+36,answer?'Antwort: Es '+(t.result===1?'ist ':'sind ')+t.result+(t.op==='+'?(t.result===1?' Bildkarte.':' Bildkarten.'):(t.result===1?' Stift.':' Stifte.')):'Antwort:',12.5);p.line(x,yy+46,x+w,yy+46)}
p.endGroup();if(full)y+=height+15;else{pending=Math.max(pending,height);col++;if(col===2)flush()}}
finish()}return all}
return{types,defaults,normalize,valid,build,pages};
})();






