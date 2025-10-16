import { Graphics, Sprite, Assets, Container } from "pixi.js";
import { TILE_SIZE } from "../utils/consts.js";

/**
 * Classe représentant un objet ramassable sur la map
 * (items, armes, bijoux)
 */
export class GameObject {
  /**
   * @param {Object} objectData - Données de l'objet depuis l'API
   * @param {number} x - Position X en pixels
   * @param {number} y - Position Y en pixels
   */
  constructor(objectData, x, y) {
    this.data = objectData;
    this.x = x;
    this.y = y;
    this.collected = false;

    // Créer un conteneur pour le sprite
    this.sprite = new Container();
    this.sprite.x = x;
    this.sprite.y = y;

    // Charger le sprite depuis l'API
    this.loadSprite();
  }

  /**
   * Charge le sprite de l'objet depuis l'API
   * Format URL: https://mmi.alarmitou.fr/imgs/{meta_name}.png
   */
  async loadSprite() {
    try {
      const spriteUrl = `https://mmi.alarmitou.fr/imgs/${this.data.meta_name}.png`;
      console.log(`Chargement du sprite: ${spriteUrl}`);

      const texture = await Assets.load(spriteUrl);
      const sprite = new Sprite(texture);

      // Ajuster la taille au TILE_SIZE
      sprite.width = TILE_SIZE;
      sprite.height = TILE_SIZE;

      this.sprite.addChild(sprite);
    } catch (error) {
      console.error(`Erreur lors du chargement du sprite pour ${this.data.name}:`, error);
      // Utiliser un carré coloré en fallback
      this.createFallbackSprite();
    }
  }

  /**
   * Crée un sprite de fallback (carré coloré) si le chargement échoue
   * Vert pour items, Rouge pour weapons, Jaune pour jewelry
   */
  createFallbackSprite() {
    const graphics = new Graphics();

    // Déterminer la couleur selon le type d'objet
    let color;
    switch (this.data.type) {
      case "item":
        color = 0x4CAF50; // Vert
        break;
      case "weapon":
        color = 0xF44336; // Rouge
        break;
      case "jewelry":
        color = 0xFFEB3B; // Jaune
        break;
      default:
        color = 0x9E9E9E; // Gris
    }

    graphics.rect(0, 0, TILE_SIZE, TILE_SIZE);
    graphics.fill(color);
    graphics.stroke({ width: 2, color: 0xffffff });

    this.sprite.addChild(graphics);
  }

  /**
   * Vérifie si le joueur est en collision avec cet objet
   * @param {number} playerX - Position X du joueur
   * @param {number} playerY - Position Y du joueur
   * @returns {boolean} True si collision
   */
  checkCollision(playerX, playerY) {
    if (this.collected) return false;

    // Vérifier si le joueur est sur la même tile
    const sameX = Math.abs(playerX - this.x) < TILE_SIZE;
    const sameY = Math.abs(playerY - this.y) < TILE_SIZE;

    if (sameX && sameY) {
      this.collect();
      return true;
    }
    return false;
  }

  /**
   * Marque l'objet comme collecté et cache son sprite
   */
  collect() {
    this.collected = true;
    this.sprite.visible = false;
  }

  /**
   * Équipe l'objet dans l'inventaire du joueur
   * @param {Player} player - Le joueur
   */
  applyEffect(player) {
    // Équiper l'objet dans l'inventaire
    const replaced = player.equipItem(this);

    console.log(`Équipé: ${this.data.name}`, this.data);
    if (replaced) {
      console.log(`Remplacé: ${replaced.data.name}`);
    }
  }
}
