class PlayerState {
    constructor() {
      this.players = {
        "p1": {
            playerId: "You",
            enr: 90,
            maxEnr: 100,
            money: 100,
            order: false,
            xp: 90,
            maxXp: 100,
            level: 1,
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
  
    // swapLineup(oldId, incomingId) {
    //   const oldIndex = this.lineup.indexOf(oldId);
    //   this.lineup[oldIndex] = incomingId;
    //   utils.emitEvent("LineupChanged");
    // }
  
    // moveToFront(futureFrontId) {
    //   this.lineup = this.lineup.filter(id => id !== futureFrontId);
    //   this.lineup.unshift(futureFrontId);
    //   utils.emitEvent("LineupChanged");
    // }
  
  }
  window.playerState = new PlayerState();