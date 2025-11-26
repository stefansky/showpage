// 沟通管理页面脚本

let currentPage = 1;
const pageSize = 10;

function initPage() {
    loadData();
    
    document.getElementById('searchInput')?.addEventListener('input', loadData);
    document.getElementById('typeFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
    document.getElementById('statusFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
}

function loadData() {
    const data = getData('communications');
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const typeFilter = document.getElementById('typeFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    
    let filtered = data.filter(item => {
        const matchSearch = !searchTerm || 
            item.acquirer.toLowerCase().includes(searchTerm) ||
            item.targetUser.toLowerCase().includes(searchTerm) ||
            item.contact.includes(searchTerm);
        const matchType = !typeFilter || item.type === typeFilter;
        const matchStatus = !statusFilter || item.status === statusFilter;
        return matchSearch && matchType && matchStatus;
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
            <td>${item.acquirer}</td>
            <td>${item.typeName}</td>
            <td>${item.targetUser}</td>
            <td>${item.contact}</td>
            <td>${item.contactTime}</td>
            <td><span class="badge ${item.status === 'active' ? 'success' : 'danger'}">${item.status === 'active' ? '有效' : '无效'}</span></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewDetail(${item.id})">查看</button>
                <button class="btn btn-sm btn-danger" onclick="deleteItem(${item.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

function viewDetail(id) {
    const item = getData('communications').find(d => d.id === id);
    if (item) {
        alert(`沟通记录详情\n\n获取者: ${item.acquirer}\n类型: ${item.typeName}\n目标用户: ${item.targetUser}\n联系方式: ${item.contact}\n获取时间: ${item.contactTime}`);
    }
}

function deleteItem(id) {
    if (confirm('确定要删除这条记录吗？')) {
        deleteData('communications', id);
        loadData();
    }
}

