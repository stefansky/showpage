// 房源管理页面脚本

let currentPage = 1;
const pageSize = 10;
let editingHouseId = null;
let currentHouseId = null;
let uploadedImages = []; // 上传的图片列表
let currentCarouselIndex = 0;

// 省市区数据
const regionData = {
    provinces: ['北京市', '上海市', '广东省', '浙江省', '江苏省', '四川省', '湖北省'],
    cities: {
        '北京市': ['北京市'], '上海市': ['上海市'],
        '广东省': ['广州市', '深圳市', '东莞市', '佛山市'],
        '浙江省': ['杭州市', '宁波市', '温州市'],
        '江苏省': ['南京市', '苏州市', '无锡市'],
        '四川省': ['成都市', '绵阳市'],
        '湖北省': ['武汉市', '宜昌市']
    },
    districts: {
        '北京市': ['东城区', '西城区', '朝阳区', '海淀区', '丰台区'],
        '上海市': ['黄浦区', '徐汇区', '长宁区', '浦东新区'],
        '广州市': ['天河区', '越秀区', '海珠区', '白云区'],
        '深圳市': ['福田区', '罗湖区', '南山区', '宝安区'],
        '杭州市': ['上城区', '西湖区', '滨江区', '余杭区'],
        '成都市': ['锦江区', '武侯区', '成华区'],
        '武汉市': ['江岸区', '武昌区', '洪山区']
    }
};

// Mock图片
const mockImages = [
    'https://picsum.photos/400/300?random=1',
    'https://picsum.photos/400/300?random=2',
    'https://picsum.photos/400/300?random=3'
];

// 初始化Mock数据
function initHouseMockData() {
    const existingData = getData('houses');
    if (!existingData || existingData.length < 5) {
        const mockHouses = [
            { id: 1, publisherType: 2, publisherId: 4, publisherName: '赵六', title: '精装两室一厅 近地铁', rentMode: 1, roomCount: 2, roomType: null, rentType: 2, province: '北京市', city: '北京市', district: '朝阳区', address: '国贸CBD 华贸公寓', longitude: 116.4609, latitude: 39.9093, area: 85, floor: 18, rentPrice: 6500, images: mockImages, description: '精装修两室一厅，南北通透', contactPhone: '13800138004', availableDate: '2024-02-01', status: 1, createdAt: '2024-01-20 10:00:00', updatedAt: '2024-01-20 10:00:00' },
            { id: 2, publisherType: 1, publisherId: 1, publisherName: '张三', title: '次卧转租 限女生', rentMode: 2, roomCount: null, roomType: 2, rentType: 1, province: '北京市', city: '北京市', district: '海淀区', address: '中关村 西山壹号', longitude: 116.2869, latitude: 40.0513, area: 15, floor: 12, rentPrice: 2200, images: [], description: '因工作调动转租次卧', contactPhone: '13800138001', availableDate: '2024-02-15', status: 0, createdAt: '2024-01-21 14:30:00', updatedAt: '2024-01-21 14:30:00' },
            { id: 3, publisherType: 3, publisherId: 1, publisherName: '阳光租房门店', title: '三室两厅 南北通透', rentMode: 1, roomCount: 3, roomType: null, rentType: 2, province: '北京市', city: '北京市', district: '朝阳区', address: '望京 望京花园', longitude: 116.4803, latitude: 40.0017, area: 120, floor: 25, rentPrice: 9800, images: mockImages.slice(0,2), description: '望京核心地段', contactPhone: '13900139001', availableDate: '2024-02-01', status: 1, createdAt: '2024-01-22 09:15:00', updatedAt: '2024-01-22 09:15:00' },
            { id: 4, publisherType: 3, publisherId: 2, publisherName: '温馨家园公寓', title: '品牌公寓 主卧带卫', rentMode: 2, roomCount: null, roomType: 1, rentType: 2, province: '上海市', city: '上海市', district: '浦东新区', address: '陆家嘴附近', longitude: 121.4994, latitude: 31.2396, area: 25, floor: 8, rentPrice: 4500, images: mockImages, description: '品牌公寓，主卧带独卫', contactPhone: '13900139002', availableDate: '2024-01-25', status: 1, createdAt: '2024-01-18 16:20:00', updatedAt: '2024-01-23 11:00:00' },
            { id: 5, publisherType: 2, publisherId: 7, publisherName: '周九', title: '一室一厅 精装修', rentMode: 1, roomCount: 1, roomType: null, rentType: 2, province: '广东省', city: '深圳市', district: '南山区', address: '科技园', longitude: 113.9492, latitude: 22.5282, area: 55, floor: 15, rentPrice: 5800, images: [], description: '科技园核心位置', contactPhone: '13800138007', availableDate: '2024-02-10', status: 0, createdAt: '2024-01-23 10:00:00', updatedAt: '2024-01-23 10:00:00' },
            { id: 6, publisherType: 1, publisherId: 3, publisherName: '王小美', title: '主卧转租 近地铁', rentMode: 2, roomCount: null, roomType: 1, rentType: 1, province: '浙江省', city: '杭州市', district: '西湖区', address: '文三路', longitude: 120.1284, latitude: 30.2722, area: 18, floor: 6, rentPrice: 1800, images: mockImages.slice(0,1), description: '浙大附近主卧转租', contactPhone: '13800138003', availableDate: '2024-03-01', status: 3, createdAt: '2024-01-19 11:00:00', updatedAt: '2024-01-24 15:00:00' },
        ];
        saveData('houses', mockHouses);
    }
}

