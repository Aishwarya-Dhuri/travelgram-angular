import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit,Input,OnChanges } from '@angular/core';
import {faThumbsUp,faThumbsDown,faShareSquare} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit,OnChanges{
  @Input() post;
  faThumbsUp= faThumbsUp;
  faThumbsDown = faThumbsDown;
  faShareSquare = faShareSquare;

  uid = null;
  upvote = 0;
  downvote = 0;
  constructor(private db:AngularFireDatabase , private auth:AuthService) {
    this.auth.getUser().subscribe((user)=>{
      this.uid = user?.uid;
    })
   }

  ngOnInit(): void {
  }


  //TOdo : bug in updating the changes
  ngOnChanges():void{
    if(this.post.vote){
      Object.values(this.post.vote).map((val:any)=>{
        if(val.upvote){
          this.upvote += 1;
        }

        if(val.downvote){
          this.downvote += 1;

        }
      });
    }
  }


  upVotePost(){
    console.log("Upvoting");
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      upvote : 1
    });

  }


  downVotePost(){
    console.log("Downvoting");
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      downvote : 1
    });

  }


  getInstaUrl(){
    return `https://instagram.com/${this.post.instaId}`;
  }

}
