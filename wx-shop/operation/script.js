// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadOperationData();
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
}

// 加载运营数据
function loadOperationData() {
    // 从localStorage加载数据
    const totalHouses = parseInt(localStorage.getItem('totalHouses')) || 0;
    const totalViews = parseInt(localStorage.getItem('totalViews')) || 0;
    const totalContacts = parseInt(localStorage.getItem('totalContacts')) || 0;
    const monthEarnings = parseFloat(localStorage.getItem('monthEarnings')) || 0;
    const completedOrders = parseInt(localStorage.getItem('completedOrders')) || 0;
    const pendingOrders = parseInt(localStorage.getItem('pendingOrders')) || 0;
    
    // 计算预测收入
    const avgCommission = 350;
    const predictedEarnings = pendingOrders * avgCommission;
    
    // 房源状态数据（从门店房源中统计）
    const storeHouses = JSON.parse(localStorage.getItem('storeHouses') || '[]');
    const publishedHouses = storeHouses.filter(function(house) {
        return house.status === 'published';
    }).length;
    const pendingHouses = storeHouses.filter(function(house) {
        return house.status === 'pending';
    }).length;
    const rentedHouses = storeHouses.filter(function(house) {
        return house.status === 'rented';
    }).length;
    
    // 浏览趋势数据（模拟数据）
    const todayViews = parseInt(localStorage.getItem('todayViews')) || Math.floor(totalViews / 30);
    const weekViews = parseInt(localStorage.getItem('weekViews')) || Math.floor(totalViews / 4);
    const monthViews = totalViews;
    
    // 租客分析数据（模拟数据）
    const intentionTenants = totalContacts;
    const contactedTenants = parseInt(localStorage.getItem('contactedTenants')) || Math.floor(totalContacts * 0.6);
    const viewingAppointments = parseInt(localStorage.getItem('viewingAppointments')) || Math.floor(totalContacts * 0.3);
    
    // 如果没有数据，设置默认值
    if (totalHouses === 0 && totalViews === 0) {
        setDefaultData();
        loadOperationData(); // 重新加载
        return;
    }
    
    // 更新UI
    document.getElementById('totalHouses').textContent = totalHouses;
    document.getElementById('totalViews').textContent = totalViews;
    document.getElementById('totalContacts').textContent = totalContacts;
    document.getElementById('monthEarnings').textContent = '¥' + monthEarnings.toFixed(2);
    document.getElementById('completedOrders').textContent = completedOrders + '单';
    document.getElementById('pendingOrders').textContent = pendingOrders + '单';
    document.getElementById('predictedEarnings').textContent = '¥' + predictedEarnings.toFixed(2);
    document.getElementById('publishedHouses').textContent = publishedHouses;
    document.getElementById('pendingHouses').textContent = pendingHouses;
    document.getElementById('rentedHouses').textContent = rentedHouses;
    document.getElementById('todayViews').textContent = todayViews;
    document.getElementById('weekViews').textContent = weekViews;
    document.getElementById('monthViews').textContent = monthViews;
    document.getElementById('intentionTenants').textContent = intentionTenants;
    document.getElementById('contactedTenants').textContent = contactedTenants;
    document.getElementById('viewingAppointments').textContent = viewingAppointments;
}

// 设置默认数据
function setDefaultData() {
    localStorage.setItem('totalHouses', '12');
    localStorage.setItem('totalViews', '156');
    localStorage.setItem('totalContacts', '23');
    localStorage.setItem('monthEarnings', '3200.00');
    localStorage.setItem('completedOrders', '8');
    localStorage.setItem('pendingOrders', '5');
    localStorage.setItem('todayViews', '8');
    localStorage.setItem('weekViews', '42');
    localStorage.setItem('contactedTenants', '14');
    localStorage.setItem('viewingAppointments', '7');
    
    // 设置默认房源数据
    const defaultHouses = [
        { id: 1, status: 'published' },
        { id: 2, status: 'published' },
        { id: 3, status: 'published' },
        { id: 4, status: 'published' },
        { id: 5, status: 'published' },
        { id: 6, status: 'published' },
        { id: 7, status: 'published' },
        { id: 8, status: 'published' },
        { id: 9, status: 'pending' },
        { id: 10, status: 'pending' },
        { id: 11, status: 'rented' },
        { id: 12, status: 'rented' }
    ];
    localStorage.setItem('storeHouses', JSON.stringify(defaultHouses));
}

