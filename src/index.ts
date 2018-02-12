import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as uuid from "uuid";
import {MongodHelper} from 'mongodb-prebuilt';
import {Db, MongoClient} from "mongodb";

let state = {currentPort: 27016}

export class Ognom {

  mongodHelper: MongodHelper = new MongodHelper();

  constructor(public client?: MongoClient) { }

  async connect(): Promise<Db> {
    const tempDir = await this.getTempDBPath()
    const port = this.getPort()
    const connString = this.generateConnectionURL(port)
    const dbName = this.generateDbName()
    const mongoURL = connString + "/" + dbName

    this.mongodHelper.mongoBin.commandArguments = [
      '--port', port.toString(),
      '--storageEngine', "ephemeralForTest",
      '--dbpath', tempDir
    ]

    try {
      await this.mongodHelper.run()
    } catch (e) {
      console.info(e)
    }
    const conn:MongoClient = await MongoClient.connect(mongoURL)
    const db:Db = conn.db(dbName)
    return db

    // return await this.client.connect(connString)
  }

  generateDbName = (): string =>
    `ognom-temp-db-${uuid.v4()}`

  generateConnectionURL = (port: number): string =>
    `mongodb://localhost:${port}`;

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
