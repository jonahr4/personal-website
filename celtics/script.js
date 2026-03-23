/* ====== INLINE CSV DATA ====== */
// Data is embedded directly — no server needed. Edit this string to update games.
const CSV_DATA = `date,season,opponent,companion,celtics_score,opponent_score,result,overtime,tags,notes
10/2/22,2022-2023,Hornets,Sean,134,93,W,false,preseason,
10/28/22,2022-2023,Cavs,Omar,123,132,L,true,,
12/2/22,2022-2023,Heat,Omar,116,120,L,true,,
12/21/22,2022-2023,Pacers,Jeremy,112,117,L,false,,
1/19/23,2022-2023,Golden State,Sean,121,118,W,false,,
2/12/23,2022-2023,Grizzlies,Magda,119,109,W,false,,
3/1/23,2022-2023,Cavs,Omar,117,113,W,false,,
4/7/23,2022-2023,Raptors,Ayoub,121,102,W,false,,
5/1/23,2022-2023,76ers,Jackson,115,119,L,false,playoffs-r2,"Round 2 Game 1"
5/3/23,2022-2023,76ers,Magda,121,87,W,false,playoffs-r2,"Round 2 Game 2"
5/9/23,2022-2023,76ers,Magda,103,115,L,false,playoffs-r2,"Round 2 Game 5"
5/14/23,2022-2023,76ers,Josh,112,88,W,false,playoffs-r2,"Round 2 Game 7"
10/8/23,2023-2024,76ers,Omar,114,106,W,false,preseason,
10/27/23,2023-2024,Heat,Rafa,119,111,W,false,,
12/12/23,2023-2024,Cavs,Magda,120,113,W,false,,
12/28/23,2023-2024,Pistons,Ross,128,122,W,true,,"Pistons 28 straight loss (tying record); Down 66-47 at half"
1/17/24,2023-2024,Spurs,Ayoub,117,98,W,false,,"Victor WEMBANYAMA rookie"
2/1/24,2023-2024,Lakers,Sean,114,105,L,false,,"No LeBron or AD. Whyyyyy"
2/4/24,2023-2024,Grizzlies,Omar,131,91,W,false,,"Video went viral; Jordan Walsh minutes and dunk; Marcus Smart return but injury"
3/20/24,2023-2024,Bucks,Ayoub,122,119,W,false,,"We had like a 20 point lead and sold in 4th; No Giannis :("
4/3/24,2023-2024,OKC,Sean,135,100,W,false,,"No Shai; Last min went cuz Sean Hope never claimed seats"
4/14/24,2023-2024,Wizards,Evan,132,122,W,false,,"Pritchard career high; Last game of season; No Poole"
5/15/24,2023-2024,Cavs,Dad,113,98,W,false,playoffs-r2,"Series clinching game 4-1; No Donovan Mitchell (bad starless streak)"
5/21/24,2023-2024,Pacers,Josh,128,133,W,true,playoffs-r3,"Started game 12-0 run; McLovin and Drake Maye there; Jaylen Brown buzzer 3 to go to OT"
6/17/24,2023-2024,Mavericks,Andrew,106,88,W,false,playoffs-r4,"Celtics win championship!!; Jaylen Brown surprise FMVP; Finals ceremony; Derek White chipped tooth"
10/12/24,2024-2025,76ers,,139,89,W,false,preseason,"Jared McCain; 50 point win"
10/13/24,2024-2025,Raptors,Nav,115,111,W,false,preseason,"Scottie Barnes; Nav's first game; We were winning by a lot and then sold"
10/22/24,2024-2025,Knicks,Ayoub,132,109,W,false,season-opener,"Home opener and banner ceremony; KAT's first game with Knicks"
11/6/24,2024-2025,Warriors,Sean,118,112,L,false,,"Curry; No Porzingis or Brown"
11/12/24,2024-2025,Cavs,Ali,120,117,W,false,,"Ended Cavs 15-0 start"
11/24/24,2024-2025,Timberwolves,Omar,107,105,W,false,,"ANT MAN; Had big lead but got cut down"
12/2/24,2024-2025,Heat,Rafa,108,89,W,false,,
12/6/24,2024-2025,Bucks,Jackson,111,105,W,false,,
5/5/25,2024-2025,Knicks,Ayoub,105,108,L,false,playoffs-r2,
10/12/25,2025-2026,Cavs,Ali,138,107,W,false,preseason,"Mark Wahlberg filmed movie"
10/22/25,2025-2026,76ers,Olivia,116,117,L,false,season-opener,
10/29/25,2025-2026,Cavs,Ali,125,105,W,false,,
11/16/25,2025-2026,Clippers,James,121,118,W,false,,
12/5/25,2025-2026,Lakers,Omar,105,126,W,false,,"No LeBron, Luka, or Marcus Smart"
1/28/26,2025-2026,Hawks,James,106,117,L,false,,
2/8/26,2025-2026,Knicks,Ayoub,89,111,L,false,,
3/22/26,2025-2026,Timberwolves,Ali,92,102,L,false,,"No Anthony Edwards (🥲)"`;

