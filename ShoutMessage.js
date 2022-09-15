class ShoutMessage {
    constructor({ text, onComplete}) {
        this.text = text;
        this.onComplete = onComplete;
        this.element = null;
    }

    createElement() {
        //Create the element
        this.element = document.createElement("div");
        this.element.classList.add("ShoutMessage");

        this.element.innerHTML = (`
            <p class="ShoutMessage_p"></p>
            <button class="ShoutMessage_button">Next</button>
        `)

        //init the typewriter effect
        this.revealingText = new RevealingText({
            element: this.element.querySelector(".ShoutMessage_p"),
            text: this.text
        })

        this.element.querySelector("button").addEventListener("click", () => {
            //clost the text message
            this.done();
        });
        this.actionListener = new KeyPressListener("Enter", () => {
            
            this.done();
        })
    }

    done() {

        if (this.revealingText.isDone) {
            this.element.remove();
            this.actionListener.unbind();
            this.onComplete();
        } else {
            this.revealingText.warpToDone();
        }

    }

    init(container) {
        this.createElement();
        container.appendChild(this.element)
        this.revealingText.init()
    }
}