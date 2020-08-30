// get tweets
// get emotions
// pass to music genetor file
let retrivalComplete = false;
let arrayOfEmotions = [];
const maxResults = 10;
let twittetUserTweets= [];
let twitterUserResultLength = 0;


function getTweetsByUser(twitterUser) {
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
        let concatenatedText = "";
        for (let i = 0; i < results.data.length; i++) {
            twitterUserResultLength++
            concatenatedText += results.data[i].text;
            twittetUserTweets.push(results.data[i].text);
        }
        twittetUserTweets.push(concatenatedText);
        // call analyzeText to get sentiment Analysis.
        analyzeText(twittetUserTweets)
    }).catch((err) => console.log(err))
    ;
}
   // emotion analysis 1000 requests / day
   // This api returns an "emotion" object that contains the following keys: value pairs - happy, sad, angry, fear, excited :? Floating Point Number totaling to 1.0
   // TODO: The api produces a batch of tweets which is lengthy, as such a loading screen must be implemented
function analyzeText(text) {
    arrayOfEmotions = []
    const apiKey = "76WGwi6v7KV8wqTAnDd8desN3aAoaDPqBLFz5Mbzhp8";
    fetch("https://apis.paralleldots.com/v5/emotion_batch", {
        body: `api_key=${apiKey}&text=["${text.join('","')}"]`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        arrayOfEmotions.push(data);
        // subtracting one from the len of arrayOfEmotions because it receives the extra concatenation
        // of the overal sentiment analysis
        if ((arrayOfEmotions.length - 1)  === twitterUserResultLength){
            console.log(arrayOfEmotions)
            // setEmotions(arrayOfEmotions)
            console.log(retrivalComplete, twitterUserResultLength, "it's been analyzed")
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
    // loadingScreen();
}


// TODO: create the loading screen.
// function loadingScreen(){
//     set
//     document.getElementById('loadingScreen')
// }

// returns boolean if characters are not in teh ascii range 
// credit goes to @zzzzBov https://stackoverflow.com/questions/14313183/javascript-regex-how-do-i-check-if-the-string-is-ascii-only
function isASCII(str) {
    return /^[\x00-\x7F]*$/.test(str);
}

function exportEmotions() {
    return arrayOfEmotions;
}