/* ====== STATE ====== */
let allGames = [];
let currentFilter = 'all';
let editingIndex = -1;
let deletingIndex = -1;
let hasChanges = false;

/* ====== CSV PARSING ====== */

function loadGames() {
    const lines = CSV_DATA.trim().split('\n');
    const headers = parseCSVLine(lines[0]);
    const games = [];
    for (let i = 1; i < lines.length; i++) {
        const vals = parseCSVLine(lines[i]);
        if (vals.length < 2) continue;
        const obj = {};
        headers.forEach((h, idx) => obj[h.trim()] = (vals[idx] || '').trim());
        obj.celtics_score = parseInt(obj.celtics_score) || 0;
        obj.opponent_score = parseInt(obj.opponent_score) || 0;
        obj.overtime = obj.overtime === 'true';
        obj.dateObj = parseDate(obj.date);
        games.push(obj);
    }
    return games;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') { inQuotes = !inQuotes; }
        else if (ch === ',' && !inQuotes) { result.push(current); current = ''; }
        else { current += ch; }
    }
    result.push(current);
    return result;
}

function parseDate(str) {
    const parts = str.split('/');
    if (parts.length !== 3) return new Date();
    let [m, d, y] = parts.map(Number);
    if (y < 100) y += 2000;
    return new Date(y, m - 1, d);
}

function formatDate(d) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatDateShort(d) {
    return `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(-2)}`;
}

function gameToCSVDate(d) {
    return `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(-2)}`;
}

function gameToCSVLine(g) {
    const notes = g.notes ? `"${g.notes}"` : '';
    return `${g.date},${g.season},${g.opponent},${g.companion || ''},${g.celtics_score},${g.opponent_score},${g.result},${g.overtime},${g.tags || ''},${notes}`;
}

function gamesToCSV() {
    const header = 'date,season,opponent,companion,celtics_score,opponent_score,result,overtime,tags,notes';
    const sorted = [...allGames].sort((a, b) => a.dateObj - b.dateObj);
    const lines = sorted.map(g => gameToCSVLine(g));
    return header + '\n' + lines.join('\n');
}

/* ====== TOAST ====== */
function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = 'toast show' + (isError ? ' error' : '');
    setTimeout(() => { toast.className = 'toast'; }, 2500);
}

/* ====== STATS COMPUTATION ====== */

