import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { Observable, of } from 'rxjs';
import { GeoJSON } from 'geojson';

@Injectable({
  providedIn: 'root'
})
export class LayersService {
  private readonly API = 'http://localhost:5000'
  public tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

  constructor(
    private readonly http: HttpClient,
  ) { }

  public fetchLayer(): Observable<GeoJSON> {
    return this.http.get<GeoJSON>(`${this.API}/`);
  }

  public fetchLayerAB(): Observable<GeoJSON> {
    return this.http.get<GeoJSON>(`${this.API}/a_b/`);
  }

  public fetchLayerA(): Observable<GeoJSON> {
    return this.http.get<GeoJSON>(`${this.API}/a/`);
  }

  public fetchLayerB(): Observable<GeoJSON> {
    return this.http.get<GeoJSON>(`${this.API}/b/`);
  }

  public fetchLayerIntAB(): Observable<GeoJSON> {
    return this.http.get<GeoJSON>(`${this.API}/int_a_b/`);
  }
}
