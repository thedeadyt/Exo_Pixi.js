import * as PIXI from 'pixi.js';

/**
 * Classe de base pour toutes les entités du jeu (joueur, ennemis)
 * Gère les stats de base et les mécaniques de combat
 */
export class Entity {
  /**
   * @param {PIXI.Application} app - L'application Pixi.js
   * @param {string|null} texturePath - Chemin vers la texture (peut être null)
   * @param {Object} stats - Statistiques initiales de l'entité
   */
  constructor(app, texturePath, stats = {}) {
    this.app = app;
    this.texturePath = texturePath;
    this.sprite = null;

    // Initialiser les stats avec valeurs par défaut
    // Chaque stat a une valeur actuelle et une valeur max
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

  /**
   * Charge une texture et crée le sprite correspondant
   */
  async load() {
    const texture = await PIXI.Assets.load(this.texturePath);
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.set(0.5);
  }

  /**
   * Définit la position du sprite
   * @param {number} x - Position X en pixels
   * @param {number} y - Position Y en pixels
   */
  setPosition(x, y) {
    if (this.sprite) {
      this.sprite.x = x;
      this.sprite.y = y;
    }
  }

  /**
   * Définit l'échelle du sprite
   * @param {number} scale - Facteur d'échelle
   */
  setScale(scale) {
    if (this.sprite) this.sprite.scale.set(scale);
  }

  /**
   * Applique des dégâts à l'entité
   * Le shield absorbe les dégâts en premier, puis la santé
   * @param {number} amount - Quantité de dégâts à infliger
   */
  takeDamage(amount) {
    const remainingShield = this.shield - amount;

    if (remainingShield >= 0) {
      // Le shield absorbe tous les dégâts
      this.shield = remainingShield;
    } else {
      // Le shield est détruit, les dégâts restants touchent la santé
      this.shield = 0;
      this.health += remainingShield; // remainingShield est négatif
    }

    // Empêcher la santé d'être négative
    if (this.health < 0) this.health = 0;
  }

  /**
   * Attaque une autre entité
   * @param {Entity} target - L'entité cible
   */
  attack(target) {
    if (!(target instanceof Entity)) return;
    target.takeDamage(this.atk);
    this.hit++;
  }
}
