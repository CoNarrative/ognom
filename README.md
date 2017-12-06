# ognom [![npm](https://img.shields.io/npm/v/ognom.svg)]() [![npm](https://img.shields.io/npm/l/ognom.svg)]()
Fake MongoDB for NodeJS

```js
import {MongoClient} from "mongodb"
import {Ognom} from "ognom"

describe("Ognom", () => {

  let db
  before(async () => {
    const ognom = new Ognom(MongoClient)
    db = await ognom.connect()
  })

  after(async () => {
    await db.dropDatabase()
  })
 
})
```
