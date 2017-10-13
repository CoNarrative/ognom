import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as uuid from "uuid";
import {MongodHelper} from 'mongodb-prebuilt';
import {Db, MongoClient} from "mongodb";

let state = {currentPort: 27016}

export class Ognom {

  mongodHelper: MongodHelper = new MongodHelper();

  constructor(public client: MongoClient) { }

  async connect(): Promise<Db> {
    const tempDir = await this.getTempDBPath()
    const port = this.getPort()
    const connString = this.makeConnectionString(port)
    this.mongodHelper.mongoBin.commandArguments = [
      '--port', port.toString(),
      '--storageEngine', "ephemeralForTest",
      '--dbpath', tempDir
    ]
    await this.mongodHelper.run()
    return await this.client.connect(connString)
  }

  makeConnectionString = (port: number): string =>
    `mongodb://localhost:${port}/ognom-temp-db-${uuid.v4()}`;

  incPort = (): number => state.currentPort += 1

  getPort() {
    const nextPort = this.incPort()
    if (nextPort < 65535) {
      return nextPort
    }
    throw new Error("Out of ports")
  }

  getTempDBPath(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const tempDir: string = path.resolve(os.tmpdir(), "ognom", Date.now().toString());
      fs.ensureDir(tempDir, (err: any) => {
        if (err) return reject(err);
        resolve(tempDir);
      });
    });
  }
}
