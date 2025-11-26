// 管理后台公共脚本

// ==================== 模拟数据 ====================
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
    communications: [
        { id: 1, acquirer: '阳光租房门店', acquirerId: 1, type: 'tenant', typeName: '租客联系方式', targetUser: '张三', targetUserId: 1, contact: '13800138001', contactTime: '2024-01-20 10:00:00', status: 'active' },
        { id: 2, acquirer: '温馨家园门店', acquirerId: 2, type: 'landlord', typeName: '房东联系方式', targetUser: '李四', targetUserId: 2, contact: '13800138002', contactTime: '2024-01-21 14:30:00', status: 'active' },
        { id: 3, acquirer: '幸福租房门店', acquirerId: 3, type: 'tenant', typeName: '租客联系方式', targetUser: '王五', targetUserId: 3, contact: '13800138003', contactTime: '2024-01-22 09:15:00', status: 'active' },
    ],
    platformActivities: [
        { id: 1, name: '分享到朋友圈送房豆', type: 'points', typeName: '房豆活动', reward: '10房豆', startTime: '2024-01-01 00:00:00', endTime: '2024-12-31 23:59:59', participants: 1250, status: 'active' },
        { id: 2, name: '新用户注册大礼包', type: 'points', typeName: '房豆活动', reward: '20房豆', startTime: '2024-01-15 00:00:00', endTime: '2024-02-15 23:59:59', participants: 856, status: 'active' },
        { id: 3, name: '房源发布奖励', type: 'points', typeName: '房豆活动', reward: '5房豆', startTime: '2024-01-01 00:00:00', endTime: '2024-12-31 23:59:59', participants: 2340, status: 'active' },
    ],
    visits: [
        { id: 1, tenantName: '张三', tenantPhone: '13800138001', storeName: '阳光租房门店', storeId: 1, visitTime: '2024-01-20 14:30:00', houseTitle: '精装两室一厅', status: 'completed' },
        { id: 2, tenantName: '李四', tenantPhone: '13800138002', storeName: '温馨家园门店', storeId: 2, visitTime: '2024-01-21 10:15:00', houseTitle: '温馨一居室', status: 'completed' },
        { id: 3, tenantName: '王五', tenantPhone: '13800138003', storeName: '幸福租房门店', storeId: 3, visitTime: '2024-01-22 16:45:00', houseTitle: '三室两厅', status: 'scheduled' },
    ],
    storeApplications: [
        { id: 1, applicant: '张店长', applicantPhone: '13900139001', storeName: '阳光租房门店', address: '北京市朝阳区建国路88号', applyTime: '2024-01-10 09:00:00', status: 'approved' },
        { id: 2, applicant: '李店长', applicantPhone: '13900139002', storeName: '温馨家园门店', address: '北京市海淀区中关村大街1号', applyTime: '2024-01-12 10:00:00', status: 'approved' },
        { id: 3, applicant: '王店长', applicantPhone: '13900139003', storeName: '新开租房门店', address: '北京市西城区西单大街100号', applyTime: '2024-01-25 11:00:00', status: 'pending' },
    ],
    cities: [
        { id: 1, name: '北京', code: 'BJ', houseCount: 1250, userCount: 3560, storeCount: 15, status: 'active' },
        { id: 2, name: '上海', code: 'SH', houseCount: 980, userCount: 2890, storeCount: 12, status: 'active' },
        { id: 3, name: '广州', code: 'GZ', houseCount: 750, userCount: 2150, storeCount: 8, status: 'active' },
        { id: 4, name: '深圳', code: 'SZ', houseCount: 680, userCount: 1980, storeCount: 7, status: 'active' },
    ],
    settings: {
        contactPointsCost: 1,
        firstLoginReward: 10,
        publishHouseReward: 5,
        autoReviewHouses: true,
        autoAuthVerify: false,
    }
};

// ==================== 数据操作函数 ====================

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

// ==================== 侧边栏菜单 ====================

// 生成侧边栏菜单
function generateSidebarMenu() {
    const sidebarNav = document.getElementById('sidebarNav');
    if (!sidebarNav) return;
    
    // 获取当前页面路径
    const pathParts = window.location.pathname.split('/');
    const currentDir = pathParts[pathParts.length - 2] || 'dashboard';
    
    const menuItems = [
        { href: '../dashboard/index.html', icon: 'fa-chart-line', text: '数据概览', dir: 'dashboard' },
        { href: '../users/index.html', icon: 'fa-users', text: '用户管理', dir: 'users' },
        { href: '../stores/index.html', icon: 'fa-store', text: '门店管理', dir: 'stores' },
        { href: '../houses/index.html', icon: 'fa-home', text: '房源管理', dir: 'houses' },
        { href: '../find-requests/index.html', icon: 'fa-search', text: '找房需求', dir: 'find-requests' },
        { href: '../auth-review/index.html', icon: 'fa-id-card', text: '认证审核', dir: 'auth-review' },
        { href: '../communications/index.html', icon: 'fa-comments', text: '沟通管理', dir: 'communications' },
        { href: '../activities/index.html', icon: 'fa-gift', text: '活动管理', dir: 'activities' },
        { href: '../visits/index.html', icon: 'fa-eye', text: '看房管理', dir: 'visits' },
        { href: '../store-applications/index.html', icon: 'fa-file-alt', text: '开店申请', dir: 'store-applications' },
        { href: '../reports/index.html', icon: 'fa-flag', text: '举报处理', dir: 'reports' },
        { href: '../points/index.html', icon: 'fa-coins', text: '房豆管理', dir: 'points' },
        { href: '../cities/index.html', icon: 'fa-map-marker-alt', text: '城市管理', dir: 'cities' },
        { href: '../settings/index.html', icon: 'fa-cog', text: '系统设置', dir: 'settings' }
    ];
    
    sidebarNav.innerHTML = menuItems.map(item => {
        const isActive = item.dir === currentDir ? 'active' : '';
        return `
            <a href="${item.href}" class="nav-item ${isActive}" data-page="${item.dir}">
                <i class="fas ${item.icon}"></i>
                <span>${item.text}</span>
            </a>
        `;
    }).join('');
}

// ==================== 通用初始化 ====================

function initCommon() {
    // 生成侧边栏菜单
    generateSidebarMenu();
    
    // 侧边栏切换
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }

    // 退出登录
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('确定要退出登录吗？')) {
                window.location.href = '../../index.html';
            }
        });
    }
}

// ==================== 分页功能 ====================

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

// ==================== 工具函数 ====================

function getAuthStatusText(status) {
    const map = {
        verified: '已认证',
        pending: '待审核',
        unverified: '未认证'
    };
    return map[status] || '未知';
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

function formatDateTime() {
    return new Date().toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    }).replace(/\//g, '-');
}

// 页面初始化入口
document.addEventListener('DOMContentLoaded', () => {
    initMockData();
    initCommon();
    
    // 调用页面特定的初始化函数
    if (typeof initPage === 'function') {
        initPage();
    }
});

