// 活动管理页面脚本

let currentPage = 1;
const pageSize = 8;
let editingId = null;

// 活动类型映射
const TYPE_MAP = {
    1: { name: '分享好友', icon: 'fa-share-alt', color: '#4CAF50' },
    2: { name: '分享朋友圈', icon: 'fa-share-square', color: '#07C160' },
    3: { name: '查看广告', icon: 'fa-play-circle', color: '#FF9800' },
    4: { name: '每日签到', icon: 'fa-calendar-check', color: '#2196F3' },
    5: { name: '邀请注册', icon: 'fa-user-plus', color: '#9C27B0' },
    6: { name: '发布房源', icon: 'fa-home', color: '#00BCD4' },
    7: { name: '发布找房', icon: 'fa-search', color: '#E91E63' }
};

// 参与频率映射
const FREQUENCY_MAP = {
    1: '仅限一次',
    2: '每天一次',
    3: '每周一次',
    4: '每月一次',
    5: '不限次数'
};

// 初始化页面
function initPage() {
    loadData();
    bindEvents();
}

// 绑定事件
function bindEvents() {
    document.getElementById('addActivityBtn')?.addEventListener('click', openAddModal);
    
    // 状态开关事件
    document.getElementById('activityStatus')?.addEventListener('change', function() {
        document.getElementById('statusLabel').textContent = this.checked ? '已开启' : '已关闭';
    });
}

// 搜索数据
function searchData() {
    currentPage = 1;
    loadData();
}

// 重置搜索
function resetSearch() {
    document.getElementById('nameInput').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('statusFilter').value = '';
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

// 加载数据
function loadData() {
    let activities = getData('platformActivities');
    
    const nameInput = document.getElementById('nameInput')?.value.toLowerCase() || '';
    const typeFilter = document.getElementById('typeFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    
    // 搜索和筛选
    activities = activities.filter(item => {
        const matchName = !nameInput || item.name.toLowerCase().includes(nameInput);
        const matchType = !typeFilter || String(item.type) === typeFilter;
        const matchStatus = !statusFilter || String(item.status) === statusFilter;
        return matchName && matchType && matchStatus;
    });
    
    // 按排序权重和ID排序
    activities.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0) || b.id - a.id);
    
    // 分页
    const total = activities.length;
    const start = (currentPage - 1) * pageSize;
    const paginated = activities.slice(start, start + pageSize);
    
    displayData(paginated);
    createPagination(total, currentPage, pageSize, (page) => {
        currentPage = page;
        loadData();
    });
}

