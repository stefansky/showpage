// 模拟房东数据（与列表页相同）
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
        locationDetail: '中关村大街1号',
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
        locationDetail: '西单大街50号',
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
        locationDetail: '王府井大街100号',
        houses: [
            { id: 7, title: '豪华一居室 市中心', price: 5500, area: 60, rooms: '1室1厅' }
        ]
    }
];

let currentLandlord = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadLandlordDetail();
});

// 初始化事件监听
function initEventListeners() {
    // 返回按钮
    document.getElementById('backBtn').addEventListener('click', function() {
        window.history.back();
    });

    // 获取联系方式按钮
    document.getElementById('getContactBtn').addEventListener('click', function() {
        if (currentLandlord) {
            showContactModal();
        }
    });

    // 弹窗事件
    document.getElementById('closeModal').addEventListener('click', closeContactModal);
    document.getElementById('cancelBtn').addEventListener('click', closeContactModal);
    document.getElementById('confirmBtn').addEventListener('click', getLandlordContact);
    document.getElementById('modalBackdrop').addEventListener('click', closeContactModal);
    document.getElementById('copyContactBtn').addEventListener('click', copyContact);
}

// 加载房东详情
function loadLandlordDetail() {
    // 从URL获取房东ID
    const urlParams = new URLSearchParams(window.location.search);
    const landlordId = parseInt(urlParams.get('id'));

    if (!landlordId) {
        alert('参数错误');
        window.history.back();
        return;
    }

    currentLandlord = mockLandlords.find(l => l.id === landlordId);
    if (!currentLandlord) {
        alert('未找到该房东信息');
        window.history.back();
        return;
    }

    // 显示房东信息
    document.getElementById('landlordAvatar').textContent = currentLandlord.avatar;
    document.getElementById('landlordName').textContent = currentLandlord.name;
    document.getElementById('rentType').textContent = currentLandlord.rentType;
    document.getElementById('rooms').textContent = currentLandlord.rooms;
    document.getElementById('rentTime').textContent = currentLandlord.rentTime;
    document.getElementById('location').textContent = currentLandlord.location;
    document.getElementById('houseCount').textContent = `(${currentLandlord.houseCount}套)`;

    // 显示房源列表
    displayHouses(currentLandlord.houses);
}

// 显示房源列表
function displayHouses(houses) {
    const housesList = document.getElementById('housesList');
    housesList.innerHTML = houses.map(house => `
        <div class="house-item" onclick="viewHouseDetail(${house.id})">
            <div class="house-title">${house.title}</div>
            <div class="house-info">
                <div class="house-info-item">
                    <i class="fas fa-yen-sign"></i>
                    <span>¥${house.price}/月</span>
                </div>
                <div class="house-info-item">
                    <i class="fas fa-ruler-combined"></i>
                    <span>${house.area}㎡</span>
                </div>
                <div class="house-info-item">
                    <i class="fas fa-home"></i>
                    <span>${house.rooms}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// 查看房源详情
function viewHouseDetail(houseId) {
    // 跳转到房源详情页
    window.location.href = `../../house-detail/index.html?id=${houseId}`;
}

// 显示获取联系方式弹窗
function showContactModal() {
    const modal = document.getElementById('contactModal');
    const modalBody = document.getElementById('modalBody');
    const contactInfo = document.getElementById('contactInfo');
    const modalFooter = document.getElementById('modalFooter');

    // 重置弹窗内容
    contactInfo.style.display = 'none';
    modalFooter.style.display = 'flex';
    modalBody.querySelector('#modalMessage').innerHTML = `获取房东联系方式需要消耗 <span class="points-highlight">1个房豆</span>`;
    modalBody.querySelector('#modalTip').textContent = '是否继续获取？';

    modal.classList.add('show');
}

// 获取房东联系方式
function getLandlordContact() {
    if (!currentLandlord) return;

    // 检查房豆余额
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

    document.getElementById('contactPhone').textContent = currentLandlord.phone;
    contactInfo.style.display = 'block';
    modalFooter.style.display = 'none';
    modalMessage.textContent = '联系方式获取成功！';
    modalTip.textContent = '';

    // 保存联系记录
    saveContactRecord(currentLandlord);
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
}

