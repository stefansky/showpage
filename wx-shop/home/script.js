// 初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded fired');
    initEventListeners();
    loadStoreData();
    // 确保租客列表加载
    setTimeout(function() {
        loadTenants();
    }, 100);
});

// 页面加载完成后也尝试加载
window.addEventListener('load', function() {
    console.log('Window load fired');
    const tenantsList = document.getElementById('tenantsList');
    if (tenantsList && (tenantsList.innerHTML.trim() === '' || tenantsList.children.length === 0)) {
        console.log('Tenants list still empty, reloading...');
        loadTenants();
    }
});

// 初始化事件监听
function initEventListeners() {
    // 弹窗事件
    document.getElementById('closeModal').addEventListener('click', function() {
        closeContactModal();
    });
    
    document.getElementById('cancelBtn').addEventListener('click', function() {
        closeContactModal();
    });
    
    const confirmBtn = document.getElementById('confirmBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            getTenantContact();
        });
    }
    
    document.getElementById('modalBackdrop').addEventListener('click', function() {
        closeContactModal();
    });
    
    // 复制手机号按钮（事件委托）
    document.addEventListener('click', function(e) {
        if (e.target.closest('.copy-phone-btn')) {
            const btn = e.target.closest('.copy-phone-btn');
            const phone = btn.dataset.phone;
            if (phone) {
                copyToClipboard(phone);
                alert('已复制到剪贴板');
            }
        }
    });
    // 底部导航
    document.getElementById('homeNav').addEventListener('click', function() {
        // 已在首页，无需操作
    });
    
    document.getElementById('meNav').addEventListener('click', function() {
        window.location.href = '../me/index.html';
    });
    
    // 快捷功能
    document.getElementById('addHouseBtn').addEventListener('click', function() {
        window.location.href = '../add-house/index.html';
    });
    
    document.getElementById('myHousesBtn').addEventListener('click', function() {
        window.location.href = '../my-houses/index.html';
    });
    
    document.getElementById('nearbyTenantsBtn').addEventListener('click', function() {
        window.location.href = '../operation/index.html';
    });
    
    document.getElementById('storeWalletBtn').addEventListener('click', function() {
        window.location.href = '../nearby-landlords/index.html';
    });
    
    // 查看更多租客
    document.getElementById('moreTenantsBtn').addEventListener('click', function() {
        alert('查看更多租客\n\n跳转到附近租客列表页面');
        // window.location.href = '../nearby-tenants/index.html';
    });
    
    // 消息按钮
    document.getElementById('messageBtn').addEventListener('click', function() {
        alert('消息通知\n\n跳转到消息中心');
        // window.location.href = '../messages/index.html';
    });
    
    // 二维码按钮
    document.getElementById('qrCodeBtn').addEventListener('click', function() {
        showQrCodeModal();
    });
    
    // 关闭二维码弹窗
    document.getElementById('closeQrModal').addEventListener('click', function() {
        closeQrCodeModal();
    });
    
    document.getElementById('qrCodeModalBackdrop').addEventListener('click', function() {
        closeQrCodeModal();
    });
    
    // 模拟扫码按钮（用于演示）
    const demoScanBtn = document.getElementById('demoScanBtn');
    if (demoScanBtn) {
        demoScanBtn.addEventListener('click', function() {
            simulateScan();
        });
    }
}

// 显示二维码弹窗
function showQrCodeModal() {
    const modal = document.getElementById('qrCodeModal');
    const storeName = localStorage.getItem('storeName') || '我的门店';
    
    // 更新门店名称
    document.getElementById('storeNameQr').textContent = storeName;
    
    // 生成二维码（模拟）
    generateQrCode();
    
    modal.classList.add('show');
}

// 生成二维码（模拟）
function generateQrCode() {
    const qrGrid = document.querySelector('.qr-code-grid');
    if (!qrGrid) return;
    
    // 清空现有内容
    qrGrid.innerHTML = '';
    
    // 生成25x25的二维码网格（模拟）
    const size = 25;
    const storeId = localStorage.getItem('storeId') || 'store_001';
    const qrData = `house_visit_${storeId}_${Date.now()}`;
    
    // 使用简单的伪随机生成二维码图案
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'qr-code-cell';
            
            // 生成二维码图案（模拟，实际应该使用二维码库）
            const shouldFill = (i + j + qrData.charCodeAt((i * size + j) % qrData.length)) % 3 === 0;
            if (shouldFill) {
                cell.style.background = '#000';
            } else {
                cell.style.background = '#fff';
            }
            
            qrGrid.appendChild(cell);
        }
    }
    
    // 添加定位点（模拟）
    addQrCodePositionMarkers(qrGrid);
}

