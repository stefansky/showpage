// 看房管理页面脚本

let currentPage = 1;
const pageSize = 10;

// 来源类型映射
const SOURCE_MAP = {
    1: { text: '用户申请', icon: 'fa-user', class: 'user' },
    2: { text: '商家邀约', icon: 'fa-store', class: 'store' },
    3: { text: '扫码预约', icon: 'fa-qrcode', class: 'qrcode' }
};

// 状态映射
const STATUS_MAP = {
    0: { text: '待确认', class: 'pending', icon: 'fa-clock' },
    1: { text: '已确认', class: 'confirmed', icon: 'fa-check' },
    2: { text: '已完成', class: 'completed', icon: 'fa-flag-checkered' },
    3: { text: '已拒绝', class: 'rejected', icon: 'fa-times' },
    4: { text: '已取消', class: 'cancelled', icon: 'fa-ban' }
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
    document.getElementById('tenantNameInput').value = '';
    document.getElementById('tenantPhoneInput').value = '';
    document.getElementById('sourceFilter').value = '';
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
    let visits = getData('visitRecords');
    
    const tenantNameInput = document.getElementById('tenantNameInput')?.value.toLowerCase() || '';
    const tenantPhoneInput = document.getElementById('tenantPhoneInput')?.value || '';
    const sourceFilter = document.getElementById('sourceFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const startDate = document.getElementById('startDate')?.value || '';
    const endDate = document.getElementById('endDate')?.value || '';
    
    // 搜索和筛选
    visits = visits.filter(item => {
        const matchTenantName = !tenantNameInput || (item.tenantName || '').toLowerCase().includes(tenantNameInput);
        const matchTenantPhone = !tenantPhoneInput || (item.tenantPhone || '').includes(tenantPhoneInput);
        const matchSource = !sourceFilter || String(item.sourceType) === sourceFilter;
        const matchStatus = !statusFilter || String(item.status) === statusFilter;
        const matchStartDate = !startDate || (item.visitTime && item.visitTime >= startDate);
        const matchEndDate = !endDate || (item.visitTime && item.visitTime <= endDate + ' 23:59:59');
        return matchTenantName && matchTenantPhone && matchSource && matchStatus && matchStartDate && matchEndDate;
    });
    
    // 按时间倒序，待确认的优先
    visits.sort((a, b) => {
        if (a.status === 0 && b.status !== 0) return -1;
        if (a.status !== 0 && b.status === 0) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // 分页
    const total = visits.length;
    const start = (currentPage - 1) * pageSize;
    const paginated = visits.slice(start, start + pageSize);
    
    displayData(paginated);
    createPagination(total, currentPage, pageSize, (page) => {
        currentPage = page;
        loadData();
    });
}

// 显示数据
function displayData(visits) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    if (visits.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-inbox" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
                    暂无看房预约数据
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = visits.map(visit => {
        const sourceInfo = SOURCE_MAP[visit.sourceType] || SOURCE_MAP[1];
        const statusInfo = STATUS_MAP[visit.status] || STATUS_MAP[0];
        const ownerTypeText = visit.ownerType === 1 ? '房东' : '商家';
        
        // 判断目标显示
        let targetDisplay = '';
        if (visit.houseTitle) {
            targetDisplay = `<span class="house-title" title="${visit.houseTitle}">${visit.houseTitle.length > 12 ? visit.houseTitle.substring(0, 12) + '...' : visit.houseTitle}</span>`;
        } else {
            targetDisplay = `<span class="store-name">${visit.ownerName || '-'}</span>`;
        }
        
        return `
            <tr class="${visit.status === 0 ? 'highlight-row' : ''}">
                <td>${visit.id}</td>
                <td>
                    <span class="source-badge ${sourceInfo.class}">
                        <i class="fas ${sourceInfo.icon}"></i>
                        ${sourceInfo.text}
                    </span>
                </td>
                <td>
                    <div class="tenant-cell">
                        <span class="tenant-name">${visit.tenantName || '-'}</span>
                        <span class="tenant-phone">${visit.tenantPhone || '-'}</span>
                    </div>
                </td>
                <td>${targetDisplay}</td>
                <td>
                    <div class="owner-cell">
                        <span class="owner-type">${ownerTypeText}</span>
                        <span class="owner-name">${visit.ownerName || '-'}</span>
                    </div>
                </td>
                <td>
                    <span class="visit-time ${!visit.visitTime ? 'pending' : ''}">
                        ${visit.visitTime || '待确认'}
                    </span>
                </td>
                <td>
                    <span class="status-badge ${statusInfo.class}">
                        <i class="fas ${statusInfo.icon}"></i>
                        ${statusInfo.text}
                    </span>
                </td>
                <td>${visit.createdAt || '-'}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn info" onclick="viewDetail(${visit.id})" title="查看详情">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${visit.status === 0 ? `
                            <button class="action-btn success" onclick="confirmVisit(${visit.id})" title="确认预约">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="action-btn warning" onclick="rejectVisit(${visit.id})" title="拒绝">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : ''}
                        ${visit.status === 1 ? `
                            <button class="action-btn primary" onclick="completeVisit(${visit.id})" title="标记完成">
                                <i class="fas fa-flag-checkered"></i>
                            </button>
                        ` : ''}
                        <button class="action-btn danger" onclick="deleteVisit(${visit.id})" title="删除">
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
    const visits = getData('visitRecords');
    const visit = visits.find(v => v.id === id);
    if (!visit) return;
    
    const sourceInfo = SOURCE_MAP[visit.sourceType] || SOURCE_MAP[1];
    const statusInfo = STATUS_MAP[visit.status] || STATUS_MAP[0];
    const ownerTypeText = visit.ownerType === 1 ? '个人房东' : '商家';
    
    const detailBody = document.getElementById('detailBody');
    detailBody.innerHTML = `
        <div class="detail-header-card">
            <div class="detail-header-left">
                <span class="source-badge ${sourceInfo.class} large">
                    <i class="fas ${sourceInfo.icon}"></i>
                    ${sourceInfo.text}
                </span>
                <span class="status-badge ${statusInfo.class} large">
                    <i class="fas ${statusInfo.icon}"></i>
                    ${statusInfo.text}
                </span>
            </div>
            <div class="visit-time-display">
                <i class="fas fa-calendar-check"></i>
                <span>${visit.visitTime || '待确认时间'}</span>
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">租客信息</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">租客姓名</span>
                    <span class="detail-value">${visit.tenantName || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">联系电话</span>
                    <span class="detail-value phone">${visit.tenantPhone || '-'}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">看房目标</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">目标类型</span>
                    <span class="detail-value">${visit.houseId ? '指定房源' : '商家门店'}</span>
                </div>
                ${visit.houseTitle ? `
                    <div class="detail-item full-width">
                        <span class="detail-label">房源信息</span>
                        <span class="detail-value house-link">${visit.houseTitle}</span>
                    </div>
                ` : ''}
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">${ownerTypeText}信息</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">类型</span>
                    <span class="detail-value">${ownerTypeText}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">名称</span>
                    <span class="detail-value">${visit.ownerName || '-'}</span>
                </div>
                ${visit.ownerPhone ? `
                    <div class="detail-item">
                        <span class="detail-label">联系电话</span>
                        <span class="detail-value phone">${visit.ownerPhone}</span>
                    </div>
                ` : ''}
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">预约信息</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">申请时间</span>
                    <span class="detail-value">${visit.createdAt || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">预约时间</span>
                    <span class="detail-value ${!visit.visitTime ? 'pending' : ''}">${visit.visitTime || '待确认'}</span>
                </div>
                ${visit.remark ? `
                    <div class="detail-item full-width">
                        <span class="detail-label">备注</span>
                        <span class="detail-value">${visit.remark}</span>
                    </div>
                ` : ''}
                ${visit.status === 3 && visit.rejectReason ? `
                    <div class="detail-item full-width">
                        <span class="detail-label">拒绝原因</span>
                        <span class="detail-value reject-reason">${visit.rejectReason}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    document.getElementById('detailModal').classList.add('show');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('show');
}

// ==================== 操作功能 ====================

function confirmVisit(id) {
    const visitTime = prompt('请输入预约看房时间（格式：2024-01-20 14:00）');
    if (!visitTime) return;
    
    // 简单验证时间格式
    if (!/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/.test(visitTime)) {
        showToast('时间格式不正确，请使用：2024-01-20 14:00', 'error');
        return;
    }
    
    const visits = getData('visitRecords');
    const index = visits.findIndex(v => v.id === id);
    if (index !== -1) {
        visits[index].status = 1;
        visits[index].visitTime = visitTime + ':00';
        visits[index].updatedAt = formatDateTime();
        saveData('visitRecords', visits);
        showToast('预约已确认', 'success');
        loadData();
    }
}

function rejectVisit(id) {
    const reason = prompt('请输入拒绝原因（可选）');
    
    if (confirm('确定要拒绝该看房预约吗？')) {
        const visits = getData('visitRecords');
        const index = visits.findIndex(v => v.id === id);
        if (index !== -1) {
            visits[index].status = 3;
            visits[index].rejectReason = reason || '';
            visits[index].updatedAt = formatDateTime();
            saveData('visitRecords', visits);
            showToast('已拒绝该预约', 'success');
            loadData();
        }
    }
}

function completeVisit(id) {
    if (confirm('确定将该预约标记为已完成吗？')) {
        const visits = getData('visitRecords');
        const index = visits.findIndex(v => v.id === id);
        if (index !== -1) {
            visits[index].status = 2;
            visits[index].updatedAt = formatDateTime();
            saveData('visitRecords', visits);
            showToast('已标记为完成', 'success');
            loadData();
        }
    }
}

function deleteVisit(id) {
    if (confirm('确定要删除这条看房记录吗？此操作不可恢复。')) {
        deleteData('visitRecords', id);
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
