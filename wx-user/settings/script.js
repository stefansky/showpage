// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadSettings();
    checkAuthStatus();
    calculateCacheSize();
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

    // 实名认证
    document.getElementById('realNameAuthItem').addEventListener('click', function() {
        window.location.href = '../real-name-auth/index.html';
    });

    // 账号安全
    document.getElementById('accountSecurityItem').addEventListener('click', function() {
        alert('账号安全\n\n（实际应用中跳转到账号安全页面）');
    });

    // 隐私保护
    document.querySelectorAll('.setting-item')[2].addEventListener('click', function() {
        alert('隐私保护\n\n（实际应用中跳转到隐私保护设置页面）');
    });

    // 个人信息管理
    document.querySelectorAll('.setting-item')[3].addEventListener('click', function() {
        alert('个人信息管理\n\n（实际应用中跳转到个人信息管理页面）');
    });

    // 清除缓存
    document.getElementById('clearCacheItem').addEventListener('click', function() {
        if (confirm('确定要清除缓存吗？')) {
            clearCache();
        }
    });

    // 检查更新
    document.getElementById('checkUpdateItem').addEventListener('click', function() {
        checkUpdate();
    });

    // 意见反馈
    document.getElementById('feedbackItem').addEventListener('click', function() {
        alert('意见反馈\n\n（实际应用中跳转到意见反馈页面）');
    });

    // 帮助中心
    document.getElementById('helpItem').addEventListener('click', function() {
        window.location.href = '../rules/index.html';
    });

    // 通知开关
    document.getElementById('messageNotify').addEventListener('change', function() {
        saveSettings();
    });

    document.getElementById('matchNotify').addEventListener('change', function() {
        saveSettings();
    });

    // 退出登录
    document.getElementById('logoutBtn').addEventListener('click', function() {
        handleLogout();
    });
}

// 检查认证状态
function checkAuthStatus() {
    const authStatus = localStorage.getItem('realNameAuthStatus');
    const statusEl = document.getElementById('authStatus');
    
    if (authStatus === 'verified') {
        statusEl.textContent = '已认证';
        statusEl.className = 'setting-status verified';
    } else if (authStatus === 'pending') {
        statusEl.textContent = '审核中';
        statusEl.className = 'setting-status pending';
    } else {
        statusEl.textContent = '未认证';
        statusEl.className = 'setting-status';
    }
}

// 计算缓存大小
function calculateCacheSize() {
    try {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length + key.length;
            }
        }
        const sizeInMB = (total / 1024 / 1024).toFixed(2);
        document.getElementById('cacheSize').textContent = sizeInMB + ' MB';
    } catch (e) {
        document.getElementById('cacheSize').textContent = '0 MB';
    }
}

// 清除缓存
function clearCache() {
    // 清除所有localStorage数据（除了用户登录信息）
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    
    localStorage.clear();
    
    // 恢复用户登录信息
    if (userRole) {
        localStorage.setItem('userRole', userRole);
    }
    if (userName) {
        localStorage.setItem('userName', userName);
    }
    
    // 重新计算缓存大小
    calculateCacheSize();
    
    alert('缓存已清除');
}

// 检查更新
function checkUpdate() {
    const checkBtn = document.getElementById('checkUpdateItem');
    const originalHTML = checkBtn.innerHTML;
    
    checkBtn.style.opacity = '0.6';
    checkBtn.innerHTML = '<div class="setting-left"><i class="fas fa-sync-alt setting-icon"></i><span class="setting-label">检查更新</span></div><div class="setting-right"><span class="setting-desc">检查中...</span></div>';
    
    setTimeout(function() {
        checkBtn.style.opacity = '1';
        checkBtn.innerHTML = originalHTML;
        alert('当前已是最新版本 v1.0.0');
    }, 1500);
}

// 保存设置
function saveSettings() {
    const settings = {
        messageNotify: document.getElementById('messageNotify').checked,
        matchNotify: document.getElementById('matchNotify').checked
    };
    
    localStorage.setItem('appSettings', JSON.stringify(settings));
}

// 加载设置
function loadSettings() {
    const settingsStr = localStorage.getItem('appSettings');
    if (settingsStr) {
        try {
            const settings = JSON.parse(settingsStr);
            if (settings.messageNotify !== undefined) {
                document.getElementById('messageNotify').checked = settings.messageNotify;
            }
            if (settings.matchNotify !== undefined) {
                document.getElementById('matchNotify').checked = settings.matchNotify;
            }
        } catch (e) {
            console.error('加载设置失败:', e);
        }
    }
}

// 处理退出登录
function handleLogout() {
    if (confirm('确定要退出登录吗？退出后将清除所有本地数据。')) {
        // 清除所有本地缓存数据
        localStorage.clear();
        
        // 跳转到登录页面
        alert('已退出登录，所有数据已清除');
        window.location.href = '../login/index.html';
    }
}

