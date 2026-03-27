'use client';

export default function DeleteDocButton({ id }: { id: string }) {
  return (
    <form action="/api/admin/docs/delete" method="POST" className="inline">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-xs text-red-400 hover:underline"
        onClick={(e) => {
          if (!confirm('Delete this document?')) e.preventDefault();
        }}
      >
        Delete
      </button>
    </form>
  );
}
