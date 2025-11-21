// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadSavedData();
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

    // 姓名输入
    const nameInput = document.getElementById('nameInput');
    nameInput.addEventListener('input', function() {
        validateName();
    });

    nameInput.addEventListener('blur', function() {
        validateName();
    });

    // 身份证号输入
    const idCardInput = document.getElementById('idCardInput');
    idCardInput.addEventListener('input', function() {
        // 自动转换为大写
        this.value = this.value.toUpperCase();
        validateIdCard();
    });

    idCardInput.addEventListener('blur', function() {
        validateIdCard();
    });

    // 提交按钮
    document.getElementById('submitBtn').addEventListener('click', handleSubmit);
}

// 验证姓名
function validateName() {
    const nameInput = document.getElementById('nameInput');
    const nameError = document.getElementById('nameError');
    const name = nameInput.value.trim();

    // 移除之前的错误状态
    nameInput.classList.remove('error', 'success');
    nameError.textContent = '';

    if (!name) {
        return false;
    }

    // 姓名验证：2-20个字符，支持中文、英文、数字
    const namePattern = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,20}$/;
    
    if (!namePattern.test(name)) {
        nameInput.classList.add('error');
        nameError.innerHTML = '<i class="fas fa-exclamation-circle"></i> 请输入2-20个字符，支持中文、英文、数字';
        return false;
    }

    // 验证通过
    nameInput.classList.add('success');
    return true;
}

// 验证身份证号
function validateIdCard() {
    const idCardInput = document.getElementById('idCardInput');
    const idCardError = document.getElementById('idCardError');
    const idCard = idCardInput.value.trim().toUpperCase();

    // 移除之前的错误状态
    idCardInput.classList.remove('error', 'success');
    idCardError.textContent = '';

    if (!idCard) {
        return false;
    }

    // 身份证号验证：18位，前17位数字，最后一位数字或X
    const idCardPattern = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
    
    if (idCard.length !== 18) {
        idCardInput.classList.add('error');
        idCardError.innerHTML = '<i class="fas fa-exclamation-circle"></i> 身份证号码必须为18位';
        return false;
    }

    if (!idCardPattern.test(idCard)) {
        idCardInput.classList.add('error');
        idCardError.innerHTML = '<i class="fas fa-exclamation-circle"></i> 身份证号码格式不正确';
        return false;
    }

    // 验证校验位（简单验证）
    if (!validateIdCardCheckCode(idCard)) {
        idCardInput.classList.add('error');
        idCardError.innerHTML = '<i class="fas fa-exclamation-circle"></i> 身份证号码校验位不正确';
        return false;
    }

    // 验证通过
    idCardInput.classList.add('success');
    return true;
}

// 验证身份证校验位
function validateIdCardCheckCode(idCard) {
    // 身份证前17位
    const code = idCard.substring(0, 17);
    // 加权因子
    const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验码对应值
    const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
    
    let sum = 0;
    for (let i = 0; i < 17; i++) {
        sum += parseInt(code[i]) * factor[i];
    }
    
    const checkCode = parity[sum % 11];
    const lastChar = idCard[17].toUpperCase();
    
    return checkCode.toString() === lastChar;
}

// 加载保存的数据
function loadSavedData() {
    const savedName = localStorage.getItem('realName');
    const savedIdCard = localStorage.getItem('idCard');
    
    // 如果localStorage中有保存的数据，优先使用保存的数据
    // 否则使用HTML中的默认值
    if (savedName) {
        document.getElementById('nameInput').value = savedName;
        validateName();
    } else {
        // 如果没有保存的数据，验证HTML中的默认值
        validateName();
    }
    
    if (savedIdCard) {
        document.getElementById('idCardInput').value = savedIdCard;
        validateIdCard();
    } else {
        // 如果没有保存的数据，验证HTML中的默认值
        validateIdCard();
    }
}

// 处理提交
function handleSubmit() {
    const nameInput = document.getElementById('nameInput');
    const idCardInput = document.getElementById('idCardInput');
    
    const name = nameInput.value.trim();
    const idCard = idCardInput.value.trim().toUpperCase();

    // 验证姓名
    if (!name) {
        nameInput.classList.add('error');
        document.getElementById('nameError').innerHTML = '<i class="fas fa-exclamation-circle"></i> 请输入真实姓名';
        nameInput.focus();
        return;
    }

    if (!validateName()) {
        nameInput.focus();
        return;
    }

    // 验证身份证号
    if (!idCard) {
        idCardInput.classList.add('error');
        document.getElementById('idCardError').innerHTML = '<i class="fas fa-exclamation-circle"></i> 请输入身份证号码';
        idCardInput.focus();
        return;
    }

    if (!validateIdCard()) {
        idCardInput.focus();
        return;
    }

    // 显示加载状态
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>认证中...</span>';

    // 保存到本地存储（实际应用中应该提交到服务器）
    localStorage.setItem('realName', name);
    localStorage.setItem('idCard', idCard);
    localStorage.setItem('realNameAuthStatus', 'pending'); // pending: 待审核, verified: 已认证, rejected: 已拒绝

    // 模拟提交
    setTimeout(function() {
        console.log('提交认证信息:', {
            name: name,
            idCard: idCard.substring(0, 6) + '********' + idCard.substring(14) // 脱敏显示
        });
        
        // 检查是否有返回参数
        const urlParams = new URLSearchParams(window.location.search);
        const returnPage = urlParams.get('return');
        
        if (returnPage === 'post-find') {
            // 从发布找房页面跳转过来的，认证后直接设置为已认证状态（原型演示用）
            // 实际应用中应该是 pending 状态，等待审核
            localStorage.setItem('realNameAuthStatus', 'verified');
            alert('实名认证成功！\n\n正在返回发布页面...');
            // 跳转回发布找房页面
            window.location.href = '../post-find/index.html';
        } else if (returnPage === 'post-house') {
            // 从发布房源页面跳转过来的，认证后直接设置为已认证状态（原型演示用）
            localStorage.setItem('realNameAuthStatus', 'verified');
            alert('实名认证成功！\n\n正在返回发布页面...');
            // 跳转回发布房源页面
            window.location.href = '../post-house/index.html';
        } else {
            // 正常流程，设置为待审核状态
            alert('认证信息已提交！\n\n您的实名认证申请已提交，我们将在1-3个工作日内完成审核。');
            // 恢复按钮状态
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            // 实际应用中应该跳转到认证状态页面
            // window.location.href = '../personal-center/index.html';
        }
    }, 1500);
}