// 显示数据（卡片形式）
function displayData(activities) {
    const grid = document.getElementById('activityGrid');
    if (!grid) return;
    
    if (activities.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-gift"></i>
                <p>暂无活动数据</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = activities.map(activity => {
        const typeInfo = TYPE_MAP[activity.type] || { name: '未知', icon: 'fa-question', color: '#999' };
        const frequencyText = FREQUENCY_MAP[activity.frequency] || '未知';
        const statusClass = activity.status === 1 ? 'active' : 'closed';
        const statusText = activity.status === 1 ? '进行中' : '已关闭';
        
        // 计算活动时间状态
        const now = new Date();
        const startTime = activity.startTime ? new Date(activity.startTime) : null;
        const endTime = activity.endTime ? new Date(activity.endTime) : null;
        let timeStatus = '';
        if (startTime && now < startTime) {
            timeStatus = '<span class="time-status upcoming">未开始</span>';
        } else if (endTime && now > endTime) {
            timeStatus = '<span class="time-status ended">已结束</span>';
        }
        
        return `
            <div class="activity-card ${statusClass}">
                <div class="activity-header">
                    <div class="activity-icon" style="background-color: ${typeInfo.color}20; color: ${typeInfo.color}">
                        <i class="fas ${typeInfo.icon}"></i>
                    </div>
                    <div class="activity-title-area">
                        <h3 class="activity-name">${activity.name}</h3>
                        <span class="activity-type">${typeInfo.name}</span>
                    </div>
                    <div class="activity-status ${statusClass}">${statusText}</div>
                </div>
                
                <div class="activity-body">
                    <p class="activity-desc">${activity.description || '暂无描述'}</p>
                    
                    <div class="activity-info-grid">
                        <div class="info-item">
                            <i class="fas fa-coins"></i>
                            <span class="info-label">奖励</span>
                            <span class="info-value reward">+${activity.rewardAmount} 房豆</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-redo"></i>
                            <span class="info-label">频率</span>
                            <span class="info-value">${frequencyText}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-users"></i>
                            <span class="info-label">参与</span>
                            <span class="info-value">${activity.participants || 0} 人次</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-sort-numeric-up"></i>
                            <span class="info-label">排序</span>
                            <span class="info-value">${activity.sortOrder || 0}</span>
                        </div>
                    </div>
                    
                    <div class="activity-time">
                        <i class="fas fa-clock"></i>
                        <span>${formatTimeRange(activity.startTime, activity.endTime)}</span>
                        ${timeStatus}
                    </div>
                </div>
                
                <div class="activity-footer">
                    <button class="card-btn view" onclick="viewDetail(${activity.id})">
                        <i class="fas fa-eye"></i> 详情
                    </button>
                    <button class="card-btn edit" onclick="editActivity(${activity.id})">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="card-btn toggle" onclick="toggleStatus(${activity.id}, ${activity.status})">
                        <i class="fas ${activity.status === 1 ? 'fa-pause' : 'fa-play'}"></i> 
                        ${activity.status === 1 ? '关闭' : '开启'}
                    </button>
                    <button class="card-btn delete" onclick="deleteActivity(${activity.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// 格式化时间范围
function formatTimeRange(start, end) {
    if (!start && !end) return '长期有效';
    if (start && !end) return `${formatDate(start)} 起`;
    if (!start && end) return `至 ${formatDate(end)}`;
    return `${formatDate(start)} 至 ${formatDate(end)}`;
}

// 格式化日期
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// ==================== 新增/编辑弹窗 ====================

function openAddModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = '新增活动';
    resetForm();
    document.getElementById('activityModal').classList.add('show');
}

function editActivity(id) {
    const activities = getData('platformActivities');
    const activity = activities.find(a => a.id === id);
    if (!activity) return;
    
    editingId = id;
    document.getElementById('modalTitle').textContent = '编辑活动';
    
    // 填充表单
    document.getElementById('activityName').value = activity.name || '';
    document.getElementById('activityType').value = activity.type || '';
    document.getElementById('activityDesc').value = activity.description || '';
    document.getElementById('activityStatus').checked = activity.status === 1;
    document.getElementById('statusLabel').textContent = activity.status === 1 ? '已开启' : '已关闭';
    document.getElementById('rewardType').value = activity.rewardType || 1;
    document.getElementById('rewardAmount').value = activity.rewardAmount || '';
    document.getElementById('frequency').value = activity.frequency || 1;
    document.getElementById('maxTimes').value = activity.maxTimes || '';
    document.getElementById('startTime').value = activity.startTime ? activity.startTime.replace(' ', 'T').substring(0, 16) : '';
    document.getElementById('endTime').value = activity.endTime ? activity.endTime.replace(' ', 'T').substring(0, 16) : '';
    document.getElementById('sortOrder').value = activity.sortOrder || 0;
    
    handleFrequencyChange();
    document.getElementById('activityModal').classList.add('show');
}

function closeModal() {
    document.getElementById('activityModal').classList.remove('show');
    resetForm();
}

function resetForm() {
    document.getElementById('activityName').value = '';
    document.getElementById('activityType').value = '';
    document.getElementById('activityDesc').value = '';
    document.getElementById('activityStatus').checked = true;
    document.getElementById('statusLabel').textContent = '已开启';
    document.getElementById('rewardType').value = '1';
    document.getElementById('rewardAmount').value = '';
    document.getElementById('frequency').value = '1';
    document.getElementById('maxTimes').value = '';
    document.getElementById('startTime').value = '';
    document.getElementById('endTime').value = '';
    document.getElementById('sortOrder').value = '0';
    document.getElementById('maxTimesItem').style.display = 'none';
}

// 处理频率变化
function handleFrequencyChange() {
    const frequency = document.getElementById('frequency').value;
    const maxTimesItem = document.getElementById('maxTimesItem');
    maxTimesItem.style.display = frequency === '5' ? 'block' : 'none';
}

// 保存活动
function saveActivity() {
    const name = document.getElementById('activityName').value.trim();
    const type = parseInt(document.getElementById('activityType').value);
    const description = document.getElementById('activityDesc').value.trim();
    const status = document.getElementById('activityStatus').checked ? 1 : 0;
    const rewardType = parseInt(document.getElementById('rewardType').value);
    const rewardAmount = parseInt(document.getElementById('rewardAmount').value);
    const frequency = parseInt(document.getElementById('frequency').value);
    const maxTimes = parseInt(document.getElementById('maxTimes').value) || 0;
    const startTime = document.getElementById('startTime').value ? document.getElementById('startTime').value.replace('T', ' ') + ':00' : null;
    const endTime = document.getElementById('endTime').value ? document.getElementById('endTime').value.replace('T', ' ') + ':00' : null;
    const sortOrder = parseInt(document.getElementById('sortOrder').value) || 0;
    
    // 验证
    if (!name) {
        showToast('请输入活动名称', 'error');
        return;
    }
    if (!type) {
        showToast('请选择活动类型', 'error');
        return;
    }
    if (!rewardAmount || rewardAmount <= 0) {
        showToast('请输入有效的奖励数量', 'error');
        return;
    }
    
    const activityData = {
        name,
        type,
        description,
        status,
        rewardType,
        rewardAmount,
        frequency,
        maxTimes: frequency === 5 ? maxTimes : 0,
        startTime,
        endTime,
        sortOrder,
        participants: 0,
        createdAt: formatDateTime()
    };
    
    if (editingId) {
        // 保留原有参与人数
        const activities = getData('platformActivities');
        const original = activities.find(a => a.id === editingId);
        activityData.participants = original?.participants || 0;
        activityData.createdAt = original?.createdAt || activityData.createdAt;
        
        updateData('platformActivities', editingId, activityData);
        showToast('活动更新成功', 'success');
    } else {
        addData('platformActivities', activityData);
        showToast('活动创建成功', 'success');
    }
    
    closeModal();
    loadData();
}

// ==================== 详情弹窗 ====================

function viewDetail(id) {
    const activities = getData('platformActivities');
    const activity = activities.find(a => a.id === id);
    if (!activity) return;
    
    const typeInfo = TYPE_MAP[activity.type] || { name: '未知', icon: 'fa-question', color: '#999' };
    const frequencyText = FREQUENCY_MAP[activity.frequency] || '未知';
    const statusText = activity.status === 1 ? '已开启' : '已关闭';
    const statusClass = activity.status === 1 ? 'active' : 'closed';
    
    const detailBody = document.getElementById('detailBody');
    detailBody.innerHTML = `
        <div class="detail-hero" style="background: linear-gradient(135deg, ${typeInfo.color}20, ${typeInfo.color}10);">
            <div class="detail-hero-icon" style="background: ${typeInfo.color}; color: #fff;">
                <i class="fas ${typeInfo.icon}"></i>
            </div>
            <div class="detail-hero-info">
                <h2>${activity.name}</h2>
                <span class="detail-type-badge" style="background: ${typeInfo.color}20; color: ${typeInfo.color};">${typeInfo.name}</span>
                <span class="detail-status-badge ${statusClass}">${statusText}</span>
            </div>
        </div>
        
        <div class="detail-desc-box">
            <p>${activity.description || '暂无活动描述'}</p>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">奖励设置</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">奖励类型</span>
                    <span class="detail-value">房豆</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">奖励数量</span>
                    <span class="detail-value reward">+${activity.rewardAmount} 房豆</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">参与限制</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">参与频率</span>
                    <span class="detail-value">${frequencyText}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">最大次数</span>
                    <span class="detail-value">${activity.frequency === 5 ? (activity.maxTimes || '不限') : '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">已参与</span>
                    <span class="detail-value highlight">${activity.participants || 0} 人次</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">活动时间</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">开始时间</span>
                    <span class="detail-value">${activity.startTime || '立即开始'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">结束时间</span>
                    <span class="detail-value">${activity.endTime || '长期有效'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">排序权重</span>
                    <span class="detail-value">${activity.sortOrder || 0}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">创建时间</span>
                    <span class="detail-value">${activity.createdAt || '-'}</span>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('detailModal').classList.add('show');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('show');
}

// ==================== 其他操作 ====================

function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const statusText = newStatus === 1 ? '开启' : '关闭';
    
    if (confirm(`确定要${statusText}该活动吗？`)) {
        updateData('platformActivities', id, { status: newStatus });
        showToast(`活动已${statusText}`, 'success');
        loadData();
    }
}

function deleteActivity(id) {
    if (confirm('确定要删除该活动吗？此操作不可恢复。')) {
        deleteData('platformActivities', id);
        showToast('活动已删除', 'success');
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
