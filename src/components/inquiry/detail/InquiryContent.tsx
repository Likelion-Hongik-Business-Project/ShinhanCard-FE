import { useState } from "react";

import clsx from "clsx";
import { useNavigate } from "react-router-dom";

import ProfileIcon from "@/assets/svgs/inquiry/detail/profile.svg";
import MarkdownViewer from "@/components/common/MarkdownViewer";
import Modal from "@/components/common/Modal";
import ProfileModal from "@/components/common/ProfileModal";
import { formatDateToKorean } from "@/utils/dateUtils";
import { InquiryContentProps } from "@/types/inquiryTypes";

import FileDownloadBox from "./FileDownloadBox";

import { deleteInquiry } from "@/apis/inquiry/inquiryApi";

const InquiryContent = ({
  title,
  content,
  author,
  createdAt,
  isWriter,
  isAdmin,
  answersCount,
  inquiryId,
  teamId,
  files,
}: InquiryContentProps) => {
  const navigate = useNavigate();
  const [isWriterDeleteModalOpen, setIsWriterDeleteModalOpen] = useState(false);

  // 프로필 모달 상태
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalOffset, setProfileModalOffset] = useState<{
    left: number;
    top: number;
  } | null>(null);

  const handleEdit = () => {
    navigate("/inquiry/form?mode=edit", {
      state: {
        teamId: Number(teamId),
        inquiryId: Number(inquiryId),
      },
    });
  };

  // 문의자 전용 삭제 처리
  const handleWriterDelete = async () => {
    try {
      await deleteInquiry(Number(teamId), Number(inquiryId));
      navigate(-1); // 이전 페이지로 이동
    } catch (error) {
      console.error("문의글 삭제 실패:", error);
    } finally {
      setIsWriterDeleteModalOpen(false);
    }
  };

  // 삭제 버튼 클릭 처리
  const handleDeleteClick = () => {
    // 문의자, 관리자 둘다 모달의 버튼은 파란색
    setIsWriterDeleteModalOpen(true);
  };

  // 프로필 호버 핸들러
  const handleProfileHover = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const modalHeight = 242; // ProfileModal의 대략적인 높이

    let top = rect.bottom + 8;

    // 모달이 화면 아래로 넘어가면 위로 붙이기
    if (top + modalHeight > window.innerHeight) {
      top = rect.top - modalHeight - 8;
    }

    setProfileModalOffset({
      left: rect.left,
      top: Math.max(top, 0),
    });
    setIsProfileModalOpen(true);
  };

  return (
    <>
      <div className="self-stretch px-[16px] flex flex-col justify-start items-start gap-[32px]">
        {/* 제목 */}
        <div className="flex justify-start items-start gap-[24px]">
          <div className="justify-start text-gray-100 text-heading2-b">
            {title}
          </div>
        </div>

        {/* 내용 */}
        <div className="self-stretch justify-start text-gray-100 text-body2 whitespace-pre-line">
          <MarkdownViewer content={content} />
        </div>

        {files && files.length > 0 && (
          <div className="w-full">
            <div
              className={clsx(
                "grid gap-3",
                "max-1680:grid-cols-1",
                "1680:grid-cols-[repeat(3,minmax(412px,1fr))]"
              )}
            >
              {files.map(f => (
                <FileDownloadBox
                  key={f.file_id}
                  file={{
                    id: f.file_id,
                    file_name: f.file_name,
                    file_size: f.file_size ?? 0,
                    progress: 100,
                    status: "done",
                  }}
                  onRemove={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {/* 작성자 정보 */}
        <div className="self-stretch rounded-[30px] flex flex-col justify-center items-start gap-4">
          <div className="flex justify-between items-center w-full">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onMouseEnter={handleProfileHover}
            >
              {author.profile_image_url ? (
                <img
                  src={author.profile_image_url}
                  alt={`${author.user_name}의 프로필 이미지`}
                  className="w-[20px] h-[20px] rounded-full"
                />
              ) : (
                <ProfileIcon className="w-[20px] h-[20px] rounded-full text-gray-30" />
              )}
              <div className="text-gray-80 text-body1-b">
                {author.user_name}
              </div>
              <div className="text-main text-detail1-b mt-[1px]">
                {author.team_name}
              </div>
            </div>
            {/* 문의자 수정/삭제 버튼 */}
            {isWriter && (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleEdit}
                  className="text-gray-50 text-body2 cursor-pointer"
                >
                  수정
                </button>
                {(answersCount === 0 || isAdmin) && (
                  <button
                    onClick={handleDeleteClick}
                    className="text-gray-50 text-body2 cursor-pointer"
                  >
                    삭제
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-start items-center gap-[32px]">
            <div className="justify-start text-gray-50 text-detail1">
              {formatDateToKorean(createdAt, { showTime: true })}
            </div>
          </div>
        </div>
      </div>

      {/* 문의자 전용 삭제 확인 모달 */}
      <Modal
        isOpen={isWriterDeleteModalOpen}
        onClose={() => setIsWriterDeleteModalOpen(false)}
        title="글을 삭제하시겠습니까?"
        buttons={[
          {
            label: "취소",
            type: "gray",
            onClick: () => setIsWriterDeleteModalOpen(false),
          },
          {
            label: "게시글 삭제",
            type: "red",
            onClick: handleWriterDelete,
          },
        ]}
      />

      {/* 프로필 모달 */}
      {isProfileModalOpen && profileModalOffset && (
        <div
          className="fixed z-2000 transition-all duration-200 ease-in-out"
          style={{
            left: profileModalOffset.left,
            top: profileModalOffset.top,
          }}
        >
          <ProfileModal
            id={author.user_id}
            isOpen={true}
            onClose={() => {
              setIsProfileModalOpen(false);
              setProfileModalOffset(null);
            }}
          />
        </div>
      )}
    </>
  );
};

export default InquiryContent;
