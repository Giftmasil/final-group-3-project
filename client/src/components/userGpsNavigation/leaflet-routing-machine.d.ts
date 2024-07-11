//import * as L from 'leaflet';
import 'leaflet-routing-machine';

declare module 'leaflet-routing-machine' {
  interface RoutingControlOptions {
    serviceUrl?: string;
  }
}
