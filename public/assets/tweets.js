// get tweets
// get emotions
// pass to music genetor file
let arrayOfEmotions = [];
const maxResults = 10;
let twittetUserTweets= [];
let twitterUserResultLength = 0;
let regexPattern = /[^a-z-A-Z ]/gm;
function getTweetsByUser(twitterUser) {
    twittetUserTweets= [];
    const token = "AAAAAAAAAAAAAAAAAAAAANLsHAEAAAAAWEaIgVm24L29R1SZEOFHW3JSyOU%3DdMPt50AorHw4ZKtHSCrRB0s1Me21Ly9K1PrIEvSXQ1gM0J9Eb9";
    // the emotional analysis API free tier is limited to 60 hits per minute, if ever upgraded we would ideally pull more (Twitter max is 100, default is 10)
    // this request fetches tweets from the user passed up to the max limit, filtering out retweets
    fetch("https://quiet-journey-99569.herokuapp.com/https://api.twitter.com/2/tweets/search/recent?query=from:" + twitterUser + " -is:retweet&max_results=" + maxResults, {
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        method: "GET"
    })
    .then(response => {
        return response.json()
    })
    .then(results => {
        for (let i = results.data.length - 1; i >= 0; i--) {
            console.log(i, results.data.length - 1, results.data[0], results.data[i])
            twitterUserResultLength++
            twittetUserTweets.push(results.data[i].text);
        }
        // call analyzeText to get sentiment Analysis.
        analyzeText(twittetUserTweets)
    }).catch((err) => console.log(err))
    ;
}
   // emotion analysis 1000 requests / day
   // This api returns an "emotion" object that contains the following keys: value pairs - happy, sad, angry, fear, excited :? Floating Point Number totaling to 1.0
   // TODO: The api produces a batch of tweets which is lengthy, as such a loading screen must be implemented
function analyzeText(text) {

    document.getElementById('status').textContent = `Analyzing the sentiment of the tweets`
    for (let i = 0; i < text.length; i++) {
        text[i] = text[i].replace(/['’"”“&@;]/g, "").replace(/\r?\n|\r/g, "").trim();
        let sanitizedTweet = []
        for (let j = 0; j < text[i].length; j++) {
            if (isASCII(text[i][j])) {
                sanitizedTweet.push(text[i][j])
            }
        }
        text[i] = sanitizedTweet.join(""); 
        text[i] = text[i].trim();
    }
    joinedTweets = "[" + '"' + text.join('","') + '"' + "]";
    arrayOfEmotions = [];
    const apiKey = "76WGwi6v7KV8wqTAnDd8desN3aAoaDPqBLFz5Mbzhp8";
    fetch("https://apis.paralleldots.com/v5/emotion_batch", {
        body: `api_key=${apiKey}&text=` + joinedTweets,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        arrayOfEmotions = data.emotion;
        if (arrayOfEmotions.length  === twitterUserResultLength) {
            setEmotions(arrayOfEmotions, text);
        }
    });
}

function search(){
    let userInput = document.getElementById('searchPhraseInput')
    // check if user has input text
    if (!userInput.value || userInput.value.trim().length === 0){
        alert(`Please enter a valid twitter handle to create composition!`);
        return userInput.value = '';
        
    }
    // check if it is seperated by spaces
    if ( userInput.value.split(' ').length > 1){
        alert(`A twitter handle should not be seperated by spaces. i.e ${userInput.value}`);
        return userInput.value = '';
        
    }
    // check to deny utf-8 or anything not ascii.
    if (!isASCII(userInput.value)){
        alert(`Please use simple english characters to search for twitter handles`);
        return userInput.value = ''
        
    }
    getTweetsByUser(userInput.value.trim());
    // TODO: the call for the loading screen.
    loadingScreen(true);
}


// TODO: create the loading screen.
function loadingScreen(x){
    if(x === true){
        document.getElementById("searchButton").remove();
        let userInput = document.getElementById('searchPhraseInput').value
        let statusDiv = document.createElement('div');
        let loadingDiv = document.createElement('div');
        statusDiv.setAttribute("id",'status');
        loadingDiv.setAttribute("id", "loadingScreen");

        statusDiv.textContent =  `Loading Tweets of ${userInput}`
        document.body.appendChild(statusDiv)
        document.body.appendChild(loadingDiv)
    }
    else {
        document.getElementById("status").remove();
        document.getElementById("playButton").remove();
        document.getElementById("playButtonDiv").remove();
        // document.getElementById("stopButton").remove();
    }
}

// returns boolean if characters are not in teh ascii range 
// credit goes to @zzzzBov https://stackoverflow.com/questions/14313183/javascript-regex-how-do-i-check-if-the-string-is-ascii-only
function isASCII(str) {
    return /^[\x00-\x7F]*$/.test(str);
}

function fakeSearch() {
    let data = [
            {
                happy: 0.99975,
                angry: 0.000021,
                fear: 0.000049,
                excited: 0.000012,
                indifferent: 0.000147,
                sad: 0.000021
            },
            {
                indifferent: 0.99975,
                angry: 0.000021,
                fear: 0.000049,
                excited: 0.000012,
                happy: 0.000147,
                sad: 0.000021
            },
            {
                angry: 0.000002,
                excited: 0.999982,
                fear: 0.000003,
                happy: 0.000008,
                indifferent: 0.000003,
                sad: 0.000002
            },
            {
                happy: 0.99975,
                excited: 0.000021,
                fear: 0.000049,
                angry: 0.000012,
                indifferent: 0.000147,
                sad: 0.000021
            },
            {
                angry: 0.000005,
                indifferent: 0.000005,
                fear: 0.000001,
                happy: 0.000016,
                excited: 0.99997,
                sad: 0.000003
            },
            {
                angry: 0.000005,
                excited: 0.000005,
                fear: 0.000001,
                happy: 0.000016,
                indifferent: 0.99997,
                sad: 0.000003
            },
            {
                happy: 0.99975,
                excited: 0.000021,
                fear: 0.000049,
                angry: 0.000012,
                indifferent: 0.000147,
                sad: 0.000021
            },
            {
                fear: 0.99975,
                excited: 0.000021,
                angry: 0.000049,
                happy: 0.000012,
                indifferent: 0.000147,
                sad: 0.000021
            },
            {
                sad: 0.99975,
                excited: 0.000021,
                fear: 0.000049,
                happy: 0.000012,
                indifferent: 0.000147,
                angry: 0.000021
            },
            {
                fear: 0.99975,
                happy: 0.000021,
                excited: 0.000049,
                indifferent: 0.000012,
                angry: 0.000147,
                sad: 0.000021
            },
        ]
    setEmotions(data);
}