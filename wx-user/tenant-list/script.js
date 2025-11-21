// 模拟租客数据
const mockTenants = [
    {
        id: 1,
        nickname: '张先生',
        avatar: null,
        rentType: '整租',
        rooms: '2室1厅',
        moveInTime: '2024-02-20',
        location: '光谷广场',
        locationDetail: '武汉市洪山区光谷广场'
    },
    {
        id: 2,
        nickname: '李女士',
        avatar: null,
        rentType: '合租',
        rooms: '1室1厅',
        moveInTime: '2024-02-25',
        location: '街道口',
        locationDetail: '武汉市洪山区街道口'
    },
    {
        id: 3,
        nickname: '王先生',
        avatar: null,
        rentType: '整租',
        rooms: '3室2厅',
        moveInTime: '2024-03-01',
        location: '汉街',
        locationDetail: '武汉市武昌区汉街'
    },
    {
        id: 4,
        nickname: '刘女士',
        avatar: null,
        rentType: '合租',
        rooms: '1室1厅',
        moveInTime: '2024-02-18',
        location: '徐东',
        locationDetail: '武汉市武昌区徐东'
    },
    {
        id: 5,
        nickname: '陈先生',
        avatar: null,
        rentType: '整租',
        rooms: '2室1厅',
        moveInTime: '2024-02-22',
        location: '积玉桥',
        locationDetail: '武汉市武昌区积玉桥'
    },
    {
        id: 6,
        nickname: '赵女士',
        avatar: null,
        rentType: '整租',
        rooms: '3室2厅',
        moveInTime: '2024-03-05',
        location: '中南路',
        locationDetail: '武汉市武昌区中南路'
    }
];

// 当前筛选条件
let currentFilters = {
    type: '',
    time: ''
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadTenants();
});

// 初始化事件监听
function initEventListeners() {
    // 返回按钮
    document.getElementById('backBtn').addEventListener('click', function() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '../home/index.html';
        }
    });

    // 租房类型筛选
    document.getElementById('typeFilter').addEventListener('click', function() {
        toggleDropdown('type');
    });

    // 租房时间筛选
    document.getElementById('timeFilter').addEventListener('click', function() {
        toggleDropdown('time');
    });

    // 筛选选项点击
    document.querySelectorAll('#typeDropdown .dropdown-item').forEach(function(item) {
        item.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            selectFilter('type', value, this.textContent);
        });
    });

    document.querySelectorAll('#timeDropdown .dropdown-item').forEach(function(item) {
        item.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            selectFilter('time', value, this.textContent);
        });
    });

    // 点击外部关闭下拉菜单
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.filter-item') && !e.target.closest('.filter-dropdown')) {
            closeAllDropdowns();
        }
    });
}

// 切换下拉菜单
function toggleDropdown(type) {
    const typeDropdown = document.getElementById('typeDropdown');
    const timeDropdown = document.getElementById('timeDropdown');
    const typeFilter = document.getElementById('typeFilter');
    const timeFilter = document.getElementById('timeFilter');

    if (type === 'type') {
        if (typeDropdown.style.display === 'none') {
            closeAllDropdowns();
            typeDropdown.style.display = 'block';
            typeFilter.classList.add('active');
        } else {
            typeDropdown.style.display = 'none';
            typeFilter.classList.remove('active');
        }
    } else if (type === 'time') {
        if (timeDropdown.style.display === 'none') {
            closeAllDropdowns();
            timeDropdown.style.display = 'block';
            timeFilter.classList.add('active');
        } else {
            timeDropdown.style.display = 'none';
            timeFilter.classList.remove('active');
        }
    }
}

// 关闭所有下拉菜单
function closeAllDropdowns() {
    document.getElementById('typeDropdown').style.display = 'none';
    document.getElementById('timeDropdown').style.display = 'none';
    document.getElementById('typeFilter').classList.remove('active');
    document.getElementById('timeFilter').classList.remove('active');
}

// 选择筛选条件
function selectFilter(type, value, text) {
    currentFilters[type] = value;
    
    // 更新显示
    if (type === 'type') {
        document.getElementById('typeFilterValue').textContent = text;
    } else if (type === 'time') {
        document.getElementById('timeFilterValue').textContent = text;
    }

    // 更新选中状态
    document.querySelectorAll(`#${type}Dropdown .dropdown-item`).forEach(function(item) {
        item.classList.remove('selected');
        if (item.getAttribute('data-value') === value) {
            item.classList.add('selected');
        }
    });

    // 关闭下拉菜单
    closeAllDropdowns();

    // 重新加载租客列表
    loadTenants();
}

// 加载租客列表
function loadTenants() {
    let filteredTenants = [...mockTenants];

    // 按租房类型筛选
    if (currentFilters.type) {
        filteredTenants = filteredTenants.filter(function(tenant) {
            return tenant.rentType === currentFilters.type;
        });
    }

    // 按租房时间筛选
    if (currentFilters.time) {
        const today = new Date();
        filteredTenants = filteredTenants.filter(function(tenant) {
            const moveInDate = new Date(tenant.moveInTime);
            const diffTime = moveInDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (currentFilters.time === 'week') {
                return diffDays >= 0 && diffDays <= 7;
            } else if (currentFilters.time === 'month') {
                return diffDays >= 0 && diffDays <= 30;
            } else if (currentFilters.time === 'quarter') {
                return diffDays >= 0 && diffDays <= 90;
            }
            return true;
        });
    }

    displayTenants(filteredTenants);
}

