const { assertRevert } = require('./helpers/assertThrow')
const PubSub = artifacts.require("PubSub")

contract("PubSub", accounts => {
    let pubsub = {}
    let owner = accounts[0]
    let user1 = accounts[1]
    let user2 = accounts[2]
    let user3 = accounts[3]

    before("Deploy contracts", async () => {
        pubsub = await PubSub.new({from: owner})
        assert.ok(pubsub)
        assert.equal(await pubsub.owner(), owner, 'contract owner should be ' + owner)
    })

    context("topics", async () => {
        before("add topics", async () => {
            await pubsub.addTopic("foo", {from: owner})
            await pubsub.addTopic("bar", {from: owner})
            await pubsub.addTopic("baz", {from: owner})
        })

        it("confirm total topics", async () => {
            let topics = await pubsub.totalTopics()
            assert.equal(topics.toNumber(), 3, "should be 3 topics")
        })

        it("remove topics", async () => {
            await pubsub.removeTopic("foo", {from: owner})
            let topics = await pubsub.totalTopics()
            assert.equal(topics.toNumber(), 2, "should only be 2 topics")
        })

        it("re-add topic", async () => {
            await pubsub.addTopic("foo", {from: owner})
            let topics = await pubsub.totalTopics()
            assert.equal(topics.toNumber(), 3, "should be 3 topics")
        })

        it("owner can only add topic(s)", async () => {
            return assertRevert(async () => {
                await pubsub.addTopic("abc", {from: user1})
            })
        })

        it("owner can only remove topic(s)", async () => {
            return assertRevert(async () => {
                await pubsub.removeTopic("foo", {from: user1})
            })
        })

        it("cannot remove non-topic", async () => {
            await pubsub.removeTopic("xyz", {from: owner})
            let topics = await pubsub.totalTopics()
            assert.equal(topics.toNumber(), 3, "should be 3 topics")
        })
    })

    context("subscription", async () => {
        before("add topics", async () => {
            await pubsub.addTopic("foo", {from: owner})
            await pubsub.addTopic("bar", {from: owner})
            await pubsub.addTopic("baz", {from: owner})
        })

        beforeEach("users can subscribe", async () => {
            await pubsub.subscribe("foo", {from: user1})
            await pubsub.subscribe("foo", {from: user2})
            await pubsub.subscribe("foo", {from: user3})

            await pubsub.subscribe("bar", {from: user1})
            await pubsub.subscribe("bar", {from: user2})
            await pubsub.subscribe("bar", {from: user3})

            await pubsub.subscribe("baz", {from: user1})
            await pubsub.subscribe("baz", {from: user2})
            await pubsub.subscribe("baz", {from: user3})
        })

        it("users can unsubscribe", async() => {
            await pubsub.unsubscribe("foo", {from: user1})
            assert.isFalse(await pubsub.isSubscribed("foo", user1))

            await pubsub.unsubscribe("bar", {from: user1})
            assert.isFalse(await pubsub.isSubscribed("bar", user1))

            await pubsub.unsubscribe("baz", {from: user1})
            assert.isFalse(await pubsub.isSubscribed("baz", user1))
        })

        it("non-user should be unsubscribed", async () => {
            assert.isFalse(await pubsub.isSubscribed("foo", accounts[5]))
            assert.isFalse(await pubsub.isSubscribed("bar", accounts[5]))
            assert.isFalse(await pubsub.isSubscribed("baz", accounts[5]))
        })

        it("fails subscribing to non-topic", async () => {
            return assertRevert(async () => {
                await pubsub.subscribe("xyz", {from: user1})
            })
        })

        it("fails unsubscribing to non-topic", async () => {
            return assertRevert(async () => {
                await pubsub.unsubscribe("xyz", {from: user1})
            })
        })
    })

})
