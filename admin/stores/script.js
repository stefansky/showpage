// 门店管理页面脚本

let currentPage = 1;
const pageSize = 10;
let editingStoreId = null;
let currentStoreId = null;

// 省市区数据（简化版）
const regionData = {
    provinces: ['北京市', '上海市', '天津市', '重庆市', '广东省', '浙江省', '江苏省', '四川省', '湖北省', '湖南省', '山东省', '河南省', '福建省', '陕西省'],
    cities: {
        '北京市': ['北京市'],
        '上海市': ['上海市'],
        '广东省': ['广州市', '深圳市', '东莞市', '佛山市', '珠海市', '惠州市', '中山市'],
        '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '绍兴市'],
        '江苏省': ['南京市', '苏州市', '无锡市', '常州市', '南通市'],
        '四川省': ['成都市', '绵阳市', '德阳市'],
        '湖北省': ['武汉市', '宜昌市', '襄阳市'],
        '湖南省': ['长沙市', '株洲市', '湘潭市'],
        '山东省': ['济南市', '青岛市', '烟台市'],
        '河南省': ['郑州市', '洛阳市', '开封市'],
        '福建省': ['福州市', '厦门市', '泉州市'],
        '陕西省': ['西安市', '咸阳市', '宝鸡市']
    },
    districts: {
        '北京市': ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区', '通州区', '大兴区'],
        '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '浦东新区'],
        '广州市': ['天河区', '越秀区', '海珠区', '荔湾区', '白云区', '番禺区', '黄埔区'],
        '深圳市': ['福田区', '罗湖区', '南山区', '宝安区', '龙岗区', '龙华区', '坪山区'],
        '杭州市': ['上城区', '下城区', '江干区', '拱墅区', '西湖区', '滨江区', '余杭区', '萧山区'],
        '成都市': ['锦江区', '青羊区', '金牛区', '武侯区', '成华区', '龙泉驿区', '新都区'],
        '武汉市': ['江岸区', '江汉区', '硚口区', '汉阳区', '武昌区', '青山区', '洪山区']
    }
};

