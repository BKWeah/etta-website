
const page = document.body.dataset.page || "home";

async function loadSite(){
  const res = await fetch("/content/site.json", {cache:"no-store"});
  if(!res.ok) throw new Error("Unable to load site content");
  return await res.json();
}

function initials(name){ return (name||"ETTA").split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase(); }
function img(path, alt, cls=""){ return path ? `<img src="${path}" alt="${alt||""}" class="${cls}" onerror="this.style.display='none';this.closest('.logo-host')?.querySelector('.logo-fallback')?.style.setProperty('display','block')" />` : ""; }

function header(data){
 const current = location.pathname.split("/").pop() || "index.html";
 const nav = data.navigation.map(n=>{
   const active = n.url === current || (current === "" && n.url==="index.html");
   const children = n.children ? `<div class="mega"><div class="mega-title">${n.label}</div><div class="mega-grid">${n.children.map(c=>`<a href="${c.url}">${c.label}</a>`).join("")}</div></div>` : "";
   return `<div class="nav-item"><a class="nav-link ${active?"active":""}" href="${n.url}">${n.label}${n.children?"⌄":""}</a>${children}</div>`;
 }).join("");
 const mobile = data.navigation.map(n=>`<a href="${n.url}">${n.label}</a>`).join("");
 return `<header class="top-header">
   <div class="logo-row logo-host">
     <a class="brand-logo" href="index.html">${img(data.site.logo, data.site.companyName)}<span class="logo-fallback">ETTA</span></a>
     <button class="menu-toggle" aria-label="Open menu">☰</button>
   </div>
   <nav class="nav-row">${nav}</nav>
   <div class="mobile-panel">${mobile}</div>
 </header>`;
}

function footer(data){
 return `<footer>
  <div class="container footer-grid">
   <div class="footer-logo logo-host">${img(data.site.logo, data.site.companyName)}<span class="logo-fallback">ETTA</span><p style="color:rgba(255,255,255,.72)">ETTA Trading Corporation connects Liberian farmers and farming communities to responsible cocoa, coffee, and agricultural commodity markets.</p></div>
   <div><h3 style="color:#fff">Company</h3><div class="footer-links"><a href="about.html">About</a><a href="operations.html">Operations</a><a href="leadership.html">Leadership</a></div></div>
   <div><h3 style="color:#fff">Products</h3><div class="footer-links"><a href="products.html#cocoa">Cocoa</a><a href="products.html#coffee">Coffee</a><a href="products.html#commodities">Agricultural Commodities</a></div></div>
   <div><h3 style="color:#fff">Contact</h3><p style="color:rgba(255,255,255,.72)">${data.site.email}</p><p style="color:rgba(255,255,255,.72)">${data.site.phone}</p><p style="color:rgba(255,255,255,.72)">${data.site.address}</p></div>
  </div>
  <div class="container footer-bottom">${data.site.copyright}</div>
 </footer>`;
}

function home(data){
 const h=data.home;
 return `<section class="hero">
  <div class="hero-bg" style="background-image:url('${h.heroImage}')"></div><div class="hero-wave"></div>
  <div class="container hero-content">
   <p class="eyebrow">${h.heroEyebrow}</p><h1>${h.heroTitle}</h1><p class="lead">${h.heroSubtitle}</p>
   <div class="hero-actions"><a class="btn btn-primary" href="${h.primaryCta.url}">${h.primaryCta.label}</a><a class="btn btn-secondary" href="${h.secondaryCta.url}">${h.secondaryCta.label}</a></div>
  </div>
 </section>
 <div class="container stat-strip"><div class="stat"><b>3</b><span>Core Products</span></div><div class="stat"><b>100%</b><span>Real Field Imagery</span></div><div class="stat"><b>5+</b><span>Value Chain Focus Areas</span></div><div class="stat"><b>LR</b><span>Rooted in Liberia</span></div></div>
 <section class="section"><div class="container grid-2"><div><p class="eyebrow">Company Overview</p><h2>${h.introTitle}</h2><p class="muted" style="margin-top:22px;font-size:19px">${h.introText}</p><div class="hero-actions"><a class="btn btn-green" href="about.html">Read About ETTA</a></div></div><div class="photo-card"><img src="${h.introImage}" alt="ETTA field operations"></div></div></section>
 <section class="section section-soft"><div class="container"><p class="eyebrow">Our Core Products</p><h2>Cocoa, coffee, and agricultural commodities</h2><div class="grid-3" style="margin-top:38px">${data.products.map(p=>`<a class="card" href="products.html#${p.slug}"><div class="photo-card small" style="margin:-12px -12px 22px"><img src="${p.image}" alt="${p.name}"></div><h3>${p.name}</h3><p class="muted">${p.summary}</p></a>`).join("")}</div></div></section>
 <section class="section"><div class="container grid-2"><div class="photo-card"><img src="${h.featureImage}" alt="Cocoa harvest"></div><div><p class="eyebrow">Operational Strength</p><h2>${h.featureTitle}</h2><p class="muted" style="margin-top:22px;font-size:19px">${h.featureText}</p><div class="hero-actions"><a class="btn btn-green" href="operations.html">Explore Operations</a></div></div></div></section>
 <section class="cta-band"><div class="container grid-2"><div><p class="eyebrow">Partnership</p><h2>Ready to source responsibly from Liberia?</h2></div><div><p style="font-size:19px;color:rgba(255,255,255,.82)">Connect with ETTA for cocoa, coffee, agricultural trading, farmer partnerships, and export-ready collaboration.</p><div class="hero-actions"><a class="btn btn-primary" href="contact.html">Contact ETTA</a></div></div></div></section>`;
}

