import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Maps } from '../../model/map.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

declare var google: any;

@Component({
  selector: 'app-show-map',
  templateUrl: './show-map.page.html',
  styleUrls: ['./show-map.page.scss'],
})
export class ShowMapPage implements OnInit {
  map: any;
  infoWindow: any = new google.maps.InfoWindow();
  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;

  userEmail: string;
  userID: string;
  friends : any;
  namaDepan: string;
  namaBelakang: string;
  photo: SafeResourceUrl;
  user: any ;
  Marker: any = [] ;
  user2: any;
  ShowDataMap: any;
  dataMapNow: any;
  dataMap: any;

  constructor(
    private navCtrl: NavController,
    private authSrv: AuthService,
    private userSrv: UserService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController 
  ) { }

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

          this.userSrv.getCurrentLocation(''+this.namaDepan).snapshotChanges().pipe(
            map(changes => 
              changes.map(c => ({key: c.payload.key, ...c.payload.val()}))  
            )
          ).subscribe(data2 => {
            this.dataMapNow = data2;
            const postShowDataMapUserCenter = {
              lat: this.dataMapNow[0].lat,
              lng: this.dataMapNow[0].lng
          };
              const location = new google.maps.LatLng(postShowDataMapUserCenter.lat,postShowDataMapUserCenter.lng);
              const options = {
                center: location,
                zoom: 13,
                disableDefaultUI: true
              };
              this.map = new google.maps.Map(this.mapRef.nativeElement, options);
              this.userSrv.getFriend(this.namaDepan).snapshotChanges().pipe(
                map(changes => 
                  changes.map(c => ({key: c.payload.key, ...c.payload.val()}))  
                )
              ).subscribe(data2 => {
                  this.friends = data2;
                  // console.log(this.friends);
                  for(let i = 0; i < this.friends.length;){
                    this.userSrv.getCurrentLocation(this.friends[i].nDepan).snapshotChanges().pipe(
                      map(changes => 
                        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))  
                      )
                    ).subscribe(data3 => {
                        this.ShowDataMap = data3;
                        const postShowDataMap = {
                          lat: this.ShowDataMap[0].lat,
                          lng: this.ShowDataMap[0].lng
                      };
                      // console.log(postShowDataMap);
                      if(i == 1){
                        this.Marker[i] = new google.maps.Marker({
                          position: postShowDataMap,
                          map: this.map,
                        });  
                      }else {
                          this.Marker[i] = new google.maps.Marker({
                            position: postShowDataMap,
                            map: this.map,
                          });  
                      }
                    });
                    i++;     
                }
                if(this.dataMapNow == null){
          
                }else{
                const postShowDataMapUser = {
                    lat: this.dataMapNow[0].lat,
                    lng: this.dataMapNow[0].lng
                };
                // console.log(postShowDataMapUser);
                  this.Marker[this.friends.length] = new google.maps.Marker({
                    position: postShowDataMapUser,
                    map: this.map
                  })
                }
              });
            // console.log(this.dataMapNow);
            // console.log(data2);
          });
        });
      }else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      // console.log(err);
    });
}
ionViewDidEnter(){
  setInterval(() => {
    this.saveLoc(); 
  }, 600000);
}

public locationClicked = () => {
  if (this.map){
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.map.panTo({ lat: position.coords.latitude, lng:position.coords.longitude });
      });
    }
  }
}

saveLoc(){
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {    
      let date = new Date()

      const postData = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        time: ''+date
      }

      this.dataMap = postData;     
      // console.log(this.dataMap)
      this.userSrv.CurrentLocation(this.namaDepan,this.dataMap).then(res => {
          // console.log(res);
          this.presentToast2();
        });  
    });
  }
}

  showCurrentLoc(){
          if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            this.infoWindow.setPosition(pos);
            this.infoWindow.setContent('Your Current Location');
            this.infoWindow.open(this.map);
            const marker2 = new google.maps.Marker({
              position: pos,
              map: this.map,
            });            
            let date = new Date()
            
            const postData = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              time: ''+date
            }
            this.dataMap = postData;        

            if(this.dataMapNow.length == 0){
              this.userSrv.CurrentLocation(this.namaDepan,this.dataMap).then(res => {
                  // console.log(res);
              });
              this.presentToast();
              window.location.reload();
            }
            if(this.dataMapNow.length > 0){
              this.userSrv.DeleteLocation(this.dataMapNow[0].key,this.namaDepan).then(res => {
                this.userSrv.CurrentLocation(this.namaDepan,this.dataMap).then(res => {
                    // console.log(res);
                    this.presentToast2();
                });
              })
            }
            this.map.setCenter(pos);
          });
        }
  }

  async presentToast(){
    let toast = this.toastCtrl.create({
      message: 'Lokasi Telah Ditambah',
      color: 'primary',
      duration: 1000,
      position: 'bottom',
    });
  
    (await toast).present();
  }

  async presentToast2(){
    let toast = this.toastCtrl.create({
      message: 'Lokasi Telah Diupdate',
      color: 'primary',
      duration: 1000,
      position: 'bottom',
    });
  
    (await toast).present();
  }
  
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: "Cari Lokasi....",
      duration: 2000,
    });
    await loading.present();
  
    await loading.onDidDismiss();
  }

  showMap(pos: any){
    // console.log('test', pos);
    
  }
}
