document.addEventListener("DOMContentLoaded", async function() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;

    const token = localStorage.getItem('pb_token');
    let perfilUsuario = "OPERADOR";

    // A MÁGICA GLOBAL: Atualiza o perfil caso o login tenha deixado vazio
    if (token) {
        try {
            const POCKETBASE_URL = 'https://be8-be8-backend.i6qanl.easypanel.host';
            const res = await fetch(`${POCKETBASE_URL}/api/collections/users_checklist_portal/auth-refresh`, {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if(res.ok) {
                const data = await res.json();
                if(data && data.record) {
                    localStorage.setItem('pocketbase_auth', JSON.stringify({ model: data.record }));
                    perfilUsuario = String(data.record.perfil || "OPERADOR").toUpperCase();
                }
            }
        } catch(e) {}
    }

    const isSSMA = (perfilUsuario === 'SSMA' || perfilUsuario === 'ADMIN');
    
    const iconSun = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    const iconMoon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

    const menuStyles = `
        <style>
            .apple-top-nav { position: sticky; top: 0; z-index: 9000; background: rgba(242, 242, 247, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,0,0,0.1); display: flex; align-items: center; padding: 0 20px; height: 60px; box-sizing: border-box; }
            body.force-dark .apple-top-nav { background: rgba(28, 28, 30, 0.85); border-bottom: 1px solid rgba(255,255,255,0.1); }
            .nav-left { flex: 1; display: flex; justify-content: flex-start; align-items: center; }
            .nav-center { flex: 2; display: flex; justify-content: center; align-items: center; gap: 25px; white-space: nowrap; }
            .nav-right { flex: 1; display: flex; justify-content: flex-end; align-items: center; gap: 15px; }
            .nav-brand { font-weight: 700; font-size: 16px; color: var(--text); text-decoration: none; letter-spacing: 0.5px;}
            .nav-center a { text-decoration: none; color: var(--text); font-weight: 500; font-size: 14px; transition: color 0.2s; }
            .nav-center a:hover { color: var(--accent); }
            .nav-link-ssma { color: var(--text); } 
            .nav-btn { background: none; border: none; cursor: pointer; color: var(--text); padding: 5px; display: flex; align-items: center; justify-content: center; transition: opacity 0.2s; }
            .nav-btn:hover { opacity: 0.6; }
            .nav-btn.calc { font-size: 18px; margin-top: 2px; }
            .nav-btn.logout { color: #ff3b30; font-size: 15px; font-weight: 600; text-decoration: none; }
            .calc-widget { display: none; position: fixed; top: 75px; right: 20px; width: 260px; background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 15px; z-index: 9999; box-shadow: 0 10px 40px rgba(0,0,0,0.15); }
            .calc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
            .calc-header h3 { margin: 0; font-size: 14px; color: var(--text); font-weight: 600;}
            .calc-close { background: var(--bg); border: none; font-size: 16px; color: var(--text-muted); cursor: pointer; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
            .calc-display { width: 100%; height: 50px; background: var(--bg); border-radius: 8px; margin-bottom: 15px; text-align: right; padding: 10px 15px; font-size: 22px; font-weight: 600; color: var(--text); border: 1px solid var(--border); box-sizing: border-box; overflow: hidden; }
            .calc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
            .calc-btn { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 12px 0; font-size: 16px; font-weight: 600; color: var(--text); cursor: pointer; transition: 0.1s; }
            .calc-btn:active { background: var(--border); }
            .calc-btn.op { background: rgba(0, 122, 255, 0.1); color: var(--accent); border-color: rgba(0, 122, 255, 0.2); }
            .calc-btn.eq { background: var(--accent); color: #fff; border-color: var(--accent); grid-column: span 2; }
            @media (max-width: 800px) { .nav-center { display: none; } }
        </style>
    `;

    const menuHTML = `
        <nav class="apple-top-nav">
            <div class="nav-left"><a href="index.html" class="nav-brand">SpiderWorks</a></div>
            <div class="nav-center">
                <a href="index.html">Início</a>
                <a href="operador.html">Novo Checklist</a>
                ${isSSMA ? `<a href="historico.html">Histórico</a>` : ''}
                <a href="manual.html">Manual</a>
                ${isSSMA ? `<a href="config_ssma.html" class="nav-link-ssma">Configuração</a>` : ''}
            </div>
            <div class="nav-right">
                <button class="nav-btn calc" onclick="toggleCalc()" title="Calculadora">🧮</button>
                <button class="nav-btn" id="btn-theme-toggle" title="Alternar Tema">${iconMoon}</button>
                <a href="#" class="nav-btn logout" onclick="fazerLogout()">Sair</a>
            </div>
        </nav>
        <div class="calc-widget" id="calcWidget">
            <div class="calc-header"><h3>Calculadora</h3><button class="calc-close" onclick="toggleCalc()">✕</button></div>
            <div class="calc-display" id="calcDisplay">0</div>
            <div class="calc-grid">
                <button class="calc-btn" onclick="calcInput('7')">7</button><button class="calc-btn" onclick="calcInput('8')">8</button><button class="calc-btn" onclick="calcInput('9')">9</button><button class="calc-btn op" onclick="calcInput('/')">÷</button>
                <button class="calc-btn" onclick="calcInput('4')">4</button><button class="calc-btn" onclick="calcInput('5')">5</button><button class="calc-btn" onclick="calcInput('6')">6</button><button class="calc-btn op" onclick="calcInput('*')">×</button>
                <button class="calc-btn" onclick="calcInput('1')">1</button><button class="calc-btn" onclick="calcInput('2')">2</button><button class="calc-btn" onclick="calcInput('3')">3</button><button class="calc-btn op" onclick="calcInput('-')">-</button>
                <button class="calc-btn op" onclick="calcClear()" style="color:var(--danger);">C</button><button class="calc-btn" onclick="calcInput('0')">0</button><button class="calc-btn op" onclick="calcInput('+')">+</button><button class="calc-btn eq" onclick="calcResult()">=</button>
            </div>
        </div>
    `;

    menuContainer.innerHTML = menuStyles + menuHTML;

    const btnTheme = document.getElementById('btn-theme-toggle');
    let temaAtual = localStorage.getItem('theme_preference') || 'claro';
    aplicarTema(temaAtual);
    btnTheme.addEventListener('click', function(e) { e.preventDefault(); temaAtual = (temaAtual === 'claro') ? 'escuro' : 'claro'; aplicarTema(temaAtual); localStorage.setItem('theme_preference', temaAtual); });
    function aplicarTema(tema) { if (tema === 'escuro') { document.body.classList.add('force-dark'); btnTheme.innerHTML = iconSun; } else { document.body.classList.remove('force-dark'); btnTheme.innerHTML = iconMoon; } }
});

function fazerLogout() { if(confirm("Tem certeza que deseja sair?")) { localStorage.clear(); window.location.href = 'login.html'; } }
let calcExpressao = "";
function toggleCalc() { const w = document.getElementById('calcWidget'); w.style.display = (w.style.display === 'block') ? 'none' : 'block'; calcClear(); }
function calcInput(valor) { if(calcExpressao === "Erro") calcExpressao = ""; const u = calcExpressao.slice(-1); if (['+','-','*','/'].includes(valor) && ['+','-','*','/'].includes(u)) { calcExpressao = calcExpressao.slice(0, -1) + valor; } else { calcExpressao += valor; } document.getElementById('calcDisplay').innerText = calcExpressao; }
function calcClear() { calcExpressao = ""; document.getElementById('calcDisplay').innerText = "0"; }
function calcResult() { try { if(calcExpressao) { const res = eval(calcExpressao); calcExpressao = Number.isInteger(res) ? res.toString() : res.toFixed(2); document.getElementById('calcDisplay').innerText = calcExpressao; } } catch(e) { calcExpressao = "Erro"; document.getElementById('calcDisplay').innerText = "Erro"; } }