function pageHero(title, subtitle){return `<section class="page-hero"><div class="container"><p class="eyebrow">ETTA Trading Corporation</p><h1>${title}</h1><p>${subtitle}</p></div></section>`}

function about(data){
 const a=data.about;
 return `${pageHero(a.title,a.subtitle)}
 <section class="section"><div class="container grid-2"><div><p class="eyebrow">Our Story</p><h2>Built around farmers, quality, and responsible trade.</h2>${a.story.map(x=>`<p class="muted" style="margin-top:18px;font-size:18px">${x}</p>`).join("")}</div><div class="photo-card"><img src="${a.image}" alt="ETTA cocoa field"></div></div></section>
 <section class="section section-soft"><div class="container grid-2"><div class="card"><p class="eyebrow">Mission</p><h3>${a.mission}</h3></div><div class="card"><p class="eyebrow">Vision</p><h3>${a.vision}</h3></div></div></section>
 <section class="section"><div class="container"><p class="eyebrow">Values</p><h2>The principles guiding ETTA</h2><div class="grid-3" style="margin-top:34px">${a.values.map(v=>`<div class="card"><h3>${v}</h3><p class="muted">A core part of ETTA’s commitment to responsible agriculture and trusted business relationships.</p></div>`).join("")}</div></div></section>`;
}

function products(data){
 return `${pageHero("Products & Responsible Sourcing","ETTA’s product focus includes cocoa, coffee, and agricultural commodities rooted in Liberian production and farmer partnerships.")}
 <section class="section"><div class="container">${data.products.map(p=>`<article class="product-hero-card" id="${p.slug}"><img src="${p.image}" alt="${p.name}"><div class="product-copy"><p class="eyebrow">Product</p><h2>${p.name}</h2><p class="muted" style="font-size:19px;margin-top:16px">${p.summary}</p><p style="margin-top:20px">${p.details}</p><div class="hero-actions"><a class="btn btn-green" href="contact.html">Discuss ${p.name}</a></div></div></article>`).join("")}</div></section>`;
}

function operations(data){
 const o=data.operations;
 return `${pageHero(o.title,o.subtitle)}
 <section class="section"><div class="container grid-2"><div class="photo-card"><img src="${o.image}" alt="ETTA office"></div><div>${o.steps.map((s,i)=>`<div class="operation-step" id="${i===2?'quality':''}"><div class="step-no">${String(i+1).padStart(2,"0")}</div><div><h3>${s.title}</h3><p class="muted">${s.text}</p></div></div>`).join("")}</div></div></section>`;
}

function sustainability(data){
 const s=data.sustainability;
 return `${pageHero(s.title,s.subtitle)}
 <section class="section"><div class="container grid-2"><div><p class="eyebrow">Impact Direction</p><h2>Sustainable agriculture must work for farmers and markets.</h2><p class="muted" style="margin-top:22px;font-size:19px">ETTA’s sustainability approach is practical: support farmer relationships, strengthen communities, promote responsible sourcing, and build long-term agricultural business value.</p></div><div class="photo-card"><img src="${s.image}" alt="ETTA community"></div></div></section>
 <section class="section section-soft"><div class="container"><div class="grid-4">${s.pillars.map(p=>`<div class="card"><h3>${p.title}</h3><p class="muted">${p.text}</p></div>`).join("")}</div></div></section>`;
}

