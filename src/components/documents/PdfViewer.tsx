export default function PdfViewer({ src }: { src: string }) {
  return (
    <iframe
      src={src}
      className="w-full h-[80vh] rounded-lg border border-white/10"
    />
  );
}
