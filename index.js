// implement your API here
const express = require("express");
const db = require("./data/db.js");
const server = express();

// MIDDLEWARE
server.use(express.json());

// GET REQUESTS
server.get("/", (req, res) => {
    res.send("This code is working just fine!");
});

server.get("/api/users", (req, res) => {
    db
        .find()
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            console.log('error', err)
            res.status(500).json({error: "That user was not found."});
        });
});

server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;
    db
        .findById(id)
        .then(user => {
            if (!user) {
                res
                    .status(404)
                    .json({error: "That user ID doesn't exist on this server."});
            } else {
                res.json(user);
            }
        })
        .catch(err => {
            console.log('error', err)
            res.status(500).json({error: "The users description is not available."});
        });
});

// POST REQUESTS
server.post("/api/users", (req, res) => {
    const userDes = req.body;
    if (!userDes.name || !userDes.bio) {
        res
            .status(400)
            .json({error: "Enter a name and bio for this user."});
    } else {
        db
            .insert(userDes)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(err => {
                console.log('error', err)
                res.status(500).json({error: "The user was not added!"});
            });
    }
});

// DELETE REQUESTS
server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(user => {
            if (!user) {
                res
                    .status(404)
                    .json({error: "That user ID doesn't exist on this server."});
            } else {
                db
                    .remove(id)
                    .then(hub => {
                        res.status(201).json(hub);
                    })
                    .catch(err => {
                        console.log('error', err)
                        res.status(500).json({error: "There was an error deleting the user."});
                    });
            }
        });
});

//PUT REQUESTS
server.put("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const change = req.body;
    db.findById(id).then(user => {
        if (!user) {
            res
                .status(404)
                .json({message: "That user ID doesn't exist on this server."});
        } else if (!change.name || !change.bio) {
            res
                .status(400)
                .json({error: "Please enter a user name and bio."});
        } else {
            db
                .update(id, change)
                .then(hub => {
                    res.status(200).json(hub);
                })
                .catch(err => {
                    console.log('error', err)
                    res.status(500).json({message: "That user was not modified!"});
                });
        }
    });
});

const port = 8000;
server.listen(port, () => console.log("API is working!."));