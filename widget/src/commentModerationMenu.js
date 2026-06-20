export function renderCommentModerationMenu(comment) {
  const p = comment.permissions || {};

  return `
    <div
      class="cb-mod-menu"
      data-comment-id="${comment.id}"
    >
      ${p.canPin ? `
        <button
          class="cb-menu-item cb-pin-comment"
          data-comment-id="${comment.id}"
        >
          ${comment.pinned ? 'Unpin comment' : 'Pin comment'}
        </button>
      ` : ''}

      ${p.canLock ? `
        <button
          class="cb-menu-item cb-lock-comment"
          data-comment-id="${comment.id}"
        >
          ${comment.locked ? 'Unlock comment' : 'Lock comment'}
        </button>
      ` : ''}

      ${p.canMuteAuthor ? `
        <button
          class="cb-menu-item cb-mute-user"
          data-comment-id="${comment.id}"
          data-user-id="${comment.author.id}"
        >
          Mute author
        </button>
      ` : ''}

      ${p.canDelete ? `
        <button
          class="cb-menu-item cb-danger-item cb-mod-delete-comment"
          data-comment-id="${comment.id}"
        >
          Delete comment
        </button>
      ` : ''}
    </div>
  `;
}