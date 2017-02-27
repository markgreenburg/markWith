#//markWith#

<b>Link to live site:</b> <a href='https://markwith-test.herokuapp.com/'>markWith</a><br><br>
<b>Contributors:</b> <br>
Mark Greenberg, Nedra Ferguson and Deepak Shah 
<br><br>
<b>Technologies, Frameworks and Programming Languages:</b><br>
SocketIO, MongoDb, Express, Node JS, Javascript, jQuery, HTML, CSS
<br><br><b>Overview of Project:</b><br>
markWith started as a concept to build a collaborative markdown editor.  markWith allows users to create and invite collaborators to edit Markdown in real-time.

![alt tag](https://github.com/Dvshah13/markWith-Screens/blob/master/Screen%20Shot%202017-02-26%20at%203.33.40%20PM.png?raw=true)


<b>Features:</b>
* Simultaneously edit text file with others (on / route)
* See Markdown rendered from your text files in real-time
* Changes propagated to all other clients in real-time  
* Changes saved to in-app memory so it's fast
<br>
<br>
<b>Challenges faced & Solutions used:</b>
<br>1. One of the earliest challenges the team faced how to design each socket so that we could construct a new socket to handle a new document and not disturb the other socket connections. The solution we implemented was...<br>
![alt tag](https://github.com/Dvshah13/markWith-Screens/blob/master/CS1.png?raw=true)
<br><br>2. Next challenge<br>
![alt tag](https://github.com/Dvshah13/markWith-Screens/blob/master/CS2.png?raw=true)
<br><br>3. Another challenged 
![alt tag](https://github.com/Dvshah13/markWith-Screens/blob/master/CS3.png?raw=true)
<br><br>4. Challenge
<br>![alt tag](https://github.com/Dvshah13/markWith-Screens/blob/master/CS4.png?raw=true)
<br><br><b>Error handling/Troubleshooting:</b></br>
Given the back end intensive nature of our project, we faced our fair share of delicate troubleshooting issues which we eventually worked out and wanted to share what we learned from each issue.
<br><br>1. 
![alt tag](https://github.com/Dvshah13/markWith-Screens/blob/master/EH1.png?raw=true)
<br><br>2. <br>
![alt tag](https://github.com/Dvshah13/markWith-Screens/blob/master/EH1.png?raw=true)
<br><br>
<br>
<br><b>MVP and Stretch Goals:</b>
<br><b>MVP (Minimum Viable Product)</b><br>

<br><br><b>Stetch Goals</b><br>

<b><br>Contribution we'd like to be added:</b><br>


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
