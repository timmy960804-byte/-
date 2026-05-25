// main.js - ?????? ????湔???????
const DEFAULT_USERS = [
    { username: '?嚗察???@o365.fcu.edu.tw', password: '123', role: 'user', points: 150, carbon_credits: 25.5, status: 'approved' },
    { username: '?嚗察??頩?撒??, password: '123', role: 'merchant', points: 0, carbon_credits: 0, status: 'approved' },
    { username: '?嚗察??????, password: '123', role: 'merchant', points: 0, carbon_credits: 0, status: 'approved' },
    { username: '???航?????, password: '123', role: 'merchant', points: 0, carbon_credits: 0, status: 'approved' },
    { username: '??撗急謅????, password: 'admin', role: 'merchant', points: 0, carbon_credits: 0, status: 'approved' },
    { username: 'admin', password: '123', role: 'admin', points: 0, carbon_credits: 0, status: 'approved' }
];

const DEFAULT_STORES = [
    {id: 1, name: '?嚗察??頩?撒??, address: '?嚗察???0??, lat: 24.1800, lng: 120.6480, food_boxes: [
        {id: 101, name: '?謜?????(???)', quantity: 3, price: 80, pickup_time: '19:00 - 20:00'},
        {id: 102, name: '?豯改???(???)', quantity: 1, price: 95, pickup_time: '19:00 - 20:00'}
    ]},
    {id: 2, name: '????鈭????', address: '??秋??00??, lat: 24.1770, lng: 120.6450, food_boxes: [
        {id: 103, name: '????豯改???(???)', quantity: 5, price: 120, pickup_time: '20:00 - 21:00'}
    ]},
    {id: 3, name: '?嚗察??????, address: '?啾???00??, lat: 24.1810, lng: 120.6475, food_boxes: [
        {id: 104, name: '?秋高?????瞏? (???)', quantity: 8, price: 50, pickup_time: '21:30 - 23:00'}
    ]},
    {id: 4, name: '???航?????, address: '??秋??1??, lat: 24.1765, lng: 120.6460, food_boxes: [
        {id: 105, name: '?????蝖??3??(?????', quantity: 10, price: 30, pickup_time: '21:00 - 22:00'},
        {id: 106, name: '????2??(?????', quantity: 4, price: 20, pickup_time: '21:00 - 22:00'}
    ]},
    {id: 5, name: '??撗急謅????, address: '?嚗察??剜憌?????, lat: 24.1788, lng: 120.6467, food_boxes: [
        {id: 107, name: '??撗急???A (??蹌?蟡疵)', quantity: 100, price: 10, pickup_time: '??訾?'}
    ]}
];

// ?豲??殉?謘?蝞????
const DEFAULT_ORDERS = [];

// ?豲??堊??????const DEFAULT_REVIEWS = [
    { id: 1, storeId: 1, username: '?嚗察???', rating: 5, comment: '?頩?????????止????????剜?', date: '2026-05-24' },
    { id: 2, storeId: 2, username: '???????, rating: 4, comment: '?豯改?????單???????????????????綽????, date: '2026-05-25' },
    { id: 3, storeId: 3, username: '?嚗察???', rating: 5, comment: '???寥???????????????????, date: '2026-05-25' }
];

// ?豲??謘??謕?
function initDB() {
    const dbVersion = 'v2.0'; // ????蝞賃??皜⊥????????????荒??
    if (localStorage.getItem('sf_db_version') !== dbVersion) {
        localStorage.removeItem('sf_users');
        localStorage.removeItem('sf_stores');
        localStorage.removeItem('sf_orders');
        localStorage.removeItem('sf_reviews');
        localStorage.setItem('sf_db_version', dbVersion);
    }

    if (!localStorage.getItem('sf_users')) {
        localStorage.setItem('sf_users', JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem('sf_stores')) {
        localStorage.setItem('sf_stores', JSON.stringify(DEFAULT_STORES));
    }
    if (!localStorage.getItem('sf_orders')) {
        localStorage.setItem('sf_orders', JSON.stringify(DEFAULT_ORDERS));
    }
    if (!localStorage.getItem('sf_reviews')) {
        localStorage.setItem('sf_reviews', JSON.stringify(DEFAULT_REVIEWS));
    }
}

function getUsers() { return JSON.parse(localStorage.getItem('sf_users')); }
function getStores() { return JSON.parse(localStorage.getItem('sf_stores')); }
function getOrders() { return JSON.parse(localStorage.getItem('sf_orders')); }
function getReviews() { return JSON.parse(localStorage.getItem('sf_reviews')) || []; }

function saveUsers(users) { localStorage.setItem('sf_users', JSON.stringify(users)); }
function saveStores(stores) { localStorage.setItem('sf_stores', JSON.stringify(stores)); }
function saveOrders(orders) { localStorage.setItem('sf_orders', JSON.stringify(orders)); }
function saveReviews(reviews) { localStorage.setItem('sf_reviews', JSON.stringify(reviews)); }

// Auth Helpers
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('sf_currentUser'));
}
function setCurrentUser(user) {
    localStorage.setItem('sf_currentUser', JSON.stringify(user));
}
function logout() {
    localStorage.removeItem('sf_currentUser');
    window.location.href = 'index.html';
}
function updateNav() {
    const user = getCurrentUser();
    const navUl = document.getElementById('nav-links');
    if (!navUl) return;

    if (!user) {
        navUl.innerHTML = `
            <li><a href="index.html" class="nav-link">??????</a></li>
            <li><a href="login.html" class="nav-link" style="background: var(--primary); color: white;">?擗 / ?桅??</a></li>
        `;
    } else if (user.role === 'admin') {
        navUl.innerHTML = `
            <li><a href="index.html" class="nav-link">???</a></li>
            <li><a href="admin.html" class="nav-link" style="color: #EF4444; font-weight: bold;">??蝯????綽??/a></li>
            <li><a href="#" class="nav-link" onclick="logout()">?擗 (Admin)</a></li>
        `;
    } else if (user.role === 'merchant') {
        navUl.innerHTML = `
            <li><a href="index.html" class="nav-link">??????</a></li>
            <li><a href="store.html" class="nav-link">?制??舀?綜 (??豱?????</a></li>
            <li><a href="#" class="nav-link" onclick="logout()">?擗 (${user.username})</a></li>
        `;
    } else {
        navUl.innerHTML = `
            <li><a href="index.html" class="nav-link">??????</a></li>
            <li><a href="profile.html" class="nav-link">??????</a></li>
            <li><a href="#" class="nav-link" onclick="logout()">?擗 (${user.username})</a></li>
        `;
    }
}

// ?蹓遴??蹎??綽貔?document.addEventListener('DOMContentLoaded', () => {
    initDB();
    updateNav();
    const currentPath = window.location.pathname;

    if (currentPath.endsWith('admin.html')) {
        const user = getCurrentUser();
        if (!user || user.role !== 'admin') {
            alert('???嚗??????殉朱???);
            window.location.href = 'login.html';
            return;
        }
        renderAdminDashboard();
    } else if (currentPath.endsWith('store.html')) {
        const user = getCurrentUser();
        if (!user || user.role !== 'merchant') {
            alert('???嚗?????啣???謖??ｇ??????啣???賹貝?銋?);
            window.location.href = 'login.html';
            return;
        }
        if (user.status === 'pending') {
            alert('?函?摨振撣唾?甇?蝑?蝞∠??∪祟?訾葉嚗?瘜脣敺??);
            window.location.href = 'index.html';
            return;
        }
        setupStoreForm(user);
        renderStoreOrders(user);
        if (typeof renderStoreDashboard === 'function') renderStoreDashboard(user);
    } else if (currentPath.endsWith('profile.html')) {
        const user = getCurrentUser();
        if (!user || user.role !== 'user') {
            alert('???嚗?????????領???謖??ｇ?謒?鈭止????貔踱?);
            window.location.href = 'login.html';
            return;
        }
        renderProfile(user);
    } else if (currentPath.endsWith('login.html')) {
        setupLogin();
    } else if (currentPath.endsWith('register.html')) {
        setupRegister();
    } else {
        renderIndex();
    }
});

function setupLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('username').value;
        const p = document.getElementById('password').value;
        const users = getUsers();
        const found = users.find(x => x.username === u && x.password === p);
        if (found) {
            if (found.role === 'merchant' && found.status === 'pending') {
                alert('?擗?????n???垮蹌????啣???賹???縣????綽?????赯梢???????賹???迎??謅???);
            }
            setCurrentUser(found);
            window.location.href = found.role === 'admin' ? 'admin.html' : 'index.html';
        } else {
            alert('????謘???蔭?甇?');
        }
    });
}

function setupRegister() {
    const form = document.getElementById('register-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const role = document.querySelector('input[name="role"]:checked').value;
        const u = document.getElementById('reg_username').value;
        const p = document.getElementById('reg_password').value;
        
        const users = getUsers();
        if (users.find(x => x.username === u)) {
            alert('??????制???????????ｇ?謆?謜????????);
            return;
        }

        if (role === 'user') {
            if (!u.endsWith('@o365.fcu.edu.tw') && !u.endsWith('@mail.fcu.edu.tw')) {
                alert('?株???ｇ????詹嚗察??賤??喲擗? (@o365.fcu.edu.tw ??@mail.fcu.edu.tw)??);
                return;
            }
        }

        const newUser = { username: u, password: p, role: role, points: 0, carbon_credits: 0 };
        if (role === 'merchant') {
            newUser.status = 'pending';
        } else {
            newUser.status = 'approved';
        }
        
        users.push(newUser);
        saveUsers(users);
        setCurrentUser(newUser);
        
        if (role === 'merchant') {
            alert('?桅??????撮蹌????啣???賹??蹓箸摹?????芰??閰領?);
        } else {
            alert('?桅??????撮餈剝????鈭文?伐???﹦?);
        }
        window.location.href = 'index.html';
    });
}

let currentBoxToReserve = null;
let mapInstance = null;
let markersLayer = null;

window.openReserveModal = function(storeId, boxId) {
    const user = getCurrentUser();
    if (!user) {
        alert('?ｇ???擗???????????);
        window.location.href = 'login.html';
        return;
    }
    if (user.role === 'merchant') {
        alert('?制??舀??????????????');
        return;
    }

    const stores = getStores();
    const store = stores.find(s => s.id === storeId);
    const box = store.food_boxes.find(b => b.id === boxId);

    currentBoxToReserve = { store, box };

    const modal = document.getElementById('checkout-modal');
    document.getElementById('modal-box-name').textContent = box.name;
    document.getElementById('modal-store-name').textContent = store.name;
    document.getElementById('modal-price').textContent = box.price;
    
    const freshUser = getUsers().find(u => u.username === user.username);
    setCurrentUser(freshUser);
    
    document.getElementById('modal-user-points').textContent = freshUser.points;
    document.getElementById('point-input').value = 0;
    document.getElementById('point-input').max = Math.min(freshUser.points, box.price);
    window.updateFinalPrice();

    modal.classList.add('active');
};

window.closeReserveModal = function() {
    document.getElementById('checkout-modal').classList.remove('active');
    currentBoxToReserve = null;
};

window.updateFinalPrice = function() {
    if (!currentBoxToReserve) return;
    const price = currentBoxToReserve.box.price;
    const input = document.getElementById('point-input');
    let pointsToUse = parseInt(input.value) || 0;
    
    const user = getCurrentUser();
    if (pointsToUse < 0) pointsToUse = 0;
    if (pointsToUse > user.points) pointsToUse = user.points;
    if (pointsToUse > price) pointsToUse = price;
    input.value = pointsToUse;

    document.getElementById('modal-discount').textContent = `-${pointsToUse}`;
    document.getElementById('modal-final').textContent = price - pointsToUse;
};

window.confirmCheckout = function() {
    if (!currentBoxToReserve) return;
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
    
    if (paymentMethod === 'store') {
        processOrder('unpaid');
    } else {
        // Online payment simulation
        const checkoutModal = document.getElementById('checkout-modal');
        const simulationModal = document.getElementById('payment-simulation-modal');
        const processingDiv = document.getElementById('payment-processing');
        const successDiv = document.getElementById('payment-success');
        
        checkoutModal.classList.remove('active');
        simulationModal.classList.add('active');
        processingDiv.style.display = 'block';
        successDiv.style.display = 'none';
        
        setTimeout(() => {
            processingDiv.style.display = 'none';
            successDiv.style.display = 'block';
            
            setTimeout(() => {
                simulationModal.classList.remove('active');
                processOrder('paid_online');
            }, 1500);
        }, 2000);
    }
};

function processOrder(status) {
    const user = getCurrentUser();
    const pointsToUse = parseInt(document.getElementById('point-input').value) || 0;
    const finalPrice = currentBoxToReserve.box.price - pointsToUse;
    const earnedPoints = Math.floor(finalPrice * 0.1);

    const stores = getStores();
    const store = stores.find(s => s.id === currentBoxToReserve.store.id);
    const box = store.food_boxes.find(b => b.id === currentBoxToReserve.box.id);
    if (box.quantity <= 0) {
        alert('?綽???????????⊥伍??????);
        window.closeReserveModal();
        renderIndex();
        return;
    }
    
    box.quantity -= 1;
    saveStores(stores);

    const users = getUsers();
    const dbUser = users.find(u => u.username === user.username);
    dbUser.points -= pointsToUse;
    saveUsers(users);
    setCurrentUser(dbUser); 

    const orders = getOrders();
    const today = new Date().toISOString().split('T')[0];
    const newOrder = {
        id: Date.now().toString(),
        date: today,
        username: user.username,
        storeName: store.name,
        boxName: box.name,
        finalPrice: finalPrice,
        pointsUsed: pointsToUse,
        earnedPoints: earnedPoints,
        carbonSaved: 1.2,
        status: status 
    };
    orders.push(newOrder);
    saveOrders(orders);

    if (status === 'unpaid') {
        alert(`???????撫?????制???謖??朵??蹐彫????????{finalPrice} ??喇蹐彫?制??航蝞????綽???????? ${earnedPoints} ?綜竣???? 1.2kg ??嚗?????);
        window.closeReserveModal();
    }
    renderIndex();
}

function renderIndex() {
    const stores = getStores();
    const container = document.getElementById('boxes-container');
    const mapContainer = document.getElementById('map');
    
    let available_boxes = [];
    stores.forEach(store => {
        store.food_boxes.forEach(box => {
            if (box.quantity > 0) {
                available_boxes.push({ store, box });
            }
        });
    });

    // ?????
    if (mapContainer && typeof L !== 'undefined') {
        if (!mapInstance) {
            // ?豲??謘澗秘?謖?????綜策蹌?嚗察??剜憌??賃?
            mapInstance = L.map('map').setView([24.1788, 120.6467], 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(mapInstance);
            markersLayer = L.layerGroup().addTo(mapInstance);
        } else {
            markersLayer.clearLayers();
        }

        // ?蝞????????啣?謘?豯支????
        const storesWithBoxes = stores.filter(store => store.food_boxes.some(b => b.quantity > 0));
        storesWithBoxes.forEach(store => {
            if (store.lat && store.lng) {
                const totalBoxes = store.food_boxes.reduce((sum, box) => sum + (box.quantity > 0 ? box.quantity : 0), 0);
                const marker = L.marker([store.lat, store.lng]).addTo(markersLayer);
                marker.bindPopup(`
                    <div style="text-align:center; padding: 5px;">
                        <strong style="color: var(--primary-dark); font-size: 1.1rem;">${store.name}</strong><br>
                        <span style="color: var(--text-muted); font-size: 0.9rem;">${store.address}</span><br>
                        <div style="display: inline-block; background: #FEF3C7; color: #D97706; padding: 4px 8px; border-radius: 4px; margin-top: 8px; font-weight: bold;">
                            ?獢???${totalBoxes} ?郭?扳??                        </div>
                    </div>
                `);
            }
        });
    }

    if (!container) return;

    if (available_boxes.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; background: var(--bg-card); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm);">
                <p style="font-size: 1.25rem; color: var(--text-muted);">?獢????????謘?????雿??謍????????????</p>
            </div>
        `;
        return;
    }

    const reviews = getReviews();

    container.innerHTML = available_boxes.map(item => {
        const storeReviews = reviews.filter(r => r.storeId === item.store.id);
        const avgRating = storeReviews.length > 0 
            ? (storeReviews.reduce((sum, r) => sum + parseInt(r.rating), 0) / storeReviews.length).toFixed(1)
            : '??;
        const reviewText = storeReviews.length > 0 ? `${avgRating} (${storeReviews.length})` : '?垓???';

        const imageHtml = item.box.image ? <img src="${item.box.image}" alt="meal" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;"> : '';
        return ` 
        <div class="card">
            ${imageHtml}
            <span class="tag">???垮? ${item.box.quantity} ??/span>
            <h3>${item.box.name}</h3>
            <p style="display: flex; align-items: center; gap: 8px;">
                <strong>????制??臬??/strong> ${item.store.name}
                <span class="store-rating-badge" onclick="openReviewModal(${item.store.id}, '${item.store.name}')">瞏?${reviewText}</span>
            </p>
            <p><strong>?? ?????/strong> ${item.store.address}</p>
            <p><strong>???蹇???/strong> ${item.box.pickup_time}</p>
            <p style="color: var(--primary-dark); font-weight: bold; font-size: 1.4rem; margin-top: auto; margin-bottom: 1rem;">???NT$ ${item.box.price}</p>
            <button onclick="openReserveModal(${item.store.id}, ${item.box.id})">?∴??????謢?</button>
        </div>
        `;
    }).join('');
}

function setupStoreForm(user) {
    const form = document.getElementById('store-form');
    if (!form) return;
    
    const storeInput = document.getElementById('store_name');
    storeInput.value = user.username;
    storeInput.readOnly = true;
    storeInput.style.backgroundColor = '#E5E7EB';

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const box_name = document.getElementById('box_name').value;
        const quantity = document.getElementById('quantity').value;
        const price = document.getElementById('price').value;
        const pickup_time = document.getElementById('pickup_time').value;

        const stores = getStores();
        let store = stores.find(s => s.name === user.username);
        
        const saveBoxData = (imageUrl) => {
            if (store) {
                store.food_boxes.push({
                    id: Date.now(), 
                    name: box_name,
                    quantity: parseInt(quantity),
                    price: parseInt(price),
                    pickup_time: pickup_time,
                    image: imageUrl
                });
            } else {
                const randomLat = 24.1788 + (Math.random() - 0.5) * 0.005;
                const randomLng = 120.6467 + (Math.random() - 0.5) * 0.005;
                
                stores.push({
                    id: Date.now(),
                    name: user.username,
                    address: '請於系統更新後設定 (目前為預設地點)',
                    lat: randomLat,
                    lng: randomLng,
                    food_boxes: [{
                        id: Date.now() + 1,
                        name: box_name,
                        quantity: parseInt(quantity),
                        price: parseInt(price),
                        pickup_time: pickup_time,
                        image: imageUrl
                    }]
                });
            }
            saveStores(stores);
            alert('成功上架！餐盒已同步更新。');
            window.location.reload();
        };

        const box_image_input = document.getElementById('box_image');
        if (box_image_input && box_image_input.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(e) {
                saveBoxData(e.target.result);
            };
            reader.readAsDataURL(box_image_input.files[0]);
        } else {
            saveBoxData(null);
        }
    });
}

function renderStoreOrders(user) {
    const tbody = document.getElementById('store-orders-tbody');
    if (!tbody) return;

    const orders = getOrders().filter(o => o.storeName === user.username);
    
    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem;">?獢????????獢???/td></tr>`;
        return;
    }

    orders.sort((a, b) => {
        if (a.status !== 'completed' && b.status === 'completed') return -1;
        if (a.status === 'completed' && b.status !== 'completed') return 1;
        return b.id - a.id;
    });

    tbody.innerHTML = orders.map(o => `
        <tr>
            <td style="font-size: 0.85rem; color: #6B7280;">#${o.id.slice(-6)}</td>
            <td><strong>${o.username}</strong></td>
            <td>${o.boxName}</td>
            <td style="color: var(--primary-dark); font-weight: bold;">NT$ ${o.finalPrice}</td>
            <td>
                ${o.status === 'unpaid' 
                    ? '<span class="status-badge" style="background: #FEF3C7; color: #D97706;">?綽?謅???/span>' 
                    : o.status === 'paid_online' 
                        ? '<span class="status-badge" style="background: #DBEAFE; color: #1D4ED8;">??????/span>'
                        : '<span class="status-badge" style="background: #D1FAE5; color: #047857;">????/span>'}
            </td>
            <td>
                ${o.status === 'unpaid' 
                    ? `<button onclick="merchantConfirmOrder('${o.id}')" style="padding: 0.5rem 1rem; font-size: 0.9rem; margin-top: 0; background: linear-gradient(135deg, var(--secondary), #FBBF24);">蝣箄??嗆狡</button>` 
                    : o.status === 'paid_online'
                        ? `<button onclick="merchantConfirmOrder('${o.id}')" style="padding: 0.5rem 1rem; font-size: 0.9rem; margin-top: 0; background: linear-gradient(135deg, #3B82F6, #2563EB);">蝣箄???</button>
                           <button onclick="merchantConfirmOrder('${o.id}', true)" style="padding: 0.5rem 1rem; font-size: 0.9rem; margin-top: 0.5rem; width: 100%; background: #10B981; color: white;">? ?Ⅳ?賊</button>`
                        : '<span style="color: var(--text-muted);">撌脩?皜?/span>'}
            </td>
        </tr>
    `).join('');
}

window.merchantConfirmOrder = function(orderId, isQR = false) {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (isQR) {
        if(!confirm('璅⊥????嚗Ⅱ隤?瑟迨閮嚗?)) return;
    } else {
        if (order.status === 'unpaid') {
            if(!confirm('蝣箄?閰脤“摰Ｗ歇?啣???銝虫?皜狡??')) return;
        } else {
            if(!confirm('蝣箄?閰脤“摰Ｗ歇?啣??粥擗?嚗?)) return;
        }
    }

    order.status = 'completed';
    saveOrders(orders);

    const users = getUsers();
    const dbUser = users.find(u => u.username === order.username);
    if (dbUser) {
        dbUser.points += order.earnedPoints;
        dbUser.carbon_credits = parseFloat((dbUser.carbon_credits + order.carbonSaved).toFixed(2));
        saveUsers(users);
    }

    const message = order.status === 'unpaid' ? '撌脩Ⅱ隤甈橘?' : '撌脩Ⅱ隤?擗?';
    alert(`${message}\n撌脣? ${order.earnedPoints} 暺?策瘨祥??${order.username}?);
    renderStoreOrders(getCurrentUser());
    if (typeof renderStoreDashboard === 'function') renderStoreDashboard(getCurrentUser());
};

function renderProfile(user) {
    const freshUser = getUsers().find(u => u.username === user.username);
    
    const userNameEl = document.getElementById('user-name');
    const userPointsEl = document.getElementById('user-points');
    const userCarbonEl = document.getElementById('user-carbon');
    const historyTbody = document.getElementById('history-tbody');

    if (userNameEl) userNameEl.textContent = freshUser.username;
    if (userPointsEl) userPointsEl.textContent = freshUser.points;
    if (userCarbonEl) userCarbonEl.textContent = freshUser.carbon_credits;

    if (historyTbody) {
        const myOrders = getOrders().filter(o => o.username === freshUser.username);
        myOrders.sort((a, b) => b.id - a.id);

        if (myOrders.length === 0) {
            historyTbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 3rem;">?垮謓???????????蝧?擏??蹓??????/td>
                </tr>
            `;
        } else {
            historyTbody.innerHTML = myOrders.map(record => `
                <tr>
                    <td>${record.date}</td>
                    <td><strong>${record.storeName}</strong></td>
                    <td>${record.boxName}</td>
                    <td>${record.pointsUsed > 0 ? `<span style="color: #EF4444; font-weight: 600;">-${record.pointsUsed}</span>` : '-'}</td>
                    <td>
                        ${record.status === 'unpaid'
                            ? `<span class="status-badge" style="background: #FEF3C7; color: #D97706;">?綽?謅???/span>`
                            : record.status === 'paid_online'
                                ? `<span class="status-badge" style="background: #DBEAFE; color: #1D4ED8;">??????/span>`
                                : `<span class="status-badge status-completed">????/span> <span class="points-earned" style="margin-left: 8px;">+${record.earnedPoints}</span>`
                        }
                    </td>
                    <td>${record.status === 'completed' ? record.carbonSaved : '-'}</td>
                </tr>
            `).join('');
        }
    }
}

let currentReviewStoreId = null;

window.openReviewModal = function(storeId, storeName) {
    currentReviewStoreId = storeId;
    const modal = document.getElementById('review-modal');
    if (!modal) return;
    
    document.getElementById('review-store-name').textContent = `${storeName} - ?制??舫??`;
    
    const user = getCurrentUser();
    const formContainer = document.getElementById('review-form-container');
    const loginPrompt = document.getElementById('review-login-prompt');
    const form = document.getElementById('submit-review-form');

    if (user && user.role === 'user') {
        formContainer.style.display = 'block';
        loginPrompt.style.display = 'none';
        
        // Remove old event listener by replacing the form
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        newForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rating = document.getElementById('review-rating').value;
            const comment = document.getElementById('review-comment').value;
            
            const allReviews = getReviews();
            const today = new Date().toISOString().split('T')[0];
            
            allReviews.push({
                id: Date.now(),
                storeId: currentReviewStoreId,
                username: user.username,
                rating: parseInt(rating),
                comment: comment,
                date: today
            });
            
            saveReviews(allReviews);
            alert('?賹?????堊????);
            
            // Re-render modal content and update index
            window.openReviewModal(currentReviewStoreId, storeName);
            renderIndex();
        });
    } else {
        formContainer.style.display = 'none';
        loginPrompt.style.display = 'block';
    }

    // Render reviews list
    const container = document.getElementById('reviews-container');
    const storeReviews = getReviews().filter(r => r.storeId === storeId);
    storeReviews.sort((a, b) => b.id - a.id); // newest first

    if (storeReviews.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 2rem 0;">?獢??????Ｙ??謕??堊???????交斯??????/p>`;
    } else {
        container.innerHTML = storeReviews.map(r => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">${r.username}</span>
                    <span class="review-date">${r.date}</span>
                </div>
                <div style="margin-bottom: 5px; color: #F59E0B; font-size: 0.9rem;">
                    ${'??.repeat(r.rating)}${'??.repeat(5 - r.rating)}
                </div>
                <div class="review-comment">${r.comment}</div>
            </div>
        `).join('');
    }

    modal.classList.add('active');
};

window.closeReviewModal = function() {
    const modal = document.getElementById('review-modal');
    if (modal) modal.classList.remove('active');
    currentReviewStoreId = null;
};

// ==========================================
// Admin Backend Logic
// ==========================================
window.renderAdminDashboard = function() {
    const orders = getOrders();
    const users = getUsers();
    
    // Stats
    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalFood = completedOrders.length;
    const totalCarbon = completedOrders.reduce((sum, o) => sum + (o.carbonSaved || 0), 0).toFixed(1);
    const totalPoints = completedOrders.reduce((sum, o) => sum + (o.earnedPoints || 0), 0);
    
    const foodEl = document.getElementById('admin-total-food');
    const carbonEl = document.getElementById('admin-total-carbon');
    const pointsEl = document.getElementById('admin-total-points');
    
    if (foodEl) foodEl.textContent = totalFood;
    if (carbonEl) carbonEl.textContent = totalCarbon;
    if (pointsEl) pointsEl.textContent = totalPoints;

    // Pending Approvals
    const pendingTbody = document.getElementById('admin-pending-tbody');
    if (!pendingTbody) return;

    const pendingMerchants = users.filter(u => u.role === 'merchant' && u.status === 'pending');
    
    if (pendingMerchants.length === 0) {
        pendingTbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-muted);">?桀?瘝?敺祟?貊?摨振</td></tr>';
        return;
    }

    pendingTbody.innerHTML = pendingMerchants.map(m => 
        <tr style="border-bottom: 1px solid var(--glass-border);">
            <td style="padding: 1rem;"><strong></strong></td>
            <td style="padding: 1rem;">??摨振</td>
            <td style="padding: 1rem;"><span style="background: #FEF3C7; color: #D97706; padding: 4px 8px; border-radius: 999px; font-size: 0.85rem; font-weight: bold;">敺祟??/span></td>
            <td style="padding: 1rem;">
                <button onclick="approveMerchant('\')" style="background: #10B981; margin: 0 0.5rem 0 0; padding: 0.4rem 0.8rem; font-size: 0.85rem;">?詨?</button>
                <button onclick="rejectMerchant('\')" style="background: #EF4444; margin: 0; padding: 0.4rem 0.8rem; font-size: 0.85rem;">???/button>
            </td>
        </tr>
    ).join('');
};

window.approveMerchant = function(username) {
    if(!confirm('蝣箏?閬??摰?' + username + ' ??')) return;
    const users = getUsers();
    const user = users.find(u => u.username === username);
    if (user) {
        user.status = 'approved';
        saveUsers(users);
        alert('撌脫??摰?' + username + '嚗?);
        renderAdminDashboard();
    }
};

window.rejectMerchant = function(username) {
    if(!confirm('蝣箏?閬??摰?' + username + ' ?隢?嚗迨??撠?方府撣唾???)) return;
    let users = getUsers();
    users = users.filter(u => u.username !== username);
    saveUsers(users);
    alert('撌脤??摰?' + username + '??);
    renderAdminDashboard();
};


window.renderStoreDashboard = function(user) {
    const orders = getOrders().filter(o => o.storeName === user.username && o.status === 'completed');
    const totalFood = orders.length;
    const totalCarbon = orders.reduce((sum, o) => sum + (o.carbonSaved || 0), 0).toFixed(1);
    
    const foodEl = document.getElementById('store-total-food');
    const carbonEl = document.getElementById('store-total-carbon');
    
    if (foodEl) foodEl.textContent = totalFood;
    if (carbonEl) carbonEl.textContent = totalCarbon;
};



window.redeemReward = function(cost, itemName) {
    const users = getUsers();
    const user = getCurrentUser();
    const dbUser = users.find(u => u.username === user.username);
    
    if (dbUser.points < cost) {
        alert('點數不足！兌換 ' + itemName + ' 需要 ' + cost + ' 點，您目前只有 ' + dbUser.points + ' 點。');
        return;
    }
    
    if (confirm('確定要花費 ' + cost + ' 點兌換「' + itemName + '」嗎？')) {
        dbUser.points -= cost;
        saveUsers(users);
        setCurrentUser(dbUser);
        alert('兌換成功！已扣除 ' + cost + ' 點。請至對應地點出示畫面領取或使用。');
        renderProfile(getCurrentUser()); // refresh points
    }
};

window.showQRCode = function(orderId) {
    const modal = document.getElementById('qr-modal');
    const orderIdText = document.getElementById('qr-order-id');
    if (modal && orderIdText) {
        orderIdText.textContent = '訂單編號: #' + orderId.slice(-6);
        modal.classList.add('active');
    }
};




