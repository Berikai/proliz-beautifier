// Plugin to modify the response of a specific URL
// app: The express app instance
export default (app) => ({
    // Types: request, response
    // request: Runs before the response received from the target server
    // response: Runs after the response is received from the target server
    type: 'response',
    // --- Plugin Info ---
    name: 'Example Plugin',
    description: 'Example plugin template to modify the response of a specific URL',
    author: 'John Doe',
    // ---
    // Set to true to enable the plugin
    enabled: true,
    // Function to modify the response
    // proxyRes: The response from the target server
    // req: The request object
    // res: The response object
    // content: The response content
    // editor: Function to modify the response content
    function: (proxyRes, req, res, content, editor) => {
        // Check if the request URL matches the specific URL
        if (req.url.includes('/example-url')) {
            // Modify the response content
            const modifiedContent = content.replace(/Original Text/g, 'Modified Text');
            // Use the editor function to set the modified content
            editor(modifiedContent);
        }
    }
})