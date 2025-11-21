// 模拟房源数据
const mockHouses = {
    1: { 
        id: 1, 
        title: '光谷广场精装两室一厅', 
        images: [],
        location: '光谷广场', 
        price: 2500, 
        area: 65, 
        rooms: '2室1厅', 
        floor: '5/10',
        rentType: '整租',
        moveInTime: '2024-02-15',
        description: '房源位于光谷广场核心地段，交通便利，周边配套设施完善。精装修，家具家电齐全，拎包入住。小区环境优美，物业管理完善，安全有保障。',
        address: '武汉市洪山区光谷广场步行街123号',
        phone: '13800138001',
        wechat: 'rent_owner_001'
    },
    2: { 
        id: 2, 
        title: '光谷步行街附近单间', 
        images: [],
        location: '光谷广场', 
        price: 1200, 
        area: 25, 
        rooms: '1室1厅', 
        floor: '3/6',
        rentType: '合租',
        moveInTime: '2024-02-20',
        description: '温馨单间，适合单身人士或学生。房间干净整洁，采光良好。合租室友都是年轻人，氛围友好。',
        address: '武汉市洪山区光谷步行街456号',
        phone: '13800138002',
        wechat: 'rent_owner_002'
    },
    3: { 
        id: 3, 
        title: '光谷软件园三室两厅', 
        images: [],
        location: '光谷广场', 
        price: 3500, 
        area: 95, 
        rooms: '3室2厅', 
        floor: '8/15',
        rentType: '整租',
        moveInTime: '2024-03-01',
        description: '宽敞明亮的三室两厅，适合家庭居住。精装修，南北通透，采光极佳。小区环境优美，停车方便。',
        address: '武汉市洪山区光谷软件园789号',
        phone: '13800138003',
        wechat: 'rent_owner_003'
    },
    4: { 
        id: 4, 
        title: '街道口地铁口一室一厅', 
        images: [],
        location: '街道口', 
        price: 1800, 
        area: 45, 
        rooms: '1室1厅', 
        floor: '2/8',
        rentType: '整租',
        moveInTime: '2024-02-15',
        description: '地铁口附近，交通便利。一室一厅，适合单身或情侣居住。装修简洁，家具齐全。',
        address: '武汉市洪山区街道口地铁站A出口',
        phone: '13800138004',
        wechat: 'rent_owner_004'
    },
    5: { 
        id: 5, 
        title: '街道口商圈两室一厅', 
        images: [],
        location: '街道口', 
        price: 2800, 
        area: 70, 
        rooms: '2室1厅', 
        floor: '6/12',
        rentType: '整租',
        moveInTime: '2024-02-20',
        description: '商圈核心位置，生活便利。两室一厅，适合小家庭或合租。精装修，拎包入住。',
        address: '武汉市洪山区街道口商圈101号',
        phone: '13800138005',
        wechat: 'rent_owner_005'
    },
    6: { 
        id: 6, 
        title: '汉街精装三室两厅', 
        images: [],
        location: '汉街', 
        price: 4500, 
        area: 110, 
        rooms: '3室2厅', 
        floor: '10/20',
        rentType: '整租',
        moveInTime: '2024-05-01',
        description: '汉街核心地段，高端小区。三室两厅，精装修，家具家电齐全。小区环境优美，物业管理完善。',
        address: '武汉市武昌区汉街中央商务区202号',
        phone: '13800138006',
        wechat: 'rent_owner_006'
    },
    7: { 
        id: 7, 
        title: '汉街附近两室一厅', 
        images: [],
        location: '汉街', 
        price: 3200, 
        area: 80, 
        rooms: '2室1厅', 
        floor: '5/15',
        rentType: '合租',
        moveInTime: '2024-03-01',
        description: '汉街附近，交通便利。两室一厅，合租形式。房间干净整洁，室友友好。',
        address: '武汉市武昌区汉街附近303号',
        phone: '13800138007',
        wechat: 'rent_owner_007'
    },
    8: { 
        id: 8, 
        title: '徐东地铁站附近单间', 
        images: [],
        location: '徐东', 
        price: 1500, 
        area: 30, 
        rooms: '1室1厅', 
        floor: '4/10',
        rentType: '合租',
        moveInTime: '2024-02-15',
        description: '地铁站附近，交通便利。单间出租，适合单身人士。房间干净，价格实惠。',
        address: '武汉市武昌区徐东地铁站B出口',
        phone: '13800138008',
        wechat: 'rent_owner_008'
    },
    9: { 
        id: 9, 
        title: '积玉桥精装两室一厅', 
        images: [],
        location: '积玉桥', 
        price: 2200, 
        area: 60, 
        rooms: '2室1厅', 
        floor: '3/9',
        rentType: '整租',
        moveInTime: '2024-02-20',
        description: '积玉桥附近，交通便利。两室一厅，精装修，家具齐全。适合小家庭居住。',
        address: '武汉市武昌区积玉桥404号',
        phone: '13800138009',
        wechat: 'rent_owner_009'
    },
    10: { 
        id: 10, 
        title: '中南路商圈三室两厅', 
        images: [],
        location: '中南路', 
        price: 3800, 
        area: 100, 
        rooms: '3室2厅', 
        floor: '7/18',
        rentType: '整租',
        moveInTime: '2024-03-01',
        description: '中南路商圈，生活便利。三室两厅，精装修，适合家庭居住。小区环境好，物业管理完善。',
        address: '武汉市武昌区中南路505号',
        phone: '13800138010',
        wechat: 'rent_owner_010'
    }
};

