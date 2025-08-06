import { useState } from "react";

import clsx from "clsx";

import PencilIcon from "@/assets/svgs/inquiry/pencil.svg";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import InquiryForm from "@/components/inquiry/form/InquiryForm";
import SelectDropdown from "@/components/inquiry/form/SelectDropdown";
import { useInquiryApi } from "@/hooks/inquiry/useInquiryApi";
import { useInquiryDraftApi } from "@/hooks/inquiry/useInquiryDraftApi";
import { useOrganizationSelector } from "@/hooks/team/useOrganizationSelector";
import { PostInquiryRequest } from "@/types/inquiry/inquiryApi.type";

const InquiryFormPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [missingField, setMissingField] = useState<
    null | "team" | "title" | "content" | "assignee"
  >(null);

  const {
    groupId,
    divisionId,
    teamId,
    groupOptions,
    divisionOptions,
    teamOptions,
    handleGroupChange,
    handleDivisionChange,
    handleTeamChange,
  } = useOrganizationSelector();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [assigneeId, setAssigneeId] = useState<number | null>(null);
  const [referenceIds, setReferenceIds] = useState<number[]>([]);
  const [fileIds, setFileIds] = useState<number[]>([]);

  const { postInquiryMutation } = useInquiryApi();
  const { useCheckDraftExists, usePostInquiryDraftMutation } =
    useInquiryDraftApi();

  const { data: draftExists, isLoading } = useCheckDraftExists(teamId ?? 0);
  const { mutate: postDraft } = usePostInquiryDraftMutation();

  // 필수 필드 누락 검사
  const validateFields = (): typeof missingField => {
    if (!teamId) return "team";
    if (!title.trim()) return "title";
    if (!content.trim()) return "content";
    if (assigneeId === null) return "assignee";
    return null;
  };

  const handleDraftClick = () => {
    const missing = validateFields();
    if (missing) {
      setMissingField(missing);
      return;
    }

    if (!teamId || isLoading) return;

    if (draftExists?.result) {
      setIsDraftModalOpen(true);
    } else {
      postDraft({
        teamId,
        data: {
          title,
          content,
          assignee_ids: assigneeId !== null ? [assigneeId] : [],
          observer_ids: referenceIds,
          file_ids: fileIds,
        },
      });
    }
  };

  const handleSubmit = () => {
    const missing = validateFields();
    if (missing) {
      setMissingField(missing);
      return;
    }

    setIsConfirmModalOpen(true); // 등록 확인 모달 오픈
  };

  const confirmSubmit = () => {
    if (!teamId) return;

    const payload: PostInquiryRequest = {
      title,
      content,
      assignee_ids: assigneeId !== null ? [assigneeId] : [],
      observer_ids: referenceIds,
      file_ids: fileIds,
    };

    postInquiryMutation.mutate({ teamId, data: payload });
    setIsConfirmModalOpen(false);
  };

  const handleRestore = () => {
    setIsDraftModalOpen(false);
    // TODO: 임시저장 불러오기 로직
  };

  const handleReset = () => {
    setIsDraftModalOpen(false);
    // TODO: 새로 작성 로직
  };

  return (
    <section
      className={clsx("flex flex-col w-full", isDropdownOpen && "pb-[220px]")}
    >
      <h1 className="text-heading1 text-gray-80 mb-10">문의 작성하기</h1>

      <div className="flex gap-2 flex-col">
        <div className="flex gap-2">
          <SelectDropdown
            options={groupOptions}
            value={groupId ?? 0}
            onChange={handleGroupChange}
            placeholder="그룹 선택"
          />
          <SelectDropdown
            options={divisionOptions}
            value={divisionId ?? 0}
            onChange={handleDivisionChange}
            placeholder="본부 선택"
            disabled={!groupId}
          />
          <SelectDropdown
            options={teamOptions}
            value={teamId ?? 0}
            onChange={handleTeamChange}
            placeholder="팀 선택"
            disabled={!divisionId}
          />
        </div>

        <InquiryForm
          teamId={teamId ?? 0}
          title={title}
          content={content}
          assigneeId={assigneeId}
          referenceIds={referenceIds}
          setTitle={setTitle}
          setContent={setContent}
          setAssigneeId={setAssigneeId}
          setReferenceIds={setReferenceIds}
          setFileIds={setFileIds}
          onDropdownStateChange={setIsDropdownOpen}
        />
      </div>

      <div className="flex gap-8 w-full justify-end mt-10">
        <Button className="white" onClick={handleDraftClick}>
          임시저장
        </Button>
        <Button buttonType="blue" onClick={handleSubmit}>
          <PencilIcon />
          <span className="text-heading3 text-white">문의 등록하기</span>
        </Button>
      </div>

      {/* 기존 임시저장 감지 모달 */}
      <Modal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        title={"임시저장된 글이 있습니다.\n불러오시겠습니까?"}
        description="새로 작성하면 기존 임시저장된 글은 사라집니다."
        buttons={[
          {
            label: "새로 작성",
            type: "white",
            onClick: handleReset,
          },
          {
            label: "불러오기",
            type: "blue",
            onClick: handleRestore,
          },
        ]}
      />

      {/* 필수 항목 누락 시 모달 */}
      <Modal
        isOpen={!!missingField}
        onClose={() => setMissingField(null)}
        title={
          missingField === "team"
            ? "문의를 올릴 팀을 선택해주세요"
            : missingField === "title"
              ? "문의 제목을 입력해주세요"
              : missingField === "content"
                ? "문의 내용을 입력해주세요"
                : "답변 담당자를 선택해주세요"
        }
        buttons={[
          {
            label: "확인",
            type: "blue",
            onClick: () => setMissingField(null),
          },
        ]}
      />

      {/* 문의 등록 모달 */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="게시판에 문의를 등록할까요?"
        description={
          "등록 시 담당자와 참조자에게 알림이 발송되며,\n답변이 달린 이후에는 글을 수정 및 삭제할 수 없습니다."
        }
        buttons={[
          {
            label: "취소",
            type: "white",
            onClick: () => setIsConfirmModalOpen(false),
          },
          {
            label: "문의 등록하기",
            type: "blue",
            onClick: confirmSubmit,
          },
        ]}
      />
    </section>
  );
};

export default InquiryFormPage;
