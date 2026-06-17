// ════════════════════════════════════════════════════════════
// FORJA DE RITUAL — backup do criador (removido do index em 2026-06)
// Pra reativar: cole estes blocos de volta no index (no mesmo escopo IIFE
// dos feitiços, perto das tabelas FORJA_*), re-adicione o botão Forjar
// (onclick="openFeiticoModal()") no header Acervo, e mantenha as tabelas
// FORJA_GRAUS/EXEC/ALC/DUR/ALVO/etc + o CSS .forja-* (que continuam no index).
// ════════════════════════════════════════════════════════════

/* ─── BLOCO 1: _forja + openFeiticoModal + window.openFeiticoModal ─── */
let _forja={};
function openFeiticoModal(id){
  _editingFeitId=id||null;
  const existing=id?((fichaData.feiticos||[]).find(f=>f.id===id)):null;
  const title=document.getElementById('modal-title'),body=document.getElementById('modal-body');
  if(!title||!body)return;
  title.textContent=existing?'Editar Ritual':'Forja de Ritual';
  const _ovEl=document.getElementById('modal-overlay');
  const _mh=_ovEl&&_ovEl.querySelector('.modal-header');
  if(_mh && !_mh.querySelector('.forja-dice-btn') && !existing){
    const dc=document.createElement('button');
    dc.type='button';dc.className='forja-dice-btn';dc.title='Sortear ritual aleatório';
    dc.innerHTML='<svg class="forja-d6-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l9 5 9-5"/><path d="M12 12v10"/><circle cx="7.5" cy="9" r=".8" fill="currentColor" stroke="none"/><circle cx="16.5" cy="9" r=".8" fill="currentColor" stroke="none"/><circle cx="12" cy="16" r=".8" fill="currentColor" stroke="none"/></svg>';
    _mh.querySelector('.modal-close').insertAdjacentElement('beforebegin',dc);
    let _rolling=false;
    dc.addEventListener('click',()=>{
      if(_rolling)return;_rolling=true;
      dc.classList.add('rolling');
      let i=0;const iv=setInterval(()=>{if(++i>=6){clearInterval(iv);dc.classList.remove('rolling');_rolling=false}},55);
      const _pick=arr=>arr[_rngInt(arr.length)];
      const ESS=['Alba','Carmin','Kaos','Lumen','Perene','Ruina'];
      const ALC_KEYS=Object.keys(FORJA_ALC);
      const ALVO_KEYS=FORJA_ALVO.map(a=>a.tipo);
      const NOMES=['Sopro do Abismo','Vereda Cinérea','Lâmina Etérea','Pulso Ígneo','Aurora Profunda','Eco da Bruma','Beijo Sombrio','Tempestade Muda','Mão do Vidente','Espiral Carmesim','Manto da Ruína','Voz Lumínea','Olho do Caos','Selo Verdejante','Coro de Cinzas','Lembrança da Forja'];
      const VERBOS=['envolve','consome','transmuta','perfura','desfaz','reverbera por','rasga','silencia','desperta','evoca'];
      _forja.essencia=_pick(ESS);
      _forja.grauId=_pick(['g1','g2','g3','aprimoramento']);
      _forja.execucao=_pick(['Decisiva','Movimento','Reação','Livre']);
      _forja.alcance=_pick(['Toque / Pessoal','Curto','Médio']);
      _forja.duracao=_pick(['Cena','Instantânea','Sustentada']);
      _forja.resistTipo=_pick(['Anula','Parcial','Sem Teste (positivo)']);
      _forja.resistPericia=_pick(FORJA_PERIC.slice(0,3));
      _forja.alvo=_pick(['unico','voce','multiplos','area_cubo']);
      _forja.qtdAlvos=2+_rngInt(4);
      _forja.areaTamanho=3+_rngInt(3)*3;
      _forja.movimentos=[_pick(['Verbal','Gestual']),_pick(['Material','Sigilo','Concentração'])];
      const giM=FORJA_GRAUS.find(g=>g.id===_forja.grauId)?.idx??0;
      const dt=Math.random();
      if(dt<.55){_forja.danoCuraTipo='dano';_forja.danoCuraValor=Math.max(5,Math.round(FORJA_DANO_REF[giM]*(.4+Math.random()*.6)));_forja.danoFisico=Math.random()<.6}
      else if(dt<.85){_forja.danoCuraTipo='cura';_forja.danoCuraValor=Math.max(5,Math.round(FORJA_CURA_REF[giM]*(.4+Math.random()*.6)))}
      else{_forja.danoCuraTipo='nenhum';_forja.danoCuraValor=0}
      _forja.efeitosPri=[];_forja.efeitosSec=[];
      _forja.nome=_pick(NOMES);
      const grauNm=FORJA_GRAUS.find(g=>g.id===_forja.grauId)?.nome||'1º Grau';
      const alvoNm=FORJA_ALVO.find(a=>a.tipo===_forja.alvo)?.nome||'Único';
      const dcDesc=_forja.danoCuraTipo==='dano'?` Causa ${_forja.danoCuraValor} de dano${_forja.danoFisico?' físico':' não-físico'}.`:_forja.danoCuraTipo==='cura'?` Restaura ${_forja.danoCuraValor} de vitalidade.`:'';
      _forja.descricao=`Ritual de ${grauNm.toLowerCase()} da essência ${_forja.essencia}. ${_pick(VERBOS).charAt(0).toUpperCase()+_pick(VERBOS).slice(1)} o alvo (${alvoNm.toLowerCase()}) com alcance ${_forja.alcance.toLowerCase()} e duração ${_forja.duracao.toLowerCase()}.${dcDesc} Conjurado em execução ${_forja.execucao.toLowerCase()}, exige ${_forja.movimentos.join(' + ').toLowerCase()}.`;
      try{navigator.vibrate&&navigator.vibrate(10)}catch(_){}
      let _g=8;while(_g-->0){const _c=calc();if(_c.total<=_c.MAX)break;if(_forja.danoCuraValor>3){_forja.danoCuraValor=Math.max(3,Math.round(_forja.danoCuraValor*.7))}else if(_forja.alvo!=='unico'){_forja.alvo='unico'}else if(_forja.duracao!=='Instantânea'){_forja.duracao='Instantânea'}else if(_forja.alcance!=='Toque / Pessoal'){_forja.alcance='Toque / Pessoal'}else break}
      const _cFinal=calc();
      const _msg=_cFinal.total>_cFinal.MAX?`⚠ ${_forja.nome} · ULTRAPASSOU ${_cFinal.total}/${_cFinal.MAX} pts — ajuste manual`:`✦ ${_forja.nome} · ${_forja.essencia} · ${grauNm} (${_cFinal.total}/${_cFinal.MAX})`;
      if(typeof toast==='function')toast(_msg,_cFinal.total>_cFinal.MAX?'warning':'info');
      render();
    });
  }
  const COLORS=[
    {name:'Alba',v:'linear-gradient(165deg in oklch,#1a3a1f 0%,#4a9954 45%,#a8e6a0 100%)'},
    {name:'Carmin',v:'linear-gradient(165deg in oklch,#1a0202 0%,#4a0a08 35%,#8b1414 70%,#c91a14 100%)'},
    {name:'Kaos',v:'linear-gradient(165deg in oklch,#2a0a3a 0%,#6b1a8a 45%,#c060e8 100%)'},
    {name:'Lumen',v:'linear-gradient(165deg in oklch,#3a2808 0%,#9a7820 50%,#f0c030 100%)'},
    {name:'Perene',v:'linear-gradient(165deg in oklch,#0a2a2a 0%,#1f6a6a 45%,#40e0b0 100%)'},
    {name:'Ruina',v:'linear-gradient(165deg in oklch,#171717 0%,#4a4438 50%,#888070 100%)'}
  ];
  _forja={
    step:0,nome:existing?.name||'',descricao:existing?.desc||'',
    grauId:existing?.grauId||'g1',essencia:existing?.school||'Carmin',
    movimentos:existing?.movimentos||['Verbal','Gestual'],
    execucao:existing?.execucao||'Decisiva',alcance:existing?.alcance||'Curto',
    duracao:existing?.duracao||'Instantânea',resistTipo:existing?.resistTipo||'Anula',
    resistPericia:existing?.resistPericia||'Fortitude',alvo:existing?.alvo||'unico',
    qtdAlvos:existing?.qtdAlvos||3,areaTamanho:existing?.areaTamanho||3,
    espessuraLinha:existing?.espessuraLinha||3,
    efeitosPri:existing?.efeitosPri||[],efeitosSec:existing?.efeitosSec||[],
    danoCuraTipo:existing?.danoCuraTipo||'nenhum',danoCuraValor:existing?.danoCuraValor||0,
    danoFisico:existing?.danoFisico??true,apPreReq:existing?.apPreReq||false,
    apAfinidade:existing?.apAfinidade||false,ocultismo:existing?.ocultismo||0,
    nivelConjurador:existing?.nivelConjurador||4,customColor:existing?.customColor||'',
    circle:existing?.circle??0,
    natureza:existing?.natureza||'fisica' /* fisica=gasta Esforço(PE) · mental=gasta Foco(PF) */
  };
  function calc(){
    const grauObj=FORJA_GRAUS.find(g=>g.id===_forja.grauId)||FORJA_GRAUS[0];
    const gi=grauObj.idx;
    let MAX=_forja.grauId==='aprimoramento'?27:30;
    if(_forja.grauId==='aprimoramento'&&_forja.apPreReq)MAX+=3;
    if(_forja.grauId==='aprimoramento'&&_forja.apAfinidade)MAX+=3;
    const lim=3+(Number(_forja.nivelConjurador)||0);
    const bd=[];let total=0;
    const ex=FORJA_EXEC.find(e=>e.nome===_forja.execucao);if(ex){total+=ex.custo;bd.push({l:'Execução: '+_forja.execucao,v:ex.custo})}
    const av=FORJA_ALC[_forja.alcance]?.[gi];
    if(av==null){bd.push({l:'Alcance: '+_forja.alcance+' (indisponível)',v:0,err:1})}else{const v=_forja.alvo==='area_linha'?av*2:av;total+=v;bd.push({l:'Alcance: '+_forja.alcance+(_forja.alvo==='area_linha'?' (×2 Linha)':''),v})}
    const du=FORJA_DUR.find(d=>d.nome===_forja.duracao);if(du){total+=du.custos[gi];bd.push({l:'Duração: '+_forja.duracao,v:du.custos[gi]})}
    const rs=FORJA_RES.find(r=>r.nome===_forja.resistTipo);if(rs){total+=rs.custo;bd.push({l:'Resistência: '+_forja.resistTipo,v:rs.custo})}
    if(_forja.resistPericia==='Outra (+3 pts)'){total+=3;bd.push({l:'Perícia especial',v:3})}
    if(_forja.alvo==='voce'){total-=2;bd.push({l:'Alvo: Você',v:-2})}
    if(_forja.alvo==='area_linha'&&_forja.espessuraLinha>3){const e=Math.ceil((_forja.espessuraLinha-3)/3)*2;total+=e;bd.push({l:'Linha espessura '+_forja.espessuraLinha+'m',v:e})}
    let pPri=_forja.efeitosPri.reduce((s,e)=>s+e.custo,0);
    let pDC=0;
    if(_forja.danoCuraTipo!=='nenhum'&&_forja.danoCuraValor>0){const ref=_forja.danoCuraTipo==='dano'?FORJA_DANO_REF:FORJA_CURA_REF;pDC=_forjaCustoDC(_forja.danoCuraValor,gi,ref);if(_forja.danoCuraTipo==='dano'&&!_forja.danoFisico)pDC+=Math.ceil(pDC/5)}
    let pEf=pPri+pDC;
    const isSust=du?.tipo==='sustentada';if(isSust){const o=pEf;pEf*=2;bd.push({l:'Sustentada (×2)',v:pEf-o})}
    const mAlvo=_forjaMultAlvo(_forja.alvo,_forja.qtdAlvos,_forja.areaTamanho);
    if(mAlvo>1.0001){const o=pEf;pEf=Math.ceil(pEf*mAlvo);const d=pEf-o;const lbl=_forja.alvo==='multiplos'?'Múltiplos ('+_forja.qtdAlvos+'x): +'+Math.round((mAlvo-1)*100)+'%':_forja.alvo==='area_cubo'?'Cubo '+_forja.areaTamanho+'m: +'+Math.round((mAlvo-1)*100)+'%':_forja.alvo==='area_cone'?'Cone '+_forja.areaTamanho+'m: +'+Math.round((mAlvo-1)*100)+'%':'Alvo';if(d>0)bd.push({l:lbl,v:d})}
    for(const e of _forja.efeitosPri)bd.push({l:'  · '+e.nome,v:e.custo,sub:1});
    if(pDC>0){const tl=_forja.danoCuraTipo==='dano'?'Dano '+_forja.danoCuraValor+(_forja.danoFisico?' (físico)':' (não-físico)'):'Cura '+_forja.danoCuraValor;bd.push({l:'  · '+tl,v:pDC,sub:1})}
    total+=pEf;
    const limSec=Math.floor(pPri/3);const totSec=_forja.efeitosSec.reduce((s,e)=>s+e.custo,0);
    if(_forja.efeitosSec.length){total-=totSec;bd.push({l:'Efeitos secundários',v:-totSec});for(const e of _forja.efeitosSec)bd.push({l:'  · '+e.nome,v:0,sub:1,extra:'-'+e.custo+' pts'})}
    return{grauObj,gi,MAX,lim,bd,total,pPri,pDC,limSec,totSec,mAlvo,isSust}
  }
  function render(){
    const c=calc();const ok=Math.abs(c.MAX-c.total)<=1;const exc=c.total>c.MAX+1;
    const barW=Math.min(100,Math.max(0,(c.total/c.MAX)*100));
    const barC=exc?'#e05050':c.total>=c.MAX-1?'#7fff72':'#e0b840';
    const STEPS=['Conceito','Mecânica','Efeitos','Resumo'];
    const dt=FORJA_DT[_forja.grauId];const dtFinal=dt.base+(Number(_forja.ocultismo)||0);
    const semRes=_forja.resistTipo==='Sem Teste (positivo)'||_forja.resistTipo==='Sem Resistência';
    const SCHOOL_FALLBACK={Alba:COLORS[0].v,Carmin:COLORS[1].v,Kaos:COLORS[2].v,Lumen:COLORS[3].v,Perene:COLORS[4].v,Ruina:COLORS[5].v};
    const bg=_forja.customColor||SCHOOL_FALLBACK[_forja.essencia]||COLORS[0].v;
    const ESS_COR={Alba:'#a8e6a0',Carmin:'#c9372a',Kaos:'#c060e8',Lumen:'#f0c030',Perene:'#40e0b0',Ruina:'#888070'};
    const stepNomes={0:'Conceito',1:'Mecânica',2:'Efeitos',3:'Resumo'};
    const sideHTML=`<aside class="forja-side"><div class="forja-side-card">
      <div class="forja-side-h">RESUMO</div>
      <div class="forja-side-name">${(_forja.nome||'sem nome').toLowerCase().replace(/^(\p{L})/u,c=>c.toUpperCase())}</div>
      <div class="forja-side-row"><span class="forja-side-k">GRAU</span><span class="forja-side-v">${c.grauObj.nome}</span></div>
      <div class="forja-side-row"><span class="forja-side-k">ESSÊNCIA</span><span class="forja-side-v" style="color:${ESS_COR[_forja.essencia]||'#dc2626'}">${_forja.essencia}</span></div>
      <div class="forja-side-row"><span class="forja-side-k">EXEC</span><span class="forja-side-v">${_forja.execucao}</span></div>
      <div class="forja-side-row"><span class="forja-side-k">ALCANCE</span><span class="forja-side-v">${_forja.alcance}</span></div>
      <div class="forja-side-row"><span class="forja-side-k">DURAÇÃO</span><span class="forja-side-v">${_forja.duracao}</span></div>
      <div class="forja-side-row"><span class="forja-side-k">${(_forja.alvo||'').startsWith('area')?'ÁREA':'ALVO'}</span><span class="forja-side-v">${FORJA_ALVO.find(a=>a.tipo===_forja.alvo)?.nome||'—'}</span></div>
      <div class="forja-side-divider"></div>
      <div class="forja-side-pts"><div class="forja-side-pts-circle" style="--clr:${barC}"><span>${c.total}</span><small>/${c.MAX}</small></div><div class="forja-side-pts-lbl">${ok?'OK':exc?'EXCEDIDO':(c.MAX-c.total)+' livres'}</div></div>
      ${c.grauObj.PE!=null?`<div class="forja-side-row" style="margin-top:8px"><span class="forja-side-k">CUSTO</span><span class="forja-side-v" style="color:var(--forja-accent)">${c.grauObj.PE} ${_forja.natureza==='mental'?'PF':'PE'}</span></div>`:''}
      <div class="forja-side-row"><span class="forja-side-k">NATUREZA</span><span class="forja-side-v">${_forja.natureza==='mental'?'Mental · Foco':'Física · Esforço'}</span></div>
      <div class="forja-side-row"><span class="forja-side-k">LIM CONJ</span><span class="forja-side-v" style="color:${c.total<=c.lim?'#7fff72':'#e05050'}">${c.total}/${c.lim}</span></div>
    </div></aside>`;
    body.innerHTML=`
      <div class="forja-tabs">${STEPS.map((s,i)=>`<button class="forja-tab" ${_forja.step===i?'data-active':''} data-step="${i}">${i+1}. ${s}</button>`).join('')}</div>
      <div class="forja-bar">
        <div class="forja-bar-head"><span>${_forja.essencia.toUpperCase()} · ${c.grauObj.nome.toUpperCase()} · ${stepNomes[_forja.step]}</span><span style="color:${ok?'#7fff72':exc?'#e05050':'#e0b840'}">${c.total}/${c.MAX} ${ok?'✓':exc?'EXCEDIDO':(c.MAX-c.total)+' livres'}</span></div>
        <div class="forja-bar-track"><div class="forja-bar-fill" style="width:${barW}%;background:linear-gradient(to right in oklch,${barC}88,${barC})"></div></div>
      </div>
      ${_forja.step===0?renderStep0():_forja.step===1?renderStep1():_forja.step===2?renderStep2():renderStep3(c,bg,ok,exc,dt,dtFinal,semRes)}
      <div class="modal-btns" style="display:flex;gap:8px;justify-content:flex-end;align-items:center">
        ${existing?`<button class="modal-btn" style="background:transparent;color:var(--red);border:1px solid var(--red)" onclick="removeFeitico('${existing.id}');closeModal()">Excluir</button>`:''}
        <button class="modal-btn secondary" onclick="closeModal()">Cancelar</button>
        ${_forja.step>0?`<button class="modal-btn secondary" data-nav="-1">← Voltar</button>`:''}
        ${_forja.step<3?`<button class="modal-btn primary" data-nav="1">Próximo →</button>`:`<button class="modal-btn primary" onclick="saveFeitico()">⚒ Forjar Ritual</button>`}
      </div>`;
    body.querySelectorAll('.forja-tab').forEach(t=>t.onclick=()=>{_forja.step=+t.dataset.step;render()});
    body.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{_forja.step=Math.max(0,Math.min(3,_forja.step+ +b.dataset.nav));render()});
    body.querySelectorAll('.forja-sect').forEach(s=>s.onclick=()=>openForjaSub(s.dataset.sub));
    bindStep();
  }
  function _sectCard(id,name,val){return `<button class="forja-sect" data-sub="${id}"><span class="forja-sect-name">${name}</span><span class="forja-sect-val">${val||'—'}</span><span class="forja-sect-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="6" x2="12" y2="18"/><line x1="6" y1="12" x2="18" y2="12"/></svg></span></button>`}
  function renderStep0(){
    const movN=_forja.movimentos.length;
    const grauNome=FORJA_GRAUS.find(g=>g.id===_forja.grauId)?.nome||'1º Grau';
    return `<div class="forja-step" data-active>
      ${_sectCard('ident','Identidade',(_forja.nome||'sem nome')+' · '+grauNome)}
      ${_sectCard('ess','Essência',_forja.essencia)}
      ${_sectCard('mov','Movimentos',movN+' selecionado(s)')}
      ${_sectCard('conj','Conjurador','Nv '+_forja.nivelConjurador+' · Oc '+_forja.ocultismo)}
      <div class="forja-label" style="margin-top:14px">Natureza da execução · define o recurso gasto</div>
      <div class="forja-pills" id="fj-natureza">
        <button class="forja-pill" data-nat="fisica" ${_forja.natureza!=='mental'?'data-sel':''}>Física · Esforço (PE)</button>
        <button class="forja-pill" data-nat="mental" ${_forja.natureza==='mental'?'data-sel':''}>Mental · Foco (PF)</button>
      </div>
      <div class="forja-info" style="margin-top:6px">Ação física (atacar, tocar, mover) gasta <b>Esforço (PE)</b>. Ação mental (entrar na mente, ilusão, percepção) gasta <b>Foco (PF)</b>.</div>
    </div>`}
  function _renderStep0_OLD(){
    const op=_forja.openAcc||(_forja.openAcc={});
    const o=id=>op[0]===id?' open':'';
    const movN=_forja.movimentos.length;
    return `<div class="forja-step" data-active>
      <details class="forja-acc" data-acc="ident"${o('ident')}><summary class="forja-acc-head">Identidade <span class="forja-acc-val">${_forja.nome||'sem nome'}</span></summary><div class="forja-acc-body">
        <div class="forja-label" style="margin-top:0">Nome</div>
        <input id="fj-nome" placeholder="Ex: Véu de Cinzas" value="${(_forja.nome).replace(/"/g,'&quot;')}" style="width:100%;padding:8px 10px;font-size:14px;background:var(--bg-card-inner);border:1px solid var(--border);color:var(--text);border-radius:6px">
        <div class="forja-label">Grau</div>
        <div class="forja-pills" id="fj-graus">${FORJA_GRAUS.map(g=>`<button class="forja-pill" ${_forja.grauId===g.id?'data-sel':''} data-g="${g.id}">${g.nome}</button>`).join('')}</div>
        <div class="forja-info" style="margin-top:8px">${_forja.grauId==='aprimoramento'?'Aprimoramento: 27 pts base. +3 pré-req, +3 Afinidade.':'Limite: 30 pontos. Custa '+(FORJA_GRAUS.find(g=>g.id===_forja.grauId)?.PE||0)+' PE.'}</div>
        ${_forja.grauId==='aprimoramento'?`<label style="display:block;font-size:12px;margin-top:6px"><input type="checkbox" id="fj-prereq" ${_forja.apPreReq?'checked':''}> Pré-requisito (+3)</label><label style="display:block;font-size:12px"><input type="checkbox" id="fj-afin" ${_forja.apAfinidade?'checked':''}> Afinidade (+3)</label>`:''}
      </div></details>
      <details class="forja-acc" data-acc="ess"${o('ess')}><summary class="forja-acc-head">Essência <span class="forja-acc-val">${_forja.essencia}</span></summary><div class="forja-acc-body">
        <div class="forja-ess-grid">${Object.entries({Alba:{cor:'#a8e6a0',d:'Pureza da vida'},Carmin:{cor:'#c9372a',d:'Sacrifício e carne'},Kaos:{cor:'#c060e8',d:'Desordem primordial'},Lumen:{cor:'#f0c030',d:'Conhecimento'},Perene:{cor:'#40e0b0',d:'Tempo parado'},Ruina:{cor:'#888070',d:'Tempo em desgaste'}}).map(([n,e])=>`<button type="button" class="forja-ess-card" ${_forja.essencia===n?'data-sel':''} data-ess="${n}" style="--ess:${e.cor}"><span class="forja-ess-dot" style="background:${e.cor}"></span><span class="forja-ess-name">${n}</span><span class="forja-ess-desc">${e.d}</span></button>`).join('')}</div>
      </div></details>
      <details class="forja-acc" data-acc="mov"${o('mov')}><summary class="forja-acc-head">Movimentos <span class="forja-acc-val">${movN} selecionado(s)</span></summary><div class="forja-acc-body">
        ${FORJA_MOV.map(m=>`<label style="display:flex;gap:8px;padding:6px 10px;background:var(--bg-card-inner);border:1px solid var(--border);border-radius:6px;margin-bottom:4px;cursor:pointer"><input type="checkbox" data-mov="${m.nome}" ${_forja.movimentos.includes(m.nome)?'checked':''}><div><div style="font-size:12px;color:var(--text)">${m.nome}</div><div style="font-size:10.5px;color:var(--text-dim)">${m.desc}</div></div></label>`).join('')}
      </div></details>
      <details class="forja-acc" data-acc="conj"${o('conj')}><summary class="forja-acc-head">Conjurador <span class="forja-acc-val">Nv ${_forja.nivelConjurador} · Oc ${_forja.ocultismo}</span></summary><div class="forja-acc-body">
        <div class="forja-grid2">
          <div><div class="forja-label" style="margin-top:0">Nível</div><input type="number" min="0" max="20" id="fj-nivel" value="${_forja.nivelConjurador}" class="forja-num"><div style="font-size:10.5px;color:var(--text-dim);margin-top:4px">Lim: 3+nv = ${3+(Number(_forja.nivelConjurador)||0)} pts</div></div>
          <div><div class="forja-label" style="margin-top:0">Ocultismo</div><input type="number" min="0" max="30" id="fj-occ" value="${_forja.ocultismo}" class="forja-num"></div>
        </div>
      </div></details>
    </div>`
  }
  function renderStep1(){
    const c=calc();const gi=c.gi;
    const alvoNome=FORJA_ALVO.find(a=>a.tipo===_forja.alvo)?.nome||'—';
    return `<div class="forja-step" data-active>
      ${_sectCard('exec','Execução',_forja.execucao)}
      ${_sectCard('alc','Alcance',_forja.alcance)}
      ${_sectCard('dur','Duração',_forja.duracao)}
      ${_sectCard('res','Resistência',_forja.resistPericia+' · '+_forja.resistTipo)}
      ${_sectCard('alvo','Alvo / Área',alvoNome)}
    </div>`}
  function _renderStep1_OLD(){
    const c=calc();const gi=c.gi;
    const alvoNome=FORJA_ALVO.find(a=>a.tipo===_forja.alvo)?.nome||'—';
    const op={};
    const o=id=>'';
    return `<div class="forja-step" data-active>
      <details class="forja-acc" data-acc="exec"${o('exec')}><summary class="forja-acc-head">Execução <span class="forja-acc-val">${_forja.execucao}</span></summary><div class="forja-acc-body">
        ${FORJA_EXEC.map(e=>{const s=e.custo>0?'-'+e.custo+' pts':e.custo<0?'+'+Math.abs(e.custo)+' pts':'0 pts';const cor=e.custo>0?'#c94040':e.custo<0?'#50a870':'#7a7a5a';return `<div class="forja-card" ${_forja.execucao===e.nome?'data-sel':''} data-exec="${e.nome}"><div><span class="forja-card-name">${e.nome}</span>${e.desc?'<div class="forja-card-desc">'+e.desc+'</div>':''}</div><span class="forja-badge" style="color:${cor};border-color:${cor}40;background:${cor}10">${s}</span></div>`}).join('')}
      </div></details>
      <details class="forja-acc" data-acc="alc"${o('alc')}><summary class="forja-acc-head">Alcance <span class="forja-acc-val">${_forja.alcance}</span></summary><div class="forja-acc-body">
        <select id="fj-alc" style="width:100%;padding:8px 12px;font-size:13px;background:var(--bg-card-inner);border:1px solid var(--border);color:var(--text);border-radius:6px">${Object.keys(FORJA_ALC).map(k=>`<option ${_forja.alcance===k?'selected':''}>${k}</option>`).join('')}</select>
        <div style="font-size:11px;margin-top:6px;color:${FORJA_ALC[_forja.alcance][gi]==null?'#e05050':'var(--text-dim)'}">${FORJA_ALC[_forja.alcance][gi]==null?'⚠ Indisponível neste grau':'Custo: '+(FORJA_ALC[_forja.alcance][gi]>0?'-'+FORJA_ALC[_forja.alcance][gi]:'+'+Math.abs(FORJA_ALC[_forja.alcance][gi]))+' pts'}</div>
      </div></details>
      <details class="forja-acc" data-acc="dur"${o('dur')}><summary class="forja-acc-head">Duração <span class="forja-acc-val">${_forja.duracao}</span></summary><div class="forja-acc-body">
        ${FORJA_DUR.map(d=>{const v=d.custos[gi];const s=v>0?'-'+v+' pts':v<0?'+'+Math.abs(v)+' pts':'0 pts';const cor=v>0?'#c94040':v<0?'#50a870':'#7a7a5a';return `<div class="forja-card" ${_forja.duracao===d.nome?'data-sel':''} data-dur="${d.nome}"><div><span class="forja-card-name">${d.nome}</span><div class="forja-card-desc">${d.desc}</div></div><span class="forja-badge" style="color:${cor};border-color:${cor}40;background:${cor}10">${s}</span></div>`}).join('')}
      </div></details>
      <details class="forja-acc" data-acc="res"${o('res')}><summary class="forja-acc-head">Resistência <span class="forja-acc-val">${_forja.resistPericia} · ${_forja.resistTipo}</span></summary><div class="forja-acc-body">
        <div class="forja-label" style="margin-top:0">Perícia</div>
        <div class="forja-pills">${FORJA_PERIC.map(p=>`<button class="forja-pill" ${_forja.resistPericia===p?'data-sel':''} data-pe="${p}">${p}</button>`).join('')}</div>
        <div class="forja-label">Tipo</div>
        ${FORJA_RES.map(r=>`<div class="forja-card" ${_forja.resistTipo===r.nome?'data-sel':''} data-res="${r.nome}"><div><span class="forja-card-name">${r.nome}</span><div class="forja-card-desc">${r.desc}</div></div><span class="forja-badge" style="color:${r.custo>0?'#c94040':'#7a7a5a'};border-color:${r.custo>0?'#c9404040':'#7a7a5a40'};background:${r.custo>0?'#c9404010':'#7a7a5a10'}">${r.custo>0?'-'+r.custo+' pts':'0 pts'}</span></div>`).join('')}
      </div></details>
      <details class="forja-acc" data-acc="alvo"${o('alvo')}><summary class="forja-acc-head">Alvo / Área <span class="forja-acc-val">${alvoNome}</span></summary><div class="forja-acc-body">
        ${FORJA_ALVO.map(a=>`<div class="forja-card" ${_forja.alvo===a.tipo?'data-sel':''} data-alvo="${a.tipo}"><div><span class="forja-card-name">${a.nome}</span><div class="forja-card-desc">${a.desc}</div></div></div>`).join('')}
        ${_forja.alvo==='multiplos'?`<div class="forja-info"><div class="forja-label" style="margin-top:0">Quantidade alvos</div><input type="number" min="2" max="50" id="fj-qtd" value="${_forja.qtdAlvos}" class="forja-num"><div style="font-size:11px;margin-top:6px">Mult: <strong style="color:var(--magenta,#84cc16)">+${Math.round((c.mAlvo-1)*100)}%</strong></div></div>`:''}
        ${(_forja.alvo==='area_cubo'||_forja.alvo==='area_cone')?`<div class="forja-info"><div class="forja-label" style="margin-top:0">Tamanho ${_forja.alvo==='area_cubo'?'(raio m)':'(alcance m)'}</div><input type="number" min="3" max="30" step="${_forja.alvo==='area_cone'?1.5:3}" id="fj-tam" value="${_forja.areaTamanho}" class="forja-num"><div style="font-size:11px;margin-top:6px">Mult: <strong style="color:var(--magenta,#84cc16)">+${Math.round((c.mAlvo-1)*100)}%</strong></div></div>`:''}
        ${_forja.alvo==='area_linha'?`<div class="forja-info"><div class="forja-label" style="margin-top:0">Espessura linha (m)</div><input type="number" min="3" max="30" step="3" id="fj-esp" value="${_forja.espessuraLinha}" class="forja-num"></div>`:''}
      </div></details>
    </div>`
  }
  function renderStep2(){
    const c=calc();const gi=c.gi;
    const dcLbl=_forja.danoCuraTipo==='nenhum'?'Nenhum':_forja.danoCuraTipo==='dano'?('Dano '+_forja.danoCuraValor):('Cura '+_forja.danoCuraValor);
    const c2=calc();
    return `<div class="forja-step" data-active>
      ${_sectCard('dc','Dano / Cura',dcLbl)}
      ${_sectCard('bo','Bônus',_forja.efeitosPri.filter(e=>FORJA_BONUS.find(a=>a.nome===e.nome)).length+' selecionado(s)')}
      ${_sectCard('pe','Penalidades',_forja.efeitosPri.filter(e=>FORJA_PEN.find(a=>a.nome===e.nome)).length+' selecionado(s)')}
      ${_sectCard('co','Condições',_forja.efeitosPri.filter(e=>FORJA_COND.find(a=>a.nome===e.nome)).length+' selecionado(s)')}
      ${_sectCard('rc','Recuperar',_forja.efeitosPri.filter(e=>FORJA_REC.find(a=>a.nome===e.nome)).length+' selecionado(s)')}
      ${_forja.efeitosPri.length?_sectCard('sel','Selecionados',c2.pPri+' pts'):''}
      ${_sectCard('sec','Secundários',c2.totSec+' / '+c2.limSec+' pts')}
    </div>`}
  function _renderStep2_OLD(){
    const c=calc();const gi=c.gi;
    const dcLbl=_forja.danoCuraTipo==='nenhum'?'Nenhum':_forja.danoCuraTipo==='dano'?('Dano '+_forja.danoCuraValor):('Cura '+_forja.danoCuraValor);
    const op={};
    const o=id=>'';
    return `<div class="forja-step" data-active>
      <details class="forja-acc" data-acc="dc"${o('dc')}><summary class="forja-acc-head">Dano / Cura <span class="forja-acc-val">${dcLbl}</span></summary><div class="forja-acc-body">
        <div class="forja-pills">${[{id:'nenhum',l:'Nenhum'},{id:'dano',l:'Dano'},{id:'cura',l:'Cura'}].map(t=>`<button class="forja-pill" ${_forja.danoCuraTipo===t.id?'data-sel':''} data-dc="${t.id}">${t.l}</button>`).join('')}</div>
        ${_forja.danoCuraTipo!=='nenhum'?`<div class="forja-info"><div style="font-size:11px;margin-bottom:6px">Ref ${c.grauObj.nome}: <strong style="color:var(--magenta,#84cc16)">${_forja.danoCuraTipo==='dano'?FORJA_DANO_REF[gi]:FORJA_CURA_REF[gi]}</strong> = 15 pts</div><div style="display:flex;gap:8px;align-items:center"><span style="font-size:12px">Valor:</span><input type="number" min="0" max="300" id="fj-dcv" value="${_forja.danoCuraValor}" class="forja-num"><span style="font-size:12px;color:var(--magenta,#84cc16)">= ${c.pDC} pts</span></div>${_forja.danoCuraTipo==='dano'?`<div class="forja-pills" style="margin-top:8px"><button class="forja-pill" ${_forja.danoFisico?'data-sel':''} data-fis="1">Físico</button><button class="forja-pill" ${!_forja.danoFisico?'data-sel':''} data-fis="0">Não-físico (+1/5pts)</button></div>`:''}</div>`:''}
      </div></details>
      ${[['Bônus',FORJA_BONUS,'bo'],['Penalidades',FORJA_PEN,'pe'],['Condições',FORJA_COND,'co'],['Recuperar',FORJA_REC,'rc']].map(([t,arr,k])=>`<details class="forja-acc" data-acc="${k}"${o(k)}><summary class="forja-acc-head">${t} <span class="forja-acc-val">${_forja.efeitosPri.filter(e=>arr.find(a=>a.nome===e.nome)).length} selecionado(s)</span></summary><div class="forja-acc-body"><div class="forja-effs">${arr.map(e=>{const v=e.custos[gi];if(v==null)return '';return `<button class="forja-eff-btn" data-addpri="${e.nome}">${e.nome} <span style="color:var(--text-dim)">(${v})</span></button>`}).filter(Boolean).join('')}</div></div></details>`).join('')}
      ${_forja.efeitosPri.length?`<details class="forja-acc" data-acc="sel"${o('sel')}><summary class="forja-acc-head" style="color:var(--magenta,#84cc16)">Selecionados (${c.pPri} pts)</summary><div class="forja-acc-body"><div class="forja-eff-list">${_forja.efeitosPri.map((e,i)=>`<div class="forja-eff-item"><span style="font-size:13px">${e.nome}</span><span><span style="font-size:11px;color:#c94040;margin-right:8px">${e.custo} pts</span><button class="forja-eff-x" data-delpri="${i}">×</button></span></div>`).join('')}</div></div></details>`:''}
      <details class="forja-acc" data-acc="sec"${o('sec')}><summary class="forja-acc-head">Efeitos Secundários <span class="forja-acc-val">${c.totSec} / ${c.limSec} pts</span></summary><div class="forja-acc-body">
        <div class="forja-info">Cada pt secundário reduz 1 do total. Limite: 1/3 dos principais (${c.limSec} pts).${c.totSec>c.limSec?'<span style="color:#c94040"> Excedeu '+(c.totSec-c.limSec)+' pts.</span>':''}</div>
        <div class="forja-effs">${[...FORJA_BONUS,...FORJA_PEN].map(e=>{const v=e.custos[gi];if(v==null)return '';return `<button class="forja-eff-btn" style="background:transparent;border-style:dashed" data-addsec="${e.nome}">+ ${e.nome} (${v})</button>`}).filter(Boolean).join('')}</div>
        ${_forja.efeitosSec.length?`<div class="forja-eff-list">${_forja.efeitosSec.map((e,i)=>`<div class="forja-eff-item sec"><span style="font-size:13px;color:var(--text-dim)">${e.nome}</span><span><span style="font-size:11px;color:#50a870;margin-right:8px">−${e.custo} pts</span><button class="forja-eff-x" data-delsec="${i}">×</button></span></div>`).join('')}</div>`:''}
      </div></details>
    </div>`
  }
  function renderStep3(c,bg,ok,exc,dt,dtFinal,semRes){
    return `<div class="forja-step" data-active>
      <div class="forja-resumo"><div class="forja-resumo-top"></div>
        <h2>${_forja.nome||'Ritual sem nome'}</h2>
        <div style="text-align:center"><span class="forja-resumo-tag">${_forja.essencia} · ${c.grauObj.nome}${c.grauObj.PE!=null?' ('+c.grauObj.PE+' '+(_forja.natureza==='mental'?'PF':'PE')+')':''}</span></div>
        <div class="forja-resumo-row">
          ${[['Execução',_forja.execucao],['Alcance',_forja.alcance],['Duração',_forja.duracao],['Resistência',_forja.resistPericia+' / '+_forja.resistTipo],[(_forja.alvo||'').startsWith('area')?'Área':'Alvo',FORJA_ALVO.find(a=>a.tipo===_forja.alvo)?.nome||_forja.alvo],['Movimentos',_forja.movimentos.join(', ')||'—']].map(([k,v])=>`<div><div class="k">${k}</div><div class="v">${v}</div></div>`).join('')}
        </div>
        ${_forja.descricao?`<div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border)"><div class="k" style="font-size:9.5px;color:var(--text-dim);letter-spacing:.2em;margin-bottom:5px">DESCRIÇÃO</div><p style="margin:0;font-size:12px;line-height:1.5;color:var(--text-secondary);font-style:italic">${(_forja.descricao||'').replace(/</g,'&lt;')}</p></div>`:''}
        ${_forja.efeitosPri.length||_forja.danoCuraTipo!=='nenhum'?`<div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border)"><div style="font-size:9.5px;color:var(--text-dim);letter-spacing:.2em;margin-bottom:5px">EFEITOS PRINCIPAIS</div>${_forja.danoCuraTipo!=='nenhum'&&_forja.danoCuraValor>0?`<div style="font-size:12px"><span style="color:var(--magenta,#84cc16)">+</span> ${_forja.danoCuraTipo==='dano'?'Dano':'Cura'} ${_forja.danoCuraValor}${_forja.danoCuraTipo==='dano'?(_forja.danoFisico?' (físico)':' (não-físico)'):''}</div>`:''}${_forja.efeitosPri.map(e=>`<div style="font-size:12px"><span style="color:var(--magenta,#84cc16)">+</span> ${e.nome}</div>`).join('')}</div>`:''}
        <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border);display:flex;justify-content:space-between"><span style="font-size:11px;color:var(--text-dim)">TOTAL</span><span style="font-size:18px;font-weight:700;color:${ok?'#7fff72':exc?'#e05050':'#e0b840'}">${c.total}/${c.MAX}${ok?' ✓':exc?' EXCEDIDO':''}</span></div>
      </div>
      <div class="forja-status-mark" data-st="${ok?'ok':exc?'err':'warn'}" aria-hidden="true">
        ${ok?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':exc?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'}
      </div>
      <div class="forja-info" style="border-color:${c.total<=c.lim?'#7fff7240':'#e0505040'}"><div style="display:flex;justify-content:space-between"><span><strong>Limite Conjurador (Nv ${_forja.nivelConjurador}):</strong> ${c.lim} pts</span><span style="color:${c.total<=c.lim?'#7fff72':'#e05050'};font-weight:700">${c.total}/${c.lim}</span></div><div style="margin-top:6px;font-size:10.5px;color:${c.total<=c.lim?'#7fff72':'#e05050'}">${c.total<=c.lim?'✓ Pode aprender/conjurar.':'⚠ Excede em '+(c.total-c.lim)+' pts'}</div></div>
      ${!semRes?`<div class="forja-info" style="border-color:${dt.cor}40"><div style="display:flex;justify-content:space-between"><span><strong>DT Resist. (${dt.cat})</strong></span><span style="font-size:24px;color:${dt.cor};font-weight:900">${dtFinal}</span></div><div style="font-size:10.5px;margin-top:4px">Base ${dt.base} + Ocultismo ${Number(_forja.ocultismo)||0}</div></div>`:''}
      <div class="forja-label">Detalhamento</div>
      <div style="background:var(--bg-card-inner);border:1px solid var(--border);padding:10px 12px;border-radius:6px">${c.bd.map(b=>`<div class="forja-detail-row${b.sub?' sub':''}"><span style="${b.err?'color:#c94040':''}">${b.l}</span><span style="color:${b.v>0?'#c94040':b.v<0?'#50a870':'#7a7a5a'}">${b.extra||(b.v>0?b.v+' pts':b.v<0?b.v+' pts':'—')}</span></div>`).join('')}<div class="forja-detail-tot"><span>TOTAL</span><span style="color:${ok?'#7fff72':exc?'#e05050':'#e0b840'}">${c.total} pts</span></div></div>
      <div class="forja-label">Descrição (flavor)</div>
      <textarea id="fj-desc" placeholder="Aparência, sensação, intenção do ritual..." style="width:100%;min-height:90px;padding:10px;font-size:13px;background:var(--bg-card-inner);border:1px solid var(--border);color:var(--text);border-radius:6px;resize:vertical">${(_forja.descricao||'').replace(/</g,'&lt;')}</textarea>
    </div>`
  }
  function ensureForjaSub(){
    let ov=document.getElementById('forja-sub-overlay');
    if(!ov){ov=document.createElement('div');ov.id='forja-sub-overlay';ov.className='forja-sub-overlay';ov.innerHTML='<div class="forja-sub-modal"><div class="forja-sub-head"><button class="forja-sub-back" id="fs-back" type="button">←</button><span class="forja-sub-title" id="fs-title"></span><button class="forja-sub-close" id="fs-close" type="button">×</button></div><div class="forja-sub-body" id="fs-body"></div></div>';document.body.appendChild(ov);ov.addEventListener('click',e=>{if(e.target===ov)closeForjaSub()});ov.querySelector('#fs-back').onclick=closeForjaSub;ov.querySelector('#fs-close').onclick=closeForjaSub}
    return ov;
  }
  window._openForjaSub=function(id){return openForjaSub(id)};
  function openForjaSub(id){
    _forja.subSect=id;
    const ov=ensureForjaSub();
    const TITLES={ident:'Identidade',ess:'Essência',mov:'Movimentos',conj:'Conjurador',exec:'Execução',alc:'Alcance',dur:'Duração',res:'Resistência',alvo:'Alvo / Área',dc:'Dano / Cura',bo:'Bônus',pe:'Penalidades',co:'Condições',rc:'Recuperar',sel:'Selecionados',sec:'Secundários',preview:'Pré-visualização'};
    document.getElementById('fs-title').textContent=TITLES[id]||'Seção';
    renderForjaSubBody(id);
    ov.classList.add('open');
    ov.classList.toggle('forja-sub-preview',id==='preview');
    document.body.classList.add('forja-sub-open');
    document.body.classList.toggle('forja-sub-preview-open',id==='preview');
  }
  function closeForjaSub(){
    const ov=document.getElementById('forja-sub-overlay');
    if(ov){ov.classList.remove('open');ov.classList.remove('forja-sub-preview')}
    document.body.classList.remove('forja-sub-open','forja-sub-preview-open');
    _forja.subSect=null;
    render();
  }
  function renderForjaSubBody(id){
    const body=document.getElementById('fs-body');if(!body)return;
    const c=calc();const gi=c.gi;
    let html='';
    if(id==='ident'){html=`
      <div class="forja-label" style="margin-top:0">Nome</div>
      <input id="fj-nome" placeholder="Ex: Véu de Cinzas" value="${(_forja.nome).replace(/"/g,'&quot;')}" style="width:100%;padding:8px 10px;font-size:14px;background:var(--bg-card-inner);border:1px solid var(--border);color:var(--text);border-radius:6px">
      <div class="forja-label">Grau</div>
      <div class="forja-pills" id="fj-graus">${FORJA_GRAUS.map(g=>`<button class="forja-pill" ${_forja.grauId===g.id?'data-sel':''} data-g="${g.id}">${g.nome}</button>`).join('')}</div>
      <div class="forja-info" style="margin-top:8px">${_forja.grauId==='aprimoramento'?'Aprimoramento: 27 pts base. +3 pré-req, +3 Afinidade.':'Limite: 30 pontos. Custa '+(FORJA_GRAUS.find(g=>g.id===_forja.grauId)?.PE||0)+' PE.'}</div>
      ${_forja.grauId==='aprimoramento'?`<label style="display:block;font-size:12px;margin-top:6px"><input type="checkbox" id="fj-prereq" ${_forja.apPreReq?'checked':''}> Pré-requisito (+3)</label><label style="display:block;font-size:12px"><input type="checkbox" id="fj-afin" ${_forja.apAfinidade?'checked':''}> Afinidade (+3)</label>`:''}`;}
    else if(id==='ess'){html=`<div class="forja-ess-grid">${Object.entries({Alba:{cor:'#a8e6a0',d:'Pureza da vida'},Carmin:{cor:'#c9372a',d:'Sacrifício e carne'},Kaos:{cor:'#c060e8',d:'Desordem primordial'},Lumen:{cor:'#f0c030',d:'Conhecimento'},Perene:{cor:'#40e0b0',d:'Tempo parado'},Ruina:{cor:'#888070',d:'Tempo em desgaste'}}).map(([n,e])=>`<button type="button" class="forja-ess-card" ${_forja.essencia===n?'data-sel':''} data-ess="${n}" style="--ess:${e.cor}"><span class="forja-ess-dot" style="background:${e.cor}"></span><span class="forja-ess-name">${n}</span><span class="forja-ess-desc">${e.d}</span></button>`).join('')}</div>`;}
    else if(id==='mov'){html=FORJA_MOV.map(m=>`<label style="display:flex;gap:8px;padding:6px 10px;background:var(--bg-card-inner);border:1px solid var(--border);border-radius:6px;margin-bottom:4px;cursor:pointer"><input type="checkbox" data-mov="${m.nome}" ${_forja.movimentos.includes(m.nome)?'checked':''}><div><div style="font-size:12px;color:var(--text)">${m.nome}</div><div style="font-size:10.5px;color:var(--text-dim)">${m.desc}</div></div></label>`).join('');}
    else if(id==='conj'){html=`<div class="forja-grid2">
        <div><div class="forja-label" style="margin-top:0">Nível</div><input type="number" min="0" max="20" id="fj-nivel" value="${_forja.nivelConjurador}" class="forja-num"><div style="font-size:10.5px;color:var(--text-dim);margin-top:4px">Lim: 3+nv = ${3+(Number(_forja.nivelConjurador)||0)} pts</div></div>
        <div><div class="forja-label" style="margin-top:0">Ocultismo</div><input type="number" min="0" max="30" id="fj-occ" value="${_forja.ocultismo}" class="forja-num"></div>
      </div>`;}
    else if(id==='exec'){html=FORJA_EXEC.map(e=>{const s=e.custo>0?'-'+e.custo+' pts':e.custo<0?'+'+Math.abs(e.custo)+' pts':'0 pts';const cor=e.custo>0?'#c94040':e.custo<0?'#50a870':'#7a7a5a';return `<div class="forja-card" ${_forja.execucao===e.nome?'data-sel':''} data-exec="${e.nome}"><div><span class="forja-card-name">${e.nome}</span>${e.desc?'<div class="forja-card-desc">'+e.desc+'</div>':''}</div><span class="forja-badge" style="color:${cor};border-color:${cor}40;background:${cor}10">${s}</span></div>`}).join('');}
    else if(id==='alc'){html=`<select id="fj-alc" style="width:100%;padding:8px 12px;font-size:13px;background:var(--bg-card-inner);border:1px solid var(--border);color:var(--text);border-radius:6px">${Object.keys(FORJA_ALC).map(k=>`<option ${_forja.alcance===k?'selected':''}>${k}</option>`).join('')}</select><div style="font-size:11px;margin-top:6px;color:${FORJA_ALC[_forja.alcance][gi]==null?'#e05050':'var(--text-dim)'}">${FORJA_ALC[_forja.alcance][gi]==null?'⚠ Indisponível neste grau':'Custo: '+(FORJA_ALC[_forja.alcance][gi]>0?'-'+FORJA_ALC[_forja.alcance][gi]:'+'+Math.abs(FORJA_ALC[_forja.alcance][gi]))+' pts'}</div>`;}
    else if(id==='dur'){html=FORJA_DUR.map(d=>{const v=d.custos[gi];const s=v>0?'-'+v+' pts':v<0?'+'+Math.abs(v)+' pts':'0 pts';const cor=v>0?'#c94040':v<0?'#50a870':'#7a7a5a';return `<div class="forja-card" ${_forja.duracao===d.nome?'data-sel':''} data-dur="${d.nome}"><div><span class="forja-card-name">${d.nome}</span><div class="forja-card-desc">${d.desc}</div></div><span class="forja-badge" style="color:${cor};border-color:${cor}40;background:${cor}10">${s}</span></div>`}).join('');}
    else if(id==='res'){html=`<div class="forja-label" style="margin-top:0">Perícia</div><div class="forja-pills">${FORJA_PERIC.map(p=>`<button class="forja-pill" ${_forja.resistPericia===p?'data-sel':''} data-pe="${p}">${p}</button>`).join('')}</div><div class="forja-label">Tipo</div>${FORJA_RES.map(r=>`<div class="forja-card" ${_forja.resistTipo===r.nome?'data-sel':''} data-res="${r.nome}"><div><span class="forja-card-name">${r.nome}</span><div class="forja-card-desc">${r.desc}</div></div><span class="forja-badge" style="color:${r.custo>0?'#c94040':'#7a7a5a'};border-color:${r.custo>0?'#c9404040':'#7a7a5a40'};background:${r.custo>0?'#c9404010':'#7a7a5a10'}">${r.custo>0?'-'+r.custo+' pts':'0 pts'}</span></div>`).join('')}`;}
    else if(id==='alvo'){html=FORJA_ALVO.map(a=>`<div class="forja-card" ${_forja.alvo===a.tipo?'data-sel':''} data-alvo="${a.tipo}"><div><span class="forja-card-name">${a.nome}</span><div class="forja-card-desc">${a.desc}</div></div></div>`).join('');
      if(_forja.alvo==='multiplos')html+=`<div class="forja-info" style="margin-top:8px"><div class="forja-label" style="margin-top:0">Quantidade alvos</div><input type="number" min="2" max="50" id="fj-qtd" value="${_forja.qtdAlvos}" class="forja-num"><div style="font-size:11px;margin-top:6px">Mult: <strong style="color:var(--magenta)">+${Math.round((c.mAlvo-1)*100)}%</strong></div></div>`;
      if(_forja.alvo==='area_cubo'||_forja.alvo==='area_cone')html+=`<div class="forja-info" style="margin-top:8px"><div class="forja-label" style="margin-top:0">Tamanho ${_forja.alvo==='area_cubo'?'(raio m)':'(alcance m)'}</div><input type="number" min="3" max="30" step="${_forja.alvo==='area_cone'?1.5:3}" id="fj-tam" value="${_forja.areaTamanho}" class="forja-num"><div style="font-size:11px;margin-top:6px">Mult: <strong style="color:var(--magenta)">+${Math.round((c.mAlvo-1)*100)}%</strong></div></div>`;
      if(_forja.alvo==='area_linha')html+=`<div class="forja-info" style="margin-top:8px"><div class="forja-label" style="margin-top:0">Espessura linha (m)</div><input type="number" min="3" max="30" step="3" id="fj-esp" value="${_forja.espessuraLinha}" class="forja-num"></div>`;}
    else if(id==='dc'){html=`<div class="forja-pills">${[{id:'nenhum',l:'Nenhum'},{id:'dano',l:'Dano'},{id:'cura',l:'Cura'}].map(t=>`<button class="forja-pill" ${_forja.danoCuraTipo===t.id?'data-sel':''} data-dc="${t.id}">${t.l}</button>`).join('')}</div>${_forja.danoCuraTipo!=='nenhum'?`<div class="forja-info" style="margin-top:10px"><div style="font-size:11px;margin-bottom:6px">Ref ${c.grauObj.nome}: <strong style="color:var(--magenta)">${_forja.danoCuraTipo==='dano'?FORJA_DANO_REF[gi]:FORJA_CURA_REF[gi]}</strong> = 15 pts</div><div style="display:flex;gap:8px;align-items:center"><span style="font-size:12px">Valor:</span><input type="number" min="0" max="300" id="fj-dcv" value="${_forja.danoCuraValor}" class="forja-num"><span style="font-size:12px;color:var(--magenta)">= ${c.pDC} pts</span></div>${_forja.danoCuraTipo==='dano'?`<div class="forja-pills" style="margin-top:8px"><button class="forja-pill" ${_forja.danoFisico?'data-sel':''} data-fis="1">Físico</button><button class="forja-pill" ${!_forja.danoFisico?'data-sel':''} data-fis="0">Não-físico (+1/5pts)</button></div>`:''}</div>`:''}`;}
    else if(id==='bo'||id==='pe'||id==='co'||id==='rc'){const arr=id==='bo'?FORJA_BONUS:id==='pe'?FORJA_PEN:id==='co'?FORJA_COND:FORJA_REC;html=`<div class="forja-effs">${arr.map(e=>{const v=e.custos[gi];if(v==null)return '';return `<button class="forja-eff-btn" data-addpri="${e.nome}">${e.nome} <span style="color:var(--text-dim)">(${v})</span></button>`}).filter(Boolean).join('')}</div>${_forja.efeitosPri.filter(e=>arr.find(a=>a.nome===e.nome)).length?`<div class="forja-section" style="margin-top:12px">Selecionados nesta categoria</div>${_forja.efeitosPri.map((e,i)=>arr.find(a=>a.nome===e.nome)?`<div class="forja-eff-item"><span style="font-size:13px">${e.nome}</span><span><span style="font-size:11px;color:#c94040;margin-right:8px">${e.custo} pts</span><button class="forja-eff-x" data-delpri="${i}">×</button></span></div>`:'').join('')}`:''}`;}
    else if(id==='sel'){html=_forja.efeitosPri.length?`<div class="forja-eff-list">${_forja.efeitosPri.map((e,i)=>`<div class="forja-eff-item"><span style="font-size:13px">${e.nome}</span><span><span style="font-size:11px;color:#c94040;margin-right:8px">${e.custo} pts</span><button class="forja-eff-x" data-delpri="${i}">×</button></span></div>`).join('')}</div>`:'<div class="forja-info">Nenhum efeito selecionado.</div>';}
    else if(id==='sec'){html=`<div class="forja-info">Cada pt secundário reduz 1 do total. Limite: 1/3 dos principais (${c.limSec} pts).${c.totSec>c.limSec?'<span style="color:#c94040"> Excedeu '+(c.totSec-c.limSec)+' pts.</span>':''}</div><div class="forja-effs">${[...FORJA_BONUS,...FORJA_PEN].map(e=>{const v=e.custos[gi];if(v==null)return '';return `<button class="forja-eff-btn" style="background:transparent;border-style:dashed" data-addsec="${e.nome}">+ ${e.nome} (${v})</button>`}).filter(Boolean).join('')}${_forja.efeitosSec.length?`<div class="forja-section" style="margin-top:12px">Selecionados</div>${_forja.efeitosSec.map((e,i)=>`<div class="forja-eff-item sec"><span style="font-size:13px;color:var(--text-dim)">${e.nome}</span><span><span style="font-size:11px;color:#50a870;margin-right:8px">−${e.custo} pts</span><button class="forja-eff-x" data-delsec="${i}">×</button></span></div>`).join('')}`:''}</div>`;}
    else if(id==='preview'){
      const ESS_BG={Alba:'linear-gradient(165deg in oklch,#1a3a1f 0%,#4a9954 45%,#a8e6a0 100%)',Carmin:'linear-gradient(165deg in oklch,#1a0202 0%,#4a0a08 35%,#8b1414 70%,#c91a14 100%)',Kaos:'linear-gradient(165deg in oklch,#2a0a3a 0%,#6b1a8a 45%,#c060e8 100%)',Lumen:'linear-gradient(165deg in oklch,#3a2808 0%,#9a7820 50%,#f0c030 100%)',Perene:'linear-gradient(165deg in oklch,#0a2a2a 0%,#1f6a6a 45%,#40e0b0 100%)',Ruina:'linear-gradient(165deg in oklch,#171717 0%,#4a4438 50%,#888070 100%)'};
      const bg=_forja.customColor||ESS_BG[_forja.essencia]||ESS_BG.Carmin;
      const grauN=String(c.grauObj.nome).match(/^(\d)/)?.[1]||'1';
      const nome=_forja.nome||'Ritual sem nome';
      html=`<div class="forja-preview-stage"><div class="forja-preview-card feit-badge" style="--bg:${bg}"><div class="feit-badge-bg" style="background:${bg}"></div><div class="feit-badge-overlay"></div><div class="feit-badge-logo"><div class="feit-badge-logo-ico"></div></div><div class="feit-badge-stamp"><svg viewBox="0 0 64 64"><circle cx="32" cy="34" r="25" fill="rgba(0,0,0,.28)"/><circle cx="32" cy="32" r="25" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.55)" stroke-width="1.1"/><ellipse cx="32" cy="22" rx="14" ry="3.5" fill="rgba(255,255,255,.22)"/><text x="32" y="38" text-anchor="middle" font-size="20" font-weight="800" fill="rgba(255,255,255,.95)" font-family="Inter,system-ui,sans-serif">${grauN}º</text></svg></div><div class="feit-badge-spacer"></div><div class="feit-badge-name">${nome.toLowerCase()}</div><div class="feit-badge-tags"><span class="feit-badge-tag">${(_forja.essencia||'—').toUpperCase()}</span><span class="feit-badge-tag">${grauN}º GRAU</span></div><hr class="feit-badge-divider"/><div class="feit-badge-info"><div class="feit-badge-info-l">EXEC: ${(_forja.execucao||'—').toUpperCase()}<br>ALC: ${(_forja.alcance||'—').toUpperCase()}<br>DUR: ${(_forja.duracao||'—').toUpperCase()}</div><div class="feit-badge-info-r">${c.total}/${c.MAX} pts</div></div></div><div class="forja-preview-meta"><span class="forja-preview-k">TOTAL</span><span class="forja-preview-v" style="color:${ok?'#7fff72':exc?'#e05050':'#e0b840'}">${c.total}/${c.MAX} ${ok?'✓':exc?'EXCEDIDO':''}</span></div></div>`;}
    body.innerHTML=html;
    bindForjaSub(id);
  }
  function bindForjaSub(id){
    const body=document.getElementById('fs-body');if(!body)return;
    const $$=s=>body.querySelectorAll(s),$=s=>body.querySelector(s);
    const refresh=()=>renderForjaSubBody(id);
    if(id==='ident'){
      const n=$('#fj-nome');if(n)n.oninput=e=>{_forja.nome=e.target.value};
      $$('#fj-graus .forja-pill').forEach(p=>p.onclick=()=>{_forja.grauId=p.dataset.g;refresh()});
      const pr=$('#fj-prereq');if(pr)pr.onchange=e=>{_forja.apPreReq=e.target.checked};
      const af=$('#fj-afin');if(af)af.onchange=e=>{_forja.apAfinidade=e.target.checked};
    }else if(id==='ess'){$$('[data-ess]').forEach(c=>c.onclick=()=>{_forja.essencia=c.dataset.ess;refresh()})}
    else if(id==='mov'){$$('[data-mov]').forEach(c=>c.onchange=e=>{const m=e.target.dataset.mov;if(e.target.checked)_forja.movimentos=[..._forja.movimentos,m];else _forja.movimentos=_forja.movimentos.filter(x=>x!==m)})}
    else if(id==='conj'){const nv=$('#fj-nivel');if(nv)nv.oninput=e=>{_forja.nivelConjurador=Math.min(20,Math.max(0,Number(e.target.value)));refresh()};const oc=$('#fj-occ');if(oc)oc.oninput=e=>{_forja.ocultismo=Number(e.target.value)}}
    else if(id==='exec'){$$('[data-exec]').forEach(c=>c.onclick=()=>{_forja.execucao=c.dataset.exec;refresh()})}
    else if(id==='alc'){const al=$('#fj-alc');if(al)al.onchange=e=>{_forja.alcance=e.target.value;refresh()}}
    else if(id==='dur'){$$('[data-dur]').forEach(c=>c.onclick=()=>{_forja.duracao=c.dataset.dur;refresh()})}
    else if(id==='res'){$$('[data-pe]').forEach(c=>c.onclick=()=>{_forja.resistPericia=c.dataset.pe;refresh()});$$('[data-res]').forEach(c=>c.onclick=()=>{_forja.resistTipo=c.dataset.res;refresh()})}
    else if(id==='alvo'){$$('[data-alvo]').forEach(c=>c.onclick=()=>{_forja.alvo=c.dataset.alvo;refresh()});const q=$('#fj-qtd');if(q)q.oninput=e=>{_forja.qtdAlvos=Number(e.target.value);refresh()};const t=$('#fj-tam');if(t)t.oninput=e=>{_forja.areaTamanho=Number(e.target.value);refresh()};const es=$('#fj-esp');if(es)es.oninput=e=>{_forja.espessuraLinha=Number(e.target.value);refresh()}}
    else if(id==='dc'){$$('[data-dc]').forEach(c=>c.onclick=()=>{_forja.danoCuraTipo=c.dataset.dc;refresh()});const dcv=$('#fj-dcv');if(dcv)dcv.oninput=e=>{_forja.danoCuraValor=Number(e.target.value);refresh()};$$('[data-fis]').forEach(c=>c.onclick=()=>{_forja.danoFisico=c.dataset.fis==='1';refresh()})}
    else if(id==='bo'||id==='pe'||id==='co'||id==='rc'){const c=calc();const gi=c.gi;const arr=id==='bo'?FORJA_BONUS:id==='pe'?FORJA_PEN:id==='co'?FORJA_COND:FORJA_REC;$$('[data-addpri]').forEach(b=>b.onclick=()=>{const n=b.dataset.addpri;const it=arr.find(e=>e.nome===n);if(it&&it.custos[gi]!=null){_forja.efeitosPri.push({nome:n,custo:it.custos[gi]});refresh()}});$$('[data-delpri]').forEach(b=>b.onclick=()=>{_forja.efeitosPri.splice(+b.dataset.delpri,1);refresh()})}
    else if(id==='sel'){$$('[data-delpri]').forEach(b=>b.onclick=()=>{_forja.efeitosPri.splice(+b.dataset.delpri,1);refresh()})}
    else if(id==='sec'){const c=calc();const gi=c.gi;$$('[data-addsec]').forEach(b=>b.onclick=()=>{const n=b.dataset.addsec;const it=[...FORJA_BONUS,...FORJA_PEN].find(e=>e.nome===n);if(it&&it.custos[gi]!=null){_forja.efeitosSec.push({nome:n,custo:it.custos[gi]});refresh()}});$$('[data-delsec]').forEach(b=>b.onclick=()=>{_forja.efeitosSec.splice(+b.dataset.delsec,1);refresh()})}
  }
  function bindStep(){
    const $=s=>body.querySelector(s),$$=s=>body.querySelectorAll(s);
    if(_forja.step===3){
      const d=$('#fj-desc');if(d)d.oninput=e=>{_forja.descricao=e.target.value};
    }
    if(_forja.step===0){
      const n=$('#fj-nome');if(n)n.oninput=e=>{_forja.nome=e.target.value;render()};
      $$('#fj-natureza .forja-pill').forEach(p=>p.onclick=()=>{_forja.natureza=p.dataset.nat;render()});
      $$('#fj-graus .forja-pill').forEach(p=>p.onclick=()=>{_forja.grauId=p.dataset.g;render()});
      const pr=$('#fj-prereq');if(pr)pr.onchange=e=>{_forja.apPreReq=e.target.checked;render()};
      const af=$('#fj-afin');if(af)af.onchange=e=>{_forja.apAfinidade=e.target.checked;render()};
      $$('[data-ess]').forEach(c=>c.onclick=()=>{_forja.essencia=c.dataset.ess;render()});
      $$('[data-mov]').forEach(c=>c.onchange=e=>{const m=e.target.dataset.mov;if(e.target.checked)_forja.movimentos=[..._forja.movimentos,m];else _forja.movimentos=_forja.movimentos.filter(x=>x!==m)});
      const nv=$('#fj-nivel');if(nv)nv.oninput=e=>{_forja.nivelConjurador=Math.min(20,Math.max(0,Number(e.target.value)));render()};
      const oc=$('#fj-occ');if(oc)oc.oninput=e=>{_forja.ocultismo=Number(e.target.value);render()};
    }else if(_forja.step===1){
      $$('[data-exec]').forEach(c=>c.onclick=()=>{_forja.execucao=c.dataset.exec;render()});
      const al=$('#fj-alc');if(al)al.onchange=e=>{_forja.alcance=e.target.value;render()};
      $$('[data-dur]').forEach(c=>c.onclick=()=>{_forja.duracao=c.dataset.dur;render()});
      $$('[data-pe]').forEach(c=>c.onclick=()=>{_forja.resistPericia=c.dataset.pe;render()});
      $$('[data-res]').forEach(c=>c.onclick=()=>{_forja.resistTipo=c.dataset.res;render()});
      $$('[data-alvo]').forEach(c=>c.onclick=()=>{_forja.alvo=c.dataset.alvo;render()});
      const q=$('#fj-qtd');if(q)q.oninput=e=>{_forja.qtdAlvos=Number(e.target.value);render()};
      const t=$('#fj-tam');if(t)t.oninput=e=>{_forja.areaTamanho=Number(e.target.value);render()};
      const es=$('#fj-esp');if(es)es.oninput=e=>{_forja.espessuraLinha=Number(e.target.value);render()};
    }else if(_forja.step===2){
      $$('[data-dc]').forEach(c=>c.onclick=()=>{_forja.danoCuraTipo=c.dataset.dc;render()});
      const dcv=$('#fj-dcv');if(dcv)dcv.oninput=e=>{_forja.danoCuraValor=Number(e.target.value);render()};
      $$('[data-fis]').forEach(c=>c.onclick=()=>{_forja.danoFisico=c.dataset.fis==='1';render()});
      const c=calc();const gi=c.gi;
      $$('[data-addpri]').forEach(b=>b.onclick=()=>{const n=b.dataset.addpri;const tab=[...FORJA_BONUS,...FORJA_PEN,...FORJA_COND,...FORJA_REC];const it=tab.find(e=>e.nome===n);if(it&&it.custos[gi]!=null){_forja.efeitosPri.push({nome:n,custo:it.custos[gi]});render()}});
      $$('[data-addsec]').forEach(b=>b.onclick=()=>{const n=b.dataset.addsec;const it=[...FORJA_BONUS,...FORJA_PEN].find(e=>e.nome===n);if(it&&it.custos[gi]!=null){_forja.efeitosSec.push({nome:n,custo:it.custos[gi]});render()}});
      $$('[data-delpri]').forEach(b=>b.onclick=()=>{_forja.efeitosPri.splice(+b.dataset.delpri,1);render()});
      $$('[data-delsec]').forEach(b=>b.onclick=()=>{_forja.efeitosSec.splice(+b.dataset.delsec,1);render()});
    }
  }
  const ov=document.getElementById('modal-overlay');ov.classList.add('open');
  const mEl=ov.querySelector('.modal');if(mEl)mEl.classList.add('forja-active');
  render();
  setTimeout(()=>body.querySelector('#fj-nome')?.focus(),120);
}
window.openFeiticoModal=openFeiticoModal;

