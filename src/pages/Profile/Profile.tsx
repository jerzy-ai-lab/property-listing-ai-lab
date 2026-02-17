import { useEditProfileForm } from "./hooks/useEditProfileForm";
import { useDeleteAccountForm } from "./hooks/useDeleteAccountForm";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useProfileImageUpload } from "./hooks/useProfileImageUpload";
import {
  PAGE_HEADER_CONFIG,
  INCOMPLETE_PROFILE_MESSAGE,
} from "./profileConfig";
import { Spinner } from "@/components/Spinner/Spinner";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { ProfileImage } from "./components/ProfileImage/ProfileImage";
import { ProfileInfo } from "./components/ProfileInfo/ProfileInfo";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Toast } from "@/components/Toast/Toast";
import { Modal } from "@/components/Modal/Modal";
import { useProfileModal } from "./hooks/useProfileModal";
import { useDeleteAccountModal } from "./hooks/useDeleteAccountModal";
import { EditProfileForm } from "./components/EditProfileForm/EditProfileForm";
import { DeleteAccountForm } from "./components/DeleteAccountForm/DeleteAccountForm";
import styles from "./Profile.module.css";

/* Profile page component */
export function Profile() {
  const { userProfile, isLoading, error, setError } = useUserProfile();
  const editForm = useEditProfileForm(userProfile);
  const deleteForm = useDeleteAccountForm();
  const profileImageUpload = useProfileImageUpload();
  const { isModalOpen, openModal, closeModal } = useProfileModal(editForm);
  const {
    isModalOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useDeleteAccountModal(deleteForm);
  const isIncomplete =
    !userProfile?.firstName || !userProfile?.lastName || !userProfile?.phone;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.profile}>
      {/* === Error Toast === */}
      {error && (
        <Toast message={error} variant="error" onClose={() => setError(null)} />
      )}

      {editForm.error && (
        <Toast
          message={editForm.error}
          variant="error"
          onClose={() => editForm.setError(null)}
        />
      )}

      {profileImageUpload.error && (
        <Toast
          message={profileImageUpload.error}
          variant="error"
          onClose={() => profileImageUpload.setError(null)}
        />
      )}

      {deleteForm.error && (
        <Toast
          message={deleteForm.error}
          variant="error"
          onClose={() => deleteForm.setError(null)}
        />
      )}

      {/* === Page Header === */}
      <PageHeader title={PAGE_HEADER_CONFIG.title} />

      {/* === Profile Image === */}
      <ProfileImage profileImageUpload={profileImageUpload} />

      <div className={styles.profileContent}>
        {isIncomplete && <EmptyState message={INCOMPLETE_PROFILE_MESSAGE} />}

        {userProfile && (
          <ProfileInfo
            userProfile={userProfile}
            isIncomplete={isIncomplete}
            onEditClick={openModal}
            onDeleteClick={openDeleteModal}
          />
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isIncomplete ? "Complete Profile" : "Edit Profile"}
      >
        <EditProfileForm editForm={editForm} onCancel={closeModal} />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Account"
      >
        <DeleteAccountForm
          deleteForm={deleteForm}
          onCancel={closeDeleteModal}
        />
      </Modal>
    </div>
  );
}
