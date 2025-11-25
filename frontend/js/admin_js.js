// frontend/js/admin.js
// API URL - s'adapte automatiquement selon l'environnement
const API_URL = (window.location.origin.includes('localhost:5000') || window.location.origin.includes('127.0.0.1:5000'))
    ? `${window.location.origin}/api`
    : 'http://localhost:5000/api';

let authToken = localStorage.getItem('adminToken');
let currentPizzaId = null;

// Vérifier si l'admin est connecté au chargement
document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        showDashboard();
    }
    setupEventListeners();
    setupKeyboardShortcuts();
});

function setupEventListeners() {
    // Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactUpdate);
    }
    
    // Pizza form
    const pizzaForm = document.getElementById('pizza-form');
    if (pizzaForm) {
        pizzaForm.addEventListener('submit', handlePizzaSubmit);
    }
    
    // Change password
    const passwordForm = document.getElementById('change-password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
    
    // Change username
    const usernameForm = document.getElementById('change-username-form');
    if (usernameForm) {
        usernameForm.addEventListener('submit', handleUsernameChange);
    }

    // Fermer modal avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePizzaModal();
        }
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K pour ouvrir le modal d'ajout de pizza
        if ((e.ctrlKey || e.metaKey) && e.key === 'k' && authToken) {
            e.preventDefault();
            openAddPizzaModal();
        }
    });
}

// Fonction pour afficher des messages
function showMessage(elementId, message, type = 'error') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.textContent = message;
    element.className = type;
    element.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }
}

// Login
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Connexion...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('adminToken', authToken);
            showMessage('login-error', 'Connexion réussie !', 'success');
            setTimeout(() => {
                showDashboard();
            }, 500);
        } else {
            showMessage('login-error', data.error || 'Erreur de connexion', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        showMessage('login-error', 'Erreur de connexion au serveur', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Logout
function logout() {
    if (!confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) return;
    
    localStorage.removeItem('adminToken');
    authToken = null;
    document.getElementById('login-box').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('login-error').style.display = 'none';
}

// Afficher le dashboard
async function showDashboard() {
    document.getElementById('login-box').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    await loadDashboardData();
}

// Charger toutes les données du dashboard
async function loadDashboardData() {
    try {
        await Promise.all([
            loadStats(),
            loadPizzas(),
            loadContact(),
            loadHours()
        ]);
    } catch (error) {
        console.error('Erreur chargement données:', error);
    }
}

// Charger les statistiques
async function loadStats() {
    try {
        const [pizzas, categories] = await Promise.all([
            fetch(`${API_URL}/pizzas`).then(r => r.json()),
            fetch(`${API_URL}/categories`).then(r => r.json())
        ]);
        
        // Animation du compteur
        animateValue('total-pizzas', 0, pizzas.length, 500);
        animateValue('total-categories', 0, categories.length, 500);
    } catch (error) {
        console.error('Erreur chargement stats:', error);
    }
}

// Animation de compteur
function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = end;
        }
    };
    window.requestAnimationFrame(step);
}

