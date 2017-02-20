// 1. Get starting cursor position on input, send index to server to rebroadcast

window.onload = () => {
    const socket = io();
    const textPad = document.getElementById("text-pad");
    const textMarkdown = document.getElementById("markdown-target");

    /**
     * Markdown converter
     */
    const updateMarkdown = () => {
        textMarkdown.innerHTML = marked(textPad.value); // from CDN
    };

    /**
     * Socket.io
     */
     // Ensure connection happens first
     socket.on("connect", () => {

        /* Listeners */

         // Get current text once connected, bring textpad into focus
         socket.on("populate editor", (currentText) => {
             textPad.value = currentText;
             updateMarkdown();
             textPad.focus();
         });

         // Listen for text change broadcasts from socket server and replace
         // raw text. Move cursor to correct index.
         socket.on("text changed", (data) => {
             // Grab the current cursor position
             console.log(data);
             const cursorIndex = textPad.selectionStart;
             // Compare text length to determine cursor
             const changeLength = data.newText.length - textPad.value.length;
             const newCursorIndex = cursorIndex + changeLength;
             // Replace textPad text with text from server
             textPad.value = data.newText;
             // Set cursor index based on server data
             textPad.setSelectionRange(newCursorIndex, newCursorIndex);
             // Re-render markdown
             updateMarkdown();
         });

         /* Emiters */

         // Broadcast local text changes to the server and re-render markdown
         textPad.oninput = () => {
             // Get the cursor position BEFORE insertion
             const cursorIndex = textPad.selectionStart - 1;
             const cursorStart = (cursorIndex >= 0 ? cursorIndex : 0);
             socket.emit("text changed", {
                 newText: textPad.value, 
                 cursor: cursorStart
             });
             updateMarkdown();
         }
     });
}