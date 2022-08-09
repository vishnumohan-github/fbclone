const router = require('express').Router();
const Post = require('../model/postSchema');
const Profile = require('../model/profileSchema');
const multer = require('multer');
const verify = require('../middleware/verifyToken');
const { stringify } = require('querystring');
const Comment = require('../model/commentSchema');

const Storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req,file,cb)=>{
      cb(null, file.originalname);
    }, 
  });
  const upload = multer({
    storage: Storage,
    limits: { fileSize: '4MB'}
  }).single('image');
  
//create a post

router.post("/post", verify,async(req, res) => {

    upload(req,res,async(err)=>{
    
        let user = req.user;
        console.log(user.id);
        if(err){
          console.log(err);
        }
        else{
          const newImage = new Post({
            userId: user.id,
            desc: req.body.desc,
            img: req.file.filename
          })
          await newImage.save()
          .then(()=> res.send({message: 'sucessfully uploaded',newImage}))
          .catch((err)=> console.log(err));
        }
      });
  });

  // get post

  router.get('/getPost',verify,async(req,res)=>{
    try{
      let user = req.user;
      console.log(user.id);
      const posts = await Post.findOne({userId: user.id});
      if(!posts) return res.status(400).send({err:'not match'});

      const profile = await Profile.findOne({userId: user.id});
      if(!profile) return res.status(403).send({err: 'not correct'});

    if(stringify(posts.userId)=== stringify(user.id)){
      return res.send({
        ...JSON.parse(JSON.stringify(posts)),
        img:`http://192.168.29.187:3000/${posts.img}`,
        profilePicture:`http://192.168.29.187:3000/${profile.profilePicture}`,
        name: profile.name,
      });
      
    }
    }catch(err){
      console.log(err)
    }
    });

// router.get('/getallPosts',verify,async(req,res)=>{
//     try{
//         let user = req.user;
//         console.log(user.id);
//         let posts = await Post.findOne({userId: user.id});
//         if(!posts)   return res.status(400).send({err:'not match'})
    
//       if(stringify(posts.userId)=== stringify(user.id)){
//         return res.send({
//           ...JSON.parse(JSON.stringify(posts)),
//           img:`http://192.168.29.187:3000/${posts.img}`
//         });
        
//       }
     
//       }catch(err){
//         console.log(err)
//       }
//       });
  
// });

// router.post('/post/:id/comment',verify, async (req, res) => {
//   let user = req.user;
//   const comment = new Comment({
//     userId: user.id,
//     postId:req.params.id,
//     text: req.body.text,
//   });
//   const post = await Post.findById(req.params.id);
//   const savedPost = post.comments.push(comment);

//   await savedPost.save(function(err, results){
//      if(err) {
//       console.log(err)
//     }
//      else{
//       return res.status(200).send(results.comments);
//      }
//    })
//   });

// router.post("/do-comment", async (req,res) =>{      
//   const comment = new Comment({comment:req.body.comment});
//   await comment.save();
//   await Post.findOneAndUpdate({_id:req.body._id}, {$push: {comment}});
//   res.send("Comment was added successfully");
// })  



// router.put('/comment',verify,async(req,res)=>{
//   const comment = {
//       text:req.body.text,
//       userId:req.user.id
//   }
//  await Post.findByIdAndUpdate(req.body.postId,{
//       $push:{comments:comment}
//   },{
//       new:true
//   })
//   .exec((err,result)=>{
//       if(err){
//           return res.status(422).json({error:err})
//       }else{
//           res.json(result)
//       }
//   })
// })

router.put('/post/:id/comment',verify, async (req, res) => {
    let user = req.user;
    const saveComment = new Comment({
      userId: user.id,
      postId:req.params.id,
      comments:[{
        text:req.body.text
      }]
    });
    await saveComment.save();
    console.log(saveComment)
    await Post.findOneAndUpdate({_id:req.params.id}, {$push: {comments:saveComment}});
    res.send("Comment was added successfully");
  
});




router.get('post/:id',verify,async(req,res)=>{
  // Post.findOneAndUpdate({_id:req.params.id}).then((Post)=>{

  //   Comment.findOne({postId:req.params.id}).then((comments)=>{
  //     res.send({comments});
  //   })
  // }).catch((err)=>{
  //   console.log(err.message)
  // })
  const comment = await Comment.findOne({postId:req.params.id});
  console.log(comment);
  if(!comment) return res.status(400).send({err:'noooo'});

  res.send({comments});
})

  module.exports = router;