import { Application, Container } from "pixi.js";
import { fetchMapData } from "./utils/api.js";
import { createMap } from "./world/map.js";

(async () => {
    // Initialisation de l'application PixiJS
    const app = new Application();
    await app.init({ background: '#1099bb', resizeTo: window });
    document.body.appendChild(app.canvas);

    // Création du conteneur principal du jeu
    const gameContainer = new Container();
    app.stage.addChild(gameContainer);

    // Récupération des données de la map depuis l'API
    const grid = await fetchMapData();
    console.log('Map data loaded successfully');

    // Création et ajout de la map au conteneur de jeu
    const mapContainer = createMap(grid);
    gameContainer.addChild(mapContainer);
})();
