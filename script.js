// DOM 요소 가져오기
const woodAmountEl = document.getElementById('wood-amount');
const stoneAmountEl = document.getElementById('stone-amount');
const foodAmountEl = document.getElementById('food-amount');
const populationAmountEl = document.getElementById('population-amount');
const civilizationStatusEl = document.getElementById('civilization-status');
const gameMapEl = document.getElementById('game-map');
const gatherWoodBtn = document.getElementById('gather-wood-btn');
const gatherStoneBtn = document.getElementById('gather-stone-btn');
const huntFoodBtn = document.getElementById('hunt-food-btn');
const buildHutBtn = document.getElementById('build-hut-btn');

// 게임 상태 변수
let resources = {
    wood: 0,
    stone: 0,
    food: 10, // 초기 식량
};

let gameState = {
    population: 1,
    maxPopulation: 1, // 움집 등으로 증가
    civilization: '석기 시대',
    map: [], // 2D 배열로 맵 데이터 저장
    tileSize: 40, // 픽셀 단위
    mapSize: { rows: 10, cols: 10 }, // 맵 크기 (예: 10x10)
    tileTypes: { // 타일 종류 정의
        GRASS: 'grass',
        FOREST: 'forest', // 나무 자원
        ROCK: 'rock',   // 돌 자원
        WATER: 'water'  // 물 (이동 불가 또는 다른 기능)
    }
};

// 게임 초기화 함수
function initGame() {
    console.log("게임 초기화 시작");
    updateResourceDisplay();
    updateCivilizationStatus();
    updatePopulationDisplay();
    generateMap();
    setupEventListeners();
    checkBuildableButtons(); // 초기 버튼 상태 업데이트
    console.log("게임 초기화 완료");
}

// 자원 표시 업데이트 함수
function updateResourceDisplay() {
    woodAmountEl.textContent = resources.wood;
    stoneAmountEl.textContent = resources.stone;
    foodAmountEl.textContent = resources.food;
}

// 인구 표시 업데이트 함수
function updatePopulationDisplay() {
    populationAmountEl.textContent = `${gameState.population}/${gameState.maxPopulation}`;
}

// 문명 상태 표시 업데이트 함수
function updateCivilizationStatus() {
    civilizationStatusEl.textContent = gameState.civilization;
}

// 맵 생성 함수 (다음 단계에서 구체화)
function generateMap() {
    console.log("맵 생성 중...");
    gameMapEl.innerHTML = ''; // 기존 맵 초기화
    gameMapEl.style.gridTemplateColumns = `repeat(${gameState.mapSize.cols}, ${gameState.tileSize}px)`;
    gameMapEl.style.gridTemplateRows = `repeat(${gameState.mapSize.rows}, ${gameState.tileSize}px)`;
    gameMapEl.style.width = `${gameState.mapSize.cols * gameState.tileSize}px`;
    gameMapEl.style.height = `${gameState.mapSize.rows * gameState.tileSize}px`;

    for (let r = 0; r < gameState.mapSize.rows; r++) {
        gameState.map[r] = [];
        for (let c = 0; c < gameState.mapSize.cols; c++) {
            const tileEl = document.createElement('div');
            tileEl.classList.add('map-tile');

            // 맵 데이터 생성 (기본은 풀)
            let tileType = gameState.tileTypes.GRASS;
            let resourceType = null;

            // 무작위로 자원 배치 (예시)
            const rand = Math.random();
            if (rand < 0.15) { // 15% 확률로 숲
                tileType = gameState.tileTypes.FOREST;
                resourceType = 'wood';
            } else if (rand < 0.25) { // 10% 확률로 돌 (숲 이후)
                tileType = gameState.tileTypes.ROCK;
                resourceType = 'stone';
            } else if (rand < 0.30) { // 5% 확률로 물 (돌 이후)
                tileType = gameState.tileTypes.WATER;
            }

            gameState.map[r][c] = {
                type: tileType,
                resource: resourceType,
                row: r,
                col: c
            };

            tileEl.classList.add(tileType); // 타일 유형에 따른 클래스 추가 (CSS 스타일링용)
            // tileEl.textContent = `${r},${c}`; // 좌표 표시 (디버깅용)
            if (resourceType === 'wood') {
                tileEl.textContent = '🌳'; // 나무 아이콘 (임시)
            } else if (resourceType === 'stone') {
                tileEl.textContent = '⛰️'; // 돌 아이콘 (임시)
            } else if (tileType === gameState.tileTypes.WATER) {
                tileEl.textContent = '💧'; // 물 아이콘 (임시)
            }


            tileEl.dataset.row = r;
            tileEl.dataset.col = c;
            gameMapEl.appendChild(tileEl);
        }
    }
    console.log("맵 생성 완료", gameState.map);
}

