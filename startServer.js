const express = require('express');
const Twitter = require('twitter');
const app = express();
const PORT = process.env.PORT||3000;

var http = require('http');
var server = http.Server(app);

const https = require('https');
const request = require('request');
const util = require('util');

const get = util.promisify(request.get);
const post = util.promisify(request.post);

var lastTwitterHandle = "";
var publicTweetsArray = [];


// ENTER KEYS BEFORE USE
const my_consumer_key = process.env.my_consumer_key;
const my_consumer_secret = process.env.my_consumer_secret;
const my_access_token_key = process.env.my_access_token_key;
const my_access_token_secret =process.env.my_access_token_secret;



var client = new Twitter({
  consumer_key: my_consumer_key,
  consumer_secret: my_consumer_secret,
  access_token_key: my_access_token_key,
  access_token_secret: my_access_token_secret
});

//this function takes the input twitter handle and returns the latest 250 tweets
function getTweetsHandler(req,res,next){
    let url = req.url;
    let qObj = req.query;
    if(qObj.twitterHandle != undefined){
        var params = {screen_name: qObj.twitterHandle, include_rts : true, exclude_replies : true, count:250, tweet_mode : 'extended'};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            res.json(tweets);
         });

    }
    else{
        next();
    }
    
}

//gets a stream of public tweets and stops until our array reaches a certain size 
function getPublicTweetsHandler(req,res,next){
    if(req.url != undefined)
    {
        const bearerTokenURL = new URL('https://api.twitter.com/oauth2/token');
        const streamURL = new URL('https://api.twitter.com/labs/1/tweets/stream/sample');
        
        async function bearerToken (auth) {
            const requestConfig = {
              url: bearerTokenURL,
              auth: {
                user: my_consumer_key,
                pass: my_consumer_secret,
              },
              form: {
                grant_type: 'client_credentials',
              },
              headers: {
                'User-Agent': 'KarunsBot',
              },
            };
            const response = await post(requestConfig);
            return JSON.parse(response.body).access_token;
        }
        function streamConnect(token) {
            // Listen to the stream
            const config = {
              url: 'https://api.twitter.com/labs/1/tweets/stream/sample?format=compact',
              auth: {
                bearer: token,
              },
              headers: {
                'User-Agent': 'KarunsBot',
              },
              timeout: 15000,
            };
          
            const stream = request.get(config);
          
            stream.on('data', data => {
              try {
                const json = JSON.parse(data);
                publicTweetsArray.push(JSON);
                publicTweetsArray.push(json);
                if(publicTweetsArray.length == 400){
                    res.json(publicTweetsArray);
                    stream.abort();
                    publicTweetsArray = [];
                }
                
              } catch (e) {
                // Keep alive signal received. Do nothing.
              }
            }).on('error', error => {
              if (error.code === 'ETIMEDOUT') {
                stream.emit('timeout');
              }
            });
            return stream;
        }
        (async () => {
            let token;
          
            try {
              // Exchange your credentials for a Bearer token
              token = await bearerToken({my_consumer_key, my_consumer_secret});
            } catch (e) {
              console.error(`Could not generate a Bearer token. Please check that your credentials are correct and that the Sampled Stream preview is enabled in your Labs dashboard. (${e})`);
              process.exit(-1);
            }
            const stream = streamConnect(token);
        stream.on('timeout', () => {
            // Reconnect on error
            console.warn('A connection error occurred. Reconnecting…');
            streamConnect(token);
           
        });
        }
        )();
        
    }
   
    else{
        next();
    }
   

    
    
}


// sends over all files in public folder to user
app.use('/', express.static(__dirname + '/public'));

//once I hit localhost:3000 send home.html
app.get('/', function (req, res){
    res.sendFile(__dirname + '/public/home.html');
})


app.get('/getTweets', getTweetsHandler);
app.get('/getPublicTweets', getPublicTweetsHandler);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
