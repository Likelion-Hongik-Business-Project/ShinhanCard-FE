import { useEffect, useState } from "react";

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
  const [draftId, setDraftId] = useState<number | null>(null);

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
    usePutInquiryDraftMutation,
  } = useInquiryDraftApi();

  const { data: draftExists, isLoading } = useCheckDraftExists(teamId ?? 0);
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

  const handleDraftClick = () => {
    const missing = validateFields();
    if (missing) {
      setMissingField(missing);
      return;
    }

    if (!teamId || isLoading) return;

    // 이미 draft 저장한 적 있음 → PUT
    if (draftExists?.result.is_present || draftId) {
      updateDraft(); // PUT 로직
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
  const { mutate: putDraft } = usePutInquiryDraftMutation();

  const updateDraft = () => {
    if (!draftId || !teamId) return;

    putDraft({
      inquiryId: draftId,
      teamId,
      data: {
        title,
        content,
        assignee_ids: assigneeIds,
        observer_ids: referenceIds,
        file_ids: fileIds,
      },
    });
  };
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

    const {
      title,
      content,
      assignees,
      observers,
      group,
      division,
      team,
      inquiry_id,
    } = data.result;

    // 폼 상태 세팅
    setTitle(title);
    setContent(content);
    setAssigneeIds(assignees?.map(user => user.userId) ?? []);
    setReferenceIds(observers.map(user => user.userId));
    setFileIds([]); // ⛔ file_ids가 응답에 없으니 빈 배열로 초기화 또는 필요 시 API 확장

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

  useEffect(() => {
    if (!isLoading && draftExists?.result.is_present) {
      setIsDraftModalOpen(true);
    }
  }, [draftExists]);

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
          setTitle={setTitle}
          setContent={setContent}
          setAssigneeIds={setAssigneeIds}
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
