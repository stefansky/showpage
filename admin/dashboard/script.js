// 数据概览页面脚本

// 初始化页面
function initPage() {
    // 显示当前日期
    displayCurrentDate();
    
    // 加载统计数据
    loadStats();
    
    // 初始化图表
    initCharts();
    
    // 加载热门城市
    loadCities();
    
    // 绑定图表切换事件
    bindChartTabs();
}

// 显示当前日期
function displayCurrentDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('zh-CN', options);
}

// 加载统计数据
function loadStats() {
    const users = getData('users') || [];
    const houses = getData('houses') || [];
    const stores = getData('stores') || [];
    const points = getData('pointsRecords') || [];
    const reports = getData('reportRecords') || [];
    const apps = getData('storeApplications') || [];
    const visits = getData('visitRecords') || [];
    const contacts = getData('contactRecords') || [];
    
    // 用户统计
    const tenants = users.filter(u => u.role === 'tenant');
    const landlords = users.filter(u => u.role === 'landlord');
    
    animateValue('totalUsers', 0, users.length, 1000);
    animateValue('tenantCount', 0, tenants.length, 800);
    animateValue('landlordCount', 0, landlords.length, 800);
    
    // 房源统计
    const activeHouses = houses.filter(h => h.status === 1);
    const rentedHouses = houses.filter(h => h.status === 3);
    const pendingHousesCount = houses.filter(h => h.status === 0).length;
    
    animateValue('totalHouses', 0, houses.length, 1000);
    animateValue('activeHouses', 0, activeHouses.length, 800);
    animateValue('rentedHouses', 0, rentedHouses.length, 800);
    animateValue('totalHousesChart', 0, houses.length, 1000);
    
    // 房源分布
    const wholeRent = houses.filter(h => h.rentMode === 1).length;
    const sharedRent = houses.filter(h => h.rentMode === 2).length;
    animateValue('wholeRent', 0, wholeRent, 800);
    animateValue('sharedRent', 0, sharedRent, 800);
    
    // 更新环形图
    setTimeout(() => updateDonutChart(wholeRent, sharedRent), 500);
    
    // 商家统计
    const openStores = stores.filter(s => s.status === 'open');
    const pendingStoresCount = apps.filter(a => a.status === 0).length;
    
    animateValue('totalStores', 0, stores.length, 1000);
    animateValue('openStores', 0, openStores.length, 800);
    animateValue('pendingStores', 0, pendingStoresCount, 800);
    
    // 房豆统计
    const earnPoints = points.filter(p => p.points > 0).reduce((sum, p) => sum + p.points, 0);
    const consumePoints = Math.abs(points.filter(p => p.points < 0).reduce((sum, p) => sum + p.points, 0));
    
    animateValue('totalPoints', 0, earnPoints + consumePoints, 1000);
    animateValue('earnPoints', 0, earnPoints, 800);
    animateValue('consumePoints', 0, consumePoints, 800);
    
    // 今日数据（模拟）
    animateValue('todayUsers', 0, Math.floor(Math.random() * 20) + 5, 600);
    animateValue('todayHouses', 0, Math.floor(Math.random() * 15) + 3, 600);
    animateValue('todayVisits', 0, Math.floor(Math.random() * 30) + 10, 600);
    animateValue('todayContacts', 0, Math.floor(Math.random() * 50) + 20, 600);
    
    // 待办事项
    document.getElementById('pendingHouses').textContent = pendingHousesCount;
    document.getElementById('pendingReports').textContent = reports.filter(r => r.status === 0).length;
    document.getElementById('pendingApps').textContent = pendingStoresCount;
    document.getElementById('pendingVisits').textContent = visits.filter(v => v.status === 0).length;
}

// 数字动画
function animateValue(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + range * easeProgress);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// 更新环形图
function updateDonutChart(whole, shared) {
    const total = whole + shared;
    if (total === 0) return;
    
    const circumference = 2 * Math.PI * 40; // r=40
    const wholePercent = whole / total;
    const sharedPercent = shared / total;
    
    const wholeSegment = document.querySelector('.donut-segment.whole');
    const sharedSegment = document.querySelector('.donut-segment.shared');
    
    const wholeDash = circumference * wholePercent;
    const sharedDash = circumference * sharedPercent;
    
    wholeSegment.style.strokeDasharray = `${wholeDash} ${circumference}`;
    sharedSegment.style.strokeDasharray = `${sharedDash} ${circumference}`;
    sharedSegment.style.strokeDashoffset = -wholeDash;
}

// 初始化图表
function initCharts() {
    drawLineChart('userChartCanvas', generateChartData('users', 7));
    drawLineChart('houseChartCanvas', generateChartData('houses', 7));
    drawLineChart('businessChartCanvas', generateChartData('business', 7));
}

