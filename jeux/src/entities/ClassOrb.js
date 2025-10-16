import { Graphics, Sprite, Assets, Container } from "pixi.js";
import { TILE_SIZE } from "../utils/consts.js";

/**
 * Classe représentant un orbe de classe sur la map
 * Permet au joueur de changer de classe en le touchant
 */
export class ClassOrb {
  /**
   * @param {Object} classData - Données de la classe depuis l'API
   * @param {number} x - Position X en pixels
   * @param {number} y - Position Y en pixels
   */
  constructor(classData, x, y) {
    this.data = classData;
    this.x = x;
    this.y = y;
    this.collected = false;

    // Créer un conteneur pour le sprite
    this.sprite = new Container();
    this.sprite.x = x;
    this.sprite.y = y;

    // Créer immédiatement le sprite coloré (ne pas attendre le chargement)
    this.createColoredSprite();
  }

  /**
   * Crée un sprite coloré pour représenter la classe
   * Utilise une couleur selon le nom de la classe
   */
  createColoredSprite() {
    const graphics = new Graphics();

    // Définir une couleur selon le nom de la classe
    let color;
    const className = this.data.name?.toLowerCase() || '';

    if (className.includes('warrior') || className.includes('guerrier')) {
      color = 0xFF0000; // Rouge
    } else if (className.includes('rogue') || className.includes('voleur')) {
      color = 0x9C27B0; // Violet
    } else if (className.includes('mage') || className.includes('magicien')) {
      color = 0x2196F3; // Bleu
    } else if (className.includes('warden') || className.includes('gardien')) {
      color = 0x4CAF50; // Vert
    } else if (className.includes('barbarian') || className.includes('barbare')) {
      color = 0xFF5722; // Orange
    } else {
      color = 0xFF00FF; // Magenta par défaut
    }

    // Dessiner un carré coloré avec bordure épaisse blanche
    graphics.rect(0, 0, TILE_SIZE, TILE_SIZE);
    graphics.fill(color);
    graphics.stroke({ width: 3, color: 0xFFFFFF });

    this.sprite.addChild(graphics);
  }

  /**
   * Vérifie si le joueur est en collision avec cet orbe
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
   * Marque l'orbe comme collecté et cache son sprite
   */
  collect() {
    this.collected = true;
    this.sprite.visible = false;
  }

  /**
   * Change la classe du joueur
   * @param {Player} player - Le joueur
   */
  applyEffect(player) {
    // Changer la classe du joueur
    player.changeClass(this.data);

    console.log(`🎭 Classe changée: ${this.data.name}`);
    console.log(`Nouvelles stats de base:`, this.data);
  }
}
