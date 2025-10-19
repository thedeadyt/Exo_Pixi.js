import * as PIXI from 'pixi.js';
import { Entity } from '../entities/entity.js';
import { TILE_SIZE } from '../utils/consts.js';

export class Player extends Entity {
  constructor(app, initialClass = null) {
    const stats = initialClass ? {
      health: initialClass.hp || 10,
      shield: initialClass.armor || 0,
      atk: initialClass.atk || 1,
      speed: initialClass.speed || 0,
      hit: initialClass.hits || 1,
    } : {
      health: 10,
      shield: 0,
      atk: 1,
      speed: 0,
      hit: 1,
    };

    super(app, null, stats);

    this.baseStats = { ...stats };
    this.currentClass = initialClass;

    this.inventory = {
      item: null,
      weapon: null,
      jewelry: []
    };

    if (initialClass) {
      console.log(`Class: ${initialClass.name}`, stats);
    }

    this.init();
  }

  equipItem(gameObject) {
    const type = gameObject.data.type;
    let replaced = null;

    if (type === "item") {
      replaced = this.inventory.item;
      this.inventory.item = gameObject;
    } else if (type === "weapon") {
      replaced = this.inventory.weapon;
      this.inventory.weapon = gameObject;
    } else if (type === "jewelry") {
      if (this.inventory.jewelry.length < 2) {
        this.inventory.jewelry.push(gameObject);
      } else {
        replaced = this.inventory.jewelry[0];
        this.inventory.jewelry[0] = gameObject;
      }
    }

    if (replaced) {
      this.unequipEffects(replaced);
    }

    this.applyEquipEffects(gameObject);

    return replaced;
  }

  applyEquipEffects(gameObject) {
    const data = gameObject.data;

    if (data.atk) {
      this.atk += data.atk;
      this.maxAtk += data.atk;
    }
    if (data.armor) {
      this.shield += data.armor;
      this.maxShield += data.armor;
    }
    if (data.speed) {
      this.speed += data.speed;
      this.maxSpeed += data.speed;
    }
    if (data.hp) {
      this.health += data.hp;
      this.maxHealth += data.hp;
    }
  }

  unequipEffects(gameObject) {
    const data = gameObject.data;

    if (data.atk) {
      this.atk -= data.atk;
      this.maxAtk -= data.atk;
    }
    if (data.armor) {
      this.shield -= data.armor;
      this.maxShield -= data.armor;
    }
    if (data.speed) {
      this.speed -= data.speed;
      this.maxSpeed -= data.speed;
    }
    if (data.hp) {
      this.health -= data.hp;
      this.maxHealth -= data.hp;
    }
  }

  changeClass(classData) {
    console.log(`\nClass changed: ${classData.name}`);

    const equippedItems = [];
    if (this.inventory.item) {
      equippedItems.push(this.inventory.item);
      this.unequipEffects(this.inventory.item);
    }
    if (this.inventory.weapon) {
      equippedItems.push(this.inventory.weapon);
      this.unequipEffects(this.inventory.weapon);
    }
    this.inventory.jewelry.forEach(jewelry => {
      equippedItems.push(jewelry);
      this.unequipEffects(jewelry);
    });

    this.health = classData.hp || 10;
    this.maxHealth = classData.hp || 10;
    this.shield = classData.armor || 0;
    this.maxShield = classData.armor || 0;
    this.atk = classData.atk || 1;
    this.maxAtk = classData.atk || 1;
    this.speed = classData.speed || 0;
    this.maxSpeed = classData.speed || 0;
    this.hit = classData.hits || 1;
    this.maxHit = classData.hits || 1;

    this.baseStats = {
      health: classData.hp || 10,
      shield: classData.armor || 0,
      atk: classData.atk || 1,
      speed: classData.speed || 0,
      hit: classData.hits || 1
    };

    equippedItems.forEach(item => {
      this.applyEquipEffects(item);
    });

    this.currentClass = classData;
    console.log(`New class: ${this.currentClass.name}\n`);
  }

  init() {
    const graphics = new PIXI.Graphics();

    graphics.beginFill(0x00aaff);
    graphics.drawRect(-TILE_SIZE / 2, -TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
    graphics.endFill();

    this.sprite = graphics;
  }
}
