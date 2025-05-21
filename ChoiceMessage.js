class ChoiceMessage {
    constructor({map, text, onComplete, config={}}) {
        this.map = map;
        this.options = []; //set by updater method
        this.up = null;
        this.down = null;
        this.prevFocus = null;
        this.descriptionContainer = config.descriptionContainer || null;
        this.text = text;
        this.onComplete = onComplete;
        this.element = null;

        root = [
            {
                label: "Purchase bike",
                description: "Purchase a bike for $100",
                id: "purchaseBike",
                handler: () => {
                if (playerState.storyFlags["BIKE"]){
                    this.map.startCutscene([
                            { type: "textMessage", text: "You already have a bike" },
                            // { who: "hero", type: "walk", direction: "down" }
                    ]);
                    setTimeout(() => {
                      document.getElementById("finishShopping").focus();
                    }, 10)
                    
                    // this.close();
                }else if (playerState.players.p1.money < 10) {
                    this.map.startCutscene([
                            { type: "textMessage", text: "You don't have enough money" },
                            // { who: "hero", type: "walk", direction: "down" },
                    ]);
                    setTimeout(() => {
                      document.getElementById("finishShopping").focus();
                    }, 10)
                    // this.close();
                  } else {
                    this.map.startCutscene([
                            { type: "addStoryFlag", flag: "BIKE"},
                            // { who: "hero", type: "walk", direction: "down" },
                            { type: "textMessage", text: "You purchased the bike" }

                    ]);
                    console.log("Purchase Bike");
                    playerState.players.p1.money -= 10;
                    utils.emitEvent("PlayerStateUpdated"); 
                    setTimeout(() => {
                      document.getElementById("finishShopping").focus();
                    }, 10)
                    // this.close();
                  }
                }
             },
            {
                label: "Finish Shopping",
                description: "Finish Shopping",
                id: "finishShopping",
                handler: () => {
                    this.map.startCutscene([
                    { type: "textMessage", text: "Thanks for coming in! Come back and see us real soon." },
                    { who: "hero", type: "walk", direction: "down" }
                    ]);
                    this.close();
                }
            }
            ]
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
            <button ${disabledAttr} id="${option.id}" class="ShopMessage_button" data-button="${index}" data-description="${option.description}">
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
        this.element.classList.add("ShopMessage");

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


    close() {
        console.log("Shop closed");
        this.element.remove();
    }

    init(container) {


      
      this.createElement();
      this.setOptions(root);
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