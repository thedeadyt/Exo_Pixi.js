import * as PIXI from 'pixi.js';
import { Entity } from '../entities/entity.js';
import { TILE_SIZE } from '../utils/consts.js';

/**
 * Classe représentant le joueur
 * Hérite d'Entity et ajoute un système d'inventaire
 */
export class Player extends Entity {
  /**
   * @param {PIXI.Application} app - L'application Pixi.js
   * @param {Object} initialClass - Classe de départ du joueur (warrior par défaut)
   */
  constructor(app, initialClass = null) {
    // Si une classe est fournie, utiliser ses stats, sinon utiliser des stats par défaut
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

    // Conserver les stats initiales pour référence
    this.baseStats = { ...stats };

    // Classe actuelle du joueur
    this.currentClass = initialClass;

    // Système d'inventaire
    // - 1 slot pour item
    // - 1 slot pour weapon
    // - 2 slots pour jewelry
    this.inventory = {
      item: null,
      weapon: null,
      jewelry: []
    };

    // Log de la classe de départ
    if (initialClass) {
      console.log(`🎭 Classe de départ: ${initialClass.name}`);
      console.log(`Stats de base:`, stats);
    }

    this.init();
  }

  /**
   * Équipe un objet dans l'inventaire
   * Si le slot est déjà occupé, l'ancien objet est remplacé
   * @param {GameObject} gameObject - L'objet à équiper
   * @returns {GameObject|null} L'objet remplacé (ou null)
   */
  equipItem(gameObject) {
    const type = gameObject.data.type;
    let replaced = null;

    // Déterminer dans quel slot équiper l'objet
    if (type === "item") {
      replaced = this.inventory.item;
      this.inventory.item = gameObject;
    } else if (type === "weapon") {
      replaced = this.inventory.weapon;
      this.inventory.weapon = gameObject;
    } else if (type === "jewelry") {
      if (this.inventory.jewelry.length < 2) {
        // Ajouter dans un slot libre
        this.inventory.jewelry.push(gameObject);
      } else {
        // Remplacer le premier bijou
        replaced = this.inventory.jewelry[0];
        this.inventory.jewelry[0] = gameObject;
      }
    }

    // Retirer les bonus de l'ancien objet
    if (replaced) {
      this.unequipEffects(replaced);
    }

    // Appliquer les bonus du nouvel objet
    this.applyEquipEffects(gameObject);

    return replaced;
  }

  /**
   * Applique les effets d'un objet équipé aux stats du joueur
   * @param {GameObject} gameObject - L'objet équipé
   */
  applyEquipEffects(gameObject) {
    const data = gameObject.data;

    // Appliquer les bonus à la fois sur la valeur actuelle et max
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

  /**
   * Retire les effets d'un objet déséquipé des stats du joueur
   * @param {GameObject} gameObject - L'objet déséquipé
   */
  unequipEffects(gameObject) {
    const data = gameObject.data;

    // Retirer les bonus de la valeur actuelle et max
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

  /**
   * Change la classe du joueur
   * Retire toutes les stats des items, applique les nouvelles stats de base,
   * puis réapplique les stats des items
   * @param {Object} classData - Données de la classe depuis l'API
   */
  changeClass(classData) {
    console.log(`\n🎭 Changement de classe: ${classData.name}`);
    console.log(`Stats avant changement:`, {
      health: `${this.health}/${this.maxHealth}`,
      shield: `${this.shield}/${this.maxShield}`,
      atk: `${this.atk}/${this.maxAtk}`,
      speed: `${this.speed}/${this.maxSpeed}`
    });

    // 1. Retirer les bonus des items équipés
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

    // 2. Appliquer les nouvelles stats de base de la classe
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

    // Mettre à jour les stats de base
    this.baseStats = {
      health: classData.hp || 10,
      shield: classData.armor || 0,
      atk: classData.atk || 1,
      speed: classData.speed || 0,
      hit: classData.hits || 1
    };

    // 3. Réappliquer les bonus des items équipés
    equippedItems.forEach(item => {
      this.applyEquipEffects(item);
    });

    // 4. Enregistrer la classe actuelle
    this.currentClass = classData;

    console.log(`Stats après changement:`, {
      health: `${this.health}/${this.maxHealth}`,
      shield: `${this.shield}/${this.maxShield}`,
      atk: `${this.atk}/${this.maxAtk}`,
      speed: `${this.speed}/${this.maxSpeed}`
    });
    console.log(`Classe actuelle: ${this.currentClass.name}\n`);
  }

  /**
   * Initialise le sprite du joueur (carré bleu)
   */
  init() {
    const graphics = new PIXI.Graphics();

    // Dessiner un carré bleu centré
    graphics.beginFill(0x00aaff);
    graphics.drawRect(-TILE_SIZE / 2, -TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
    graphics.endFill();

    this.sprite = graphics;
  }
}
