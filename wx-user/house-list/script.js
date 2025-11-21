// 模拟房源数据
const mockHouses = [
    { 
        id: 1, 
        title: '光谷广场精装两室一厅', 
        image: null,
        location: '光谷广场', 
        price: 2500, 
        area: 65, 
        rooms: '2室1厅', 
        floor: '5/10',
        rentType: '整租',
        moveInTime: '随时入住'
    },
    { 
        id: 2, 
        title: '光谷步行街附近单间', 
        image: null,
        location: '光谷广场', 
        price: 1200, 
        area: 25, 
        rooms: '1室1厅', 
        floor: '3/6',
        rentType: '合租',
        moveInTime: '一周内'
    },
    { 
        id: 3, 
        title: '光谷软件园三室两厅', 
        image: null,
        location: '光谷广场', 
        price: 3500, 
        area: 95, 
        rooms: '3室2厅', 
        floor: '8/15',
        rentType: '整租',
        moveInTime: '一个月内'
    },
    { 
        id: 4, 
        title: '街道口地铁口一室一厅', 
        image: null,
        location: '街道口', 
        price: 1800, 
        area: 45, 
        rooms: '1室1厅', 
        floor: '2/8',
        rentType: '整租',
        moveInTime: '随时入住'
    },
    { 
        id: 5, 
        title: '街道口商圈两室一厅', 
        image: null,
        location: '街道口', 
        price: 2800, 
        area: 70, 
        rooms: '2室1厅', 
        floor: '6/12',
        rentType: '整租',
        moveInTime: '一周内'
    },
    { 
        id: 6, 
        title: '汉街精装三室两厅', 
        image: null,
        location: '汉街', 
        price: 4500, 
        area: 110, 
        rooms: '3室2厅', 
        floor: '10/20',
        rentType: '整租',
        moveInTime: '三个月内'
    },
    { 
        id: 7, 
        title: '汉街附近两室一厅', 
        image: null,
        location: '汉街', 
        price: 3200, 
        area: 80, 
        rooms: '2室1厅', 
        floor: '5/15',
        rentType: '合租',
        moveInTime: '一个月内'
    },
    { 
        id: 8, 
        title: '徐东地铁站附近单间', 
        image: null,
        location: '徐东', 
        price: 1500, 
        area: 30, 
        rooms: '1室1厅', 
        floor: '4/10',
        rentType: '合租',
        moveInTime: '随时入住'
    },
    { 
        id: 9, 
        title: '积玉桥精装两室一厅', 
        image: null,
        location: '积玉桥', 
        price: 2200, 
        area: 60, 
        rooms: '2室1厅', 
        floor: '3/9',
        rentType: '整租',
        moveInTime: '一周内'
    },
    { 
        id: 10, 
        title: '中南路商圈三室两厅', 
        image: null,
        location: '中南路', 
        price: 3800, 
        area: 100, 
        rooms: '3室2厅', 
        floor: '7/18',
        rentType: '整租',
        moveInTime: '一个月内'
    }
];

