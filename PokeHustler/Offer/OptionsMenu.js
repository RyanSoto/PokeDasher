class OptionMenu {
    constructor({ offer, onComplete }) {
        this.offer = offer;
        this.onComplete = onComplete;
    }
    getPages() {
        return {
            root: [
                {
                    label: "Accept",
                    description: "Accept the offer.",
                    handler:() => {
                        // accept offer, launch pick/drop off triggers
                    }
                },
                {
                    label: "Deny",
                    description: "Deny the offer.",
                    handler:() => {
                        // Deny offer
                    }
                }
    
            ]
        }
    
    }
    decide() {
        this.onComplete({
            action: Actions[ this.offer.actions[0] ],
            
        })
    }

    showMenu(container){

    }

    init(container) {

        this.showMenu(container)
    }
}