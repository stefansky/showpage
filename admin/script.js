// 管理后台主脚本
// 模拟数据存储
const mockData = {
    users: [
        { id: 1, avatar: '👤', nickname: '张三', role: 'tenant', roleName: '租客', phone: '13800138001', authStatus: 'verified', authName: '张三', authIdCard: '110101199001011234', registerTime: '2024-01-15 10:30:00', status: 'active' },
        { id: 2, avatar: '👤', nickname: '李四', role: 'landlord', roleName: '房东', phone: '13800138002', authStatus: 'pending', authName: '李四', authIdCard: '110101199002021234', registerTime: '2024-01-16 14:20:00', status: 'active' },
        { id: 3, avatar: '👤', nickname: '王五', role: 'tenant', roleName: '租客', phone: '13800138003', authStatus: 'unverified', authName: '', authIdCard: '', registerTime: '2024-01-17 09:15:00', status: 'active' },
        { id: 4, avatar: '👤', nickname: '赵六', role: 'landlord', roleName: '房东', phone: '13800138004', authStatus: 'verified', authName: '赵六', authIdCard: '110101199003031234', registerTime: '2024-01-18 16:45:00', status: 'active' },
        { id: 5, avatar: '👤', nickname: '钱七', role: 'tenant', roleName: '租客', phone: '13800138005', authStatus: 'verified', authName: '钱七', authIdCard: '110101199004041234', registerTime: '2024-01-19 11:20:00', status: 'active' },
    ],
    stores: [
        { id: 1, name: '阳光租房门店', manager: '张店长', phone: '13900139001', address: '北京市朝阳区建国路88号', houseCount: 25, status: 'open', openTime: '2024-01-10 09:00:00' },
        { id: 2, name: '温馨家园门店', manager: '李店长', phone: '13900139002', address: '北京市海淀区中关村大街1号', houseCount: 18, status: 'open', openTime: '2024-01-12 10:00:00' },
        { id: 3, name: '幸福租房门店', manager: '王店长', phone: '13900139003', address: '北京市西城区西单大街50号', houseCount: 32, status: 'closed', openTime: '2024-01-15 08:00:00' },
    ],
    houses: [
        { id: 1, title: '精装两室一厅 近地铁', location: '北京市朝阳区', price: 4500, publisher: '李四', publisherId: 2, source: 'user', status: 'active', publishTime: '2024-01-20 10:00:00' },
        { id: 2, title: '温馨一居室 拎包入住', location: '北京市海淀区', price: 3200, publisher: '赵六', publisherId: 4, source: 'user', status: 'pending', publishTime: '2024-01-21 14:30:00' },
        { id: 3, title: '三室两厅 南北通透', location: '北京市西城区', price: 6800, publisher: '阳光租房门店', publisherId: 1, source: 'store', status: 'active', publishTime: '2024-01-22 09:15:00' },
        { id: 4, title: '单间出租 合租', location: '北京市东城区', price: 1800, publisher: '温馨家园门店', publisherId: 2, source: 'store', status: 'rented', publishTime: '2024-01-18 16:20:00' },
        { id: 5, title: '两室一厅 精装修', location: '北京市丰台区', price: 3800, publisher: '王五', publisherId: 3, source: 'user', status: 'rejected', publishTime: '2024-01-19 11:00:00' },
    ],
    findRequests: [
        { id: 1, userId: 1, userNickname: '张三', rentType: '整租', rooms: '两室一厅', location: '北京市朝阳区', moveInTime: '2024-02-01', publishTime: '2024-01-20 10:00:00', status: 'active' },
        { id: 2, userId: 3, userNickname: '王五', rentType: '合租', rooms: '单间', location: '北京市海淀区', moveInTime: '2024-02-15', publishTime: '2024-01-21 14:30:00', status: 'active' },
        { id: 3, userId: 5, userNickname: '钱七', rentType: '整租', rooms: '一室一厅', location: '北京市西城区', moveInTime: '2024-03-01', publishTime: '2024-01-22 09:15:00', status: 'active' },
    ],
    authReviews: [
        { id: 1, userId: 2, nickname: '李四', phone: '13800138002', realName: '李四', idCard: '110101199002021234', status: 'pending', submitTime: '2024-01-20 10:00:00' },
        { id: 2, userId: 6, nickname: '孙八', phone: '13800138006', realName: '孙八', idCard: '110101199005051234', status: 'pending', submitTime: '2024-01-21 14:30:00' },
        { id: 3, userId: 1, nickname: '张三', phone: '13800138001', realName: '张三', idCard: '110101199001011234', status: 'verified', submitTime: '2024-01-15 10:00:00', reviewTime: '2024-01-15 11:00:00' },
    ],
    reports: [
        { id: 1, type: 'house', typeName: '房源举报', reporter: '张三', reporterId: 1, target: '房源ID: 5', content: '房源信息虚假，图片与实际情况不符', status: 'pending', reportTime: '2024-01-20 10:00:00' },
        { id: 2, type: 'user', typeName: '用户举报', reporter: '李四', reporterId: 2, target: '用户: 王五', content: '用户发布虚假房源信息', status: 'pending', reportTime: '2024-01-21 14:30:00' },
        { id: 3, type: 'house', typeName: '房源举报', reporter: '赵六', reporterId: 4, target: '房源ID: 3', content: '房源已出租但未下架', status: 'processed', reportTime: '2024-01-19 09:00:00', processTime: '2024-01-19 10:00:00' },
    ],
    pointsRecords: [
        { id: 1, userId: 1, userNickname: '张三', userPhone: '13800138001', type: 'earn', typeName: '获得', amount: 10, reason: '首次登录奖励', time: '2024-01-15 10:30:00' },
        { id: 2, userId: 1, userNickname: '张三', userPhone: '13800138001', type: 'consume', typeName: '消耗', amount: -1, reason: '获取房源联系方式', time: '2024-01-20 11:00:00' },
        { id: 3, userId: 2, userNickname: '李四', userPhone: '13800138002', type: 'earn', typeName: '获得', amount: 10, reason: '首次登录奖励', time: '2024-01-16 14:20:00' },
        { id: 4, userId: 2, userNickname: '李四', userPhone: '13800138002', type: 'earn', typeName: '获得', amount: 5, reason: '发布房源奖励', time: '2024-01-20 10:00:00' },
        { id: 5, userId: 1, userNickname: '张三', userPhone: '13800138001', type: 'consume', typeName: '消耗', amount: -1, reason: '获取租客联系方式', time: '2024-01-21 15:00:00' },
    ],
    activities: [
        { id: 1, type: 'user', content: '用户 张三 注册成功', time: '2024-01-20 10:30:00' },
        { id: 2, type: 'house', content: '房源 精装两室一厅 已发布', time: '2024-01-20 11:00:00' },
        { id: 3, type: 'auth', content: '用户 李四 提交实名认证', time: '2024-01-20 14:00:00' },
        { id: 4, type: 'report', content: '收到房源举报', time: '2024-01-20 15:00:00' },
    ],
    settings: {
        contactPointsCost: 1,
        firstLoginReward: 10,
        publishHouseReward: 5,
        autoReviewHouses: true,
        autoAuthVerify: false,
    }
};