function computeStats(games) {
    const s = {};
    const wins = games.filter(g => g.result === 'W');
    const losses = games.filter(g => g.result === 'L');
    s.total = games.length;
    s.wins = wins.length;
    s.losses = losses.length;
    s.winPct = s.total ? (s.wins / s.total * 100).toFixed(1) : '0.0';

    const regular = games.filter(g => !g.tags || g.tags === 'season-opener');
    const playoffs = games.filter(g => g.tags && g.tags.startsWith('playoffs'));
    const preseason = games.filter(g => g.tags === 'preseason');
    s.regularW = regular.filter(g => g.result === 'W').length;
    s.regularL = regular.filter(g => g.result === 'L').length;
    s.regularTotal = regular.length;
    s.playoffsW = playoffs.filter(g => g.result === 'W').length;
    s.playoffsL = playoffs.filter(g => g.result === 'L').length;
    s.playoffsTotal = playoffs.length;
    s.preseasonW = preseason.filter(g => g.result === 'W').length;
    s.preseasonL = preseason.filter(g => g.result === 'L').length;
    s.preseasonTotal = preseason.length;

    const cScores = games.map(g => g.celtics_score);
    const oScores = games.map(g => g.opponent_score);
    s.avgCeltics = s.total ? (cScores.reduce((a, b) => a + b, 0) / s.total).toFixed(1) : '0';
    s.avgOpponent = s.total ? (oScores.reduce((a, b) => a + b, 0) / s.total).toFixed(1) : '0';
    s.totalCelticsPoints = cScores.reduce((a, b) => a + b, 0);
    s.totalOpponentPoints = oScores.reduce((a, b) => a + b, 0);

    const winMargins = wins.map(g => g.celtics_score - g.opponent_score);
    const lossMargins = losses.map(g => g.opponent_score - g.celtics_score);
    s.avgWinMargin = winMargins.length ? (winMargins.reduce((a, b) => a + b, 0) / winMargins.length).toFixed(1) : '0';
    s.avgLossMargin = lossMargins.length ? (lossMargins.reduce((a, b) => a + b, 0) / lossMargins.length).toFixed(1) : '0';

    const sorted = [...games].sort((a, b) => (b.celtics_score - b.opponent_score) - (a.celtics_score - a.opponent_score));
    s.biggestWin = sorted[0];
    s.biggestWinMargin = s.biggestWin ? s.biggestWin.celtics_score - s.biggestWin.opponent_score : 0;
    s.worstLoss = sorted[sorted.length - 1];
    s.worstLossMargin = s.worstLoss ? s.worstLoss.opponent_score - s.worstLoss.celtics_score : 0;

    const otGames = games.filter(g => g.overtime);
    s.otTotal = otGames.length;
    s.otWins = otGames.filter(g => g.result === 'W').length;
    s.otLosses = otGames.filter(g => g.result === 'L').length;

    const chronological = [...games].sort((a, b) => a.dateObj - b.dateObj);
    let longestWin = 0, longestLoss = 0, tempStreak = 0, tempType = '';
    for (const g of chronological) {
        if (g.result === tempType) { tempStreak++; }
        else { tempType = g.result; tempStreak = 1; }
        if (tempType === 'W' && tempStreak > longestWin) longestWin = tempStreak;
        if (tempType === 'L' && tempStreak > longestLoss) longestLoss = tempStreak;
    }
    s.currentStreak = tempStreak;
    s.currentStreakType = tempType;
    s.longestWinStreak = longestWin;
    s.longestLossStreak = longestLoss;

    const seasonMap = {};
    for (const g of games) {
        if (!seasonMap[g.season]) seasonMap[g.season] = [];
        seasonMap[g.season].push(g);
    }
    s.seasons = {};
    for (const [season, gs] of Object.entries(seasonMap)) {
        const sw = gs.filter(g => g.result === 'W').length;
        const sl = gs.filter(g => g.result === 'L').length;
        s.seasons[season] = {
            games: gs, total: gs.length, wins: sw, losses: sl,
            winPct: gs.length ? (sw / gs.length * 100).toFixed(1) : '0.0',
            playoffGames: gs.filter(g => g.tags && g.tags.startsWith('playoffs')).length,
            preseasonGames: gs.filter(g => g.tags === 'preseason').length,
            regularGames: gs.filter(g => !g.tags || g.tags === 'season-opener').length,
        };
    }

    const compMap = {};
    for (const g of games) {
        const comp = g.companion || 'Solo';
        if (!compMap[comp]) compMap[comp] = { games: [], wins: 0, losses: 0 };
        compMap[comp].games.push(g);
        if (g.result === 'W') compMap[comp].wins++;
        else compMap[comp].losses++;
    }
    s.companions = Object.entries(compMap).map(([name, data]) => ({
        name,
        total: data.games.length,
        wins: data.wins,
        losses: data.losses,
        winPct: data.games.length ? (data.wins / data.games.length * 100).toFixed(1) : '0.0',
        firstGame: data.games.sort((a, b) => a.dateObj - b.dateObj)[0],
        lastGame: data.games.sort((a, b) => b.dateObj - a.dateObj)[0],
        seasons: [...new Set(data.games.map(g => g.season))],
        gamesList: [...data.games].sort((a, b) => a.dateObj - b.dateObj),
    })).sort((a, b) => b.total - a.total);

    s.bestCompanion = [...s.companions].filter(c => c.total >= 2).sort((a, b) => parseFloat(b.winPct) - parseFloat(a.winPct))[0];
    s.worstCompanion = [...s.companions].filter(c => c.total >= 2).sort((a, b) => parseFloat(a.winPct) - parseFloat(b.winPct))[0];

    const oppMap = {};
    for (const g of games) {
        if (!oppMap[g.opponent]) oppMap[g.opponent] = { wins: 0, losses: 0, total: 0 };
        oppMap[g.opponent].total++;
        if (g.result === 'W') oppMap[g.opponent].wins++;
        else oppMap[g.opponent].losses++;
    }
    s.opponents = Object.entries(oppMap).map(([name, data]) => ({
        name, ...data,
        winPct: data.total ? (data.wins / data.total * 100).toFixed(1) : '0.0',
    })).sort((a, b) => b.total - a.total);

    s.mostCommonOpponent = s.opponents[0];
    s.uniqueCompanions = s.companions.filter(c => c.name !== 'Solo').length;

    const highestScoring = [...games].sort((a, b) => (b.celtics_score + b.opponent_score) - (a.celtics_score + a.opponent_score))[0];
    s.highestScoringGame = highestScoring;
    s.highestScoringTotal = highestScoring ? highestScoring.celtics_score + highestScoring.opponent_score : 0;

    const highCeltics = [...games].sort((a, b) => b.celtics_score - a.celtics_score)[0];
    s.highCelticsGame = highCeltics;
    const lowCeltics = [...games].sort((a, b) => a.celtics_score - b.celtics_score)[0];
    s.lowCelticsGame = lowCeltics;

    const yearMap = {};
    for (const g of games) { const yr = g.dateObj.getFullYear(); yearMap[yr] = (yearMap[yr] || 0) + 1; }
    s.gamesPerYear = yearMap;
    s.mostGamesYear = Object.entries(yearMap).sort((a, b) => b[1] - a[1])[0];

    s.closeGames = games.filter(g => Math.abs(g.celtics_score - g.opponent_score) <= 5).length;
    s.blowouts = games.filter(g => Math.abs(g.celtics_score - g.opponent_score) >= 20).length;
    s.uniqueOpponents = s.opponents.length;
    s.championshipGames = games.filter(g => g.tags === 'playoffs-r4');

    return s;
}

