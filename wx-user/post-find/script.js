// 全局变量
let locations = []; // 存储位置列表，最多3个
let selectedHouseType = 'unlimited';
let selectedMoveInTime = '';
let selectedRentalType = 'unlimited';
let currentMapMarker = null; // 当前地图上的标记
let currentLocationData = null; // 当前选择的位置数据
let isEditMode = false; // 是否为编辑模式

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    checkEditMode();
    loadFormData();
    updateLocationList();
    updateAddButtonState();
    updateSubmitButton();
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

    // 添加位置按钮
    document.getElementById('addLocationBtn').addEventListener('click', function() {
        if (locations.length < 3) {
            openLocationModal();
        }
    });

    // 租房类型按钮
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedRentalType = this.dataset.type;
        });
    });

    // 户型选择
    document.getElementById('houseTypeField').addEventListener('click', function() {
        toggleDropdown('houseTypeDropdown');
    });

    // 入住时间选择
    document.getElementById('moveInTimeField').addEventListener('click', function() {
        toggleDropdown('moveInTimeDropdown');
    });

    // 下拉菜单项点击
    document.querySelectorAll('#houseTypeDropdown .dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            selectedHouseType = this.dataset.value;
            document.getElementById('houseTypeText').textContent = this.textContent;
            document.getElementById('houseTypeText').classList.remove('placeholder');
            closeDropdown('houseTypeDropdown');
        });
    });

    document.querySelectorAll('#moveInTimeDropdown .dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            selectedMoveInTime = this.dataset.value;
            document.getElementById('moveInTimeText').textContent = this.textContent;
            document.getElementById('moveInTimeText').classList.remove('placeholder');
            closeDropdown('moveInTimeDropdown');
        });
    });

    // 位置选择相关
    document.getElementById('closeLocationModal').addEventListener('click', closeLocationModal);
    document.getElementById('locationModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeLocationModal();
        }
    });
    document.getElementById('confirmLocationBtn').addEventListener('click', confirmLocation);
    document.getElementById('locationMap').addEventListener('click', handleMapClick);

    // 提交按钮
    document.getElementById('submitBtn').addEventListener('click', handleSubmit);

    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.select-field') && !e.target.closest('.dropdown-menu')) {
            closeAllDropdowns();
        }
    });
}

// 打开位置选择弹窗
function openLocationModal() {
    const modal = document.getElementById('locationModal');
    modal.classList.add('show');
    currentLocationData = null;
    currentMapMarker = null;
    document.getElementById('locationNameInput').value = '';
    document.getElementById('coordinateDisplay').textContent = '点击地图选择';
    // 清除之前的标记
    const map = document.getElementById('locationMap');
    const existingMarker = map.querySelector('.map-marker');
    if (existingMarker) {
        existingMarker.remove();
    }
}

// 关闭位置选择弹窗
function closeLocationModal() {
    document.getElementById('locationModal').classList.remove('show');
}

// 处理地图点击
function handleMapClick(e) {
    const map = document.getElementById('locationMap');
    const rect = map.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 生成模拟坐标（基于点击位置）
    const lat = (30.5 + (y / rect.height) * 0.1).toFixed(6);
    const lng = (114.3 + (x / rect.width) * 0.1).toFixed(6);
    
    // 移除之前的标记
    if (currentMapMarker) {
        currentMapMarker.remove();
    }
    
    // 创建新标记
    const marker = document.createElement('div');
    marker.className = 'map-marker';
    marker.style.left = x + 'px';
    marker.style.top = y + 'px';
    marker.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
    map.appendChild(marker);
    currentMapMarker = marker;
    
    // 保存坐标数据
    currentLocationData = {
        lat: lat,
        lng: lng,
        x: x,
        y: y
    };
    
    document.getElementById('coordinateDisplay').textContent = `${lat}, ${lng}`;
}

// 确认位置
function confirmLocation() {
    const locationName = document.getElementById('locationNameInput').value.trim();
    
    if (!currentLocationData) {
        alert('请先在地图上选择位置');
        return;
    }
    
    if (!locationName) {
        alert('请输入位置名称');
        return;
    }
    
    // 添加到位置列表
    locations.push({
        name: locationName,
        lat: currentLocationData.lat,
        lng: currentLocationData.lng,
        coord: `${currentLocationData.lat}, ${currentLocationData.lng}`
    });
    
    updateLocationList();
    updateAddButtonState();
    closeLocationModal();
}

