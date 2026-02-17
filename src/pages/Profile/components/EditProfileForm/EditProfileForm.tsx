import type { useEditProfileForm } from "../../hooks/useEditProfileForm";
import { Label } from "@/components/Label/Label";
import { Input } from "@/components/Input/Input";
import { FormError } from "@/components/FormError/FormError";
import { Button } from "@/components/Button/Button";
import styles from "./EditProfileForm.module.css";

interface EditProfileFormProps {
  editForm: ReturnType<typeof useEditProfileForm>;
  onCancel: () => void;
}

/* EditProfileForm component */
export function EditProfileForm({ editForm, onCancel }: EditProfileFormProps) {
  return (
    <form onSubmit={editForm.handleSubmit} noValidate className={styles.form}>
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
          {...editForm.register("firstName")}
        />
        <FormError error={editForm.errors.firstName?.message} />
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
          {...editForm.register("lastName")}
        />
        <FormError error={editForm.errors.lastName?.message} />
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
          {...editForm.register("phone")}
        />
        <FormError error={editForm.errors.phone?.message} />
      </div>

      <div className={styles.buttons}>
        <Button type="submit" variant="primary" disabled={editForm.isLoading}>
          {editForm.isLoading ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
