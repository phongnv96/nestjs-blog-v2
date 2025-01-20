import { Response } from 'express';
import DailyRotateFile from 'winston-daily-rotate-file';

export interface IDebuggerLog {
    description: string;
    class?: string;
    function?: string;
    path?: string;
}

export interface IDebuggerHttpConfigOptions {
    readonly stream: DailyRotateFile;
}

export interface IDebuggerHttpConfig {
    readonly debuggerHttpFormat: string;
    readonly debuggerHttpOptions?: IDebuggerHttpConfigOptions;
}

export interface IDebuggerHttpMiddleware extends Response {
    body: string;
}
