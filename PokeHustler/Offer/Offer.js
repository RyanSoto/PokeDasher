class Offer {
    constructor(config, onComplete ) {
        
        this.onComplete = onComplete;
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          
            // These options are needed to round to whole numbers if that's what you want.
            //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
            //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
          });

        this.basePay = 0 + 1;
        this.distPay = 1 * 1;
        this.tip = 1.2 * 13;
        this.pay = formatter.format(this.basePay + this.distPay + this.tip);

        this.map = new OverworldMap(config);
        // this.overworldmaps = this.map.OverworldMaps
        // Object.values(this.map.gameObjects).forEach(object => {
        //     object.update({
        //       arrow: this.directionInput.direction,
        //       map: this.map,
        //     })
        //   })
    }

    // get base(){

    // }

    // get dist(){
        
    // }

    // get tip(){
        
    // }

    // get xp(){
        
    // }

    genOffer() {
        // generate offer random dispatcher + random restaurant + random customer
    }

    getOptions(pageKey) {
        

        if (pageKey === "root") {
            return [
            //...All of our apps(dynamic)
            {
                label: "Accept",
                description: "Accept this offer.",
                handler: () => {
                    this.map.startCutscene([
                                { type: "textMessage", text: "You accepted the order" },
                                { type: "addStoryFlag", flag: "ORDER_ACCEPTED"  }
                    ]);
                    console.log("Accepted Offer");
                    this.close();
                }
             },
            {
                label: "Deny",
                description: "Reject this offer",
                handler: () => {
                    this.close();
                }
            }
            ]
        }
        return [];
    }
    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Offer");
        this.element.innerHTML = (`
        <div class="iphone_screen1">
        
        <div class="Logo">
            <img src="${'/images/characters/Grubhub-Logo.png'}" alt="Logo" />
            </div>
            </div>
        <p class="pay">${this.pay}</p>


        `)


    }

    close() {
        this.keyQ?.unbind();
        this.keyboardMenu.end();
        this.element.remove();
        // this.onComplete();
    }

    init(container) {
        this.createElement();
        utils.wait(200);
        this.keyboardMenu = new KeyboardMenu({
            descriptionContainer: container
        })
        this.keyboardMenu.init(this.element);
        this.keyboardMenu.setOptions(this.getOptions("root"));
        document.querySelector(".iphone_screen").appendChild(this.element);
        this.keyQ = new KeyPressListener("KeyQ", () =>{
            this.close();
        })
        




    }
}