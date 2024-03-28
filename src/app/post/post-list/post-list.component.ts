import { Component,Input, OnDestroy, OnInit } from '@angular/core';
import { postModel } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {

  // posts=[
  //   {title:'First post', content: "the first post content"},
  //   {title:'Second post', content: "the Second post content"},
  //   {title:'Third post', content: "the Third post content"},
  // ]

  // @Input() posts:post[]=[]

  postsList:postModel[]=[]

  // A Subscription is an object that represents a disposable resource, usually the execution of an Observable. 
  // A Subscription has one important method, unsubscribe, that takes no argument and just disposes the resource held by the subscription. 
  // In previous versions of RxJS, Subscription was called "Disposable".
  // "import { Subscription } from 'rxjs';"
  
  isLoading=false
  private postSubcrib: Subscription = new Subscription;


   constructor(public postService:PostsService){}

   ngOnInit() {
    //  this.posts=this.postService.getPosts()
     
    this.isLoading=true
    this.postService.getPosts()
    
    this.postSubcrib=this.postService.getUpdatePost().subscribe(
      (newPost:postModel[])=>{
        this.isLoading=false
        this.postsList=newPost
      }
     )
   }

   ngOnDestroy(): void {
     this.postSubcrib.unsubscribe()
     console.log("ngOnDestroy() is called!");
     
   }

   onDeletePost(postId:string){
// console.log(postId);
    this.isLoading=true
    this.postService.deletePost(postId)
   }
  
}
