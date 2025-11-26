// 开店申请页面脚本

let currentPage = 1;
const pageSize = 10;

function initPage() {
    loadData();
    
    document.getElementById('searchInput')?.addEventListener('input', loadData);
    document.getElementById('statusFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
}

function loadData() {
    const data = getData('storeApplications');
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    
    let filtered = data.filter(item => {
        const matchSearch = !searchTerm || 
            item.applicant.toLowerCase().includes(searchTerm) ||
            item.storeName.toLowerCase().includes(searchTerm);
        const matchStatus = !statusFilter || item.status === statusFilter;
        return matchSearch && matchStatus;
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
            <td>${item.applicant}</td>
            <td>${item.storeName}</td>
            <td>${item.applicantPhone}</td>
            <td>${item.address}</td>
            <td>${item.applyTime}</td>
            <td><span class="badge ${item.status === 'approved' ? 'success' : item.status === 'pending' ? 'warning' : 'danger'}">${item.status === 'approved' ? '已通过' : item.status === 'pending' ? '待审核' : '已拒绝'}</span></td>
            <td>
                ${item.status === 'pending' ? `
                    <button class="btn btn-sm btn-success" onclick="approveApplication(${item.id})">通过</button>
                    <button class="btn btn-sm btn-danger" onclick="rejectApplication(${item.id})">拒绝</button>
                ` : ''}
                <button class="btn btn-sm btn-info" onclick="viewApplication(${item.id})">查看</button>
            </td>
        </tr>
    `).join('');
}

function viewApplication(id) {
    const item = getData('storeApplications').find(d => d.id === id);
    if (item) {
        alert(`开店申请详情\n\n申请人: ${item.applicant}\n联系电话: ${item.applicantPhone}\n门店名称: ${item.storeName}\n门店地址: ${item.address}\n申请时间: ${item.applyTime}`);
    }
}

function approveApplication(id) {
    if (confirm('确定要通过这个开店申请吗？')) {
        updateData('storeApplications', id, { status: 'approved' });
        loadData();
        alert('申请已通过！');
    }
}

function rejectApplication(id) {
    if (confirm('确定要拒绝这个开店申请吗？')) {
        updateData('storeApplications', id, { status: 'rejected' });
        loadData();
        alert('申请已拒绝！');
    }
}

