// 联系记录页面脚本

let currentPage = 1;
const pageSize = 10;

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
    document.getElementById('contactInput').value = '';
    document.getElementById('viewerTypeFilter').value = '';
    document.getElementById('targetTypeFilter').value = '';
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
    let records = getData('contactRecords');
    const users = getData('users');
    const stores = getData('stores');
    const houses = getData('houses');
    const findRequests = getData('findRequests');
    
    const contactInput = document.getElementById('contactInput')?.value.toLowerCase() || '';
    const viewerTypeFilter = document.getElementById('viewerTypeFilter')?.value || '';
    const targetTypeFilter = document.getElementById('targetTypeFilter')?.value || '';
    const startDate = document.getElementById('startDate')?.value || '';
    const endDate = document.getElementById('endDate')?.value || '';
    
    // 搜索和筛选
    records = records.filter(item => {
        // 联系方式搜索
        const matchContact = !contactInput || item.contactInfo?.toLowerCase().includes(contactInput);
        const matchViewerType = !viewerTypeFilter || String(item.viewerType) === viewerTypeFilter;
        const matchTargetType = !targetTypeFilter || String(item.targetType) === targetTypeFilter;
        
        // 时间范围筛选
        const matchStartDate = !startDate || (item.createdAt && item.createdAt >= startDate);
        const matchEndDate = !endDate || (item.createdAt && item.createdAt <= endDate + ' 23:59:59');
        
        return matchContact && matchViewerType && matchTargetType && matchStartDate && matchEndDate;
    });
    
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

// 获取查看者名称
function getViewerName(record, users, stores) {
    if (record.viewerType === 1) {
        const user = users.find(u => u.id === record.viewerId);
        return user?.nickname || `用户#${record.viewerId}`;
    } else {
        const store = stores.find(s => s.id === record.viewerId);
        return store?.name || `商家#${record.viewerId}`;
    }
}

// 获取发布者名称
function getOwnerName(record, users, stores) {
    if (record.ownerType === 1) {
        const user = users.find(u => u.id === record.ownerId);
        return user?.nickname || `用户#${record.ownerId}`;
    } else {
        const store = stores.find(s => s.id === record.ownerId);
        return store?.name || `商家#${record.ownerId}`;
    }
}

// 获取目标信息
function getTargetInfo(record, houses, findRequests) {
    if (record.targetType === 1) {
        const house = houses.find(h => h.id === record.targetId);
        return house?.title || `房源#${record.targetId}`;
    } else {
        const findReq = findRequests.find(f => f.id === record.targetId);
        if (findReq) {
            const budget = findReq.minPrice && findReq.maxPrice 
                ? `${findReq.minPrice}-${findReq.maxPrice}元` 
                : '不限预算';
            return `找房需求 (${budget})`;
        }
        return `找房#${record.targetId}`;
    }
}

// 显示数据
function displayData(records, users, stores, houses, findRequests) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    if (records.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-inbox" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
                    暂无联系记录数据
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = records.map(record => {
        const viewerTypeBadge = record.viewerType === 1 
            ? '<span class="type-badge user">用户</span>' 
            : '<span class="type-badge store">商家</span>';
        const viewerName = getViewerName(record, users, stores);
        
        const targetTypeBadge = record.targetType === 1 
            ? '<span class="type-badge house">房源</span>' 
            : '<span class="type-badge find">找房</span>';
        const targetInfo = getTargetInfo(record, houses, findRequests);
        
        const ownerTypeBadge = record.ownerType === 1 
            ? '<span class="type-badge user">用户</span>' 
            : '<span class="type-badge store">商家</span>';
        const ownerName = getOwnerName(record, users, stores);
        
        return `
            <tr>
                <td>${record.id}</td>
                <td>
                    <div class="person-cell">
                        ${viewerTypeBadge}
                        <span class="person-name">${viewerName}</span>
                    </div>
                </td>
                <td>${targetTypeBadge}</td>
                <td>
                    <div class="target-info" title="${targetInfo}">
                        ${targetInfo.length > 15 ? targetInfo.substring(0, 15) + '...' : targetInfo}
                    </div>
                </td>
                <td>
                    <div class="person-cell">
                        ${ownerTypeBadge}
                        <span class="person-name">${ownerName}</span>
                    </div>
                </td>
                <td><span class="contact-info">${record.contactInfo}</span></td>
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

// 查看详情
function viewDetail(id) {
    const records = getData('contactRecords');
    const users = getData('users');
    const stores = getData('stores');
    const houses = getData('houses');
    const findRequests = getData('findRequests');
    
    const record = records.find(r => r.id === id);
    if (!record) return;
    
    const viewerName = getViewerName(record, users, stores);
    const ownerName = getOwnerName(record, users, stores);
    const targetInfo = getTargetInfo(record, houses, findRequests);
    
    const viewerTypeText = record.viewerType === 1 ? '用户' : '商家';
    const ownerTypeText = record.ownerType === 1 ? '用户' : '商家';
    const targetTypeText = record.targetType === 1 ? '房源' : '找房需求';
    
    const detailBody = document.getElementById('detailBody');
    detailBody.innerHTML = `
        <div class="detail-section">
            <div class="detail-section-title">查看者信息</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">查看者类型</span>
                    <span class="detail-value">${viewerTypeText}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">查看者</span>
                    <span class="detail-value">${viewerName}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">目标信息</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">目标类型</span>
                    <span class="detail-value">${targetTypeText}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">目标详情</span>
                    <span class="detail-value">${targetInfo}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">发布者信息</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">发布者类型</span>
                    <span class="detail-value">${ownerTypeText}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">发布者</span>
                    <span class="detail-value">${ownerName}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">联系方式信息</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">联系方式</span>
                    <span class="detail-value highlight">${record.contactInfo}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">获取时间</span>
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
    if (confirm('确定要删除这条联系记录吗？此操作不可恢复。')) {
        deleteData('contactRecords', id);
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
