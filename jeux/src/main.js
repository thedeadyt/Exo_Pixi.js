import { Application, Container } from "pixi.js";
import { fetchMapData } from "./utils/api.js";
import { createMap } from "./world/map.js";
import { Player } from "./entities/Player.js";
import { getCenterRoadPosition } from "./utils/spawn.js";
import { InputManager } from "./utils/InputManager.js";
import { TILE_SIZE, TILE_TYPES } from "./utils/consts.js";
import { UIManager } from "./utils/UIManager.js";


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

    // 🎯 Spawn du joueur sur la ROAD la plus proche du centre
    const spawnPos = getCenterRoadPosition(grid);
    console.log("Spawn position (pixels):", spawnPos);

    const player = new Player(app);
    player.setPosition(spawnPos.x, spawnPos.y);
    gameContainer.addChild(player.sprite);

    const uiManager = new UIManager(app, player);

    // 🧭 Centrer la caméra sur le joueur
    gameContainer.x = app.screen.width / 2 - player.sprite.x;
    gameContainer.y = app.screen.height / 2 - player.sprite.y;

    // 🎮 Gestion des entrées clavier
    const input = new InputManager();

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

        // Décrémenter le délai
        if (moveDelay > 0) {
            moveDelay--;
            // Centrer la caméra même pendant le cooldown
            gameContainer.x = app.screen.width / 2 - player.sprite.x;
            gameContainer.y = app.screen.height / 2 - player.sprite.y;
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
            }
        }

        // 🔹 Centrer la caméra sur le joueur
        gameContainer.x = app.screen.width / 2 - player.sprite.x;
        gameContainer.y = app.screen.height / 2 - player.sprite.y;
        uiManager.update();
    });
})();