// 初始化localStorage数据
function initMockData() {
    if (!localStorage.getItem('adminMockData')) {
        localStorage.setItem('adminMockData', JSON.stringify(mockData));
    }
}

// 获取数据
function getData(key) {
    const data = JSON.parse(localStorage.getItem('adminMockData') || '{}');
    return data[key] || [];
}

// 保存数据
function saveData(key, value) {
    const data = JSON.parse(localStorage.getItem('adminMockData') || '{}');
    data[key] = value;
    localStorage.setItem('adminMockData', JSON.stringify(data));
}

// 添加数据
function addData(key, item) {
    const data = getData(key);
    const maxId = data.length > 0 ? Math.max(...data.map(d => d.id)) : 0;
    item.id = maxId + 1;
    data.push(item);
    saveData(key, data);
    return item;
}

// 更新数据
function updateData(key, id, updates) {
    const data = getData(key);
    const index = data.findIndex(d => d.id === id);
    if (index !== -1) {
        data[index] = { ...data[index], ...updates };
        saveData(key, data);
        return data[index];
    }
    return null;
}

// 删除数据
function deleteData(key, id) {
    const data = getData(key);
    const filtered = data.filter(d => d.id !== id);
    saveData(key, filtered);
    return true;
}

// 通用初始化
function initCommon() {
    // 侧边栏切换
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }

    // 导航高亮
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
        }
    });

    // 退出登录
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('确定要退出登录吗？')) {
                window.location.href = '../index.html';
            }
        });
    }
}

