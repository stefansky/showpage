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
    
    // Tab切换
    document.getElementById('tenantTab').addEventListener('click', function() {
        switchTab('tenant');
    });
    
    document.getElementById('landlordTab').addEventListener('click', function() {
        switchTab('landlord');
    });
}

// 当前选中的tab
let currentTab = 'tenant';

// 切换Tab
function switchTab(tab) {
    currentTab = tab;
    
    // 更新tab样式
    document.querySelectorAll('.tab-item').forEach(function(item) {
        if (item.dataset.tab === tab) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // 重新加载记录
    loadContactRecords();
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
    
    // 根据当前tab过滤记录
    const filteredRecords = records.filter(function(record) {
        return record.type === currentTab;
    });
    
    // 如果没有记录，显示空状态
    if (filteredRecords.length === 0) {
        // 如果没有记录，创建一些默认记录用于演示
        if (records.length === 0) {
            createMockRecords();
            loadContactRecords(); // 重新加载
            return;
        }
        
        // 如果有记录但没有当前tab类型的记录，检查是否需要创建模拟数据
        const hasCurrentType = records.some(function(record) {
            return record.type === currentTab;
        });
        
        if (!hasCurrentType) {
            // 当前tab类型没有记录，但其他类型有记录，创建包含所有类型的模拟数据
            createMockRecords();
            loadContactRecords(); // 重新加载
            return;
        }
        
        recordsList.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    // 按时间倒序排序
    filteredRecords.sort(function(a, b) {
        return new Date(b.contactTime) - new Date(a.contactTime);
    });
    
    // 显示记录
    displayRecords(filteredRecords);
}

// 创建模拟记录（用于演示）
function createMockRecords() {
    const mockRecords = [
        {
            id: 1,
            type: 'tenant',
            targetId: 'tenant1',
            contactTime: new Date(Date.now() - 86400000 * 2).toLocaleString('zh-CN'),
            name: '李先生',
            phone: '13800138001'
        },
        {
            id: 2,
            type: 'tenant',
            targetId: 'tenant2',
            contactTime: new Date(Date.now() - 86400000 * 5).toLocaleString('zh-CN'),
            name: '王女士',
            phone: '13800138002'
        },
        {
            id: 3,
            type: 'tenant',
            targetId: 'tenant3',
            contactTime: new Date(Date.now() - 86400000 * 7).toLocaleString('zh-CN'),
            name: '张同学',
            phone: '13800138003'
        },
        {
            id: 4,
            type: 'landlord',
            targetId: 'landlord1',
            contactTime: new Date(Date.now() - 86400000 * 1).toLocaleString('zh-CN'),
            name: '刘房东',
            phone: '13900139001',
            houseId: 1,
            landlordInfo: {
                id: 'landlord1',
                rentType: '整租',
                rooms: '2室1厅',
                moveInTime: '2024-02-10',
                houseId: 1
            }
        },
        {
            id: 5,
            type: 'landlord',
            targetId: 'landlord2',
            contactTime: new Date(Date.now() - 86400000 * 3).toLocaleString('zh-CN'),
            name: '陈房东',
            phone: '13900139002',
            houseId: 2,
            landlordInfo: {
                id: 'landlord2',
                rentType: '合租',
                rooms: '1室1厅',
                moveInTime: '随时入住',
                houseId: 2
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
        // 兼容新旧数据格式
        const name = record.name || 
                    (record.tenantInfo && record.tenantInfo.nickname) || 
                    (record.landlordInfo && record.landlordInfo.name) || 
                    (record.type === 'tenant' ? '租客' : '房东');
        const phone = record.phone || 
                     (record.tenantInfo && record.tenantInfo.phone) || 
                     (record.landlordInfo && record.landlordInfo.phone) || '';
        const contactTime = record.contactTime || record.time || '';
        
        // 获取租赁信息
        const rentType = (record.tenantInfo && record.tenantInfo.rentType) || 
                        (record.landlordInfo && record.landlordInfo.rentType) || 
                        '整租';
        const rooms = (record.tenantInfo && record.tenantInfo.rooms) || 
                     (record.landlordInfo && record.landlordInfo.rooms) || 
                     '';
        const moveInTime = (record.tenantInfo && record.tenantInfo.moveInTime) || 
                          (record.landlordInfo && record.landlordInfo.moveInTime) || 
                          '随时入住';
        
        // 格式化手机号（脱敏显示）
        const maskedPhone = maskPhone(phone);
        
        // 判断是租客还是房东
        const isLandlord = record.type === 'landlord';
        const timeLabel = isLandlord ? '出租时间' : '入住时间';
        
        // 获取房源ID（用于房东查看房源）
        const houseId = (record.landlordInfo && record.landlordInfo.houseId) || 
                       (record.houseId) || 
                       null;
        const landlordId = record.targetId || record.landlordInfo?.id || null;
        
        return `
            <div class="record-card" data-record-id="${record.id}">
                <div class="record-header">
                    <div class="record-info">
                        <div class="record-name">${name}</div>
                        <div class="record-meta">
                            <span class="rent-type-tag">${rentType}</span>
                            ${rooms ? `<span class="rooms-tag">${rooms}</span>` : ''}
                        </div>
                    </div>
                    <div class="record-time">
                        <i class="fas fa-clock"></i>
                        <span>${formatTime(contactTime)}</span>
                    </div>
                </div>
                <div class="record-body">
                    <div class="record-phone-section">
                        <div class="phone-display">
                            <i class="fas fa-calendar-alt"></i>
                            <div class="phone-label">${timeLabel}</div>
                            <span class="phone-number">${formatMoveInTime(moveInTime)}</span>
                        </div>
                    </div>
                    <div class="record-contact-section">
                        <div class="phone-display">
                            <i class="fas fa-phone"></i>
                            <span class="phone-number">${maskedPhone}</span>
                            <button class="copy-btn" onclick="event.stopPropagation(); copyPhone('${phone}')">
                                <i class="fas fa-copy"></i>
                                <span>复制</span>
                            </button>
                        </div>
                    </div>
                    ${isLandlord && houseId ? `
                    <div class="record-action-section">
                        <button class="view-btn" onclick="event.stopPropagation(); viewHouseDetail('${houseId}', '${landlordId}')">
                            <i class="fas fa-eye"></i>
                            <span>查看房源</span>
                        </button>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// 复制手机号
function copyPhone(phone) {
    if (!phone) {
        alert('联系方式为空');
        return;
    }
    
    // 使用现代 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(phone).then(function() {
            showCopySuccess();
        }).catch(function(err) {
            console.error('复制失败:', err);
            fallbackCopyPhone(phone);
        });
    } else {
        fallbackCopyPhone(phone);
    }
}

// 备用复制方法
function fallbackCopyPhone(phone) {
    const textArea = document.createElement('textarea');
    textArea.value = phone;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制：' + phone);
    }
    document.body.removeChild(textArea);
}

// 查看房源详情（房东）
function viewHouseDetail(houseId, landlordId) {
    if (!houseId) {
        alert('房源信息不存在');
        return;
    }
    
    // 跳转到房源详情页
    let url = `../house-detail/index.html?id=${houseId}`;
    if (landlordId) {
        url += `&landlordId=${landlordId}`;
    }
    window.location.href = url;
}

// 显示复制成功提示
function showCopySuccess() {
    // 简单的提示，可以后续优化为更美观的toast
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.textContent = '已复制到剪贴板';
    document.body.appendChild(toast);
    
    setTimeout(function() {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}


// 格式化入住时间
function formatMoveInTime(timeStr) {
    if (!timeStr || timeStr === '随时入住') {
        return '随时入住';
    }
    
    // 如果是日期格式，转换为更易读的格式
    try {
        const date = new Date(timeStr);
        if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    } catch (e) {
        // 如果解析失败，直接返回原值
    }
    
    return timeStr;
}

// 格式化手机号（脱敏显示）
function maskPhone(phone) {
    if (!phone || phone.length < 7) {
        return phone || '';
    }
    
    // 手机号格式：138****8001（显示前3位和后4位）
    if (phone.length === 11) {
        return phone.substring(0, 3) + '****' + phone.substring(7);
    }
    
    // 其他长度：显示前3位和后2位
    const start = phone.substring(0, 3);
    const end = phone.substring(phone.length - 2);
    const stars = '*'.repeat(Math.max(4, phone.length - 5));
    return start + stars + end;
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

