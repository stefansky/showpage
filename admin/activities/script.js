// 活动管理页面脚本

let currentPage = 1;
const pageSize = 10;

function initPage() {
    loadData();
    
    document.getElementById('addActivityBtn')?.addEventListener('click', () => alert('新增活动功能待开发'));
    document.getElementById('searchInput')?.addEventListener('input', loadData);
    document.getElementById('statusFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
    document.getElementById('typeFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
}

function loadData() {
    const data = getData('platformActivities');
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const typeFilter = document.getElementById('typeFilter')?.value || '';
    
    let filtered = data.filter(item => {
        const matchSearch = !searchTerm || item.name.toLowerCase().includes(searchTerm);
        const matchStatus = !statusFilter || item.status === statusFilter;
        const matchType = !typeFilter || item.type === typeFilter;
        return matchSearch && matchStatus && matchType;
    });
    
    const total = filtered.length;
    const start = (currentPage - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);
    
    displayData(paginated);
    createPagination(total, currentPage, pageSize, (page) => {
        currentPage = page;
        loadData();
    });
}

function displayData(data) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    tbody.innerHTML = data.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.typeName}</td>
            <td>${item.reward}</td>
            <td>${item.startTime}</td>
            <td>${item.endTime}</td>
            <td>${item.participants}</td>
            <td><span class="badge ${item.status === 'active' ? 'success' : item.status === 'ended' ? 'warning' : 'secondary'}">${item.status === 'active' ? '进行中' : item.status === 'ended' ? '已结束' : '草稿'}</span></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewActivity(${item.id})">查看</button>
                <button class="btn btn-sm btn-primary" onclick="editActivity(${item.id})">编辑</button>
                <button class="btn btn-sm btn-danger" onclick="deleteActivity(${item.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

function viewActivity(id) {
    const item = getData('platformActivities').find(d => d.id === id);
    if (item) {
        alert(`活动详情\n\n活动名称: ${item.name}\n活动类型: ${item.typeName}\n奖励内容: ${item.reward}\n参与人数: ${item.participants}`);
    }
}

function editActivity(id) {
    alert('编辑活动功能待开发');
}

function deleteActivity(id) {
    if (confirm('确定要删除这个活动吗？')) {
        deleteData('platformActivities', id);
        loadData();
    }
}

