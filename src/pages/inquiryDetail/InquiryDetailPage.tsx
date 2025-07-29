import AdditionalInquirySection from "@/components/AdditionalInquiry/AdditionalInquirySection";
import { mockInquiryResponse } from "@/mocks/mockInquiryResponse";

const InquiryDetailPage = () => {
  return (
    <section className="w-full h-[835px] bg-gray-50">
      <AdditionalInquirySection inquiry={mockInquiryResponse} />
    </section>
  );
};

export default InquiryDetailPage;