// 初始化Mock数据
function initStoreMockData() {
    const existingData = getData('stores');
    if (!existingData || existingData.length < 5) {
        const mockStores = [
            { 
                id: 1, 
                userId: 7, 
                merchantName: '阳光租房门店', 
                contactPerson: '张店长', 
                contactPhone: '13900139001', 
                password: '******',
                province: '北京市', 
                city: '北京市', 
                district: '朝阳区', 
                address: '建国路88号SOHO现代城', 
                longitude: 116.4551, 
                latitude: 39.9084,
                idCard: '110101198001011234',
                idCardFront: '',
                idCardBack: '',
                merchantType: 1, 
                description: '专业租房服务，真实房源，诚信经营', 
                isVerified: 1, 
                points: 256, 
                houseCount: 25, 
                status: 1, 
                createdAt: '2024-01-10 09:00:00',
                updatedAt: '2024-01-25 10:30:00'
            },
            { 
                id: 2, 
                userId: 9, 
                merchantName: '温馨家园公寓', 
                contactPerson: '李经理', 
                contactPhone: '13900139002', 
                password: '******',
                province: '北京市', 
                city: '北京市', 
                district: '海淀区', 
                address: '中关村大街1号海龙大厦', 
                longitude: 116.3183, 
                latitude: 39.9831,
                idCard: '110101198502021234',
                idCardFront: '',
                idCardBack: '',
                merchantType: 2, 
                description: '高品质公寓，拎包入住，管家服务', 
                isVerified: 1, 
                points: 180, 
                houseCount: 42, 
                status: 1, 
                createdAt: '2024-01-12 10:00:00',
                updatedAt: '2024-01-24 15:20:00'
            },
            { 
                id: 3, 
                userId: 11, 
                merchantName: '幸福家房产中介', 
                contactPerson: '王主管', 
                contactPhone: '13900139003', 
                password: '******',
                province: '上海市', 
                city: '上海市', 
                district: '浦东新区', 
                address: '陆家嘴环路1000号', 
                longitude: 121.5055, 
                latitude: 31.2365,
                idCard: '310101199003031234',
                idCardFront: '',
                idCardBack: '',
                merchantType: 1, 
                description: '浦东专业租房中介，服务周到', 
                isVerified: 1, 
                points: 320, 
                houseCount: 38, 
                status: 1, 
                createdAt: '2024-01-15 08:00:00',
                updatedAt: '2024-01-23 09:15:00'
            },
            { 
                id: 4, 
                userId: null, 
                merchantName: '青年公寓连锁', 
                contactPerson: '赵总', 
                contactPhone: '13900139004', 
                password: '******',
                province: '广东省', 
                city: '深圳市', 
                district: '南山区', 
                address: '科技园南区科苑路15号', 
                longitude: 113.9492, 
                latitude: 22.5363,
                idCard: '440301199104041234',
                idCardFront: '',
                idCardBack: '',
                merchantType: 2, 
                description: '专为年轻人打造的品质公寓', 
                isVerified: 0, 
                points: 50, 
                houseCount: 68, 
                status: 1, 
                createdAt: '2024-01-18 14:30:00',
                updatedAt: '2024-01-22 11:00:00'
            },
            { 
                id: 5, 
                userId: null, 
                merchantName: '好房源中介', 
                contactPerson: '孙店长', 
                contactPhone: '13900139005', 
                password: '******',
                province: '浙江省', 
                city: '杭州市', 
                district: '西湖区', 
                address: '文三路478号华星科技大厦', 
                longitude: 120.1299, 
                latitude: 30.2707,
                idCard: '',
                idCardFront: '',
                idCardBack: '',
                merchantType: 1, 
                description: '杭州西湖区专业租房服务', 
                isVerified: 0, 
                points: 15, 
                houseCount: 12, 
                status: 0, 
                createdAt: '2024-01-20 16:45:00',
                updatedAt: '2024-01-21 09:00:00'
            },
            { 
                id: 6, 
                userId: null, 
                merchantName: '安居乐公寓', 
                contactPerson: '周经理', 
                contactPhone: '13900139006', 
                password: '******',
                province: '四川省', 
                city: '成都市', 
                district: '武侯区', 
                address: '天府大道中段666号', 
                longitude: 104.0668, 
                latitude: 30.5398,
                idCard: '510107199205051234',
                idCardFront: '',
                idCardBack: '',
                merchantType: 2, 
                description: '成都高端公寓品牌', 
                isVerified: 1, 
                points: 420, 
                houseCount: 85, 
                status: 1, 
                createdAt: '2024-01-22 10:00:00',
                updatedAt: '2024-01-25 08:30:00'
            },
        ];
        saveData('stores', mockStores);
    }
}

function initPage() {
    initStoreMockData();
    loadStats();
    loadData();
    initFormTabs();
    initProvinceSelect();
    
    document.getElementById('addStoreBtn')?.addEventListener('click', () => openStoreModal());
    document.getElementById('searchInput')?.addEventListener('input', debounce(() => { currentPage = 1; loadData(); }, 300));
    document.getElementById('typeFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
    document.getElementById('verifyFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
    document.getElementById('statusFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
    
    // 省市区联动
    document.getElementById('province')?.addEventListener('change', handleProvinceChange);
    document.getElementById('city')?.addEventListener('change', handleCityChange);
    
    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.action-dropdown')) {
            document.querySelectorAll('.action-dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 初始化表单tab
function initFormTabs() {
    document.querySelectorAll('.form-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`section-${tabName}`).classList.add('active');
        });
    });
}

// 初始化省份选择
function initProvinceSelect() {
    const provinceSelect = document.getElementById('province');
    if (!provinceSelect) return;
    
    regionData.provinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
    });
}

