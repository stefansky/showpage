// 开店申请页面脚本

let currentPage = 1;
const pageSize = 10;
let handlingId = null;

// 状态映射
const STATUS_MAP = {
    0: { text: '待处理', class: 'pending', icon: 'fa-clock' },
    1: { text: '已联系', class: 'contacted', icon: 'fa-phone' },
    2: { text: '已开通', class: 'opened', icon: 'fa-store' },
    3: { text: '无效', class: 'invalid', icon: 'fa-ban' }
};

// 初始化页面
function initPage() {
    loadData();
    bindEvents();
}

// 绑定事件
function bindEvents() {
    // 事件由查询按钮触发
}

// 搜索数据
function searchData() {
    currentPage = 1;
    loadData();
}

// 重置搜索
function resetSearch() {
    document.getElementById('contactPersonInput').value = '';
    document.getElementById('contactPhoneInput').value = '';
    document.getElementById('communityInput').value = '';
    document.getElementById('statusFilter').value = '';
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

// 加载数据
function loadData() {
    let applications = getData('storeApplications');
    
    const contactPersonInput = document.getElementById('contactPersonInput')?.value.toLowerCase() || '';
    const contactPhoneInput = document.getElementById('contactPhoneInput')?.value || '';
    const communityInput = document.getElementById('communityInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const startDate = document.getElementById('startDate')?.value || '';
    const endDate = document.getElementById('endDate')?.value || '';
    
    // 搜索和筛选
    applications = applications.filter(item => {
        const matchContactPerson = !contactPersonInput || (item.contactPerson || '').toLowerCase().includes(contactPersonInput);
        const matchContactPhone = !contactPhoneInput || (item.contactPhone || '').includes(contactPhoneInput);
        const matchCommunity = !communityInput || (item.targetCommunity || '').toLowerCase().includes(communityInput);
        const matchStatus = !statusFilter || String(item.status) === statusFilter;
        const matchStartDate = !startDate || (item.createdAt && item.createdAt >= startDate);
        const matchEndDate = !endDate || (item.createdAt && item.createdAt <= endDate + ' 23:59:59');
        return matchContactPerson && matchContactPhone && matchCommunity && matchStatus && matchStartDate && matchEndDate;
    });
    
    // 按时间倒序，待处理的优先
    applications.sort((a, b) => {
        if (a.status === 0 && b.status !== 0) return -1;
        if (a.status !== 0 && b.status === 0) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // 分页
    const total = applications.length;
    const start = (currentPage - 1) * pageSize;
    const paginated = applications.slice(start, start + pageSize);
    
    displayData(paginated);
    createPagination(total, currentPage, pageSize, (page) => {
        currentPage = page;
        loadData();
    });
}

// 更新统计数据（已移除统计卡片，保留函数兼容性）
function updateStats(applications) {
    // 统计卡片已移除
    
    animateValue(document.getElementById('totalApplications'), 0, total, 400);
    animateValue(document.getElementById('pendingCount'), 0, pending, 400);
    animateValue(document.getElementById('contactedCount'), 0, contacted, 400);
    animateValue(document.getElementById('openedCount'), 0, opened, 400);
}

// 显示数据
function displayData(applications) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    if (applications.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-inbox" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
                    暂无开店申请数据
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = applications.map(app => {
        const statusInfo = STATUS_MAP[app.status] || STATUS_MAP[0];
        const remarkText = app.remark ? (app.remark.length > 20 ? app.remark.substring(0, 20) + '...' : app.remark) : '-';
        const communityText = app.targetCommunity ? (app.targetCommunity.length > 15 ? app.targetCommunity.substring(0, 15) + '...' : app.targetCommunity) : '-';
        
        return `
            <tr class="${app.status === 0 ? 'highlight-row' : ''}">
                <td>${app.id}</td>
                <td>
                    <span class="contact-person">${app.contactPerson || '-'}</span>
                </td>
                <td>
                    <span class="contact-phone">${app.contactPhone || '-'}</span>
                </td>
                <td>
                    <span class="community" title="${app.targetCommunity || ''}">${communityText}</span>
                </td>
                <td>
                    <span class="remark-text" title="${app.remark || ''}">${remarkText}</span>
                </td>
                <td>
                    <span class="status-badge ${statusInfo.class}">
                        <i class="fas ${statusInfo.icon}"></i>
                        ${statusInfo.text}
                    </span>
                </td>
                <td>${app.createdAt || '-'}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn info" onclick="viewDetail(${app.id})" title="查看详情">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${app.status !== 2 ? `
                            <button class="action-btn primary" onclick="openHandleModal(${app.id})" title="处理">
                                <i class="fas fa-edit"></i>
                            </button>
                        ` : ''}
                        <button class="action-btn danger" onclick="deleteApplication(${app.id})" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ==================== 详情弹窗 ====================

function viewDetail(id) {
    const applications = getData('storeApplications');
    const app = applications.find(a => a.id === id);
    if (!app) return;
    
    const statusInfo = STATUS_MAP[app.status] || STATUS_MAP[0];
    
    const detailBody = document.getElementById('detailBody');
    detailBody.innerHTML = `
        <div class="detail-header-card">
            <div class="applicant-info">
                <div class="applicant-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="applicant-detail">
                    <h3>${app.contactPerson || '未知'}</h3>
                    <p><i class="fas fa-phone"></i> ${app.contactPhone || '-'}</p>
                </div>
            </div>
            <span class="status-badge ${statusInfo.class}">
                <i class="fas ${statusInfo.icon}"></i>
                ${statusInfo.text}
            </span>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">申请信息</div>
            <div class="detail-grid">
                <div class="detail-item full-width">
                    <span class="detail-label">意向小区</span>
                    <span class="detail-value">${app.targetCommunity || '未填写'}</span>
                </div>
                <div class="detail-item full-width">
                    <span class="detail-label">备注信息</span>
                    <span class="detail-value">${app.remark || '无'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">申请时间</span>
                    <span class="detail-value">${app.createdAt || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">更新时间</span>
                    <span class="detail-value">${app.updatedAt || '-'}</span>
                </div>
            </div>
        </div>
        
        ${app.status !== 0 ? `
            <div class="detail-section">
                <div class="detail-section-title">处理信息</div>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">处理状态</span>
                        <span class="detail-value">
                            <span class="status-badge ${statusInfo.class} small">
                                <i class="fas ${statusInfo.icon}"></i>
                                ${statusInfo.text}
                            </span>
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">处理时间</span>
                        <span class="detail-value">${app.handleTime || '-'}</span>
                    </div>
                    <div class="detail-item full-width">
                        <span class="detail-label">处理备注</span>
                        <span class="detail-value">${app.handleRemark || '无'}</span>
                    </div>
                </div>
            </div>
        ` : ''}
    `;
    
    document.getElementById('detailModal').classList.add('show');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('show');
}

// ==================== 处理弹窗 ====================

function openHandleModal(id) {
    const applications = getData('storeApplications');
    const app = applications.find(a => a.id === id);
    if (!app) return;
    
    handlingId = id;
    
    // 显示申请信息
    document.getElementById('handleInfo').innerHTML = `
        <div class="handle-info-card">
            <div class="info-row">
                <span class="info-label"><i class="fas fa-user"></i> 联系人</span>
                <span class="info-value">${app.contactPerson || '-'}</span>
            </div>
            <div class="info-row">
                <span class="info-label"><i class="fas fa-phone"></i> 电话</span>
                <span class="info-value">${app.contactPhone || '-'}</span>
            </div>
            <div class="info-row">
                <span class="info-label"><i class="fas fa-building"></i> 意向小区</span>
                <span class="info-value">${app.targetCommunity || '未填写'}</span>
            </div>
        </div>
    `;
    
    // 重置表单
    document.querySelectorAll('input[name="handleStatus"]').forEach(input => input.checked = false);
    document.getElementById('handleRemark').value = '';
    
    // 如果有之前的状态，选中
    if (app.status > 0) {
        const radio = document.querySelector(`input[name="handleStatus"][value="${app.status}"]`);
        if (radio) radio.checked = true;
        document.getElementById('handleRemark').value = app.handleRemark || '';
    }
    
    document.getElementById('handleModal').classList.add('show');
}

function closeHandleModal() {
    document.getElementById('handleModal').classList.remove('show');
    handlingId = null;
}

function confirmHandle() {
    if (!handlingId) return;
    
    const status = document.querySelector('input[name="handleStatus"]:checked')?.value;
    const handleRemark = document.getElementById('handleRemark').value.trim();
    
    if (!status) {
        showToast('请选择处理状态', 'error');
        return;
    }
    
    const updateData = {
        status: parseInt(status),
        handleTime: formatDateTime(),
        handleRemark,
        updatedAt: formatDateTime()
    };
    
    // 更新数据
    const applications = getData('storeApplications');
    const index = applications.findIndex(a => a.id === handlingId);
    if (index !== -1) {
        applications[index] = { ...applications[index], ...updateData };
        saveData('storeApplications', applications);
    }
    
    const statusText = STATUS_MAP[status]?.text || '已处理';
    showToast(`申请已标记为"${statusText}"`, 'success');
    closeHandleModal();
    loadData();
}

// ==================== 其他操作 ====================

function deleteApplication(id) {
    if (confirm('确定要删除这条申请记录吗？此操作不可恢复。')) {
        deleteData('storeApplications', id);
        showToast('申请已删除', 'success');
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
