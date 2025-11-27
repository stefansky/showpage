// 举报处理页面脚本

let currentPage = 1;
const pageSize = 10;
let handlingId = null;

// 被举报类型映射
const TARGET_TYPE_MAP = {
    1: { text: '用户', icon: 'fa-user', class: 'user' },
    2: { text: '商家', icon: 'fa-store', class: 'store' },
    3: { text: '房源', icon: 'fa-home', class: 'house' },
    4: { text: '找房需求', icon: 'fa-search', class: 'find' }
};

// 举报原因映射
const REASON_TYPE_MAP = {
    1: { text: '虚假信息', icon: 'fa-exclamation-circle' },
    2: { text: '骚扰辱骂', icon: 'fa-comment-slash' },
    3: { text: '诈骗行为', icon: 'fa-mask' },
    4: { text: '违规内容', icon: 'fa-ban' },
    5: { text: '其他', icon: 'fa-ellipsis-h' }
};

// 状态映射
const STATUS_MAP = {
    0: { text: '待处理', class: 'pending' },
    1: { text: '已处理', class: 'processed' },
    2: { text: '已驳回', class: 'rejected' }
};

// 处理结果映射
const HANDLE_RESULT_MAP = {
    1: { text: '警告', class: 'warn', icon: 'fa-exclamation-triangle' },
    2: { text: '扣除房豆', class: 'deduct', icon: 'fa-coins' },
    3: { text: '禁用账号', class: 'ban', icon: 'fa-user-slash' },
    4: { text: '无效举报', class: 'invalid', icon: 'fa-times-circle' }
};

// 初始化页面
function initPage() {
    loadData();
    bindEvents();
}

// 绑定事件
function bindEvents() {
    // 事件由查询按钮触发
}

// 搜索数据
function searchData() {
    currentPage = 1;
    loadData();
}

