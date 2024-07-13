// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as L from 'leaflet';
import 'leaflet-routing-machine';

declare module 'leaflet' {
    namespace Routing {
        interface RoutingControlOptions {
            serviceUrl?: string;
        }
    }
}