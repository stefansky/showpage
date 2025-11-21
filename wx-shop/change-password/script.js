// 密码显示/隐藏状态
let passwordVisibility = {
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
};

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
            window.location.href = '../edit-profile/index.html';
        }
    });
    
    // 密码显示/隐藏按钮
    document.getElementById('oldPasswordEye').addEventListener('click', function() {
        togglePasswordVisibility('oldPassword');
    });
    
    document.getElementById('newPasswordEye').addEventListener('click', function() {
        togglePasswordVisibility('newPassword');
    });
    
    document.getElementById('confirmPasswordEye').addEventListener('click', function() {
        togglePasswordVisibility('confirmPassword');
    });
    
    // 输入验证
    document.getElementById('oldPassword').addEventListener('blur', function() {
        validateOldPassword();
    });
    
    document.getElementById('newPassword').addEventListener('blur', function() {
        validateNewPassword();
    });
    
    document.getElementById('confirmPassword').addEventListener('blur', function() {
        validateConfirmPassword();
    });
    
    // 提交按钮
    document.getElementById('submitBtn').addEventListener('click', function() {
        handleSubmit();
    });
}

// 切换密码显示/隐藏
function togglePasswordVisibility(field) {
    const input = document.getElementById(field);
    const eyeBtn = document.getElementById(field + 'Eye');
    const icon = eyeBtn.querySelector('i');
    
    passwordVisibility[field] = !passwordVisibility[field];
    
    if (passwordVisibility[field]) {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// 验证原始密码
function validateOldPassword() {
    const input = document.getElementById('oldPassword');
    const errorEl = document.getElementById('oldPasswordError');
    const value = input.value.trim();
    
    if (!value) {
        showError('oldPassword', '请输入原始密码');
        return false;
    }
    
    // 这里应该验证原始密码是否正确（实际应用中需要与服务器验证）
    // 为了演示，我们假设原始密码是 "123456"
    const correctOldPassword = localStorage.getItem('shopUserPassword') || '123456';
    if (value !== correctOldPassword) {
        showError('oldPassword', '原始密码不正确');
        return false;
    }
    
    clearError('oldPassword');
    return true;
}

// 验证新密码
function validateNewPassword() {
    const input = document.getElementById('newPassword');
    const errorEl = document.getElementById('newPasswordError');
    const value = input.value.trim();
    
    if (!value) {
        showError('newPassword', '请输入新密码');
        return false;
    }
    
    if (value.length < 6 || value.length > 20) {
        showError('newPassword', '密码长度为6-20位');
        return false;
    }
    
    // 检查是否与原始密码相同
    const oldPassword = document.getElementById('oldPassword').value.trim();
    if (value === oldPassword) {
        showError('newPassword', '新密码不能与原始密码相同');
        return false;
    }
    
    clearError('newPassword');
    return true;
}

// 验证确认密码
function validateConfirmPassword() {
    const input = document.getElementById('confirmPassword');
    const errorEl = document.getElementById('confirmPasswordError');
    const value = input.value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    
    if (!value) {
        showError('confirmPassword', '请再次输入新密码');
        return false;
    }
    
    if (value !== newPassword) {
        showError('confirmPassword', '两次输入的密码不一致');
        return false;
    }
    
    clearError('confirmPassword');
    return true;
}

// 显示错误信息
function showError(field, message) {
    const input = document.getElementById(field);
    const errorEl = document.getElementById(field + 'Error');
    
    input.classList.add('error');
    errorEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + message;
}

// 清除错误信息
function clearError(field) {
    const input = document.getElementById(field);
    const errorEl = document.getElementById(field + 'Error');
    
    input.classList.remove('error');
    errorEl.innerHTML = '';
}

// 处理提交
function handleSubmit() {
    // 验证所有字段
    const isOldPasswordValid = validateOldPassword();
    const isNewPasswordValid = validateNewPassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    
    if (!isOldPasswordValid || !isNewPasswordValid || !isConfirmPasswordValid) {
        return;
    }
    
    // 获取密码
    const newPassword = document.getElementById('newPassword').value.trim();
    
    // 禁用提交按钮
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>修改中...</span>';
    
    // 模拟提交（实际应用中应该提交到服务器）
    setTimeout(function() {
        // 保存新密码到localStorage（实际应用中应该保存到服务器）
        localStorage.setItem('shopUserPassword', newPassword);
        
        // 提示成功
        alert('密码修改成功！');
        
        // 清空表单
        document.getElementById('oldPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        // 恢复按钮
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check"></i><span>确认修改</span>';
        
        // 返回上一页
        setTimeout(function() {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = '../edit-profile/index.html';
            }
        }, 500);
    }, 1000);
}

