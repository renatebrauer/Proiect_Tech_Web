const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const path = require('path')
const Op = Sequelize.Op
const cors = require('cors')
const { ForeignKeyConstraintError, json } = require('sequelize')
const { exists } = require('fs')

const sequelize = new Sequelize('examAlbuAlex', 'root', '1234', {
    dialect: 'mysql'
})



const User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        // validate: {
        //     len: [3, 20]
        // }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true,
        // validate: {
        //     len: [6, 20]
        // }
    },
    is_admin: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    notes: {
        type: Sequelize.STRING,
        allowNull: true
    },
    photo: {
        type: Sequelize.STRING,
        allowNull: true
    },
    token: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

const Note = sequelize.define('note', {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        // validate: {
        //     len: [3, 25]
        // }
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    notebook: {
        type: Sequelize.STRING,
        allowNull: true
    },
    tags: {
        type: Sequelize.STRING,
        allowNull: true
    },
    public: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})

const Group = sequelize.define('group', {
    name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    users: {
        type: Sequelize.STRING,
        allowNull: false
    },
    notes: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

const app = express()
app.use(cors())
app.use(bodyParser.json())

//Create database
app.get('/create', async (req, res, next) => {
    try {
        await sequelize.sync({ force: true })
        res.status(201).json({ message: 'created' })
    } catch (err) {
        next(err)
    }
})

//#region USERS
//Users API
app.get('/users', async (req, res, next) => {
    const query = {
        where: {}
    }

    try {
        const users = await User.findAll(query)
        res.status(200).json(users)
    } catch (err) {
        next(err)
    }
})

app.post('/users', async (req, res, next) => {
    const errors = [];

    const user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        photo: req.body.photo,
        is_admin: req.body.is_admin,        
        token: req.body.token
    }

    // if (!user.username || !user.email || !user.password || (user.is_admin !== true && user.is_admin) !== false || !user.notes) {
    //     errors.push("Missing data. Please complete all fields!")
    // }

    // if (!/^[a-zA-Z0-9]+$/.test(user.username)) {
    //     errors.push("Invalid username!")
    // }

    // if (!/[a-zA-Z0-9_\.-]+@stud.ase.ro$/.test(user.email)) {
    //     errors.push("Invalid email!")
    // }

    // if (!/^[0-9\/]+$/.test(user.notes)) {
    //     errors.push("Invalid notes format!")
    // }

    // const exists_user = await User.findOne({ where: { username: req.body.username } });
    // if (exists_user) {
    //     errors.push("Username already in use!");
    // }

    const exists_email = await User.findOne({ where: { email: req.body.email } });
    console.log(exists_email)
    if (exists_email) {
        errors.push("Email already in use!");
        await User.update(user, { where: { id: exists_email.dataValues.id } })
        res.status(202).json({ message: 'accepted' })
    }

    if (errors.length === 0) {
        try {
            await User.create(user)
            res.status(201).json({ message: 'created' })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "User creation has failed (Server error)" })
        }
    } else {
        res.status(400).send({ errors })
    }

})



app.get('/users/:sid', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.sid)
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})

app.put('/users/:sid', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.sid)
        console.log(user)
        if (user) {
            const errors = [];

            const newUser = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                photo: req.body.photo,
                is_admin: req.body.is_admin,
                notes: req.body.notes
            }

            if (!req.body.username) {
                newUser.username = user.dataValues.username
            }

            if (!req.body.email) {
                newUser.email = user.dataValues.email
            }

            if (!req.body.password) {
                newUser.password = user.dataValues.password
            }

            if (!req.body.photo) {
                newUser.photo = user.dataValues.photo
            }

            if (req.body.is_admin !== true && req.body.is_admin !== false) {
                newUser.is_admin = user.dataValues.is_admin
            }

            if (!req.body.notes) {
                newUser.notes = user.dataValues.notes
            }

            if (!/^[a-zA-Z0-9]+$/.test(newUser.username)) {
                errors.push("Invalid username!")
            }

            if (!/[a-zA-Z0-9_\.-]+@stud.ase.ro$/.test(newUser.email)) {
                errors.push("Invalid email!")
            }

            if (!/^[0-9\/]+$/.test(user.notes)) {
                errors.push("Invalid notes format!")
            }


            if (req.body.username) {
                const exists_user = await User.findOne({ where: { username: newUser.username } });
                if (exists_user) {
                    errors.push("Username already in use!");
                }
            }

            if (req.body.email) {
                const exists_email = await User.findOne({ where: { email: newUser.email } });
                if (exists_email) {
                    errors.push("Email already in use!");
                }
            }

            if (errors.length === 0) {
                await User.update(newUser, { where: { id: req.params.sid } })
                res.status(202).json({ message: 'accepted' })
            } else {
                res.status(400).send(errors)
            }

        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})