// 分页功能
function createPagination(total, currentPage, pageSize, callback) {
    const totalPages = Math.ceil(total / pageSize);
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // 上一页
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.textContent = '上一页';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) callback(currentPage - 1);
    });
    pagination.appendChild(prevBtn);

    // 页码
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'pagination-btn';
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => callback(i));
            pagination.appendChild(pageBtn);
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.padding = '8px';
            pagination.appendChild(ellipsis);
        }
    }

    // 下一页
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.textContent = '下一页';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) callback(currentPage + 1);
    });
    pagination.appendChild(nextBtn);
}

// ==================== 数据概览页面 ====================
function initDashboard() {
    const data = JSON.parse(localStorage.getItem('adminMockData') || JSON.stringify(mockData));
    
    // 统计数据
    document.getElementById('totalUsers')?.setAttribute('data-value', data.users?.length || 0);
    document.getElementById('totalStores')?.setAttribute('data-value', data.stores?.length || 0);
    document.getElementById('totalHouses')?.setAttribute('data-value', data.houses?.length || 0);
    document.getElementById('pendingReviews')?.setAttribute('data-value', 
        (data.authReviews?.filter(a => a.status === 'pending').length || 0) + 
        (data.houses?.filter(h => h.status === 'pending').length || 0)
    );

    // 今日数据
    const today = new Date().toISOString().split('T')[0];
    const todayUsers = data.users?.filter(u => u.registerTime?.startsWith(today)).length || 0;
    const todayHouses = data.houses?.filter(h => h.publishTime?.startsWith(today)).length || 0;
    const todayFindRequests = data.findRequests?.filter(f => f.publishTime?.startsWith(today)).length || 0;
    const todayReports = data.reports?.filter(r => r.status === 'pending').length || 0;

    document.getElementById('todayUsers')?.setAttribute('data-value', todayUsers);
    document.getElementById('todayHouses')?.setAttribute('data-value', todayHouses);
    document.getElementById('todayFindRequests')?.setAttribute('data-value', todayFindRequests);
    document.getElementById('todayReports')?.setAttribute('data-value', todayReports);

    // 更新显示
    updateStatValues();
    
    // 最近活动
    const activityList = document.getElementById('activityList');
    if (activityList) {
        const activities = (data.activities || []).slice(0, 5);
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon" style="background: ${getActivityColor(activity.type)}">
                    <i class="fas ${getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">${activity.content}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');
    }
}

function updateStatValues() {
    document.querySelectorAll('[data-value]').forEach(el => {
        const target = parseInt(el.getAttribute('data-value') || 0);
        const current = parseInt(el.textContent) || 0;
        if (current !== target) {
            animateValue(el, current, target, 500);
        } else {
            el.textContent = target;
        }
    });
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

function getActivityColor(type) {
    const colors = {
        user: '#e8f5e9',
        house: '#e3f2fd',
        auth: '#fff3e0',
        report: '#ffebee'
    };
    return colors[type] || '#f5f5f5';
}

function getActivityIcon(type) {
    const icons = {
        user: 'fa-user',
        house: 'fa-home',
        auth: 'fa-id-card',
        report: 'fa-flag'
    };
    return icons[type] || 'fa-circle';
}

// ==================== 用户管理页面 ====================
let currentUsersPage = 1;
const usersPageSize = 10;

function initUsers() {
    loadUsers();
    
    const searchInput = document.getElementById('searchInput');
    const roleFilter = document.getElementById('roleFilter');
    const authFilter = document.getElementById('authFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => loadUsers());
    }
    if (roleFilter) {
        roleFilter.addEventListener('change', () => {
            currentUsersPage = 1;
            loadUsers();
        });
    }
    if (authFilter) {
        authFilter.addEventListener('change', () => {
            currentUsersPage = 1;
            loadUsers();
        });
    }
}

function loadUsers() {
    const users = getData('users');
    const searchInput = document.getElementById('searchInput');
    const roleFilter = document.getElementById('roleFilter');
    const authFilter = document.getElementById('authFilter');
    
    let filtered = users;
    
    // 搜索
    if (searchInput && searchInput.value) {
        const keyword = searchInput.value.toLowerCase();
        filtered = filtered.filter(u => 
            u.nickname.toLowerCase().includes(keyword) || 
            u.phone.includes(keyword)
        );
    }
    
    // 角色筛选
    if (roleFilter && roleFilter.value) {
        filtered = filtered.filter(u => u.role === roleFilter.value);
    }
    
    // 认证筛选
    if (authFilter && authFilter.value) {
        filtered = filtered.filter(u => u.authStatus === authFilter.value);
    }
    
    // 分页
    const total = filtered.length;
    const start = (currentUsersPage - 1) * usersPageSize;
    const paginated = filtered.slice(start, start + usersPageSize);
    
    displayUsers(paginated);
    createPagination(total, currentUsersPage, usersPageSize, (page) => {
        currentUsersPage = page;
        loadUsers();
    });
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td><div style="width:32px;height:32px;border-radius:50%;background:#e8f5e9;display:flex;align-items:center;justify-content:center;font-size:18px">${user.avatar}</div></td>
            <td>${user.nickname}</td>
            <td><span class="status-badge ${user.role === 'tenant' ? 'active' : 'pending'}">${user.roleName}</span></td>
            <td>${user.phone}</td>
            <td><span class="status-badge ${user.authStatus === 'verified' ? 'verified' : user.authStatus === 'pending' ? 'pending' : 'unverified'}">${getAuthStatusText(user.authStatus)}</span></td>
            <td>${user.registerTime}</td>
            <td><span class="status-badge active">正常</span></td>
            <td>
                <button class="action-btn info" onclick="viewUser(${user.id})">查看</button>
                <button class="action-btn danger" onclick="deleteUser(${user.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

function getAuthStatusText(status) {
    const map = {
        verified: '已认证',
        pending: '待审核',
        unverified: '未认证'
    };
    return map[status] || '未知';
}

function viewUser(id) {
    const user = getData('users').find(u => u.id === id);
    if (user) {
        alert(`用户详情：\n昵称：${user.nickname}\n角色：${user.roleName}\n手机：${user.phone}\n认证状态：${getAuthStatusText(user.authStatus)}`);
    }
}

function deleteUser(id) {
    if (confirm('确定要删除该用户吗？')) {
        deleteData('users', id);
        loadUsers();
    }
}

// ==================== 门店管理页面 ====================
let currentStoresPage = 1;
const storesPageSize = 10;

function initStores() {
    loadStores();
    
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => loadStores());
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            currentStoresPage = 1;
            loadStores();
        });
    }
}

