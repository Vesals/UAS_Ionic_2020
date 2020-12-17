import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  userEmail: string;
  userID: string;
  namaDepan: string;
  namaBelakang: string;
  photo: SafeResourceUrl;
  user: any ;
  constructor(
    private navCtrl: NavController,
    private authSrv: AuthService,
    private userSrv: UserService
  ) {}

  ngOnInit(){
    this.authSrv.userDetails().subscribe(res => {
      console.log('res: ', res);
      // console.log('uid ', res.uid);
      if(res !== null){
        this.userEmail = res.email;
        this.userSrv.getAll('user').snapshotChanges().pipe(
          map(changes => 
            changes.map(c => ({key: c.payload.key, ...c.payload.val()}))  
          )
        ).subscribe(data => {
          this.user = data;
          console.log(this.user);
          console.log(this.userEmail);
          this.user = this.user.filter(User => {
              return User.email == this.userEmail
          });
          console.log(this.user);
          this.photo = 'https://cise-egypt.com/wp-content/uploads/2019/09/WELCOME-ST-IVES.jpg';
          this.namaDepan = this.user[0].nDepan;
          this.namaBelakang =this.user[0].nBelakang

        });
      }else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log(err);
    });
}

logout(){
  this.authSrv.logoutUser()
      .then(res => {
        console.log(res);
        this.navCtrl.navigateBack('');
      })
      .catch(error => {
        console.log(error);
      });
}

}