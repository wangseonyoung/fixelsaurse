import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Scene (씬)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // 하늘색 배경

// 2. Camera (카메라)
const camera = new THREE.PerspectiveCamera(
    75, // 시야각 (Field of View)
    window.innerWidth / window.innerHeight, // 종횡비 (Aspect Ratio)
    0.1, // Near 클리핑 평면
    1000 // Far 클리핑 평면
);
camera.position.z = 5; // 카메라 초기 위치

// 3. Renderer (렌더러)
const canvas = document.getElementById('game-canvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // 고해상도 디스플레이 지원

// 4. 간단한 3D 객체 (큐브)
const geometry = new THREE.BoxGeometry(1, 1, 1); // 가로, 세로, 깊이
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // 초록색 재질
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 4.1. 3D 지형 (평면)
const planeGeometry = new THREE.PlaneGeometry(20, 20, 10, 10); // 너비, 높이, 너비 세그먼트, 높이 세그먼트
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x654321, // 갈색 (흙색)
    side: THREE.DoubleSide // 양면 렌더링 (필요에 따라)
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // X축으로 -90도 회전하여 바닥으로 만듦
plane.position.y = -1; // 큐브보다 약간 아래에 위치
scene.add(plane);

// 4.2. 3D 자원 표현 (기본)
// 나무 (원기둥)
const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // 나무색
const treeTrunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8); // 반지름 상단, 반지름 하단, 높이, 분할 수
const treeTrunk1 = new THREE.Mesh(treeTrunkGeometry, woodMaterial);
treeTrunk1.position.set(-3, 0, -3); // (x, y, z) - y는 (높이/2) - plane.position.y
scene.add(treeTrunk1);

const treeTrunk2 = new THREE.Mesh(treeTrunkGeometry, woodMaterial);
treeTrunk2.position.set(4, 0, -2);
scene.add(treeTrunk2);

// 나뭇잎 (구) - 간단하게 표현
const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // 풀색
const leavesGeometry = new THREE.SphereGeometry(1, 8, 6); // 반지름, 너비 분할, 높이 분할

const leaves1 = new THREE.Mesh(leavesGeometry, leavesMaterial);
leaves1.position.set(-3, 1.5, -3); // 줄기 위에 위치
scene.add(leaves1);

const leaves2 = new THREE.Mesh(leavesGeometry, leavesMaterial);
leaves2.position.set(4, 1.5, -2);
scene.add(leaves2);


// 돌 (다면체 - Icosahedron 또는 Box 변형)
const stoneMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // 회색
const stoneGeometry = new THREE.IcosahedronGeometry(0.5, 0); // 반지름, 디테일 단계

const stone1 = new THREE.Mesh(stoneGeometry, stoneMaterial);
stone1.position.set(2, -0.5, 2); // y는 (반지름) - plane.position.y
scene.add(stone1);

const stone2 = new THREE.Mesh(stoneGeometry, stoneMaterial);
stone2.position.set(-2, -0.5, 3);
scene.add(stone2);

const stone3 = new THREE.Mesh(stoneGeometry, stoneMaterial);
stone3.scale.set(0.7, 1.2, 0.8); // 크기 변형
stone3.rotation.set(Math.random(), Math.random(), Math.random()); // 회전 변형
stone3.position.set(0, -0.5, 4);
scene.add(stone3);


// 5. 조명 (Lights)
// 주변광 (Ambient Light) - 전체적으로 은은하게 빛을 제공
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 색상, 강도
scene.add(ambientLight);

// 직사광 (Directional Light) - 태양광처럼 특정 방향으로 빛을 제공
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1); // 빛의 방향 (x, y, z)
scene.add(directionalLight);

// 6. 카메라 컨트롤 (OrbitControls)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 부드러운 감속 효과
controls.dampingFactor = 0.05;
// controls.minDistance = 2; // 최소 줌 거리
// controls.maxDistance = 10; // 최대 줌 거리
// controls.maxPolarAngle = Math.PI / 2 - 0.05; // 수직 최대 각도 (바닥 아래로 못가게)

// 창 크기 변경 시 카메라 및 렌더러 업데이트
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 애니메이션 루프
function animate() {
    requestAnimationFrame(animate); // 다음 프레임에 animate 함수 재호출

    // 큐브 회전 (애니메이션 예시)
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    controls.update(); // 카메라 컨트롤 업데이트 (Damping 사용 시 필수)
    renderer.render(scene, camera); // 씬과 카메라를 사용해 렌더링
}

// 게임 자원 변수
let resources = {
    wood: 10,
    stone: 5,
    food: 20
};

// UI 업데이트 함수
function updateUI() {
    document.getElementById('wood').textContent = resources.wood;
    document.getElementById('stone').textContent = resources.stone;
    document.getElementById('food').textContent = resources.food;
}

// 초기화 함수
function init() {
    updateUI(); // 초기 자원 표시
    animate(); // 애니메이션 시작
}

init();
