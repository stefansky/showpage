// 管理后台公共脚本

// ==================== 模拟数据 ====================
const mockData = {
    users: [
        { id: 1, avatar: '👤', nickname: '张三', role: 'tenant', roleName: '租客', phone: '13800138001', authStatus: 'verified', authName: '张三', authIdCard: '110101199001011234', registerTime: '2024-01-15 10:30:00', status: 'active' },
        { id: 2, avatar: '👤', nickname: '李四', role: 'landlord', roleName: '房东', phone: '13800138002', authStatus: 'pending', authName: '李四', authIdCard: '110101199002021234', registerTime: '2024-01-16 14:20:00', status: 'active' },
        { id: 3, avatar: '👤', nickname: '王五', role: 'tenant', roleName: '租客', phone: '13800138003', authStatus: 'unverified', authName: '', authIdCard: '', registerTime: '2024-01-17 09:15:00', status: 'active' },
        { id: 4, avatar: '👤', nickname: '赵六', role: 'landlord', roleName: '房东', phone: '13800138004', authStatus: 'verified', authName: '赵六', authIdCard: '110101199003031234', registerTime: '2024-01-18 16:45:00', status: 'active' },
        { id: 5, avatar: '👤', nickname: '钱七', role: 'tenant', roleName: '租客', phone: '13800138005', authStatus: 'verified', authName: '钱七', authIdCard: '110101199004041234', registerTime: '2024-01-19 11:20:00', status: 'active' },
    ],
    stores: [
        { id: 1, name: '阳光租房门店', manager: '张店长', phone: '13900139001', address: '北京市朝阳区建国路88号', houseCount: 25, status: 'open', openTime: '2024-01-10 09:00:00' },
        { id: 2, name: '温馨家园门店', manager: '李店长', phone: '13900139002', address: '北京市海淀区中关村大街1号', houseCount: 18, status: 'open', openTime: '2024-01-12 10:00:00' },
        { id: 3, name: '幸福租房门店', manager: '王店长', phone: '13900139003', address: '北京市西城区西单大街50号', houseCount: 32, status: 'closed', openTime: '2024-01-15 08:00:00' },
    ],
    houses: [
        { id: 1, publisherType: 2, publisherId: 4, publisherName: '赵六', title: '精装两室一厅 近地铁', rentMode: 1, roomCount: 2, roomType: null, rentType: 2, province: '北京市', city: '北京市', district: '朝阳区', address: '国贸CBD 华贸公寓', longitude: 116.4609, latitude: 39.9093, area: 85, floor: 18, rentPrice: 6500, images: ['https://picsum.photos/400/300?random=1', 'https://picsum.photos/400/300?random=2', 'https://picsum.photos/400/300?random=3'], description: '精装修两室一厅，南北通透', contactPhone: '13800138004', availableDate: '2024-02-01', status: 1, createdAt: '2024-01-20 10:00:00', updatedAt: '2024-01-20 10:00:00' },
        { id: 2, publisherType: 1, publisherId: 1, publisherName: '张三', title: '次卧转租 限女生', rentMode: 2, roomCount: null, roomType: 2, rentType: 1, province: '北京市', city: '北京市', district: '海淀区', address: '中关村 西山壹号', longitude: 116.2869, latitude: 40.0513, area: 15, floor: 12, rentPrice: 2200, images: [], description: '因工作调动转租次卧', contactPhone: '13800138001', availableDate: '2024-02-15', status: 0, createdAt: '2024-01-21 14:30:00', updatedAt: '2024-01-21 14:30:00' },
        { id: 3, publisherType: 3, publisherId: 1, publisherName: '阳光租房门店', title: '三室两厅 南北通透', rentMode: 1, roomCount: 3, roomType: null, rentType: 2, province: '北京市', city: '北京市', district: '朝阳区', address: '望京 望京花园', longitude: 116.4803, latitude: 40.0017, area: 120, floor: 25, rentPrice: 9800, images: ['https://picsum.photos/400/300?random=1', 'https://picsum.photos/400/300?random=2'], description: '望京核心地段', contactPhone: '13900139001', availableDate: '2024-02-01', status: 1, createdAt: '2024-01-22 09:15:00', updatedAt: '2024-01-22 09:15:00' },
        { id: 4, publisherType: 3, publisherId: 2, publisherName: '温馨家园门店', title: '品牌公寓 主卧带卫', rentMode: 2, roomCount: null, roomType: 1, rentType: 2, province: '上海市', city: '上海市', district: '浦东新区', address: '陆家嘴附近', longitude: 121.4994, latitude: 31.2396, area: 25, floor: 8, rentPrice: 4500, images: ['https://picsum.photos/400/300?random=1', 'https://picsum.photos/400/300?random=2', 'https://picsum.photos/400/300?random=3'], description: '品牌公寓，主卧带独卫', contactPhone: '13900139002', availableDate: '2024-01-25', status: 1, createdAt: '2024-01-18 16:20:00', updatedAt: '2024-01-23 11:00:00' },
        { id: 5, publisherType: 2, publisherId: 7, publisherName: '周九', title: '一室一厅 精装修', rentMode: 1, roomCount: 1, roomType: null, rentType: 2, province: '广东省', city: '深圳市', district: '南山区', address: '科技园', longitude: 113.9492, latitude: 22.5282, area: 55, floor: 15, rentPrice: 5800, images: [], description: '科技园核心位置', contactPhone: '13800138007', availableDate: '2024-02-10', status: 0, createdAt: '2024-01-23 10:00:00', updatedAt: '2024-01-23 10:00:00' },
        { id: 6, publisherType: 1, publisherId: 3, publisherName: '王小美', title: '主卧转租 近地铁', rentMode: 2, roomCount: null, roomType: 1, rentType: 1, province: '浙江省', city: '杭州市', district: '西湖区', address: '文三路', longitude: 120.1284, latitude: 30.2722, area: 18, floor: 6, rentPrice: 1800, images: ['https://picsum.photos/400/300?random=1'], description: '浙大附近主卧转租', contactPhone: '13800138003', availableDate: '2024-03-01', status: 3, createdAt: '2024-01-19 11:00:00', updatedAt: '2024-01-24 15:00:00' },
    ],
    findRequests: [
        { 
            id: 1, userId: 1, userNickname: '张三', contactPhone: '13800138001',
            rentMode: 1, roomCount: 2, roomType: null, 
            minPrice: 3000, maxPrice: 5000, moveInDate: '2024-02-01',
            locations: [
                { province: '北京市', city: '北京市', district: '朝阳区', address: '国贸附近', fullAddress: '北京市北京市朝阳区国贸附近', lng: '116.460815', lat: '39.908775' }
            ],
            publishTime: '2024-01-20 10:00:00', status: 1
        },
        { 
            id: 2, userId: 3, userNickname: '王五', contactPhone: '13800138003',
            rentMode: 2, roomCount: null, roomType: 1, 
            minPrice: 1500, maxPrice: 2500, moveInDate: '2024-02-15',
            locations: [
                { province: '北京市', city: '北京市', district: '海淀区', address: '中关村', fullAddress: '北京市北京市海淀区中关村', lng: '116.310316', lat: '39.992552' },
                { province: '北京市', city: '北京市', district: '西城区', address: '', fullAddress: '北京市北京市西城区', lng: '', lat: '' }
            ],
            publishTime: '2024-01-21 14:30:00', status: 1
        },
        { 
            id: 3, userId: 5, userNickname: '钱七', contactPhone: '13800138005',
            rentMode: 1, roomCount: 1, roomType: null, 
            minPrice: 2000, maxPrice: 3500, moveInDate: '2024-03-01',
            locations: [
                { province: '北京市', city: '北京市', district: '西城区', address: '西单大悦城附近', fullAddress: '北京市北京市西城区西单大悦城附近', lng: '116.370518', lat: '39.906367' }
            ],
            publishTime: '2024-01-22 09:15:00', status: 2
        },
        { 
            id: 4, userId: 4, userNickname: '赵六', contactPhone: '13800138004',
            rentMode: 2, roomCount: null, roomType: 2, 
            minPrice: 1000, maxPrice: 2000, moveInDate: '2024-01-25',
            locations: [
                { province: '北京市', city: '北京市', district: '东城区', address: '', fullAddress: '北京市北京市东城区', lng: '', lat: '' }
            ],
            publishTime: '2024-01-18 16:45:00', status: 0
        },
    ],
    // 举报记录：reporterType 1用户 2商家, targetType 1用户 2商家 3房源 4找房
    // reasonType 1虚假信息 2骚扰辱骂 3诈骗行为 4违规内容 5其他
    // status 0待处理 1已处理 2已驳回
    // handleResult 1警告 2扣除房豆 3禁用账号 4无效举报
    reportRecords: [
        { 
            id: 1, reporterType: 1, reporterId: 1, reporterName: '张三',
            targetType: 3, targetId: 5, targetName: '两室一厅 精装修',
            reasonType: 1, reasonDetail: '房源信息虚假，图片与实际情况严重不符，疑似使用网图',
            status: 0, handleResult: null, deductPoints: null, banDays: null,
            handleRemark: null, handleTime: null, createdAt: '2024-01-27 10:00:00'
        },
        { 
            id: 2, reporterType: 1, reporterId: 2, reporterName: '李四',
            targetType: 1, targetId: 3, targetName: '王五',
            reasonType: 2, reasonDetail: '该用户在聊天中使用侮辱性语言，态度恶劣',
            status: 0, handleResult: null, deductPoints: null, banDays: null,
            handleRemark: null, handleTime: null, createdAt: '2024-01-26 14:30:00'
        },
        { 
            id: 3, reporterType: 1, reporterId: 4, reporterName: '赵六',
            targetType: 3, targetId: 3, targetName: '三室两厅 南北通透',
            reasonType: 4, reasonDetail: '该房源已出租但未下架，浪费用户时间',
            status: 1, handleResult: 1, deductPoints: null, banDays: null,
            handleRemark: '已通知房东下架房源', handleTime: '2024-01-20 10:00:00', createdAt: '2024-01-19 09:00:00'
        },
        { 
            id: 4, reporterType: 2, reporterId: 1, reporterName: '阳光租房门店',
            targetType: 1, targetId: 5, targetName: '钱七',
            reasonType: 3, reasonDetail: '该用户多次预约看房后爽约，疑似恶意行为',
            status: 1, handleResult: 2, deductPoints: 10, banDays: null,
            handleRemark: '扣除房豆作为警告', handleTime: '2024-01-22 15:00:00', createdAt: '2024-01-21 11:20:00'
        },
        { 
            id: 5, reporterType: 1, reporterId: 3, reporterName: '王五',
            targetType: 2, targetId: 2, targetName: '温馨家园门店',
            reasonType: 3, reasonDetail: '该商家收取看房费用，疑似诈骗',
            status: 1, handleResult: 3, deductPoints: null, banDays: 7,
            handleRemark: '核实属实，封禁7天', handleTime: '2024-01-18 09:30:00', createdAt: '2024-01-16 16:45:00'
        },
        { 
            id: 6, reporterType: 1, reporterId: 1, reporterName: '张三',
            targetType: 4, targetId: 2, targetName: '找房需求#2',
            reasonType: 5, reasonDetail: '该找房需求联系方式无法接通',
            status: 2, handleResult: 4, deductPoints: null, banDays: null,
            handleRemark: '经核实为正常号码，驳回举报', handleTime: '2024-01-15 11:00:00', createdAt: '2024-01-14 10:30:00'
        },
    ],
    // 房豆记录：userType 1用户 2商家, type: 1注册赠送 2签到 3观看广告 4发布房源 5发布找房 6获取联系方式 7系统赠送 8系统扣除
    // relatedType: 1房源 2找房 3广告
    pointsRecords: [
        { id: 1, userType: 1, userId: 1, points: 10, balance: 10, type: 1, relatedType: null, relatedId: null, remark: '新用户注册赠送', createdAt: '2024-01-15 10:30:00' },
        { id: 2, userType: 1, userId: 1, points: 5, balance: 15, type: 2, relatedType: null, relatedId: null, remark: '每日签到奖励', createdAt: '2024-01-16 09:00:00' },
        { id: 3, userType: 1, userId: 1, points: -1, balance: 14, type: 6, relatedType: 1, relatedId: 1, remark: '查看房源联系方式', createdAt: '2024-01-20 11:00:00' },
        { id: 4, userType: 1, userId: 2, points: 10, balance: 10, type: 1, relatedType: null, relatedId: null, remark: '新用户注册赠送', createdAt: '2024-01-16 14:20:00' },
        { id: 5, userType: 1, userId: 2, points: 5, balance: 15, type: 4, relatedType: 1, relatedId: 1, remark: '发布房源奖励', createdAt: '2024-01-20 10:00:00' },
        { id: 6, userType: 1, userId: 3, points: 10, balance: 10, type: 1, relatedType: null, relatedId: null, remark: '新用户注册赠送', createdAt: '2024-01-17 09:15:00' },
        { id: 7, userType: 1, userId: 3, points: 3, balance: 13, type: 3, relatedType: 3, relatedId: 1, remark: '观看广告奖励', createdAt: '2024-01-18 15:30:00' },
        { id: 8, userType: 1, userId: 3, points: -1, balance: 12, type: 6, relatedType: 2, relatedId: 1, remark: '查看找房联系方式', createdAt: '2024-01-21 15:00:00' },
        { id: 9, userType: 2, userId: 1, points: 50, balance: 50, type: 7, relatedType: null, relatedId: null, remark: '商家入驻赠送', createdAt: '2024-01-10 09:00:00' },
        { id: 10, userType: 2, userId: 1, points: -5, balance: 45, type: 6, relatedType: 2, relatedId: 2, remark: '获取租客联系方式', createdAt: '2024-01-22 10:30:00' },
        { id: 11, userType: 1, userId: 4, points: 10, balance: 10, type: 1, relatedType: null, relatedId: null, remark: '新用户注册赠送', createdAt: '2024-01-18 16:45:00' },
        { id: 12, userType: 1, userId: 5, points: 10, balance: 10, type: 1, relatedType: null, relatedId: null, remark: '新用户注册赠送', createdAt: '2024-01-19 11:20:00' },
        { id: 13, userType: 1, userId: 5, points: 5, balance: 15, type: 5, relatedType: 2, relatedId: 3, remark: '发布找房需求奖励', createdAt: '2024-01-22 09:15:00' },
        { id: 14, userType: 2, userId: 2, points: 50, balance: 50, type: 7, relatedType: null, relatedId: null, remark: '商家入驻赠送', createdAt: '2024-01-12 10:00:00' },
    ],
    activities: [
        { id: 1, type: 'user', content: '用户 张三 注册成功', time: '2024-01-20 10:30:00' },
        { id: 2, type: 'house', content: '房源 精装两室一厅 已发布', time: '2024-01-20 11:00:00' },
        { id: 3, type: 'auth', content: '用户 李四 提交实名认证', time: '2024-01-20 14:00:00' },
        { id: 4, type: 'report', content: '收到房源举报', time: '2024-01-20 15:00:00' },
    ],
    // 联系记录：记录租客、房东、商家获取对方联系方式的记录
    // viewerType: 1用户 2商家, targetType: 1房源 2找房, ownerType: 1用户 2商家, obtainMethod: 1积分兑换 2观看广告
    contactRecords: [
        { id: 1, viewerType: 1, viewerId: 1, targetType: 1, targetId: 1, ownerType: 1, ownerId: 2, contactInfo: '13800138002', pointsCost: 1, obtainMethod: 1, createdAt: '2024-01-20 10:00:00' },
        { id: 2, viewerType: 2, viewerId: 1, targetType: 2, targetId: 1, ownerType: 1, ownerId: 1, contactInfo: '13800138001', pointsCost: 1, obtainMethod: 1, createdAt: '2024-01-21 14:30:00' },
        { id: 3, viewerType: 1, viewerId: 3, targetType: 1, targetId: 2, ownerType: 1, ownerId: 4, contactInfo: '13800138004', pointsCost: 0, obtainMethod: 2, createdAt: '2024-01-22 09:15:00' },
        { id: 4, viewerType: 2, viewerId: 2, targetType: 2, targetId: 2, ownerType: 1, ownerId: 3, contactInfo: '13800138003', pointsCost: 1, obtainMethod: 1, createdAt: '2024-01-23 11:20:00' },
        { id: 5, viewerType: 1, viewerId: 5, targetType: 1, targetId: 3, ownerType: 2, ownerId: 1, contactInfo: '13900139001', pointsCost: 0, obtainMethod: 2, createdAt: '2024-01-24 16:45:00' },
        { id: 6, viewerType: 1, viewerId: 2, targetType: 1, targetId: 4, ownerType: 2, ownerId: 2, contactInfo: '13900139002', pointsCost: 1, obtainMethod: 1, createdAt: '2024-01-25 08:30:00' },
    ],
    // 平台活动：type 1分享好友 2分享朋友圈 3查看广告 4每日签到 5邀请注册 6发布房源 7发布找房
    // frequency 1仅一次 2每天一次 3每周一次 4每月一次 5不限次数
    // rewardType 1房豆, status 0关闭 1开启
    platformActivities: [
        { 
            id: 1, name: '分享好友得房豆', type: 1, description: '将小程序分享给好友，好友进入后即可获得房豆奖励',
            rewardType: 1, rewardAmount: 3, frequency: 2, maxTimes: 0,
            startTime: '2024-01-01 00:00:00', endTime: '2024-12-31 23:59:59',
            sortOrder: 100, participants: 2580, status: 1, createdAt: '2024-01-01 00:00:00'
        },
        { 
            id: 2, name: '分享朋友圈得房豆', type: 2, description: '将小程序分享到朋友圈，完成后可获得房豆奖励',
            rewardType: 1, rewardAmount: 5, frequency: 4, maxTimes: 0,
            startTime: '2024-01-01 00:00:00', endTime: '2024-12-31 23:59:59',
            sortOrder: 90, participants: 1250, status: 1, createdAt: '2024-01-01 00:00:00'
        },
        { 
            id: 3, name: '看广告领房豆', type: 3, description: '观看一段广告视频，看完即可获得房豆奖励，每天可参与多次',
            rewardType: 1, rewardAmount: 1, frequency: 5, maxTimes: 5,
            startTime: '2024-01-01 00:00:00', endTime: '2024-12-31 23:59:59',
            sortOrder: 80, participants: 8650, status: 1, createdAt: '2024-01-01 00:00:00'
        },
        { 
            id: 4, name: '每日签到', type: 4, description: '每天登录小程序进行签到，即可获得房豆奖励',
            rewardType: 1, rewardAmount: 2, frequency: 2, maxTimes: 0,
            startTime: null, endTime: null,
            sortOrder: 95, participants: 12350, status: 1, createdAt: '2024-01-01 00:00:00'
        },
        { 
            id: 5, name: '邀请好友注册', type: 5, description: '邀请好友注册成为新用户，好友注册成功后双方均可获得房豆奖励',
            rewardType: 1, rewardAmount: 10, frequency: 5, maxTimes: 0,
            startTime: '2024-01-01 00:00:00', endTime: '2024-12-31 23:59:59',
            sortOrder: 85, participants: 568, status: 1, createdAt: '2024-01-01 00:00:00'
        },
        { 
            id: 6, name: '发布房源奖励', type: 6, description: '成功发布一条房源信息并通过审核，即可获得房豆奖励',
            rewardType: 1, rewardAmount: 5, frequency: 5, maxTimes: 0,
            startTime: null, endTime: null,
            sortOrder: 70, participants: 2340, status: 1, createdAt: '2024-01-01 00:00:00'
        },
        { 
            id: 7, name: '发布找房需求', type: 7, description: '发布您的找房需求，让房东主动联系您，还能获得房豆奖励',
            rewardType: 1, rewardAmount: 3, frequency: 4, maxTimes: 0,
            startTime: null, endTime: null,
            sortOrder: 65, participants: 1580, status: 1, createdAt: '2024-01-01 00:00:00'
        },
        { 
            id: 8, name: '新用户注册礼包', type: 5, description: '新用户首次注册即可获得丰厚房豆奖励，仅限一次',
            rewardType: 1, rewardAmount: 20, frequency: 1, maxTimes: 0,
            startTime: '2024-01-15 00:00:00', endTime: '2024-06-30 23:59:59',
            sortOrder: 200, participants: 856, status: 0, createdAt: '2024-01-15 00:00:00'
        },
    ],
    // 看房预约记录：sourceType 1用户申请 2商家邀约 3扫码预约
    // status 0待确认 1已确认 2已完成 3已拒绝 4已取消
    // ownerType 1个人房东 2商家
    visitRecords: [
        { 
            id: 1, sourceType: 1, 
            tenantId: 1, tenantName: '张三', tenantPhone: '13800138001',
            houseId: 1, houseTitle: '精装两室一厅 近地铁',
            ownerType: 1, ownerId: 2, ownerName: '李四', ownerPhone: '13800138002',
            visitTime: '2024-01-20 14:30:00', status: 2, rejectReason: null, remark: '希望下午看房',
            createdAt: '2024-01-18 10:00:00', updatedAt: '2024-01-20 15:00:00'
        },
        { 
            id: 2, sourceType: 2, 
            tenantId: 2, tenantName: '李四', tenantPhone: '13800138002',
            houseId: 2, houseTitle: '温馨一居室 拎包入住',
            ownerType: 2, ownerId: 1, ownerName: '阳光租房门店', ownerPhone: '13900139001',
            visitTime: '2024-01-21 10:15:00', status: 2, rejectReason: null, remark: '',
            createdAt: '2024-01-19 14:30:00', updatedAt: '2024-01-21 11:00:00'
        },
        { 
            id: 3, sourceType: 3, 
            tenantId: 3, tenantName: '王五', tenantPhone: '13800138003',
            houseId: null, houseTitle: null,
            ownerType: 2, ownerId: 2, ownerName: '温馨家园门店', ownerPhone: '13900139002',
            visitTime: '2024-01-25 16:45:00', status: 1, rejectReason: null, remark: '扫码进店预约',
            createdAt: '2024-01-22 09:15:00', updatedAt: '2024-01-23 10:00:00'
        },
        { 
            id: 4, sourceType: 1, 
            tenantId: 5, tenantName: '钱七', tenantPhone: '13800138005',
            houseId: 3, houseTitle: '三室两厅 南北通透',
            ownerType: 2, ownerId: 1, ownerName: '阳光租房门店', ownerPhone: '13900139001',
            visitTime: null, status: 0, rejectReason: null, remark: '周末有空',
            createdAt: '2024-01-26 08:30:00', updatedAt: '2024-01-26 08:30:00'
        },
        { 
            id: 5, sourceType: 1, 
            tenantId: 4, tenantName: '赵六', tenantPhone: '13800138004',
            houseId: 1, houseTitle: '精装两室一厅 近地铁',
            ownerType: 1, ownerId: 2, ownerName: '李四', ownerPhone: '13800138002',
            visitTime: null, status: 0, rejectReason: null, remark: '',
            createdAt: '2024-01-27 11:20:00', updatedAt: '2024-01-27 11:20:00'
        },
        { 
            id: 6, sourceType: 2, 
            tenantId: 1, tenantName: '张三', tenantPhone: '13800138001',
            houseId: 4, houseTitle: '单间出租 合租',
            ownerType: 2, ownerId: 2, ownerName: '温馨家园门店', ownerPhone: '13900139002',
            visitTime: '2024-01-22 09:00:00', status: 3, rejectReason: '该房源已出租', remark: '',
            createdAt: '2024-01-20 16:00:00', updatedAt: '2024-01-21 09:00:00'
        },
        { 
            id: 7, sourceType: 3, 
            tenantId: 3, tenantName: '王五', tenantPhone: '13800138003',
            houseId: null, houseTitle: null,
            ownerType: 2, ownerId: 1, ownerName: '阳光租房门店', ownerPhone: '13900139001',
            visitTime: '2024-01-19 14:00:00', status: 4, rejectReason: null, remark: '租客取消',
            createdAt: '2024-01-17 10:30:00', updatedAt: '2024-01-18 20:00:00'
        },
    ],
    // 开店申请：status 0待处理 1已联系 2已开通 3无效
    storeApplications: [
        { 
            id: 1, contactPerson: '张经理', contactPhone: '13900139001', 
            targetCommunity: '朝阳区国贸CBD附近小区', remark: '有多年房产经验，希望加盟开店',
            status: 2, handlerId: 1, handleTime: '2024-01-12 10:00:00', handleRemark: '已开通商家账号，账号：store_zhang',
            createdAt: '2024-01-10 09:00:00', updatedAt: '2024-01-12 10:00:00'
        },
        { 
            id: 2, contactPerson: '李女士', contactPhone: '13900139002', 
            targetCommunity: '海淀区中关村软件园周边', remark: '目前在做二手房中介，想转型做租房',
            status: 2, handlerId: 1, handleTime: '2024-01-15 14:30:00', handleRemark: '资质审核通过，已开通',
            createdAt: '2024-01-12 10:00:00', updatedAt: '2024-01-15 14:30:00'
        },
        { 
            id: 3, contactPerson: '王先生', contactPhone: '13900139003', 
            targetCommunity: '西城区西单大悦城附近', remark: '咨询开店流程和费用',
            status: 0, handlerId: null, handleTime: null, handleRemark: null,
            createdAt: '2024-01-25 11:00:00', updatedAt: '2024-01-25 11:00:00'
        },
        { 
            id: 4, contactPerson: '陈小姐', contactPhone: '13800138888', 
            targetCommunity: '丰台区方庄地区', remark: '',
            status: 1, handlerId: 1, handleTime: '2024-01-26 09:30:00', handleRemark: '已电话联系，对方表示需要考虑一下',
            createdAt: '2024-01-24 16:20:00', updatedAt: '2024-01-26 09:30:00'
        },
        { 
            id: 5, contactPerson: '刘总', contactPhone: '13666666666', 
            targetCommunity: '', remark: '想了解加盟政策',
            status: 0, handlerId: null, handleTime: null, handleRemark: null,
            createdAt: '2024-01-27 08:15:00', updatedAt: '2024-01-27 08:15:00'
        },
        { 
            id: 6, contactPerson: '测试用户', contactPhone: '11111111111', 
            targetCommunity: '测试小区', remark: '测试数据',
            status: 3, handlerId: 1, handleTime: '2024-01-20 11:00:00', handleRemark: '无效申请，测试数据',
            createdAt: '2024-01-19 10:00:00', updatedAt: '2024-01-20 11:00:00'
        },
    ],
    cities: [
        { id: 1, name: '北京', code: 'BJ', houseCount: 1250, userCount: 3560, storeCount: 15, status: 'active' },
        { id: 2, name: '上海', code: 'SH', houseCount: 980, userCount: 2890, storeCount: 12, status: 'active' },
        { id: 3, name: '广州', code: 'GZ', houseCount: 750, userCount: 2150, storeCount: 8, status: 'active' },
        { id: 4, name: '深圳', code: 'SZ', houseCount: 680, userCount: 1980, storeCount: 7, status: 'active' },
    ],
    settings: {
        contactPointsCost: 1,
        firstLoginReward: 10,
        publishHouseReward: 5,
        autoReviewHouses: true,
        autoAuthVerify: false,
    },
    // 字典类型
    dictTypes: [
        { id: 1, code: 'user_role', name: '用户角色', description: '系统用户角色类型', sortOrder: 10, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 2, code: 'auth_status', name: '认证状态', description: '用户实名认证状态', sortOrder: 20, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 3, code: 'house_status', name: '房源状态', description: '房源发布状态', sortOrder: 30, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 4, code: 'rent_mode', name: '租赁方式', description: '整租或合租', sortOrder: 40, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 5, code: 'room_type', name: '房间类型', description: '合租时的房间类型', sortOrder: 50, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 6, code: 'rent_type', name: '出租类型', description: '转租或直租', sortOrder: 60, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 7, code: 'publisher_type', name: '发布者类型', description: '房源发布者类型', sortOrder: 70, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 8, code: 'find_status', name: '找房状态', description: '找房需求状态', sortOrder: 80, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 9, code: 'points_type', name: '积分类型', description: '房豆变动类型', sortOrder: 90, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 10, code: 'report_reason', name: '举报原因', description: '举报原因类型', sortOrder: 100, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 11, code: 'report_status', name: '举报状态', description: '举报处理状态', sortOrder: 110, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 12, code: 'handle_result', name: '处理结果', description: '举报处理结果', sortOrder: 120, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 13, code: 'activity_type', name: '活动类型', description: '平台活动类型', sortOrder: 130, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 14, code: 'activity_frequency', name: '参与频率', description: '活动参与频率限制', sortOrder: 140, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 15, code: 'visit_source', name: '看房来源', description: '看房预约来源', sortOrder: 150, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 16, code: 'visit_status', name: '看房状态', description: '看房预约状态', sortOrder: 160, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 17, code: 'store_app_status', name: '开店申请状态', description: '商家开店申请状态', sortOrder: 170, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 18, code: 'viewer_type', name: '查看者类型', description: '联系方式查看者类型', sortOrder: 180, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 19, code: 'target_type', name: '目标类型', description: '联系方式目标类型', sortOrder: 190, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 20, code: 'obtain_method', name: '获取方式', description: '联系方式获取方式', sortOrder: 200, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 21, code: 'owner_type', name: '房东类型', description: '房源所有者类型', sortOrder: 210, isSystem: true, createdAt: '2024-01-01 00:00:00' },
        { id: 22, code: 'report_target_type', name: '被举报类型', description: '举报目标类型', sortOrder: 220, isSystem: true, createdAt: '2024-01-01 00:00:00' },
    ],
    // 字典项
    dictItems: [
        // 用户角色 user_role
        { id: 1, typeId: 1, value: 'tenant', label: '租客', style: 'primary', icon: 'fa-user', sortOrder: 1, status: true, isSystem: true },
        { id: 2, typeId: 1, value: 'landlord', label: '房东', style: 'success', icon: 'fa-home', sortOrder: 2, status: true, isSystem: true },
        
        // 认证状态 auth_status
        { id: 3, typeId: 2, value: 'unverified', label: '未认证', style: 'gray', icon: 'fa-times-circle', sortOrder: 1, status: true, isSystem: true },
        { id: 4, typeId: 2, value: 'pending', label: '待审核', style: 'warning', icon: 'fa-clock', sortOrder: 2, status: true, isSystem: true },
        { id: 5, typeId: 2, value: 'verified', label: '已认证', style: 'success', icon: 'fa-check-circle', sortOrder: 3, status: true, isSystem: true },
        
        // 房源状态 house_status
        { id: 6, typeId: 3, value: '0', label: '审核中', style: 'warning', icon: 'fa-clock', sortOrder: 1, status: true, isSystem: true },
        { id: 7, typeId: 3, value: '1', label: '已上架', style: 'success', icon: 'fa-check', sortOrder: 2, status: true, isSystem: true },
        { id: 8, typeId: 3, value: '2', label: '已下架', style: 'gray', icon: 'fa-arrow-down', sortOrder: 3, status: true, isSystem: true },
        { id: 9, typeId: 3, value: '3', label: '已出租', style: 'info', icon: 'fa-handshake', sortOrder: 4, status: true, isSystem: true },
        { id: 10, typeId: 3, value: '4', label: '已过期', style: 'danger', icon: 'fa-calendar-times', sortOrder: 5, status: true, isSystem: true },
        
        // 租赁方式 rent_mode
        { id: 11, typeId: 4, value: '1', label: '整租', style: 'primary', icon: 'fa-home', sortOrder: 1, status: true, isSystem: true },
        { id: 12, typeId: 4, value: '2', label: '合租', style: 'info', icon: 'fa-users', sortOrder: 2, status: true, isSystem: true },
        
        // 房间类型 room_type
        { id: 13, typeId: 5, value: '1', label: '主卧', style: 'primary', icon: 'fa-bed', sortOrder: 1, status: true, isSystem: true },
        { id: 14, typeId: 5, value: '2', label: '次卧', style: 'info', icon: 'fa-bed', sortOrder: 2, status: true, isSystem: true },
        { id: 15, typeId: 5, value: '3', label: '其他', style: 'gray', icon: 'fa-door-open', sortOrder: 3, status: true, isSystem: true },
        
        // 出租类型 rent_type
        { id: 16, typeId: 6, value: '1', label: '转租', style: 'warning', icon: 'fa-exchange-alt', sortOrder: 1, status: true, isSystem: true },
        { id: 17, typeId: 6, value: '2', label: '直租', style: 'success', icon: 'fa-handshake', sortOrder: 2, status: true, isSystem: true },
        
        // 发布者类型 publisher_type
        { id: 18, typeId: 7, value: '1', label: '租客', style: 'primary', icon: 'fa-user', sortOrder: 1, status: true, isSystem: true },
        { id: 19, typeId: 7, value: '2', label: '房东', style: 'success', icon: 'fa-user-tie', sortOrder: 2, status: true, isSystem: true },
        { id: 20, typeId: 7, value: '3', label: '商家', style: 'info', icon: 'fa-store', sortOrder: 3, status: true, isSystem: true },
        
        // 找房状态 find_status
        { id: 21, typeId: 8, value: '0', label: '待审核', style: 'warning', icon: 'fa-clock', sortOrder: 1, status: true, isSystem: true },
        { id: 22, typeId: 8, value: '1', label: '已发布', style: 'success', icon: 'fa-check', sortOrder: 2, status: true, isSystem: true },
        { id: 23, typeId: 8, value: '2', label: '已下架', style: 'gray', icon: 'fa-arrow-down', sortOrder: 3, status: true, isSystem: true },
        { id: 24, typeId: 8, value: '3', label: '已找到', style: 'info', icon: 'fa-smile', sortOrder: 4, status: true, isSystem: true },
        
        // 积分类型 points_type
        { id: 25, typeId: 9, value: '1', label: '注册赠送', style: 'success', icon: 'fa-gift', sortOrder: 1, status: true, isSystem: true },
        { id: 26, typeId: 9, value: '2', label: '签到', style: 'primary', icon: 'fa-calendar-check', sortOrder: 2, status: true, isSystem: true },
        { id: 27, typeId: 9, value: '3', label: '观看广告', style: 'info', icon: 'fa-ad', sortOrder: 3, status: true, isSystem: true },
        { id: 28, typeId: 9, value: '4', label: '发布房源', style: 'success', icon: 'fa-home', sortOrder: 4, status: true, isSystem: true },
        { id: 29, typeId: 9, value: '5', label: '发布找房', style: 'success', icon: 'fa-search', sortOrder: 5, status: true, isSystem: true },
        { id: 30, typeId: 9, value: '6', label: '获取联系方式', style: 'warning', icon: 'fa-phone', sortOrder: 6, status: true, isSystem: true },
        { id: 31, typeId: 9, value: '7', label: '系统赠送', style: 'primary', icon: 'fa-gift', sortOrder: 7, status: true, isSystem: true },
        { id: 32, typeId: 9, value: '8', label: '系统扣除', style: 'danger', icon: 'fa-minus-circle', sortOrder: 8, status: true, isSystem: true },
        
        // 举报原因 report_reason
        { id: 33, typeId: 10, value: '1', label: '虚假信息', style: 'danger', icon: 'fa-times-circle', sortOrder: 1, status: true, isSystem: true },
        { id: 34, typeId: 10, value: '2', label: '骚扰辱骂', style: 'danger', icon: 'fa-angry', sortOrder: 2, status: true, isSystem: true },
        { id: 35, typeId: 10, value: '3', label: '诈骗行为', style: 'danger', icon: 'fa-user-secret', sortOrder: 3, status: true, isSystem: true },
        { id: 36, typeId: 10, value: '4', label: '违规内容', style: 'warning', icon: 'fa-ban', sortOrder: 4, status: true, isSystem: true },
        { id: 37, typeId: 10, value: '5', label: '其他', style: 'gray', icon: 'fa-ellipsis-h', sortOrder: 5, status: true, isSystem: true },
        
        // 举报状态 report_status
        { id: 38, typeId: 11, value: '0', label: '待处理', style: 'warning', icon: 'fa-clock', sortOrder: 1, status: true, isSystem: true },
        { id: 39, typeId: 11, value: '1', label: '已处理', style: 'success', icon: 'fa-check', sortOrder: 2, status: true, isSystem: true },
        { id: 40, typeId: 11, value: '2', label: '已驳回', style: 'gray', icon: 'fa-times', sortOrder: 3, status: true, isSystem: true },
        
        // 处理结果 handle_result
        { id: 41, typeId: 12, value: '1', label: '警告', style: 'warning', icon: 'fa-exclamation-triangle', sortOrder: 1, status: true, isSystem: true },
        { id: 42, typeId: 12, value: '2', label: '扣除房豆', style: 'warning', icon: 'fa-coins', sortOrder: 2, status: true, isSystem: true },
        { id: 43, typeId: 12, value: '3', label: '禁用账号', style: 'danger', icon: 'fa-ban', sortOrder: 3, status: true, isSystem: true },
        { id: 44, typeId: 12, value: '4', label: '无效举报', style: 'gray', icon: 'fa-times-circle', sortOrder: 4, status: true, isSystem: true },
        
        // 活动类型 activity_type
        { id: 45, typeId: 13, value: '1', label: '分享好友', style: 'primary', icon: 'fa-share', sortOrder: 1, status: true, isSystem: true },
        { id: 46, typeId: 13, value: '2', label: '分享朋友圈', style: 'success', icon: 'fa-share-alt', sortOrder: 2, status: true, isSystem: true },
        { id: 47, typeId: 13, value: '3', label: '查看广告', style: 'info', icon: 'fa-ad', sortOrder: 3, status: true, isSystem: true },
        { id: 48, typeId: 13, value: '4', label: '每日签到', style: 'primary', icon: 'fa-calendar-check', sortOrder: 4, status: true, isSystem: true },
        { id: 49, typeId: 13, value: '5', label: '邀请注册', style: 'success', icon: 'fa-user-plus', sortOrder: 5, status: true, isSystem: true },
        { id: 50, typeId: 13, value: '6', label: '发布房源', style: 'info', icon: 'fa-home', sortOrder: 6, status: true, isSystem: true },
        { id: 51, typeId: 13, value: '7', label: '发布找房', style: 'info', icon: 'fa-search', sortOrder: 7, status: true, isSystem: true },
        
        // 参与频率 activity_frequency
        { id: 52, typeId: 14, value: '1', label: '仅一次', style: 'gray', icon: 'fa-dice-one', sortOrder: 1, status: true, isSystem: true },
        { id: 53, typeId: 14, value: '2', label: '每天一次', style: 'primary', icon: 'fa-calendar-day', sortOrder: 2, status: true, isSystem: true },
        { id: 54, typeId: 14, value: '3', label: '每周一次', style: 'info', icon: 'fa-calendar-week', sortOrder: 3, status: true, isSystem: true },
        { id: 55, typeId: 14, value: '4', label: '每月一次', style: 'warning', icon: 'fa-calendar-alt', sortOrder: 4, status: true, isSystem: true },
        { id: 56, typeId: 14, value: '5', label: '不限次数', style: 'success', icon: 'fa-infinity', sortOrder: 5, status: true, isSystem: true },
        
        // 看房来源 visit_source
        { id: 57, typeId: 15, value: '1', label: '用户申请', style: 'primary', icon: 'fa-hand-paper', sortOrder: 1, status: true, isSystem: true },
        { id: 58, typeId: 15, value: '2', label: '商家邀约', style: 'success', icon: 'fa-handshake', sortOrder: 2, status: true, isSystem: true },
        { id: 59, typeId: 15, value: '3', label: '扫码预约', style: 'info', icon: 'fa-qrcode', sortOrder: 3, status: true, isSystem: true },
        
        // 看房状态 visit_status
        { id: 60, typeId: 16, value: '0', label: '待确认', style: 'warning', icon: 'fa-clock', sortOrder: 1, status: true, isSystem: true },
        { id: 61, typeId: 16, value: '1', label: '已确认', style: 'primary', icon: 'fa-check', sortOrder: 2, status: true, isSystem: true },
        { id: 62, typeId: 16, value: '2', label: '已完成', style: 'success', icon: 'fa-check-double', sortOrder: 3, status: true, isSystem: true },
        { id: 63, typeId: 16, value: '3', label: '已拒绝', style: 'danger', icon: 'fa-times', sortOrder: 4, status: true, isSystem: true },
        { id: 64, typeId: 16, value: '4', label: '已取消', style: 'gray', icon: 'fa-ban', sortOrder: 5, status: true, isSystem: true },
        
        // 开店申请状态 store_app_status
        { id: 65, typeId: 17, value: '0', label: '待处理', style: 'warning', icon: 'fa-clock', sortOrder: 1, status: true, isSystem: true },
        { id: 66, typeId: 17, value: '1', label: '已联系', style: 'primary', icon: 'fa-phone', sortOrder: 2, status: true, isSystem: true },
        { id: 67, typeId: 17, value: '2', label: '已开通', style: 'success', icon: 'fa-check-circle', sortOrder: 3, status: true, isSystem: true },
        { id: 68, typeId: 17, value: '3', label: '无效', style: 'gray', icon: 'fa-times-circle', sortOrder: 4, status: true, isSystem: true },
        
        // 查看者类型 viewer_type
        { id: 69, typeId: 18, value: '1', label: '用户', style: 'primary', icon: 'fa-user', sortOrder: 1, status: true, isSystem: true },
        { id: 70, typeId: 18, value: '2', label: '商家', style: 'success', icon: 'fa-store', sortOrder: 2, status: true, isSystem: true },
        
        // 目标类型 target_type
        { id: 71, typeId: 19, value: '1', label: '房源', style: 'primary', icon: 'fa-home', sortOrder: 1, status: true, isSystem: true },
        { id: 72, typeId: 19, value: '2', label: '找房', style: 'info', icon: 'fa-search', sortOrder: 2, status: true, isSystem: true },
        
        // 获取方式 obtain_method
        { id: 73, typeId: 20, value: '1', label: '积分兑换', style: 'warning', icon: 'fa-coins', sortOrder: 1, status: true, isSystem: true },
        { id: 74, typeId: 20, value: '2', label: '观看广告', style: 'info', icon: 'fa-ad', sortOrder: 2, status: true, isSystem: true },
        
        // 房东类型 owner_type
        { id: 75, typeId: 21, value: '1', label: '个人房东', style: 'primary', icon: 'fa-user', sortOrder: 1, status: true, isSystem: true },
        { id: 76, typeId: 21, value: '2', label: '商家', style: 'success', icon: 'fa-store', sortOrder: 2, status: true, isSystem: true },
        
        // 被举报类型 report_target_type
        { id: 77, typeId: 22, value: '1', label: '用户', style: 'primary', icon: 'fa-user', sortOrder: 1, status: true, isSystem: true },
        { id: 78, typeId: 22, value: '2', label: '商家', style: 'success', icon: 'fa-store', sortOrder: 2, status: true, isSystem: true },
        { id: 79, typeId: 22, value: '3', label: '房源', style: 'info', icon: 'fa-home', sortOrder: 3, status: true, isSystem: true },
        { id: 80, typeId: 22, value: '4', label: '找房需求', style: 'warning', icon: 'fa-search', sortOrder: 4, status: true, isSystem: true },
    ]
};

