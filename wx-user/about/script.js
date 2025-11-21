// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
});

// 初始化事件监听
function initEventListeners() {
    // 返回按钮
    document.getElementById('backBtn').addEventListener('click', function() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '../home/index.html';
        }
    });

    // 邮箱点击
    document.getElementById('emailValue').addEventListener('click', function() {
        const email = this.textContent;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(email).then(function() {
                alert('邮箱地址已复制到剪贴板：' + email);
            });
        } else {
            alert('客服邮箱：' + email);
        }
    });

    // 电话点击
    document.getElementById('phoneValue').addEventListener('click', function() {
        const phone = this.textContent;
        if (confirm('是否拨打客服电话：' + phone + '？')) {
            window.location.href = 'tel:' + phone;
        }
    });

    // 微信点击
    document.getElementById('wechatValue').addEventListener('click', function() {
        const wechat = this.textContent;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(wechat).then(function() {
                alert('微信号已复制到剪贴板：' + wechat + '\n\n请在微信中搜索并添加');
            });
        } else {
            alert('客服微信：' + wechat + '\n\n请在微信中搜索并添加');
        }
    });
}

