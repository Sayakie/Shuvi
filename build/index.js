"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Shuvi_1 = require("./Shuvi");
void (async () => {
    const instance = Shuvi_1.Application.getInstance();
    await instance.setup();
})();
