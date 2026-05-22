// PODACI (12 destinacija)
const destinations = [
    { id:1, name:"Mostar Stari Most", category:"historija", subcats:["culture","historija"], rating:4.9, desc:"Stari most iz 16. stoljeća, simbol pomirenja.", img:"https://upload.wikimedia.org/wikipedia/commons/d/d7/Mostar_Old_Town_Panorama_2007.jpg", lat:43.3375, lng:17.815, funFact:"Most se rušio u ratu 1993., obnovljen 2004." },
    { id:2, name:"Rafting na Uni", category:"adventure", subcats:["adventure","priroda"], rating:4.8, desc:"Najčistija rijeka u Europi, kanjoning i rafting.", img:"https://upload.wikimedia.org/wikipedia/commons/6/64/Waterfalls_in_Martin_Brod.jpg", lat:44.4325, lng:16.070, funFact:"Una je zaštićeni nacionalni park" },
    { id:3, name:"Jahorina", category:"planine", subcats:["planine","adventure"], rating:4.7, desc:"Olimpijska planina, vrhunske staze za skijanje.", img:"https://upload.wikimedia.org/wikipedia/commons/6/60/Jahorina.JPG", lat:43.735, lng:18.568, funFact:"Zimske Olimpijske igre 1984." },
    { id:4, name:"Plivačko jezero", category:"jezera", subcats:["jezera","priroda"], rating:4.6, desc:"Mlinčići i vodopad – raj za fotografe.", img:"https://upload.wikimedia.org/wikipedia/commons/f/f9/Veliko_Plivsko_lake.JPG", lat:44.340, lng:17.270, funFact:"Mlinčići su jedini u Europi" },
    { id:5, name:"Baščaršija", category:"culture", subcats:["culture","food","nightlife"], rating:4.9, desc:"Stari sarajevski bazar, ćevapi i kahva.", img:"https://upload.wikimedia.org/wikipedia/commons/c/c0/Sarajevo_-_view_from_Ba%C5%A1%C4%8Dar%C5%A1ija.JPG", lat:43.859, lng:18.431, funFact:"Gazi Husrev-begova džamija iz 1531." },
    { id:6, name:"Vranica", category:"planine", subcats:["planine","priroda"], rating:4.5, desc:"Nedirnuta priroda, Prokoško jezero.", img:"https://upload.wikimedia.org/wikipedia/commons/2/2a/Prokosko_jezero.jpg", lat:43.878, lng:17.661, funFact:"Lednička jezera na 2000m" },
    { id:7, name:"Kravice slapovi", category:"priroda", subcats:["priroda","adventure"], rating:4.9, desc:"Vodopad visok 25m, idealno za kupanje.", img:"https://upload.wikimedia.org/wikipedia/commons/8/86/Slapovi_Kravice.jpg", lat:43.158, lng:17.607, funFact:"Snimano za film 'Harry Potter'" },
    { id:8, name:"Sarajevo noćni život", category:"nightlife", subcats:["nightlife","culture"], rating:4.3, desc:"Klubovi, jazz, craft piva.", img:"https://upload.wikimedia.org/wikipedia/commons/0/01/Sarajevo_by_night_from_a_hilltop.jpg", lat:43.856, lng:18.413, funFact:"Sarajevo je prvi grad u Evropi sa tramvajem" },
    { id:9, name:"Tvrđava Počitelj", category:"historija", subcats:["historija","culture"], rating:4.7, desc:"Srednjovjekovni grad na Neretvi.", img:"https://upload.wikimedia.org/wikipedia/commons/5/50/Po%C4%8Ditelj_-_pano.jpg", lat:43.134, lng:17.733, funFact:"Najslikovitiji orijentalni grad u BiH" },
    { id:10, name:"Visoko piramide", category:"historija", subcats:["historija","adventure"], rating:4.2, desc:"Kontroverzna piramidalna struktura.", img:"https://upload.wikimedia.org/wikipedia/commons/a/af/Visoko_Bosna_Pyramid.jpg", lat:43.988, lng:18.178, funFact:"Najveće piramide u Europi" },
    { id:11, name:"Jezero Boračko", category:"jezera", subcats:["jezera","priroda"], rating:4.8, desc:"Ledničko jezero pored Konjica.", img:"https://upload.wikimedia.org/wikipedia/commons/8/82/Boracko_jezero.JPG", lat:43.570, lng:17.980, funFact:"Voda je pitka" },
    { id:12, name:"Ćevabdžinica Zmaj", category:"food", subcats:["food","culture"], rating:4.9, desc:"Najbolji ćevapi u Sarajevu.", img:"https://upload.wikimedia.org/wikipedia/commons/a/a0/Bosnian_%C4%86evapi_%28Sarajevo%29.JPG", lat:43.857, lng:18.429, funFact:"Tajna receptura stara 80 godina" }
];