function loadStores() {
    const stores = getData('stores');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    
    let filtered = stores;
    
    if (searchInput && searchInput.value) {
        const keyword = searchInput.value.toLowerCase();
        filtered = filtered.filter(s => 
            s.name.toLowerCase().includes(keyword) || 
            s.manager.toLowerCase().includes(keyword)
        );
    }
    
    if (statusFilter && statusFilter.value) {
        filtered = filtered.filter(s => s.status === statusFilter.value);
    }
    
    const total = filtered.length;
    const start = (currentStoresPage - 1) * storesPageSize;
    const paginated = filtered.slice(start, start + storesPageSize);
    
    displayStores(paginated);
    createPagination(total, currentStoresPage, storesPageSize, (page) => {
        currentStoresPage = page;
        loadStores();
    });
}

function displayStores(stores) {
    const tbody = document.getElementById('storesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = stores.map(store => `
        <tr>
            <td>${store.id}</td>
            <td>${store.name}</td>
            <td>${store.manager}</td>
            <td>${store.phone}</td>
            <td>${store.address}</td>
            <td>${store.houseCount}</td>
            <td><span class="status-badge ${store.status === 'open' ? 'active' : 'rejected'}">${store.status === 'open' ? '正常营业' : '暂停营业'}</span></td>
            <td>${store.openTime}</td>
            <td>
                <button class="action-btn info" onclick="viewStore(${store.id})">查看</button>
                <button class="action-btn danger" onclick="deleteStore(${store.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

function viewStore(id) {
    const store = getData('stores').find(s => s.id === id);
    if (store) {
        alert(`门店详情：\n名称：${store.name}\n店长：${store.manager}\n手机：${store.phone}\n地址：${store.address}\n房源数：${store.houseCount}`);
    }
}

function deleteStore(id) {
    if (confirm('确定要删除该门店吗？')) {
        deleteData('stores', id);
        loadStores();
    }
}

// ==================== 房源管理页面 ====================
let currentHousesPage = 1;
const housesPageSize = 10;

function initHouses() {
    loadHouses();
    
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const sourceFilter = document.getElementById('sourceFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => loadHouses());
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            currentHousesPage = 1;
            loadHouses();
        });
    }
    if (sourceFilter) {
        sourceFilter.addEventListener('change', () => {
            currentHousesPage = 1;
            loadHouses();
        });
    }
}