// Charger les pizzas
async function loadPizzas() {
    const tbody = document.getElementById('pizzas-tbody');
    if (!tbody) return;
    
    try {
        const pizzas = await fetch(`${API_URL}/pizzas`).then(r => r.json());
        
        if (pizzas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:2rem;color:#666;">Aucune pizza dans le menu</td></tr>';
            return;
        }
        
        tbody.innerHTML = pizzas.map(pizza => `
            <tr>
                <td>
                    <strong style="color:var(--green);">${escapeHtml(pizza.name)}</strong><br>
                    <small style="color:#666;font-size:0.85rem;">${escapeHtml(pizza.ingredients.substring(0, 60))}${pizza.ingredients.length > 60 ? '...' : ''}</small>
                </td>
                <td><strong style="color:var(--terracotta);font-size:1.1rem;">${pizza.price.toFixed(2)}€</strong></td>
                <td>
                    <span style="background:${pizza.category === 'Base Rouge' ? 'var(--terracotta)' : 'var(--green)'};color:white;padding:0.4rem 1rem;border-radius:20px;font-size:0.85rem;font-weight:600;">
                        ${escapeHtml(pizza.category)}
                    </span>
                </td>
                <td class="actions">
                    <button class="btn-edit" onclick="editPizza('${pizza._id}')" title="Modifier">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Modifier
                    </button>
                    <button class="btn-delete" onclick="deletePizza('${pizza._id}')" title="Supprimer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        Supprimer
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erreur chargement pizzas:', error);
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:2rem;color:#dc3545;">Erreur de chargement</td></tr>';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Charger le contact
async function loadContact() {
    try {
        const contact = await fetch(`${API_URL}/contact`).then(r => r.json());
        if (contact) {
            document.getElementById('contact-phone').value = contact.phone || '';
            document.getElementById('contact-email').value = contact.email || '';
            document.getElementById('contact-address').value = contact.address || '';
            document.getElementById('contact-maps').value = contact.mapsLink || '';
        }
    } catch (error) {
        console.error('Erreur chargement contact:', error);
    }
}

// Charger les horaires
async function loadHours() {
    try {
        const hours = await fetch(`${API_URL}/hours`).then(r => r.json());
        const container = document.getElementById('hours-container');
        if (!container) return;
        
        container.innerHTML = hours.map(hour => `
            <div class="hour-item-admin">
                <label>${escapeHtml(hour.day)}</label>
                <div class="hour-checkbox">
                    <input type="checkbox" id="closed-${hour._id}" ${hour.closed ? 'checked' : ''} onchange="toggleHourInputs('${hour._id}')">
                    <label for="closed-${hour._id}" style="margin:0;min-width:auto;">Fermé</label>
                </div>
                <input type="text" id="open-${hour._id}" value="${escapeHtml(hour.open || '')}" placeholder="18h00" ${hour.closed ? 'disabled' : ''}>
                <input type="text" id="close-${hour._id}" value="${escapeHtml(hour.close || '')}" placeholder="21h00" ${hour.closed ? 'disabled' : ''}>
                <button type="button" class="btn" onclick="updateHour('${hour._id}')" style="width:auto;padding:0.75rem 1.5rem;">
                    Enregistrer
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erreur chargement horaires:', error);
        const container = document.getElementById('hours-container');
        if (container) {
            container.innerHTML = '<div class="loading">Erreur de chargement</div>';
        }
    }
}

// Toggle inputs horaires
function toggleHourInputs(hourId) {
    const closed = document.getElementById(`closed-${hourId}`).checked;
    document.getElementById(`open-${hourId}`).disabled = closed;
    document.getElementById(`close-${hourId}`).disabled = closed;
    if (closed) {
        document.getElementById(`open-${hourId}`).value = '';
        document.getElementById(`close-${hourId}`).value = '';
    }
}

// Mettre à jour un horaire
async function updateHour(hourId) {
    const open = document.getElementById(`open-${hourId}`).value;
    const close = document.getElementById(`close-${hourId}`).value;
    const closed = document.getElementById(`closed-${hourId}`).checked;
    
    try {
        const response = await fetch(`${API_URL}/hours/${hourId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ open, close, closed })
        });
        
        if (response.ok) {
            showMessage('contact-message', 'Horaire mis à jour avec succès', 'success');
            setTimeout(() => {
                loadHours();
            }, 500);
        } else {
            const data = await response.json();
            showMessage('contact-message', data.error || 'Erreur lors de la mise à jour', 'error');
        }
    } catch (error) {
        showMessage('contact-message', 'Erreur de connexion', 'error');
    }
}

// Mettre à jour le contact
async function handleContactUpdate(e) {
    e.preventDefault();
    
    const contactData = {
        phone: document.getElementById('contact-phone').value,
        email: document.getElementById('contact-email').value,
        address: document.getElementById('contact-address').value,
        mapsLink: document.getElementById('contact-maps').value
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enregistrement...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(contactData)
        });
        
        if (response.ok) {
            showMessage('contact-message', 'Contact mis à jour avec succès', 'success');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        } else {
            const data = await response.json();
            showMessage('contact-message', data.error || 'Erreur lors de la mise à jour', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        showMessage('contact-message', 'Erreur de connexion', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Modal Pizza
function openAddPizzaModal() {
    currentPizzaId = null;
    document.getElementById('modal-title').textContent = 'Ajouter une pizza';
    document.getElementById('pizza-form').reset();
    document.getElementById('pizza-id').value = '';
    document.getElementById('pizza-message').style.display = 'none';
    document.getElementById('pizza-modal').classList.add('active');
    document.getElementById('pizza-name').focus();
}

function closePizzaModal() {
    document.getElementById('pizza-modal').classList.remove('active');
    document.getElementById('pizza-form').reset();
    document.getElementById('pizza-message').style.display = 'none';
}

async function editPizza(pizzaId) {
    currentPizzaId = pizzaId;
    document.getElementById('modal-title').textContent = 'Modifier une pizza';
    
    try {
        const pizzas = await fetch(`${API_URL}/pizzas`).then(r => r.json());
        const pizza = pizzas.find(p => p._id === pizzaId);
        
        if (pizza) {
            document.getElementById('pizza-id').value = pizza._id;
            document.getElementById('pizza-name').value = pizza.name;
            document.getElementById('pizza-ingredients').value = pizza.ingredients;
            document.getElementById('pizza-price').value = pizza.price;
            document.getElementById('pizza-category').value = pizza.category;
            document.getElementById('pizza-message').style.display = 'none';
            document.getElementById('pizza-modal').classList.add('active');
            document.getElementById('pizza-name').focus();
        }
    } catch (error) {
        showMessage('pizza-message', 'Erreur lors du chargement de la pizza', 'error');
    }
}

async function handlePizzaSubmit(e) {
    e.preventDefault();
    
    const pizzaData = {
        name: document.getElementById('pizza-name').value.trim(),
        ingredients: document.getElementById('pizza-ingredients').value.trim(),
        price: parseFloat(document.getElementById('pizza-price').value),
        category: document.getElementById('pizza-category').value
    };
    
    if (!pizzaData.name || !pizzaData.ingredients || !pizzaData.price) {
        showMessage('pizza-message', 'Veuillez remplir tous les champs', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enregistrement...';
    submitBtn.disabled = true;
    
    try {
        const url = currentPizzaId ? `${API_URL}/pizzas/${currentPizzaId}` : `${API_URL}/pizzas`;
        const method = currentPizzaId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(pizzaData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('pizza-message', currentPizzaId ? 'Pizza modifiée avec succès' : 'Pizza ajoutée avec succès', 'success');
            setTimeout(() => {
                closePizzaModal();
                loadPizzas();
                loadStats();
            }, 1000);
        } else {
            showMessage('pizza-message', data.error || 'Erreur lors de l\'enregistrement', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        showMessage('pizza-message', 'Erreur de connexion', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function deletePizza(pizzaId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette pizza ? Cette action est irréversible.')) return;
    
    try {
        const response = await fetch(`${API_URL}/pizzas/${pizzaId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            showMessage('contact-message', 'Pizza supprimée avec succès', 'success');
            await loadPizzas();
            await loadStats();
        } else {
            const data = await response.json();
            alert(data.error || 'Erreur lors de la suppression');
        }
    } catch (error) {
        alert('Erreur de connexion');
    }
}

// Changer mot de passe
async function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    
    if (newPassword.length < 6) {
        showMessage('password-message', 'Le mot de passe doit contenir au moins 6 caractères', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Changement...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_URL}/admin/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('password-message', 'Mot de passe changé avec succès', 'success');
            document.getElementById('change-password-form').reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        } else {
            showMessage('password-message', data.error || 'Erreur lors du changement', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        showMessage('password-message', 'Erreur de connexion', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Changer username
async function handleUsernameChange(e) {
    e.preventDefault();
    
    const newUsername = document.getElementById('new-username').value.trim();
    
    if (!newUsername) {
        showMessage('username-message', 'Le nom d\'utilisateur ne peut pas être vide', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Changement...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_URL}/admin/change-username`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ newUsername })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('username-message', 'Nom d\'utilisateur changé avec succès', 'success');
            document.getElementById('change-username-form').reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        } else {
            showMessage('username-message', data.error || 'Erreur lors du changement', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        showMessage('username-message', 'Erreur de connexion', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Navigation entre sections
function showSection(sectionName) {
    // Cacher toutes les sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Retirer active de tous les boutons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Afficher la section demandée
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Activer le bouton correspondant
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // Si appelé programmatiquement, trouver le bon bouton
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if (btn.textContent.includes(sectionName === 'overview' ? 'Vue' : 
                                        sectionName === 'pizzas' ? 'Pizzas' :
                                        sectionName === 'contact' ? 'Contact' :
                                        sectionName === 'hours' ? 'Horaires' : 'Paramètres')) {
                btn.classList.add('active');
            }
        });
    }
    
    // Recharger les données si nécessaire
    if (sectionName === 'pizzas') {
        loadPizzas();
    } else if (sectionName === 'hours') {
        loadHours();
    }
}
