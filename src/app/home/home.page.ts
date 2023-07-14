import { Component, ViewChild } from '@angular/core';
import { Loader } from "@googlemaps/js-api-loader";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}
  @ViewChild("mapEl") mapEl: any;

  async ngAfterViewInit(){
    const loader = new Loader({
      apiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",
      version: "weekly",
    });

    loader.load().then(async () => {
      const { Map } = await (window as any).google?.maps.importLibrary("maps");
      let map = new Map(this.mapEl.nativeElement as HTMLElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    });

  }

}
