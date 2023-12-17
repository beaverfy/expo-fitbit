/**
 * A library based error.
 * @extends TypeError
 */
export default class ExpoFitbitError extends TypeError {
    constructor(message: string) {
        super(message);
        this.name = `ExpoFitbitError`;
    }
}