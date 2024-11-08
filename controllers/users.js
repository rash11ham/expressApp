const bcrypt = require('bcrypt')
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User
    .find({})
    .populate('notes');
  response.json(users);
});

usersRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body
    
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
        username,
        name,
        passwordHash
    })

    const newUser = await user.save()
    response.status(201).json(newUser);
    
    
    
})

module.exports = usersRouter
