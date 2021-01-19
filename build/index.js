console.log('hi');
import { Config } from './bootloader/Config';
await Config.parse();
console.log('hi3');
console.log(process.env);
console.log(process.env.CLIENT_BOOT_TIMEOUT);
console.log('hi2');
