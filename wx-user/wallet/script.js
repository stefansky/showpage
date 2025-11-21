// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadPoints();
    loadConsumeRecords();
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

    // 更多按钮
    document.getElementById('moreBtn').addEventListener('click', function() {
        showBillDetail();
    });

}

// 加载房豆数量
function loadPoints() {
    // 检查是否首次登录
    const isFirstLogin = localStorage.getItem('isFirstLogin') !== 'true';
    
    // 检查是否有房豆数据，如果没有则初始化
    const currentPoints = localStorage.getItem('userPoints');
    if (!currentPoints && currentPoints !== '0') {
        // 没有房豆数据，设置默认值10
        localStorage.setItem('userPoints', '10');
        localStorage.setItem('isFirstLogin', 'true');
        
        // 添加首次登录奖励记录
        addConsumeRecord('首次登录奖励', 10, 'earn');
    } else if (isFirstLogin) {
        // 首次登录，发放10个房豆
        localStorage.setItem('userPoints', '10');
        localStorage.setItem('isFirstLogin', 'true');
        
        // 添加首次登录奖励记录
        addConsumeRecord('首次登录奖励', 10, 'earn');
    }
    
    // 加载当前房豆数量
    const points = parseInt(localStorage.getItem('userPoints')) || 10;
    document.getElementById('pointsNumber').textContent = points;
}


// 添加消费记录
function addConsumeRecord(title, amount, type) {
    const records = JSON.parse(localStorage.getItem('consumeRecords') || '[]');
    const record = {
        id: Date.now(),
        title: title,
        amount: amount,
        type: type, // 'earn' 或 'consume'
        time: new Date().toLocaleString('zh-CN')
    };
    
    records.unshift(record); // 添加到开头
    
    // 只保留最近50条记录
    if (records.length > 50) {
        records.pop();
    }
    
    localStorage.setItem('consumeRecords', JSON.stringify(records));
}

// 加载消费记录
function loadConsumeRecords() {
    let records = JSON.parse(localStorage.getItem('consumeRecords') || '[]');
    const recordList = document.getElementById('recordList');
    const emptyRecord = document.getElementById('emptyRecord');
    
    // 如果没有记录，添加一些模拟数据用于演示
    if (records.length === 0) {
        const mockRecords = [
            {
                id: Date.now() - 86400000 * 5, // 5天前
                title: '首次登录奖励',
                amount: 10,
                type: 'earn',
                time: new Date(Date.now() - 86400000 * 5).toLocaleString('zh-CN')
            },
            {
                id: Date.now() - 86400000 * 4, // 4天前
                title: '获取租客联系方式',
                amount: 1,
                type: 'consume',
                time: new Date(Date.now() - 86400000 * 4).toLocaleString('zh-CN')
            },
            {
                id: Date.now() - 86400000 * 3, // 3天前
                title: '获取租客联系方式',
                amount: 1,
                type: 'consume',
                time: new Date(Date.now() - 86400000 * 3).toLocaleString('zh-CN')
            },
            {
                id: Date.now() - 86400000 * 2, // 2天前
                title: '分享朋友圈',
                amount: 2,
                type: 'earn',
                time: new Date(Date.now() - 86400000 * 2).toLocaleString('zh-CN')
            },
            {
                id: Date.now() - 86400000, // 1天前
                title: '获取租客联系方式',
                amount: 1,
                type: 'consume',
                time: new Date(Date.now() - 86400000).toLocaleString('zh-CN')
            },
            {
                id: Date.now() - 3600000, // 1小时前
                title: '每日签到',
                amount: 1,
                type: 'earn',
                time: new Date(Date.now() - 3600000).toLocaleString('zh-CN')
            }
        ];
        
        records = mockRecords;
        localStorage.setItem('consumeRecords', JSON.stringify(records));
    }
    
    if (records.length === 0) {
        recordList.style.display = 'none';
        emptyRecord.style.display = 'block';
        return;
    }
    
    recordList.style.display = 'block';
    emptyRecord.style.display = 'none';
    
    // 清空现有记录
    recordList.innerHTML = '';
    
    // 显示最近10条记录
    const displayRecords = records.slice(0, 10);
    
    displayRecords.forEach(function(record) {
        const recordItem = document.createElement('div');
        recordItem.className = 'record-item';
        
        const iconClass = record.type === 'consume' ? 'consume' : 'earn';
        const icon = record.type === 'consume' ? 'fa-minus-circle' : 'fa-plus-circle';
        const amountColor = record.type === 'consume' ? '#FF6F00' : '#4CAF50';
        const amountPrefix = record.type === 'consume' ? '-' : '+';
        
        recordItem.innerHTML = `
            <div class="record-left">
                <div class="record-icon ${iconClass}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="record-info">
                    <div class="record-title">${record.title}</div>
                    <div class="record-time">${record.time}</div>
                </div>
            </div>
            <div class="record-amount" style="color: ${amountColor}">
                ${amountPrefix}${record.amount}
            </div>
        `;
        
        recordList.appendChild(recordItem);
    });
}

// 显示账单明细
function showBillDetail() {
    const records = JSON.parse(localStorage.getItem('consumeRecords') || '[]');
    
    if (records.length === 0) {
        alert('暂无账单明细');
        return;
    }
    
    let detailText = '账单明细\n\n';
    records.forEach(function(record, index) {
        const prefix = record.type === 'consume' ? '-' : '+';
        detailText += `${index + 1}. ${record.title} ${prefix}${record.amount}个\n`;
        detailText += `   时间: ${record.time}\n\n`;
    });
    
    alert(detailText);
}

