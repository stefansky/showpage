// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadContactRecords();
});

// 初始化事件监听
function initEventListeners() {
    // 返回按钮
    document.getElementById('backBtn').addEventListener('click', function() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '../me/index.html';
        }
    });
}

// 加载联系记录
function loadContactRecords() {
    const recordsList = document.getElementById('recordsList');
    const emptyState = document.getElementById('emptyState');
    
    // 从localStorage加载联系记录
    let records = [];
    try {
        const storedRecords = localStorage.getItem('shopContactRecords');
        if (storedRecords) {
            records = JSON.parse(storedRecords);
        }
    } catch (e) {
        console.error('Error parsing contact records:', e);
        records = [];
    }
    
    // 只显示租客类型的记录
    const tenantRecords = records.filter(function(record) {
        return record.type === 'tenant';
    });
    
    // 如果没有记录，显示空状态
    if (tenantRecords.length === 0) {
        recordsList.style.display = 'none';
        emptyState.style.display = 'flex';
        
        // 如果没有记录，创建一些默认记录用于演示
        createMockRecords();
        loadContactRecords(); // 重新加载
        return;
    }
    
    // 按时间倒序排序
    tenantRecords.sort(function(a, b) {
        return new Date(b.contactTime) - new Date(a.contactTime);
    });
    
    // 显示记录
    displayRecords(tenantRecords);
}

// 创建模拟记录（用于演示）
function createMockRecords() {
    const mockRecords = [
        {
            id: 1,
            type: 'tenant',
            targetId: 'tenant1',
            contactTime: new Date(Date.now() - 86400000 * 2).toLocaleString('zh-CN'),
            tenantInfo: {
                id: 'tenant1',
                nickname: '李先生',
                avatar: '',
                rentType: '整租',
                rooms: '2室1厅',
                moveInTime: '1个月内',
                location: {
                    name: '光谷广场',
                    address: '武汉市洪山区光谷广场A座',
                    lat: '30.581084',
                    lng: '114.316200'
                },
                phone: '13800138001'
            }
        },
        {
            id: 2,
            type: 'tenant',
            targetId: 'tenant2',
            contactTime: new Date(Date.now() - 86400000 * 5).toLocaleString('zh-CN'),
            tenantInfo: {
                id: 'tenant2',
                nickname: '王女士',
                avatar: '',
                rentType: '合租',
                rooms: '1室1厅',
                moveInTime: '随时入住',
                location: {
                    name: '街道口',
                    address: '武汉市洪山区街道口B座',
                    lat: '30.531084',
                    lng: '114.356200'
                },
                phone: '13800138002'
            }
        },
        {
            id: 3,
            type: 'tenant',
            targetId: 'tenant3',
            contactTime: new Date(Date.now() - 86400000 * 7).toLocaleString('zh-CN'),
            tenantInfo: {
                id: 'tenant3',
                nickname: '张同学',
                avatar: '',
                rentType: '整租',
                rooms: '3室2厅',
                moveInTime: '3个月内',
                location: {
                    name: '光谷软件园',
                    address: '武汉市洪山区光谷软件园C座',
                    lat: '30.591084',
                    lng: '114.326200'
                },
                phone: '13800138003'
            }
        }
    ];
    
    localStorage.setItem('shopContactRecords', JSON.stringify(mockRecords));
}

// 显示记录
function displayRecords(records) {
    const recordsList = document.getElementById('recordsList');
    const emptyState = document.getElementById('emptyState');
    
    if (records.length === 0) {
        recordsList.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    recordsList.style.display = 'flex';
    emptyState.style.display = 'none';
    
    recordsList.innerHTML = records.map(function(record) {
        const tenant = record.tenantInfo || {};
        const avatarHtml = tenant.avatar 
            ? `<img src="${tenant.avatar}" alt="${tenant.nickname}">`
            : `<i class="fas fa-user"></i>`;
        
        return `
            <div class="record-card" data-record-id="${record.id}" data-tenant-id="${tenant.id}">
                <div class="record-header">
                    <div class="record-avatar">
                        ${avatarHtml}
                    </div>
                    <div class="record-info">
                        <div class="record-name">${tenant.nickname || '租客'}</div>
                        <div class="record-time">
                            <i class="fas fa-clock"></i>
                            <span>${formatTime(record.contactTime)}</span>
                        </div>
                    </div>
                </div>
                <div class="record-body">
                    <div class="record-detail">
                        <i class="fas fa-home"></i>
                        <span>${tenant.rentType || '-'} · ${tenant.rooms || '-'}</span>
                    </div>
                    <div class="record-detail">
                        <i class="fas fa-calendar-alt"></i>
                        <span>入住时间：${tenant.moveInTime || '-'}</span>
                    </div>
                    <div class="record-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${tenant.location ? tenant.location.name : '-'}</span>
                    </div>
                    <div class="record-tags">
                        <span class="record-tag">${tenant.rentType || '整租'}</span>
                        <span class="record-tag">${tenant.rooms || '2室1厅'}</span>
                    </div>
                </div>
                <div class="record-footer">
                    <div class="record-action">
                        <i class="fas fa-chevron-right"></i>
                        <span>查看详情</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // 添加点击事件
    recordsList.querySelectorAll('.record-card').forEach(function(card) {
        card.addEventListener('click', function() {
            const tenantId = this.dataset.tenantId;
            const recordId = this.dataset.recordId;
            viewTenantDetail(tenantId, recordId);
        });
    });
}

// 查看租客详情
function viewTenantDetail(tenantId, recordId) {
    // 从localStorage加载租客信息
    const records = JSON.parse(localStorage.getItem('shopContactRecords') || '[]');
    const record = records.find(function(r) {
        return r.id == recordId && r.targetId === tenantId;
    });
    
    if (!record || !record.tenantInfo) {
        alert('租客信息不存在');
        return;
    }
    
    // 将租客信息存储到临时变量，供详情页使用
    sessionStorage.setItem('viewingTenant', JSON.stringify(record.tenantInfo));
    
    // 跳转到租客详情页
    window.location.href = `tenant-detail/index.html?id=${tenantId}`;
}

// 格式化时间
function formatTime(timeString) {
    if (!timeString) return '-';
    
    const time = new Date(timeString);
    const now = new Date();
    const diff = now - time;
    
    // 小于1分钟
    if (diff < 60000) {
        return '刚刚';
    }
    
    // 小于1小时
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return minutes + '分钟前';
    }
    
    // 小于24小时
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return hours + '小时前';
    }
    
    // 小于7天
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return days + '天前';
    }
    
    // 超过7天，显示具体日期
    const month = time.getMonth() + 1;
    const day = time.getDate();
    const hour = time.getHours();
    const minute = time.getMinutes();
    
    return `${month}月${day}日 ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

