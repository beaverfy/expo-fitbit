/**
 * A library based error.
 * @extends TypeError
 */
export default class ExpoFitbitError extends TypeError {
    constructor(message) {
        super(message);
        this.name = `ExpoFitbitError`;
    }
}
//# sourceMappingURL=error.js.map