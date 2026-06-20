export function renderCommentMenu(
  commentId,
  permissions = {}
) {
  return `
    <div
      class="cb-comment-menu"
      data-comment-id="${commentId}"
    >

      ${permissions.canEdit ? `
        <button
          class="cb-menu-item cb-edit-comment"
          data-comment-id="${commentId}"
        >
          Edit
        </button>
      ` : ''}

      ${permissions.canDelete ? `
        <button
          class="cb-menu-item cb-delete-comment"
          data-comment-id="${commentId}"
        >
          Delete
        </button>
      ` : ''}

      ${permissions.canReport ? `
        <button
          class="cb-menu-item cb-report-comment"
          data-comment-id="${commentId}"
        >
          Report
        </button>
      ` : ''}

      <button
        class="cb-menu-item cb-copy-comment-link"
        data-comment-id="${commentId}"
      >
        Copy link
      </button>

    </div>
  `;
}