// 返回按钮点击事件
document.getElementById('backBtn').addEventListener('click', function() {
    // 返回上一页或首页
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // 如果没有历史记录，跳转到首页
        window.location.href = '../home/index.html';
    }
});

// 微信授权登录按钮点击事件
document.getElementById('wechatLoginBtn').addEventListener('click', function() {
    // 显示加载状态
    const btn = this;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>登录中...</span>';
    btn.disabled = true;
    
    // 模拟微信授权登录流程
    setTimeout(function() {
        // 在实际小程序中，这里应该调用微信登录API
        // wx.login() 或 wx.getUserProfile()
        
        // 模拟登录成功，保存用户信息
        const mockUserName = '微信用户' + Math.floor(Math.random() * 10000);
        localStorage.setItem('userName', mockUserName);
        
        // 检查是否首次登录
        const isFirstLogin = localStorage.getItem('isFirstLogin') !== 'true';
        
        // 恢复按钮状态
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        if (isFirstLogin) {
            // 首次登录，跳转到身份选择页
            localStorage.setItem('isFirstLogin', 'false');
            window.location.href = '../identity-select/index.html';
        } else {
            // 非首次登录，跳转到首页
            window.location.href = '../home/index.html';
        }
    }, 1500);
});

// 右侧菜单按钮点击事件
document.querySelectorAll('.header-icon-btn').forEach(function(btn, index) {
    btn.addEventListener('click', function() {
        if (index === 0) {
            // 三个点按钮 - 显示更多选项
            alert('更多选项');
        } else {
            // 圆圈按钮 - 可能是设置或其他功能
            alert('设置');
        }
    });
});

// 页面加载完成后的初始化
window.addEventListener('load', function() {
    console.log('登录页面加载完成');
    
    // 可以在这里添加其他初始化逻辑
    // 比如检查是否已登录，如果已登录则直接跳转
});