let currentHouse = null;
let currentImageIndex = 0;

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
            window.location.href = '../house-list/index.html';
        }
    });

    // 分享按钮
    document.getElementById('shareBtn').addEventListener('click', function() {
        shareHouse();
    });

    // 举报按钮
    document.getElementById('reportBtn').addEventListener('click', function() {
        reportHouse();
    });

    // 联系房东按钮
    document.getElementById('contactActionBtn').addEventListener('click', function() {
        contactLandlord();
    });

    // 图片轮播滑动
    const carouselContainer = document.getElementById('carouselContainer');
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    carouselContainer.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    carouselContainer.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
    });

    carouselContainer.addEventListener('touchend', function() {
        if (!isDragging) return;
        isDragging = false;
        
        const diff = startX - currentX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
    });
}

// 加载房源详情
function loadHouseDetail() {
    // 从URL获取房源ID
    const urlParams = new URLSearchParams(window.location.search);
    const houseId = parseInt(urlParams.get('id')) || 1;
    
    currentHouse = mockHouses[houseId];
    
    if (!currentHouse) {
        alert('房源不存在');
        window.location.href = '../house-list/index.html';
        return;
    }

    // 显示房源信息
    displayHouseInfo();
    loadImages();
    checkFavorite();
}

// 显示房源信息
function displayHouseInfo() {
    document.getElementById('houseTitle').textContent = currentHouse.title;
    document.getElementById('priceValue').textContent = '¥' + currentHouse.price;
    document.getElementById('locationValue').textContent = currentHouse.location;
    document.getElementById('roomsValue').textContent = currentHouse.rooms;
    document.getElementById('areaValue').textContent = currentHouse.area + '㎡';
    document.getElementById('floorValue').textContent = currentHouse.floor + '层';
    document.getElementById('rentTypeValue').textContent = currentHouse.rentType;
    document.getElementById('moveInTimeValue').textContent = formatMoveInTime(currentHouse.moveInTime);
    document.getElementById('descriptionContent').textContent = currentHouse.description;
    document.getElementById('locationAddress').textContent = currentHouse.address;
    document.getElementById('phoneValue').textContent = currentHouse.phone;
    document.getElementById('wechatValue').textContent = currentHouse.wechat;

    // 显示标签
    const tagsContainer = document.getElementById('houseTags');
    tagsContainer.innerHTML = `
        <span class="house-tag rent-type">${currentHouse.rentType}</span>
        <span class="house-tag rooms">${currentHouse.rooms}</span>
    `;
}

