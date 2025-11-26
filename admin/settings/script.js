// 系统设置页面脚本

function initPage() {
    const data = JSON.parse(localStorage.getItem('adminMockData') || JSON.stringify(mockData));
    const settings = data.settings || mockData.settings;
    
    // 加载设置值
    document.getElementById('contactPointsCost').value = settings.contactPointsCost || 1;
    document.getElementById('firstLoginReward').value = settings.firstLoginReward || 10;
    document.getElementById('publishHouseReward').value = settings.publishHouseReward || 5;
    document.getElementById('autoReviewHouses').checked = settings.autoReviewHouses !== false;
    document.getElementById('autoAuthVerify').checked = settings.autoAuthVerify === true;
    
    // 保存设置
    document.getElementById('saveSettingsBtn')?.addEventListener('click', () => {
        const data = JSON.parse(localStorage.getItem('adminMockData') || JSON.stringify(mockData));
        data.settings = {
            contactPointsCost: parseInt(document.getElementById('contactPointsCost').value) || 1,
            firstLoginReward: parseInt(document.getElementById('firstLoginReward').value) || 10,
            publishHouseReward: parseInt(document.getElementById('publishHouseReward').value) || 5,
            autoReviewHouses: document.getElementById('autoReviewHouses').checked,
            autoAuthVerify: document.getElementById('autoAuthVerify').checked
        };
        localStorage.setItem('adminMockData', JSON.stringify(data));
        alert('设置保存成功！');
    });
    
    // 编辑公告
    document.getElementById('editNoticeBtn')?.addEventListener('click', () => {
        alert('系统公告编辑功能待开发');
    });
    
    // 数据备份
    document.getElementById('backupBtn')?.addEventListener('click', () => {
        const data = localStorage.getItem('adminMockData');
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        alert('数据备份成功！');
    });
}

