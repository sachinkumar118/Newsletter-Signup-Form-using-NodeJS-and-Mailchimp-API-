// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

// Create an Express app
const app = express();

// Serve static files from the "public" directory
app.use(express.static("public"));

// Parse incoming request bodies in a middleware before your handlers
app.use(bodyParser.urlencoded({ extended: true }));

// Handle GET request for the root route
app.get("/", (req, res) => {
    // Send the signup.html file when accessing the root route
    res.sendFile(__dirname + "/signup.html");
});

// Handle POST request for the root route
app.post("/", (req, res) => {
    // Extract form data from the request
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    // Prepare data for Mailchimp API request
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    // Convert data to JSON string
    const jsonData = JSON.stringify(data);

    // Mailchimp API endpoint URL
    const url = "https://us8.api.mailchimp.com/3.0/lists/cd9b4f1795";

    // Options for the HTTPS request to Mailchimp API
    const options = {
        method: "POST",
        auth: "sachin:5fefc6d86d18c0f4da4c6580a156aaca-us8"
    };

    // Make an HTTPS request to Mailchimp API
    const mailchimpRequest = https.request(url, options, (response) => {
        // Check if the response status code is 200 (success)
        if (response.statusCode === 200) {
            // If successful, send the success.html file
            res.sendFile(__dirname + "/success.html");
        } else {
            // If not successful, send the failure.html file
            res.sendFile(__dirname + "/failure.html");
        }

        // Listen for data events and log the data
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });

    // Write the JSON data to the request
    mailchimpRequest.write(jsonData);
    // End the request
    mailchimpRequest.end();
});

// Handle POST request for the "/failure" route
app.post("/failure", (req, res) => res.redirect("/"));

// Start the server on either the provided PORT or default to 3000
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000.");
});
