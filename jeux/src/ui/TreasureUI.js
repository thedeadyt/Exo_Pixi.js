import * as PIXI from 'pixi.js';

export class TreasureUI {
    constructor(app, player, onClose) {
        this.app = app;
        this.player = player;
        this.onClose = onClose;
        this.isVisible = false;

        this.container = new PIXI.Container();
        this.container.visible = false;
        app.stage.addChild(this.container);

        this.overlay = new PIXI.Graphics();
        this.overlay.rect(0, 0, app.screen.width, app.screen.height);
        this.overlay.fill({ color: 0x000000, alpha: 0.7 });
        this.overlay.eventMode = 'static';
        this.container.addChild(this.overlay);

        this.panel = new PIXI.Graphics();
        this.container.addChild(this.panel);

        this.titleText = new PIXI.Text('TREASURE CHEST', {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: 0xFFD700,
            stroke: 0x000000,
            strokeThickness: 4,
            fontWeight: 'bold'
        });
        this.container.addChild(this.titleText);

        this.descText = new PIXI.Text('Choose an item:', {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0xFFFFFF,
            stroke: 0x000000,
            strokeThickness: 3
        });
        this.container.addChild(this.descText);

        this.itemButtons = [];
    }

    show(items) {
        this.isVisible = true;
        this.container.visible = true;

        this.itemButtons.forEach(btn => btn.destroy());
        this.itemButtons = [];

        const panelWidth = 700;
        const panelHeight = 400;
        const panelX = (this.app.screen.width - panelWidth) / 2;
        const panelY = (this.app.screen.height - panelHeight) / 2;

        this.panel.clear();
        this.panel.rect(panelX, panelY, panelWidth, panelHeight);
        this.panel.fill({ color: 0x2C3E50, alpha: 0.95 });
        this.panel.stroke({ width: 4, color: 0xFFD700 });

        this.titleText.x = panelX + (panelWidth - this.titleText.width) / 2;
        this.titleText.y = panelY + 20;

        this.descText.x = panelX + (panelWidth - this.descText.width) / 2;
        this.descText.y = panelY + 70;

        const buttonWidth = 180;
        const buttonHeight = 200;
        const buttonSpacing = 40;
        const startX = panelX + (panelWidth - (buttonWidth * 3 + buttonSpacing * 2)) / 2;
        const startY = panelY + 120;

        items.forEach((item, index) => {
            const btnX = startX + (buttonWidth + buttonSpacing) * index;
            const btnY = startY;

            const button = this.createItemButton(item, btnX, btnY, buttonWidth, buttonHeight);
            this.itemButtons.push(button);
            this.container.addChild(button);
        });
    }

    async loadItemSprite(item, button, width) {
        try {
            const spriteUrl = `https://mmi.alarmitou.fr/imgs/${item.meta_name}.png`;
            const texture = await PIXI.Assets.load(spriteUrl);
            const sprite = new PIXI.Sprite(texture);

            const maxSize = 80;
            const scale = Math.min(maxSize / sprite.width, maxSize / sprite.height);
            sprite.scale.set(scale);
            sprite.x = (width - sprite.width) / 2;
            sprite.y = 35;

            button.addChild(sprite);
        } catch (error) {
            console.warn(`Failed to load sprite for ${item.name}`);
            this.createFallbackSprite(item, button, width);
        }
    }

    createFallbackSprite(item, button, width) {
        const graphics = new PIXI.Graphics();

        let color;
        if (item.type === 'item') color = 0x4CAF50;
        else if (item.type === 'weapon') color = 0xF44336;
        else if (item.type === 'jewelry') color = 0xFFEB3B;
        else color = 0x9E9E9E;

        const size = 60;
        graphics.rect(0, 0, size, size);
        graphics.fill(color);
        graphics.stroke({ width: 2, color: 0xFFFFFF });

        graphics.x = (width - size) / 2;
        graphics.y = 35;

        button.addChild(graphics);
    }

    createItemButton(item, x, y, width, height) {
        const button = new PIXI.Container();
        button.x = x;
        button.y = y;

        const bg = new PIXI.Graphics();
        bg.rect(0, 0, width, height);

        let color;
        if (item.type === 'item') color = 0x4CAF50;
        else if (item.type === 'weapon') color = 0xF44336;
        else if (item.type === 'jewelry') color = 0xFFEB3B;
        else color = 0x9E9E9E;

        bg.fill({ color, alpha: 0.3 });
        bg.stroke({ width: 3, color });
        button.addChild(bg);

        this.loadItemSprite(item, button, width);

        const nameText = new PIXI.Text(item.name, {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xFFFFFF,
            stroke: 0x000000,
            strokeThickness: 3,
            wordWrap: true,
            wordWrapWidth: width - 20,
            align: 'center'
        });
        nameText.x = (width - nameText.width) / 2;
        nameText.y = 10;
        button.addChild(nameText);

        const statsY = 110;
        const statsText = new PIXI.Text(
            `${item.atk ? `Atk: +${item.atk}\n` : ''}` +
            `${item.armor ? `Shield: +${item.armor}\n` : ''}` +
            `${item.speed ? `Speed: +${item.speed}\n` : ''}` +
            `${item.hp ? `HP: +${item.hp}` : ''}`,
            {
                fontFamily: 'Arial',
                fontSize: 14,
                fill: 0xFFFFFF,
                stroke: 0x000000,
                strokeThickness: 2,
                align: 'center'
            }
        );
        statsText.x = (width - statsText.width) / 2;
        statsText.y = statsY;
        button.addChild(statsText);

        button.eventMode = 'static';
        button.cursor = 'pointer';

        button.on('pointerover', () => {
            bg.clear();
            bg.rect(0, 0, width, height);
            bg.fill({ color, alpha: 0.6 });
            bg.stroke({ width: 5, color: 0xFFFFFF });
        });

        button.on('pointerout', () => {
            bg.clear();
            bg.rect(0, 0, width, height);
            bg.fill({ color, alpha: 0.3 });
            bg.stroke({ width: 3, color });
        });

        button.on('pointerdown', () => {
            this.selectItem(item);
        });

        return button;
    }

    selectItem(item) {
        const tempGameObject = {
            data: item,
            collected: false,
            collect: () => {},
            applyEffect: (player) => {
                player.equipItem(tempGameObject);
            }
        };

        tempGameObject.applyEffect(this.player);
        console.log(`Equipped from chest: ${item.name}`);

        this.hide();
    }

    hide() {
        this.isVisible = false;
        this.container.visible = false;

        if (this.onClose) {
            this.onClose();
        }
    }

    destroy() {
        this.container.destroy({ children: true });
    }
}
