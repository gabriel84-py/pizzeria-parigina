// API URL - s'adapte automatiquement selon l'environnement
// Détection environnement
const isLocal = window.location.hostname === 'localhost' 
    || window.location.hostname === '127.0.0.1';

// URL API fiable
const API_URL = isLocal
    ? 'http://localhost:5000/api'                         // En local
    : `${window.location.origin}/api`;                    // En production (Render)


let allPizzas = [];
let filteredPizzas = [];

document.addEventListener('DOMContentLoaded', async () => {
    await initializeData();
    await loadPizzas();
    await loadHours();
    await loadContact();
    setupEventListeners();
    setupSmoothScroll();
    setupMobileMenu();
    setupScrollAnimations();
    setupNavbarScroll();
});

async function initializeData() {
    try {
        const adminExists = await fetch(`${API_URL}/admin/exists`).then(r => r.json());
        if (!adminExists.exists) {
            await fetch(`${API_URL}/admin/init`, { method: 'POST' });
        }

        const categories = await fetch(`${API_URL}/categories`).then(r => r.json());
        if (categories.length === 0) {
            await fetch(`${API_URL}/categories/init`, { method: 'POST' });
        }

        const pizzas = await fetch(`${API_URL}/pizzas`).then(r => r.json());
        if (pizzas.length === 0) {
            await fetch(`${API_URL}/pizzas/init`, { method: 'POST' });
        }

        const contact = await fetch(`${API_URL}/contact`).then(r => r.json());
        if (!contact) {
            await fetch(`${API_URL}/contact/init`, { method: 'POST' });
        }

        const hours = await fetch(`${API_URL}/hours`).then(r => r.json());
        if (hours.length === 0) {
            await fetch(`${API_URL}/hours/init`, { method: 'POST' });
        }
    } catch (error) {
        console.error('Erreur initialisation:', error);
    }
}

async function loadPizzas() {
    const loadingEl = document.getElementById('pizzas-loading');
    const gridEl = document.getElementById('pizzas-grid');
    
    try {
        if (loadingEl) loadingEl.style.display = 'block';
        if (gridEl) gridEl.style.display = 'none';
        
        const response = await fetch(`${API_URL}/pizzas`);
        allPizzas = await response.json();
        filteredPizzas = [...allPizzas];
        
        if (loadingEl) loadingEl.style.display = 'none';
        if (gridEl) gridEl.style.display = 'grid';
        
        displayPizzas(filteredPizzas);
    } catch (error) {
        console.error('Erreur chargement pizzas:', error);
        if (loadingEl) loadingEl.style.display = 'none';
        if (gridEl) {
            gridEl.style.display = 'grid';
            gridEl.innerHTML = '<div class="no-results"><p>Erreur de chargement. Veuillez réessayer.</p></div>';
        }
    }
}

