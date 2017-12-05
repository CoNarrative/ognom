# ognom
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
