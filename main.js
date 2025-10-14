import { Application, Container, Graphics, GraphicsContext } from "pixi.js";
import axios from "axios";

(async () => {
    const app = new Application();

    await app.init({ background: '#1099bb', resizeTo: window });

    document.body.appendChild(app.canvas);

    const gameContainer = new Container();
    app.stage.addChild(gameContainer);
    const mapContainer = new Container();
    const response = await axios.get("https://mmi.alarmitou.fr/api/map");
    const grid = response.data;
    const roadTile = new GraphicsContext().rect(50, 50, 50, 50).fill("Brown");
    const forestTile = new GraphicsContext().rect(50, 50, 50, 50).fill("Green");

    for(let y = 0; y < grid.length; y++){
        for(let x = 0; x < grid[y].length; x++){
            const tileGraphicsContext = grid[y][x] == 0 ? forestTile : roadTile;
            const tile = new Graphics(tileGraphicsContext);
            tile.x = x * 50;
            tile.y = y * 50;
            mapContainer.addChild(tile);
        }
    }

    gameContainer.addChild(mapContainer);
})();
