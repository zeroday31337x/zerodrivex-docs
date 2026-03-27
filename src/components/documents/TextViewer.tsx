type Props = {
  content: string;
};

export default function TextViewer({ content }: Props) {
  return (
    <div className="prose prose-invert max-w-none break-words
      prose-p:leading-7
      prose-headings:font-bold
    ">
      {content.split('\n\n').map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}
