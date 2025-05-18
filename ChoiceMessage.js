class ChoiceMessage {
    constructor({ text, onComplete}) {
        this.options = []; //set by updater method
        this.up = null;
        this.down = null;
        this.prevFocus = null;
        this.descriptionContainer = config.descriptionContainer || null;
        this.text = text;
        this.onComplete = onComplete;
        this.element = null;
    }

    getOptions(pageKey) {

        if (pageKey === "root") {
            return root;
        }
        return [];
    }

    setOptions(options) {
      this.options = options;
      console.log("options ", this.options);
      this.element.innerHTML = this.options.map((option, index) => {
        const disabledAttr = option.disabled ? "disabled" : "";
        return (`
          <div class="option">
            <button ${disabledAttr} data-button="${index}" data-description="${option.description}">
              ${option.label}
            </button>
          </div>
        `)
      }).join("");
      // <span class="right">${option.right ? option.right() : ""}</span>
  
      this.element.querySelectorAll("button").forEach(button => {
  
        button.addEventListener("click", () => {
          const chosenOption = this.options[ Number(button.dataset.button) ];
          chosenOption.handler();
        })
        button.addEventListener("mouseenter", () => {
          button.focus();
        })
        button.addEventListener("focus", () => {
          this.prevFocus = button;
          // this.descriptionElementText.innerText = button.dataset.description;
        })
      })
  
      setTimeout(() => {
        this.element.querySelector("button[data-button]:not([disabled])").focus();
      }, 10)
  
  
    }

    createElement() {
        //Create the element
        this.element = document.createElement("div");
        this.element.classList.add("TextMessage");

        this.element.innerHTML = (`
            <p class="TextMessage_p"></p>
            <button class="ChoiceMessage_button_Yes">Yes</button>
            <button class="ChoiceMessage_button_No">No</button>
        `)

        //init the typewriter effect
        this.revealingText = new RevealingText({
            element: this.element.querySelector(".TextMessage_p"),
            text: this.text
        })

        this.element.querySelector("button").addEventListener("click", () => {
            //clost the text message
            this.done();
        });
        this.actionListener = new KeyPressListener("Enter", () => {
            
            this.done();
        })
        this.actionListener = new KeyPressListener("KeyF", () => {
            
            this.done();
        })
        this.actionListener = new KeyPressListener("Space", () => {   
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


      setOptions(root);
      
      this.createElement();
      (this.descriptionContainer || container);
      container.appendChild(this.element);

      this.up = new KeyPressListener("ArrowUp", () => {
        const current = Number(this.prevFocus.getAttribute("data-button"));
        const prevButton = Array.from(this.element.querySelectorAll("button[data-button]")).reverse().find(el => {
          return el.dataset.button < current && !el.disabled;
        })
        prevButton?.focus();
      })
  
      this.up = new KeyPressListener("KeyW", () => {
        const current = Number(this.prevFocus.getAttribute("data-button"));
        const prevButton = Array.from(this.element.querySelectorAll("button[data-button]")).reverse().find(el => {
          return el.dataset.button < current && !el.disabled;
        })
        prevButton?.focus();
      })

      this.down = new KeyPressListener("KeyS",() => {
        const current = Number(this.prevFocus.getAttribute("data-button"));
        const nextButton = Array.from(this.element.querySelectorAll("button[data-button]")).find(el => {
          return el.dataset.button > current && !el.disabled;
        })
        
        nextButton?.focus();
      })
      this.down = new KeyPressListener("ArrowDown",() => {
        const current = Number(this.prevFocus.getAttribute("data-button"));
        const nextButton = Array.from(this.element.querySelectorAll("button[data-button]")).find(el => {
          return el.dataset.button > current && !el.disabled;
        })
        
        nextButton?.focus();
      })
    }
}

root = [
            {
                label: "Purchase bike",
                description: "Purchase a bike for $100",
                handler: () => {
                    this.map.startCutscene([
                            { type: "addStoryFlag", flag: "BIKE"},
                            { type: "textMessage", text: "You purchase the bike" }

                    ]);
                    console.log("Purchase Bike");
                    playerState.players.p1.orders = [this.resName , this.address, this.displayPay];
                    console.log("Offer :", playerState.players.p1.orders , "Player's Money: ", playerState.players.p1.money );
                    playerState.players.p1.potentialPay = this.pay + playerState.players.p1.money;
                    utils.emitEvent("PlayerStateUpdated"); 
                    
                    this.close();
                    
                }
             },
            {
                label: "Finish Shopping",
                description: "Finish Shopping",
                handler: () => {
                    // this.map.startCutscene([
                    // { type: "textMessage", text: "Order Denied" }
                    // ]);
                    this.close();
                }
            }
            ]