function loadHouses() {
    const houses = getData('houses');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const sourceFilter = document.getElementById('sourceFilter');
    
    let filtered = houses;
    
    if (searchInput && searchInput.value) {
        const keyword = searchInput.value.toLowerCase();
        filtered = filtered.filter(h => 
            h.title.toLowerCase().includes(keyword) || 
            h.location.toLowerCase().includes(keyword)
        );
    }
    
    if (statusFilter && statusFilter.value) {
        filtered = filtered.filter(h => h.status === statusFilter.value);
    }
    
    if (sourceFilter && sourceFilter.value) {
        filtered = filtered.filter(h => h.source === sourceFilter.value);
    }
    
    const total = filtered.length;
    const start = (currentHousesPage - 1) * housesPageSize;
    const paginated = filtered.slice(start, start + housesPageSize);
    
    displayHouses(paginated);
    createPagination(total, currentHousesPage, housesPageSize, (page) => {
        currentHousesPage = page;
        loadHouses();
    });
}

function displayHouses(houses) {
    const tbody = document.getElementById('housesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = houses.map(house => `
        <tr>
            <td>${house.id}</td>
            <td>${house.title}</td>
            <td>${house.location}</td>
            <td>¥${house.price}/月</td>
            <td>${house.publisher}</td>
            <td>${house.source === 'user' ? '用户发布' : '门店录入'}</td>
            <td><span class="status-badge ${house.status}">${getHouseStatusText(house.status)}</span></td>
            <td>${house.publishTime}</td>
            <td>
                <button class="action-btn info" onclick="viewHouse(${house.id})">查看</button>
                ${house.status === 'pending' ? `<button class="action-btn primary" onclick="approveHouse(${house.id})">审核</button>` : ''}
                <button class="action-btn danger" onclick="deleteHouse(${house.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

function getHouseStatusText(status) {
    const map = {
        pending: '待审核',
        active: '已发布',
        rented: '已出租',
        rejected: '已拒绝'
    };
    return map[status] || '未知';
}

function viewHouse(id) {
    const house = getData('houses').find(h => h.id === id);
    if (house) {
        alert(`房源详情：\n标题：${house.title}\n位置：${house.location}\n价格：¥${house.price}/月\n发布人：${house.publisher}\n状态：${getHouseStatusText(house.status)}`);
    }
}

function approveHouse(id) {
    if (confirm('确定要通过审核吗？')) {
        updateData('houses', id, { status: 'active' });
        loadHouses();
    }
}

function deleteHouse(id) {
    if (confirm('确定要删除该房源吗？')) {
        deleteData('houses', id);
        loadHouses();
    }
}

// ==================== 找房需求管理页面 ====================
let currentFindRequestsPage = 1;
const findRequestsPageSize = 10;

function initFindRequests() {
    loadFindRequests();
    
    const searchInput = document.getElementById('searchInput');
    const rentTypeFilter = document.getElementById('rentTypeFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => loadFindRequests());
    }
    if (rentTypeFilter) {
        rentTypeFilter.addEventListener('change', () => {
            currentFindRequestsPage = 1;
            loadFindRequests();
        });
    }
}

function loadFindRequests() {
    const findRequests = getData('findRequests');
    const searchInput = document.getElementById('searchInput');
    const rentTypeFilter = document.getElementById('rentTypeFilter');
    
    let filtered = findRequests;
    
    if (searchInput && searchInput.value) {
        const keyword = searchInput.value.toLowerCase();
        filtered = filtered.filter(f => 
            f.userNickname.toLowerCase().includes(keyword) || 
            f.location.toLowerCase().includes(keyword)
        );
    }
    
    if (rentTypeFilter && rentTypeFilter.value) {
        filtered = filtered.filter(f => f.rentType === rentTypeFilter.value);
    }
    
    const total = filtered.length;
    const start = (currentFindRequestsPage - 1) * findRequestsPageSize;
    const paginated = filtered.slice(start, start + findRequestsPageSize);
    
    displayFindRequests(paginated);
    createPagination(total, currentFindRequestsPage, findRequestsPageSize, (page) => {
        currentFindRequestsPage = page;
        loadFindRequests();
    });
}

function displayFindRequests(findRequests) {
    const tbody = document.getElementById('findRequestsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = findRequests.map(req => `
        <tr>
            <td>${req.id}</td>
            <td>${req.userNickname}</td>
            <td>${req.rentType}</td>
            <td>${req.rooms}</td>
            <td>${req.location}</td>
            <td>${req.moveInTime}</td>
            <td>${req.publishTime}</td>
            <td><span class="status-badge active">${req.status === 'active' ? '进行中' : '已结束'}</span></td>
            <td>
                <button class="action-btn info" onclick="viewFindRequest(${req.id})">查看</button>
                <button class="action-btn danger" onclick="deleteFindRequest(${req.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

function viewFindRequest(id) {
    const req = getData('findRequests').find(f => f.id === id);
    if (req) {
        alert(`找房需求详情：\n用户：${req.userNickname}\n租赁类型：${req.rentType}\n户型：${req.rooms}\n位置：${req.location}\n入住时间：${req.moveInTime}`);
    }
}

function deleteFindRequest(id) {
    if (confirm('确定要删除该找房需求吗？')) {
        deleteData('findRequests', id);
        loadFindRequests();
    }
}

// ==================== 实名认证审核页面 ====================
let currentAuthPage = 1;
const authPageSize = 10;

function initAuthReview() {
    loadAuthReviews();
    
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            currentAuthPage = 1;
            loadAuthReviews();
        });
    }
}

function loadAuthReviews() {
    const authReviews = getData('authReviews');
    const statusFilter = document.getElementById('statusFilter');
    
    let filtered = authReviews;
    
    if (statusFilter && statusFilter.value) {
        filtered = filtered.filter(a => a.status === statusFilter.value);
    }
    
    const total = filtered.length;
    const start = (currentAuthPage - 1) * authPageSize;
    const paginated = filtered.slice(start, start + authPageSize);
    
    displayAuthReviews(paginated);
    createPagination(total, currentAuthPage, authPageSize, (page) => {
        currentAuthPage = page;
        loadAuthReviews();
    });
}

function displayAuthReviews(authReviews) {
    const authList = document.getElementById('authList');
    if (!authList) return;
    
    authList.innerHTML = authReviews.map(auth => `
        <div class="auth-item">
            <div class="auth-header">
                <div class="auth-user">
                    <div class="auth-avatar">${auth.nickname[0]}</div>
                    <div class="auth-info">
                        <div class="auth-name">${auth.nickname}</div>
                        <div class="auth-phone">${auth.phone}</div>
                    </div>
                </div>
                <span class="status-badge ${auth.status === 'verified' ? 'verified' : auth.status === 'pending' ? 'pending' : 'rejected'}">${getAuthStatusText(auth.status)}</span>
            </div>
            <div class="auth-body">
                <div class="auth-detail">
                    <i class="fas fa-user"></i>
                    <span>姓名：${auth.realName}</span>
                </div>
                <div class="auth-detail">
                    <i class="fas fa-id-card"></i>
                    <span>身份证号：${auth.idCard}</span>
                </div>
                <div class="auth-detail">
                    <i class="fas fa-clock"></i>
                    <span>提交时间：${auth.submitTime}</span>
                </div>
                ${auth.reviewTime ? `
                <div class="auth-detail">
                    <i class="fas fa-check-circle"></i>
                    <span>审核时间：${auth.reviewTime}</span>
                </div>
                ` : ''}
            </div>
            ${auth.status === 'pending' ? `
            <div class="auth-actions">
                <button class="action-btn primary" onclick="approveAuth(${auth.id})">通过</button>
                <button class="action-btn danger" onclick="rejectAuth(${auth.id})">拒绝</button>
            </div>
            ` : ''}
        </div>
    `).join('');
}

function approveAuth(id) {
    if (confirm('确定要通过该实名认证吗？')) {
        updateData('authReviews', id, { 
            status: 'verified',
            reviewTime: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-')
        });
        // 同时更新用户表中的认证状态
        const auth = getData('authReviews').find(a => a.id === id);
        if (auth) {
            updateData('users', auth.userId, { authStatus: 'verified' });
        }
        loadAuthReviews();
    }
}

function rejectAuth(id) {
    if (confirm('确定要拒绝该实名认证吗？')) {
        updateData('authReviews', id, { 
            status: 'rejected',
            reviewTime: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-')
        });
        // 同时更新用户表中的认证状态
        const auth = getData('authReviews').find(a => a.id === id);
        if (auth) {
            updateData('users', auth.userId, { authStatus: 'unverified' });
        }
        loadAuthReviews();
    }
}

// ==================== 举报处理页面 ====================
let currentReportsPage = 1;
const reportsPageSize = 10;

function initReports() {
    loadReports();
    
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            currentReportsPage = 1;
            loadReports();
        });
    }
    if (typeFilter) {
        typeFilter.addEventListener('change', () => {
            currentReportsPage = 1;
            loadReports();
        });
    }
}

