export function renderCommentMenu(comment) {
  const p = comment.permissions || {};

  return `
    <div
      class="cb-comment-menu"
      data-comment-id="${comment.id}"
    >

      ${p.canEdit ? `
        <button
          class="cb-menu-item cb-edit-comment"
          data-comment-id="${comment.id}"
        >
          Edit
        </button>
      ` : ''}

      ${p.canDelete ? `
        <button
          class="cb-menu-item cb-delete-comment"
          data-comment-id="${comment.id}"
        >
          Delete
        </button>
      ` : ''}

      ${p.canReport ? `
        <button
          class="cb-menu-item cb-report-comment"
          data-comment-id="${comment.id}"
        >
          Report
        </button>
      ` : ''}

      <button
        class="cb-menu-item cb-copy-comment-link"
        data-comment-id="${comment.id}"
      >
        Copy link
      </button>

    </div>
  `;
}