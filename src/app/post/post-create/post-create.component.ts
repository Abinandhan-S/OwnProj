import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { postModel } from '../post.model';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  
  postTitle=""
  postContent=""
  // @Output() newPost= new EventEmitter<post>();

  private mode='create'
  private postId:string
  imagePreview:string
  post:postModel
  isLoading=false
  form:FormGroup

  constructor(public postService:PostsService, public route:ActivatedRoute){}
 
  ngOnInit(): void {

    this.form= new FormGroup({
      title: new FormControl (null,{
        validators:[Validators.required, Validators.minLength(3)]
      }),
      content:new FormControl(null,{
        validators:[Validators.required]
      }),
      image:new FormControl(null,{
        validators:[Validators.required],
        asyncValidators:[mimeType]
      })
    })


    this.route.paramMap.subscribe(
      (paramMap:ParamMap)=>{
        if(paramMap.has('postId')){
          this.mode='edit'
          this.postId=paramMap.get('postId')
          // this.post=this.postsService.getEditPost(this.postId)
          this.isLoading=true
          this.postService.getEditPost(this.postId).subscribe(
            postData=>{
              this.isLoading=false;
              this.post={
                id:postData._id,
                title:postData.title,
                content:postData.content,
                imagePath:null
              }
              this.form.setValue({
                title:this.post.title,
                content:this.post.content
              })
            }
        )}
        else{
          this.mode='create'
          this.postId=null
        }
      }
    )
  }

  onImgPicker(event:Event){
    const file= (event.target as HTMLInputElement).files[0]
    this.form.patchValue({
      image:file
    })
    this.form.get('image').updateValueAndValidity()
    console.log(file);
    // console.log(this.form);
    
    const reader = new FileReader()
    reader.onload=()=>{
      this.imagePreview=reader.result as string
    }
    reader.readAsDataURL(file)

    
  }
  
  onSavePost(){

    if(this.form.invalid){
      return
    }

    this.isLoading=true

  //  const post:post={
  //     title:form.value.title,
  //     content:form.value.content      
  //   };
  //   this.newPost.emit(post)

  if(this.mode==='create'){

    this.postService.addPosts(
      this.form.value.title,
      this.form.value.content, 
      this.form.value.image
    )
  }
  else{

    console.log("Post Edit updated successfully!");
    this.postService.updatePost(
      this.postId,
      this.form.value.title,
      this.form.value.content)
  }
    this.form.reset()
    this.isLoading=false
  }
  
}
