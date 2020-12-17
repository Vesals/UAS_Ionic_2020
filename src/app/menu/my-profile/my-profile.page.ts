import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { SafeResourceUrl } from '@angular/platform-browser';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {

  userEmail: string;
  userID: string;
  namaDepan: string;
  namaBelakang: string;
  photo: SafeResourceUrl;
  user: any;
  feed: any;
  constructor(
    private navCtrl: NavController,
    private authSrv: AuthService,
    private userSrv: UserService,
    private storage: AngularFireStorage,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController 
  ) {}

  ngOnInit(){
      this.authSrv.userDetails().subscribe(res => {
        if(res !== null){
          this.userEmail = res.email;
          this.userSrv.getAll('user').snapshotChanges().pipe(
            map(changes => 
              changes.map(c => ({key: c.payload.key, ...c.payload.val()}))  
            )
          ).subscribe(data => {
            this.user = data;
            this.user = this.user.filter(User => {
                return User.email == this.userEmail
            });
            this.photo = this.user[0].imageUrl;
            this.namaDepan = this.user[0].nDepan;
            this.namaBelakang =this.user[0].nBelakang

            this.showFeed(this.namaDepan);
          });
        }else {
          this.navCtrl.navigateBack('');
        }
      }, err => {
        // console.log(err);
      });
  }

  showFeed(nDepan: string){
    this.userSrv.getCurrentLocation(''+nDepan).snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))  
      )
    ).subscribe(data2 => {
      this.feed=data2;
    });
  }

  deleteLoc(key: string){
    this.presentLoading().then(() => {
    this.userSrv.DeleteLocation(key, this.namaDepan).then(res => {
      
    })
    this.presentToast();
  })
  }
  
  async presentToast(){
    let toast = this.toastCtrl.create({
      message: 'Location telah dihapus',
      color: 'primary',
      duration: 1000,
      position: 'bottom',
    });
  
    (await toast).present();
  }
  
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: "Deleting Location....",
      duration: 2000,
    });
    await loading.present();
  
    await loading.onDidDismiss();
  }

  async presentToast2(){
    let toast = this.toastCtrl.create({
      message: 'User Telah Logout',
      color: 'primary',
      duration: 1000,
      position: 'bottom',
    });
  
    (await toast).present();
  }
  
  async presentLoading2() {
    const loading = await this.loadingCtrl.create({
      message: "Logout....",
      duration: 2000,
    });
    await loading.present();
  
    await loading.onDidDismiss();
  }


  logout(){
    this.presentLoading2().then(() => {
          this.authSrv.logoutUser()
        .then(res => {
          // console.log(res);
          this.presentToast2
          this.navCtrl.navigateBack('');
        })
        .catch(error => {
          // console.log(error);
        });
    });
  }
}

