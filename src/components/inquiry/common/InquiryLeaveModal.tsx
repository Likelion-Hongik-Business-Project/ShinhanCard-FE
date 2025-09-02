import Modal from "@/components/common/Modal";

interface InquiryLeaveModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const InquiryLeaveModal = ({
  isOpen,
  onConfirm,
  onCancel,
}: InquiryLeaveModalProps) => {
  return (
    <Modal
      title="페이지를 나가시겠습니까?"
      description={`작성 중인 내용이 저장되지 않습니다. \n그래도 나가시겠습니까?`}
      buttons={[
        { label: "취소", type: "white", onClick: onCancel },
        { label: "나가기", type: "blue", onClick: onConfirm },
      ]}
      isOpen={isOpen}
      onClose={onCancel}
    />
  );
};

export default InquiryLeaveModal;
