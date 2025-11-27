// 字典类型列表页脚本

let currentPage = 1;
const pageSize = 10;
let editingTypeId = null;

// 初始化页面
function initPage() {
    loadData();
    
    // 搜索框事件
    document.getElementById('searchInput')?.addEventListener('input', debounce(() => {
        currentPage = 1;
        loadData();
    }, 300));
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 加载数据
function loadData() {
    const types = getData('dictTypes') || [];
    const items = getData('dictItems') || [];
    const searchVal = document.getElementById('searchInput')?.value?.toLowerCase() || '';
    
    // 过滤
    let filtered = types.filter(type => {
        if (searchVal) {
            return type.name.toLowerCase().includes(searchVal) || 
                   type.code.toLowerCase().includes(searchVal);
        }
        return true;
    });
    
    // 排序
    filtered.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    
    // 分页
    const total = filtered.length;
    const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    
    displayData(paginated, items);
    createPagination(total, currentPage, pageSize, (page) => {
        currentPage = page;
        loadData();
    });
}

// 显示数据
function displayData(types, allItems) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    if (types.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-inbox" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
                    暂无字典类型数据
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = types.map(type => {
        const itemCount = allItems.filter(item => item.typeId === type.id).length;
        
        return `
            <tr>
                <td>${type.id}</td>
                <td><code class="code-tag">${type.code}</code></td>
                <td>
                    <span class="type-name-link" onclick="viewDetail(${type.id})">${type.name}</span>
                </td>
                <td><span class="desc-text">${type.description || '-'}</span></td>
                <td>
                    <span class="count-badge" onclick="viewDetail(${type.id})">
                        <i class="fas fa-list"></i> ${itemCount}项
                    </span>
                </td>
                <td>${type.sortOrder || 0}</td>
                <td>
                    ${type.isSystem ? 
                        '<span class="badge secondary"><i class="fas fa-lock"></i> 系统</span>' : 
                        '<span class="badge info">自定义</span>'}
                </td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn info" onclick="viewDetail(${type.id})" title="管理字典项">
                            <i class="fas fa-cog"></i>
                        </button>
                        <button class="action-btn primary" onclick="editType(${type.id})" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${!type.isSystem ? `
                            <button class="action-btn danger" onclick="deleteType(${type.id})" title="删除">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// 查看详情（跳转到字典项管理页）
function viewDetail(typeId) {
    window.location.href = `detail.html?id=${typeId}`;
}

// 打开新增/编辑模态框
function openTypeModal(id = null) {
    editingTypeId = id;
    const modal = document.getElementById('typeModal');
    const title = document.getElementById('typeModalTitle');
    const codeInput = document.getElementById('typeCode');
    
    if (id) {
        title.textContent = '编辑字典类型';
        const types = getData('dictTypes') || [];
        const type = types.find(t => t.id === id);
        if (type) {
            codeInput.value = type.code;
            codeInput.disabled = true; // 编辑时不允许修改编码
            document.getElementById('typeName').value = type.name;
            document.getElementById('typeDesc').value = type.description || '';
            document.getElementById('typeSort').value = type.sortOrder || 0;
        }
    } else {
        title.textContent = '新增字典类型';
        codeInput.value = '';
        codeInput.disabled = false;
        document.getElementById('typeName').value = '';
        document.getElementById('typeDesc').value = '';
        document.getElementById('typeSort').value = 0;
    }
    
    modal.classList.add('show');
}

// 关闭模态框
function closeTypeModal() {
    document.getElementById('typeModal').classList.remove('show');
    editingTypeId = null;
}

// 保存字典类型
function saveType() {
    const code = document.getElementById('typeCode').value.trim();
    const name = document.getElementById('typeName').value.trim();
    const description = document.getElementById('typeDesc').value.trim();
    const sortOrder = parseInt(document.getElementById('typeSort').value) || 0;
    
    if (!code || !name) {
        alert('请填写类型编码和名称');
        return;
    }
    
    // 验证编码格式
    if (!/^[a-z][a-z0-9_]*$/.test(code)) {
        alert('类型编码格式不正确，请使用小写字母开头，仅包含字母、数字和下划线');
        return;
    }
    
    const types = getData('dictTypes') || [];
    
    // 检查编码是否重复
    const exists = types.find(t => t.code === code && t.id !== editingTypeId);
    if (exists) {
        alert('该类型编码已存在');
        return;
    }
    
    if (editingTypeId) {
        // 编辑
        const type = types.find(t => t.id === editingTypeId);
        if (type) {
            if (type.isSystem) {
                // 系统类型只能修改名称和描述
                type.name = name;
                type.description = description;
            } else {
                type.code = code;
                type.name = name;
                type.description = description;
                type.sortOrder = sortOrder;
            }
            type.updatedAt = formatDateTime();
        }
        saveData('dictTypes', types);
    } else {
        // 新增
        addData('dictTypes', {
            code,
            name,
            description,
            sortOrder,
            isSystem: false,
            createdAt: formatDateTime(),
            updatedAt: formatDateTime()
        });
    }
    
    closeTypeModal();
    loadData();
}

// 编辑字典类型
function editType(id) {
    openTypeModal(id);
}

// 删除字典类型
function deleteType(id) {
    const types = getData('dictTypes') || [];
    const type = types.find(t => t.id === id);
    
    if (!type) return;
    
    if (type.isSystem) {
        alert('系统内置类型不能删除');
        return;
    }
    
    // 检查是否有字典项
    const items = getData('dictItems') || [];
    const itemCount = items.filter(item => item.typeId === id).length;
    
    const confirmMsg = itemCount > 0 
        ? `确定要删除字典类型"${type.name}"吗？\n该类型下有 ${itemCount} 个字典项也将被删除！`
        : `确定要删除字典类型"${type.name}"吗？`;
    
    if (!confirm(confirmMsg)) {
        return;
    }
    
    // 删除类型
    deleteData('dictTypes', id);
    
    // 删除该类型下的所有字典项
    if (itemCount > 0) {
        const filtered = items.filter(item => item.typeId !== id);
        saveData('dictItems', filtered);
    }
    
    loadData();
}
