/**
 * DATA.JS - EVIL TOWN: FORBIDDEN REALM (SYNCHRONIZED)
 * Phiên bản: 2.1 (Fix Archer Icon & UI Sync)
 */

const GAME_DATA = {
    // --- 1. CÔNG TRÌNH (BUILDINGS) ---
    buildings: {
        townHall: { name: "Tòa Thị Chính", description: "Mỗi cấp: +5 giới hạn Hunter & +50 Kho chứa.", baseCost: 500, scale: 2.5, icon: "fa-city" },
        inn: { name: "Nhà Trọ", description: "Hồi HP cho Hunter (Thu phí 30G/lượt).", baseCost: 300, scale: 1.8, icon: "fa-bed" },
        forge: { name: "Lò Rèn", description: "Mở công thức mới & sửa chữa trang bị.", baseCost: 400, scale: 2.0, icon: "fa-hammer" },
        market: { name: "Chợ Đen", description: "Giao thương nguyên liệu (Giá biến động).", baseCost: 1000, scale: 2.2, icon: "fa-shop" }
    },

    // --- 2. LỚP NHÂN VẬT (CLASSES) ---
    classes: [
        { id: 'warrior', name: 'Chiến Binh', faIcon: 'fa-shield-halved' },
        { id: 'archer', name: 'Cung Thủ', faIcon: 'fa-bullseye' }, // Đã fix icon hiển thị được trên Free FontAwesome
        { id: 'mage', name: 'Pháp Sư', faIcon: 'fa-wand-sparkles' },
        { id: 'assassin', name: 'Sát Thủ', faIcon: 'fa-user-ninja' },
        { id: 'cleric', name: 'Giáo Sĩ', faIcon: 'fa-hand-holding-heart' }, // Icon phù hợp hơn
        { id: 'paladin', name: 'Hiệp Sĩ', faIcon: 'fa-cross' },
        { id: 'necromancer', name: 'Chiêu Hồn', faIcon: 'fa-skull' }
    ],

    // --- 3. QUÁI VẬT & DROP LIST (15 CẤP ĐỘ) ---
    monsters: [
        { id: 'm1', name: "Slime Xanh", gold: 15, drop: "Nhớt Slime", dropRate: 0.8, minLv: 1 },
        { id: 'm2', name: "Dơi Quỷ", gold: 25, drop: "Cánh Dơi", dropRate: 0.7, minLv: 3 },
        { id: 'm3', name: "Bộ Xương", gold: 45, drop: "Mảnh Xương", dropRate: 0.6, minLv: 5 },
        { id: 'm4', name: "Sói Hoang", gold: 70, drop: "Da Thú", dropRate: 0.55, minLv: 8 },
        { id: 'm5', name: "Gnome Đào Mỏ", gold: 110, drop: "Quặng Đồng", dropRate: 0.5, minLv: 12 },
        { id: 'm6', name: "Chiến Binh Orc", gold: 160, drop: "Sắt Vụn", dropRate: 0.45, minLv: 16 },
        { id: 'm7', name: "Bóng Ma", gold: 220, drop: "Vải Liệm", dropRate: 0.4, minLv: 20 },
        { id: 'm8', name: "Golem Đá", gold: 300, drop: "Lõi Đá", dropRate: 0.35, minLv: 25 },
        { id: 'm9', name: "Quỷ Lửa", gold: 450, drop: "Tinh Thể Lửa", dropRate: 0.3, minLv: 30 },
        { id: 'm10', name: "Vua Băng Giá", gold: 600, drop: "Mảnh Băng Vĩnh Cửu", dropRate: 0.25, minLv: 35 },
        { id: 'm11', name: "Rồng Đất", gold: 900, drop: "Vảy Rồng", dropRate: 0.2, minLv: 45 },
        { id: 'm12', name: "Lich King", gold: 1500, drop: "Hộp Sọ Hắc Ám", dropRate: 0.15, minLv: 55 },
        { id: 'm13', name: "Thiên Sứ Sa Ngã", gold: 2500, drop: "Lông Vũ Đen", dropRate: 0.1, minLv: 70 },
        { id: 'm14', name: "Chúa Tể Hư Không", gold: 5000, drop: "Mảnh Hư Không", dropRate: 0.05, minLv: 85 },
        { id: 'm15', name: "Thần Hủy Diệt", gold: 10000, drop: "Trái Tim Thần", dropRate: 0.02, minLv: 100 }
    ],

    // --- 4. GIÁ THỊ TRƯỜNG ---
    materialPrices: {
        "Nhớt Slime": { buy: 20, sell: 5 },
        "Cánh Dơi": { buy: 35, sell: 10 },
        "Mảnh Xương": { buy: 60, sell: 20 },
        "Da Thú": { buy: 100, sell: 35 },
        "Quặng Đồng": { buy: 150, sell: 50 },
        "Sắt Vụn": { buy: 220, sell: 80 },
        "Vải Liệm": { buy: 300, sell: 100 },
        "Lõi Đá": { buy: 450, sell: 150 },
        "Tinh Thể Lửa": { buy: 700, sell: 250 },
        "Mảnh Băng Vĩnh Cửu": { buy: 1000, sell: 400 },
        "Vảy Rồng": { buy: 1500, sell: 600 },
        "Hộp Sọ Hắc Ám": { buy: 3000, sell: 1200 },
        "Lông Vũ Đen": { buy: 5000, sell: 2000 },
        "Mảnh Hư Không": { buy: 10000, sell: 4000 },
        "Trái Tim Thần": { buy: 50000, sell: 20000 }
    },

    // --- 5. CÔNG THỨC RÈN (30+ Items) ---
    recipes: [
        { id: 'w1', name: "Kiếm Gỗ", type: "weapon", subType: "Sword", req: "Nhớt Slime", qty: 5, power: 10, price: 100, minForge: 1, minLv: 1 },
        { id: 'a1', name: "Áo Vải Thô", type: "armor", subType: "Robe", req: "Nhớt Slime", qty: 8, power: 5, price: 80, minForge: 1, minLv: 1, stats: { hp: 20, def: 2 } },
        { id: 'w2', name: "Dao Găm Cùn", type: "weapon", subType: "Dagger", req: "Cánh Dơi", qty: 5, power: 15, price: 150, minForge: 1, minLv: 3 },
        { id: 'a2', name: "Áo Choàng Dơi", type: "armor", subType: "LightArmor", req: "Cánh Dơi", qty: 10, power: 12, price: 200, minForge: 1, minLv: 3, stats: { hp: 50, def: 5 } },
        { id: 'w3', name: "Gậy Xương", type: "weapon", subType: "Staff", req: "Mảnh Xương", qty: 8, power: 25, price: 300, minForge: 1, minLv: 5 },
        { id: 'a3', name: "Giáp Da Sói", type: "armor", subType: "LightArmor", req: "Da Thú", qty: 10, power: 40, price: 800, minForge: 2, minLv: 8, stats: { hp: 150, def: 15 } },
        { id: 'w4', name: "Rìu Đồng", type: "weapon", subType: "Axe", req: "Quặng Đồng", qty: 12, power: 60, price: 1200, minForge: 2, minLv: 12 },
        { id: 'a4', name: "Giáp Sắt Vụn", type: "armor", subType: "HeavyArmor", req: "Sắt Vụn", qty: 15, power: 80, price: 1800, minForge: 2, minLv: 16, stats: { hp: 300, def: 40 } },
        { id: 'w5', name: "Kiếm Oan Hồn", type: "weapon", subType: "Sword", req: "Vải Liệm", qty: 10, power: 100, price: 2500, minForge: 2, minLv: 20 },
        { id: 'a5', name: "Giáp Đá Cứng", type: "armor", subType: "HeavyArmor", req: "Lõi Đá", qty: 20, power: 150, price: 4000, minForge: 3, minLv: 25, stats: { hp: 600, def: 80 } },
        { id: 'w6', name: "Trượng Lửa", type: "weapon", subType: "Staff", req: "Tinh Thể Lửa", qty: 15, power: 250, price: 6000, minForge: 3, minLv: 30 },
        { id: 'a6', name: "Áo Choàng Băng", type: "armor", subType: "Robe", req: "Mảnh Băng Vĩnh Cửu", qty: 12, power: 300, price: 8000, minForge: 3, minLv: 35, stats: { hp: 800, def: 120 } },
        { id: 'w7', name: "Diệt Long Đao", type: "weapon", subType: "Sword", req: "Vảy Rồng", qty: 10, power: 600, price: 20000, minForge: 4, minLv: 45 },
        { id: 'a7', name: "Giáp Hắc Ám", type: "armor", subType: "HeavyArmor", req: "Hộp Sọ Hắc Ám", qty: 8, power: 800, price: 35000, minForge: 4, minLv: 55, stats: { hp: 2000, def: 300 } },
        { id: 'w8', name: "Cung Thiên Sứ", type: "weapon", subType: "Bow", req: "Lông Vũ Đen", qty: 15, power: 1200, price: 50000, minForge: 4, minLv: 70 },
        { id: 'w9', name: "Lưỡi Hái Hư Không", type: "weapon", subType: "Scythe", req: "Mảnh Hư Không", qty: 20, power: 2500, price: 100000, minForge: 5, minLv: 85 },
        { id: 'a8', name: "Giáp Thần Hủy Diệt", type: "armor", subType: "GodArmor", req: "Trái Tim Thần", qty: 5, power: 5000, price: 500000, minForge: 5, minLv: 100, stats: { hp: 10000, def: 2000 } }
    ],

    // --- 6. BỂ NHIỆM VỤ ---
    questPool: [
        { id: 'q_g1', type: 'gold', goal: 1000, reward: 200, desc: "Thu thuế đạt 1.000 Vàng" },
        { id: 'q_g2', type: 'gold', goal: 5000, reward: 800, desc: "Tích trữ 5.000 Vàng ngân khố" },
        { id: 'q_m1', type: 'material', goal: 10, reward: 300, desc: "Thu thập 10 nguyên liệu" },
        { id: 'q_c1', type: 'craft', goal: 1, reward: 150, desc: "Rèn thành công 1 trang bị" },
        { id: 'q_k1', type: 'kill', goal: 20, reward: 500, desc: "Thợ săn tiêu diệt 20 quái" },
        { id: 'q_u1', type: 'upgrade', goal: 1, reward: 500, desc: "Nâng cấp 1 công trình" }
    ],

    // --- 7. CẤU HÌNH HUNTER ---
    hunterConfig: {
        names: ["Arthur", "Benedict", "Cyrus", "Darius", "Ezreal", "Fiora", "Geralt", "Hades", "Ignis", "Jinx", "Kael", "Lucian", "Malphite", "Nocturne", "Orion", "Pyke", "Quinn", "Riven", "Sylas", "Talon", "Urgot", "Vayne", "Warwick", "Xerath", "Yasuo", "Zed"],
        rarity: [
            { name: "Thường", chance: 0.60, color: "#a0a0a0", multi: 1.0 },
            { name: "Hiếm", chance: 0.25, color: "#4ade80", multi: 1.5 },
            { name: "Sử Thi", chance: 0.10, color: "#a855f7", multi: 2.5 },
            { name: "Huyền Thoại", chance: 0.04, color: "#ffcf40", multi: 5.0 },
            { name: "Tối Thượng", chance: 0.01, color: "#ff0040", multi: 10.0 }
        ]
    }
};