function loadReports() {
    const reports = getData('reports');
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    
    let filtered = reports;
    
    if (statusFilter && statusFilter.value) {
        filtered = filtered.filter(r => r.status === statusFilter.value);
    }
    
    if (typeFilter && typeFilter.value) {
        filtered = filtered.filter(r => r.type === typeFilter.value);
    }
    
    const total = filtered.length;
    const start = (currentReportsPage - 1) * reportsPageSize;
    const paginated = filtered.slice(start, start + reportsPageSize);
    
    displayReports(paginated);
    createPagination(total, currentReportsPage, reportsPageSize, (page) => {
        currentReportsPage = page;
        loadReports();
    });
}

function displayReports(reports) {
    const reportList = document.getElementById('reportList');
    if (!reportList) return;
    
    reportList.innerHTML = reports.map(report => `
        <div class="report-item">
            <div class="report-header">
                <span class="report-type ${report.type}">${report.typeName}</span>
                <span class="status-badge ${report.status === 'pending' ? 'pending' : 'active'}">${report.status === 'pending' ? '待处理' : '已处理'}</span>
            </div>
            <div class="report-content">${report.content}</div>
            <div class="report-meta">
                <span>举报人：${report.reporter}</span>
                <span>被举报：${report.target}</span>
                <span>举报时间：${report.reportTime}</span>
                ${report.processTime ? `<span>处理时间：${report.processTime}</span>` : ''}
            </div>
            ${report.status === 'pending' ? `
            <div class="report-actions">
                <button class="action-btn primary" onclick="processReport(${report.id})">处理</button>
                <button class="action-btn danger" onclick="deleteReport(${report.id})">删除</button>
            </div>
            ` : ''}
        </div>
    `).join('');
}

