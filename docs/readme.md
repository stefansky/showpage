# 极速找房 - 租房小程序原型

## 角色
你是一个高级UI设计师和前端开发人员，打算使用html+css+js+图标使用https://fontawesome.com.cn/v5，帮我实现交互原型。可以参考模仿UI设计图的效果。

## 产品需求
打造一个极简、高效、真实、基于地图匹配的租房小程序，让租客快速找到匹配房源，让房东快速找到真实租客，降低中介噪音， 使用积分（房豆）机制控制联系方式获取，使用地图作为核心交互界面，趋近共享单车/电动车小程序结构

---

## 项目页面关系图

### 一、页面列表（共20个页面）

#### 1. 核心页面
- **home** - 首页（地图主页）
- **login** - 登录页面
- **identity-select** - 身份选择页面（租客/房东）

#### 2. 个人中心相关
- **personal-center** - 个人中心
- **user-profile** - 个人资料
- **settings** - 设置页面
- **real-name-auth** - 实名认证

#### 3. 房豆系统
- **wallet** - 我的房豆
- **activity** - 活动中心
- **contact-records** - 获取记录

#### 4. 房源相关
- **house-list** - 房源列表
- **house-detail** - 房源详情
- **post-house** - 发布房源
- **my-houses** - 我的房源（房东）

#### 5. 找房相关
- **post-find** - 发布找房
- **my-find** - 我的找房（租客）
- **tenant-list** - 租客列表（房东查看）

#### 6. 其他功能
- **search** - 搜索页面
- **rules** - 使用规则
- **about** - 关于我们

---

## 二、页面跳转关系

### 2.1 首页（home）跳转关系
```
home/index.html
├── 搜索按钮 → search/index.html
├── 附近房源/租客按钮 → house-list/index.html（租客）或 tenant-list/index.html（房东）
├── 使用说明按钮 → rules/index.html
├── 个人中心按钮 → personal-center/index.html
└── 预约找房/出租按钮 → 提示登录（未实现跳转）
```

### 2.2 登录页面（login）跳转关系
```
login/index.html
├── 返回按钮 → home/index.html（无历史记录时）
├── 微信登录成功 → home/index.html（已注释，实际需实现）
└── 首次登录后 → identity-select/index.html（需手动实现）
```

### 2.3 身份选择页面（identity-select）跳转关系
```
identity-select/index.html
├── 返回按钮 → login/index.html
└── 确认选择 → home/index.html
```

### 2.4 个人中心（personal-center）跳转关系
```
personal-center/index.html
├── 返回按钮 → home/index.html
├── 用户信息区域（未登录） → login/index.html
├── 用户信息区域（已登录） → user-profile/index.html
├── 我的房源 → my-houses/index.html（需登录+房东身份）
├── 我的找房 → my-find/index.html（需登录）
├── 我的房豆 → wallet/index.html（需登录）
├── 获取记录 → contact-records/index.html（需登录）
├── 活动中心 → activity/index.html
├── 身份切换 → identity-select/index.html（需登录）
├── 设置 → settings/index.html
└── 关于我们 → about/index.html
```

### 2.5 个人资料（user-profile）跳转关系
```
user-profile/index.html
├── 返回按钮 → personal-center/index.html
└── 实名认证 → real-name-auth/index.html
```

### 2.6 设置页面（settings）跳转关系
```
settings/index.html
├── 返回按钮 → personal-center/index.html
├── 实名认证 → real-name-auth/index.html
├── 使用规则 → rules/index.html
└── 退出登录 → login/index.html
```

### 2.7 实名认证（real-name-auth）跳转关系
```
real-name-auth/index.html
└── 返回按钮 → home/index.html（或上一页）
```

### 2.8 我的房豆（wallet）跳转关系
```
wallet/index.html
├── 返回按钮 → personal-center/index.html
└── 更多按钮 → 显示完整账单明细（弹窗）
```

### 2.9 活动中心（activity）跳转关系
```
activity/index.html
└── 返回按钮 → personal-center/index.html
```

### 2.10 获取记录（contact-records）跳转关系
```
contact-records/index.html
├── 返回按钮 → personal-center/index.html
└── 房源记录点击 → house-detail/index.html?id={houseId}
```

### 2.11 搜索页面（search）跳转关系
```
search/index.html
├── 返回按钮 → home/index.html
└── 搜索结果点击 → house-detail/index.html?id={houseId}
```

### 2.12 房源列表（house-list）跳转关系
```
house-list/index.html
├── 返回按钮 → home/index.html
└── 房源卡片点击 → house-detail/index.html?id={houseId}
```

### 2.13 房源详情（house-detail）跳转关系
```
house-detail/index.html
├── 返回按钮 → house-list/index.html
├── 获取联系方式 → 消耗房豆，保存到contact-records
└── 房豆不足时 → activity/index.html
```

