const express = require("express");
const router = new express.Router();
const Category = require("../models/category");

router
    .route("/")
    .post(async(req, res) => {
        const newCat = new Category(req.body);
        try {
            const category = await newCat.save();
            res.status(201).send(category);
        } catch (err) {
            res.status(500).send(`Error: ${err}`);
            console.log(err);
        }
    })
    .get(async(req, res) => {
        try {
            const cats = await Category.find();
            res.status(200).send(cats);
        } catch (err) {
            res.status(500).send(`Error: ${err}`);
        }
    });

module.exports = router;