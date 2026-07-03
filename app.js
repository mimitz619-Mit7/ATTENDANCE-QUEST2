// ==================== GAME STATE ====================
let gameState = {
    students: [],
    settings: {
        expPerDay: 100,
        goldPerDay: 50,
        dailyBonusGold: 25,
        expMultiplier: 1.15
    },
    todayDate: new Date().toDateString(),
    quests: [
        {
            id: 1,
            title: "Perfect Attendance",
            description: "Be present for 5 consecutive days",
            icon: "📅",
            reward: { exp: 200, gold: 100 },
            condition: (student) => student.currentStreak >= 5,
            completed: false
        },
        {
            id: 2,
            title: "Level Master",
            description: "Reach Level 10",
            icon: "⭐",
            reward: { exp: 500, gold: 250 },
            condition: (student) => student.level >= 10,
            completed: false
        },
        {
            id: 3,
            title: "Wealthy Adventurer",
            description: "Accumulate 1000 Gold",
            icon: "💰",
            reward: { exp: 300, gold: 200 },
            condition: (student) => student.gold >= 1000,
            completed: false
        },
        {
            id: 4,
            title: "Streak Warrior",
            description: "Achieve a 10-day attendance streak",
            icon: "🔥",
            reward: { exp: 400, gold: 300 },
            condition: (student) => student.longestStreak >= 10,
            completed: false
        },
        {
            id: 5,
            title: "Collection Master",
            description: "Unlock 5 weapons",
            icon: "⚔️",
            reward: { exp: 250, gold: 150 },
            condition: (student) => student.inventory.weapons.filter(w => w.unlocked).length >= 5,
            completed: false
        }
    ],
shopItems: {
    weapons: [
        { 
            id: 'starter_sword', 
            name: 'Starter Sword', 
            icon: '🗡️', 
            image: 'assets/weapons/starter_sword.png',
            rarity: 'common', 
            price: 0, 
            description: 'Your first blade', 
            unlocked: true 
        },
        { 
            id: 'iron_sword', 
            name: 'Iron Sword', 
            icon: '⚔️', 
            image: 'assets/weapons/iron_sword.png',
            rarity: 'uncommon', 
            price: 100, 
            description: 'Sturdy blade', 
            unlocked: false 
        },
        { 
            id: 'steel_sword', 
            name: 'Steel Sword', 
            icon: '🗡️', 
            image: 'assets/weapons/steel_sword.png',
            rarity: 'rare', 
            price: 250, 
            description: 'Premium weapon', 
            unlocked: false 
        },
        { 
            id: 'dragon_slayer', 
            name: 'Dragon Slayer', 
            icon: '🐉', 
            image: 'assets/weapons/dragon_slayer.png',
            rarity: 'epic', 
            price: 500, 
            description: 'Beast killer', 
            unlocked: false 
        },
        { 
            id: 'mythic_weapon', 
            name: 'Mythic Weapon', 
            icon: '✨', 
            image: 'assets/weapons/mythic_weapon.png',
            rarity: 'legendary', 
            price: 1000, 
            description: 'Ultimate power', 
            unlocked: false 
        }
    ],
    armor: [
        { 
            id: 'leather_armor', 
            name: 'Leather Armor', 
            icon: '🛡️', 
            image: 'assets/armor/leather_armor.png',
            rarity: 'common', 
            price: 0, 
            description: 'Basic protection', 
            unlocked: true 
        },
        { 
            id: 'iron_armor', 
            name: 'Iron Armor', 
            icon: '⛑️', 
            image: 'assets/armor/iron_armor.png',
            rarity: 'uncommon', 
            price: 120, 
            description: 'Solid defense', 
            unlocked: false 
        },
        { 
            id: 'steel_armor', 
            name: 'Steel Armor', 
            icon: '🛡️', 
            image: 'assets/armor/steel_armor.png',
            rarity: 'rare', 
            price: 300, 
            description: 'Strong gear', 
            unlocked: false 
        },
        { 
            id: 'golden_armor', 
            name: 'Golden Armor', 
            icon: '👑', 
            image: 'assets/armor/golden_armor.png',
            rarity: 'epic', 
            price: 600, 
            description: 'Royal protection', 
            unlocked: false 
        },
        { 
            id: 'dragon_armor', 
            name: 'Dragon Armor', 
            icon: '🐲', 
            image: 'assets/armor/dragon_armor.png',
            rarity: 'legendary', 
            price: 1200, 
            description: 'Ultimate defense', 
            unlocked: false 
        }
    ],
        skins: [
            { id: 'default', name: 'Default', icon: '👤', rarity: 'common', price: 0, description: 'Classic look', unlocked: true },
            { id: 'shadow', name: 'Shadow Warrior', icon: '🌑', rarity: 'uncommon', price: 80, description: 'Dark theme', unlocked: false },
            { id: 'flame', name: 'Flame Knight', icon: '🔥', rarity: 'rare', price: 200, description: 'Fire themed', unlocked: false },
            { id: 'frost', name: 'Frost Mage', icon: '❄️', rarity: 'epic', price: 400, description: 'Ice magic style', unlocked: false },
            { id: 'celestial', name: 'Celestial Avatar', icon: '⭐', rarity: 'legendary', price: 800, description: 'Cosmic power', unlocked: false }
        ]
    }
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    loadGameState();
    initializeEventListeners();
    renderDashboard();
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 1000);
});