// 加载图片
function loadImages() {
    const images = currentHouse.images || [];
    
    // 如果没有图片，使用占位图
    if (images.length === 0) {
        images.push(null);
    }

    const carouselContainer = document.getElementById('carouselContainer');
    const indicatorContainer = document.getElementById('carouselIndicator');
    
    carouselContainer.innerHTML = '';
    indicatorContainer.innerHTML = '';

    images.forEach(function(image, index) {
        // 图片
        const imageDiv = document.createElement('div');
        imageDiv.className = 'carousel-image';
        if (image) {
            imageDiv.innerHTML = `<img src="${image}" alt="${currentHouse.title}">`;
        } else {
            imageDiv.className = 'carousel-image-placeholder';
            imageDiv.innerHTML = '<i class="fas fa-home"></i>';
        }
        carouselContainer.appendChild(imageDiv);

        // 指示器
        const indicator = document.createElement('div');
        indicator.className = 'indicator-dot' + (index === 0 ? ' active' : '');
        indicator.addEventListener('click', function() {
            goToImage(index);
        });
        indicatorContainer.appendChild(indicator);
    });

    updateImageCount();
}

// 更新图片计数
function updateImageCount() {
    const images = currentHouse.images || [null];
    const total = images.length;
    document.getElementById('imageCount').textContent = (currentImageIndex + 1) + '/' + total;
}

// 下一张图片
function nextImage() {
    const images = currentHouse.images || [null];
    if (images.length <= 1) return;
    
    currentImageIndex = (currentImageIndex + 1) % images.length;
    goToImage(currentImageIndex);
}

// 上一张图片
function prevImage() {
    const images = currentHouse.images || [null];
    if (images.length <= 1) return;
    
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    goToImage(currentImageIndex);
}

// 跳转到指定图片
function goToImage(index) {
    const images = currentHouse.images || [null];
    if (index < 0 || index >= images.length) return;
    
    currentImageIndex = index;
    const carouselContainer = document.getElementById('carouselContainer');
    carouselContainer.style.transform = `translateX(-${index * 100}%)`;
    
    // 更新指示器
    document.querySelectorAll('.indicator-dot').forEach(function(dot, i) {
        dot.classList.toggle('active', i === index);
    });
    
    updateImageCount();
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

// 举报房源
function reportHouse() {
    const reasons = [
        '虚假房源信息',
        '价格不实',
        '房源已出租',
        '联系方式错误',
        '其他问题'
    ];
    
    let reasonText = '请选择举报原因：\n\n';
    reasons.forEach(function(reason, index) {
        reasonText += `${index + 1}. ${reason}\n`;
    });
    
    const reason = prompt(reasonText + '\n请输入原因编号（1-5）：');
    
    if (reason && reason >= 1 && reason <= 5) {
        const selectedReason = reasons[reason - 1];
        const detail = prompt('请详细描述问题（选填）：');
        
        // 保存举报记录
        const reports = JSON.parse(localStorage.getItem('houseReports') || '[]');
        reports.push({
            houseId: currentHouse.id,
            houseTitle: currentHouse.title,
            reason: selectedReason,
            detail: detail || '',
            time: new Date().toLocaleString('zh-CN')
        });
        localStorage.setItem('houseReports', JSON.stringify(reports));
        
        alert('举报已提交，我们会尽快处理。感谢您的反馈！');
    }
}

// 获取联系方式
function contactLandlord() {
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
        addConsumeRecord('获取联系方式', 1, 'consume');
        
        // 保存获取记录
        saveContactRecord('house', currentHouse.id, currentHouse.title, currentHouse.location, currentHouse.price, currentHouse.phone, currentHouse.wechat);
        
        // 显示联系方式
        const phone = currentHouse.phone;
        const wechat = currentHouse.wechat;
        
        let contactInfo = '联系方式：\n\n';
        contactInfo += '联系电话：' + phone + '\n';
        contactInfo += '微信号：' + wechat + '\n\n';
        contactInfo += '是否拨打房东电话？';
        
        if (confirm(contactInfo)) {
            window.location.href = 'tel:' + phone;
        }
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

// 分享房源
function shareHouse() {
    const shareText = `推荐房源：${currentHouse.title}\n位置：${currentHouse.location}\n价格：¥${currentHouse.price}/月\n\n来自极速找房`;
    
    if (navigator.share) {
        navigator.share({
            title: currentHouse.title,
            text: shareText
        });
    } else {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(function() {
                alert('房源信息已复制到剪贴板');
            });
        } else {
            alert(shareText);
        }
    }
}

