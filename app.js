const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { post } = require("request");

require('dotenv').config({ path: __dirname + '/.env' });

const app = express();

// specifies static folder for images, css
app.use(express.static("public"));

// Because of this you can use values in post methods, you can req.body.[someValue]
// body parser is no longer needed
app.use(express.urlencoded({ extended: true }));

mailchimp.setConfig({ apiKey: process.env.MAILCHIMP_KEY, server: "us21" })

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req, res) => {

    const options = {
        method: "POST",
        auth: `hellMarty:${process.env.MAILCHIMP_KEY}`
    }


    mailchimp.lists.addListMember(process.env.SUBSCRIBERS_LIST_ID, {
        email_address: req.body.email,
        status: "subscribed",
        merge_fields: {
            FNAME: req.body.firstName,
            LNAME: req.body.lastName,
        },
    }).then(response => {
        console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`)
        res.sendFile(`${__dirname}/success.html`)
    }).catch(() => {
        res.sendFile(`${__dirname}/failure.html`)
    });
})

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is listening on port 3000")
})