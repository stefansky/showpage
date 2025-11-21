// 模拟房源数据
const mockHouses = [
    { id: 1, title: '光谷广场精装两室一厅', location: '光谷广场', price: 2500, area: 65, rooms: '2室1厅', floor: '5/10' },
    { id: 2, title: '光谷步行街附近单间', location: '光谷广场', price: 1200, area: 25, rooms: '1室1厅', floor: '3/6' },
    { id: 3, title: '光谷软件园三室两厅', location: '光谷广场', price: 3500, area: 95, rooms: '3室2厅', floor: '8/15' },
    { id: 4, title: '街道口地铁口一室一厅', location: '街道口', price: 1800, area: 45, rooms: '1室1厅', floor: '2/8' },
    { id: 5, title: '街道口商圈两室一厅', location: '街道口', price: 2800, area: 70, rooms: '2室1厅', floor: '6/12' },
    { id: 6, title: '汉街精装三室两厅', location: '汉街', price: 4500, area: 110, rooms: '3室2厅', floor: '10/20' },
    { id: 7, title: '汉街附近两室一厅', location: '汉街', price: 3200, area: 80, rooms: '2室1厅', floor: '5/15' },
    { id: 8, title: '徐东地铁站附近单间', location: '徐东', price: 1500, area: 30, rooms: '1室1厅', floor: '4/10' },
    { id: 9, title: '积玉桥精装两室一厅', location: '积玉桥', price: 2200, area: 60, rooms: '2室1厅', floor: '3/9' },
    { id: 10, title: '中南路商圈三室两厅', location: '中南路', price: 3800, area: 100, rooms: '3室2厅', floor: '7/18' }
];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadSearchHistory();
    checkUrlParams();
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

    // 搜索输入框
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const clearBtn = document.getElementById('clearBtn');
        if (this.value.trim()) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 清空按钮
    document.getElementById('clearBtn').addEventListener('click', function() {
        searchInput.value = '';
        this.style.display = 'none';
        searchInput.focus();
    });

    // 搜索按钮
    document.getElementById('searchBtn').addEventListener('click', function() {
        performSearch();
    });

    // 清空历史
    document.getElementById('clearHistoryBtn').addEventListener('click', function() {
        if (confirm('确定要清空搜索历史吗？')) {
            localStorage.removeItem('searchHistory');
            document.getElementById('historyList').innerHTML = '';
            document.getElementById('historySection').style.display = 'none';
        }
    });

    // 热门标签
    document.querySelectorAll('.hot-tag').forEach(function(tag) {
        tag.addEventListener('click', function() {
            const keyword = this.getAttribute('data-keyword');
            searchInput.value = keyword;
            performSearch();
        });
    });
}

// 检查URL参数
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('keyword');
    if (keyword) {
        document.getElementById('searchInput').value = keyword;
        performSearch();
    }
}

// 执行搜索
function performSearch() {
    const keyword = document.getElementById('searchInput').value.trim();
    
    if (!keyword) {
        alert('请输入搜索关键词');
        return;
    }

    // 保存搜索历史
    saveSearchHistory(keyword);

    // 隐藏历史记录和热门搜索
    document.getElementById('historySection').style.display = 'none';
    document.getElementById('hotSection').style.display = 'none';

    // 显示搜索结果
    document.getElementById('resultSection').style.display = 'block';

    // 执行搜索
    const results = searchHouses(keyword);
    displayResults(results, keyword);
}

// 搜索房源
function searchHouses(keyword) {
    return mockHouses.filter(function(house) {
        return house.title.includes(keyword) || house.location.includes(keyword);
    });
}

// 显示搜索结果
function displayResults(results, keyword) {
    const houseList = document.getElementById('houseList');
    const emptyResult = document.getElementById('emptyResult');
    const resultCount = document.getElementById('countNumber');

    resultCount.textContent = results.length;

    if (results.length === 0) {
        houseList.style.display = 'none';
        emptyResult.style.display = 'block';
        return;
    }

    houseList.style.display = 'block';
    emptyResult.style.display = 'none';

    // 清空现有结果
    houseList.innerHTML = '';

    // 显示搜索结果
    results.forEach(function(house) {
        const houseItem = document.createElement('div');
        houseItem.className = 'house-item';
        houseItem.addEventListener('click', function() {
            // 跳转到房源详情页（实际应用中）
            alert('房源详情\n\n' + house.title + '\n位置：' + house.location + '\n价格：¥' + house.price + '/月');
        });

        houseItem.innerHTML = `
            <div class="house-header">
                <div class="house-left">
                    <div class="house-title">${highlightKeyword(house.title, keyword)}</div>
                    <div class="house-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${house.location}</span>
                    </div>
                </div>
                <div class="house-price">
                    ¥${house.price}
                    <span class="house-price-unit">/月</span>
                </div>
            </div>
            <div class="house-info">
                <div class="house-info-item">
                    <i class="fas fa-home"></i>
                    <span>${house.rooms}</span>
                </div>
                <div class="house-info-item">
                    <i class="fas fa-arrows-alt"></i>
                    <span>${house.area}㎡</span>
                </div>
                <div class="house-info-item">
                    <i class="fas fa-building"></i>
                    <span>${house.floor}</span>
                </div>
            </div>
        `;

        houseList.appendChild(houseItem);
    });
}

// 高亮关键词
function highlightKeyword(text, keyword) {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<span style="color: #4CAF50; font-weight: 600;">$1</span>');
}

// 保存搜索历史
function saveSearchHistory(keyword) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    
    // 移除重复项
    history = history.filter(function(item) {
        return item !== keyword;
    });
    
    // 添加到开头
    history.unshift(keyword);
    
    // 只保留最近10条
    if (history.length > 10) {
        history.pop();
    }
    
    localStorage.setItem('searchHistory', JSON.stringify(history));
    loadSearchHistory();
}

// 加载搜索历史
function loadSearchHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const historyList = document.getElementById('historyList');
    const historySection = document.getElementById('historySection');

    if (history.length === 0) {
        historySection.style.display = 'none';
        return;
    }

    historySection.style.display = 'block';
    historyList.innerHTML = '';

    history.forEach(function(keyword) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        historyItem.innerHTML = `
            <div class="history-item-left" data-keyword="${keyword}">
                <i class="fas fa-clock history-icon"></i>
                <span class="history-text">${keyword}</span>
            </div>
            <button class="history-delete" data-keyword="${keyword}">
                <i class="fas fa-times"></i>
            </button>
        `;

        // 点击历史项搜索
        historyItem.querySelector('.history-item-left').addEventListener('click', function() {
            document.getElementById('searchInput').value = keyword;
            performSearch();
        });

        // 删除历史项
        historyItem.querySelector('.history-delete').addEventListener('click', function(e) {
            e.stopPropagation();
            removeFromHistory(keyword);
        });

        historyList.appendChild(historyItem);
    });
}

// 从历史记录中删除
function removeFromHistory(keyword) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    history = history.filter(function(item) {
        return item !== keyword;
    });
    localStorage.setItem('searchHistory', JSON.stringify(history));
    loadSearchHistory();
}

