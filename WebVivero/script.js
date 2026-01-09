/* CONFIGURACIÓN */
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQYQWXk-4XrL7_CWFDhedcKi1L1HuFLjKiyuKXervMIWsfjCAzjNpgZTaDX3iHO4XKIb2mjBcAIYt30/pub?output=csv";

let cart = [];
let allProducts = [];
let currentCategory = 'all';

const gridContainer = document.getElementById('plantsGrid');
const searchInput = document.getElementById('searchPlant');

document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    loadProducts();
    setupEventListeners();
});

/* NAVEGACIÓN (Arreglo ID) */
function navTo(id) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('btn-' + id);
    if(btn) btn.classList.add('active');

    document.getElementById('navLinks').classList.remove('active');
    window.scrollTo({top:0, behavior:'smooth'});
}

/* CARGA DE DATOS */
async function loadProducts() {
    showSkeletons();
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        allProducts = parseCSV(data); 
        renderGrid(allProducts);
        renderAccordion(); 
    } catch (error) {
        gridContainer.innerHTML = '<p style="text-align:center;">Error al cargar datos.</p>';
    }
}

function showSkeletons() {
    gridContainer.innerHTML = Array(6).fill('').map(() => `
        <div class="card" style="border:none; box-shadow:none;">
            <div class="skeleton" style="height: 320px; width:100%; margin-bottom:15px;"></div>
            <div class="skeleton" style="height: 20px; width: 60%; margin: 0 auto 10px;"></div>
        </div>
    `).join('');
}

function parseCSV(csvText) {
    const rows = csvText.split('\n').slice(1);
    return rows.map(row => {
        const columns = row.split(',');
        if (columns.length < 5) return null;
        const stockVal = columns[6] ? parseInt(columns[6].trim()) : 10;
        return {
            id: columns[0].trim(),
            name: columns[1].trim(),
            price: parseInt(columns[2].trim()) || 0, 
            type: columns[3].trim(),
            image: columns[4].trim(),
            description: columns[5] ? columns[5].trim() : "",
            stock: isNaN(stockVal) ? 0 : stockVal
        };
    }).filter(i => i);
}

