import { Application, Container } from "pixi.js";
import { fetchMapData, fetchObjectData, fetchEnemiesData, fetchClassesData, fetchTreasuresData } from "./utils/api.js";
import { createMap } from "./world/map.js";
import { Player } from "./entities/Player.js";
import { getCenterRoadPosition } from "./utils/spawn.js";
import { InputManager } from "./utils/InputManager.js";
import { TILE_SIZE, getObjectCountForMapSize } from "./utils/consts.js";
import { UIManager } from "./ui/UIManager.js";
import { InventoryUI } from "./ui/InventoryUI.js";
import { TreasureUI } from "./ui/TreasureUI.js";
import { spawnObjects } from "./factory/objectSpawner.js";
import { spawnEnemies, spawnBoss } from "./factory/enemySpawner.js";
import { spawnClasses } from "./factory/classSpawner.js";
import { spawnTreasures } from "./factory/treasureSpawner.js";

(async () => {
    const app = new Application();
    await app.init({ background: "#1099bb", resizeTo: window });
    document.body.appendChild(app.canvas);

    const gameContainer = new Container();
    app.stage.addChild(gameContainer);

    const grid = await fetchMapData();
    console.table(grid);

    const mapContainer = createMap(grid);
    gameContainer.addChild(mapContainer);

    const objectsData = await fetchObjectData();
    const enemiesData = await fetchEnemiesData();
    const classesDataForPlayer = await fetchClassesData();

    const warriorClass = classesDataForPlayer.find(c =>
        c.name.toLowerCase().includes('warrior') || c.name.toLowerCase().includes('guerrier')
    );

    const spawnPos = getCenterRoadPosition(grid);
    const player = new Player(app, warriorClass);
    player.setPosition(spawnPos.x, spawnPos.y);
    gameContainer.addChild(player.sprite);

    const objectCount = getObjectCountForMapSize(grid);
    const gameObjects = spawnObjects(grid, objectsData, objectCount.items, objectCount.weapons, objectCount.jewelry, spawnPos);
    gameObjects.forEach(obj => gameContainer.addChild(obj.sprite));

    const totalTiles = grid.length * grid[0].length;
    const enemyCount = Math.max(3, Math.floor(totalTiles / 50));
    const { enemies, bossData } = spawnEnemies(app, grid, enemiesData, enemyCount, spawnPos);
    enemies.forEach(enemy => gameContainer.addChild(enemy.sprite));

    const classOrbs = spawnClasses(grid, classesDataForPlayer, spawnPos);
    classOrbs.forEach(orb => gameContainer.addChild(orb.sprite));

    const treasureCount = Math.max(5, Math.floor(totalTiles / 100));
    const treasuresData = await fetchTreasuresData(treasureCount);
    const treasures = spawnTreasures(grid, treasuresData, spawnPos);
    treasures.forEach(treasure => gameContainer.addChild(treasure.sprite));

    let currentBoss = null;
    const uiManager = new UIManager(app, player);
    const inventoryUI = new InventoryUI(app, player);
    let treasureUI = null;
    let isChoosingTreasure = false;

    const updateCamera = () => {
        gameContainer.x = Math.floor(app.screen.width / 2 - player.sprite.x);
        gameContainer.y = Math.floor(app.screen.height / 2 - player.sprite.y);
    };
    updateCamera();

    const input = new InputManager();
    let killedEnemiesCount = 0;
    const BOSS_SPAWN_THRESHOLD = 10;

    const isRoad = (x, y) => {
        const col = Math.floor(x / TILE_SIZE);
        const row = Math.floor(y / TILE_SIZE);
        if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) return false;
        return grid[row][col] === 1;
    };

    let moveDelay = 0;
    const MOVE_COOLDOWN = 35;
    const speed = 1;

    const handlePlayerMovement = () => {
        let dx = 0;
        let dy = 0;

        if (input.isDown("arrowup") || input.isDown("z")) dy -= speed;
        if (input.isDown("arrowdown") || input.isDown("s")) dy += speed;
        if (input.isDown("arrowleft") || input.isDown("q")) dx -= speed;
        if (input.isDown("arrowright") || input.isDown("d")) dx += speed;

        if (dx === 0 && dy === 0) return false;

        const newX = player.sprite.x + dx * TILE_SIZE;
        const newY = player.sprite.y + dy * TILE_SIZE;

        let moved = false;
        if (isRoad(newX, player.sprite.y)) {
            player.sprite.x = newX;
            moved = true;
        }
        if (isRoad(player.sprite.x, newY)) {
            player.sprite.y = newY;
            moved = true;
        }

        return moved;
    };

    const handleObjectCollisions = () => {
        gameObjects.forEach(obj => {
            if (obj.checkCollision(player.sprite.x, player.sprite.y)) {
                obj.applyEffect(player);
                inventoryUI.update();
            }
        });
    };

    const handleClassOrbCollisions = () => {
        classOrbs.forEach(orb => {
            if (orb.checkCollision(player.sprite.x, player.sprite.y)) {
                orb.applyEffect(player);
                inventoryUI.update();
            }
        });
    };

    const handleTreasureCollisions = () => {
        treasures.forEach(treasure => {
            if (treasure.checkCollision(player.sprite.x, player.sprite.y) && !isChoosingTreasure) {
                treasure.open();
                isChoosingTreasure = true;

                treasureUI = new TreasureUI(app, player, () => {
                    isChoosingTreasure = false;
                    inventoryUI.update();
                });

                treasureUI.show(treasure.getItems());
            }
        });
    };

    const handleEnemyCollisions = () => {
        enemies.forEach(enemy => {
            if (enemy.checkCollision(player.sprite.x, player.sprite.y)) {
                enemy.fight(player);
                if (enemy.isDead) {
                    killedEnemiesCount++;
                }
            }
        });

        if (currentBoss && currentBoss.checkCollision(player.sprite.x, player.sprite.y)) {
            currentBoss.fight(player);
            if (currentBoss.isDead) {
                currentBoss = null;
            }
        }
    };

    const spawnBossIfNeeded = () => {
        if (!currentBoss && killedEnemiesCount > 0 && killedEnemiesCount % BOSS_SPAWN_THRESHOLD === 0) {
            const currentPlayerPos = { x: player.sprite.x, y: player.sprite.y };
            currentBoss = spawnBoss(app, grid, bossData, currentPlayerPos);
            if (currentBoss) {
                gameContainer.addChild(currentBoss.sprite);
                killedEnemiesCount++;
            }
        }
    };

    app.ticker.add(() => {
        if (isChoosingTreasure) {
            uiManager.update();
            return;
        }

        if (moveDelay > 0) {
            moveDelay--;
            updateCamera();
            uiManager.update();
            return;
        }

        const moved = handlePlayerMovement();

        if (moved) {
            moveDelay = MOVE_COOLDOWN;
            handleObjectCollisions();
            handleClassOrbCollisions();
            handleTreasureCollisions();
            handleEnemyCollisions();
        }

        spawnBossIfNeeded();
        updateCamera();
        uiManager.update();
        inventoryUI.update();
    });
})();
