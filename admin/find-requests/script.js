// 找房需求页面脚本

let currentPage = 1;
const pageSize = 10;
let editingId = null;
let locationList = [];
let editingLocationIndex = -1;

// 省市区数据（模拟）
const regionData = {
    provinces: [
        { code: '11', name: '北京市' },
        { code: '31', name: '上海市' },
        { code: '44', name: '广东省' },
        { code: '33', name: '浙江省' }
    ],
    cities: {
        '11': [{ code: '1101', name: '北京市' }],
        '31': [{ code: '3101', name: '上海市' }],
        '44': [
            { code: '4401', name: '广州市' },
            { code: '4403', name: '深圳市' }
        ],
        '33': [
            { code: '3301', name: '杭州市' },
            { code: '3302', name: '宁波市' }
        ]
    },
    districts: {
        '1101': [
            { code: '110101', name: '东城区' },
            { code: '110105', name: '朝阳区' },
            { code: '110108', name: '海淀区' },
            { code: '110102', name: '西城区' }
        ],
        '3101': [
            { code: '310101', name: '黄浦区' },
            { code: '310104', name: '徐汇区' },
            { code: '310105', name: '长宁区' }
        ],
        '4401': [
            { code: '440103', name: '荔湾区' },
            { code: '440106', name: '天河区' },
            { code: '440111', name: '白云区' }
        ],
        '4403': [
            { code: '440303', name: '罗湖区' },
            { code: '440304', name: '福田区' },
            { code: '440305', name: '南山区' }
        ],
        '3301': [
            { code: '330102', name: '上城区' },
            { code: '330105', name: '拱墅区' },
            { code: '330106', name: '西湖区' }
        ],
        '3302': [
            { code: '330203', name: '海曙区' },
            { code: '330205', name: '江北区' }
        ]
    }
};

// 初始化页面
function initPage() {
    loadUserOptions();
    loadData();
    bindEvents();
    initProvinceSelect();
}

