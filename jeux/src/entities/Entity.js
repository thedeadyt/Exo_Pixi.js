import * as PIXI from 'pixi.js';

export class Entity {
  constructor(app, texturePath, stats = {}) {
    this.app = app;
    this.texturePath = texturePath;
    this.sprite = null;

    this.health = stats.health ?? 100;
    this.maxHealth = stats.health ?? 100;
    this.shield = stats.shield ?? 0;
    this.maxShield = stats.shield ?? 0;
    this.atk = stats.atk ?? 10;
    this.maxAtk = stats.atk ?? 10;
    this.armor = stats.armor ?? 0;
    this.maxArmor = stats.armor ?? 0;
    this.speed = stats.speed ?? 3;
    this.maxSpeed = stats.speed ?? 3;
    this.hit = stats.hit ?? 0;
    this.maxHit = stats.hit ?? 0;
  }

  async load() {
    const texture = await PIXI.Assets.load(this.texturePath);
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.set(0.5);
  }

  setPosition(x, y) {
    if (this.sprite) {
      this.sprite.x = x;
      this.sprite.y = y;
    }
  }

  setScale(scale) {
    if (this.sprite) this.sprite.scale.set(scale);
  }

  takeDamage(amount) {
    const remainingShield = this.shield - amount;

    if (remainingShield >= 0) {
      this.shield = remainingShield;
    } else {
      this.shield = 0;
      this.health += remainingShield;
    }

    if (this.health < 0) this.health = 0;
  }

  attack(target) {
    if (!(target instanceof Entity)) return;
    target.takeDamage(this.atk);
    this.hit++;
  }
}