// 当前筛选条件
let currentFilters = {
    time: '',
    price: ''
};

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

    // 出租时间筛选
    document.getElementById('timeFilter').addEventListener('click', function() {
        toggleDropdown('time');
    });

    // 出租价格筛选
    document.getElementById('priceFilter').addEventListener('click', function() {
        toggleDropdown('price');
    });

    // 筛选选项点击
    document.querySelectorAll('#timeDropdown .dropdown-item').forEach(function(item) {
        item.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            selectFilter('time', value, this.textContent);
        });
    });

    document.querySelectorAll('#priceDropdown .dropdown-item').forEach(function(item) {
        item.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            selectFilter('price', value, this.textContent);
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
    const timeDropdown = document.getElementById('timeDropdown');
    const priceDropdown = document.getElementById('priceDropdown');
    const timeFilter = document.getElementById('timeFilter');
    const priceFilter = document.getElementById('priceFilter');

    if (type === 'time') {
        if (timeDropdown.style.display === 'none') {
            closeAllDropdowns();
            timeDropdown.style.display = 'block';
            timeFilter.classList.add('active');
        } else {
            timeDropdown.style.display = 'none';
            timeFilter.classList.remove('active');
        }
    } else if (type === 'price') {
        if (priceDropdown.style.display === 'none') {
            closeAllDropdowns();
            priceDropdown.style.display = 'block';
            priceFilter.classList.add('active');
        } else {
            priceDropdown.style.display = 'none';
            priceFilter.classList.remove('active');
        }
    }
}

// 关闭所有下拉菜单
function closeAllDropdowns() {
    document.getElementById('timeDropdown').style.display = 'none';
    document.getElementById('priceDropdown').style.display = 'none';
    document.getElementById('timeFilter').classList.remove('active');
    document.getElementById('priceFilter').classList.remove('active');
}

// 选择筛选条件
function selectFilter(type, value, text) {
    currentFilters[type] = value;
    
    // 更新显示
    if (type === 'time') {
        document.getElementById('timeFilterValue').textContent = text;
    } else if (type === 'price') {
        document.getElementById('priceFilterValue').textContent = text;
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

    // 重新加载房源列表
    loadHouses();
}

// 加载房源列表
function loadHouses() {
    let filteredHouses = [...mockHouses];

    // 按出租时间筛选
    if (currentFilters.time) {
        filteredHouses = filteredHouses.filter(function(house) {
            return house.moveInTime === getTimeFilterText(currentFilters.time);
        });
    }

    // 按价格筛选
    if (currentFilters.price) {
        const priceRange = currentFilters.price.split('-');
        filteredHouses = filteredHouses.filter(function(house) {
            if (priceRange[0] === '') {
                // 5000元以上
                return house.price >= 5000;
            } else if (priceRange[1] === '') {
                // 1500元以下
                return house.price < 1500;
            } else {
                const min = parseInt(priceRange[0]);
                const max = parseInt(priceRange[1]);
                return house.price >= min && house.price <= max;
            }
        });
    }

    displayHouses(filteredHouses);
}

// 获取时间筛选文本
function getTimeFilterText(value) {
    const timeMap = {
        'immediate': '随时入住',
        'week': '一周内',
        'month': '一个月内',
        'quarter': '三个月内'
    };
    return timeMap[value] || '';
}

// 显示房源列表
function displayHouses(houses) {
    const houseList = document.getElementById('houseList');
    const emptyResult = document.getElementById('emptyResult');
    const countNumber = document.getElementById('countNumber');

    countNumber.textContent = houses.length;

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
        houseItem.addEventListener('click', function() {
            // 跳转到房源详情页
            window.location.href = '../house-detail/index.html?id=' + house.id;
        });

        const imageHtml = house.image 
            ? `<img src="${house.image}" alt="${house.title}">`
            : `<div class="house-image-placeholder"><i class="fas fa-home"></i></div>`;

        houseItem.innerHTML = `
            <div class="house-content">
                <div class="house-image">
                    ${imageHtml}
                </div>
                <div class="house-info">
                    <div class="house-title">${house.title}</div>
                    <div class="house-meta">
                        <div class="house-meta-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${house.moveInTime}</span>
                        </div>
                        <div class="house-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${house.location}</span>
                        </div>
                        <div class="house-meta-item">
                            <i class="fas fa-building"></i>
                            <span>${house.floor}层</span>
                        </div>
                    </div>
                    <div class="house-tags">
                        <span class="house-tag rent-type">${house.rentType}</span>
                        <span class="house-tag rooms">${house.rooms}</span>
                    </div>
                    <div class="house-price">
                        <span class="house-price-value">¥${house.price}</span>
                        <span class="house-price-unit">/月</span>
                    </div>
                </div>
            </div>
        `;

        houseList.appendChild(houseItem);
    });
}

