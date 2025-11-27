// 字典项详情页脚本

let currentPage = 1;
const pageSize = 10;
let currentTypeId = null;
let currentType = null;
let editingItemId = null;

// 初始化页面
function initPage() {
    // 获取URL参数中的类型ID
    const urlParams = new URLSearchParams(window.location.search);
    currentTypeId = parseInt(urlParams.get('id'));
    
    if (!currentTypeId) {
        alert('参数错误');
        window.location.href = 'index.html';
        return;
    }
    
    // 加载字典类型信息
    loadTypeInfo();
    loadData();
    initPreview();
    
    // 搜索框事件
    document.getElementById('searchInput')?.addEventListener('input', debounce(() => {
        currentPage = 1;
        loadData();
    }, 300));
    
    // 状态筛选事件
    document.getElementById('statusFilter')?.addEventListener('change', () => {
        currentPage = 1;
        loadData();
    });
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 加载字典类型信息
function loadTypeInfo() {
    const types = getData('dictTypes') || [];
    currentType = types.find(t => t.id === currentTypeId);
    
    if (!currentType) {
        alert('字典类型不存在');
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('typeName').textContent = currentType.name;
    document.getElementById('typeTitle').textContent = currentType.name;
    document.getElementById('typeCode').textContent = currentType.code;
    document.getElementById('typeDesc').textContent = currentType.description || '暂无描述';
    document.title = `${currentType.name} - 字典管理`;
}

// 加载数据
function loadData() {
    const items = getData('dictItems') || [];
    const searchVal = document.getElementById('searchInput')?.value?.toLowerCase() || '';
    const statusVal = document.getElementById('statusFilter')?.value;
    
    // 过滤当前类型的字典项
    let filtered = items.filter(item => item.typeId === currentTypeId);
    
    // 搜索过滤
    if (searchVal) {
        filtered = filtered.filter(item => 
            item.value.toLowerCase().includes(searchVal) || 
            item.label.toLowerCase().includes(searchVal)
        );
    }
    
    // 状态过滤
    if (statusVal !== '') {
        const status = statusVal === '1';
        filtered = filtered.filter(item => item.status === status);
    }
    
    // 排序
    filtered.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    
    // 分页
    const total = filtered.length;
    const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    
    displayData(paginated);
    createPagination(total, currentPage, pageSize, (page) => {
        currentPage = page;
        loadData();
    });
}

// 显示数据
function displayData(items) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    if (items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-inbox" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
                    暂无字典项数据
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = items.map(item => `
        <tr>
            <td>${item.id}</td>
            <td><code class="code-tag">${item.value}</code></td>
            <td>
                <span class="item-label">
                    ${item.icon ? `<i class="fas ${item.icon}"></i> ` : ''}${item.label}
                </span>
            </td>
            <td>
                <span class="style-preview ${item.style || ''}">
                    ${item.icon ? `<i class="fas ${item.icon}"></i> ` : ''}${item.label}
                </span>
            </td>
            <td>${item.sortOrder || 0}</td>
            <td>
                <label class="switch small">
                    <input type="checkbox" ${item.status !== false ? 'checked' : ''} 
                           onchange="toggleStatus(${item.id}, this.checked)">
                    <span class="slider"></span>
                </label>
            </td>
            <td>
                ${item.isSystem ? 
                    '<span class="badge secondary"><i class="fas fa-lock"></i> 系统</span>' : 
                    '<span class="badge info">自定义</span>'}
            </td>
            <td>
                <div class="action-btns">
                    <button class="action-btn primary" onclick="editItem(${item.id})" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${!item.isSystem ? `
                        <button class="action-btn danger" onclick="deleteItem(${item.id})" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// 初始化预览功能
function initPreview() {
    const labelInput = document.getElementById('itemLabel');
    const styleSelect = document.getElementById('itemStyle');
    const iconInput = document.getElementById('itemIcon');
    
    const updatePreview = () => {
        const label = labelInput.value || '标签预览';
        const style = styleSelect.value;
        const icon = iconInput.value;
        
        const preview = document.getElementById('stylePreview');
        preview.className = `style-preview ${style}`;
        preview.innerHTML = `${icon ? `<i class="fas ${icon}"></i> ` : ''}${label}`;
    };
    
    labelInput?.addEventListener('input', updatePreview);
    styleSelect?.addEventListener('change', updatePreview);
    iconInput?.addEventListener('input', updatePreview);
}

// 打开新增/编辑模态框
function openItemModal(id = null) {
    editingItemId = id;
    const modal = document.getElementById('itemModal');
    const title = document.getElementById('itemModalTitle');
    
    if (id) {
        title.textContent = '编辑字典项';
        const items = getData('dictItems') || [];
        const item = items.find(i => i.id === id);
        if (item) {
            document.getElementById('itemValue').value = item.value;
            document.getElementById('itemLabel').value = item.label;
            document.getElementById('itemStyle').value = item.style || '';
            document.getElementById('itemIcon').value = item.icon || '';
            document.getElementById('itemSort').value = item.sortOrder || 0;
            document.getElementById('itemStatus').checked = item.status !== false;
        }
    } else {
        title.textContent = '新增字典项';
        document.getElementById('itemValue').value = '';
        document.getElementById('itemLabel').value = '';
        document.getElementById('itemStyle').value = '';
        document.getElementById('itemIcon').value = '';
        document.getElementById('itemSort').value = 0;
        document.getElementById('itemStatus').checked = true;
    }
    
    // 更新预览
    const preview = document.getElementById('stylePreview');
    const label = document.getElementById('itemLabel').value || '标签预览';
    const style = document.getElementById('itemStyle').value;
    const icon = document.getElementById('itemIcon').value;
    preview.className = `style-preview ${style}`;
    preview.innerHTML = `${icon ? `<i class="fas ${icon}"></i> ` : ''}${label}`;
    
    modal.classList.add('show');
}

// 关闭模态框
function closeItemModal() {
    document.getElementById('itemModal').classList.remove('show');
    editingItemId = null;
}

// 保存字典项
function saveItem() {
    const value = document.getElementById('itemValue').value.trim();
    const label = document.getElementById('itemLabel').value.trim();
    const style = document.getElementById('itemStyle').value;
    const icon = document.getElementById('itemIcon').value.trim();
    const sortOrder = parseInt(document.getElementById('itemSort').value) || 0;
    const status = document.getElementById('itemStatus').checked;
    
    if (!value || !label) {
        alert('请填写字典值和显示标签');
        return;
    }
    
    const items = getData('dictItems') || [];
    
    // 检查值是否重复（同一类型下）
    const exists = items.find(i => 
        i.typeId === currentTypeId && 
        i.value === value && 
        i.id !== editingItemId
    );
    if (exists) {
        alert('该字典值在当前类型下已存在');
        return;
    }
    
    if (editingItemId) {
        // 编辑
        const item = items.find(i => i.id === editingItemId);
        if (item) {
            item.value = value;
            item.label = label;
            item.style = style;
            item.icon = icon;
            item.sortOrder = sortOrder;
            item.status = status;
            item.updatedAt = formatDateTime();
        }
        saveData('dictItems', items);
    } else {
        // 新增
        addData('dictItems', {
            typeId: currentTypeId,
            value,
            label,
            style,
            icon,
            sortOrder,
            status,
            isSystem: false,
            createdAt: formatDateTime(),
            updatedAt: formatDateTime()
        });
    }
    
    closeItemModal();
    loadData();
}

// 编辑字典项
function editItem(id) {
    openItemModal(id);
}

// 删除字典项
function deleteItem(id) {
    const items = getData('dictItems') || [];
    const item = items.find(i => i.id === id);
    
    if (!item) return;
    
    if (item.isSystem) {
        alert('系统内置字典项不能删除');
        return;
    }
    
    if (!confirm(`确定要删除字典项"${item.label}"吗？`)) {
        return;
    }
    
    deleteData('dictItems', id);
    loadData();
}

// 切换状态
function toggleStatus(id, status) {
    const items = getData('dictItems') || [];
    const item = items.find(i => i.id === id);
    if (item) {
        item.status = status;
        item.updatedAt = formatDateTime();
        saveData('dictItems', items);
    }
}