// ==================== DATA PERSISTENCE ====================
function loadGameState() {
    const saved = localStorage.getItem('attendanceQuestState');
    if (saved) {
        const loadedState = JSON.parse(saved);
        gameState.students = loadedState.students || [];
        gameState.settings = { ...gameState.settings, ...loadedState.settings };
        gameState.todayDate = loadedState.todayDate || new Date().toDateString();
    }
    checkDailyLogin();
}

function saveGameState() {
    const stateToSave = {
        students: gameState.students,
        settings: gameState.settings,
        todayDate: gameState.todayDate
    };
    localStorage.setItem('attendanceQuestState', JSON.stringify(stateToSave));
}

function checkDailyLogin() {
    const today = new Date().toDateString();
    if (gameState.todayDate !== today) {
        gameState.todayDate = today;
        gameState.students.forEach(student => {
            student.lastLoginBonus = student.lastLoginBonus || {};
            if (!student.lastLoginBonus[today]) {
                student.gold += gameState.settings.dailyBonusGold;
                student.lastLoginBonus[today] = true;
                showNotification(`${student.name} received daily login bonus! +${gameState.settings.dailyBonusGold} Gold`, 'success');
            }
        });
        saveGameState();
    }
}

// ==================== EVENT LISTENERS ====================
function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchView(e.target.dataset.view));
    });

    // Dashboard
    document.getElementById('addStudentBtn').addEventListener('click', addStudent);
    document.getElementById('studentNameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addStudent();
    });
    document.getElementById('markAttendanceBtn').addEventListener('click', markAttendance);

    // Inventory
    document.getElementById('inventoryStudentSelect').addEventListener('change', (e) => {
        renderInventory(e.target.value);
    });

    // Leaderboard tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderLeaderboard(e.target.dataset.tab);
        });
    });

    // Quests
    document.getElementById('questsList').addEventListener('click', (e) => {
        const questItem = e.target.closest('.quest-item');
        if (questItem) {
            showQuestDetails(questItem.dataset.questId);
        }
    });

    // Shop
    document.getElementById('shopStudentSelect').addEventListener('change', (e) => {
        updateShopForStudent(e.target.value);
    });

    document.querySelectorAll('.shop-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.shop-tab').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderShop(e.target.dataset.shopTab);
        });
    });

    // Settings
    document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
    document.getElementById('clearDataBtn').addEventListener('click', clearAllData);
    document.getElementById('exportDataBtn').addEventListener('click', exportData);

    // Modal
    const modal = document.getElementById('questModal');
    const closeBtn = document.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => modal.classList.remove('show'));
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
    });
}

