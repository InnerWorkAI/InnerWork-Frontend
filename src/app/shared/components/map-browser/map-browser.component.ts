import { AfterViewInit, Component, output, signal } from '@angular/core';
import L from 'leaflet';
import { locateOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { LocationIQProvider } from 'leaflet-geosearch';
import { environment } from 'src/environments/environment';
import { IonButton, IonInput, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-map-browser',
  templateUrl: './map-browser.component.html',
  styleUrls: ['./map-browser.component.scss'],
  imports: [IonIcon, IonInput, IonButton, ],
})
export class MapBrowserComponent implements AfterViewInit {

  onLocationChanged = output<string>();

  map!: L.Map;
  marker!: L.Marker;
  addressText = signal('');
  suggestions = signal<any[]>([]);
  private searchTimeout: any;

  private provider = new LocationIQProvider({
    params: {
      key: environment.locationIqToken,
      limit: 5,
      addressdetails: 1
    },
  });

  constructor() { 
      addIcons({ 
        locateOutline
      });
  }


  ngAfterViewInit() {
    this.initMap();
  }


  private initMap() {

    const startCoords: L.LatLngExpression = [40.4167, -3.7037];
    this.map = L.map('map').setView(startCoords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    const iconDefault = L.icon({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
    });

  L.Marker.prototype.options.icon = iconDefault;

    this.marker = L.marker(startCoords, { draggable: true }).addTo(this.map);

    const mapElement = document.getElementById('map');
    if (mapElement) {
      const observer = new ResizeObserver(() => {
        this.map.invalidateSize();
        this.map.setView(startCoords, 13);
      });
      observer.observe(mapElement);
    }

    this.map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      this.marker.setLatLng([lat, lng]);

      await this.getAddressFromCoords(lat, lng);
    });
  }

onSearch(query: string) {
    this.addressText.set(query);
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    if (query.length < 4) {
      this.suggestions.set([]);
      return;
    }

    this.searchTimeout = setTimeout(async () => {
      try {
        const results = await this.provider.search({ query });
        console.log(results)

        this.suggestions.set(results.map(r => r.raw));
      } catch (error) {
        console.error("Error using GeoSearch:", error);
      }
    }, 700);
  }


  async getAddressFromCoords(lat: number, lon: number) {
    try {
      const results = await this.provider.search({ 
        query: `${lat}, ${lon}` 
      });

      if (results && results.length > 0) {
        this.formatAndSetAddress(results[0].raw);

        // Creamos el texto formateado: "Calle Falsa 123; 40.4167; -3.7032"
        const fullLocationText = `${this.addressText()}; ${lat}; ${lon}`;

        this.onLocationChanged.emit(fullLocationText);
        
        console.log("Ubicación formateada:", fullLocationText);
      }
    } catch (error) {
      console.error("Error en reverse geocoding:", error);
    }
  }

  private formatAndSetAddress(item: any) {
    const addr = item.address || {};
    const road = addr.road || addr.pedestrian || addr.path || item.display_name.split(',')[0] || '';
    const houseNumber = addr.house_number || '';
    const suburb = addr.suburb || addr.neighbourhood || '';
    const city = addr.city || addr.town || '';
    const state = addr.state || '';
    const postcode = addr.postcode || '';
    const country = addr.country || '';

    const streetPart = `${road} ${houseNumber}`.trim();
    const rest = [suburb, city, state, postcode, country].filter(p => p !== '');

    const finalLabel = streetPart ? `${streetPart}, ${rest.join(', ')}` : rest.join(', ');

    this.addressText.set(finalLabel);
  }

  selectAddress(item: any) {
    this.formatAndSetAddress(item);
    this.suggestions.set([]);

    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    if (!isNaN(lat) && !isNaN(lon)) {
      this.map.setView([lat, lon], 17);
      this.marker.setLatLng([lat, lon]);
      setTimeout(() => this.map.invalidateSize(), 100);
    }
  }

  getCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Browser does not support geolocation');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        this.map.setView([lat, lon], 16);
        this.marker.setLatLng([lat, lon]);

        await this.getAddressFromCoords(lat, lon);

        setTimeout(() => this.map.invalidateSize(), 100);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Error getting location. Please allow location access and try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }
}