// 生成图表数据
function generateChartData(type, days) {
    const labels = [];
    const data1 = [];
    const data2 = [];
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
        
        // 模拟数据趋势
        if (type === 'users') {
            data1.push(Math.floor(Math.random() * 15) + 5 + (days - i) * 2);
            data2.push(Math.floor(Math.random() * 8) + 2 + (days - i));
        } else if (type === 'houses') {
            data1.push(Math.floor(Math.random() * 10) + 3 + (days - i));
            data2.push(Math.floor(Math.random() * 5) + 1 + Math.floor((days - i) / 2));
        } else {
            data1.push(Math.floor(Math.random() * 20) + 10 + (days - i) * 2);
            data2.push(Math.floor(Math.random() * 30) + 15 + (days - i) * 3);
        }
    }
    
    return { labels, data1, data2 };
}

// 绘制折线图
function drawLineChart(canvasId, chartData) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    
    // 设置canvas尺寸
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = 200 * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '200px';
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = 200;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 计算数据范围
    const allData = [...chartData.data1, ...chartData.data2];
    const maxValue = Math.max(...allData) * 1.2;
    const minValue = 0;
    
    // 绘制网格线
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
    }
    
    // 绘制X轴标签
    ctx.fillStyle = '#999';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    chartData.labels.forEach((label, i) => {
        const x = padding.left + (chartWidth / (chartData.labels.length - 1)) * i;
        ctx.fillText(label, x, height - 10);
    });
    
    // 绘制Y轴标签
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
        const value = Math.round(maxValue - (maxValue / 4) * i);
        const y = padding.top + (chartHeight / 4) * i + 4;
        ctx.fillText(value, padding.left - 8, y);
    }
    
    // 绘制数据线函数
    function drawLine(data, color, gradient) {
        const points = data.map((value, i) => ({
            x: padding.left + (chartWidth / (data.length - 1)) * i,
            y: padding.top + chartHeight - (value / maxValue) * chartHeight
        }));
        
        // 绘制填充区域
        ctx.beginPath();
        ctx.moveTo(points[0].x, padding.top + chartHeight);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight);
        ctx.closePath();
        
        const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        grad.addColorStop(0, gradient + '30');
        grad.addColorStop(1, gradient + '05');
        ctx.fillStyle = grad;
        ctx.fill();
        
        // 绘制线条
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        
        // 绘制数据点
        points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }
    
    // 根据canvas ID确定颜色
    let color1, color2, grad1, grad2;
    if (canvasId === 'userChartCanvas') {
        color1 = '#667eea'; grad1 = '#667eea';
        color2 = '#11998e'; grad2 = '#11998e';
    } else if (canvasId === 'houseChartCanvas') {
        color1 = '#667eea'; grad1 = '#667eea';
        color2 = '#f7971e'; grad2 = '#f7971e';
    } else {
        color1 = '#ee0979'; grad1 = '#ee0979';
        color2 = '#11998e'; grad2 = '#11998e';
    }
    
    drawLine(chartData.data1, color1, grad1);
    drawLine(chartData.data2, color2, grad2);
}

// 绑定图表切换事件
function bindChartTabs() {
    document.querySelectorAll('.chart-tabs').forEach(tabs => {
        tabs.querySelectorAll('.chart-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                // 更新active状态
                tabs.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // 获取天数
                const range = this.dataset.range;
                let days = 7;
                if (range === 'month') days = 30;
                else if (range === 'quarter') days = 90;
                
                // 获取对应的canvas
                const chartCard = this.closest('.chart-card');
                const canvas = chartCard.querySelector('canvas');
                if (canvas) {
                    const type = canvas.id.includes('user') ? 'users' : 
                                 canvas.id.includes('house') ? 'houses' : 'business';
                    drawLineChart(canvas.id, generateChartData(type, days));
                }
            });
        });
    });
}

// 加载热门城市
function loadCities() {
    const cities = getData('cities') || [];
    const cityList = document.getElementById('cityList');
    if (!cityList) return;
    
    // 按房源数量排序
    cities.sort((a, b) => b.houseCount - a.houseCount);
    const maxCount = cities[0]?.houseCount || 100;
    
    cityList.innerHTML = cities.slice(0, 5).map((city, index) => {
        let rankClass = 'normal';
        if (index === 0) rankClass = 'top1';
        else if (index === 1) rankClass = 'top2';
        else if (index === 2) rankClass = 'top3';
        
        const percent = (city.houseCount / maxCount) * 100;
        
        return `
            <div class="city-item">
                <span class="city-rank ${rankClass}">${index + 1}</span>
                <span class="city-name">${city.name}</span>
                <div class="city-bar">
                    <div class="city-bar-fill" style="width: ${percent}%"></div>
                </div>
                <span class="city-count">${city.houseCount}套</span>
            </div>
        `;
    }).join('');
}

// 窗口大小改变时重绘图表
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        initCharts();
    }, 250);
});
