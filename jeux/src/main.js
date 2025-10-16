import { Application, Container } from "pixi.js";
import { fetchMapData, fetchObjectData, fetchEnemiesData, fetchClassesData, fetchTreasuresData } from "./utils/api.js";
import { createMap } from "./world/map.js";
import { Player } from "./entities/Player.js";
import { getCenterRoadPosition } from "./utils/spawn.js";
import { InputManager } from "./utils/InputManager.js";
import { TILE_SIZE, TILE_TYPES, getObjectCountForMapSize } from "./utils/consts.js";
import { UIManager } from "./ui/UIManager.js";
import { InventoryUI } from "./ui/InventoryUI.js";
import { TreasureUI } from "./ui/TreasureUI.js";
import { spawnObjects } from "./factory/objectSpawner.js";
import { spawnEnemies, spawnBoss } from "./factory/enemySpawner.js";
import { spawnClasses } from "./factory/classSpawner.js";
import { spawnTreasures } from "./factory/treasureSpawner.js";


(async () => {
    // 🌟 Initialisation PIXI
    const app = new Application();
    await app.init({ background: "#1099bb", resizeTo: window });
    document.body.appendChild(app.canvas);

    // 🗂 Conteneur principal du jeu
    const gameContainer = new Container();
    app.stage.addChild(gameContainer);

    // 🗺 Charger et afficher la map
    const grid = await fetchMapData();
    console.table(grid); // debug visuel

    const mapContainer = createMap(grid);
    gameContainer.addChild(mapContainer);

    // 🎁 Charger les objets depuis l'API
    const objectsData = await fetchObjectData();
    console.log(`📦 ${objectsData.length} objets chargés depuis l'API`);

    // 👹 Charger les ennemis depuis l'API
    const enemiesData = await fetchEnemiesData();
    console.log(`👹 ${enemiesData.length} ennemis chargés depuis l'API`);


    // �🎯 Spawn du joueur sur la ROAD la plus proche du centre
    // 🎭 Charger les classes depuis l'API pour initialiser le joueur
    const classesDataForPlayer = await fetchClassesData();
    const warriorClass = classesDataForPlayer.find(c => c.name.toLowerCase().includes('warrior') || c.name.toLowerCase().includes('guerrier'));

    const spawnPos = getCenterRoadPosition(grid);
    console.log("Spawn position (pixels):", spawnPos);

    const player = new Player(app, warriorClass);
    player.setPosition(spawnPos.x, spawnPos.y);
    gameContainer.addChild(player.sprite);

    // 🎁 Calculer le nombre d'objets en fonction de la taille de la map
    const objectCount = getObjectCountForMapSize(grid);
    console.log(`🎲 Objets à spawner:`, objectCount);

    // 🎁 Générer les objets sur la map (en évitant la position du joueur)
    const gameObjects = spawnObjects(grid, objectsData, objectCount.items, objectCount.weapons, objectCount.jewelry, spawnPos);
    gameObjects.forEach(obj => {
        gameContainer.addChild(obj.sprite);
    });

    // 👹 Spawner les ennemis basiques (environ 1 ennemi pour 50 tiles, en évitant la position du joueur)
    const totalTiles = grid.length * grid[0].length;
    const enemyCount = Math.max(3, Math.floor(totalTiles / 50));
    const { enemies, bossData } = spawnEnemies(app, grid, enemiesData, enemyCount, spawnPos);
    enemies.forEach(enemy => {
        gameContainer.addChild(enemy.sprite);
    });

    // 🎭 Spawner les orbes de classe (un pour chaque classe disponible)
    const classesData = await fetchClassesData();
    const classOrbs = spawnClasses(grid, classesData, spawnPos);
    classOrbs.forEach(orb => {
        gameContainer.addChild(orb.sprite);
    });

    // 💎 Charger et spawner les coffres de trésor
    const treasureCount = Math.max(5, Math.floor(totalTiles / 100)); // ~25 coffres pour map 50x50
    const treasuresData = await fetchTreasuresData(treasureCount);
    console.log(`💎 ${treasuresData.length} coffres de trésor chargés depuis l'API`);
    const treasures = spawnTreasures(grid, treasuresData, spawnPos);
    treasures.forEach(treasure => {
        gameContainer.addChild(treasure.sprite);
    });

    // 🔥 Variable pour gérer le boss
    let currentBoss = null;
    let bossSpawned = false;

    const uiManager = new UIManager(app, player);
    const inventoryUI = new InventoryUI(app, player);

    // 💎 UI pour le choix d'objets dans les coffres
    let treasureUI = null;
    let isChoosingTreasure = false;

    // 🧭 Centrer la caméra sur le joueur au démarrage
    function updateCamera() {
        // Centre le joueur exactement au milieu de l'écran
        gameContainer.x = Math.floor(app.screen.width / 2 - player.sprite.x);
        gameContainer.y = Math.floor(app.screen.height / 2 - player.sprite.y);
    }
    updateCamera(); // Position initiale

    // 🎮 Gestion des entrées clavier
    const input = new InputManager();

    // Variables pour gérer le compteur d'ennemis tués
    let killedEnemiesCount = 0;
    const BOSS_SPAWN_THRESHOLD = 10; // Nombre d'ennemis à tuer pour faire apparaître un boss

    // 🛡 Fonction pour vérifier si la position est sur une ROAD
    function isRoad(x, y) {
        const col = Math.floor(x / TILE_SIZE);
        const row = Math.floor(y / TILE_SIZE);

        if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) return false;
        return grid[row][col] === 1;
    }

    // ⏱ Système de délai pour le déplacement
    let moveDelay = 0;
    const MOVE_COOLDOWN = 35; // frames entre chaque déplacement

    // 🏃 Boucle du jeu
    app.ticker.add(() => {
        const speed = 1;

        // Si l'UI de trésor est ouverte, bloquer les mouvements
        if (isChoosingTreasure) {
            uiManager.update();
            return;
        }

        // Décrémenter le délai
        if (moveDelay > 0) {
            moveDelay--;
            // Mettre à jour la caméra même pendant le cooldown
            updateCamera();
            uiManager.update();
            return;
        }

        let dx = 0;
        let dy = 0;

        // Déplacement avec flèches ou ZQSD
        if (input.isDown("arrowup") || input.isDown("z")) dy -= speed;
        if (input.isDown("arrowdown") || input.isDown("s")) dy += speed;
        if (input.isDown("arrowleft") || input.isDown("q")) dx -= speed;
        if (input.isDown("arrowright") || input.isDown("d")) dx += speed;

        // Si un mouvement est détecté
        if (dx !== 0 || dy !== 0) {
            // 🔹 Vérifier collisions avec les tiles (déplacer uniquement sur ROAD)
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

            // Activer le cooldown seulement si le joueur s'est déplacé
            if (moved) {
                moveDelay = MOVE_COOLDOWN;

                // 🎁 Vérifier les collisions avec les objets
                gameObjects.forEach(obj => {
                    if (obj.checkCollision(player.sprite.x, player.sprite.y)) {
                        obj.applyEffect(player);
                        inventoryUI.update(); // Mettre à jour l'inventaire
                    }
                });

                // 🎭 Vérifier les collisions avec les orbes de classe
                classOrbs.forEach(orb => {
                    if (orb.checkCollision(player.sprite.x, player.sprite.y)) {
                        orb.applyEffect(player);
                        inventoryUI.update(); // Mettre à jour l'inventaire après changement de classe
                    }
                });

                // 💎 Vérifier si le joueur est sur un coffre et l'ouvrir automatiquement
                treasures.forEach(treasure => {
                    if (treasure.checkCollision(player.sprite.x, player.sprite.y) && !isChoosingTreasure) {
                        console.log(`💎 Coffre ouvert automatiquement ! Choix de 3 objets...`);

                        // Marquer le coffre comme ouvert
                        treasure.open();

                        // Bloquer les mouvements et afficher l'UI
                        isChoosingTreasure = true;

                        // Créer l'UI du trésor
                        treasureUI = new TreasureUI(app, player, () => {
                            // Callback quand l'UI se ferme
                            isChoosingTreasure = false;
                            inventoryUI.update(); // Mettre à jour l'inventaire
                        });

                        // Afficher les 3 objets
                        treasureUI.show(treasure.getItems());
                    }
                });

                // 👹 Vérifier les collisions avec les ennemis (combat automatique)
                enemies.forEach(enemy => {
                    if (enemy.checkCollision(player.sprite.x, player.sprite.y)) {
                        enemy.fight(player);
                        // Incrémenter le compteur si l'ennemi est mort après le combat
                        if (enemy.isDead) {
                            killedEnemiesCount++;
                            console.log(`☠️ Ennemis tués: ${killedEnemiesCount}`);
                        }
                    }
                });

                // 🔥 Vérifier collision avec le boss (combat automatique)
                if (currentBoss && currentBoss.checkCollision(player.sprite.x, player.sprite.y)) {
                    currentBoss.fight(player);
                    if (currentBoss.isDead) {
                        console.log("🎉 BOSS VAINCU !");
                        bossSpawned = false; // Permettre l'apparition d'un nouveau boss
                        currentBoss = null;
                    }
                }
            }
        }

        // 🔥 Vérifier si on doit spawner un boss (tous les 10 ennemis tués)
        if (!currentBoss && killedEnemiesCount > 0 && killedEnemiesCount % BOSS_SPAWN_THRESHOLD === 0) {
            console.log(`🔥 ${BOSS_SPAWN_THRESHOLD} ennemis ont été vaincus ! Un boss apparaît...`);
            // Utiliser la position actuelle du joueur pour faire apparaître le boss à proximité
            const currentPlayerPos = { x: player.sprite.x, y: player.sprite.y };
            currentBoss = spawnBoss(app, grid, bossData, currentPlayerPos);
            if (currentBoss) {
                gameContainer.addChild(currentBoss.sprite);
                killedEnemiesCount++; // Éviter de déclencher plusieurs fois le spawn
            }
        }

        // 🔹 Mettre à jour la position de la caméra
        updateCamera();
        
        // 🔄 Mettre à jour les UI
        uiManager.update();
        inventoryUI.update();
    });
})();