function initPage() {
    initHouseMockData();
    loadStats();
    loadData();
    initFormTabs();
    initProvinceSelect();
    initReviewListener();
    
    document.getElementById('addHouseBtn')?.addEventListener('click', () => openHouseModal());
    document.getElementById('searchInput')?.addEventListener('input', debounce(() => { currentPage = 1; loadData(); }, 300));
    document.getElementById('publisherTypeFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
    document.getElementById('rentModeFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
    document.getElementById('statusFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
    
    document.getElementById('uploadAddBtn')?.addEventListener('click', function() {
        this.querySelector('input[type="file"]').click();
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.action-dropdown')) {
            document.querySelectorAll('.action-dropdown-menu').forEach(menu => menu.classList.remove('show'));
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function initFormTabs() {
    document.querySelectorAll('.form-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`section-${tab.dataset.tab}`).classList.add('active');
        });
    });
}

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

function initReviewListener() {
    document.querySelectorAll('input[name="reviewAction"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.getElementById('rejectReasonBox').style.display = 
                document.querySelector('input[name="reviewAction"]:checked').value === 'reject' ? 'block' : 'none';
        });
    });
}

function handleProvinceChange() {
    const province = document.getElementById('province').value;
    const citySelect = document.getElementById('city');
    const districtSelect = document.getElementById('district');
    citySelect.innerHTML = '<option value="">请选择城市</option>';
    districtSelect.innerHTML = '<option value="">请选择区县</option>';
    if (province && regionData.cities[province]) {
        regionData.cities[province].forEach(city => {
            citySelect.innerHTML += `<option value="${city}">${city}</option>`;
        });
    }
}

function handleCityChange() {
    const city = document.getElementById('city').value;
    const districtSelect = document.getElementById('district');
    districtSelect.innerHTML = '<option value="">请选择区县</option>';
    if (city && regionData.districts[city]) {
        regionData.districts[city].forEach(district => {
            districtSelect.innerHTML += `<option value="${district}">${district}</option>`;
        });
    }
}

function handlePublisherTypeChange() {
    const publisherType = document.getElementById('publisherType').value;
    const publisherSelect = document.getElementById('publisherId');
    const publisherHint = document.getElementById('publisherHint');
    publisherSelect.innerHTML = '<option value="">请选择</option>';
    
    if (publisherType === '1' || publisherType === '2') {
        const users = getData('users');
        const filtered = users.filter(u => (publisherType === '1' && u.role === 'tenant') || (publisherType === '2' && u.role === 'landlord'));
        filtered.forEach(user => {
            publisherSelect.innerHTML += `<option value="${user.id}">${user.nickname} (${user.phone})</option>`;
        });
        publisherHint.textContent = publisherType === '1' ? '选择转租的租客用户' : '选择直租的房东用户';
    } else if (publisherType === '3') {
        const stores = getData('stores');
        stores.forEach(store => {
            publisherSelect.innerHTML += `<option value="${store.id}">${store.merchantName}</option>`;
        });
        publisherHint.textContent = '选择发布房源的门店';
    }
}

function handleRentModeChange() {
    const rentMode = document.querySelector('input[name="rentMode"]:checked')?.value;
    document.getElementById('roomCountRow').style.display = rentMode === '1' ? 'grid' : 'none';
    document.getElementById('roomTypeRow').style.display = rentMode === '2' ? 'grid' : 'none';
}

