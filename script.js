// 全局状态
let pet = {
    avatar: '🐱',
    name: '皮皮',
    coins: 300,
    hunger: 60,
    thirst: 60,
    sleep: 80,
    fun: 80,
    anger: 0,
    love: 20,
    scene: 'living'
};

// 1. 大幅扩充的数据库 (20+ 基础食材与饮品)
const FOOD_DB = {
    // 饮品 (绝不加饱腹感)
    '💧': { name: '纯净水', price: 5, type: 'drink', thirst: 35 },
    '🥛': { name: '鲜牛奶', price: 10, type: 'drink', thirst: 45 },
    '☕': { name: '黑咖啡', price: 15, type: 'drink', thirst: 30 },
    '🧋': { name: '珍珠奶茶', price: 20, type: 'drink', thirst: 50 },
    '🍹': { name: '果汁', price: 12, type: 'drink', thirst: 40 },

    // 食材 (绝不加水)
    '🍞': { name: '吐司', price: 8, type: 'food', hunger: 15 },
    '🥩': { name: '牛肉块', price: 20, type: 'food', hunger: 25 },
    '🍗': { name: '鸡腿', price: 15, type: 'food', hunger: 20 },
    '🐟': { name: '三文鱼', price: 22, type: 'food', hunger: 25 },
    '🥬': { name: '生菜', price: 5, type: 'food', hunger: 8 },
    '🍅': { name: '番茄', price: 6, type: 'food', hunger: 10 },
    '🧀': { name: '芝士片', price: 10, type: 'food', hunger: 12 },
    '🍚': { name: '米饭', price: 6, type: 'food', hunger: 15 },
    '🍙': { name: '海苔', price: 4, type: 'food', hunger: 5 },
    '🥔': { name: '土豆', price: 5, type: 'food', hunger: 10 },
    '🥚': { name: '鸡蛋', price: 5, type: 'food', hunger: 10 },
    '🍄': { name: '香菇', price: 6, type: 'food', hunger: 8 },
    '🍎': { name: '苹果', price: 8, type: 'food', hunger: 12 },
    '🍓': { name: '草莓', price: 10, type: 'food', hunger: 10 },
    '🥑': { name: '牛油果', price: 12, type: 'food', hunger: 15 }
};

// 2. 菜谱大全数据库 (多达 10+ 种合成组合)
const RECIPES = [
    { ingredients: ['🍞', '🥩', '🥬'], result: '🥪', name: '三明治', hunger: 55, love: 10 },
    { ingredients: ['🍞', '🥩', '🧀', '🍅'], result: '🍔', name: '巨无霸汉堡', hunger: 80, love: 20 },
    { ingredients: ['🍚', '🍙', '🐟'], result: '🍣', name: '三文鱼寿司', hunger: 60, love: 15 },
    { ingredients: ['🥬', '🍅', '🥑'], result: '🥗', name: '大航海沙拉', hunger: 35, love: 8 },
    { ingredients: ['🥔', '🧀'], result: '🍟', name: '芝士薯条', hunger: 40, love: 10 },
    { ingredients: ['🍞', '🧀', '🍅'], result: '🍕', name: '玛格丽特披萨', hunger: 75, love: 18 },
    { ingredients: ['🍚', '🥚'], result: '🍳', name: '黄金炒饭', hunger: 45, love: 10 },
    { ingredients: ['🥛', '🍓'], result: '🍨', name: '草莓冰淇淋', hunger: 25, love: 15 },
    { ingredients: ['🍄', '🥩'], result: '🍖', name: '黑椒蘑菇牛排', hunger: 70, love: 20 },
    { ingredients: ['🍗', '🥔'], result: '🍱', name: '炸鸡便当', hunger: 65, love: 15 }
];

let backpack = { '💧': 5, '🍞': 3, '🥩': 2, '🥬': 2, '🍅': 2, '🧀': 2 };
let pot = [];

// 选择角色
function selectChar(avatar, name, el) {
    pet.avatar = avatar; pet.name = name;
    document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
}

