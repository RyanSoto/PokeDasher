class TurnCycle {
    
    constructor({ offer, onNewEvent }) {
        this.offer = offer;
        this.onNewEvent = onNewEvent;
        this.currentTeam = "player"
    }

    async turn() {

    }
    async init() {
        await this.onNewEvent({
            type: "textMessage",
            text: "You have a new offer!"
        })

        //start the first turn
        this.turn();

    }
}