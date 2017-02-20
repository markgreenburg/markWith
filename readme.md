### Collaborative text editor with real-time Markdown rendering ###

Currently a bare-bones, proof-of-concept implementation of an Express app that
supports real-time collaboration on Markdown.

#### Features ####
* Simultaneously edit text file with others (on / route)
* See Markdown rendered from your text files in real-time
* Changes propagated to all other clients in real-time  
* Changes saved to in-app memory so it's fast

#### Setup ####
* Git Clone / download files, extract to directory of choice, run `NPM install`
to take care of dependencies
* Start app locally with `node app.js`

#### To-Do ####
Lots of things on the to-do list. Eventually will include:
* Share documents with collaborators
* Save documents (likely using Mongo on the backend)
* Periodic document auto-save
* Private document stores
* User accounts, document sharing management, etc.
