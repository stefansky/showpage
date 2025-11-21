// 检查登录状态
function checkLoginStatus() {
    // 从本地存储获取用户信息（实际应用中应该从服务器获取）
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    
    if (userRole && userName) {
        // 已登录状态
        updateUserInfo(userName, userRole);
        updateFunctionItems(userRole);
    } else {
        // 未登录状态
        showNotLoggedIn();
        // 未登录时隐藏我的房源和我的找房
        updateFunctionItems(null);
    }
}

// 根据角色更新功能项显示
function updateFunctionItems(userRole) {
    const myHouses = document.getElementById('myHouses');
    const myFind = document.getElementById('myFind');
    
    if (!userRole) {
        // 未登录：隐藏两个功能项
        myHouses.style.display = 'none';
        myFind.style.display = 'none';
    } else if (userRole === 'landlord') {
        // 房东：显示我的房源，隐藏我的找房
        myHouses.style.display = 'flex';
        myFind.style.display = 'none';
    } else if (userRole === 'tenant') {
        // 租客：显示我的找房，隐藏我的房源
        myHouses.style.display = 'none';
        myFind.style.display = 'flex';
    }
}

// 显示未登录状态
function showNotLoggedIn() {
    document.getElementById('userName').textContent = '未登录';
    document.getElementById('loginTip').textContent = '点击头像登录';
    document.getElementById('userBadge').style.display = 'none';
}

// 更新用户信息
function updateUserInfo(name, role) {
    document.getElementById('userName').textContent = name;
    document.getElementById('loginTip').textContent = role === 'tenant' ? '租客' : '房东';
    document.getElementById('userBadge').style.display = 'flex';
}

// 返回按钮点击事件
document.getElementById('backBtn').addEventListener('click', function() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = '../home/index.html';
    }
});

// 更多选项按钮
document.getElementById('moreBtn').addEventListener('click', function() {
    alert('更多选项');
});

// 眼睛图标按钮（可能是隐私设置）
document.getElementById('eyeBtn').addEventListener('click', function() {
    alert('隐私设置');
});

// 用户信息区域点击事件（登录/查看资料）
document.getElementById('userInfo').addEventListener('click', function() {
    const userRole = localStorage.getItem('userRole');
    
    if (!userRole) {
        // 未登录，跳转到登录页面
        window.location.href = '../login/index.html';
    } else {
        // 已登录，跳转到个人资料页面
        window.location.href = '../user-profile/index.html';
    }
});

// 我的房源
document.getElementById('myHouses').addEventListener('click', function() {
    const userRole = localStorage.getItem('userRole');
    
    if (!userRole) {
        alert('请先登录');
        window.location.href = '../login/index.html';
        return;
    }
    
    // 只有房东可以查看我的房源
    if (userRole !== 'landlord') {
        alert('只有房东可以查看房源');
        return;
    }
    
    window.location.href = '../my-houses/index.html';
});

// 我的找房
document.getElementById('myFind').addEventListener('click', function() {
    const userRole = localStorage.getItem('userRole');
    
    if (!userRole) {
        alert('请先登录');
        window.location.href = '../login/index.html';
        return;
    }
    
    window.location.href = '../my-find/index.html';
});

// 我的钱包
document.getElementById('myWallet').addEventListener('click', function() {
    const userRole = localStorage.getItem('userRole');
    
    if (!userRole) {
        alert('请先登录');
        window.location.href = '../login/index.html';
        return;
    }
    
    window.location.href = '../wallet/index.html';
});

// 获取记录
document.getElementById('contactRecords').addEventListener('click', function() {
    const userRole = localStorage.getItem('userRole');
    
    if (!userRole) {
        alert('请先登录');
        window.location.href = '../login/index.html';
        return;
    }
    
    window.location.href = '../contact-records/index.html';
});

// 活动中心
document.getElementById('activityCenter').addEventListener('click', function() {
    window.location.href = '../activity/index.html';
});

// 身份切换
document.getElementById('identitySwitch').addEventListener('click', function() {
    const userRole = localStorage.getItem('userRole');
    
    if (!userRole) {
        alert('请先登录');
        window.location.href = '../login/index.html';
        return;
    }
    
    // 跳转到身份选择页面
    window.location.href = '../identity-select/index.html';
});

// 客服中心
document.getElementById('customerService').addEventListener('click', function() {
    alert('客服中心\n\n客服电话：400-xxx-xxxx\n\n（实际应用中跳转到客服页面）');
});

// 设置
document.getElementById('settings').addEventListener('click', function() {
    window.location.href = '../settings/index.html';
});

// 关于我们
document.getElementById('aboutUs').addEventListener('click', function() {
    window.location.href = '../about/index.html';
});

// 页面加载完成后检查登录状态
window.addEventListener('load', function() {
    checkLoginStatus();
    console.log('个人中心页面加载完成');
});

// 监听存储变化（当其他页面更新登录状态时）
window.addEventListener('storage', function(e) {
    if (e.key === 'userRole' || e.key === 'userName') {
        checkLoginStatus();
    }
});

// 页面显示时也更新功能项（处理同标签页内的状态变化）
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        checkLoginStatus();
    }
});

