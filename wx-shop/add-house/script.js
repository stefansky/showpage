// 当前步骤
let currentStep = 1;
const totalSteps = 3;

// 表单数据
let formData = {
    communityName: '',
    rentalType: '整租',
    houseType: '2室1厅',
    area: '',
    floor: '',
    rent: '',
    moveInTime: '随时入住',
    description: '',
    images: [],
    landlordName: '',
    landlordPhone: ''
};

// 下拉选项
const rentalTypeOptions = ['整租', '合租'];
const houseTypeOptions = ['1室1厅', '2室1厅', '2室2厅', '3室1厅', '3室2厅', '4室2厅', '其他'];
const moveInTimeOptions = ['随时入住', '一周内', '一个月内', '三个月内'];

// 当前下拉选择类型
let currentDropdownType = '';

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadDraft();
    setDefaultValues();
    updateStepIndicator();
    updateButtonText();
});

// 初始化事件监听
function initEventListeners() {
    // 返回按钮
    document.getElementById('backBtn').addEventListener('click', function() {
        if (confirm('确定要离开吗？未保存的数据将丢失')) {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = '../my-houses/index.html';
            }
        }
    });
    
    // 下拉选择按钮
    document.getElementById('rentalTypeBtn').addEventListener('click', function() {
        showDropdown('rentalType', rentalTypeOptions, formData.rentalType);
    });
    
    document.getElementById('houseTypeBtn').addEventListener('click', function() {
        showDropdown('houseType', houseTypeOptions, formData.houseType);
    });
    
    document.getElementById('moveInTimeBtn').addEventListener('click', function() {
        showDropdown('moveInTime', moveInTimeOptions, formData.moveInTime);
    });
    
    // 图片上传
    document.getElementById('uploadBtn').addEventListener('click', function() {
        if (formData.images.length >= 9) {
            alert('最多只能上传9张图片');
            return;
        }
        uploadImage();
    });
    
    // 下一步/发布按钮
    document.getElementById('nextBtn').addEventListener('click', function() {
        handleNext();
    });
    
    // 保存草稿按钮
    document.getElementById('draftBtn').addEventListener('click', function() {
        saveDraft();
    });
    
    // 下拉弹窗背景点击关闭
    document.getElementById('dropdownModal').addEventListener('click', function(e) {
        if (e.target === this) {
            hideDropdown();
        }
    });
}

// 设置默认值
function setDefaultValues() {
    const communityName = document.getElementById('communityName');
    const area = document.getElementById('area');
    const floor = document.getElementById('floor');
    const rent = document.getElementById('rent');
    const landlordName = document.getElementById('landlordName');
    const landlordPhone = document.getElementById('landlordPhone');
    
    if (!communityName.value) communityName.value = '光谷广场小区';
    if (!area.value) area.value = '65';
    if (!floor.value) floor.value = '5/10';
    if (!rent.value) rent.value = '2500';
    if (!landlordName.value) landlordName.value = '张先生';
    if (!landlordPhone.value) landlordPhone.value = '13800138001';
    
    // 更新formData
    formData.communityName = communityName.value;
    formData.area = area.value;
    formData.floor = floor.value;
    formData.rent = rent.value;
    formData.landlordName = landlordName.value;
    formData.landlordPhone = landlordPhone.value;
}

// 显示下拉选择
function showDropdown(type, options, selectedValue) {
    currentDropdownType = type;
    const dropdownContent = document.getElementById('dropdownContent');
    const modal = document.getElementById('dropdownModal');
    
    dropdownContent.innerHTML = options.map(function(option) {
        const isSelected = option === selectedValue ? 'selected' : '';
        return `<div class="dropdown-item ${isSelected}" data-value="${option}">${option}</div>`;
    }).join('');
    
    modal.classList.add('show');
    
    // 添加选项点击事件
    dropdownContent.querySelectorAll('.dropdown-item').forEach(function(item) {
        item.addEventListener('click', function() {
            const value = this.dataset.value;
            selectOption(type, value);
            hideDropdown();
        });
    });
}

