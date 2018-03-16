pragma solidity ^0.4.18;

import "./Ownable.sol";

/**
 * @title PubSub
 * @dev The PubSub contracts is a ownable contract that allows for topic management
 * and keep track of which ethereum addresses are subscribed to which topics.
 */
contract PubSub is Ownable {
    address public owner;
    uint256 private nextIndex = 1;
    mapping(string => uint256) private topicIndex;
    string[] public topics;
    mapping(string => mapping(address => bool)) private topicSubscribers;

    event TopicAdded(string _topic, uint256 _topicIndex);
    event TopicRemoved(string _topic);
    event Subscribed(address _user, string _topic);
    event Unsubcribed(address _subscriber, string _topic);

    /**
     * @dev PubSub creates a new PubSub contract with the caller becoming the owner of the contract
     */
    function PubSub() public {
        owner = msg.sender;
        topics.push("");
    }

    /**
     * @dev addTopic allows the contract owner to add a new topic
     * @param _topic is the name of the topic being added
     */
    function addTopic(string _topic) onlyOwner public {
        topics.push(_topic);
        topicIndex[_topic] = nextIndex;
        TopicAdded(_topic, nextIndex);
        nextIndex++;
    }

    /**
     * @dev removeTopic allows the contract owner to remove a topic
     * @param _topic is the name of the topic being removed
     */
    function removeTopic(string _topic) onlyOwner public returns (bool) {
        if (!_topicExists(_topic)) {
            return false;
        }

        delete topics[topicIndex[_topic]];
        topics.length--;
        topicIndex[_topic] = 0;
        TopicRemoved(_topic);
        return true;
    }

    /**
     * @dev totalTopics gives the total number of contracts managed by the topic
     */
    function totalTopics() public view returns (uint256) {
        // return one less due to empty topic for non-topic index mappings
        return topics.length - 1;
    }

    /**
     * @dev subscribe registers a address to a topic
     * @param _topic the name of the topic the address wants subscription to
     */
    function subscribe(string _topic) public {
        require(_topicExists(_topic));
        topicSubscribers[_topic][msg.sender] = true;
        Subscribed(msg.sender, _topic);
    }

    /**
     * @dev unsubscribe allows an address to remove it subscription from a topic
     * @param _topic name of the topic the address wants to unsubscribe from
     */
    function unsubscribe(string _topic) public {
        require(_topicExists(_topic));
        topicSubscribers[_topic][msg.sender] = false;
        Unsubcribed(msg.sender, _topic);
    }

    /**
     * @dev isSubscribed determines if an address is currently subscribed to a topic
     * @param _topic name of the topic
     * @param _user is the address in question of subscription
     */
    function isSubscribed(string _topic, address _user) public view returns (bool) {
        if (!_topicExists(_topic)) {
            return false;
        }
        return topicSubscribers[_topic][_user];
    }

    /**
     * @dev _topicExists is a internal helper function that determines if a topic is currently managed
     * @param _topic is the name of the topic
     */
    function _topicExists(string _topic) internal view returns (bool) {
        return topicIndex[_topic] > 0;
    }
}
