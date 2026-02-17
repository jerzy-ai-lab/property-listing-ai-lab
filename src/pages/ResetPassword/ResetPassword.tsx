import { Seo } from "@/components/Seo/Seo";
import { PAGE_HEADER_CONFIG, SUCCESS_MESSAGE } from "./resetPasswordConfig";
import { useResetPasswordForm } from "./hooks/useResetPasswordForm";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { Label } from "@/components/Label/Label";
import { Input } from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import { FormError } from "@/components/FormError/FormError";
import { SuccessMessage } from "@/components/SuccessMessage/SuccessMessage";
import { Toast } from "@/components/Toast/Toast";
import styles from "./ResetPassword.module.css";

/* ResetPassword page component */
export function ResetPassword() {
  const {
    register,
    handleSubmit,
    errors,
    isSuccess,
    isLoading,
    error,
    setError,
  } = useResetPasswordForm();

  return (
    <div className={styles.resetPassword}>
      <Seo title="Reset Password" description="Reset your account password" />
      {/* === Error Toast === */}
      {error && (
        <Toast message={error} variant="error" onClose={() => setError(null)} />
      )}

      {/* === Success Message === */}
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

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
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

        {/* === Submit Button === */}
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset password"}
        </Button>
      </form>
    </div>
  );
}
