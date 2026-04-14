// Sticky header shadow
const hdr=document.getElementById('hdr');
const bttBtn=document.getElementById('btt');
const _yrEl=document.getElementById('ft-year');if(_yrEl)_yrEl.textContent=new Date().getFullYear();
window.addEventListener('scroll',()=>{
  hdr.classList.toggle('scrolled',window.scrollY>10);
  bttBtn.classList.toggle('show',window.scrollY>600);
},{passive:true});
bttBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

// Publications — Google Scholar via SerpApi (24 h localStorage cache)
(function(){
  // ── Author config: Google Scholar profile IDs ──
  // publications.json is rebuilt daily by the GitHub Action in .github/workflows/fetch-publications.yml
  // To add/remove authors, update both this list and .github/scripts/fetch-pubs.js
  const AUTHORS=[
    {id:'7XmmVJQAAAAJ', name:'Gyamfi, S.',        slug:'gyamfi'},
    {id:'lWjktyYAAAAJ', name:'Diawuo, F.A.',      slug:'diawuo'},
    {id:'uelQVKAAAAAJ', name:'Batinge, B.',       slug:'batinge'},
    {id:'t_vJFsUAAAAJ', name:'Mensah, G.S.',      slug:'mensah'},
    {id:'EV3PmdEAAAAJ', name:'Antwi-Agyei, P.',  slug:'antwi-agyei'},
    {id:'K8VpdiEAAAAJ', name:'Derkyi, N.S.A.',    slug:'derkyi'},
    {id:'gl-DhpEAAAAJ', name:'Nyantakyi, E.K.',   slug:'nyantakyi'},
    {id:'JqhwKYkAAAAJ', name:'Attiogbe, F.',      slug:'attiogbe'},
    {id:'XkBOIsYAAAAJ', name:'Okyereh, S.A.',     slug:'okyereh'},
    {id:'Kt6MnSAAAAAJ', name:'Ofosu, E.A.',       slug:'ofosu'},
    {id:'qwmXbKIAAAAJ', name:'Kabo-bah, A.T.',    slug:'kabo-bah'},
    {id:'cGq_c64AAAAJ', name:'Asuamah, E.Y.',     slug:'asuamah'},
  ];

  const grid=document.getElementById('pubGrid');
  const sidebar=document.querySelector('.pub-sidebar');
  if(!grid||!sidebar)return;

  const staticHTML=grid.innerHTML;
  grid.innerHTML='<div class="pub-loading"><span class="pub-spinner"></span>Loading publications…</div>';

  // Fetch pre-built publications.json (updated daily by GitHub Action)
  fetch('./publications.json?v='+Date.now())
    .then(r=>r.ok?r.json():Promise.reject(r.status))
    .then(d=>{
      if(!d.articles||!d.articles.length){showStatic();return;}
      renderArticles(d.articles);
    })
    .catch(()=>showStatic());

  function renderArticles(articles){
    const years=[...new Set(articles.map(a=>a.year).filter(Boolean))].sort((a,b)=>b-a);
    const themeSet=new Set();
    grid.innerHTML='';

    articles.forEach(a=>{
      const theme=classifyTheme(a.title,a.publication);
      themeSet.add(theme);
      const themeSlug=theme.toLowerCase().replace(/[\s&]+/g,'-').replace(/[^a-z0-9-]/g,'');
      const journal=a.publication?a.publication.split(',')[0].trim():'';
      const card=document.createElement('div');
      card.className='pub-card';
      card.dataset.year=a.year;
      card.dataset.authors=(a.slugs||[a.slug]).join(',');
      card.dataset.theme=themeSlug;
      card.innerHTML=
        '<div class="pub-card-top">'+
          '<span class="pub-card-year">'+esc(a.year)+'</span>'+
          '<span class="pub-card-theme">'+esc(theme)+'</span>'+
        '</div>'+
        '<p class="pub-card-title">'+esc(a.title)+'</p>'+
        (a.authors?'<p class="pub-card-authors">'+esc(a.authors)+'</p>':'')+
        (journal?'<p class="pub-card-journal"><em>'+esc(journal)+'</em></p>':'')+
        (a.citations?'<p class="pub-card-citations">'+a.citations+' citation'+(a.citations!==1?'s':'')+'</p>':'')+
        (a.link?'<a href="'+esc(a.link)+'" target="_blank" rel="noopener" class="pub-card-link">View →</a>':'')+
        '';
      grid.appendChild(card);
    });

    // Pagination: 10 cards per page
    const PAGE_SIZE=10;
    let currentPage=1;
    const allCards=[...grid.querySelectorAll('.pub-card')];
    const pager=document.createElement('div');
    pager.className='pub-pagination';
    grid.appendChild(pager);
    function renderPage(page,filtered){
      const cards=filtered||allCards;
      const total=cards.length;
      const totalPages=Math.max(1,Math.ceil(total/PAGE_SIZE));
      currentPage=Math.min(Math.max(1,page),totalPages);
      const start=(currentPage-1)*PAGE_SIZE;
      allCards.forEach(c=>c.style.display='none');
      cards.slice(start,start+PAGE_SIZE).forEach(c=>c.style.display='');
      pager.innerHTML=
        '<button class="pub-pg-btn" id="pubPrev"'+(currentPage<=1?' disabled':'')+'>&#8592; Prev</button>'+
        '<span class="pub-pg-info">Page '+currentPage+' of '+totalPages+'</span>'+
        '<button class="pub-pg-btn" id="pubNext"'+(currentPage>=totalPages?' disabled':'')+'>Next &#8594;</button>';
      pager.style.display=totalPages<=1?'none':'';
      pager.querySelector('#pubPrev').addEventListener('click',()=>{renderPage(currentPage-1,cards);grid.scrollIntoView({behavior:'smooth',block:'start'});});
      pager.querySelector('#pubNext').addEventListener('click',()=>{renderPage(currentPage+1,cards);grid.scrollIntoView({behavior:'smooth',block:'start'});});
      let msg=grid.querySelector('.pub-no-results');
      if(!total){if(!msg){msg=document.createElement('p');msg.className='pub-no-results';msg.textContent='No publications match the selected filters.';grid.insertBefore(msg,pager);}}
      else if(msg)msg.remove();
    }
    renderPage(1);

    const note=document.createElement('p');
    note.className='pub-api-note';note.textContent='Source: Google Scholar';
    grid.appendChild(note);

    rebuildSidebar(years,[...themeSet].sort());
    attachFilters(renderPage);
  }

  function classifyTheme(title,pub){
    const t=(title+' '+pub).toLowerCase();
    if(/solar|pv|photovoltaic|biomass|renewable|wind|hydrogen|fuel.cell|energy.system|mini.grid|battery|storage|generat|electr|power.plant/.test(t))return'Energy Systems';
    if(/poverty|access|rural|household|cooking|off.grid|productive.use|energy.service/.test(t))return'Energy Access';
    if(/climate|adaptation|emission|carbon|greenhouse|ndc|warming|mitigation/.test(t))return'Climate Change';
    if(/water|sanitation|wash|irrigation|flood|hydro|groundwater|wastewater/.test(t))return'Water Resources';
    if(/education|training|learning|capacity|curriculum|pedagogy|student|competen/.test(t))return'Education & Training';
    if(/model|transit|scenario|assessment|forecast|planning|nexus|optimis|optimiz/.test(t))return'Energy Modelling';
    return'Energy & Environment';
  }

  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

  function rebuildSidebar(years,themes){
    sidebar.innerHTML=
      '<div class="pub-filter-hd"><span>Filter</span><button class="pub-reset" id="pubReset">Reset</button></div>'+
      '<div class="pub-filter-group"><span class="pub-filter-lbl">Year</span>'+
        '<select class="pub-select" id="pubYearSelect">'+
          '<option value="">All years</option>'+
          years.map(y=>'<option value="'+y+'">'+y+'</option>').join('')+
        '</select>'+
      '</div>'+
      '<div class="pub-filter-group"><span class="pub-filter-lbl">Author</span>'+
        '<select class="pub-select" id="pubAuthorSelect">'+
          '<option value="">All authors</option>'+
          AUTHORS.map(a=>'<option value="'+a.slug+'">'+esc(a.name)+'</option>').join('')+
        '</select>'+
      '</div>'+
      '<div class="pub-filter-group"><span class="pub-filter-lbl">Thematic Area</span>'+
        themes.map(t=>{const s=t.toLowerCase().replace(/[\s&]+/g,'-').replace(/[^a-z0-9-]/g,'');return'<label><input type="checkbox" name="pub-theme" value="'+s+'"> '+esc(t)+'</label>';}).join('')+
      '</div>';
  }

  function attachFilters(renderPage){
    function apply(){
      const allC=[...grid.querySelectorAll('.pub-card')];
      const year=(sidebar.querySelector('#pubYearSelect')||{}).value||'';
      const author=(sidebar.querySelector('#pubAuthorSelect')||{}).value||'';
      const themes=[...document.querySelectorAll('input[name="pub-theme"]:checked')].map(el=>el.value);
      const filtering=year||author||themes.length;
      const filtered=filtering?allC.filter(card=>
        (!year||card.dataset.year===year)&&
        (!author||card.dataset.authors.split(',').includes(author))&&
        (!themes.length||themes.includes(card.dataset.theme))
      ):allC;
      renderPage(1,filtered);
    }
    sidebar.addEventListener('change',e=>{
      if(e.target.matches('select')||e.target.matches('input[type=checkbox]'))apply();
    });
    sidebar.addEventListener('click',e=>{
      if(e.target.matches('#pubReset')){
        const ys=sidebar.querySelector('#pubYearSelect');if(ys)ys.value='';
        const as=sidebar.querySelector('#pubAuthorSelect');if(as)as.value='';
        sidebar.querySelectorAll('input[type=checkbox]').forEach(cb=>cb.checked=false);
        apply();
      }
    });
  }

  function showStatic(){
    grid.innerHTML=staticHTML;
    function apply(){
      const cards=[...grid.querySelectorAll('.pub-card')];
      const year=(sidebar.querySelector('#pubYearSelect')||{}).value||'';
      const author=(sidebar.querySelector('#pubAuthorSelect')||{}).value||'';
      const themes=[...document.querySelectorAll('input[name="pub-theme"]:checked')].map(el=>el.value);
      let vis=0;
      cards.forEach(card=>{
        const show=(!year||card.dataset.year===year)&&
                   (!author||(card.dataset.authors||'').split(',').includes(author))&&
                   (!themes.length||themes.includes(card.dataset.theme));
        card.style.display=show?'':'none';if(show)vis++;
      });
      let msg=grid.querySelector('.pub-no-results');
      if(!vis){if(!msg){msg=document.createElement('p');msg.className='pub-no-results';msg.textContent='No publications match the selected filters.';grid.appendChild(msg);}}
      else if(msg)msg.remove();
    }
    sidebar.addEventListener('change',e=>{if(e.target.matches('select')||e.target.matches('input[type=checkbox]'))apply();});
    sidebar.addEventListener('click',e=>{
      if(e.target.matches('#pubReset')){
        const ys=sidebar.querySelector('#pubYearSelect');if(ys)ys.value='';
        const as=sidebar.querySelector('#pubAuthorSelect');if(as)as.value='';
        sidebar.querySelectorAll('input[type=checkbox]').forEach(cb=>cb.checked=false);
        apply();
      }
    });
  }
})();

// Mobile menu
const mbtn=document.getElementById('mbtn'),navLinks=document.getElementById('navLinks');
mbtn.addEventListener('click',()=>{mbtn.classList.toggle('active');navLinks.classList.toggle('open')});
navLinks.querySelectorAll('a').forEach(l=>l.addEventListener('click',()=>{mbtn.classList.remove('active');navLinks.classList.remove('open')}));

// Scroll reveal
const revealObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');revealObs.unobserve(e.target)}});
},{threshold:.08,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.rv').forEach(el=>revealObs.observe(el));

// Animated counters
const counterObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el=e.target,target=parseInt(el.dataset.counter),duration=1600,start=performance.now();
      const tick=now=>{
        const progress=Math.min((now-start)/duration,1);
        const eased=1-Math.pow(1-progress,4);
        el.textContent=Math.floor(eased*target).toLocaleString();
        if(progress<1)requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    }
  });
},{threshold:.5});
document.querySelectorAll('[data-counter]').forEach(el=>counterObs.observe(el));

// Image fade-in on load
document.querySelectorAll('.r-img').forEach(el=>{
  const bg=getComputedStyle(el).backgroundImage;
  if(bg&&bg!=='none'){
    const url=bg.match(/url\(["']?(.+?)["']?\)/);
    if(url&&url[1]){
      const img=new Image();
      img.onload=()=>el.classList.add('loaded');
      img.src=url[1];
    }
  }
});

// ========== HERO SLIDER ==========
if(document.getElementById('heroSlider'))(function(){
  const track=document.getElementById('sliderTrack');
  if(!track) return;
  const dots=document.querySelectorAll('.slider-dot');
  const progress=document.getElementById('sliderProgress');
  const total=document.querySelectorAll('.slide').length;
  let current=0;
  let autoTimer=null;
  const autoDelay=6000;
  let progressStart=0;
  let rafId=null;

  function goTo(i,skipAuto){
    current=((i%total)+total)%total;
    track.style.transform=`translateX(-${current*100}%)`;
    dots.forEach((d,idx)=>{d.classList.toggle('active',idx===current);d.setAttribute('aria-pressed',idx===current?'true':'false')});
    const _ann=document.getElementById('sliderAnnounce');
    if(_ann)_ann.textContent='Slide '+(current+1)+' of '+slides.length;
    if(!skipAuto) resetAuto();
  }

  function next(){goTo(current+1)}
  function prev(){goTo(current-1)}

  function resetAuto(){
    clearTimeout(autoTimer);
    cancelAnimationFrame(rafId);
    progressStart=performance.now();
    tickProgress();
    autoTimer=setTimeout(next,autoDelay);
  }

  function tickProgress(){
    const elapsed=performance.now()-progressStart;
    const pct=Math.min(elapsed/autoDelay*100,100);
    progress.style.width=pct+'%';
    if(pct<100) rafId=requestAnimationFrame(tickProgress);
  }

  document.getElementById('nextSlide').addEventListener('click',next);
  document.getElementById('prevSlide').addEventListener('click',prev);
  dots.forEach(d=>d.addEventListener('click',()=>goTo(parseInt(d.dataset.slide))));

  // Touch/swipe support
  let touchX=0;
  const slider=document.getElementById('heroSlider');
  slider.addEventListener('touchstart',e=>{touchX=e.touches[0].clientX},{passive:true});
  slider.addEventListener('touchend',e=>{
    const diff=touchX-e.changedTouches[0].clientX;
    if(Math.abs(diff)>50){diff>0?next():prev()}
  },{passive:true});

  // Pause on hover
  slider.addEventListener('mouseenter',()=>{clearTimeout(autoTimer);cancelAnimationFrame(rafId)});
  slider.addEventListener('mouseleave',resetAuto);

  // Keyboard
  document.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight') next();
    else if(e.key==='ArrowLeft') prev();
  });

  // Init
  resetAuto();
})();

// Project tabs
document.querySelectorAll('.proj-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.proj-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.proj-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('ptab-'+tab.dataset.ptab).classList.add('active');
  });
});

// Project modal
(function(){
  const overlay=document.getElementById('pmOverlay');
  if(!overlay) return;
  const hero=document.getElementById('pmHero');
  const badge=document.getElementById('pmBadge');
  const title=document.getElementById('pmTitle');
  const funded=document.getElementById('pmFunded');
  const desc=document.getElementById('pmDesc');
  const meta=document.getElementById('pmMeta');
  const objDiv=document.getElementById('pmObj');
  const partnersDiv=document.getElementById('pmPartners');
  const closeBtn=document.getElementById('pmClose');

  function openModal(card){
    // Pull data from the card
    const h3=card.querySelector('h3');
    const p=card.querySelector('.pj-body p');
    const badgeEl=card.querySelector('.pj-badge');
    const partnersEl=card.querySelector('.pj-partners');
    const img=card.querySelector('.pj-img');

    // Hero image
    const bgImg=img?getComputedStyle(img).backgroundImage:'';
    const hasImg=img&&img.classList.contains('has-photo');
    if(hasImg&&bgImg&&bgImg!=='none'){
      hero.style.backgroundImage=bgImg;
      hero.className='pm-hero';
    } else {
      hero.style.backgroundImage='';
      hero.className='pm-hero no-img';
    }

    // Basic fields
    const status=card.dataset.status||'active';
    badge.textContent=status.charAt(0).toUpperCase()+status.slice(1);
    badge.className='pm-hero-badge'+(status==='ended'?' ended':'');
    title.textContent=h3?h3.textContent:'';
    const funderVal=card.dataset.funder||'';
    funded.textContent=funderVal?'Funded by: '+funderVal:'';
    funded.style.display=funderVal?'':'none';
    desc.textContent=p?p.textContent:'';

    // Meta grid
    const cat=card.dataset.cat||'';
    const duration=card.dataset.duration||'';
    const amount=card.dataset.amount||'';
    const pi=card.dataset.pi||'';
    let metaHTML='';
    if(cat) metaHTML+=`<div class="pm-meta-item"><div class="pm-meta-label">Category</div><div class="pm-meta-val">${cat}</div></div>`;
    if(duration) metaHTML+=`<div class="pm-meta-item"><div class="pm-meta-label">Duration</div><div class="pm-meta-val">${duration}</div></div>`;
    if(status) metaHTML+=`<div class="pm-meta-item"><div class="pm-meta-label">Status</div><div class="pm-meta-val">${status==='ended'?'Completed':'Active'}</div></div>`;
    if(amount) metaHTML+=`<div class="pm-meta-item"><div class="pm-meta-label">Funding Amount</div><div class="pm-meta-val">${amount}</div></div>`;
    if(pi) metaHTML+=`<div class="pm-meta-item"><div class="pm-meta-label">Principal Investigator</div><div class="pm-meta-val">${pi}</div></div>`;
    meta.innerHTML=metaHTML;

    // Objectives
    const objStr=card.dataset.objectives||'';
    if(objStr){
      const items=objStr.split('|').filter(s=>s.trim());
      objDiv.innerHTML='<h4>Key Objectives</h4><ul>'+items.map(o=>`<li>${o.trim()}</li>`).join('')+'</ul>';
      objDiv.style.display='';
    } else {
      objDiv.innerHTML='';
      objDiv.style.display='none';
    }

    // Partners
    const partnerText=partnersEl?partnersEl.textContent.replace('Partners:','').trim():'';
    if(partnerText){
      const tags=partnerText.split(',').map(s=>s.trim()).filter(Boolean);
      partnersDiv.innerHTML='<h4>Partners &amp; Collaborators</h4><div class="pm-partners-list">'+tags.map(t=>`<span class="pm-partner-tag">${t}</span>`).join('')+'</div>';
      partnersDiv.style.display='';
    } else {
      partnersDiv.innerHTML='';
      partnersDiv.style.display='none';
    }

    overlay.classList.add('show');
    document.body.style.overflow='hidden';
  }

  function closeModal(){
    overlay.classList.remove('show');
    document.body.style.overflow='';
  }

  // Attach click to all project cards
  document.querySelectorAll('.pj-card').forEach(card=>{
    card.addEventListener('click',e=>{
      // Don't open modal if clicking in edit mode on editable content
            openModal(card);
    });
  });

  closeBtn.addEventListener('click',closeModal);
  overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('show'))closeModal()});

  // Expose for dynamically added cards
  window.attachProjectModal=function(card){
    card.addEventListener('click',e=>{
            openModal(card);
    });
  };
})();

