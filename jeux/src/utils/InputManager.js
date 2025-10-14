export class InputManager {
    constructor() {
        this.keys = {};
        this.init();
    }

    init() {
        window.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });

        window.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    isDown(key) {
        return !!this.keys[key.toLowerCase()];
    }
}