function confirmCharacter() {
    const input = document.getElementById('pet-name-input').value.trim();
    if (input) pet.name = input;
    document.getElementById('char-icon').innerText = pet.avatar;
    document.getElementById('pet-display').innerText = pet.avatar;
    document.getElementById('display-name').innerText = pet.name;

    document.getElementById('select-screen').classList.add('hidden');
    document.getElementById('main-screen').classList.remove('hidden');

    startLoop();
    showTab('bag');
}

function changeBgColor(color) {
    document.getElementById('game-container').style.backgroundColor = color;
}

// 场景切换
function changeScene(scene) {
    pet.scene = scene;
    const title = document.getElementById('scene-title');
    const bubble = document.getElementById('status-bubble');
    const display = document.getElementById('pet-display');

    if (scene === 'living') {
        title.innerText = '🛋️ 主客厅'; bubble.innerText = '发呆中...'; display.innerText = pet.avatar;
    } else if (scene === 'dining') {
        title.innerText = '🍽️ 饭厅'; bubble.innerText = '请喂我好吃的！'; display.innerText = pet.avatar;
    } else if (scene === 'bedroom') {
        title.innerText = '🛏️ 卧室';
        if (pet.sleep >= 90) {
            bubble.innerText = '我不困，不想睡觉！❌'; display.innerText = pet.avatar;
        } else {
            pet.sleep = 100; bubble.innerText = 'zZZ 睡得香极了！能量补满！'; display.innerText = '😴'; updateStats();
        }
    } else if (scene === 'garden') {
        title.innerText = '🌳 户外花园';
        pet.fun = Math.min(100, pet.fun + 40); pet.anger = Math.max(0, pet.anger - 20);
        bubble.innerText = '跑来跑去真开心！🎈'; display.innerText = pet.avatar; updateStats();
    }
}

// 循环更新属性
function startLoop() {
    setInterval(() => {
        pet.hunger = Math.max(0, pet.hunger - 2);
        pet.thirst = Math.max(0, pet.thirst - 3);
        pet.sleep = Math.max(0, pet.sleep - 1);
        pet.fun = Math.max(0, pet.fun - 2);

        if (pet.fun < 25) pet.anger = Math.min(100, pet.anger + 3);
        else pet.anger = Math.max(0, pet.anger - 1);

        updateStats();
    }, 2500);
}

function updateStats() {
    document.getElementById('coins').innerText = pet.coins;
    document.getElementById('hunger-bar').style.width = pet.hunger + '%';
    document.getElementById('thirst-bar').style.width = pet.thirst + '%';
    document.getElementById('sleep-bar').style.width = pet.sleep + '%';
    document.getElementById('fun-bar').style.width = pet.fun + '%';
    document.getElementById('anger-bar').style.width = pet.anger + '%';
    document.getElementById('love-bar').style.width = pet.love + '%';
}

