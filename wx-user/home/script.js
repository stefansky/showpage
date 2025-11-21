// 搜索按钮点击事件
document.getElementById('searchBtn').addEventListener('click', function() {
    window.location.href = '../search/index.html';
});

// 关闭搜索弹窗
document.getElementById('closeSearch').addEventListener('click', function() {
    document.getElementById('searchModal').classList.remove('active');
});

// 点击搜索弹窗背景关闭
document.getElementById('searchModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('active');
    }
});

// 定位按钮点击事件
document.getElementById('locationBtn').addEventListener('click', function() {
    // 定位功能
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            alert('定位成功！\n纬度: ' + position.coords.latitude + '\n经度: ' + position.coords.longitude);
        }, function(error) {
            alert('定位失败，请检查定位权限设置');
        });
    } else {
        alert('您的浏览器不支持定位功能');
    }
});

// 附近房源/租客按钮点击事件
document.getElementById('nearbyBtn').addEventListener('click', function() {
    const userRole = localStorage.getItem('userRole');
    
    // 未登录状态，跳转到登录页
    if (!userRole) {
        window.location.href = '../login/index.html';
        return;
    }
    
    if (userRole === 'landlord') {
        // 房东查看附近租客
        window.location.href = '../tenant-list/index.html';
    } else {
        // 租客查看附近房源
        window.location.href = '../house-list/index.html';
    }
});

// 使用说明按钮点击事件
document.getElementById('helpBtn').addEventListener('click', function() {
    window.location.href = '../rules/index.html';
});

// 预约找房/出租按钮点击事件
document.getElementById('appointmentBtn').addEventListener('click', function() {
    const userRole = localStorage.getItem('userRole');
    
    // 未登录状态，跳转到登录页
    if (!userRole) {
        window.location.href = '../login/index.html';
        return;
    }
    
    // 已登录，根据角色跳转到对应页面
    if (userRole === 'landlord') {
        // 房东：检查是否有已发布的房源
        const myHouses = JSON.parse(localStorage.getItem('myHouses') || '[]');
        const publishedHouse = myHouses.find(function(house) {
            return house.status === 'published';
        });
        
        if (publishedHouse) {
            // 有已发布的房源，跳转到编辑页面
            window.location.href = '../post-house/index.html?edit=' + publishedHouse.id;
        } else {
            // 没有已发布的房源，跳转到发布页面
            window.location.href = '../post-house/index.html';
        }
    } else {
        // 租客：如果有已发布的找房信息，进入编辑模式
        const currentFindRequest = localStorage.getItem('currentFindRequest');
        if (currentFindRequest) {
            // 跳转到编辑页面（不传edit参数，因为会从localStorage加载）
            window.location.href = '../post-find/index.html';
        } else {
            // 跳转到发布页面
            window.location.href = '../post-find/index.html';
        }
    }
});

// 个人中心按钮点击事件
document.getElementById('profileBtn').addEventListener('click', function() {
    window.location.href = '../personal-center/index.html';
});

// 招募广告按钮点击事件
document.querySelector('.banner-btn').addEventListener('click', function() {
    window.location.href = '../recruit/index.html';
});

// 搜索建议项点击事件
document.querySelectorAll('.suggestion-item').forEach(function(item) {
    item.addEventListener('click', function() {
        const location = this.querySelector('span').textContent;
        document.querySelector('.search-input').value = location;
        alert('搜索: ' + location);
        document.getElementById('searchModal').classList.remove('active');
        // 这里可以执行地图搜索和定位
    });
});

// 模拟房源数据（用于地图显示）
const mockHousesForMap = [
    { 
        id: 1, 
        title: '光谷广场精装两室一厅', 
        location: '光谷广场', 
        price: 2500,
        top: '30%',
        left: '40%',
        lat: 30.581084,
        lng: 114.316200
    },
    { 
        id: 2, 
        title: '街道口地铁口一室一厅', 
        location: '街道口', 
        price: 1800,
        top: '45%',
        left: '55%',
        lat: 30.530000,
        lng: 114.350000
    },
    { 
        id: 3, 
        title: '汉街精装三室两厅', 
        location: '汉街', 
        price: 4500,
        top: '60%',
        left: '35%',
        lat: 30.550000,
        lng: 114.300000
    },
    { 
        id: 4, 
        title: '徐东地铁站附近单间', 
        location: '徐东', 
        price: 1500,
        top: '25%',
        left: '65%',
        lat: 30.590000,
        lng: 114.370000
    }
];

