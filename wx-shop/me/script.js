// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadUserData();
});

// 初始化事件监听
function initEventListeners() {
    // 使用事件委托，确保所有点击事件都能正确绑定
    document.addEventListener('click', function(e) {
        // 检查是否是菜单项或九宫格项目
        const menuTarget = e.target.closest('.menu-item');
        const gridTarget = e.target.closest('.grid-item');
        const target = menuTarget || gridTarget;
        
        if (!target) return;
        
        const itemId = target.id;
        
        switch(itemId) {
            case 'messagesItem':
                e.preventDefault();
                e.stopPropagation();
                window.location.href = '../visit-records/index.html';
                break;
            case 'myHousesItem':
                e.preventDefault();
                e.stopPropagation();
                window.location.href = '../contact-records/index.html';
                break;
            case 'storeWalletItem':
                e.preventDefault();
                e.stopPropagation();
                window.location.href = '../wallet/index.html';
                break;
            case 'storeNameItem':
                e.preventDefault();
                e.stopPropagation();
                window.location.href = '../store-info/index.html';
                break;
            case 'helpItem':
                e.preventDefault();
                e.stopPropagation();
                alert('帮助中心\n\n跳转到帮助中心');
                break;
            case 'settingsItem':
                e.preventDefault();
                e.stopPropagation();
                alert('设置\n\n跳转到设置页面');
                break;
        }
    });
    
    // 底部导航
    const homeNav = document.getElementById('homeNav');
    if (homeNav) {
        homeNav.addEventListener('click', function() {
            window.location.href = '../home/index.html';
        });
    }
    
    const meNav = document.getElementById('meNav');
    if (meNav) {
        meNav.addEventListener('click', function() {
            // 已在"我的"页面，无需操作
        });
    }
    
    // 编辑资料
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            window.location.href = '../edit-profile/index.html';
        });
    }
    
    // 用户信息卡片点击（跳转到登录）
    const userCard = document.querySelector('.user-card');
    if (userCard) {
        userCard.addEventListener('click', function(e) {
            // 如果点击的是编辑按钮，不处理
            if (e.target.closest('.edit-btn')) {
                return;
            }
            
            // 检查是否已登录
            const loginStatus = localStorage.getItem('shopLoginStatus');
            if (loginStatus !== 'loggedIn') {
                window.location.href = '../login/index.html';
            }
        });
        
        // 添加点击样式提示
        userCard.style.cursor = 'pointer';
    }
    
}

// 加载用户数据
function loadUserData() {
    // 从localStorage加载用户信息
    const userName = localStorage.getItem('shopUserName') || '商家用户';
    const storeName = localStorage.getItem('storeName') || '我的门店';
    const storeStatus = localStorage.getItem('storeStatus') || '正常营业';
    
    // 获取联系记录数量
    const contactRecords = JSON.parse(localStorage.getItem('shopContactRecords') || '[]');
    const housesCount = contactRecords.length;
    
    const shopPoints = parseInt(localStorage.getItem('shopPoints')) || 0;
    
    // 更新UI
    document.getElementById('userName').textContent = userName;
    document.getElementById('userStore').textContent = storeName;
    
    // 联系记录数量（如果元素存在）
    const housesCountEl = document.getElementById('housesCount');
    if (housesCountEl) {
        if (housesCount > 0) {
            housesCountEl.textContent = housesCount;
            housesCountEl.style.display = 'block';
        } else {
            housesCountEl.style.display = 'none';
        }
    }
    
    // 如果没有数据，设置默认值用于演示
    if (shopPoints === 0) {
        setDefaultData();
    }
}

// 设置默认数据（用于演示）
function setDefaultData() {
    localStorage.setItem('shopUserName', '张先生');
    localStorage.setItem('storeName', '张先生的租房门店');
    localStorage.setItem('storeStatus', '正常营业');
    localStorage.setItem('shopPoints', '10');
    localStorage.setItem('storeId', 'store_001');
    
    // 重新加载
    loadUserData();
}

