import { Graphics, Sprite, Assets, Container } from "pixi.js";
import { TILE_SIZE } from "../utils/consts.js";
import { Entity } from "./entity.js";
import { startCombat } from "../utils/CombatManager.js";

export class Enemy extends Entity {
  constructor(app, enemyData, x, y) {
    const stats = {
      health: enemyData.hp || 1,
      shield: enemyData.armor || 0,
      atk: enemyData.attack || 1,
      armor: enemyData.armor || 0,
      speed: enemyData.speed || 1,
      hit: enemyData.hits || 1
    };

    super(app, null, stats);

    this.data = enemyData;
    this.x = x;
    this.y = y;
    this.isDead = false;

    this.sprite = new Container();
    this.sprite.x = x;
    this.sprite.y = y;

    this.loadSprite();
  }

  async loadSprite() {
    try {
      const spriteUrl = `https://mmi.alarmitou.fr/imgs/${this.data.meta_name}.png`;
      const texture = await Assets.load(spriteUrl);
      const sprite = new Sprite(texture);

      sprite.width = TILE_SIZE;
      sprite.height = TILE_SIZE;

      this.sprite.addChild(sprite);
    } catch (error) {
      console.error(`Failed to load sprite for ${this.data.name}:`, error);
      this.createFallbackSprite();
    }
  }

  createFallbackSprite() {
    const graphics = new Graphics();
    const color = this.data.type === "boss" ? 0x9C27B0 : 0xFF5252;

    graphics.rect(0, 0, TILE_SIZE, TILE_SIZE);
    graphics.fill(color);
    graphics.stroke({ width: 2, color: 0x000000 });

    this.sprite.addChild(graphics);
  }

  checkCollision(playerX, playerY) {
    if (this.isDead) return false;

    const sameX = Math.abs(playerX - this.x) < TILE_SIZE;
    const sameY = Math.abs(playerY - this.y) < TILE_SIZE;

    return sameX && sameY;
  }

  fight(player) {
    if (this.isDead) return;

    const result = startCombat(player, this);

    if (result.loser === this) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.sprite.visible = false;
  }

  update() {
  }
}