function loadStats() {
    const houses = getData('houses');
    document.getElementById('totalHouses').textContent = houses.length;
    document.getElementById('pendingHouses').textContent = houses.filter(h => h.status === 0).length;
    document.getElementById('activeHouses').textContent = houses.filter(h => h.status === 1).length;
    document.getElementById('rentedHouses').textContent = houses.filter(h => h.status === 3).length;
}

function loadData() {
    const houses = getData('houses');
    let filtered = [...houses];
    const searchVal = document.getElementById('searchInput')?.value?.toLowerCase();
    const typeVal = document.getElementById('publisherTypeFilter')?.value;
    const modeVal = document.getElementById('rentModeFilter')?.value;
    const statusVal = document.getElementById('statusFilter')?.value;
    
    if (searchVal) filtered = filtered.filter(h => h.title.toLowerCase().includes(searchVal) || h.address.toLowerCase().includes(searchVal));
    if (typeVal) filtered = filtered.filter(h => h.publisherType === parseInt(typeVal));
    if (modeVal) filtered = filtered.filter(h => h.rentMode === parseInt(modeVal));
    if (statusVal) filtered = filtered.filter(h => h.status === parseInt(statusVal));
    
    filtered.sort((a, b) => b.id - a.id);
    const total = filtered.length;
    const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    displayData(paginated);
    createPagination(total, currentPage, pageSize, (page) => { currentPage = page; loadData(); });
}

function displayData(houses) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    if (houses.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" style="text-align:center;padding:40px;color:#999;"><i class="fas fa-home" style="font-size:32px;margin-bottom:12px;display:block;color:#e0e0e0;"></i>暂无房源数据</td></tr>`;
        return;
    }
    tbody.innerHTML = houses.map(h => `
        <tr>
            <td>${h.id}</td>
            <td class="house-title-cell">${h.title}</td>
            <td class="location-cell">${h.district} ${h.address.substring(0,10)}...</td>
            <td><span class="type-tag ${h.rentMode===1?'whole':'shared'}">${h.rentMode===1?'整租':'合租'}</span></td>
            <td><span class="type-tag ${getRoomTypeClass(h)}">${getRoomText(h)}</span></td>
            <td><span class="type-tag ${h.rentType===1?'sublease':'direct'}">${h.rentType===1?'转租':'直租'}</span></td>
            <td class="price-cell">¥${h.rentPrice}<span>/月</span></td>
            <td><div class="publisher-cell"><span class="publisher-name">${h.publisherName}</span></div></td>
            <td><span class="status-badge ${getStatusClass(h.status)}">${getStatusText(h.status)}</span></td>
            <td>${h.createdAt}</td>
            <td>
                <div class="action-dropdown">
                    <button class="action-dropdown-btn" onclick="toggleDropdown(event,${h.id})">操作 <i class="fas fa-chevron-down"></i></button>
                    <div class="action-dropdown-menu" id="dropdown-${h.id}">
                        <div class="action-dropdown-item" onclick="viewHouse(${h.id})"><i class="fas fa-eye"></i> 查看详情</div>
                        <div class="action-dropdown-item" onclick="editHouse(${h.id})"><i class="fas fa-edit"></i> 编辑房源</div>
                        ${h.status===0?`<div class="action-dropdown-item success" onclick="openReviewModal(${h.id})"><i class="fas fa-check-circle"></i> 审核</div>`:''}
                        ${h.status===1?`<div class="action-dropdown-item" onclick="changeStatus(${h.id},2)"><i class="fas fa-arrow-down"></i> 下架</div><div class="action-dropdown-item" onclick="changeStatus(${h.id},3)"><i class="fas fa-handshake"></i> 已出租</div>`:''}
                        ${h.status===2?`<div class="action-dropdown-item success" onclick="changeStatus(${h.id},1)"><i class="fas fa-arrow-up"></i> 上架</div>`:''}
                        <div class="action-dropdown-item danger" onclick="deleteHouse(${h.id})"><i class="fas fa-trash"></i> 删除</div>
                    </div>
                </div>
            </td>
        </tr>
    `).join('');
}