function processReport(id) {
    if (confirm('确定要处理该举报吗？')) {
        updateData('reports', id, { 
            status: 'processed',
            processTime: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-')
        });
        loadReports();
    }
}

function deleteReport(id) {
    if (confirm('确定要删除该举报吗？')) {
        deleteData('reports', id);
        loadReports();
    }
}

// ==================== 房豆管理页面 ====================
let currentPointsPage = 1;
const pointsPageSize = 10;

function initPoints() {
    loadPoints();
    loadPointsStats();
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => loadPoints());
    }
    
    const addPointsBtn = document.getElementById('addPointsBtn');
    const addPointsModal = document.getElementById('addPointsModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    
    if (addPointsBtn && addPointsModal) {
        addPointsBtn.addEventListener('click', () => {
            addPointsModal.classList.add('show');
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            document.getElementById('addPointsModal')?.classList.remove('show');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.getElementById('addPointsModal')?.classList.remove('show');
        });
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const userPhone = document.getElementById('userPhone')?.value;
            const pointsAmount = parseInt(document.getElementById('pointsAmount')?.value || 0);
            const pointsReason = document.getElementById('pointsReason')?.value;
            
            if (!userPhone) {
                alert('请输入用户手机号');
                return;
            }
            if (!pointsAmount || pointsAmount <= 0) {
                alert('请输入有效的房豆数量');
                return;
            }
            if (!pointsReason) {
                alert('请输入发放原因');
                return;
            }
            
            // 查找用户
            const users = getData('users');
            const user = users.find(u => u.phone === userPhone);
            if (!user) {
                alert('未找到该用户');
                return;
            }
            
            // 添加房豆记录
            addData('pointsRecords', {
                userId: user.id,
                userNickname: user.nickname,
                userPhone: user.phone,
                type: 'earn',
                typeName: '获得',
                amount: pointsAmount,
                reason: pointsReason,
                time: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-')
            });
            
            alert('房豆发放成功！');
            document.getElementById('addPointsModal')?.classList.remove('show');
            document.getElementById('userPhone').value = '';
            document.getElementById('pointsAmount').value = '';
            document.getElementById('pointsReason').value = '';
            loadPoints();
            loadPointsStats();
        });
    }
}

