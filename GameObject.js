class GameObject {
  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "./images/characters/people/hero1.png",
      useShadow: config.useShadow,
    });



    //These happens once on map startup.
    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;
    
    this.talking = config.talking || [];
    this.retryTimeout = null;

  }

  mount(map) {
    // console.log("mounting!")
    this.isMounted = true;


    //If we have a behavior, kick off after a short delay
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 10)
  }

  update() {
  }

  async doBehaviorEvent(map) { 


    if (this.behaviorLoop.length === 0) {
      return;
    }

    if (map.isCutscenePlaying) {

      if (this.retryTimeout) {
        clearTimeout(this.retryTimeout);
      }
      this.retyTimeout = setTimeout(() => {
        this.doBehaviorEvent(map);
      }, 1000)
      return;
    }

    //Setting up our event with relevant info
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    //Create an event instance out of our next event config
    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init(); 

    //Setting the next event to fire
    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    } 

    //Do it again!
    this.doBehaviorEvent(map);
    

  }


}