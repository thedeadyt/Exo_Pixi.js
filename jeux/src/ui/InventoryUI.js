import * as PIXI from 'pixi.js';

export class InventoryUI {
    constructor(app, player) {
        this.app = app;
        this.player = player;

        this.container = new PIXI.Container();
        app.stage.addChild(this.container);
        this.container.x = 10;
        this.container.y = 140;

        const inventoryBackground = new PIXI.Graphics();
        inventoryBackground.rect(0, 0, 200, 110);
        inventoryBackground.fill({ color: 0x000000, alpha: 0.7 });
        this.container.addChild(inventoryBackground);

        const titleStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 18,
            fill: "#ffffff",
            stroke: "#000000",
            strokeThickness: 2,
            fontWeight: "bold"
        });

        const slotStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 14,
            fill: "#ffffff",
            stroke: "#000000",
            strokeThickness: 2
        });

        this.titleText = new PIXI.Text("INVENTORY", titleStyle);
        this.container.addChild(this.titleText);

        this.itemSlot = new PIXI.Text("Item: Empty", slotStyle);
        this.itemSlot.y = 25;
        this.container.addChild(this.itemSlot);

        this.weaponSlot = new PIXI.Text("Weapon: Empty", slotStyle);
        this.weaponSlot.y = 45;
        this.container.addChild(this.weaponSlot);

        this.jewelry1Slot = new PIXI.Text("Jewelry 1: Empty", slotStyle);
        this.jewelry1Slot.y = 65;
        this.container.addChild(this.jewelry1Slot);

        this.jewelry2Slot = new PIXI.Text("Jewelry 2: Empty", slotStyle);
        this.jewelry2Slot.y = 85;
        this.container.addChild(this.jewelry2Slot);

        this.createSlotBackgrounds();
    }

    createSlotBackgrounds() {
        const slotWidth = 200;
        const slotHeight = 18;

        const slots = [
            { y: 25, color: 0x4CAF50 },
            { y: 45, color: 0xF44336 },
            { y: 65, color: 0xFFEB3B },
            { y: 85, color: 0xFFEB3B }
        ];

        slots.forEach(slot => {
            const bg = new PIXI.Graphics();
            bg.rect(0, slot.y - 2, slotWidth, slotHeight);
            bg.fill({ color: slot.color, alpha: 0.3 });
            bg.stroke({ width: 2, color: slot.color, alpha: 0.8 });
            this.container.addChildAt(bg, 1);
        });
    }

    update() {
        const inv = this.player.inventory;

        if (inv.item) {
            this.itemSlot.text = `Item: ${inv.item.data.name}`;
        } else {
            this.itemSlot.text = "Item: Empty";
        }

        if (inv.weapon) {
            this.weaponSlot.text = `Weapon: ${inv.weapon.data.name}`;
        } else {
            this.weaponSlot.text = "Weapon: Empty";
        }

        if (inv.jewelry.length > 0) {
            this.jewelry1Slot.text = `Jewelry 1: ${inv.jewelry[0].data.name}`;
        } else {
            this.jewelry1Slot.text = "Jewelry 1: Empty";
        }

        if (inv.jewelry.length > 1) {
            this.jewelry2Slot.text = `Jewelry 2: ${inv.jewelry[1].data.name}`;
        } else {
            this.jewelry2Slot.text = "Jewelry 2: Empty";
        }
    }
}
