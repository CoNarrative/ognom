import { MongodHelper } from 'mongodb-prebuilt';
import { Db, MongoClient } from "mongodb";
export declare class Ognom {
    client: MongoClient;
    mongodHelper: MongodHelper;
    constructor(client: MongoClient);
    connect(): Promise<Db>;
    makeConnectionString: (port: number) => string;
    incPort: () => number;
    getPort(): number;
    getTempDBPath(): Promise<string>;
}
