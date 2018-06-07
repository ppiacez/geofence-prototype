import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage'

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  private radius: number;
  private action: number;
  private isenabled: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,private toastCtrl: ToastController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    this.radius = 100;
    this.action = 1;
    this.isenabled = true;

    this.storage.get('storage_radius').then((saveRadius) => {
      if (saveRadius != null && saveRadius != '' && saveRadius != undefined) {
        this.radius = saveRadius;
      }
    });

    this.storage.get('storage_action').then((saveAction) => {
      if (saveAction != null && saveAction != '' && saveAction != undefined) {
        this.action = saveAction;
      }
    });

  }

  public saveSettings(){

    this.isenabled = false;
    this.storage.set('storage_radius', this.radius );
    this.storage.set('storage_action', this.action );
    this.saveSuccess();
  }

  public saveSuccess() {
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



}
