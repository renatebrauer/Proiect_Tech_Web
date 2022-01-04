const Notes = require("../models/notes");

const router = require('express').Router();

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

router
.route("/notes")

.get(async (req, res ) => {
    const { simplified, sortBy } = req.query;
    try {
        const notes = await Notes.findAll({
      attributes: simplified ? { exclude: "id"}: undefined,
      order: sortBy ? [[sortBy, "ASC"]] : undefined,
        });

        return res.status(200).json(notes);
    } catch(err){
        return res.status(500).json(err);
    }
})
.post(jsonParser, async(req, res)=> {
try {
    const newNotes = await Notes.create(req.body);
    return res.status(200).json(newNotes);
}catch (err){
    return res.status(500).json(err);
}




});



module.exports = router;