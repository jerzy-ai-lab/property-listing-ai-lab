import { PAGE_HEADER_CONFIG, SUCCESS_MESSAGE } from "./contactConfig";
import { Seo } from "@/components/Seo/Seo";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { Label } from "@/components/Label/Label";
import { Input } from "@/components/Input/Input";
import { Textarea } from "@/components/Textarea/Textarea";
import { Button } from "@/components/Button/Button";
import { FormError } from "@/components/FormError/FormError";
import { useContactForm } from "./hooks/useContactForm";
import { SuccessMessage } from "@/components/SuccessMessage/SuccessMessage";
import { Toast } from "@/components/Toast/Toast";
import styles from "./Contact.module.css";

/* Contact page component */
export function Contact() {
  const {
    register,
    handleSubmit,
    errors,
    watch,
    isSuccess,
    isLoading,
    error,
    setError,
  } = useContactForm();

  const messageValue = watch("message");

  return (
    <div className={styles.contact}>
      <Seo
        title="Contact"
        description="Get in touch with us. Send us a message and we'll get back to you as soon as possible."
        canonicalPath="/contact"
      />
      {/* === Error Toast === */}
      {error && (
        <Toast message={error} variant="error" onClose={() => setError(null)} />
      )}
      {isSuccess && (
        <SuccessMessage
          title={SUCCESS_MESSAGE.title}
          message={SUCCESS_MESSAGE.message}
        />
      )}
      {/* === Page Header === */}
      <PageHeader
        title={PAGE_HEADER_CONFIG.title}
        subtitle={PAGE_HEADER_CONFIG.subtitle}
      />
      {/* === Contact Form === */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* === Name Fields === */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <Label htmlFor="firstName" required>
              First Name
            </Label>
            <Input
              type="text"
              id="firstName"
              maxLength={30}
              placeholder="First name"
              autoComplete="given-name"
              {...register("firstName")}
            />
            <FormError error={errors.firstName?.message} />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="lastName" required>
              Last Name
            </Label>
            <Input
              type="text"
              id="lastName"
              maxLength={30}
              placeholder="Last name"
              autoComplete="family-name"
              {...register("lastName")}
            />
            <FormError error={errors.lastName?.message} />
          </div>
        </div>

        {/* === Contact Fields === */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <Label htmlFor="email" required>
              Email
            </Label>
            <Input
              type="email"
              id="email"
              maxLength={30}
              placeholder="Email"
              autoComplete="email"
              {...register("email")}
            />
            <FormError error={errors.email?.message} />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="phone" required>
              Phone
            </Label>
            <Input
              type="tel"
              id="phone"
              maxLength={10}
              placeholder="Phone"
              autoComplete="tel"
              {...register("phone")}
            />
            <FormError error={errors.phone?.message} />
          </div>
        </div>

        {/* === Subject Field === */}
        <div className={styles.formGroup}>
          <Label htmlFor="subject">Subject</Label>
          <Input
            type="text"
            id="subject"
            maxLength={50}
            placeholder="Subject"
            {...register("subject")}
          />
          <FormError error={errors.subject?.message} />
        </div>

        {/* === Message Field === */}
        <div className={styles.formGroup}>
          <Label htmlFor="message" required>
            Message
          </Label>
          <Textarea
            id="message"
            placeholder="Message"
            rows={5}
            maxLength={400}
            {...register("message")}
          />
          <div className={styles.errorRow}>
            <FormError error={errors.message?.message} />
            <span className={styles.charCount}>
              {messageValue?.length || 0}/400
            </span>
          </div>
        </div>

        {/* === Submit Button === */}
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Sending..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
