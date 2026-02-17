import { useState } from "react";
import { MapPin } from "lucide-react";
import type { Property } from "@/types/property";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  InfoWindow,
} from "@react-google-maps/api";
import { googleMapsConfig } from "@/config/googleMapsConfig";
import { capitalizeFirst } from "@/utils/helpers";
import { useGeocoder } from "../../hooks/useGeocoder";
import { truncateText } from "@/utils/helpers";
import { Spinner } from "@/components/Spinner/Spinner";
import styles from "./PropertyMap.module.css";

interface PropertyMapProps {
  property: Property;
}

/* PropertyMap component */
export function PropertyMap({ property }: PropertyMapProps) {
  const title = property.title ?? "";
  const image = property.image ?? "";
  const address = property.address;
  const street = address.street;
  const zipCode = address.zipCode;
  const city = address.city;
  const country = address.country;

  const fullAddress = `${street}, ${zipCode} ${city}, ${country}`;
  const displayAddress = `${capitalizeFirst(street)}, ${zipCode} ${capitalizeFirst(city)}, ${capitalizeFirst(country)}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    fullAddress,
  )}`;
  const viewOnMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    fullAddress,
  )}`;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapsConfig.apiKey,
  });

  const { coordinates, isLoading: isGeocoding } = useGeocoder(
    fullAddress,
    isLoaded,
  );

  const [infoOpen, setInfoOpen] = useState(true);

  if (!isLoaded || isGeocoding) {
    return <Spinner />;
  }

  return (
    <div className={styles.map}>
      <h3 className={styles.title}>Where you'll be</h3>

      <div className={styles.locationContainer}>
        <MapPin className={styles.locationIcon} />
        <span className={styles.locationText}>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            {displayAddress}
          </a>
        </span>
      </div>

      {coordinates ? (
        <GoogleMap
          center={coordinates}
          zoom={15}
          mapContainerClassName={styles.mapContainer}
          onClick={() => setInfoOpen(false)}
        >
          <Marker position={coordinates} onClick={() => setInfoOpen(true)} />

          {infoOpen && (
            <InfoWindow
              position={coordinates}
              onCloseClick={() => setInfoOpen(false)}
              options={{
                pixelOffset: new google.maps.Size(0, -43),
                headerContent: `${truncateText(title, 35)}`,
              }}
            >
              <div className={styles.infoWindowContent}>
                <img src={image} alt={title} className={styles.image} />
                <div className={styles.infoContent}>
                  <div>{capitalizeFirst(street)}</div>
                  <div>{zipCode}</div>
                  <div>{capitalizeFirst(city)}</div>
                  <div>{capitalizeFirst(country)}</div>
                  <a
                    href={viewOnMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : null}
    </div>
  );
}
