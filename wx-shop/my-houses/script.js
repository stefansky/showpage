// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadHouses();
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
    
    // 添加房源按钮
    document.getElementById('addBtn').addEventListener('click', function() {
        window.location.href = '../add-house/index.html';
    });
    
    // 空状态添加按钮
    const addHouseBtn = document.getElementById('addHouseBtn');
    if (addHouseBtn) {
        addHouseBtn.addEventListener('click', function() {
            window.location.href = '../add-house/index.html';
        });
    }
}

// 加载房源列表
function loadHouses() {
    const housesList = document.getElementById('housesList');
    const emptyState = document.getElementById('emptyState');
    
    let houses = [];
    try {
        const storedHouses = localStorage.getItem('storeHouses');
        if (storedHouses) {
            houses = JSON.parse(storedHouses);
        }
    } catch (e) {
        console.error('Error parsing houses from localStorage:', e);
        houses = [];
    }
    
    // 如果没有房源，创建一些默认数据
    if (houses.length === 0) {
        const mockHouses = [
            {
                id: 1,
                title: '光谷广场精装两室一厅',
                price: 2500,
                area: 65,
                rooms: '2室1厅',
                floor: '5/10',
                rentType: '整租',
                location: '光谷广场',
                status: 'published',
                createTime: '2024-01-15 10:30:00',
                landlordName: '张先生',
                landlordPhone: '13800138001'
            },
            {
                id: 2,
                title: '街道口地铁口一室一厅',
                price: 1800,
                area: 45,
                rooms: '1室1厅',
                floor: '2/8',
                rentType: '整租',
                location: '街道口',
                status: 'published',
                createTime: '2024-01-12 14:20:00',
                landlordName: '李女士',
                landlordPhone: '13800138002'
            },
            {
                id: 3,
                title: '汉街精装三室两厅',
                price: 4500,
                area: 95,
                rooms: '3室2厅',
                floor: '8/15',
                rentType: '整租',
                location: '汉街',
                status: 'pending',
                createTime: '2024-01-10 09:15:00',
                landlordName: '王先生',
                landlordPhone: '13800138003'
            },
            {
                id: 4,
                title: '徐东地铁站附近单间',
                price: 1500,
                area: 25,
                rooms: '1室1厅',
                floor: '3/6',
                rentType: '合租',
                location: '徐东',
                status: 'published',
                createTime: '2024-01-08 16:45:00',
                landlordName: '刘女士',
                landlordPhone: '13800138004'
            }
        ];
        localStorage.setItem('storeHouses', JSON.stringify(mockHouses));
        houses = mockHouses;
    }
    
    // 按录入时间排序（最新的在前）
    houses.sort(function(a, b) {
        const timeA = new Date(a.createTime || a.createTime || 0);
        const timeB = new Date(b.createTime || b.createTime || 0);
        return timeB - timeA;
    });
    
    // 显示房源列表
    if (houses.length === 0) {
        housesList.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        housesList.style.display = 'flex';
        emptyState.style.display = 'none';
        displayHouses(houses);
    }
}

// 显示房源列表
function displayHouses(houses) {
    const housesList = document.getElementById('housesList');
    
    housesList.innerHTML = houses.map(function(house) {
        const statusText = getStatusText(house.status);
        const statusClass = house.status || 'pending';
        const createTime = formatTime(house.createTime);
        
        return `
            <div class="house-item" data-house-id="${house.id}">
                <div class="house-header">
                    <div class="house-image">
                        <i class="fas fa-home"></i>
                    </div>
                    <div class="house-info">
                        <div class="house-title">${house.title}</div>
                        <div class="house-meta">
                            <div class="house-meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${house.location}</span>
                            </div>
                            <div class="house-meta-item">
                                <i class="fas fa-expand-arrows-alt"></i>
                                <span>${house.area}㎡</span>
                            </div>
                            <div class="house-meta-item">
                                <i class="fas fa-home"></i>
                                <span>${house.rooms}</span>
                            </div>
                            <div class="house-meta-item">
                                <i class="fas fa-building"></i>
                                <span>${house.floor}</span>
                            </div>
                        </div>
                        <div class="house-footer">
                            <div class="house-price">¥${house.price}<span>/月</span></div>
                            <div class="house-status ${statusClass}">${statusText}</div>
                        </div>
                        <div class="house-time">
                            <i class="fas fa-clock"></i>
                            录入时间：${createTime}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // 添加点击事件
    housesList.querySelectorAll('.house-item').forEach(function(item) {
        item.addEventListener('click', function() {
            const houseId = this.dataset.houseId;
            window.location.href = '../house-detail/index.html?id=' + houseId;
        });
    });
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