// 底部面板
function showTab(tab) {
    const content = document.getElementById('panel-content');
    content.innerHTML = '';

    if (tab === 'bag') {
        let html = '<div class="grid-4">';
        for (let item in backpack) {
            if (backpack[item] > 0) {
                html += `
                    <div class="item-card" onclick="useItem('${item}')">
                        <span class="badge">x${backpack[item]}</span>
                        <div class="icon">${item}</div>
                        <div>${getItemName(item)}</div>
                    </div>
                `;
            }
        }
        html += '</div>';
        content.innerHTML = html;
    }
    else if (tab === 'kitchen') {
        let html = `
            <div class="cooking-pot">
                <div style="font-size:0.75rem;font-weight:bold">🍳 互动锅 (放入食材合成)</div>
                <div class="pot-slots">
                    <div class="slot" onclick="removeFromPot(0)" style="cursor:pointer">${pot[0] || ''}</div>
                    <div class="slot" onclick="removeFromPot(1)" style="cursor:pointer">${pot[1] || ''}</div>
                    <div class="slot" onclick="removeFromPot(2)" style="cursor:pointer">${pot[2] || ''}</div>
                     <div class="slot" onclick="removeFromPot(3)" style="cursor:pointer">${pot[3] || ''}</div>
                </div>
                <button class="main-btn" onclick="cook()">开始烹饪 🔥</button>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <b style="font-size:0.75rem">点击食材入锅：</b>
                <a style="font-size:0.75rem;color:#0984e3;cursor:pointer" onclick="toggleRecipeBook()">📖 查看菜谱图鉴</a>
            </div>
            <div class="grid-4" id="kitchen-ingredients">
        `;
        for (let item in backpack) {
            if (backpack[item] > 0 && FOOD_DB[item] && FOOD_DB[item].type === 'food') {
                html += `<div class="item-card" onclick="addToPot('${item}')"><div class="icon">${item}</div></div>`;
            }
        }
        html += '</div>';
        content.innerHTML = html;
    }
    else if (tab === 'shop') {
        let html = '<div class="grid-3">';
        for (let item in FOOD_DB) {
            html += `
                <div class="item-card" onclick="buy('${item}')">
                    <div class="icon">${item}</div>
                    <div>${FOOD_DB[item].name}</div>
                    <div style="color:#e67e22;font-weight:bold">💰${FOOD_DB[item].price}</div>
                </div>
            `;
        }
        html += '</div>';
        content.innerHTML = html;
    }
    else if (tab === 'chat') {
        content.innerHTML = `
            <div class="chat-box">
                <div class="chat-messages" id="chat-messages">
                    <div class="chat-msg pet"><b>${pet.name}</b>: 找我有什么事呀？可以陪我聊聊天哦！</div>
                </div>
                <div class="chat-input-group">
                    <input type="text" id="chat-input" placeholder="和 ${pet.name} 说话...">
                    <button class="main-btn" style="width:70px" onclick="sendChatMessage()">发送</button>
                </div>
            </div>
        `;
    }
    else if (tab === 'work') {
        content.innerHTML = `
            <div class="grid-3">
                <button class="main-btn" onclick="startJob('mine')">⛏️ 疯狂采矿</button>
                <button class="main-btn" onclick="startJob('store')">🏪 敏捷收银</button>
                <button class="main-btn" onclick="startJob('sweep')">🧹 清扫落叶</button>
            </div>
        `;
    }
}

// 菜谱弹窗切换
function toggleRecipeBook() {
    let text = "📖 经典菜谱图鉴：\n\n";
    RECIPES.forEach(r => {
        text += `${r.result} ${r.name}: ${r.ingredients.join(' + ')}\n`;
    });
    alert(text);
}

// 食物/水精准处理
function useItem(item) {
    const f = FOOD_DB[item];

    if (f && f.type === 'drink') {
        backpack[item]--;
        pet.thirst = Math.min(100, pet.thirst + f.thirst);
        document.getElementById('status-bubble').innerText = "咕嘟咕嘟，喝水真爽！💧";
        updateStats(); showTab('bag'); return;
    }

    if (pet.scene !== 'dining') {
        alert("请先切换到【🍽️ 饭厅】场景才可以喂餐哦！"); return;
    }
    if (pet.hunger >= 90) {
        document.getElementById('status-bubble').innerText = "太饱啦，吃不下！❌"; return;
    }

    backpack[item]--;
    const recipe = RECIPES.find(r => r.result === item);
    const hungerVal = f ? f.hunger : (recipe ? recipe.hunger : 40);
    pet.hunger = Math.min(100, pet.hunger + hungerVal);
    pet.love += 2;
    document.getElementById('status-bubble').innerText = "嚼嚼嚼，好吃！😋";
    updateStats(); showTab('bag');
}

// 烹饪锅逻辑
// 1. 修改后的 addToPot：点击食材放入烹饪锅
function addToPot(item) {
    // 检查背包里的数量，防止放入的数量超过持有量
    const currentInPotCount = pot.filter(i => i === item).length;
    if (backpack[item] <= currentInPotCount) {
        alert("背包里的食材不够放啦！");
        return;
    }

    if (pot.length < 4) { 
        pot.push(item); 
        showTab('kitchen'); // 刷新界面
    } else {
        alert("锅里最多只能放 4 种食材哦！");
    }
}

