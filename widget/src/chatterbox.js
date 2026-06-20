import {
  renderLoginForm,
  renderSignupForm
} from './authForms.js';
import { renderCommentMenu } from './commentMenu.js';
import { renderCommentModerationMenu } from './commentModerationMenu.js';
import { renderBoxModerationMenu } from './boxModerationMenu.js';

(function () {
  const API_URL = 'http://127.0.0.1:8081';

  const REACTION_UI = {HEART: '❤️', THUMBS_UP: '👍', THUMBS_DOWN: '👎', LAUGH: '😂', SURPRISED: '😮', SAD: '😢', FIRE: '🔥' };
  const REACTION_ORDER = [ 'THUMBS_UP', 'HEART', 'FIRE', 'LAUGH', 'SURPRISED', 'SAD', 'THUMBS_DOWN' ];

  const config = window.ChatterBoxConfig || {};
  let refreshPromise = null;
  const repliesByParentId = new Map();
  let authReadyPromise = Promise.resolve();
  const savedToken = localStorage.getItem('chatterbox_token');
  const lastActive = Number(localStorage.getItem('chatterbox_last_active') || 0);
  const IDLE_LIMIT = 1000 * 60 * 60 * 24 * 7; // 7 days
  // if (savedToken && Date.now() - lastActive < IDLE_LIMIT) {
  //   config.token = savedToken;
  // } else {
  //   clearAuthSession();
  // }
  if (savedToken && Date.now() - lastActive < IDLE_LIMIT) {
    config.token = savedToken;

    if (shouldRefreshToken(savedToken)) {
      authReadyPromise = refreshAccessToken().then(success => {
        if (!success) {
          clearAuthSession();
        }
        return success;
      });
    }
  } else {
    clearAuthSession();
  }

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
  let currentBox = null;
  let totalCommentCount = 0;
  let eventsAttached = false;
  let currentPage = 0;
  let allComments = [];
  let rulesLoaded = false;
  let cachedRules = [];
  const commentById = new Map();
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
        <div class="cb-tabs">
          <button class="cb-tab cb-tab-active" data-tab="comments">
            Chatter
          </button>
          <button class="cb-tab" data-tab="rules" id="cb-rules-tab">
            Rules
          </button>
        </div>
        
        <div class="cb-header">
          <span class="cb-title">Chatter</span>
          ${renderBoxModerationMenu(box)}
        </div>
        <div id="cb-comments-panel">
          <div class="cb-composer">
            <textarea
              class="cb-input"
              id="cb-input"
              rows="1"
              placeholder="Join the chatter..."
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
        <div id="cb-rules-panel" style="display:none;">
          <div class="cb-rules-list" id="cb-rules-list">
            Loading rules...
          </div>
        </div>
      </div>
    `;
    currentBox = box;
    currentBoxId = box.id;
    queueMicrotask(applyBoxStateToComposer);
    attachComposerListener();
    if (!eventsAttached) {
      attachGlobalEventDelegation();
      eventsAttached = true;
    }
    loadComments(currentBoxId);
  }

  async function loadComments(boxId) {
    try {
      const res = await fetch(`${API_URL}/api/v1/widget/${boxId}/comments?page=${currentPage}&size=20`);
      const data = await res.json();
      totalCommentCount = data.totalElements || 0;
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
    updateCommentTitle(totalCount);
    // const title = shadow.querySelector('.cb-title');
    // title.textContent = `Chatter · ${totalCount} ${totalCount === 1 ? 'comment' : 'comments'}`;
    const container = shadow.getElementById('cb-comments');
    if (comments.length === 0) {
      container.innerHTML = '<div class="cb-empty">No comments yet. Be the first!</div>';
      return;
    }
    comments.forEach(indexComment);
    container.innerHTML = comments.map(renderComment).join('');
  }

  function renderComment(comment) {
    const initials = comment.author.displayName
      ? comment.author.displayName.charAt(0).toUpperCase()
      : '?';
      console.log('comment replyCount:', comment.id, comment.replyCount);
    return `
      <div class="cb-comment ${comment.replyCount > 0 ? 'cb-has-replies' : ''}">
        <div class="cb-avatar">${initials}</div>
        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">${comment.author.displayName || comment.author.username}</span>
            <span class="cb-timestamp">${formatTime(comment.createdDate)}</span>
          </div>
          <div class="cb-comment-text">${escapeHtml(comment.body)}</div>
          <div class="cb-comment-actions">
            <button
              class="cb-action-btn cb-reply-btn"
              data-comment-id="${comment.id}"
              data-root-comment-id="${comment.id}"
              data-reply-to="${escapeHtml(comment.author.displayName || comment.author.username)}"
            >
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
            <button
              class="cb-comment-menu-btn"
              data-comment-id="${comment.id}"
              aria-expanded="false"
            >
              ⋯
            </button>
            ${hasCommentModActions(comment) ? `
              <button
                class="cb-mod-menu-btn"
                data-comment-id="${comment.id}"
              >
                Moderate
              </button>
            ` : ''}
          </div>
          <div
            class="cb-reply-container"
            id="reply-container-${comment.id}"
          ></div>
        </div>
          ${comment.replyCount > 0 ? `
            <div
              class="cb-replies"
              id="replies-${comment.id}"
            ></div>
          ` : ''}
        
      </div>
    `;
  }

  function updateCommentTitle(count = totalCommentCount) {
    totalCommentCount = count;

    const title = shadow.querySelector('.cb-title');
    if (!title) return;

    title.textContent =
      `Chatter · ${totalCommentCount} ${totalCommentCount === 1 ? 'comment' : 'comments'}`;
  }

  function hasCommentModActions(comment) {
    const p = comment.permissions || {};
    return ( p.canPin || p.canLock || p.canMuteAuthor || p.canDelete );
  }

  async function openReplies(commentId) {
    let repliesContainer = shadow.getElementById(
      `replies-${commentId}`
    );

    // create container if missing
    if (!repliesContainer) {
      const parentReplyContainer = shadow.getElementById(
        `reply-container-${commentId}`
      );

      if (!parentReplyContainer) return;

      parentReplyContainer.insertAdjacentHTML(
        'afterend',
        `
          <div
            class="cb-replies"
            id="replies-${commentId}"
          ></div>
        `
      );

      repliesContainer =
        shadow.getElementById(
          `replies-${commentId}`
        );
    }

    repliesContainer.innerHTML = '<div class="cb-loading">Loading replies...</div>';
    if (repliesByParentId.has(commentId)) {
      const cachedReplies = repliesByParentId.get(commentId);
      repliesContainer.innerHTML = cachedReplies.length
        ? cachedReplies.map(reply => renderReply(reply, commentId)).join('')
        : '';
      return;
    }
    const res = await fetch(
      `${API_URL}/api/v1/widget/${currentBoxId}/comments/${commentId}`
    );
    const data = await res.json();
    const replies = data.content || [];
    replies.forEach(indexComment);
    repliesByParentId.set(commentId, replies);
    repliesContainer.innerHTML = replies.length
      ? replies.map(reply => renderReply(reply, commentId)).join('')
      : '';
  }

  function renderReply(reply, rootCommentId) {
    const initials = reply.author.displayName
      ? reply.author.displayName.charAt(0).toUpperCase()
      : '?';

    const username = reply.author.displayName || reply.author.username;

    return `
      <div class="cb-comment cb-reply">
        <div class="cb-avatar">
          ${initials}
        </div>

        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">
              ${username}
            </span>
            <span class="cb-timestamp">
              ${formatTime(reply.createdDate)}
            </span>
          </div>

          <div class="cb-comment-text">
            ${escapeHtml(reply.body)}
          </div>

          <div class="cb-comment-actions">
            <button
              class="cb-action-btn cb-reply-btn"
              data-comment-id="${reply.id}"
              data-root-comment-id="${rootCommentId}"
              data-reply-to="${escapeHtml(username)}"
            >
              Reply
            </button>

            <div class="cb-reactions">
              ${renderReactions(reply)}
            </div>
            <button
              class="cb-comment-menu-btn"
              data-comment-id="${reply.id}"
              aria-expanded="false"
            >
              ⋯
            </button>
            ${hasCommentModActions(reply) ? `
              <button
                class="cb-mod-menu-btn"
                data-comment-id="${reply.id}"
              >
                Moderate
              </button>
            ` : ''}
          </div>

          <div
            class="cb-reply-container"
            id="reply-container-${reply.id}"
          ></div>
        </div>
      </div>
    `;
  }

  function renderReactions(comment) {
    const reactionMap = {};

    for (const reaction of comment.reactions || []) {
      reactionMap[reaction.reactionType] = reaction;
    }

    let html = '';

    for (const type of REACTION_ORDER) {
      const reaction = reactionMap[type];

      const count = reaction ? reaction.count : 0;
      const reacted = reaction ? reaction.reacted : false;
      const emoji = REACTION_UI[type];

      html += `
        <button
          class="cb-reaction-btn ${reacted ? 'cb-reaction-active' : ''}"
          data-comment-id="${comment.id}"
          data-reaction-type="${type}"
        >
          ${emoji}
          ${count > 0 ? `<span>${count}</span>` : ''}
        </button>
      `;
    }

    return html;
  }

  function refreshBoxModerationUI() {
    const header = shadow.querySelector('.cb-header');
    const oldMenu = shadow.querySelector('.cb-box-mod-actions');

    oldMenu?.remove();

    header.insertAdjacentHTML(
      'beforeend',
      renderBoxModerationMenu(currentBox)
    );
  }

  function applyBoxStateToComposer() {
    const input = shadow.getElementById('cb-input');
    const submitBtn = shadow.getElementById('cb-submit-btn');

    if (!input || !submitBtn || !currentBox) return;

    const disabled = currentBox.locked || !currentBox.active;

    input.disabled = disabled;
    submitBtn.disabled = disabled;

    input.placeholder = !currentBox.active
      ? 'This discussion is inactive.'
      : currentBox.locked
        ? 'This discussion is locked.'
        : 'Join the chatter...';
  }

  function attachGlobalEventDelegation() {
    shadow.addEventListener('click', async (e) => {
      const loadMoreBtn = e.target.closest('#cb-load-more');

      if (loadMoreBtn) {
        currentPage += 1;
        await loadComments(currentBoxId);
        return;
      }

      const tabBtn = e.target.closest('.cb-tab');
      if (tabBtn) {
        const tab = tabBtn.dataset.tab;

        shadow.querySelectorAll('.cb-tab').forEach(btn => {
          btn.classList.remove('cb-tab-active');
        });

        tabBtn.classList.add('cb-tab-active');

        shadow.getElementById('cb-comments-panel').style.display =
          tab === 'comments' ? 'block' : 'none';

        shadow.getElementById('cb-rules-panel').style.display =
          tab === 'rules' ? 'block' : 'none';

        if (tab === 'rules' && !rulesLoaded) {
          await loadRules();
          rulesLoaded = true;
        }
        return;
      }

      const boxActionBtn = e.target.closest('.cb-box-mod-action');

      if (boxActionBtn) {
        if (!(await requireAuth())) return;

        const action = boxActionBtn.dataset.boxAction;

        if (
          action === 'empty' &&
          !confirm('Delete every comment in this discussion?')
        ) {
          return;
        }

        const res = await authFetch(
          `${API_URL}/api/v1/widget/boxes/${currentBoxId}/${action}`,
          { method: 'PUT' }
        );

        if (!res.ok) {
          showError('Failed to update discussion.');
          return;
        }
        if (action === 'shut') currentBox.locked = true;
        if (action === 'open') currentBox.locked = false;
        if (action === 'deactivate') {
          currentBox.active = !currentBox.active;
        }
        if (action === 'empty') {
          allComments = [];
          commentById.clear();
          repliesByParentId.clear();
          updateCommentTitle(0);

          const container = shadow.getElementById('cb-comments');
          container.innerHTML = '<div class="cb-empty">No comments yet. Be the first!</div>';

          const loadMoreBtn = shadow.getElementById('cb-load-more');
          loadMoreBtn.style.display = 'none';
        }
        shadow.querySelectorAll('.cb-reply-container').forEach(el => {
          el.innerHTML = '';
        });
        refreshBoxModerationUI();
        applyBoxStateToComposer();
        showError(`Box updated. Action: ${action}`);
        return;
      }

      const modMenuBtn = e.target.closest('.cb-mod-menu-btn');

      if (modMenuBtn) {
        const existingMenu = shadow.querySelector('.cb-mod-menu');

        if (existingMenu) {
          const existingCommentId = existingMenu.dataset.commentId;
          existingMenu.remove();

          if (existingCommentId === modMenuBtn.dataset.commentId) {
            return;
          }
        }

        const comment = findCommentById( modMenuBtn.dataset.commentId );
        if (!comment) return;

        modMenuBtn.insertAdjacentHTML(
          'afterend',
          renderCommentModerationMenu(comment)
        );

        return;
      }

      const lockCommentBtn = e.target.closest('.cb-lock-comment');

      if (lockCommentBtn) {
        if (!(await requireAuth())) return;

        const commentId = lockCommentBtn.dataset.commentId;

        const res = await authFetch(
          `${API_URL}/api/v1/dashboard/moderation/${siteId}/comments/${commentId}/lock`,
          { method: 'PUT' }
        );

        if (!res.ok) {
          showError('Failed to update comment lock.');
          return;
        }

        showError('Comment updated.');
        shadow.querySelector('.cb-mod-menu')?.remove();
        await refreshCurrentComments();
        return;
      }

      const pinCommentBtn = e.target.closest('.cb-pin-comment');

      if (pinCommentBtn) {
        if (!(await requireAuth())) return;

        const commentId = pinCommentBtn.dataset.commentId;

        const res = await authFetch(
          `${API_URL}/api/v1/dashboard/moderation/${siteId}/comments/${commentId}/pin`,
          { method: 'PUT' }
        );

        if (!res.ok) {
          showError('Failed to update pinned comment.');
          return;
        }

        showError('Comment updated.');
        shadow.querySelector('.cb-mod-menu')?.remove();
        await refreshCurrentComments();
        return;
      }

      const modDeleteBtn = e.target.closest('.cb-mod-delete-comment');

      if (modDeleteBtn) {
        if (!(await requireAuth())) return;

        const commentId = modDeleteBtn.dataset.commentId;

        if (!confirm('Delete this comment?')) return;

        const res = await authFetch(
          `${API_URL}/api/v1/widget/${currentBoxId}/comments/${commentId}`,
          { method: 'DELETE' }
        );

        if (!res.ok) {
          showError('Failed to delete comment.');
          return;
        }

        commentById.delete(commentId);
        allComments = allComments.filter(comment => comment.id !== commentId);
        updateCommentTitle(Math.max(totalCommentCount - 1, 0));
        modDeleteBtn.closest('.cb-comment')?.remove();

        showError('Comment deleted.');
        shadow.querySelector('.cb-mod-menu')?.remove();
        return;
      }

      const muteUserBtn = e.target.closest('.cb-mute-user');

      if (muteUserBtn) {
        if (!(await requireAuth())) return;

        const userId = muteUserBtn.dataset.userId;
        const reason = prompt('Reason for muting this user?') || '';

        const res = await authFetch(
          `${API_URL}/api/v1/dashboard/moderation/${siteId}/mute/${userId}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: reason
          }
        );

        if (!res.ok) {
          showError('Failed to mute user.');
          return;
        }

        showError('User muted.');
        shadow.querySelector('.cb-mod-menu')?.remove();
        return;
      }

      const menuBtn = e.target.closest( '.cb-comment-menu-btn' );

      if (menuBtn) {
        const existingMenu = shadow.querySelector('.cb-comment-menu');

        const existingBtn = shadow.querySelector(
          '.cb-comment-menu-btn[aria-expanded="true"]'
        );

        if (existingBtn) {
          existingBtn.setAttribute(
            'aria-expanded',
            'false'
          );
        }

        if (existingMenu) {
          existingMenu.remove();
          if (existingBtn === menuBtn) return;
        }

        menuBtn.setAttribute(
          'aria-expanded',
          'true'
        );

        const comment = findCommentById(
          menuBtn.dataset.commentId
        );

        menuBtn.insertAdjacentHTML(
          'afterend',
          renderCommentMenu(
            menuBtn.dataset.commentId,
            comment?.permissions || {}
          )
        );

        return;
      }

      const reportBtn = e.target.closest('.cb-report-comment');

      if (reportBtn) {
        if (!(await requireAuth())) return;

        const commentId = reportBtn.dataset.commentId;
        if (!rulesLoaded) {
          await loadRules();
          rulesLoaded = true;
        }

        showReportModal(commentId);

        shadow.querySelector('.cb-comment-menu')?.remove();

        return;
      }

      const reportSubmitBtn = e.target.closest('.cb-report-submit');
      if (reportSubmitBtn) {
        const commentId = reportSubmitBtn.dataset.commentId;
        const reason = shadow.getElementById('cb-report-reason').value;
        const explanation = shadow.getElementById('cb-report-details').value.trim();
        const ruleSelect = shadow.getElementById('cb-report-rule');
        const ruleId = ruleSelect?.value || null;
        await authFetch(
          `${API_URL}/api/v1/widget/${currentBoxId}/comments/${commentId}/report`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason, explanation, ruleId })
          }
        );
        shadow.querySelector('.cb-report-modal-backdrop')?.remove();
        showError('Report submitted.');
        return;
      }
      const reportCloseBtn = e.target.closest('.cb-report-close');
      if (reportCloseBtn) {
        shadow.querySelector('.cb-report-modal-backdrop')?.remove();
        return;
      }

      const copyLinkBtn = e.target.closest(
        '.cb-copy-comment-link'
      );

      if (copyLinkBtn) {
        const commentId = copyLinkBtn.dataset.commentId;

        const url = `${window.location.href}#comment-${commentId}`;

        await navigator.clipboard.writeText(url);
        showError('Comment link copied.');

        shadow.querySelector('.cb-comment-menu')?.remove();

        shadow
          .querySelector('.cb-comment-menu-btn[aria-expanded="true"]')
          ?.setAttribute('aria-expanded', 'false');

        return;
      }

      const editBtn = e.target.closest('.cb-edit-comment');

      if (editBtn) {
        if (!(await requireAuth())) return;

        const commentId = editBtn.dataset.commentId;

        const commentEl = editBtn.closest('.cb-comment');
        const textEl = commentEl.querySelector('.cb-comment-text');

        const comment = findCommentById(commentId);
        const oldBody = comment?.body || textEl.textContent.trim();

        shadow.querySelector('.cb-comment-menu')?.remove();

        textEl.innerHTML = `
          <div class="cb-edit-box">
            <textarea class="cb-edit-input">${escapeHtml(oldBody)}</textarea>

            <div class="cb-inline-actions">
              <button
                class="cb-edit-cancel"
                data-comment-id="${commentId}"
              >
                Cancel
              </button>

              <button
                class="cb-edit-save"
                data-comment-id="${commentId}"
              >
                Save
              </button>
            </div>
          </div>
        `;

        textEl.querySelector('.cb-edit-input')?.focus();

        return;
      }

      const saveEditBtn = e.target.closest('.cb-edit-save');

      if (saveEditBtn) {
        if (!(await requireAuth())) return;

        const commentId = saveEditBtn.dataset.commentId;
        const commentEl = saveEditBtn.closest('.cb-comment');
        const input = commentEl.querySelector('.cb-edit-input');

        const body = input.value.trim();

        if (!body) {
          showError('Comment cannot be empty.');
          return;
        }

        saveEditBtn.disabled = true;
        saveEditBtn.textContent = 'Saving...';

        try {
          const res = await authFetch(
            `${API_URL}/api/v1/widget/comments/${commentId}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ body })
            }
          );

          if (!res.ok) {
            showError('Failed to edit comment.');
            return;
          }

          const comment = findCommentById(commentId);

          if (comment) {
            comment.body = body;
            indexComment(comment);
          }

          const textEl = commentEl.querySelector('.cb-comment-text');
          textEl.innerHTML = escapeHtml(body);

          showError('Comment updated.');
        } catch (err) {
          showError('Failed to edit comment.');
          console.error('[ChatterBox] Edit failed:', err);
        } finally {
          saveEditBtn.disabled = false;
          saveEditBtn.textContent = 'Save';
        }

        return;
      }

      const cancelEditBtn = e.target.closest('.cb-edit-cancel');

      if (cancelEditBtn) {
        const commentId = cancelEditBtn.dataset.commentId;
        const commentEl = cancelEditBtn.closest('.cb-comment');
        const textEl = commentEl.querySelector('.cb-comment-text');
        const comment = findCommentById(commentId);

        if (comment) {
          textEl.innerHTML = escapeHtml(comment.body);
        }
        return;
      }

      const deleteBtn = e.target.closest('.cb-delete-comment');

      if (deleteBtn) {
        if (!(await requireAuth())) return;

        const commentId = deleteBtn.dataset.commentId;

        const confirmed = confirm('Delete this comment?');

        if (!confirmed) return;

        deleteBtn.disabled = true;
        deleteBtn.textContent = 'Deleting...';

        try {
          const res = await authFetch(
            `${API_URL}/api/v1/widget/${currentBoxId}/comments/${commentId}`,
            {
              method: 'DELETE'
            }
          );

          if (!res.ok) {
            showError('Failed to delete comment.');
            return;
          }

          const commentEl = deleteBtn.closest('.cb-comment');

          commentEl?.remove();

          commentById.delete(commentId);

          allComments = allComments.filter(
            comment => comment.id !== commentId
          );

          shadow.querySelector('.cb-comment-menu')?.remove();

          showError('Comment deleted.');
        } catch (err) {
          showError('Failed to delete comment.');
          console.error('[ChatterBox] Delete failed:', err);
        }

        return;
      }


      const reactionBtn = e.target.closest('.cb-reaction-btn');

      if (reactionBtn) {
        if (!(await requireAuth())) return;
        const commentId = reactionBtn.dataset.commentId;
        const reactionType = reactionBtn.dataset.reactionType;
        reactionBtn.disabled = true;

        try {
          const res = await authFetch(
            `${API_URL}/api/v1/widget/comments/${commentId}/reactions`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ reactionType })
            }
          );

          if (!res.ok) {
            showError('Failed to add reaction. Please try again.');
            return;
          }
          const updatedReaction = await res.json();
          updateReactionButton( reactionBtn, updatedReaction );
          const comment = findCommentById(commentId);
          if (comment) {
            const reactions = comment.reactions || [];
            const existing = reactions.find(
              r => r.reactionType === updatedReaction.reactionType
            );

            if (existing) {
              existing.count = updatedReaction.count;
              existing.reacted = updatedReaction.reacted;
            } else {
              reactions.push(updatedReaction);
            }

            comment.reactions = reactions;
            indexComment(comment);
          }
        } catch (err) {
          showError('Failed to add reaction. Please try again.');
          console.error('[ChatterBox] Failed to react:', err);
        } finally {
          reactionBtn.disabled = false;
        }
        return;
      }

      const replyBtn = e.target.closest('.cb-reply-btn');

      if (replyBtn) {
        if (currentBox?.locked || !currentBox?.active) {
          showError(
            !currentBox.active
              ? 'This discussion is inactive.'
              : 'This discussion is locked.'
          );
          return;
        }
        if (!(await requireAuth())) return;

        const commentId = replyBtn.dataset.commentId;
        const replyTo = replyBtn.dataset.replyTo;
        const rootCommentId = replyBtn.dataset.rootCommentId || commentId;

        const container = shadow.getElementById(
          `reply-container-${commentId}`
        );

        if (container.innerHTML.trim()) {
          container.innerHTML = '';
          return;
        }

        const mention = replyTo ? `@${replyTo} ` : '';

        container.innerHTML = `
          <div class="cb-inline-reply">

            <textarea
              class="cb-inline-input"
              placeholder="Write a reply..."
            >${mention}</textarea>

            <div class="cb-inline-actions">

              <button class="cb-inline-cancel">
                Cancel
              </button>

              <button
                class="cb-inline-submit"
                data-comment-id="${commentId}"
                data-root-comment-id="${rootCommentId}"
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
        await openReplies(commentId);
        return;
      }

      const submitBtn = e.target.closest('.cb-inline-submit');

      if (submitBtn) {
        if (currentBox?.locked || !currentBox?.active) {
          showError(
            !currentBox.active
              ? 'This discussion is inactive.'
              : 'This discussion is locked.'
          );
          return;
        }
        if (!(await requireAuth())) return;

        const commentId = submitBtn.dataset.commentId;
        const rootCommentId = submitBtn.dataset.rootCommentId || commentId;
        const wrapper = submitBtn.closest('.cb-inline-reply');
        const textarea = wrapper.querySelector('textarea');

        const body = textarea.value.trim();

        if (!body) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Posting...';

        let optimisticReplyId = null;

        let repliesContainer = shadow.getElementById(`replies-${rootCommentId}`);

        if (!repliesContainer) {
          await openReplies(rootCommentId);
          repliesContainer = shadow.getElementById(`replies-${rootCommentId}`);
        }

        optimisticReplyId = appendOptimisticReply(
          rootCommentId,
          body
        );

        try {
          console.time('post');

          const res = await authFetch(
            `${API_URL}/api/v1/widget/${currentBoxId}/comments`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                body,
                parentId: rootCommentId
              })
            }
          );

          console.timeEnd('post');

          const replyContainer = wrapper.closest('.cb-reply-container');

          // await refreshCurrentComments();
          const savedReply = await res.json();
          if (optimisticReplyId) {
            shadow.getElementById(optimisticReplyId)?.remove();
          }
          indexComment(savedReply);
          const cachedReplies = repliesByParentId.get(rootCommentId) || [];
          cachedReplies.push(savedReply);
          repliesByParentId.set(
            rootCommentId,
            cachedReplies
          );
          const parent = allComments.find(
            c => c.id === rootCommentId
          );
          if (parent) {
            parent.replyCount = (parent.replyCount || 0) + 1;
          }
          let repliesContainer = shadow.getElementById(`replies-${rootCommentId}`);
          if (!repliesContainer) {
            await openReplies(rootCommentId);
            repliesContainer = shadow.getElementById(`replies-${rootCommentId}`);
          }
          repliesContainer.insertAdjacentHTML(
            'beforeend',
            renderReply(savedReply, rootCommentId)
          );

          const viewRepliesBtn = shadow.querySelector(
            `[data-comment-id="${rootCommentId}"].cb-view-replies-btn`
          );

          if (viewRepliesBtn) {
            const count = Number(
              viewRepliesBtn.textContent.match(/\d+/)?.[0] || 0
            ) + 1;

            viewRepliesBtn.textContent =
              `View ${count} ${count === 1 ? 'reply' : 'replies'}`;
          }
          if (replyContainer) {
            replyContainer.innerHTML = '';
          }

        } catch (err) {
          if (optimisticReplyId) {
            shadow.getElementById(optimisticReplyId)?.remove();
          }
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

      const closeAuthBtn = e.target.closest('.cb-auth-close');

      if (closeAuthBtn) {
        shadow.getElementById('cb-auth-modal')?.remove();
        return;
      }

      const loginBtn = e.target.closest('.cb-auth-login');

      if (loginBtn) {
        renderLoginForm(shadow);
        // later: open embedded auth flow
        console.log('[ChatterBox] Login clicked');
        return;
      }

      const signupBtn = e.target.closest('.cb-auth-signup');

      if (signupBtn) {
        renderSignupForm(shadow);
        // later: open embedded signup flow
        console.log('[ChatterBox] Sign up clicked');
        return;
      }

      const loginSubmitBtn = e.target.closest('.cb-auth-primary-login');

      if (loginSubmitBtn) {
        await handleLogin();
        return;
      }

      const signupSubmitBtn = e.target.closest('.cb-auth-primary-signup');

      if (signupSubmitBtn) {
        await handleSignup();
        return;
      }

      if (
        !e.target.closest('.cb-comment-menu') &&
        !e.target.closest('.cb-comment-menu-btn')
      ) {
        shadow.querySelector('.cb-comment-menu')?.remove();

        shadow
          .querySelector('.cb-comment-menu-btn[aria-expanded="true"]')
          ?.setAttribute('aria-expanded', 'false');
      }

      if (
        !e.target.closest('.cb-mod-menu') &&
        !e.target.closest('.cb-mod-menu-btn')
      ) {
        shadow.querySelector('.cb-mod-menu')?.remove();
      }
    });
  }

  function attachComposerListener() {
    const submitBtn = shadow.getElementById('cb-submit-btn');
    const input = shadow.getElementById('cb-input');
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = `${Math.min(input.scrollHeight, 160)}px`;
    });
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

      if (currentBox?.locked || !currentBox?.active) {
        showError(
          !currentBox.active
            ? 'This discussion is inactive.'
            : 'This discussion is locked.'
        );
        applyBoxStateToComposer();
        return;
      }
      if (!(await requireAuth())) return;

      const optimisticId = prependOptimisticComment(body);
      submitBtn.disabled = true;
      submitBtn.textContent = 'Posting...';

      try {
        console.time('post');
        const res = await authFetch(
          `${API_URL}/api/v1/widget/${currentBoxId}/comments`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ body })
          }
        );
        console.timeEnd('post');

        input.value = '';

        shadow.getElementById(optimisticId)?.remove();

        const savedComment = await res.json();
        indexComment(savedComment);
        allComments.unshift(savedComment);
        updateCommentTitle(totalCommentCount + 1);
        const commentsContainer = shadow.getElementById('cb-comments');
        commentsContainer.insertAdjacentHTML('afterbegin', renderComment(savedComment));

      } catch (err) {
        shadow.getElementById(optimisticId)?.remove();
        showError('Failed to post comment. Please try again.');
        console.error('[ChatterBox] Failed to post comment:', err);

      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Comment';
        applyBoxStateToComposer();
      }
    });
  }

  function updateReactionButton(button, reaction) {
    button.classList.toggle(
      'cb-reaction-active',
      reaction.reacted
    );

    let span = button.querySelector('span');

    if (reaction.count > 0) {
      if (!span) {
        button.insertAdjacentHTML(
          'beforeend',
          `<span>${reaction.count}</span>`
        );
      } else {
        span.textContent = reaction.count;
      }
    } else {
      span?.remove();
    }
  }

  function prependOptimisticComment(body) {
    const container = shadow.getElementById('cb-comments');
    const optimisticId = `cb-pending-${crypto.randomUUID()}`;

    const optimisticHtml = `
      <div id="${optimisticId}" class="cb-comment cb-comment-pending">
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

    return optimisticId;
  }

  function appendOptimisticReply(rootCommentId, body) {
    let repliesContainer =
      shadow.getElementById(`replies-${rootCommentId}`);

    if (!repliesContainer) return null;

    const optimisticId =
      `cb-pending-reply-${crypto.randomUUID()}`;

    repliesContainer.insertAdjacentHTML(
      'beforeend',
      `
        <div
          id="${optimisticId}"
          class="cb-comment cb-reply cb-comment-pending"
        >
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
      `
    );

    return optimisticId;
  }

  function indexComment(comment) {
    commentById.set(comment.id, comment);
  }

  function findCommentById(commentId) {
    return commentById.get(commentId) || null;
  }

  async function loadRules() {
    const rulesList = shadow.getElementById('cb-rules-list');

    rulesList.innerHTML = '<div class="cb-loading">Loading rules...</div>';

    const res = await fetch(`${API_URL}/api/v1/dashboard/sites/${siteId}/rules`);

    const rules = await res.json();
    cachedRules = rules;
    const rulesTab = shadow.getElementById('cb-rules-tab');

    rulesTab.textContent = `Rules ${rules.length ? `(${rules.length})` : '0'}`;

    rulesList.innerHTML = rules.length
      ? rules.map(rule => `
          <div class="cb-rule">
            <div class="cb-rule-title">${escapeHtml(rule.rule)}</div>
            <div class="cb-rule-description">${escapeHtml(rule.description || '')}</div>
          </div>
        `).join('')
      : '<div class="cb-empty">No site rules yet.</div>';
    
    
  }

  async function requireAuth() {
    if (!config.token) {
      showAuthModal();
      return false;
    }

    const fresh = await ensureFreshToken();

    if (!fresh) {
      showAuthModal();
      return false;
    }

    return true;
  }

  function showAuthModal() {
    const existing = shadow.getElementById('cb-auth-modal');
    if (existing) return;

    const modal = document.createElement('div');
    modal.id = 'cb-auth-modal';
    modal.className = 'cb-auth-backdrop';

    modal.innerHTML = `
      <div class="cb-auth-modal">
        <button class="cb-auth-close">×</button>

        <h3>Join the discussion</h3>

        <p>
          Log in or create an account to comment, reply, or react.
        </p>

        <div class="cb-auth-actions">
          <button class="cb-auth-login">Log in</button>
          <button class="cb-auth-signup">Sign up</button>
        </div>
      </div>
    `;

    shadow.querySelector('.cb-root').appendChild(modal);
  }

  function showReportModal(commentId) {
    shadow.querySelector('.cb-report-modal-backdrop')?.remove();

    const modal = document.createElement('div');

    modal.className = 'cb-report-modal-backdrop';

    modal.innerHTML = `
      <div class="cb-report-modal">
        <button class="cb-report-close">×</button>

        <h3>Report comment</h3>

        <p>Why are you reporting this comment?</p>

        <select class="cb-report-select" id="cb-report-reason">
          <option value="VIOLATED_RULE">Violated Rule</option>
          <option value="SPAM">Spam</option>
          <option value="HATE_SPEECH">Hate speech</option>
          <option value="OFF_TOPIC">Off topic</option>
          <option value="OTHER">Other</option>
        </select>

        ${cachedRules.length ? `
          <select class="cb-report-select" id="cb-report-rule">
            <option value="">Select rule violated optional</option>
            ${cachedRules.map(rule => `
              <option value="${rule.id}">
                ${escapeHtml(rule.title)}
              </option>
            `).join('')}
          </select>
        ` : ''}

        <textarea
          class="cb-report-details"
          id="cb-report-details"
          placeholder="Add optional details..."
        ></textarea>

        <button
          class="cb-report-submit"
          data-comment-id="${commentId}"
        >
          Submit report
        </button>
      </div>
    `;

    shadow.querySelector('.cb-root').appendChild(modal);
  }

  async function handleLogin() {
    const username = shadow.querySelector('#cb-login-username')?.value.trim();
    const password = shadow.querySelector('#cb-login-password')?.value.trim();
    if (!username || !password) {
      showError('Please fill in all fields.');
      return;
    }

    try {
      const body = new URLSearchParams({
        grant_type: 'password',
        client_id: 'chatterbox-api',
        username,
        password
      });

      console.time('login');

      const res = await fetch(
        'http://127.0.0.1:8080/realms/chatterbox/protocol/openid-connect/token',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/x-www-form-urlencoded'
          },
          body
        }
      );

      console.timeEnd('login');

      if (!res.ok) {
        showAuthError('Invalid username or password.');
        return;
      }

      const data = await res.json();

      config.token = data.access_token;
      saveAuthSession(data);
      console.log(decodeJwtPayload(config.token));
      closeAuthModal();
    } catch (err) {
      showAuthError('Please enter your username and password.');
      console.error(err);
    }
  }

  function saveAuthSession(data) {
    config.token = data.access_token;
    localStorage.setItem('chatterbox_token', data.access_token);
    localStorage.setItem('chatterbox_refresh_token', data.refresh_token);
    localStorage.setItem('chatterbox_last_active', Date.now().toString());
  }

  function clearAuthSession() {
    config.token = null;
    localStorage.removeItem('chatterbox_token');
    localStorage.removeItem('chatterbox_refresh_token');
    localStorage.removeItem('chatterbox_last_active');
  }

  async function authFetch(url, options = {}) {
    const hasFreshToken = await ensureFreshToken();

    if (!hasFreshToken) {
      clearAuthSession();
      closeAuthModal();
      return new Response(null, { status: 401 });
    }

    localStorage.setItem(
      'chatterbox_last_active',
      Date.now().toString()
    );

    const request = () =>
      fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${config.token}`
        }
      });

    let res = await request();

    if (res.status === 401) {
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        res = await request();
      } else {
        clearAuthSession();
        closeAuthModal();
      }
    }

    return res;
  }

  async function ensureFreshToken() {
    await authReadyPromise;
    if (!config.token) {
      return false;
    }

    if (!shouldRefreshToken(config.token)) {
      return true;
    }

    const refreshed = await refreshAccessToken();
    return refreshed && Boolean(config.token);
  }

  function closeAuthModal() {
    shadow.getElementById('cb-auth-modal')?.remove();
    shadow.querySelector('.cb-auth-backdrop')?.remove();
  }

  async function refreshAccessToken() {
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      try {
        const refreshToken =
          localStorage.getItem(
            'chatterbox_refresh_token'
          );

        if (!refreshToken) {
          clearAuthSession();
          return false;
        }

        const body = new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: 'chatterbox-api',
          refresh_token: refreshToken
        });

        const res = await fetch(
          'http://127.0.0.1:8080/realms/chatterbox/protocol/openid-connect/token',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/x-www-form-urlencoded'
            },
            body
          }
        );

        if (!res.ok) {
          clearAuthSession();
          return false;
        }

        const data = await res.json();

        saveAuthSession(data);

        return true;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }

  function decodeJwtPayload(token) {
    try {
      const payload = token.split('.')[1];

      const normalized = payload
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const json = decodeURIComponent(
        atob(normalized)
          .split('')
          .map(char =>
            '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2)
          )
          .join('')
      );

      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  function shouldRefreshToken(token) {
    const payload = decodeJwtPayload(token);

    if (!payload?.exp) return true;

    const expiresAtMs = payload.exp * 1000;
    const nowMs = Date.now();

    const REFRESH_BUFFER = 1000 * 60 * 2; // refresh if expires in next 2 min

    return expiresAtMs - nowMs < REFRESH_BUFFER;
  }

  function isTokenExpired(token) {
    const payload = decodeJwtPayload(token);

    if (!payload?.exp) return true;

    return payload.exp * 1000 <= Date.now();
  }

  async function handleSignup() {
    const username = shadow.querySelector('#cb-signup-username')?.value.trim();

    const email = shadow.querySelector('#cb-signup-email')?.value.trim();

    const password = shadow.querySelector('#cb-signup-password')?.value.trim();

    if (!username || !email || !password) {
      showError('Please fill in all fields.');
      return;
    }

    try {
      await fetch(
        `${API_URL}/api/v1/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            email,
            password
          })
        }
      );

      await handleLogin();
    } catch (err) {
      showError('Sign up failed.');
      console.error(err);
    }
  }

  function showAuthError(message) {
    const error = shadow.getElementById('cb-auth-error');

    if (!error) {
      showError(message);
      return;
    }

    error.textContent = message;
    error.style.display = 'block';

    clearTimeout(error._timeoutId);
    error._timeoutId = setTimeout(() => {
      error.textContent = '';
      error.style.display = 'none';
    }, 5000);
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
      .cb-composer { margin-bottom: 20px; background: linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.018)); border: 1px solid rgba(148,163,184,0.16); border-radius: 14px; overflow: hidden; } 
      .cb-input { width: 100%; min-height: 44px; max-height: 160px; background: transparent; border: none; outline: none; resize: none; padding: 12px 14px; color: #f8fafc; font-size: 14px; line-height: 1.45; font-family: inherit; } 
      .cb-composer:focus-within { border-color: rgba(226,232,240,0.28); box-shadow: 0 0 0 3px rgba(148,163,184,0.08); } 
      .cb-composer-footer { display: flex; justify-content: flex-end; padding: 8px 10px 10px; border-top: 1px solid rgba(255,255,255,0.05); }
      .cb-input:focus { background: rgba(255,255,255,0.015); }
      .cb-input::placeholder { color: #6b7280; } 
      .cb-submit-btn { background: #f3f4f6; color: #111827; border: none; border-radius: 10px; padding: 8px 14px; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.15s ease; } 
      .cb-submit-btn:hover { opacity: 0.9; }
      .cb-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      .cb-comments { display: flex; flex-direction: column; gap: 4px; }
      .cb-comment { display: flex; gap: 12px; padding: 14px 10px; border-radius: 12px; transition: background 0.15s ease, border-color 0.15s ease; position: relative; }
      .cb-comment-pending { opacity: 0.7; }
      .cb-comment:hover { background: rgba(255,255,255,0.025); }
      .cb-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #2d3748, #1a202c); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #d1d5db; flex-shrink: 0; }
      .cb-comment-body { flex: 1; }
      .cb-comment-text { white-space: pre-wrap; word-break: break-word; font-size: 14px; line-height: 1.6; color: #c8c8c8;}
      .cb-comment-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
      .cb-username { font-size: 13px; font-weight: 600; color: #f0f0f0; }
      .cb-timestamp { font-size: 12px; color: #7c8594; }
      .cb-comment-actions { display: flex; align-items: center; gap: 10px; margin-top: 10px; position: relative; }
      .cb-action-btn { background: transparent; border: 1px solid transparent; border-radius: 999px; padding: 5px 9px; font-size: 12px; color: #94a3b8; cursor: pointer; transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.1s ease; } 
      .cb-action-btn:hover { background: rgba(148, 163, 184, 0.10); border-color: rgba(148, 163, 184, 0.14); color: #e2e8f0; transform: translateY(-1px); } 
      .cb-reply-btn::before { content: "↩ "; }      
      .cb-reactions { display: flex; gap: 6px; flex-wrap: wrap; } 
      .cb-reaction-btn { display: inline-flex; align-items: center; gap: 4px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 999px; padding: 4px 8px; font-size: 12px; color: #d1d5db; cursor: pointer; transition: background 0.15s ease, border-color 0.15s ease, transform 0.1s ease; } 
      .cb-reaction-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.12); } 
      .cb-reaction-btn:active { transform: scale(0.96); }
      .cb-reaction-btn:disabled { opacity: 0.5; cursor: wait; }
      .cb-has-replies { display: grid; grid-template-columns: 32px 1fr; column-gap: 12px; } 
      .cb-has-replies > .cb-avatar { grid-column: 1; grid-row: 1; } 
      .cb-has-replies > .cb-comment-body { grid-column: 2; grid-row: 1; } 
      .cb-has-replies > .cb-replies { grid-column: 1 / -1; grid-row: 2; } 
      .cb-replies { position: relative; margin-top: 12px; margin-left: 16px; padding-left: 34px; display: flex; flex-direction: column; gap: 12px; } 
      .cb-replies::before { content: ""; position: absolute; left: 0; top: -18px; bottom: 13px; width: 2px; background: rgba(148, 163, 184, 0.22); border-radius: 999px; } 
      .cb-reply { position: relative; padding: 0; } 
      .cb-reply::before { content: ""; position: absolute; left: -34px; top: 13px; width: 34px; height: 2px; background: rgba(148, 163, 184, 0.22); border-radius: 999px; } 
      .cb-reply .cb-avatar { width: 26px; height: 26px; font-size: 10px; }
      .cb-action-btn:hover { background: rgba(15, 5, 5, 0.08); color: #f3f4f6; }
      .cb-inline-actions { display: flex; justify-content: flex-end; gap: 8px; } 
      .cb-inline-cancel { background: transparent; border: 1px solid rgba(255,255,255,0.08); color: #9ca3af; border-radius: 8px; padding: 6px 12px; font-size: 12px; cursor: pointer; }
      .cb-inline-reply { margin-top: 12px; display: flex; flex-direction: column; gap: 10px; } 
      .cb-inline-input { width: 100%; min-height: 72px; resize: vertical; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); color: #f3f4f6; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-family: inherit; outline: none; } 
      .cb-inline-input:focus { border-color: rgba(255,255,255,0.16); background: rgba(255,255,255,0.03); }
      .cb-inline-submit { background: #f3f4f6; color: #111827; border: none; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; } 
      .cb-inline-submit:hover { filter: brightness(1.08); transform: translateY(-1px); }
      .cb-view-replies-btn { color: #cbd5e1; }
      .cb-empty { font-size: 14px; color: #666; padding: 20px 0; }
      .cb-loading { font-size: 14px; color: #666; padding: 20px 0; }
      .cb-load-more { margin-top: 14px; width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #cbd5e1; border-radius: 10px; padding: 10px; cursor: pointer; }
      .cb-error { position: sticky; bottom: 12px; margin-top: 12px; background: #1f2937; border: 1px solid rgba(255,255,255,0.08); color: #f8fafc; border-radius: 10px; padding: 10px 12px; font-size: 13px; }
      .cb-auth-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; z-index: 999999; } 
      .cb-auth-modal { width: min(360px, 92vw); background: #111318; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.45); color: #f8fafc; position: relative; } 
      .cb-auth-close { position: absolute; top: 10px; right: 12px; background: transparent; border: none; color: #9ca3af; font-size: 20px; cursor: pointer; } 
      .cb-auth-modal h3 { font-size: 18px; margin-bottom: 8px; } 
      .cb-auth-modal p { font-size: 14px; color: #9ca3af; line-height: 1.5; margin-bottom: 16px; } 
      .cb-auth-actions { display: flex; gap: 10px; } 
      .cb-auth-login, .cb-auth-signup { flex: 1; border-radius: 10px; padding: 9px 12px; cursor: pointer; font-size: 13px; border: 1px solid rgba(255,255,255,0.08); } 
      .cb-auth-login { background: #f3f4f6; color: #111827; } 
      .cb-auth-signup { background: transparent; color: #f3f4f6; }
      .cb-auth-input { width: 100%; margin-bottom: 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #f8fafc; padding: 10px 12px; font-size: 13px; } 
      .cb-auth-primary { width: 100%; border: none; border-radius: 10px; padding: 10px; background: #f3f4f6; color: #111827; font-weight: 600; cursor: pointer; } 
      .cb-auth-switch { margin-top: 12px; font-size: 13px; color: #9ca3af; }
      .cb-auth-error { display: none; margin-bottom: 10px; padding: 9px 10px; border-radius: 10px; background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.25); color: #fecaca; font-size: 13px; }
      .cb-auth-login:hover, .cb-auth-signup:hover, .cb-auth-primary:hover, .cb-submit-btn:hover, .cb-load-more:hover, .cb-inline-cancel:hover { filter: brightness(1.12); transform: translateY(-1px); } 
      .cb-auth-login, .cb-auth-signup, .cb-auth-primary, .cb-submit-btn, .cb-load-more, .cb-inline-cancel { transition: background 0.15s ease, transform 0.12s ease, filter 0.15s ease; }
      .cb-auth-signup:hover, .cb-load-more:hover, .cb-inline-cancel:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.16); }
      .cb-social-btn { width: 100%; margin-bottom: 8px; border-radius: 10px; padding: 10px 12px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: #f8fafc; cursor: pointer; font-size: 13px; } 
      .cb-social-btn:hover { background: rgba(255,255,255,0.08); transform: translateY(-1px); }
      .cb-comment-menu-btn { margin-left: auto; background: transparent; border: none; color: #94a3b8; cursor: pointer; border-radius: 8px; padding: 2px 8px; font-size: 18px; line-height: 1; opacity: 0; transition: all .15s ease; } 
      .cb-comment:hover .cb-comment-menu-btn { opacity: 1; } 
      .cb-comment-menu-btn:hover { background: rgba(255,255,255,.08); color: #f8fafc; }
      .cb-comment-menu { position: absolute; right: 0; bottom: 32px; min-width: 160px; display: flex; flex-direction: column; gap: 2px; background: #181b22; border: 1px solid rgba(255,255,255,.08); border-radius: 12px; padding: 6px; z-index: 50; box-shadow: 0 12px 32px rgba(0,0,0,.35); } 
      .cb-menu-item { display: block; width: 100%; background: transparent; border: none; color: #e2e8f0; text-align: left; padding: 8px 10px; border-radius: 8px; cursor: pointer; font-size: 13px; font-family: inherit; } 
      .cb-menu-item:hover { background: rgba(255,255,255,.08); }
      .cb-report-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.55); display: flex; align-items: center; justify-content: center; z-index: 999999; } 
      .cb-report-modal { width: min(380px, 92vw); background: #111318; border: 1px solid rgba(255,255,255,.1); border-radius: 16px; padding: 20px; color: #f8fafc; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,.45); } 
      .cb-report-close { position: absolute; top: 10px; right: 12px; background: transparent; border: none; color: #9ca3af; font-size: 20px; cursor: pointer; } 
      .cb-report-modal h3 { font-size: 18px; margin-bottom: 8px; } 
      .cb-report-modal p { font-size: 14px; color: #9ca3af; margin-bottom: 12px; } 
      .cb-report-select, .cb-report-details { width: 100%; margin-bottom: 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.03); color: #f8fafc; padding: 10px 12px; font-size: 13px; } 
      .cb-report-details { min-height: 80px; resize: vertical; } 
      .cb-report-submit { width: 100%; border: none; border-radius: 10px; padding: 10px; background: #f3f4f6; color: #111827; font-weight: 600; cursor: pointer; }
      .cb-tabs { display: flex; gap: 8px; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,.08); } 
      .cb-tab { background: transparent; border: none; color: #94a3b8; padding: 8px 2px; cursor: pointer; font-size: 14px; } 
      .cb-tab-active { color: #f8fafc; border-bottom: 2px solid #f8fafc; } 
      .cb-rule { padding: 12px; border: 1px solid rgba(255,255,255,.08); border-radius: 12px; margin-bottom: 10px; background: rgba(255,255,255,.025); } 
      .cb-rule-title { font-size: 14px; font-weight: 600; color: #f8fafc; margin-bottom: 4px; } 
      .cb-rule-description { font-size: 13px; color: #94a3b8; line-height: 1.5; }
      .cb-edit-box { display: flex; flex-direction: column; gap: 8px; } 
      .cb-edit-input { width: 100%; min-height: 76px; resize: vertical; border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.03); color: #f8fafc; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-family: inherit; outline: none; } 
      .cb-edit-input:focus { border-color: rgba(255,255,255,.16); background: rgba(255,255,255,.04); } 
      .cb-edit-save { background: #f3f4f6; color: #111827; border: none; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; } 
      .cb-edit-cancel { background: transparent; border: 1px solid rgba(255,255,255,.08); color: #9ca3af; border-radius: 8px; padding: 6px 12px; font-size: 12px; cursor: pointer; }
      .cb-reaction-active { background: rgba(255,255,255,.14); border-color: rgba(255,255,255,.24); color: #f8fafc; }
      .cb-mod-menu, .cb-box-mod-actions { display: flex; flex-direction: column; gap: 4px; } 
      .cb-mod-menu { position: absolute; right: 0; bottom: 32px; min-width: 180px; background: #181b22; border: 1px solid rgba(255,255,255,.08); border-radius: 12px; padding: 6px; z-index: 60; box-shadow: 0 12px 32px rgba(0,0,0,.35); } 
      .cb-mod-menu-btn { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); color: #cbd5e1; border-radius: 999px; padding: 5px 9px; font-size: 12px; cursor: pointer; } 
      .cb-box-mod-action { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); color: #cbd5e1; border-radius: 8px; padding: 6px 9px; font-size: 12px; cursor: pointer; } 
      .cb-danger-item { color: #fecaca; }
    `;
  }

  init();
})();