// 处理省份变化
function handleProvinceChange() {
    const province = document.getElementById('province').value;
    const citySelect = document.getElementById('city');
    const districtSelect = document.getElementById('district');
    
    // 清空城市和区县
    citySelect.innerHTML = '<option value="">请选择城市</option>';
    districtSelect.innerHTML = '<option value="">请选择区县</option>';
    
    if (province && regionData.cities[province]) {
        regionData.cities[province].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

// 处理城市变化
function handleCityChange() {
    const city = document.getElementById('city').value;
    const districtSelect = document.getElementById('district');
    
    districtSelect.innerHTML = '<option value="">请选择区县</option>';
    
    if (city && regionData.districts[city]) {
        regionData.districts[city].forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    }
}

// 加载统计数据
function loadStats() {
    const stores = getData('stores');
    const activeStores = stores.filter(s => s.status === 1).length;
    const verifiedStores = stores.filter(s => s.isVerified === 1).length;
    const totalHouses = stores.reduce((sum, s) => sum + (s.houseCount || 0), 0);
    
    document.getElementById('totalStores').textContent = stores.length;
    document.getElementById('activeStores').textContent = activeStores;
    document.getElementById('verifiedStores').textContent = verifiedStores;
    document.getElementById('totalHouses').textContent = totalHouses;
}

// 加载门店数据
function loadData() {
    const stores = getData('stores');
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const verifyFilter = document.getElementById('verifyFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    let filtered = [...stores];
    
    if (searchInput?.value) {
        const keyword = searchInput.value.toLowerCase();
        filtered = filtered.filter(s => 
            s.merchantName.toLowerCase().includes(keyword) || 
            s.contactPerson.toLowerCase().includes(keyword) ||
            s.contactPhone.includes(keyword)
        );
    }
    
    if (typeFilter?.value) {
        filtered = filtered.filter(s => s.merchantType === parseInt(typeFilter.value));
    }
    
    if (verifyFilter?.value) {
        filtered = filtered.filter(s => s.isVerified === parseInt(verifyFilter.value));
    }
    
    if (statusFilter?.value) {
        filtered = filtered.filter(s => s.status === parseInt(statusFilter.value));
    }
    
    // 按ID倒序
    filtered.sort((a, b) => b.id - a.id);
    
    const total = filtered.length;
    const start = (currentPage - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);
    
    displayData(paginated);
    createPagination(total, currentPage, pageSize, (page) => {
        currentPage = page;
        loadData();
    });
}

// 显示门店数据
function displayData(stores) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    if (stores.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-store" style="font-size: 32px; margin-bottom: 12px; display: block; color: #e0e0e0;"></i>
                    暂无门店数据
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = stores.map(store => `
        <tr>
            <td>${store.id}</td>
            <td>
                <div class="store-cell">
                    <div class="store-icon ${store.merchantType === 1 ? 'agency' : 'apartment'}">
                        <i class="fas fa-${store.merchantType === 1 ? 'handshake' : 'building'}"></i>
                    </div>
                    <div class="store-info-cell">
                        <span class="store-name">${store.merchantName}</span>
                        <span class="store-desc">${store.description || '-'}</span>
                    </div>
                </div>
            </td>
            <td>
                <div class="contact-cell">
                    <span class="contact-name">${store.contactPerson}</span>
                    <span class="contact-phone">${store.contactPhone}</span>
                </div>
            </td>
            <td class="area-cell">${store.province} ${store.city} ${store.district}</td>
            <td>
                <span class="type-badge ${store.merchantType === 1 ? 'agency' : 'apartment'}">
                    <i class="fas fa-${store.merchantType === 1 ? 'handshake' : 'building'}"></i>
                    ${store.merchantType === 1 ? '中介' : '公寓'}
                </span>
            </td>
            <td>${store.houseCount || 0}</td>
            <td>
                <span class="points-cell">
                    <i class="fas fa-coins"></i>
                    ${store.points || 0}
                </span>
            </td>
            <td>
                <span class="status-badge ${store.isVerified === 1 ? 'verified' : 'unverified'}">
                    ${store.isVerified === 1 ? '已认证' : '未认证'}
                </span>
            </td>
            <td>
                <span class="status-badge ${store.status === 1 ? 'active' : 'rejected'}">
                    ${store.status === 1 ? '正常' : '禁用'}
                </span>
            </td>
            <td>${store.createdAt}</td>
            <td>
                <div class="action-dropdown">
                    <button class="action-dropdown-btn" onclick="toggleDropdown(event, ${store.id})">
                        操作 <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="action-dropdown-menu" id="dropdown-${store.id}">
                        <div class="action-dropdown-item" onclick="viewStore(${store.id})">
                            <i class="fas fa-eye"></i> 查看详情
                        </div>
                        <div class="action-dropdown-item" onclick="editStore(${store.id})">
                            <i class="fas fa-edit"></i> 编辑门店
                        </div>
                        <div class="action-dropdown-item" onclick="openPointsModal(${store.id})">
                            <i class="fas fa-coins"></i> 房豆操作
                        </div>
                        <div class="action-dropdown-item" onclick="toggleVerify(${store.id})">
                            <i class="fas fa-${store.isVerified === 1 ? 'times-circle' : 'check-circle'}"></i> 
                            ${store.isVerified === 1 ? '取消认证' : '通过认证'}
                        </div>
                        <div class="action-dropdown-item" onclick="toggleStatus(${store.id})">
                            <i class="fas fa-${store.status === 1 ? 'ban' : 'check'}"></i> 
                            ${store.status === 1 ? '禁用门店' : '启用门店'}
                        </div>
                        <div class="action-dropdown-item danger" onclick="deleteStore(${store.id})">
                            <i class="fas fa-trash"></i> 删除门店
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    `).join('');
}

// 切换下拉菜单
function toggleDropdown(event, storeId) {
    event.stopPropagation();
    const menu = document.getElementById(`dropdown-${storeId}`);
    const isShow = menu.classList.contains('show');
    
    document.querySelectorAll('.action-dropdown-menu').forEach(m => {
        m.classList.remove('show');
    });
    
    if (!isShow) {
        menu.classList.add('show');
    }
}

// 打开新增/编辑弹窗
function openStoreModal(storeId = null) {
    editingStoreId = storeId;
    resetForm();
    
    if (storeId) {
        document.getElementById('modalTitle').textContent = '编辑门店';
        document.getElementById('passwordHint').textContent = '留空则不修改密码';
        
        const store = getData('stores').find(s => s.id === storeId);
        if (store) {
            fillForm(store);
        }
    } else {
        document.getElementById('modalTitle').textContent = '新增门店';
        document.getElementById('passwordHint').textContent = '用于商家端小程序登录';
    }
    
    // 切换到第一个tab
    document.querySelectorAll('.form-tab')[0].click();
    
    document.getElementById('storeModal').classList.add('show');
}

// 关闭弹窗
function closeStoreModal() {
    document.getElementById('storeModal').classList.remove('show');
    editingStoreId = null;
}

// 重置表单
function resetForm() {
    document.getElementById('merchantName').value = '';
    document.getElementById('merchantType').value = '';
    document.getElementById('contactPerson').value = '';
    document.getElementById('contactPhone').value = '';
    document.getElementById('password').value = '';
    document.getElementById('userId').value = '';
    document.getElementById('description').value = '';
    document.getElementById('province').value = '';
    document.getElementById('city').innerHTML = '<option value="">请选择城市</option>';
    document.getElementById('district').innerHTML = '<option value="">请选择区县</option>';
    document.getElementById('address').value = '';
    document.getElementById('longitude').value = '';
    document.getElementById('latitude').value = '';
    document.getElementById('idCard').value = '';
    document.querySelector('input[name="isVerified"][value="0"]').checked = true;
    document.getElementById('points').value = '0';
    document.querySelector('input[name="status"][value="1"]').checked = true;
}

// 填充表单
function fillForm(store) {
    document.getElementById('merchantName').value = store.merchantName || '';
    document.getElementById('merchantType').value = store.merchantType || '';
    document.getElementById('contactPerson').value = store.contactPerson || '';
    document.getElementById('contactPhone').value = store.contactPhone || '';
    document.getElementById('userId').value = store.userId || '';
    document.getElementById('description').value = store.description || '';
    document.getElementById('province').value = store.province || '';
    
    // 触发省份变化以加载城市
    if (store.province) {
        handleProvinceChange();
        document.getElementById('city').value = store.city || '';
        
        // 触发城市变化以加载区县
        if (store.city) {
            handleCityChange();
            document.getElementById('district').value = store.district || '';
        }
    }
    
    document.getElementById('address').value = store.address || '';
    document.getElementById('longitude').value = store.longitude || '';
    document.getElementById('latitude').value = store.latitude || '';
    document.getElementById('idCard').value = store.idCard || '';
    document.querySelector(`input[name="isVerified"][value="${store.isVerified}"]`).checked = true;
    document.getElementById('points').value = store.points || 0;
    document.querySelector(`input[name="status"][value="${store.status}"]`).checked = true;
}

// 模拟获取坐标
function simulateGetLocation() {
    const mockCoords = [
        { lng: 116.4074, lat: 39.9042, name: '北京' },
        { lng: 121.4737, lat: 31.2304, name: '上海' },
        { lng: 113.2644, lat: 23.1291, name: '广州' },
        { lng: 114.0579, lat: 22.5431, name: '深圳' },
        { lng: 120.1551, lat: 30.2741, name: '杭州' }
    ];
    
    const random = mockCoords[Math.floor(Math.random() * mockCoords.length)];
    document.getElementById('longitude').value = random.lng;
    document.getElementById('latitude').value = random.lat;
    alert(`已模拟获取${random.name}的坐标`);
}

// 保存门店
function saveStore() {
    const merchantName = document.getElementById('merchantName').value.trim();
    const merchantType = document.getElementById('merchantType').value;
    const contactPerson = document.getElementById('contactPerson').value.trim();
    const contactPhone = document.getElementById('contactPhone').value.trim();
    const password = document.getElementById('password').value;
    const province = document.getElementById('province').value;
    const city = document.getElementById('city').value;
    const district = document.getElementById('district').value;
    const address = document.getElementById('address').value.trim();
    
    // 验证必填字段
    if (!merchantName) { alert('请输入门店名称'); return; }
    if (!merchantType) { alert('请选择商家类型'); return; }
    if (!contactPerson) { alert('请输入店长姓名'); return; }
    if (!contactPhone) { alert('请输入联系电话'); return; }
    if (!editingStoreId && !password) { alert('请输入登录密码'); return; }
    if (!province || !city || !district) { alert('请选择完整的省市区'); return; }
    if (!address) { alert('请输入详细地址'); return; }
    
    const storeData = {
        merchantName,
        merchantType: parseInt(merchantType),
        contactPerson,
        contactPhone,
        userId: document.getElementById('userId').value || null,
        description: document.getElementById('description').value.trim(),
        province,
        city,
        district,
        address,
        longitude: parseFloat(document.getElementById('longitude').value) || null,
        latitude: parseFloat(document.getElementById('latitude').value) || null,
        idCard: document.getElementById('idCard').value.trim(),
        isVerified: parseInt(document.querySelector('input[name="isVerified"]:checked').value),
        points: parseInt(document.getElementById('points').value) || 0,
        status: parseInt(document.querySelector('input[name="status"]:checked').value),
        updatedAt: formatDateTime()
    };
    
    if (password) {
        storeData.password = '******'; // 实际项目中需要加密
    }
    
    if (editingStoreId) {
        updateData('stores', editingStoreId, storeData);
        alert('门店信息更新成功！');
    } else {
        storeData.createdAt = formatDateTime();
        storeData.houseCount = 0;
        addData('stores', storeData);
        alert('门店添加成功！');
    }
    
    closeStoreModal();
    loadData();
    loadStats();
}

// 编辑门店
function editStore(id) {
    openStoreModal(id);
}

// 查看门店详情
function viewStore(id) {
    const store = getData('stores').find(s => s.id === id);
    if (!store) return;
    
    const detailBody = document.getElementById('detailBody');
    detailBody.innerHTML = `
        <div class="detail-header">
            <div class="detail-store-icon ${store.merchantType === 1 ? 'agency' : 'apartment'}">
                <i class="fas fa-${store.merchantType === 1 ? 'handshake' : 'building'}"></i>
            </div>
            <div class="detail-store-info">
                <h3>${store.merchantName}</h3>
                <div class="detail-store-meta">
                    <span class="detail-meta-item">
                        <i class="fas fa-${store.merchantType === 1 ? 'handshake' : 'building'}"></i>
                        ${store.merchantType === 1 ? '中介门店' : '公寓门店'}
                    </span>
                    <span class="detail-meta-item">
                        <i class="fas fa-home"></i>
                        ${store.houseCount || 0} 套房源
                    </span>
                    <span class="detail-meta-item">
                        <i class="fas fa-coins"></i>
                        ${store.points || 0} 房豆
                    </span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">基本信息</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">门店ID</span>
                    <span class="detail-value">${store.id}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">关联用户ID</span>
                    <span class="detail-value">${store.userId || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">店长姓名</span>
                    <span class="detail-value">${store.contactPerson}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">联系电话</span>
                    <span class="detail-value">${store.contactPhone}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">认证状态</span>
                    <span class="detail-value">${store.isVerified === 1 ? '✅ 已认证' : '❌ 未认证'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">门店状态</span>
                    <span class="detail-value">${store.status === 1 ? '✅ 正常' : '⛔ 禁用'}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">位置信息</div>
            <div class="detail-grid">
                <div class="detail-item" style="grid-column: 1/-1;">
                    <span class="detail-label">所在区域</span>
                    <span class="detail-value">${store.province} ${store.city} ${store.district}</span>
                </div>
                <div class="detail-item" style="grid-column: 1/-1;">
                    <span class="detail-label">详细地址</span>
                    <span class="detail-value">${store.address}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">经度</span>
                    <span class="detail-value code">${store.longitude || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">纬度</span>
                    <span class="detail-value code">${store.latitude || '-'}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">认证信息</div>
            <div class="detail-grid">
                <div class="detail-item" style="grid-column: 1/-1;">
                    <span class="detail-label">身份证号</span>
                    <span class="detail-value code">${store.idCard ? maskIdCard(store.idCard) : '-'}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">门店简介</div>
            <p style="font-size: 14px; color: #666; line-height: 1.6;">${store.description || '暂无简介'}</p>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">时间信息</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">创建时间</span>
                    <span class="detail-value">${store.createdAt}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">更新时间</span>
                    <span class="detail-value">${store.updatedAt}</span>
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

// 脱敏身份证号
function maskIdCard(idCard) {
    if (!idCard || idCard.length < 18) return idCard;
    return idCard.substring(0, 6) + '********' + idCard.substring(14);
}

// 打开房豆操作弹窗
function openPointsModal(id) {
    const store = getData('stores').find(s => s.id === id);
    if (!store) return;
    
    currentStoreId = id;
    
    document.getElementById('storePointsInfo').innerHTML = `
        <span class="store-name">${store.merchantName}</span>
        <span class="current-points"><i class="fas fa-coins"></i> ${store.points || 0}</span>
    `;
    
    document.getElementById('pointsAmount').value = '';
    document.getElementById('pointsReason').value = '';
    document.querySelector('input[name="pointsAction"][value="add"]').checked = true;
    
    document.getElementById('pointsModal').classList.add('show');
}

// 关闭房豆弹窗
function closePointsModal() {
    document.getElementById('pointsModal').classList.remove('show');
    currentStoreId = null;
}

// 确认房豆操作
function confirmPointsAction() {
    if (!currentStoreId) return;
    
    const action = document.querySelector('input[name="pointsAction"]:checked').value;
    const amount = parseInt(document.getElementById('pointsAmount').value);
    const reason = document.getElementById('pointsReason').value.trim();
    
    if (!amount || amount <= 0) {
        alert('请输入有效的房豆数量');
        return;
    }
    
    const store = getData('stores').find(s => s.id === currentStoreId);
    if (!store) return;
    
    let newPoints = store.points || 0;
    
    if (action === 'add') {
        newPoints += amount;
    } else {
        if (amount > newPoints) {
            alert('扣减数量不能超过当前房豆余额');
            return;
        }
        newPoints -= amount;
    }
    
    updateData('stores', currentStoreId, { points: newPoints, updatedAt: formatDateTime() });
    
    alert(`${action === 'add' ? '充值' : '扣减'}成功！当前房豆：${newPoints}`);
    closePointsModal();
    loadData();
}

// 切换认证状态
function toggleVerify(id) {
    const store = getData('stores').find(s => s.id === id);
    if (!store) return;
    
    const newVerified = store.isVerified === 1 ? 0 : 1;
    const action = newVerified === 1 ? '通过认证' : '取消认证';
    
    if (confirm(`确定要${action}「${store.merchantName}」吗？`)) {
        updateData('stores', id, { isVerified: newVerified, updatedAt: formatDateTime() });
        loadData();
        loadStats();
        alert(`已${action}！`);
    }
}

// 切换门店状态
function toggleStatus(id) {
    const store = getData('stores').find(s => s.id === id);
    if (!store) return;
    
    const newStatus = store.status === 1 ? 0 : 1;
    const action = newStatus === 1 ? '启用' : '禁用';
    
    if (confirm(`确定要${action}门店「${store.merchantName}」吗？\n\n${newStatus === 0 ? '禁用后该门店将无法正常运营。' : '启用后该门店可以正常运营。'}`)) {
        updateData('stores', id, { status: newStatus, updatedAt: formatDateTime() });
        loadData();
        loadStats();
        alert(`门店已${action}！`);
    }
}

// 删除门店
function deleteStore(id) {
    const store = getData('stores').find(s => s.id === id);
    if (!store) return;
    
    if (confirm(`⚠️ 确定要删除门店「${store.merchantName}」吗？\n\n此操作不可恢复，门店的所有数据将被清除。`)) {
        deleteData('stores', id);
        loadData();
        loadStats();
        alert('门店已删除！');
    }
}