function toggleDropdown(e, id) { e.stopPropagation(); const m = document.getElementById(`dropdown-${id}`); const show = m.classList.contains('show'); document.querySelectorAll('.action-dropdown-menu').forEach(x => x.classList.remove('show')); if (!show) m.classList.add('show'); }
function getPublisherText(t) { return {1:'租客转租',2:'房东直租',3:'商家'}[t]||''; }
function getPublisherClass(t) { return {1:'tenant',2:'landlord',3:'merchant'}[t]||''; }
function getRoomText(h) { return h.rentMode===1?{1:'1室',2:'2室',3:'3室',4:'4室+'}[h.roomCount]||'-':{1:'主卧',2:'次卧',3:'其他'}[h.roomType]||'-'; }
function getRoomTypeClass(h) { return h.rentMode===1?'whole':{1:'master',2:'second',3:'other'}[h.roomType]||'other'; }
function getStatusText(s) { return {0:'审核中',1:'已上架',2:'已下架',3:'已出租',4:'已过期'}[s]||''; }
function getStatusClass(s) { return {0:'pending',1:'active',2:'rejected',3:'verified',4:'unverified'}[s]||''; }

// 图片上传处理
function handleImageUpload(e) {
    const files = e.target.files;
    for (let i = 0; i < files.length && uploadedImages.length < 9; i++) {
        const reader = new FileReader();
        reader.onload = function(ev) {
            uploadedImages.push(ev.target.result);
            renderImageGrid();
        };
        reader.readAsDataURL(files[i]);
    }
    e.target.value = '';
}

function renderImageGrid() {
    const grid = document.getElementById('imageUploadGrid');
    grid.innerHTML = uploadedImages.map((img, i) => `
        <div class="image-item">
            <img src="${img}" alt="房源图片">
            ${i === 0 ? '<span class="cover-badge">封面</span>' : `<button class="set-cover-btn" onclick="setCover(${i})">设为封面</button>`}
            <button class="delete-btn" onclick="deleteImage(${i})"><i class="fas fa-times"></i></button>
        </div>
    `).join('');
}

function setCover(index) {
    const img = uploadedImages.splice(index, 1)[0];
    uploadedImages.unshift(img);
    renderImageGrid();
}

function deleteImage(index) {
    uploadedImages.splice(index, 1);
    renderImageGrid();
}

function simulateGetLocation() {
    const coords = [{lng:116.4074,lat:39.9042,n:'北京'},{lng:121.4737,lat:31.2304,n:'上海'},{lng:113.2644,lat:23.1291,n:'广州'}];
    const r = coords[Math.floor(Math.random() * coords.length)];
    document.getElementById('longitude').value = r.lng;
    document.getElementById('latitude').value = r.lat;
    alert(`已模拟获取${r.n}坐标`);
}

function openHouseModal(id = null) {
    editingHouseId = id;
    resetForm();
    if (id) {
        document.getElementById('modalTitle').textContent = '编辑房源';
        const h = getData('houses').find(x => x.id === id);
        if (h) fillForm(h);
    } else {
        document.getElementById('modalTitle').textContent = '录入房源';
    }
    document.querySelectorAll('.form-tab')[0].click();
    document.getElementById('houseModal').classList.add('show');
}

function closeHouseModal() { document.getElementById('houseModal').classList.remove('show'); editingHouseId = null; }