/* ====== RENDERING ====== */

function refreshAll() {
    const stats = computeStats(allGames);
    renderHeroStats(stats);
    renderStatsGrid(stats);
    renderSeasonCards(stats);
    renderCompanionTable(stats);
    renderOpponentGrid(stats);
    renderGameLog(allGames, currentFilter);
}

function renderHeroStats(stats) {
    document.getElementById('hero-stats').innerHTML = `
        <div class="hero-stat">
            <div class="hero-stat-value">${stats.total}</div>
            <div class="hero-stat-label">Games</div>
        </div>
        <div class="hero-stat">
            <div class="hero-stat-value">${stats.wins}-${stats.losses}</div>
            <div class="hero-stat-label">Record</div>
        </div>
        <div class="hero-stat">
            <div class="hero-stat-value gold">${stats.winPct}%</div>
            <div class="hero-stat-label">Win Rate</div>
        </div>
        <div class="hero-stat">
            <div class="hero-stat-value">${Object.keys(stats.seasons).length}</div>
            <div class="hero-stat-label">Seasons</div>
        </div>
    `;
}

function renderStatsGrid(stats) {
    const cards = [
        { label: 'Regular Season', value: `${stats.regularW}-${stats.regularL}`, sub: `${stats.regularTotal} games`, cls: '' },
        { label: 'Playoffs', value: `${stats.playoffsW}-${stats.playoffsL}`, sub: `${stats.playoffsTotal} games`, cls: 'gold' },
        { label: 'Preseason', value: `${stats.preseasonW}-${stats.preseasonL}`, sub: `${stats.preseasonTotal} games`, cls: '' },
        { label: 'Avg Celtics Score', value: stats.avgCeltics, sub: `${stats.totalCelticsPoints.toLocaleString()} total pts`, cls: 'green' },
        { label: 'Avg Opponent Score', value: stats.avgOpponent, sub: `${stats.totalOpponentPoints.toLocaleString()} total pts`, cls: '' },
        { label: 'Avg Win Margin', value: `+${stats.avgWinMargin}`, sub: '', cls: 'win' },
        { label: 'Avg Loss Margin', value: `-${stats.avgLossMargin}`, sub: '', cls: 'loss' },
        { label: 'Current Streak', value: `${stats.currentStreak}${stats.currentStreakType}`, sub: stats.currentStreakType === 'W' ? 'Wins in a row' : 'Losses in a row', cls: stats.currentStreakType === 'W' ? 'win' : 'loss' },
        { label: 'Longest Win Streak', value: `${stats.longestWinStreak}W`, sub: '', cls: 'win' },
        { label: 'Longest Loss Streak', value: `${stats.longestLossStreak}L`, sub: '', cls: 'loss' },
        { label: 'Overtime Record', value: `${stats.otWins}-${stats.otLosses}`, sub: `${stats.otTotal} OT games`, cls: '' },
        { label: 'Close Games (≤5)', value: stats.closeGames, sub: `of ${stats.total} games`, cls: '' },
        { label: 'Blowouts (20+)', value: stats.blowouts, sub: `of ${stats.total} games`, cls: 'green' },
        { label: 'Biggest Win', value: `+${stats.biggestWinMargin}`, sub: stats.biggestWin ? `vs ${stats.biggestWin.opponent} (${formatDateShort(stats.biggestWin.dateObj)})` : '', cls: 'win' },
        { label: 'Worst Loss', value: `-${stats.worstLossMargin}`, sub: stats.worstLoss ? `vs ${stats.worstLoss.opponent} (${formatDateShort(stats.worstLoss.dateObj)})` : '', cls: 'loss' },
        { label: 'Highest Scoring Game', value: stats.highestScoringTotal, sub: stats.highestScoringGame ? `vs ${stats.highestScoringGame.opponent} (${stats.highestScoringGame.celtics_score}-${stats.highestScoringGame.opponent_score})` : '', cls: '' },
        { label: 'Celtics High', value: stats.highCelticsGame ? stats.highCelticsGame.celtics_score : '', sub: stats.highCelticsGame ? `vs ${stats.highCelticsGame.opponent} (${formatDateShort(stats.highCelticsGame.dateObj)})` : '', cls: 'green' },
        { label: 'Celtics Low', value: stats.lowCelticsGame ? stats.lowCelticsGame.celtics_score : '', sub: stats.lowCelticsGame ? `vs ${stats.lowCelticsGame.opponent} (${formatDateShort(stats.lowCelticsGame.dateObj)})` : '', cls: 'loss' },
        { label: 'Unique Opponents', value: stats.uniqueOpponents, sub: `Most: ${stats.mostCommonOpponent ? stats.mostCommonOpponent.name + ' (' + stats.mostCommonOpponent.total + ')' : ''}`, cls: '' },
        { label: 'Unique Companions', value: stats.uniqueCompanions, sub: '', cls: '' },
        { label: 'Best Companion (2+)', value: stats.bestCompanion ? stats.bestCompanion.name : 'N/A', sub: stats.bestCompanion ? `${stats.bestCompanion.winPct}% (${stats.bestCompanion.wins}-${stats.bestCompanion.losses})` : '', cls: 'win' },
        { label: 'Worst Companion (2+)', value: stats.worstCompanion ? stats.worstCompanion.name : 'N/A', sub: stats.worstCompanion ? `${stats.worstCompanion.winPct}% (${stats.worstCompanion.wins}-${stats.worstCompanion.losses})` : '', cls: 'loss' },
        { label: 'Best Year', value: stats.mostGamesYear ? stats.mostGamesYear[0] : '', sub: stats.mostGamesYear ? `${stats.mostGamesYear[1]} games attended` : '', cls: 'gold' },
        { label: 'Championships Witnessed', value: stats.championshipGames.length, sub: stats.championshipGames.length ? '🏆 Banner 18' : '', cls: 'gold' },
    ];

    document.getElementById('stats-grid').innerHTML = cards.map(c => `
        <div class="stat-card fade-in">
            <div class="stat-card-label">${c.label}</div>
            <div class="stat-card-value ${c.cls}">${c.value}</div>
            ${c.sub ? `<div class="stat-card-sub">${c.sub}</div>` : ''}
        </div>
    `).join('');
}

