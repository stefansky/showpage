// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
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

    // 立即加入按钮
    document.getElementById('joinBtn').addEventListener('click', function() {
        handleJoin();
    });
}

// 处理开店
function handleJoin() {
    const userRole = localStorage.getItem('userRole');
    
    if (!userRole) {
        // 未登录，跳转到登录页面
        if (confirm('开店需要先登录\n\n是否前往登录？')) {
            window.location.href = '../login/index.html';
        }
        return;
    }
    
    if (userRole === 'landlord') {
        // 已经是房东，提示可以开始使用
        alert('恭喜！您已具备开店资格\n\n可以在个人中心发布房源，开始经营您的虚拟门店。');
        window.location.href = '../home/index.html';
        return;
    }
    
    // 租客身份，切换到房东
    if (confirm('开店需要切换为房东身份\n\n切换后您将可以开设虚拟门店，发布房源，赚取佣金。\n\n是否切换为房东身份？')) {
        // 跳转到身份选择页面
        window.location.href = '../identity-select/index.html';
    }
}

