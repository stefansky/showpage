// 举报处理页面脚本

let currentPage = 1;
const pageSize = 10;

function initPage() {
    loadData();
    
    document.getElementById('statusFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
    document.getElementById('typeFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
}

function loadData() {
    const reports = getData('reports');
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    
    let filtered = reports;
    
    if (statusFilter?.value) {
        filtered = filtered.filter(r => r.status === statusFilter.value);
    }
    
    if (typeFilter?.value) {
        filtered = filtered.filter(r => r.type === typeFilter.value);
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

function displayData(reports) {
    const reportList = document.getElementById('reportList');
    if (!reportList) return;
    
    reportList.innerHTML = reports.map(report => `
        <div class="report-item">
            <div class="report-header">
                <span class="report-type ${report.type}">${report.typeName}</span>
                <span class="status-badge ${report.status === 'pending' ? 'pending' : 'active'}">${report.status === 'pending' ? '待处理' : '已处理'}</span>
            </div>
            <div class="report-content">${report.content}</div>
            <div class="report-meta">
                <span>举报人：${report.reporter}</span>
                <span>被举报：${report.target}</span>
                <span>举报时间：${report.reportTime}</span>
                ${report.processTime ? `<span>处理时间：${report.processTime}</span>` : ''}
            </div>
            ${report.status === 'pending' ? `
            <div class="report-actions">
                <button class="action-btn primary" onclick="processReport(${report.id})">处理</button>
                <button class="action-btn danger" onclick="deleteReport(${report.id})">删除</button>
            </div>
            ` : ''}
        </div>
    `).join('');
}

function processReport(id) {
    if (confirm('确定要处理该举报吗？')) {
        updateData('reports', id, { status: 'processed', processTime: formatDateTime() });
        loadData();
    }
}

function deleteReport(id) {
    if (confirm('确定要删除该举报吗？')) {
        deleteData('reports', id);
        loadData();
    }
}

