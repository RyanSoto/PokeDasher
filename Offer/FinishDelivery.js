class FinishDelivery {
    constructor() {

    }

    init() {
        // playerState.players.p1.money = this.pay + playerState.players.p1.money;
        playerState.players.p1.money = playerState.players.p1.potentialPay
        console.log("Delivery complete");
        utils.emitEvent("PlayerStateUpdated");        
    }
}