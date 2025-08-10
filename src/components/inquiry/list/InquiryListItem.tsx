import { useState } from "react";

import { useNavigate } from "react-router-dom";

import ProfileIcon from "@/assets/svgs/common/profile.svg";
import Star from "@/assets/svgs/common/star.svg";
import StarActive from "@/assets/svgs/common/star-active.svg";
import { INQUIRY_STATUS_STYLES } from "@/constants/inquiry";
import { useScrap } from "@/hooks/scrap/useScrap";
import { formatDateToKorean } from "@/utils/dateUtils";
import { InquiryListItem as InquiryListItemType } from "@/types/inquiry/inquiryListApi.type";

type Props = {
  item: InquiryListItemType;
  isScraped: boolean;
};

const InquiryListItem = ({ item, isScraped }: Props) => {
  const navigate = useNavigate();
  const { scrapInquiry, unscrapInquiry, isScrapLoading } = useScrap();
  const [scraped, setScraped] = useState(isScraped);

  const handleScrapClick = () => {
    if (scraped) {
      unscrapInquiry(item.id);
    } else {
      scrapInquiry(item.id);
    }
    // 낙관적 업데이트
    setScraped(prev => !prev);
  };
  return (
    <li className="h-16 border-t-[1px] border-y-gray-10 rounded-b-[15px] bg-white flex w-full">
      <button
        className="px-4 mr-7 flex items-center cursor-pointer"
        onClick={handleScrapClick}
        disabled={isScrapLoading}
      >
        {scraped ? (
          <StarActive className="w-5 h-5" />
        ) : (
          <Star className="text-gray-30 w-5 h-5" />
        )}
      </button>

      <div
        className="flex flex-1 cursor-pointer"
        onClick={() => navigate(`/inquiries/${item.id}`)}
      >
        <div className="px-4 w-40 flex items-center gap-2">
          {item.leftProfiles.length > 0 ? (
            item.leftProfiles[0].profile_image_url ? (
              <img
                src={item.leftProfiles[0].profile_image_url}
                alt={item.leftProfiles[0].name}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <ProfileIcon className="w-6 h-6 rounded-full" />
            )
          ) : null}
          <span className="text-body1 text-gray-100">
            {item.leftProfiles[0]?.name}
          </span>
        </div>

        <span className="text-body1 flex items-center text-gray-100 flex-1 min-w-[468px] px-4">
          {item.title}
        </span>

        <div className="w-40 px-4 flex items-center">
          <div
            className={`flex items-center pl-2 pr-3 gap-2 h-8 rounded-[30px] ${INQUIRY_STATUS_STYLES[item.status].bg} ${INQUIRY_STATUS_STYLES[item.status].text}`}
          >
            <div
              className={`rounded-full w-2 h-2 ${INQUIRY_STATUS_STYLES[item.status].dot}`}
            />
            <span className="text-body1">{item.status}</span>
          </div>
        </div>

        <div className="w-[252px] flex items-center px-4">
          <span className="text-gray-100 text-body1">
            {formatDateToKorean(item.created_at)}
          </span>
        </div>
      </div>
    </li>
  );
};

export default InquiryListItem;
