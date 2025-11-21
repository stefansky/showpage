// 门店数据
let storeData = {
    storeName: '我的门店',
    managerName: '张先生',
    managerPhone: '13800138001',
    storeAddress: '武汉市洪山区光谷广场',
    locationDetail: '湖北省武汉市洪山区光谷广场A座101',
    openTime: '2024-01-01',
    status: 'open', // 'open' 或 'closed'
    totalHouses: 0,
    activeHouses: 0,
    totalTenants: 0,
    monthEarnings: 0
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadStoreData();
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
    
    // 编辑按钮
    document.getElementById('editBtn').addEventListener('click', function() {
        showEditModal();
    });
    
    // 查看地图按钮
    document.getElementById('viewMapBtn').addEventListener('click', function() {
        alert('查看地图\n\n跳转到地图页面，显示门店位置');
        // 实际应用中可以跳转到第三方地图应用或打开地图页面
        // window.location.href = 'https://uri.amap.com/marker?position=' + lng + ',' + lat + '&name=' + encodeURIComponent(storeData.storeName);
    });
    
    // 切换营业状态
    document.getElementById('switchStatusBtn').addEventListener('click', function() {
        toggleStoreStatus();
    });
    
    // 编辑弹窗
    document.getElementById('closeModal').addEventListener('click', function() {
        hideEditModal();
    });
    
    document.getElementById('cancelEdit').addEventListener('click', function() {
        hideEditModal();
    });
    
    document.getElementById('confirmEdit').addEventListener('click', function() {
        saveStoreInfo();
    });
    
    // 点击弹窗背景关闭
    document.getElementById('editModal').addEventListener('click', function(e) {
        if (e.target === this) {
            hideEditModal();
        }
    });
}

// 加载门店数据
function loadStoreData() {
    // 从localStorage加载数据
    const savedStoreName = localStorage.getItem('storeName');
    const savedManagerName = localStorage.getItem('shopUserName');
    const savedManagerPhone = localStorage.getItem('shopUserPhone');
    const savedStoreAddress = localStorage.getItem('storeAddress');
    const savedLocationDetail = localStorage.getItem('storeLocationDetail');
    const savedOpenTime = localStorage.getItem('storeOpenTime');
    const savedStatus = localStorage.getItem('storeStatus');
    
    if (savedStoreName) storeData.storeName = savedStoreName;
    if (savedManagerName) storeData.managerName = savedManagerName;
    if (savedManagerPhone) storeData.managerPhone = savedManagerPhone;
    if (savedStoreAddress) storeData.storeAddress = savedStoreAddress;
    if (savedLocationDetail) storeData.locationDetail = savedLocationDetail;
    if (savedOpenTime) storeData.openTime = savedOpenTime;
    if (savedStatus) storeData.status = savedStatus === '暂停营业' ? 'closed' : 'open';
    
    // 如果没有数据，设置默认值
    if (!savedStoreName && !savedManagerName) {
        setDefaultData();
    }
    
    // 加载统计数据
    loadStatistics();
}

// 设置默认数据
function setDefaultData() {
    storeData.storeName = '张先生的租房门店';
    storeData.managerName = '张先生';
    storeData.managerPhone = '13800138001';
    storeData.storeAddress = '武汉市洪山区光谷广场';
    storeData.locationDetail = '湖北省武汉市洪山区光谷广场A座101';
    storeData.openTime = '2024-01-01';
    storeData.status = 'open';
    
    // 保存到localStorage
    saveStoreDataToStorage();
}

// 加载统计数据
function loadStatistics() {
    // 房源统计
    const houses = JSON.parse(localStorage.getItem('storeHouses') || '[]');
    storeData.totalHouses = houses.length;
    storeData.activeHouses = houses.filter(function(house) {
        return house.status === 'active' || house.status === 'pending';
    }).length;
    
    // 租客统计（从联系记录中获取）
    const contactRecords = JSON.parse(localStorage.getItem('contactRecords') || '[]');
    const tenantIds = new Set();
    contactRecords.forEach(function(record) {
        if (record.type === 'tenant') {
            tenantIds.add(record.targetId);
        }
    });
    storeData.totalTenants = tenantIds.size;
    
    // 本月收益（从运营数据中获取）
    const monthEarnings = parseFloat(localStorage.getItem('monthEarnings')) || 0;
    storeData.monthEarnings = monthEarnings;
}

