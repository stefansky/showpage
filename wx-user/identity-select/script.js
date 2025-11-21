// 选中的身份
let selectedRole = null;

// 获取所有身份卡片
const tenantCard = document.getElementById('tenantCard');
const landlordCard = document.getElementById('landlordCard');
const confirmBtn = document.getElementById('confirmBtn');

// 租客卡片点击事件
tenantCard.addEventListener('click', function() {
    selectRole('tenant', tenantCard);
});

// 房东卡片点击事件
landlordCard.addEventListener('click', function() {
    selectRole('landlord', landlordCard);
});

// 选择身份函数
function selectRole(role, cardElement) {
    // 移除所有选中状态
    tenantCard.classList.remove('selected');
    landlordCard.classList.remove('selected');
    
    // 添加选中状态到当前卡片
    cardElement.classList.add('selected');
    
    // 保存选中的身份
    selectedRole = role;
    
    // 启用确认按钮
    confirmBtn.disabled = false;
    
    // 添加选中动画效果
    cardElement.style.transform = 'scale(0.98)';
    setTimeout(() => {
        cardElement.style.transform = '';
    }, 200);
}

// 确认按钮点击事件
confirmBtn.addEventListener('click', function() {
    if (!selectedRole) {
        alert('请先选择身份');
        return;
    }
    
    // 检查是否是切换身份
    const currentRole = localStorage.getItem('userRole');
    const isSwitching = currentRole && currentRole !== selectedRole;
    
    // 显示加载状态
    const btn = this;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>处理中...</span>';
    btn.disabled = true;
    
    // 模拟保存身份信息
    setTimeout(function() {
        // 在实际应用中，这里应该调用API保存用户身份
        const roleName = selectedRole === 'tenant' ? '租客' : '房东';
        const oldRoleName = currentRole === 'tenant' ? '租客' : (currentRole === 'landlord' ? '房东' : '');
        
        // 保存到本地存储（实际应用中应该保存到服务器）
        localStorage.setItem('userRole', selectedRole);
        localStorage.setItem('userRoleName', roleName);
        
        // 标记已完成首次登录和身份选择
        localStorage.setItem('isFirstLogin', 'true');
        
        // 显示成功提示
        if (isSwitching) {
            alert('身份切换成功！\n已从' + oldRoleName + '切换为' + roleName);
        } else {
            alert('身份选择成功！\n您已选择：' + roleName);
        }
        
        // 跳转到首页
        window.location.href = '../home/index.html';
    }, 1000);
});

// 返回按钮点击事件
document.getElementById('backBtn').addEventListener('click', function() {
    // 返回登录页面
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = '../login/index.html';
    }
});

// 更新页面标题
function updatePageTitle() {
    const savedRole = localStorage.getItem('userRole');
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');
    
    if (savedRole) {
        // 已选择过身份，显示切换身份
        pageTitle.textContent = '切换身份';
        pageSubtitle.textContent = '选择新的身份，可在个人中心再次修改';
    } else {
        // 首次选择身份
        pageTitle.textContent = '请选择您的身份';
        pageSubtitle.textContent = '选择后可在个人中心修改';
    }
}

// 页面加载完成后的初始化
window.addEventListener('load', function() {
    console.log('身份选择页面加载完成');
    
    // 更新页面标题
    updatePageTitle();
    
    // 检查是否已经选择过身份，如果有则默认选中
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
        // 如果已经选择过身份，默认选中当前身份
        if (savedRole === 'tenant') {
            selectRole('tenant', tenantCard);
        } else if (savedRole === 'landlord') {
            selectRole('landlord', landlordCard);
        }
    }
});

