import { Graphics, Container } from "pixi.js";
import { TILE_SIZE } from "../utils/consts.js";

export class ClassOrb {
  constructor(classData, x, y) {
    this.data = classData;
    this.x = x;
    this.y = y;
    this.collected = false;

    this.sprite = new Container();
    this.sprite.x = x;
    this.sprite.y = y;

    this.createColoredSprite();
  }

  createColoredSprite() {
    const graphics = new Graphics();

    let color;
    const className = this.data.name?.toLowerCase() || '';

    if (className.includes('warrior') || className.includes('guerrier')) {
      color = 0xFF0000;
    } else if (className.includes('rogue') || className.includes('voleur')) {
      color = 0x9C27B0;
    } else if (className.includes('mage') || className.includes('magicien')) {
      color = 0x2196F3;
    } else if (className.includes('warden') || className.includes('gardien')) {
      color = 0x4CAF50;
    } else if (className.includes('barbarian') || className.includes('barbare')) {
      color = 0xFF5722;
    } else {
      color = 0xFF00FF;
    }

    graphics.rect(0, 0, TILE_SIZE, TILE_SIZE);
    graphics.fill(color);
    graphics.stroke({ width: 3, color: 0xFFFFFF });

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
    player.changeClass(this.data);
    console.log(`Class changed: ${this.data.name}`, this.data);
  }
}
