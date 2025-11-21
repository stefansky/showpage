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
            window.location.href = '../personal-center/index.html';
        }
    });
}

// 模拟房源数据
const mockHouses = [
    {
        id: 1,
        title: '光谷广场精装两室一厅',
        location: '光谷广场',
        rooms: '2室1厅',
        area: 65,
        price: 2500,
        status: 'published'
    },
    {
        id: 2,
        title: '街道口地铁口一室一厅',
        location: '街道口',
        rooms: '1室1厅',
        area: 45,
        price: 1800,
        status: 'published'
    },
    {
        id: 3,
        title: '汉街精装三室两厅',
        location: '汉街',
        rooms: '3室2厅',
        area: 110,
        price: 4500,
        status: 'pending'
    }
];

// 加载房源列表
function loadHouses() {
    // 优先使用localStorage中的数据，如果没有则使用模拟数据
    let houses = JSON.parse(localStorage.getItem('myHouses') || '[]');
    
    // 如果没有数据，使用模拟数据
    if (houses.length === 0) {
        houses = mockHouses;
    }
    
    const houseList = document.getElementById('houseList');
    const emptyResult = document.getElementById('emptyResult');

    if (houses.length === 0) {
        houseList.style.display = 'none';
        emptyResult.style.display = 'block';
        return;
    }

    houseList.style.display = 'block';
    emptyResult.style.display = 'none';

    // 清空现有列表
    houseList.innerHTML = '';

    // 显示房源
    houses.forEach(function(house) {
        const houseItem = document.createElement('div');
        houseItem.className = 'house-item';

        const statusClass = house.status || 'published';
        const statusText = {
            'published': '已发布',
            'pending': '审核中',
            'offline': '已下架'
        }[statusClass] || '已发布';

        houseItem.innerHTML = `
            <div class="house-header">
                <div class="house-title">${house.title || '房源标题'}</div>
                <span class="house-status ${statusClass}">${statusText}</span>
            </div>
            <div class="house-info">
                <div class="house-info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${house.location || '-'}</span>
                </div>
                <div class="house-info-item">
                    <i class="fas fa-home"></i>
                    <span>${house.rooms || '-'}</span>
                </div>
                <div class="house-info-item">
                    <i class="fas fa-arrows-alt"></i>
                    <span>${house.area || '-'}㎡</span>
                </div>
            </div>
            <div class="house-price">¥${house.price || 0}/月</div>
            <div class="house-actions">
                <button class="action-btn edit-btn" data-house-id="${house.id}">
                    <i class="fas fa-edit"></i>
                    <span>编辑</span>
                </button>
                <button class="action-btn delete-btn" data-house-id="${house.id}">
                    <i class="fas fa-trash"></i>
                    <span>删除</span>
                </button>
            </div>
        `;

        // 添加编辑事件
        houseItem.querySelector('.edit-btn').addEventListener('click', function() {
            editHouse(house.id);
        });

        // 添加删除事件
        houseItem.querySelector('.delete-btn').addEventListener('click', function() {
            deleteHouse(house.id);
        });

        houseList.appendChild(houseItem);
    });
}

// 编辑房源
function editHouse(houseId) {
    // 跳转到发布房源页面，并传递编辑参数
    window.location.href = '../post-house/index.html?edit=' + houseId;
}

// 删除房源
function deleteHouse(houseId) {
    if (confirm('确定要删除这个房源吗？删除后无法恢复。')) {
        const houses = JSON.parse(localStorage.getItem('myHouses') || '[]');
        const newHouses = houses.filter(function(house) {
            return house.id !== houseId;
        });
        localStorage.setItem('myHouses', JSON.stringify(newHouses));
        
        // 重新加载列表
        loadHouses();
        
        alert('房源已删除');
    }
}

