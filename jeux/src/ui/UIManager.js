import * as PIXI from 'pixi.js';

export class UIManager {
    constructor(app, player) {
        this.app = app;
        this.player = player;

        this.container = new PIXI.Container();
        app.stage.addChild(this.container);
        this.container.x = 10;
        this.container.y = 10;

        const uiBackground = new PIXI.Graphics();
        uiBackground.rect(0, 0, 200, 100);
        uiBackground.fill({ color: 0x000000, alpha: 0.7 });
        this.container.addChild(uiBackground);

        const textStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 16,
            fill: "#ffffff",
            stroke: "#000000",
            strokeThickness: 2
        });

        this.healthText = new PIXI.Text("", textStyle);
        this.shieldText = new PIXI.Text("", textStyle);
        this.atkText = new PIXI.Text("", textStyle);
        this.speedText = new PIXI.Text("", textStyle);
        this.hitText = new PIXI.Text("", textStyle);

        this.healthText.y = 0;
        this.shieldText.y = 20;
        this.atkText.y = 40;
        this.speedText.y = 60;
        this.hitText.y = 80;

        this.container.addChild(
            this.healthText,
            this.shieldText,
            this.atkText,
            this.speedText,
            this.hitText
        );
    }

    update() {
        this.healthText.text = `Health: ${this.player.health} / ${this.player.maxHealth}`;
        this.shieldText.text = `Shield: ${this.player.shield} / ${this.player.maxShield}`;
        this.atkText.text = `Atk: ${this.player.atk} / ${this.player.maxAtk}`;
        this.speedText.text = `Speed: ${this.player.speed} / ${this.player.maxSpeed}`;
        this.hitText.text = `Hit: ${this.player.hit} / ${this.player.maxHit}`;
    }
}