// 更新UI
function updateUI() {
    // 更新基本信息
    document.getElementById('storeName').textContent = storeData.storeName;
    document.getElementById('managerName').textContent = storeData.managerName;
    document.getElementById('managerPhone').textContent = storeData.managerPhone;
    document.getElementById('openTime').textContent = storeData.openTime;
    
    // 更新位置信息
    document.getElementById('storeAddress').textContent = storeData.storeAddress;
    document.getElementById('locationDetail').textContent = storeData.locationDetail;
    
    // 更新状态
    updateStatusDisplay();
    
    // 更新统计数据
    document.getElementById('totalHouses').textContent = storeData.totalHouses;
    document.getElementById('activeHouses').textContent = storeData.activeHouses;
    document.getElementById('totalTenants').textContent = storeData.totalTenants;
    document.getElementById('monthEarnings').textContent = '¥' + storeData.monthEarnings.toFixed(2);
}

// 更新状态显示
function updateStatusDisplay() {
    const statusValue = document.getElementById('storeStatus');
    const statusBadge = document.getElementById('statusBadge');
    const statusText = document.getElementById('statusText');
    const switchStatusBtn = document.getElementById('switchStatusBtn');
    const switchStatusText = document.getElementById('switchStatusText');
    
    if (storeData.status === 'open') {
        statusValue.textContent = '正常营业';
        statusText.textContent = '营业中';
        statusBadge.classList.remove('closed');
        switchStatusText.textContent = '暂停营业';
        switchStatusBtn.classList.remove('warning');
        switchStatusBtn.classList.add('primary');
    } else {
        statusValue.textContent = '暂停营业';
        statusText.textContent = '已暂停';
        statusBadge.classList.add('closed');
        switchStatusText.textContent = '恢复营业';
        switchStatusBtn.classList.remove('primary');
        switchStatusBtn.classList.add('warning');
    }
}

// 切换营业状态
function toggleStoreStatus() {
    const newStatus = storeData.status === 'open' ? 'closed' : 'open';
    const action = newStatus === 'open' ? '恢复营业' : '暂停营业';
    
    if (confirm('确定要' + action + '吗？')) {
        storeData.status = newStatus;
        const statusText = newStatus === 'open' ? '正常营业' : '暂停营业';
        localStorage.setItem('storeStatus', statusText);
        
        updateStatusDisplay();
        
        alert(action + '成功！');
    }
}

// 显示编辑弹窗
function showEditModal() {
    // 填充表单
    document.getElementById('editStoreName').value = storeData.storeName;
    document.getElementById('editManagerName').value = storeData.managerName;
    document.getElementById('editManagerPhone').value = storeData.managerPhone;
    document.getElementById('editStoreAddress').value = storeData.locationDetail;
    
    // 显示弹窗
    document.getElementById('editModal').classList.add('show');
}

// 隐藏编辑弹窗
function hideEditModal() {
    document.getElementById('editModal').classList.remove('show');
}

// 保存门店信息
function saveStoreInfo() {
    const storeName = document.getElementById('editStoreName').value.trim();
    const managerName = document.getElementById('editManagerName').value.trim();
    const managerPhone = document.getElementById('editManagerPhone').value.trim();
    const storeAddress = document.getElementById('editStoreAddress').value.trim();
    
    // 验证
    if (!storeName) {
        alert('请输入门店名称');
        return;
    }
    
    if (!managerName) {
        alert('请输入店长姓名');
        return;
    }
    
    if (!managerPhone) {
        alert('请输入店长手机号');
        return;
    }
    
    // 简单的手机号验证
    if (!/^1[3-9]\d{9}$/.test(managerPhone)) {
        alert('请输入正确的手机号码');
        return;
    }
    
    if (!storeAddress) {
        alert('请输入门店地址');
        return;
    }
    
    // 更新数据
    storeData.storeName = storeName;
    storeData.managerName = managerName;
    storeData.managerPhone = managerPhone;
    storeData.locationDetail = storeAddress;
    
    // 保存到localStorage
    saveStoreDataToStorage();
    
    // 更新UI
    updateUI();
    
    // 关闭弹窗
    hideEditModal();
    
    alert('保存成功！');
}

// 保存数据到localStorage
function saveStoreDataToStorage() {
    localStorage.setItem('storeName', storeData.storeName);
    localStorage.setItem('shopUserName', storeData.managerName);
    localStorage.setItem('shopUserPhone', storeData.managerPhone);
    localStorage.setItem('storeLocationDetail', storeData.locationDetail);
    localStorage.setItem('storeAddress', storeData.storeAddress);
    localStorage.setItem('storeOpenTime', storeData.openTime);
}

