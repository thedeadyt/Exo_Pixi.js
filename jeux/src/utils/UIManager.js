import * as PIXI from 'pixi.js';

export class UIManager {
    constructor(app, player) {
        this.app = app;
        this.player = player;

        // Créer le conteneur de l'UI
        this.container = new PIXI.Container();
        app.stage.addChild(this.container);
        this.container.x = 10;
        this.container.y = 10;

        // Style commun pour tous les textes
        const textStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 16,
            fill: "#ffffff",
            stroke: "#000000",
            strokeThickness: 2
        });

        // Créer les textes
        this.healthText = new PIXI.Text("", textStyle);
        this.shieldText = new PIXI.Text("", textStyle);
        this.atkText = new PIXI.Text("", textStyle);
        this.speedText = new PIXI.Text("", textStyle);
        this.hitText = new PIXI.Text("", textStyle);

        // Position verticale
        this.healthText.y = 0;
        this.shieldText.y = 20;
        this.atkText.y = 40;
        this.speedText.y = 60;
        this.hitText.y = 80;

        // Ajouter au conteneur
        this.container.addChild(
            this.healthText,
            this.shieldText,
            this.atkText,
            this.speedText,
            this.hitText
        );
    }

    update() {
        this.healthText.text = `Health: ${this.player.health} / ${this.player.stats.health}`;
        this.shieldText.text = `Shield: ${this.player.shield} / ${this.player.stats.shield}`;
        this.atkText.text = `Atk: ${this.player.stats.atk}`;
        this.speedText.text = `Speed: ${this.player.stats.speed}`;
        this.hitText.text = `Hit: ${this.player.stats.hit}`;
    }
}
