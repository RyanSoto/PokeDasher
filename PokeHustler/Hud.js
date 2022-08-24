class Hud {
    constructor() {
        this.scoreboards= [];

    }
    update() {
        this.scoreboards.forEach(s => {
            s.update(window.playerState.players[s.id])
        })
        console.log(playerState)
    }

    createElement() {

        if (this.element) {
            this.element.remove();
            this.scoreboards = [];
          }

        this.element = document.createElement("div");
        this.element.classList.add("Hud");

        const {playerState} = window;
        playerState.lineup.forEach(key => {
            const playa = playerState.players[key];
            const scoreboard = new Player({
                id: key,
                ...Runners[playa.playerId],
                ...playa,
            },null)
            scoreboard.createElement();
            this.scoreboards.push(scoreboard);
            this.element.appendChild(scoreboard.hudElement);
        })
        this.update();       
    }

init(container) {
    this.createElement();
    container.appendChild(this.element);

    document.addEventListener("PlayerStateUpdated", () => {
        this.update();
    })
}

}