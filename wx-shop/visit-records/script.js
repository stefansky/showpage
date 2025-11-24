// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadVisitRecords();
});

// 初始化事件监听
function initEventListeners() {
    // 返回按钮
    document.getElementById('backBtn').addEventListener('click', function() {
        window.history.back();
    });
}

// 加载看房记录
function loadVisitRecords() {
    // 从localStorage加载看房记录
    let records = JSON.parse(localStorage.getItem('visitRecords') || '[]');
    
    // 如果没有记录，添加一些模拟数据用于演示
    if (records.length === 0) {
        records = [
            {
                id: 1,
                tenantName: '张先生',
                tenantAvatar: '👨',
                tenantPhone: '13800138001',
                visitTime: '2024-01-20 14:30:00',
                houseTitle: '精装两室一厅 近地铁',
                houseLocation: '北京市朝阳区建国路88号',
                housePrice: 4500,
                rentType: '整租',
                moveInTime: '2024-02-15',
                rooms: '2室1厅'
            },
            {
                id: 2,
                tenantName: '李女士',
                tenantAvatar: '👩',
                tenantPhone: '13800138002',
                visitTime: '2024-01-21 10:15:00',
                houseTitle: '温馨一居室 拎包入住',
                houseLocation: '北京市海淀区中关村大街1号',
                housePrice: 3200,
                rentType: '合租',
                moveInTime: '2024-02-20',
                rooms: '1室1厅'
            },
            {
                id: 3,
                tenantName: '王先生',
                tenantAvatar: '👨',
                tenantPhone: '13800138003',
                visitTime: '2024-01-22 16:45:00',
                houseTitle: '三室两厅 南北通透',
                houseLocation: '北京市西城区西单大街50号',
                housePrice: 6800,
                rentType: '整租',
                moveInTime: '2024-03-01',
                rooms: '3室2厅'
            }
        ];
        localStorage.setItem('visitRecords', JSON.stringify(records));
    }
    
    // 按时间倒序排序
    records.sort((a, b) => new Date(b.visitTime) - new Date(a.visitTime));
    
    displayVisitRecords(records);
    updateResultCount(records.length);
}

// 显示看房记录
function displayVisitRecords(records) {
    const recordsList = document.getElementById('visitRecordsList');
    const emptyResult = document.getElementById('emptyResult');
    
    if (records.length === 0) {
        recordsList.innerHTML = '';
        emptyResult.style.display = 'block';
        return;
    }
    
    emptyResult.style.display = 'none';
    recordsList.innerHTML = records.map(record => `
        <div class="visit-record-item" onclick="viewRecordDetail(${record.id})">
            <div class="tenant-card-header">
                <div class="tenant-avatar">${record.tenantAvatar || '👤'}</div>
                <div class="tenant-info">
                    <div class="tenant-name">${record.tenantName}</div>
                    <div class="tenant-meta">
                        <span class="rent-type-tag">${record.rentType || '整租'}</span>
                        ${record.rooms && record.rooms.trim() ? `<span class="rooms-tag">${record.rooms}</span>` : ''}
                    </div>
                </div>
                <div class="visit-time-badge">
                    <i class="fas fa-clock"></i>
                    <span>${formatVisitTime(record.visitTime)}</span>
                </div>
            </div>
            <div class="tenant-card-body">
                <div class="tenant-detail-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span class="detail-label">租房时间：</span>
                    <span class="detail-value">${record.moveInTime || '随时入住'}</span>
                </div>
            </div>
         
        </div>
    `).join('');
}

// 格式化看房时间
function formatVisitTime(timeStr) {
    if (!timeStr) return '-';
    
    try {
        const date = new Date(timeStr);
        const now = new Date();
        const diff = now - date;
        
        // 小于1分钟
        if (diff < 60000) {
            return '刚刚';
        }
        // 小于1小时
        if (diff < 3600000) {
            return Math.floor(diff / 60000) + '分钟前';
        }
        // 小于24小时
        if (diff < 86400000) {
            return Math.floor(diff / 3600000) + '小时前';
        }
        // 小于7天
        if (diff < 604800000) {
            return Math.floor(diff / 86400000) + '天前';
        }
        
        // 超过7天，显示具体日期
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        // 如果是今年，不显示年份
        if (year === now.getFullYear()) {
            return `${month}-${day} ${hours}:${minutes}`;
        }
        
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (e) {
        return timeStr;
    }
}

// 更新结果数量
function updateResultCount(count) {
    document.getElementById('countNumber').textContent = count;
}

// 查看记录详情
function viewRecordDetail(recordId) {
    const records = JSON.parse(localStorage.getItem('visitRecords') || '[]');
    const record = records.find(r => r.id === recordId);
    
    if (record) {
        let message = `租客：${record.tenantName}\n手机：${record.tenantPhone}\n看房时间：${record.visitTime}\n\n查看房源：${record.houseTitle}\n位置：${record.houseLocation}\n租金：¥${record.housePrice}/月`;
        
        if (record.rentType || record.moveInTime || record.rooms) {
            message += '\n\n租客求租意向：';
            if (record.rentType) {
                message += `\n租赁类型：${record.rentType}`;
            }
            if (record.moveInTime) {
                message += `\n入住时间：${record.moveInTime}`;
            }
            if (record.rooms) {
                message += `\n户型需求：${record.rooms}`;
            }
        }
        
        alert(message);
    }
}

