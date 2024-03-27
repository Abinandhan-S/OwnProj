import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { postModel } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { response } from 'express';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts:postModel[]=[]

  // An RxJS Subject is a special type of Observable that allows values to be multicast to many Observers.
  // Subjects are like Event Emitters: they maintain a registry of many listeners.
  // It is a multicast observable that maintains a list of observers and notifies all of them when a new value is emitted using the next() method
  private postUpdated= new Subject<postModel[]>()

  constructor(private http:HttpClient, private router:Router){}

  getPosts(){

    // return [...this.posts];
    // return this.posts;
    console.log("getPosts() is called!");
    
    this.http.get<{
                    message:string,
                    posts:any
                  }>
                  ('http://localhost:3000/api/posts/')
      
    // .subscribe((postsData)=>{
    //   console.log(postsData.message)
    //   this.posts=postsData.post;
    //   this.postUpdated.next([...this.posts])
    // })

    // .pipe() method is using for accept adding multiple operator 
    //  "import { map } from 'rxjs/operators'"

    // map operator allows to transform every element of an array into new element and store them all back into new array
    
    .pipe(map((postData)=>{
      return postData.posts.map((post)=>{
        return {
          title:post.title,
          content:post.content,
          id:post._id,
          imagePath:post.imagePath
        }
      })
    }
    ))

    //The subscribe() method calls the observable's function that produces and emits data. 
    // Thus, subscribing to an observable starts a flow of data between the observable and the observer. 
    .subscribe(trnsformdata=>{
      this.posts=trnsformdata;
      this.postUpdated.next([...this.posts])
    })

  }

  getEditPost(EditPostId:string){
    // return {...this.posts.find(p=>p.id===EditPostId)}

    return this.http.get<{
      _id:string, 
      title:string, 
      content:string,
      imagePath:string}>
      ("http://localhost:3000/api/posts/"+EditPostId)

  }


  getUpdatePost(){
    // Creates a new Observable with this Subject as the source. 
    // You can do this to create custom Observer-side logic of the Subject and conceal it from code that uses the Observable.
    console.log("getUpdatePost() is called!");
    return this.postUpdated.asObservable()
  }

  addPosts(title:string, content:string, image:File){
    // const addedPost:postModel={
    //   id:null,
    //   title:title,
    //   content:content
    // }

    const addPostData= new FormData()
    addPostData.append('title',title)
    addPostData.append('content',content)
    addPostData.append('image',image,title)
    console.log(addPostData);
    
    this.http.post<{
                    message:string,
                    postOfData:postModel
                  }>(
                    ("http://localhost:3000/api/posts/"),
                    // addedPost
                    addPostData
                    )
    .subscribe((responseData)=>{

    console.log(responseData.message);
    const addedPost:postModel=({
      id:responseData.postOfData.id,
      title:title,
      content:content,
      imagePath:responseData.postOfData.imagePath
    })

    // addedPost.id= responseData.createdPostId

    this.posts.push(addedPost)
    this.postUpdated.next([...this.posts])
    this.router.navigate(['/'])
    })

  }

  updatePost(updatePostId:string, updatePostTitle:string, updatePostContent:string, updatePostImage:File|string){

  //  const editedPost:postModel={
  //       id:updatePostId,
  //       title:updatePostTitle,
  //       content:updatePostContent,
  //       imagePath:null
  //  }

  let editedPost:postModel|FormData
    if(typeof(updatePostImage)=='object'){
      editedPost=new FormData()
      editedPost.append('id',updatePostId),
      editedPost.append('title',updatePostTitle),
      editedPost.append('content', updatePostContent),
      editedPost.append('image',updatePostImage,updatePostTitle)
    }

    else{
        editedPost={
            id:updatePostId,
            title:updatePostTitle,
            content:updatePostContent,
            imagePath:updatePostImage
         }
    }

   
   this.http.put("http://localhost:3000/api/posts/"+updatePostId, editedPost)
   .subscribe(response=>{
    // console.log(response);
    const updatePostsData =[...this.posts]
    console.log(updatePostsData);
    
    const oldPostIndex = updatePostsData.findIndex(p=>p.id===updatePostId)
    console.log(oldPostIndex);
    const editedPost={
      id:updatePostId,
      title:updatePostTitle,
      content:updatePostContent,
      imagePath:""
   }

    updatePostsData[oldPostIndex]==editedPost
    this.posts=updatePostsData
    this.postUpdated.next([...this.posts])
    this.router.navigate(['/'])
    }
  )
  console.log("Edited the post successfully!");

  }


  deletePost(PostId:string){
      this.http.delete("http://localhost:3000/api/posts/"+PostId)
      .subscribe(()=>{
        console.log("Deleted the post!");
        const updatedPostDeletion=this.posts.filter(updatedPost=>updatedPost.id!==PostId)
        console.log(updatedPostDeletion);
        
        this.posts=updatedPostDeletion
        this.postUpdated.next([...this.posts])
      })
  }

  
  
}
