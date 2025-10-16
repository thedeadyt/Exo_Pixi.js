import { Graphics, Sprite, Assets, Container } from "pixi.js";
import { TILE_SIZE } from "../utils/consts.js";
import { Entity } from "./entity.js";
import { startCombat } from "../utils/CombatManager.js";

/**
 * Classe représentant un ennemi
 * Hérite d'Entity et ajoute le système de combat automatique
 */
export class Enemy extends Entity {
  /**
   * @param {PIXI.Application} app - L'application Pixi.js
   * @param {Object} enemyData - Données de l'ennemi depuis l'API
   * @param {number} x - Position X en pixels
   * @param {number} y - Position Y en pixels
   */
  constructor(app, enemyData, x, y) {
    // Créer les stats depuis les données de l'API
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

    // Créer un conteneur pour le sprite
    this.sprite = new Container();
    this.sprite.x = x;
    this.sprite.y = y;

    // Charger le sprite depuis l'API
    this.loadSprite();
  }

  /**
   * Charge le sprite de l'ennemi depuis l'API
   * Format URL: https://mmi.alarmitou.fr/imgs/{meta_name}.png
   */
  async loadSprite() {
    try {
      const spriteUrl = `https://mmi.alarmitou.fr/imgs/${this.data.meta_name}.png`;
      console.log(`Chargement du sprite ennemi: ${spriteUrl}`);

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
   * Rouge pour les ennemis basiques, Violet pour les boss
   */
  createFallbackSprite() {
    const graphics = new Graphics();

    // Couleur selon le type d'ennemi
    const color = this.data.type === "boss" ? 0x9C27B0 : 0xFF5252;

    graphics.rect(0, 0, TILE_SIZE, TILE_SIZE);
    graphics.fill(color);
    graphics.stroke({ width: 2, color: 0x000000 });

    this.sprite.addChild(graphics);
  }

  /**
   * Vérifie si le joueur est en collision avec cet ennemi
   * @param {number} playerX - Position X du joueur
   * @param {number} playerY - Position Y du joueur
   * @returns {boolean} True si collision
   */
  checkCollision(playerX, playerY) {
    if (this.isDead) return false;

    // Vérifier si le joueur est sur la même tile
    const sameX = Math.abs(playerX - this.x) < TILE_SIZE;
    const sameY = Math.abs(playerY - this.y) < TILE_SIZE;

    return sameX && sameY;
  }

  /**
   * Lance un combat automatique complet avec le joueur
   * Utilise le CombatManager pour gérer le combat tour par tour
   * @param {Player} player - Le joueur
   */
  fight(player) {
    if (this.isDead) return;

    // Lancer le combat via le CombatManager
    const result = startCombat(player, this);

    // Vérifier qui a gagné et mettre à jour l'état
    if (result.loser === this) {
      // L'ennemi a perdu
      this.die();
    }
    // Si le joueur a perdu, son état de santé est déjà à 0
    // Le Game Over sera géré par la boucle principale
  }

  /**
   * Marque l'ennemi comme mort et cache son sprite
   */
  die() {
    this.isDead = true;
    this.sprite.visible = false;
  }

  /**
   * Méthode de mise à jour pour les ennemis
   * Peut être utilisée pour implémenter des mouvements ou IA
   */
  update() {
    // Pour l'instant les ennemis sont statiques
    // On pourrait ajouter un système de mouvement ici
  }
}