### 2.14 租客列表（tenant-list）跳转关系
```
tenant-list/index.html
├── 返回按钮 → home/index.html
├── 获取联系方式 → 消耗房豆，保存到contact-records
└── 房豆不足时 → activity/index.html
```

### 2.15 发布房源（post-house）跳转关系
```
post-house/index.html
├── 返回按钮 → home/index.html
└── 发布成功 → home/index.html
```

### 2.16 我的房源（my-houses）跳转关系
```
my-houses/index.html
├── 返回按钮 → personal-center/index.html
└── 编辑房源 → post-house/index.html?edit={houseId}
```

### 2.17 发布找房（post-find）跳转关系
```
post-find/index.html
└── 返回按钮 → home/index.html
```

### 2.18 我的找房（my-find）跳转关系
```
my-find/index.html
├── 返回按钮 → personal-center/index.html
└── 编辑找房 → post-find/index.html?edit={findId}
```

### 2.19 使用规则（rules）跳转关系
```
rules/index.html
└── 返回按钮 → home/index.html
```

### 2.20 关于我们（about）跳转关系
```
about/index.html
└── 返回按钮 → home/index.html
```

---

## 三、用户角色权限

### 3.1 租客（tenant）
- ✅ 查看房源列表
- ✅ 查看房源详情
- ✅ 发布找房需求
- ✅ 查看我的找房
- ✅ 查看附近房源
- ✅ 获取房源联系方式（消耗房豆）
- ❌ 发布房源
- ❌ 查看我的房源
- ❌ 查看附近租客

### 3.2 房东（landlord）
- ✅ 发布房源
- ✅ 查看我的房源
- ✅ 查看附近租客
- ✅ 获取租客联系方式（消耗房豆）
- ✅ 查看房源列表（可查看）
- ✅ 查看房源详情（可查看）
- ❌ 发布找房需求（可发布但无意义）

### 3.3 未登录用户
- ✅ 查看首页地图
- ✅ 查看房源列表
- ✅ 查看房源详情（不能获取联系方式）
- ✅ 查看使用规则
- ✅ 查看关于我们
- ❌ 发布房源/找房
- ❌ 获取联系方式
- ❌ 查看个人中心功能

---

## 四、核心功能流程

### 4.1 登录流程
```
未登录用户
  ↓
点击个人中心/需要登录的功能
  ↓
跳转到 login/index.html
  ↓
微信授权登录
  ↓
跳转到 identity-select/index.html（首次登录）
  ↓
选择身份（租客/房东）
  ↓
跳转到 home/index.html
```

### 4.2 租客找房流程
```
租客登录
  ↓
首页查看地图/搜索房源
  ↓
查看房源列表（house-list）
  ↓
点击房源查看详情（house-detail）
  ↓
消耗1房豆获取联系方式
  ↓
记录保存到获取记录（contact-records）
  ↓
可再次查看已获取的联系方式
```

### 4.3 房东出租流程
```
房东登录
  ↓
发布房源（post-house）
  ↓
房源显示在房源列表
  ↓
查看我的房源（my-houses）
  ↓
查看附近租客（tenant-list）
  ↓
消耗1房豆获取租客联系方式
  ↓
记录保存到获取记录（contact-records）
```

### 4.4 房豆获取流程
```
首次登录 → 获得10房豆
  ↓
活动中心（activity）
  ├── 分享朋友圈
  ├── 邀请好友
  ├── 每日签到
  └── 观看广告
  ↓
房豆增加
  ↓
可用于获取联系方式
```

---

## 五、数据存储（localStorage）

### 5.1 用户相关
- `userRole` - 用户角色（tenant/landlord）
- `userRoleName` - 用户角色名称（租客/房东）
- `userName` - 用户名
- `userAvatar` - 用户头像
- `userPhone` - 用户手机号
- `isFirstLogin` - 是否首次登录（用于发放初始房豆）

### 5.2 房豆相关
- `userPoints` - 用户房豆余额
- `consumeRecords` - 消费记录
- `contactRecords` - 获取联系方式记录

### 5.3 房源相关
- `myHouses` - 我的房源列表（房东）
- `myFindRequests` - 我的找房列表（租客）
- `houseDrafts` - 房源草稿

### 5.4 其他
- `searchHistory` - 搜索历史
- `realNameAuth` - 实名认证信息

---

## 六、页面功能说明

### 6.1 首页（home）
- 地图展示
- 搜索功能
- 附近房源/租客按钮（根据角色显示）
- 定位功能
- 使用说明
- 个人中心入口

### 6.2 搜索页面（search）
- 输入小区名称搜索
- 显示搜索结果列表
- 点击结果查看房源详情

### 6.3 房源列表（house-list）
- 显示房源卡片列表
- 筛选功能（出租时间、价格）
- 点击卡片查看详情

