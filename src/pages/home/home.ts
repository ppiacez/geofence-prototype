import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import leaflet from 'leaflet';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapContainer: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, private geolocation: Geolocation, private diagnostic: Diagnostic) {

  }

  ionViewDidEnter() {
    this.loadmap();
  }

  loadmap() {
    this.map = leaflet.map("map").fitWorld();
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);
    this.askPosition();

  }

  public askPosition() {
    this.diagnostic.isLocationAuthorized().then((enabled) => {
      console.log("Location is " + (enabled ? "enabled" : "disabled"));
      if (!enabled) {
        this.diagnostic.requestLocationAuthorization().then((status) => {
          console.log("Authorization status is now: " + status);
          this.centerMap();
        }, (error) => {
          console.error(error);
        });
      } else {
        this.centerMap();
      }
    }, (error) => {
      console.error("The following error occurred: " + error);
    });
  }


  public centerMap() {

    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      console.log("found position ", resp);
      this.map.flyTo([resp.coords.latitude, resp.coords.longitude], 10);
      let markerGroup = leaflet.featureGroup();
      let marker: any = leaflet.marker([resp.coords.latitude, resp.coords.longitude]).on('click', () => {
        alert('Marker clicked');
      })
      markerGroup.addLayer(marker);
      this.map.addLayer(markerGroup);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

}
