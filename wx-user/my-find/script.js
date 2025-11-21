// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadFinds();
});

// 初始化事件监听
function initEventListeners() {
    // 返回按钮
    document.getElementById('backBtn').addEventListener('click', function() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '../personal-center/index.html';
        }
    });
}

// 模拟找房数据
const mockFinds = [
    {
        id: 1,
        title: '寻找光谷广场附近房源',
        rentType: '整租',
        rooms: '2室1厅',
        moveInTime: '2024-02-20',
        location: '光谷广场',
        status: 'published'
    },
    {
        id: 2,
        title: '求租街道口附近单间',
        rentType: '合租',
        rooms: '1室1厅',
        moveInTime: '2024-02-25',
        location: '街道口',
        status: 'published'
    },
    {
        id: 3,
        title: '寻找汉街附近三室两厅',
        rentType: '整租',
        rooms: '3室2厅',
        moveInTime: '2024-03-01',
        location: '汉街',
        status: 'pending'
    }
];

// 加载找房列表
function loadFinds() {
    // 优先使用localStorage中的数据，如果没有则使用模拟数据
    let finds = JSON.parse(localStorage.getItem('myFinds') || '[]');
    
    // 如果没有数据，使用模拟数据
    if (finds.length === 0) {
        finds = mockFinds;
    }
    
    const findList = document.getElementById('findList');
    const emptyResult = document.getElementById('emptyResult');

    if (finds.length === 0) {
        findList.style.display = 'none';
        emptyResult.style.display = 'block';
        return;
    }

    findList.style.display = 'block';
    emptyResult.style.display = 'none';

    // 清空现有列表
    findList.innerHTML = '';

    // 显示找房需求
    finds.forEach(function(find) {
        const findItem = document.createElement('div');
        findItem.className = 'find-item';

        const statusClass = find.status || 'published';
        const statusText = {
            'published': '已发布',
            'pending': '审核中',
            'offline': '已下架'
        }[statusClass] || '已发布';

        findItem.innerHTML = `
            <div class="find-header">
                <div class="find-title">${find.title || '找房需求'}</div>
                <span class="find-status ${statusClass}">${statusText}</span>
            </div>
            <div class="find-info">
                <div class="find-info-item">
                    <i class="fas fa-key"></i>
                    <span class="info-label">租房类型：</span>
                    <span class="info-value">${find.rentType || '-'}</span>
                </div>
                <div class="find-info-item">
                    <i class="fas fa-home"></i>
                    <span class="info-label">租住类型：</span>
                    <span class="info-value">${find.rooms || '-'}</span>
                </div>
                <div class="find-info-item">
                    <i class="fas fa-calendar-check"></i>
                    <span class="info-label">租房时间：</span>
                    <span class="info-value">${formatMoveInTime(find.moveInTime) || '-'}</span>
                </div>
                <div class="find-info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span class="info-label">意向位置：</span>
                    <span class="info-value">${find.location || '-'}</span>
                </div>
            </div>
            <div class="find-actions">
                <button class="action-btn edit-btn" data-find-id="${find.id}">
                    <i class="fas fa-edit"></i>
                    <span>编辑</span>
                </button>
                <button class="action-btn delete-btn" data-find-id="${find.id}">
                    <i class="fas fa-trash"></i>
                    <span>删除</span>
                </button>
            </div>
        `;

        // 添加编辑事件
        findItem.querySelector('.edit-btn').addEventListener('click', function() {
            editFind(find.id);
        });

        // 添加删除事件
        findItem.querySelector('.delete-btn').addEventListener('click', function() {
            deleteFind(find.id);
        });

        findList.appendChild(findItem);
    });
}

// 格式化入住时间
function formatMoveInTime(timeStr) {
    if (!timeStr) return '-';
    
    // 如果是日期格式，转换为中文显示
    if (timeStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const date = new Date(timeStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年${month}月${day}日`;
    }
    
    return timeStr;
}

// 编辑找房需求
function editFind(findId) {
    // 跳转到发布找房页面，并传递编辑参数
    window.location.href = '../post-find/index.html?edit=' + findId;
}

// 删除找房需求
function deleteFind(findId) {
    if (confirm('确定要删除这个找房需求吗？删除后无法恢复。')) {
        const finds = JSON.parse(localStorage.getItem('myFinds') || '[]');
        const newFinds = finds.filter(function(find) {
            return find.id !== findId;
        });
        localStorage.setItem('myFinds', JSON.stringify(newFinds));
        
        // 重新加载列表
        loadFinds();
        
        alert('找房需求已删除');
    }
}

