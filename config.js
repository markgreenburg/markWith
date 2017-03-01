/**
 * Configs for localhost testing ONLY
 */
const sessionSecret = process.env.SESSION_SECRET || "testSessionSecret123456";

const cookieOptions = {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true,
    signed: true
};

const mongoConfig = {
    db: 'mongodb://localhost/markwith'
};

const testDoc = {
    docName: "Demo Document",
    owner: "anonymous",
    owner_email: "anonymous",
    contents: "# Quick-Start Guide\n\n### This is a demo of markWith. Here's how it works:\n* Whatever you type in this window will automatically translate to Markdown in the right-hand pane.\n* Everything you type is saved automatically.\n* To share this doc with collaborators, just send them the link. Everyone's edits will show up in real time.\n\n### Additional features available to registered users\nSigning up for an account allows you to:\n* Store all of your documents\n* Invite collaborators to access private documents, or remove existing collaborators\n* Create and delete as many documents as you'd like\n* Name your documents\n\n### A few other Markdown examples to get you started:\n* Links: [markWith on Github](https://github.com/markgreenburg/markwith)\n* Mixed styles: _**Bold Italics**_\n* Line bre  \naks are done by adding two spaces before hitting return\n* Code: `inline` or blocks: \n```\nconst foo = (bar) => console.log(bar);\nconst baz = (biz) => {\n    const bizBiz = biz * biz;\n    console.log(bizBiz);\n};\n```\n(note that code requires backticks, NOT apostrophes)\n* Straight HTML (not recommended): <p>Some text inside a 'p' tag!</p>"
};

module.exports = {
    sessionSecret: sessionSecret,
    cookieOptions: cookieOptions,
    mongoConfig: mongoConfig,
    testDoc: testDoc
};