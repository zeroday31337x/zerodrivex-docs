// app/admin/docs/new/page.tsx
'use client';

export default function NewDocPage() {
  return (
    <form
      action="/api/admin/docs/upload"
      method="post"
      encType="multipart/form-data"
      className="space-y-4"
    >
      <input name="title" placeholder="Title" required />
      <input name="slug" placeholder="slug-like-this" required />

      <select name="type">
        <option value="RESEARCH">Research</option>
        <option value="WHITEPAPER">Whitepaper</option>
        <option value="PRODUCT">Product</option>
      </select>

      <input type="file" name="file" required />

      <button type="submit">Upload</button>
    </form>
  );
}
