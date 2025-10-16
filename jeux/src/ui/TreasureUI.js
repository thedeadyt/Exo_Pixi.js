import * as PIXI from 'pixi.js';

/**
 * Interface UI pour le choix d'objets dans un coffre de trésor
 * Affiche 3 boutons cliquables avec les objets du coffre
 */
export class TreasureUI {
    /**
     * @param {PIXI.Application} app - L'application Pixi.js
     * @param {Player} player - Le joueur
     * @param {Function} onClose - Callback appelé quand l'UI se ferme
     */
    constructor(app, player, onClose) {
        this.app = app;
        this.player = player;
        this.onClose = onClose;
        this.isVisible = false;

        // Créer le conteneur principal (caché par défaut)
        this.container = new PIXI.Container();
        this.container.visible = false;
        app.stage.addChild(this.container);

        // Overlay semi-transparent pour bloquer les interactions
        this.overlay = new PIXI.Graphics();
        this.overlay.rect(0, 0, app.screen.width, app.screen.height);
        this.overlay.fill({ color: 0x000000, alpha: 0.7 });
        this.overlay.eventMode = 'static'; // Bloquer les clics
        this.container.addChild(this.overlay);

        // Panneau principal
        this.panel = new PIXI.Graphics();
        this.container.addChild(this.panel);

        // Texte du titre
        this.titleText = new PIXI.Text('COFFRE DE TRÉSOR', {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: 0xFFD700,
            stroke: 0x000000,
            strokeThickness: 4,
            fontWeight: 'bold'
        });
        this.container.addChild(this.titleText);

        // Texte de description
        this.descText = new PIXI.Text('Choisissez un objet:', {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0xFFFFFF,
            stroke: 0x000000,
            strokeThickness: 3
        });
        this.container.addChild(this.descText);

        // Conteneurs pour les 3 boutons d'objets
        this.itemButtons = [];
    }

    /**
     * Affiche l'UI avec les 3 objets du coffre
     * @param {Array<Object>} items - Les 3 objets du coffre
     */
    show(items) {
        this.isVisible = true;
        this.container.visible = true;

        // Nettoyer les anciens boutons
        this.itemButtons.forEach(btn => btn.destroy());
        this.itemButtons = [];

        // Dimensions
        const panelWidth = 700;
        const panelHeight = 400;
        const panelX = (this.app.screen.width - panelWidth) / 2;
        const panelY = (this.app.screen.height - panelHeight) / 2;

        // Dessiner le panneau
        this.panel.clear();
        this.panel.rect(panelX, panelY, panelWidth, panelHeight);
        this.panel.fill({ color: 0x2C3E50, alpha: 0.95 });
        this.panel.stroke({ width: 4, color: 0xFFD700 });

        // Positionner le titre
        this.titleText.x = panelX + (panelWidth - this.titleText.width) / 2;
        this.titleText.y = panelY + 20;

        // Positionner la description
        this.descText.x = panelX + (panelWidth - this.descText.width) / 2;
        this.descText.y = panelY + 70;

        // Créer les 3 boutons d'objets
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

    /**
     * Charge et affiche le sprite d'un objet dans un bouton
     * @param {Object} item - Les données de l'objet
     * @param {PIXI.Container} button - Le conteneur du bouton
     * @param {number} width - Largeur du bouton
     */
    async loadItemSprite(item, button, width) {
        try {
            const spriteUrl = `https://mmi.alarmitou.fr/imgs/${item.meta_name}.png`;
            const texture = await PIXI.Assets.load(spriteUrl);
            const sprite = new PIXI.Sprite(texture);

            // Centrer et redimensionner le sprite
            const maxSize = 80; // Taille max du sprite
            const scale = Math.min(maxSize / sprite.width, maxSize / sprite.height);
            sprite.scale.set(scale);
            sprite.x = (width - sprite.width) / 2;
            sprite.y = 35; // Positionner sous le nom

            button.addChild(sprite);
        } catch (error) {
            console.warn(`Impossible de charger le sprite pour ${item.name}`);
            // Créer un carré coloré en fallback
            this.createFallbackSprite(item, button, width);
        }
    }

    /**
     * Crée un sprite de fallback (carré coloré) si le chargement échoue
     * @param {Object} item - Les données de l'objet
     * @param {PIXI.Container} button - Le conteneur du bouton
     * @param {number} width - Largeur du bouton
     */
    createFallbackSprite(item, button, width) {
        const graphics = new PIXI.Graphics();

        // Couleur selon le type
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

    /**
     * Crée un bouton cliquable pour un objet
     * @param {Object} item - Les données de l'objet
     * @param {number} x - Position X
     * @param {number} y - Position Y
     * @param {number} width - Largeur du bouton
     * @param {number} height - Hauteur du bouton
     * @returns {PIXI.Container} Le conteneur du bouton
     */
    createItemButton(item, x, y, width, height) {
        const button = new PIXI.Container();
        button.x = x;
        button.y = y;

        // Fond du bouton
        const bg = new PIXI.Graphics();
        bg.rect(0, 0, width, height);

        // Couleur selon le type d'objet
        let color;
        if (item.type === 'item') color = 0x4CAF50; // Vert
        else if (item.type === 'weapon') color = 0xF44336; // Rouge
        else if (item.type === 'jewelry') color = 0xFFEB3B; // Jaune
        else color = 0x9E9E9E; // Gris

        bg.fill({ color, alpha: 0.3 });
        bg.stroke({ width: 3, color });
        button.addChild(bg);

        // Charger et afficher le sprite de l'objet
        this.loadItemSprite(item, button, width);

        // Nom de l'objet
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

        // Stats de l'objet
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

        // Rendre le bouton interactif
        button.eventMode = 'static';
        button.cursor = 'pointer';

        // Effet hover
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

        // Gestion du clic
        button.on('pointerdown', () => {
            console.log(`Objet choisi: ${item.name}`);
            this.selectItem(item);
        });

        return button;
    }

    /**
     * Appelé quand le joueur choisit un objet
     * @param {Object} item - L'objet choisi
     */
    selectItem(item) {
        // Créer un GameObject temporaire pour utiliser la logique existante
        const tempGameObject = {
            data: item,
            collected: false,
            collect: () => {},
            applyEffect: (player) => {
                player.equipItem(tempGameObject);
            }
        };

        // Équiper l'objet
        tempGameObject.applyEffect(this.player);

        console.log(`Équipé depuis le coffre: ${item.name}`);

        // Fermer l'UI
        this.hide();
    }

    /**
     * Cache l'UI du trésor
     */
    hide() {
        this.isVisible = false;
        this.container.visible = false;

        // Appeler le callback de fermeture
        if (this.onClose) {
            this.onClose();
        }
    }

    /**
     * Détruit l'UI
     */
    destroy() {
        this.container.destroy({ children: true });
    }
}