function renderSeasonCards(stats) {
    const seasonOrder = Object.keys(stats.seasons).sort();
    document.getElementById('season-cards').innerHTML = seasonOrder.map(season => {
        const s = stats.seasons[season];
        return `
            <div class="season-card fade-in">
                <div class="season-card-title">🏀 ${season}</div>
                <div class="season-card-record">${s.wins}-${s.losses}</div>
                <div class="season-card-pct">${s.winPct}% win rate · ${s.total} games</div>
                <div class="season-card-details">
                    ${s.regularGames ? `<span>Regular Season: ${s.regularGames} game${s.regularGames !== 1 ? 's' : ''}</span>` : ''}
                    ${s.playoffGames ? `<span>Playoffs: ${s.playoffGames} game${s.playoffGames !== 1 ? 's' : ''}</span>` : ''}
                    ${s.preseasonGames ? `<span>Preseason: ${s.preseasonGames} game${s.preseasonGames !== 1 ? 's' : ''}</span>` : ''}
                </div>
                <div class="season-bar"><div class="season-bar-fill" style="width:${s.winPct}%"></div></div>
            </div>
        `;
    }).join('');
}

function renderCompanionTable(stats) {
    const rows = stats.companions.map((c, i) => {
        const pct = parseFloat(c.winPct);
        let badgeCls = 'mid';
        if (pct >= 70) badgeCls = 'high';
        else if (pct < 50) badgeCls = 'low';

        const detailGames = c.gamesList.map(g => {
            let tagHtml = '';
            if (g.tags && g.tags.startsWith('playoffs')) tagHtml = `<span class="detail-game-tag playoffs">Playoffs</span>`;
            else if (g.tags === 'preseason') tagHtml = `<span class="detail-game-tag preseason">Preseason</span>`;
            const ot = g.overtime ? ' OT' : '';
            return `<div class="detail-game">
                <span class="detail-game-date">${formatDateShort(g.dateObj)}</span>
                <span class="detail-game-matchup">vs ${g.opponent}</span>
                ${tagHtml}
                <span class="detail-game-score ${g.result}">${g.celtics_score}-${g.opponent_score}${ot} ${g.result}</span>
            </div>`;
        }).join('');

        return `<tr class="companion-row" data-idx="${i}">
            <td class="companion-rank">${i + 1}</td>
            <td class="companion-name"><i class="fa-solid fa-chevron-right expand-icon"></i> ${c.name}</td>
            <td>${c.total}</td>
            <td>${c.wins}-${c.losses}</td>
            <td><span class="win-badge ${badgeCls}">${c.winPct}%</span></td>
            <td class="hide-mobile">${c.seasons.length}</td>
            <td class="hide-mobile">${formatDateShort(c.firstGame.dateObj)}</td>
            <td class="hide-mobile">${formatDateShort(c.lastGame.dateObj)}</td>
        </tr>
        <tr class="companion-detail-row" id="companion-detail-${i}" style="display:none;">
            <td colspan="8">
                <div class="companion-games-detail">${detailGames}</div>
            </td>
        </tr>`;
    }).join('');

    document.getElementById('companion-table-wrap').innerHTML = `
        <table class="companion-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Companion</th>
                    <th>Games</th>
                    <th>Record</th>
                    <th>Win %</th>
                    <th class="hide-mobile">Seasons</th>
                    <th class="hide-mobile">First</th>
                    <th class="hide-mobile">Last</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;

    document.querySelectorAll('.companion-row').forEach(row => {
        row.addEventListener('click', () => {
            const idx = row.dataset.idx;
            const detail = document.getElementById(`companion-detail-${idx}`);
            const isOpen = detail.style.display !== 'none';
            document.querySelectorAll('.companion-detail-row').forEach(d => d.style.display = 'none');
            document.querySelectorAll('.companion-row').forEach(r => r.classList.remove('expanded'));
            if (!isOpen) {
                detail.style.display = '';
                row.classList.add('expanded');
            }
        });
    });
}

function renderOpponentGrid(stats) {
    document.getElementById('opponent-grid').innerHTML = stats.opponents.map(o => {
        const pct = parseFloat(o.winPct);
        const color = pct >= 50 ? 'var(--win-color)' : 'var(--loss-color)';
        return `
            <div class="opponent-card fade-in">
                <div class="opponent-name">${o.name}</div>
                <div class="opponent-record" style="color:${color}">${o.wins}-${o.losses}</div>
                <div class="opponent-pct">${o.winPct}% · ${o.total} game${o.total !== 1 ? 's' : ''}</div>
            </div>
        `;
    }).join('');
}

function renderGameLog(games, filter) {
    const filtered = filterGames(games, filter);
    const el = document.getElementById('game-log-content');

    const grouped = {};
    for (const g of filtered) {
        if (!grouped[g.season]) grouped[g.season] = [];
        grouped[g.season].push(g);
    }

    const seasonOrder = Object.keys(grouped).sort().reverse();
    el.innerHTML = seasonOrder.map(season => {
        const gs = grouped[season].sort((a, b) => b.dateObj - a.dateObj);
        const seasonW = gs.filter(g => g.result === 'W').length;
        const seasonL = gs.filter(g => g.result === 'L').length;
        return `
            <div class="season-group">
                <div class="season-header">
                    <h3>${season} Season</h3>
                    <span class="season-badge">${seasonW}-${seasonL} (${gs.length} games)</span>
                </div>
                <div class="games-list">
                    ${gs.map(g => renderGameCard(g)).join('')}
                </div>
            </div>
        `;
    }).join('');

    initScrollAnimations();
}

function renderGameCard(g) {
    const idx = allGames.indexOf(g);
    const cls = g.result === 'W' ? 'win' : 'loss';
    const otLabel = g.overtime ? ' OT' : '';
    const tags = [];
    if (g.tags && g.tags.startsWith('playoffs')) {
        const roundMap = { 'playoffs-r1': 'Round 1', 'playoffs-r2': 'Round 2', 'playoffs-r3': 'Conf Finals', 'playoffs-r4': 'Finals' };
        tags.push(`<span class="game-tag playoffs">${roundMap[g.tags] || 'Playoffs'}</span>`);
    }
    if (g.tags === 'preseason') tags.push(`<span class="game-tag preseason">Preseason</span>`);
    if (g.tags === 'season-opener') tags.push(`<span class="game-tag opener">Season Opener</span>`);

    const notesList = g.notes ? g.notes.split(';').map(n => n.trim()).filter(Boolean) : [];
    const notesHtml = notesList.length ? `<div class="game-notes">${notesList.join(' · ')}</div>` : '';
    const companionHtml = g.companion ? `<div class="game-companion"><i class="fa-solid fa-user"></i> with ${g.companion}</div>` : `<div class="game-companion"><i class="fa-solid fa-user"></i> Solo</div>`;

    return `
        <div class="game-card ${cls} fade-in">
            <div class="game-date">${formatDate(g.dateObj)}</div>
            <div class="game-info">
                <div class="game-matchup">Celtics vs ${g.opponent}</div>
                ${companionHtml}
                ${tags.length ? `<div class="game-tags">${tags.join('')}</div>` : ''}
                ${notesHtml}
                <div class="game-actions">
                    <button class="game-action-btn edit-game-btn" onclick="openEditModal(${idx})"><i class="fa-solid fa-pen"></i> Edit</button>
                    <button class="game-action-btn delete-btn" onclick="openDeleteModal(${idx})"><i class="fa-solid fa-trash"></i> Delete</button>
                </div>
            </div>
            <div class="game-score-wrap">
                <div class="game-score ${g.result}">${g.celtics_score}-${g.opponent_score}${otLabel}</div>
                <div class="game-result-label ${g.result}">${g.result === 'W' ? 'WIN' : 'LOSS'}</div>
            </div>
        </div>
    `;
}

function filterGames(games, filter) {
    if (filter === 'all') return games;
    if (filter === 'regular') return games.filter(g => !g.tags || g.tags === 'season-opener');
    if (filter === 'playoffs') return games.filter(g => g.tags && g.tags.startsWith('playoffs'));
    if (filter === 'preseason') return games.filter(g => g.tags === 'preseason');
    return games;
}

/* ====== EDIT MODAL ====== */

function openEditModal(idx) {
    editingIndex = idx;
    const g = allGames[idx];
    const modal = document.getElementById('edit-modal');

    // Convert date to input format YYYY-MM-DD
    const yr = g.dateObj.getFullYear();
    const mo = String(g.dateObj.getMonth() + 1).padStart(2, '0');
    const da = String(g.dateObj.getDate()).padStart(2, '0');

    document.getElementById('ed-date').value = `${yr}-${mo}-${da}`;
    document.getElementById('ed-season').value = g.season;
    document.getElementById('ed-opponent').value = g.opponent;
    document.getElementById('ed-companion').value = g.companion || '';
    document.getElementById('ed-celtics-score').value = g.celtics_score;
    document.getElementById('ed-opp-score').value = g.opponent_score;
    document.getElementById('ed-overtime').value = g.overtime ? 'true' : 'false';
    document.getElementById('ed-tags').value = g.tags || '';
    document.getElementById('ed-notes').value = g.notes || '';

    document.getElementById('modal-title').textContent = `Edit: Celtics vs ${g.opponent}`;
    modal.classList.add('open');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('open');
    editingIndex = -1;
}

function saveEdit(e) {
    e.preventDefault();
    if (editingIndex < 0) return;

    const g = allGames[editingIndex];
    const dateVal = document.getElementById('ed-date').value;
    const d = new Date(dateVal + 'T00:00:00');
    const cScore = parseInt(document.getElementById('ed-celtics-score').value);
    const oScore = parseInt(document.getElementById('ed-opp-score').value);

    g.date = gameToCSVDate(d);
    g.dateObj = d;
    g.season = document.getElementById('ed-season').value;
    g.opponent = document.getElementById('ed-opponent').value;
    g.companion = document.getElementById('ed-companion').value;
    g.celtics_score = cScore;
    g.opponent_score = oScore;
    g.result = cScore > oScore ? 'W' : 'L';
    g.overtime = document.getElementById('ed-overtime').value === 'true';
    g.tags = document.getElementById('ed-tags').value;
    g.notes = document.getElementById('ed-notes').value;

    closeEditModal();
    hasChanges = true;
    refreshAll();
    showToast('Game updated ✓');
}

/* ====== DELETE ====== */

function openDeleteModal(idx) {
    deletingIndex = idx;
    const g = allGames[idx];
    document.getElementById('delete-msg').textContent = `Delete Celtics vs ${g.opponent} (${formatDate(g.dateObj)})?`;
    document.getElementById('delete-modal').classList.add('open');
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.remove('open');
    deletingIndex = -1;
}

function confirmDelete() {
    if (deletingIndex < 0) return;
    const g = allGames[deletingIndex];
    const label = `Celtics vs ${g.opponent}`;
    allGames.splice(deletingIndex, 1);
    closeDeleteModal();
    hasChanges = true;
    refreshAll();
    showToast(`${label} deleted`);
}

/* ====== ADD GAME (INLINE) ====== */

function addGame(e) {
    e.preventDefault();

    const dateVal = document.getElementById('fg-date').value;
    const d = new Date(dateVal + 'T00:00:00');
    const cScore = parseInt(document.getElementById('fg-celtics-score').value);
    const oScore = parseInt(document.getElementById('fg-opp-score').value);

    const game = {
        date: gameToCSVDate(d),
        dateObj: d,
        season: document.getElementById('fg-season').value,
        opponent: document.getElementById('fg-opponent').value,
        companion: document.getElementById('fg-companion').value,
        celtics_score: cScore,
        opponent_score: oScore,
        result: cScore > oScore ? 'W' : 'L',
        overtime: document.getElementById('fg-overtime').value === 'true',
        tags: document.getElementById('fg-tags').value,
        notes: document.getElementById('fg-notes').value,
    };

    allGames.push(game);
    hasChanges = true;
    refreshAll();
    showToast(`Game added: Celtics vs ${game.opponent} ✓`);
    document.getElementById('add-game-form').reset();
}

/* ====== EXPORT ====== */

function initExport() {
    document.getElementById('export-btn').addEventListener('click', () => {
        const outputWrap = document.getElementById('csv-output-wrap');
        const output = document.getElementById('csv-output');
        output.textContent = gamesToCSV();
        outputWrap.classList.remove('hidden');
    });

    document.getElementById('copy-btn').addEventListener('click', () => {
        const output = document.getElementById('csv-output');
        navigator.clipboard.writeText(output.textContent).then(() => {
            showToast('Copied to clipboard ✓');
        }).catch(() => {
            // Fallback for file:// protocol
            const textarea = document.createElement('textarea');
            textarea.value = output.textContent;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('Copied to clipboard ✓');
        });
    });
}

/* ====== FILTER BUTTONS ====== */

function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderGameLog(allGames, currentFilter);
        });
    });
}

/* ====== SCROLL ANIMATIONS ====== */

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in:not(.visible)').forEach(el => observer.observe(el));
}

/* ====== INIT ====== */

function init() {
    allGames = loadGames();
    refreshAll();
    initFilters();
    initExport();

    // Add game form
    document.getElementById('add-game-form').addEventListener('submit', addGame);

    // Edit modal
    document.getElementById('edit-game-form').addEventListener('submit', saveEdit);
    document.getElementById('modal-close').addEventListener('click', closeEditModal);
    document.getElementById('modal-cancel').addEventListener('click', closeEditModal);
    document.getElementById('edit-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('edit-modal')) closeEditModal();
    });

    // Delete modal
    document.getElementById('delete-confirm').addEventListener('click', confirmDelete);
    document.getElementById('delete-modal-close').addEventListener('click', closeDeleteModal);
    document.getElementById('delete-cancel').addEventListener('click', closeDeleteModal);
    document.getElementById('delete-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('delete-modal')) closeDeleteModal();
    });

    initScrollAnimations();
}

init();