// ==================== VIEW MANAGEMENT ====================
function switchView(viewName) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(`${viewName}-view`).classList.add('active');
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

    if (viewName === 'dashboard') renderDashboard();
    if (viewName === 'students') renderStudents();
    if (viewName === 'inventory') renderInventoryView();
    if (viewName === 'leaderboard') renderLeaderboard('exp');
    if (viewName === 'quests') renderQuestsView();
    if (viewName === 'shop') renderShopView();
}

// ==================== STUDENT MANAGEMENT ====================
function addStudent() {
    const input = document.getElementById('studentNameInput');
    const name = input.value.trim();

    if (!name) {
        showNotification('Please enter a student name!', 'warning');
        return;
    }

    if (gameState.students.some(s => s.name.toLowerCase() === name.toLowerCase())) {
        showNotification('Student already exists!', 'warning');
        return;
    }

    const newStudent = {
        id: Date.now(),
        name: name,
        level: 1,
        exp: 0,
        expToNextLevel: 500,
        gold: 0,
        attendance: [],
        currentStreak: 0,
        longestStreak: 0,
        lastAttendanceDate: null,
        equipment: {
            weapon: 'starter_sword',
            armor: 'leather_armor',
            skin: 'default'
        },
        inventory: {
            weapons: [{ id: 'starter_sword', name: 'Starter Sword', rarity: 'common', unlocked: true }],
            armor: [{ id: 'leather_armor', name: 'Leather Armor', rarity: 'common', unlocked: true }],
            skins: [{ id: 'default', name: 'Default', rarity: 'common', unlocked: true }]
        },
        lastLoginBonus: {},
        questProgress: {}
    };

    gameState.students.push(newStudent);
    saveGameState();
    input.value = '';
    renderStudents();
    showNotification(`🎉 ${name} has joined the quest!`, 'success');
}

function deleteStudent(studentId) {
    const student = gameState.students.find(s => s.id === studentId);
    if (confirm(`Are you sure you want to remove ${student.name}?`)) {
        gameState.students = gameState.students.filter(s => s.id !== studentId);
        saveGameState();
        renderStudents();
        showNotification('Student removed from quest!');
    }
}

// ==================== ATTENDANCE & REWARDS ====================
function markAttendance() {
    const today = new Date().toDateString();
    const markedStudents = document.querySelectorAll('.student-card.marked');

    if (markedStudents.length === 0) {
        showNotification('Please select at least one student!', 'warning');
        return;
    }

    markedStudents.forEach(card => {
        const studentId = parseInt(card.dataset.studentId);
        const student = gameState.students.find(s => s.id === studentId);

        if (student && !student.attendance.includes(today)) {
            // Add attendance
            student.attendance.push(today);

            // Check and update streak
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            if (student.lastAttendanceDate === yesterday) {
                student.currentStreak++;
            } else {
                student.currentStreak = 1;
            }
            student.lastAttendanceDate = today;

            if (student.currentStreak > student.longestStreak) {
                student.longestStreak = student.currentStreak;
            }

            // Award EXP and Gold
            const expGain = gameState.settings.expPerDay;
            const goldGain = gameState.settings.goldPerDay;

            student.exp += expGain;
            student.gold += goldGain;

            // Check for level up
            while (student.exp >= student.expToNextLevel) {
                student.exp -= student.expToNextLevel;
                student.level++;
                student.expToNextLevel = Math.floor(student.expToNextLevel * gameState.settings.expMultiplier);
                showNotification(`🎉 ${student.name} reached Level ${student.level}!`, 'success');
                unlockRewards(student);
            }

            showNotification(`✨ +${expGain} EXP, +${goldGain} Gold for ${student.name}!`);
        }
    });

    saveGameState();
    renderDashboard();
}

