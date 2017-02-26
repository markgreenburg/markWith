#//markWith#

<b>Link to live site:</b> <a href='http://data-soap.com/'>DataSoap</a><br><br>
<b>Technologies, Frameworks and Programming Languages:</b><br>
SocketIO, MongoDb, Express, Node JS, Javascript, jQuery, HTML, CSS
<br><br><b>Overview of Project:</b><br>
markWith started as a concept to build a collaborative markdown editor.  markWith allows users to create and invite collaborators to edit Markdown in real-time.

![alt tag]()
<br>

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
* [Mark] Take care of routing with namespaces
* Share documents with collaborators
* Save documents (likely using Mongo on the backend)
* Periodic document auto-save
* Private document stores
* User accounts, document sharing management, etc.