// Project "Show more" functionality
(function(){
  document.querySelectorAll('.proj-panel').forEach(panel=>{
    const grid=panel.querySelector('.proj-grid');
    if(!grid) return;

    const cards=Array.from(grid.querySelectorAll('.pj-card'));
    if(cards.length<=4) return;

    cards.slice(4).forEach(card=>card.classList.add('pj-extra'));

    const btn=document.createElement('button');
    btn.className='proj-more-btn';
    btn.textContent='Show more projects';
    btn.addEventListener('click',e=>{
      e.preventDefault();
      panel.classList.toggle('show-all');
      btn.textContent=panel.classList.contains('show-all')?'Show less':'Show more projects';
    });

    grid.parentNode.insertBefore(btn,grid.nextSibling);
  });
})();

// News modal
(function(){
  const overlay=document.getElementById('nmOverlay');
  if(!overlay) return;
  const dateEl=document.getElementById('nmDate');
  const titleEl=document.getElementById('nmTitle');
  const bodyEl=document.getElementById('nmBody');
  const closeBtn=document.getElementById('nmClose');
  const heroEl=overlay.querySelector('.nm-hero');

  function openNews(el){
    const isFeatured=el.classList.contains('n-featured');
    const title=isFeatured?el.querySelector('h3'):el.querySelector('h4');
    const date=el.querySelector('.nf-date');
    const summary=isFeatured?el.querySelector('.nf-body p'):el.querySelector('p');
    const content=el.dataset.content||'';

    dateEl.textContent=date?date.textContent:'';
    titleEl.textContent=title?title.textContent:'';

    // Build body from data-content (pipe-separated paragraphs) or fall back to summary
    if(content){
      const paras=content.split('|').filter(s=>s.trim());
      bodyEl.innerHTML=paras.map(p=>`<p>${p.trim()}</p>`).join('');
    } else {
      bodyEl.innerHTML=`<p>${summary?summary.textContent:''}</p>`;
    }

    // Hero image: check featured .nf-img or sidebar .ni-thumb
    let heroBg='';
    if(isFeatured){
      const nfImg=el.querySelector('.nf-img');
      if(nfImg) heroBg=nfImg.style.backgroundImage||getComputedStyle(nfImg).backgroundImage;
    } else {
      const thumb=el.querySelector('.ni-thumb');
      if(thumb) heroBg=thumb.style.backgroundImage||getComputedStyle(thumb).backgroundImage;
    }
    if(heroBg&&heroBg!=='none'&&!heroBg.includes('linear-gradient')){
      heroEl.style.backgroundImage=heroBg;
      heroEl.classList.remove('no-img');
    } else {
      heroEl.style.backgroundImage='';
      heroEl.classList.add('no-img');
    }

    overlay.classList.add('show');
    document.body.style.overflow='hidden';
  }

  function closeNews(){
    overlay.classList.remove('show');
    document.body.style.overflow='';
  }

  function attachNews(el){
    el.addEventListener('click',()=>{
            openNews(el);
    });
  }

  document.querySelectorAll('.n-featured,.n-item').forEach(attachNews);

  closeBtn.addEventListener('click',closeNews);
  overlay.addEventListener('click',e=>{if(e.target===overlay)closeNews()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('show'))closeNews()});

  window.attachNewsModal=attachNews;
})();

// Programme modal
(function(){
  const overlay=document.getElementById('prgOverlay');
  if(!overlay) return;
  const badgeEl=document.getElementById('prgBadge');
  const titleEl=document.getElementById('prgTitle');
  const subEl=document.getElementById('prgSub');
  const metaRowEl=document.getElementById('prgMeta');
  const overviewEl=document.getElementById('prgOverview');
  const outcomesEl=document.getElementById('prgOutcomes');
  const reqsEl=document.getElementById('prgReqs');
  const contactEl=document.getElementById('prgContact');
  const closeBtn=document.getElementById('prgClose');

  function openPrgModal(item){
    const progType=item.dataset.progType||'Programme';
    const duration=item.dataset.progDuration||'';
    const mode=item.dataset.progMode||'';
    const overview=item.dataset.progOverview||'';
    const outcomes=item.dataset.progOutcomes||'';
    const requirements=item.dataset.progRequirements||'';
    const contact=item.dataset.progContact||'';
    const name=item.querySelector('.pi-name');
    const sub=item.querySelector('.pi-sub');

    badgeEl.textContent=progType;
    titleEl.textContent=name?name.textContent:'';
    subEl.textContent=sub?sub.textContent:'';

    // Meta row with type, duration, mode
    metaRowEl.innerHTML='';
    if(progType){
      metaRowEl.innerHTML+=`<div class="prg-meta-chip"><div class="prg-meta-chip-label">Type</div><div class="prg-meta-chip-val">${progType}</div></div>`;
    }
    if(duration){
      metaRowEl.innerHTML+=`<div class="prg-meta-chip"><div class="prg-meta-chip-label">Duration</div><div class="prg-meta-chip-val">${duration}</div></div>`;
    }
    if(mode){
      metaRowEl.innerHTML+=`<div class="prg-meta-chip"><div class="prg-meta-chip-label">Delivery Mode</div><div class="prg-meta-chip-val">${mode}</div></div>`;
    }

    // Overview section
    overviewEl.innerHTML='';
    if(overview){
      overviewEl.innerHTML=`<h4>Programme Overview</h4><p>${overview}</p>`;
    }

    // Outcomes section (pipe-separated list)
    outcomesEl.innerHTML='';
    if(outcomes){
      const outcomesList=outcomes.split('|').map(o=>o.trim()).filter(o=>o);
      if(outcomesList.length){
        outcomesEl.innerHTML='<h4>Learning Outcomes</h4><ul>'+outcomesList.map(o=>`<li>${o}</li>`).join('')+'</ul>';
      }
    }

    // Requirements section
    reqsEl.innerHTML='';
    if(requirements){
      reqsEl.innerHTML=`<h4>Entry Requirements</h4><p>${requirements}</p>`;
    }

    // Contact/apply section
    contactEl.innerHTML='';
    if(contact){
      contactEl.innerHTML=`<h4>How to Apply</h4><p>${contact}</p>`;
    }

    overlay.classList.add('show');
    document.body.style.overflow='hidden';
  }

  function closePrgModal(){
    overlay.classList.remove('show');
    document.body.style.overflow='';
  }

  document.querySelectorAll('.prog-item').forEach(item=>{
    item.addEventListener('click',()=>{
            openPrgModal(item);
    });
  });

  closeBtn.addEventListener('click',closePrgModal);
  overlay.addEventListener('click',e=>{if(e.target===overlay)closePrgModal()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('show'))closePrgModal()});
})();

// Programme tabs
document.querySelectorAll('.prog-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.prog-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.prog-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-'+tab.dataset.tab).classList.add('active');
  });
});

// Contact form
function handleContactSubmit(e){
  e.preventDefault();
  const btn=e.target.querySelector('.btn-submit');
  const errEl=document.getElementById('cf-error');
  const fname=document.getElementById('cf-fname').value.trim();
  const lname=document.getElementById('cf-lname').value.trim();
  const email=document.getElementById('cf-email').value.trim();
  const interest=document.getElementById('cf-interest').value;
  const message=document.getElementById('cf-message').value.trim();
  const emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errors=[];
  if(!fname)errors.push('First name is required.');
  if(!lname)errors.push('Last name is required.');
  if(!email)errors.push('Email address is required.');
  else if(!emailRe.test(email))errors.push('Please enter a valid email address.');
  if(errors.length){errEl.textContent=errors[0];errEl.style.display='block';errEl.focus();return;}
  errEl.style.display='none';
  btn.textContent='Sending\u2026';
  btn.disabled=true;
  const formData=new FormData();
  formData.append('entry.838682423',fname);
  formData.append('entry.1877072439',lname);
  formData.append('entry.1398459791',email);
  formData.append('entry.418709247',interest);
  formData.append('entry.1838161238',message);
  fetch('https://docs.google.com/forms/d/e/1FAIpQLSfyyei7g-azhdCF8k37XIzArTjlJqEz51kUTpOaPqAJvg40Bw/formResponse',{
    method:'POST',body:formData,mode:'no-cors'
  }).then(()=>{
    btn.textContent='Message Sent!';
    btn.style.background='var(--green)';
    e.target.reset();
    setTimeout(()=>{btn.textContent='Send Message';btn.style.background='';btn.disabled=false},4000);
  }).catch(()=>{
    btn.textContent='Send Message';
    btn.disabled=false;
    window.location.href='mailto:rcees@uenr.edu.gh?subject='+encodeURIComponent('RCEES Inquiry - '+interest)+'&body='+encodeURIComponent('Name: '+fname+' '+lname+'\nEmail: '+email+'\nInterest: '+interest+'\n\n'+message);
  });
}
function handleNewsletterSubmit(e){
  e.preventDefault();
  const btn=e.target.querySelector('button');
  const email=document.getElementById('nl-email').value.trim();
  btn.textContent='Subscribing...';
  btn.disabled=true;
  const formData=new FormData();
  formData.append('entry.1587073086',email);
  fetch('https://docs.google.com/forms/d/e/1FAIpQLSdjQj6eLxhdzVBviJRhB8zvSCNKfLwh2juox4uQ492_aAFp2Q/formResponse',{
    method:'POST',body:formData,mode:'no-cors'
  }).then(()=>{
    btn.textContent='Subscribed!';
    btn.style.background='var(--green)';
    e.target.reset();
    setTimeout(()=>{btn.textContent='Subscribe';btn.style.background='';btn.disabled=false},4000);
  }).catch(()=>{
    btn.textContent='Subscribe';
    btn.disabled=false;
    window.location.href='mailto:rcees@uenr.edu.gh?subject='+encodeURIComponent('Newsletter Subscription')+'&body='+encodeURIComponent('Please subscribe: '+email);
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',function(e){
    e.preventDefault();
    const t=document.querySelector(this.getAttribute('href'));
    if(t)t.scrollIntoView({behavior:'smooth',block:'start'});
  });
});

// News pagination
(function(){
  const pager=document.getElementById('newsPager');
  if(!pager) return;
  const sidebar=document.querySelector('.n-sidebar');
  if(!pager||!sidebar) return;
  const items=Array.from(sidebar.querySelectorAll('.n-item'));
  const PAGE_SIZE=4;
  let currentPage=1;
  function renderPage(page){
    const totalPages=Math.max(1,Math.ceil(items.length/PAGE_SIZE));
    currentPage=Math.min(Math.max(1,page),totalPages);
    const start=(currentPage-1)*PAGE_SIZE;
    items.forEach((el,i)=>{
      el.style.display=(i>=start&&i<start+PAGE_SIZE)?'':'none';
    });
    pager.innerHTML=
      '<button class="pub-pg-btn" id="newsPrev"'+(currentPage<=1?' disabled':'')+'>&#8592; Prev</button>'+
      '<span class="pub-pg-info">Page '+currentPage+' of '+totalPages+'</span>'+
      '<button class="pub-pg-btn" id="newsNext"'+(currentPage>=totalPages?' disabled':'')+'>Next &#8594;</button>';
    pager.style.display=totalPages<=1?'none':'';
    pager.querySelector('#newsPrev').addEventListener('click',()=>renderPage(currentPage-1));
    pager.querySelector('#newsNext').addEventListener('click',()=>renderPage(currentPage+1));
  }
  renderPage(1);
})();


// Gallery pagination
(function(){
  const PAGE_SIZE=4;
  let currentPage=1;
  let currentFilter='all';
  const pager=document.getElementById('galPager');
  if(!pager) return;
  const allItems=Array.from(document.querySelectorAll('.gal-item'));
  function getFiltered(){
    return allItems.filter(item=>currentFilter==='all'||item.dataset.galCat===currentFilter);
  }
  function renderGalleryPage(page){
    const filtered=getFiltered();
    const totalPages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));
    currentPage=Math.min(Math.max(1,page),totalPages);
    const start=(currentPage-1)*PAGE_SIZE;
    allItems.forEach(item=>{item.style.display='none';});
    filtered.slice(start,start+PAGE_SIZE).forEach(item=>{item.style.display='';});
    if(pager){
      pager.innerHTML=
        '<button class="pub-pg-btn" id="galPrev"'+(currentPage<=1?' disabled':'')+'>&#8592; Prev</button>'+
        '<span class="pub-pg-info">Page '+currentPage+' of '+totalPages+'</span>'+
        '<button class="pub-pg-btn" id="galNext"'+(currentPage>=totalPages?' disabled':'')+'>Next &#8594;</button>';
      pager.style.display=totalPages<=1?'none':'';
      pager.querySelector('#galPrev').addEventListener('click',()=>renderGalleryPage(currentPage-1));
      pager.querySelector('#galNext').addEventListener('click',()=>renderGalleryPage(currentPage+1));
    }
  }
  document.querySelectorAll('.gal-filter').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.gal-filter').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter=tab.dataset.gal;
      renderGalleryPage(1);
    });
  });
  renderGalleryPage(1);
})();

// Gallery lightbox
(function(){
  const glOverlay=document.getElementById('glOverlay');
  if(!glOverlay) return;
  const glImg=document.getElementById('glImg');
  const glTitle=document.getElementById('glTitle');
  const glSub=document.getElementById('glSub');
  const glClose=document.getElementById('glClose');
  const glPrev=document.getElementById('glPrev');
  const glNext=document.getElementById('glNext');
  let currentLightboxIdx=0;
  let visibleItems=[];
  
  function getVisibleGalleryItems(){
    return Array.from(document.querySelectorAll('.gal-item')).filter(item=>item.style.display!=='none');
  }
  
  function openLightbox(item){
    visibleItems=getVisibleGalleryItems();
    currentLightboxIdx=visibleItems.indexOf(item);
    showLightboxImage(currentLightboxIdx);
    glOverlay.classList.add('show');
  }
  
  function showLightboxImage(idx){
    if(idx<0||idx>=visibleItems.length) return;
    const item=visibleItems[idx];
    const img=item.querySelector('img');
    const caption=item.querySelector('.gal-caption');
    glImg.src=img.src;
    glImg.alt=img.alt;
    glTitle.textContent=caption.querySelector('span')?.textContent||'';
    glSub.textContent=caption.querySelector('small')?.textContent||'';
    currentLightboxIdx=idx;
  }
  
  function closeLightbox(){
    glOverlay.classList.remove('show');
  }
  
  document.querySelectorAll('.gal-item').forEach(item=>{
    item.addEventListener('click',()=>openLightbox(item));
  });
  
  glClose.addEventListener('click',closeLightbox);
  glOverlay.addEventListener('click',e=>{
    if(e.target===glOverlay) closeLightbox();
  });
  
  glPrev.addEventListener('click',()=>{
    let newIdx=currentLightboxIdx-1;
    if(newIdx<0) newIdx=visibleItems.length-1;
    showLightboxImage(newIdx);
  });
  
  glNext.addEventListener('click',()=>{
    let newIdx=currentLightboxIdx+1;
    if(newIdx>=visibleItems.length) newIdx=0;
    showLightboxImage(newIdx);
  });
  
  document.addEventListener('keydown',e=>{
    if(!glOverlay.classList.contains('show')) return;
    if(e.key==='Escape') closeLightbox();
    if(e.key==='ArrowLeft') glPrev.click();
    if(e.key==='ArrowRight') glNext.click();
  });
})();

