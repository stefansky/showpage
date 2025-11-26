// 房豆管理页面脚本

let currentPage = 1;
const pageSize = 10;

function initPage() {
    loadData();
    loadPointsStats();
    
    document.getElementById('searchInput')?.addEventListener('input', () => loadData());
    document.getElementById('addPointsBtn')?.addEventListener('click', () => {
        document.getElementById('addPointsModal').classList.add('show');
    });
}

function loadPointsStats() {
    const records = getData('pointsRecords');
    const today = new Date().toISOString().split('T')[0];
    
    const totalPoints = records.filter(r => r.type === 'earn').reduce((sum, r) => sum + r.amount, 0) - 
                       records.filter(r => r.type === 'consume').reduce((sum, r) => sum + Math.abs(r.amount), 0);
    const todayEarned = records.filter(r => r.type === 'earn' && r.time.startsWith(today)).reduce((sum, r) => sum + r.amount, 0);
    const todayConsumed = records.filter(r => r.type === 'consume' && r.time.startsWith(today)).reduce((sum, r) => sum + Math.abs(r.amount), 0);
    
    document.getElementById('totalPoints')?.setAttribute('data-value', totalPoints);
    document.getElementById('todayEarned')?.setAttribute('data-value', todayEarned);
    document.getElementById('todayConsumed')?.setAttribute('data-value', todayConsumed);
    updateStatValues();
}

function loadData() {
    const records = getData('pointsRecords');
    const searchInput = document.getElementById('searchInput');
    
    let filtered = records;
    
    if (searchInput?.value) {
        const keyword = searchInput.value.toLowerCase();
        filtered = filtered.filter(r => 
            r.userNickname.toLowerCase().includes(keyword) || 
            r.userPhone.includes(keyword)
        );
    }
    
    filtered.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    const total = filtered.length;
    const start = (currentPage - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);
    
    displayData(paginated);
    createPagination(total, currentPage, pageSize, (page) => {
        currentPage = page;
        loadData();
    });
}

function displayData(records) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    tbody.innerHTML = records.map(record => `
        <tr>
            <td>${record.id}</td>
            <td>${record.userNickname} (${record.userPhone})</td>
            <td><span class="status-badge ${record.type === 'earn' ? 'active' : 'rejected'}">${record.typeName}</span></td>
            <td style="color: ${record.type === 'earn' ? '#4CAF50' : '#F44336'}; font-weight: 600">${record.type === 'earn' ? '+' : ''}${record.amount}</td>
            <td>${record.reason}</td>
            <td>${record.time}</td>
            <td>
                <button class="action-btn danger" onclick="deletePointsRecord(${record.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

function deletePointsRecord(id) {
    if (confirm('确定要删除该记录吗？')) {
        deleteData('pointsRecords', id);
        loadData();
        loadPointsStats();
    }
}

function closeModal() {
    document.getElementById('addPointsModal')?.classList.remove('show');
}

function confirmAddPoints() {
    const userPhone = document.getElementById('userPhone')?.value;
    const pointsAmount = parseInt(document.getElementById('pointsAmount')?.value || 0);
    const pointsReason = document.getElementById('pointsReason')?.value;
    
    if (!userPhone) {
        alert('请输入用户手机号');
        return;
    }
    if (!pointsAmount || pointsAmount <= 0) {
        alert('请输入有效的房豆数量');
        return;
    }
    if (!pointsReason) {
        alert('请输入发放原因');
        return;
    }
    
    const users = getData('users');
    const user = users.find(u => u.phone === userPhone);
    if (!user) {
        alert('未找到该用户');
        return;
    }
    
    addData('pointsRecords', {
        userId: user.id,
        userNickname: user.nickname,
        userPhone: user.phone,
        type: 'earn',
        typeName: '获得',
        amount: pointsAmount,
        reason: pointsReason,
        time: formatDateTime()
    });
    
    alert('房豆发放成功！');
    closeModal();
    document.getElementById('userPhone').value = '';
    document.getElementById('pointsAmount').value = '';
    document.getElementById('pointsReason').value = '';
    loadData();
    loadPointsStats();
}