function loadPointsStats() {
    const records = getData('pointsRecords');
    const today = new Date().toISOString().split('T')[0];
    
    const totalPoints = records.filter(r => r.type === 'earn').reduce((sum, r) => sum + r.amount, 0) - 
                       records.filter(r => r.type === 'consume').reduce((sum, r) => sum + Math.abs(r.amount), 0);
    const todayEarned = records.filter(r => r.type === 'earn' && r.time.startsWith(today)).reduce((sum, r) => sum + r.amount, 0);
    const todayConsumed = records.filter(r => r.type === 'consume' && r.time.startsWith(today)).reduce((sum, r) => sum + Math.abs(r.amount), 0);
    
    document.getElementById('totalPoints')?.setAttribute('data-value', totalPoints);
    document.getElementById('todayEarned')?.setAttribute('data-value', todayEarned);
    document.getElementById('todayConsumed')?.setAttribute('data-value', todayConsumed);
    updateStatValues();
}

function loadPoints() {
    const records = getData('pointsRecords');
    const searchInput = document.getElementById('searchInput');
    
    let filtered = records;
    
    if (searchInput && searchInput.value) {
        const keyword = searchInput.value.toLowerCase();
        filtered = filtered.filter(r => 
            r.userNickname.toLowerCase().includes(keyword) || 
            r.userPhone.includes(keyword)
        );
    }
    
    // 按时间倒序
    filtered.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    const total = filtered.length;
    const start = (currentPointsPage - 1) * pointsPageSize;
    const paginated = filtered.slice(start, start + pointsPageSize);
    
    displayPoints(paginated);
    createPagination(total, currentPointsPage, pointsPageSize, (page) => {
        currentPointsPage = page;
        loadPoints();
    });
}

function displayPoints(records) {
    const tbody = document.getElementById('pointsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = records.map(record => `
        <tr>
            <td>${record.id}</td>
            <td>${record.userNickname} (${record.userPhone})</td>
            <td><span class="status-badge ${record.type === 'earn' ? 'active' : 'rejected'}">${record.typeName}</span></td>
            <td style="color: ${record.type === 'earn' ? '#4CAF50' : '#F44336'}; font-weight: 600">${record.type === 'earn' ? '+' : ''}${record.amount}</td>
            <td>${record.reason}</td>
            <td>${record.time}</td>
            <td>
                <button class="action-btn danger" onclick="deletePointsRecord(${record.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

function deletePointsRecord(id) {
    if (confirm('确定要删除该记录吗？')) {
        deleteData('pointsRecords', id);
        loadPoints();
        loadPointsStats();
    }
}

// ==================== 系统设置页面 ====================
function initSettings() {
    const data = JSON.parse(localStorage.getItem('adminMockData') || JSON.stringify(mockData));
    const settings = data.settings || mockData.settings;
    
    // 加载设置值
    document.getElementById('contactPointsCost').value = settings.contactPointsCost || 1;
    document.getElementById('firstLoginReward').value = settings.firstLoginReward || 10;
    document.getElementById('publishHouseReward').value = settings.publishHouseReward || 5;
    document.getElementById('autoReviewHouses').checked = settings.autoReviewHouses !== false;
    document.getElementById('autoAuthVerify').checked = settings.autoAuthVerify === true;
    
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const data = JSON.parse(localStorage.getItem('adminMockData') || JSON.stringify(mockData));
            data.settings = {
                contactPointsCost: parseInt(document.getElementById('contactPointsCost').value) || 1,
                firstLoginReward: parseInt(document.getElementById('firstLoginReward').value) || 10,
                publishHouseReward: parseInt(document.getElementById('publishHouseReward').value) || 5,
                autoReviewHouses: document.getElementById('autoReviewHouses').checked,
                autoAuthVerify: document.getElementById('autoAuthVerify').checked
            };
            localStorage.setItem('adminMockData', JSON.stringify(data));
            alert('设置保存成功！');
        });
    }
    
    const editNoticeBtn = document.getElementById('editNoticeBtn');
    if (editNoticeBtn) {
        editNoticeBtn.addEventListener('click', () => {
            alert('系统公告编辑功能待开发');
        });
    }
    
    const backupBtn = document.getElementById('backupBtn');
    if (backupBtn) {
        backupBtn.addEventListener('click', () => {
            const data = localStorage.getItem('adminMockData');
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            alert('数据备份成功！');
        });
    }
}

// ==================== 页面初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    initMockData();
    initCommon();
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
            initDashboard();
            break;
        case 'users.html':
            initUsers();
            break;
        case 'stores.html':
            initStores();
            break;
        case 'houses.html':
            initHouses();
            break;
        case 'find-requests.html':
            initFindRequests();
            break;
        case 'auth-review.html':
            initAuthReview();
            break;
        case 'reports.html':
            initReports();
            break;
        case 'points.html':
            initPoints();
            break;
        case 'settings.html':
            initSettings();
            break;
    }
});