// Team pagination
const TEAM_PER_PAGE=8;
function paginateGroup(group){
  const cards=group.querySelectorAll('.team-grid .t-card');
  const total=cards.length;
  const pages=Math.ceil(total/TEAM_PER_PAGE)||1;
  const pager=group.querySelector('.team-pager');
  if(!pager) return;
  const page=parseInt(group.dataset.teamPage||'0');
  cards.forEach((c,i)=>{
    if(i>=page*TEAM_PER_PAGE&&i<(page+1)*TEAM_PER_PAGE){c.classList.remove('tp-hidden');c.classList.remove('vis');void c.offsetWidth;c.classList.add('vis')}
    else c.classList.add('tp-hidden');
  });
  // dots
  const dotsEl=pager.querySelector('.team-dots');
  dotsEl.innerHTML='';
  if(pages>1){
    for(let d=0;d<pages;d++){
      const dot=document.createElement('button');
      dot.className='team-dot'+(d===page?' active':'');
      dot.setAttribute('aria-label','Page '+(d+1));
      dot.addEventListener('click',()=>{group.dataset.teamPage=d;paginateGroup(group)});
      dotsEl.appendChild(dot);
    }
  }
  // arrows
  const prev=pager.querySelector('.tp-prev');
  const next=pager.querySelector('.tp-next');
  prev.disabled=page===0;
  next.disabled=page>=pages-1;
  // hide pager entirely if only one page
  pager.style.display=pages<=1?'none':'flex';
}
document.querySelectorAll('.tg').forEach(g=>{g.dataset.teamPage='0';paginateGroup(g)});
document.querySelectorAll('.tg .tp-prev').forEach(btn=>{
  btn.addEventListener('click',()=>{const g=btn.closest('.tg');let p=parseInt(g.dataset.teamPage||'0');if(p>0){g.dataset.teamPage=p-1;paginateGroup(g)}});
});
document.querySelectorAll('.tg .tp-next').forEach(btn=>{
  btn.addEventListener('click',()=>{const g=btn.closest('.tg');const cards=g.querySelectorAll('.team-grid .t-card');const pages=Math.ceil(cards.length/TEAM_PER_PAGE);let p=parseInt(g.dataset.teamPage||'0');if(p<pages-1){g.dataset.teamPage=p+1;paginateGroup(g)}});
});

// Team card expand on click
document.querySelectorAll('.t-card').forEach(card=>{
  card.addEventListener('click',()=>{
        card.classList.toggle('expanded');
  });
});

// Programme cards — Option A: inject pi-body wrapper and View details CTA
(function(){
  document.querySelectorAll('.prog-item').forEach(item=>{
    const textDiv=Array.from(item.children).find(c=>!c.classList.contains('pi-icon')&&c.tagName!=='svg'&&!c.classList.contains('pi-body'));
    if(!textDiv) return;
    textDiv.classList.add('pi-body');
    // Remove stray arrow sibling
    const arrow=item.querySelector('.pi-arrow');
    if(arrow) arrow.remove();
    // Add CTA
    const cta=document.createElement('div');
    cta.className='pi-cta';
    cta.innerHTML='View details <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    textDiv.appendChild(cta);
  });
})();

// Team category tabs
document.querySelectorAll('.team-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.team-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.tg').forEach(g=>g.classList.remove('active'));
    tab.classList.add('active');
    const panel=document.querySelector(`.tg[data-group="${tab.dataset.team}"]`);
    if(panel){
      panel.classList.add('active');
      panel.dataset.teamPage='0';
      paginateGroup(panel);
    }
  });
});

// ========== IMAGE CROPPER ==========
(function(){
  const overlay=document.getElementById('cropOverlay');
  if(!overlay) return;
  const cropImg=document.getElementById('cropImg');
  const cropBox=document.getElementById('cropBox');
  const cropContainer=document.getElementById('cropContainer');
  const btnApply=document.getElementById('cropApply');
  const btnCancel=document.getElementById('cropCancel');
  const btnReset=document.getElementById('cropReset');

  let cropCallback=null;
  let imgNatW=0,imgNatH=0,imgDispW=0,imgDispH=0;
  let box={x:0,y:0,w:0,h:0};
  let dragging=null,dragStart={mx:0,my:0,bx:0,by:0,bw:0,bh:0};

  function openCropper(dataUrl,callback){
    cropCallback=callback;
    cropImg.src=dataUrl;
    overlay.classList.add('show');
    cropImg.onload=function(){
      imgNatW=cropImg.naturalWidth;
      imgNatH=cropImg.naturalHeight;
      imgDispW=cropImg.offsetWidth;
      imgDispH=cropImg.offsetHeight;
      // Default crop: 80% centered
      const margin=0.1;
      box={x:Math.round(imgDispW*margin),y:Math.round(imgDispH*margin),w:Math.round(imgDispW*(1-2*margin)),h:Math.round(imgDispH*(1-2*margin))};
      updateBox();
    };
  }

  function updateBox(){
    cropBox.style.left=box.x+'px';
    cropBox.style.top=box.y+'px';
    cropBox.style.width=box.w+'px';
    cropBox.style.height=box.h+'px';
  }

  function clamp(val,min,max){return Math.max(min,Math.min(max,val))}

  function onPointerDown(e){
    e.preventDefault();
    const handle=e.target.dataset.handle;
    const rect=cropContainer.getBoundingClientRect();
    const mx=e.clientX-rect.left;
    const my=e.clientY-rect.top;
    dragStart={mx,my,bx:box.x,by:box.y,bw:box.w,bh:box.h};
    if(handle){
      dragging=handle;
    } else if(e.target===cropBox){
      dragging='move';
    } else return;
    document.addEventListener('pointermove',onPointerMove);
    document.addEventListener('pointerup',onPointerUp);
  }

  function onPointerMove(e){
    if(!dragging) return;
    const rect=cropContainer.getBoundingClientRect();
    const mx=e.clientX-rect.left;
    const my=e.clientY-rect.top;
    const dx=mx-dragStart.mx;
    const dy=my-dragStart.my;
    const minSize=30;

    if(dragging==='move'){
      box.x=clamp(dragStart.bx+dx,0,imgDispW-box.w);
      box.y=clamp(dragStart.by+dy,0,imgDispH-box.h);
    } else {
      let nx=dragStart.bx,ny=dragStart.by,nw=dragStart.bw,nh=dragStart.bh;
      if(dragging.includes('l')){nx=clamp(dragStart.bx+dx,0,dragStart.bx+dragStart.bw-minSize);nw=dragStart.bw-(nx-dragStart.bx)}
      if(dragging.includes('r')){nw=clamp(dragStart.bw+dx,minSize,imgDispW-dragStart.bx)}
      if(dragging.includes('t')){ny=clamp(dragStart.by+dy,0,dragStart.by+dragStart.bh-minSize);nh=dragStart.bh-(ny-dragStart.by)}
      if(dragging.includes('b')){nh=clamp(dragStart.bh+dy,minSize,imgDispH-dragStart.by)}
      box.x=nx;box.y=ny;box.w=nw;box.h=nh;
    }
    updateBox();
  }

  function onPointerUp(){
    dragging=null;
    document.removeEventListener('pointermove',onPointerMove);
    document.removeEventListener('pointerup',onPointerUp);
  }

  cropBox.addEventListener('pointerdown',onPointerDown);
  cropBox.querySelectorAll('.crop-handle').forEach(h=>h.addEventListener('pointerdown',onPointerDown));

  btnReset.addEventListener('click',function(){
    const margin=0.1;
    box={x:Math.round(imgDispW*margin),y:Math.round(imgDispH*margin),w:Math.round(imgDispW*(1-2*margin)),h:Math.round(imgDispH*(1-2*margin))};
    updateBox();
  });

  btnCancel.addEventListener('click',function(){
    overlay.classList.remove('show');
    cropCallback=null;
  });

  btnApply.addEventListener('click',function(){
    // Map display coords to natural image coords
    const scaleX=imgNatW/imgDispW;
    const scaleY=imgNatH/imgDispH;
    const sx=Math.round(box.x*scaleX);
    const sy=Math.round(box.y*scaleY);
    const sw=Math.round(box.w*scaleX);
    const sh=Math.round(box.h*scaleY);

    // Cap output at 1400px on longest side to keep base64 small
    const MAX_PX=1400;
    const scale=Math.min(1,MAX_PX/Math.max(sw,sh));
    const outW=Math.round(sw*scale);
    const outH=Math.round(sh*scale);

    const canvas=document.createElement('canvas');
    canvas.width=outW;canvas.height=outH;
    const ctx=canvas.getContext('2d');
    ctx.drawImage(cropImg,sx,sy,sw,sh,0,0,outW,outH);
    // Use JPEG for photos (smaller), cap quality
    const croppedUrl=canvas.toDataURL('image/jpeg',0.82);
    canvas.width=0;canvas.height=0; // free memory
    overlay.classList.remove('show');
    if(cropCallback) cropCallback(croppedUrl);
    cropCallback=null;
  });

  // Expose globally
  window.openCropper=openCropper;
})();

// ========== EVENTS TABS ==========
(function(){
  const tabs=document.querySelectorAll('.ev-tab');
  const upcoming=document.getElementById('evUpcoming');
  const past=document.getElementById('evPast');
  if(!tabs.length) return;
  tabs.forEach(tab=>{
    tab.addEventListener('click',function(){
      tabs.forEach(t=>{t.classList.remove('active');t.setAttribute('aria-pressed','false');});
      this.classList.add('active');
      this.setAttribute('aria-pressed','true');
      const which=this.dataset.evTab;
      upcoming.style.display=which==='upcoming'?'flex':'none';
      past.style.display=which==='past'?'flex':'none';
    });
  });
})();