// ==================== 数据操作函数 ====================

// 初始化localStorage数据
function initMockData() {
    if (!localStorage.getItem('adminMockData')) {
        localStorage.setItem('adminMockData', JSON.stringify(mockData));
    }
}

// 获取数据
function getData(key) {
    const data = JSON.parse(localStorage.getItem('adminMockData') || '{}');
    return data[key] || [];
}

// 保存数据
function saveData(key, value) {
    const data = JSON.parse(localStorage.getItem('adminMockData') || '{}');
    data[key] = value;
    localStorage.setItem('adminMockData', JSON.stringify(data));
}

// 添加数据
function addData(key, item) {
    const data = getData(key);
    const maxId = data.length > 0 ? Math.max(...data.map(d => d.id)) : 0;
    item.id = maxId + 1;
    data.push(item);
    saveData(key, data);
    return item;
}

// 更新数据
function updateData(key, id, updates) {
    const data = getData(key);
    const index = data.findIndex(d => d.id === id);
    if (index !== -1) {
        data[index] = { ...data[index], ...updates };
        saveData(key, data);
        return data[index];
    }
    return null;
}

// 删除数据
function deleteData(key, id) {
    const data = getData(key);
    const filtered = data.filter(d => d.id !== id);
    saveData(key, filtered);
    return true;
}

