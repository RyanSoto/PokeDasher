class OfferEvent {
    constructor(event, offer) {
        this.event = event;
        this.offer = offer;
    }

    textMessage(resolve) {
        const message = new TextMessage({
            text: this.event.text,
            onComplete: () => {
                resolve();
            }
        })
        message.init( this.offer.element )
    }

    init(resolve) {
        this[this.event.type](resolve);
    }
}