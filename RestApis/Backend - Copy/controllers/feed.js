const { validationResult } = require('express-validator');
const path = require('path')
const fs = require('fs')

const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
  .countDocuments()
  .then(count => {
    totalItems = count;
    return Post.find()
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
  })
  .then(posts => {
    console.log(posts)
    res
      .status(200)
      .json({ message: 'Fetched posts successfully.', posts: posts, totalItems : totalItems , perPage : perPage});
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path.replace("\\","/");
  const title = req.body.title;
  const content = req.body.content;
  let creator;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    // creator: { name: 'Shreya' }
    creator: req.userId
  });
  post
    .save()
    .then(result => {
      return User.findById(req.userId);
    })
    .then(user => {
      creator = user;
      user.posts.push(post)
      return user.save();
    })
    .then(result => {
      console.log(post)
      res.status(201).json({
        message: 'Post created successfully!',
        post: post,
        creator : {
          _id : creator._id,
          name : creator.name
        }
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Post fetched.', post: post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.updatePost = (req,res,next) => {
  // console.log("update")
  const error = validationResult(req);
    if(!error.isEmpty()){
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    console.log("imageUrl : "+imageUrl)
    if(req.file){
      imageUrl = req.file.path.replace("\\","/");
    }
    console.log("imageUrl2 : "+imageUrl)
    if(!imageUrl){
      const error = new Error('No File Picked.');
      error.statusCode = 422;
      throw error;
    }
    Post.findById(postId)
    .then(post => {
      if(!post){
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error; 
      }
      if(post.creator.toString() !== req.userId){
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        throw error;
      }
      if(imageUrl !== post.imageUrl){
        clearImage(post.imageUrl)
      }
      post.title = title;
      // post.imageUrl = path.join(__dirname,'../','../',imageUrl);
      post.imageUrl = imageUrl;
      // console.log("image : " +"../"+imageUrl)
      // console.log("post image :" + post.imageUrl)
      post.content = content;
      return post.save();
    })
    .then(result => {
      res.status(200)
      .json({
        message : 'Post Updated Successfully',
        post : result
      })
    })
    .catch(err => {
      if(!err.statusCode){
        err.statusCode = 500;
      }
      next(err)
    })
}

exports.deletePost = (req,res,next) => {
  const postId = req.params.postId;
  Post.findById(postId)
  .then(post => {
    if(!post){
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error; 
    }
    // Check currently loggedIn User
    if(post.creator.toString() !== req.userId){
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    clearImage(post.imageUrl);
    return Post.findByIdAndRemove(postId)
  })
  .then(result => {
    return User.findById(req.userId)
  })
  .then(user => {
    user.posts.pull(postId)
    return user.save()
  })
  .then(result => {
    res.status(200).json({ message: 'Deleted post' })
  })
  .catch(err => {
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err)
  })
}

const clearImage = filePath => {
  // filePath = path.join(filePath);
  // console.log("filePath : ",filePath)
  fs.unlink(filePath, err => console.log(err))
}