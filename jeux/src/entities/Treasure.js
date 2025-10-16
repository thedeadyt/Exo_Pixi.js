import { Graphics, Sprite, Assets, Container } from "pixi.js";
import { TILE_SIZE } from "../utils/consts.js";

/**
 * Classe représentant un coffre de trésor sur la map
 * Contient 3 objets au choix pour le joueur
 */
export class Treasure {
  /**
   * @param {Array<Object>} treasureItems - Tableau de 3 objets depuis l'API
   * @param {number} x - Position X en pixels
   * @param {number} y - Position Y en pixels
   */
  constructor(treasureItems, x, y) {
    this.items = treasureItems; // Les 3 objets du coffre
    this.x = x;
    this.y = y;
    this.opened = false; // Le coffre a-t-il été ouvert ?

    // Créer un conteneur pour le sprite
    this.sprite = new Container();
    this.sprite.x = x;
    this.sprite.y = y;

    // Charger le sprite du coffre
    this.loadSprite();
  }

  /**
   * Charge le sprite du coffre depuis l'URL
   * URL: https://mmi.alarmitou.fr/imgs/chest.png
   */
  async loadSprite() {
    try {
      const spriteUrl = "https://mmi.alarmitou.fr/imgs/chest.png";
      console.log(`Chargement du sprite coffre: ${spriteUrl}`);

      const texture = await Assets.load(spriteUrl);
      const sprite = new Sprite(texture);

      // Ajuster la taille au TILE_SIZE
      sprite.width = TILE_SIZE;
      sprite.height = TILE_SIZE;

      this.sprite.addChild(sprite);
    } catch (error) {
      console.error(`Erreur lors du chargement du sprite du coffre:`, error);
      // Utiliser un carré doré en fallback
      this.createFallbackSprite();
    }
  }

  /**
   * Crée un sprite de fallback (carré doré) si le chargement échoue
   */
  createFallbackSprite() {
    const graphics = new Graphics();

    // Coffre = carré doré/orange
    graphics.rect(0, 0, TILE_SIZE, TILE_SIZE);
    graphics.fill(0xFFD700); // Or
    graphics.stroke({ width: 3, color: 0x8B4513 }); // Bordure marron

    this.sprite.addChild(graphics);
  }

  /**
   * Vérifie si le joueur est en collision avec ce coffre
   * @param {number} playerX - Position X du joueur
   * @param {number} playerY - Position Y du joueur
   * @returns {boolean} True si collision
   */
  checkCollision(playerX, playerY) {
    if (this.opened) return false;

    // Vérifier si le joueur est sur la même tile
    const sameX = Math.abs(playerX - this.x) < TILE_SIZE;
    const sameY = Math.abs(playerY - this.y) < TILE_SIZE;

    return sameX && sameY;
  }

  /**
   * Marque le coffre comme ouvert et cache son sprite
   */
  open() {
    this.opened = true;
    this.sprite.visible = false;
  }

  /**
   * Retourne les 3 objets du coffre
   * @returns {Array<Object>} Les 3 objets du trésor
   */
  getItems() {
    return this.items;
  }
}
