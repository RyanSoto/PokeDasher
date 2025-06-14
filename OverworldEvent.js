class OverworldEvent {
  constructor({ map, event}) {
    this.map = map;
    this.event = event;
  }

  stand(resolve) {
    const who = this.map.gameObjects[ this.event.who ];
    who.startBehavior({
      map: this.map
    }, {
      type: "stand",
      direction: this.event.direction,
      time: this.event.time
    })
    
    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandComplete", completeHandler);
        resolve();
      }
    }
    document.addEventListener("PersonStandComplete", completeHandler)
  }  
  
  drink(resolve) {
    const who = this.map.gameObjects[ this.event.who ];
    who.startBehavior({
      map: this.map
    }, {
      type: "drink",
      direction: this.event.direction,
      time: this.event.time
    })
    
    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonDrinkComplete", completeHandler);
        resolve();
      }
    }
    document.addEventListener("PersonDrinkComplete", completeHandler)
  }

  walk(resolve) {
    const who = this.map.gameObjects[ this.event.who ];
    who.startBehavior({
      map: this.map
    }, {
      type: "walk",
      direction: this.event.direction,
      retry: true
    })
    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    }
    document.addEventListener("PersonWalkingComplete", completeHandler)

  }
  
  textMessage(resolve) {

    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
    }
    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve()
    })
    message.init( document.querySelector(".game-container") )
  }  
  
  shopTextMessage() {

    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
    }
    const message = new TextMessage({
      text: this.event.text,
      // onComplete: () => resolve()
    })
    message.init( document.querySelector(".game-container") )
  }  

  choiceMessage(resolve) {

    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
    }
    const message = new ChoiceMessage({
      map: this.map,
      text: this.event.text,
      onComplete: () => resolve()
    })
    message.init( document.querySelector(".game-container") )
  }

  shoutMessage(resolve) {

    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
    }
    const message = new ShoutMessage({
      text: this.event.text,
      onComplete: () => resolve()
    })
    message.init( document.querySelector(".game-container") )
  }


  changeMap(resolve) {
    //Deactivate old objects
    Object.values(this.map.gameObjects).forEach(obj => {
      obj.isMounted = false;
    })

    const sceneTransition = new SceneTransition();
    sceneTransition.init(document.querySelector(".game-container"), () => {
      this.map.overworld.startMap( window.OverworldMaps[this.event.map],  {
        x: this.event.x,
        y: this.event.y,
        direction: this.event.direction,
      });
      resolve();
      
      sceneTransition.fadeOut();
    })
  }

  // offer(resolve) {
  //   const offer = new Offer({
  //     onComplete: () => {
  //       resolve();
  //     }
  //   })
  //   offer.init(document.querySelector(".game-container"));
  // }

  phone(resolve) {
    if (this.map.isPaused) {
      resolve();
      return;
    } 
    console.log("Phone up")
    this.map.isPaused = true
    const phone = new Phone({
      // dispatcher: Dispatcher[this.event.dispatcherId],
      // restaurant: Restaurant[this.event.restaurantId],
      map: this.map,
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.overworld.startGameLoop();
      }
    })
  
    phone.init(document.querySelector(".game-container"));
  }

  addStoryFlag(resolve) {
    window.playerState.storyFlags[this.event.flag] = true;
    resolve();
  }

  removeStoryFlag(resolve) {
    window.playerState.storyFlags[this.event.flag] = false;
    resolve();
  }

  finishDelivery(resolve){
    playerState.players.p1.money = playerState.players.p1.potentialPay
    console.log("Delivery complete");
    utils.emitEvent("PlayerStateUpdated");       
    resolve();
    }
  
  death(resolve){
    playerState.players.p1.maxEnr -= 30
    playerState.players.p1.enr = playerState.players.p1.maxEnr
    if (playerState.players.p1.money >= 50) {
      playerState.players.p1.money -= 50
    }
    else{playerState.players.p1.money = 0}
    utils.emitEvent("PlayerStateUpdated"); 

    resolve();
  } 
  
  sleep(resolve){
    playerState.players.p1.maxEnr = 100
    playerState.players.p1.day += 1
    playerState.players.p1.enr = playerState.players.p1.maxEnr
    if (playerState.players.p1.day > 6 /*&& playerState.players.p1.day % 7 === 0*/) {
      if (playerState.players.p1.money <= 25) {
        playerState.players.p1.money = 0;
      } else {
        playerState.players.p1.money -= 25;
      }
    }
    utils.emitEvent("PlayerStateUpdated"); 
    localStorage.setItem("player", JSON.stringify(playerState));
    resolve();
  } 

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)      
    })
  }

}