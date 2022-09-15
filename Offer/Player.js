class Player{
    constructor(config) {
        Object.keys(config).forEach(key => {
            this[key] = config[key];
        })

        this.enr = typeof(this.enr) === "undefined" ? this.maxEnr : this.enr;

        let formatter = new Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD',});
        this.money = formatter.format(this.money)
    }

    get enrPercent() {
      const percent = this.enr / this.maxEnr * 100;
      return percent > 0 ? percent : 0;
    }
    get xpPercent() {
        return this.xp / this.maxXp * 100;
      }
    
      get isActive() {
        return this.battle?.activePlayers[this.team] === this.id;
      }
    
      get givesXp() {
        return this.level * 20;
      }
    
      createElement() {
        this.hudElement = document.createElement("div");
        this.hudElement.classList.add("Player");
        this.hudElement.setAttribute("data-player", this.id);
        this.hudElement.setAttribute("data-team", this.team);
        this.hudElement.innerHTML = (`
          <p class="Player_name">${this.name}</p>
          <p class="Player_level"></p>
          <div class="Player_character_crop">

          </div>

          <svg viewBox="0 0 26 3" class="Player_life-container">
            <rect x=0 y=0 width="0%" height=1 fill="#82ff71" />
            <rect x=0 y=1 width="0%" height=2 fill="#3ef126" />
          </svg>
          <svg viewBox="0 0 26 2" class="Player_xp-container">
            <rect x=0 y=0 width="0%" height=1 fill="#ffd76a" />
            <rect x=0 y=1 width="0%" height=1 fill="#ffc934" />
          </svg>
          <p class="Player_status">${this.money}</p>
        `);
    
        this.playerElement = document.createElement("img");
        this.playerElement.classList.add("player1");
        // this.playerElement.setAttribute("src", this.src );
        this.playerElement.setAttribute("alt", this.name );
        this.playerElement.setAttribute("data-team", this.team );
    
        this.enrFills = this.hudElement.querySelectorAll(".Player_life-container > rect");
        this.xpFills = this.hudElement.querySelectorAll(".Player_xp-container > rect");
      }
    
      update(changes={}) {
        //Update anything incoming
        Object.keys(changes).forEach(key => {
          this[key] = changes[key]
        });
    
        //Update active flag to show the correct player & hud
        this.hudElement.setAttribute("data-active", this.isActive);
        this.playerElement.setAttribute("data-active", this.isActive);
    
        //Update enr & XP percent fills
        this.enrFills.forEach(rect => rect.style.width = `${this.enrPercent}%`)
        this.xpFills.forEach(rect => rect.style.width = `${this.xpPercent}%`)

        
        let formatter = new Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD',});
        this.money = formatter.format(this.money)
        this.hudElement.querySelector(".Player_status").innerText = this.money
    
        //Update level on screen
        this.hudElement.querySelector(".Player_level").innerText = this.level;
    
        //Update status
        // const statusElement = this.hudElement.querySelector(".Player_status");
        // if (this.status) {
        //   statusElement.innerText = this.status.type;
        //   statusElement.style.display = "block";
        // } else {
        //   statusElement.innerText = `${this.money}`;
        //   statusElement.style.display = "block";
        // }
      }
    

    
      init(container) {
        this.createElement();
        container.appendChild(this.hudElement);
        container.appendChild(this.playerElement);
        this.update();
      }
}