let favorites = JSON.parse(localStorage.getItem('favs')) || [];
let recentlyViewed = JSON.parse(localStorage.getItem('recent')) || [];
let currentFilter = "all";
let currentSearch = "";
let currentSort = "default";

// Helper za čuvanje
function saveFavs() { localStorage.setItem('favs', JSON.stringify(favorites)); updateFavCount(); }
function updateFavCount() { document.querySelector('.fav-count').innerText = favorites.length; }
function addToRecently(id) {
    recentlyViewed = recentlyViewed.filter(rid => rid !== id);
    recentlyViewed.unshift(id);
    if(recentlyViewed.length > 6) recentlyViewed.pop();
    localStorage.setItem('recent', JSON.stringify(recentlyViewed));
    renderRecentlyViewed();
}

// Render kartice
function renderDestinations() {
    let filtered = destinations.filter(d => {
        if(currentFilter !== "all" && !d.subcats.includes(currentFilter) && d.category !== currentFilter) return false;
        if(currentSearch.trim() !== "") {
            const term = currentSearch.toLowerCase();
            return d.name.toLowerCase().includes(term) || d.desc.toLowerCase().includes(term) || d.category.includes(term);
        }
        return true;
    });
    if(currentSort === "rating") filtered.sort((a,b) => b.rating - a.rating);
    else if(currentSort === "name") filtered.sort((a,b) => a.name.localeCompare(b.name));
    const grid = document.getElementById('destinationsGrid');
    const noMsg = document.getElementById('noResultsMsg');
    if(filtered.length === 0) { noMsg.classList.remove('hidden'); grid.innerHTML = ''; }
    else {
        noMsg.classList.add('hidden');
        grid.innerHTML = filtered.map(d => `
            <div class="destination-card" data-id="${d.id}">
                <img class="card-img" src="${d.img}" alt="${d.name}">
                <div class="card-content">
                    <div class="card-title"><span>${d.name}</span><span class="rating">⭐ ${d.rating}</span></div>
                    <div class="card-category">${d.category}</div>
                    <div class="card-desc">${d.desc.substring(0,70)}...</div>
                    <div class="card-actions">
                        <button class="fav-btn ${favorites.includes(d.id) ? 'active' : ''}" data-id="${d.id}"><i class="fas fa-heart"></i></button>
                        <button class="detail-btn" data-id="${d.id}">Detalji</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    attachCardEvents();
}
function attachCardEvents() {
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.onclick = (e) => { e.stopPropagation(); toggleFav(parseInt(btn.dataset.id)); renderDestinations(); };
    });
    document.querySelectorAll('.detail-btn').forEach(btn => {
        btn.onclick = () => showDetail(parseInt(btn.dataset.id));
    });
}
function toggleFav(id) {
    if(favorites.includes(id)) favorites = favorites.filter(f => f !== id);
    else favorites.push(id);
    saveFavs(); renderDestinations();
}
function showDetail(id) {
    addToRecently(id);
    const d = destinations.find(x => x.id === id);
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('modalBody');
    body.innerHTML = `
        <h2>${d.name} <span style="color:gold">⭐${d.rating}</span></h2>
        <img src="${d.img}" style="width:100%; border-radius: 16px;">
        <p><strong>Kategorija:</strong> ${d.category}</p>
        <p>${d.desc}</p>
        <p><i class="fas fa-lightbulb"></i> Zanimljivost: ${d.funFact}</p>
        <div id="detailMap" style="height:200px; margin:1rem 0;"></div>
        <button class="fav-btn ${favorites.includes(d.id) ? 'active' : ''}" data-id="${d.id}" style="margin-top:1rem;">❤️ Dodaj u favorite</button>
    `;
    modal.style.display = 'flex';
    setTimeout(() => {
        const mapDiv = document.getElementById('detailMap');
        if(mapDiv && !mapDiv._leaflet_id) {
            let map = L.map(mapDiv).setView([d.lat, d.lng], 12);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' }).addTo(map);
            L.marker([d.lat, d.lng]).addTo(map).bindPopup(d.name).openPopup();
        }
    }, 100);
    document.querySelector('#modalBody .fav-btn')?.addEventListener('click', (e) => { toggleFav(d.id); showDetail(d.id); });
}
function renderRecentlyViewed() {
    const grid = document.getElementById('recentlyViewedGrid');
    const recentItems = recentlyViewed.slice(0,4).map(id => destinations.find(d => d.id === id)).filter(Boolean);
    if(recentItems.length === 0) { grid.innerHTML = '<p>Nema nedavno pregledanih destinacija.</p>'; return; }
    grid.innerHTML = recentItems.map(d => `
        <div class="destination-card" style="cursor:pointer" onclick="showDetail(${d.id})">
            <img class="card-img" src="${d.img}"><div class="card-content"><strong>${d.name}</strong><div class="rating">⭐${d.rating}</div></div>
        </div>
    `).join('');
}
// Gallery podaci
const galleryImages = [
    "https://upload.wikimedia.org/wikipedia/commons/d/d7/Mostar_Old_Town_Panorama_2007.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/6/64/Waterfalls_in_Martin_Brod.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/8/86/Slapovi_Kravice.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/6/60/Jahorina.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/c/c0/Sarajevo_-_view_from_Ba%C5%A1%C4%8Dar%C5%A1ija.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/2/2a/Prokosko_jezero.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/50/Po%C4%8Ditelj_-_pano.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/0/01/Sarajevo_by_night_from_a_hilltop.jpg"
];
function renderGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = galleryImages.map((img, idx) => `
        <div class="gallery-item"><img src="${img}" data-full="${img}" alt="gallery"></div>
    `).join('');
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', (e) => {
            document.getElementById('lightboxImg').src = e.target.dataset.full || e.target.src;
            document.getElementById('lightbox').style.display = 'flex';
        });
    });
}
// Search suggestions + filter
document.getElementById('searchInput').addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderDestinations();
    const box = document.getElementById('suggestionsBox');
    if(currentSearch.length > 1) {
        const matches = destinations.filter(d => d.name.toLowerCase().includes(currentSearch.toLowerCase())).slice(0,5);
        if(matches.length) {
            box.innerHTML = matches.map(m => `<div class="suggestion-item">${m.name}</div>`).join('');
            box.style.display = 'block';
            document.querySelectorAll('.suggestion-item').forEach(el => {
                el.onclick = () => { document.getElementById('searchInput').value = el.innerText; currentSearch = el.innerText; renderDestinations(); box.style.display = 'none'; };
            });
        } else box.style.display = 'none';
    } else box.style.display = 'none';
});
document.querySelectorAll('.chip').forEach(chip => {
    chip.onclick = () => {
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentFilter = chip.dataset.filter;
        renderDestinations();
    };
});
document.getElementById('sortSelect').onchange = (e) => { currentSort = e.target.value; renderDestinations(); };
// Random destination
document.getElementById('randomDestBtn').onclick = () => {
    const random = destinations[Math.floor(Math.random() * destinations.length)];
    showDetail(random.id);
};
// dark mode
const themeToggle = document.getElementById('themeToggle');
if(localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
themeToggle.onclick = () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
};
// mobile menu
document.getElementById('mobileMenuBtn').onclick = () => document.getElementById('navLinks').classList.toggle('show');
// lightbox close
document.querySelector('.close-lightbox').onclick = () => document.getElementById('lightbox').style.display = 'none';
document.getElementById('lightbox').onclick = (e) => { if(e.target === document.getElementById('lightbox')) document.getElementById('lightbox').style.display = 'none'; };
// modal close
document.querySelectorAll('.modal-close').forEach(el => el.onclick = () => document.getElementById('detailModal').style.display = 'none');
// Weather API (otvorena, open-meteo za Sarajevo)
async function fetchWeather() {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=43.8563&longitude=18.4131&current_weather=true');
        const data = await res.json();
        const w = data.current_weather;
        document.querySelector('.hero-stats').insertAdjacentHTML('beforeend', `<div class="stat"><i class="fas fa-cloud-sun"></i> Sarajevo: ${w.temperature}°C, ${w.windspeed} km/h</div>`);
    } catch(e) { console.log("Weather skip"); }
}
fetchWeather();

// INIT
updateFavCount();
renderDestinations();
renderRecentlyViewed();
renderGallery();
window.showDetail = showDetail;