app.delete('/users/:sid', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.sid)
        if (user) {
            await user.destroy()
            res.status(202).json({ message: 'deleted' })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})

//Update Auth Token
app.put('/users/:sid/:stoken', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.sid)
        let rettoken = req.params.stoken

        if (user) {
            const errors = [];

            const newUser = {
                username: user.username,
                email: user.email,
                password: user.password,
                photo: user.photo,
                is_admin: user.is_admin,
                notes: user.notes,
                token: rettoken
            }

            if (!rettoken || rettoken == "") {
                errors.push("Invalid token!")
            }

            if (errors.length === 0) {
                await User.update(newUser, { where: { id: req.params.sid } })
                res.status(202).json({ message: 'accepted' })
            } else {
                res.status(400).send(errors)
            }

        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})

app.get('/users/token/:sid', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.sid)
        if (user) {
            res.status(200).json(user.token)
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})
//#endregion USERS

//#region NOTES
//Notes API
app.get('/notes', async (req, res, next) => {
    const query = {
        where: {}
    }
    try {
        const notes = await Note.findAll(query)
        res.status(200).json(notes)
    } catch (err) {
        next(err)
    }
})

app.get('/notes/user/:semail', async (req, res, next) => {
    const userQuery = {
        where: {
            email: req.params.semail
        }
    }
    try {
        const user = await User.findAll(userQuery)
        //console.log("FOUND HERE:" + user[0].notes)

        var notesIds = user[0].notes.split(",");

        const query = {
            where:
            {
                id: notesIds
            }
        }
        try {
            const notes = await Note.findAll(query)
            res.status(200).json(notes)
        } catch (err) {
            next(err)
        }
    } catch (err) {
        next(err)
    }
})
app.post('/notes/user/:semail', async (req, res, next) => {
    const errors = [];

    const note = {
        title: req.body.title,
        content: req.body.content,
        notebook: req.body.notebook,
        tags: req.body.tags,
        public: req.body.public
    }

    if (!note.title || (note.public !== true && note.public !== false)) {
        errors.push("Missing data. Title and privacy are mandatory!")
    }

        

    if (errors.length === 0) {
        try {
            var noteId = await Note.create(note)

            const userQuery = {
                where: {
                    email: req.params.semail
                }
            }
            try {
                const user = await User.findAll(userQuery)
                var userNotes;
                if(user[0].notes === null) {
                    userNotes = "" + noteId.dataValues.id;
                } else {
                    userNotes = user[0].notes + ',' + noteId.dataValues.id;
                }       
                

                const newUser = {                    
                    notes: userNotes                    
                }               
                await User.update(newUser, { where: { id: user[0].id } })       
        
            } catch(e) {
                next(e)
            }

            res.status(201).json({ message: 'created' })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "Note creation has failed (Server error)" })
        }
    } else {
        res.status(400).send({ errors })
    }
})

