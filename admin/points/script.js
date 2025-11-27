// 房豆管理页面脚本

let currentPage = 1;
const pageSize = 10;

// 类型映射
const TYPE_MAP = {
    1: '注册赠送',
    2: '签到',
    3: '观看广告',
    4: '发布房源',
    5: '发布找房',
    6: '获取联系方式',
    7: '系统赠送',
    8: '系统扣除'
};

// 关联类型映射
const RELATED_TYPE_MAP = {
    1: '房源',
    2: '找房',
    3: '广告'
};

// 初始化页面
function initPage() {
    loadUserOptions();
    loadData();
    bindEvents();
}

// 绑定事件
function bindEvents() {
    document.getElementById('addPointsBtn')?.addEventListener('click', openAddModal);
}

// 搜索数据
function searchData() {
    currentPage = 1;
    loadData();
}

// 重置搜索
function resetSearch() {
    document.getElementById('userNameInput').value = '';
    document.getElementById('userTypeFilter').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('directionFilter').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    currentPage = 1;
    loadData();
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 加载用户选项
function loadUserOptions() {
    handleUserTypeChange();
}

// 处理用户类型切换
function handleUserTypeChange() {
    const userType = document.querySelector('input[name="targetUserType"]:checked')?.value;
    const select = document.getElementById('targetUserId');
    const label = document.getElementById('targetTypeLabel');
    
    if (userType === '1') {
        label.textContent = '用户';
        const users = getData('users');
        select.innerHTML = '<option value="">请选择用户</option>' + 
            users.map(u => `<option value="${u.id}">${u.nickname} (${u.phone})</option>`).join('');
    } else {
        label.textContent = '商家';
        const stores = getData('stores');
        select.innerHTML = '<option value="">请选择商家</option>' + 
            stores.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    }
}

// 加载数据
function loadData() {
    let records = getData('pointsRecords');
    const users = getData('users');
    const stores = getData('stores');
    const houses = getData('houses');
    const findRequests = getData('findRequests');
    
    const userNameInput = document.getElementById('userNameInput')?.value.toLowerCase() || '';
    const userTypeFilter = document.getElementById('userTypeFilter')?.value || '';
    const typeFilter = document.getElementById('typeFilter')?.value || '';
    const directionFilter = document.getElementById('directionFilter')?.value || '';
    const startDate = document.getElementById('startDate')?.value || '';
    const endDate = document.getElementById('endDate')?.value || '';
    
    // 搜索和筛选
    records = records.filter(record => {
        const userName = getUserName(record, users, stores);
        
        const matchUserName = !userNameInput || userName.toLowerCase().includes(userNameInput);
        const matchUserType = !userTypeFilter || String(record.userType) === userTypeFilter;
        const matchType = !typeFilter || String(record.type) === typeFilter;
        const matchDirection = !directionFilter || 
            (directionFilter === 'earn' && record.points > 0) ||
            (directionFilter === 'consume' && record.points < 0);
        const matchStartDate = !startDate || (record.createdAt && record.createdAt >= startDate);
        const matchEndDate = !endDate || (record.createdAt && record.createdAt <= endDate + ' 23:59:59');
        
        return matchUserName && matchUserType && matchType && matchDirection && matchStartDate && matchEndDate;
    });
    
    // 按时间倒序
    records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // 分页
    const total = records.length;
    const start = (currentPage - 1) * pageSize;
    const paginated = records.slice(start, start + pageSize);
    
    displayData(paginated, users, stores, houses, findRequests);
    createPagination(total, currentPage, pageSize, (page) => {
        currentPage = page;
        loadData();
    });
}

// 更新统计数据
function updateStats(records) {
    const totalEarned = records.filter(r => r.points > 0).reduce((sum, r) => sum + r.points, 0);
    const totalConsumed = records.filter(r => r.points < 0).reduce((sum, r) => sum + Math.abs(r.points), 0);
    const totalCirculation = totalEarned;
    
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(r => r.createdAt?.startsWith(today)).length;
    
    animateValue(document.getElementById('totalCirculation'), 0, totalCirculation, 400);
    animateValue(document.getElementById('totalEarned'), 0, totalEarned, 400);
    animateValue(document.getElementById('totalConsumed'), 0, totalConsumed, 400);
    animateValue(document.getElementById('todayRecords'), 0, todayRecords, 400);
}

// 获取用户名称
function getUserName(record, users, stores) {
    if (record.userType === 1) {
        const user = users.find(u => u.id === record.userId);
        return user?.nickname || `用户#${record.userId}`;
    } else {
        const store = stores.find(s => s.id === record.userId);
        return store?.name || `商家#${record.userId}`;
    }
}

// 获取关联信息
function getRelatedInfo(record, houses, findRequests) {
    if (!record.relatedType || !record.relatedId) return '-';
    
    if (record.relatedType === 1) {
        const house = houses.find(h => h.id === record.relatedId);
        return house ? `房源: ${house.title.substring(0, 10)}...` : `房源#${record.relatedId}`;
    } else if (record.relatedType === 2) {
        return `找房#${record.relatedId}`;
    } else if (record.relatedType === 3) {
        return `广告#${record.relatedId}`;
    }
    return '-';
}

// 显示数据
function displayData(records, users, stores, houses, findRequests) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    if (records.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-inbox" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
                    暂无房豆记录数据
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = records.map(record => {
        const userTypeBadge = record.userType === 1 
            ? '<span class="type-badge user">用户</span>' 
            : '<span class="type-badge store">商家</span>';
        const userName = getUserName(record, users, stores);
        
        const pointsClass = record.points > 0 ? 'earn' : 'consume';
        const pointsText = record.points > 0 ? `+${record.points}` : record.points;
        
        const typeText = TYPE_MAP[record.type] || '未知';
        const typeBadgeClass = getTypeBadgeClass(record.type);
        
        const relatedInfo = getRelatedInfo(record, houses, findRequests);
        
        return `
            <tr>
                <td>${record.id}</td>
                <td>${userTypeBadge}</td>
                <td><span class="user-name">${userName}</span></td>
                <td><span class="points-change ${pointsClass}">${pointsText}</span></td>
                <td><span class="balance">${record.balance}</span></td>
                <td><span class="type-badge ${typeBadgeClass}">${typeText}</span></td>
                <td><span class="related-info">${relatedInfo}</span></td>
                <td><span class="remark" title="${record.remark || ''}">${(record.remark || '-').substring(0, 15)}${record.remark?.length > 15 ? '...' : ''}</span></td>
                <td>${record.createdAt || '-'}</td>
                <td>
                    <button class="action-btn info" onclick="viewDetail(${record.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn danger" onclick="deleteRecord(${record.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// 获取类型标签样式
function getTypeBadgeClass(type) {
    const classMap = {
        1: 'register',  // 注册赠送
        2: 'signin',    // 签到
        3: 'ad',        // 观看广告
        4: 'house',     // 发布房源
        5: 'find',      // 发布找房
        6: 'contact',   // 获取联系方式
        7: 'system-add', // 系统赠送
        8: 'system-sub'  // 系统扣除
    };
    return classMap[type] || 'default';
}

// 打开发放弹窗
function openAddModal() {
    document.getElementById('modalTitle').textContent = '发放房豆';
    document.querySelector('input[name="targetUserType"][value="1"]').checked = true;
    document.querySelector('input[name="operationType"][value="7"]').checked = true;
    handleUserTypeChange();
    document.getElementById('targetUserId').value = '';
    document.getElementById('pointsAmount').value = '';
    document.getElementById('pointsRemark').value = '';
    document.getElementById('addPointsModal').classList.add('show');
}

// 关闭弹窗
function closeModal() {
    document.getElementById('addPointsModal').classList.remove('show');
}

// 确认发放/扣除房豆
function confirmAddPoints() {
    const userType = parseInt(document.querySelector('input[name="targetUserType"]:checked')?.value);
    const userId = parseInt(document.getElementById('targetUserId').value);
    const operationType = parseInt(document.querySelector('input[name="operationType"]:checked')?.value);
    const amount = parseInt(document.getElementById('pointsAmount').value);
    const remark = document.getElementById('pointsRemark').value.trim();
    
    if (!userId) {
        showToast('请选择用户或商家', 'error');
        return;
    }
    if (!amount || amount <= 0) {
        showToast('请输入有效的房豆数量', 'error');
        return;
    }
    
    // 获取当前余额
    const records = getData('pointsRecords');
    const userRecords = records.filter(r => r.userType === userType && r.userId === userId);
    const currentBalance = userRecords.length > 0 
        ? Math.max(...userRecords.map(r => r.id)) === userRecords.find(r => r.id === Math.max(...userRecords.map(r => r.id)))?.id 
            ? userRecords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].balance 
            : 0
        : 0;
    
    // 计算最新余额（简化处理：遍历所有记录计算）
    const balance = userRecords.reduce((sum, r) => sum + r.points, 0);
    
    const isDeduct = operationType === 8;
    const points = isDeduct ? -amount : amount;
    const newBalance = balance + points;
    
    if (isDeduct && newBalance < 0) {
        showToast('扣除后余额不能为负数', 'error');
        return;
    }
    
    addData('pointsRecords', {
        userType,
        userId,
        points,
        balance: newBalance,
        type: operationType,
        relatedType: null,
        relatedId: null,
        remark: remark || (isDeduct ? '系统扣除' : '系统赠送'),
        createdAt: formatDateTime()
    });
    
    showToast(isDeduct ? '房豆扣除成功' : '房豆发放成功', 'success');
    closeModal();
    loadData();
}

// 查看详情
function viewDetail(id) {
    const records = getData('pointsRecords');
    const users = getData('users');
    const stores = getData('stores');
    const houses = getData('houses');
    const findRequests = getData('findRequests');
    
    const record = records.find(r => r.id === id);
    if (!record) return;
    
    const userName = getUserName(record, users, stores);
    const userTypeText = record.userType === 1 ? '用户' : '商家';
    const typeText = TYPE_MAP[record.type] || '未知';
    const relatedTypeText = RELATED_TYPE_MAP[record.relatedType] || '-';
    const relatedInfo = getRelatedInfo(record, houses, findRequests);
    const pointsClass = record.points > 0 ? 'earn' : 'consume';
    const pointsText = record.points > 0 ? `+${record.points}` : record.points;
    
    const detailBody = document.getElementById('detailBody');
    detailBody.innerHTML = `
        <div class="detail-header-card ${pointsClass}">
            <div class="points-big">${pointsText}</div>
            <div class="points-label">${record.points > 0 ? '获得房豆' : '消耗房豆'}</div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">用户信息</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">用户类型</span>
                    <span class="detail-value">${userTypeText}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">用户名称</span>
                    <span class="detail-value">${userName}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">操作后余额</span>
                    <span class="detail-value highlight">${record.balance} 房豆</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">记录信息</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">记录ID</span>
                    <span class="detail-value">#${record.id}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">类型</span>
                    <span class="detail-value">${typeText}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">关联类型</span>
                    <span class="detail-value">${relatedTypeText}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">关联信息</span>
                    <span class="detail-value">${relatedInfo}</span>
                </div>
                <div class="detail-item full-width">
                    <span class="detail-label">备注</span>
                    <span class="detail-value">${record.remark || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">创建时间</span>
                    <span class="detail-value">${record.createdAt}</span>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('detailModal').classList.add('show');
}

// 关闭详情弹窗
function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('show');
}

// 删除记录
function deleteRecord(id) {
    if (confirm('确定要删除这条房豆记录吗？此操作不可恢复。')) {
        deleteData('pointsRecords', id);
        showToast('记录已删除', 'success');
        loadData();
    }
}

// Toast 提示
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}
