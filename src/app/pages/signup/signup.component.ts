import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {finalize} from "rxjs/operators";
//Firebase(keep it separate)
import {AngularFireStorage} from "@angular/fire/storage";
import {AngularFireDatabase} from "@angular/fire/database";
//browser image resizer
import {readAndCompressImage} from "browser-image-resizer";
import { imageconfig } from './../../../utils/config';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
picture: string =
    ".././assets/user-default.png";
  uploadPercent:number = null;
  constructor(private auth:AuthService, private toastr:ToastrService,private router:Router, private db:AngularFireDatabase,private storage:AngularFireStorage) { }

  ngOnInit(): void {
  }

  onSubmit(f:NgForm){
    const{email,password,username,country,bio,name} = f.form.value;

    //further condition checks like password should be uppercase and all other scenarios

    this.auth.signUp(email,password)
    .then((res)=>{
        console.log(res);
        const {uid} = res.user;
        this.db.object(`/users/${uid}`).set({
          id: uid,
          name:name,
          email:email,
          instaUserName:username,
          country:country,
          bio: bio,
          picture : this.picture

        })

    })
    .then(()=>{
      this.router.navigateByUrl('/');
      this.toastr.success("Signup success");
    })
    .catch((err)=>{
      this.toastr.error("Signup failed");
    });

  }

  async  uploadFile(event){
      const file = event.target.files[0];
      let resizedImage = await readAndCompressImage(file,imageconfig);

      const filePath = file.name; //in production,rename the image with TODO(assignment): uuid

      const fileRef = this.storage.ref(filePath);

      const task = this.storage.upload(filePath,resizedImage);

      task.percentageChanges().subscribe((percentage)=>{
        this.uploadPercent = percentage;
      });

      task.snapshotChanges().pipe(
        finalize(()=>{
          fileRef.getDownloadURL().subscribe((url)=>{
            this.picture = url;
            this.toastr.success("Image upload success");
          })
        })
      ).subscribe();



  }



  }



