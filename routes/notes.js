const Notes = require("../models/notes");

const router = require('express').Router();

router
.route("/notes")
.get(async (req, res ) => {
    try {
        const notes = await Notes.findAll();
        return res.status(200).json(notes);
    } catch(err){
        return res.status(500).json(err);
    }
})
.post(async(req, res)=> {
try {
    const newNotes = await Notes.create(req.body);
    return res.status(200).json(newNotes);
}catch (err){
    return res.status(500).json(err);
}




})

module.exports = router;