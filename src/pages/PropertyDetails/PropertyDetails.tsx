import { useLoaderData, useLocation } from "react-router-dom";
import { Seo } from "@/components/Seo/Seo";
import { useBookingForm } from "./hooks/useBookingForm";
import { PropertyHeader } from "./components/PropertyHeader/PropertyHeader";
import { PropertyInfo } from "./components/PropertyInfo/PropertyInfo";
import { PropertyBookingPanel } from "./components/PropertyBookingPanel/PropertyBookingPanel";
import { PropertyBookingSummary } from "./components/PropertyBookingSummary/PropertyBookingSummary";
import { Divider } from "@/components/Divider/Divider";
import type { Booking } from "@/types/booking";
import { PropertyMap } from "./components/PropertyMap/PropertyMap";
import { SuccessMessage } from "@/components/SuccessMessage/SuccessMessage";
import { Toast } from "@/components/Toast/Toast";
import { SUCCESS_MESSAGE } from "./propertyDetailsConfig";
import styles from "./PropertyDetails.module.css";

type PropertyLoaderData = { property: import("@/types/property").Property };

/* PropertyDetails page */
export function PropertyDetails() {
  const { property } = useLoaderData() as PropertyLoaderData;
  const location = useLocation();
  const bookingFromState = (location.state as { booking?: Booking } | null)
    ?.booking;

  const bookingForm = useBookingForm(property);

  const handleSendInquiry = () => {
    // Placeholder for inquiry functionality
    console.log("Send inquiry clicked");
  };

  const isUserBookingForThisProperty =
    bookingFromState && property && bookingFromState.propertyId === property.id;

  return (
    <div className={styles.propertyDetails}>
      <Seo
        title={property.title}
        description={
          (property.description && property.description.slice(0, 160)) ||
          `${property.title} – ${property.address.city}, ${property.address.country}. ${property.capacity.guest} guests, ${property.capacity.bedroom} bedrooms.`
        }
        canonicalPath={`/property/${property.id}`}
        image={property.image}
        type="article"
      />
      {/* === Error Toast === */}
      {bookingForm.error && (
        <Toast
          message={bookingForm.error}
          variant="error"
          onClose={() => bookingForm.setError(null)}
        />
      )}

      {/* === Success Message === */}
      {bookingForm.isSuccess && (
        <SuccessMessage
          title={SUCCESS_MESSAGE.title}
          message={SUCCESS_MESSAGE.message}
        />
      )}

      <PropertyHeader property={property} />
      <div className={styles.propertyContent}>
        <PropertyInfo property={property} />
        {isUserBookingForThisProperty && bookingFromState ? (
          <PropertyBookingSummary booking={bookingFromState} />
        ) : (
          <PropertyBookingPanel
            bookingForm={bookingForm}
            propertyId={property.id}
            maxGuests={property.capacity.guest}
            onSendInquiry={handleSendInquiry}
          />
        )}
      </div>
      <Divider variant="default" />
      <PropertyMap property={property} />
    </div>
  );
}
