## STEPS TO RUN THIS APP WITH DOCKER

1. First enter the specific keys and tokens into startServer.js

2. On the command line go into the directory of the app.

3. Enter **docker build -t karuns-twitter-app .** on the command line.

4. After everything is downloaded enter **docker run -p 3001:3000 karuns-twitter-app** into the command line

5. Then go to **localhost:3001** in your browser

6. Enter twitter handle without the '@' and click button

7. Hopefully be amazed.

## STEPS TO RUN THIS APP WITH NPM

1. First enter the specific keys and tokens into startServer.js

2. On the command line go into the directory of the app.

3. Enter **npm install** in commnad line.

4. Enter **node startServer.js** in command line.

5. Then go to **localhost:3000** in your browser

6. Enter twitter handle without the '@' and click button

7. Hopefully be amazed.
