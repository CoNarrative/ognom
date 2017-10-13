import {expect} from "chai"
import {MongoClient} from "mongodb";
import {Ognom} from "../src/index";
import {ObjectID} from "bson";

let db
before(async () => {
  const ognom = new Ognom(MongoClient)
  db = await ognom.connect()
})
describe("Ognom", () => {
  it('insertOne', async () => {
    const x = await db.collection("foo").insertOne({cool: true})
    expect(x.result).to.deep.equal({n: 1, ok: 1})
  })
  it("find", async () => {
    const x = await db.collection("foo").find({}).toArray()
    expect(x).to.be.an("array")
    expect(x.length).equals(1)
    expect(x[0]._id instanceof ObjectID).equals(true)
    expect(x[0]._id.toHexString()).to.be.a("string")
    expect(x[0].cool).equals(true)
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
