import { Graphics, Sprite, Assets, Container } from "pixi.js";
import { TILE_SIZE } from "../utils/consts.js";

export class GameObject {
  constructor(objectData, x, y) {
    this.data = objectData;
    this.x = x;
    this.y = y;
    this.collected = false;

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

    let color;
    switch (this.data.type) {
      case "item":
        color = 0x4CAF50;
        break;
      case "weapon":
        color = 0xF44336;
        break;
      case "jewelry":
        color = 0xFFEB3B;
        break;
      default:
        color = 0x9E9E9E;
    }

    graphics.rect(0, 0, TILE_SIZE, TILE_SIZE);
    graphics.fill(color);
    graphics.stroke({ width: 2, color: 0xffffff });

    this.sprite.addChild(graphics);
  }

  checkCollision(playerX, playerY) {
    if (this.collected) return false;

    const sameX = Math.abs(playerX - this.x) < TILE_SIZE;
    const sameY = Math.abs(playerY - this.y) < TILE_SIZE;

    if (sameX && sameY) {
      this.collect();
      return true;
    }
    return false;
  }

  collect() {
    this.collected = true;
    this.sprite.visible = false;
  }

  applyEffect(player) {
    const replaced = player.equipItem(this);

    console.log(`Equipped: ${this.data.name}`, this.data);
    if (replaced) {
      console.log(`Replaced: ${replaced.data.name}`);
    }
  }
}