// 模拟租客数据（用于地图显示）
const mockTenantsForMap = [
    {
        id: 1,
        nickname: '张先生',
        avatar: null,
        rentType: '整租',
        rooms: '2室1厅',
        moveInTime: '2024-02-20',
        location: '光谷广场',
        locationDetail: '武汉市洪山区光谷广场',
        top: '35%',
        left: '42%',
        lat: 30.581084,
        lng: 114.316200
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
        top: '50%',
        left: '58%',
        lat: 30.530000,
        lng: 114.350000
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
        top: '65%',
        left: '38%',
        lat: 30.550000,
        lng: 114.300000
    }
];

// 添加地图标记
function addMapMarkers() {
    const userRole = localStorage.getItem('userRole');
    const mapContainer = document.getElementById('mapContainer');
    
    // 清除现有标记
    const existingMarkers = mapContainer.querySelectorAll('.map-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    if (!userRole) {
        // 未登录，不显示标记
        return;
    }
    
    if (userRole === 'landlord') {
        // 房东：显示租客坐标点
        mockTenantsForMap.forEach(function(tenant) {
            const markerEl = document.createElement('div');
            markerEl.className = 'map-marker tenant-marker';
            markerEl.style.position = 'absolute';
            markerEl.style.top = tenant.top;
            markerEl.style.left = tenant.left;
            markerEl.dataset.tenantId = tenant.id;
            
            markerEl.innerHTML = `
                <div class="marker-icon">
                    <i class="fas fa-user-friends"></i>
                </div>
                <div class="marker-pulse"></div>
            `;
            
            markerEl.addEventListener('click', function(e) {
                e.stopPropagation();
                showTenantCard(tenant);
            });
            
            mapContainer.appendChild(markerEl);
        });
    } else {
        // 租客：显示房源坐标点
        mockHousesForMap.forEach(function(house) {
            const markerEl = document.createElement('div');
            markerEl.className = 'map-marker house-marker';
            markerEl.style.position = 'absolute';
            markerEl.style.top = house.top;
            markerEl.style.left = house.left;
            markerEl.dataset.houseId = house.id;
            
            markerEl.innerHTML = `
                <div class="marker-icon">
                    <i class="fas fa-home"></i>
                </div>
                <div class="marker-price">¥${house.price}</div>
                <div class="marker-pulse"></div>
            `;
            
            markerEl.addEventListener('click', function(e) {
                e.stopPropagation();
                // 跳转到房源详情页
                window.location.href = '../house-detail/index.html?id=' + house.id;
            });
            
            mapContainer.appendChild(markerEl);
        });
    }
}

// 显示租客卡片弹框
function showTenantCard(tenant) {
    const modal = document.getElementById('tenantCardModal');
    const content = document.getElementById('tenantCardContent');
    
    // 格式化入住时间
    const moveInTime = formatMoveInTime(tenant.moveInTime);
    
    content.innerHTML = `
        <div class="tenant-card-header">
            <div class="tenant-avatar">
                ${tenant.avatar ? `<img src="${tenant.avatar}" alt="${tenant.nickname}">` : `<i class="fas fa-user"></i>`}
            </div>
            <div class="tenant-info">
                <div class="tenant-name">${tenant.nickname}</div>
                <div class="tenant-meta">
                    <span class="rent-type-tag">${tenant.rentType}</span>
                    <span class="rooms-tag">${tenant.rooms}</span>
                </div>
            </div>
            <button class="close-tenant-card" id="closeTenantCard">
                <i class="fas fa-times"></i>
            </button>
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
        </div>
        <div class="tenant-card-footer">
            <button class="get-contact-btn" data-tenant-id="${tenant.id}">
                <i class="fas fa-phone"></i>
                <span>获取联系方式</span>
            </button>
        </div>
    `;
    
    modal.classList.add('show');
    
    // 关闭按钮事件
    document.getElementById('closeTenantCard').addEventListener('click', function() {
        closeTenantCard();
    });
    
    // 背景点击关闭
    document.getElementById('modalBackdrop').addEventListener('click', function() {
        closeTenantCard();
    });
    
    // 获取联系方式按钮
    const getContactBtn = content.querySelector('.get-contact-btn');
    if (getContactBtn) {
        getContactBtn.addEventListener('click', function() {
            handleGetTenantContact(tenant.id);
        });
    }
}