// 添加二维码定位点
function addQrCodePositionMarkers(qrGrid) {
    const cells = qrGrid.querySelectorAll('.qr-code-cell');
    const size = 25;
    
    // 左上角定位点
    const positions = [
        [1, 1], [1, 2], [1, 3], [1, 4], [1, 5],
        [2, 1], [2, 3], [2, 5],
        [3, 1], [3, 2], [3, 3], [3, 4], [3, 5],
        [4, 1], [4, 3], [4, 5],
        [5, 1], [5, 2], [5, 3], [5, 4], [5, 5],
    ];
    
    positions.forEach(([row, col]) => {
        const index = (row - 1) * size + (col - 1);
        if (cells[index]) {
            cells[index].style.background = '#000';
        }
    });
}

// 关闭二维码弹窗
function closeQrCodeModal() {
    document.getElementById('qrCodeModal').classList.remove('show');
}

// 模拟扫码（用于演示）
function simulateScan() {
    // 模拟租客扫码记录看房
    const mockTenant = {
        id: Date.now(),
        nickname: '看房租客' + Math.floor(Math.random() * 1000),
        avatar: '👤',
        phone: '138' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'),
        rentType: ['整租', '合租'][Math.floor(Math.random() * 2)],
        rooms: ['1室1厅', '2室1厅', '3室2厅'][Math.floor(Math.random() * 3)],
        moveInTime: '2024-02-' + String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'),
        location: '北京市朝阳区',
        locationDetail: '长存花园'
    };
    
    // 获取当前查看的房源（如果有）
    const currentHouses = JSON.parse(localStorage.getItem('storeHouses') || '[]');
    const randomHouse = currentHouses.length > 0 
        ? currentHouses[Math.floor(Math.random() * currentHouses.length)]
        : {
            title: '精装两室一厅 近地铁',
            location: '北京市朝阳区建国路88号',
            price: 4500
        };
    
    // 创建看房记录
    const visitRecord = {
        id: Date.now(),
        tenantName: mockTenant.nickname,
        tenantAvatar: mockTenant.avatar,
        tenantPhone: mockTenant.phone,
        visitTime: new Date().toLocaleString('zh-CN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        }).replace(/\//g, '-'),
        houseTitle: randomHouse.title || '精装两室一厅 近地铁',
        houseLocation: randomHouse.location || '北京市朝阳区建国路88号',
        housePrice: randomHouse.price || 4500,
        rentType: mockTenant.rentType,
        moveInTime: mockTenant.moveInTime,
        rooms: mockTenant.rooms
    };
    
    // 保存看房记录
    const records = JSON.parse(localStorage.getItem('visitRecords') || '[]');
    records.unshift(visitRecord);
    
    // 只保留最近100条记录
    if (records.length > 100) {
        records.pop();
    }
    
    localStorage.setItem('visitRecords', JSON.stringify(records));
    
    // 关闭弹窗并提示
    closeQrCodeModal();
    alert(`扫码成功！\n\n租客：${mockTenant.nickname}\n看房时间：${visitRecord.visitTime}\n\n可在"看房记录"中查看详情`);
}

// 加载门店数据
function loadStoreData() {
    // 从localStorage加载门店信息
    const storeName = localStorage.getItem('storeName') || '光谷未来城门店';
    
    // 如果没有storeId，生成一个
    if (!localStorage.getItem('storeId')) {
        localStorage.setItem('storeId', 'store_' + Date.now());
    }
    
    const monthEarnings = parseFloat(localStorage.getItem('monthEarnings')) || 0;
    const completedOrders = parseInt(localStorage.getItem('completedOrders')) || 0;
    const pendingOrders = parseInt(localStorage.getItem('pendingOrders')) || 0;
    const totalHouses = parseInt(localStorage.getItem('totalHouses')) || 0;
    const totalViews = parseInt(localStorage.getItem('totalViews')) || 0;
    const totalContacts = parseInt(localStorage.getItem('totalContacts')) || 0;
    
    // 计算预测收入（待成交订单 * 平均佣金）
    const avgCommission = 350; // 平均佣金350元
    const predictedEarnings = pendingOrders * avgCommission;
    
    // 更新UI
    document.getElementById('storeName').textContent = storeName;
    
    document.getElementById('storeNameQr').textContent = storeName;
    document.getElementById('monthEarnings').textContent = '¥' + monthEarnings.toFixed(2);
    document.getElementById('completedOrders').textContent = completedOrders + '单';
    document.getElementById('pendingOrders').textContent = pendingOrders + '单';
    document.getElementById('predictedEarnings').textContent = '¥' + predictedEarnings.toFixed(2);
    document.getElementById('totalHouses').textContent = totalHouses;
    document.getElementById('totalViews').textContent = totalViews;
    document.getElementById('totalContacts').textContent = totalContacts;
    
    // 如果没有数据，设置默认值用于演示
    if (monthEarnings === 0 && completedOrders === 0) {
        setDefaultData();
    }
}

// 设置默认数据（用于演示）
function setDefaultData() {
    localStorage.setItem('storeName', '张先生的租房门店');
    localStorage.setItem('monthEarnings', '3200.00');
    localStorage.setItem('completedOrders', '8');
    localStorage.setItem('pendingOrders', '5');
    localStorage.setItem('totalHouses', '12');
    localStorage.setItem('totalViews', '156');
    localStorage.setItem('totalContacts', '23');
    
    // 重新加载
    loadStoreData();
}

// 加载租客列表
function loadTenants() {
    console.log('loadTenants called');
    const tenantsList = document.getElementById('tenantsList');
    
    // 检查元素是否存在
    if (!tenantsList) {
        console.error('tenantsList element not found');
        setTimeout(loadTenants, 100); // 延迟重试
        return;
    }
    
    console.log('tenantsList element found');
    
    let tenants = [];
    try {
        const storedTenants = localStorage.getItem('nearbyTenants');
        console.log('storedTenants:', storedTenants);
        if (storedTenants) {
            tenants = JSON.parse(storedTenants);
        }
    } catch (e) {
        console.error('Error parsing tenants from localStorage:', e);
        tenants = [];
    }
    
    // 默认租客数据
    const mockTenants = [
        {
            id: 1,
            nickname: '张先生',
            avatar: null,
            rentType: '整租',
            rooms: '2室1厅',
            moveInTime: '2024-02-20',
            location: '光谷广场',
            locationDetail: '武汉市洪山区光谷广场',
            phone: '13800138001'
        },
        {
            id: 2,
            nickname: '李女士',
            avatar: null,
            rentType: '合租',
            rooms: '1室1厅',
            moveInTime: '2024-02-25',
            location: '街道口',
            locationDetail: '武汉市洪山区街道口',
            phone: '13800138002'
        },
        {
            id: 3,
            nickname: '王先生',
            avatar: null,
            rentType: '整租',
            rooms: '3室2厅',
            moveInTime: '2024-03-01',
            location: '汉街',
            locationDetail: '武汉市武昌区汉街',
            phone: '13800138003'
        }
    ];
    
    // 如果没有租客数据，使用默认数据
    if (!tenants || tenants.length === 0) {
        console.log('No tenants found, using mock data');
        localStorage.setItem('nearbyTenants', JSON.stringify(mockTenants));
        displayTenants(mockTenants); // 显示所有默认数据
    } else {
        console.log('Found tenants:', tenants.length);
        // 只显示最近3个租客
        const recentTenants = tenants.slice(0, 3);
        displayTenants(recentTenants.length > 0 ? recentTenants : mockTenants);
    }
}

// 显示租客列表
function displayTenants(tenants) {
    console.log('displayTenants called with:', tenants);
    const tenantsList = document.getElementById('tenantsList');
    
    // 检查元素是否存在
    if (!tenantsList) {
        console.error('tenantsList element not found in displayTenants');
        return;
    }
    
    // 检查数据是否有效
    if (!tenants || tenants.length === 0) {
        console.log('No tenants to display');
        tenantsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-friends"></i>
                <p>暂无附近租客</p>
            </div>
        `;
        return;
    }
    
    console.log('Displaying', tenants.length, 'tenants');
    const html = tenants.map(function(tenant) {
        const avatarHtml = tenant.avatar 
            ? `<img src="${tenant.avatar}" alt="${tenant.nickname}">`
            : `<i class="fas fa-user"></i>`;
        
        // 格式化入住时间
        const moveInTime = formatMoveInTime(tenant.moveInTime);
        
        return `
            <div class="tenant-item" data-tenant-id="${tenant.id}">
                <div class="tenant-card-header">
                    <div class="tenant-avatar">
                        ${avatarHtml}
                    </div>
                    <div class="tenant-info">
                        <div class="tenant-name">${tenant.nickname}</div>
                        <div class="tenant-meta">
                            <span class="rent-type-tag">${tenant.rentType}</span>
                            <span class="rooms-tag">${tenant.rooms}</span>
                        </div>
                    </div>
                </div>
                <div class="tenant-card-body">
                    <div class="tenant-detail-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span class="detail-label">入住时间：</span>
                        <span class="detail-value">${moveInTime}</span>
                    </div>
                    <div class="tenant-location">
                        <div class="location-map-bg">
                            <i class="fas fa-map-marker-alt"></i>
                            <div class="location-text">
                                <div class="location-name">${tenant.location}</div>
                                <div class="location-detail">${tenant.locationDetail}</div>
                            </div>
                        </div>
                    </div>
                    <div class="tenant-phone-display" data-tenant-id="${tenant.id}" style="display: none;">
                        <i class="fas fa-phone"></i>
                        <span class="phone-number" data-phone="${tenant.phone || ''}">${tenant.phone || ''}</span>
                        <button class="copy-phone-btn" data-phone="${tenant.phone || ''}">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    console.log('Generated HTML length:', html.length);
    tenantsList.innerHTML = html;
    console.log('HTML inserted into tenantsList');
    
    // 添加点击事件
    tenantsList.querySelectorAll('.tenant-item').forEach(function(item) {
        item.addEventListener('click', function(e) {
            // 如果点击的是手机号区域，不触发获取
            if (e.target.closest('.tenant-phone-display')) {
                return;
            }
            const tenantId = this.dataset.tenantId;
            const tenant = tenants.find(function(t) {
                return t.id == tenantId;
            });
            if (tenant) {
                showContactModal(tenant);
            }
        });
    });
}

// 格式化入住时间
function formatMoveInTime(timeStr) {
    if (!timeStr) return '-';
    
    // 如果是日期格式，转换为中文显示
    if (timeStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const date = new Date(timeStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年${month}月${day}日`;
    }
    
    return timeStr;
}

// 当前选中的租客
let currentTenant = null;

// 显示获取联系方式弹窗
function showContactModal(tenant) {
    currentTenant = tenant;
    const modal = document.getElementById('contactModal');
    if (modal) {
        // 重置弹窗内容
        resetModalContent();
        modal.classList.add('show');
    } else {
        console.error('contactModal element not found');
    }
}

// 重置弹窗内容
function resetModalContent() {
    const modalIcon = document.getElementById('modalIcon');
    const modalMessage = document.getElementById('modalMessage');
    const modalTip = document.getElementById('modalTip');
    const contactInfo = document.getElementById('contactInfo');
    const modalFooter = document.getElementById('modalFooter');
    const confirmBtn = document.getElementById('confirmBtn');
    
    // 恢复初始状态
    modalIcon.innerHTML = '<i class="fas fa-coins"></i>';
    modalMessage.innerHTML = '获取租客联系方式需要消耗 <span class="points-highlight">1个房豆</span>';
    modalTip.textContent = '是否继续获取？';
    contactInfo.style.display = 'none';
    modalFooter.style.display = 'flex';
    confirmBtn.textContent = '获取';
    confirmBtn.disabled = false;
}

// 关闭弹窗
function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('show');
    }
    currentTenant = null;
}

// 获取联系方式
function getTenantContact() {
    if (!currentTenant) {
        console.error('No tenant selected');
        return;
    }
    
    // 检查房豆
    const points = parseInt(localStorage.getItem('shopPoints')) || 0;
    
    if (points < 1) {
        alert('房豆不足！\n\n获取联系方式需要消耗1个房豆。\n\n请前往活动中心获取房豆。');
        closeContactModal();
        return;
    }
    
    // 扣除房豆
    const newPoints = points - 1;
    localStorage.setItem('shopPoints', newPoints.toString());
    
    // 添加消费记录
    addShopConsumeRecord('获取租客联系方式', 1, 'consume');
    
    // 保存联系记录
    saveShopContactRecord(currentTenant);
    
    // 在弹窗中显示联系方式
    displayContactInModal();
}

// 在弹窗中显示联系方式
function displayContactInModal() {
    const modalIcon = document.getElementById('modalIcon');
    const modalMessage = document.getElementById('modalMessage');
    const modalTip = document.getElementById('modalTip');
    const contactInfo = document.getElementById('contactInfo');
    const contactPhone = document.getElementById('contactPhone');
    const modalFooter = document.getElementById('modalFooter');
    const confirmBtn = document.getElementById('confirmBtn');
    
    const phone = currentTenant.phone || '13800138000';
    
    // 更新弹窗内容
    modalIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
    modalIcon.style.background = 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)';
    modalIcon.style.color = '#4CAF50';
    modalMessage.innerHTML = '联系方式获取成功！';
    modalTip.style.display = 'none';
    
    // 显示联系方式
    contactPhone.textContent = phone;
    contactInfo.style.display = 'block';
    
    // 隐藏获取按钮，只显示关闭按钮
    modalFooter.style.display = 'none';
    
    // 自动复制
    copyToClipboard(phone);
    
    // 添加复制按钮事件（如果还没有添加）
    const copyContactBtn = document.getElementById('copyContactBtn');
    if (copyContactBtn) {
        // 移除旧的事件监听器（通过克隆节点）
        const newCopyBtn = copyContactBtn.cloneNode(true);
        copyContactBtn.parentNode.replaceChild(newCopyBtn, copyContactBtn);
        
        newCopyBtn.addEventListener('click', function() {
            copyToClipboard(phone);
            alert('已复制到剪贴板');
        });
    }
}

// 复制到剪贴板
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(function(err) {
            console.error('复制失败:', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// 备用复制方法
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('复制失败:', err);
    }
    document.body.removeChild(textArea);
}

// 显示二维码弹窗
function showQrCodeModal() {
    const modal = document.getElementById('qrCodeModal');
    const storeName = localStorage.getItem('storeName') || '我的门店';
    
    // 更新门店名称
    const storeNameQrEl = document.getElementById('storeNameQr');
    if (storeNameQrEl) {
        storeNameQrEl.textContent = storeName;
    }
    
    // 生成二维码（模拟）
    generateQrCode();
    
    modal.classList.add('show');
}

// 生成二维码（模拟）
function generateQrCode() {
    const qrGrid = document.querySelector('.qr-code-grid');
    if (!qrGrid) return;
    
    // 清空现有内容
    qrGrid.innerHTML = '';
    
    // 生成25x25的二维码网格（模拟）
    const size = 25;
    const storeId = localStorage.getItem('storeId') || 'store_001';
    const qrData = `house_visit_${storeId}_${Date.now()}`;
    
    // 使用简单的伪随机生成二维码图案
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'qr-code-cell';
            
            // 生成二维码图案（模拟，实际应该使用二维码库）
            const shouldFill = (i + j + qrData.charCodeAt((i * size + j) % qrData.length)) % 3 === 0;
            if (shouldFill) {
                cell.style.background = '#000';
            } else {
                cell.style.background = '#fff';
            }
            
            qrGrid.appendChild(cell);
        }
    }
    
    // 添加定位点（模拟）
    addQrCodePositionMarkers(qrGrid);
}

// 添加二维码定位点
function addQrCodePositionMarkers(qrGrid) {
    const cells = qrGrid.querySelectorAll('.qr-code-cell');
    const size = 25;
    
    // 左上角定位点
    const positions = [
        [1, 1], [1, 2], [1, 3], [1, 4], [1, 5],
        [2, 1], [2, 3], [2, 5],
        [3, 1], [3, 2], [3, 3], [3, 4], [3, 5],
        [4, 1], [4, 3], [4, 5],
        [5, 1], [5, 2], [5, 3], [5, 4], [5, 5],
    ];
    
    positions.forEach(([row, col]) => {
        const index = (row - 1) * size + (col - 1);
        if (cells[index]) {
            cells[index].style.background = '#000';
        }
    });
}

// 关闭二维码弹窗
function closeQrCodeModal() {
    document.getElementById('qrCodeModal').classList.remove('show');
}

// 添加商家端消费记录
function addShopConsumeRecord(title, amount, type) {
    const records = JSON.parse(localStorage.getItem('shopConsumeRecords') || '[]');
    const record = {
        id: Date.now(),
        title: title,
        amount: amount,
        type: type,
        time: new Date().toLocaleString('zh-CN')
    };
    records.unshift(record);
    
    // 只保留最近50条记录
    if (records.length > 50) {
        records.pop();
    }
    
    localStorage.setItem('shopConsumeRecords', JSON.stringify(records));
}

// 保存商家端联系记录
function saveShopContactRecord(tenant) {
    const records = JSON.parse(localStorage.getItem('shopContactRecords') || '[]');
    
    // 检查是否已存在
    const exists = records.some(function(r) {
        return r.type === 'tenant' && r.targetId === tenant.id;
    });
    
    if (!exists) {
        const record = {
            id: Date.now(),
            type: 'tenant',
            targetId: tenant.id,
            contactTime: new Date().toLocaleString('zh-CN'),
            tenantInfo: {
                id: tenant.id,
                nickname: tenant.nickname,
                avatar: tenant.avatar,
                rentType: tenant.rentType,
                rooms: tenant.rooms,
                moveInTime: tenant.moveInTime,
                location: tenant.location,
                locationDetail: tenant.locationDetail,
                phone: tenant.phone
            }
        };
        records.unshift(record);
        
        // 只保留最近100条记录
        if (records.length > 100) {
            records.pop();
        }
        
        localStorage.setItem('shopContactRecords', JSON.stringify(records));
    }
}

