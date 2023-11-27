const express = require('express');
const router = express.Router();

const ActorController = require('../controllers/actor.c');

router.get('/search', ActorController.searchActor);
router.get('/:actorId', ActorController.getActorDetail);

module.exports = router