/* ─── BLOCO 2: window.saveFeitico ─── */
window.saveFeitico=function(){
  if(!_forja.nome.trim()){toast&&toast('Nome obrigatório','error');return}
  fichaData.feiticos=fichaData.feiticos||[];
  const grauObj=FORJA_GRAUS.find(g=>g.id===_forja.grauId)||FORJA_GRAUS[0];
  const data={
    name:_forja.nome,desc:_forja.descricao,school:_forja.essencia,
    circle:grauObj.idx===4?0:grauObj.idx+1,
    grauId:_forja.grauId,movimentos:_forja.movimentos,execucao:_forja.execucao,
    alcance:_forja.alcance,duracao:_forja.duracao,resistTipo:_forja.resistTipo,
    resistPericia:_forja.resistPericia,alvo:_forja.alvo,qtdAlvos:_forja.qtdAlvos,
    areaTamanho:_forja.areaTamanho,espessuraLinha:_forja.espessuraLinha,
    efeitosPri:_forja.efeitosPri,efeitosSec:_forja.efeitosSec,
    danoCuraTipo:_forja.danoCuraTipo,danoCuraValor:_forja.danoCuraValor,
    danoFisico:_forja.danoFisico,apPreReq:_forja.apPreReq,apAfinidade:_forja.apAfinidade,
    ocultismo:_forja.ocultismo,nivelConjurador:_forja.nivelConjurador,
    customColor:_forja.customColor,natureza:_forja.natureza
  };
  if(_editingFeitId){
    const f=fichaData.feiticos.find(x=>x.id===_editingFeitId);
    if(f)Object.assign(f,data);
  }else{
    fichaData.feiticos.push({id:'f'+Date.now().toString(36),...data});
  }
  _editingFeitId=null;_forja={};
  renderFeitTab();autosaveDebounced&&autosaveDebounced();closeModal();
  toast&&toast('Ritual forjado','success');
};
