import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../services/map.service';
import { LayersService } from '../services/layers.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {


  private layerA: any;
  private layerB: any;
  private layerIntAB: any;
  private selectedButton: number | null = null;

  constructor(
    private mapService: MapService,
    private layerService: LayersService,
    ) { }

  private initMap(): void {
    this.mapService.map = L.map('map', {
      center: [ 55.75, 37.61 ],
      zoom: 12
    });
  }

  private initBaseLayer(): void {
    this.mapService.map.addLayer(this.layerService.tiles);
  }

  // private initDataLayer(): void {
    // this.layerService.fetchLayer().subscribe(data => {
    //   const layer = L.geoJSON(data, {style: {color: "blue", fillOpacity: 0.5, weight: 3}});
    //   this.mapService.map.addLayer(layer);
    // });
  // }

  ngAfterViewInit(): void {
    this.initMap();
    this.initBaseLayer();
    // this.initDataLayer();

  }

  // DEVELOPMENT
  private clearLayers(): void {
    if (this.layerA) {
        this.mapService.map.removeLayer(this.layerA);
    }
    if (this.layerB) {
        this.mapService.map.removeLayer(this.layerB);
    }
    if (this.layerIntAB) {
        this.mapService.map.removeLayer(this.layerIntAB);
    }
  }

  private showLayerA(): void {
    this.layerService.fetchLayerA().subscribe(data => {
      this.layerA = L.geoJSON(data, {style: {color: "red", fillOpacity: 0.5, weight: 3}});
      this.mapService.map.addLayer(this.layerA);
    });
  }

  private showLayerB(): void {
    this.layerService.fetchLayerB().subscribe(data => {
      this.layerB = L.geoJSON(data, {style: {color: "yellow", fillOpacity: 0.5, weight: 3}});
      this.mapService.map.addLayer(this.layerB);
    });
  }

  private showLayerIntAB(): void {
    this.layerService.fetchLayerIntAB().subscribe(data => {
      this.layerIntAB = L.geoJSON(data, {style: {color: "blue", fillOpacity: 0.5, weight: 3}});
      this.mapService.map.addLayer(this.layerIntAB);
    });
  }

  isButtonSelected(buttonNumber: number): boolean {
    return this.selectedButton === buttonNumber;
  }

  onButtonClick1() {
    this.clearLayers()
    this.selectedButton = 1;
    // A & B
    this.showLayerA();
    this.showLayerB();
  }

  onButtonClick2() {
    this.clearLayers()
    this.selectedButton = 2;
    // A
    this.showLayerA()
  }

  onButtonClick3() {
    this.clearLayers()
    this.selectedButton = 3;
    // B
    this.showLayerB()
  }

  onButtonClick4() {
    this.clearLayers()
    this.selectedButton = 4;
    // A u B
    this.showLayerIntAB()
  }

}


