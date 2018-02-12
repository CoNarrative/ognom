"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const path = require("path");
const fs = require("fs-extra");
const uuid = require("uuid");
const mongodb_prebuilt_1 = require("mongodb-prebuilt");
let state = { currentPort: 27016 };
class Ognom {
    constructor(client) {
        this.client = client;
        this.mongodHelper = new mongodb_prebuilt_1.MongodHelper();
        this.generateConnectionURL = (port) => `mongodb://localhost:${port}/ognom-temp-db-${uuid.v4()}`;
        this.incPort = () => state.currentPort += 1;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const tempDir = yield this.getTempDBPath();
            const port = this.getPort();
            const connString = this.generateConnectionURL(port);
            this.mongodHelper.mongoBin.commandArguments = [
                '--port', port.toString(),
                '--storageEngine', "ephemeralForTest",
                '--dbpath', tempDir
            ];
            yield this.mongodHelper.run();
            return yield this.client.connect(connString);
        });
    }
    getPort() {
        const nextPort = this.incPort();
        if (nextPort < 65535) {
            return nextPort;
        }
        throw new Error("Out of ports");
    }
    getTempDBPath() {
        return new Promise((resolve, reject) => {
            const tempDir = path.resolve(os.tmpdir(), "ognom", Date.now().toString());
            fs.ensureDir(tempDir, (err) => {
                if (err)
                    return reject(err);
                resolve(tempDir);
            });
        });
    }
}
exports.Ognom = Ognom;
//# sourceMappingURL=index.js.map