// ========== EDIT MODE ==========
(function(){
  const fab=document.getElementById('editFab');
  if(!fab) return;
  const toolbar=document.getElementById('editToolbar');
  const panel=document.getElementById('editPanel');
  const panelBody=document.getElementById('epBody');
  const toast=document.getElementById('editToast');
  const epClose=document.getElementById('epClose');
  const etCancel=document.getElementById('etCancel');
  const etSave=document.getElementById('etSave');
  let editActive=false;
  let originalHTML='';

  // ── Undo / Redo ──
  const historyStack=[];
  let historyIdx=-1;
  const MAX_HISTORY=50;
  const epUndo=document.getElementById('epUndo');
  const epRedo=document.getElementById('epRedo');
  const epUndoLabel=document.getElementById('epUndoLabel');

  function pushHistory(){
    // Drop any redo future
    historyStack.splice(historyIdx+1);
    historyStack.push(document.documentElement.outerHTML);
    if(historyStack.length>MAX_HISTORY) historyStack.shift();
    historyIdx=historyStack.length-1;
    updateUndoUI();
  }

  function updateUndoUI(){
    epUndo.disabled=historyIdx<=0;
    epRedo.disabled=historyIdx>=historyStack.length-1;
    epUndoLabel.textContent=historyStack.length>1?'Step '+(historyIdx+1)+' / '+historyStack.length:'No history yet';
  }

  function restoreFromHistory(html){
    document.open();document.write(html);document.close();
  }

  epUndo.addEventListener('click',()=>{
    if(historyIdx>0){historyIdx--;restoreFromHistory(historyStack[historyIdx]);}
  });
  epRedo.addEventListener('click',()=>{
    if(historyIdx<historyStack.length-1){historyIdx++;restoreFromHistory(historyStack[historyIdx]);}
  });

  // ── Preview ──
  document.getElementById('etPreview').addEventListener('click',function(){
    // Capture clean snapshot — no edit UI
    const cloneDoc=document.documentElement.cloneNode(true);
    cloneDoc.querySelectorAll('[contenteditable]').forEach(el=>el.removeAttribute('contenteditable'));
    cloneDoc.body.classList.remove('edit-mode','edit-active');
    cloneDoc.body.style.marginRight='';
    cloneDoc.body.style.paddingTop='';
    const editEls=cloneDoc.querySelectorAll('.edit-fab,.edit-toolbar,.edit-panel,#editToast,#editUnlockOverlay');
    editEls.forEach(el=>el.remove());
    const html='<!DOCTYPE html>\n'+cloneDoc.outerHTML;
    const blob=new Blob([html],{type:'text/html'});
    const url=URL.createObjectURL(blob);
    window.open(url,'_blank');
    setTimeout(()=>URL.revokeObjectURL(url),60000);
  });

  document.addEventListener('keydown',function(e){
    if(!editActive) return;
    if(e.ctrlKey&&!e.shiftKey&&e.key==='z'){e.preventDefault();epUndo.click();}
    if(e.ctrlKey&&(e.key==='y'||(e.shiftKey&&e.key==='Z'))){e.preventDefault();epRedo.click();}
  });

  // ── Password modal unlock ──
  const overlay=document.getElementById('editUnlockOverlay');
  const unlockInput=document.getElementById('editUnlockInput');
  const unlockBtn=document.getElementById('editUnlockBtn');
  const unlockCancel=document.getElementById('editUnlockCancel');
  const tokenStatusEl=document.getElementById('tokenStatus');
  const unlockDesc=document.getElementById('editUnlockDesc');

  async function sha256(str){
    const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  function renderTokenStatus(){
    const tok=localStorage.getItem('gh_token');
    tokenStatusEl.innerHTML=tok
      ?'<span class="token-saved">✓ GitHub token saved</span><div class="token-actions"><button class="ta-replace" id="taReplace">Replace</button><button class="ta-clear" id="taClear">Clear</button></div>'
      :'<span class="token-none">No GitHub token saved</span><div class="token-actions"><button class="ta-replace" id="taReplace">Add token</button></div>';
    document.getElementById('taReplace')?.addEventListener('click',()=>{
      const t=prompt('Enter new GitHub token:');
      if(t){localStorage.setItem('gh_token',t.trim());renderTokenStatus();}
    });
    document.getElementById('taClear')?.addEventListener('click',()=>{
      if(confirm('Clear saved GitHub token?')){localStorage.removeItem('gh_token');renderTokenStatus();}
    });
  }

  function openUnlockModal(){
    const hasHash=!!localStorage.getItem('rcees_edit_hash');
    unlockDesc.textContent=hasHash?'Enter your password to unlock editing.':'Set a password to enable editing on this device.';
    unlockBtn.textContent=hasHash?'Unlock':'Set Password';
    unlockInput.value='';
    unlockInput.classList.remove('error');
    renderTokenStatus();
    overlay.classList.add('show');
    setTimeout(()=>unlockInput.focus(),50);
  }

  function closeUnlockModal(){
    overlay.classList.remove('show');
    unlockInput.value='';
  }

  function unlockEdit(){
    fab.classList.add('unlocked');
  }

  async function tryUnlock(){
    const pw=unlockInput.value.trim();
    if(!pw)return;
    const hash=await sha256(pw);
    const stored=localStorage.getItem('rcees_edit_hash');
    if(!stored){
      // First use — set password
      localStorage.setItem('rcees_edit_hash',hash);
      localStorage.setItem('rcees_edit_unlocked',Date.now().toString());
      closeUnlockModal();
      unlockEdit();
    } else if(hash===stored){
      localStorage.setItem('rcees_edit_unlocked',Date.now().toString());
      closeUnlockModal();
      unlockEdit();
    } else {
      unlockInput.classList.add('error');
      unlockInput.value='';
      unlockInput.placeholder='Incorrect — try again';
      setTimeout(()=>{unlockInput.classList.remove('error');unlockInput.placeholder='Password';},2000);
    }
  }

  // No auto-unlock on page load — FAB stays hidden until Ctrl+Shift+E + password

  unlockBtn.addEventListener('click',tryUnlock);
  unlockInput.addEventListener('keydown',e=>{if(e.key==='Enter')tryUnlock();});
  unlockCancel.addEventListener('click',closeUnlockModal);
  overlay.addEventListener('click',e=>{if(e.target===overlay)closeUnlockModal();});

  document.addEventListener('keydown',function(e){
    if(e.ctrlKey&&e.shiftKey&&e.key==='E'){
      e.preventDefault();
      openUnlockModal();
    }
    if(e.key==='Escape'&&overlay.classList.contains('show')){
      closeUnlockModal();
    }
  });

  // Editable selectors: all visible text elements
  const editableSelector='h1,h2,h3,h4,p,.slide-title,.slide-desc,.slide-eyebrow,.pi-name,.pi-sub,.about-text p,.about-highlight blockquote,.about-highlight cite,.ml-year,.ml-title,.ml-desc,.sec-eyebrow,.sec-title,.sec-desc,.r-card p,.r-card h3,.pj-body h3,.pj-body p,.pj-partners,.pj-funded,.pj-amount,.pm-val,.pm-label,.nf-body h3,.nf-body p,.nf-date,.n-item h4,.n-item p,.res-card h4,.res-card p,.res-authors,.res-journal,.t-bio,.t-role,.t-card h3,.stat-label,.ic-label,.prog-note,.nl-text h3,.nl-text p,.ci h4,.ci p,.ft-brand p,.ft-col h4,.logo-text strong,.logo-text small,.pub-title,.pub-link,.ev-title';

  let _toastTimer=null;
  function showToast(msg,dur){
    clearTimeout(_toastTimer);
    toast.textContent=msg;
    toast.classList.add('show');
    _toastTimer=setTimeout(()=>toast.classList.remove('show'),dur||2500);
  }

  function enterEditMode(){
    editActive=true;
    originalHTML=document.documentElement.outerHTML;
    document.body.classList.add('edit-mode','edit-active');
    fab.classList.add('active');
    fab.innerHTML='<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Editing';
    toolbar.classList.add('show');
    panel.classList.add('show');
    document.body.style.paddingTop='3rem';
    if(typeof autoTimer!=='undefined')clearTimeout(autoTimer);
    if(typeof rafId!=='undefined')cancelAnimationFrame(rafId);

    // Make all text editable and persist on blur
    function addEditPersist(el){
      el.setAttribute('contenteditable','true');
      if(!el._persistBound){
        el._persistBound=true;
        el.addEventListener('blur',function(){
          el.setAttribute('data-text',el.textContent);
        });
      }
    }
    document.querySelectorAll(editableSelector).forEach(el=>{
      if(!el.closest('.edit-panel')&&!el.closest('.edit-toolbar')&&!el.closest('footer')){
        addEditPersist(el);
      }
    });

    // Push history on edits (debounced 800ms)
    if(!document.body.getAttribute('data-history-listener')){
      document.body.setAttribute('data-history-listener','1');
      let historyTimer=null;
      document.addEventListener('input',function onInput(e){
        if(!editActive) return;
        clearTimeout(historyTimer);
        historyTimer=setTimeout(pushHistory,800);
      });
    }

    // Also make footer text editable
    document.querySelectorAll('footer h4, footer p, footer a, .ft-tag').forEach(el=>{
      addEditPersist(el);
    });

    buildPanel();
    // Reset to content tab
    document.querySelectorAll('.ep-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.ep-tab-content').forEach(c=>c.classList.remove('active'));
    document.querySelector('.ep-tab[data-panel-tab="content"]').classList.add('active');
    document.getElementById('epTabContent').classList.add('active');
    showToast('Edit mode on. Click any text to edit.');
    pushHistory(); // capture initial state
  }

  function exitEditMode(){
    editActive=false;
    document.body.classList.remove('edit-mode','edit-active');
    fab.classList.remove('active');
    fab.innerHTML='<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    toolbar.classList.remove('show');
    panel.classList.remove('show');
    document.body.style.paddingTop='';
    if(typeof resetAuto==='function')resetAuto();
    document.querySelectorAll('[contenteditable]').forEach(el=>el.removeAttribute('contenteditable'));
    showToast('Edit mode off \u2014 changes saved locally.');
  }

  function saveHTML(){
    // Remove edit mode artifacts before capturing clean HTML
    document.querySelectorAll('[contenteditable]').forEach(el=>el.removeAttribute('contenteditable'));
    document.body.classList.remove('edit-mode','edit-active');
    document.body.style.marginRight='';
    toolbar.classList.remove('show');
    panel.classList.remove('show');
    document.body.style.paddingTop='';
    fab.classList.remove('active','unlocked'); // strip unlocked so published HTML hides FAB for visitors
    fab.innerHTML='<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    toast.classList.remove('show'); // ensure toast never gets baked into saved HTML
    toast.textContent='';
    editActive=false;
    // Clear cropper preview so it doesn't get baked into published HTML
    const _cropImg=document.getElementById('cropImg');
    const _cropImgSrc=_cropImg?_cropImg.src:'';
    if(_cropImg) _cropImg.src='';

    const html='<!DOCTYPE html>\n'+document.documentElement.outerHTML;
    if(_cropImg) _cropImg.src=_cropImgSrc; // restore for current session
    fab.classList.add('unlocked'); // restore for current editing session
    // Re-enter edit mode immediately so UI stays responsive
    setTimeout(()=>{
      document.body.classList.add('edit-mode','edit-active');
      toolbar.classList.add('show');
      panel.classList.add('show');
      document.body.style.paddingTop='3rem';
      fab.classList.add('active');
      fab.innerHTML='<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Editing';
      editActive=true;
      document.querySelectorAll(editableSelector).forEach(el=>{
        if(!el.closest('.edit-panel')&&!el.closest('.edit-toolbar')){
          el.setAttribute('contenteditable','true');
        }
      });
    },100);

    // Publish to GitHub Pages
    let token=localStorage.getItem('gh_token');
    if(!token){
      token=prompt('Enter your GitHub Personal Access Token to publish live:\n(Saved securely in your browser — you only need to do this once)');
      if(token)localStorage.setItem('gh_token',token.trim());
    }
    if(!token){showToast('Publish cancelled.',3000);return;}

    showToast('Publishing\u2026',60000);
    publishToGitHub(html,token).then((result)=>{
      const imgNote=result.imagesExtracted?(' \u2014 '+result.imagesExtracted+' image'+(result.imagesExtracted>1?'s':'')+' extracted'):'';
      showToast('\u2713 Published'+imgNote+'! Live at samuelosa.github.io/rcees-website in ~30s',5000);

    }).catch(err=>{
      if(err.message==='INVALID_TOKEN'){
        localStorage.removeItem('gh_token');
        showToast('\u26a0 Token invalid \u2014 click Save again to re-enter.',5000);
      } else {
        showToast('\u26a0 Publish failed: '+err.message,5000);
      }
    });
  }

  async function publishToGitHub(html,token){
    const owner='Samuelosa',repo='rcees-website';
    const h={'Authorization':'token '+token,'Content-Type':'application/json'};

    // ── STEP 0: toWebP helper ──
    async function toWebP(b64,mime){
      return new Promise(resolve=>{
        const img=new Image();
        img.onload=()=>{
          try{
            const c=document.createElement('canvas');
            c.width=img.naturalWidth;c.height=img.naturalHeight;
            c.getContext('2d').drawImage(img,0,0);
            const webp=c.toDataURL('image/webp',0.85);
            c.width=0;
            if(webp.startsWith('data:image/webp')&&webp.length<('data:'+mime+';base64,'+b64).length){
              const wb64=webp.replace('data:image/webp;base64,','');
              resolve({b64:wb64,mime:'image/webp'});
            } else {
              resolve({b64,mime});
            }
          }catch{resolve({b64,mime});}
        };
        img.onerror=()=>resolve({b64,mime});
        img.src='data:'+mime+';base64,'+b64;
      });
    }

    // ── sw.js cache version (content generated after imageBlobs is populated) ──
    const cacheVersion='rcees-v1-'+Date.now();

    // ── Generate sitemap.xml ──
    const base='https://samuelosa.github.io/rcees-website';
    const sections=['','#about','#research','#publications','#projects',
      '#programs','#team','#news','#events','#gallery','#contact'];
    const sitemapContent=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sections.map(s=>`  <url><loc>${base}/${s}</loc></url>`).join('\n')}
</urlset>`;

    // ── Generate robots.txt ──
    const robotsContent=`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml`;

    // ── STEP 1: Extract + convert base64 images to WebP ──
    const extMap={'image/jpeg':'jpg','image/jpg':'jpg','image/png':'png','image/gif':'gif','image/webp':'webp','image/svg+xml':'svg'};
    function imgHash(s){let h=0;for(let i=0;i<Math.min(s.length,500);i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;}return Math.abs(h).toString(36).padStart(8,'0');}
    const seen=new Map();
    const newImages=[];
    const imageQueue=[];
    let pidx=0;
    const preClean=html.replace(/data:(image\/[^;]+);base64,([A-Za-z0-9+/=]+)/g,(match,mime,b64)=>{
      if(seen.has(b64))return seen.get(b64);
      const placeholder='__IMGQ'+pidx+'__';
      imageQueue.push({mime,b64,placeholder,idx:pidx});
      seen.set(b64,placeholder);
      pidx++;
      return placeholder;
    });
    console.log('[save] found',imageQueue.length,'embedded image(s) to extract');
    // Convert to WebP in parallel
    const converted=await Promise.all(imageQueue.map(async item=>{
      const result=await toWebP(item.b64,item.mime);
      const ext=result.mime==='image/webp'?'webp':(extMap[item.mime]||'bin');
      const fname='img-'+imgHash(item.b64)+'.'+ext;
      newImages.push({path:'images/'+fname,b64:result.b64});
      return{placeholder:item.placeholder,fname};
    }));
    // Replace placeholders with final filenames
    let cleanHtml=preClean;
    converted.forEach(({placeholder,fname})=>{
      cleanHtml=cleanHtml.split(placeholder).join('images/'+fname);
    });
    cleanHtml=cleanHtml.replace(/__IMG_([^_]+)__/g,(m,fname)=>'images/'+fname);

    // ── STEP 2: Upload new image blobs sequentially (avoids rate-limit bursts) ──
    if(newImages.length)showToast('Publishing\u2026 uploading '+newImages.length+' image(s)',60000);
    const imageBlobs=[];
    for(let idx=0;idx<newImages.length;idx++){
      const img=newImages[idx];
      if(newImages.length>1) showToast('Publishing\u2026 image '+(idx+1)+' of '+newImages.length,60000);
      const r=await fetch('https://api.github.com/repos/'+owner+'/'+repo+'/git/blobs',{
        method:'POST',headers:h,body:JSON.stringify({content:img.b64,encoding:'base64'})
      });
      if(r.status===401)throw new Error('INVALID_TOKEN');
      if(!r.ok)throw new Error('Image '+(idx+1)+' upload failed ('+r.status+' '+r.statusText+')');
      imageBlobs.push({path:img.path,sha:(await r.json()).sha});
    }

    // ── STEP 3: Upload HTML blob (TextEncoder → base64, handles all Unicode) ──
    showToast('Publishing\u2026 uploading page\u2026',60000);
    let htmlB64;
    try{
      // Modern reliable UTF-8 → base64 (no deprecated unescape)
      const bytes=new TextEncoder().encode(cleanHtml);
      let bin='';
      const chunk=8192;
      for(let i=0;i<bytes.length;i+=chunk){
        bin+=String.fromCharCode(...bytes.subarray(i,i+chunk));
      }
      htmlB64=btoa(bin);
    }catch(encErr){
      throw new Error('HTML encoding failed: '+encErr.message);
    }
    const htmlBlobRes=await fetch('https://api.github.com/repos/'+owner+'/'+repo+'/git/blobs',{
      method:'POST',headers:h,body:JSON.stringify({content:htmlB64,encoding:'base64'})
    });
    if(htmlBlobRes.status===401)throw new Error('INVALID_TOKEN');
    if(!htmlBlobRes.ok){
      let detail='';
      try{detail=(await htmlBlobRes.json()).message||'';}catch{}
      throw new Error('HTML upload failed ('+htmlBlobRes.status+'): '+detail);
    }
    const htmlBlob=await htmlBlobRes.json();

    // ── Generate sw.js (after imageBlobs so all image paths are available) ──
    const imagePrecache=imageBlobs.map(img=>`'./${img.path}'`).join(',');
    const swContent=`const CACHE='${cacheVersion}';
const PRECACHE=['./','.\/index.html','.\/cropped-RCEES-LOGO-web-2048x641.png'${imagePrecache?','+imagePrecache:''}];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  const isImage=url.pathname.startsWith('/rcees-website/images/');
  const isHTML=url.pathname.endsWith('.html')||url.pathname.endsWith('/');
  if(isImage){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
      const clone=res.clone();
      caches.open(CACHE).then(c=>c.put(e.request,clone));
      return res;
    })));
  } else if(isHTML){
    e.respondWith(fetch(e.request).then(res=>{
      const clone=res.clone();
      caches.open(CACHE).then(c=>c.put(e.request,clone));
      return res;
    }).catch(()=>caches.match(e.request)));
  } else {
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
  }
});`;

    // ── Upload sw.js blob ──
    const swBlobRes=await fetch('https://api.github.com/repos/'+owner+'/'+repo+'/git/blobs',{
      method:'POST',headers:h,body:JSON.stringify({content:swContent,encoding:'utf-8'})
    });
    if(!swBlobRes.ok)throw new Error('sw.js blob failed');
    const swBlob=await swBlobRes.json();

    // ── Upload sitemap.xml + robots.txt blobs ──
    const [sitemapBlobRes,robotsBlobRes]=await Promise.all([
      fetch('https://api.github.com/repos/'+owner+'/'+repo+'/git/blobs',{
        method:'POST',headers:h,body:JSON.stringify({content:sitemapContent,encoding:'utf-8'})
      }),
      fetch('https://api.github.com/repos/'+owner+'/'+repo+'/git/blobs',{
        method:'POST',headers:h,body:JSON.stringify({content:robotsContent,encoding:'utf-8'})
      })
    ]);
    if(!sitemapBlobRes.ok)throw new Error('sitemap blob failed');
    if(!robotsBlobRes.ok)throw new Error('robots blob failed');
    const sitemapBlob=await sitemapBlobRes.json();
    const robotsBlob=await robotsBlobRes.json();

    // ── STEP 4: Get HEAD commit + tree ──
    showToast('Publishing\u2026 reading branch\u2026',60000);
    const refRes=await fetch('https://api.github.com/repos/'+owner+'/'+repo+'/git/ref/heads/main',{headers:h});
    if(refRes.status===401)throw new Error('INVALID_TOKEN');
    if(!refRes.ok)throw new Error('Could not read branch ('+refRes.status+')');
    const headSha=(await refRes.json()).object.sha;
    const commitRes=await fetch('https://api.github.com/repos/'+owner+'/'+repo+'/git/commits/'+headSha,{headers:h});
    if(!commitRes.ok)throw new Error('Could not read commit ('+commitRes.status+')');
    const commitData=await commitRes.json();

    // ── STEP 5: Create tree with HTML + any new images ──
    showToast('Publishing\u2026 building tree\u2026',60000);
    const treeItems=[
      {path:'index.html',mode:'100644',type:'blob',sha:htmlBlob.sha},
      {path:'sw.js',mode:'100644',type:'blob',sha:swBlob.sha},
      {path:'sitemap.xml',mode:'100644',type:'blob',sha:sitemapBlob.sha},
      {path:'robots.txt',mode:'100644',type:'blob',sha:robotsBlob.sha},
      ...imageBlobs.map(img=>({path:img.path,mode:'100644',type:'blob',sha:img.sha}))
    ];
    const treeRes=await fetch('https://api.github.com/repos/'+owner+'/'+repo+'/git/trees',{
      method:'POST',headers:h,
      body:JSON.stringify({base_tree:commitData.tree.sha,tree:treeItems})
    });
    if(!treeRes.ok){
      let detail='';try{detail=(await treeRes.json()).message||'';}catch{}
      throw new Error('Tree creation failed ('+treeRes.status+'): '+detail);
    }
    const treeData=await treeRes.json();

    // ── STEP 6: Commit ──
    showToast('Publishing\u2026 committing\u2026',60000);
    const msg='Update website \u2014 '+new Date().toLocaleString()+(newImages.length?' ('+newImages.length+' new image'+(newImages.length>1?'s':'')+')':'');
    const commitCreateRes=await fetch('https://api.github.com/repos/'+owner+'/'+repo+'/git/commits',{
      method:'POST',headers:h,
      body:JSON.stringify({message:msg,tree:treeData.sha,parents:[headSha]})
    });
    if(!commitCreateRes.ok){
      let detail='';try{detail=(await commitCreateRes.json()).message||'';}catch{}
      throw new Error('Commit failed ('+commitCreateRes.status+'): '+detail);
    }
    const newCommit=await commitCreateRes.json();

    // ── STEP 7: Advance branch ──
    const updateRes=await fetch('https://api.github.com/repos/'+owner+'/'+repo+'/git/refs/heads/main',{
      method:'PATCH',headers:h,body:JSON.stringify({sha:newCommit.sha})
    });
    if(!updateRes.ok){
      let detail='';try{detail=(await updateRes.json()).message||'';}catch{}
      throw new Error('Branch update failed ('+updateRes.status+'): '+detail);
    }
    console.log('[save] \u2713 committed',newCommit.sha.slice(0,7),'with',newImages.length,'new image(s)');
    return{imagesExtracted:newImages.length};
  }

  // Apply image to a slide background
  function applySlideImage(index,url,silent){
    const slides=document.querySelectorAll('.slide');
    const slide=slides[index];
    if(!slide) return;
    const bg=slide.querySelector('.slide-bg');
    if(bg){
      bg.style.backgroundImage=`url('${url}')`;
      bg.style.backgroundSize='cover';
      bg.style.backgroundPosition='center';
      bg.setAttribute('data-bg',url);
    }
    if(!silent) showToast('Slide '+(parseInt(index)+1)+' image updated!');
  }

  // Restore all persisted edits on load
  (function(){
    // Restore slide background images
    document.querySelectorAll('.slide-bg[data-bg]').forEach(function(bg){
      const url=bg.getAttribute('data-bg');
      if(url){
        bg.style.backgroundImage="url('"+url+"')";
        bg.style.backgroundSize='cover';
        bg.style.backgroundPosition='center';
      }
    });
    // Restore research theme images
    document.querySelectorAll('.r-img[data-bg]').forEach(function(el){
      const url=el.getAttribute('data-bg');
      if(url){
        el.style.backgroundImage="url('"+url+"')";
        el.style.backgroundSize='cover';
        el.style.backgroundPosition='center';
      }
    });
    // Restore project images
    document.querySelectorAll('.pj-img[data-bg]').forEach(function(el){
      const url=el.getAttribute('data-bg');
      if(url){
        el.style.backgroundImage="url('"+url+"')";
        el.style.backgroundSize='cover';
        el.style.backgroundPosition='center';
        el.classList.add('has-photo');
      }
    });
    // Restore programme icon images
    document.querySelectorAll('.pi-icon[data-bg]').forEach(function(el){
      const url=el.getAttribute('data-bg');
      if(url){
        el.style.backgroundImage="url('"+url+"')";
        el.style.backgroundSize='cover';
        el.style.backgroundPosition='center';
        el.innerHTML='';
      }
    });
    // Restore gallery images
    document.querySelectorAll('.gal-item img[data-bg]').forEach(function(el){
      const url=el.getAttribute('data-bg');
      if(url) el.src=url;
    });
    // Restore news images
    document.querySelectorAll('.ni-thumb[data-bg]').forEach(function(el){
      const url=el.getAttribute('data-bg');
      if(url){
        el.style.backgroundImage="url('"+url+"')";
        el.style.backgroundSize='cover';
        el.style.backgroundPosition='center';
        el.classList.remove('no-img');
        el.innerHTML='';
      }
    });
    // Restore team member photos
    document.querySelectorAll('.t-photo[data-bg]').forEach(function(el){
      const url=el.getAttribute('data-bg');
      if(url){
        el.style.backgroundImage="url('"+url+"')";
        el.style.backgroundSize='cover';
        el.style.backgroundPosition='center';
        el.style.color='transparent';
      }
    });
    // Restore persisted HTML edits (e.g. slide titles with <em> gold text)
    document.querySelectorAll('[data-html]').forEach(function(el){
      el.innerHTML=el.getAttribute('data-html');
    });
    // Restore persisted text edits
    document.querySelectorAll('[data-text]').forEach(function(el){
      if(!el.hasAttribute('data-html')) el.textContent=el.getAttribute('data-text');
    });
  })();

  // Apply image to a project card
  function applyProjectImage(index,url){
    const cards=document.querySelectorAll('.pj-card');
    const card=cards[index];
    if(!card) return;
    const img=card.querySelector('.pj-img');
    if(img){
      img.style.backgroundImage=`url('${url}')`;
      img.style.backgroundSize='cover';
      img.style.backgroundPosition='center';
      img.classList.add('has-photo');
      img.setAttribute('data-bg',url);
    }
    showToast('Project '+(parseInt(index)+1)+' image updated!');
  }

  // Apply image to a research card
  function applyResearchImage(index,url){
    const cards=document.querySelectorAll('.r-card');
    const card=cards[index];
    if(!card) return;
    const img=card.querySelector('.r-img');
    if(img){
      img.style.backgroundImage=`url('${url}')`;
      img.setAttribute('data-bg',url);
    }
    showToast('Research theme '+(parseInt(index)+1)+' image updated!');
  }

  // Apply image to a programme item icon
  function applyProgrammeImage(panelIdx,itemIdx,url){
    const panels=document.querySelectorAll('.prog-panel');
    const panel=panels[panelIdx];
    if(!panel) return;
    const items=panel.querySelectorAll('.prog-item');
    const item=items[itemIdx];
    if(!item) return;
    const icon=item.querySelector('.pi-icon');
    if(icon){
      icon.style.backgroundImage=`url('${url}')`;
      icon.style.backgroundSize='cover';
      icon.style.backgroundPosition='center';
      icon.innerHTML='';
      icon.setAttribute('data-bg',url);
    }
    showToast('Programme image updated!');
  }

  // Apply image to a gallery item
  // ── Upload a single image directly to GitHub images/ folder ──
  async function uploadImageToGitHub(b64,mime){
    let token=localStorage.getItem('gh_token');
    if(!token){
      token=prompt('Enter your GitHub Personal Access Token to upload images:\n(Saved securely in your browser)');
      if(token) localStorage.setItem('gh_token',token.trim());
    }
    if(!token) return null;
    const owner='Samuelosa',repo='rcees-website';
    const ext={'image/webp':'webp','image/jpeg':'jpg','image/jpg':'jpg','image/png':'png','image/gif':'gif'}[mime]||'jpg';
    // Same hash as main save for deduplication
    function imgHash(s){let h=0;for(let i=0;i<Math.min(s.length,500);i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;}return Math.abs(h).toString(36).padStart(8,'0');}
    const fname='img-'+imgHash(b64)+'.'+ext;
    const path='images/'+fname;
    const h={'Authorization':'token '+token,'Content-Type':'application/json'};
    // Check if file already exists (need SHA to update)
    let sha;
    try{
      const check=await fetch('https://api.github.com/repos/'+owner+'/'+repo+'/contents/'+path,{headers:h});
      if(check.ok) sha=(await check.json()).sha;
    }catch{}
    const body={message:'Add gallery image: '+fname,content:b64,branch:'main'};
    if(sha) body.sha=sha;
    const res=await fetch('https://api.github.com/repos/'+owner+'/'+repo+'/contents/'+path,{
      method:'PUT',headers:h,body:JSON.stringify(body)
    });
    if(res.status===401){localStorage.removeItem('gh_token');return null;}
    if(!res.ok) return null;
    return path; // e.g. "images/img-abc12345.jpg"
  }

  // Resize a File to max 1400px and convert to WebP — no UI, no cropper
  async function resizeImage(file){
    return new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onerror=reject;
      reader.onload=function(ev){
        const img=new Image();
        img.onerror=reject;
        img.onload=function(){
          const MAX=1400;
          const scale=Math.min(1,MAX/Math.max(img.naturalWidth,img.naturalHeight));
          const w=Math.round(img.naturalWidth*scale);
          const h=Math.round(img.naturalHeight*scale);
          const canvas=document.createElement('canvas');
          canvas.width=w;canvas.height=h;
          const ctx=canvas.getContext('2d');
          if(!ctx){reject(new Error('Could not get 2D context'));return;}
          ctx.drawImage(img,0,0,w,h);
          try{
            const dataUrl=canvas.toDataURL('image/webp',0.88);
            resolve({b64:dataUrl.split(',')[1],mime:'image/webp'});
          }finally{
            canvas.width=0; // free memory
          }
        };
        img.src=ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function applyGalleryImage(index,url,silent){
    const items=document.querySelectorAll('.gal-item');
    const item=items[index];
    if(!item) return;
    const img=item.querySelector('img');
    if(img){
      img.src=url;
      img.removeAttribute('data-bg'); // src is the source of truth; data-bg would double the base64 in HTML
    }
    if(!silent) showToast('Gallery photo updated!');
  }

  // Add a new gallery photo
  function addGalleryPhoto(){
    const grid=document.querySelector('.gal-grid');
    if(!grid) return;
    const newItem=document.createElement('div');
    newItem.className='gal-item';
    newItem.dataset.galCat='research';
    newItem.innerHTML=`<img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&q=80" alt="New photo"><div class="gal-caption"><span>New Photo</span><small>Add description</small></div>`;
    grid.appendChild(newItem);
    newItem.addEventListener('click',()=>openLightbox(newItem));
    buildPanel();
    showToast('Photo added! Edit details in the panel.');
  }

  // Remove a gallery photo
  function removeGalleryPhoto(index){
    const items=Array.from(document.querySelectorAll('.gal-item'));
    if(index>=0&&index<items.length){
      items[index].remove();
      buildPanel();
      showToast('Photo removed!');
    }
  }

  // Apply photo to a team member card (by global person index)
  function applyTeamPhoto(personIdx,url){
    let idx=0;
    const allCards=[];
    document.querySelectorAll('.tg').forEach(group=>{
      group.querySelectorAll('.t-card').forEach(card=>{allCards.push(card)});
    });
    const card=allCards[personIdx];
    if(!card) return;
    const photo=card.querySelector('.t-photo');
    if(photo){
      photo.style.backgroundImage=`url('${url}')`;
      photo.style.backgroundSize='cover';
      photo.style.backgroundPosition='center';
      photo.style.color='transparent';
      photo.setAttribute('data-bg',url);
    }
    showToast('Team photo updated!');
  }

  // Apply image to a news item (featured or sidebar)
  function applyNewsImage(type,index,url){
    if(type==='featured'){
      const nf=document.querySelector('.n-featured');
      if(!nf) return;
      const img=nf.querySelector('.nf-img');
      if(img){img.style.backgroundImage=`url('${url}')`;img.classList.add('has-photo');img.setAttribute('data-bg',url)}
      showToast('Featured article image updated!');
    } else {
      const items=document.querySelectorAll('.n-item');
      const item=items[index];
      if(!item) return;
      let thumb=item.querySelector('.ni-thumb');
      if(!thumb){
        thumb=document.createElement('div');
        thumb.className='ni-thumb';
        item.prepend(thumb);
      }
      thumb.style.backgroundImage=`url('${url}')`;
      thumb.classList.remove('no-img');
      thumb.innerHTML='';
      thumb.setAttribute('data-bg',url);
      showToast('News item '+(index+1)+' image updated!');
    }
  }

  // Add a new project card to a specific panel
  function addProject(panelId){
    const panel=document.getElementById(panelId);
    if(!panel) return;
    let grid=panel.querySelector('.proj-grid');
    if(!grid){grid=document.createElement('div');grid.className='proj-grid';panel.appendChild(grid);}
    const card=document.createElement('div');
    card.className='pj-card rv vis';
    card.dataset.status='active';card.dataset.cat='';card.dataset.duration='';card.dataset.amount='';card.dataset.funder='';card.dataset.pi='';card.dataset.objectives='';
    card.innerHTML=`<div class="pj-img"><span class="pj-badge">Active</span></div><div class="pj-body"><h3>New Project Title</h3><p>Project description goes here.</p><div class="pj-partners"><strong>Partners:</strong> TBD</div><div class="pj-funded"><strong>Funded by:</strong> TBD</div></div>`;
    grid.appendChild(card);
    if(window.attachProjectModal) window.attachProjectModal(card);
    showToast('Project added! Edit its details in the panel.');
    buildPanel();
  }

  // Remove a project card by global index
  function removeProject(globalIdx){
    const cards=document.querySelectorAll('.pj-card');
    const card=cards[globalIdx];
    if(!card) return;
    const title=card.querySelector('h3');
    const name=title?title.textContent:'this project';
    if(!confirm('Remove "'+name+'"?')) return;
    card.remove();
    showToast('Project removed.');
    buildPanel();
  }

  // Add a news item to the sidebar
  function addNewsItem(){
    let sidebar=document.querySelector('.n-sidebar');
    if(!sidebar){
      const grid=document.querySelector('.news-grid');
      if(!grid) return;
      sidebar=document.createElement('div');
      sidebar.className='n-sidebar';
      grid.appendChild(sidebar);
    }
    const item=document.createElement('div');
    item.className='n-item rv vis';
    item.dataset.content='Full article content goes here. Use pipe characters to separate paragraphs.';
    const today=new Date();
    const dateStr=today.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
    item.innerHTML=`<div class="ni-thumb no-img"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="ni-text"><div class="nf-date">${dateStr}</div><h4>New News Title</h4><p>Brief description of the news item.</p></div>`;
    sidebar.prepend(item);
    if(window.attachNewsModal) window.attachNewsModal(item);
    showToast('News item added!');
    buildPanel();
  }

  // Remove a news item
  function removeNewsItem(type,idx){
    if(type==='featured'){
      const nf=document.querySelector('.n-featured');
      if(!nf) return;
      if(!confirm('Remove the featured article?')) return;
      nf.remove();
      showToast('Featured article removed.');
    } else {
      const items=document.querySelectorAll('.n-item');
      const item=items[idx];
      if(!item) return;
      const title=item.querySelector('h4');
      const name=title?title.textContent:'this item';
      if(!confirm('Remove "'+name+'"?')) return;
      item.remove();
      showToast('News item removed.');
    }
    buildPanel();
  }

  // Add a team member to a group
  const teamColors=['var(--blue)','var(--green-dark)','var(--blue-light)','var(--brown)','#2a5a4a','#3a6a8a','#5a4a2a','var(--green)','#4a6a3a','#6a4a5a','#3a5a7a','#5a3a6a','#4a5a3a','#6a5a4a','#4a6a6a','#6a4a4a','#3a6a5a','#5a5a3a','#4a3a5a'];
  function addTeamMember(groupKey){
    const group=document.querySelector(`.tg[data-group="${groupKey}"]`);
    if(!group) return;
    const grid=group.querySelector('.team-grid');
    if(!grid) return;
    const card=document.createElement('div');
    card.className='t-card rv vis';
    const count=grid.querySelectorAll('.t-card').length;
    const color=teamColors[count%teamColors.length];
    card.innerHTML=`<div class="t-photo" style="background:${color}">NN</div><h3>New Member</h3><div class="t-role">Role Title</div><p class="t-bio">Brief biography and expertise.</p>`;
    grid.appendChild(card);
    // Jump to last page so new member is visible
    const total=grid.querySelectorAll('.t-card').length;
    group.dataset.teamPage=Math.ceil(total/TEAM_PER_PAGE)-1;
    paginateGroup(group);
    showToast('Team member added!');
    buildPanel();
  }

  function removeTeamMember(groupKey,cardIdx){
    const group=document.querySelector(`.tg[data-group="${groupKey}"]`);
    if(!group) return;
    const cards=group.querySelectorAll('.t-card');
    const card=cards[cardIdx];
    if(!card) return;
    const name=card.querySelector('h3');
    if(!confirm('Remove "'+( name?name.textContent:'this member')+'"?')) return;
    card.remove();
    // Adjust page if current page is now empty
    const remaining=group.querySelectorAll('.team-grid .t-card').length;
    const maxPage=Math.max(0,Math.ceil(remaining/TEAM_PER_PAGE)-1);
    const curPage=parseInt(group.dataset.teamPage||'0');
    if(curPage>maxPage) group.dataset.teamPage=maxPage;
    paginateGroup(group);
    showToast('Team member removed.');
    buildPanel();
  }

  // Panel builder
  function buildPanel(){
    let html='<div class="ep-nav"><button class="ep-nav-btn" data-epnav="hero">Hero Slides</button><button class="ep-nav-btn" data-epnav="about">About</button><button class="ep-nav-btn" data-epnav="milestones">Milestones</button><button class="ep-nav-btn" data-epnav="research">Research Themes</button><button class="ep-nav-btn" data-epnav="projects">Projects</button><button class="ep-nav-btn" data-epnav="impact">Impact</button><button class="ep-nav-btn" data-epnav="programmes">Programmes</button><button class="ep-nav-btn" data-epnav="people">People</button><button class="ep-nav-btn" data-epnav="news">News</button><button class="ep-nav-btn" data-epnav="resources">Resources</button><button class="ep-nav-btn" data-epnav="contact">Contact</button></div>';

    // HERO SLIDER
    html+='<div class="ep-section" id="eps-hero"><div class="ep-section-title" data-eps="hero">Hero Slides</div><div class="ep-section-body">';
    document.querySelectorAll('.slide').forEach((slide,i)=>{
      const labels=['Welcome / Overview','Solar PV Training','Mini-Grid Project','Graduate Programmes','Partnerships'][i]||'Slide '+(i+1);
      html+=`<div class="ep-person"><h4>Slide ${i+1}: ${labels}</h4>`;
      // Image upload
      html+=`<div class="ep-img-upload">
        <label class="ep-upload-label" for="slide-img-${i}">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>Choose background image</span>
        </label>
        <input type="file" id="slide-img-${i}" accept="image/*" data-slide="${i}">
        <img class="ep-img-preview" id="slide-preview-${i}">
        <div class="ep-img-or">or paste an image URL</div>
        <input class="ep-img-url" placeholder="https://example.com/photo.jpg" data-slide-url="${i}" style="width:100%;padding:.45rem .6rem;border:1.5px solid var(--gray-100);border-radius:6px;font-size:.78rem;font-family:var(--sans);outline:none">
      </div>`;
      html+=makeFieldTarget(`sl-eyebrow-${i}`,'Eyebrow',slide.querySelector('.slide-eyebrow'));
      // Slide title with gold highlight support
      const titleEl=slide.querySelector('.slide-title');
      if(titleEl){
        titleEl.dataset.editId=`sl-title-${i}`;
        const fullHTML=titleEl.innerHTML;
        const emMatch=fullHTML.match(/<em>(.*?)<\/em>/);
        const goldText=emMatch?emMatch[1]:'';
        const plainText=titleEl.textContent.trim().replace(/"/g,'&quot;');
        html+=`<div class="ep-field"><label>Headline</label><input data-slide-title="${i}" value="${plainText}"></div>`;
        html+=`<div class="ep-field"><label>Gold highlight text <span style="font-weight:400;color:var(--gray-300)">(words to show in gold)</span></label><input data-slide-gold="${i}" value="${goldText.replace(/"/g,'&quot;')}" placeholder="e.g. Energy &amp; Environmental" style="border-left:3px solid var(--gold)"></div>`;
      }
      html+=makeFieldTarget(`sl-desc-${i}`,'Description',slide.querySelector('.slide-desc'),'textarea');
      html+='</div>';
    });
    html+='</div></div>';

    // ABOUT
    html+='<div class="ep-section" id="eps-about"><div class="ep-section-title" data-eps="about">About</div><div class="ep-section-body">';
    html+=makeFieldMulti('about-p','Paragraphs','.about-text p');
    html+=makeField('about-quote','Quote','.about-highlight blockquote');
    html+=makeField('about-cite','Attribution','.about-highlight cite');
    html+='</div></div>';

    // MILESTONES
    html+='<div class="ep-section" id="eps-milestones"><div class="ep-section-title" data-eps="milestones">Milestones</div><div class="ep-section-body">';
    const mlItems=document.querySelectorAll('.ml-item');
    mlItems.forEach((item,i)=>{
      html+=`<div class="ep-person"><h4>Milestone ${i+1}</h4>`;
      html+=makeFieldTarget(`ml-year-${i}`,'Year',item.querySelector('.ml-year'));
      html+=makeFieldTarget(`ml-title-${i}`,'Title',item.querySelector('.ml-title'));
      html+=makeFieldTarget(`ml-desc-${i}`,'Description',item.querySelector('.ml-desc'));
      html+='</div>';
    });
    html+='</div></div>';

    // RESEARCH CARDS
    html+='<div class="ep-section" id="eps-research"><div class="ep-section-title" data-eps="research">Research Themes</div><div class="ep-section-body">';
    document.querySelectorAll('.r-card').forEach((card,i)=>{
      html+=`<div class="ep-person"><h4>Theme ${i+1}</h4>`;
      html+=`<div class="ep-img-upload">
        <label class="ep-upload-label" for="res-img-${i}">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>Choose theme image</span>
        </label>
        <input type="file" id="res-img-${i}" accept="image/*" data-resimg="${i}">
        <img class="ep-img-preview" id="res-preview-${i}">
        <div class="ep-img-or">or paste an image URL</div>
        <input class="ep-img-url" placeholder="https://example.com/photo.jpg" data-resimg-url="${i}" style="width:100%;padding:.45rem .6rem;border:1.5px solid var(--gray-100);border-radius:6px;font-size:.78rem;font-family:var(--sans);outline:none">
      </div>`;
      html+=makeFieldTarget(`rc-h-${i}`,'Title',card.querySelector('h3'));
      html+=makeFieldTarget(`rc-p-${i}`,'Description',card.querySelector('.r-card-body p'));
      html+='</div>';
    });
    html+='</div></div>';

    // PROJECTS
    html+='<div class="ep-section" id="eps-projects"><div class="ep-section-title" data-eps="projects">Projects</div><div class="ep-section-body">';
    const projCatNames=['Energy, Mobility &amp; Systems','Climate, Water &amp; Infrastructure','Education, Modelling &amp; Transition','Collaboration &amp; Exchange'];
    const projPanelIds=['ptab-energy','ptab-climate','ptab-education','ptab-collab'];
    document.querySelectorAll('.proj-panel').forEach((panel,pi)=>{
      const catName=projCatNames[pi]||'Category '+(pi+1);
      html+=`<div class="ep-cat-header" style="display:flex;align-items:center;justify-content:space-between;margin:1rem 0 .5rem;padding:.45rem .6rem;background:var(--blue-pale);border-radius:6px"><strong style="font-size:.82rem;color:var(--blue)">${catName}</strong><button class="ep-add-proj-btn" data-panel-id="${projPanelIds[pi]}" style="font-size:.72rem;font-weight:600;padding:.3rem .7rem;border:1.5px solid var(--green);background:var(--green-light);color:var(--green);border-radius:5px;cursor:pointer;font-family:var(--sans)">+ Add Project</button></div>`;
      panel.querySelectorAll('.pj-card').forEach((card,ci)=>{
        const globalIdx=Array.from(document.querySelectorAll('.pj-card')).indexOf(card);
        const totalInGrid=panel.querySelectorAll('.pj-card').length;
        html+=`<div class="ep-person" style="position:relative"><h4 style="padding-right:130px">${catName} #${ci+1}</h4><button class="reorder-btn ep-proj-up-btn" data-global-idx="${globalIdx}" data-grid-idx="${ci}" ${ci===0?'disabled':''} style="position:absolute;top:.6rem;right:96px" title="Move up"><svg width="14" height="14" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M4 7l4-4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="reorder-btn ep-proj-down-btn" data-global-idx="${globalIdx}" data-grid-idx="${ci}" ${ci===totalInGrid-1?'disabled':''} style="position:absolute;top:.6rem;right:68px" title="Move down"><svg width="14" height="14" fill="none" viewBox="0 0 16 16"><path d="M8 13V3m-4-2l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="ep-remove-proj-btn" data-global-idx="${globalIdx}" style="position:absolute;top:.6rem;right:.5rem;font-size:.68rem;font-weight:600;padding:.2rem .55rem;border:1.5px solid #d44;background:#fff0f0;color:#d44;border-radius:5px;cursor:pointer;font-family:var(--sans)">Remove</button>`;
        html+=`<div class="ep-img-upload">
          <label class="ep-upload-label" for="proj-img-${globalIdx}">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Choose project photo</span>
          </label>
          <input type="file" id="proj-img-${globalIdx}" accept="image/*" data-proj="${globalIdx}">
          <img class="ep-img-preview" id="proj-preview-${globalIdx}">
          <div class="ep-img-or">or paste an image URL</div>
          <input class="ep-img-url" placeholder="https://example.com/photo.jpg" data-proj-url="${globalIdx}" style="width:100%;padding:.45rem .6rem;border:1.5px solid var(--gray-100);border-radius:6px;font-size:.78rem;font-family:var(--sans);outline:none">
        </div>`;
        html+=makeFieldTarget(`pc-h-${globalIdx}`,'Title',card.querySelector('h3'));
        html+=makeFieldTarget(`pc-p-${globalIdx}`,'Description',card.querySelector('.pj-body p'));
        // Partners (editable text on card)
        const partnersEl=card.querySelector('.pj-partners');
        if(partnersEl){
          // Store just the text part (without the "Partners:" label) for editing
          const pText=partnersEl.textContent.replace('Partners:','').trim();
          partnersEl.dataset.editId=`pc-partner-${globalIdx}`;
          html+=`<div class="ep-field"><label>Partners</label><input data-edit-for="pc-partner-${globalIdx}" value="${pText.replace(/"/g,'&quot;')}" data-partner-field="${globalIdx}"></div>`;
        }
        // Extended modal fields (stored as data attributes)
        const statusVal=card.dataset.status||'active';
        const dur=card.dataset.duration||'';
        const fund=card.dataset.funder||'';
        const amtVal=card.dataset.amount||'';
        const piVal=card.dataset.pi||'';
        const objVal=card.dataset.objectives||'';
        html+=`<div class="ep-field"><label>Status</label><select data-proj-status="${globalIdx}" style="width:100%;padding:.45rem .6rem;border:1.5px solid var(--gray-100);border-radius:6px;font-size:.82rem;font-family:var(--sans);background:var(--white)"><option value="active"${statusVal==='active'?' selected':''}>Active</option><option value="ended"${statusVal==='ended'?' selected':''}>Ended</option></select></div>`;
        html+=`<div class="ep-field"><label>Duration</label><input data-proj-attr="${globalIdx}" data-attr-name="duration" value="${dur.replace(/"/g,'&quot;')}"></div>`;
        html+=`<div class="ep-field"><label>Funded by</label><input data-proj-attr="${globalIdx}" data-attr-name="funder" value="${fund.replace(/"/g,'&quot;')}"></div>`;
        html+=`<div class="ep-field"><label>Funding Amount</label><input data-proj-attr="${globalIdx}" data-attr-name="amount" value="${amtVal.replace(/"/g,'&quot;')}" placeholder="e.g. $500,000 or €1.2M"></div>`;
        html+=`<div class="ep-field"><label>Principal Investigator</label><input data-proj-attr="${globalIdx}" data-attr-name="pi" value="${piVal.replace(/"/g,'&quot;')}"></div>`;
        html+=`<div class="ep-field"><label>Objectives (separate with |)</label><textarea data-proj-attr="${globalIdx}" data-attr-name="objectives" style="min-height:60px">${objVal.replace(/"/g,'&quot;')}</textarea></div>`;
        html+='</div>';
      });
    });
    html+='</div></div>';

    // IMPACT STATS
    html+='<div class="ep-section" id="eps-impact"><div class="ep-section-title" data-eps="impact">Impact Stats</div><div class="ep-section-body">';
    document.querySelectorAll('.impact-cell').forEach((cell,i)=>{
      html+=makeFieldTarget(`ic-label-${i}`,'Label',cell.querySelector('.ic-label'));
    });
    html+='</div></div>';

    // PROGRAMMES
    html+='<div class="ep-section" id="eps-programmes"><div class="ep-section-title" data-eps="programmes">Programmes</div><div class="ep-section-body">';
    document.querySelectorAll('.prog-panel').forEach((panel,pi)=>{
      const tabName=['MSc','MPhil','PhD','Short Courses'][pi]||'Tab '+(pi+1);
      const progList=panel.querySelector('.prog-list');
      html+=`<div class="ep-cat-header" style="display:flex;align-items:center;justify-content:space-between;margin:1rem 0 .5rem;padding:.45rem .6rem;background:var(--blue-pale);border-radius:6px"><strong style="font-size:.82rem;color:var(--blue)">${tabName}</strong></div>`;
      panel.querySelectorAll('.prog-item').forEach((item,ii)=>{
        const totalInList=panel.querySelectorAll('.prog-item').length;
        const progType=item.dataset.progType||'';
        const duration=item.dataset.progDuration||'';
        const mode=item.dataset.progMode||'';
        const overview=item.dataset.progOverview||'';
        const outcomes=item.dataset.progOutcomes||'';
        const requirements=item.dataset.progRequirements||'';
        const contact=item.dataset.progContact||'';
        html+=`<div class="ep-person" style="position:relative"><h4 style="padding-right:130px">${tabName} #${ii+1}</h4><button class="reorder-btn ep-prog-up-btn" data-panel-idx="${pi}" data-item-idx="${ii}" ${ii===0?'disabled':''} style="position:absolute;top:.6rem;right:96px" title="Move up"><svg width="14" height="14" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M4 7l4-4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="reorder-btn ep-prog-down-btn" data-panel-idx="${pi}" data-item-idx="${ii}" ${ii===totalInList-1?'disabled':''} style="position:absolute;top:.6rem;right:68px" title="Move down"><svg width="14" height="14" fill="none" viewBox="0 0 16 16"><path d="M8 13V3m-4-2l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;
        html+=makeFieldTarget(`prog-${pi}-${ii}-name`,'Name',item.querySelector('.pi-name'));
        html+=makeFieldTarget(`prog-${pi}-${ii}-sub`,'Description',item.querySelector('.pi-sub'));
        const progGlobalIdx=pi+'_'+ii;
        html+=`<div class="ep-img-upload">
          <label class="ep-upload-label" for="prog-img-${progGlobalIdx}">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Choose programme image</span>
          </label>
          <input type="file" id="prog-img-${progGlobalIdx}" accept="image/*" data-prog-img="${progGlobalIdx}">
          <img class="ep-img-preview" id="prog-img-preview-${progGlobalIdx}">
          <div class="ep-img-or">or paste an image URL</div>
          <input class="ep-img-url" placeholder="https://example.com/photo.jpg" data-prog-img-url="${progGlobalIdx}" style="width:100%;padding:.45rem .6rem;border:1.5px solid var(--gray-100);border-radius:6px;font-size:.78rem;font-family:var(--sans);outline:none">
        </div>`;
        html+=`<div class="ep-field"><label>Programme Type</label><input data-prog-attr="${pi}" data-prog-item="${ii}" data-attr-name="progType" value="${progType.replace(/"/g,'&quot;')}" placeholder="e.g. MSc, MPhil, PhD"></div>`;
        html+=`<div class="ep-field"><label>Duration</label><input data-prog-attr="${pi}" data-prog-item="${ii}" data-attr-name="progDuration" value="${duration.replace(/"/g,'&quot;')}" placeholder="e.g. 18 months full-time"></div>`;
        html+=`<div class="ep-field"><label>Delivery Mode</label><input data-prog-attr="${pi}" data-prog-item="${ii}" data-attr-name="progMode" value="${mode.replace(/"/g,'&quot;')}" placeholder="e.g. Full-time, On-campus"></div>`;
        html+=`<div class="ep-field"><label>Overview</label><textarea data-prog-attr="${pi}" data-prog-item="${ii}" data-attr-name="progOverview" style="min-height:80px">${overview.replace(/"/g,'&quot;')}</textarea></div>`;
        html+=`<div class="ep-field"><label>Learning Outcomes (separate with |)</label><textarea data-prog-attr="${pi}" data-prog-item="${ii}" data-attr-name="progOutcomes" style="min-height:80px">${outcomes.replace(/"/g,'&quot;')}</textarea></div>`;
        html+=`<div class="ep-field"><label>Entry Requirements</label><textarea data-prog-attr="${pi}" data-prog-item="${ii}" data-attr-name="progRequirements">${requirements.replace(/"/g,'&quot;')}</textarea></div>`;
        html+=`<div class="ep-field"><label>How to Apply / Contact</label><textarea data-prog-attr="${pi}" data-prog-item="${ii}" data-attr-name="progContact" style="min-height:60px">${contact.replace(/"/g,'&quot;')}</textarea></div>`;
        html+='</div>';
      });
      const note=panel.querySelector('.prog-note');
      if(note) html+=makeFieldTarget(`prog-note-${pi}`,'Note',note);
    });
    html+='</div></div>';

    // TEAM (grouped by category)
    html+='<div class="ep-section" id="eps-people"><div class="ep-section-title" data-eps="people">People</div><div class="ep-section-body">';
    const groupNames={'leadership':'Centre Leadership','fellows':'Research Fellows','coordinators':'Coordinators','faculty':'Faculty','assistants':'Research Assistants','admin':'Administrators','isab':'Int\'l Scientific Advisory Board','iab':'Industrial Advisory Board'};
    let personIdx=0;
    document.querySelectorAll('.tg').forEach(group=>{
      const gKey=group.dataset.group;
      const gName=groupNames[gKey]||gKey;
      html+=`<div class="ep-cat-header" style="display:flex;align-items:center;justify-content:space-between;margin:1rem 0 .5rem;padding:.45rem .6rem;background:var(--blue-pale);border-radius:6px"><strong style="font-size:.82rem;color:var(--blue)">${gName}</strong><button class="ep-add-member-btn" data-group="${gKey}" style="font-size:.72rem;font-weight:600;padding:.3rem .7rem;border:1.5px solid var(--green);background:var(--green-light);color:var(--green);border-radius:5px;cursor:pointer;font-family:var(--sans)">+ Add Member</button></div>`;
      group.querySelectorAll('.t-card').forEach((card,ci)=>{
        const i=personIdx++;
        html+=`<div class="ep-person" style="position:relative"><h4 style="padding-right:70px">${gName} #${ci+1}</h4><button class="ep-remove-member-btn" data-group="${gKey}" data-card-idx="${ci}" style="position:absolute;top:.6rem;right:.5rem;font-size:.68rem;font-weight:600;padding:.2rem .55rem;border:1.5px solid #d44;background:#fff0f0;color:#d44;border-radius:5px;cursor:pointer;font-family:var(--sans)">Remove</button>`;
        html+=makeFieldTarget(`tm-name-${i}`,'Name',card.querySelector('h3'));
        html+=makeFieldTarget(`tm-role-${i}`,'Role',card.querySelector('.t-role'));
        html+=makeFieldTarget(`tm-bio-${i}`,'Bio',card.querySelector('.t-bio'),'textarea');
        html+=makeFieldTarget(`tm-init-${i}`,'Initials/Background',card.querySelector('.t-photo'));

        // Photo upload
        const tphoto=card.querySelector('.t-photo');
        const bgStyle=tphoto?tphoto.style.background:'';
        html+=`<div class="ep-img-upload">
          <label class="ep-upload-label" for="tm-img-${i}">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Choose photo</span>
          </label>
          <input type="file" id="tm-img-${i}" accept="image/*" data-tm-img="${i}">
          <img class="ep-img-preview" id="tm-preview-${i}">
          <div class="ep-img-or">or paste a photo URL</div>
          <input class="ep-img-url" placeholder="https://example.com/photo.jpg" data-tm-img-url="${i}" style="width:100%;padding:.45rem .6rem;border:1.5px solid var(--gray-100);border-radius:6px;font-size:.78rem;font-family:var(--sans);outline:none">
        </div>`;

        html+=`<div class="ep-field"><label>Profile URL</label><input data-tm-profile="${i}" placeholder="https://example.com/profile" style="width:100%"></div>`;
        html+='</div>';
      });
    });
    html+='</div></div>';

    // NEWS
    html+='<div class="ep-section" id="eps-news"><div class="ep-section-title" data-eps="news">News &amp; Events</div><div class="ep-section-body">';
    const nf=document.querySelector('.n-featured');
    if(nf){
      html+='<div class="ep-person" style="position:relative"><h4 style="padding-right:70px">Featured Article</h4><button class="ep-remove-news-btn" data-news-type="featured" style="position:absolute;top:.6rem;right:.5rem;font-size:.68rem;font-weight:600;padding:.2rem .55rem;border:1.5px solid #d44;background:#fff0f0;color:#d44;border-radius:5px;cursor:pointer;font-family:var(--sans)">Remove</button>';
      html+=`<div class="ep-img-upload">
        <label class="ep-upload-label" for="news-img-featured">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>Choose featured image</span>
        </label>
        <input type="file" id="news-img-featured" accept="image/*" data-newsimg="featured">
        <img class="ep-img-preview" id="news-preview-featured">
        <div class="ep-img-or">or paste an image URL</div>
        <input class="ep-img-url" placeholder="https://example.com/photo.jpg" data-newsimg-url="featured" style="width:100%;padding:.45rem .6rem;border:1.5px solid var(--gray-100);border-radius:6px;font-size:.78rem;font-family:var(--sans);outline:none">
      </div>`;
      html+=makeFieldTarget('nf-title','Title',nf.querySelector('h3'));
      html+=makeFieldTarget('nf-desc','Description',nf.querySelector('.nf-body p'));
      html+=makeFieldTarget('nf-date','Date',nf.querySelector('.nf-date'));
      const nfContent=nf.dataset.content||'';
      html+=`<div class="ep-field"><label>Full Article (separate paragraphs with |)</label><textarea data-news-content="featured" style="min-height:80px">${nfContent.replace(/"/g,'&quot;')}</textarea></div>`;
      html+='</div>';
    }
    document.querySelectorAll('.n-item').forEach((item,i)=>{
      html+=`<div class="ep-person" style="position:relative"><h4 style="padding-right:70px">News Item ${i+1}</h4><button class="ep-remove-news-btn" data-news-idx="${i}" style="position:absolute;top:.6rem;right:.5rem;font-size:.68rem;font-weight:600;padding:.2rem .55rem;border:1.5px solid #d44;background:#fff0f0;color:#d44;border-radius:5px;cursor:pointer;font-family:var(--sans)">Remove</button>`;
      html+=`<div class="ep-img-upload">
        <label class="ep-upload-label" for="news-img-${i}">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>Choose thumbnail</span>
        </label>
        <input type="file" id="news-img-${i}" accept="image/*" data-newsimg="${i}">
        <img class="ep-img-preview" id="news-preview-${i}">
        <div class="ep-img-or">or paste an image URL</div>
        <input class="ep-img-url" placeholder="https://example.com/photo.jpg" data-newsimg-url="${i}" style="width:100%;padding:.45rem .6rem;border:1.5px solid var(--gray-100);border-radius:6px;font-size:.78rem;font-family:var(--sans);outline:none">
      </div>`;
      html+=makeFieldTarget(`ni-title-${i}`,'Title',item.querySelector('h4'));
      html+=makeFieldTarget(`ni-desc-${i}`,'Description',item.querySelector('p'));
      html+=makeFieldTarget(`ni-date-${i}`,'Date',item.querySelector('.nf-date'));
      const niContent=item.dataset.content||'';
      html+=`<div class="ep-field"><label>Full Article (separate paragraphs with |)</label><textarea data-news-content="${i}" style="min-height:80px">${niContent.replace(/"/g,'&quot;')}</textarea></div>`;
      html+='</div>';
    });
    html+=`<button class="ep-add-news-btn" style="width:100%;margin-top:.5rem;font-size:.78rem;font-weight:600;padding:.55rem;border:1.5px dashed var(--green);background:var(--green-light);color:var(--green);border-radius:6px;cursor:pointer;font-family:var(--sans)">+ Add News Item</button>`;
    html+='</div></div>';

    // GALLERY
    html+='<div class="ep-section" id="eps-gallery"><div class="ep-section-title" data-eps="gallery">Media Gallery</div><div class="ep-section-body">';
    const galGrid=document.querySelector('.gal-grid');
    if(galGrid){
      html+=`<button class="ep-add-gal-photo-btn" style="width:100%;margin-bottom:1rem;font-size:.78rem;font-weight:600;padding:.55rem;border:1.5px dashed var(--green);background:var(--green-light);color:var(--green);border-radius:6px;cursor:pointer;font-family:var(--sans)">+ Add Photo</button>`;
      galGrid.querySelectorAll('.gal-item').forEach((item,i)=>{
        const caption=item.querySelector('.gal-caption');
        const captionSpan=caption?caption.querySelector('span')?.textContent:'';
        const captionSmall=caption?caption.querySelector('small')?.textContent:'';
        const category=item.dataset.galCat||'research';
        html+=`<div class="ep-person" style="position:relative"><h4 style="padding-right:70px">Photo ${i+1}</h4><button class="ep-remove-gal-btn" data-gal-idx="${i}" style="position:absolute;top:.6rem;right:.5rem;font-size:.68rem;font-weight:600;padding:.2rem .55rem;border:1.5px solid #d44;background:#fff0f0;color:#d44;border-radius:5px;cursor:pointer;font-family:var(--sans)">Remove</button>`;
        html+=`<div class="ep-img-upload">
          <label class="ep-upload-label" for="gal-img-${i}">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Choose image</span>
          </label>
          <input type="file" id="gal-img-${i}" accept="image/*" data-gal-img="${i}">
          <img class="ep-img-preview" id="gal-preview-${i}">
        </div>`;
        html+=`<div class="ep-field"><label>Photo Title</label><input data-gal-title="${i}" value="${captionSpan.replace(/"/g,'&quot;')}" placeholder="e.g. Solar PV Testing Lab"></div>`;
        html+=`<div class="ep-field"><label>Subtitle/Description</label><input data-gal-subtitle="${i}" value="${captionSmall.replace(/"/g,'&quot;')}" placeholder="e.g. Research facility"></div>`;
        html+=`<div class="ep-field"><label>Category</label><select data-gal-category="${i}" style="width:100%;padding:.45rem .6rem;border:1.5px solid var(--gray-100);border-radius:6px;font-size:.82rem;font-family:var(--sans);background:var(--white)"><option value="research"${category==='research'?' selected':''}>Research</option><option value="events"${category==='events'?' selected':''}>Events</option><option value="campus"${category==='campus'?' selected':''}>Campus</option><option value="students"${category==='students'?' selected':''}>Students</option></select></div>`;
        html+='</div>';
      });
    }
    html+='</div></div>';

    // CONTACT
    html+='<div class="ep-section" id="eps-contact"><div class="ep-section-title" data-eps="contact">Contact Info</div><div class="ep-section-body">';
    document.querySelectorAll('.ci').forEach((ci,i)=>{
      html+=makeFieldTarget(`ci-h-${i}`,'Label',ci.querySelector('h4'));
      html+=makeFieldTarget(`ci-p-${i}`,'Value',ci.querySelector('p'));
    });
    html+='</div></div>';

    panelBody.innerHTML=html;
    bindPanelInputs();
  }

  // Helper: generate a field from a CSS selector (first match)
  function makeField(id,label,selector,type){
    const el=document.querySelector(selector);
    if(!el) return '';
    const val=el.textContent.trim().replace(/"/g,'&quot;');
    if(type==='textarea') return `<div class="ep-field"><label>${label}</label><textarea data-target-id="${id}">${val}</textarea></div>`;
    return `<div class="ep-field"><label>${label}</label><input data-target-id="${id}" value="${val}"></div>`;
  }

  // Helper: generate a field from a direct element reference
  function makeFieldTarget(id,label,el,type){
    if(!el) return '';
    el.dataset.editId=id;
    const val=el.textContent.trim().replace(/"/g,'&quot;');
    if(type==='textarea') return `<div class="ep-field"><label>${label}</label><textarea data-edit-for="${id}">${val}</textarea></div>`;
    return `<div class="ep-field"><label>${label}</label><input data-edit-for="${id}" value="${val}"></div>`;
  }

  // Helper: multiple elements from same selector
  function makeFieldMulti(idBase,label,selector){
    let html='';
    document.querySelectorAll(selector).forEach((el,i)=>{
      if(el.closest('.edit-panel')) return;
      const id=`${idBase}-${i}`;
      el.dataset.editId=id;
      const val=el.textContent.trim().replace(/"/g,'&quot;');
      html+=`<div class="ep-field"><label>${label} ${i+1}</label><textarea data-edit-for="${id}">${val}</textarea></div>`;
    });
    return html;
  }

  // Bind panel inputs to live update the page
  function bindPanelInputs(){
    // Section nav buttons
    panelBody.querySelectorAll('.ep-nav-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const key=btn.dataset.epnav;
        const sec=panelBody.querySelector('#eps-'+key);
        if(!sec) return;
        // Highlight active nav
        panelBody.querySelectorAll('.ep-nav-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        // Expand target, collapse others
        panelBody.querySelectorAll('.ep-section').forEach(s=>{
          if(s===sec) s.classList.remove('collapsed');
          else s.classList.add('collapsed');
        });
        sec.scrollIntoView({behavior:'smooth',block:'start'});
      });
    });
    // Collapsible section titles
    panelBody.querySelectorAll('.ep-section-title').forEach(title=>{
      title.addEventListener('click',()=>{
        const sec=title.closest('.ep-section');
        sec.classList.toggle('collapsed');
        // Update nav highlight
        const key=title.dataset.eps;
        if(key){
          panelBody.querySelectorAll('.ep-nav-btn').forEach(b=>{
            b.classList.toggle('active',b.dataset.epnav===key&&!sec.classList.contains('collapsed'));
          });
        }
      });
    });
    // Slide image file uploads (with cropper)
    panelBody.querySelectorAll('input[type="file"][data-slide]').forEach(input=>{
      input.addEventListener('change',e=>{
        const file=e.target.files[0];
        if(!file) return;
        const i=input.dataset.slide;
        const reader=new FileReader();
        reader.onload=function(ev){
          const rawUrl=ev.target.result;
          window.openCropper(rawUrl,function(croppedUrl){
            applySlideImage(i,croppedUrl);
            const preview=document.getElementById('slide-preview-'+i);
            if(preview){preview.src=croppedUrl;preview.classList.add('show')}
            input.previousElementSibling.classList.add('has-img');
            input.previousElementSibling.querySelector('span').textContent=file.name;
          });
        };
        reader.readAsDataURL(file);
      });
    });

    // Slide title + gold highlight fields
    function updateSlideTitle(i){
      const titleInput=panelBody.querySelector(`input[data-slide-title="${i}"]`);
      const goldInput=panelBody.querySelector(`input[data-slide-gold="${i}"]`);
      if(!titleInput) return;
      const slides=document.querySelectorAll('.slide');
      const slide=slides[i];
      if(!slide) return;
      const titleEl=slide.querySelector('.slide-title');
      if(!titleEl) return;
      const full=titleInput.value;
      const gold=goldInput?goldInput.value.trim():'';
      if(gold&&full.includes(gold)){
        titleEl.innerHTML=full.replace(gold,`<em>${gold}</em>`);
      } else {
        titleEl.innerHTML=gold?full.replace(gold,`<em>${gold}</em>`):full;
      }
      titleEl.setAttribute('data-html',titleEl.innerHTML);
    }
    panelBody.querySelectorAll('input[data-slide-title]').forEach(input=>{
      input.addEventListener('input',()=>updateSlideTitle(parseInt(input.dataset.slideTitle)));
    });
    panelBody.querySelectorAll('input[data-slide-gold]').forEach(input=>{
      input.addEventListener('input',()=>updateSlideTitle(parseInt(input.dataset.slideGold)));
    });

    // Slide image URL inputs
    panelBody.querySelectorAll('input[data-slide-url]').forEach(input=>{
      let debounce;
      input.addEventListener('input',()=>{
        clearTimeout(debounce);
        debounce=setTimeout(()=>{
          const i=input.dataset.slideUrl;
          const url=input.value.trim();
          if(url){
            applySlideImage(i,url);
            const preview=document.getElementById('slide-preview-'+i);
            if(preview){preview.src=url;preview.classList.add('show')}
          }
        },500);
      });
    });

    // Project image file uploads (with cropper)
    panelBody.querySelectorAll('input[type="file"][data-proj]').forEach(input=>{
      input.addEventListener('change',e=>{
        const file=e.target.files[0];
        if(!file) return;
        const i=input.dataset.proj;
        const reader=new FileReader();
        reader.onload=function(ev){
          const rawUrl=ev.target.result;
          window.openCropper(rawUrl,function(croppedUrl){
            applyProjectImage(i,croppedUrl);
            const preview=document.getElementById('proj-preview-'+i);
            if(preview){preview.src=croppedUrl;preview.classList.add('show')}
            input.previousElementSibling.classList.add('has-img');
            input.previousElementSibling.querySelector('span').textContent=file.name;
          });
        };
        reader.readAsDataURL(file);
      });
    });

    // Project image URL inputs
    panelBody.querySelectorAll('input[data-proj-url]').forEach(input=>{
      let debounce;
      input.addEventListener('input',()=>{
        clearTimeout(debounce);
        debounce=setTimeout(()=>{
          const i=input.dataset.projUrl;
          const url=input.value.trim();
          if(url){
            applyProjectImage(i,url);
            const preview=document.getElementById('proj-preview-'+i);
            if(preview){preview.src=url;preview.classList.add('show')}
          }
        },500);
      });
    });

    panelBody.querySelectorAll('[data-edit-for]').forEach(input=>{
      input.addEventListener('input',()=>{
        const target=document.querySelector(`[data-edit-id="${input.dataset.editFor}"]`);
        if(target){
          target.textContent=input.value;
          target.setAttribute('data-text',input.value);
        }
      });
    });

    // Research theme image file uploads (with cropper)
    panelBody.querySelectorAll('input[type="file"][data-resimg]').forEach(input=>{
      input.addEventListener('change',e=>{
        const file=e.target.files[0];
        if(!file) return;
        const i=input.dataset.resimg;
        const reader=new FileReader();
        reader.onload=function(ev){
          const rawUrl=ev.target.result;
          window.openCropper(rawUrl,function(croppedUrl){
            applyResearchImage(i,croppedUrl);
            const preview=document.getElementById('res-preview-'+i);
            if(preview){preview.src=croppedUrl;preview.classList.add('show')}
          });
        };
        reader.readAsDataURL(file);
      });
    });

    // Research theme image URL inputs
    panelBody.querySelectorAll('input[data-resimg-url]').forEach(input=>{
      let debounce;
      input.addEventListener('input',()=>{
        clearTimeout(debounce);
        debounce=setTimeout(()=>{
          const i=input.dataset.resimgUrl;
          const url=input.value.trim();
          if(url){
            applyResearchImage(i,url);
            const preview=document.getElementById('res-preview-'+i);
            if(preview){preview.src=url;preview.classList.add('show')}
          }
        },500);
      });
    });

    // Programme image file uploads (with cropper)
    panelBody.querySelectorAll('input[type="file"][data-prog-img]').forEach(input=>{
      input.addEventListener('change',e=>{
        const file=e.target.files[0];
        if(!file) return;
        const progGlobalIdx=input.dataset.progImg;
        const [pi,ii]=progGlobalIdx.split('_').map(Number);
        const reader=new FileReader();
        reader.onload=function(ev){
          const rawUrl=ev.target.result;
          window.openCropper(rawUrl,function(croppedUrl){
            applyProgrammeImage(pi,ii,croppedUrl);
            const preview=document.getElementById('prog-img-preview-'+progGlobalIdx);
            if(preview){preview.src=croppedUrl;preview.classList.add('show')}
          });
        };
        reader.readAsDataURL(file);
      });
    });

    // Programme image URL inputs
    panelBody.querySelectorAll('input[data-prog-img-url]').forEach(input=>{
      let debounce;
      input.addEventListener('input',()=>{
        clearTimeout(debounce);
        debounce=setTimeout(()=>{
          const progGlobalIdx=input.dataset.progImgUrl;
          const [pi,ii]=progGlobalIdx.split('_').map(Number);
          const url=input.value.trim();
          if(url){
            applyProgrammeImage(pi,ii,url);
            const preview=document.getElementById('prog-img-preview-'+progGlobalIdx);
            if(preview){preview.src=url;preview.classList.add('show')}
          }
        },500);
      });
    });

    // Project data-attribute fields (duration, funder, amount, PI, objectives)
    panelBody.querySelectorAll('[data-proj-attr]').forEach(input=>{
      input.addEventListener('input',()=>{
        const idx=parseInt(input.dataset.projAttr);
        const attrName=input.dataset.attrName;
        const cards=document.querySelectorAll('.pj-card');
        const card=cards[idx];
        if(card){
          card.dataset[attrName]=input.value;
          // Sync "Funded by" text on card when funder changes
          if(attrName==='funder'){
            const fundedEl=card.querySelector('.pj-funded');
            if(fundedEl) fundedEl.innerHTML=input.value?`<strong>Funded by:</strong> ${input.value}`:'';
          }
          // Sync amount on card
          if(attrName==='amount'){
            let amtEl=card.querySelector('.pj-amount');
            if(input.value){
              if(!amtEl){amtEl=document.createElement('div');amtEl.className='pj-amount';const fundedEl=card.querySelector('.pj-funded');if(fundedEl)fundedEl.after(amtEl);else card.querySelector('.pj-body').appendChild(amtEl)}
              amtEl.innerHTML=`<strong>Amount:</strong> ${input.value}`;
            } else if(amtEl){amtEl.remove()}
          }
        }
      });
    });

    // Partner field sync (updates innerHTML with label)
    panelBody.querySelectorAll('[data-partner-field]').forEach(input=>{
      input.addEventListener('input',()=>{
        const idx=parseInt(input.dataset.partnerField);
        const cards=document.querySelectorAll('.pj-card');
        const card=cards[idx];
        if(!card) return;
        const el=card.querySelector('.pj-partners');
        if(el) el.innerHTML=input.value?`<strong>Partners:</strong> ${input.value}`:'';
      });
    });

    // Project status dropdown
    panelBody.querySelectorAll('[data-proj-status]').forEach(sel=>{
      sel.addEventListener('change',()=>{
        const idx=parseInt(sel.dataset.projStatus);
        const cards=document.querySelectorAll('.pj-card');
        const card=cards[idx];
        if(!card) return;
        const status=sel.value;
        card.dataset.status=status;
        const badge=card.querySelector('.pj-badge');
        if(badge){
          badge.textContent=status==='ended'?'Ended':'Active';
          badge.classList.toggle('ended',status==='ended');
        }
      });
    });

    // Add project buttons
    panelBody.querySelectorAll('.ep-add-proj-btn').forEach(btn=>{
      btn.addEventListener('click',()=>addProject(btn.dataset.panelId));
    });

    // Remove project buttons
    panelBody.querySelectorAll('.ep-remove-proj-btn').forEach(btn=>{
      btn.addEventListener('click',()=>removeProject(parseInt(btn.dataset.globalIdx)));
    });

    // Project reorder buttons (up/down)
    panelBody.querySelectorAll('.ep-proj-up-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const gridIdx=parseInt(btn.dataset.gridIdx);
        const globalIdx=parseInt(btn.dataset.globalIdx);
        const allCards=Array.from(document.querySelectorAll('.pj-card'));
        const card=allCards[globalIdx];
        if(!card) return;
        const grid=card.closest('.proj-grid');
        if(!grid) return;
        const gridCards=Array.from(grid.querySelectorAll('.pj-card'));
        const currentIdx=gridCards.indexOf(card);
        if(currentIdx<=0) return;
        const prevCard=gridCards[currentIdx-1];
        card.parentNode.insertBefore(card,prevCard);
        buildPanel();
      });
    });

    panelBody.querySelectorAll('.ep-proj-down-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const gridIdx=parseInt(btn.dataset.gridIdx);
        const globalIdx=parseInt(btn.dataset.globalIdx);
        const allCards=Array.from(document.querySelectorAll('.pj-card'));
        const card=allCards[globalIdx];
        if(!card) return;
        const grid=card.closest('.proj-grid');
        if(!grid) return;
        const gridCards=Array.from(grid.querySelectorAll('.pj-card'));
        const currentIdx=gridCards.indexOf(card);
        if(currentIdx>=gridCards.length-1) return;
        const nextCard=gridCards[currentIdx+1];
        card.parentNode.insertBefore(nextCard,card);
        buildPanel();
      });
    });

    // Programme attribute fields
    panelBody.querySelectorAll('[data-prog-attr]').forEach(input=>{
      input.addEventListener('input',()=>{
        const pi=parseInt(input.dataset.progAttr);
        const ii=parseInt(input.dataset.progItem);
        const attrName=input.dataset.attrName;
        const panels=document.querySelectorAll('.prog-panel');
        const panel=panels[pi];
        if(!panel) return;
        const items=panel.querySelectorAll('.prog-item');
        const item=items[ii];
        if(item) item.dataset[attrName]=input.value;
      });
    });

    // Programme reorder buttons (up/down)
    panelBody.querySelectorAll('.ep-prog-up-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const pi=parseInt(btn.dataset.panelIdx);
        const ii=parseInt(btn.dataset.itemIdx);
        const panels=document.querySelectorAll('.prog-panel');
        const panel=panels[pi];
        if(!panel) return;
        const list=panel.querySelector('.prog-list');
        if(!list) return;
        const items=Array.from(list.querySelectorAll('.prog-item'));
        if(ii<=0) return;
        const item=items[ii];
        const prevItem=items[ii-1];
        list.insertBefore(item,prevItem);
        buildPanel();
      });
    });

    panelBody.querySelectorAll('.ep-prog-down-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const pi=parseInt(btn.dataset.panelIdx);
        const ii=parseInt(btn.dataset.itemIdx);
        const panels=document.querySelectorAll('.prog-panel');
        const panel=panels[pi];
        if(!panel) return;
        const list=panel.querySelector('.prog-list');
        if(!list) return;
        const items=Array.from(list.querySelectorAll('.prog-item'));
        if(ii>=items.length-1) return;
        const item=items[ii];
        const nextItem=items[ii+1];
        list.insertBefore(nextItem,item);
        buildPanel();
      });
    });

    // News content inputs (data-content for modal)
    panelBody.querySelectorAll('[data-news-content]').forEach(input=>{
      input.addEventListener('input',()=>{
        const key=input.dataset.newsContent;
        if(key==='featured'){
          const nf=document.querySelector('.n-featured');
          if(nf) nf.dataset.content=input.value;
        } else {
          const items=document.querySelectorAll('.n-item');
          const item=items[parseInt(key)];
          if(item) item.dataset.content=input.value;
        }
      });
    });

    // News image file uploads (with cropper)
    panelBody.querySelectorAll('input[type="file"][data-newsimg]').forEach(input=>{
      input.addEventListener('change',e=>{
        const file=e.target.files[0];
        if(!file) return;
        const key=input.dataset.newsimg;
        const reader=new FileReader();
        reader.onload=function(ev){
          const rawUrl=ev.target.result;
          window.openCropper(rawUrl,function(croppedUrl){
            if(key==='featured') applyNewsImage('featured',0,croppedUrl);
            else applyNewsImage('item',parseInt(key),croppedUrl);
            const preview=document.getElementById('news-preview-'+key);
            if(preview){preview.src=croppedUrl;preview.classList.add('show')}
          });
        };
        reader.readAsDataURL(file);
      });
    });

    // News image URL inputs
    panelBody.querySelectorAll('input[data-newsimg-url]').forEach(input=>{
      let debounce;
      input.addEventListener('input',()=>{
        clearTimeout(debounce);
        debounce=setTimeout(()=>{
          const key=input.dataset.newsimgUrl;
          const url=input.value.trim();
          if(url){
            if(key==='featured') applyNewsImage('featured',0,url);
            else applyNewsImage('item',parseInt(key),url);
            const preview=document.getElementById('news-preview-'+key);
            if(preview){preview.src=url;preview.classList.add('show')}
          }
        },500);
      });
    });

    // Add news button
    const addNewsBtn=panelBody.querySelector('.ep-add-news-btn');
    if(addNewsBtn) addNewsBtn.addEventListener('click',()=>addNewsItem());

    // Remove news buttons
    panelBody.querySelectorAll('.ep-remove-news-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        if(btn.dataset.newsType==='featured') removeNewsItem('featured');
        else removeNewsItem('item',parseInt(btn.dataset.newsIdx));
      });
    });

    // Gallery image file uploads — resize silently then upload to GitHub (no cropper)
    panelBody.querySelectorAll('input[type="file"][data-gal-img]').forEach(input=>{
      input.addEventListener('change',async e=>{
        const file=e.target.files[0];
        if(!file) return;
        const i=parseInt(input.dataset.galImg,10);
        showToast('Uploading\u2026',30000);
        try{
          const {b64,mime}=await resizeImage(file);
          const path=await uploadImageToGitHub(b64,mime);
          if(path){
            applyGalleryImage(i,path,true);
            const preview=document.getElementById('gal-preview-'+i);
            if(preview){preview.src='data:image/webp;base64,'+b64;preview.classList.add('show');}
            showToast('\u2713 Uploaded! Click Save HTML to publish.',4000);
          } else {
            showToast('\u26a0 Upload failed \u2014 check your GitHub token.',5000);
          }
        }catch(err){
          showToast('\u26a0 Error: '+err.message,5000);
        }
      });
    });

    // Gallery title and subtitle fields
    panelBody.querySelectorAll('[data-gal-title]').forEach(input=>{
      input.addEventListener('input',()=>{
        const i=parseInt(input.dataset.galTitle);
        const items=document.querySelectorAll('.gal-item');
        const item=items[i];
        if(item){
          const caption=item.querySelector('.gal-caption span');
          if(caption) caption.textContent=input.value;
        }
      });
    });

    panelBody.querySelectorAll('[data-gal-subtitle]').forEach(input=>{
      input.addEventListener('input',()=>{
        const i=parseInt(input.dataset.galSubtitle);
        const items=document.querySelectorAll('.gal-item');
        const item=items[i];
        if(item){
          const caption=item.querySelector('.gal-caption small');
          if(caption) caption.textContent=input.value;
        }
      });
    });

    // Gallery category dropdown
    panelBody.querySelectorAll('[data-gal-category]').forEach(sel=>{
      sel.addEventListener('change',()=>{
        const i=parseInt(sel.dataset.galCategory);
        const items=document.querySelectorAll('.gal-item');
        const item=items[i];
        if(item) item.dataset.galCat=sel.value;
      });
    });

    // Add gallery photo button
    const addGalPhotoBtn=panelBody.querySelector('.ep-add-gal-photo-btn');
    if(addGalPhotoBtn) addGalPhotoBtn.addEventListener('click',()=>addGalleryPhoto());



    // Remove gallery photo buttons
    panelBody.querySelectorAll('.ep-remove-gal-btn').forEach(btn=>{
      btn.addEventListener('click',()=>removeGalleryPhoto(parseInt(btn.dataset.galIdx)));
    });

    // Add team member buttons
    panelBody.querySelectorAll('.ep-add-member-btn').forEach(btn=>{
      btn.addEventListener('click',()=>addTeamMember(btn.dataset.group));
    });

    // Remove team member buttons
    panelBody.querySelectorAll('.ep-remove-member-btn').forEach(btn=>{
      btn.addEventListener('click',()=>removeTeamMember(btn.dataset.group,parseInt(btn.dataset.cardIdx)));
    });

    // Team member photo file uploads (with cropper)
    panelBody.querySelectorAll('input[type="file"][data-tm-img]').forEach(input=>{
      input.addEventListener('change',e=>{
        const file=e.target.files[0];
        if(!file) return;
        const i=input.dataset.tmImg;
        const reader=new FileReader();
        reader.onload=function(ev){
          const rawUrl=ev.target.result;
          window.openCropper(rawUrl,function(croppedUrl){
            applyTeamPhoto(parseInt(i),croppedUrl);
            const preview=document.getElementById('tm-preview-'+i);
            if(preview){preview.src=croppedUrl;preview.classList.add('show')}
            input.previousElementSibling.classList.add('has-img');
            input.previousElementSibling.querySelector('span').textContent=file.name;
          });
        };
        reader.readAsDataURL(file);
      });
    });

    // Team member photo URL inputs
    panelBody.querySelectorAll('input[data-tm-img-url]').forEach(input=>{
      let debounce;
      input.addEventListener('input',()=>{
        clearTimeout(debounce);
        debounce=setTimeout(()=>{
          const i=input.dataset.tmImgUrl;
          const url=input.value.trim();
          if(url) applyTeamPhoto(parseInt(i),url);
        },500);
      });
    });

    // For first-match selectors
    panelBody.querySelectorAll('[data-target-id]').forEach(input=>{
      const id=input.dataset.targetId;
      let selector='';
      if(id==='hero-badge') selector='.hero-badge';
      else if(id==='hero-h1') selector='.hero h1';
      else if(id==='hero-desc') selector='.hero-desc';
      if(!selector) return;
      input.addEventListener('input',()=>{
        const el=document.querySelector(selector);
        if(el) el.textContent=input.value;
      });
    });
  }

  // Panel tabs
  document.querySelectorAll('.ep-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.ep-tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.ep-tab-content').forEach(c=>c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('epTab'+tab.dataset.panelTab.charAt(0).toUpperCase()+tab.dataset.panelTab.slice(1)).classList.add('active');
      if(tab.dataset.panelTab==='layout') buildReorderList();
    });
  });

  // Section reorder system
  const reorderList=document.getElementById('reorderList');

  // Define which elements are reorderable sections
  const sectionConfig=[
    {id:'heroSlider',label:'Hero Slider',fixed:true},
    {id:'hero-stats-bar',label:'Stats Bar',selector:'.hero-stats-bar'},
    {id:'about',label:'About & Milestones'},
    {id:'research',label:'Research Themes'},
    {id:'projects',label:'Flagship Projects'},
    {id:'impact-band',label:'Impact Stats',selector:'.impact-band'},
    {id:'programs',label:'Academic Programmes'},
    {id:'team',label:'Our People'},
    {id:'news',label:'News & Events'},
    {id:'gallery',label:'Media Gallery'},
    {id:'resources',label:'Resource Library'},
    {id:'newsletter',label:'Newsletter',selector:'.newsletter'},
    {id:'contact',label:'Contact'},
  ];

  function getSectionEl(cfg){
    if(cfg.selector) return document.querySelector(cfg.selector);
    return document.getElementById(cfg.id);
  }

  function buildReorderList(){
    // Read current DOM order
    const main=document.querySelector('footer').parentElement;
    const currentOrder=[];
    sectionConfig.forEach(cfg=>{
      const el=getSectionEl(cfg);
      if(el) currentOrder.push({...cfg,el});
    });
    // Sort by DOM position
    currentOrder.sort((a,b)=>{
      const posA=a.el.compareDocumentPosition(b.el);
      return posA & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });

    reorderList.innerHTML='';
    currentOrder.forEach((cfg,i)=>{
      const div=document.createElement('div');
      div.className='reorder-item'+(cfg.fixed?' reorder-fixed':'');
      div.dataset.sectionId=cfg.id;
      div.draggable=!cfg.fixed;
      div.innerHTML=`
        <span class="reorder-grip"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></span>
        <span class="reorder-name">${cfg.label}</span>
        <span class="reorder-arrows">
          <button class="reorder-btn up" title="Move up" ${(cfg.fixed||i<=1)?'disabled':''}><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <button class="reorder-btn down" title="Move down" ${(cfg.fixed||i>=currentOrder.length-1)?'disabled':''}><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        </span>
      `;
      reorderList.appendChild(div);

      if(!cfg.fixed){
        // Arrow button handlers
        div.querySelector('.up').addEventListener('click',()=>moveSection(cfg.id,'up'));
        div.querySelector('.down').addEventListener('click',()=>moveSection(cfg.id,'down'));

        // Drag and drop
        div.addEventListener('dragstart',e=>{
          e.dataTransfer.setData('text/plain',cfg.id);
          div.classList.add('dragging');
        });
        div.addEventListener('dragend',()=>div.classList.remove('dragging'));
        div.addEventListener('dragover',e=>{
          e.preventDefault();
          div.classList.add('drag-over');
        });
        div.addEventListener('dragleave',()=>div.classList.remove('drag-over'));
        div.addEventListener('drop',e=>{
          e.preventDefault();
          div.classList.remove('drag-over');
          const fromId=e.dataTransfer.getData('text/plain');
          const toId=cfg.id;
          if(fromId!==toId) swapSections(fromId,toId);
        });
      }
    });
  }

  function moveSection(sectionId,direction){
    const items=[...reorderList.children];
    const idx=items.findIndex(el=>el.dataset.sectionId===sectionId);
    if(idx<0) return;
    const targetIdx=direction==='up'?idx-1:idx+1;
    if(targetIdx<0||targetIdx>=items.length) return;
    // Skip if target is fixed
    if(items[targetIdx].classList.contains('reorder-fixed')) return;

    const fromCfg=sectionConfig.find(c=>c.id===sectionId);
    const toCfg=sectionConfig.find(c=>c.id===items[targetIdx].dataset.sectionId);
    if(!fromCfg||!toCfg) return;

    swapSections(sectionId,toCfg.id);
  }

  function swapSections(fromId,toId){
    const fromCfg=sectionConfig.find(c=>c.id===fromId);
    const toCfg=sectionConfig.find(c=>c.id===toId);
    if(!fromCfg||!toCfg) return;
    if(fromCfg.fixed||toCfg.fixed) return;

    const fromEl=getSectionEl(fromCfg);
    const toEl=getSectionEl(toCfg);
    if(!fromEl||!toEl) return;

    // Determine DOM order
    const pos=fromEl.compareDocumentPosition(toEl);
    if(pos & Node.DOCUMENT_POSITION_FOLLOWING){
      // fromEl is before toEl: insert fromEl after toEl
      toEl.parentNode.insertBefore(fromEl,toEl.nextSibling);
    } else {
      // fromEl is after toEl: insert fromEl before toEl
      toEl.parentNode.insertBefore(fromEl,toEl);
    }

    buildReorderList();
    showToast('Sections reordered');
  }

  // Events
  fab.addEventListener('click',()=>{
    if(editActive) exitEditMode();
    else enterEditMode();
  });
  epClose.addEventListener('click',()=>panel.classList.remove('show'));
  etCancel.addEventListener('click',exitEditMode);
  etSave.addEventListener('click',saveHTML);
})();
// ── GALLERY LIGHTBOX ──
(function(){
  const overlay=document.getElementById('lbOverlay');
  if(!overlay) return;
  const img=document.getElementById('lbImg');
  const caption=document.getElementById('lbCaption');
  const closeBtn=document.getElementById('lbClose');
  const prevBtn=document.getElementById('lbPrev');
  const nextBtn=document.getElementById('lbNext');
  if(!overlay)return;
  let items=[],current=0;
  function openLightbox(idx){
    items=Array.from(document.querySelectorAll('.gal-item'));
    if(!items.length)return;
    current=((idx%items.length)+items.length)%items.length;
    show();
    overlay.classList.add('open');
    closeBtn.focus();
  }
  function show(){
    const el=items[current];
    // Support both <img> children and background-image style
    const imgEl=el.querySelector('img');
    if(imgEl){
      img.style.backgroundImage='url('+imgEl.src+')';
    } else {
      const bg=el.style.backgroundImage||window.getComputedStyle(el).backgroundImage;
      const urlMatch=bg.match(/url\(["']?([^"')]+)["']?\)/);
      img.style.backgroundImage=urlMatch?'url('+urlMatch[1]+')':'none';
    }
    const titleEl=el.querySelector('.gal-caption span');
    caption.textContent=el.getAttribute('data-caption')||el.getAttribute('aria-label')||(titleEl?titleEl.textContent:'')||'';
  }
  function close(){overlay.classList.remove('open');}
  function prev(){current=(current-1+items.length)%items.length;show();}
  function next(){current=(current+1)%items.length;show();}
  document.querySelectorAll('.gal-item').forEach(function(el,i){
    el.style.cursor='pointer';
    el.setAttribute('role','button');
    el.setAttribute('tabindex','0');
    if(!el.getAttribute('aria-label')){
      const titleEl=el.querySelector('.gal-caption span');
      el.setAttribute('aria-label',titleEl?titleEl.textContent:'Gallery image '+(i+1));
    }
    el.addEventListener('click',function(){openLightbox(i);});
    el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openLightbox(i);}});
  });
  if(closeBtn)closeBtn.addEventListener('click',close);
  if(prevBtn)prevBtn.addEventListener('click',prev);
  if(nextBtn)nextBtn.addEventListener('click',next);
  overlay.addEventListener('click',function(e){if(e.target===overlay)close();});
  document.addEventListener('keydown',function(e){
    if(!overlay.classList.contains('open'))return;
    if(e.key==='Escape')close();
    if(e.key==='ArrowLeft')prev();
    if(e.key==='ArrowRight')next();
  });
})();
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./sw.js').catch(()=>{});
}