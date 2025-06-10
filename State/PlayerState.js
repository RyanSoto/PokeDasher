class PlayerState {
    constructor(config) {
      config = config || {};
      console.log("PlayerState config", config);

      this.players = {
        "p1": {
            playerId: config.players.p1.playerId ,
            enr: config.players.p1.enr ,
            maxEnr: config.players.p1.maxEnr , 
            money: config.players.p1.money,
            xp: config.players.p1.xp  ,
            maxXp: config.players.p1.maxXp ,
            level: config.players.p1.level,
            orders: config.players.p1.orders ,
            potentialPay: config.players.p1.potentialPay,
            drinks: config.players.p1.drinks ,
            day: config.players.p1.day ,
        },   
      }
      this.lineup = ["p1"];
      this.items = [
        { actionId: "item_recoverEnr", instanceId: "item1" },
        { actionId: "item_recoverEnr", instanceId: "item2" },
        { actionId: "item_recoverEnr", instanceId: "item3" },
      ]
      this.storyFlags = config.storyFlags;
    }
  }

if (  JSON.parse(localStorage.getItem("player"))) {
    window.playerState = new PlayerState(JSON.parse(localStorage.getItem("player")));

} else {
    const config = {
        players: {
            p1: {
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
                day: 2,
            }
        },
        storyFlags: {}
    };    

    window.playerState = new PlayerState(config);
    localStorage.setItem("player", JSON.stringify(window.playerState));
}

