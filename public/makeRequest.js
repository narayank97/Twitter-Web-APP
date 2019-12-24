var lastTweetBatch;
var lastTwitterHandle;

function createCORSrequet(method,url){
    let xhr = new XMLHttpRequest();
    xhr.open(method,url,true);
    return xhr; 
}

function mySearch() {
    var input, filter, outterDiv, newTweet, newTweetText, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    outterDiv = document.getElementById("newOutput");
    newTweet = outterDiv.getElementsByClassName("newTweet");
    for (i = 0; i < newTweet.length; i++) {
        a = newTweet[i];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            newTweet[i].style.display = "";
        } else {
            newTweet[i].style.display = "none";
        }
    }
}

function getTweets(){
    let input = document.getElementById("twitterHandle").value;
    lastTwitterHandle = input;
    let url = "/getTweets?twitterHandle="+input;
    let xhr = createCORSrequet('GET',url);

    if(!xhr){
        alert("CORS not supported");
        return;
    }

    xhr.onload = function(){
        let responseString = xhr.responseText;
        let object = JSON.parse(responseString);
        let JSONstring = JSON.stringify(object,undefined,2);

        if(lastTweetBatch == JSONstring){
            return;
        }
        lastTweetBatch = JSONstring;

        var myElem = document.getElementsByClassName('newTweet');
        if (myElem.length == 0){
            for(var i = 0; i < object.length; i++){
                var newDiv = document.createElement("newOutput");
                newDiv.className = "newTweet";
                var newContent = document.createTextNode(object[i].full_text);
                newDiv.appendChild(newContent);
                document.getElementById('newOutput').appendChild(newDiv);
                linebreak = document.createElement("br");
                newDiv.appendChild(linebreak);
            }
        }

        else{
            var elements = document.getElementsByClassName('newTweet');
            while(elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
            }
            for(var i = 0; i < object.length; i++){
                var newDiv = document.createElement("newOutput");
                newDiv.className = "newTweet";
                var newContent = document.createTextNode(object[i].full_text);
                newDiv.appendChild(newContent);
                document.getElementById('newOutput').appendChild(newDiv);
                linebreak = document.createElement("br");
                newDiv.appendChild(linebreak);
            }           
        }
        document.getElementById("nameOfHandle").innerHTML="These are the latest tweets of @"+lastTwitterHandle;

        
        
    };

    xhr.onerror = function(){
        alert('whoops there was an error');
    };

    xhr.send();
    
}

function getPublicTweets(){
    let url = "/getPublicTweets";
    let xhr = createCORSrequet('GET',url);

    if(!xhr){
        alert("CORS not supported");
        return;
    }

    xhr.onload = function(){
        let responseString = xhr.responseText;
        let object = JSON.parse(responseString);
        let JSONstring = JSON.stringify(object,undefined,2);

        if(lastTweetBatch == JSONstring){
            return;
        }
        lastTweetBatch = JSONstring;

        var myElem = document.getElementsByClassName('newTweet');
        if (myElem.length == 0){
            for(var i = 1; i < object.length; i+=2){
                var newDiv = document.createElement("newOutput");
                newDiv.className = "newTweet";
                var newContent = document.createTextNode(object[i].data.text);
                newDiv.appendChild(newContent);
                document.getElementById('newOutput').appendChild(newDiv);
                linebreak = document.createElement("br");
                newDiv.appendChild(linebreak);
            }
        }

        else{
            var elements = document.getElementsByClassName('newTweet');
            while(elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
            }
            for(var i = 0; i < object.length; i++){
                var newDiv = document.createElement("newOutput");
                newDiv.className = "newTweet";
                var newContent = document.createTextNode(object[i].full_text);
                newDiv.appendChild(newContent);
                document.getElementById('newOutput').appendChild(newDiv);
                linebreak = document.createElement("br");
                newDiv.appendChild(linebreak);
            }           
        }
        document.getElementById("nameOfHandle").innerHTML="These are the latest public tweets";
        
        
    };

    xhr.onerror = function(){
        alert('whoops there was an error');
    };

    xhr.send();
    
}





function myFunction(){
    var interval = setInterval(
        function () {
            if(document.getElementById("twitterHandle").value == lastTwitterHandle){
                updateTweets();
            } 
            
        }, 
    30*1000);
}
function updateTweets(){
    getTweets();
}