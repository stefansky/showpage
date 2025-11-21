// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadPoints();
    loadRecords();
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
    
    // 更多记录
    document.getElementById('moreRecordsBtn').addEventListener('click', function() {
        alert('查看全部消费记录\n\n跳转到消费记录列表页面');
        // window.location.href = '../records/index.html';
    });
}

// 加载房豆数据
function loadPoints() {
    // 从localStorage加载数据
    let points = parseInt(localStorage.getItem('shopPoints')) || 0;
    
    // 如果没有数据，设置默认值
    if (points === 0) {
        points = 10; // 默认10个房豆
        localStorage.setItem('shopPoints', points.toString());
    }
    
    // 更新UI
    document.getElementById('pointsNumber').textContent = points;
}

// 加载消费记录
function loadRecords() {
    const recordsList = document.getElementById('recordsList');
    let records = [];
    
    try {
        const storedRecords = localStorage.getItem('shopConsumeRecords');
        if (storedRecords) {
            records = JSON.parse(storedRecords);
        }
    } catch (e) {
        console.error('Error parsing records from localStorage:', e);
        records = [];
    }
    
    // 如果没有记录，创建一些默认记录
    if (records.length === 0) {
        const mockRecords = [
            {
                id: 1,
                type: 'consume',
                title: '获取租客联系方式',
                amount: 1,
                time: '2024-01-15 14:30'
            },
            {
                id: 2,
                type: 'consume',
                title: '获取租客联系方式',
                amount: 1,
                time: '2024-01-12 10:20'
            },
            {
                id: 3,
                type: 'earn',
                title: '房源发布奖励',
                amount: 5,
                time: '2024-01-10 16:45'
            },
            {
                id: 4,
                type: 'consume',
                title: '获取租客联系方式',
                amount: 1,
                time: '2024-01-08 09:15'
            },
            {
                id: 5,
                type: 'earn',
                title: '首次登录奖励',
                amount: 10,
                time: '2024-01-05 11:30'
            }
        ];
        localStorage.setItem('shopConsumeRecords', JSON.stringify(mockRecords));
        displayRecords(mockRecords.slice(0, 5)); // 显示最近5条
    } else {
        // 显示最近5条记录
        const recentRecords = records.slice(0, 5);
        displayRecords(recentRecords);
    }
}

// 显示消费记录
function displayRecords(records) {
    const recordsList = document.getElementById('recordsList');
    
    if (!records || records.length === 0) {
        recordsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>暂无消费记录</p>
            </div>
        `;
        return;
    }
    
    recordsList.innerHTML = records.map(function(record) {
        const iconClass = record.type === 'earn' ? 'earn' : 'consume';
        const icon = record.type === 'earn' ? 'fa-plus-circle' : 'fa-minus-circle';
        const amountClass = record.type === 'earn' ? 'earn' : 'consume';
        const amountPrefix = record.type === 'earn' ? '+' : '-';
        
        return `
            <div class="record-item">
                <div class="record-icon ${iconClass}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="record-content">
                    <div class="record-title">${record.title}</div>
                    <div class="record-time">${record.time}</div>
                </div>
                <div class="record-amount ${amountClass}">
                    ${amountPrefix}${record.amount}
                </div>
            </div>
        `;
    }).join('');
}