### 6.4 房源详情（house-detail）
- 房源图片轮播
- 房源详细信息
- 获取联系方式（消耗房豆）
- 举报功能

### 6.5 租客列表（tenant-list）
- 显示租客卡片列表
- 租客基本信息
- 地图背景显示意向位置
- 获取联系方式（消耗房豆）

### 6.6 发布房源（post-house）
- 分步骤填写表单
- 保存草稿功能
- 上传图片
- 选择位置

### 6.7 发布找房（post-find）
- 选择户型
- 选择入住时间
- 选择位置（最多3个坐标点）

### 6.8 我的房源（my-houses）
- 显示已发布的房源
- 显示房源状态
- 编辑/删除功能

### 6.9 我的找房（my-find）
- 显示已发布的找房需求
- 显示需求状态
- 编辑/删除功能

### 6.10 获取记录（contact-records）
- 显示所有获取的联系方式记录
- 区分房源和租客
- 点击查看详情

### 6.11 我的房豆（wallet）
- 显示房豆余额
- 显示消费记录
- 查看完整账单

### 6.12 活动中心（activity）
- 分享朋友圈
- 邀请好友
- 每日签到
- 观看广告

---

## 七、技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式设计
- **JavaScript (ES6+)** - 交互逻辑
- **FontAwesome 5** - 图标库
- **localStorage** - 本地数据存储
- **高德地图API** - 地图功能（可选）

---

## 八、目录结构

```
origin/
├── docs/
│   └── readme.md          # 项目文档
├── images/                # 图片资源
├── home/                  # 首页
├── login/                 # 登录页
├── identity-select/       # 身份选择
├── personal-center/       # 个人中心
├── user-profile/          # 个人资料
├── settings/              # 设置
├── real-name-auth/        # 实名认证
├── wallet/                # 我的房豆
├── activity/              # 活动中心
├── contact-records/       # 获取记录
├── search/                # 搜索
├── house-list/            # 房源列表
├── house-detail/          # 房源详情
├── tenant-list/           # 租客列表
├── post-house/            # 发布房源
├── post-find/             # 发布找房
├── my-houses/             # 我的房源
├── my-find/               # 我的找房
├── rules/                 # 使用规则
└── about/                 # 关于我们
```

---

## 九、注意事项

1. **页面独立性**：每个页面都在独立目录中，避免代码干扰
2. **登录检查**：需要登录的功能都会检查登录状态
3. **角色权限**：根据用户角色显示不同的功能和按钮
4. **数据持久化**：使用localStorage保存数据，刷新页面不丢失
5. **房豆机制**：获取联系方式需要消耗房豆，防止滥用
6. **重复记录**：相同房源/租客的联系方式只记录一次

---

## 十、待完善功能

- [ ] 微信小程序API集成
- [ ] 真实地图API集成
- [ ] 后端API对接
- [ ] 图片上传功能
- [ ] 消息通知功能
- [ ] 客服聊天功能
- [ ] 数据统计功能

# 原型DEMO交互

## 用户操作逻辑图

### 一、应用启动流程

```
用户打开应用
  ↓
进入首页（home/index.html）
  ↓
检查登录状态
  ├── 未登录 → 显示未登录状态UI
  └── 已登录 → 显示已登录状态UI（根据角色显示不同内容）
```

### 二、首页（未登录状态）操作流程

```
首页（未登录）
  ├── 附近房源/租客按钮
  │   └── 点击 → 跳转到登录页（login/index.html）
  │
  ├── 立即找房/出租按钮（底部）
  │   └── 点击 → 跳转到登录页（login/index.html）
  │
  ├── 个人中心按钮
  │   └── 点击 → 跳转到个人中心（personal-center/index.html）
  │
  ├── 使用说明按钮
  │   └── 点击 → 跳转到使用规则（rules/index.html）
  │
  └── 搜索按钮
      └── 点击 → 跳转到搜索页（search/index.html）
```

### 三、登录流程

```
登录页（login/index.html）
  ├── 微信授权登录按钮
  │   └── 点击 → 模拟登录成功
  │       └── 检查是否首次登录
  │           ├── 首次登录 → 跳转到身份选择页（identity-select/index.html）
  │           └── 非首次登录 → 跳转到首页（home/index.html）
  │
  └── 返回按钮
      └── 点击 → 返回首页或上一页
```

### 四、身份选择流程

```
身份选择页（identity-select/index.html）
  ├── 选择租客
  │   └── 确认 → 保存身份信息 → 跳转到首页
  │       └── 首页显示：
  │           ├── 附近房源按钮
  │           └── 立即找房按钮
  │
  ├── 选择房东
  │   └── 确认 → 保存身份信息 → 跳转到首页
  │       └── 首页显示：
  │           ├── 附近租客按钮
  │           └── 立即出租按钮
  │
  └── 返回按钮
      └── 点击 → 返回登录页
```

