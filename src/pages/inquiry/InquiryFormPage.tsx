import { useState } from "react";

import clsx from "clsx";

import PencilIcon from "@/assets/svgs/inquiry/pencil.svg";
import Button from "@/components/common/Button";
import InquiryForm from "@/components/inquiry/form/InquiryForm";
import InquiryFormModal from "@/components/inquiry/form/InquiryFormModal";
import SelectDropdown from "@/components/inquiry/form/SelectDropdown";
import { useInquiryApi } from "@/hooks/inquiry/useInquiryApi";
import { useInquiryDraftApi } from "@/hooks/inquiry/useInquiryDraftApi";
import { useInquiryFormState } from "@/hooks/inquiry/useInquiryFormState";
import { useOrganizationSelector } from "@/hooks/team/useOrganizationSelector";
import { PostInquiryRequest } from "@/types/inquiry/inquiryApi.type";

const InquiryFormPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [missingField, setMissingField] = useState<
    null | "team" | "title" | "content" | "assignee"
  >(null);
  const [, setDraftId] = useState<number | null>(null);

  const {
    title,
    setTitle,
    content,
    setContent,
    assigneeIds,
    setAssigneeIds,
    referenceIds,
    setReferenceIds,
    fileIds,
    setFileIds,
  } = useInquiryFormState();

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

  const { postInquiryMutation } = useInquiryApi();
  const {
    useCheckDraftExists,
    usePostInquiryDraftMutation,
    useGetInquiryDraft,
    // useDeleteInquiryDraftMutation,
    // usePutInquiryDraftMutation,
  } = useInquiryDraftApi();

  const { data: draftExists, refetch } = useCheckDraftExists(
    teamId ?? 0,
    false
  );

  const { refetch: fetchDraft } = useGetInquiryDraft(
    teamId ?? 0,
    draftExists?.result.draft_id ?? 0
  );
  const { mutate: postDraft } = usePostInquiryDraftMutation();

  const validateFields = (): typeof missingField => {
    if (!teamId) return "team";
    if (!title.trim()) return "title";
    if (!content.trim()) return "content";
    if (assigneeIds.length === 0) return "assignee";
    return null;
  };
  const [, setJustSavedDraft] = useState(false);

  const handleDraftClick = async () => {
    const missing = validateFields();
    if (missing) {
      setMissingField(missing);
      return;
    }

    if (!teamId) return;

    const { data: draft } = await refetch();

    if (draft?.result.is_present) {
      setIsDraftModalOpen(true);

      setDraftId(draft.result.draft_id);
    } else {
      postDraft(
        {
          teamId,
          data: {
            title,
            content,
            assignee_ids: assigneeIds,
            observer_ids: referenceIds,
            file_ids: fileIds,
          },
        },
        {
          onSuccess: res => {
            setDraftId(res.result.inquiry_id);
            setJustSavedDraft(true);
          },
        }
      );
    }
  };

  const handleSubmit = () => {
    const missing = validateFields();
    if (missing) {
      setMissingField(missing);
      return;
    }

    setIsConfirmModalOpen(true);
  };
  // const { mutate: putDraft } = usePutInquiryDraftMutation();
  const [initialFiles, setInitialFiles] = useState<
    {
      fileId: number;
      fileName: string;
      fileKey: string;
      fileSize: number;
    }[]
  >([]);

  // const updateDraft = () => {
  //   if (!draftId || !teamId) return;

  //   putDraft({
  //     inquiryId: draftId,
  //     teamId,
  //     data: {
  //       title,
  //       content,
  //       assignee_ids: assigneeIds,
  //       observer_ids: referenceIds,
  //       file_ids: fileIds,
  //     },
  //   });
  // };

  const confirmSubmit = () => {
    if (!teamId) return;

    const payload: PostInquiryRequest = {
      title,
      content,
      assignee_ids: assigneeIds,
      observer_ids: referenceIds,
      file_ids: fileIds,
    };

    postInquiryMutation.mutate({ teamId, data: payload });
    setIsConfirmModalOpen(false);
  };

  const handleRestore = async () => {
    setIsDraftModalOpen(false);

    const { data } = await fetchDraft();
    if (!data?.result) return;

    console.log(data?.result);

    const {
      title,
      content,
      assignees,
      observers,
      group,
      division,
      team,
      files,
      inquiry_id,
    } = data.result;

    // 폼 상태 세팅
    setTitle(title);
    setContent(content);
    setAssigneeIds(assignees?.map(user => user.userId) ?? []);
    setReferenceIds(observers?.map(user => user.userId) ?? []);
    setInitialFiles(
      files.map(file => ({
        fileId: file.fileId,
        fileName: file.fileName,
        fileKey: file.fileKey,
        fileSize: file.fileSize,
      }))
    );

    // 조직 선택 상태도 같이 세팅
    handleGroupChange(group.groupId);
    handleDivisionChange(division.divisionId);
    handleTeamChange(team.teamId);

    // draftId 기억해두기 (PUT용)
    setDraftId(inquiry_id);
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
          assigneeIds={assigneeIds}
          referenceIds={referenceIds}
          fileIds={fileIds}
          setTitle={setTitle}
          setContent={setContent}
          setAssigneeIds={setAssigneeIds}
          setReferenceIds={setReferenceIds}
          initialFiles={initialFiles}
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

      <InquiryFormModal
        missingField={missingField}
        onCloseMissing={() => setMissingField(null)}
        isDraftOpen={isDraftModalOpen}
        onCloseDraft={() => setIsDraftModalOpen(false)}
        onRestoreDraft={handleRestore}
        onResetDraft={handleReset}
        isConfirmOpen={isConfirmModalOpen}
        onCloseConfirm={() => setIsConfirmModalOpen(false)}
        onConfirmSubmit={confirmSubmit}
      />
    </section>
  );
};

export default InquiryFormPage;
