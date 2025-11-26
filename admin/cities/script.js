// 城市管理页面脚本

// 中国城市数据库（预设数据）
const chinaCities = [
    // 直辖市
    { name: '北京市', adcode: '110000', province: '北京市', level: 'province', lat: 39.9042, lng: 116.4074 },
    { name: '上海市', adcode: '310000', province: '上海市', level: 'province', lat: 31.2304, lng: 121.4737 },
    { name: '天津市', adcode: '120000', province: '天津市', level: 'province', lat: 39.0842, lng: 117.2009 },
    { name: '重庆市', adcode: '500000', province: '重庆市', level: 'province', lat: 29.5630, lng: 106.5516 },
    
    // 省会城市及主要城市
    { name: '广州市', adcode: '440100', province: '广东省', level: 'city', lat: 23.1291, lng: 113.2644 },
    { name: '深圳市', adcode: '440300', province: '广东省', level: 'city', lat: 22.5431, lng: 114.0579 },
    { name: '东莞市', adcode: '441900', province: '广东省', level: 'city', lat: 23.0207, lng: 113.7518 },
    { name: '佛山市', adcode: '440600', province: '广东省', level: 'city', lat: 23.0218, lng: 113.1219 },
    { name: '珠海市', adcode: '440400', province: '广东省', level: 'city', lat: 22.2710, lng: 113.5767 },
    { name: '惠州市', adcode: '441300', province: '广东省', level: 'city', lat: 23.1115, lng: 114.4160 },
    { name: '中山市', adcode: '442000', province: '广东省', level: 'city', lat: 22.5176, lng: 113.3926 },
    
    { name: '杭州市', adcode: '330100', province: '浙江省', level: 'city', lat: 30.2741, lng: 120.1551 },
    { name: '宁波市', adcode: '330200', province: '浙江省', level: 'city', lat: 29.8683, lng: 121.5440 },
    { name: '温州市', adcode: '330300', province: '浙江省', level: 'city', lat: 27.9938, lng: 120.6994 },
    { name: '嘉兴市', adcode: '330400', province: '浙江省', level: 'city', lat: 30.7469, lng: 120.7555 },
    { name: '绍兴市', adcode: '330600', province: '浙江省', level: 'city', lat: 30.0303, lng: 120.5801 },
    
    { name: '南京市', adcode: '320100', province: '江苏省', level: 'city', lat: 32.0603, lng: 118.7969 },
    { name: '苏州市', adcode: '320500', province: '江苏省', level: 'city', lat: 31.2989, lng: 120.5853 },
    { name: '无锡市', adcode: '320200', province: '江苏省', level: 'city', lat: 31.4912, lng: 120.3119 },
    { name: '常州市', adcode: '320400', province: '江苏省', level: 'city', lat: 31.8118, lng: 119.9742 },
    { name: '南通市', adcode: '320600', province: '江苏省', level: 'city', lat: 31.9807, lng: 120.8942 },
    
    { name: '成都市', adcode: '510100', province: '四川省', level: 'city', lat: 30.5728, lng: 104.0668 },
    { name: '绵阳市', adcode: '510700', province: '四川省', level: 'city', lat: 31.4675, lng: 104.6796 },
    
    { name: '武汉市', adcode: '420100', province: '湖北省', level: 'city', lat: 30.5928, lng: 114.3055 },
    { name: '宜昌市', adcode: '420500', province: '湖北省', level: 'city', lat: 30.6917, lng: 111.2867 },
    
    { name: '长沙市', adcode: '430100', province: '湖南省', level: 'city', lat: 28.2282, lng: 112.9388 },
    { name: '株洲市', adcode: '430200', province: '湖南省', level: 'city', lat: 27.8274, lng: 113.1340 },
    
    { name: '西安市', adcode: '610100', province: '陕西省', level: 'city', lat: 34.3416, lng: 108.9398 },
    { name: '咸阳市', adcode: '610400', province: '陕西省', level: 'city', lat: 34.3296, lng: 108.7092 },
    
    { name: '郑州市', adcode: '410100', province: '河南省', level: 'city', lat: 34.7466, lng: 113.6254 },
    { name: '洛阳市', adcode: '410300', province: '河南省', level: 'city', lat: 34.6180, lng: 112.4540 },
    
    { name: '济南市', adcode: '370100', province: '山东省', level: 'city', lat: 36.6512, lng: 117.1201 },
    { name: '青岛市', adcode: '370200', province: '山东省', level: 'city', lat: 36.0671, lng: 120.3826 },
    { name: '烟台市', adcode: '370600', province: '山东省', level: 'city', lat: 37.4638, lng: 121.4479 },
    
    { name: '沈阳市', adcode: '210100', province: '辽宁省', level: 'city', lat: 41.8057, lng: 123.4315 },
    { name: '大连市', adcode: '210200', province: '辽宁省', level: 'city', lat: 38.9140, lng: 121.6147 },
    
    { name: '哈尔滨市', adcode: '230100', province: '黑龙江省', level: 'city', lat: 45.8038, lng: 126.5350 },
    { name: '长春市', adcode: '220100', province: '吉林省', level: 'city', lat: 43.8171, lng: 125.3235 },
    
    { name: '福州市', adcode: '350100', province: '福建省', level: 'city', lat: 26.0745, lng: 119.2965 },
    { name: '厦门市', adcode: '350200', province: '福建省', level: 'city', lat: 24.4798, lng: 118.0894 },
    { name: '泉州市', adcode: '350500', province: '福建省', level: 'city', lat: 24.8741, lng: 118.6757 },
    
    { name: '南昌市', adcode: '360100', province: '江西省', level: 'city', lat: 28.6820, lng: 115.8579 },
    { name: '合肥市', adcode: '340100', province: '安徽省', level: 'city', lat: 31.8206, lng: 117.2272 },
    { name: '石家庄市', adcode: '130100', province: '河北省', level: 'city', lat: 38.0428, lng: 114.5149 },
    { name: '太原市', adcode: '140100', province: '山西省', level: 'city', lat: 37.8706, lng: 112.5489 },
    { name: '南宁市', adcode: '450100', province: '广西壮族自治区', level: 'city', lat: 22.8170, lng: 108.3665 },
    { name: '昆明市', adcode: '530100', province: '云南省', level: 'city', lat: 24.8801, lng: 102.8329 },
    { name: '贵阳市', adcode: '520100', province: '贵州省', level: 'city', lat: 26.6470, lng: 106.6302 },
    { name: '兰州市', adcode: '620100', province: '甘肃省', level: 'city', lat: 36.0611, lng: 103.8343 },
    { name: '海口市', adcode: '460100', province: '海南省', level: 'city', lat: 20.0440, lng: 110.1999 },
    { name: '三亚市', adcode: '460200', province: '海南省', level: 'city', lat: 18.2528, lng: 109.5120 },
];

