import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo/Seo";
import { PAGE_HEADER_CONFIG, SUCCESS_MESSAGE } from "./signUpConfig";
import { useSignUpForm } from "./hooks/useSignUpForm";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { Label } from "@/components/Label/Label";
import { Input } from "@/components/Input/Input";
import { PasswordInput } from "@/components/PasswordInput/PasswordInput";
import { Button } from "@/components/Button/Button";
import { Divider } from "@/components/Divider/Divider";
import { FormError } from "@/components/FormError/FormError";
import { Toast } from "@/components/Toast/Toast";
import { SuccessMessage } from "@/components/SuccessMessage/SuccessMessage";
import styles from "./SignUp.module.css";

/* SignUp page component */
export function SignUp() {
  const {
    register,
    handleSubmit,
    isSuccess,
    errors,
    isLoading,
    error,
    setError,
    handleGoogleSignUp,
  } = useSignUpForm();

  return (
    <div className={styles.signUp}>
      <Seo title="Sign Up" description="Create your account" />
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

      {/* === Sign Up Form === */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* === Email Field === */}
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
        {/* === Password Field === */}
        <div className={styles.formGroup}>
          <Label htmlFor="password" required>
            Password
          </Label>
          <PasswordInput
            id="password"
            placeholder="Password"
            autoComplete="new-password"
            {...register("password")}
          />
          <FormError error={errors.password?.message} />
        </div>

        {/* === Submit Button === */}
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>

        <Divider variant="text"> OR </Divider>

        {/* === Google Button === */}
        <Button onClick={handleGoogleSignUp}>Continue with Google</Button>

        {/* === Link to Sign In === */}
        <div className={styles.linkContainer}>
          <Link to="/sign-in" className={styles.link}>
            Already have an account? Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
