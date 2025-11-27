// 系统设置页面脚本

// 初始化页面
function initPage() {
    // 绑定导航切换
    bindNavTabs();
    
    // 加载设置
    loadSettings();
}

// 绑定导航切换
function bindNavTabs() {
    document.querySelectorAll('.settings-nav-item').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // 更新导航状态
            document.querySelectorAll('.settings-nav-item').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 切换面板
            document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(`panel-${tabId}`).classList.add('active');
        });
    });
}

// 加载设置
function loadSettings() {
    const settings = getData('systemSettings') || getDefaultSettings();
    
    // 基础设置
    document.getElementById('contactPointsCost').value = settings.contactPointsCost || 1;
    document.getElementById('registerReward').value = settings.registerReward || 10;
    document.getElementById('publishHouseReward').value = settings.publishHouseReward || 5;
    document.getElementById('publishFindReward').value = settings.publishFindReward || 3;
    document.getElementById('dailySignReward').value = settings.dailySignReward || 2;
    document.getElementById('adWatchReward').value = settings.adWatchReward || 1;
    
    document.getElementById('autoReviewHouse').checked = settings.autoReviewHouse || false;
    document.getElementById('autoReviewFind').checked = settings.autoReviewFind !== false;
    
    document.getElementById('enableNotice').checked = settings.enableNotice || false;
    document.getElementById('noticeContent').value = settings.noticeContent || '';
    
    // 七牛云
    document.getElementById('qiniuAK').value = settings.qiniuAK || '';
    document.getElementById('qiniuSK').value = settings.qiniuSK || '';
    document.getElementById('qiniuBucket').value = settings.qiniuBucket || '';
    document.getElementById('qiniuRegion').value = settings.qiniuRegion || '';
    document.getElementById('qiniuDomain').value = settings.qiniuDomain || '';
    updateStatus('qiniuStatus', settings.qiniuAK && settings.qiniuSK && settings.qiniuBucket);
    
    // 高德地图
    document.getElementById('amapWebKey').value = settings.amapWebKey || '';
    document.getElementById('amapMiniKey').value = settings.amapMiniKey || '';
    updateStatus('amapStatus', settings.amapWebKey);
    
    // 百度地图
    document.getElementById('bmapServerAK').value = settings.bmapServerAK || '';
    document.getElementById('bmapMiniAK').value = settings.bmapMiniAK || '';
    updateStatus('bmapStatus', settings.bmapServerAK);
    
    // 腾讯地图
    document.getElementById('qqmapKey').value = settings.qqmapKey || '';
    updateStatus('qqmapStatus', settings.qqmapKey);
    
    // 微信
    document.getElementById('wxAppId').value = settings.wxAppId || '';
    document.getElementById('wxAppSecret').value = settings.wxAppSecret || '';
    updateStatus('wechatStatus', settings.wxAppId && settings.wxAppSecret);
    
    // 阿里云短信
    document.getElementById('aliSmsAKId').value = settings.aliSmsAKId || '';
    document.getElementById('aliSmsAKSecret').value = settings.aliSmsAKSecret || '';
    document.getElementById('aliSmsSign').value = settings.aliSmsSign || '';
    document.getElementById('aliSmsTemplate').value = settings.aliSmsTemplate || '';
    updateStatus('aliyunSmsStatus', settings.aliSmsAKId && settings.aliSmsAKSecret);
    
    // 腾讯云短信
    document.getElementById('txSmsSecretId').value = settings.txSmsSecretId || '';
    document.getElementById('txSmsSecretKey').value = settings.txSmsSecretKey || '';
    document.getElementById('txSmsAppId').value = settings.txSmsAppId || '';
    document.getElementById('txSmsSign').value = settings.txSmsSign || '';
}

// 获取默认设置
function getDefaultSettings() {
    return {
        contactPointsCost: 1,
        registerReward: 10,
        publishHouseReward: 5,
        publishFindReward: 3,
        dailySignReward: 2,
        adWatchReward: 1,
        autoReviewHouse: false,
        autoReviewFind: true,
        enableNotice: false,
        noticeContent: ''
    };
}

// 更新状态显示
function updateStatus(elementId, isConfigured) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    if (isConfigured) {
        el.classList.add('connected');
        el.classList.remove('error');
        el.querySelector('.status-text').textContent = '已配置';
    } else {
        el.classList.remove('connected', 'error');
        el.querySelector('.status-text').textContent = '未配置';
    }
}