app.get('/notes/:sid', async (req, res, next) => {
    try {
        const note = await Note.findByPk(req.params.sid)
        if (note) {
            res.status(200).json(note)
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})

app.put('/notes/:sid', async (req, res, next) => {
    const note = await Note.findByPk(req.params.sid)
    if (note) {
        let errors = []

        const newNote = {
            title: req.body.title,
            content: req.body.content,
            notebook: req.body.notebook,
            tags: req.body.tags,
            public: req.body.public,
        }

        if (!req.body.title) {
            newNote.title = note.dataValues.title
        }

        if (!req.body.content) {
            newNote.content = note.dataValues.content
        }

        if (!req.body.notebook) {
            newNote.notebook = note.dataValues.notebook
        }

        if (!req.body.tags) {
            newNote.tags = note.dataValues.tags
        }

        if (!/^[0-9A-Za-z-_\/]+$/.test(note.tags)) {
            errors.push("Invalid tags format!")
        }


        if (req.body.public !== true && req.body.public !== false) {
            newNote.public = note.dataValues.public
        }

        if (errors.length === 0) {
            try {
                await Note.update(newNote, { where: { id: req.params.sid } })
                res.status(202).json({ message: 'updated' })
            } catch (error) {
                console.log(error)
                res.status(500).send({ message: "Note update has failed (Server error)" })
            }
        } else {
            res.status(400).send({ errors })
        }

    } else {
        res.status(404).send({ message: "Note not found" })
    }
})

app.delete('/notes/:sid', async (req, res, next) => {
    try {
        const note = await Note.findByPk(req.params.sid)
        if (note) {
            await note.destroy()
            res.status(202).json({ message: 'deleted' })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})
//#endregion NOTES

//#region GROUPS
//Groups API
app.get('/groups', async (req, res, next) => {
    const query = {
        where: {}
    }
    try {
        const groups = await Group.findAll(query)
        res.status(200).json(groups)
    } catch (err) {
        next(err)
    }
})

app.post('/groups', async (req, res, next) => {
    const errors = [];

    const group = {
        users: req.body.users,
        notes: req.body.notes,
        name: req.body.name
    }

    if (!group.users) {
        errors.push("Missing data. Users are needed to define group!")
    }

    if (!/^[0-9\/]+$/.test(group.users)) {
        errors.push("Invalid users format!")
    }

    if (!/^[0-9\/]+$/.test(group.notes)) {
        errors.push("Invalid notes format!")
    }

    if (errors.length === 0) {
        try {
            await Group.create(group)
            res.status(201).json({ message: 'created' })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "Group creation has failed (Server error)" })
        }
    } else {
        res.status(400).send({ errors })
    }
})

app.get('/groups/:sid', async (req, res, next) => {
    try {
        const group = await Group.findByPk(req.params.sid)
        if (group) {
            res.status(200).json(group)
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})

app.put('/groups/:sid', async (req, res, next) => {
    const group = await Group.findByPk(req.params.sid)
    if (group) {

        let errors = []

        const newGroup = {
            users: req.body.users,
            notes: req.body.notes
        }

        if (!req.body.users) {
            newGroup.users = group.dataValues.users
        }

        if (!/^[0-9\/]+$/.test(group.users)) {
            errors.push("Invalid users format!")
        }

        if (!req.body.notes) {
            newGroup.notes = group.dataValues.notes
        }

        if (!/^[0-9\/]+$/.test(group.notes)) {
            errors.push("Invalid notes format!")
        }


        if (errors.length === 0) {
            try {
                await Group.update(newGroup, { where: { id: req.params.sid } })
                res.status(202).json({ message: 'updated' })
            } catch (error) {
                console.log(error)
                res.status(500).send({ message: "Group update has failed (Server error)" })
            }
        } else {
            res.status(400).send(errors)
        }

    }
})

app.delete('/groups/:sid', async (req, res, next) => {
    try {
        const group = await Group.findByPk(req.params.sid)
        if (group) {
            await group.destroy()
            res.status(202).json({ message: 'deleted' })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})

//#endregion GROUPS

app.use((err, req, res, next) => {
    console.warn(err)
    res.status(500).json({ message: 'server error' })
})
//#endregion GROUPS




app.listen(8080)