// 初始化Mock数据
function initCityMockData() {
    const existingData = getData('cities');
    if (!existingData || existingData.length === 0) {
        // 创建默认开通城市
        const defaultCities = [
            { id: 1, name: '北京市', adcode: '110000', province: '北京市', level: 'province', lat: 39.9042, lng: 116.4074, houseCount: 1250, userCount: 3560, storeCount: 15, findRequestCount: 420, status: 'active', createTime: '2024-01-01 10:00:00' },
            { id: 2, name: '上海市', adcode: '310000', province: '上海市', level: 'province', lat: 31.2304, lng: 121.4737, houseCount: 980, userCount: 2890, storeCount: 12, findRequestCount: 380, status: 'active', createTime: '2024-01-01 10:00:00' },
            { id: 3, name: '广州市', adcode: '440100', province: '广东省', level: 'city', lat: 23.1291, lng: 113.2644, houseCount: 750, userCount: 2150, storeCount: 8, findRequestCount: 290, status: 'active', createTime: '2024-01-05 14:30:00' },
            { id: 4, name: '深圳市', adcode: '440300', province: '广东省', level: 'city', lat: 22.5431, lng: 114.0579, houseCount: 680, userCount: 1980, storeCount: 7, findRequestCount: 260, status: 'active', createTime: '2024-01-05 14:30:00' },
            { id: 5, name: '杭州市', adcode: '330100', province: '浙江省', level: 'city', lat: 30.2741, lng: 120.1551, houseCount: 520, userCount: 1560, storeCount: 5, findRequestCount: 180, status: 'active', createTime: '2024-01-10 09:00:00' },
            { id: 6, name: '成都市', adcode: '510100', province: '四川省', level: 'city', lat: 30.5728, lng: 104.0668, houseCount: 450, userCount: 1320, storeCount: 4, findRequestCount: 150, status: 'active', createTime: '2024-01-15 11:20:00' },
            { id: 7, name: '武汉市', adcode: '420100', province: '湖北省', level: 'city', lat: 30.5928, lng: 114.3055, houseCount: 380, userCount: 1100, storeCount: 3, findRequestCount: 120, status: 'active', createTime: '2024-01-20 16:45:00' },
            { id: 8, name: '南京市', adcode: '320100', province: '江苏省', level: 'city', lat: 32.0603, lng: 118.7969, houseCount: 320, userCount: 950, storeCount: 3, findRequestCount: 100, status: 'inactive', createTime: '2024-02-01 10:00:00' },
        ];
        saveData('cities', defaultCities);
    }
}

