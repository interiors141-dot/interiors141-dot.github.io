/* ORGANIC INDIA — site behaviour */
var OI = {
  whatsapp: '919315901235',
  email: 'interiors0141@gmail.com',
  formEndpoint: 'https://formsubmit.co/ajax/interiors0141@gmail.com'
};
function qs(s){return document.querySelector(s)}
function setYear(){document.querySelectorAll('[data-year]').forEach(function(e){e.textContent=new Date().getFullYear()})}
function initFilters(){var btns=[].slice.call(document.querySelectorAll('[data-filter]'));var cards=[].slice.call(document.querySelectorAll('[data-cat]'));if(!btns.length)return;btns.forEach(function(b){b.addEventListener('click',function(){btns.forEach(function(x){x.classList.remove('active')});b.classList.add('active');var f=b.dataset.filter;cards.forEach(function(c){c.classList.toggle('hidden',f!=='all'&&c.dataset.cat!==f)})})})}

function initLeadForm(){
  var form=qs('#leadForm');if(!form)return;
  if(!form.querySelector('[name="_honey"]')){var hp=document.createElement('input');hp.type='text';hp.name='_honey';hp.className='hp';hp.tabIndex=-1;hp.setAttribute('autocomplete','off');hp.setAttribute('aria-hidden','true');form.appendChild(hp)}
  var btn=form.querySelector('button[type="submit"]');if(btn)btn.textContent='Send Enquiry';
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var status=qs('#formStatus');
    if(form.querySelector('[name="_honey"]').value)return;
    var d=new FormData(form);
    var checked=function(n){return [].slice.call(form.querySelectorAll('[name="'+n+'"]:checked')).map(function(x){return x.value})};
    var g=function(n){return (d.get(n)||'').toString().trim()};
    var lines=[
      ['Name',g('name')],['Mobile',g('mobile')],['Email',g('email')],['Project Location',g('location')],
      ['Property Type',g('property_type')],['Project Type',g('project_type')],['Services Required',checked('services').join(', ')],
      ['Approx. Area',g('area')],['Budget Range',g('budget')],['Timeline',g('timeline')],['Style',g('style')],['Requirements',g('message')]
    ].filter(function(r){return r[1]});
    var text='Hello ORGANIC INDIA (OI BUILD & DESIGN), I would like a design consultation.\n\n'+lines.map(function(r){return r[0]+': '+r[1]}).join('\n')+'\n\nPage: '+location.href;

    // 1) WhatsApp — opened synchronously so mobile browsers do not block it
    window.open('https://wa.me/'+OI.whatsapp+'?text='+encodeURIComponent(text),'_blank');

    // 2) Email copy of the lead
    var payload={_subject:'New website enquiry — '+(g('name')||'Visitor')+' ('+(g('location')||'Jaipur')+')',_template:'table',_captcha:'false'};
    if(g('email'))payload._replyto=g('email');
    lines.forEach(function(r){payload[r[0]]=r[1]});
    payload['Page']=location.href;
    if(btn){btn.disabled=true;btn.textContent='Sending…'}
    fetch(OI.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),keepalive:true})
      .then(function(r){return r.ok?r.json():Promise.reject(r.status)})
      .then(function(){if(status){status.className='ok';status.textContent='Thank you — your enquiry has been emailed to our team. Please also tap Send in WhatsApp so we can respond faster.'}form.reset();if(typeof gtag==='function')gtag('event','generate_lead',{method:'website_form'})})
      .catch(function(){if(status){status.className='err';status.innerHTML='Your WhatsApp message is ready — please tap Send. If WhatsApp did not open, call <a href="tel:+919315901235"><b>93159 01235</b></a> or email <a href="mailto:'+OI.email+'">'+OI.email+'</a>.'}})
      .then(function(){if(btn){btn.disabled=false;btn.textContent='Send Enquiry'}if(status)status.scrollIntoView({behavior:'smooth',block:'center'})});
  });
}
function initMenu(){var b=qs('.menu-toggle'),m=qs('#mainMenu');if(!b||!m)return;b.addEventListener('click',function(){var open=!m.classList.contains('open');m.classList.toggle('open',open);b.setAttribute('aria-expanded',String(open));b.textContent=open?'✕':'☰'});m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){m.classList.remove('open');b.setAttribute('aria-expanded','false');b.textContent='☰'})})}
function initPrefill(){var sp=new URLSearchParams(location.search);var w=sp.get('service');if(!w)return;document.querySelectorAll('input[name="services"]').forEach(function(x){if(x.value.toLowerCase().indexOf(w.toLowerCase())>-1)x.checked=true})}
function initHeader(){var h=qs('.site-header');if(!h)return;var f=function(){h.classList.toggle('scrolled',window.scrollY>10)};f();window.addEventListener('scroll',f,{passive:true})}
function initReveal(){
  if(!('IntersectionObserver' in window))return;
  var els=document.querySelectorAll('.section-head,.card,.gallery figure,.feature,.local-box,.step,.check,.cred,.form-panel,.quote-band h2');
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(el,i){el.classList.add('reveal');el.style.transitionDelay=(i%3)*90+'ms';io.observe(el)});
}
function initTracking(){document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a');if(!a||typeof gtag!=='function')return;var h=a.getAttribute('href')||'';if(h.indexOf('tel:')===0)gtag('event','click_call');else if(h.indexOf('wa.me')>-1)gtag('event','click_whatsapp');else if(h.indexOf('mailto:')===0)gtag('event','click_email')})}
document.addEventListener('DOMContentLoaded',function(){setYear();initFilters();initLeadForm();initMenu();initPrefill();initHeader();initReveal();initTracking()});
