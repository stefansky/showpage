// 模拟获取记录数据
const mockContactRecords = [
    {
        id: 1,
        type: 'house', // 'house' 或 'tenant'
        title: '光谷广场精装两室一厅',
        houseId: 1,
        location: '光谷广场',
        price: 2500,
        phone: '13800138001',
        wechat: 'rent_owner_001',
        time: '2024-01-15 10:30:00'
    },
    {
        id: 2,
        type: 'tenant',
        title: '寻找光谷广场附近房源',
        tenantId: 1,
        location: '光谷广场',
        rentType: '整租',
        phone: '13800138010',
        wechat: 'tenant_001',
        time: '2024-01-16 14:20:00'
    },
    {
        id: 3,
        type: 'house',
        title: '街道口地铁口一室一厅',
        houseId: 4,
        location: '街道口',
        price: 1800,
        phone: '13800138004',
        wechat: 'rent_owner_004',
        time: '2024-01-17 09:15:00'
    }
];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadContactRecords();
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

// 加载获取记录
function loadContactRecords() {
    // 优先使用localStorage中的数据，如果没有则使用模拟数据
    let records = JSON.parse(localStorage.getItem('contactRecords') || '[]');
    
    // 如果没有数据，使用模拟数据
    if (records.length === 0) {
        records = mockContactRecords;
    }
    
    const recordList = document.getElementById('recordList');
    const emptyResult = document.getElementById('emptyResult');

    if (records.length === 0) {
        recordList.style.display = 'none';
        emptyResult.style.display = 'block';
        return;
    }

    recordList.style.display = 'block';
    emptyResult.style.display = 'none';

    // 清空现有列表
    recordList.innerHTML = '';

    // 按时间倒序排列
    records.sort(function(a, b) {
        return new Date(b.time) - new Date(a.time);
    });

    // 显示记录
    records.forEach(function(record) {
        const recordItem = document.createElement('div');
        recordItem.className = 'record-item';
        
        const iconClass = record.type === 'house' ? 'house' : 'tenant';
        const icon = record.type === 'house' ? 'fa-home' : 'fa-user-friends';

        recordItem.innerHTML = `
            <div class="record-header">
                <div class="record-icon ${iconClass}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="record-title">${record.title}</div>
                <div class="record-time">${formatTime(record.time)}</div>
            </div>
            <div class="record-info">
                ${record.type === 'house' ? `
                    <div class="record-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span class="info-label">位置：</span>
                        <span class="info-value">${record.location || '-'}</span>
                    </div>
                    <div class="record-info-item">
                        <i class="fas fa-money-bill-wave"></i>
                        <span class="info-label">价格：</span>
                        <span class="info-value">¥${record.price || 0}/月</span>
                    </div>
                ` : `
                    <div class="record-info-item">
                        <i class="fas fa-key"></i>
                        <span class="info-label">租房类型：</span>
                        <span class="info-value">${record.rentType || '-'}</span>
                    </div>
                    <div class="record-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span class="info-label">意向位置：</span>
                        <span class="info-value">${record.location || '-'}</span>
                    </div>
                `}
            </div>
            <div class="record-contact">
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span class="contact-value">${record.phone || '-'}</span>
                </div>
                <div class="contact-item">
                    <i class="fab fa-weixin"></i>
                    <span class="contact-value">${record.wechat || '-'}</span>
                </div>
            </div>
        `;

        // 添加点击事件
        recordItem.addEventListener('click', function() {
            viewDetail(record);
        });

        recordList.appendChild(recordItem);
    });
}

// 格式化时间
function formatTime(timeStr) {
    if (!timeStr) return '-';
    
    const date = new Date(timeStr);
    const now = new Date();
    const diff = now - date;
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        // 今天
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `今天 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else if (diffDays === 1) {
        // 昨天
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `昨天 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else if (diffDays < 7) {
        // 一周内
        return `${diffDays}天前`;
    } else {
        // 更早
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}月${day}日`;
    }
}

// 查看详情
function viewDetail(record) {
    if (record.type === 'house') {
        // 跳转到房源详情页
        window.location.href = '../house-detail/index.html?id=' + record.houseId;
    } else if (record.type === 'tenant') {
        // 跳转到租客详情页（如果有的话）或显示租客信息
        alert('租客详情\n\n' + record.title + '\n位置：' + record.location + '\n租房类型：' + record.rentType);
    }
}

