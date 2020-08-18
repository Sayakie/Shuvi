"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const dotEnv = __importStar(require("dotenv"));
class Config {
    static loadFromFile(path) {
        try {
            const env = dotEnv.config({ path, encoding: 'utf-8' });
            if (env.error)
                throw env.error;
            Config.parsed = Object.assign({}, Config.parsed, env.parsed);
            return env.parsed;
        }
        catch (e) {
            return process.env;
        }
    }
    static applyToProcess() {
        process.env = Config.parsed;
        Config.parsed = {};
    }
}
exports.Config = Config;
Config.parsed = {};