// 获取所有省份列表
function getProvinces() {
    const cities = getData('cities');
    const provinces = [...new Set(cities.map(c => c.province))];
    return provinces.sort();
}

let currentPage = 1;
const pageSize = 10;
let editingCityId = null;
let isManualMode = false;

function initPage() {
    initCityMockData();
    loadProvinceFilter();
    loadData();
    loadStats();
    
    // 事件监听
    document.getElementById('addCityBtn')?.addEventListener('click', () => openModal());
    document.getElementById('searchInput')?.addEventListener('input', () => { currentPage = 1; loadData(); });
    document.getElementById('provinceFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
    document.getElementById('statusFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
    document.getElementById('citySearchInput')?.addEventListener('input', handleCitySearch);
}

// 加载省份筛选器
function loadProvinceFilter() {
    const provinceFilter = document.getElementById('provinceFilter');
    if (!provinceFilter) return;
    
    // 清空现有选项（保留第一个"全部省份"）
    while (provinceFilter.options.length > 1) {
        provinceFilter.remove(1);
    }
    
    const provinces = getProvinces();
    provinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceFilter.appendChild(option);
    });
}

// 加载统计数据
function loadStats() {
    const cities = getData('cities');
    const activeCities = cities.filter(c => c.status === 'active').length;
    const inactiveCities = cities.filter(c => c.status === 'inactive').length;
    
    document.getElementById('totalCities').textContent = cities.length;
    document.getElementById('activeCities').textContent = activeCities;
    document.getElementById('inactiveCities').textContent = inactiveCities;
}

// 加载城市列表
function loadData() {
    const cities = getData('cities');
    const searchInput = document.getElementById('searchInput');
    const provinceFilter = document.getElementById('provinceFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    let filtered = [...cities];
    
    // 搜索
    if (searchInput?.value) {
        const keyword = searchInput.value.toLowerCase();
        filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(keyword) ||
            c.adcode.includes(keyword)
        );
    }
    
    // 省份筛选
    if (provinceFilter?.value) {
        filtered = filtered.filter(c => c.province === provinceFilter.value);
    }
    
    // 状态筛选
    if (statusFilter?.value) {
        filtered = filtered.filter(c => c.status === statusFilter.value);
    }
    
    // 按ID倒序排列
    filtered.sort((a, b) => b.id - a.id);
    
    const total = filtered.length;
    const start = (currentPage - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);
    
    displayCities(paginated);
    createPagination(total, currentPage, pageSize, (page) => {
        currentPage = page;
        loadData();
    });
}