### 五、首页（已登录状态）操作流程

#### 5.1 租客角色
```
首页（租客已登录）
  ├── 附近房源按钮
  │   └── 点击 → 跳转到房源列表（house-list/index.html）
  │
  ├── 立即找房按钮
  │   └── 点击 → 跳转到发布找房（post-find/index.html）
  │
  ├── 个人中心按钮
  │   └── 点击 → 跳转到个人中心（personal-center/index.html）
  │
  ├── 使用说明按钮
  │   └── 点击 → 跳转到使用规则（rules/index.html）
  │
  └── 搜索按钮
      └── 点击 → 跳转到搜索页（search/index.html）
```

#### 5.2 房东角色
```
首页（房东已登录）
  ├── 附近租客按钮
  │   └── 点击 → 跳转到租客列表（tenant-list/index.html）
  │
  ├── 立即出租按钮
  │   └── 点击 → 跳转到发布房源（post-house/index.html）
  │
  ├── 个人中心按钮
  │   └── 点击 → 跳转到个人中心（personal-center/index.html）
  │
  ├── 使用说明按钮
  │   └── 点击 → 跳转到使用规则（rules/index.html）
  │
  └── 搜索按钮
      └── 点击 → 跳转到搜索页（search/index.html）
```

### 六、退出登录流程

```
设置页（settings/index.html）
  ├── 退出登录按钮
  │   └── 点击 → 确认对话框
  │       └── 确认 → 清除所有本地缓存
  │           ├── 清除用户信息（userRole, userName等）
  │           ├── 清除房豆数据（userPoints, consumeRecords等）
  │           ├── 清除房源数据（myHouses, myFindRequests等）
  │           ├── 清除获取记录（contactRecords）
  │           └── 清除其他临时数据
  │               └── 跳转到登录页（login/index.html）
  │
  └── 返回按钮
      └── 点击 → 返回个人中心
```

### 七、完整用户操作流程图

```
┌─────────────────┐
│  打开应用       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  首页（未登录）  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│点击登录│ │个人中心│
│相关按钮│ │使用说明│
└───┬────┘ └───┬────┘
    │          │
    ▼          │
┌─────────────┐│
│  登录页     ││
└──────┬──────┘│
       │       │
       ▼       │
┌─────────────┐│
│ 身份选择页  ││
└──────┬──────┘│
       │       │
       ▼       │
┌─────────────┐│
│首页（已登录）│◄┘
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
   ▼       ▼
┌──────┐ ┌──────┐
│租客  │ │房东  │
└──┬───┘ └──┬───┘
   │        │
   ▼        ▼
┌──────┐ ┌──────┐
│附近  │ │附近  │
│房源  │ │租客  │
└──────┘ └──────┘
   │        │
   ▼        ▼
┌──────┐ ┌──────┐
│立即  │ │立即  │
│找房  │ │出租  │
└──────┘ └──────┘
```

### 八、数据存储说明

#### 8.1 登录状态标识
- `userRole`: 用户角色（'tenant'/'landlord'）
- `userRoleName`: 用户角色名称（'租客'/'房东'）
- `userName`: 用户名
- `isFirstLogin`: 是否首次登录（用于判断是否需要选择身份）

#### 8.2 退出登录时清除的数据
- 用户信息：`userRole`, `userRoleName`, `userName`, `userAvatar`, `userPhone`
- 房豆数据：`userPoints`, `consumeRecords`, `isFirstLogin`
- 房源数据：`myHouses`, `myFindRequests`, `houseDrafts`
- 获取记录：`contactRecords`
- 搜索历史：`searchHistory`
- 实名认证：`realNameAuth`
- 其他临时数据

#### 8.3 保留的数据（可选）
- 应用设置：`appSettings`（可根据需求决定是否清除）

### 九、关键交互逻辑

#### 9.1 首页按钮动态显示
- **未登录状态**：
  - 附近房源/租客按钮：显示"附近房源/租客"，点击跳转登录
  - 底部按钮：显示"立即找房/出租"，点击跳转登录

- **租客已登录**：
  - 附近房源按钮：显示"附近房源"，点击跳转房源列表
  - 底部按钮：显示"立即找房"，点击跳转发布找房

- **房东已登录**：
  - 附近租客按钮：显示"附近租客"，点击跳转租客列表
  - 底部按钮：显示"立即出租"，点击跳转发布房源

#### 9.2 登录后跳转逻辑
- 首次登录：登录成功 → 身份选择页
- 非首次登录：登录成功 → 首页

#### 9.3 退出登录逻辑
- 清除所有本地缓存数据
- 跳转到登录页
- 首页恢复未登录状态UI