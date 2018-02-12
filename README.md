# ognom [![npm](https://img.shields.io/npm/v/ognom.svg)]() [![npm](https://img.shields.io/npm/l/ognom.svg)]()
Real Fake MongoDB for NodeJS

## Installation
```bash
yarn add ognom --dev
```

## Usage
```js
import {Ognom} from "ognom"


let db
before(async () => {
  const ognom = new Ognom()
  db = await ognom.connect()
})
after(async () => {
  await db.dropDatabase()
})
describe("Ognom", () => {
  it('insertOne', async () => {
    const x = await db.collection("foo").insertOne({cool: true})
    expect(x.result).to.deep.equal({n: 1, ok: 1})
  })
 
  it("findOne", async () => {
    const x = await db.collection("foo").findOne({cool: true})
    expect(x._id instanceof ObjectID).equals(true)
    expect(x._id.toHexString()).to.be.a("string")
    expect(x.cool).equals(true)
  })
  
  it("findOneAndUpdate", async () => {
    const x = await db.collection("foo").findOneAndUpdate({cool: true}, {$set: {cool: false}})
    const y = await db.collection("foo").findOne({cool: false})
    expect(x.ok).equals(1)
    expect(y._id instanceof ObjectID).equals(true)
    expect(y._id.toHexString()).to.be.a("string")
    expect(y.cool).equals(false)
  })
})
```
