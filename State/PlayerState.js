class PlayerState {
    constructor() {
      
      this.players = {
        "p1": {
            playerId: "You",
            enr: 50,
            maxEnr: 100,
            money: 0,
            xp: 90,
            maxXp: 100,
            level: 1,
            orders: [],
        },   
      }
      this.lineup = ["p1"];
      this.items = [
        { actionId: "item_recoverEnr", instanceId: "item1" },
        { actionId: "item_recoverEnr", instanceId: "item2" },
        { actionId: "item_recoverEnr", instanceId: "item3" },
      ]
      this.storyFlags = {
      };
    }
  }
  window.playerState = new PlayerState();