// 显示租客列表
function displayTenants(tenants) {
    const tenantList = document.getElementById('tenantList');
    const emptyResult = document.getElementById('emptyResult');
    const countNumber = document.getElementById('countNumber');

    countNumber.textContent = tenants.length;

    if (tenants.length === 0) {
        tenantList.style.display = 'none';
        emptyResult.style.display = 'block';
        return;
    }

    tenantList.style.display = 'block';
    emptyResult.style.display = 'none';

    // 清空现有列表
    tenantList.innerHTML = '';

    // 显示租客
    tenants.forEach(function(tenant) {
        const tenantItem = document.createElement('div');
        tenantItem.className = 'tenant-item';

        const avatarHtml = tenant.avatar 
            ? `<img src="${tenant.avatar}" alt="${tenant.nickname}">`
            : `<i class="fas fa-user"></i>`;

        // 使用和首页弹框相同的卡片结构
        tenantItem.innerHTML = `
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
                    <span class="detail-value">${formatMoveInTime(tenant.moveInTime)}</span>
                </div>
                <div class="tenant-location">
                    <div class="location-map-bg" data-tenant-id="${tenant.id}">
                        <i class="fas fa-map-marker-alt"></i>
                        <div class="location-text">
                            <div class="location-name">${tenant.location}</div>
                            <div class="location-detail">${tenant.locationDetail}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tenant-card-footer">
                <button class="get-contact-btn" data-tenant-id="${tenant.id}">
                    <i class="fas fa-phone"></i>
                    <span>获取联系方式</span>
                </button>
            </div>
        `;

        // 添加点击事件
        const contactBtn = tenantItem.querySelector('.get-contact-btn');
        contactBtn.addEventListener('click', function() {
            getContact(tenant.id);
        });

        // 添加地图点击事件
        const locationMap = tenantItem.querySelector('.location-map-bg');
        locationMap.addEventListener('click', function() {
            showLocation(tenant);
        });

        tenantList.appendChild(tenantItem);
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

// 获取联系方式
function getContact(tenantId) {
    // 检查房豆
    const points = parseInt(localStorage.getItem('userPoints')) || 0;
    
    if (points < 1) {
        if (confirm('获取联系方式需要消耗1个房豆，您的房豆不足。是否前往活动中心获取房豆？')) {
            window.location.href = '../activity/index.html';
        }
        return;
    }

    if (confirm('获取联系方式需要消耗1个房豆，是否继续？')) {
        // 扣除房豆
        const newPoints = points - 1;
        localStorage.setItem('userPoints', newPoints.toString());
        
        // 添加消费记录
        addConsumeRecord('获取租客联系方式', 1, 'consume');
        
        // 模拟获取联系方式
        const tenant = mockTenants.find(t => t.id === tenantId);
        if (tenant) {
            const phone = '138' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
            const wechat = 'tenant_' + tenantId;
            
            // 保存获取记录
            saveContactRecord('tenant', tenant.id, tenant.title || '找房需求', tenant.location, null, phone, wechat);
            
            let contactInfo = '联系方式：\n\n';
            contactInfo += '联系电话：' + phone + '\n';
            contactInfo += '微信号：' + wechat + '\n\n';
            contactInfo += '是否拨打租客电话？';
            
            if (confirm(contactInfo)) {
                window.location.href = 'tel:' + phone;
            }
        }
    }
}

// 显示位置地图
function showLocation(tenant) {
    // 创建地图弹窗
    const mapModal = document.createElement('div');
    mapModal.className = 'map-modal';
    mapModal.innerHTML = `
        <div class="map-modal-content">
            <div class="map-modal-header">
                <h3>意向位置</h3>
                <button class="map-modal-close" id="closeMapModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="map-modal-body">
                <div class="map-display">
                    <div class="map-placeholder-large">
                        <i class="fas fa-map-marked-alt"></i>
                        <span>${tenant.locationDetail}</span>
                    </div>
                </div>
                <div class="location-info">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${tenant.locationDetail}</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(mapModal);
    
    // 关闭按钮事件
    document.getElementById('closeMapModal').addEventListener('click', function() {
        document.body.removeChild(mapModal);
    });
    
    // 点击背景关闭
    mapModal.addEventListener('click', function(e) {
        if (e.target === mapModal) {
            document.body.removeChild(mapModal);
        }
    });
}

// 保存获取记录
function saveContactRecord(type, itemId, title, location, price, phone, wechat) {
    const records = JSON.parse(localStorage.getItem('contactRecords') || '[]');
    const record = {
        id: Date.now(),
        type: type,
        title: title,
        location: location,
        phone: phone,
        wechat: wechat,
        time: new Date().toLocaleString('zh-CN')
    };
    
    if (type === 'house') {
        record.houseId = itemId;
        record.price = price;
    } else if (type === 'tenant') {
        record.tenantId = itemId;
        // 从租客数据中获取其他信息
        const tenant = mockTenants.find(t => t.id === itemId);
        if (tenant) {
            record.rentType = tenant.rentType;
        }
    }
    
    // 检查是否已存在相同记录
    const exists = records.some(function(r) {
        if (type === 'house') {
            return r.type === 'house' && r.houseId === itemId;
        } else {
            return r.type === 'tenant' && r.tenantId === itemId;
        }
    });
    
    if (!exists) {
        records.unshift(record);
        localStorage.setItem('contactRecords', JSON.stringify(records));
    }
}

// 添加消费记录
function addConsumeRecord(title, amount, type) {
    const records = JSON.parse(localStorage.getItem('consumeRecords') || '[]');
    const record = {
        id: Date.now(),
        title: title,
        amount: amount,
        type: type,
        time: new Date().toLocaleString('zh-CN')
    };
    
    records.unshift(record);
    
    if (records.length > 50) {
        records.pop();
    }
    
    localStorage.setItem('consumeRecords', JSON.stringify(records));
}

