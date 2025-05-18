class PlayerState {
    constructor() {
      
      this.players = {
        "p1": {
            playerId: "You",
            enr: 100,
            maxEnr: 100,
            money: 10,
            xp: 100,
            maxXp: 100,
            level: 1,
            orders: [],
            potentialPay: 0,
        },   
      }
      this.lineup = ["p1"];
      this.items = [
        { actionId: "item_recoverEnr", instanceId: "item1" },
        { actionId: "item_recoverEnr", instanceId: "item2" },
        { actionId: "item_recoverEnr", instanceId: "item3" },
      ]
      this.storyFlags = { "BIKE" : true };
    }
  }
  window.playerState = new PlayerState();