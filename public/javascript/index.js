window.onload = () => {
    const socket = io();
    const textPad = document.getElementById("text-pad");
    const textMarkdown = document.getElementById("markdown-target");
    let emitCursorIndex = 0;

     /* Markdown converter */
    const updateMarkdown = () => {
        textMarkdown.innerHTML = marked(textPad.value); // from CDN
    };

    /* Track emitter's pre-change cursor position */
    textPad.addEventListener('keydown', () => {
        emitCursorIndex = textPad.selectionStart;
    });

    /**
     * Socket.io
     */
     socket.on("connect", () => {
        // Join a test room, e.g. spec'd by path
        socket.emit("room", "test-room");
        /* Listeners */

        // test
        socket.on("joined super special room", (room) => {
            console.log("successfully joined super special room: " + room);
        });

         // Get current text once connected, bring textpad into focus
         socket.on("populate editor", (currentText) => {
             textPad.value = currentText;
             updateMarkdown();
             textPad.focus();
         });

         // Listen for text change broadcasts from socket server and replace
         // raw text. Move cursor to correct index.
         socket.on("text changed", (data) => {
             // Grab the local cursor position
             const cursorIndex = textPad.selectionStart;
             // Replace textPad text with text from server
             textPad.value = data.newText;
             // Set cursor index based on server data
             if (cursorIndex >= data.cursor) {
                const changeLength = data.newText.length - textPad.value.length;
                const newCursorIndex = cursorIndex + changeLength;
                textPad.setSelectionRange(newCursorIndex, newCursorIndex);
             } else {
                 textPad.setSelectionRange(cursorIndex, cursorIndex);
             }
             // Re-render markdown
             updateMarkdown();
         });

         /* Emiters */

         // Broadcast local text changes to the server and re-render markdown
         textPad.addEventListener("input", () => {
             socket.emit("text changed", {
                 newText: textPad.value, 
                 cursor: emitCursorIndex
             });
             updateMarkdown();
         });
     });
}