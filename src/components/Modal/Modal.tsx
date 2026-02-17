import type { ReactNode, MouseEvent } from "react";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { X } from "lucide-react";
import clsx from "clsx";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { Button } from "@/components/Button/Button";
import styles from "./Modal.module.css";

type ModalProps = {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  className?: string;
  children?: ReactNode;
};

/* Modal component */
export function Modal({ isOpen, title, onClose, className, children }: ModalProps) {
  useBodyScrollLock(isOpen, "scroll-lock");

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={clsx(styles.modal, className)}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <Button
          variant="closeCircle"
          aria-label="Close modal"
          onClick={onClose}
          className={styles.closeCircle}
        >
          <X className={styles.closeIcon} aria-hidden="true" />
        </Button>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
