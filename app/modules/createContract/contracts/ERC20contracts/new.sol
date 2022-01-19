pragma solidity ^0.4.24;

contract SimpleStorage {
string storedData;uint256 count = 0;mapping(uint256 => string) public tweets;

function createTweet(uint256 tweetId, string tweet) public {
storedData = tweet;tweets[tweetId] = tweet;count+=1;
}

function getTweetByTweetId(uint256 tweetId) public view returns (string) {
return tweets[tweetId];
}

function getCount() public view returns (uint256) {
return count;
}
}