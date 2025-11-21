// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    checkDailyFree();
    checkShareStatus();
    checkCheckInStatus();
});

// 初始化事件监听
function initEventListeners() {
    // 返回按钮
    document.getElementById('backBtn').addEventListener('click', function() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '../personal-center/index.html';
        }
    });

    // 观看广告
    document.getElementById('watchAdBtn').addEventListener('click', function() {
        watchAd();
    });

    // 分享好友
    document.getElementById('shareBtn').addEventListener('click', function() {
        shareToWeChat();
    });

    // 分享朋友圈
    document.getElementById('shareMomentsBtn').addEventListener('click', function() {
        shareToMoments();
    });

    // 邀请好友
    document.getElementById('inviteBtn').addEventListener('click', function() {
        inviteFriend();
    });

    // 每日签到
    document.getElementById('checkInBtn').addEventListener('click', function() {
        checkIn();
    });
}

// 检查每日免费领取状态
function checkDailyFree() {
    const lastResetDate = localStorage.getItem('lastResetDate');
    const today = new Date().toDateString();
    
    if (lastResetDate !== today) {
        // 新的一天，重置状态
        localStorage.setItem('lastResetDate', today);
        localStorage.setItem('dailyFreeClaimed', 'false');
        
        // 自动发放3个房豆
        let points = parseInt(localStorage.getItem('userPoints')) || 10;
        points += 3;
        localStorage.setItem('userPoints', points.toString());
        
        // 添加记录
        addConsumeRecord('每日自动发放', 3, 'earn');
    }
    
    const dailyFreeClaimed = localStorage.getItem('dailyFreeClaimed') === 'true';
    const dailyFreeStatus = document.getElementById('dailyFreeStatus');
    
    if (dailyFreeClaimed) {
        dailyFreeStatus.textContent = '已领取';
        dailyFreeStatus.style.color = '#FF9800';
    } else {
        dailyFreeStatus.textContent = '已领取';
        dailyFreeStatus.style.color = '#FF9800';
    }
}

// 检查分享状态
function checkShareStatus() {
    const shareClaimed = localStorage.getItem('shareClaimed') === 'true';
    const shareBtn = document.getElementById('shareBtn');
    
    if (shareClaimed) {
        shareBtn.textContent = '已分享';
        shareBtn.disabled = true;
    }
    
    const shareMomentsClaimed = localStorage.getItem('shareMomentsClaimed') === 'true';
    const shareMomentsBtn = document.getElementById('shareMomentsBtn');
    
    if (shareMomentsClaimed) {
        shareMomentsBtn.textContent = '已分享';
        shareMomentsBtn.disabled = true;
    }
}

// 检查签到状态
function checkCheckInStatus() {
    const lastCheckInDate = localStorage.getItem('lastCheckInDate');
    const today = new Date().toDateString();
    const checkInBtn = document.getElementById('checkInBtn');
    
    if (lastCheckInDate === today) {
        checkInBtn.textContent = '已签到';
        checkInBtn.disabled = true;
    }
}

// 观看广告
function watchAd() {
    if (confirm('观看广告可获得1个房豆，是否观看？')) {
        const watchBtn = document.getElementById('watchAdBtn');
        watchBtn.disabled = true;
        watchBtn.textContent = '观看中...';
        
        setTimeout(function() {
            // 增加房豆
            let points = parseInt(localStorage.getItem('userPoints')) || 10;
            points += 1;
            localStorage.setItem('userPoints', points.toString());
            
            // 添加记录
            addConsumeRecord('观看广告', 1, 'earn');
            
            watchBtn.disabled = false;
            watchBtn.textContent = '去观看';
            alert('观看完成！获得1个房豆');
        }, 2000);
    }
}

