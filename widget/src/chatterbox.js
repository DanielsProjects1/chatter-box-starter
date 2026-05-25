(function () {
  const API_URL = 'http://localhost:8081';

  const DEFAULT_REACTIONS = ['👍', '❤️', '🔥', '😂'];

  const config = window.ChatterBoxConfig || {};
  const siteId = config.siteId;

  if (!siteId) {
    console.error('[ChatterBox] No siteId provided in window.ChatterBoxConfig');
    return;
  }

  const mountId = config.mountId || 'chatterbox-widget';
  const host = document.getElementById(mountId);

  if (!host) {
    console.error(`[ChatterBox] No element found with id "${mountId}"`);
    return;
  }

  // Create shadow DOM for style isolation
  const shadow = host.attachShadow({ mode: 'open' });

  let currentBoxId = null;
  let currentPage = 0;
  let allComments = [];

  // Initialize the widget
  async function init() {
    const pageUrl = window.location.pathname;
    try {
      const res = await fetch(`${API_URL}/api/v1/widget/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, pageUrl })
      });
      const box = await res.json();
      render(box);
    } catch (err) {
      showError('Failed to initialize comments. Please refresh the page.');
      console.error('[ChatterBox] Failed to initialize:', err);
    }
  }

  function render(box) {
    shadow.innerHTML = `
      <style>${getStyles()}</style>
      <div class="cb-root">
        <div class="cb-header">
          <span class="cb-title">Discussion</span>
        </div>
        <div class="cb-composer">
          <textarea
            class="cb-input"
            id="cb-input"
            placeholder="Join the discussion..."
          ></textarea>

          <div class="cb-composer-footer">
            <button class="cb-submit-btn" id="cb-submit-btn">
              Comment
            </button>
          </div>
        </div>
        <div class="cb-comments" id="cb-comments">
          <div class="cb-loading">Loading comments...</div>
        </div>
        <button class="cb-load-more" id="cb-load-more">
          Load more
        </button>
      </div>
    `;
    currentBoxId = box.id;
    attachComposerListener();
    attachGlobalEventDelegation();
    loadComments(currentBoxId);
  }

  async function loadComments(boxId) {
    try {
      const res = await fetch(`${API_URL}/api/v1/widget/${boxId}/comments?page=${currentPage}&size=20`);
      const data = await res.json();

      const loadMoreBtn = shadow.getElementById('cb-load-more');

      loadMoreBtn.style.display = data.last ? 'none' : 'block';

      allComments = currentPage === 0
        ? data.content || []
        : [...allComments, ...(data.content || [])];

      renderComments(allComments, data.totalElements || 0);
    } catch (err) {
      showError('Failed to load comments. Please try again.');
      console.error('[ChatterBox] Failed to load comments:', err);
    }
  }

  async function refreshCurrentComments() {
    const pageToRestore = currentPage;
    const loadedPages = [];
    let totalCount = 0;
    let isLastPage = false;
    for (let page = 0; page <= pageToRestore; page++) {
      const res = await fetch(
        `${API_URL}/api/v1/widget/${currentBoxId}/comments?page=${page}&size=20`
      );
      const data = await res.json();
      totalCount = data.totalElements || 0;
      isLastPage = data.last;
      loadedPages.push(
        ...(data.content || [])
      );
    }

    allComments = loadedPages;

    const loadMoreBtn = shadow.getElementById(
      'cb-load-more'
    );

    loadMoreBtn.style.display = isLastPage
      ? 'none'
      : 'block';

    renderComments(
      allComments,
      totalCount
    );
  }

  function renderComments(comments, totalCount) {
    const title = shadow.querySelector('.cb-title');
    title.textContent = `Discussion · ${totalCount} ${totalCount === 1 ? 'comment' : 'comments'}`;
    const container = shadow.getElementById('cb-comments');
    if (comments.length === 0) {
      container.innerHTML = '<div class="cb-empty">No comments yet. Be the first!</div>';
      return;
    }
    container.innerHTML = comments.map(renderComment).join('');
  }

  function renderComment(comment) {
    const initials = comment.author.displayName
      ? comment.author.displayName.charAt(0).toUpperCase()
      : '?';
    return `
      <div class="cb-comment">
        <div class="cb-avatar">${initials}</div>
        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">${comment.author.displayName || comment.author.username}</span>
            <span class="cb-timestamp">${formatTime(comment.createdDate)}</span>
          </div>
          <div class="cb-comment-text">${escapeHtml(comment.body)}</div>
          <div class="cb-comment-actions">
            <button class="cb-action-btn cb-reply-btn" data-comment-id="${comment.id}" >
              Reply
            </button>
            ${comment.replyCount > 0 ? `
              <button
                class="cb-action-btn cb-view-replies-btn"
                data-comment-id="${comment.id}"
              >
                View ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}
              </button>
            ` : ''}
            <div class="cb-reactions">
              ${renderReactions(comment)}
            </div>
          </div>
          <div
            class="cb-reply-container"
            id="reply-container-${comment.id}"
          ></div>
          <div
            class="cb-replies"
            id="replies-${comment.id}"
          ></div>
        </div>
      </div>
    `;
  }

  function renderReply(reply) {
    const initials = reply.author.displayName
      ? reply.author.displayName
          .charAt(0)
          .toUpperCase()
      : '?';

    return `
      <div class="cb-comment cb-reply">
        <div class="cb-avatar">
          ${initials}
        </div>

        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">
              ${reply.author.displayName ||
                reply.author.username}
            </span>

            <span class="cb-timestamp">
              ${formatTime(reply.createdDate)}
            </span>
          </div>

          <div class="cb-comment-text">
            ${escapeHtml(reply.body)}
          </div>
        </div>
      </div>
    `;
  }

  function renderReactions(comment) {
    const reactionMap = {};

    (comment.reactions || []).forEach(reaction => {
      reactionMap[reaction.emoji] = reaction.count;
    });

    return DEFAULT_REACTIONS.map(emoji => {
      const count = reactionMap[emoji] || 0;
      return `
        <button
          class="cb-reaction-btn"
          data-comment-id="${comment.id}"
          data-emoji="${emoji}"
        >
          ${emoji}
          ${count > 0 ? `<span>${count}</span>` : ''}
        </button>
      `;
    }).join('');
  }

  function attachGlobalEventDelegation() {
    shadow.addEventListener('click', async (e) => {
      const loadMoreBtn = e.target.closest('#cb-load-more');

      if (loadMoreBtn) {
        currentPage += 1;
        await loadComments(currentBoxId);
        return;
      }

      const reactionBtn = e.target.closest('.cb-reaction-btn');

      if (reactionBtn) {
        const commentId = reactionBtn.dataset.commentId;
        const emoji = reactionBtn.dataset.emoji;
        reactionBtn.disabled = true;
        try {
          await fetch(
            `${API_URL}/api/v1/widget/comments/${commentId}/reactions`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ emoji })
            }
          );
          await refreshCurrentComments();
        } catch (err) {
          reactionBtn.disabled = false;
          showError('Failed to add reaction. Please try again.');
          console.error('[ChatterBox] Failed to react:', err);
        } 
        return;
      }

      const replyBtn = e.target.closest('.cb-reply-btn');

      if (replyBtn) {
        const commentId = replyBtn.dataset.commentId;

        const container = shadow.getElementById(
          `reply-container-${commentId}`
        );

        if (container.innerHTML.trim()) {
          container.innerHTML = '';
          return;
        }

        container.innerHTML = `
          <div class="cb-inline-reply">

            <textarea
              class="cb-inline-input"
              placeholder="Write a reply..."
            ></textarea>

            <div class="cb-inline-actions">

              <button class="cb-inline-cancel">
                Cancel
              </button>

              <button
                class="cb-inline-submit"
                data-comment-id="${commentId}"
              >
                Reply
              </button>

            </div>

          </div>
        `;

        queueMicrotask(() => {
          container.querySelector('textarea')?.focus();
        });

        return;
      }

      const viewRepliesBtn = e.target.closest('.cb-view-replies-btn');

      if (viewRepliesBtn) {
        const commentId = viewRepliesBtn.dataset.commentId;

        const repliesContainer = shadow.getElementById(
            `replies-${commentId}`
          );

        // toggle close
        if (repliesContainer.innerHTML.trim()) {
          repliesContainer.innerHTML = '';
          return;
        }

        repliesContainer.innerHTML = '<div class="cb-loading">Loading replies...</div>';

        try {
          const res = await fetch(
            `${API_URL}/api/v1/widget/${currentBoxId}/comments/${commentId}`
          );

          const data = await res.json();

          const replies = data.content || [];

          repliesContainer.innerHTML = replies.length
              ? replies.map(renderReply).join('')
              : '<div class="cb-empty">No replies yet.</div>';

        } catch (err) {
          repliesContainer.innerHTML = '<div class="cb-empty">Could not load replies.</div>';
          showError('Failed to load replies. Please try again.');
          console.error(
            '[ChatterBox] Failed to load replies:',
            err
          );
        }

        return;
      }

      const submitBtn = e.target.closest('.cb-inline-submit');
      if (submitBtn) {
        const commentId = submitBtn.dataset.commentId;
        const wrapper = submitBtn.closest('.cb-inline-reply');
        const textarea = wrapper.querySelector('textarea');
        const body = textarea.value.trim();
        if (!body) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Posting...';

        try {
          await fetch(
            `${API_URL}/api/v1/widget/${currentBoxId}/comments`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                body,
                parentCommentId: commentId
              })
            }
          );
          const replyContainer = wrapper.closest('.cb-reply-container');

          await refreshCurrentComments();

          queueMicrotask(() => {
            const repliesBtn = shadow.querySelector(
              `.cb-view-replies-btn[data-comment-id="${commentId}"]`
            );

            repliesBtn?.click();
          });

          if (replyContainer) {
            replyContainer.innerHTML = '';
          }
        } catch (err) {
          showError('Failed to post reply. Please try again.');
          console.error(
            '[ChatterBox] Reply failed:',
            err
          );
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Reply';
        }
        return;
      }

      const cancelBtn = e.target.closest('.cb-inline-cancel');

      if (cancelBtn) {
        const container = cancelBtn.closest('.cb-reply-container');

        if (container) {
          container.innerHTML = '';
        }
      }
    });
  }

  function attachComposerListener() {
    const submitBtn = shadow.getElementById('cb-submit-btn');
    const input = shadow.getElementById('cb-input');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitBtn.click();
      }
    });

    submitBtn.addEventListener('click', async () => {
      const body = input.value.trim();

      if (!body) return;
      if (submitBtn.disabled) return;
      prependOptimisticComment(body);
      submitBtn.disabled = true;
      submitBtn.textContent = 'Posting...';

      try {
        await fetch(
          `${API_URL}/api/v1/widget/${currentBoxId}/comments`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ body })
          }
        );

        input.value = '';

        await refreshCurrentComments();

      } catch (err) {
        showError('Failed to post comment. Please try again.');
        console.error('[ChatterBox] Failed to post comment:', err);

      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Comment';
      }
    });
  }

  function prependOptimisticComment(body) {
    const container = shadow.getElementById('cb-comments');

    const optimisticHtml = `
      <div class="cb-comment cb-comment-pending">
        <div class="cb-avatar">Y</div>

        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">You</span>
            <span class="cb-timestamp">just now</span>
          </div>

          <div class="cb-comment-text">
            ${escapeHtml(body)}
          </div>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('afterbegin', optimisticHtml);
  }

  function formatTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showError(message) {
    const existing = shadow.getElementById('cb-error');

    existing?.remove();

    const errorDiv = document.createElement('div');

    errorDiv.id = 'cb-error';
    errorDiv.className = 'cb-error';
    errorDiv.textContent = message;

    shadow
      .querySelector('.cb-root')
      .appendChild(errorDiv);

    setTimeout(() => {
      errorDiv.remove();
    }, 2500);
  }

  function getStyles() {
    return `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      :host { font-family: 'Inter', system-ui, sans-serif; }
      .cb-root { max-width: 720px; color: #e1e1e1; background: #111318; border: 1px solid #23262d; border-radius: 16px; padding: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.4), 0 12px 32px rgba(0,0,0,0.28); }
      .cb-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
      .cb-title { font-size: 16px; font-weight: 600; color: #f8fafc; }
      .cb-composer { margin-bottom: 24px; background: #0d1015; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; overflow: hidden; box-shadow: inset 0 1px 0 rgba(255,255,255,0.02), 0 1px 2px rgba(0,0,0,0.3); } 
      .cb-input { width: 100%; min-height: 90px; background: transparent; border: none; outline: none; resize: vertical; padding: 14px; color: #f3f4f6; font-size: 14px; line-height: 1.5; font-family: inherit; } 
      .cb-input:focus { background: rgba(255,255,255,0.015); }
      .cb-input::placeholder { color: #6b7280; } 
      .cb-composer-footer { display: flex; justify-content: flex-end; padding: 12px; border-top: 1px solid rgba(255,255,255,0.06); } 
      .cb-submit-btn { background: #f3f4f6; color: #111827; border: none; border-radius: 10px; padding: 8px 14px; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.15s ease; } 
      .cb-submit-btn:hover { opacity: 0.9; }
      .cb-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      .cb-comments { display: flex; flex-direction: column; gap: 4px; }
      .cb-comment { display: flex; gap: 12px; padding: 14px 10px; border-radius: 12px; transition: background 0.15s ease, border-color 0.15s ease; }
      .cb-comment-pending { opacity: 0.7; }
      .cb-comment:hover { background: rgba(255,255,255,0.025); }
      .cb-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #2d3748, #1a202c); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #d1d5db; flex-shrink: 0; }
      .cb-comment-body { flex: 1; }
      .cb-comment-text { white-space: pre-wrap; word-break: break-word; font-size: 14px; line-height: 1.6; color: #c8c8c8;}
      .cb-comment-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
      .cb-username { font-size: 13px; font-weight: 600; color: #f0f0f0; }
      .cb-timestamp { font-size: 12px; color: #7c8594; }
      .cb-comment-actions { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
      .cb-action-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 999px; padding: 4px 10px; font-size: 12px; color: #9ca3af; cursor: pointer; transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.1s ease; } 
      .cb-reactions { display: flex; gap: 6px; flex-wrap: wrap; } 
      .cb-reaction-btn { display: inline-flex; align-items: center; gap: 4px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 999px; padding: 4px 8px; font-size: 12px; color: #d1d5db; cursor: pointer; transition: background 0.15s ease, border-color 0.15s ease, transform 0.1s ease; } 
      .cb-reaction-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.12); } 
      .cb-reaction-btn:active { transform: scale(0.96); }
      .cb-reaction-btn:disabled { opacity: 0.5; cursor: wait; }
      .cb-replies { margin-top: 10px; margin-left: 28px; padding-left: 12px; border-left: 1px solid rgba(255,255,255,0.08); } 
      .cb-reply { padding-top: 10px; padding-bottom: 10px; }
      .cb-action-btn:hover { background: rgba(255,255,255,0.08); color: #f3f4f6; }
      .cb-inline-actions { display: flex; justify-content: flex-end; gap: 8px; } 
      .cb-inline-cancel { background: transparent; border: 1px solid rgba(255,255,255,0.08); color: #9ca3af; border-radius: 8px; padding: 6px 12px; font-size: 12px; cursor: pointer; }
      .cb-inline-reply { margin-top: 12px; display: flex; flex-direction: column; gap: 10px; } 
      .cb-inline-input { width: 100%; min-height: 72px; resize: vertical; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); color: #f3f4f6; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-family: inherit; outline: none; } 
      .cb-inline-input:focus { border-color: rgba(255,255,255,0.16); background: rgba(255,255,255,0.03); }
      .cb-view-replies-btn { color: #cbd5e1; }
      .cb-empty { font-size: 14px; color: #666; padding: 20px 0; }
      .cb-loading { font-size: 14px; color: #666; padding: 20px 0; }
      .cb-load-more { margin-top: 14px; width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #cbd5e1; border-radius: 10px; padding: 10px; cursor: pointer; }
      .cb-error { position: sticky; bottom: 12px; margin-top: 12px; background: #1f2937; border: 1px solid rgba(255,255,255,0.08); color: #f8fafc; border-radius: 10px; padding: 10px 12px; font-size: 13px; }
    `;
  }

  init();
})();