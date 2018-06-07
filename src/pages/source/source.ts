import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-source',
  templateUrl: 'source.html',
})
export class SourcePage {

  private remoteJsonUrl: string;
  private defaultRemoteUrl: string = "https://api.jsonbin.io/b/5b13ebabc83f6d4cc734a8b1"
  private isenabled: boolean;
  private addGeofenceIsEnabled: boolean;
  private jsonData: any;
  private jsonDataString: string;
  private radius: number;
  private action: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public http: Http, private toastCtrl: ToastController) {
    this.remoteJsonUrl = this.defaultRemoteUrl;
    this.isenabled = true;
    this.addGeofenceIsEnabled = false;

    this.storage.get('storage_remote_url').then((savedRemoteUrl) => {
      if (savedRemoteUrl != null && savedRemoteUrl != '' && savedRemoteUrl != undefined) {
        this.remoteJsonUrl = savedRemoteUrl;
      }
    });
    this.storage.get('storage_radius').then((saveRadius) => {
        this.radius = saveRadius;
    });

    this.storage.get('storage_action').then((saveAction) => {
        this.action = saveAction;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SourcePage');
  }

  public loadJson() {
    this.addGeofenceIsEnabled = false;
    this.isenabled = false;
    this.http.get(this.remoteJsonUrl)
      .map(res => res.json())
      .subscribe(
        data => {
          try{
            this.jsonData = data;
            this.jsonDataString = JSON.stringify(this.jsonData ,null,"    ");
            this.getJsonSuccess();
          } catch(e){
            console.log("Error ",e);
            this.jsonData = null;
            this.jsonDataString = null;
            this.getJsonError();
          }          
        },
        err => {
          this.getJsonError();
        }
      );
  }

  public addToGeofence(){
    this.addToGeofenceSuccess();
  }

  public getJsonSuccess() {
    this.addGeofenceIsEnabled = true;
    let toast = this.toastCtrl.create({
      message: 'Settings successfully saved!',
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      this.isenabled = true;
    });
  
    toast.present();
  }

  public getJsonError() {
    let toast = this.toastCtrl.create({
      message: 'Error retriving json file from remote, check URL and connection',
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      this.isenabled = true;
    });
  
    toast.present();
  }

  public addToGeofenceSuccess() {
    this.addGeofenceIsEnabled = true;
    let toast = this.toastCtrl.create({
      message: 'Geofence successfully added!',
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      this.isenabled = true;
      this.addGeofenceIsEnabled = false;
    });
  
    toast.present();
  }

}
