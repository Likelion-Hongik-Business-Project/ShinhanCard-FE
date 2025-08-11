import MarkdownPreview from "@uiw/react-markdown-preview";

interface Props {
  content: string;
}

const MarkdownViewer = ({ content }: Props) => {
  return (
    <div className="prose max-w-none">
      <MarkdownPreview
        source={content}
        className="!bg-transparent !p-0 !shadow-none"
      />
    </div>
  );
};

export default MarkdownViewer;
