# eth-pub-sub

[![CircleCI](https://circleci.com/gh/HalonProject/eth-pub-sub/tree/master.svg?style=svg)](https://circleci.com/gh/HalonProject/eth-pub-sub/tree/master)

Experimental solidity contracts that are meant to manage the subscription of addresses
to IPFS PubSub topics. These are meant to be used in conjunction with apps that wish
to not have to manage the subscriptions and just let a contract do the work.

The thought behind this is to have something like a chat application use the contract
to determine which topics (channels) can be subscribed to and which users are subscribed to which
channels. This could also be expanded upon to allow for a paid subscription model
where users can only get access to channels by paying a certain amount of ether
or a ERC20 compatible token.

## Testing

Testing the contracts can be done using truffle and running the `truffle test` command

## LICENSE

MIT
