import { Component } from '@angular/core';
import { postModel } from './post/post.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = '_ABI_';

  // storedPost=[]
  // onStoredpost(posts:post[]){
  //   this.storedPost.push(posts)
  // }
}
