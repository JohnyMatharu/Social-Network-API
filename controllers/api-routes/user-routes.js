//Now you have to add router... to every Crud operation, check documentation and weekly activities

const {User} = require('../../models');
const router = require('express').Router();
// const user if repetitive, has to be checked

  // API Routes
  //check this format
//  /api/users

router.get('/', (req, res) => {
  //make sure this is find or findAll
    User.find({})
    //HERE
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  }),

  // get one pizza by id
  router.get('/:id', (req, res) => {
    User.findOne({ _id: req.params.id })
//GET a single user by its _id and populated thought and friend data
      .populate({
        path: 'thoughts',
        select: '-__v',

        //to be checked to have 2 paths
        path: 'friends',
        select: '-__v'
      })
      .select('-__v')
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  })
//POST a new user:

// example data


router.post('/', (req, res) => {
    User.create(req.body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
    });

//this is PUT, to update, HERE
//PUT to update a user by its _id


router.put('/:id', (req, res) => {
    User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No User found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  });

  //DELETE to remove user by its _id

 // BONUS: Remove a user's associated thoughts when deleted.
 router.delete('/:id', (req, res) => {
    User.findOneAndDelete({ _id: req.params.id })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  });

  //POST to add a new friend to a user's friend list
  router.post('/:userId/friends/:friendId', (req, res) => {
    console.log("My post friend route was hit");
    console.log(req.params.userId);
  console.log(req.params.friendId);

  res.status(200).json({message: "Route hit!"});

User.findOneAndUpdate({
_id: req.params.userId
}, {
$addToSet: {
  friends: req.params.friendId
}
}, {
  new: true
})   .then(dbUserData => {
  if (!dbUserData) {
    res.status(404).json({ message: 'No User found with this id!' });
    return;
  }
  res.json(dbUserData);
})
.catch(err => res.json(err));
});

//DELETE to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', (req, res) => {
  User.findOneAndUpdate({
  _id: req.params.userId
}, {
$pull: {
  friends: req.params.friendId
}
}, {
  new: true
})   .then(dbUserData => {
  if (!dbUserData) {
    res.status(404).json({ message: 'No User found with this id!' });
    return;
  }
  res.json(dbUserData);
})
.catch(err => res.json(err));
});
  //this is to be checked
module.exports = router;