// 更新位置列表显示
function updateLocationList() {
    const locationList = document.getElementById('locationList');
    locationList.innerHTML = '';
    
    locations.forEach((location, index) => {
        const item = document.createElement('div');
        item.className = 'location-item';
        item.innerHTML = `
            <div class="location-icon">
                <i class="fas fa-map-marker-alt"></i>
            </div>
            <div style="flex: 1;">
                <div class="location-text">${location.name}</div>
                <div class="location-coord">坐标: ${location.coord}</div>
            </div>
            <button class="location-remove" data-index="${index}" type="button">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // 添加删除事件
        item.querySelector('.location-remove').addEventListener('click', function() {
            const idx = parseInt(this.dataset.index);
            locations.splice(idx, 1);
            updateLocationList();
            updateAddButtonState();
        });
        
        locationList.appendChild(item);
    });
}

// 更新添加按钮状态
function updateAddButtonState() {
    const addBtn = document.getElementById('addLocationBtn');
    if (locations.length >= 3) {
        addBtn.disabled = true;
        addBtn.innerHTML = '<span style="font-size: 14px;">最多添加3个位置</span>';
    } else {
        addBtn.disabled = false;
        addBtn.innerHTML = '<i class="fas fa-plus"></i>';
    }
}

// 切换下拉菜单
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const isShowing = dropdown.classList.contains('show');
    
    closeAllDropdowns();
    
    if (!isShowing) {
        dropdown.classList.add('show');
    }
}

// 关闭下拉菜单
function closeDropdown(dropdownId) {
    document.getElementById(dropdownId).classList.remove('show');
}

// 关闭所有下拉菜单
function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
    });
}

// 验证表单
function validateForm() {
    if (locations.length === 0) {
        alert('请至少添加一个期望租房位置');
        return false;
    }
    
    const phone = document.getElementById('phoneInput').value.trim();
    if (!phone) {
        alert('请输入联系方式');
        return false;
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
        alert('请输入正确的手机号码');
        return false;
    }
    
    return true;
}

// 检查是否为编辑模式
function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    // 检查localStorage中是否有已发布的找房信息
    const savedFindRequest = localStorage.getItem('currentFindRequest');
    if (savedFindRequest || editId) {
        isEditMode = true;
    }
}

// 加载表单数据（编辑模式或默认值）
function loadFormData() {
    // 先检查是否有待发布的临时数据（从实名认证页面返回）
    const pendingFindRequest = localStorage.getItem('pendingFindRequest');
    
    if (pendingFindRequest) {
        // 从实名认证页面返回，恢复待发布的表单数据
        try {
            const data = JSON.parse(pendingFindRequest);
            locations = data.locations || [];
            selectedRentalType = data.rentalType || 'unlimited';
            selectedHouseType = data.houseType || 'unlimited';
            selectedMoveInTime = data.moveInTime || '';
            isEditMode = data.isEditMode || false;
            
            // 恢复表单显示
            document.getElementById('phoneInput').value = data.phone || '';
            
            // 恢复租房类型
            document.querySelectorAll('.type-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.type === selectedRentalType) {
                    btn.classList.add('active');
                }
            });
            
            // 恢复户型
            if (selectedHouseType !== 'unlimited') {
                const houseTypeText = document.getElementById('houseTypeText');
                houseTypeText.textContent = selectedHouseType;
                houseTypeText.classList.remove('placeholder');
            }
            
            // 恢复入住时间
            if (selectedMoveInTime) {
                const moveInTimeText = document.getElementById('moveInTimeText');
                moveInTimeText.textContent = selectedMoveInTime;
                moveInTimeText.classList.remove('placeholder');
            }
            
            // 更新位置列表和按钮状态
            updateLocationList();
            updateAddButtonState();
            updateSubmitButton();
            
            // 检查是否已实名认证，如果已认证则自动提交
            if (checkRealNameAuth()) {
                // 延迟一下，让用户看到表单已恢复
                setTimeout(function() {
                    if (confirm('实名认证已完成，是否立即发布找房？')) {
                        doSubmit();
                    }
                }, 500);
            }
            return;
        } catch (e) {
            console.error('加载待发布数据失败:', e);
        }
    }
    
    const savedFindRequest = localStorage.getItem('currentFindRequest');
    
    if (savedFindRequest && isEditMode) {
        // 编辑模式：加载已保存的数据
        try {
            const data = JSON.parse(savedFindRequest);
            locations = data.locations || [];
            selectedRentalType = data.rentalType || 'unlimited';
            selectedHouseType = data.houseType || 'unlimited';
            selectedMoveInTime = data.moveInTime || '';
            
            // 恢复表单显示
            document.getElementById('phoneInput').value = data.phone || '';
            
            // 恢复租房类型
            document.querySelectorAll('.type-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.type === selectedRentalType) {
                    btn.classList.add('active');
                }
            });
            
            // 恢复户型
            if (selectedHouseType !== 'unlimited') {
                const houseTypeText = document.getElementById('houseTypeText');
                houseTypeText.textContent = selectedHouseType;
                houseTypeText.classList.remove('placeholder');
            }
            
            // 恢复入住时间
            if (selectedMoveInTime) {
                const moveInTimeText = document.getElementById('moveInTimeText');
                moveInTimeText.textContent = selectedMoveInTime;
                moveInTimeText.classList.remove('placeholder');
            }
        } catch (e) {
            console.error('加载数据失败:', e);
            setDefaultValues();
        }
    } else {
        // 新发布：设置默认值
        setDefaultValues();
    }
}

// 设置默认值
function setDefaultValues() {
    // 默认添加一个位置（光谷广场）
    locations = [{
        name: '光谷广场',
        lat: '30.581084',
        lng: '114.316200',
        coord: '30.581084, 114.316200'
    }];
    
    // 默认租房类型：整租
    selectedRentalType = 'entire';
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.type === 'entire') {
            btn.classList.add('active');
        }
    });
    
    // 默认户型：2室1厅
    selectedHouseType = '2室1厅';
    const houseTypeText = document.getElementById('houseTypeText');
    houseTypeText.textContent = '2室1厅';
    houseTypeText.classList.remove('placeholder');
    
    // 默认入住时间：1个月内
    selectedMoveInTime = '1个月内';
    const moveInTimeText = document.getElementById('moveInTimeText');
    moveInTimeText.textContent = '1个月内';
    moveInTimeText.classList.remove('placeholder');
    
    // 默认手机号（从用户信息获取，如果没有则保留HTML中的默认值）
    const phoneInput = document.getElementById('phoneInput');
    const userPhone = localStorage.getItem('userPhone');
    // 只有当localStorage中有用户手机号时才设置，否则保留HTML中的默认值
    if (userPhone) {
        phoneInput.value = userPhone;
    }
    // 如果input已经有值（来自HTML默认值），就不覆盖
}

// 更新提交按钮文字
function updateSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('span');
    
    if (isEditMode) {
        btnText.textContent = '更新找房';
    } else {
        btnText.textContent = '发布找房';
    }
}

// 检查实名认证状态
function checkRealNameAuth() {
    const authStatus = localStorage.getItem('realNameAuthStatus');
    // 只有 verified 状态才认为已认证
    return authStatus === 'verified';
}

// 处理提交
function handleSubmit() {
    if (!validateForm()) {
        return;
    }
    
    // 检查实名认证状态
    if (!checkRealNameAuth()) {
        // 未实名认证，保存当前表单数据，跳转到实名认证页面
        const formData = {
            locations: locations,
            rentalType: selectedRentalType,
            houseType: selectedHouseType,
            moveInTime: selectedMoveInTime,
            phone: document.getElementById('phoneInput').value.trim(),
            isEditMode: isEditMode
        };
        
        // 保存待发布的表单数据
        localStorage.setItem('pendingFindRequest', JSON.stringify(formData));
        
        // 跳转到实名认证页面，并传递返回参数
        if (confirm('发布找房需要先完成实名认证\n\n是否前往实名认证？')) {
            window.location.href = '../real-name-auth/index.html?return=post-find';
        }
        return;
    }
    
    // 已实名认证，继续发布流程
    doSubmit();
}

// 执行提交
function doSubmit() {
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    const loadingText = isEditMode ? '更新中...' : '发布中...';
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>' + loadingText + '</span>';
    
    // 构建提交数据
    const formData = {
        id: Date.now(),
        locations: locations,
        rentalType: selectedRentalType,
        houseType: selectedHouseType,
        moveInTime: selectedMoveInTime,
        phone: document.getElementById('phoneInput').value.trim(),
        createTime: new Date().toLocaleString('zh-CN'),
        status: 'published'
    };
    
    // 保存到localStorage
    localStorage.setItem('currentFindRequest', JSON.stringify(formData));
    
    // 同时保存到我的找房列表
    const myFindRequests = JSON.parse(localStorage.getItem('myFindRequests') || '[]');
    const existingIndex = myFindRequests.findIndex(item => item.id === formData.id);
    
    if (existingIndex >= 0) {
        // 更新现有记录
        myFindRequests[existingIndex] = formData;
    } else {
        // 添加新记录
        myFindRequests.unshift(formData);
    }
    
    localStorage.setItem('myFindRequests', JSON.stringify(myFindRequests));
    
    // 清除待发布的临时数据
    localStorage.removeItem('pendingFindRequest');
    
    // 模拟提交
    setTimeout(function() {
        const successText = isEditMode ? '更新成功！' : '发布成功！';
        alert(successText + '\n\n您的找房需求已' + (isEditMode ? '更新' : '发布') + '，我们会尽快为您匹配房源。');
        
        // 跳转到首页
        window.location.href = '../home/index.html';
    }, 1500);
}

