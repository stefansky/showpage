// 用户数据
let userData = {
    avatar: '',
    userName: '张先生',
    gender: 'male', // 'male', 'female', 'unknown'
    age: 35,
    realNameAuth: true // 是否实名认证
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadUserData();
    updateUI();
});

// 初始化事件监听
function initEventListeners() {
    // 返回按钮
    document.getElementById('backBtn').addEventListener('click', function() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '../me/index.html';
        }
    });
    
    // 头像上传
    const avatarPreview = document.getElementById('avatarPreview');
    const avatarInput = document.getElementById('avatarInput');
    
    avatarPreview.addEventListener('click', function() {
        avatarInput.click();
    });
    
    avatarInput.addEventListener('change', function(e) {
        handleAvatarUpload(e);
    });
    
    // 修改密码
    document.getElementById('changePasswordItem').addEventListener('click', function() {
        window.location.href = '../change-password/index.html';
    });
    
    // 保存按钮
    document.getElementById('saveBtn').addEventListener('click', function() {
        saveUserData();
    });
}

// 加载用户数据
function loadUserData() {
    // 从localStorage加载数据
    const savedAvatar = localStorage.getItem('shopUserAvatar');
    const savedUserName = localStorage.getItem('shopUserName');
    const savedGender = localStorage.getItem('shopUserGender');
    const savedAge = localStorage.getItem('shopUserAge');
    const savedRealNameAuth = localStorage.getItem('shopRealNameAuth');
    
    if (savedAvatar) userData.avatar = savedAvatar;
    if (savedUserName) userData.userName = savedUserName;
    if (savedGender) userData.gender = savedGender;
    if (savedAge) userData.age = parseInt(savedAge);
    if (savedRealNameAuth !== null) {
        userData.realNameAuth = savedRealNameAuth === 'true';
    }
    
    // 如果没有数据，设置默认值
    if (!savedUserName && !savedGender) {
        setDefaultData();
    }
}

// 设置默认数据
function setDefaultData() {
    userData.userName = '张先生';
    userData.gender = 'male';
    userData.age = 35;
    userData.realNameAuth = true;
}

// 更新UI
function updateUI() {
    // 更新头像
    const avatarImage = document.getElementById('avatarImage');
    const avatarPlaceholder = document.getElementById('avatarPlaceholder');
    const avatarPreview = document.getElementById('avatarPreview');
    
    if (userData.avatar) {
        avatarImage.src = userData.avatar;
        avatarPreview.classList.add('has-image');
    } else {
        avatarPreview.classList.remove('has-image');
    }
    
    // 更新姓名（只读显示）
    document.getElementById('userName').textContent = userData.userName || '-';
    
    // 更新性别（只读显示）
    const genderDisplay = document.getElementById('userGender');
    const genderMap = {
        'male': { icon: 'fa-mars', text: '男' },
        'female': { icon: 'fa-venus', text: '女' },
        'unknown': { icon: 'fa-question', text: '保密' }
    };
    const genderInfo = genderMap[userData.gender] || genderMap['unknown'];
    genderDisplay.innerHTML = `<i class="fas ${genderInfo.icon}"></i><span>${genderInfo.text}</span>`;
    
    // 更新年龄（只读显示）
    document.getElementById('userAge').textContent = userData.age || '-';
    
    // 更新实名认证状态
    updateAuthStatus();
}

// 更新实名认证状态
function updateAuthStatus() {
    const statusBadge = document.getElementById('statusBadge');
    
    if (userData.realNameAuth) {
        statusBadge.className = 'status-badge verified';
        statusBadge.innerHTML = '<i class="fas fa-check-circle"></i><span>已认证</span>';
    } else {
        statusBadge.className = 'status-badge unverified';
        statusBadge.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>未认证</span>';
    }
}

// 处理头像上传
function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) {
        return;
    }
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
    }
    
    // 验证文件大小（限制为2MB）
    if (file.size > 2 * 1024 * 1024) {
        alert('图片大小不能超过2MB');
        return;
    }
    
    // 读取文件并显示预览
    const reader = new FileReader();
    reader.onload = function(e) {
        userData.avatar = e.target.result;
        updateAvatarDisplay();
    };
    reader.readAsDataURL(file);
}

// 更新头像显示
function updateAvatarDisplay() {
    const avatarImage = document.getElementById('avatarImage');
    const avatarPreview = document.getElementById('avatarPreview');
    
    if (userData.avatar) {
        avatarImage.src = userData.avatar;
        avatarPreview.classList.add('has-image');
    } else {
        avatarPreview.classList.remove('has-image');
    }
}

// 保存用户数据
function saveUserData() {
    // 只保存头像（其他信息不可编辑）
    if (userData.avatar) {
        localStorage.setItem('shopUserAvatar', userData.avatar);
    }
    
    // 提示保存成功
    alert('头像保存成功！');
    
    // 返回上一页
    setTimeout(function() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '../me/index.html';
        }
    }, 500);
}