function unlockRewards(student) {
    const level = student.level;

    // Level-based unlocks
    if (level === 5) {
        addToInventory(student, 'weapons', 'iron_sword');
    }
    if (level === 10) {
        addToInventory(student, 'armor', 'steel_armor');
    }
    if (level === 15) {
        addToInventory(student, 'weapons', 'dragon_slayer');
    }
    if (level === 20) {
        addToInventory(student, 'skins', 'celestial');
    }

    // Streak-based unlocks
    if (student.currentStreak === 5) {
        addToInventory(student, 'armor', 'golden_armor');
    }
    if (student.currentStreak === 10) {
        addToInventory(student, 'weapons', 'mythic_weapon');
    }
}

function addToInventory(student, type, itemId) {
    const shopItem = gameState.shopItems[type].find(i => i.id === itemId);
    if (shopItem && !student.inventory[type].some(i => i.id === itemId)) {
        student.inventory[type].push({ ...shopItem, unlocked: true });
        showNotification(`🎁 ${student.name} unlocked: ${shopItem.name}!`, 'success');
    }
}

// ==================== QUESTS ====================
function renderQuestsView() {
    const questsList = document.getElementById('questsList');
    questsList.innerHTML = '';

    gameState.quests.forEach(quest => {
        const questCard = document.createElement('div');
        questCard.className = 'quest-item';
        questCard.dataset.questId = quest.id;

        const completedStudents = gameState.students.filter(s => quest.condition(s));
        const completed = completedStudents.length > 0;

        if (completed) {
            questCard.classList.add('completed');
        }

        questCard.innerHTML = `
            <h4>${quest.icon} ${quest.title}</h4>
            <p>${quest.description}</p>
            <div class="quest-reward">
                Reward: +${quest.reward.exp} EXP, +${quest.reward.gold} Gold
            </div>
            <p style="font-size: 0.8em; color: #00f5ff;">${completedStudents.length} student${completedStudents.length !== 1 ? 's' : ''} completed</p>
        `;

        questsList.appendChild(questCard);
    });
}

function showQuestDetails(questId) {
    const quest = gameState.quests.find(q => q.id == questId);
    if (!quest) return;

    const modal = document.getElementById('questModal');
    const modalBody = document.getElementById('modalBody');

    const completedStudents = gameState.students.filter(s => quest.condition(s));

    modalBody.innerHTML = `
        <h2>${quest.icon} ${quest.title}</h2>
        <p style="font-size: 1.1em; color: #00f5ff; margin: 15px 0;">${quest.description}</p>
        
        <div class="stat-box">
            <div class="stat-row">
                <label>Reward (EXP):</label>
                <span>+${quest.reward.exp}</span>
            </div>
            <div class="stat-row">
                <label>Reward (Gold):</label>
                <span>+${quest.reward.gold}</span>
            </div>
        </div>

        <h3>Completion Status</h3>
        <div class="students-list">
            ${completedStudents.length > 0 
                ? completedStudents.map(s => `
                    <div class="student-item">
                        <span style="color: #00f5ff;">${s.name}</span>
                        <span style="color: #06ffa5;">✓ Completed</span>
                    </div>
                `).join('')
                : '<p style="color: #e0aaff; text-align: center;">No students have completed this quest yet!</p>'
            }
        </div>
    `;

    modal.classList.add('show');
}

// ==================== SHOP ====================
function renderShopView() {
    const select = document.getElementById('shopStudentSelect');
    const currentValue = select.value;
    select.innerHTML = '<option value="">Select a Student...</option>';
    gameState.students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = `${student.name} (${student.gold} Gold)`;
        select.appendChild(option);
    });
    select.value = currentValue;
    renderShop('weapons');
}

