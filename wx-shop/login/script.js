// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    setDefaultValues();
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
    
    // 登录表单提交
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // 切换密码显示
    document.getElementById('togglePassword').addEventListener('click', function() {
        togglePasswordVisibility();
    });
    
    // 手机号输入限制
    document.getElementById('phoneInput').addEventListener('input', function(e) {
        // 只允许输入数字
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// 设置默认值（用于演示）
function setDefaultValues() {
    // 可以设置默认值方便测试
    // document.getElementById('phoneInput').value = '13800138000';
    // document.getElementById('passwordInput').value = '123456';
}

// 切换密码显示/隐藏
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('passwordInput');
    const toggleBtn = document.getElementById('togglePassword');
    const icon = toggleBtn.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// 验证手机号
function validatePhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// 验证密码
function validatePassword(password) {
    return password && password.length >= 6;
}

// 处理登录
function handleLogin() {
    const phoneInput = document.getElementById('phoneInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginBtn = document.getElementById('loginBtn');
    
    const phone = phoneInput.value.trim();
    const password = passwordInput.value.trim();
    
    // 验证手机号
    if (!phone) {
        alert('请输入手机号');
        phoneInput.focus();
        return;
    }
    
    if (!validatePhone(phone)) {
        alert('请输入正确的手机号');
        phoneInput.focus();
        return;
    }
    
    // 验证密码
    if (!password) {
        alert('请输入密码');
        passwordInput.focus();
        return;
    }
    
    if (!validatePassword(password)) {
        alert('密码长度至少6位');
        passwordInput.focus();
        return;
    }
    
    // 禁用登录按钮
    loginBtn.disabled = true;
    loginBtn.textContent = '登录中...';
    
    // 模拟登录请求
    setTimeout(function() {
        // 保存登录状态
        localStorage.setItem('shopLoginStatus', 'loggedIn');
        localStorage.setItem('shopUserPhone', phone);
        localStorage.setItem('shopUserName', '商家用户');
        
        // 登录成功，跳转到首页
        alert('登录成功！');
        window.location.href = '../home/index.html';
    }, 1000);
}

