var tweets = [];
var hashtags = [];
var tweetIndex = 0;
var hashtagIndex = 0;
var defaultImageURL = "http://www.aedweb.org/web/images/twitter-big.png";

function init() {
    loadTweets();
}

function loadTweets() {
    $.getJSON("tweets.json", function(json) {
        // Load the JSON into the tweets array
        $.each(json, function(i, tweet) {
            tweets.push(tweet);
            updateHashtags(tweet.text);
        })
        
        // Show the initial 5 tweets
        initTweets();
        window.setInterval(scrollTweets, 3000);
        loadHashtags();
        window.setInterval(scrollHashtags, 5000);
    });
}

function loadHashtags() {
    var list = document.getElementById("hashtagList");
    for (; hashtagIndex < 7; hashtagIndex++) {
        var tag = createHashtag(hashtags[hashtagIndex]);
        list.appendChild(tag);
    }
}

function createHashtag(hashtag) {
    var tag = document.createElement("li");
    tag.className = "hashtagBox";
    tag.innerHTML = hashtag;
    
    return tag;
}

function createTweet(tweet) {
    var tag = document.createElement("li");
    tag.className = "tweetBox";
    tag.innerHTML = "<img class=\"tweetImage\" src=\"" + tweet.user.profile_image_url + "\" /><header class=\"tweetUser\">" + tweet.user.name + " (" + tweet.user.screen_name + ")</header><section class=\"tweetText\">" + tweet.text + "</section>";
    $(tag.children[0]).error(function() {
        tag.children[0].src = defaultImageURL;
    });
    
    return tag;
}

function setTweetImage(tweetElement, profileURL) {
    $.ajax({
        url: profileURL,
        type: "HEAD",
        success: function() {
            tweetElement.children[0].src = profileURL;
            alert("not error");
        }
    });
}

function initTweets() {
    var list = document.getElementById("tweetList");
    for (; tweetIndex < 5; tweetIndex++) {
        var tag = createTweet(tweets[tweetIndex]);
        list.appendChild(tag);
    }
}

function scrollTweets() {
    var list = document.getElementById("tweetList");
    
    // Add the new bottom tweet
    if (tweetIndex >= tweets.length) {
        tweetIndex = 0;
    }
    var newTweet = createTweet(tweets[tweetIndex++]);
    list.appendChild(newTweet);
    
    // Get rid of the top tweet
    var topTweet = list.children[0];
    $(topTweet).hide("slow", function() {
        $(topTweet).remove();
    });
}

function scrollHashtags() {
    var list = document.getElementById("hashtagList");
    
    // Add the new bottom hashtag
    if (hashtagIndex >= hashtags.length) {
        hashtagIndex = 0;
    }
    var newHashtag = createHashtag(hashtags[hashtagIndex++]);
    list.appendChild(newHashtag);
    
    // Get rid of the top hashtag
    var topHashtag = list.children[0];
    $(topHashtag).hide("slow", function() {
        $(topHashtag).remove();
    });
}

function updateHashtags(text) {
    var tags = text.match(/#([a-z0-9\-\_]+)/g);
    if (tags != null) {
        hashtags = hashtags.concat(tags);
    }
}