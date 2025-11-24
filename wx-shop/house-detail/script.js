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
    
    // 编辑按钮（仅门店房源显示）
    const editBtn = document.getElementById('editBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const urlParams = new URLSearchParams(window.location.search);
    const landlordId = urlParams.get('landlordId');
    
    // 如果是从附近房东页面跳转过来的，隐藏编辑和删除按钮
    if (landlordId) {
        editBtn.style.display = 'none';
        deleteBtn.style.display = 'none';
    } else {
        editBtn.addEventListener('click', function() {
            const houseId = urlParams.get('id');
            alert('编辑房源\n\n跳转到编辑房源页面，房源ID: ' + houseId);
            // window.location.href = '../edit-house/index.html?id=' + houseId;
        });
        
        deleteBtn.addEventListener('click', function() {
            const houseId = urlParams.get('id');
            
            if (confirm('确认删除该房源？\n\n删除后无法恢复')) {
                deleteHouse(houseId);
            }
        });
    }
}

// 模拟房东数据（用于从附近房东页面跳转过来时显示）
const mockLandlords = [
    {
        id: 1,
        name: '张房东',
        avatar: '👨',
        phone: '13800138001',
        rentType: '整租',
        rentTime: '2024-02-15',
        location: '北京市朝阳区建国路88号',
        houses: [
            { id: 1, title: '精装两室一厅 近地铁', price: 4500, area: 85, rooms: '2室1厅', floor: '5/10', rentType: '整租', moveInTime: '2024-02-15', description: '精装修，家具家电齐全，近地铁站，交通便利' },
            { id: 2, title: '温馨一居室 拎包入住', price: 3200, area: 45, rooms: '1室1厅', floor: '3/6', rentType: '整租', moveInTime: '2024-02-20', description: '温馨舒适，适合单身或情侣居住' }
        ]
    },
    {
        id: 2,
        name: '李房东',
        avatar: '👩',
        phone: '13800138002',
        rentType: '合租',
        rentTime: '2024-02-20',
        location: '北京市海淀区中关村大街1号',
        houses: [
            { id: 3, title: '单间出租 合租', price: 1800, area: 25, rooms: '单间', floor: '2/5', rentType: '合租', moveInTime: '2024-02-20', description: '合租单间，公共区域干净整洁' }
        ]
    },
    {
        id: 3,
        name: '王房东',
        avatar: '👨',
        phone: '13800138003',
        rentType: '整租',
        rentTime: '2024-03-01',
        location: '北京市西城区西单大街50号',
        houses: [
            { id: 4, title: '三室两厅 南北通透', price: 6800, area: 120, rooms: '3室2厅', floor: '8/15', rentType: '整租', moveInTime: '2024-03-01', description: '南北通透，采光好，适合家庭居住' },
            { id: 5, title: '两室一厅 精装修', price: 3800, area: 75, rooms: '2室1厅', floor: '6/12', rentType: '整租', moveInTime: '2024-03-05', description: '精装修，设施齐全' },
            { id: 6, title: '一室一厅 独立卫浴', price: 2800, area: 50, rooms: '1室1厅', floor: '4/8', rentType: '整租', moveInTime: '2024-03-10', description: '独立卫浴，私密性好' }
        ]
    },
    {
        id: 4,
        name: '赵房东',
        avatar: '👩',
        phone: '13800138004',
        rentType: '整租',
        rentTime: '2024-02-25',
        location: '北京市东城区王府井大街100号',
        houses: [
            { id: 7, title: '豪华一居室 市中心', price: 5500, area: 60, rooms: '1室1厅', floor: '10/20', rentType: '整租', moveInTime: '2024-02-25', description: '市中心豪华公寓，交通便利，周边配套完善' }
        ]
    }
];

// 加载房源详情
function loadHouseDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const houseId = urlParams.get('id');
    const landlordId = urlParams.get('landlordId');
    
    if (!houseId) {
        alert('房源ID不存在');
        window.location.href = '../my-houses/index.html';
        return;
    }
    
    let house = null;
    let landlord = null;
    
    // 如果传入了房东ID，从模拟数据中查找
    if (landlordId) {
        landlord = mockLandlords.find(l => l.id == landlordId);
        if (landlord) {
            house = landlord.houses.find(h => h.id == houseId);
        }
    }
    
    // 如果没找到，从localStorage加载房源数据
    if (!house) {
        const houses = JSON.parse(localStorage.getItem('storeHouses') || '[]');
        house = houses.find(function(h) {
            return h.id == houseId;
        });
    }
    
    if (!house) {
        alert('房源不存在');
        window.location.href = '../my-houses/index.html';
        return;
    }
    
    // 更新UI
    document.getElementById('houseTitle').textContent = house.title || '房源标题';
    document.getElementById('housePrice').innerHTML = '¥' + (house.price || 0) + '<span>/月</span>';
    document.getElementById('houseLocation').textContent = landlord ? landlord.location : (house.location || '-');
    document.getElementById('houseArea').textContent = (house.area || 0) + '㎡';
    document.getElementById('houseRooms').textContent = house.rooms || '-';
    document.getElementById('houseFloor').textContent = house.floor || '-';
    document.getElementById('houseRentType').textContent = house.rentType || '-';
    document.getElementById('houseMoveInTime').textContent = formatMoveInTime(house.moveInTime) || '-';
    document.getElementById('houseCreateTime').textContent = formatTime(house.createTime) || '-';
    document.getElementById('houseDescription').textContent = house.description || '暂无描述';
    
    // 更新状态（如果是门店房源，显示状态；如果是附近房东的房源，不显示状态）
    const statusEl = document.getElementById('houseStatus');
    if (house.status) {
        const statusText = getStatusText(house.status);
        const statusClass = house.status || 'pending';
        statusEl.textContent = statusText;
        statusEl.className = 'house-status ' + statusClass;
        statusEl.style.display = 'block';
    } else {
        statusEl.style.display = 'none';
    }
    
    // 更新房东信息
    if (landlord) {
        document.getElementById('landlordName').textContent = landlord.name || '房东姓名';
        document.getElementById('landlordPhone').textContent = landlord.phone || '联系电话';
    } else {
        document.getElementById('landlordName').textContent = house.landlordName || '房东姓名';
        document.getElementById('landlordPhone').textContent = house.landlordPhone || '联系电话';
    }
    
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