// 关闭租客卡片弹框
function closeTenantCard() {
    const modal = document.getElementById('tenantCardModal');
    modal.classList.remove('show');
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

// 处理获取租客联系方式
function handleGetTenantContact(tenantId) {
    const userPoints = parseInt(localStorage.getItem('userPoints')) || 0;
    
    if (userPoints < 1) {
        alert('房豆不足！\n\n获取联系方式需要消耗1个房豆。\n\n请前往活动中心获取房豆。');
        closeTenantCard();
        window.location.href = '../activity/index.html';
        return;
    }
    
    if (confirm('获取联系方式需要消耗1个房豆\n\n是否继续？')) {
        // 扣除房豆
        const newPoints = userPoints - 1;
        localStorage.setItem('userPoints', newPoints.toString());
        
        // 添加消费记录
        addConsumeRecord('获取租客联系方式', 1, 'consume');
        
        // 模拟获取联系方式
        const tenant = mockTenantsForMap.find(t => t.id === tenantId);
        if (tenant) {
            const phone = '138' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
            const wechat = 'tenant_' + tenantId;
            
            // 保存获取记录
            saveContactRecord('tenant', tenant.id, tenant.nickname + '的找房需求', tenant.location, null, phone, wechat);
            
            // 显示联系方式
            alert(`联系方式\n\n电话：${phone}\n微信：${wechat}`);
        }
        
        closeTenantCard();
    }
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
        const tenant = mockTenantsForMap.find(t => t.id === itemId);
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

// 更新附近房源/租客按钮文字
function updateNearbyButton() {
    const userRole = localStorage.getItem('userRole');
    const nearbyBtn = document.getElementById('nearbyBtn');
    const btnText = nearbyBtn.querySelector('span');
    
    if (!userRole) {
        // 未登录状态，显示"附近房源/租客"
        btnText.textContent = '附近房源/租客';
        nearbyBtn.querySelector('i').className = 'fas fa-map-marker-alt';
    } else if (userRole === 'landlord') {
        // 房东显示"附近租客"
        btnText.textContent = '附近租客';
        nearbyBtn.querySelector('i').className = 'fas fa-user-friends';
    } else {
        // 租客显示"附近房源"
        btnText.textContent = '附近房源';
        nearbyBtn.querySelector('i').className = 'fas fa-map-marker-alt';
    }
}

// 更新底部按钮文字
function updateAppointmentButton() {
    const userRole = localStorage.getItem('userRole');
    const appointmentBtn = document.getElementById('appointmentBtn');
    const btnText = appointmentBtn.querySelector('span');
    const btnIcon = appointmentBtn.querySelector('i');
    
    if (!userRole) {
        // 未登录状态，显示"立即找房/出租"
        btnText.textContent = '立即找房/出租';
        btnIcon.className = 'fas fa-calendar-check';
    } else if (userRole === 'landlord') {
        // 房东：检查是否有已发布的房源
        const myHouses = JSON.parse(localStorage.getItem('myHouses') || '[]');
        const publishedHouse = myHouses.find(function(house) {
            return house.status === 'published';
        });
        
        if (publishedHouse) {
            // 有已发布的房源，显示"寻找租客中"
            btnText.textContent = '寻找租客中';
            btnIcon.className = 'fas fa-user-friends';
            // 保存当前房源ID，用于编辑
            appointmentBtn.dataset.houseId = publishedHouse.id;
        } else {
            // 没有已发布的房源，显示"立即出租"
            btnText.textContent = '立即出租';
            btnIcon.className = 'fas fa-home';
            delete appointmentBtn.dataset.houseId;
        }
    } else {
        // 租客：检查是否有已发布的找房信息
        const currentFindRequest = localStorage.getItem('currentFindRequest');
        if (currentFindRequest) {
            // 有已发布的找房信息，显示"正在找房中"
            btnText.textContent = '正在找房中';
            btnIcon.className = 'fas fa-search-location';
        } else {
            // 没有已发布的找房信息，显示"立即找房"
            btnText.textContent = '立即找房';
            btnIcon.className = 'fas fa-search';
        }
    }
}

// 页面加载完成后添加地图标记
window.addEventListener('load', function() {
    // 添加地图标记
    addMapMarkers();
    
    // 更新按钮文字
    updateNearbyButton();
    updateAppointmentButton();
});

// 页面显示时也更新标记（处理同标签页内的状态变化）
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        addMapMarkers();
        updateNearbyButton();
        updateAppointmentButton();
    }
});

// 监听存储变化（当其他页面更新登录状态时）
window.addEventListener('storage', function(e) {
    if (e.key === 'userRole' || e.key === 'userName' || e.key === 'myHouses' || e.key === 'currentFindRequest') {
        addMapMarkers();
        updateNearbyButton();
        updateAppointmentButton();
    }
});

// 页面显示时也更新按钮（处理同标签页内的状态变化）
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        updateNearbyButton();
        updateAppointmentButton();
    }
});

