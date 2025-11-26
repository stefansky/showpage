// 看房管理页面脚本

let currentPage = 1;
const pageSize = 10;

function initPage() {
    loadData();
    
    document.getElementById('searchInput')?.addEventListener('input', loadData);
    document.getElementById('storeFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
    document.getElementById('dateFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
}

function loadData() {
    const data = getData('visits');
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const storeFilter = document.getElementById('storeFilter')?.value || '';
    const dateFilter = document.getElementById('dateFilter')?.value || '';
    
    let filtered = data.filter(item => {
        const matchSearch = !searchTerm || 
            item.tenantName.toLowerCase().includes(searchTerm) ||
            item.storeName.toLowerCase().includes(searchTerm);
        const matchStore = !storeFilter || item.storeId == storeFilter;
        const matchDate = !dateFilter || item.visitTime.startsWith(dateFilter);
        return matchSearch && matchStore && matchDate;
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
            <td>${item.tenantName}</td>
            <td>${item.storeName}</td>
            <td>${item.visitTime}</td>
            <td>${item.houseTitle}</td>
            <td><span class="badge ${item.status === 'completed' ? 'success' : 'info'}">${item.status === 'completed' ? '已完成' : '已预约'}</span></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewVisit(${item.id})">查看</button>
            </td>
        </tr>
    `).join('');
}

function viewVisit(id) {
    const item = getData('visits').find(d => d.id === id);
    if (item) {
        alert(`看房记录详情\n\n租客: ${item.tenantName}\n门店: ${item.storeName}\n看房时间: ${item.visitTime}\n房源: ${item.houseTitle}`);
    }
}

