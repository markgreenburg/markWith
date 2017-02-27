window.addEventListener('load', () => {
    const socket = io(); // defined in script include
    const textPad = document.getElementById("text-pad");
    const textMarkdown = document.getElementById("markdown-target");
    const docId = document.getElementById("docId").value;
    const room = docId;
    let emitCursorIndex = 0;

    /* Markdown converter */
    const updateMarkdown = () => {
        textMarkdown.innerHTML = marked(textPad.value); // definition from CDN
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
        socket.emit("room", room);
        /* Listeners */

         // Get current text once connected, bring textpad into focus
         socket.on("populate editor", (currentText) => {
             textPad.value = currentText.contents;
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
                 cursor: emitCursorIndex,
                 docId: room
             });
             updateMarkdown();
         });
     });

    /* Tab-to-space converter */
    textPad.addEventListener("keydown", (event) => {
        if (event.keyCode === 9) {
            event.preventDefault();
            const start = textPad.selectionStart;
            const end = textPad.selectionEnd;
            const text = textPad.value;
            textPad.value = text.substring(0, start) 
                    + "    " // Spaces, not tabs!
                    + text.substring(end);
            textPad.setSelectionRange(start + 4, start + 4);
            // Fire the input eventListener
            textPad.dispatchEvent(new Event("input"));
        }
    });
});