function resetForm() {
    uploadedImages = [];
    renderImageGrid();
    ['publisherType','title','roomCount','roomType','contactPhone','contactPhone2','province','address','longitude','latitude','rentPrice','area','floor','availableDate','description'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    document.getElementById('publisherId').innerHTML = '<option value="">请先选择发布者类型</option>';
    document.getElementById('city').innerHTML = '<option value="">请选择城市</option>';
    document.getElementById('district').innerHTML = '<option value="">请选择区县</option>';
    document.getElementById('status').value = '0';
    document.querySelectorAll('input[name="rentMode"],input[name="rentType"]').forEach(r => r.checked = false);
    document.getElementById('roomCountRow').style.display = 'none';
    document.getElementById('roomTypeRow').style.display = 'none';
}

function fillForm(h) {
    document.getElementById('publisherType').value = h.publisherType;
    handlePublisherTypeChange();
    document.getElementById('publisherId').value = h.publisherId;
    document.getElementById('title').value = h.title;
    if (h.rentMode) { document.querySelector(`input[name="rentMode"][value="${h.rentMode}"]`).checked = true; handleRentModeChange(); }
    if (h.rentType) document.querySelector(`input[name="rentType"][value="${h.rentType}"]`).checked = true;
    document.getElementById('roomCount').value = h.roomCount || '';
    document.getElementById('roomType').value = h.roomType || '';
    document.getElementById('contactPhone').value = h.contactPhone || '';
    document.getElementById('contactPhone2').value = h.contactPhone || '';
    document.getElementById('province').value = h.province || '';
    if (h.province) { handleProvinceChange(); document.getElementById('city').value = h.city || ''; if (h.city) { handleCityChange(); document.getElementById('district').value = h.district || ''; }}
    document.getElementById('address').value = h.address || '';
    document.getElementById('longitude').value = h.longitude || '';
    document.getElementById('latitude').value = h.latitude || '';
    document.getElementById('rentPrice').value = h.rentPrice || '';
    document.getElementById('area').value = h.area || '';
    document.getElementById('floor').value = h.floor || '';
    document.getElementById('availableDate').value = h.availableDate || '';
    document.getElementById('status').value = h.status;
    document.getElementById('description').value = h.description || '';
    uploadedImages = h.images || [];
    renderImageGrid();
}

function saveHouse() {
    const pt = parseInt(document.getElementById('publisherType').value);
    const pi = parseInt(document.getElementById('publisherId').value);
    const title = document.getElementById('title').value.trim();
    const rm = parseInt(document.querySelector('input[name="rentMode"]:checked')?.value);
    const rt = parseInt(document.querySelector('input[name="rentType"]:checked')?.value);
    const prov = document.getElementById('province').value;
    const city = document.getElementById('city').value;
    const dist = document.getElementById('district').value;
    const addr = document.getElementById('address').value.trim();
    const price = parseFloat(document.getElementById('rentPrice').value);
    const phone = document.getElementById('contactPhone').value.trim() || document.getElementById('contactPhone2').value.trim();
    
    if (!pt || !pi || !title || !rm || !rt || !prov || !city || !dist || !addr || !price || !phone) { alert('请填写完整必填信息'); return; }
    
    let pn = '';
    if (pt === 1 || pt === 2) { const u = getData('users').find(x => x.id === pi); pn = u?.nickname || ''; }
    else if (pt === 3) { const s = getData('stores').find(x => x.id === pi); pn = s?.merchantName || ''; }
    
    const data = { publisherType: pt, publisherId: pi, publisherName: pn, title, rentMode: rm, roomCount: rm === 1 ? parseInt(document.getElementById('roomCount').value) || null : null, roomType: rm === 2 ? parseInt(document.getElementById('roomType').value) || null : null, rentType: rt, province: prov, city, district: dist, address: addr, longitude: parseFloat(document.getElementById('longitude').value) || null, latitude: parseFloat(document.getElementById('latitude').value) || null, area: parseFloat(document.getElementById('area').value) || null, floor: parseInt(document.getElementById('floor').value) || null, rentPrice: price, images: uploadedImages, description: document.getElementById('description').value.trim(), contactPhone: phone, availableDate: document.getElementById('availableDate').value || null, status: parseInt(document.getElementById('status').value), updatedAt: formatDateTime() };
    
    if (editingHouseId) { updateData('houses', editingHouseId, data); alert('更新成功！'); }
    else { data.createdAt = formatDateTime(); addData('houses', data); alert('录入成功！'); }
    closeHouseModal(); loadData(); loadStats();
}

function editHouse(id) { openHouseModal(id); }

function viewHouse(id) {
    const h = getData('houses').find(x => x.id === id);
    if (!h) return;
    currentCarouselIndex = 0;
    document.getElementById('detailTitle').textContent = h.title;
    document.getElementById('detailBody').innerHTML = `
        <div class="detail-header-simple">
            <div class="title-section"><h3>${h.title}</h3><div class="meta"><span class="type-tag ${h.rentMode===1?'whole':'shared'}">${h.rentMode===1?'整租':'合租'}</span><span class="type-tag ${h.rentType===1?'sublease':'direct'}">${h.rentType===1?'转租':'直租'}</span></div></div>
            <div class="price">¥${h.rentPrice}<span>/月</span></div>
        </div>
        <div class="image-carousel">
            <div class="carousel-container">${h.images?.length?`<div class="carousel-slide" id="carouselSlide">${h.images.map(img=>`<img src="${img}" alt="">`).join('')}</div><button class="carousel-nav prev" onclick="carouselPrev()"><i class="fas fa-chevron-left"></i></button><button class="carousel-nav next" onclick="carouselNext()"><i class="fas fa-chevron-right"></i></button><div class="carousel-indicators" id="carouselDots">${h.images.map((_,i)=>`<span class="carousel-dot ${i===0?'active':''}" onclick="goToSlide(${i})"></span>`).join('')}</div>`:'<div class="carousel-empty"><i class="fas fa-image"></i><span>暂无图片</span></div>'}</div>
        </div>
        <div class="detail-section"><div class="detail-section-title">基本信息</div><div class="detail-grid"><div class="detail-item"><span class="detail-label">房源ID</span><span class="detail-value">${h.id}</span></div><div class="detail-item"><span class="detail-label">户型</span><span class="detail-value">${getRoomText(h)}</span></div><div class="detail-item"><span class="detail-label">面积</span><span class="detail-value">${h.area||'-'}㎡</span></div><div class="detail-item"><span class="detail-label">楼层</span><span class="detail-value">${h.floor||'-'}层</span></div><div class="detail-item"><span class="detail-label">可入住</span><span class="detail-value">${h.availableDate||'随时'}</span></div><div class="detail-item"><span class="detail-label">状态</span><span class="detail-value">${getStatusText(h.status)}</span></div><div class="detail-item"><span class="detail-label">联系电话</span><span class="detail-value">${h.contactPhone}</span></div><div class="detail-item"><span class="detail-label">发布者</span><span class="detail-value">${h.publisherName}</span></div></div></div>
        <div class="detail-section"><div class="detail-section-title">位置信息</div><div class="detail-grid"><div class="detail-item" style="grid-column:1/-1;"><span class="detail-label">地址</span><span class="detail-value">${h.province} ${h.city} ${h.district} ${h.address}</span></div></div><div class="detail-map"><i class="fas fa-map"></i><i class="fas fa-map-marker-alt map-marker"></i>${h.longitude&&h.latitude?`<span class="coord-display">${h.latitude.toFixed(4)}, ${h.longitude.toFixed(4)}</span>`:''}</div></div>
        <div class="detail-section"><div class="detail-section-title">房源描述</div><p style="font-size:14px;color:#666;line-height:1.6;">${h.description||'暂无描述'}</p></div>
    `;
    window.currentImages = h.images || [];
    document.getElementById('detailModal').classList.add('show');
}

function carouselPrev() { const imgs = window.currentImages; if (!imgs?.length) return; currentCarouselIndex = (currentCarouselIndex - 1 + imgs.length) % imgs.length; updateCarousel(); }
function carouselNext() { const imgs = window.currentImages; if (!imgs?.length) return; currentCarouselIndex = (currentCarouselIndex + 1) % imgs.length; updateCarousel(); }
function goToSlide(i) { currentCarouselIndex = i; updateCarousel(); }
function updateCarousel() { const slide = document.getElementById('carouselSlide'); const dots = document.querySelectorAll('.carousel-dot'); if (slide) slide.style.transform = `translateX(-${currentCarouselIndex * 100}%)`; dots.forEach((d, i) => d.classList.toggle('active', i === currentCarouselIndex)); }

function closeDetailModal() { document.getElementById('detailModal').classList.remove('show'); }

function openReviewModal(id) {
    const h = getData('houses').find(x => x.id === id);
    if (!h) return;
    currentHouseId = id;
    document.getElementById('reviewHouseInfo').innerHTML = `<div class="info"><div class="title">${h.title}</div><div class="price">¥${h.rentPrice}/月</div></div>`;
    document.querySelector('input[name="reviewAction"][value="pass"]').checked = true;
    document.getElementById('rejectReason').value = '';
    document.getElementById('rejectReasonBox').style.display = 'none';
    document.getElementById('reviewModal').classList.add('show');
}

function closeReviewModal() { document.getElementById('reviewModal').classList.remove('show'); currentHouseId = null; }

function confirmReview() {
    if (!currentHouseId) return;
    const action = document.querySelector('input[name="reviewAction"]:checked').value;
    if (action === 'pass') { updateData('houses', currentHouseId, { status: 1, updatedAt: formatDateTime() }); alert('审核通过！'); }
    else { const r = document.getElementById('rejectReason').value.trim(); if (!r) { alert('请输入拒绝原因'); return; } updateData('houses', currentHouseId, { status: 2, rejectReason: r, updatedAt: formatDateTime() }); alert('已拒绝！'); }
    closeReviewModal(); loadData(); loadStats();
}

function changeStatus(id, s) { if (confirm(`确定修改状态为「${getStatusText(s)}」？`)) { updateData('houses', id, { status: s, updatedAt: formatDateTime() }); loadData(); loadStats(); } }

function deleteHouse(id) { const h = getData('houses').find(x => x.id === id); if (confirm(`确定删除「${h?.title}」？`)) { deleteData('houses', id); loadData(); loadStats(); } }