// 分享到微信
function shareToWeChat() {
    const shareClaimed = localStorage.getItem('shareClaimed') === 'true';
    
    if (shareClaimed) {
        alert('今日已分享，请明天再试');
        return;
    }
    
    if (confirm('分享到微信可获得1个房豆，是否分享？')) {
        const shareBtn = document.getElementById('shareBtn');
        shareBtn.disabled = true;
        shareBtn.textContent = '分享中...';
        
        setTimeout(function() {
            // 增加房豆
            let points = parseInt(localStorage.getItem('userPoints')) || 10;
            points += 1;
            localStorage.setItem('userPoints', points.toString());
            
            // 标记今日已分享
            localStorage.setItem('shareClaimed', 'true');
            
            // 添加记录
            addConsumeRecord('分享到微信', 1, 'earn');
            
            shareBtn.textContent = '已分享';
            alert('分享成功！获得1个房豆');
        }, 1500);
    }
}

// 分享到朋友圈
function shareToMoments() {
    const shareMomentsClaimed = localStorage.getItem('shareMomentsClaimed') === 'true';
    
    if (shareMomentsClaimed) {
        alert('今日已分享朋友圈，请明天再试');
        return;
    }
    
    if (confirm('分享到朋友圈可获得2个房豆，是否分享？')) {
        const shareMomentsBtn = document.getElementById('shareMomentsBtn');
        shareMomentsBtn.disabled = true;
        shareMomentsBtn.textContent = '分享中...';
        
        setTimeout(function() {
            // 增加房豆
            let points = parseInt(localStorage.getItem('userPoints')) || 10;
            points += 2;
            localStorage.setItem('userPoints', points.toString());
            
            // 标记今日已分享
            localStorage.setItem('shareMomentsClaimed', 'true');
            
            // 添加记录
            addConsumeRecord('分享朋友圈', 2, 'earn');
            
            shareMomentsBtn.textContent = '已分享';
            alert('分享成功！获得2个房豆');
        }, 1500);
    }
}

// 邀请好友
function inviteFriend() {
    if (confirm('邀请好友注册成功后可获得5个房豆，是否生成邀请链接？')) {
        // 生成邀请码
        const inviteCode = 'INV' + Date.now().toString().slice(-6);
        
        // 复制邀请链接
        const inviteLink = `https://example.com/invite/${inviteCode}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(inviteLink).then(function() {
                alert('邀请链接已复制到剪贴板：\n' + inviteLink + '\n\n好友注册成功后，您将获得5个房豆');
            });
        } else {
            alert('您的邀请链接：\n' + inviteLink + '\n\n好友注册成功后，您将获得5个房豆');
        }
        
        // 保存邀请码
        localStorage.setItem('inviteCode', inviteCode);
    }
}

// 每日签到
function checkIn() {
    const lastCheckInDate = localStorage.getItem('lastCheckInDate');
    const today = new Date().toDateString();
    
    if (lastCheckInDate === today) {
        alert('今日已签到，请明天再来');
        return;
    }
    
    if (confirm('每日签到可获得1个房豆，是否签到？')) {
        const checkInBtn = document.getElementById('checkInBtn');
        checkInBtn.disabled = true;
        checkInBtn.textContent = '签到中...';
        
        setTimeout(function() {
            // 增加房豆
            let points = parseInt(localStorage.getItem('userPoints')) || 10;
            points += 1;
            localStorage.setItem('userPoints', points.toString());
            
            // 标记今日已签到
            localStorage.setItem('lastCheckInDate', today);
            
            // 添加记录
            addConsumeRecord('每日签到', 1, 'earn');
            
            checkInBtn.textContent = '已签到';
            alert('签到成功！获得1个房豆');
        }, 1000);
    }
}

// 添加消费记录
function addConsumeRecord(title, amount, type) {
    const records = JSON.parse(localStorage.getItem('consumeRecords') || '[]');
    const record = {
        id: Date.now(),
        title: title,
        amount: amount,
        type: type,
        time: new Date().toLocaleString('zh-CN')
    };
    
    records.unshift(record);
    
    if (records.length > 50) {
        records.pop();
    }
    
    localStorage.setItem('consumeRecords', JSON.stringify(records));
}

