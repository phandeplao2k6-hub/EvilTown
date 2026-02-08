/**
 * SCRIPT.JS - EVIL TOWN: FORBIDDEN REALM
 * Cập nhật: Fix Save/Load Unicode & Xóa tính năng Thuế thụ động.
 */

const game = {
    // --- KHỞI TẠO DỮ LIỆU ---
    gold: 1000,
    levels: { townHall: 1, inn: 0, forge: 1, market: 0 },
    warehouse: {}, 
    stock: [],     
    hunters: [],
    activeQuests: [],
    lastUpdate: Date.now(),

    init() {
        this.loadLocalData();
        this.generateDailyQuests();
        this.renderAll();
        
        // Vòng lặp chính logic
        setInterval(() => this.mainLoop(), 1000);
        
        // Vòng lặp nhanh cập nhật UI (Thanh máu, tiền)
        setInterval(() => this.fastUpdateUI(), 100);

        // Hiệu ứng Loading
        setTimeout(() => {
            const ls = document.getElementById('loading-screen');
            if(ls) {
                ls.style.opacity = '0';
                setTimeout(() => ls.style.display = 'none', 800);
            }
        }, 1500);

        this.addLog("Chào mừng Ngài Thị Trưởng trở lại!", "success");
    },

    // --- HỆ THỐNG SAO LƯU (FIXED UNICODE) ---
    exportSave() {
        try {
            const saveData = {
                gold: this.gold,
                levels: this.levels,
                warehouse: this.warehouse,
                hunters: this.hunters,
                stock: this.stock,
                quests: this.activeQuests
            };
            const jsonStr = JSON.stringify(saveData);
            const checksum = this.genChecksum(jsonStr);
            const finalPkg = JSON.stringify({ d: jsonStr, c: checksum });
            
            // Mã hóa an toàn cho Tiếng Việt (UTF-8 Base64)
            const safeStr = btoa(unescape(encodeURIComponent(finalPkg)));
            
            const area = document.getElementById('save-code-area');
            area.value = safeStr;
            area.select();
            
            navigator.clipboard.writeText(safeStr).then(() => {
                this.addLog("ĐÃ SAO CHÉP MÃ LƯU VÀO BỘ NHỚ ĐỆM!", "success");
            });
        } catch (e) {
            this.addLog("LỖI KHI XUẤT MÃ LƯU!", "error");
        }
    },

    importSave() {
        const code = prompt("DÁN MÃ SAVE CỦA BẠN VÀO ĐÂY:");
        if (!code || code.trim() === "") return;
        try {
            // Giải mã an toàn Unicode
            const decodedPkg = decodeURIComponent(escape(atob(code.trim())));
            const pkg = JSON.parse(decodedPkg);

            if (this.genChecksum(pkg.d) !== pkg.c) {
                alert("MÃ SAVE KHÔNG HỢP LỆ HOẶC ĐÃ BỊ CHỈNH SỬA!");
                return;
            }

            const data = JSON.parse(pkg.d);
            
            // Ghi đè dữ liệu
            this.gold = data.gold;
            this.levels = data.levels;
            this.warehouse = data.warehouse;
            this.hunters = data.hunters;
            this.stock = data.stock || [];
            this.activeQuests = data.quests || [];

            this.saveLocalData();
            this.renderAll();
            alert("TẢI DỮ LIỆU THÀNH CÔNG!");
            this.addLog("Hệ thống đã khôi phục dữ liệu cũ.", "success");
        } catch (e) {
            alert("LỖI: MÃ SAVE SAI ĐỊNH DẠNG!");
        }
    },

    genChecksum(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return hash.toString();
    },

    saveLocalData() {
        localStorage.setItem('eviltown_save', JSON.stringify({
            gold: this.gold, levels: this.levels, warehouse: this.warehouse, 
            hunters: this.hunters, stock: this.stock, quests: this.activeQuests
        }));
    },

    loadLocalData() {
        const saved = localStorage.getItem('eviltown_save');
        if (saved) {
            try {
                const d = JSON.parse(saved);
                Object.assign(this, d);
            } catch(e) { console.error("Lỗi load LocalStorage"); }
        }
    },

    // --- LOGIC GAME CHÍNH ---
    mainLoop() {
        const now = Date.now();
        const dt = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;

        // 1. Hunter đi săn & hồi phục
        this.hunters.forEach(h => {
            if (h.hp > 20) {
                this.huntLogic(h, dt);
            } else if (this.levels.inn > 0) {
                this.recoverHP(h, dt);
            }
        });

        // 2. TÍNH NĂNG THUẾ ĐÃ ĐƯỢC XÓA TẠI ĐÂY (Tiền không tự tăng)

        // 3. Cập nhật nhiệm vụ
        this.checkQuests();
        
        // Tự động lưu mỗi 60s
        if (Math.floor(now/1000) % 60 === 0) this.saveLocalData();
    },

    huntLogic(hunter, dt) {
        const possibleMonsters = GAME_DATA.monsters.filter(m => m.minLv <= hunter.lv);
        const target = possibleMonsters[possibleMonsters.length - 1];

        // Sát thương quái gây ra (giảm theo thủ)
        const damage = Math.max(1, (target.minLv * 2.5) - (hunter.def / 4));
        hunter.hp -= damage * dt;

        // Tỉ lệ rơi đồ và nhận tiền khi giết quái
        if (Math.random() < target.dropRate * dt) {
            this.addItemToWarehouse(target.drop, 1);
            this.gold += target.gold; // Thu nhập chính từ quái
            hunter.exp += target.minLv * 3;
            this.updateQuestProgress('kill', 1);
            this.updateQuestProgress('gold', target.gold);

            // Level up logic
            if (hunter.exp >= hunter.lv * 100) {
                hunter.lv++;
                hunter.exp = 0;
                hunter.maxHp += 20;
                hunter.atk += 2;
                hunter.def += 1;
                hunter.hp = hunter.maxHp;
                this.addLog(`${hunter.name} đã lên cấp ${hunter.lv}!`, "success");
            }
        }
    },

    recoverHP(hunter, dt) {
        const healRate = 5 + (this.levels.inn * 5);
        if (hunter.hp < hunter.maxHp) {
            hunter.hp = Math.min(hunter.maxHp, hunter.hp + healRate * dt);
            // Thu phí 30G khi hồi đầy
            if (hunter.hp >= hunter.maxHp && this.gold >= 30) {
                this.gold -= 30;
                this.addLog(`${hunter.name} đã hồi phục xong (-30G)`, "");
            }
        }
    },

    addItemToWarehouse(name, qty) {
        const limit = this.levels.townHall * 50;
        const current = Object.values(this.warehouse).reduce((a, b) => a + b, 0);
        if (current + qty <= limit) {
            this.warehouse[name] = (this.warehouse[name] || 0) + qty;
            this.updateQuestProgress('material', qty);
        }
    },

    // --- CÁC HÀNH ĐỘNG ---
    upgradeBuilding(id) {
        const b = GAME_DATA.buildings[id];
        const cost = Math.floor(b.baseCost * Math.pow(b.scale, this.levels[id]));
        if (this.gold >= cost) {
            this.gold -= cost;
            this.levels[id]++;
            this.addLog(`Nâng cấp ${b.name} thành công!`, "success");
            this.updateQuestProgress('upgrade', 1);
            this.renderAll();
        } else {
            this.addLog("Bạn không đủ vàng để nâng cấp!", "error");
        }
    },

    hireHunter() {
        const cost = 150;
        const maxPop = this.levels.townHall * 5;
        if (this.hunters.length >= maxPop) {
            this.addLog("Giới hạn dân số đã đầy!", "error");
            return;
        }
        if (this.gold >= cost) {
            this.gold -= cost;
            const rarityObj = this.rollRarity();
            const classObj = GAME_DATA.classes[Math.floor(Math.random() * GAME_DATA.classes.length)];
            const name = GAME_DATA.hunterConfig.names[Math.floor(Math.random() * GAME_DATA.hunterConfig.names.length)];
            
            this.hunters.push({
                id: Date.now() + Math.random(),
                name: name,
                classIcon: classObj.faIcon,
                className: classObj.name,
                rarity: rarityObj.name,
                color: rarityObj.color,
                lv: 1, exp: 0,
                hp: 100 * rarityObj.multi,
                maxHp: 100 * rarityObj.multi,
                atk: 10 * rarityObj.multi,
                def: 5 * rarityObj.multi
            });
            this.renderHunters();
            this.addLog(`Thuê được ${name} (${rarityObj.name})!`, "success");
        }
    },

    rollRarity() {
        const rand = Math.random();
        let cum = 0;
        for (const r of GAME_DATA.hunterConfig.rarity) {
            cum += r.chance;
            if (rand < cum) return r;
        }
        return GAME_DATA.hunterConfig.rarity[0];
    },

    craftItem(recipeId) {
        const r = GAME_DATA.recipes.find(i => i.id === recipeId);
        if (this.warehouse[r.req] >= r.qty) {
            this.warehouse[r.req] -= r.qty;
            this.stock.push({ ...r, uid: Date.now() });
            this.addLog(`Rèn thành công ${r.name}!`, "success");
            this.updateQuestProgress('craft', 1);
            this.renderForge();
        } else {
            this.addLog("Thiếu nguyên liệu!", "error");
        }
    },

    sellStock(uid) {
        const idx = this.stock.findIndex(i => i.uid === uid);
        if (idx > -1) {
            this.gold += this.stock[idx].price;
            this.stock.splice(idx, 1);
            this.renderForge();
        }
    },

    // --- NHIỆM VỤ ---
    generateDailyQuests() {
        if (this.activeQuests.length > 0) return;
        const pool = [...GAME_DATA.questPool];
        for (let i = 0; i < 3; i++) {
            const r = Math.floor(Math.random() * pool.length);
            this.activeQuests.push({ ...pool.splice(r, 1)[0], progress: 0, done: false });
        }
    },

    updateQuestProgress(type, amt) {
        this.activeQuests.forEach(q => {
            if (q.type === type && !q.done) {
                q.progress = Math.min(q.goal, q.progress + amt);
            }
        });
    },

    checkQuests() {
        this.activeQuests.forEach(q => {
            if (q.progress >= q.goal && !q.done) {
                q.done = true;
                this.gold += q.reward;
                this.addLog(`Xong NV: ${q.desc} (+${q.reward}G)`, "success");
                this.renderQuests();
            }
        });
    },

    // --- UI RENDERING ---
    renderAll() {
        this.renderTown();
        this.renderHunters();
        this.renderForge();
        this.renderMarket();
        this.renderQuests();
    },

    renderTown() {
        const container = document.getElementById('building-list');
        if(!container) return;
        container.innerHTML = Object.keys(GAME_DATA.buildings).map(id => {
            const b = GAME_DATA.buildings[id];
            const lv = this.levels[id];
            const cost = Math.floor(b.baseCost * Math.pow(b.scale, lv));
            return `
                <div class="rpg-box">
                    <div style="color:var(--gold)"><i class="fa-solid ${b.icon}"></i> ${b.name} (Lv.${lv})</div>
                    <p class="pixel-small" style="margin:8px 0; color:#888;">${b.description}</p>
                    <button class="btn-action" onclick="game.upgradeBuilding('${id}')" ${this.gold < cost ? 'disabled' : ''}>NÂNG CẤP (${cost}G)</button>
                </div>
            `;
        }).join('');
    },

    renderHunters() {
        const container = document.getElementById('hunter-list');
        if(!container) return;
        container.innerHTML = this.hunters.map(h => {
            const safeId = h.id.toString().replace('.', '');
            return `
                <div class="hunter-item">
                    <div class="hunter-avatar" style="border-color:${h.color}"><i class="fa-solid ${h.classIcon}"></i></div>
                    <div style="flex:1; margin-left:15px;">
                        <div style="font-size:10px; color:${h.color}">${h.name} <span style="font-size:7px; color:#666;">LV.${h.lv}</span></div>
                        <div class="hp-bar-container"><div id="hp-${safeId}" class="hp-fill" style="width:${(h.hp/h.maxHp*100)}%"></div></div>
                        <div class="pixel-small" style="color:#555; margin-top:4px;">${h.className} | ATK:${Math.floor(h.atk)} DEF:${Math.floor(h.def)}</div>
                    </div>
                    <i class="fa-solid fa-trash btn-fire" onclick="game.fireHunter(${h.id})"></i>
                </div>
            `;
        }).join('');
    },

    renderForge() {
        const rList = document.getElementById('recipe-list');
        if(rList) {
            rList.innerHTML = GAME_DATA.recipes.map(r => {
                if (this.levels.forge < r.minForge) return '';
                const can = (this.warehouse[r.req] || 0) >= r.qty;
                return `
                    <div class="rpg-box">
                        <div style="font-size:9px;">${r.name}</div>
                        <div class="pixel-small" style="color:var(--gold); margin:5px 0;">Cần: ${r.qty}x ${r.req}</div>
                        <button class="btn-action" onclick="game.craftItem('${r.id}')" ${!can ? 'disabled' : ''}>CHẾ TẠO</button>
                    </div>
                `;
            }).join('');
        }
        
        const sList = document.getElementById('stock-list');
        if(sList) {
            sList.innerHTML = this.stock.map(i => `
                <div class="rpg-box" style="display:inline-block; width:140px; margin-right:10px;">
                    <div style="font-size:8px;">${i.name}</div>
                    <button class="btn-action" onclick="game.sellStock(${i.uid})">BÁN (${i.price}G)</button>
                </div>
            `).join('') || '<div class="pixel-small" style="color:#444">Kho thành phẩm trống</div>';
        }
    },

    renderMarket() {
        const container = document.getElementById('market-content');
        if(!container) return;
        container.innerHTML = Object.keys(GAME_DATA.materialPrices).map(mat => {
            const p = GAME_DATA.materialPrices[mat];
            const owned = this.warehouse[mat] || 0;
            return `
                <div class="rpg-box">
                    <div style="font-size:9px; color:var(--success)">${mat}</div>
                    <div class="pixel-small">Sở hữu: ${owned}</div>
                    <div style="display:flex; gap:5px; margin-top:10px;">
                        <button class="btn-action" style="flex:1" onclick="game.marketBuy('${mat}')">MUA (${p.buy}G)</button>
                        <button class="btn-action" style="flex:1" onclick="game.marketSell('${mat}')" ${owned <= 0 ? 'disabled' : ''}>BÁN (${p.sell}G)</button>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderQuests() {
        const container = document.getElementById('daily-quests');
        if(!container) return;
        container.innerHTML = this.activeQuests.map(q => `
            <div class="rpg-box" style="margin-bottom:8px; border-color:${q.done ? 'var(--success)' : 'var(--border-rpg)'}">
                <div style="display:flex; justify-content:space-between; font-size:8px;">
                    <span>${q.desc}</span>
                    <span style="color:var(--gold)">${q.progress}/${q.goal}</span>
                </div>
            </div>
        `).join('');
    },

    // --- TIỆN ÍCH ---
    switchTab(tabId, event) {
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.getElementById('tab-' + tabId).classList.add('active');
        event.currentTarget.classList.add('active');
    },

    addLog(msg, type = "") {
        const log = document.getElementById('log');
        if(!log) return;
        const div = document.createElement('div');
        div.style.color = type === "success" ? "var(--success)" : type === "error" ? "var(--error)" : "var(--text-dim)";
        div.innerHTML = `> ${msg}`;
        log.prepend(div);
        if (log.childNodes.length > 20) log.lastChild.remove();
    },

    fastUpdateUI() {
        // Stats đầu trang
        const g = document.getElementById('gold'); if(g) g.innerText = Math.floor(this.gold);
        const p = document.getElementById('pop-count'); if(p) p.innerText = this.hunters.length;
        
        // Tab Home
        const hl = document.getElementById('home-city-lv'); if(hl) hl.innerText = `LV.${this.levels.townHall}`;
        const hc = document.getElementById('home-hunter-count'); if(hc) hc.innerText = this.hunters.length;

        // Kho chứa
        const curStore = Object.values(this.warehouse).reduce((a,b) => a+b, 0);
        const maxStore = this.levels.townHall * 50;
        const ss = document.getElementById('stat-storage'); if(ss) ss.innerText = `${curStore}/${maxStore}`;

        // Giới hạn Hunter tab Hunter
        const pl = document.getElementById('pop-limit');
        if (pl) pl.innerText = `${this.hunters.length}/${this.levels.townHall * 5}`;

        // Thanh máu Hunter
        this.hunters.forEach(h => {
            const safeId = h.id.toString().replace('.', '');
            const bar = document.getElementById(`hp-${safeId}`);
            if (bar) bar.style.width = (h.hp/h.maxHp*100) + "%";
        });
    },

    marketBuy(mat) {
        const price = GAME_DATA.materialPrices[mat].buy;
        if (this.gold >= price) {
            this.gold -= price;
            this.addItemToWarehouse(mat, 1);
            this.renderMarket();
        }
    },

    marketSell(mat) {
        if (this.warehouse[mat] > 0) {
            this.warehouse[mat]--;
            this.gold += GAME_DATA.materialPrices[mat].sell;
            this.renderMarket();
        }
    },

    fireHunter(id) {
        if (confirm("Sa thải Hunter này?")) {
            this.hunters = this.hunters.filter(h => h.id !== id);
            this.renderHunters();
        }
    }
};

window.onload = () => game.init();