// ==================== 侧边栏菜单 ====================

// 生成侧边栏菜单
function generateSidebarMenu() {
    const sidebarNav = document.getElementById('sidebarNav');
    if (!sidebarNav) return;
    
    // 获取当前页面路径
    const pathParts = window.location.pathname.split('/');
    const currentDir = pathParts[pathParts.length - 2] || 'dashboard';
    
    const menuItems = [
        { href: '../dashboard/index.html', icon: 'fa-chart-line', text: '数据概览', dir: 'dashboard' },
        { href: '../users/index.html', icon: 'fa-users', text: '用户管理', dir: 'users' },
        { href: '../stores/index.html', icon: 'fa-store', text: '门店管理', dir: 'stores' },
        { href: '../houses/index.html', icon: 'fa-home', text: '房源管理', dir: 'houses' },
        { href: '../find-requests/index.html', icon: 'fa-search', text: '找房需求', dir: 'find-requests' },
        { href: '../communications/index.html', icon: 'fa-comments', text: '联系记录', dir: 'communications' },
        { href: '../activities/index.html', icon: 'fa-gift', text: '活动管理', dir: 'activities' },
        { href: '../visits/index.html', icon: 'fa-eye', text: '看房管理', dir: 'visits' },
        { href: '../store-applications/index.html', icon: 'fa-file-alt', text: '开店申请', dir: 'store-applications' },
        { href: '../reports/index.html', icon: 'fa-flag', text: '举报处理', dir: 'reports' },
        { href: '../points/index.html', icon: 'fa-coins', text: '房豆管理', dir: 'points' },
        { href: '../cities/index.html', icon: 'fa-map-marker-alt', text: '城市管理', dir: 'cities' },
        { href: '../dictionaries/index.html', icon: 'fa-book', text: '字典管理', dir: 'dictionaries' },
        { href: '../settings/index.html', icon: 'fa-cog', text: '系统设置', dir: 'settings' }
    ];
    
    sidebarNav.innerHTML = menuItems.map(item => {
        const isActive = item.dir === currentDir ? 'active' : '';
        return `
            <a href="${item.href}" class="nav-item ${isActive}" data-page="${item.dir}">
                <i class="fas ${item.icon}"></i>
                <span>${item.text}</span>
            </a>
        `;
    }).join('');
}

