class FinishDelivery {
    constructor() {

        this.basePay = 0 + 1;
        this.distPay = 1 * 1;
        this.tip = 1.2 * 13;
        this.pay = this.basePay + this.distPay + this.tip;
        // const playerState = window.playerState;
        this.scoreboards = [];
    }

    init() {
        console.log("Delivery complete");
        playerState.players.p1.money = this.pay + playerState.players.p1.money;
        utils.emitEvent("PlayerStateUpdated");
        // console.log(playerState);
        
    }
}