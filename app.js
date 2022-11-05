const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

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

    const jsonData = JSON.stringify(data);

    const url = "https://us8.api.mailchimp.com/3.0/lists/cd9b4f1795";
    const options = {
        method: "POST",
        auth: "sachin:5fefc6d86d18c0f4da4c6580a156aaca-us8"
    }

    const request =  https.request(url, options, (response) => {
      if(response.statusCode===200){
        res.sendFile(__dirname+"/success.html");
      }
      else{
        res.sendFile(__dirname+"/failure.html");
      }
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure",(req,res)=>res.redirect("/"));

app.listen(process.env.PORT || 3000, (req, res) => {
    console.log("Server is running on port 3000.");
});
