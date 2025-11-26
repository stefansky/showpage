// 找房需求页面脚本

let currentPage = 1;
const pageSize = 10;

function initPage() {
    loadData();
    
    document.getElementById('searchInput')?.addEventListener('input', () => loadData());
    document.getElementById('rentTypeFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
}

function loadData() {
    const findRequests = getData('findRequests');
    const searchInput = document.getElementById('searchInput');
    const rentTypeFilter = document.getElementById('rentTypeFilter');
    
    let filtered = findRequests;
    
    if (searchInput?.value) {
        const keyword = searchInput.value.toLowerCase();
        filtered = filtered.filter(f => 
            f.userNickname.toLowerCase().includes(keyword) || 
            f.location.toLowerCase().includes(keyword)
        );
    }
    
    if (rentTypeFilter?.value) {
        filtered = filtered.filter(f => f.rentType === rentTypeFilter.value);
    }
    
    const total = filtered.length;
    const start = (currentPage - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);
    
    displayData(paginated);
    createPagination(total, currentPage, pageSize, (page) => {
        currentPage = page;
        loadData();
    });
}

function displayData(findRequests) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    tbody.innerHTML = findRequests.map(req => `
        <tr>
            <td>${req.id}</td>
            <td>${req.userNickname}</td>
            <td>${req.rentType}</td>
            <td>${req.rooms}</td>
            <td>${req.location}</td>
            <td>${req.moveInTime}</td>
            <td>${req.publishTime}</td>
            <td><span class="status-badge active">${req.status === 'active' ? '进行中' : '已结束'}</span></td>
            <td>
                <button class="action-btn info" onclick="viewFindRequest(${req.id})">查看</button>
                <button class="action-btn danger" onclick="deleteFindRequest(${req.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

function viewFindRequest(id) {
    const req = getData('findRequests').find(f => f.id === id);
    if (req) {
        alert(`找房需求详情：\n用户：${req.userNickname}\n租赁类型：${req.rentType}\n户型：${req.rooms}\n位置：${req.location}\n入住时间：${req.moveInTime}`);
    }
}

function deleteFindRequest(id) {
    if (confirm('确定要删除该找房需求吗？')) {
        deleteData('findRequests', id);
        loadData();
    }
}

