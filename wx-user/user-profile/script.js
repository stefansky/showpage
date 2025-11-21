// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadUserInfo();
    checkAuthStatus();
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

    // 头像编辑
    document.getElementById('avatarEditBtn').addEventListener('click', function(e) {
        e.stopPropagation();
        changeAvatar();
    });

    document.getElementById('avatar').addEventListener('click', function() {
        changeAvatar();
    });

    // 认证操作
    document.getElementById('authLinkBtn').addEventListener('click', function() {
        window.location.href = '../real-name-auth/index.html';
    });

    // 保存按钮
    document.getElementById('saveBtn').addEventListener('click', function() {
        saveUserInfo();
    });

    // 昵称输入验证
    document.getElementById('nicknameInput').addEventListener('input', function() {
        validateNickname();
    });
}

// 更换头像
function changeAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const avatar = document.getElementById('avatar');
                avatar.innerHTML = `<img src="${e.target.result}" alt="头像">`;
                // 保存头像
                localStorage.setItem('userAvatar', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}


// 验证昵称
function validateNickname() {
    const nickname = document.getElementById('nicknameInput').value.trim();
    const nicknamePattern = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,20}$/;
    
    if (nickname && !nicknamePattern.test(nickname)) {
        // 可以在这里添加错误提示
        return false;
    }
    return true;
}

// 加载用户信息
function loadUserInfo() {
    // 加载头像
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        const avatar = document.getElementById('avatar');
        avatar.innerHTML = `<img src="${savedAvatar}" alt="头像">`;
    }

    // 加载昵称
    const savedNickname = localStorage.getItem('userNickname');
    if (savedNickname) {
        document.getElementById('nicknameInput').value = savedNickname;
    }

    // 加载性别
    const savedGender = localStorage.getItem('userGender');
    if (savedGender) {
        document.getElementById('genderValue').textContent = savedGender === 'male' ? '男' : savedGender === 'female' ? '女' : '未设置';
    } else {
        document.getElementById('genderValue').textContent = '未设置';
    }

    // 加载手机号
    const savedPhone = localStorage.getItem('userPhone');
    if (savedPhone) {
        document.getElementById('phoneValue').textContent = savedPhone;
    } else {
        document.getElementById('phoneValue').textContent = '-';
    }

    // 加载身份
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
        const roleName = userRole === 'tenant' ? '租客' : '房东';
        document.getElementById('roleValue').textContent = roleName;
    } else {
        document.getElementById('roleValue').textContent = '未选择';
    }
}

// 检查认证状态
function checkAuthStatus() {
    const authStatus = localStorage.getItem('realNameAuthStatus');
    const authStatusBadge = document.getElementById('authStatusBadge');
    const authLinkBtn = document.getElementById('authLinkBtn');

    if (authStatus === 'verified') {
        // 已认证
        authStatusBadge.textContent = '已认证';
        authStatusBadge.className = 'status-badge verified';
        authLinkBtn.style.display = 'none';
    } else if (authStatus === 'pending') {
        // 审核中
        authStatusBadge.textContent = '审核中';
        authStatusBadge.className = 'status-badge pending';
        authLinkBtn.style.display = 'none';
    } else {
        // 未认证
        authStatusBadge.textContent = '未认证';
        authStatusBadge.className = 'status-badge';
        authLinkBtn.style.display = 'block';
    }
}

// 保存用户信息
function saveUserInfo() {
    const nickname = document.getElementById('nicknameInput').value.trim();
    
    // 验证昵称
    if (nickname && !validateNickname()) {
        alert('昵称格式不正确，请输入1-20个字符，支持中文、英文、数字');
        return;
    }

    // 保存昵称
    if (nickname) {
        localStorage.setItem('userNickname', nickname);
    } else {
        localStorage.removeItem('userNickname');
    }

    // 显示保存成功
    const saveBtn = document.getElementById('saveBtn');
    const originalText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-check"></i><span>已保存</span>';

    setTimeout(function() {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
        alert('保存成功！');
    }, 1000);
}

// 监听认证状态变化（从其他页面返回时）
window.addEventListener('focus', function() {
    checkAuthStatus();
});