// 显示城市列表（表格形式）
function displayCities(cities) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    if (cities.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-city" style="font-size: 32px; margin-bottom: 12px; display: block; color: #e0e0e0;"></i>
                    暂无开通城市
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = cities.map(city => `
        <tr>
            <td>${city.id}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-city" style="color: ${city.status === 'active' ? '#4CAF50' : '#999'}"></i>
                    <span style="font-weight: 500;">${city.name}</span>
                </div>
            </td>
            <td>${city.province}</td>
            <td><span class="adcode-cell">${city.adcode}</span></td>
            <td class="coord-cell">${city.lat}, ${city.lng}</td>
            <td>${city.houseCount || 0}</td>
            <td>${city.userCount || 0}</td>
            <td>${city.storeCount || 0}</td>
            <td>
                <span class="status-badge ${city.status}">
                    ${city.status === 'active' ? '启用' : '禁用'}
                </span>
            </td>
            <td>${city.createTime || '-'}</td>
            <td>
                <button class="action-btn info" onclick="viewCity(${city.id})" title="查看">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn primary" onclick="editCity(${city.id})" title="编辑">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn ${city.status === 'active' ? 'danger' : 'primary'}" onclick="toggleCity(${city.id})" title="${city.status === 'active' ? '禁用' : '启用'}">
                    <i class="fas fa-${city.status === 'active' ? 'ban' : 'check'}"></i>
                </button>
                <button class="action-btn danger" onclick="deleteCity(${city.id})" title="删除">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// 打开弹窗（添加/编辑）
function openModal(cityId = null) {
    editingCityId = cityId;
    isManualMode = !!cityId; // 编辑模式默认使用手动输入
    
    // 重置表单
    resetForm();
    
    if (cityId) {
        // 编辑模式
        document.getElementById('modalTitle').textContent = '编辑城市';
        document.getElementById('citySearchSection').style.display = 'none';
        document.getElementById('cityForm').style.display = 'block';
        document.getElementById('tipBox').style.display = 'none';
        document.getElementById('modeSwitchBtn').parentElement.style.display = 'none';
        
        // 填充数据
        const city = getData('cities').find(c => c.id === cityId);
        if (city) {
            document.getElementById('formCityName').value = city.name;
            document.getElementById('formProvince').value = city.province;
            document.getElementById('formAdcode').value = city.adcode;
            document.getElementById('formLevel').value = city.level || 'city';
            document.getElementById('formLat').value = city.lat || '';
            document.getElementById('formLng').value = city.lng || '';
            document.querySelector(`input[name="formStatus"][value="${city.status}"]`).checked = true;
        }
    } else {
        // 添加模式
        document.getElementById('modalTitle').textContent = '开通城市';
        document.getElementById('citySearchSection').style.display = 'block';
        document.getElementById('cityForm').style.display = 'none';
        document.getElementById('tipBox').style.display = 'flex';
        document.getElementById('modeSwitchBtn').parentElement.style.display = 'block';
        updateModeButton();
    }
    
    document.getElementById('cityModal').classList.add('show');
}

// 关闭弹窗
function closeModal() {
    document.getElementById('cityModal').classList.remove('show');
    editingCityId = null;
    isManualMode = false;
}

// 重置表单
function resetForm() {
    document.getElementById('citySearchInput').value = '';
    document.getElementById('citySearchResults').innerHTML = '';
    document.getElementById('citySearchResults').classList.remove('show');
    document.getElementById('formCityName').value = '';
    document.getElementById('formProvince').value = '';
    document.getElementById('formAdcode').value = '';
    document.getElementById('formLevel').value = 'city';
    document.getElementById('formLat').value = '';
    document.getElementById('formLng').value = '';
    document.querySelector('input[name="formStatus"][value="active"]').checked = true;
}

// 切换输入模式
function toggleInputMode() {
    isManualMode = !isManualMode;
    
    if (isManualMode) {
        document.getElementById('citySearchSection').style.display = 'none';
        document.getElementById('cityForm').style.display = 'block';
    } else {
        document.getElementById('citySearchSection').style.display = 'block';
        document.getElementById('cityForm').style.display = 'none';
    }
    
    updateModeButton();
}

// 更新模式切换按钮文字
function updateModeButton() {
    const btn = document.getElementById('modeSwitchBtn');
    if (isManualMode) {
        btn.innerHTML = '<i class="fas fa-search"></i><span>切换到搜索选择</span>';
    } else {
        btn.innerHTML = '<i class="fas fa-keyboard"></i><span>切换到手动输入</span>';
    }
}

// 处理城市搜索
function handleCitySearch() {
    const keyword = document.getElementById('citySearchInput').value.trim().toLowerCase();
    const resultsContainer = document.getElementById('citySearchResults');
    
    if (!keyword) {
        resultsContainer.classList.remove('show');
        return;
    }
    
    // 搜索匹配的城市
    const results = chinaCities.filter(city => 
        city.name.toLowerCase().includes(keyword) || 
        city.province.toLowerCase().includes(keyword) ||
        city.adcode.includes(keyword)
    ).slice(0, 8);
    
    // 获取已开通的城市adcode列表
    const openedCities = getData('cities').map(c => c.adcode);
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="city-result-item" style="justify-content: center; color: #999; cursor: default;">
                未找到匹配的城市，请尝试手动输入
            </div>
        `;
    } else {
        resultsContainer.innerHTML = results.map(city => {
            const isOpened = openedCities.includes(city.adcode);
            return `
                <div class="city-result-item ${isOpened ? 'disabled' : ''}" 
                     ${!isOpened ? `onclick="selectCity('${city.adcode}')"` : ''}>
                    <div class="city-result-icon">
                        <i class="fas fa-${city.level === 'province' ? 'flag' : 'city'}"></i>
                    </div>
                    <div class="city-result-info">
                        <div class="city-result-name">${city.name}</div>
                        <div class="city-result-path">${city.province}</div>
                    </div>
                    <span class="city-result-code">${city.adcode}</span>
                    ${isOpened ? '<span class="city-result-tag">已开通</span>' : ''}
                </div>
            `;
        }).join('');
    }
    
    resultsContainer.classList.add('show');
}

