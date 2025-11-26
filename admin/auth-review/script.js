// 认证审核页面脚本

let currentPage = 1;
const pageSize = 10;

function initPage() {
    loadData();
    
    document.getElementById('statusFilter')?.addEventListener('change', () => { currentPage = 1; loadData(); });
}

function loadData() {
    const authReviews = getData('authReviews');
    const statusFilter = document.getElementById('statusFilter');
    
    let filtered = authReviews;
    
    if (statusFilter?.value) {
        filtered = filtered.filter(a => a.status === statusFilter.value);
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

function displayData(authReviews) {
    const authList = document.getElementById('authList');
    if (!authList) return;
    
    authList.innerHTML = authReviews.map(auth => `
        <div class="auth-item">
            <div class="auth-header">
                <div class="auth-user">
                    <div class="auth-avatar">${auth.nickname[0]}</div>
                    <div class="auth-info">
                        <div class="auth-name">${auth.nickname}</div>
                        <div class="auth-phone">${auth.phone}</div>
                    </div>
                </div>
                <span class="status-badge ${auth.status === 'verified' ? 'verified' : auth.status === 'pending' ? 'pending' : 'rejected'}">${getAuthStatusText(auth.status)}</span>
            </div>
            <div class="auth-body">
                <div class="auth-detail"><i class="fas fa-user"></i><span>姓名：${auth.realName}</span></div>
                <div class="auth-detail"><i class="fas fa-id-card"></i><span>身份证号：${auth.idCard}</span></div>
                <div class="auth-detail"><i class="fas fa-clock"></i><span>提交时间：${auth.submitTime}</span></div>
                ${auth.reviewTime ? `<div class="auth-detail"><i class="fas fa-check-circle"></i><span>审核时间：${auth.reviewTime}</span></div>` : ''}
            </div>
            ${auth.status === 'pending' ? `
            <div class="auth-actions">
                <button class="action-btn primary" onclick="approveAuth(${auth.id})">通过</button>
                <button class="action-btn danger" onclick="rejectAuth(${auth.id})">拒绝</button>
            </div>
            ` : ''}
        </div>
    `).join('');
}

function approveAuth(id) {
    if (confirm('确定要通过该实名认证吗？')) {
        updateData('authReviews', id, { status: 'verified', reviewTime: formatDateTime() });
        const auth = getData('authReviews').find(a => a.id === id);
        if (auth) {
            updateData('users', auth.userId, { authStatus: 'verified' });
        }
        loadData();
    }
}

function rejectAuth(id) {
    if (confirm('确定要拒绝该实名认证吗？')) {
        updateData('authReviews', id, { status: 'rejected', reviewTime: formatDateTime() });
        const auth = getData('authReviews').find(a => a.id === id);
        if (auth) {
            updateData('users', auth.userId, { authStatus: 'unverified' });
        }
        loadData();
    }
}

