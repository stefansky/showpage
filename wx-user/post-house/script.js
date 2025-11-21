// 全局变量
let currentStep = 1; // 当前步骤
let photos = []; // 存储照片（最多9张）
let currentMapMarker = null;
let currentLocationData = null;

// 草稿数据键名
const DRAFT_KEY = 'house_post_draft';

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否为编辑模式
    checkEditMode();
    loadDraft();
    // 检查是否有待发布的临时数据（从实名认证页面返回）
    checkPendingPost();
    // 如果不是编辑模式且没有草稿数据，设置默认值
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (!editId && !localStorage.getItem(DRAFT_KEY)) {
        setDefaultValues();
    }
    initEventListeners();
    updateStepIndicator();
    updatePhotoGrid();
});

// 检查是否为编辑模式
function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
        // 编辑模式：从我的房源列表中加载数据
        loadHouseForEdit(editId);
    }
}

// 加载房源数据用于编辑
function loadHouseForEdit(houseId) {
    const myHouses = JSON.parse(localStorage.getItem('myHouses') || '[]');
    const house = myHouses.find(function(h) {
        return h.id == houseId;
    });
    
    if (!house) {
        alert('房源不存在');
        window.location.href = '../home/index.html';
        return;
    }
    
    // 恢复第一步数据
    document.getElementById('communityNameInput').value = house.communityName || '';
    document.getElementById('rentalTypeText').textContent = house.rentalType || '整租';
    document.getElementById('rentalTypeText').classList.remove('placeholder');
    document.getElementById('houseTypeText').textContent = house.houseType || '2室1厅';
    document.getElementById('houseTypeText').classList.remove('placeholder');
    document.getElementById('areaInput').value = house.area || '';
    document.getElementById('floorInput').value = house.floor || '';
    document.getElementById('rentInput').value = house.rent || '';
    
    // 恢复第二步数据
    document.getElementById('locationText').textContent = house.location || '光谷广场';
    document.getElementById('locationText').classList.remove('placeholder');
    document.getElementById('moveInTimeText').textContent = house.moveInTime || '1个月内';
    document.getElementById('moveInTimeText').classList.remove('placeholder');
    document.getElementById('phoneInput').value = house.phone || '';
    
    // 恢复照片
    if (house.photos && house.photos.length > 0) {
        photos = house.photos;
        updatePhotoGrid();
    }
    
    // 设置位置数据
    if (house.location) {
        currentLocationData = {
            name: house.location,
            lat: '30.581084',
            lng: '114.316200'
        };
    }
    
    // 保存编辑的房源ID
    window.currentEditHouseId = houseId;
}

// 检查待发布的临时数据
function checkPendingPost() {
    const pendingHousePost = localStorage.getItem('pendingHousePost');
    
    if (pendingHousePost) {
        // 从实名认证页面返回，恢复待发布的表单数据
        try {
            const data = JSON.parse(pendingHousePost);
            
            // 恢复第一步数据
            document.getElementById('communityNameInput').value = data.communityName || '';
            document.getElementById('rentalTypeText').textContent = data.rentalType || '整租';
            document.getElementById('rentalTypeText').classList.remove('placeholder');
            document.getElementById('houseTypeText').textContent = data.houseType || '2室1厅';
            document.getElementById('houseTypeText').classList.remove('placeholder');
            document.getElementById('areaInput').value = data.area || '';
            document.getElementById('floorInput').value = data.floor || '';
            document.getElementById('rentInput').value = data.rent || '';
            
            // 恢复第二步数据
            document.getElementById('locationText').textContent = data.location || '光谷广场';
            document.getElementById('locationText').classList.remove('placeholder');
            document.getElementById('moveInTimeText').textContent = data.moveInTime || '1个月内';
            document.getElementById('moveInTimeText').classList.remove('placeholder');
            document.getElementById('phoneInput').value = data.phone || '';
            
            // 恢复照片
            if (data.photos && data.photos.length > 0) {
                photos = data.photos;
                updatePhotoGrid();
            }
            
            // 切换到第二步
            goToStep(2);
            
            // 检查是否已实名认证，如果已认证则自动提交
            if (checkRealNameAuth()) {
                // 延迟一下，让用户看到表单已恢复
                setTimeout(function() {
                    if (confirm('实名认证已完成，是否立即发布房源？')) {
                        doSubmit();
                    }
                }, 500);
            }
        } catch (e) {
            console.error('加载待发布数据失败:', e);
        }
    }
}

