(function(){
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".side-nav a").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
  document.querySelectorAll("[data-phone]").forEach(e => e.textContent = SAGT.phone.join("  |  "));
  document.querySelectorAll("[data-email]").forEach(e => e.textContent = SAGT.email);
  document.querySelectorAll("[data-hours]").forEach(e => e.textContent = SAGT.officeHours);
  document.querySelectorAll("[data-address]").forEach(e => e.textContent = SAGT.address);
  document.querySelectorAll("[data-company]").forEach(e => e.textContent = SAGT.company);
  document.querySelectorAll("[data-tagline]").forEach(e => e.textContent = SAGT.tagline);
  document.querySelectorAll("[data-year]").forEach(e => e.textContent = new Date().getFullYear());

  const reveal = new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("show")}),{threshold:.08});
  document.querySelectorAll(".reveal").forEach(e=>reveal.observe(e));

  const menu = document.querySelector(".mobile-menu");
  const nav = document.querySelector(".side-nav");
  if(menu && nav) menu.addEventListener("click",()=> {
    const open = nav.classList.toggle("mobile-open");
    nav.style.display = open ? "flex" : "none";
  });

  const projectRoot = document.querySelector("#project-grid");
  if(projectRoot){
    const filters = document.querySelector("#filters");
    const cats=["All","DGPS / ETS","Drone","Floor Plans","Structural","Residential","Commercial","Interiors","Construction"];
    if(filters){
      filters.innerHTML=cats.map((c,i)=>`<button class="filter ${i===0?"active":""}" data-filter="${c}">${c}</button>`).join("");
      filters.addEventListener("click",e=>{const b=e.target.closest(".filter");if(!b)return;document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProjects(b.dataset.filter)});
    }
    function renderProjects(cat="All"){
      const list=cat==="All"?SAGT.projects:SAGT.projects.filter(p=>p.cat===cat);
      projectRoot.innerHTML=list.map(p=>`<article class="project-card reveal show"><div class="media-wrap"><img class="project-img" src="${p.image}" alt="${p.title}" loading="lazy"><span class="image-badge">${p.cat}</span></div><div class="project-body"><div class="project-cat">${p.cat}</div><div class="project-title">${p.title}</div><div class="project-meta">${p.location}</div><p>${p.desc}</p></div></article>`).join("");
    }
    renderProjects();
  }

  const serviceRoot=document.querySelector("#service-grid");
  if(serviceRoot){
    serviceRoot.innerHTML=SAGT.services.map((s,i)=>`<article class="service-card reveal"><div class="service-media"><img src="${s.image}" alt="${s.title}" loading="lazy"><span>0${i+1}</span></div><div class="service-content"><div class="service-number">SERVICE 0${i+1}</div><h3>${s.title}</h3><strong>${s.short}</strong><p>${s.desc}</p><a class="text-link" href="contact.html">GET IN TOUCH →</a></div></article>`).join("");
    serviceRoot.querySelectorAll(".reveal").forEach(e=>reveal.observe(e));
  }

  const blogRoot=document.querySelector("#post-grid");
  if(blogRoot){
    const render = q => {
      const list=SAGT.posts.filter(p=>(p.title+" "+p.cat+" "+p.desc).toLowerCase().includes(q.toLowerCase()));
      blogRoot.innerHTML=list.map(p=>`<article class="post reveal show"><div class="post-image"><img src="${p.image}" alt="${p.title}" loading="lazy"></div><div class="post-body"><div class="post-tag">${p.cat.toUpperCase()} · ${p.date.toUpperCase()}</div><h3>${p.title}</h3><p>${p.desc}</p><a class="text-link" href="contact.html">DISCUSS THIS TOPIC →</a></div></article>`).join("") || `<div class="empty-state" role="status">No articles found.</div>`;
    };
    render("");
    const search=document.querySelector("#blog-search");
    if(search) search.addEventListener("input",e=>render(e.target.value));
  }

  document.querySelectorAll("#gallery-grid").forEach(root=>{
    root.innerHTML=SAGT.visualGallery.map((g,i)=>`<article class="gallery-card ${i===1?"gallery-feature":""} reveal"><img src="${g.image}" alt="${g.title}" loading="lazy"><div class="gallery-overlay"><div class="eyebrow">0${i+1}</div><h3>${g.title}</h3><p>${g.text}</p></div></article>`).join("");
    root.querySelectorAll(".reveal").forEach(e=>reveal.observe(e));
  });

  const form=document.querySelector("#contact-form");
  if(form){
    form.addEventListener("submit",e=>{
      e.preventDefault();
      const data=Object.fromEntries(new FormData(form).entries());
      const items=JSON.parse(localStorage.getItem("sagt_enquiries")||"[]");
      items.push({...data,createdAt:new Date().toISOString()});
      localStorage.setItem("sagt_enquiries",JSON.stringify(items));
      form.reset();
      const status=document.querySelector("#form-status");
      status.textContent="Thank you. Your enquiry has been received.";
      status.className="form-success";
    });
  }

  const searchBtn=document.querySelector(".icon-btn");
  if(searchBtn){
    searchBtn.addEventListener("click",()=>{
      const q=prompt("Search SAGT website");
      if(!q) return;
      const pages=[
        ["Home","index.html"],["About","about.html"],["Services","services.html"],["Projects","projects.html"],["Clients","clients.html"],["Blog","blog.html"],["Contact","contact.html"]
      ];
      const hit=pages.find(p=>p[0].toLowerCase().includes(q.toLowerCase()));
      if(hit) location.href=hit[1]; else alert("No matching page found.");
    });
  }
})();
