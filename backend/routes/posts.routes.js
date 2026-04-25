import { Router } from "express";
import { activeCheck, commentPost, createPost, delete_comment_of_user, deletePost, get_comments_by_post, getAllPost, increment_likes } from "../controllers/posts.controller.js";
import multer from 'multer'

const router = Router()

const storage=multer.diskStorage({  // multer is used when we want to save uploaded img/video on coders desktop . this is becos it can't be saved on db . this is temporary soln but while deployment we have to connect this to cloud . ask gpt for explaination
    destination:(req,file,cb)=>{
        cb(null,'uploads/') //cb = callback function it is used becos cb calls upload immedaitely
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)//file already include filename and originalname
    }
})

const upload = multer({storage:storage})

router.get("/", activeCheck);

router.post("/posts",upload.single('media'),createPost) 
//upload → multer configuration (file storage, destination, etc.)
//.single() → accepts only one file
//'media' → name of the form field that contains the file

router.get("/all_posts",getAllPost)

router.delete("/deleted_post",deletePost)

router.post("/comment",commentPost)
router.get("/get_comments",get_comments_by_post)
router.delete("/delete_comment",delete_comment_of_user)
router.post("/increment_post_likes",increment_likes)

export default router;