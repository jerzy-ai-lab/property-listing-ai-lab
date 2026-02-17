import { useMemo, useEffect } from "react";
import clsx from "clsx";
import { Controller } from "react-hook-form";
import { Label } from "@/components/Label/Label";
import { Select } from "@/components/Select/Select";
import { Button } from "@/components/Button/Button";
import { Divider } from "@/components/Divider/Divider";
import { FormError } from "@/components/FormError/FormError";
import { DatePickerInput } from "../DatePickerInput/DatePickerInput";
import { formatPrice, getStartOfDay } from "@/utils/helpers";
import { usePropertyBookedDates } from "../../hooks/usePropertyBookedDates";
import type { useBookingForm } from "../../hooks/useBookingForm";
import type { Matcher } from "react-day-picker";
import styles from "./PropertyBookingPanel.module.css";

type UseBookingFormReturn = ReturnType<typeof useBookingForm>;

type GuestOption = {
  value: string;
  label: string;
};

interface PropertyBookingPanelProps {
  bookingForm: UseBookingFormReturn;
  propertyId: string;
  maxGuests: number;
  onSendInquiry: () => void;
}

/* PropertyBookingPanel component */
export function PropertyBookingPanel({
  bookingForm,
  propertyId,
  maxGuests,
  onSendInquiry,
}: PropertyBookingPanelProps) {
  const {
    register,
    control,
    errors,
    checkIn,
    checkOut,
    guests,
    nights,
    pricePerNight,
    totalPrice,
    isLoading,
    isSuccess,
  } = bookingForm;

  const {
    bookedRanges,
    isLoading: isLoadingBookedDates,
    error: bookedDatesError,
    refetch: refetchBookedDates,
  } = usePropertyBookedDates(propertyId);

  useEffect(() => {
    if (isSuccess) {
      refetchBookedDates();
    }
  }, [isSuccess, refetchBookedDates]);

  const hasDates = checkIn && checkOut;
  const isFormDisabled = isLoading || isLoadingBookedDates || !hasDates;

  const disabledDatesForCheckIn = useMemo<Matcher[]>(
    () => [{ before: getStartOfDay(new Date()) }, ...bookedRanges],
    [bookedRanges],
  );

  const disabledDatesForCheckOut = useMemo<Matcher[]>(
    () => [{ before: getStartOfDay(checkIn ?? new Date()) }, ...bookedRanges],
    [checkIn, bookedRanges],
  );

  const guestOptions = useMemo<GuestOption[]>(
    () =>
      Array.from({ length: maxGuests }, (_, index) => {
        const guests = index + 1;
        return {
          value: String(guests),
          label: `${guests} ${guests === 1 ? "guest" : "guests"}`,
        };
      }),
    [maxGuests],
  );

  return (
    <div className={styles.panel}>
      {/* === Price === */}
      <div className={styles.price}>
        ${formatPrice(pricePerNight)}
        <span className={styles.priceUnit}>/night</span>
      </div>

      <div className={styles.inputGroupRow}>
        {/* === Check-in === */}
        <div className={styles.inputGroup}>
          <Label htmlFor="check-in" required>
            Check-in
          </Label>
          <Controller
            name="checkIn"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                id="check-in"
                label="check-in"
                selected={field.value}
                onSelect={field.onChange}
                disabled={disabledDatesForCheckIn}
                placeholder="Select check-in date"
                error={errors.checkIn?.message}
              />
            )}
          />
        </div>

        {/* === Check-out === */}
        <div className={styles.inputGroup}>
          <Label htmlFor="check-out" required>
            Check-out
          </Label>
          <Controller
            name="checkOut"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                id="check-out"
                label="check-out"
                selected={field.value}
                onSelect={field.onChange}
                disabled={disabledDatesForCheckOut}
                placeholder="Select check-out date"
                error={errors.checkOut?.message}
              />
            )}
          />
        </div>
      </div>

      {/* === Guests === */}
      <div className={styles.inputGroup}>
        <Label htmlFor="guests" required>
          Guests
        </Label>
        <Select
          id="guests"
          value={guests}
          options={guestOptions}
          placeholder="Choose guests"
          ariaLabel="Select number of guests"
          {...register("guests")}
          disabled={isLoading}
        />
        <FormError error={errors.guests?.message} />
      </div>

      {/* === Buttons === */}
      <div className={styles.buttons}>
        <Button
          variant="primary"
          onClick={bookingForm.handleSubmit}
          disabled={isFormDisabled}
        >
          Book Now
        </Button>
        <Button variant="filter" onClick={onSendInquiry} disabled={isLoading}>
          Send Inquiry
        </Button>
      </div>

      <FormError error={bookedDatesError ?? undefined} variant="center" />

      <span className={styles.disclaimer}>You won't be charged yet</span>

      {/* === Price Summary === */}
      {hasDates && (
        <div className={styles.priceSummary}>
          <div className={styles.priceItem}>
            <span className={styles.priceLabel}>
              ${formatPrice(pricePerNight)} x {nights}{" "}
              {nights === 1 ? "night" : "nights"}
            </span>
            <span className={styles.priceValue}>
              ${formatPrice(totalPrice)}
            </span>
          </div>

          <Divider />

          <div className={clsx(styles.priceItem, styles.priceTotal)}>
            <span className={styles.priceLabel}>Total</span>
            <span className={styles.priceValue}>
              ${formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
