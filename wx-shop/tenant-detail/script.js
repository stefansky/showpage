// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadTenantDetail();
});

// 初始化事件监听
function initEventListeners() {
    // 返回按钮
    document.getElementById('backBtn').addEventListener('click', function() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '../contact-records/index.html';
        }
    });
    
    // 查看地图按钮
    document.getElementById('viewMapBtn').addEventListener('click', function() {
        const location = JSON.parse(sessionStorage.getItem('viewingTenant') || '{}').location;
        if (location) {
            alert('查看地图\n\n跳转到地图页面，显示位置：' + location.name);
            // 实际应用中可以跳转到第三方地图应用
            // window.location.href = 'https://uri.amap.com/marker?position=' + location.lng + ',' + location.lat + '&name=' + encodeURIComponent(location.name);
        }
    });
}

// 加载租客详情
function loadTenantDetail() {
    // 从sessionStorage获取租客信息
    const tenantStr = sessionStorage.getItem('viewingTenant');
    if (!tenantStr) {
        alert('租客信息不存在');
        window.location.href = '../contact-records/index.html';
        return;
    }
    
    const tenant = JSON.parse(tenantStr);
    
    // 更新头像
    const avatarEl = document.getElementById('tenantAvatar');
    if (tenant.avatar) {
        avatarEl.innerHTML = `<img src="${tenant.avatar}" alt="${tenant.nickname}">`;
    } else {
        avatarEl.innerHTML = '<i class="fas fa-user"></i>';
    }
    
    // 更新姓名
    document.getElementById('tenantName').textContent = tenant.nickname || '租客';
    
    // 更新标签
    const tagsEl = document.getElementById('tenantTags');
    const tags = [];
    if (tenant.rentType) tags.push(tenant.rentType);
    if (tenant.rooms) tags.push(tenant.rooms);
    tagsEl.innerHTML = tags.map(function(tag) {
        return `<span class="tenant-tag">${tag}</span>`;
    }).join('');
    
    // 更新租赁类型
    document.getElementById('rentType').textContent = tenant.rentType || '-';
    
    // 更新户型
    document.getElementById('rooms').textContent = tenant.rooms || '-';
    
    // 更新入住时间
    document.getElementById('moveInTime').textContent = tenant.moveInTime || '-';
    
    // 更新位置信息
    if (tenant.location) {
        document.getElementById('locationName').textContent = tenant.location.name || '-';
        document.getElementById('locationAddress').textContent = tenant.location.address || '-';
    } else {
        document.getElementById('locationName').textContent = '-';
        document.getElementById('locationAddress').textContent = '-';
    }
    
    // 更新联系方式
    document.getElementById('tenantPhone').textContent = tenant.phone || '-';
}