// 2. 新增的 removeFromPot：点击锅里的食材将其移出（取消选中）
function removeFromPot(index) {
    if (pot[index]) {
        pot.splice(index, 1); // 移除指定位置的食材
        showTab('kitchen');   // 刷新界面
    }
}

// 后面紧接着原有的 cook()、buy()、getItemName() 保持不变...

function cook() {
    if (pot.length < 2) return alert("放入至少 2 种食材才可烹饪！");

    // 寻找匹配配方
    const matched = RECIPES.find(r => {
        if (r.ingredients.length !== pot.length) return false;
        return r.ingredients.every(i => pot.includes(i));
    });

    if (matched) {
        // 1. 扣除锅里的消耗食材
        pot.forEach(i => backpack[i]--);
        
        // 2. 将合成产物加入背包数量
        backpack[matched.result] = (backpack[matched.result] || 0) + 1;

        // 3. 动态绑定属性到 FOOD_DB（确保它能被正常吃掉和展示名称）
        if (!FOOD_DB[matched.result]) {
            FOOD_DB[matched.result] = {
                name: matched.name,
                type: 'food',
                hunger: matched.hunger || 50
            };
        }

        alert(`🎉 烹饪成功！获得了【${matched.name} ${matched.result}】！已放进背包`);
    } else {
        pot.forEach(i => backpack[i]--);
        alert("🍳 烹饪失败！炸锅成了焦炭... 浪费了食材！");
    }
    pot = [];
    showTab('kitchen');
}

function buy(item) {
    if (pet.coins >= FOOD_DB[item].price) {
        pet.coins -= FOOD_DB[item].price;
        backpack[item] = (backpack[item] || 0) + 1;
        updateStats();
        alert(`购买了 ${FOOD_DB[item].name}！`);
    } else alert("金币不够，去打工赚钱吧！");
}

function getItemName(item) {
    if (FOOD_DB[item]) return FOOD_DB[item].name;
    const r = RECIPES.find(x => x.result === item);
    return r ? r.name : '美食';
}

// 💬 聊天互动系统
// 替换 script.js 中的 sendChatMessage 函数
async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const box = document.getElementById('chat-messages');
    
    // 1. 在对话框中显示玩家发送的消息
    box.innerHTML += `<div class="chat-msg user"><b>你</b>: ${msg}</div>`;
    input.value = '';
    
    // 2. 显示“思考中...”占位提示
    const loadingId = 'loading-' + Date.now();
    box.innerHTML += `<div class="chat-msg pet" id="${loadingId}"><b>${pet.name}</b>: 正在思考中...💭</div>`;
    box.scrollTop = box.scrollHeight;

// ----------------- 🔑 智谱 GLM-4-Flash 免费配置区 -----------------
    const API_KEY = "9eadcbfb789249b2815317a21bcece9b.yEWOH24gR1p8vF1k"; // 替换为你申请到的 Key
    const API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
    const MODEL_NAME = "glm-5.2";  // 
// ------------------------------------------------------------------

    // 设定宠物的 System Prompt（系统背景人设）
    const systemPrompt = `你是一只正在和主人互动的宠物，名字叫“${pet.name}”，你的形象是“${pet.avatar}”。
当前宠物的状态如下：
- 饱腹度：${pet.hunger}/100
- 水分：${pet.thirst}/100
- 睡眠：${pet.sleep}/100
- 好感度：${pet.love}/100

请以这只宠物的口吻回复主人，语气要可爱、语气词丰富（如喵~、汪~、咕噜等）。回复保持在 2-4 句话以内，不要太长。`;

    try {
        // 3. 向 DeepSeek API 发送 HTTP 请求
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: msg }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        // 4. 解析 API 返回的结果并更新 UI
        if (data.choices && data.choices[0]) {
            const aiReply = data.choices[0].message.content;
            document.getElementById(loadingId).innerHTML = `<b>${pet.name}</b>: ${aiReply}`;
        } else {
            document.getElementById(loadingId).innerHTML = `<b>${pet.name}</b>: 走神了，没听清...（API返回异常）`;
        }
    } catch (error) {
        console.error("AI 接口请求失败:", error);
        document.getElementById(loadingId).innerHTML = `<b>${pet.name}</b>: 网络好像卡住了，没听到你说什么呢...`;
    }

    box.scrollTop = box.scrollHeight;
}