// 重置搜索
function resetSearch() {
    document.getElementById('reporterInput').value = '';
    document.getElementById('targetInput').value = '';
    document.getElementById('targetTypeFilter').value = '';
    document.getElementById('reasonFilter').value = '';
    document.getElementById('statusFilter').value = '';
    currentPage = 1;
    loadData();
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 加载数据
function loadData() {
    let reports = getData('reportRecords');
    
    const reporterInput = document.getElementById('reporterInput')?.value.toLowerCase() || '';
    const targetInput = document.getElementById('targetInput')?.value.toLowerCase() || '';
    const targetTypeFilter = document.getElementById('targetTypeFilter')?.value || '';
    const reasonFilter = document.getElementById('reasonFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    
    // 搜索和筛选
    reports = reports.filter(item => {
        const matchReporter = !reporterInput || (item.reporterName || '').toLowerCase().includes(reporterInput);
        const matchTarget = !targetInput || (item.targetName || '').toLowerCase().includes(targetInput);
        const matchTargetType = !targetTypeFilter || String(item.targetType) === targetTypeFilter;
        const matchReason = !reasonFilter || String(item.reasonType) === reasonFilter;
        const matchStatus = !statusFilter || String(item.status) === statusFilter;
        return matchReporter && matchTarget && matchTargetType && matchReason && matchStatus;
    });
    
    // 按时间倒序，待处理的优先
    reports.sort((a, b) => {
        if (a.status === 0 && b.status !== 0) return -1;
        if (a.status !== 0 && b.status === 0) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // 分页
    const total = reports.length;
    const start = (currentPage - 1) * pageSize;
    const paginated = reports.slice(start, start + pageSize);
    
    displayData(paginated);
    createPagination(total, currentPage, pageSize, (page) => {
        currentPage = page;
        loadData();
    });
}

// 显示数据（表格形式）
function displayData(reports) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    if (reports.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-inbox" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
                    暂无举报数据
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = reports.map(report => {
        const targetTypeInfo = TARGET_TYPE_MAP[report.targetType] || TARGET_TYPE_MAP[1];
        const reasonInfo = REASON_TYPE_MAP[report.reasonType] || REASON_TYPE_MAP[5];
        const statusInfo = STATUS_MAP[report.status] || STATUS_MAP[0];
        const reporterTypeText = report.reporterType === 1 ? '用户' : '商家';
        
        // 处理结果显示
        let handleResultHtml = '-';
        if (report.status === 1 && report.handleResult) {
            const resultInfo = HANDLE_RESULT_MAP[report.handleResult];
            let resultDetail = '';
            if (report.handleResult === 2 && report.deductPoints) {
                resultDetail = `<br><span class="result-detail">-${report.deductPoints}房豆</span>`;
            } else if (report.handleResult === 3) {
                resultDetail = `<br><span class="result-detail">${report.banDays === 0 ? '永久' : report.banDays + '天'}</span>`;
            }
            handleResultHtml = `
                <span class="result-badge ${resultInfo.class}">
                    <i class="fas ${resultInfo.icon}"></i>
                    ${resultInfo.text}
                </span>
                ${resultDetail}
            `;
        } else if (report.status === 2) {
            handleResultHtml = `<span class="result-badge invalid"><i class="fas fa-times-circle"></i> 无效举报</span>`;
        }
        
        // 截断详情
        const detailText = report.reasonDetail || '-';
        const shortDetail = detailText.length > 20 ? detailText.substring(0, 20) + '...' : detailText;
        
        return `
            <tr class="${report.status === 0 ? 'highlight-row' : ''}">
                <td>${report.id}</td>
                <td>
                    <div class="reporter-cell">
                        <span class="reporter-type">${reporterTypeText}</span>
                        <span class="reporter-name">${report.reporterName || '-'}</span>
                    </div>
                </td>
                <td>
                    <span class="target-type-badge ${targetTypeInfo.class}">
                        <i class="fas ${targetTypeInfo.icon}"></i>
                        ${targetTypeInfo.text}
                    </span>
                </td>
                <td><span class="target-name">${report.targetName || '-'}</span></td>
                <td>
                    <span class="reason-badge">
                        <i class="fas ${reasonInfo.icon}"></i>
                        ${reasonInfo.text}
                    </span>
                </td>
                <td><span class="detail-text" title="${detailText}">${shortDetail}</span></td>
                <td><span class="status-badge ${statusInfo.class}">${statusInfo.text}</span></td>
                <td>${handleResultHtml}</td>
                <td>${report.createdAt || '-'}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn info" onclick="viewDetail(${report.id})" title="详情">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${report.status === 0 ? `
                            <button class="action-btn primary" onclick="openHandleModal(${report.id})" title="处理">
                                <i class="fas fa-gavel"></i>
                            </button>
                        ` : ''}
                        <button class="action-btn danger" onclick="deleteReport(${report.id})" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ==================== 详情弹窗 ====================

function viewDetail(id) {
    const reports = getData('reportRecords');
    const report = reports.find(r => r.id === id);
    if (!report) return;
    
    const targetTypeInfo = TARGET_TYPE_MAP[report.targetType] || TARGET_TYPE_MAP[1];
    const reasonInfo = REASON_TYPE_MAP[report.reasonType] || REASON_TYPE_MAP[5];
    const statusInfo = STATUS_MAP[report.status] || STATUS_MAP[0];
    const reporterTypeText = report.reporterType === 1 ? '用户' : '商家';
    
    let handleResultHtml = '';
    if (report.status === 1 && report.handleResult) {
        const resultInfo = HANDLE_RESULT_MAP[report.handleResult];
        handleResultHtml = `
            <div class="detail-section">
                <div class="detail-section-title">处理信息</div>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">处理结果</span>
                        <span class="detail-value">
                            <span class="result-badge ${resultInfo.class}">
                                <i class="fas ${resultInfo.icon}"></i>
                                ${resultInfo.text}
                            </span>
                        </span>
                    </div>
                    ${report.handleResult === 2 ? `
                        <div class="detail-item">
                            <span class="detail-label">扣除房豆</span>
                            <span class="detail-value deduct">${report.deductPoints} 房豆</span>
                        </div>
                    ` : ''}
                    ${report.handleResult === 3 ? `
                        <div class="detail-item">
                            <span class="detail-label">封禁时长</span>
                            <span class="detail-value ban">${report.banDays === 0 ? '永久封禁' : report.banDays + ' 天'}</span>
                        </div>
                    ` : ''}
                    <div class="detail-item">
                        <span class="detail-label">处理时间</span>
                        <span class="detail-value">${report.handleTime || '-'}</span>
                    </div>
                    ${report.handleRemark ? `
                        <div class="detail-item full-width">
                            <span class="detail-label">处理备注</span>
                            <span class="detail-value">${report.handleRemark}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    const detailBody = document.getElementById('detailBody');
    detailBody.innerHTML = `
        <div class="detail-header-card">
            <span class="target-type-badge ${targetTypeInfo.class} large">
                <i class="fas ${targetTypeInfo.icon}"></i>
                ${targetTypeInfo.text}举报
            </span>
            <span class="reason-badge large">
                <i class="fas ${reasonInfo.icon}"></i>
                ${reasonInfo.text}
            </span>
            <span class="status-badge ${statusInfo.class} large">${statusInfo.text}</span>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">举报双方</div>
            <div class="detail-parties">
                <div class="detail-party">
                    <div class="party-avatar reporter">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="party-info">
                        <span class="party-label">举报人</span>
                        <span class="party-type">${reporterTypeText}</span>
                        <span class="party-name">${report.reporterName || '-'}</span>
                    </div>
                </div>
                <div class="party-arrow-lg">
                    <i class="fas fa-long-arrow-alt-right"></i>
                </div>
                <div class="detail-party">
                    <div class="party-avatar target">
                        <i class="fas ${targetTypeInfo.icon}"></i>
                    </div>
                    <div class="party-info">
                        <span class="party-label">被举报</span>
                        <span class="party-type">${targetTypeInfo.text}</span>
                        <span class="party-name">${report.targetName || '-'}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">举报详情</div>
            <div class="detail-content-box">
                <p>${report.reasonDetail || '无详细描述'}</p>
            </div>
            <div class="detail-grid" style="margin-top: 16px;">
                <div class="detail-item">
                    <span class="detail-label">举报时间</span>
                    <span class="detail-value">${report.createdAt || '-'}</span>
                </div>
            </div>
        </div>
        
        ${handleResultHtml}
    `;
    
    document.getElementById('detailModal').classList.add('show');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('show');
}

// ==================== 处理弹窗 ====================

function openHandleModal(id) {
    const reports = getData('reportRecords');
    const report = reports.find(r => r.id === id);
    if (!report) return;
    
    handlingId = id;
    
    const targetTypeInfo = TARGET_TYPE_MAP[report.targetType] || TARGET_TYPE_MAP[1];
    const reasonInfo = REASON_TYPE_MAP[report.reasonType] || REASON_TYPE_MAP[5];
    
    // 显示举报信息
    document.getElementById('handleReportInfo').innerHTML = `
        <div class="handle-info-header">
            <span class="target-type-badge ${targetTypeInfo.class}">
                <i class="fas ${targetTypeInfo.icon}"></i>
                ${targetTypeInfo.text}举报
            </span>
            <span class="reason-badge">
                <i class="fas ${reasonInfo.icon}"></i>
                ${reasonInfo.text}
            </span>
        </div>
        <div class="handle-info-parties">
            <span class="party-item">
                <i class="fas fa-user"></i>
                举报人：${report.reporterName || '-'}
            </span>
            <span class="party-item">
                <i class="fas ${targetTypeInfo.icon}"></i>
                被举报：${report.targetName || '-'}
            </span>
        </div>
        <div class="handle-info-content">
            ${report.reasonDetail || '无详细描述'}
        </div>
    `;
    
    // 重置表单
    document.querySelectorAll('input[name="handleResult"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[name="deductPoints"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[name="banDays"]').forEach(input => input.checked = false);
    document.getElementById('customDeductPoints').value = '';
    document.getElementById('handleRemark').value = '';
    document.getElementById('deductPointsItem').style.display = 'none';
    document.getElementById('banDaysItem').style.display = 'none';
    
    document.getElementById('handleModal').classList.add('show');
}

function closeHandleModal() {
    document.getElementById('handleModal').classList.remove('show');
    handlingId = null;
}

// 处理结果变化
function handleResultChange() {
    const result = document.querySelector('input[name="handleResult"]:checked')?.value;
    document.getElementById('deductPointsItem').style.display = result === '2' ? 'block' : 'none';
    document.getElementById('banDaysItem').style.display = result === '3' ? 'block' : 'none';
}

// 确认处理
function confirmHandle() {
    if (!handlingId) return;
    
    const handleResult = parseInt(document.querySelector('input[name="handleResult"]:checked')?.value);
    if (!handleResult) {
        showToast('请选择处理结果', 'error');
        return;
    }
    
    let deductPoints = 0;
    let banDays = null;
    
    if (handleResult === 2) {
        const selectedDeduct = document.querySelector('input[name="deductPoints"]:checked')?.value;
        const customDeduct = document.getElementById('customDeductPoints').value;
        deductPoints = selectedDeduct ? parseInt(selectedDeduct) : (customDeduct ? parseInt(customDeduct) : 0);
        if (!deductPoints || deductPoints <= 0) {
            showToast('请选择或输入扣除房豆数量', 'error');
            return;
        }
    }
    
    if (handleResult === 3) {
        const selectedBan = document.querySelector('input[name="banDays"]:checked')?.value;
        if (selectedBan === undefined || selectedBan === null) {
            showToast('请选择禁用时长', 'error');
            return;
        }
        banDays = parseInt(selectedBan);
    }
    
    const handleRemark = document.getElementById('handleRemark').value.trim();
    
    // 更新数据
    const reports = getData('reportRecords');
    const index = reports.findIndex(r => r.id === handlingId);
    if (index !== -1) {
        reports[index].status = handleResult === 4 ? 2 : 1; // 无效举报为已驳回，其他为已处理
        reports[index].handleResult = handleResult;
        reports[index].deductPoints = deductPoints;
        reports[index].banDays = banDays;
        reports[index].handleRemark = handleRemark;
        reports[index].handleTime = formatDateTime();
        saveData('reportRecords', reports);
    }
    
    const resultText = HANDLE_RESULT_MAP[handleResult]?.text || '已处理';
    showToast(`举报已处理：${resultText}`, 'success');
    closeHandleModal();
    loadData();
}

// ==================== 其他操作 ====================

function deleteReport(id) {
    if (confirm('确定要删除这条举报记录吗？此操作不可恢复。')) {
        deleteData('reportRecords', id);
        showToast('记录已删除', 'success');
        loadData();
    }
}

// Toast 提示
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}
