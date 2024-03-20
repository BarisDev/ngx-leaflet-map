import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FeatureGroup, Marker, divIcon, icon, latLng, tileLayer } from 'leaflet';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'map';

    lat = 36.2022368;
    lng = 36.1593388;
    map: any;

    mapMarkers: any = [];
    options: any = null;
    constructor (private http: HttpClient) {}
    
    ngOnInit(): void {
        this.initMap();
    }

    initMap = () => {
        const lat = (this.lat && this.lat != undefined) ? this.lat : 41.00650212603;
        const lng = (this.lng && this.lng != undefined) ? this.lng : 28.8530806151128;

        this.options = {
            zoomControl: true,
            maxZoom: 20,
            minZoom: 3,
            center: latLng(lat, lng),
            zoom: 20,
            attributionControl: false,
        }

        setTimeout(() => {
            this.map.invalidateSize();
        }, 300);
    }

    onMapReady = (map: any) => {
        this.map = map;

        const tileLayers = {
            'Google Uydu': tileLayer('https://{s}.google.com/vt/lyrs=s,h&hl=tr&x={x}&y={y}&z={z}', {
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                maxNativeZoom: 20,
                zIndex: 0,
                maxZoom: 20
            })
        };
        tileLayers['Google Uydu'].addTo(this.map);

        this.http.get(environment.api + '/points').subscribe((data: any) => {
            data.forEach((el: any) => {
                let byMarker = new Marker(latLng(el.lat, el.lng), {
                    draggable: false,
                    icon: icon({
                        iconUrl: './assets/red_pin.png',
                        iconSize: [40, 40],
                        iconAnchor: [40, 40],
                    })
                });
                this.mapMarkers.push(byMarker);
            });
            
            this.map.fitBounds(new FeatureGroup(this.mapMarkers).getBounds(), {
                maxZoom: this.map.getZoom() - 4
            });
        });
    }
}