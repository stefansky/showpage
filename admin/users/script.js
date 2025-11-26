// 用户管理页面脚本

let currentPage = 1;
const pageSize = 10;
let currentUserId = null;

// 初始化Mock数据
function initUserMockData() {
    const existingData = getData('users');
    if (!existingData || existingData.length < 10) {
        const mockUsers = [
            { id: 1, avatar: '👤', nickname: '张三', role: 'tenant', roleName: '租客', phone: '13800138001', openId: 'oXK8s5dH7vN2mQ1pR3tY6wZ4cA9bE', unionId: 'oy1Lm3nO5pQ7rS9tU2vW4xY6zA8bC', authStatus: 'verified', authName: '张三', authIdCard: '110101199001011234', points: 28, status: 'active', registerTime: '2024-01-15 10:30:00', lastLoginTime: '2024-01-25 09:15:00', city: '北京市' },
            { id: 2, avatar: '👨', nickname: '李四', role: 'landlord', roleName: '房东', phone: '13800138002', openId: 'oXK8s5aB1cD2eF3gH4iJ5kL6mN7oP', unionId: 'oy1La2bC3dE4fG5hI6jK7lM8nO9pQ', authStatus: 'pending', authName: '李四', authIdCard: '110101199002021234', points: 15, status: 'active', registerTime: '2024-01-16 14:20:00', lastLoginTime: '2024-01-24 16:30:00', city: '北京市' },
            { id: 3, avatar: '👩', nickname: '王小美', role: 'tenant', roleName: '租客', phone: '13800138003', openId: 'oXK8s5qR2sT3uV4wX5yZ6aB7cD8eF', unionId: 'oy1Lq1rS2tU3vW4xY5zA6bC7dE8fG', authStatus: 'unverified', authName: '', authIdCard: '', points: 10, status: 'active', registerTime: '2024-01-17 09:15:00', lastLoginTime: '2024-01-23 11:20:00', city: '上海市' },
            { id: 4, avatar: '👴', nickname: '赵六', role: 'landlord', roleName: '房东', phone: '13800138004', openId: 'oXK8s5gH9iJ0kL1mN2oP3qR4sT5uV', unionId: 'oy1Lg1hI2jK3lM4nO5pQ6rS7tU8vW', authStatus: 'verified', authName: '赵六', authIdCard: '110101196503031234', points: 42, status: 'active', registerTime: '2024-01-18 16:45:00', lastLoginTime: '2024-01-25 08:00:00', city: '广州市' },
            { id: 5, avatar: '👧', nickname: '钱七', role: 'tenant', roleName: '租客', phone: '13800138005', openId: 'oXK8s5wX6yZ7aB8cD9eF0gH1iJ2kL', unionId: 'oy1Lw1xY2zA3bC4dE5fG6hI7jK8lM', authStatus: 'verified', authName: '钱七', authIdCard: '110101199504041234', points: 5, status: 'active', registerTime: '2024-01-19 11:20:00', lastLoginTime: '2024-01-22 14:50:00', city: '深圳市' },
            { id: 6, avatar: '👱', nickname: '孙八', role: 'tenant', roleName: '租客', phone: '13800138006', openId: 'oXK8s5mN3oP4qR5sT6uV7wX8yZ9aB', unionId: 'oy1Lm1nO2pQ3rS4tU5vW6xY7zA8bC', authStatus: 'pending', authName: '孙八', authIdCard: '110101199805051234', points: 10, status: 'active', registerTime: '2024-01-20 10:00:00', lastLoginTime: '2024-01-21 09:30:00', city: '杭州市' },
            { id: 7, avatar: '👲', nickname: '周九', role: 'landlord', roleName: '房东', phone: '13800138007', openId: 'oXK8s5cD0eF1gH2iJ3kL4mN5oP6qR', unionId: 'oy1Lc1dE2fG3hI4jK5lM6nO7pQ8rS', authStatus: 'verified', authName: '周九', authIdCard: '110101198706061234', points: 88, status: 'active', registerTime: '2024-01-21 08:30:00', lastLoginTime: '2024-01-25 10:15:00', city: '成都市' },
            { id: 8, avatar: '👳', nickname: '吴十', role: 'tenant', roleName: '租客', phone: '13800138008', openId: 'oXK8s5sT7uV8wX9yZ0aB1cD2eF3gH', unionId: 'oy1Ls1tU2vW3xY4zA5bC6dE7fG8hI', authStatus: 'unverified', authName: '', authIdCard: '', points: 3, status: 'disabled', registerTime: '2024-01-22 15:40:00', lastLoginTime: '2024-01-22 15:45:00', city: '武汉市' },
            { id: 9, avatar: '👵', nickname: '郑老太', role: 'landlord', roleName: '房东', phone: '13800138009', openId: 'oXK8s5iJ4kL5mN6oP7qR8sT9uV0wX', unionId: 'oy1Li1jK2lM3nO4pQ5rS6tU7vW8xY', authStatus: 'verified', authName: '郑美兰', authIdCard: '110101195507071234', points: 120, status: 'active', registerTime: '2024-01-23 09:00:00', lastLoginTime: '2024-01-24 11:00:00', city: '北京市' },
            { id: 10, avatar: '🧑', nickname: '冯小刚', role: 'tenant', roleName: '租客', phone: '13800138010', openId: 'oXK8s5yZ1aB2cD3eF4gH5iJ6kL7mN', unionId: 'oy1Ly1zA2bC3dE4fG5hI6jK7lM8nO', authStatus: 'verified', authName: '冯小刚', authIdCard: '110101199208081234', points: 18, status: 'blocked', registerTime: '2024-01-24 12:30:00', lastLoginTime: '2024-01-24 12:35:00', city: '上海市' },
            { id: 11, avatar: '👨‍💼', nickname: '陈经理', role: 'landlord', roleName: '房东', phone: '13800138011', openId: 'oXK8s5oP8qR9sT0uV1wX2yZ3aB4cD', unionId: 'oy1Lo1pQ2rS3tU4vW5xY6zA7bC8dE', authStatus: 'verified', authName: '陈明华', authIdCard: '110101198009091234', points: 65, status: 'active', registerTime: '2024-01-25 08:00:00', lastLoginTime: '2024-01-25 11:30:00', city: '广州市' },
            { id: 12, avatar: '👩‍🎓', nickname: '小雯同学', role: 'tenant', roleName: '租客', phone: '13800138012', openId: 'oXK8s5eF5gH6iJ7kL8mN9oP0qR1sT', unionId: 'oy1Le1fG2hI3jK4lM5nO6pQ7rS8tU', authStatus: 'unverified', authName: '', authIdCard: '', points: 10, status: 'active', registerTime: '2024-01-25 14:00:00', lastLoginTime: '2024-01-25 14:05:00', city: '杭州市' },
        ];
        saveData('users', mockUsers);
    }
}

