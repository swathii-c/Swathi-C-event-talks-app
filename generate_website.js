const fs = require('fs');
const path = require('path');
const talks = require('./talks_data.js'); // Assuming talks_data.js is in the same directory

const templatePath = path.join(__dirname, 'template.html');
const cssPath = path.join(__dirname, 'style.css');
const scriptPath = path.join(__dirname, 'script.js');
const outputPath = path.join(__dirname, 'index.html');

// Helper to format date for display
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

fs.readFile(templatePath, 'utf8', (err, templateHtml) => {
    if (err) {
        console.error('Error reading template.html:', err);
        return;
    }

    fs.readFile(cssPath, 'utf8', (err, cssContent) => {
        if (err) {
            console.error('Error reading style.css:', err);
            return;
        }

        fs.readFile(scriptPath, 'utf8', (err, scriptContent) => {
            if (err) {
                console.error('Error reading script.js:', err);
                return;
            }

            // Inject CSS
            let finalHtml = templateHtml.replace('<style id="injected-styles"></style>', `<style id="injected-styles">${cssContent}</style>`);

            // Inject talks data and script
            const talksDataString = JSON.stringify(talks, null, 4); // Pretty print for readability
            const injectedScript = `
                <script id="injected-script">
                    // Helper to format date for display - defined globally for access by scriptContent
                    function formatTime(date) {
                        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    }

                    const talks = ${talksDataString}; // Make talks data available globally for the script

                    ${scriptContent} // Original content of script.js (which already has DOMContentLoaded)
                </script>
            `;
            finalHtml = finalHtml.replace('<script id="injected-script"></script>', injectedScript);

            fs.writeFile(outputPath, finalHtml, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing index.html:', err);
                } else {
                    console.log('Successfully generated index.html');
                }
            });
        });
    });
});