function displayPizzas(pizzas) {
    const grid = document.getElementById('pizzas-grid');
    const noResults = document.getElementById('no-results');
    
    if (!grid) return;
    
    if (pizzas.length === 0) {
        grid.style.display = 'none';
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    if (noResults) noResults.style.display = 'none';
    
    // Animation d'apparition
    grid.innerHTML = pizzas.map((pizza, index) => `
        <div class="pizza-card fade-in" style="animation-delay: ${index * 0.1}s">
            <div class="pizza-header">
                <h3 class="pizza-name">${escapeHtml(pizza.name)}</h3>
                <span class="pizza-price">${pizza.price.toFixed(2)}€</span>
            </div>
            <p class="pizza-ingredients">${escapeHtml(pizza.ingredients)}</p>
            <span class="pizza-category">${escapeHtml(pizza.category)}</span>
        </div>
    `).join('');
    
    // Trigger animation
    setTimeout(() => {
        document.querySelectorAll('.pizza-card').forEach(card => {
            card.classList.add('visible');
        });
    }, 100);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function filterPizzas(category) {
    if (category === 'all') {
        filteredPizzas = [...allPizzas];
    } else {
        filteredPizzas = allPizzas.filter(p => p.category === category);
    }
    
    // Appliquer aussi la recherche si active
    const searchTerm = document.getElementById('pizza-search')?.value.toLowerCase() || '';
    if (searchTerm) {
        filteredPizzas = filteredPizzas.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.ingredients.toLowerCase().includes(searchTerm)
        );
    }
    
    // Appliquer le tri
    applySort();
    
    // Mettre à jour les boutons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
}

function applySort() {
    const sortValue = document.getElementById('sort-pizzas')?.value || 'name';
    
    switch(sortValue) {
        case 'price-asc':
            filteredPizzas.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredPizzas.sort((a, b) => b.price - a.price);
            break;
        case 'name':
        default:
            filteredPizzas.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    displayPizzas(filteredPizzas);
}

async function loadHours() {
    try {
        const response = await fetch(`${API_URL}/hours`);
        const hours = await response.json();
        
        const hoursList = document.getElementById('hours-list');
        if (!hoursList) return;
        
        hoursList.innerHTML = hours.map(hour => `
            <div class="hour-item">
                <span class="hour-day">${escapeHtml(hour.day)}</span>
                <span class="hour-time ${hour.closed ? 'closed' : ''}">
                    ${hour.closed ? 'Fermé' : `${escapeHtml(hour.open)} - ${escapeHtml(hour.close)}`}
                </span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erreur chargement horaires:', error);
    }
}

async function loadContact() {
    try {
        const response = await fetch(`${API_URL}/contact`);
        const contact = await response.json();
        
        if (contact) {
            const phoneEl = document.getElementById('contact-phone');
            const emailEl = document.getElementById('contact-email');
            const addressEl = document.getElementById('contact-address');
            
            if (phoneEl) {
                phoneEl.textContent = contact.phone || '07 68 28 06 28';
                // Mettre à jour le lien tel:
                const telLink = phoneEl.parentElement.querySelector('a[href^="tel:"]');
                if (telLink && contact.phone) {
                    telLink.href = `tel:${contact.phone.replace(/\s/g, '')}`;
                }
            }
            if (emailEl) {
                emailEl.textContent = contact.email || 'pariginafg75@gmail.com';
                // Mettre à jour le lien email
                const emailLink = emailEl.parentElement.querySelector('a[href^="mailto:"]');
                if (emailLink && contact.email) {
                    emailLink.href = `mailto:${contact.email}`;
                }
            }
            if (addressEl) {
                addressEl.innerHTML = (contact.address || '628 Avenue de Rheinbach<br>Villeneuve-lès-Avignon').replace(/, /g, '<br>');
                // Mettre à jour le lien maps
                const mapsLink = addressEl.parentElement.querySelector('a[href*="maps.google.com"]');
                if (mapsLink && contact.mapsLink) {
                    mapsLink.href = contact.mapsLink;
                }
            }
        }
    } catch (error) {
        console.error('Erreur chargement contact:', error);
    }
}

function setupEventListeners() {
    // Filtres de catégories
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => filterPizzas(btn.dataset.category));
    });
    
    // Recherche
    const searchInput = document.getElementById('pizza-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            if (searchTerm) {
                filteredPizzas = allPizzas.filter(p => 
                    p.name.toLowerCase().includes(searchTerm) ||
                    p.ingredients.toLowerCase().includes(searchTerm)
                );
            } else {
                // Réappliquer le filtre de catégorie actif
                const activeFilter = document.querySelector('.filter-btn.active');
                if (activeFilter) {
                    filterPizzas(activeFilter.dataset.category);
                    return;
                }
                filteredPizzas = [...allPizzas];
            }
            
            applySort();
        });
    }
    
    // Tri
    const sortSelect = document.getElementById('sort-pizzas');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            applySort();
        });
    }
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ 
                    top: offsetTop, 
                    behavior: 'smooth' 
                });
                
                // Fermer le menu mobile si ouvert
                const navMenu = document.getElementById('nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const toggle = document.getElementById('mobile-menu-toggle');
                    if (toggle) toggle.classList.remove('active');
                }
            }
        });
    });
    
    // Mettre à jour les liens actifs au scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function setupMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('nav-menu');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        toggle.classList.toggle('active');
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.classList.remove('active');
            toggle.classList.remove('active');
        }
    });
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observer les éléments avec la classe fade-in
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    
    // Observer les sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
}

function setupNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}
