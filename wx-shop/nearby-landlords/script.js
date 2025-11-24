// 模拟房东数据
const mockLandlords = [
    {
        id: 1,
        name: '张房东',
        avatar: '👨',
        phone: '13800138001',
        rentType: '整租',
        rentTime: '2024-02-15',
        houseCount: 2,
        rooms: '2室1厅',
        location: '北京市朝阳区建国路88号',
        locationDetail: '长存花园',
        houses: [
            { id: 1, title: '精装两室一厅 近地铁', price: 4500, area: 85, rooms: '2室1厅' },
            { id: 2, title: '温馨一居室 拎包入住', price: 3200, area: 45, rooms: '1室1厅' }
        ]
    },
    {
        id: 2,
        name: '李房东',
        avatar: '👩',
        phone: '13800138002',
        rentType: '合租',
        rentTime: '2024-02-20',
        houseCount: 1,
        rooms: '单间',
        location: '北京市海淀区中关村大街1号',
        locationDetail: '长存花园',
        houses: [
            { id: 3, title: '单间出租 合租', price: 1800, area: 25, rooms: '单间' }
        ]
    },
    {
        id: 3,
        name: '王房东',
        avatar: '👨',
        phone: '13800138003',
        rentType: '整租',
        rentTime: '2024-03-01',
        houseCount: 3,
        rooms: '3室2厅',
        location: '北京市西城区西单大街50号',
        locationDetail: '长存花园',
        houses: [
            { id: 4, title: '三室两厅 南北通透', price: 6800, area: 120, rooms: '3室2厅' },
            { id: 5, title: '两室一厅 精装修', price: 3800, area: 75, rooms: '2室1厅' },
            { id: 6, title: '一室一厅 独立卫浴', price: 2800, area: 50, rooms: '1室1厅' }
        ]
    },
    {
        id: 4,
        name: '赵房东',
        avatar: '👩',
        phone: '13800138004',
        rentType: '整租',
        rentTime: '2024-02-25',
        houseCount: 1,
        rooms: '1室1厅',
        location: '北京市东城区王府井大街100号',
        locationDetail: '长存花园',
        houses: [
            { id: 7, title: '豪华一居室 市中心', price: 5500, area: 60, rooms: '1室1厅' }
        ]
    }
];

let currentLandlords = [];
let currentFilter = {
    type: '',
    time: ''
};
let currentContactLandlord = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadLandlords();
});

// 初始化事件监听
function initEventListeners() {
    // 返回按钮
    document.getElementById('backBtn').addEventListener('click', function() {
        window.history.back();
    });

    // 筛选功能
    const typeFilter = document.getElementById('typeFilter');
    const timeFilter = document.getElementById('timeFilter');
    const typeDropdown = document.getElementById('typeDropdown');
    const timeDropdown = document.getElementById('timeDropdown');

    typeFilter.addEventListener('click', function() {
        const isActive = typeFilter.classList.contains('active');
        closeAllDropdowns();
        if (!isActive) {
            typeFilter.classList.add('active');
            typeDropdown.style.display = 'block';
        }
    });

    timeFilter.addEventListener('click', function() {
        const isActive = timeFilter.classList.contains('active');
        closeAllDropdowns();
        if (!isActive) {
            timeFilter.classList.add('active');
            timeDropdown.style.display = 'block';
        }
    });

    // 下拉菜单项点击
    typeDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            const value = this.dataset.value;
            currentFilter.type = value;
            document.getElementById('typeFilterValue').textContent = value || '不限';
            closeAllDropdowns();
            loadLandlords();
        });
    });

    timeDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            const value = this.dataset.value;
            currentFilter.time = value;
            document.getElementById('timeFilterValue').textContent = getTimeFilterText(value);
            closeAllDropdowns();
            loadLandlords();
        });
    });

    // 点击外部关闭下拉菜单
    document.addEventListener('click', function(e) {
        if (!typeFilter.contains(e.target) && !typeDropdown.contains(e.target) &&
            !timeFilter.contains(e.target) && !timeDropdown.contains(e.target)) {
            closeAllDropdowns();
        }
    });

    // 弹窗事件
    document.getElementById('closeModal').addEventListener('click', closeContactModal);
    document.getElementById('cancelBtn').addEventListener('click', closeContactModal);
    document.getElementById('confirmBtn').addEventListener('click', getLandlordContact);
    document.getElementById('modalBackdrop').addEventListener('click', closeContactModal);
    document.getElementById('copyContactBtn').addEventListener('click', copyContact);
}

// 关闭所有下拉菜单
function closeAllDropdowns() {
    document.getElementById('typeDropdown').style.display = 'none';
    document.getElementById('timeDropdown').style.display = 'none';
    document.getElementById('typeFilter').classList.remove('active');
    document.getElementById('timeFilter').classList.remove('active');
}

// 获取时间筛选文本
function getTimeFilterText(value) {
    const map = {
        '': '不限',
        'week': '一周内',
        'month': '一个月内',
        'quarter': '三个月内'
    };
    return map[value] || '不限';
}

// 加载房东列表
function loadLandlords() {
    let filtered = [...mockLandlords];

    // 类型筛选
    if (currentFilter.type) {
        filtered = filtered.filter(landlord => landlord.rentType === currentFilter.type);
    }

    // 时间筛选
    if (currentFilter.time) {
        const now = new Date();
        const filterDate = new Date();
        
        switch (currentFilter.time) {
            case 'week':
                filterDate.setDate(now.getDate() + 7);
                break;
            case 'month':
                filterDate.setMonth(now.getMonth() + 1);
                break;
            case 'quarter':
                filterDate.setMonth(now.getMonth() + 3);
                break;
        }
        
        filtered = filtered.filter(landlord => {
            const rentDate = new Date(landlord.rentTime);
            return rentDate <= filterDate;
        });
    }

    currentLandlords = filtered;
    displayLandlords(filtered);
    updateResultCount(filtered.length);
}