// 이벤트 리스너 설정 함수
function setupEventListeners() {
    gatherWoodBtn.addEventListener('click', gatherWood);
    gatherStoneBtn.addEventListener('click', gatherStone);
    huntFoodBtn.addEventListener('click', huntFood);
    buildHutBtn.addEventListener('click', buildHut);

    // 맵 타일 클릭 이벤트 (다음 단계에서 구체화)
    gameMapEl.addEventListener('click', (event) => {
        if (event.target.classList.contains('map-tile')) {
            const row = event.target.dataset.row;
            const col = event.target.dataset.col;
            handleTileClick(parseInt(row), parseInt(col));
        }
    });
}

// 자원 채집 함수들
function gatherWood() {
    resources.wood += gameState.population; // 인구만큼 채집
    console.log(`나무 채집: +${gameState.population}, 현재 나무: ${resources.wood}`);
    updateResourceDisplay();
    checkBuildableButtons();
}

function gatherStone() {
    resources.stone += gameState.population; // 인구만큼 채집
    console.log(`돌 채집: +${gameState.population}, 현재 돌: ${resources.stone}`);
    updateResourceDisplay();
    checkBuildableButtons();
}

function huntFood() {
    resources.food += gameState.population * 2; // 인구 * 2 만큼 식량 획득
    console.log(`식량 사냥: +${gameState.population * 2}, 현재 식량: ${resources.food}`);
    updateResourceDisplay();
}

// 건물 건설 함수
function buildHut() {
    const hutCost = { wood: 10 };
    if (resources.wood >= hutCost.wood) {
        resources.wood -= hutCost.wood;
        gameState.maxPopulation += 2; // 움집 하나당 최대 인구 2 증가
        console.log(`움집 건설 완료! 최대 인구 증가: ${gameState.maxPopulation}`);
        updateResourceDisplay();
        updatePopulationDisplay();
        checkBuildableButtons();
    } else {
        console.log("움집 건설에 필요한 나무가 부족합니다.");
        // 사용자에게 알림 (예: alert 또는 메시지 표시)
    }
}

// 건설 가능한 버튼 상태 업데이트
function checkBuildableButtons() {
    buildHutBtn.disabled = resources.wood < 10;
    // 추후 다른 건설 버튼들도 여기에 추가
}

// 맵 타일 클릭 처리 함수
function handleTileClick(row, col) {
    if (row >= 0 && row < gameState.mapSize.rows && col >= 0 && col < gameState.mapSize.cols) {
        const tileData = gameState.map[row][col];
        console.log(`타일 클릭: (${row}, ${col})`, tileData);

        // 여기에 타일 클릭 시 동작 추가 (예: 정보 표시, 자원 채집 등)
        // 예시: 클릭한 타일이 숲이면 나무 채집 버튼 활성화 고려 (또는 직접 채집)
        if (tileData.resource === 'wood') {
            console.log("이곳에서 나무를 채집할 수 있습니다.");
            // gatherWoodBtn.disabled = false; // 또는 특정 타겟 지정 방식 필요
        } else if (tileData.resource === 'stone') {
            console.log("이곳에서 돌을 채집할 수 있습니다.");
            // gatherStoneBtn.disabled = false; // 또는 특정 타겟 지정 방식 필요
        } else if (tileData.type === gameState.tileTypes.WATER) {
            console.log("물 타일입니다. 현재 특별한 액션 없음.");
        } else {
            console.log("일반 풀밭 타일입니다.");
        }
    } else {
        console.error("클릭된 타일 좌표가 유효하지 않습니다.", row, col);
    }
}


// 게임 루프 (선택적, 실시간 업데이트가 필요할 경우)
// function gameLoop() {
//     // 매 프레임 또는 주기적으로 실행될 로직
//     // 예: 식량 소비, 이벤트 발생 등
//     requestAnimationFrame(gameLoop);
// }

// DOM이 완전히 로드된 후 게임 초기화
document.addEventListener('DOMContentLoaded', initGame);
// initGame(); // DOMContentLoaded 이벤트가 더 안정적입니다.
