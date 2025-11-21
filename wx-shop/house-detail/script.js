// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadHouseDetail();
});

// 初始化事件监听
function initEventListeners() {
    // 返回按钮
    document.getElementById('backBtn').addEventListener('click', function() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '../my-houses/index.html';
        }
    });
    
    // 联系房东按钮
    document.getElementById('contactBtn').addEventListener('click', function() {
        const phone = document.getElementById('landlordPhone').textContent;
        if (phone && phone !== '联系电话') {
            if (confirm('是否拨打 ' + phone + '？')) {
                window.location.href = 'tel:' + phone;
            }
        }
    });
    
    // 编辑按钮
    document.getElementById('editBtn').addEventListener('click', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const houseId = urlParams.get('id');
        alert('编辑房源\n\n跳转到编辑房源页面，房源ID: ' + houseId);
        // window.location.href = '../edit-house/index.html?id=' + houseId;
    });
    
    // 删除按钮
    document.getElementById('deleteBtn').addEventListener('click', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const houseId = urlParams.get('id');
        
        if (confirm('确认删除该房源？\n\n删除后无法恢复')) {
            deleteHouse(houseId);
        }
    });
}

// 加载房源详情
function loadHouseDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const houseId = urlParams.get('id');
    
    if (!houseId) {
        alert('房源ID不存在');
        window.location.href = '../my-houses/index.html';
        return;
    }
    
    // 从localStorage加载房源数据
    const houses = JSON.parse(localStorage.getItem('storeHouses') || '[]');
    const house = houses.find(function(h) {
        return h.id == houseId;
    });
    
    if (!house) {
        alert('房源不存在');
        window.location.href = '../my-houses/index.html';
        return;
    }
    
    // 更新UI
    document.getElementById('houseTitle').textContent = house.title || '房源标题';
    document.getElementById('housePrice').innerHTML = '¥' + (house.price || 0) + '<span>/月</span>';
    document.getElementById('houseLocation').textContent = house.location || '-';
    document.getElementById('houseArea').textContent = (house.area || 0) + '㎡';
    document.getElementById('houseRooms').textContent = house.rooms || '-';
    document.getElementById('houseFloor').textContent = house.floor || '-';
    document.getElementById('houseRentType').textContent = house.rentType || '-';
    document.getElementById('houseMoveInTime').textContent = formatMoveInTime(house.moveInTime) || '-';
    document.getElementById('houseCreateTime').textContent = formatTime(house.createTime) || '-';
    document.getElementById('houseDescription').textContent = house.description || '暂无描述';
    
    // 更新状态
    const statusText = getStatusText(house.status);
    const statusClass = house.status || 'pending';
    const statusEl = document.getElementById('houseStatus');
    statusEl.textContent = statusText;
    statusEl.className = 'house-status ' + statusClass;
    
    // 更新房东信息
    document.getElementById('landlordName').textContent = house.landlordName || '房东姓名';
    document.getElementById('landlordPhone').textContent = house.landlordPhone || '联系电话';
    
    // 如果有图片，显示图片
    if (house.image) {
        const imageEl = document.getElementById('houseImage');
        imageEl.innerHTML = '<img src="' + house.image + '" alt="' + house.title + '">';
    }
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'published': '已发布',
        'pending': '待审核',
        'rented': '已出租'
    };
    return statusMap[status] || '待审核';
}

// 格式化入住时间
function formatMoveInTime(timeStr) {
    if (!timeStr) return '-';
    
    if (timeStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const date = new Date(timeStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年${month}月${day}日`;
    }
    
    return timeStr;
}

// 格式化时间
function formatTime(timeStr) {
    if (!timeStr) return '-';
    
    try {
        const date = new Date(timeStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (e) {
        return timeStr;
    }
}

// 删除房源
function deleteHouse(houseId) {
    const houses = JSON.parse(localStorage.getItem('storeHouses') || '[]');
    const filteredHouses = houses.filter(function(h) {
        return h.id != houseId;
    });
    
    localStorage.setItem('storeHouses', JSON.stringify(filteredHouses));
    
    alert('房源已删除');
    window.location.href = '../my-houses/index.html';
}

