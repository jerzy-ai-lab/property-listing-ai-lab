import { MailCheck } from "lucide-react";
import { Seo } from "@/components/Seo/Seo";
import {
  PAGE_HEADER_CONFIG,
  PAGE_SUBTITLE_CONFIG,
  EMAIL_SENT_MESSAGE,
  EMAIL_VERIFIED_MESSAGE,
} from "./emailVerificationConfig";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { useEmailVerification } from "./hooks/useEmailVerification";
import { Button } from "@/components/Button/Button";
import { Toast } from "@/components/Toast/Toast";
import { SuccessMessage } from "@/components/SuccessMessage/SuccessMessage";
import { Spinner } from "@/components/Spinner/Spinner";
import styles from "./EmailVerification.module.css";

/* EmailVerification component */
export function EmailVerification() {
  const {
    handleResendVerificationEmail,
    isLoading,
    isAuthLoading,
    isSuccess,
    error,
    setError,
    emailVerified,
  } = useEmailVerification();

  if (isAuthLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.emailVerification}>
      <Seo
        title="Email Verification"
        description="Verify your email address to complete registration"
      />
      {!emailVerified ? (
        <>
          {/* === Error Toast === */}
          {error && (
            <Toast
              message={error}
              variant="error"
              onClose={() => setError(null)}
            />
          )}
          {/* === Page Header === */}
          <PageHeader
            title={PAGE_HEADER_CONFIG.title}
            subtitle={PAGE_HEADER_CONFIG.subtitle}
          />
          <MailCheck className={styles.icon} aria-hidden="true" />
          <div className={styles.content}>
            <p className={styles.description}>
              {PAGE_SUBTITLE_CONFIG.subtitle}
            </p>
            {/* === Submit Button === */}
            <Button
              variant="primary"
              onClick={handleResendVerificationEmail}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Resend Verification Email"}
            </Button>
          </div>
          {/* === Success Message === */}
          {isSuccess && (
            <SuccessMessage
              title={EMAIL_SENT_MESSAGE.title}
              message={EMAIL_SENT_MESSAGE.message}
            />
          )}
        </>
      ) : (
        <SuccessMessage
          title={EMAIL_VERIFIED_MESSAGE.title}
          message={EMAIL_VERIFIED_MESSAGE.message}
        />
      )}
    </div>
  );
}
