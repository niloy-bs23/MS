const express=require("express");
// const { deleteUserById } = require("./userController");
const router=express.Router()

router.route('/').get(getAllUser)
router.route('/:id').get(getUserbyId).post(createUser).delete(deleteUserById).patch(updateUserById)

module.exports=router;