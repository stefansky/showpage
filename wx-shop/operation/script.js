// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    updateDateRange();
    loadOperationData();
});

// 更新日期范围显示
function updateDateRange() {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 30);
    
    const formatDate = function(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}-${day}`;
    };
    
    const dateRange = `${formatDate(startDate)} 至 ${formatDate(now)}`;
    document.getElementById('statDateRange').textContent = dateRange;
}

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
}

// 获取近30天时间范围
function getTimeRange() {
    const now = new Date();
    const endTime = new Date(now);
    endTime.setHours(23, 59, 59, 999);
    
    const startTime = new Date(now);
    startTime.setDate(startTime.getDate() - 30);
    startTime.setHours(0, 0, 0, 0);
    
    return { startTime, endTime };
}

// 判断时间是否在范围内
function isInTimeRange(timeStr, startTime, endTime) {
    if (!timeStr) return false;
    const time = new Date(timeStr);
    return time >= startTime && time <= endTime;
}

// 加载运营数据
function loadOperationData() {
    const { startTime, endTime } = getTimeRange();
    
    // 1. 录入房源统计（从storeHouses）
    const storeHouses = JSON.parse(localStorage.getItem('storeHouses') || '[]');
    const storeHousesInRange = storeHouses.filter(function(house) {
        if (!house.createTime) return false;
        return isInTimeRange(house.createTime, startTime, endTime);
    });
    
    // 2. 附近房源统计（从nearby-landlords的mockLandlords，这里需要模拟数据）
    // 由于附近房源数据可能不在localStorage，这里使用模拟统计
    const nearbyHousesCount = getNearbyHousesCount();
    
    // 3. 附近租客统计（从nearbyTenants）
    const nearbyTenants = JSON.parse(localStorage.getItem('nearbyTenants') || '[]');
    const nearbyTenantsInRange = nearbyTenants.filter(function(tenant) {
        // 假设租客数据有发布时间，如果没有则全部计入
        if (!tenant.publishTime) return true;
        return isInTimeRange(tenant.publishTime, startTime, endTime);
    });
    
    // 4. 联系记录统计（从shopContactRecords）
    const contactRecords = JSON.parse(localStorage.getItem('shopContactRecords') || '[]');
    const recordsInRange = contactRecords.filter(function(record) {
        return isInTimeRange(record.contactTime, startTime, endTime);
    });
    const tenantContacts = recordsInRange.filter(function(r) { return r.type === 'tenant'; }).length;
    const landlordContacts = recordsInRange.filter(function(r) { return r.type === 'landlord'; }).length;
    
    // 5. 看房记录统计（从visitRecords）
    const visitRecords = JSON.parse(localStorage.getItem('visitRecords') || '[]');
    const visitsInRange = visitRecords.filter(function(record) {
        return isInTimeRange(record.visitTime, startTime, endTime);
    });
    const uniqueVisitors = new Set(visitsInRange.map(function(r) { return r.tenantPhone || r.tenantName; })).size;
    
    // 6. 房源状态统计（从storeHouses）
    const publishedHouses = storeHouses.filter(function(house) {
        return house.status === 'published' || house.status === '已发布';
    }).length;
    const pendingHouses = storeHouses.filter(function(house) {
        return house.status === 'pending' || house.status === '待审核';
    }).length;
    const rentedHouses = storeHouses.filter(function(house) {
        return house.status === 'rented' || house.status === '已出租';
    }).length;
    
    // 如果没有数据，创建默认数据
    if (storeHouses.length === 0 && contactRecords.length === 0 && visitRecords.length === 0) {
        createDefaultData();
        loadOperationData(); // 重新加载
        return;
    }
    
    // 更新UI
    document.getElementById('totalStoreHouses').textContent = storeHousesInRange.length;
    document.getElementById('totalNearbyLandlords').textContent = nearbyLandlordsCount;
    document.getElementById('totalNearbyTenants').textContent = nearbyTenantsInRange.length;
    document.getElementById('tenantContacts').textContent = tenantContacts;
    document.getElementById('landlordContacts').textContent = landlordContacts;
    document.getElementById('totalVisits').textContent = visitsInRange.length;
    document.getElementById('uniqueVisitors').textContent = uniqueVisitors;
    document.getElementById('publishedHouses').textContent = publishedHouses;
    document.getElementById('pendingHouses').textContent = pendingHouses;
    document.getElementById('rentedHouses').textContent = rentedHouses;
}

// 获取附近房源数量
function getNearbyHousesCount() {
    // 从localStorage获取附近房东数据，如果没有则使用模拟数据
    let totalHouses = 0;
    
    // 尝试从localStorage获取附近房东数据
    try {
        const nearbyLandlordsData = localStorage.getItem('nearbyLandlords');
        if (nearbyLandlordsData) {
            const landlords = JSON.parse(nearbyLandlordsData);
            landlords.forEach(function(landlord) {
                if (landlord.houses && Array.isArray(landlord.houses)) {
                    totalHouses += landlord.houses.length;
                }
            });
            return totalHouses;
        }
    } catch (e) {
        console.error('Error parsing nearbyLandlords:', e);
    }
    
    // 如果没有数据，使用模拟数据（参考nearby-landlords/script.js的mockLandlords结构）
    const mockLandlords = [
        { id: 1, houses: [{ id: 1 }, { id: 2 }] },
        { id: 2, houses: [{ id: 3 }] },
        { id: 3, houses: [{ id: 4 }, { id: 5 }, { id: 6 }] }
    ];
    
    mockLandlords.forEach(function(landlord) {
        if (landlord.houses) {
            totalHouses += landlord.houses.length;
        }
    });
    
    return totalHouses;
}

// 创建默认数据
function createDefaultData() {
    const now = new Date();
    
    // 创建默认房源数据
    const defaultHouses = [
        {
            id: 1,
            title: '精装两室一厅',
            status: 'published',
            createTime: new Date(now.getTime() - 86400000 * 2).toISOString()
        },
        {
            id: 2,
            title: '温馨一居室',
            status: 'published',
            createTime: new Date(now.getTime() - 86400000 * 5).toISOString()
        },
        {
            id: 3,
            title: '三室两厅',
            status: 'pending',
            createTime: new Date(now.getTime() - 86400000 * 1).toISOString()
        },
        {
            id: 4,
            title: '两室一厅',
            status: 'rented',
            createTime: new Date(now.getTime() - 86400000 * 10).toISOString()
        }
    ];
    localStorage.setItem('storeHouses', JSON.stringify(defaultHouses));
    
    // 创建默认租客数据
    const defaultTenants = [
        {
            id: 1,
            nickname: '张先生',
            rentType: '整租',
            moveInTime: '2024-02-15',
            publishTime: new Date(now.getTime() - 86400000 * 3).toISOString()
        },
        {
            id: 2,
            nickname: '李女士',
            rentType: '合租',
            moveInTime: '2024-02-20',
            publishTime: new Date(now.getTime() - 86400000 * 5).toISOString()
        }
    ];
    localStorage.setItem('nearbyTenants', JSON.stringify(defaultTenants));
    
    // 创建默认联系记录
    const defaultContacts = [
        {
            id: 1,
            type: 'tenant',
            contactTime: new Date(now.getTime() - 86400000 * 2).toLocaleString('zh-CN'),
            name: '张先生',
            phone: '13800138001'
        },
        {
            id: 2,
            type: 'landlord',
            contactTime: new Date(now.getTime() - 86400000 * 1).toLocaleString('zh-CN'),
            name: '刘房东',
            phone: '13900139001'
        }
    ];
    localStorage.setItem('shopContactRecords', JSON.stringify(defaultContacts));
    
    // 创建默认看房记录
    const defaultVisits = [
        {
            id: 1,
            tenantName: '张先生',
            tenantPhone: '13800138001',
            visitTime: new Date(now.getTime() - 86400000 * 1).toISOString()
        },
        {
            id: 2,
            tenantName: '李女士',
            tenantPhone: '13800138002',
            visitTime: new Date(now.getTime() - 86400000 * 2).toISOString()
        }
    ];
    localStorage.setItem('visitRecords', JSON.stringify(defaultVisits));
}