function renderGrid(products) {
    gridContainer.innerHTML = "";
    if (products.length === 0) {
        gridContainer.innerHTML = '<p style="text-align:center; width:100%;">No hay resultados.</p>';
        return;
    }
    const fragment = document.createDocumentFragment();
    products.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animation = `fadeIn 0.5s ease forwards ${i * 0.05}s`;
        card.dataset.id = p.id;

        const btnText = p.stock > 0 ? "Lo quiero" : "Sin Stock";
        const btnState = p.stock > 0 ? "" : "disabled";

        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/400?text=Foto'">
                <span class="card-type-badge">${p.type}</span>
            </div>
            <div class="card-body">
                <h3 class="card-title">${p.name}</h3>
                <span class="card-price">$${p.price}</span>
                <p style="font-size:0.9rem; color:#666; margin-bottom:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.description}</p>
                <button class="btn-add" data-action="add" ${btnState}>${btnText}</button>
            </div>
        `;
        fragment.appendChild(card);
    });
    gridContainer.appendChild(fragment);
}

/* FILTROS Y ORDEN */
function applyFilters() {
    const term = searchInput.value.toLowerCase();
    const sortValue = document.getElementById('sortSelect').value;

    let filtered = allProducts.filter(p => {
        const matchesName = p.name.toLowerCase().includes(term);
        const matchesCategory = currentCategory === 'all' || p.type === currentCategory;
        return matchesName && matchesCategory;
    });

    if (sortValue === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortValue === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sortValue === 'alpha') filtered.sort((a, b) => a.name.localeCompare(b.name));

    renderGrid(filtered);
}

/* CONTENIDOS DINAMICOS */
function renderAccordion() {
    const container = document.getElementById('careList');
    container.innerHTML = [
        { icon:"water_drop", t:"Riego", d:"Toca la tierra. Si está seca 2cm abajo, riega." },
        { icon:"wb_sunny", t:"Luz", d:"Mucha luz indirecta. Evita sol fuerte." },
        { icon:"science", t:"Abono", d:"Fertiliza en primavera y verano." },
        { icon:"cleaning_services", t:"Limpieza", d:"Limpia el polvo de las hojas." }
    ].map(x => `
        <div class="accordion-item" onclick="this.classList.toggle('active')">
            <div class="accordion-header">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span class="material-icons" style="color:var(--accent);">${x.icon}</span><span>${x.t}</span>
                </div>
                <span class="material-icons">expand_more</span>
            </div>
            <div class="accordion-body"><div class="accordion-content">${x.d}</div></div>
        </div>
    `).join('');

    const docContainer = document.getElementById('plantDoctor');
    if(docContainer) {
        docContainer.innerHTML = [
            { icon:"🍂", t:"Hojas Amarillas", d:"Exceso de riego. Deja secar." },
            { icon:"🥀", t:"Hojas Caídas", d:"Falta de agua. Riega urgente." },
            { icon:"🔥", t:"Puntas Secas", d:"Falta humedad. Pulveriza." },
            { icon:"🦟", t:"Plagas", d:"Usa jabón potásico." }
        ].map(d => `
            <div class="doctor-card">
                <span class="doctor-icon">${d.icon}</span>
                <div class="doctor-title">${d.t}</div>
                <div class="doctor-desc">${d.d}</div>
            </div>
        `).join('');
    }
}

/* EVENTOS */
function setupEventListeners() {
    gridContainer.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.btn-add');
        const card = e.target.closest('.card');
        if (addBtn && !addBtn.disabled) {
            e.stopPropagation();
            addToCart(card.dataset.id);
        } else if (card) {
            openModal(card.dataset.id);
        }
    });

    document.querySelector('.filter-buttons').addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            applyFilters();
        }
    });
    
    searchInput.addEventListener('input', applyFilters);
    document.querySelector('.close-modal-btn').addEventListener('click', closeModal);
    document.getElementById('productModal').addEventListener('click', (e) => {
        if(e.target === document.getElementById('productModal')) closeModal();
    });
}

/* MODAL Y CARRITO */
function openModal(id) {
    const p = allProducts.find(i => i.id === id);
    if (!p) return;
    document.getElementById('modalImg').src = p.image;
    document.getElementById('modalTitle').innerText = p.name;
    document.getElementById('modalPrice').innerText = `$${p.price}`;
    document.getElementById('modalDesc').innerText = p.description;
    
    const stk = document.getElementById('stockIndicator');
    const btn = document.getElementById('modalAddBtn');
    
    if(p.stock > 0) {
        stk.innerText = "✅ En Stock"; stk.style.color = "green";
        btn.disabled = false; btn.innerText = "Agregar al Carrito";
        btn.onclick = () => { addToCart(p.id); closeModal(); };
    } else {
        stk.innerText = "❌ Agotado"; stk.style.color = "red";
        btn.disabled = true; btn.innerText = "Sin Stock";
    }
    document.getElementById('productModal').classList.add('open');
}
function closeModal() { document.getElementById('productModal').classList.remove('open'); }

function addToCart(id) {
    const p = allProducts.find(i => i.id === id);
    if(p.stock <= 0) return;
    const item = cart.find(i => i.id === id);
    if (item) item.qty++; else cart.push({ ...p, qty: 1 });
    updateCartUI(); saveCart(); showToast(`Agregado: ${p.name}`);
}
function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartUI(); saveCart();
}
function updateCartUI() {
    const total = cart.reduce((a, b) => a + (b.price * b.qty), 0);
    const count = cart.reduce((a, b) => a + b.qty, 0);
    document.getElementById('cartCount').innerText = count;
    document.getElementById('cartCount').style.opacity = count > 0 ? 1 : 0;
    document.getElementById('cartTotal').innerText = `$${total}`;
    document.getElementById('cartItems').innerHTML = cart.map(i => `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee;">
            <div><b>${i.name}</b><br><small>$${i.price} x ${i.qty}</small></div>
            <span onclick="removeFromCart('${i.id}')" class="material-icons" style="color:red; cursor:pointer;">delete</span>
        </div>
    `).join('');
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
    document.getElementById('cartOverlay').classList.toggle('open');
}
function checkout() {
    if(!cart.length) return;
    let msg = "Hola, quiero: "; cart.forEach(i => msg += `${i.name} x${i.qty}, `);
    window.open(`https://wa.me/5492216187527?text=${encodeURIComponent(msg)}`, '_blank');
}
function saveCart() { localStorage.setItem('viveroCart', JSON.stringify(cart)); }
function loadCartFromStorage() { const s = localStorage.getItem('viveroCart'); if(s) { cart = JSON.parse(s); updateCartUI(); } }
function toggleTheme() { document.body.classList.toggle('dark-mode'); }
function toggleMobileMenu() { document.getElementById('navLinks').classList.toggle('active'); }
function showToast(m) {
    const t = document.createElement('div'); t.className='toast'; t.innerText=m;
    document.getElementById('toastBox').appendChild(t); setTimeout(()=>t.remove(), 3000);
}