function leadership(data){
 const l=data.leadership;
 return `${pageHero(l.title,l.intro)}
 <section class="section"><div class="container team-grid">${l.members.map(m=>`<div class="team-card"><div class="team-image">${m.image?`<img src="${m.image}" alt="${m.name}" onerror="this.outerHTML='${initials(m.name)}'">`:initials(m.name)}</div><div class="team-body">${m.status!=="complete"?'<span class="badge">Profile Updating</span>':''}<h3>${m.name}</h3><p class="muted" style="font-weight:900;margin:6px 0 14px">${m.title}</p><p class="muted">${m.bio || "Professional profile details are being updated. This profile placeholder is prepared for final staff bio, photo, and leadership details through the CMS."}</p></div></div>`).join("")}</div></section>`;
}

function gallery(data){
 return `${pageHero("ETTA in the Field","A visual record of farmers, cocoa, coffee, field operations, and community engagement.")}
 <section class="section"><div class="container gallery-grid">${data.gallery.map((g,i)=>`<div class="gallery-item" data-img="${g.image}"><img src="${g.image}" alt="${g.title}"><div class="gallery-caption"><b>${g.category}</b><br>${g.title}</div></div>`).join("")}</div></section>
 <div class="lightbox"><button>×</button><img src="" alt="Gallery image"></div>`;
}

function contact(data){
 const c=data.contact, s=data.site;
 return `${pageHero(c.title,c.subtitle)}
 <section class="section"><div class="container contact-wrap"><div class="contact-info logo-host">${img(s.logo,s.companyName)}<span class="logo-fallback">ETTA</span><h3 style="color:#fff">Contact Details</h3><a class="contact-link" href="mailto:${s.email}">${s.email}</a><a class="contact-link" href="tel:${s.phone}">${s.phone}</a><a class="contact-link" href="https://wa.me/${s.whatsapp}" target="_blank">WhatsApp: ${s.whatsapp}</a><div class="contact-link">${s.address}</div></div><form action="${s.formspreeEndpoint}" method="POST"><div class="form-row"><div class="field"><label>Name *</label><input name="name" required></div><div class="field"><label>Email *</label><input type="email" name="email" required></div></div><div class="form-row"><div class="field"><label>Phone</label><input name="phone"></div><div class="field"><label>Inquiry Type</label><select name="inquiry_type"><option>Product Sourcing</option><option>Partnership</option><option>Farmer Engagement</option><option>Investment/Business Inquiry</option><option>General Inquiry</option></select></div></div><div class="field"><label>Message *</label><textarea name="message" required></textarea></div><button class="btn btn-green" type="submit">Send Message</button></form></div></section>`;
}

function renderMain(data){
 const map={home:home,about:about,products:products,operations:operations,sustainability:sustainability,leadership:leadership,gallery:gallery,contact:contact};
 document.body.insertAdjacentHTML("afterbegin", header(data));
 document.getElementById("app").innerHTML = (map[page]||home)(data);
 document.body.insertAdjacentHTML("beforeend", footer(data));
 document.querySelector(".menu-toggle")?.addEventListener("click",()=>document.querySelector(".mobile-panel").classList.toggle("open"));
 if(page==="gallery"){
   const lb=document.querySelector(".lightbox"), img=lb.querySelector("img");
   document.querySelectorAll(".gallery-item").forEach(item=>item.addEventListener("click",()=>{img.src=item.dataset.img;lb.classList.add("open");document.body.classList.add("lock")}));
   lb.querySelector("button").addEventListener("click",()=>{lb.classList.remove("open");document.body.classList.remove("lock")});
   lb.addEventListener("click",e=>{if(e.target===lb){lb.classList.remove("open");document.body.classList.remove("lock")}});
 }
}

loadSite().then(renderMain).catch(err=>{
 document.getElementById("app").innerHTML=`<section class="section"><div class="container"><h1 style="color:#111">Website content failed to load.</h1><p>${err.message}</p></div></section>`;
});
