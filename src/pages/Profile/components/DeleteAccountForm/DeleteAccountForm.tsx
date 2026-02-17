import { Label } from "@/components/Label/Label";
import { PasswordInput } from "@/components/PasswordInput/PasswordInput";
import { FormError } from "@/components/FormError/FormError";
import { Button } from "@/components/Button/Button";
import type { useDeleteAccountForm } from "../../hooks/useDeleteAccountForm";
import styles from "./DeleteAccountForm.module.css";

interface DeleteAccountFormProps {
  deleteForm: ReturnType<typeof useDeleteAccountForm>;
  onCancel: () => void;
}

/* DeleteAccountForm component */
export function DeleteAccountForm({
  deleteForm,
  onCancel,
}: DeleteAccountFormProps) {
  return (
    <form className={styles.form} onSubmit={deleteForm.handleSubmit} noValidate>
      {!deleteForm.isGoogleUser && (
        <div className={styles.formGroup}>
          <Label htmlFor="password" required>
            Password
          </Label>
          <PasswordInput
            id="password"
            maxLength={30}
            placeholder="Password"
            autoComplete="current-password"
            {...deleteForm.register("password")}
          />
          <FormError error={deleteForm.errors.password?.message} />
        </div>
      )}

      {deleteForm.isGoogleUser && (
        <div className={styles.message}>
          <p>
            You will be asked to confirm your Google account to delete your
            account.
          </p>
        </div>
      )}

      <div className={styles.buttons}>
        <Button type="submit" variant="primary" disabled={deleteForm.isLoading}>
          {deleteForm.isLoading ? "Deleting..." : "Delete account"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
