(()=>{function Ze(m){let v=m.permissions||{};return`
    <div
      class="cb-comment-menu"
      data-comment-id="${m.id}"
    >

      ${v.canEdit?`
        <button
          class="cb-menu-item cb-edit-comment"
          data-comment-id="${m.id}"
        >
          Edit
        </button>
      `:""}

      ${v.canDelete?`
        <button
          class="cb-menu-item cb-delete-comment"
          data-comment-id="${m.id}"
        >
          Delete
        </button>
      `:""}

      ${v.canReport?`
        <button
          class="cb-menu-item cb-report-comment"
          data-comment-id="${m.id}"
        >
          Report
        </button>
      `:""}

      <button
        class="cb-menu-item cb-copy-comment-link"
        data-comment-id="${m.id}"
      >
        Copy link
      </button>

    </div>
  `}function et(m){let v=m.permissions||{};return`
    <div
      class="cb-mod-menu"
      data-comment-id="${m.id}"
    >
      ${v.canPin?`
        <button
          class="cb-menu-item cb-pin-comment"
          data-comment-id="${m.id}"
        >
          ${m.pinned?"Unpin comment":"Pin comment"}
        </button>
      `:""}

      ${v.canLock?`
        <button
          class="cb-menu-item cb-lock-comment"
          data-comment-id="${m.id}"
        >
          ${m.locked?"Unlock comment":"Lock comment"}
        </button>
      `:""}

      ${v.canMuteAuthor?`
        <button
          class="cb-menu-item cb-mute-user"
          data-comment-id="${m.id}"
          data-user-id="${m.author.id}"
        >
          Mute author
        </button>
      `:""}

      ${v.canDelete?`
        <button
          class="cb-menu-item cb-danger-item cb-mod-delete-comment"
          data-comment-id="${m.id}"
        >
          Delete comment
        </button>
      `:""}
    </div>
  `}function Ie(m){let v=m.permissions||{};return v.canToggleBoxLock||v.canToggleBox||v.canEmptyBox?`
    <div class="cb-box-mod-actions">
      ${v.canToggleBoxLock?`
        <button
          class="cb-box-mod-action"
          data-box-action="${m.locked?"open":"shut"}"
        >
          ${m.locked?"Open Box":"Shut Box"}
        </button>
      `:""}

      ${v.canToggleBox?`
        <button
          class="cb-box-mod-action cb-danger-item"
          data-box-action="deactivate"
        >
          ${m.active?"Deactivate Box":"Reactivate Box"}
        </button>
      `:""}

      ${v.canEmptyBox?`
        <button
          class="cb-box-mod-action cb-danger-item"
          data-box-action="empty"
        >
          Empty Box
        </button>
      `:""}
    </div>
  `:""}var It={};(function(){let m={HEART:"\u2764\uFE0F",THUMBS_UP:"\u{1F44D}",THUMBS_DOWN:"\u{1F44E}",LAUGH:"\u{1F602}",SURPRISED:"\u{1F62E}",SAD:"\u{1F622}",FIRE:"\u{1F525}"},v=["THUMBS_UP","HEART","FIRE","LAUGH","SURPRISED","SAD","THUMBS_DOWN"],I={status:"loading",user:null},j=new Map,N=nt(),Q=window.ChatterBoxConfig||{},M=Q.siteId||N?.dataset.siteId,g=Q.apiUrl||N?.dataset.apiUrl,ke=Q.appUrl||N?.dataset.appUrl||"https://chatterbox-web.vercel.app",tt=Q.mountId||N?.dataset.mountId||null;if(!M){console.error("[ChatterBox] Missing siteId. Add data-site-id to the widget script.");return}if(!g){console.error("[ChatterBox] Missing apiUrl. Add data-api-url to the widget script.");return}let Y=it({widgetScript:N,configuredMountId:tt,siteId:M});if(!Y){console.error("[ChatterBox] Could not create the widget container.");return}if(Y.dataset.chatterboxInitialized==="true"){console.warn("[ChatterBox] Widget is already initialized on this element.");return}Y.dataset.chatterboxInitialized="true";let n=Y.shadowRoot||Y.attachShadow({mode:"open"}),y=null,f=null,R=0,Be=!1,X=0,P=[],Z=!1,ae=[],S=null,x=null,L=!1,_=null,A=null,B=null,F=null,ce=new Map;async function ot(){try{let e=await fetch(`${g}/api/v1/auth/me`,{method:"GET",credentials:"include",headers:{Accept:"application/json"}});if(!e.ok)throw new Error(`Authentication check failed: ${e.status}`);let t=await e.json();I.status=t.authenticated?"authenticated":"anonymous",I.user=t.authenticated?t.user:null}catch(e){console.error("[ChatterBox] Failed to load authentication state",e),I.status="anonymous",I.user=null}}function nt(){let e=Array.from(document.querySelectorAll("script[data-chatterbox-widget]"));return e.find(o=>{try{return new URL(o.src,document.baseURI).href===It.url}catch{return!1}})||e.at(-1)||null}function it({widgetScript:e,configuredMountId:t,siteId:o}){if(t){let $=document.getElementById(t);return $||(console.error(`[ChatterBox] No element found with id "${t}".`),null)}let r=`chatterbox-widget-${o}`,s=document.getElementById(r);if(s)return s;let c=document.createElement("div");return c.id=r,c.setAttribute("data-chatterbox-host",""),e?.parentNode?(e.parentNode.insertBefore(c,e),c):(document.body.appendChild(c),c)}async function rt(){let e=window.location.pathname;try{let[t,o]=await Promise.all([ot(),fetch(`${g}/api/v1/widget/init`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({siteId:M,pageUrl:e})})]);if(!o.ok)throw new Error(`Init failed: ${o.status}`);let r=await o.json();lt(r)}catch(t){d("Failed to initialize comments. Please refresh the page."),console.error("[ChatterBox] Failed to initialize:",t)}}function at(){return I.status==="loading"?ct():I.status==="anonymous"?st():dt()}function ct(){return`
      <div class="cb-composer-skeleton" aria-label="Loading account">
        <div class="cb-skeleton-line cb-skeleton-line-short"></div>
        <div class="cb-skeleton-line"></div>
        <div class="cb-skeleton-actions"></div>
      </div>
    `}function st(){return`
      <div class="cb-auth-prompt">
        <div class="cb-auth-prompt-copy">
          <span class="cb-auth-eyebrow">
            Join the conversation
          </span>

          <h3>Share your perspective.</h3>

          <p>
            Log in or create a ChatterBox account to comment,
            reply, and react.
          </p>
        </div>

        <div class="cb-auth-actions">
          <button
            type="button"
            class="cb-button cb-button-secondary cb-auth-login"
          >
            Log in
          </button>

          <button
            type="button"
            class="cb-button cb-button-primary cb-auth-signup"
          >
            Sign up
          </button>
        </div>
      </div>
    `}function dt(){let e=I.user,t=e?.displayName||e?.username||"ChatterBox user",o=t.charAt(0).toUpperCase();return`
      <div class="cb-composer">
        <div class="cb-composer-user">
          <div class="cb-current-user-avatar">
            ${h(o)}
          </div>

          <div>
            <span class="cb-commenting-label">
              Commenting as
            </span>

            <strong>
              ${h(t)}
            </strong>
          </div>
        </div>

        <textarea
          class="cb-input"
          id="cb-input"
          rows="2"
          placeholder="Join the discussion..."
        ></textarea>

        <div id="cb-selected-gif-preview"></div>

        <div
          id="cb-gif-panel"
          class="cb-gif-panel-inline"
          style="display:none;"
        ></div>

        <div class="cb-composer-footer">
          <button
            type="button"
            id="cb-gif-btn"
            class="cb-gif-btn"
          >
            GIF
          </button>

          <button
            type="button"
            class="cb-submit-btn"
            id="cb-submit-btn"
          >
            Comment
          </button>
        </div>
      </div>
    `}function lt(e){n.innerHTML=`
      <style>${je()}</style>
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
          ${Ie(e)}
        </div>
        ${e.active?"":`
          <div class="cb-box-status">
            <strong>This discussion is inactive.</strong>
            <span>Log in as a moderator or site owner to reactivate it.</span>
            ${I.status!=="authenticated"?`
              <button class="cb-auth-login cb-box-login">
                Log in
              </button>
            `:""}
          </div>
        `}
        <div id="cb-comments-panel">
          ${at()}
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
    `,f=e,y=e.id,queueMicrotask(V),I.status==="authenticated"&&pt(),Be||(bt(),Be=!0),Ee(y)}async function Ee(e){try{let t=`${g}/api/v1/widget/${e}/comments?page=${X}&size=20`,o=await fetch(t,{method:"GET",credentials:"include",headers:{Accept:"application/json"}});if(!o.ok)throw new Error(`Failed to load comments: ${o.status}`);let r=await o.json();R=r.totalElements||0;let s=n.getElementById("cb-load-more");s&&(s.style.display=r.last?"none":"block"),P=X===0?r.content||[]:[...P,...r.content||[]],Ce(P,R)}catch(t){d("Failed to load comments. Please try again."),console.error("[ChatterBox] Failed to load comments:",t)}}async function se(){let e=X,t=[],o=0,r=!1;for(let c=0;c<=e;c+=1){let $=await fetch(`${g}/api/v1/widget/${y}/comments?page=${c}&size=20`,{method:"GET",credentials:"include",headers:{Accept:"application/json"}});if(!$.ok)throw new Error(`Failed to refresh comments: ${$.status}`);let C=await $.json();o=C.totalElements||0,r=!!C.last,t.push(...C.content||[])}P=t;let s=n.getElementById("cb-load-more");s&&(s.style.display=r?"none":"block"),Ce(P,o)}function Ce(e,t){de(t);let o=n.getElementById("cb-comments");if(e.length===0){o.innerHTML='<div class="cb-empty">No comments yet. Be the first!</div>';return}e.forEach(G),o.innerHTML=e.map(J).join("")}function J(e){let t=He(e),o=t?ee(e):e.author.displayName||e.author.username,r=t?Re(e):o.charAt(0).toUpperCase();return`
      <div class="cb-comment ${t?"cb-comment-deleted":""} ${e.replyCount>0?"cb-has-replies":""}"
      data-comment-root-id="${e.id}">
        <div class="cb-avatar ${t?"cb-avatar-deleted":""} ">${r}</div>
        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">${h(o)}</span>
            <span class="cb-timestamp">${qe(e.createdDate)}</span>
          </div>
          <div class="cb-comment-text">${t?ee(e):h(e.body)}</div>
          ${e.gifUrl?`
            <div class="cb-comment-gif">
                <img
                    src="${h(e.gifPreviewUrl||e.gifUrl)}"
                    alt="${h(e.gifTitle||"GIF")}"
                    loading="lazy">
            </div>
            `:""}
          ${t?`
          <div class="cb-comment-actions">
            <span class="cb-deleted-note">
              Comment unavailable
            </span>
            ${e.replyCount>0?`
              <button
                class="cb-action-btn cb-view-replies-btn"
                data-comment-id="${e.id}"
              >
                View ${e.replyCount}
                ${e.replyCount===1?"reply":"replies"}
              </button>
            `:""}
          </div>
          `:`
          <div class="cb-comment-actions">
            <button
              class="cb-action-btn cb-reply-btn"
              data-comment-id="${e.id}"
              data-root-comment-id="${e.id}"
              data-reply-to="${h(e.author.displayName||e.author.username)}"
            >
              Reply
            </button>
            ${e.replyCount>0?`
              <button
                class="cb-action-btn cb-view-replies-btn"
                data-comment-id="${e.id}"
              >
                View ${e.replyCount} ${e.replyCount===1?"reply":"replies"}
              </button>
            `:""}
            <div class="cb-reactions">
              ${Se(e)}
            </div>
            <button
              class="cb-comment-menu-btn"
              data-comment-id="${e.id}"
              aria-expanded="false"
            >
              \u22EF
            </button>
            ${Te(e)?`
              <button
                class="cb-mod-menu-btn"
                data-comment-id="${e.id}"
              >
                Moderate
              </button>
            `:""}
          </div>`}
          <div
            class="cb-reply-container"
            id="reply-container-${e.id}"
          ></div>
        </div>
          ${e.replyCount>0?`
            <div
              class="cb-replies"
              id="replies-${e.id}"
            ></div>
          `:""}
        
      </div>
    `}function de(e=R){R=e;let t=n.querySelector(".cb-title");t&&(t.textContent=`Chatter \xB7 ${R} ${R===1?"comment":"comments"}`)}function Te(e){let t=e.permissions||{};return t.canPin||t.canLock||t.canMuteAuthor||t.canDelete}async function le(e){let t=n.getElementById(`replies-${e}`);if(!t){let c=n.getElementById(`reply-container-${e}`);if(!c)return;c.insertAdjacentHTML("afterend",`
          <div
            class="cb-replies"
            id="replies-${e}"
          ></div>
        `),t=n.getElementById(`replies-${e}`)}if(t.innerHTML='<div class="cb-loading">Loading replies...</div>',j.has(e)){let c=j.get(e);t.innerHTML=c.length?c.map($=>D($,e)).join(""):"";return}let s=(await(await fetch(`${g}/api/v1/widget/${y}/comments/${e}`,{method:"GET",credentials:"include",headers:{Accept:"application/json"}})).json()).content||[];s.forEach(G),j.set(e,s),t.innerHTML=s.length?s.map(c=>D(c,e)).join(""):""}function D(e,t){let o=He(e),r=o?ee(e):e.author.displayName||e.author.username,s=o?Re(e):r.charAt(0).toUpperCase();return`
      <div class="cb-comment cb-reply ${o?"cb-comment-deleted":""} ${e.replyCount>0?"cb-has-replies":""}"
      data-comment-root-id="${e.id}">
        <div class="cb-avatar ${o?"cb-avatar-deleted":""}">
          ${s}
        </div>

        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">${h(r)}</span>
            <span class="cb-timestamp">${qe(e.createdDate)}</span>
          </div>

          <div class="cb-comment-text">
            ${o?ee(e):h(e.body)}
          </div>
          ${e.gifUrl?`
            <div class="cb-comment-gif">
                <img
                    src="${h(e.gifPreviewUrl||e.gifUrl)}"
                    alt="${h(e.gifTitle||"GIF")}"
                    loading="lazy">
            </div>
            `:""}
          ${o?`
            <div class="cb-comment-actions">
              <span class="cb-deleted-note">Comment unavailable</span>
            </div>
          `:`
            <div class="cb-comment-actions">
              <button
                class="cb-action-btn cb-reply-btn"
                data-comment-id="${e.id}"
                data-root-comment-id="${t}"
                data-reply-to="${h(r)}"
              >
                Reply
              </button>

              <div class="cb-reactions">
                ${Se(e)}
              </div>

              <button
                class="cb-comment-menu-btn"
                data-comment-id="${e.id}"
                aria-expanded="false"
              >
                \u22EF
              </button>

              ${Te(e)?`
                <button
                  class="cb-mod-menu-btn"
                  data-comment-id="${e.id}"
                >
                  Moderate
                </button>
              `:""}
            </div>
          `}

          <div
            class="cb-reply-container"
            id="reply-container-${e.id}"
          ></div>
        </div>
      </div>
    `}function Se(e){let t={};for(let r of e.reactions||[])t[r.reactionType]=r;let o="";for(let r of v){let s=t[r],c=s?s.count:0,$=s?s.reacted:!1,C=m[r];o+=`
        <button
          class="cb-reaction-btn ${$?"cb-reaction-active":""}"
          data-comment-id="${e.id}"
          data-reaction-type="${r}"
        >
          ${C}
          ${c>0?`<span>${c}</span>`:""}
        </button>
      `}return o}function Me(){let e=n.querySelector(".cb-header");n.querySelector(".cb-box-mod-actions")?.remove(),e.insertAdjacentHTML("beforeend",Ie(f))}function V(){let e=n.getElementById("cb-input"),t=n.getElementById("cb-submit-btn");if(!e||!t||!f)return;let o=f.locked||!f.active;e.disabled=o,t.disabled=o,e.placeholder=f.active?f.locked?"This discussion is locked.":"Join the chatter...":"This discussion is inactive."}function be(e){let t=window.location.pathname+window.location.search+window.location.hash,o=new URL(e,ke);o.searchParams.set("returnTo",t),window.top.location.assign(o.toString())}function bt(){n.addEventListener("click",async e=>{if(e.target.closest(".cb-box-login")){be("/login");return}if(e.target.closest("#cb-load-more")){X+=1,await Ee(y);return}let r=e.target.closest(".cb-tab");if(r){let i=r.dataset.tab;n.querySelectorAll(".cb-tab").forEach(a=>{a.classList.remove("cb-tab-active")}),r.classList.add("cb-tab-active"),n.getElementById("cb-comments-panel").style.display=i==="comments"?"block":"none",n.getElementById("cb-rules-panel").style.display=i==="rules"?"block":"none",i==="rules"&&!Z&&(await Ae(),Z=!0);return}if(e.target.closest("#cb-gif-btn")){pe("cb-gif-panel","composer");return}let c=e.target.closest(".cb-gif-result");if(c){let i={gifUrl:c.dataset.gifUrl,gifPreviewUrl:c.dataset.gifPreviewUrl,gifProvider:c.dataset.gifProvider,gifProviderId:c.dataset.gifProviderId,gifTitle:c.dataset.gifTitle},a=c.closest(".cb-gif-panel-inline"),l=a?.dataset.mode||"composer";if(l==="edit"){x=i,L=!1,me(A),a&&(a.style.display="none"),n.querySelector(".cb-edit-input")?.focus();return}if(l==="reply"){B=i,Le(F),a&&(a.style.display="none"),n.getElementById(`reply-container-${F}`)?.querySelector(".cb-inline-input")?.focus();return}S=i,ue(),a&&(a.style.display="none"),n.getElementById("cb-input")?.focus();return}e.target.closest("#cb-remove-selected-gif")&&(S=null,ue());let C=e.target.closest(".cb-remove-reply-gif");if(C){let i=C.dataset.commentId;B=null,Le(i);return}let ge=e.target.closest(".cb-reply-gif-btn");if(ge){let i=ge.dataset.commentId;F=i,pe(`cb-reply-gif-panel-${i}`,"reply");return}let Fe=e.target.closest(".cb-box-mod-action");if(Fe){if(!await k())return;let i=Fe.dataset.boxAction;if(i==="empty"&&!confirm("Delete every comment in this discussion?"))return;if(!(await E(`${g}/api/v1/dashboard/moderation/boxes/${y}/${i}`,{method:"PUT"})).ok){d("Failed to update discussion.");return}if(i==="shut"&&(f.locked=!0),i==="open"&&(f.locked=!1),i==="deactivate"&&(f.active=!f.active),i==="empty"){P=[],ce.clear(),j.clear(),de(0);let l=n.getElementById("cb-comments");l.innerHTML='<div class="cb-empty">No comments yet. Be the first!</div>';let b=n.getElementById("cb-load-more");b.style.display="none"}n.querySelectorAll(".cb-reply-container").forEach(l=>{l.innerHTML=""}),Me(),V(),d(`Box updated. Action: ${i=="deactivate"?"activation toggle":i}`);return}let te=e.target.closest(".cb-mod-menu-btn");if(te){n.querySelector(".cb-comment-menu")?.remove();let i=n.querySelector(".cb-mod-menu");if(i){let l=i.dataset.commentId;if(i.remove(),l===te.dataset.commentId)return}let a=z(te.dataset.commentId);if(!a)return;te.insertAdjacentHTML("afterend",et(a));return}let De=e.target.closest(".cb-lock-comment");if(De){if(!await k())return;let i=De.dataset.commentId;if(!(await E(`${g}/api/v1/dashboard/moderation/${M}/comments/${i}/lock`,{method:"PUT"})).ok){d("Failed to update comment lock.");return}d("Comment updated."),n.querySelector(".cb-mod-menu")?.remove(),await se();return}let Ge=e.target.closest(".cb-pin-comment");if(Ge){if(!await k())return;let i=Ge.dataset.commentId;if(!(await E(`${g}/api/v1/dashboard/moderation/${M}/comments/${i}/pin`,{method:"PUT"})).ok){d("Failed to update pinned comment.");return}d("Comment updated."),n.querySelector(".cb-mod-menu")?.remove(),await se();return}let Oe=e.target.closest(".cb-mod-delete-comment");if(Oe){if(!await k())return;let i=Oe.dataset.commentId;if(!confirm("Delete this comment?"))return;if(!(await E(`${g}/api/v1/widget/${y}/comments/${i}`,{method:"DELETE"})).ok){d("Failed to remove comment.");return}Ue(i,"REMOVED"),n.querySelector(".cb-mod-menu")?.remove(),d("Comment removed.");return}let Ne=e.target.closest(".cb-mute-user");if(Ne){if(!await k())return;let i=Ne.dataset.userId,a=prompt("Reason for muting this user?")||"";if(!(await E(`${g}/api/v1/dashboard/moderation/${M}/mute/${i}`,{method:"POST",headers:{"Content-Type":"text/plain"},body:a})).ok){d("Failed to mute user.");return}d("User muted."),n.querySelector(".cb-mod-menu")?.remove();return}let W=e.target.closest(".cb-comment-menu-btn");if(W){n.querySelector(".cb-mod-menu")?.remove();let i=n.querySelector(".cb-comment-menu"),a=n.querySelector('.cb-comment-menu-btn[aria-expanded="true"]');if(a&&a.setAttribute("aria-expanded","false"),i&&(i.remove(),a===W))return;W.setAttribute("aria-expanded","true");let l=z(W.dataset.commentId);W.insertAdjacentHTML("afterend",Ze(l));return}let Ye=e.target.closest(".cb-report-comment");if(Ye){if(!await k())return;let i=Ye.dataset.commentId;Z||(await Ae(),Z=!0),wt(i),n.querySelector(".cb-comment-menu")?.remove();return}let _e=e.target.closest(".cb-report-submit");if(_e){let i=_e.dataset.commentId,a=n.getElementById("cb-report-reason").value,l=n.getElementById("cb-report-details").value.trim(),p=n.getElementById("cb-report-rule")?.value||null;await E(`${g}/api/v1/widget/${y}/comments/${i}/report`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reason:a,explanation:l,ruleId:p})}),n.querySelector(".cb-report-modal-backdrop")?.remove(),d("Report submitted.");return}if(e.target.closest(".cb-report-close")){n.querySelector(".cb-report-modal-backdrop")?.remove();return}let Je=e.target.closest(".cb-copy-comment-link");if(Je){let i=Je.dataset.commentId,a=`${window.location.href}#comment-${i}`;await navigator.clipboard.writeText(a),d("Comment link copied."),n.querySelector(".cb-comment-menu")?.remove(),n.querySelector('.cb-comment-menu-btn[aria-expanded="true"]')?.setAttribute("aria-expanded","false");return}let xe=e.target.closest(".cb-edit-comment");if(xe){if(!await k())return;let i=xe.dataset.commentId;A=i;let l=xe.closest(".cb-comment").querySelector(".cb-comment-text"),b=z(i);x=null,L=!1,_=b?.gifUrl?{gifUrl:b.gifUrl,gifPreviewUrl:b.gifPreviewUrl,gifProvider:b.gifProvider,gifProviderId:b.gifProviderId,gifTitle:b.gifTitle}:null;let p=b?.body||l.textContent.trim();n.querySelector(".cb-comment-menu")?.remove(),l.innerHTML=`
          <div class="cb-composer cb-edit-composer">
            <textarea class="cb-input cb-edit-input">${h(p)}</textarea>

            <div
              class="cb-edit-gif-preview"
              id="cb-edit-gif-preview-${i}"
            ></div>

            <div
              id="cb-edit-gif-panel-${i}"
              class="cb-gif-panel-inline"
              style="display:none;"
            ></div>

            <div class="cb-composer-footer">
              <button
                type="button"
                class="cb-gif-btn cb-edit-add-gif"
                data-comment-id="${i}"
              >
                GIF
              </button>

              <div class="cb-inline-actions">
                <button class="cb-edit-cancel" data-comment-id="${i}">
                  Cancel
                </button>

                <button class="cb-edit-save" data-comment-id="${i}">
                  Save
                </button>
              </div>
            </div>
          </div>
        `,me(i);let u=l.querySelector(".cb-edit-input");u?.focus(),u&&(u.style.height="auto",u.style.height=`${Math.min(u.scrollHeight,160)}px`),u?.addEventListener("input",()=>{u.style.height="auto",u.style.height=`${Math.min(u.scrollHeight,160)}px`}),u?.addEventListener("keydown",T=>{T.key==="Enter"&&!T.shiftKey&&(T.preventDefault(),l.querySelector(".cb-edit-save")?.click())});return}let Ve=e.target.closest(".cb-edit-add-gif");if(Ve){let i=Ve.dataset.commentId;A=i,pe(`cb-edit-gif-panel-${i}`,"edit");return}let We=e.target.closest(".cb-edit-remove-gif");if(We){x=null,L=!0,A=We.dataset.commentId,me(A);return}let q=e.target.closest(".cb-edit-save");if(q){if(!await k())return;let i=q.dataset.commentId,a=q.closest(".cb-comment"),b=a.querySelector(".cb-edit-input").value.trim(),p=z(i);if(!(b.length>0)&&!(L?!!x:!!_||!!x)){d("Comment cannot be empty.");return}q.disabled=!0,q.textContent="Saving...";let H={body:b,...x?{gifUrl:x.gifUrl,gifPreviewUrl:x.gifPreviewUrl,gifProvider:x.gifProvider,gifProviderId:x.gifProviderId,gifTitle:x.gifTitle}:{},...L?{removeGif:!0}:{}};try{if(!(await E(`${g}/api/v1/widget/${y}/comments/${i}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(H)})).ok){d("Edit patch req failed.");return}p&&(p.body=b,L?(p.gifUrl=null,p.gifPreviewUrl=null,p.gifProvider=null,p.gifProviderId=null,p.gifTitle=null):x&&(p.gifUrl=x.gifUrl,p.gifPreviewUrl=x.gifPreviewUrl,p.gifProvider=x.gifProvider,p.gifProviderId=x.gifProviderId,p.gifTitle=x.gifTitle),G(p),x=null,L=!1,_=null,A=null),a.outerHTML=p.parentId?D(p,p.parentId):J(p),d("Comment updated.")}catch(K){d("Failed to edit comment."),console.error("[ChatterBox] Edit failed:",K)}finally{q.disabled=!1,q.textContent="Save"}return}let he=e.target.closest(".cb-edit-cancel");if(he){let i=he.dataset.commentId,a=he.closest(".cb-comment"),l=a.querySelector(".cb-comment-text"),b=z(i);x=null,L=!1,_=null,A=null,b&&(a.outerHTML=b.parentId?D(b,b.parentId):J(b));return}let oe=e.target.closest(".cb-delete-comment");if(oe){if(!await k())return;let i=oe.dataset.commentId;if(!confirm("Delete this comment?"))return;oe.disabled=!0,oe.textContent="Deleting...";try{if(!(await E(`${g}/api/v1/widget/${y}/comments/${i}`,{method:"DELETE"})).ok){d("Failed to delete comment.");return}Ue(i,"DELETED"),n.querySelector(".cb-comment-menu")?.remove(),d("Comment deleted.")}catch(l){d("Failed to delete comment."),console.error("[ChatterBox] Delete failed:",l)}return}let O=e.target.closest(".cb-reaction-btn");if(O){if(!await k())return;let i=O.dataset.commentId,a=O.dataset.reactionType;O.disabled=!0;try{let l=await E(`${g}/api/v1/widget/comments/${i}/reactions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reactionType:a})});if(!l.ok){d("Reaction request failed.");return}let b=await l.json();xt(O,b);let p=z(i);if(p){let u=p.reactions||[],T=u.find(ie=>ie.reactionType===b.reactionType);T?(T.count=b.count,T.reacted=b.reacted):u.push(b),p.reactions=u}}catch(l){d("Failed to add reaction. Please try again."),console.error("[ChatterBox] Failed to react:",l)}finally{O.disabled=!1}return}let ne=e.target.closest(".cb-reply-btn");if(ne){if(f?.locked||!f?.active){d(f.active?"This discussion is locked.":"This discussion is inactive.");return}if(!await k())return;let i=ne.dataset.commentId,a=ne.dataset.replyTo,l=ne.dataset.rootCommentId||i,b=n.getElementById(`reply-container-${i}`);if(b.innerHTML.trim()){b.innerHTML="";return}let p=a?`@${a} `:"";F=i,B=null,b.innerHTML=`
          <div class="cb-composer cb-inline-reply">
            <textarea
              class="cb-input cb-inline-input"
              placeholder="Write a reply..."
            >${p}</textarea>

            <div
              class="cb-reply-gif-preview"
              id="cb-reply-gif-preview-${i}"
            ></div>

            <div
              id="cb-reply-gif-panel-${i}"
              class="cb-gif-panel-inline"
              style="display:none;"
            ></div>

            <div class="cb-composer-footer">
              <button
                type="button"
                class="cb-gif-btn cb-reply-gif-btn"
                data-comment-id="${i}"
              >
                GIF
              </button>

              <div class="cb-inline-actions">
                <button class="cb-inline-cancel">
                  Cancel
                </button>

                <button
                  class="cb-inline-submit"
                  data-comment-id="${i}"
                  data-root-comment-id="${l}"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        `,queueMicrotask(()=>{b.querySelector("textarea")?.focus()});return}let Ke=e.target.closest(".cb-view-replies-btn");if(Ke){let i=Ke.dataset.commentId,a=n.getElementById(`replies-${i}`);if(a.innerHTML.trim()){a.innerHTML="";return}await le(i);return}let U=e.target.closest(".cb-inline-submit");if(U){if(f?.locked||!f?.active){d(f.active?"This discussion is locked.":"This discussion is inactive.");return}if(!await k())return;let i=U.dataset.commentId,a=U.dataset.rootCommentId||i,l=U.closest(".cb-inline-reply"),p=l.querySelector("textarea").value.trim();if(!p&&!B)return;U.disabled=!0,U.textContent="Posting...";let u=null,T=n.getElementById(`replies-${a}`);T||(await le(a),T=n.getElementById(`replies-${a}`)),u=vt(a,p,B);let ie=Pe(p,a,B);try{let H=await E(`${g}/api/v1/widget/sites/${M}/boxes/${y}/comments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(ie)});if(H.status===429){u&&n.getElementById(u)?.remove(),d("You are commenting too quickly. Please slow down.");return}if(!H.ok){n.getElementById(u)?.remove(),d(`Failed to post comment (${H.status}).`);return}let K=l.closest(".cb-reply-container"),ve=await H.json();u&&n.getElementById(u)?.remove(),G(ve);let Xe=j.get(a)||[];Xe.push(ve),j.set(a,Xe);let ye=P.find(re=>re.id===a);ye&&(ye.replyCount=(ye.replyCount||0)+1);let we=n.getElementById(`replies-${a}`);we||(await le(a),we=n.getElementById(`replies-${a}`)),we.insertAdjacentHTML("beforeend",D(ve,a));let $e=n.querySelector(`[data-comment-id="${a}"].cb-view-replies-btn`);if($e){let re=Number($e.textContent.match(/\d+/)?.[0]||0)+1;$e.textContent=`View ${re} ${re===1?"reply":"replies"}`}K&&(K.innerHTML=""),B=null,F=null}catch(H){u&&n.getElementById(u)?.remove(),d("Failed to post reply. Please try again."),console.error("[ChatterBox] Reply failed:",H)}finally{U.disabled=!1,U.textContent="Reply"}return}let Qe=e.target.closest(".cb-inline-cancel");if(Qe){B=null,F=null;let i=Qe.closest(".cb-reply-container");i&&(i.innerHTML="")}if(e.target.closest(".cb-auth-close")){n.getElementById("cb-auth-modal")?.remove();return}if(e.target.closest(".cb-auth-login")){be("/login");return}if(e.target.closest(".cb-auth-signup")){be("/signup");return}!e.target.closest(".cb-comment-menu")&&!e.target.closest(".cb-comment-menu-btn")&&(n.querySelector(".cb-comment-menu")?.remove(),n.querySelector('.cb-comment-menu-btn[aria-expanded="true"]')?.setAttribute("aria-expanded","false")),!e.target.closest(".cb-mod-menu")&&!e.target.closest(".cb-mod-menu-btn")&&n.querySelector(".cb-mod-menu")?.remove()})}function pt(){let e=n.getElementById("cb-submit-btn"),t=n.getElementById("cb-input");t.addEventListener("input",()=>{t.style.height="auto",t.style.height=`${Math.min(t.scrollHeight,160)}px`}),t.addEventListener("keydown",o=>{o.key==="Enter"&&!o.shiftKey&&(o.preventDefault(),e.click())}),e.addEventListener("click",async()=>{let o=t.value.trim();if(!o&&!S||e.disabled)return;if(f?.locked||!f?.active){d(f.active?"This box is locked.":"This box is inactive."),V();return}if(!await k())return;let r=ht(o,S);e.disabled=!0,e.textContent="Posting...";let s=Pe(o,null,S);try{let c=await E(`${g}/api/v1/widget/sites/${M}/boxes/${y}/comments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(c.status===429){n.getElementById(r)?.remove(),d("You are commenting too quickly. Please slow down.");return}if(c.status===401){n.getElementById(r)?.remove(),d("Your session expired. Please log in again."),fe();return}if(!c.ok){n.getElementById(r)?.remove(),d(`Failed to post comment (${c.status}).`);return}t.value="",t.style.height="auto",S=null,ue();let $=n.getElementById("cb-gif-panel");$&&($.style.display="none"),n.getElementById(r)?.remove();let C=await c.json();G(C),P.unshift(C),de(R+1),n.getElementById("cb-comments").insertAdjacentHTML("afterbegin",J(C))}catch(c){n.getElementById(r)?.remove(),d("Failed to post comment. Please try again."),console.error("[ChatterBox] Failed to post comment:",c)}finally{e.disabled=!1,e.textContent="Comment",V()}})}function pe(e,t="composer"){let o=n.getElementById(e);if(o){if(o.style.display==="block"){o.style.display="none";return}ut(e,t)}}function ut(e,t="composer"){let o=n.getElementById(e);if(!o)return;o.style.display="block",o.dataset.mode=t,o.innerHTML=`
      <input
        class="cb-gif-search"
        placeholder="Search GIFs..."
      />

      <div class="cb-gif-results"></div>
    `;let r=o.querySelector(".cb-gif-search");r&&(r.autocomplete="off"),r?.addEventListener("input",gt(()=>ft(r),300)),r?.focus()}async function mt(e){let t=await fetch(`${g}/api/v1/widget/gifs/search?q=${encodeURIComponent(e)}`);if(!t.ok)throw new Error(`GIF search failed: ${t.status}`);return await t.json()}async function ft(e){let t=e.value.trim(),r=e.closest(".cb-gif-panel-inline")?.querySelector(".cb-gif-results");if(!r){console.error("[ChatterBox] No GIF results element found.");return}if(!t){r.innerHTML="";return}r.innerHTML='<div class="cb-gif-loading">Searching...</div>';try{let s=await mt(t);if(!s.length){r.innerHTML='<div class="cb-empty">No GIFs found.</div>';return}r.innerHTML=s.map(c=>`
        <button
          type="button"
          class="cb-gif-result"
          data-gif-url="${w(c.gifUrl)}"
          data-gif-preview-url="${w(c.gifPreviewUrl||c.gifUrl)}"
          data-gif-provider="${w(c.gifProvider)}"
          data-gif-provider-id="${w(c.gifProviderId)}"
          data-gif-title="${w(c.gifTitle||"GIF")}">
          <img src="${w(c.gifPreviewUrl||c.gifUrl)}" />
        </button>
      `).join("")}catch(s){console.error("[ChatterBox] GIF search failed:",s),r.innerHTML='<div class="cb-gif-error">Failed to load GIFs.</div>'}}function gt(e,t){let o;return function(...r){clearTimeout(o),o=setTimeout(()=>{e.apply(this,r)},t)}}function ue(){let e=n.querySelector("#cb-selected-gif-preview");if(e){if(!S){e.innerHTML="";return}e.innerHTML=`
      <div class="cb-selected-gif">
        <img src="${w(S.gifPreviewUrl||S.gifUrl)}"
            alt="${w(S.gifTitle||"Selected GIF")}" />
        <button type="button" id="cb-remove-selected-gif">\xD7</button>
      </div>
    `}}function Le(e){let t=n.getElementById(`cb-reply-gif-preview-${e}`);if(t){if(!B){t.innerHTML="";return}t.innerHTML=`
      <div class="cb-selected-gif">
        <img
          src="${w(B.gifPreviewUrl||B.gifUrl)}"
          alt="${w(B.gifTitle||"Selected GIF")}"
        />
        <button
          type="button"
          class="cb-remove-reply-gif"
          data-comment-id="${e}"
        >
          \xD7
        </button>
      </div>
    `}}function me(e){let t=n.getElementById(`cb-edit-gif-preview-${e}`);if(!t)return;if(L){t.innerHTML="";return}let o=x||_;if(!o){t.innerHTML="";return}t.innerHTML=`
      <div class="cb-selected-gif">
        <img
          src="${w(o.gifPreviewUrl||o.gifUrl)}"
          alt="${w(o.gifTitle||"GIF")}"
        />
        <button
          type="button"
          class="cb-edit-remove-gif"
          data-comment-id="${e}"
        >
          \xD7
        </button>
      </div>
    `}function Pe(e,t=null,o=null){return{body:e,...t?{parentId:t}:{},...o?{gifUrl:o.gifUrl,gifPreviewUrl:o.gifPreviewUrl,gifProvider:o.gifProvider,gifProviderId:o.gifProviderId,gifTitle:o.gifTitle}:{}}}function w(e){return h(String(e??""))}function Ue(e,t){let o=z(e);if(!o)return;o.status=t,o.body=t==="REMOVED"?"[removed]":"[deleted]",o.permissions={},o.reactions=[],o.locked=!0,G(o);let r=n.querySelector(`[data-comment-root-id="${e}"]`);r&&(r.outerHTML=o.parentId?D(o,o.parentId):J(o))}function He(e){return e.status==="DELETED"||e.status==="REMOVED"}function ee(e){return e.status==="REMOVED"?"[removed]":"[deleted]"}function Re(e){return e.status==="REMOVED"?"!":"\xD7"}function xt(e,t){e.classList.toggle("cb-reaction-active",t.reacted);let o=e.querySelector("span");t.count>0?o?o.textContent=t.count:e.insertAdjacentHTML("beforeend",`<span>${t.count}</span>`):o?.remove()}function ht(e,t){let o=n.getElementById("cb-comments"),r=`cb-pending-${crypto.randomUUID()}`,s=`
      <div id="${r}" class="cb-comment cb-comment-pending">
        <div class="cb-avatar">Y</div>

        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">You</span>
            <span class="cb-timestamp">just now</span>
          </div>

          <div class="cb-comment-text">
            ${h(e)}
          </div>
          ${t?`
            <div class="cb-comment-gif">
                <img
                    src="${w(t.gifPreviewUrl||t.gifUrl)}"
                    alt=""
                />
            </div>
            `:""}
        </div>
      </div>
    `;return o.insertAdjacentHTML("afterbegin",s),r}function vt(e,t,o){let r=n.getElementById(`replies-${e}`);if(!r)return null;let s=`cb-pending-reply-${crypto.randomUUID()}`;return r.insertAdjacentHTML("beforeend",`
        <div
          id="${s}"
          class="cb-comment cb-reply cb-comment-pending"
        >
          <div class="cb-avatar">Y</div>

          <div class="cb-comment-body">
            <div class="cb-comment-meta">
              <span class="cb-username">You</span>
              <span class="cb-timestamp">just now</span>
            </div>

            <div class="cb-comment-text">
              ${h(t)}
            </div>
            ${o?`
              <div class="cb-comment-gif">
                  <img
                      src="${w(o.gifPreviewUrl||o.gifUrl)}"
                      alt=""
                  />
              </div>
              `:""}
          </div>
        </div>
      `),s}function G(e){ce.set(e.id,e)}function z(e){return ce.get(e)||null}async function Ae(){let e=n.getElementById("cb-rules-list");e.innerHTML='<div class="cb-loading">Loading rules...</div>';let o=await(await fetch(`${g}/api/v1/dashboard/sites/${M}/rules`)).json();ae=o;let r=n.getElementById("cb-rules-tab");r.textContent=`Rules ${o.length?`(${o.length})`:"0"}`,e.innerHTML=o.length?o.map(s=>`
          <div class="cb-rule">
            <div class="cb-rule-title">${h(s.rule)}</div>
            <div class="cb-rule-description">${h(s.description||"")}</div>
          </div>
        `).join(""):'<div class="cb-empty">No site rules yet.</div>'}function yt(){try{return window.top.location.href}catch{return window.location.href}}function ze(e){let t=yt(),o=new URLSearchParams({returnTo:t});return`${ke}${e}?${o.toString()}`}function kt(){return ze("/login")}function Bt(){return ze("/signup")}function k(){return I.status==="authenticated"?!0:(fe(),!1)}function fe(){if(n.getElementById("cb-auth-modal"))return;let t=document.createElement("div");t.id="cb-auth-modal",t.className="cb-auth-backdrop",t.innerHTML=`
      <div class="cb-auth-modal">
        <button class="cb-auth-close">\xD7</button>

        <h3>Join the discussion</h3>

        <p>
          Log in or create an account to comment, reply, or react.
        </p>

        <div class="cb-auth-actions">
          <button class="cb-auth-login">Log in</button>
          <button class="cb-auth-signup">Sign up</button>
        </div>
      </div>
    `,n.querySelector(".cb-root").appendChild(t)}function wt(e){n.querySelector(".cb-report-modal-backdrop")?.remove();let t=document.createElement("div");t.className="cb-report-modal-backdrop",t.innerHTML=`
      <div class="cb-report-modal">
        <button class="cb-report-close">\xD7</button>

        <h3>Report comment</h3>

        <p>Why are you reporting this comment?</p>

        <select class="cb-report-select" id="cb-report-reason">
          <option value="VIOLATED_RULE">Violated Rule</option>
          <option value="SPAM">Spam</option>
          <option value="HATE_SPEECH">Hate speech</option>
          <option value="OFF_TOPIC">Off topic</option>
          <option value="OTHER">Other</option>
        </select>

        ${ae.length?`
          <select class="cb-report-select" id="cb-report-rule">
            <option value="">Select rule violated optional</option>
            ${ae.map(o=>`
              <option value="${o.id}">
                ${h(o.title)}
              </option>
            `).join("")}
          </select>
        `:""}

        <textarea
          class="cb-report-details"
          id="cb-report-details"
          placeholder="Add optional details..."
        ></textarea>

        <button
          class="cb-report-submit"
          data-comment-id="${e}"
        >
          Submit report
        </button>
      </div>
    `,n.querySelector(".cb-root").appendChild(t)}async function Et(){await $t(),await se()}async function $t(){let e=await E(`${g}/api/v1/widget/boxes/${y}`);if(!e.ok)throw new Error(`Failed to refresh box state: ${e.status}`);f=await e.json(),y=f.id,Me(),V()}async function E(e,t={}){let o=await fetch(e,{...t,credentials:"include",headers:{Accept:"application/json",...t.headers||{}}});return o.status===401&&(I.status="anonymous",I.user=null,fe()),o}function Ct(){n.getElementById("cb-auth-modal")?.remove(),n.querySelector(".cb-auth-backdrop")?.remove()}function qe(e){let t=new Date(e),r=Math.floor((new Date-t)/1e3);return r<60?"just now":r<3600?`${Math.floor(r/60)}m ago`:r<86400?`${Math.floor(r/3600)}h ago`:`${Math.floor(r/86400)}d ago`}function h(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function d(e){n.getElementById("cb-error")?.remove();let o=document.createElement("div");o.id="cb-error",o.className="cb-error",o.textContent=e;let r=n.querySelector(".cb-root");if(r)r.appendChild(o);else{let s=document.createElement("div");s.className="cb-root",s.innerHTML=`<style>${je()}</style>`,s.appendChild(o),n.appendChild(s)}setTimeout(()=>{o.remove()},5e3)}function je(){return`
      * { box-sizing: border-box; margin: 0; padding: 0; }
      :host { display: block; width: 100%; min-width: 0; font-family: 'Inter', system-ui, sans-serif; }
      .cb-root { width: 100%; max-width: none; min-width: 0; color: #e1e1e1; background: #111318; border: 1px solid #23262d; border-radius: 16px; padding: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.4), 0 12px 32px rgba(0,0,0,0.28); }      .cb-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
      .cb-title { font-size: 16px; font-weight: 600; color: #f8fafc; }
      .cb-composer { margin-bottom: 20px; background: linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.018)); border: 1px solid rgba(148,163,184,0.16); border-radius: 14px; overflow: hidden; } 
      .cb-input { width: 100%; min-height: 44px; max-height: 160px; background: transparent; border: none; outline: none; resize: none; padding: 12px 14px; color: #f8fafc; font-size: 14px; line-height: 1.45; font-family: inherit; } 
      .cb-composer:focus-within { border-color: rgba(226,232,240,0.28); box-shadow: 0 0 0 3px rgba(148,163,184,0.08); } 
      .cb-composer-footer { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px 10px; border-top: 1px solid rgba(255,255,255,0.05);  }
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
      .cb-reply-btn::before { content: "\u21A9 "; }      
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
      .cb-box-mod-action { display: inline-flex; align-items: center; justify-content: center; padding: 6px 10px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); border-radius: 999px; color: #cbd5e1; font-size: 12px; font-weight: 500; cursor: pointer; transition: background .15s ease, border-color .15s ease, transform .1s ease; } 
      .cb-box-mod-action:hover { background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.16); transform: translateY(-1px); }
      .cb-box-mod-actions { display: flex; flex-direction: row; align-items: center; gap: 8px; flex-wrap: wrap; } 
      .cb-danger-item { color: #fecaca; }
      .cb-comment-deleted { opacity: 0.72; } 
      .cb-avatar-deleted { background: rgba(148, 163, 184, 0.12); color: #94a3b8; border: 1px solid rgba(148, 163, 184, 0.18); } 
      .cb-deleted-note { font-size: 12px; color: #64748b; font-style: italic; }
      .cb-box-status { margin-bottom: 16px; padding: 12px; border: 1px solid rgba(255,255,255,.08); border-radius: 12px; background: rgba(255,255,255,.03); display: flex; flex-direction: column; gap: 8px; } 
      .cb-box-status strong { color: #f8fafc; font-size: 14px; } 
      .cb-box-status span { color: #94a3b8; font-size: 13px; } 
      .cb-box-login { width: fit-content; padding: 7px 12px; }
      .cb-gif-search { width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.06); color: white; margin-bottom: 12px; } 
      .cb-gif-results { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-height: 45vh; overflow-y: auto; } 
      .cb-gif-result { border: 0; padding: 0; background: transparent; cursor: pointer; border-radius: 10px; overflow: hidden; } 
      .cb-gif-result img, .cb-comment-gif img, .cb-selected-gif img { width: 100%; display: block; border-radius: 10px; } 
      .cb-selected-gif { position: relative; max-width: 240px; margin-top: 10px; } 
      #cb-remove-selected-gif{position:absolute;top:6px;right:6px;width:26px;height:26px;border:none;border-radius:50%;background:rgba(0,0,0,.65);color:white;cursor:pointer;}
      .cb-gif-btn{ border:none; border-radius:8px; padding:6px 12px; background:rgba(255,255,255,.06); color:#f8fafc; cursor:pointer; } 
      .cb-gif-btn:hover{ background:rgba(255,255,255,.12); }
      .cb-gif-panel-inline { padding: 10px 12px; border-top: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.025); } 
      .cb-gif-search { width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.06); color: white; margin-bottom: 12px; outline: none; } 
      .cb-gif-result { aspect-ratio: 1 / 1; max-height: 110px; } 
      .cb-gif-result img { width: 100%; height: 100%; object-fit: cover; } 
      .cb-gif-results { grid-template-columns: repeat(3, minmax(0, 1fr)); max-height: 260px; overflow-y: auto; }
      .cb-selected-gif { max-width: 220px; margin: 10px 12px; } 
      .cb-comment-gif { max-width: 260px; margin-top: 8px; } 
      .cb-comment-gif img, .cb-selected-gif img { width: 100%; height: auto; border-radius: 10px; }
    `}rt()})();})();
