const express = require('express')
const router = express.Router()
const { getAllUsers, updateUser, deleteUser, getSingleUser, searchUsers } = require("../controllers/userController")
/* const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT) */

router.route("/search").get(searchUsers); 

router.route("/")
    .get(getAllUsers)
    .patch(updateUser)
    .delete(deleteUser)

router.route("/:id")
    .get(getSingleUser)



module.exports = router
