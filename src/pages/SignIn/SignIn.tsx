import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo/Seo";
import {
  PAGE_HEADER_CONFIG,
  SUCCESS_MESSAGE,
  SIGN_IN_FORM_LINKS,
} from "./signInConfig";
import { useSignInForm } from "./hooks/useSignInForm";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { Label } from "@/components/Label/Label";
import { Input } from "@/components/Input/Input";
import { PasswordInput } from "@/components/PasswordInput/PasswordInput";
import { Divider } from "@/components/Divider/Divider";
import { Button } from "@/components/Button/Button";
import { FormError } from "@/components/FormError/FormError";
import { Toast } from "@/components/Toast/Toast";
import { SuccessMessage } from "@/components/SuccessMessage/SuccessMessage";
import styles from "./SignIn.module.css";

/* SignIn page component */
export function SignIn() {
  const {
    register,
    handleSubmit,
    isSuccess,
    errors,
    isLoading,
    error,
    setError,
    handleGoogleSignIn,
  } = useSignInForm();
  return (
    <div className={styles.signIn}>
      <Seo title="Sign In" description="Sign in to your account" />
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

      {/* === Sign In Form === */}
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* === Name Fields === */}
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
          <Label htmlFor="password" required>
            Password
          </Label>
          <PasswordInput
            // type="password"
            id="password"
            placeholder="Password"
            autoComplete="current-password"
            {...register("password")}
          />
          <FormError error={errors.password?.message} />
        </div>

        {/* === Submit Button === */}
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        <Divider variant="text"> OR </Divider>

        {/* === Google Button === */}
        <Button onClick={handleGoogleSignIn}>Continue with Google</Button>

        {/* === Link to Reset Password === */}
        <div className={styles.linkContainer}>
          {/* Map SIGN_IN_FORM_LINKS (Sign Up, Reset Password) */}
          {SIGN_IN_FORM_LINKS.map((link) => (
            <Link to={link.to} className={styles.link} key={link.to}>
              {link.label}
            </Link>
          ))}
        </div>
      </form>
    </div>
  );
}