// 绑定事件
function bindEvents() {
    document.getElementById('addRequestBtn')?.addEventListener('click', openAddModal);
    
    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.action-dropdown')) {
            document.querySelectorAll('.action-dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

// 搜索数据
function searchData() {
    currentPage = 1;
    loadData();
}

// 重置搜索
function resetSearch() {
    document.getElementById('nicknameInput').value = '';
    document.getElementById('phoneInput').value = '';
    document.getElementById('rentModeFilter').value = '';
    document.getElementById('statusFilter').value = '';
    currentPage = 1;
    loadData();
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 加载用户选项
function loadUserOptions() {
    const users = getData('users');
    const select = document.getElementById('userId');
    if (select) {
        select.innerHTML = '<option value="">请选择用户</option>' + 
            users.map(u => `<option value="${u.id}">${u.nickname} (${u.phone})</option>`).join('');
    }
}

// 初始化省份选择
function initProvinceSelect() {
    const select = document.getElementById('locProvince');
    if (select) {
        select.innerHTML = '<option value="">请选择</option>' + 
            regionData.provinces.map(p => `<option value="${p.code}">${p.name}</option>`).join('');
    }
}

// 加载数据
function loadData() {
    let findRequests = getData('findRequests');
    const nicknameInput = document.getElementById('nicknameInput')?.value?.toLowerCase() || '';
    const phoneInput = document.getElementById('phoneInput')?.value || '';
    const rentModeFilter = document.getElementById('rentModeFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const users = getData('users');
    
    // 昵称搜索
    if (nicknameInput) {
        findRequests = findRequests.filter(f => {
            const user = users.find(u => u.id === f.userId);
            const nickname = user?.nickname?.toLowerCase() || f.userNickname?.toLowerCase() || '';
            return nickname.includes(nicknameInput);
        });
    }
    
    // 电话搜索
    if (phoneInput) {
        findRequests = findRequests.filter(f => {
            const user = users.find(u => u.id === f.userId);
            const phone = f.contactPhone || user?.phone || '';
            return phone.includes(phoneInput);
        });
    }
    
    // 租赁方式过滤
    if (rentModeFilter) {
        findRequests = findRequests.filter(f => String(f.rentMode) === rentModeFilter);
    }
    
    // 状态过滤
    if (statusFilter) {
        findRequests = findRequests.filter(f => String(f.status) === statusFilter);
    }
    
    // 分页
    const total = findRequests.length;
    const start = (currentPage - 1) * pageSize;
    const paginated = findRequests.slice(start, start + pageSize);
    
    displayData(paginated, users);
    createPagination(total, currentPage, pageSize, (page) => {
        currentPage = page;
        loadData();
    });
}

// 显示数据
function displayData(findRequests, users) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    if (findRequests.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-inbox" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
                    暂无找房需求数据
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = findRequests.map(req => {
        const user = users.find(u => u.id === req.userId);
        const nickname = user?.nickname || req.userNickname || '未知用户';
        const phone = req.contactPhone || user?.phone || '-';
        const rentModeText = getRentModeText(req.rentMode);
        const rentModeClass = req.rentMode === 1 || req.rentMode === '1' ? 'whole' : 'shared';
        const roomTypeText = getRoomTypeText(req);
        const budgetText = getBudgetText(req.minPrice, req.maxPrice);
        const locationText = getLocationText(req.locations);
        const statusClass = getStatusClass(req.status);
        const statusText = getStatusText(req.status);
        
        return `
            <tr>
                <td>${req.id}</td>
                <td>${nickname}</td>
                <td>${phone}</td>
                <td><span class="type-tag ${rentModeClass}">${rentModeText}</span></td>
                <td>${roomTypeText}</td>
                <td><span class="budget-cell">${budgetText}</span></td>
                <td>
                    <div class="location-cell">
                        ${locationText}
                    </div>
                </td>
                <td>${req.moveInDate || '-'}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${req.publishTime || '-'}</td>
                <td>
                    <div class="action-dropdown">
                        <button class="action-dropdown-btn" onclick="toggleDropdown(event, ${req.id})">
                            操作 <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="action-dropdown-menu" id="dropdown-${req.id}">
                            <div class="action-dropdown-item" onclick="viewDetail(${req.id})">
                                <i class="fas fa-eye"></i> 查看详情
                            </div>
                            <div class="action-dropdown-item" onclick="editRequest(${req.id})">
                                <i class="fas fa-edit"></i> 编辑
                            </div>
                            <div class="action-dropdown-item success" onclick="changeStatus(${req.id}, 2)">
                                <i class="fas fa-check"></i> 标记已找到
                            </div>
                            <div class="action-dropdown-item" onclick="changeStatus(${req.id}, 0)">
                                <i class="fas fa-ban"></i> 关闭需求
                            </div>
                            <div class="action-dropdown-item danger" onclick="deleteRequest(${req.id})">
                                <i class="fas fa-trash"></i> 删除
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// 切换下拉菜单
function toggleDropdown(event, id) {
    event.stopPropagation();
    const allMenus = document.querySelectorAll('.action-dropdown-menu.show');
    allMenus.forEach(menu => {
        if (menu.id !== `dropdown-${id}`) {
            menu.classList.remove('show');
        }
    });
    const menu = document.getElementById(`dropdown-${id}`);
    menu?.classList.toggle('show');
}

// 获取租赁方式文本
function getRentModeText(mode) {
    const map = { 1: '整租', '1': '整租', 2: '合租', '2': '合租' };
    return map[mode] || '未知';
}

// 获取户型文本
function getRoomTypeText(req) {
    const rentMode = Number(req.rentMode);
    if (rentMode === 1) {
        // 整租显示几室
        const roomMap = { 1: '1室', 2: '2室', 3: '3室', 4: '4室+' };
        return roomMap[req.roomCount] || req.rooms || '-';
    } else {
        // 合租显示主卧/次卧
        const typeMap = { 1: '主卧', 2: '次卧', 3: '不限' };
        return typeMap[req.roomType] || '-';
    }
}

// 获取预算文本
function getBudgetText(min, max) {
    if (min && max) return `${min}-${max}元/月`;
    if (min) return `${min}元起`;
    if (max) return `${max}元以内`;
    return '不限';
}

// 获取位置文本
function getLocationText(locations) {
    if (!locations || locations.length === 0) return '-';
    const first = locations[0];
    const text = first.district || first.city || first.fullAddress || '-';
    if (locations.length > 1) {
        return `${text} <span class="location-count">+${locations.length - 1}</span>`;
    }
    return text;
}

// 获取状态类
function getStatusClass(status) {
    const map = { 0: 'inactive', '0': 'inactive', 1: 'active', '1': 'active', 2: 'completed', '2': 'completed' };
    return map[status] || 'inactive';
}

// 获取状态文本
function getStatusText(status) {
    const map = { 0: '已关闭', '0': '已关闭', 1: '进行中', '1': '进行中', 2: '已找到', '2': '已找到' };
    return map[status] || '未知';
}

// ==================== 新增/编辑弹窗 ====================

function openAddModal() {
    editingId = null;
    locationList = [];
    document.getElementById('modalTitle').textContent = '新增找房需求';
    resetForm();
    document.getElementById('requestModal').classList.add('show');
}

function editRequest(id) {
    const requests = getData('findRequests');
    const req = requests.find(r => r.id === id);
    if (!req) return;
    
    editingId = id;
    document.getElementById('modalTitle').textContent = '编辑找房需求';
    
    // 填充表单
    document.getElementById('userId').value = req.userId || '';
    document.getElementById('contactPhone').value = req.contactPhone || '';
    document.getElementById('minPrice').value = req.minPrice || '';
    document.getElementById('maxPrice').value = req.maxPrice || '';
    document.getElementById('moveInDate').value = req.moveInDate || '';
    document.getElementById('status').value = req.status ?? 1;
    
    // 设置租赁方式
    const rentMode = String(req.rentMode);
    document.querySelectorAll('input[name="rentMode"]').forEach(input => {
        input.checked = input.value === rentMode;
    });
    handleRentModeChange();
    
    // 设置户型
    if (rentMode === '1') {
        document.getElementById('roomCount').value = req.roomCount || '';
    } else {
        document.getElementById('roomType').value = req.roomType || '';
    }
    
    // 加载位置列表
    locationList = req.locations ? [...req.locations] : [];
    renderLocationList();
    
    document.getElementById('requestModal').classList.add('show');
}

function closeRequestModal() {
    document.getElementById('requestModal').classList.remove('show');
    resetForm();
}

function resetForm() {
    document.getElementById('userId').value = '';
    document.getElementById('contactPhone').value = '';
    document.querySelectorAll('input[name="rentMode"]').forEach(input => input.checked = false);
    document.getElementById('roomCount').value = '';
    document.getElementById('roomType').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('moveInDate').value = '';
    document.getElementById('status').value = '1';
    document.getElementById('roomCountItem').style.display = 'none';
    document.getElementById('roomTypeItem').style.display = 'none';
    locationList = [];
    renderLocationList();
}

// 处理租赁方式变化
function handleRentModeChange() {
    const rentMode = document.querySelector('input[name="rentMode"]:checked')?.value;
    const roomCountItem = document.getElementById('roomCountItem');
    const roomTypeItem = document.getElementById('roomTypeItem');
    
    if (rentMode === '1') {
        roomCountItem.style.display = 'flex';
        roomTypeItem.style.display = 'none';
    } else if (rentMode === '2') {
        roomCountItem.style.display = 'none';
        roomTypeItem.style.display = 'flex';
    } else {
        roomCountItem.style.display = 'none';
        roomTypeItem.style.display = 'none';
    }
}

// 保存需求
function saveRequest() {
    const userId = document.getElementById('userId').value;
    const contactPhone = document.getElementById('contactPhone').value.trim();
    const rentMode = document.querySelector('input[name="rentMode"]:checked')?.value;
    const status = document.getElementById('status').value;
    
    // 验证必填项
    if (!userId) {
        showToast('请选择关联用户', 'error');
        return;
    }
    if (!contactPhone) {
        showToast('请输入联系电话', 'error');
        return;
    }
    if (!rentMode) {
        showToast('请选择租赁方式', 'error');
        return;
    }
    
    const users = getData('users');
    const user = users.find(u => u.id === Number(userId));
    
    const requestData = {
        userId: Number(userId),
        userNickname: user?.nickname || '',
        contactPhone,
        rentMode: Number(rentMode),
        roomCount: rentMode === '1' ? (document.getElementById('roomCount').value || null) : null,
        roomType: rentMode === '2' ? (document.getElementById('roomType').value || null) : null,
        minPrice: Number(document.getElementById('minPrice').value) || null,
        maxPrice: Number(document.getElementById('maxPrice').value) || null,
        moveInDate: document.getElementById('moveInDate').value || null,
        status: Number(status),
        locations: locationList,
        publishTime: formatDateTime()
    };
    
    if (editingId) {
        updateData('findRequests', editingId, requestData);
        showToast('需求更新成功', 'success');
    } else {
        addData('findRequests', requestData);
        showToast('需求添加成功', 'success');
    }
    
    closeRequestModal();
    loadData();
}

// ==================== 位置管理 ====================

function renderLocationList() {
    const container = document.getElementById('locationList');
    if (!container) return;
    
    if (locationList.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">暂未添加期望位置</div>';
        return;
    }
    
    container.innerHTML = locationList.map((loc, index) => `
        <div class="location-item">
            <div class="location-icon"><i class="fas fa-map-marker-alt"></i></div>
            <div class="location-info">
                <div class="location-name">${loc.fullAddress || loc.district || loc.city || '未知位置'}</div>
                <div class="location-detail">${loc.address || ''} ${loc.lng && loc.lat ? `(${loc.lng}, ${loc.lat})` : ''}</div>
            </div>
            <div class="location-actions">
                <button class="action-btn edit" onclick="editLocation(${index})"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="removeLocation(${index})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function addLocation() {
    editingLocationIndex = -1;
    resetLocationForm();
    document.getElementById('locationModal').classList.add('show');
}

function editLocation(index) {
    editingLocationIndex = index;
    const loc = locationList[index];
    
    // 填充表单
    const province = findProvinceByName(loc.province);
    if (province) {
        document.getElementById('locProvince').value = province.code;
        handleLocProvinceChange();
        
        setTimeout(() => {
            const city = findCityByName(province.code, loc.city);
            if (city) {
                document.getElementById('locCity').value = city.code;
                handleLocCityChange();
                
                setTimeout(() => {
                    const district = findDistrictByName(city.code, loc.district);
                    if (district) {
                        document.getElementById('locDistrict').value = district.code;
                    }
                }, 50);
            }
        }, 50);
    }
    
    document.getElementById('locAddress').value = loc.address || '';
    document.getElementById('locLng').value = loc.lng || '';
    document.getElementById('locLat').value = loc.lat || '';
    
    document.getElementById('locationModal').classList.add('show');
}

function removeLocation(index) {
    locationList.splice(index, 1);
    renderLocationList();
}

function closeLocationModal() {
    document.getElementById('locationModal').classList.remove('show');
    resetLocationForm();
}

function resetLocationForm() {
    document.getElementById('locProvince').value = '';
    document.getElementById('locCity').innerHTML = '<option value="">请选择</option>';
    document.getElementById('locDistrict').innerHTML = '<option value="">请选择</option>';
    document.getElementById('locAddress').value = '';
    document.getElementById('locLng').value = '';
    document.getElementById('locLat').value = '';
}

// 省份变化
function handleLocProvinceChange() {
    const provinceCode = document.getElementById('locProvince').value;
    const citySelect = document.getElementById('locCity');
    const districtSelect = document.getElementById('locDistrict');
    
    citySelect.innerHTML = '<option value="">请选择</option>';
    districtSelect.innerHTML = '<option value="">请选择</option>';
    
    if (provinceCode && regionData.cities[provinceCode]) {
        citySelect.innerHTML += regionData.cities[provinceCode]
            .map(c => `<option value="${c.code}">${c.name}</option>`).join('');
    }
}

// 城市变化
function handleLocCityChange() {
    const cityCode = document.getElementById('locCity').value;
    const districtSelect = document.getElementById('locDistrict');
    
    districtSelect.innerHTML = '<option value="">请选择</option>';
    
    if (cityCode && regionData.districts[cityCode]) {
        districtSelect.innerHTML += regionData.districts[cityCode]
            .map(d => `<option value="${d.code}">${d.name}</option>`).join('');
    }
}

// 模拟获取坐标
function simulateGetCoord() {
    const lng = (116.3 + Math.random() * 0.1).toFixed(6);
    const lat = (39.9 + Math.random() * 0.1).toFixed(6);
    document.getElementById('locLng').value = lng;
    document.getElementById('locLat').value = lat;
    showToast('定位成功', 'success');
}

// 确认位置
function confirmLocation() {
    const provinceCode = document.getElementById('locProvince').value;
    const cityCode = document.getElementById('locCity').value;
    const districtCode = document.getElementById('locDistrict').value;
    const address = document.getElementById('locAddress').value.trim();
    const lng = document.getElementById('locLng').value.trim();
    const lat = document.getElementById('locLat').value.trim();
    
    if (!provinceCode || !cityCode) {
        showToast('请至少选择省份和城市', 'error');
        return;
    }
    
    const province = regionData.provinces.find(p => p.code === provinceCode);
    const city = regionData.cities[provinceCode]?.find(c => c.code === cityCode);
    const district = regionData.districts[cityCode]?.find(d => d.code === districtCode);
    
    const locationData = {
        provinceCode,
        province: province?.name || '',
        cityCode,
        city: city?.name || '',
        districtCode: districtCode || '',
        district: district?.name || '',
        address,
        lng,
        lat,
        fullAddress: [province?.name, city?.name, district?.name, address].filter(Boolean).join('')
    };
    
    if (editingLocationIndex >= 0) {
        locationList[editingLocationIndex] = locationData;
    } else {
        locationList.push(locationData);
    }
    
    renderLocationList();
    closeLocationModal();
}

// 辅助函数：根据名称查找省份
function findProvinceByName(name) {
    if (!name) return null;
    return regionData.provinces.find(p => p.name.includes(name) || name.includes(p.name));
}

// 辅助函数：根据名称查找城市
function findCityByName(provinceCode, name) {
    if (!name || !provinceCode) return null;
    return regionData.cities[provinceCode]?.find(c => c.name.includes(name) || name.includes(c.name));
}

// 辅助函数：根据名称查找区县
function findDistrictByName(cityCode, name) {
    if (!name || !cityCode) return null;
    return regionData.districts[cityCode]?.find(d => d.name.includes(name) || name.includes(d.name));
}

// ==================== 详情弹窗 ====================

function viewDetail(id) {
    const requests = getData('findRequests');
    const users = getData('users');
    const req = requests.find(r => r.id === id);
    if (!req) return;
    
    const user = users.find(u => u.id === req.userId);
    const nickname = user?.nickname || req.userNickname || '未知用户';
    const phone = req.contactPhone || user?.phone || '-';
    const statusClass = getStatusClass(req.status);
    const statusText = getStatusText(req.status);
    
    const detailBody = document.getElementById('detailBody');
    detailBody.innerHTML = `
        <div class="detail-header">
            <div class="user-info">
                <div class="avatar">👤</div>
                <div>
                    <div class="name">${nickname}</div>
                    <div class="phone"><i class="fas fa-phone"></i> ${phone}</div>
                </div>
            </div>
            <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">租房需求</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">租赁方式</span>
                    <span class="detail-value">${getRentModeText(req.rentMode)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">期望户型</span>
                    <span class="detail-value">${getRoomTypeText(req)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">预算范围</span>
                    <span class="detail-value" style="color: #F44336;">${getBudgetText(req.minPrice, req.maxPrice)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">入住时间</span>
                    <span class="detail-value">${req.moveInDate || '不限'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">发布时间</span>
                    <span class="detail-value">${req.publishTime || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">需求ID</span>
                    <span class="detail-value">#${req.id}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">期望位置 (${req.locations?.length || 0}个)</div>
            <div class="detail-locations">
                ${(req.locations && req.locations.length > 0) ? 
                    req.locations.map(loc => `
                        <div class="detail-location-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span class="location-text">${loc.fullAddress || loc.district || loc.city || '-'}</span>
                            ${loc.lng && loc.lat ? `<span class="coord">${loc.lng}, ${loc.lat}</span>` : ''}
                        </div>
                    `).join('') :
                    '<div style="text-align: center; color: #999; padding: 12px;">暂无期望位置</div>'
                }
            </div>
        </div>
    `;
    
    document.getElementById('detailModal').classList.add('show');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('show');
}

// ==================== 其他操作 ====================

function changeStatus(id, status) {
    const statusText = status === 2 ? '已找到' : '已关闭';
    if (confirm(`确定将此需求标记为"${statusText}"吗？`)) {
        updateData('findRequests', id, { status });
        showToast(`需求已标记为${statusText}`, 'success');
        loadData();
    }
}

function deleteRequest(id) {
    if (confirm('确定要删除该找房需求吗？此操作不可恢复。')) {
        deleteData('findRequests', id);
        showToast('需求已删除', 'success');
        loadData();
    }
}

// Toast 提示
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}
