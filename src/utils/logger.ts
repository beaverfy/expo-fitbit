function red(text: string) {
    return `\x1b[38;2;255;0;0m` + text;
}

function green(text: string) {
    return `\x1b[38;2;255;0;0m` + text;
}

function yellow(text: string) {
    return `\x1b[38;2;255;247;0m` + text;
}

function blue(text: string) {
    return `\x1b[38;2;0;85;255m` + text;
}

export enum LogType {
    Debug = 1,
    Warning = 2,
    Error = 3,
    Logsnag = 0
}

export interface Message {
    text: string;
    type: LogType;
}

export class Logger {
    private currentLog: Message[] = [];
    consoleLog: boolean = false;

    constructor(consoleLog: boolean) {
        this.consoleLog = consoleLog;
    }

    setConsoleLog(value: boolean) {
        this.consoleLog = value;
    }

    print() {
        if (this.consoleLog) console.log(green(`(System)`) + ` printed logs`)
        return this.currentLog;
    }

    safeToString(value: unknown) {
        if (value == undefined) return "undefined";
        else {
            try {
                return value.toString()
            } catch (e) {
                return "(couldn't safeToString)"
            }
        }
    }

    joinText(text: unknown[]) {
        return text.map(e => this.safeToString(e)).join(" ");
    }

    debug(...text: unknown[]) {
        if (this.consoleLog) console.log(blue(`(Debug)`) + ` ${text.join(" ")}`)
        this.currentLog.push({
            text: this.joinText(text),
            type: LogType.Debug
        });

        return this;
    }

    warning(...text: string[]) {
        if (this.consoleLog) console.log(yellow(`(Warning)`) + ` ${text.join(" ")}`)
        this.currentLog.push({
            text: this.joinText(text),
            type: LogType.Warning
        });

        return this;
    }

    error(...text: string[]) {
        if (this.consoleLog) console.log(red(`(Error)`) + ` ${text.join(" ")}`)
        this.currentLog.push({
            text: this.joinText(text),
            type: LogType.Error
        });

        return this;
    }
}