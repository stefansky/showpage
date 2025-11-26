// 数据概览页面脚本

function initPage() {
    const data = JSON.parse(localStorage.getItem('adminMockData') || JSON.stringify(mockData));
    
    // 统计数据
    document.getElementById('totalUsers')?.setAttribute('data-value', data.users?.length || 0);
    document.getElementById('totalStores')?.setAttribute('data-value', data.stores?.length || 0);
    document.getElementById('totalHouses')?.setAttribute('data-value', data.houses?.length || 0);
    document.getElementById('pendingReviews')?.setAttribute('data-value', 
        (data.authReviews?.filter(a => a.status === 'pending').length || 0) + 
        (data.houses?.filter(h => h.status === 'pending').length || 0)
    );

    // 今日数据
    const today = new Date().toISOString().split('T')[0];
    const todayUsers = data.users?.filter(u => u.registerTime?.startsWith(today)).length || 0;
    const todayHouses = data.houses?.filter(h => h.publishTime?.startsWith(today)).length || 0;
    const todayFindRequests = data.findRequests?.filter(f => f.publishTime?.startsWith(today)).length || 0;
    const todayReports = data.reports?.filter(r => r.status === 'pending').length || 0;

    document.getElementById('todayUsers')?.setAttribute('data-value', todayUsers);
    document.getElementById('todayHouses')?.setAttribute('data-value', todayHouses);
    document.getElementById('todayFindRequests')?.setAttribute('data-value', todayFindRequests);
    document.getElementById('todayReports')?.setAttribute('data-value', todayReports);

    // 更新显示
    updateStatValues();
    
    // 最近活动
    const activityList = document.getElementById('activityList');
    if (activityList) {
        const activities = (data.activities || []).slice(0, 5);
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon" style="background: ${getActivityColor(activity.type)}">
                    <i class="fas ${getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">${activity.content}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');
    }
}

