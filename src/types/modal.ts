export interface ModalButton {
  type: "blue" | "white" | "gray" | "red";
  label: string;
  onClick: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  buttons: ModalButton[];
}
