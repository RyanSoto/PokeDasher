class Offer {
    constructor(config, onComplete ) {
        this.map = new OverworldMap(config);
        this.onComplete = onComplete;
        this.tipCal = null
        this.basePay = 5;
        this.distPay = 1 * 1;
        this.randTip = 
        this.tip = 5.50;
        this.pay = 0
        
        // this.pickUp = null

    }

    // get base(){

    // }

    // get dist(){
        
    // }

    calcTip(resTip){
        this.tipCal = resTip * this.tip        
    }
    calcTip(cusTip){
        this.tipCal = cusTip * this.tip        
    }

    // get xp(){
        
    // }

    
        // generate offer random dispatcher + random restaurant + random customer
    genOffer() {

        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          });



        // generate random number Restaurant key
        let restaurantKeyGen = Math.floor(Math.random() * 20);
        let resKey = RestaurantChance[restaurantKeyGen];

        let resIdConfig = Restaurant[resKey]

        // let idNumber = []
        // const idNum = (idNumber) => idNumber++ 
        // this.orderID = idNum(idNumber)

        this.orderID = Math.floor(Math.random() * 100);
        this.resName = resIdConfig.resName
        this.pickUp = resIdConfig.pickUpVal
        this.resTip = resIdConfig.Tip
        this.calcTip(this.resTip)

        this.pay = this.basePay + this.distPay + this.tipCal;
        this.displayPay = formatter.format(this.pay)
        
    }
    genCustomer() {

        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          });



        // generate random number Customer key
        let customerKeyGen = Math.floor(Math.random() * 20);
        let cusKey = CustomerChance[customerKeyGen];

        let cusIdConfig = Customer[cusKey]
        this.address = cusIdConfig.address
        this.dropOff = cusIdConfig.dropOffVal
        // this.cusTip = cusIdConfig.Tip
        // this.calcTip(this.cusTip)

        // this.pay = this.basePay + this.distPay + this.tipCal;
        // this.displayPay = formatter.format(this.pay)
        
    }

    getOptions(pageKey) {
        

        if (pageKey === "root") {
            return [
            {
                label: "Accept",
                description: "Accept this offer.",
                handler: () => {
                    this.map.startCutscene([
                            { type: "addStoryFlag", flag: "ORDER_ACCEPTED"},
                            { type: "addStoryFlag", flag: this.pickUp},
                            { type: "addStoryFlag", flag: this.dropOff},
                            { type: "textMessage", text: "You accepted the order" }

                    ]);
                    console.log("Accepted Offer");
                    playerState.players.p1.orders = {[this.orderID] : [this.resName,this.address]};
                    console.log(playerState.players.p1.orders );
                    utils.emitEvent("PlayerStateUpdated"); 
                    playerState.players.p1.money = this.pay + playerState.players.p1.money;
                    
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
        <p class="resName">${this.resName}</p>
        <p class="address">Delivery to : ${this.address}</p>
        <p class="pay">${this.displayPay}</p>


        `)


    }

    close() {
        this.keyQ?.unbind();
        this.offerMenu.end();
        this.element.remove();
        // this.onComplete();
    }

    init(container) {
        this.genOffer()
        this.genCustomer()
        utils.wait(200)
        
        this.createElement();
        utils.wait(200);

        if (!playerState.storyFlags[this.storyFlag = "ORDER_ACCEPTED"] && !playerState.storyFlags[this.storyFlag = "ORDER_TAKEN"]) {
        
        this.offerMenu = new OfferMenu({
            descriptionContainer: container
        })
        this.offerMenu.init(this.element);
        this.offerMenu.setOptions(this.getOptions("root"));
        document.querySelector(".iphone_screen").appendChild(this.element);

        this.keyQ = new KeyPressListener("KeyQ", () =>{
            this.close();
        })
        
    }



    }
}
