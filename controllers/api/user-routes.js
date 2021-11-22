const router = require('express').Router();
const { User } = require('../../models');

// CREATE new user
router.post('/', async (req, res) => {
  console.log(req.session)
  User.create({
    username: req.body.username,
    password: req.body.password
  }).then(dbUserData => {
    console.log('post create', dbUserData)
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;

      res.json(dbUserData)
    })
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err)
  })
});

// Login
router.post('/login', async (req, res) => {
 User.findOne({
   where: {
     username: req.body.username
   }
 }).then(dbUserData => {
   if(!dbUserData){
     res.status(400).json({message: "No User Found"});
     return;
   }

   const checkPassword = dbUserData.checkPassword(req.body.password);
   if(!dbUserData){
    res.status(400).json({message: "Password Incorrect"});
    return;
   }

   req.session.save(() => {
    req.session.user_id = dbUserData.id;
    req.session.username = dbUserData.username;
    req.session.loggedIn = true;

    res.json(dbUserData)
  })
 })
});

// Logout
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;