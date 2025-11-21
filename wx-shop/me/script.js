// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadUserData();
});

// 初始化事件监听
function initEventListeners() {
    // 底部导航
    document.getElementById('homeNav').addEventListener('click', function() {
        window.location.href = '../home/index.html';
    });
    
    document.getElementById('meNav').addEventListener('click', function() {
        // 已在"我的"页面，无需操作
    });
    
    // 编辑资料
    document.getElementById('editProfileBtn').addEventListener('click', function() {
        window.location.href = '../edit-profile/index.html';
    });
    
    // 门店名称
    document.getElementById('storeNameItem').addEventListener('click', function() {
        window.location.href = '../store-info/index.html';
    });
    
    // 联系记录
    document.getElementById('myHousesItem').addEventListener('click', function() {
        window.location.href = '../contact-records/index.html';
    });
    
    // 门店房豆
    document.getElementById('storeWalletItem').addEventListener('click', function() {
        window.location.href = '../wallet/index.html';
    });
    
    // 门店运营
    document.getElementById('operationItem').addEventListener('click', function() {
        alert('门店运营\n\n跳转到运营数据页面');
        // window.location.href = '../operation/index.html';
    });
    
    // 附近租客
    document.getElementById('nearbyTenantsItem').addEventListener('click', function() {
        alert('附近租客\n\n跳转到附近租客列表');
        // window.location.href = '../nearby-tenants/index.html';
    });
    
    // 消息通知
    document.getElementById('messagesItem').addEventListener('click', function() {
        alert('消息通知\n\n跳转到消息中心');
        // window.location.href = '../messages/index.html';
    });
    
    // 帮助中心
    document.getElementById('helpItem').addEventListener('click', function() {
        alert('帮助中心\n\n跳转到帮助中心');
        // window.location.href = '../help/index.html';
    });
    
    // 设置
    document.getElementById('settingsItem').addEventListener('click', function() {
        alert('设置\n\n跳转到设置页面');
        // window.location.href = '../settings/index.html';
    });
}

// 加载用户数据
function loadUserData() {
    // 从localStorage加载用户信息
    const userName = localStorage.getItem('shopUserName') || '商家用户';
    const storeName = localStorage.getItem('storeName') || '我的门店';
    const storeStatus = localStorage.getItem('storeStatus') || '正常营业';
    const housesCount = parseInt(localStorage.getItem('totalHouses')) || 0;
    const shopPoints = parseInt(localStorage.getItem('shopPoints')) || 0;
    const messageCount = parseInt(localStorage.getItem('messageCount')) || 0;
    
    // 更新UI
    document.getElementById('userName').textContent = userName;
    document.getElementById('userStore').textContent = storeName;
    document.getElementById('storeStatus').textContent = storeStatus;
    document.getElementById('storeName').textContent = storeName;
    document.getElementById('housesCount').textContent = housesCount;
    document.getElementById('walletBalance').textContent = shopPoints;
    
    // 消息数量
    if (messageCount > 0) {
        document.getElementById('messageCount').textContent = messageCount;
        document.getElementById('messageCount').style.display = 'block';
    } else {
        document.getElementById('messageCount').style.display = 'none';
    }
    
    // 房源数量
    if (housesCount > 0) {
        document.getElementById('housesCount').style.display = 'block';
    } else {
        document.getElementById('housesCount').style.display = 'none';
    }
    
    // 如果没有数据，设置默认值用于演示
    if (shopPoints === 0) {
        setDefaultData();
    }
}

// 设置默认数据（用于演示）
function setDefaultData() {
    localStorage.setItem('shopUserName', '张先生');
    localStorage.setItem('storeName', '张先生的租房门店');
    localStorage.setItem('storeStatus', '正常营业');
    localStorage.setItem('shopPoints', '10');
    localStorage.setItem('messageCount', '3');
    
    // 重新加载
    loadUserData();
}