// 初始化事件监听
function initEventListeners() {
    // 返回按钮
    document.getElementById('backBtn').addEventListener('click', function() {
        if (currentStep === 1) {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = '../home/index.html';
            }
        } else {
            goToStep(1);
        }
    });

    // 添加照片按钮
    document.getElementById('addPhotoBtn').addEventListener('click', function() {
        if (photos.length < 9) {
            triggerPhotoUpload();
        }
    });

    // 位置选择
    document.getElementById('locationField').addEventListener('click', openLocationModal);
    document.getElementById('addLocationIcon').addEventListener('click', function(e) {
        e.stopPropagation();
        openLocationModal();
    });

    // 租房类型选择
    document.getElementById('rentalTypeField').addEventListener('click', function() {
        toggleDropdown('rentalTypeDropdown');
    });

    // 户型选择
    document.getElementById('houseTypeField').addEventListener('click', function() {
        toggleDropdown('houseTypeDropdown');
    });

    // 可入住时间选择
    document.getElementById('moveInTimeField').addEventListener('click', function() {
        toggleDropdown('moveInTimeDropdown');
    });

    // 下拉菜单项点击
    document.querySelectorAll('#rentalTypeDropdown .dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            document.getElementById('rentalTypeText').textContent = this.textContent;
            document.getElementById('rentalTypeText').classList.remove('placeholder');
            saveDraft();
            closeDropdown('rentalTypeDropdown');
        });
    });

    document.querySelectorAll('#houseTypeDropdown .dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            document.getElementById('houseTypeText').textContent = this.textContent;
            document.getElementById('houseTypeText').classList.remove('placeholder');
            saveDraft();
            closeDropdown('houseTypeDropdown');
        });
    });

    document.querySelectorAll('#moveInTimeDropdown .dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            document.getElementById('moveInTimeText').textContent = this.textContent;
            document.getElementById('moveInTimeText').classList.remove('placeholder');
            saveDraft();
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

    // 输入框变化时保存草稿
    document.getElementById('communityNameInput').addEventListener('input', saveDraft);
    document.getElementById('areaInput').addEventListener('input', saveDraft);
    document.getElementById('floorInput').addEventListener('input', saveDraft);
    document.getElementById('rentInput').addEventListener('input', saveDraft);
    document.getElementById('phoneInput').addEventListener('input', saveDraft);

    // 保存草稿按钮
    document.getElementById('saveDraftBtn').addEventListener('click', function() {
        saveDraft();
        alert('草稿已保存');
    });

    // 下一步按钮
    document.getElementById('nextBtn').addEventListener('click', function() {
        if (currentStep === 1) {
            if (validateStep1()) {
                goToStep(2);
            }
        }
    });

    // 提交按钮
    document.getElementById('submitBtn').addEventListener('click', handleSubmit);

    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.select-field') && !e.target.closest('.dropdown-menu')) {
            closeAllDropdowns();
        }
    });
}

// 切换到指定步骤
function goToStep(step) {
    if (step < 1 || step > 2) return;
    
    currentStep = step;
    
    // 隐藏所有步骤内容
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 显示当前步骤内容
    document.getElementById(`step${step}Content`).classList.add('active');
    
    // 更新按钮显示
    if (step === 1) {
        document.getElementById('nextBtn').style.display = 'flex';
        document.getElementById('submitBtn').style.display = 'none';
    } else {
        document.getElementById('nextBtn').style.display = 'none';
        document.getElementById('submitBtn').style.display = 'flex';
    }
    
    // 更新步骤指示器
    updateStepIndicator();
}