function initPage() {
    initUserMockData();
    loadStats();
    loadData();
    
    document.getElementById('searchInput')?.addEventListener('input', debounce(() => { currentPage = 1; loadData(); }, 300));
    document.getElementById('roleFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
    document.getElementById('authFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
    document.getElementById('statusFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
    
    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.action-dropdown')) {
            document.querySelectorAll('.action-dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 加载统计数据
function loadStats() {
    const users = getData('users');
    const tenantCount = users.filter(u => u.role === 'tenant').length;
    const landlordCount = users.filter(u => u.role === 'landlord').length;
    const verifiedCount = users.filter(u => u.authStatus === 'verified').length;
    
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('tenantCount').textContent = tenantCount;
    document.getElementById('landlordCount').textContent = landlordCount;
    document.getElementById('verifiedCount').textContent = verifiedCount;
}

// 加载用户数据
function loadData() {
    const users = getData('users');
    const searchInput = document.getElementById('searchInput');
    const roleFilter = document.getElementById('roleFilter');
    const authFilter = document.getElementById('authFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    let filtered = [...users];
    
    if (searchInput?.value) {
        const keyword = searchInput.value.toLowerCase();
        filtered = filtered.filter(u => 
            u.nickname.toLowerCase().includes(keyword) || 
            u.phone.includes(keyword) ||
            u.openId?.toLowerCase().includes(keyword)
        );
    }
    
    if (roleFilter?.value) {
        filtered = filtered.filter(u => u.role === roleFilter.value);
    }
    
    if (authFilter?.value) {
        filtered = filtered.filter(u => u.authStatus === authFilter.value);
    }
    
    if (statusFilter?.value) {
        filtered = filtered.filter(u => u.status === statusFilter.value);
    }
    
    // 按ID倒序
    filtered.sort((a, b) => b.id - a.id);
    
    const total = filtered.length;
    const start = (currentPage - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);
    
    displayData(paginated);
    createPagination(total, currentPage, pageSize, (page) => {
        currentPage = page;
        loadData();
    });
}

// 显示用户数据
function displayData(users) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-users" style="font-size: 32px; margin-bottom: 12px; display: block; color: #e0e0e0;"></i>
                    暂无用户数据
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>
                <div class="user-cell">
                    <div class="user-avatar">${user.avatar}</div>
                    <div class="user-info-cell">
                        <span class="user-nickname">${user.nickname}</span>
                        <span class="user-openid">${user.openId?.substring(0, 12)}...</span>
                    </div>
                </div>
            </td>
            <td>
                <span class="status-badge ${user.role === 'tenant' ? 'active' : 'pending'}">
                    ${user.roleName}
                </span>
            </td>
            <td>${user.phone}</td>
            <td>
                <span class="status-badge ${getAuthStatusClass(user.authStatus)}">
                    ${getAuthStatusText(user.authStatus)}
                </span>
            </td>
            <td>
                <span class="points-cell">
                    <i class="fas fa-coins"></i>
                    ${user.points || 0}
                </span>
            </td>
            <td>
                <span class="status-badge ${getStatusClass(user.status)}">
                    ${getStatusText(user.status)}
                </span>
            </td>
            <td>${user.registerTime}</td>
            <td>
                <div class="action-dropdown">
                    <button class="action-dropdown-btn" onclick="toggleDropdown(event, ${user.id})">
                        操作 <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="action-dropdown-menu" id="dropdown-${user.id}">
                        <div class="action-dropdown-item" onclick="viewUser(${user.id})">
                            <i class="fas fa-eye"></i> 查看详情
                        </div>
                        <div class="action-dropdown-item" onclick="openPointsModal(${user.id})">
                            <i class="fas fa-coins"></i> 房豆操作
                        </div>
                        <div class="action-dropdown-item" onclick="switchRole(${user.id})">
                            <i class="fas fa-exchange-alt"></i> 切换角色
                        </div>
                        <div class="action-dropdown-item" onclick="openStatusModal(${user.id})">
                            <i class="fas fa-user-cog"></i> 修改状态
                        </div>
                        <div class="action-dropdown-item" onclick="resetAuth(${user.id})">
                            <i class="fas fa-id-card"></i> 重置认证
                        </div>
                        <div class="action-dropdown-item danger" onclick="deleteUser(${user.id})">
                            <i class="fas fa-trash"></i> 删除用户
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    `).join('');
}

// 切换下拉菜单
function toggleDropdown(event, userId) {
    event.stopPropagation();
    const menu = document.getElementById(`dropdown-${userId}`);
    const isShow = menu.classList.contains('show');
    
    // 关闭所有下拉菜单
    document.querySelectorAll('.action-dropdown-menu').forEach(m => {
        m.classList.remove('show');
    });
    
    if (!isShow) {
        menu.classList.add('show');
    }
}

// 获取认证状态样式类
function getAuthStatusClass(status) {
    const map = {
        verified: 'verified',
        pending: 'pending',
        unverified: 'unverified'
    };
    return map[status] || 'unverified';
}

// 获取用户状态文字
function getStatusText(status) {
    const map = {
        active: '正常',
        disabled: '禁用',
        blocked: '拉黑'
    };
    return map[status] || '未知';
}

// 获取用户状态样式类
function getStatusClass(status) {
    const map = {
        active: 'active',
        disabled: 'pending',
        blocked: 'rejected'
    };
    return map[status] || '';
}

// 查看用户详情
function viewUser(id) {
    const user = getData('users').find(u => u.id === id);
    if (!user) return;
    
    const detailBody = document.getElementById('detailBody');
    detailBody.innerHTML = `
        <div class="detail-header">
            <div class="detail-avatar">${user.avatar}</div>
            <div class="detail-user-info">
                <h3>${user.nickname}</h3>
                <div class="detail-user-meta">
                    <span class="detail-meta-item">
                        <i class="fas fa-${user.role === 'tenant' ? 'user' : 'home'}"></i>
                        ${user.roleName}
                    </span>
                    <span class="detail-meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        ${user.city || '未知'}
                    </span>
                    <span class="detail-meta-item">
                        <i class="fas fa-coins"></i>
                        ${user.points || 0} 房豆
                    </span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">基本信息</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">用户ID</span>
                    <span class="detail-value">${user.id}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">手机号</span>
                    <span class="detail-value">${user.phone}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">注册时间</span>
                    <span class="detail-value">${user.registerTime}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">最后登录</span>
                    <span class="detail-value">${user.lastLoginTime || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">账号状态</span>
                    <span class="detail-value">${getStatusText(user.status)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">所在城市</span>
                    <span class="detail-value">${user.city || '-'}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">微信信息</div>
            <div class="detail-grid">
                <div class="detail-item" style="grid-column: 1/-1;">
                    <span class="detail-label">OpenID</span>
                    <span class="detail-value code">${user.openId || '-'}</span>
                </div>
                <div class="detail-item" style="grid-column: 1/-1;">
                    <span class="detail-label">UnionID</span>
                    <span class="detail-value code">${user.unionId || '-'}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">实名认证</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">认证状态</span>
                    <span class="detail-value">${getAuthStatusText(user.authStatus)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">真实姓名</span>
                    <span class="detail-value">${user.authName || '-'}</span>
                </div>
                <div class="detail-item" style="grid-column: 1/-1;">
                    <span class="detail-label">身份证号</span>
                    <span class="detail-value code">${user.authIdCard ? maskIdCard(user.authIdCard) : '-'}</span>
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

// 脱敏身份证号
function maskIdCard(idCard) {
    if (!idCard || idCard.length < 18) return idCard;
    return idCard.substring(0, 6) + '********' + idCard.substring(14);
}

// 打开房豆操作弹窗
function openPointsModal(id) {
    const user = getData('users').find(u => u.id === id);
    if (!user) return;
    
    currentUserId = id;
    
    document.getElementById('userPointsInfo').innerHTML = `
        <span class="user-name">${user.avatar} ${user.nickname}</span>
        <span class="current-points"><i class="fas fa-coins"></i> ${user.points || 0}</span>
    `;
    
    document.getElementById('pointsAmount').value = '';
    document.getElementById('pointsReason').value = '';
    document.querySelector('input[name="pointsAction"][value="add"]').checked = true;
    
    document.getElementById('pointsModal').classList.add('show');
}

// 关闭房豆弹窗
function closePointsModal() {
    document.getElementById('pointsModal').classList.remove('show');
    currentUserId = null;
}

// 确认房豆操作
function confirmPointsAction() {
    if (!currentUserId) return;
    
    const action = document.querySelector('input[name="pointsAction"]:checked').value;
    const amount = parseInt(document.getElementById('pointsAmount').value);
    const reason = document.getElementById('pointsReason').value.trim();
    
    if (!amount || amount <= 0) {
        alert('请输入有效的房豆数量');
        return;
    }
    
    const user = getData('users').find(u => u.id === currentUserId);
    if (!user) return;
    
    let newPoints = user.points || 0;
    
    if (action === 'add') {
        newPoints += amount;
    } else {
        if (amount > newPoints) {
            alert('扣减数量不能超过当前房豆余额');
            return;
        }
        newPoints -= amount;
    }
    
    // 更新用户房豆
    updateData('users', currentUserId, { points: newPoints });
    
    // 记录房豆变动
    addData('pointsRecords', {
        userId: currentUserId,
        userNickname: user.nickname,
        userPhone: user.phone,
        type: action === 'add' ? 'earn' : 'consume',
        typeName: action === 'add' ? '获得' : '消耗',
        amount: action === 'add' ? amount : -amount,
        reason: reason || (action === 'add' ? '管理员充值' : '管理员扣减'),
        time: formatDateTime()
    });
    
    alert(`${action === 'add' ? '充值' : '扣减'}成功！当前房豆：${newPoints}`);
    closePointsModal();
    loadData();
}

// 打开状态修改弹窗
function openStatusModal(id) {
    const user = getData('users').find(u => u.id === id);
    if (!user) return;
    
    currentUserId = id;
    
    document.getElementById('userStatusInfo').innerHTML = `
        <div class="avatar">${user.avatar}</div>
        <div class="info">
            <div class="name">${user.nickname}</div>
            <div class="current-status">当前状态：${getStatusText(user.status)}</div>
        </div>
    `;
    
    document.querySelector(`input[name="userStatus"][value="${user.status}"]`).checked = true;
    document.getElementById('statusReason').value = '';
    
    document.getElementById('statusModal').classList.add('show');
}

// 关闭状态弹窗
function closeStatusModal() {
    document.getElementById('statusModal').classList.remove('show');
    currentUserId = null;
}

// 确认修改状态
function confirmStatusChange() {
    if (!currentUserId) return;
    
    const newStatus = document.querySelector('input[name="userStatus"]:checked').value;
    const reason = document.getElementById('statusReason').value.trim();
    
    const user = getData('users').find(u => u.id === currentUserId);
    if (!user) return;
    
    if (user.status === newStatus) {
        alert('状态未发生变化');
        return;
    }
    
    updateData('users', currentUserId, { status: newStatus });
    
    alert(`用户状态已修改为：${getStatusText(newStatus)}`);
    closeStatusModal();
    loadData();
}

// 切换角色
function switchRole(id) {
    const user = getData('users').find(u => u.id === id);
    if (!user) return;
    
    const newRole = user.role === 'tenant' ? 'landlord' : 'tenant';
    const newRoleName = newRole === 'tenant' ? '租客' : '房东';
    
    if (confirm(`确定要将「${user.nickname}」的角色从「${user.roleName}」切换为「${newRoleName}」吗？`)) {
        updateData('users', id, { role: newRole, roleName: newRoleName });
        loadStats();
        loadData();
        alert('角色切换成功！');
    }
}

// 重置实名认证
function resetAuth(id) {
    const user = getData('users').find(u => u.id === id);
    if (!user) return;
    
    if (user.authStatus === 'unverified') {
        alert('该用户尚未进行实名认证');
        return;
    }
    
    if (confirm(`确定要重置「${user.nickname}」的实名认证信息吗？\n\n重置后用户需要重新进行实名认证。`)) {
        updateData('users', id, {
            authStatus: 'unverified',
            authName: '',
            authIdCard: ''
        });
        loadStats();
        loadData();
        alert('实名认证已重置！');
    }
}

// 删除用户
function deleteUser(id) {
    const user = getData('users').find(u => u.id === id);
    if (!user) return;
    
    if (confirm(`⚠️ 确定要删除用户「${user.nickname}」吗？\n\n此操作不可恢复，用户的所有数据将被清除。`)) {
        deleteData('users', id);
        loadStats();
        loadData();
        alert('用户已删除！');
    }
}

// 导出用户
function exportUsers() {
    const users = getData('users');
    
    // 简单的CSV导出
    let csv = 'ID,昵称,角色,手机号,认证状态,房豆,状态,注册时间\n';
    users.forEach(u => {
        csv += `${u.id},"${u.nickname}",${u.roleName},${u.phone},${getAuthStatusText(u.authStatus)},${u.points || 0},${getStatusText(u.status)},${u.registerTime}\n`;
    });
    
    // 创建下载
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `用户数据_${new Date().toLocaleDateString()}.csv`;
    link.click();
    
    alert('导出成功！');
}