// 选择城市（从搜索结果）
function selectCity(adcode) {
    const city = chinaCities.find(c => c.adcode === adcode);
    if (!city) return;
    
    // 切换到手动输入模式并填充数据
    isManualMode = true;
    document.getElementById('citySearchSection').style.display = 'none';
    document.getElementById('cityForm').style.display = 'block';
    updateModeButton();
    
    // 填充表单
    document.getElementById('formCityName').value = city.name;
    document.getElementById('formProvince').value = city.province;
    document.getElementById('formAdcode').value = city.adcode;
    document.getElementById('formLevel').value = city.level;
    document.getElementById('formLat').value = city.lat;
    document.getElementById('formLng').value = city.lng;
}

// 保存城市
function saveCity() {
    const name = document.getElementById('formCityName').value.trim();
    const province = document.getElementById('formProvince').value.trim();
    const adcode = document.getElementById('formAdcode').value.trim();
    const level = document.getElementById('formLevel').value;
    const lat = parseFloat(document.getElementById('formLat').value) || 0;
    const lng = parseFloat(document.getElementById('formLng').value) || 0;
    const status = document.querySelector('input[name="formStatus"]:checked').value;
    
    // 验证必填字段
    if (!name) {
        alert('请输入城市名称');
        return;
    }
    if (!province) {
        alert('请输入所属省份');
        return;
    }
    if (!adcode) {
        alert('请输入行政区划代码');
        return;
    }
    if (!/^\d{6}$/.test(adcode)) {
        alert('行政区划代码格式错误，应为6位数字');
        return;
    }
    
    // 检查adcode是否已存在（排除当前编辑的城市）
    const cities = getData('cities');
    const existingCity = cities.find(c => c.adcode === adcode && c.id !== editingCityId);
    if (existingCity) {
        alert(`行政区划代码 ${adcode} 已被「${existingCity.name}」使用`);
        return;
    }
    
    if (editingCityId) {
        // 编辑模式
        updateData('cities', editingCityId, {
            name, province, adcode, level, lat, lng, status
        });
        alert('城市信息更新成功！');
    } else {
        // 添加模式
        addData('cities', {
            name, province, adcode, level, lat, lng,
            houseCount: 0,
            userCount: 0,
            storeCount: 0,
            findRequestCount: 0,
            status,
            createTime: formatDateTime()
        });
        alert(`城市「${name}」开通成功！`);
    }
    
    closeModal();
    loadData();
    loadStats();
    loadProvinceFilter();
}

