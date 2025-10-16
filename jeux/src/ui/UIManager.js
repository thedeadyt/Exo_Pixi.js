import * as PIXI from 'pixi.js';

/**
 * Gestionnaire de l'interface utilisateur principale
 * Affiche les statistiques du joueur en temps réel
 */
export class UIManager {
    /**
     * @param {PIXI.Application} app - L'application Pixi.js
     * @param {Player} player - Le joueur dont on affiche les stats
     */
    constructor(app, player) {
        this.app = app;
        this.player = player;

        // Créer le conteneur de l'UI
        this.container = new PIXI.Container();
        app.stage.addChild(this.container);
        this.container.x = 10;
        this.container.y = 10;

        // Créer le fond semi-transparent noir
        const uiBackground = new PIXI.Graphics();
        uiBackground.rect(0, 0, 200, 100); // Ajuster la taille selon vos besoins
        uiBackground.fill({ color: 0x000000, alpha: 0.7 }); // Noir avec 70% d'opacité
        this.container.addChild(uiBackground);

        // Style commun pour tous les textes
        const textStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 16,
            fill: "#ffffff",
            stroke: "#000000",
            strokeThickness: 2
        });

        // Créer le fond semi-transparent noir
        const background = new PIXI.Graphics();
        background.rect(0, 0, 200, 100); // Ajuster la taille selon vos besoins
        background.fill({ color: 0x000000, alpha: 0.7 }); // Noir avec 70% d'opacité
        this.container.addChild(background);

        // Créer les textes pour chaque statistique
        this.healthText = new PIXI.Text("", textStyle);
        this.shieldText = new PIXI.Text("", textStyle);
        this.atkText = new PIXI.Text("", textStyle);
        this.speedText = new PIXI.Text("", textStyle);
        this.hitText = new PIXI.Text("", textStyle);

        // Positionner les textes verticalement (espacement de 20px)
        this.healthText.y = 0;
        this.shieldText.y = 20;
        this.atkText.y = 40;
        this.speedText.y = 60;
        this.hitText.y = 80;

        // Ajouter tous les textes au conteneur
        this.container.addChild(
            this.healthText,
            this.shieldText,
            this.atkText,
            this.speedText,
            this.hitText
        );
    }

    /**
     * Met à jour l'affichage des statistiques du joueur
     * À appeler chaque frame pour refléter les changements en temps réel
     */
    update() {
        // Format: "Stat: actuel / max"
        this.healthText.text = `Health: ${this.player.health} / ${this.player.maxHealth}`;
        this.shieldText.text = `Shield: ${this.player.shield} / ${this.player.maxShield}`;
        this.atkText.text = `Atk: ${this.player.atk} / ${this.player.maxAtk}`;
        this.speedText.text = `Speed: ${this.player.speed} / ${this.player.maxSpeed}`;
        this.hitText.text = `Hit: ${this.player.hit} / ${this.player.maxHit}`;
    }
}
