class FinishDelivery {
    constructor() {


    }

    init() {
        console.log("Delivery complete");
        utils.emitEvent("PlayerStateUpdated");        
    }
}