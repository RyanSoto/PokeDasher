class KeyPressListener {
    constructor(keyCode, callback) {
        let keySafe = true;
        this.keydownFunction = function(event) {
            if(event.code === keyCode) {
                if (keySafe) {
                    keySafe = false;
                    callback();
                }
            }
        };
        this.keyupFunction = function(event) {
            if (event.code === keyCode) {
                keySafe = true;
            }
        };

        document.addEventListener("keydown", this.keydownFunction);
        document.addEventListener("touchstart", this.keydownFunction);
        document.addEventListener("keyup", this.keyupFunction);
        document.addEventListener("touchend", this.keydownFunction);
        // document.addEventListener("touchmove", this.keydownFunction);
    }

    unbind() {
        document.removeEventListener("keydown", this.keydownFunction);
        document.removeEventListener("touchstart", this.keydownFunction);
        document.removeEventListener("keyup", this.keyupFunction);
        document.removeEventListener("touchend", this.keyupFunction);
    }
}