function updateShopForStudent(studentId) {
    const student = gameState.students.find(s => s.id == studentId);
    if (student) {
        document.getElementById('playerGold').textContent = `Gold: ${student.gold}`;
    }
    renderShop(document.querySelector('.shop-tab.active').dataset.shopTab);
}

function renderShop(tabType) {
    const selectedStudentId = document.getElementById('shopStudentSelect').value;
    const student = gameState.students.find(s => s.id == selectedStudentId);
    const grid = document.getElementById('shopGrid');
    grid.innerHTML = '';

    if (!student) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #e0aaff;">Select a student to shop</p>';
        return;
    }

    const items = gameState.shopItems[tabType];
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'shop-item';
        
        const ownedItem = student.inventory[tabType].find(i => i.id === item.id);
        if (ownedItem) {
            card.classList.add('owned');
        }

        card.innerHTML = `
    <div class="shop-item-icon">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: contain; margin: 0 auto; filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.5));">` : `<span style="font-size: 3em;">${item.icon}</span>`}
    </div>
            <h4>${item.name}</h4>
            <p class="rarity rarity-${item.rarity}">${item.rarity.toUpperCase()}</p>
            <p class="shop-item-description">${item.description}</p>
            <p class="shop-item-price">${item.price === 0 ? 'FREE' : item.price + ' Gold'}</p>
            <button class="shop-item-btn" 
                ${ownedItem ? 'disabled' : ''}
                onclick="buyItem(${student.id}, '${tabType}', '${item.id}', ${item.price})">
                ${ownedItem ? '✓ OWNED' : 'BUY'}
            </button>
        `;

        grid.appendChild(card);
    });
}

function buyItem(studentId, itemType, itemId, price) {
    const student = gameState.students.find(s => s.id === studentId);
    if (!student) return;

    const item = gameState.shopItems[itemType].find(i => i.id === itemId);
    if (!item) return;

    if (student.inventory[itemType].some(i => i.id === itemId)) {
        showNotification('You already own this item!', 'warning');
        return;
    }

    if (student.gold < price) {
        showNotification(`Not enough Gold! Need ${price}, have ${student.gold}`, 'warning');
        return;
    }

    student.gold -= price;
    student.inventory[itemType].push({ ...item, unlocked: true });
    saveGameState();
    updateShopForStudent(studentId);
    showNotification(`🎉 ${student.name} purchased ${item.name}!`, 'success');
}

// ==================== RENDERING ====================
function renderDashboard() {
    renderStudentGrid();
    renderDailyRewards();
    renderClassStats();
}

function renderStudentGrid() {
    const grid = document.getElementById('studentGrid');
    grid.innerHTML = '';

    if (gameState.students.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #e0aaff;">No students yet. Add one to get started!</p>';
        return;
    }

    gameState.students.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.dataset.studentId = student.id;

        const today = new Date().toDateString();
        const presentToday = student.attendance.includes(today);

        if (presentToday) {
            card.classList.add('marked');
        }

        card.innerHTML = `
            <h4>${student.name}</h4>
            <p>Lvl ${student.level}</p>
            <p>${student.exp}/${student.expToNextLevel} EXP</p>
            <p>🔥 ${student.currentStreak}</p>
        `;

        card.addEventListener('click', () => {
            card.classList.toggle('marked');
        });

        grid.appendChild(card);
    });
}

function renderDailyRewards() {
    const container = document.getElementById('dailyRewardsContainer');
    container.innerHTML = '';

    if (gameState.students.length === 0) {
        container.innerHTML = '<p style="color: #e0aaff; text-align: center;">No students yet!</p>';
        return;
    }

    const today = new Date().toDateString();
    gameState.students.forEach(student => {
        const presentToday = student.attendance.includes(today);
        const div = document.createElement('div');
        div.className = `reward-item ${presentToday ? 'claimed' : ''}`;

        const rewardStatus = presentToday ? '✓ Claimed' : '✗ Not Present';
        const rewards = presentToday ? `+${gameState.settings.expPerDay} EXP, +${gameState.settings.goldPerDay} Gold` : '—';

        div.innerHTML = `
            <span style="color: #00f5ff; font-weight: bold;">${student.name}</span>
            <span style="color: #ffd60a;">${rewardStatus}</span>
            <span style="color: #06ffa5;">${rewards}</span>
        `;

        container.appendChild(div);
    });
}

function renderClassStats() {
    const today = new Date().toDateString();
    const presentToday = gameState.students.filter(s => s.attendance.includes(today)).length;
    const avgLevel = gameState.students.length > 0 
        ? Math.round(gameState.students.reduce((sum, s) => sum + s.level, 0) / gameState.students.length)
        : 0;
    const totalGold = gameState.students.reduce((sum, s) => sum + s.gold, 0);

    document.getElementById('totalStudents').textContent = gameState.students.length;
    document.getElementById('presentToday').textContent = presentToday;
    document.getElementById('avgLevel').textContent = avgLevel;
    document.getElementById('totalGold').textContent = totalGold;
}

function renderStudents() {
    const list = document.getElementById('studentsList');
    list.innerHTML = '';

    if (gameState.students.length === 0) {
        list.innerHTML = '<p style="color: #e0aaff; text-align: center;">No students added yet. Create your first adventurer!</p>';
        return;
    }

    gameState.students.forEach(student => {
        const item = document.createElement('div');
        item.className = 'student-item';
        item.innerHTML = `
            <div class="student-item-info">
                <h4>${student.name}</h4>
                <p>Level ${student.level} • ${student.gold} Gold • ${student.attendance.length} Days Present • 🔥 ${student.currentStreak}</p>
            </div>
            <div class="student-item-actions">
                <button class="btn-small" onclick="event.stopPropagation(); viewStudentDetails(${student.id})">👀 View</button>
                <button class="btn-small" onclick="event.stopPropagation(); deleteStudent(${student.id})">❌ Remove</button>
            </div>
        `;
        list.appendChild(item);
    });

    // Update inventory select
    const select = document.getElementById('inventoryStudentSelect');
    const currentValue = select.value;
    select.innerHTML = '<option value="">Select a Student...</option>';
    gameState.students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = student.name;
        select.appendChild(option);
    });
    select.value = currentValue;
}

function renderInventoryView() {
    if (gameState.students.length === 0) {
        document.getElementById('inventoryContent').innerHTML = '<p style="color: #e0aaff; text-align: center;">No students yet!</p>';
    }
}

function renderInventory(studentId) {
    const student = gameState.students.find(s => s.id == studentId);
    const content = document.getElementById('inventoryContent');

    if (!student) {
        content.innerHTML = '';
        return;
    }

    const expPercentage = Math.round((student.exp / student.expToNextLevel) * 100);

    content.innerHTML = `
        <div class="stat-box">
            <div class="stat-row">
                <label>Level:</label>
                <span>${student.level}</span>
            </div>
            <div class="stat-row">
                <label>Experience:</label>
                <span>${student.exp}/${student.expToNextLevel} (${expPercentage}%)</span>
            </div>
            <div class="stat-row">
                <label>Gold:</label>
                <span>💰 ${student.gold}</span>
            </div>
            <div class="stat-row">
                <label>Current Streak:</label>
                <span>🔥 ${student.currentStreak}</span>
            </div>
            <div class="stat-row">
                <label>Longest Streak:</label>
                <span>⭐ ${student.longestStreak}</span>
            </div>
            <div class="stat-row">
                <label>Days Present:</label>
                <span>📅 ${student.attendance.length}</span>
            </div>
        </div>

        <h3>⚔️ Weapons (${student.inventory.weapons.filter(w => w.unlocked).length}/${gameState.shopItems.weapons.length})</h3>
        <div class="equipment-grid" id="weaponsGrid"></div>

        <h3>🛡️ Armor (${student.inventory.armor.filter(a => a.unlocked).length}/${gameState.shopItems.armor.length})</h3>
        <div class="equipment-grid" id="armorGrid"></div>

        <h3>✨ Skins (${student.inventory.skins.filter(s => s.unlocked).length}/${gameState.shopItems.skins.length})</h3>
        <div class="equipment-grid" id="skinsGrid"></div>
    `;

    renderEquipment(student);
}

function renderEquipment(student) {
    // Weapons
    const weaponsGrid = document.getElementById('weaponsGrid');
    weaponsGrid.innerHTML = '';
    gameState.shopItems.weapons.forEach(weapon => {
        const owned = student.inventory.weapons.find(w => w.id === weapon.id);
        const card = document.createElement('div');
        card.className = `equipment-card ${owned ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
            <div style="margin-bottom: 10px; height: 60px; display: flex; align-items: center; justify-content: center;">
                ${weapon.image ? `<img src="${weapon.image}" alt="${weapon.name}" style="width: 50px; height: 50px; object-fit: contain; filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.3));">` : `<span style="font-size: 2em;">${weapon.icon}</span>`}
            </div>
            <h5>${weapon.name}</h5>
            <p class="rarity rarity-${weapon.rarity}">${weapon.rarity.toUpperCase()}</p>
            <p>${owned ? '✅ UNLOCKED' : '🔒 LOCKED'}</p>
        `;
        weaponsGrid.appendChild(card);
    });

    // Armor
    const armorGrid = document.getElementById('armorGrid');
    armorGrid.innerHTML = '';
    gameState.shopItems.armor.forEach(armor => {
        const owned = student.inventory.armor.find(a => a.id === armor.id);
        const card = document.createElement('div');
        card.className = `equipment-card ${owned ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
            <div style="margin-bottom: 10px; height: 60px; display: flex; align-items: center; justify-content: center;">
                ${armor.image ? `<img src="${armor.image}" alt="${armor.name}" style="width: 50px; height: 50px; object-fit: contain; filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.3));">` : `<span style="font-size: 2em;">${armor.icon}</span>`}
            </div>
            <h5>${armor.name}</h5>
            <p class="rarity rarity-${armor.rarity}">${armor.rarity.toUpperCase()}</p>
            <p>${owned ? '✅ UNLOCKED' : '🔒 LOCKED'}</p>
        `;
        armorGrid.appendChild(card);
    });

    // Skins
    const skinsGrid = document.getElementById('skinsGrid');
    skinsGrid.innerHTML = '';
    gameState.shopItems.skins.forEach(skin => {
        const owned = student.inventory.skins.find(s => s.id === skin.id);
        const card = document.createElement('div');
        card.className = `equipment-card ${owned ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
            <div style="margin-bottom: 10px; height: 60px; display: flex; align-items: center; justify-content: center;">
                ${skin.image ? `<img src="${skin.image}" alt="${skin.name}" style="width: 50px; height: 50px; object-fit: contain; filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.3));">` : `<span style="font-size: 2em;">${skin.icon}</span>`}
            </div>
            <h5>${skin.name}</h5>
            <p class="rarity rarity-${skin.rarity}">${skin.rarity.toUpperCase()}</p>
            <p>${owned ? '✅ UNLOCKED' : '🔒 LOCKED'}</p>
        `;
        skinsGrid.appendChild(card);
    });
}

    // Armor
    const armorGrid = document.getElementById('armorGrid');
    armorGrid.innerHTML = '';
    gameState.shopItems.armor.forEach(armor => {
        const owned = student.inventory.armor.find(a => a.id === armor.id);
        const card = document.createElement('div');
        card.className = `equipment-card ${owned ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
            <h5>${armor.icon} ${armor.name}</h5>
            <p class="rarity rarity-${armor.rarity}">${armor.rarity}</p>
            <p>${owned ? '✓ Unlocked' : '🔒 Locked'}</p>
        `;
        armorGrid.appendChild(card);
    });

    // Skins
    const skinsGrid = document.getElementById('skinsGrid');
    skinsGrid.innerHTML = '';
    gameState.shopItems.skins.forEach(skin => {
        const owned = student.inventory.skins.find(s => s.id === skin.id);
        const card = document.createElement('div');
        card.className = `equipment-card ${owned ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
            <h5>${skin.icon} ${skin.name}</h5>
            <p class="rarity rarity-${skin.rarity}">${skin.rarity}</p>
            <p>${owned ? '✓ Unlocked' : '🔒 Locked'}</p>
        `;
        skinsGrid.appendChild(card);
    });


function renderLeaderboard(tab) {
    const content = document.getElementById('leaderboardContent');
    let sortedStudents = [...gameState.students];

    if (tab === 'exp') {
        sortedStudents.sort((a, b) => (b.level * 10000 + b.exp) - (a.level * 10000 + a.exp));
    } else if (tab === 'streak') {
        sortedStudents.sort((a, b) => b.longestStreak - a.longestStreak);
    } else if (tab === 'currency') {
        sortedStudents.sort((a, b) => b.gold - a.gold);
    } else if (tab === 'attendance') {
        sortedStudents.sort((a, b) => b.attendance.length - a.attendance.length);
    }

    if (sortedStudents.length === 0) {
        content.innerHTML = '<p style="color: #e0aaff; text-align: center;">No students yet!</p>';
        return;
    }

    let html = '<ul class="leaderboard-list">';
    sortedStudents.forEach((student, index) => {
        let displayValue = '';
        let emoji = '';
        if (tab === 'exp') {
            displayValue = `Level ${student.level}`;
            emoji = '⭐';
        } else if (tab === 'streak') {
            displayValue = `${student.longestStreak} Days`;
            emoji = '🔥';
        } else if (tab === 'currency') {
            displayValue = `${student.gold} Gold`;
            emoji = '💰';
        } else if (tab === 'attendance') {
            displayValue = `${student.attendance.length} Days`;
            emoji = '📅';
        }

        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;

        html += `
            <li class="leaderboard-item">
                <span class="leaderboard-rank">${medal}</span>
                <span class="leaderboard-name">${student.name}</span>
                <span class="leaderboard-score">${emoji} ${displayValue}</span>
            </li>
        `;
    });
    html += '</ul>';

    content.innerHTML = html;
}

// ==================== SETTINGS ====================
function saveSettings() {
    gameState.settings.expPerDay = parseInt(document.getElementById('expPerDay').value);
    gameState.settings.goldPerDay = parseInt(document.getElementById('goldPerDay').value);
    gameState.settings.dailyBonusGold = parseInt(document.getElementById('dailyBonusGold').value);
    gameState.settings.expMultiplier = parseFloat(document.getElementById('expMultiplier').value);
    saveGameState();
    showNotification('⚙️ Settings saved!', 'success');
}

function clearAllData() {
    if (confirm('⚠️ This will DELETE ALL student data permanently! Are you absolutely sure?')) {
        if (confirm('⚠️ FINAL WARNING: This cannot be undone!')) {
            localStorage.removeItem('attendanceQuestState');
            gameState.students = [];
            saveGameState();
            renderStudents();
            renderDashboard();
            showNotification('All data has been cleared!', 'success');
        }
    }
}

function exportData() {
    const dataStr = JSON.stringify(gameState, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance-quest-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('📥 Data exported successfully!', 'success');
}

// ==================== UTILITIES ====================
function updateTimeDisplay() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('timeDisplay').textContent = `⏰ ${timeStr}`;
}

function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // You could add toast notifications here with a library like toastify
}

function viewStudentDetails(studentId) {
    document.getElementById('inventoryStudentSelect').value = studentId;
    renderInventory(studentId);
    switchView('inventory');
}
