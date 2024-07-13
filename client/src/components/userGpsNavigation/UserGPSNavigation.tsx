import "./userGPSNavigation.css";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import L, { LatLngTuple } from "leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

interface UserGPSNavigationProps {
    userRole?: string[];
    userLatitude: string;
    userLongitude: string;
    emergencyLatitude: string;
    emergencyLongitude: string;
    responderLatitude?: string;
    responderLongitude?: string;
}

const UserGPSNavigation: React.FC<UserGPSNavigationProps> = ({
    userRole,
    userLatitude,
    userLongitude,
    emergencyLatitude,
    emergencyLongitude,
    responderLatitude,
    responderLongitude
}) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const routingControlRef = useRef<L.Routing.Control | null>(null);
    const [currentDirectionIndex, setCurrentDirectionIndex] = useState(0);
    const directionsRef = useRef<L.Routing.IInstruction[] | null>(null);
    const initialRender = useRef(true);

    const speakNextDirection = useCallback(() => {
        if (directionsRef.current && currentDirectionIndex < directionsRef.current.length) {
            const direction = directionsRef.current[currentDirectionIndex];
            const utterance = new SpeechSynthesisUtterance(direction.text);
            window.speechSynthesis.speak(utterance);
            setCurrentDirectionIndex((prevIndex) => prevIndex + 1);
        }
    }, [currentDirectionIndex]);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current, {
            center: [0, 0],
            zoom: 2,
            layers: [
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                })
            ]
        });
        mapInstanceRef.current = map;

        const updateMap = () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize();
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    updateMap();
                }
            });
        }, { threshold: 0.5 });

        if (mapRef.current) {
            observer.observe(mapRef.current);
        }

        return () => {
            if (mapRef.current) {
                observer.unobserve(mapRef.current);
            }
        };

    }, []);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const userLocation: LatLngTuple = [parseFloat(userLatitude), parseFloat(userLongitude)];

        if (mapInstanceRef.current) {
            mapInstanceRef.current.setView(userLocation, 14);

            L.marker(userLocation).addTo(mapInstanceRef.current)
                .bindPopup(`You are here!<br>Latitude: ${userLatitude}<br>Longitude: ${userLongitude}`)
                .openPopup();

            if ((userRole?.includes('User')) && responderLatitude && responderLongitude) {
                const responderLocation: LatLngTuple = [parseFloat(responderLatitude), parseFloat(responderLongitude)];
                addRoute(userLocation, responderLocation);
            } else if ((userRole?.includes("Admin") || userRole?.includes("Employee")) && emergencyLatitude && emergencyLongitude) {
                const emergencyLocation: LatLngTuple = [parseFloat(emergencyLatitude), parseFloat(emergencyLongitude)];
                addRoute(userLocation, emergencyLocation);
            }
        }

        function addRoute(start: LatLngTuple, end: LatLngTuple) {
            if (mapInstanceRef.current) {
                if (routingControlRef.current) {
                    try {
                        mapInstanceRef.current.removeControl(routingControlRef.current);
                    } catch (error) {
                        console.error('Error removing control:', error);
                    }
                    routingControlRef.current = null;
                }

                routingControlRef.current = L.Routing.control({
                    waypoints: [
                        L.latLng(start),
                        L.latLng(end)
                    ],
                    routeWhileDragging: true,
                    lineOptions: {
                        styles: [{ color: 'blue', opacity: 0.6, weight: 4 }],
                        extendToWaypoints: true,
                        missingRouteTolerance: 10
                    },
                    serviceUrl: 'https://router.project-osrm.org/route/v1'
                }).addTo(mapInstanceRef.current);

                routingControlRef.current.on('routesfound', (e) => {
                    const routes = e.routes;
                    directionsRef.current = routes[0].instructions;
                    setCurrentDirectionIndex(0);
                    speakNextDirection();
                });
            }
        }

        return () => {
            if (mapInstanceRef.current && routingControlRef.current) {
                try {
                    mapInstanceRef.current.removeControl(routingControlRef.current);
                } catch (error) {
                    console.error('Error removing control on cleanup:', error);
                }
                routingControlRef.current = null;
            }
        };

    }, [userRole, userLatitude, userLongitude, emergencyLatitude, emergencyLongitude, responderLatitude, responderLongitude, speakNextDirection]);

    return (
        <div>
            <div id="map" ref={mapRef} style={{ height: '400px', width: '95%', margin: "auto" }}></div>
        </div>
    );
};

export default UserGPSNavigation;