// 编辑城市
function editCity(id) {
    openModal(id);
}

// 查看城市详情
function viewCity(id) {
    const city = getData('cities').find(c => c.id === id);
    if (!city) return;
    
    const detailBody = document.getElementById('detailBody');
    detailBody.innerHTML = `
        <div class="detail-section">
            <div class="detail-section-title">基本信息</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">城市名称</span>
                    <span class="detail-value">${city.name}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">所属省份</span>
                    <span class="detail-value">${city.province}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">行政区划代码</span>
                    <span class="detail-value code">${city.adcode}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">城市级别</span>
                    <span class="detail-value">${city.level === 'province' ? '省级/直辖市' : '地级市'}</span>
                </div>
            </div>
        </div>
        <div class="detail-section">
            <div class="detail-section-title">坐标信息</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">纬度</span>
                    <span class="detail-value code">${city.lat || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">经度</span>
                    <span class="detail-value code">${city.lng || '-'}</span>
                </div>
            </div>
        </div>
        <div class="detail-section">
            <div class="detail-section-title">运营数据</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">房源数量</span>
                    <span class="detail-value">${city.houseCount || 0}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">用户数量</span>
                    <span class="detail-value">${city.userCount || 0}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">门店数量</span>
                    <span class="detail-value">${city.storeCount || 0}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">找房需求</span>
                    <span class="detail-value">${city.findRequestCount || 0}</span>
                </div>
            </div>
        </div>
        <div class="detail-section">
            <div class="detail-section-title">其他信息</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">开通时间</span>
                    <span class="detail-value">${city.createTime || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">当前状态</span>
                    <span class="detail-value">${city.status === 'active' ? '✅ 启用中' : '⏸ 已禁用'}</span>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('detailModal').classList.add('show');
}

// 关闭详情弹窗
function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('show');
}

// 切换城市状态
function toggleCity(id) {
    const city = getData('cities').find(c => c.id === id);
    if (!city) return;
    
    const newStatus = city.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? '启用' : '禁用';
    
    if (confirm(`确定要${action}「${city.name}」吗？\n\n${newStatus === 'inactive' ? '⚠️ 禁用后，该城市的用户将无法正常使用服务。' : '✅ 启用后，该城市的用户可以正常使用服务。'}`)) {
        updateData('cities', id, { status: newStatus });
        loadData();
        loadStats();
        alert(`城市「${city.name}」已${action}！`);
    }
}

// 删除城市
function deleteCity(id) {
    const city = getData('cities').find(c => c.id === id);
    if (!city) return;
    
    if (confirm(`确定要删除「${city.name}」吗？\n\n⚠️ 删除后该城市的相关数据将无法恢复！`)) {
        deleteData('cities', id);
        loadData();
        loadStats();
        loadProvinceFilter();
        alert(`城市「${city.name}」已删除！`);
    }
}