// 💼 真实打工微操系统 (完全独立玩法)
let jobTimer;
function startJob(type) {
    document.getElementById('work-modal').classList.remove('hidden');
    const area = document.getElementById('work-game-area');

    if (type === 'mine') {
        document.getElementById('work-title').innerText = "⛏️ 采矿工 (连点矿石暴击！限时 6 秒)";
        let count = 0;
        area.innerHTML = `
            <div id="mine-diamond" style="font-size:70px;cursor:pointer;margin:10px;user-select:none;">💎</div>
            <div>敲击次数: <b id="mc">0</b></div>
        `;

        // 用 JS 绑定点击事件，确保能正确增加局部变量 count
        document.getElementById('mine-diamond').onclick = () => {
            count++;
            document.getElementById('mc').innerText = count;
        };

        let left = 6;
        jobTimer = setInterval(() => {
            left--;
            if (left <= 0) {
                clearInterval(jobTimer);
                const earn = count * 4;
                pet.coins += earn;
                alert(`采矿结束！敲击 ${count} 次，赚到了 💰${earn} 金币！`);
                closeWorkModal();
            }
        }, 1000);
    }
    else if (type === 'store') {
        document.getElementById('work-title').innerText = "🏪 收银员 (快速点击与顾客要求相符的商品)";
        let score = 0;
        let targets = ['🍞', '🥛', '🥩', '🍎'];
        let currentTarget = '🍞';

        window.clickStore = (item) => {
            if (item === currentTarget) score += 15;
            currentTarget = targets[Math.floor(Math.random() * targets.length)];
            document.getElementById('st-target').innerText = currentTarget;
            document.getElementById('st-score').innerText = score;
        };

        area.innerHTML = `
            <div>顾客要: <span id="st-target" style="font-size:40px">🍞</span></div>
            <div style="font-size:0.8rem;margin:5px 0">当前收益: 💰<b id="st-score">0</b></div>
            <div class="grid-4" style="margin-top:10px">
                <button class="main-btn" onclick="clickStore('🍞')">🍞</button>
                <button class="main-btn" onclick="clickStore('🥛')">🥛</button>
                <button class="main-btn" onclick="clickStore('🥩')">🥩</button>
                <button class="main-btn" onclick="clickStore('🍎')">🍎</button>
            </div>
        `;
        setTimeout(() => {
            pet.coins += score;
            alert(`下班啦！本次收银共赚到 💰${score} 金币！`);
            closeWorkModal();
        }, 8000);
    }
    else if (type === 'sweep') {
        document.getElementById('work-title').innerText = "🧹 扫落叶 (点击清除所有落叶！)";
        let leaves = 6;
        area.innerHTML = `<div id="leaf-box" style="position:relative;height:120px;background:#55efc4;border-radius:8px"></div>`;
        const box = document.getElementById('leaf-box');

        for (let i = 0; i < leaves; i++) {
            const leaf = document.createElement('div');
            leaf.innerText = '🍂';
            leaf.style.cssText = `position:absolute;font-size:30px;cursor:pointer;left:${Math.random()*260}px;top:${Math.random()*80}px`;
            leaf.onclick = () => {
                leaf.remove();
                leaves--;
                if (leaves <= 0) {
                    pet.coins += 50;
                    alert("落叶清扫干净！获得打工报酬 💰50 金币！");
                    closeWorkModal();
                }
            };
            box.appendChild(leaf);
        }
    }
}

function closeWorkModal() {
    clearInterval(jobTimer);
    document.getElementById('work-modal').classList.add('hidden');
    updateStats();
}