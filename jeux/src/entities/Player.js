import * as PIXI from 'pixi.js';
import { Entity } from '../entities/entity.js';
import { TILE_SIZE } from '../utils/consts.js';

export class Player extends Entity {
  constructor(app) {
    // Définir les stats
    const stats = {
      health: 150,
      shield: 25,
      atk: 20,
      speed: 1,
      hit: 1,
    };

    // Appeler le constructeur parent
    super(app, null, stats);

    // Stocker les stats dans l'instance pour pouvoir les utiliser
    this.stats = stats;

    // Initialiser le sprite
    this.init();
  }

  init() {
    const graphics = new PIXI.Graphics();

    graphics.beginFill(0x00aaff); // bleu
    graphics.drawRect(-TILE_SIZE / 2, -TILE_SIZE / 2, TILE_SIZE, TILE_SIZE); // centré
    graphics.endFill();

    this.sprite = graphics;
  }
}
