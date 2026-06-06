export function renderCommentMenu(
  commentId,
  permissions = {}
) {
  return `
    <div
      class="cb-comment-menu"
      data-comment-id="${commentId}"
    >
      <button
        class="cb-menu-item cb-report-comment"
        data-comment-id="${commentId}"
      >
        Report
      </button>

      <button
        class="cb-menu-item cb-copy-comment-link"
        data-comment-id="${commentId}"
      >
        Copy link
      </button>

      ${permissions.canDelete ? `
        <button
          class="cb-menu-item cb-delete-comment"
          data-comment-id="${commentId}"
        >
          Delete
        </button>
      ` : ''}

      ${permissions.canLock ? `
        <button
          class="cb-menu-item cb-lock-comment"
          data-comment-id="${commentId}"
        >
          Lock Comment
        </button>
      ` : ''}

      ${permissions.canMute ? `
        <button
          class="cb-menu-item cb-mute-user"
          data-comment-id="${commentId}"
        >
          Mute User
        </button>
      ` : ''}

      ${permissions.canPin ? `
        <button
          class="cb-menu-item cb-pin-comment"
          data-comment-id="${commentId}"
        >
          Pin Comment
        </button>
      ` : ''}
    </div>
  `;
}