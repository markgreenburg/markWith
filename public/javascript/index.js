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

         // Get current text once connected
         socket.on("populate editor", (currentText) => {
             textPad.value = currentText;
             updateMarkdown();
         });

         // Listen for text change broadcasts from socket server and replace
         // raw text
         socket.on("text changed", (newText) => {
             textPad.value = newText;
             updateMarkdown();
         });

         /* Emiters */

         // Broadcast local text changes to the server and re-render markdown
         textPad.oninput = () => {
             socket.emit("text changed", textPad.value);
             updateMarkdown();
         }
     });
}