// ==================== 通用初始化 ====================

function initCommon() {
    // 生成侧边栏菜单
    generateSidebarMenu();
    
    // 侧边栏切换
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }

    // 退出登录
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('确定要退出登录吗？')) {
                window.location.href = '../../index.html';
            }
        });
    }
}

// ==================== 分页功能 ====================

function createPagination(total, currentPage, pageSize, callback) {
    const totalPages = Math.ceil(total / pageSize);
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // 上一页
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.textContent = '上一页';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) callback(currentPage - 1);
    });
    pagination.appendChild(prevBtn);

    // 页码
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'pagination-btn';
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => callback(i));
            pagination.appendChild(pageBtn);
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.padding = '8px';
            pagination.appendChild(ellipsis);
        }
    }

    // 下一页
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.textContent = '下一页';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) callback(currentPage + 1);
    });
    pagination.appendChild(nextBtn);
}

// ==================== 工具函数 ====================

function getAuthStatusText(status) {
    const map = {
        verified: '已认证',
        pending: '待审核',
        unverified: '未认证'
    };
    return map[status] || '未知';
}

function getHouseStatusText(status) {
    const map = {
        pending: '待审核',
        active: '已发布',
        rented: '已出租',
        rejected: '已拒绝'
    };
    return map[status] || '未知';
}

function getActivityColor(type) {
    const colors = {
        user: '#e8f5e9',
        house: '#e3f2fd',
        auth: '#fff3e0',
        report: '#ffebee'
    };
    return colors[type] || '#f5f5f5';
}

function getActivityIcon(type) {
    const icons = {
        user: 'fa-user',
        house: 'fa-home',
        auth: 'fa-id-card',
        report: 'fa-flag'
    };
    return icons[type] || 'fa-circle';
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

function updateStatValues() {
    document.querySelectorAll('[data-value]').forEach(el => {
        const target = parseInt(el.getAttribute('data-value') || 0);
        const current = parseInt(el.textContent) || 0;
        if (current !== target) {
            animateValue(el, current, target, 500);
        } else {
            el.textContent = target;
        }
    });
}

function formatDateTime() {
    return new Date().toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    }).replace(/\//g, '-');
}

// 页面初始化入口
document.addEventListener('DOMContentLoaded', () => {
    initMockData();
    initCommon();
    
    // 调用页面特定的初始化函数
    if (typeof initPage === 'function') {
        initPage();
    }
});

