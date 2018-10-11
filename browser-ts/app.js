"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = require("yargs");
var application_1 = require("./application");
var shellStartTime = Date.now();
process.on('uncaughtException', function (error) {
    if (!error) {
        error = null;
    }
    if (error.message) {
        console.error(error.message);
    }
    if (error.stack) {
        console.error(error.stack);
    }
});
application_1.default(parseCommandLine());
console.log('App load time: ' + (Date.now() - shellStartTime) + 'ms');
function parseCommandLine() {
    var options = yargs_1.default(process.argv.slice(1)).wrap(100);
    options.alias('t', 'test').boolean('t').describe('t', 'Run the specs and exit with error code on failures.');
    var argv = options.argv;
    return {
        test: argv.test
    };
}
//# sourceMappingURL=app.js.map