// 更新步骤指示器
function updateStepIndicator() {
    const step1 = document.querySelector('.step-item[data-step="1"]');
    const step2 = document.querySelector('.step-item[data-step="2"]');
    const progress = document.getElementById('stepProgress');
    
    // 重置所有步骤状态
    step1.classList.remove('active', 'completed');
    step2.classList.remove('active', 'completed');
    
    if (currentStep === 1) {
        step1.classList.add('active');
        progress.style.width = '0%';
        progress.classList.remove('completed');
    } else if (currentStep === 2) {
        step1.classList.add('completed');
        step2.classList.add('active');
        progress.style.width = '100%';
        progress.classList.add('completed');
    }
}

// 触发照片上传
function triggerPhotoUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = function(e) {
        const files = Array.from(e.target.files);
        const remaining = 9 - photos.length;
        const filesToAdd = files.slice(0, remaining);
        
        filesToAdd.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                photos.push({
                    file: file,
                    url: e.target.result
                });
                updatePhotoGrid();
                saveDraft();
            };
            reader.readAsDataURL(file);
        });
    };
    input.click();
}

// 更新照片网格
function updatePhotoGrid() {
    const photoGrid = document.getElementById('photoGrid');
    photoGrid.innerHTML = '';
    
    photos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'photo-item';
        item.innerHTML = `
            <img src="${photo.url}" alt="房源照片">
            <button class="photo-remove" data-index="${index}" type="button">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        item.querySelector('.photo-remove').addEventListener('click', function() {
            photos.splice(index, 1);
            updatePhotoGrid();
            saveDraft();
        });
        
        photoGrid.appendChild(item);
    });
    
    // 更新添加按钮状态
    const addBtn = document.getElementById('addPhotoBtn');
    if (photos.length >= 9) {
        addBtn.disabled = true;
        addBtn.style.display = 'none';
    } else {
        addBtn.disabled = false;
        addBtn.style.display = 'block';
    }
}

// 打开位置选择弹窗
function openLocationModal() {
    const modal = document.getElementById('locationModal');
    modal.classList.add('show');
    currentLocationData = null;
    currentMapMarker = null;
    document.getElementById('locationNameInput').value = '';
    document.getElementById('coordinateDisplay').textContent = '点击地图选择';
    
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
    
    const lat = (30.5 + (y / rect.height) * 0.1).toFixed(6);
    const lng = (114.3 + (x / rect.width) * 0.1).toFixed(6);
    
    if (currentMapMarker) {
        currentMapMarker.remove();
    }
    
    const marker = document.createElement('div');
    marker.className = 'map-marker';
    marker.style.left = x + 'px';
    marker.style.top = y + 'px';
    marker.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
    map.appendChild(marker);
    currentMapMarker = marker;
    
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
    
    document.getElementById('locationText').textContent = locationName;
    document.getElementById('locationText').classList.remove('placeholder');
    saveDraft();
    closeLocationModal();
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

// 保存草稿
function saveDraft() {
    const draft = {
        currentStep: currentStep,
        // 第一步数据
        communityName: document.getElementById('communityNameInput').value,
        rentalType: document.getElementById('rentalTypeText').textContent,
        rentalTypePlaceholder: document.getElementById('rentalTypeText').classList.contains('placeholder'),
        houseType: document.getElementById('houseTypeText').textContent,
        houseTypePlaceholder: document.getElementById('houseTypeText').classList.contains('placeholder'),
        area: document.getElementById('areaInput').value,
        floor: document.getElementById('floorInput').value,
        rent: document.getElementById('rentInput').value,
        // 第二步数据
        location: document.getElementById('locationText').textContent,
        locationPlaceholder: document.getElementById('locationText').classList.contains('placeholder'),
        moveInTime: document.getElementById('moveInTimeText').textContent,
        moveInTimePlaceholder: document.getElementById('moveInTimeText').classList.contains('placeholder'),
        phone: document.getElementById('phoneInput').value,
        photos: photos.map(p => ({ url: p.url }))
    };
    
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

// 设置默认值
function setDefaultValues() {
    // 第一步默认值
    document.getElementById('communityNameInput').value = '光谷广场小区';
    document.getElementById('rentalTypeText').textContent = '整租';
    document.getElementById('rentalTypeText').classList.remove('placeholder');
    document.getElementById('houseTypeText').textContent = '2室1厅';
    document.getElementById('houseTypeText').classList.remove('placeholder');
    document.getElementById('areaInput').value = '65';
    document.getElementById('floorInput').value = '5';
    document.getElementById('rentInput').value = '2500';
    
    // 第二步默认值
    document.getElementById('locationText').textContent = '光谷广场';
    document.getElementById('locationText').classList.remove('placeholder');
    document.getElementById('moveInTimeText').textContent = '1个月内';
    document.getElementById('moveInTimeText').classList.remove('placeholder');
    
    // 手机号默认值（从用户信息获取，如果没有则使用HTML中的默认值）
    const userPhone = localStorage.getItem('userPhone');
    if (userPhone) {
        document.getElementById('phoneInput').value = userPhone;
    }
    // 如果HTML中已有默认值，就不覆盖
    
    // 设置位置数据（用于提交）
    currentLocationData = {
        name: '光谷广场',
        lat: '30.581084',
        lng: '114.316200'
    };
}

// 加载草稿
function loadDraft() {
    const draftStr = localStorage.getItem(DRAFT_KEY);
    if (!draftStr) return;
    
    try {
        const draft = JSON.parse(draftStr);
        
        // 恢复当前步骤
        if (draft.currentStep) {
            currentStep = draft.currentStep;
        }
        
        // 恢复第一步数据
        if (draft.communityName) {
            document.getElementById('communityNameInput').value = draft.communityName;
        }
        
        if (draft.rentalType && !draft.rentalTypePlaceholder) {
            document.getElementById('rentalTypeText').textContent = draft.rentalType;
            document.getElementById('rentalTypeText').classList.remove('placeholder');
        }
        
        if (draft.houseType && !draft.houseTypePlaceholder) {
            document.getElementById('houseTypeText').textContent = draft.houseType;
            document.getElementById('houseTypeText').classList.remove('placeholder');
        }
        
        if (draft.area) {
            document.getElementById('areaInput').value = draft.area;
        }
        
        if (draft.floor) {
            document.getElementById('floorInput').value = draft.floor;
        }
        
        if (draft.rent) {
            document.getElementById('rentInput').value = draft.rent;
        }
        
        // 恢复第二步数据
        if (draft.location && !draft.locationPlaceholder) {
            document.getElementById('locationText').textContent = draft.location;
            document.getElementById('locationText').classList.remove('placeholder');
        }
        
        if (draft.moveInTime && !draft.moveInTimePlaceholder) {
            document.getElementById('moveInTimeText').textContent = draft.moveInTime;
            document.getElementById('moveInTimeText').classList.remove('placeholder');
        }
        
        if (draft.phone) {
            document.getElementById('phoneInput').value = draft.phone;
        }
        
        if (draft.photos && draft.photos.length > 0) {
            photos = draft.photos.map(p => ({ url: p.url }));
            updatePhotoGrid();
        }
        
        // 切换到保存的步骤
        goToStep(currentStep);
    } catch (e) {
        console.error('加载草稿失败:', e);
    }
}

// 验证第一步表单
function validateStep1() {
    const communityName = document.getElementById('communityNameInput').value.trim();
    if (!communityName) {
        alert('请输入小区名称');
        return false;
    }
    
    const rentalTypeText = document.getElementById('rentalTypeText');
    if (rentalTypeText.classList.contains('placeholder')) {
        alert('请选择租房类型');
        return false;
    }
    
    const houseTypeText = document.getElementById('houseTypeText');
    if (houseTypeText.classList.contains('placeholder')) {
        alert('请选择户型');
        return false;
    }
    
    return true;
}

// 验证第二步表单
function validateStep2() {
    // 去掉图片验证，演示交互不需要上传真实图片
    
    const locationText = document.getElementById('locationText');
    if (locationText.classList.contains('placeholder')) {
        alert('请选择房源位置');
        return false;
    }
    
    const moveInTimeText = document.getElementById('moveInTimeText');
    if (moveInTimeText.classList.contains('placeholder')) {
        alert('请选择可入住时间');
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

// 检查实名认证状态
function checkRealNameAuth() {
    const authStatus = localStorage.getItem('realNameAuthStatus');
    // 只有 verified 状态才认为已认证
    return authStatus === 'verified';
}

// 处理提交
function handleSubmit() {
    if (!validateStep2()) {
        return;
    }
    
    // 检查实名认证状态
    if (!checkRealNameAuth()) {
        // 未实名认证，保存当前表单数据，跳转到实名认证页面
        const formData = {
            communityName: document.getElementById('communityNameInput').value.trim(),
            rentalType: document.getElementById('rentalTypeText').textContent,
            houseType: document.getElementById('houseTypeText').textContent,
            area: document.getElementById('areaInput').value,
            floor: document.getElementById('floorInput').value,
            rent: document.getElementById('rentInput').value,
            location: document.getElementById('locationText').textContent,
            moveInTime: document.getElementById('moveInTimeText').textContent,
            phone: document.getElementById('phoneInput').value.trim(),
            photos: photos.map(p => ({ url: p.url }))
        };
        
        // 保存待发布的表单数据
        localStorage.setItem('pendingHousePost', JSON.stringify(formData));
        
        // 跳转到实名认证页面，并传递返回参数
        if (confirm('发布房源需要先完成实名认证\n\n是否前往实名认证？')) {
            window.location.href = '../real-name-auth/index.html?return=post-house';
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
    const isEditMode = window.currentEditHouseId;
    submitBtn.disabled = true;
    const loadingText = isEditMode ? '更新中...' : '发布中...';
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>' + loadingText + '</span>';
    
    // 构建提交数据
    const formData = {
        id: isEditMode ? window.currentEditHouseId : Date.now(),
        communityName: document.getElementById('communityNameInput').value.trim(),
        rentalType: document.getElementById('rentalTypeText').textContent,
        houseType: document.getElementById('houseTypeText').textContent,
        area: document.getElementById('areaInput').value,
        floor: document.getElementById('floorInput').value,
        rent: document.getElementById('rentInput').value,
        location: document.getElementById('locationText').textContent,
        moveInTime: document.getElementById('moveInTimeText').textContent,
        phone: document.getElementById('phoneInput').value.trim(),
        photos: photos.map(p => ({ url: p.url })),
        createTime: isEditMode ? (function() {
            // 编辑模式保留原创建时间
            const myHouses = JSON.parse(localStorage.getItem('myHouses') || '[]');
            const oldHouse = myHouses.find(h => h.id == window.currentEditHouseId);
            return oldHouse ? oldHouse.createTime : new Date().toLocaleString('zh-CN');
        })() : new Date().toLocaleString('zh-CN'),
        status: 'published'
    };
    
    // 保存到我的房源列表
    const myHouses = JSON.parse(localStorage.getItem('myHouses') || '[]');
    if (isEditMode) {
        // 编辑模式：更新现有房源
        const index = myHouses.findIndex(h => h.id == window.currentEditHouseId);
        if (index >= 0) {
            myHouses[index] = formData;
        }
    } else {
        // 新建模式：添加新房源
        myHouses.unshift(formData);
    }
    localStorage.setItem('myHouses', JSON.stringify(myHouses));
    
    // 清除草稿和待发布的临时数据
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem('pendingHousePost');
    
    // 模拟提交
    setTimeout(function() {
        const successText = isEditMode ? '更新成功！' : '发布成功！';
        const message = isEditMode ? '您的房源信息已更新。' : '您的房源信息已发布，我们会尽快为您匹配租客。';
        alert(successText + '\n\n' + message);
        
        // 跳转到首页
        window.location.href = '../home/index.html';
    }, 1500);
}

