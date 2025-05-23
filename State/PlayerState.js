class PlayerState {
    constructor() {
      
      this.players = {
        "p1": {
            playerId: "You",
            enr: 20,
            maxEnr: 100,
            money: 15,
            xp: 100,
            maxXp: 100,
            level: 1,
            orders: [],
            potentialPay: 0,
            drinks: 2,
        },   
      }
      this.lineup = ["p1"];
      this.items = [
        { actionId: "item_recoverEnr", instanceId: "item1" },
        { actionId: "item_recoverEnr", instanceId: "item2" },
        { actionId: "item_recoverEnr", instanceId: "item3" },
      ]
      this.storyFlags = { };
    }
  }
  window.playerState = new PlayerState();