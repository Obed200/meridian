import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ArticleBody({ body }: { body: string }) {
  return (
    <div className="prose prose-neutral prose-lg mx-auto max-w-none font-serif prose-headings:font-serif prose-a:text-red-600">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </div>
  );
}