// 保存设置
function saveSettings() {
    const settings = {
        // 基础设置
        contactPointsCost: parseInt(document.getElementById('contactPointsCost').value) || 1,
        registerReward: parseInt(document.getElementById('registerReward').value) || 10,
        publishHouseReward: parseInt(document.getElementById('publishHouseReward').value) || 5,
        publishFindReward: parseInt(document.getElementById('publishFindReward').value) || 3,
        dailySignReward: parseInt(document.getElementById('dailySignReward').value) || 2,
        adWatchReward: parseInt(document.getElementById('adWatchReward').value) || 1,
        
        autoReviewHouse: document.getElementById('autoReviewHouse').checked,
        autoReviewFind: document.getElementById('autoReviewFind').checked,
        
        enableNotice: document.getElementById('enableNotice').checked,
        noticeContent: document.getElementById('noticeContent').value.trim(),
        
        // 七牛云
        qiniuAK: document.getElementById('qiniuAK').value.trim(),
        qiniuSK: document.getElementById('qiniuSK').value.trim(),
        qiniuBucket: document.getElementById('qiniuBucket').value.trim(),
        qiniuRegion: document.getElementById('qiniuRegion').value,
        qiniuDomain: document.getElementById('qiniuDomain').value.trim(),
        
        // 高德地图
        amapWebKey: document.getElementById('amapWebKey').value.trim(),
        amapMiniKey: document.getElementById('amapMiniKey').value.trim(),
        
        // 百度地图
        bmapServerAK: document.getElementById('bmapServerAK').value.trim(),
        bmapMiniAK: document.getElementById('bmapMiniAK').value.trim(),
        
        // 腾讯地图
        qqmapKey: document.getElementById('qqmapKey').value.trim(),
        
        // 微信
        wxAppId: document.getElementById('wxAppId').value.trim(),
        wxAppSecret: document.getElementById('wxAppSecret').value.trim(),
        
        // 阿里云短信
        aliSmsAKId: document.getElementById('aliSmsAKId').value.trim(),
        aliSmsAKSecret: document.getElementById('aliSmsAKSecret').value.trim(),
        aliSmsSign: document.getElementById('aliSmsSign').value.trim(),
        aliSmsTemplate: document.getElementById('aliSmsTemplate').value.trim(),
        
        // 腾讯云短信
        txSmsSecretId: document.getElementById('txSmsSecretId').value.trim(),
        txSmsSecretKey: document.getElementById('txSmsSecretKey').value.trim(),
        txSmsAppId: document.getElementById('txSmsAppId').value.trim(),
        txSmsSign: document.getElementById('txSmsSign').value.trim(),
        
        updatedAt: formatDateTime()
    };
    
    saveData('systemSettings', settings);
    
    // 更新状态
    updateStatus('qiniuStatus', settings.qiniuAK && settings.qiniuSK && settings.qiniuBucket);
    updateStatus('amapStatus', settings.amapWebKey);
    updateStatus('bmapStatus', settings.bmapServerAK);
    updateStatus('qqmapStatus', settings.qqmapKey);
    updateStatus('wechatStatus', settings.wxAppId && settings.wxAppSecret);
    updateStatus('aliyunSmsStatus', settings.aliSmsAKId && settings.aliSmsAKSecret);
    
    alert('设置保存成功！');
}

// 重置设置
function resetSettings() {
    if (!confirm('确定要重置所有设置为默认值吗？')) return;
    
    saveData('systemSettings', getDefaultSettings());
    loadSettings();
    alert('设置已重置！');
}

// 测试七牛云连接
function testQiniu() {
    const ak = document.getElementById('qiniuAK').value.trim();
    const sk = document.getElementById('qiniuSK').value.trim();
    const bucket = document.getElementById('qiniuBucket').value.trim();
    
    if (!ak || !sk || !bucket) {
        alert('请先填写七牛云配置信息');
        return;
    }
    
    // 模拟测试
    simulateTest('qiniuStatus', '正在测试七牛云连接...');
}

// 测试高德地图
function testAmap() {
    const key = document.getElementById('amapWebKey').value.trim();
    
    if (!key) {
        alert('请先填写高德地图 Key');
        return;
    }
    
    simulateTest('amapStatus', '正在测试高德地图...');
}

// 测试百度地图
function testBmap() {
    const ak = document.getElementById('bmapServerAK').value.trim();
    
    if (!ak) {
        alert('请先填写百度地图 AK');
        return;
    }
    
    simulateTest('bmapStatus', '正在测试百度地图...');
}

// 测试腾讯地图
function testQQMap() {
    const key = document.getElementById('qqmapKey').value.trim();
    
    if (!key) {
        alert('请先填写腾讯位置服务 Key');
        return;
    }
    
    simulateTest('qqmapStatus', '正在测试腾讯位置服务...');
}

// 测试阿里云短信
function testAliSms() {
    const akId = document.getElementById('aliSmsAKId').value.trim();
    const akSecret = document.getElementById('aliSmsAKSecret').value.trim();
    
    if (!akId || !akSecret) {
        alert('请先填写阿里云短信配置信息');
        return;
    }
    
    simulateTest('aliyunSmsStatus', '正在测试阿里云短信...');
}

// 发送测试短信
function sendTestSms() {
    const phone = prompt('请输入接收测试短信的手机号：');
    if (!phone) return;
    
    if (!/^1\d{10}$/.test(phone)) {
        alert('请输入正确的手机号');
        return;
    }
    
    alert('测试短信已发送！（模拟）');
}

// 模拟测试
function simulateTest(statusId, message) {
    const el = document.getElementById(statusId);
    el.classList.remove('connected', 'error');
    el.querySelector('.status-text').textContent = '测试中...';
    
    // 模拟异步测试
    setTimeout(() => {
        // 随机成功或失败（演示用）
        const success = Math.random() > 0.3;
        
        if (success) {
            el.classList.add('connected');
            el.querySelector('.status-text').textContent = '连接成功';
            setTimeout(() => {
                el.querySelector('.status-text').textContent = '已配置';
            }, 2000);
        } else {
            el.classList.add('error');
            el.querySelector('.status-text').textContent = '连接失败';
            setTimeout(() => {
                el.classList.remove('error');
                el.querySelector('.status-text').textContent = '已配置';
            }, 2000);
        }
    }, 1500);
}
