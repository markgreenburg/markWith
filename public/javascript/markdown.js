window.onload = () => {
    const convert = () => {
        // Grab the raw text from the textarea pad
        const rawText = document.getElementById("text-pad").value;
        // Convert to Markdown and set to inner HTML of formatted element
        document.getElementById("markdown-target").innerHTML = 
        marked(rawText);
    };

    // Add event listener that will run the conversion on each input
    document.addEventListener("input", convert);
}

// Make function to convert all the text in the textarea
// Make function to run the converter on input