// 显示房东列表
function displayLandlords(landlords) {
    const landlordList = document.getElementById('landlordList');
    const emptyResult = document.getElementById('emptyResult');

    if (landlords.length === 0) {
        landlordList.innerHTML = '';
        emptyResult.style.display = 'block';
        return;
    }

    emptyResult.style.display = 'none';
    landlordList.innerHTML = landlords.map(landlord => {
        // 获取该房东的第一个房源ID
        const firstHouseId = landlord.houses && landlord.houses.length > 0 ? landlord.houses[0].id : null;
        return `
        <div class="landlord-item" data-id="${landlord.id}" onclick="viewHouseDetail(${firstHouseId}, ${landlord.id})">
            <div class="landlord-card-header">
                <div class="landlord-avatar">${landlord.avatar}</div>
                <div class="landlord-info">
                    <div class="landlord-name">${landlord.name}</div>
                    <div class="landlord-meta">
                        <span class="rent-type-tag">${landlord.rentType}</span>
                        <span class="rooms-tag">${landlord.rooms}</span>
                    </div>
                </div>
            </div>
            <div class="landlord-card-body">
                <div class="landlord-detail-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span class="detail-label">出租时间：</span>
                    <span class="detail-value">${landlord.rentTime}</span>
                </div>
                <div class="landlord-location">
                    <div class="location-map-bg" onclick="event.stopPropagation(); viewHouseDetail(${firstHouseId}, ${landlord.id})">
                        <i class="fas fa-map-marker-alt"></i>
                        <div class="location-text">
                            <div class="location-name">${landlord.locationDetail}</div>
                            <div class="location-detail">${landlord.location}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="landlord-card-footer" onclick="event.stopPropagation();">
                <button class="get-contact-btn" onclick="event.stopPropagation(); showContactModal(${landlord.id})">
                    <i class="fas fa-phone"></i>
                    <span>获取联系方式</span>
                </button>
            </div>
        </div>
    `;
    }).join('');
}

// 更新结果数量
function updateResultCount(count) {
    document.getElementById('countNumber').textContent = count;
}

// 显示获取联系方式弹窗
function showContactModal(landlordId) {
    const landlord = mockLandlords.find(l => l.id === landlordId);
    if (!landlord) return;

    currentContactLandlord = landlord;
    const modal = document.getElementById('contactModal');
    const modalBody = document.getElementById('modalBody');
    const contactInfo = document.getElementById('contactInfo');
    const modalFooter = document.getElementById('modalFooter');

    // 重置弹窗内容
    contactInfo.style.display = 'none';
    modalFooter.style.display = 'flex';
    modalBody.querySelector('#modalMessage').textContent = `获取房东联系方式需要消耗 `;
    modalBody.querySelector('#modalMessage').innerHTML = `获取房东联系方式需要消耗 <span class="points-highlight">1个房豆</span>`;
    modalBody.querySelector('#modalTip').textContent = '是否继续获取？';

    modal.classList.add('show');
}

// 获取房东联系方式
function getLandlordContact() {
    if (!currentContactLandlord) return;

    // 检查房豆余额（这里简化处理，实际应该从localStorage获取）
    const shopPoints = parseInt(localStorage.getItem('shopPoints')) || 0;
    if (shopPoints < 1) {
        alert('房豆不足，无法获取联系方式！');
        return;
    }

    // 扣除房豆
    localStorage.setItem('shopPoints', shopPoints - 1);

    // 显示联系方式
    const contactInfo = document.getElementById('contactInfo');
    const modalFooter = document.getElementById('modalFooter');
    const modalMessage = document.getElementById('modalMessage');
    const modalTip = document.getElementById('modalTip');

    document.getElementById('contactPhone').textContent = currentContactLandlord.phone;
    contactInfo.style.display = 'block';
    modalFooter.style.display = 'none';
    modalMessage.textContent = '联系方式获取成功！';
    modalTip.textContent = '';

    // 保存联系记录
    saveContactRecord(currentContactLandlord);
}

// 保存联系记录
function saveContactRecord(landlord) {
    const records = JSON.parse(localStorage.getItem('shopContactRecords') || '[]');
    records.push({
        id: Date.now(),
        type: 'landlord',
        name: landlord.name,
        phone: landlord.phone,
        time: new Date().toLocaleString('zh-CN')
    });
    localStorage.setItem('shopContactRecords', JSON.stringify(records));
}

// 复制联系方式
function copyContact() {
    const phone = document.getElementById('contactPhone').textContent;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(phone).then(() => {
            alert('已复制到剪贴板');
        });
    } else {
        // 降级方案
        const input = document.createElement('input');
        input.value = phone;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        alert('已复制到剪贴板');
    }
}

// 关闭弹窗
function closeContactModal() {
    document.getElementById('contactModal').classList.remove('show');
    currentContactLandlord = null;
}

// 查看房源详情
function viewHouseDetail(houseId, landlordId) {
    if (!houseId) {
        alert('该房东暂无房源信息');
        return;
    }
    // 跳转到房源详情页，传递房源ID和房东ID
    window.location.href = `../house-detail/index.html?id=${houseId}&landlordId=${landlordId}`;
}

