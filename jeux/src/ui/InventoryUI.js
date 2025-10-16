import * as PIXI from 'pixi.js';

/**
 * Gestionnaire de l'interface de l'inventaire
 * Affiche les objets équipés par le joueur
 * - 1 slot pour item
 * - 1 slot pour weapon
 * - 2 slots pour jewelry
 */
export class InventoryUI {
    /**
     * @param {PIXI.Application} app - L'application Pixi.js
     * @param {Player} player - Le joueur dont on affiche l'inventaire
     */
    constructor(app, player) {
        this.app = app;
        this.player = player;

        // Créer le conteneur de l'inventaire
        this.container = new PIXI.Container();
        app.stage.addChild(this.container);
        this.container.x = 10;
        this.container.y = 140; // Positionné sous les stats

        // Créer le fond semi-transparent noir
        const inventoryBackground = new PIXI.Graphics();
        inventoryBackground.rect(0, 0, 200, 110); // Hauteur ajustée pour inclure tous les slots
        inventoryBackground.fill({ color: 0x000000, alpha: 0.7 }); // Noir avec 70% d'opacité
        this.container.addChild(inventoryBackground);

        // Créer le fond semi-transparent noir
        const background = new PIXI.Graphics();
        background.rect(0, 0, 200, 110); // Hauteur ajustée pour inclure tous les slots
        background.fill({ color: 0x000000, alpha: 0.7 }); // Noir avec 70% d'opacité
        this.container.addChild(background);

        // Style pour le titre
        const titleStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 18,
            fill: "#ffffff",
            stroke: "#000000",
            strokeThickness: 2,
            fontWeight: "bold"
        });

        // Style pour les slots
        const slotStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 14,
            fill: "#ffffff",
            stroke: "#000000",
            strokeThickness: 2
        });

        // Titre de l'inventaire
        this.titleText = new PIXI.Text("INVENTAIRE", titleStyle);
        this.container.addChild(this.titleText);

        // Créer les textes pour chaque slot
        this.itemSlot = new PIXI.Text("Item: Vide", slotStyle);
        this.itemSlot.y = 25;
        this.container.addChild(this.itemSlot);

        this.weaponSlot = new PIXI.Text("Weapon: Vide", slotStyle);
        this.weaponSlot.y = 45;
        this.container.addChild(this.weaponSlot);

        this.jewelry1Slot = new PIXI.Text("Jewelry 1: Vide", slotStyle);
        this.jewelry1Slot.y = 65;
        this.container.addChild(this.jewelry1Slot);

        this.jewelry2Slot = new PIXI.Text("Jewelry 2: Vide", slotStyle);
        this.jewelry2Slot.y = 85;
        this.container.addChild(this.jewelry2Slot);

        // Créer les fonds colorés pour les slots
        this.createSlotBackgrounds();
    }

    /**
     * Crée les rectangles de fond pour les slots d'inventaire
     * Chaque type d'objet a sa propre couleur
     */
    createSlotBackgrounds() {
        const slotWidth = 200;
        const slotHeight = 18;

        // Définir les positions et couleurs pour chaque slot
        const slots = [
            { y: 25, color: 0x4CAF50 },  // Item - Vert
            { y: 45, color: 0xF44336 },  // Weapon - Rouge
            { y: 65, color: 0xFFEB3B },  // Jewelry 1 - Jaune
            { y: 85, color: 0xFFEB3B }   // Jewelry 2 - Jaune
        ];

        // Créer un fond pour chaque slot
        slots.forEach(slot => {
            // Créer le fond du slot avec une bordure plus visible
            const bg = new PIXI.Graphics();
            bg.rect(0, slot.y - 2, slotWidth, slotHeight);
            bg.fill({ color: slot.color, alpha: 0.3 }); // Augmenté à 30% d'opacité
            bg.stroke({ width: 2, color: slot.color, alpha: 0.8 }); // Bordure plus épaisse et plus visible
            this.container.addChildAt(bg, 1); // Ajouter au-dessus du fond noir mais sous le texte
        });
    }

    /**
     * Met à jour l'affichage de l'inventaire
     * À appeler après chaque changement d'équipement
     */
    update() {
        const inv = this.player.inventory;

        // Mettre à jour le slot item
        if (inv.item) {
            this.itemSlot.text = `Item: ${inv.item.data.name}`;
        } else {
            this.itemSlot.text = "Item: Vide";
        }

        // Mettre à jour le slot weapon
        if (inv.weapon) {
            this.weaponSlot.text = `Weapon: ${inv.weapon.data.name}`;
        } else {
            this.weaponSlot.text = "Weapon: Vide";
        }

        // Mettre à jour le premier slot jewelry
        if (inv.jewelry.length > 0) {
            this.jewelry1Slot.text = `Jewelry 1: ${inv.jewelry[0].data.name}`;
        } else {
            this.jewelry1Slot.text = "Jewelry 1: Vide";
        }

        // Mettre à jour le deuxième slot jewelry
        if (inv.jewelry.length > 1) {
            this.jewelry2Slot.text = `Jewelry 2: ${inv.jewelry[1].data.name}`;
        } else {
            this.jewelry2Slot.text = "Jewelry 2: Vide";
        }
    }
}