// 选择选项
function selectOption(type, value) {
    if (type === 'rentalType') {
        formData.rentalType = value;
        document.getElementById('rentalTypeText').textContent = value;
    } else if (type === 'houseType') {
        formData.houseType = value;
        document.getElementById('houseTypeText').textContent = value;
    } else if (type === 'moveInTime') {
        formData.moveInTime = value;
        document.getElementById('moveInTimeText').textContent = value;
    }
}

// 隐藏下拉选择
function hideDropdown() {
    document.getElementById('dropdownModal').classList.remove('show');
}

// 上传图片
function uploadImage() {
    // 模拟上传，实际应该使用文件选择器
    const imageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U4ZjRmOCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzRjYWY1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJhzwvdGV4dD48L3N2Zz4=';
    
    formData.images.push(imageUrl);
    displayImages();
}

// 显示图片
function displayImages() {
    const imageList = document.getElementById('imageList');
    const uploadBtn = document.getElementById('uploadBtn');
    
    imageList.innerHTML = formData.images.map(function(image, index) {
        return `
            <div class="image-item">
                <img src="${image}" alt="房源图片${index + 1}">
                <button class="delete-btn" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }).join('');
    
    // 显示或隐藏上传按钮
    if (formData.images.length >= 9) {
        uploadBtn.style.display = 'none';
    } else {
        uploadBtn.style.display = 'flex';
    }
    
    // 添加删除按钮事件
    imageList.querySelectorAll('.delete-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.dataset.index);
            formData.images.splice(index, 1);
            displayImages();
        });
    });
}

// 更新步骤指示器
function updateStepIndicator() {
    for (let i = 1; i <= totalSteps; i++) {
        const stepItem = document.querySelector(`.step-item[data-step="${i}"]`);
        stepItem.classList.remove('active', 'completed');
        
        if (i < currentStep) {
            stepItem.classList.add('completed');
        } else if (i === currentStep) {
            stepItem.classList.add('active');
        }
    }
}

// 更新按钮文字
function updateButtonText() {
    const nextBtn = document.getElementById('nextBtn');
    
    if (currentStep === totalSteps) {
        nextBtn.textContent = '确认发布';
        nextBtn.classList.add('publish-btn');
    } else {
        nextBtn.textContent = '下一步';
        nextBtn.classList.remove('publish-btn');
    }
}

// 处理下一步/发布
function handleNext() {
    // 收集当前步骤的数据
    collectStepData();
    
    // 验证当前步骤
    if (!validateCurrentStep()) {
        return;
    }
    
    if (currentStep < totalSteps) {
        // 下一步
        currentStep++;
        showStep(currentStep);
        updateStepIndicator();
        updateButtonText();
    } else {
        // 发布
        handlePublish();
    }
}

// 收集当前步骤的数据
function collectStepData() {
    if (currentStep === 1) {
        formData.communityName = document.getElementById('communityName').value.trim();
        formData.area = document.getElementById('area').value.trim();
        formData.floor = document.getElementById('floor').value.trim();
        formData.rent = document.getElementById('rent').value.trim();
        formData.description = document.getElementById('description').value.trim();
    } else if (currentStep === 3) {
        formData.landlordName = document.getElementById('landlordName').value.trim();
        formData.landlordPhone = document.getElementById('landlordPhone').value.trim();
    }
}

// 验证当前步骤
function validateCurrentStep() {
    if (currentStep === 1) {
        if (!formData.communityName) {
            alert('请输入小区名称');
            return false;
        }
        if (!formData.area) {
            alert('请输入面积');
            return false;
        }
        if (!formData.floor) {
            alert('请输入楼层');
            return false;
        }
        if (!formData.rent) {
            alert('请输入租金');
            return false;
        }
    } else if (currentStep === 2) {
        if (formData.images.length === 0) {
            alert('请至少上传一张房源图片');
            return false;
        }
    } else if (currentStep === 3) {
        if (!formData.landlordName) {
            alert('请输入房东姓名');
            return false;
        }
        if (!formData.landlordPhone) {
            alert('请输入联系电话');
            return false;
        }
        // 简单的手机号验证
        if (!/^1[3-9]\d{9}$/.test(formData.landlordPhone)) {
            alert('请输入正确的手机号码');
            return false;
        }
    }
    return true;
}

// 显示步骤
function showStep(step) {
    document.querySelectorAll('.form-step').forEach(function(stepEl) {
        stepEl.classList.remove('active');
    });
    document.getElementById('step' + step).classList.add('active');
    
    // 滚动到顶部
    window.scrollTo(0, 0);
}

// 保存草稿
function saveDraft() {
    collectStepData();
    localStorage.setItem('houseDraft', JSON.stringify({
        ...formData,
        currentStep: currentStep
    }));
    alert('草稿已保存');
}

// 加载草稿
function loadDraft() {
    const draft = localStorage.getItem('houseDraft');
    if (draft) {
        try {
            const draftData = JSON.parse(draft);
            formData = { ...formData, ...draftData };
            currentStep = draftData.currentStep || 1;
            
            // 填充表单
            if (formData.communityName) {
                document.getElementById('communityName').value = formData.communityName;
            }
            if (formData.rentalType) {
                document.getElementById('rentalTypeText').textContent = formData.rentalType;
            }
            if (formData.houseType) {
                document.getElementById('houseTypeText').textContent = formData.houseType;
            }
            if (formData.area) {
                document.getElementById('area').value = formData.area;
            }
            if (formData.floor) {
                document.getElementById('floor').value = formData.floor;
            }
            if (formData.rent) {
                document.getElementById('rent').value = formData.rent;
            }
            if (formData.moveInTime) {
                document.getElementById('moveInTimeText').textContent = formData.moveInTime;
            }
            if (formData.description) {
                document.getElementById('description').value = formData.description;
            }
            if (formData.images && formData.images.length > 0) {
                displayImages();
            }
            if (formData.landlordName) {
                document.getElementById('landlordName').value = formData.landlordName;
            }
            if (formData.landlordPhone) {
                document.getElementById('landlordPhone').value = formData.landlordPhone;
            }
            
            // 显示对应步骤
            showStep(currentStep);
            updateStepIndicator();
            updateButtonText();
        } catch (e) {
            console.error('Error loading draft:', e);
        }
    }
}

// 发布房源
function handlePublish() {
    collectStepData();
    
    if (!validateCurrentStep()) {
        return;
    }
    
    // 创建房源数据
    const house = {
        id: Date.now(),
        title: formData.communityName + ' ' + formData.houseType,
        price: parseInt(formData.rent),
        area: parseInt(formData.area),
        rooms: formData.houseType,
        floor: formData.floor,
        rentType: formData.rentalType,
        location: '门店位置', // 默认为门店位置
        moveInTime: formData.moveInTime,
        status: 'pending', // 待审核
        createTime: new Date().toLocaleString('zh-CN'),
        landlordName: formData.landlordName,
        landlordPhone: formData.landlordPhone,
        description: formData.description,
        image: formData.images.length > 0 ? formData.images[0] : null,
        images: formData.images
    };
    
    // 保存到localStorage
    const houses = JSON.parse(localStorage.getItem('storeHouses') || '[]');
    houses.unshift(house);
    localStorage.setItem('storeHouses', JSON.stringify(houses));
    
    // 清除草稿
    localStorage.removeItem('houseDraft');
    
    // 更新房源数量
    const totalHouses = houses.length;
    localStorage.setItem('totalHouses', totalHouses.toString());
    
    alert('房源发布成功！\n\n等待平台审核');
    window.location.href = '../my-houses/index.html';
}

