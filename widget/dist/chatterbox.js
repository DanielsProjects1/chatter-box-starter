(()=>{function Te(u){let g=u.querySelector(".cb-auth-modal");g.innerHTML=`
    <button class="cb-auth-close">\xD7</button>

    <h3>Log in</h3>

    <input
      id="cb-login-username"
      class="cb-auth-input"
      placeholder="Username"
    />

    <input
      id="cb-login-password"
      class="cb-auth-input"
      type="password"
      placeholder="Password"
    />

    <button class="cb-auth-primary cb-auth-primary-login">
      Log in
    </button>

    <button class="cb-social-btn cb-google-btn">
      Continue with Google
    </button>

    <button class="cb-social-btn">
      Continue with Email
    </button>

    <p class="cb-auth-switch">
      Don't have an account yet?
      <button class="cb-auth-signup">
        Sign up
      </button>
    </p>
    <div class="cb-auth-error" id="cb-auth-error"></div>
  `}function dt(u){let g=u.querySelector(".cb-auth-modal");g.innerHTML=`
    <button class="cb-auth-close">\xD7</button>

    <h3>Create account</h3>

    <input
      id="cb-signup-username"
      class="cb-auth-input"
      placeholder="Username"
    />

    <input
      id="cb-signup-email"
      class="cb-auth-input"
      placeholder="Email"
    />

    <input
      id="cb-signup-password"
      class="cb-auth-input"
      type="password"
      placeholder="Password"
    />

    <button class="cb-auth-primary">
      Create account
    </button>

    <p class="cb-auth-switch">
      Already have one?
      <button class="cb-auth-login">
        Log in
      </button>
    </p>
  `}function lt(u){let g=u.permissions||{};return`
    <div
      class="cb-comment-menu"
      data-comment-id="${u.id}"
    >

      ${g.canEdit?`
        <button
          class="cb-menu-item cb-edit-comment"
          data-comment-id="${u.id}"
        >
          Edit
        </button>
      `:""}

      ${g.canDelete?`
        <button
          class="cb-menu-item cb-delete-comment"
          data-comment-id="${u.id}"
        >
          Delete
        </button>
      `:""}

      ${g.canReport?`
        <button
          class="cb-menu-item cb-report-comment"
          data-comment-id="${u.id}"
        >
          Report
        </button>
      `:""}

      <button
        class="cb-menu-item cb-copy-comment-link"
        data-comment-id="${u.id}"
      >
        Copy link
      </button>

    </div>
  `}function bt(u){let g=u.permissions||{};return`
    <div
      class="cb-mod-menu"
      data-comment-id="${u.id}"
    >
      ${g.canPin?`
        <button
          class="cb-menu-item cb-pin-comment"
          data-comment-id="${u.id}"
        >
          ${u.pinned?"Unpin comment":"Pin comment"}
        </button>
      `:""}

      ${g.canLock?`
        <button
          class="cb-menu-item cb-lock-comment"
          data-comment-id="${u.id}"
        >
          ${u.locked?"Unlock comment":"Lock comment"}
        </button>
      `:""}

      ${g.canMuteAuthor?`
        <button
          class="cb-menu-item cb-mute-user"
          data-comment-id="${u.id}"
          data-user-id="${u.author.id}"
        >
          Mute author
        </button>
      `:""}

      ${g.canDelete?`
        <button
          class="cb-menu-item cb-danger-item cb-mod-delete-comment"
          data-comment-id="${u.id}"
        >
          Delete comment
        </button>
      `:""}
    </div>
  `}function Ie(u){let g=u.permissions||{};return g.canToggleBoxLock||g.canToggleBox||g.canEmptyBox?`
    <div class="cb-box-mod-actions">
      ${g.canToggleBoxLock?`
        <button
          class="cb-box-mod-action"
          data-box-action="${u.locked?"open":"shut"}"
        >
          ${u.locked?"Open Box":"Shut Box"}
        </button>
      `:""}

      ${g.canToggleBox?`
        <button
          class="cb-box-mod-action cb-danger-item"
          data-box-action="deactivate"
        >
          ${u.active?"Deactivate Box":"Reactivate Box"}
        </button>
      `:""}

      ${g.canEmptyBox?`
        <button
          class="cb-box-mod-action cb-danger-item"
          data-box-action="empty"
        >
          Empty Box
        </button>
      `:""}
    </div>
  `:""}(function(){let u={HEART:"\u2764\uFE0F",THUMBS_UP:"\u{1F44D}",THUMBS_DOWN:"\u{1F44E}",LAUGH:"\u{1F602}",SURPRISED:"\u{1F62E}",SAD:"\u{1F622}",FIRE:"\u{1F525}"},g=["THUMBS_UP","HEART","FIRE","LAUGH","SURPRISED","SAD","THUMBS_DOWN"],J=window.ChatterBoxConfig||{},h=J.apiUrl,Be=J.keycloakBaseUrl;if(!h){console.error("[ChatterBox] No apiUrl provided in window.ChatterBoxConfig");return}if(!Be){console.error("[ChatterBox] Missing keycloakBaseUrl in window.ChatterBoxConfig");return}let Ee=`${Be}/realms/chatterbox/protocol/openid-connect/token`,Y=null,j=new Map,v={accessToken:null,refreshToken:null};localStorage.removeItem("chatterbox_token"),localStorage.removeItem("chatterbox_refresh_token"),localStorage.removeItem("chatterbox_last_active");let L=J.siteId;if(!L){console.error("[ChatterBox] No siteId provided in window.ChatterBoxConfig");return}let Ce=J.mountId||"chatterbox-widget",Se=document.getElementById(Ce);if(!Se){console.error(`[ChatterBox] No element found with id "${Ce}"`);return}let n=Se.attachShadow({mode:"open"}),w=null,m=null,H=0,Le=!1,Z=0,P=[],ee=!1,se=[],S=null,x=null,M=!1,V=null,R=null,T=null,D=null,de=new Map;async function Me(){let e=window.location.pathname;try{let t={"Content-Type":"application/json"};v.accessToken&&await oe()&&(t.Authorization=`Bearer ${v.accessToken}`);let o=await fetch(`${h}/api/v1/widget/init`,{method:"POST",headers:t,body:JSON.stringify({siteId:L,pageUrl:e})});if(o.status===401&&(q(),o=await fetch(`${h}/api/v1/widget/init`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({siteId:L,pageUrl:e})})),!o.ok)throw new Error(`Init failed: ${o.status}`);let i=await o.json();pt(i)}catch(t){d("Failed to initialize comments. Please refresh the page."),console.error("[ChatterBox] Failed to initialize:",t)}}function pt(e){n.innerHTML=`
      <style>${Et()}</style>
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
            ${v.accessToken?"":`
              <button class="cb-auth-login cb-box-login">
                Log in
              </button>
            `}
          </div>
        `}
        <div id="cb-comments-panel">
          <div class="cb-composer">
            <textarea
              class="cb-input"
              id="cb-input"
              rows="1"
              placeholder="Join the chatter..."
            ></textarea>
            <div id="cb-selected-gif-preview"></div>
            <div id="cb-gif-panel" class="cb-gif-panel-inline" style="display:none;"></div>
            <div class="cb-composer-footer">
              <button type="button" id="cb-gif-btn" class="cb-gif-btn">GIF</button>
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
    `,m=e,w=e.id,queueMicrotask(W),mt(),Le||(ut(),Le=!0),Pe(w)}async function Pe(e){try{let t=`${h}/api/v1/widget/${e}/comments?page=${Z}&size=20`,o=await ge(),i=await fetch(t,{headers:o});if(i.status===401&&(q(),i=await fetch(t,{headers:{}})),!i.ok)throw new Error(`Failed to load comments: ${i.status}`);let c=await i.json();H=c.totalElements||0;let s=n.getElementById("cb-load-more");s.style.display=c.last?"none":"block",P=Z===0?c.content||[]:[...P,...c.content||[]],Ue(P,H)}catch(t){d("Failed to load comments. Please try again."),console.error("[ChatterBox] Failed to load comments:",t)}}async function le(){let e=Z,t=[],o=0,i=!1,c=await ge();for(let E=0;E<=e;E++){let B=await fetch(`${h}/api/v1/widget/${w}/comments?page=${E}&size=20`,{headers:c});if(!B.ok)throw new Error(`Failed to refresh comments: ${B.status}`);let z=await B.json();o=z.totalElements||0,i=z.last,t.push(...z.content||[])}P=t;let s=n.getElementById("cb-load-more");s.style.display=i?"none":"block",Ue(P,o)}function Ue(e,t){be(t);let o=n.getElementById("cb-comments");if(e.length===0){o.innerHTML='<div class="cb-empty">No comments yet. Be the first!</div>';return}e.forEach(G),o.innerHTML=e.map(K).join("")}function K(e){let t=je(e),o=t?te(e):e.author.displayName||e.author.username,i=t?De(e):o.charAt(0).toUpperCase();return`
      <div class="cb-comment ${t?"cb-comment-deleted":""} ${e.replyCount>0?"cb-has-replies":""}"
      data-comment-root-id="${e.id}">
        <div class="cb-avatar ${t?"cb-avatar-deleted":""} ">${i}</div>
        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">${o}</span>
            <span class="cb-timestamp">${Ke(e.createdDate)}</span>
          </div>
          <div class="cb-comment-text">${t?te(e):y(e.body)}</div>
          ${e.gifUrl?`
            <div class="cb-comment-gif">
                <img
                    src="${y(e.gifPreviewUrl||e.gifUrl)}"
                    alt="${y(e.gifTitle||"GIF")}"
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
              data-reply-to="${y(e.author.displayName||e.author.username)}"
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
              ${Re(e)}
            </div>
            <button
              class="cb-comment-menu-btn"
              data-comment-id="${e.id}"
              aria-expanded="false"
            >
              \u22EF
            </button>
            ${He(e)?`
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
    `}function be(e=H){H=e;let t=n.querySelector(".cb-title");t&&(t.textContent=`Chatter \xB7 ${H} ${H===1?"comment":"comments"}`)}function He(e){let t=e.permissions||{};return t.canPin||t.canLock||t.canMuteAuthor||t.canDelete}async function pe(e){let t=n.getElementById(`replies-${e}`);if(!t){let s=n.getElementById(`reply-container-${e}`);if(!s)return;s.insertAdjacentHTML("afterend",`
          <div
            class="cb-replies"
            id="replies-${e}"
          ></div>
        `),t=n.getElementById(`replies-${e}`)}if(t.innerHTML='<div class="cb-loading">Loading replies...</div>',j.has(e)){let s=j.get(e);t.innerHTML=s.length?s.map(E=>O(E,e)).join(""):"";return}let c=(await(await fetch(`${h}/api/v1/widget/${w}/comments/${e}`,{headers:{...v.accessToken?{Authorization:`Bearer ${v.accessToken}`}:{}}})).json()).content||[];c.forEach(G),j.set(e,c),t.innerHTML=c.length?c.map(s=>O(s,e)).join(""):""}function O(e,t){let o=je(e),i=o?te(e):e.author.displayName||e.author.username,c=o?De(e):i.charAt(0).toUpperCase();return`
      <div class="cb-comment cb-reply ${o?"cb-comment-deleted":""} ${e.replyCount>0?"cb-has-replies":""}"
      data-comment-root-id="${e.id}">
        <div class="cb-avatar ${o?"cb-avatar-deleted":""}">
          ${c}
        </div>

        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">${y(i)}</span>
            <span class="cb-timestamp">${Ke(e.createdDate)}</span>
          </div>

          <div class="cb-comment-text">
            ${o?te(e):y(e.body)}
          </div>
          ${e.gifUrl?`
            <div class="cb-comment-gif">
                <img
                    src="${y(e.gifPreviewUrl||e.gifUrl)}"
                    alt="${y(e.gifTitle||"GIF")}"
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
                data-reply-to="${y(i)}"
              >
                Reply
              </button>

              <div class="cb-reactions">
                ${Re(e)}
              </div>

              <button
                class="cb-comment-menu-btn"
                data-comment-id="${e.id}"
                aria-expanded="false"
              >
                \u22EF
              </button>

              ${He(e)?`
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
    `}function Re(e){let t={};for(let i of e.reactions||[])t[i.reactionType]=i;let o="";for(let i of g){let c=t[i],s=c?c.count:0,E=c?c.reacted:!1,B=u[i];o+=`
        <button
          class="cb-reaction-btn ${E?"cb-reaction-active":""}"
          data-comment-id="${e.id}"
          data-reaction-type="${i}"
        >
          ${B}
          ${s>0?`<span>${s}</span>`:""}
        </button>
      `}return o}function Ae(){let e=n.querySelector(".cb-header");n.querySelector(".cb-box-mod-actions")?.remove(),e.insertAdjacentHTML("beforeend",Ie(m))}function W(){let e=n.getElementById("cb-input"),t=n.getElementById("cb-submit-btn");if(!e||!t||!m)return;let o=m.locked||!m.active;e.disabled=o,t.disabled=o,e.placeholder=m.active?m.locked?"This discussion is locked.":"Join the chatter...":"This discussion is inactive."}function ut(){n.addEventListener("click",async e=>{if(e.target.closest(".cb-box-login")){Te(n);return}if(e.target.closest("#cb-load-more")){Z+=1,await Pe(w);return}let i=e.target.closest(".cb-tab");if(i){let r=i.dataset.tab;n.querySelectorAll(".cb-tab").forEach(a=>{a.classList.remove("cb-tab-active")}),i.classList.add("cb-tab-active"),n.getElementById("cb-comments-panel").style.display=r==="comments"?"block":"none",n.getElementById("cb-rules-panel").style.display=r==="rules"?"block":"none",r==="rules"&&!ee&&(await Oe(),ee=!0);return}if(e.target.closest("#cb-gif-btn")){ue("cb-gif-panel","composer");return}let s=e.target.closest(".cb-gif-result");if(s){let r={gifUrl:s.dataset.gifUrl,gifPreviewUrl:s.dataset.gifPreviewUrl,gifProvider:s.dataset.gifProvider,gifProviderId:s.dataset.gifProviderId,gifTitle:s.dataset.gifTitle},a=s.closest(".cb-gif-panel-inline"),l=a?.dataset.mode||"composer";if(l==="edit"){x=r,M=!1,fe(R),a&&(a.style.display="none"),n.querySelector(".cb-edit-input")?.focus();return}if(l==="reply"){T=r,qe(D),a&&(a.style.display="none"),n.getElementById(`reply-container-${D}`)?.querySelector(".cb-inline-input")?.focus();return}S=r,me(),a&&(a.style.display="none"),n.getElementById("cb-input")?.focus();return}e.target.closest("#cb-remove-selected-gif")&&(S=null,me());let B=e.target.closest(".cb-remove-reply-gif");if(B){let r=B.dataset.commentId;T=null,qe(r);return}let z=e.target.closest(".cb-reply-gif-btn");if(z){let r=z.dataset.commentId;D=r,ue(`cb-reply-gif-panel-${r}`,"reply");return}let We=e.target.closest(".cb-box-mod-action");if(We){if(!await k())return;let r=We.dataset.boxAction;if(r==="empty"&&!confirm("Delete every comment in this discussion?"))return;if(!(await I(`${h}/api/v1/dashboard/moderation/boxes/${w}/${r}`,{method:"PUT"})).ok){d("Failed to update discussion.");return}if(r==="shut"&&(m.locked=!0),r==="open"&&(m.locked=!1),r==="deactivate"&&(m.active=!m.active),r==="empty"){P=[],de.clear(),j.clear(),be(0);let l=n.getElementById("cb-comments");l.innerHTML='<div class="cb-empty">No comments yet. Be the first!</div>';let b=n.getElementById("cb-load-more");b.style.display="none"}n.querySelectorAll(".cb-reply-container").forEach(l=>{l.innerHTML=""}),Ae(),W(),d(`Box updated. Action: ${r=="deactivate"?"activation toggle":r}`);return}let ne=e.target.closest(".cb-mod-menu-btn");if(ne){n.querySelector(".cb-comment-menu")?.remove();let r=n.querySelector(".cb-mod-menu");if(r){let l=r.dataset.commentId;if(r.remove(),l===ne.dataset.commentId)return}let a=A(ne.dataset.commentId);if(!a)return;ne.insertAdjacentHTML("afterend",bt(a));return}let Qe=e.target.closest(".cb-lock-comment");if(Qe){if(!await k())return;let r=Qe.dataset.commentId;if(!(await I(`${h}/api/v1/dashboard/moderation/${L}/comments/${r}/lock`,{method:"PUT"})).ok){d("Failed to update comment lock.");return}d("Comment updated."),n.querySelector(".cb-mod-menu")?.remove(),await le();return}let Xe=e.target.closest(".cb-pin-comment");if(Xe){if(!await k())return;let r=Xe.dataset.commentId;if(!(await I(`${h}/api/v1/dashboard/moderation/${L}/comments/${r}/pin`,{method:"PUT"})).ok){d("Failed to update pinned comment.");return}d("Comment updated."),n.querySelector(".cb-mod-menu")?.remove(),await le();return}let Ze=e.target.closest(".cb-mod-delete-comment");if(Ze){if(!await k())return;let r=Ze.dataset.commentId;if(!confirm("Delete this comment?"))return;if(!(await I(`${h}/api/v1/widget/${w}/comments/${r}`,{method:"DELETE"})).ok){d("Failed to remove comment.");return}Fe(r,"REMOVED"),n.querySelector(".cb-mod-menu")?.remove(),d("Comment removed.");return}let et=e.target.closest(".cb-mute-user");if(et){if(!await k())return;let r=et.dataset.userId,a=prompt("Reason for muting this user?")||"";if(!(await I(`${h}/api/v1/dashboard/moderation/${L}/mute/${r}`,{method:"POST",headers:{"Content-Type":"text/plain"},body:a})).ok){d("Failed to mute user.");return}d("User muted."),n.querySelector(".cb-mod-menu")?.remove();return}let Q=e.target.closest(".cb-comment-menu-btn");if(Q){n.querySelector(".cb-mod-menu")?.remove();let r=n.querySelector(".cb-comment-menu"),a=n.querySelector('.cb-comment-menu-btn[aria-expanded="true"]');if(a&&a.setAttribute("aria-expanded","false"),r&&(r.remove(),a===Q))return;Q.setAttribute("aria-expanded","true");let l=A(Q.dataset.commentId);Q.insertAdjacentHTML("afterend",lt(l));return}let tt=e.target.closest(".cb-report-comment");if(tt){if(!await k())return;let r=tt.dataset.commentId;ee||(await Oe(),ee=!0),$t(r),n.querySelector(".cb-comment-menu")?.remove();return}let ot=e.target.closest(".cb-report-submit");if(ot){let r=ot.dataset.commentId,a=n.getElementById("cb-report-reason").value,l=n.getElementById("cb-report-details").value.trim(),p=n.getElementById("cb-report-rule")?.value||null;await I(`${h}/api/v1/widget/${w}/comments/${r}/report`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reason:a,explanation:l,ruleId:p})}),n.querySelector(".cb-report-modal-backdrop")?.remove(),d("Report submitted.");return}if(e.target.closest(".cb-report-close")){n.querySelector(".cb-report-modal-backdrop")?.remove();return}let nt=e.target.closest(".cb-copy-comment-link");if(nt){let r=nt.dataset.commentId,a=`${window.location.href}#comment-${r}`;await navigator.clipboard.writeText(a),d("Comment link copied."),n.querySelector(".cb-comment-menu")?.remove(),n.querySelector('.cb-comment-menu-btn[aria-expanded="true"]')?.setAttribute("aria-expanded","false");return}let xe=e.target.closest(".cb-edit-comment");if(xe){if(!await k())return;let r=xe.dataset.commentId;R=r;let l=xe.closest(".cb-comment").querySelector(".cb-comment-text"),b=A(r);x=null,M=!1,V=b?.gifUrl?{gifUrl:b.gifUrl,gifPreviewUrl:b.gifPreviewUrl,gifProvider:b.gifProvider,gifProviderId:b.gifProviderId,gifTitle:b.gifTitle}:null;let p=b?.body||l.textContent.trim();n.querySelector(".cb-comment-menu")?.remove(),l.innerHTML=`
          <div class="cb-composer cb-edit-composer">
            <textarea class="cb-input cb-edit-input">${y(p)}</textarea>

            <div
              class="cb-edit-gif-preview"
              id="cb-edit-gif-preview-${r}"
            ></div>

            <div
              id="cb-edit-gif-panel-${r}"
              class="cb-gif-panel-inline"
              style="display:none;"
            ></div>

            <div class="cb-composer-footer">
              <button
                type="button"
                class="cb-gif-btn cb-edit-add-gif"
                data-comment-id="${r}"
              >
                GIF
              </button>

              <div class="cb-inline-actions">
                <button class="cb-edit-cancel" data-comment-id="${r}">
                  Cancel
                </button>

                <button class="cb-edit-save" data-comment-id="${r}">
                  Save
                </button>
              </div>
            </div>
          </div>
        `,fe(r);let f=l.querySelector(".cb-edit-input");f?.focus(),f&&(f.style.height="auto",f.style.height=`${Math.min(f.scrollHeight,160)}px`),f?.addEventListener("input",()=>{f.style.height="auto",f.style.height=`${Math.min(f.scrollHeight,160)}px`}),f?.addEventListener("keydown",C=>{C.key==="Enter"&&!C.shiftKey&&(C.preventDefault(),l.querySelector(".cb-edit-save")?.click())});return}let rt=e.target.closest(".cb-edit-add-gif");if(rt){let r=rt.dataset.commentId;R=r,ue(`cb-edit-gif-panel-${r}`,"edit");return}let it=e.target.closest(".cb-edit-remove-gif");if(it){x=null,M=!0,R=it.dataset.commentId,fe(R);return}let F=e.target.closest(".cb-edit-save");if(F){if(!await k())return;let r=F.dataset.commentId,a=F.closest(".cb-comment"),b=a.querySelector(".cb-edit-input").value.trim(),p=A(r);if(!(b.length>0)&&!(M?!!x:!!V||!!x)){d("Comment cannot be empty.");return}F.disabled=!0,F.textContent="Saving...";let N={body:b,...x?{gifUrl:x.gifUrl,gifPreviewUrl:x.gifPreviewUrl,gifProvider:x.gifProvider,gifProviderId:x.gifProviderId,gifTitle:x.gifTitle}:{},...M?{removeGif:!0}:{}};try{if(!(await I(`${h}/api/v1/widget/${w}/comments/${r}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(N)})).ok){d("Edit patch req failed.");return}p&&(p.body=b,M?(p.gifUrl=null,p.gifPreviewUrl=null,p.gifProvider=null,p.gifProviderId=null,p.gifTitle=null):x&&(p.gifUrl=x.gifUrl,p.gifPreviewUrl=x.gifPreviewUrl,p.gifProvider=x.gifProvider,p.gifProviderId=x.gifProviderId,p.gifTitle=x.gifTitle),G(p),x=null,M=!1,V=null,R=null),a.outerHTML=p.parentId?O(p,p.parentId):K(p),d("Comment updated.")}catch(X){d("Failed to edit comment."),console.error("[ChatterBox] Edit failed:",X)}finally{F.disabled=!1,F.textContent="Save"}return}let ve=e.target.closest(".cb-edit-cancel");if(ve){let r=ve.dataset.commentId,a=ve.closest(".cb-comment"),l=a.querySelector(".cb-comment-text"),b=A(r);x=null,M=!1,V=null,R=null,b&&(a.outerHTML=b.parentId?O(b,b.parentId):K(b));return}let re=e.target.closest(".cb-delete-comment");if(re){if(!await k())return;let r=re.dataset.commentId;if(!confirm("Delete this comment?"))return;re.disabled=!0,re.textContent="Deleting...";try{if(!(await I(`${h}/api/v1/widget/${w}/comments/${r}`,{method:"DELETE"})).ok){d("Failed to delete comment.");return}Fe(r,"DELETED"),n.querySelector(".cb-comment-menu")?.remove(),d("Comment deleted.")}catch(l){d("Failed to delete comment."),console.error("[ChatterBox] Delete failed:",l)}return}let _=e.target.closest(".cb-reaction-btn");if(_){if(!await k())return;let r=_.dataset.commentId,a=_.dataset.reactionType;_.disabled=!0;try{let l=await I(`${h}/api/v1/widget/comments/${r}/reactions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reactionType:a})});if(!l.ok){d("Reaction request failed.");return}let b=await l.json();vt(_,b);let p=A(r);if(p){let f=p.reactions||[],C=f.find(ae=>ae.reactionType===b.reactionType);C?(C.count=b.count,C.reacted=b.reacted):f.push(b),p.reactions=f}}catch(l){d("Failed to add reaction. Please try again."),console.error("[ChatterBox] Failed to react:",l)}finally{_.disabled=!1}return}let ie=e.target.closest(".cb-reply-btn");if(ie){if(m?.locked||!m?.active){d(m.active?"This discussion is locked.":"This discussion is inactive.");return}if(!await k())return;let r=ie.dataset.commentId,a=ie.dataset.replyTo,l=ie.dataset.rootCommentId||r,b=n.getElementById(`reply-container-${r}`);if(b.innerHTML.trim()){b.innerHTML="";return}let p=a?`@${a} `:"";D=r,T=null,b.innerHTML=`
          <div class="cb-composer cb-inline-reply">
            <textarea
              class="cb-input cb-inline-input"
              placeholder="Write a reply..."
            >${p}</textarea>

            <div
              class="cb-reply-gif-preview"
              id="cb-reply-gif-preview-${r}"
            ></div>

            <div
              id="cb-reply-gif-panel-${r}"
              class="cb-gif-panel-inline"
              style="display:none;"
            ></div>

            <div class="cb-composer-footer">
              <button
                type="button"
                class="cb-gif-btn cb-reply-gif-btn"
                data-comment-id="${r}"
              >
                GIF
              </button>

              <div class="cb-inline-actions">
                <button class="cb-inline-cancel">
                  Cancel
                </button>

                <button
                  class="cb-inline-submit"
                  data-comment-id="${r}"
                  data-root-comment-id="${l}"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        `,queueMicrotask(()=>{b.querySelector("textarea")?.focus()});return}let at=e.target.closest(".cb-view-replies-btn");if(at){let r=at.dataset.commentId,a=n.getElementById(`replies-${r}`);if(a.innerHTML.trim()){a.innerHTML="";return}await pe(r);return}let U=e.target.closest(".cb-inline-submit");if(U){if(m?.locked||!m?.active){d(m.active?"This discussion is locked.":"This discussion is inactive.");return}if(!await k())return;let r=U.dataset.commentId,a=U.dataset.rootCommentId||r,l=U.closest(".cb-inline-reply"),p=l.querySelector("textarea").value.trim();if(!p&&!T)return;U.disabled=!0,U.textContent="Posting...";let f=null,C=n.getElementById(`replies-${a}`);C||(await pe(a),C=n.getElementById(`replies-${a}`)),f=wt(a,p,T);let ae=ze(p,a,T);try{let N=await I(`${h}/api/v1/widget/sites/${L}/boxes/${w}/comments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(ae)});if(N.status===429){f&&n.getElementById(f)?.remove(),d("You are commenting too quickly. Please slow down.");return}let X=l.closest(".cb-reply-container"),ye=await N.json();f&&n.getElementById(f)?.remove(),G(ye);let st=j.get(a)||[];st.push(ye),j.set(a,st);let we=P.find(ce=>ce.id===a);we&&(we.replyCount=(we.replyCount||0)+1);let $e=n.getElementById(`replies-${a}`);$e||(await pe(a),$e=n.getElementById(`replies-${a}`)),$e.insertAdjacentHTML("beforeend",O(ye,a));let ke=n.querySelector(`[data-comment-id="${a}"].cb-view-replies-btn`);if(ke){let ce=Number(ke.textContent.match(/\d+/)?.[0]||0)+1;ke.textContent=`View ${ce} ${ce===1?"reply":"replies"}`}X&&(X.innerHTML=""),T=null,D=null}catch(N){f&&n.getElementById(f)?.remove(),d("Failed to post reply. Please try again."),console.error("[ChatterBox] Reply failed:",N)}finally{U.disabled=!1,U.textContent="Reply"}return}let ct=e.target.closest(".cb-inline-cancel");if(ct){T=null,D=null;let r=ct.closest(".cb-reply-container");r&&(r.innerHTML="")}if(e.target.closest(".cb-auth-close")){n.getElementById("cb-auth-modal")?.remove();return}if(e.target.closest(".cb-auth-login")){Te(n),console.log("[ChatterBox] Login clicked");return}if(e.target.closest(".cb-auth-signup")){dt(n),console.log("[ChatterBox] Sign up clicked");return}if(e.target.closest(".cb-auth-primary-login")){await _e();return}if(e.target.closest(".cb-auth-primary-signup")){await Bt();return}!e.target.closest(".cb-comment-menu")&&!e.target.closest(".cb-comment-menu-btn")&&(n.querySelector(".cb-comment-menu")?.remove(),n.querySelector('.cb-comment-menu-btn[aria-expanded="true"]')?.setAttribute("aria-expanded","false")),!e.target.closest(".cb-mod-menu")&&!e.target.closest(".cb-mod-menu-btn")&&n.querySelector(".cb-mod-menu")?.remove()})}function mt(){let e=n.getElementById("cb-submit-btn"),t=n.getElementById("cb-input");t.addEventListener("input",()=>{t.style.height="auto",t.style.height=`${Math.min(t.scrollHeight,160)}px`}),t.addEventListener("keydown",o=>{o.key==="Enter"&&!o.shiftKey&&(o.preventDefault(),e.click())}),e.addEventListener("click",async()=>{let o=t.value.trim();if(!o&&!S||e.disabled)return;if(m?.locked||!m?.active){d(m.active?"This box is locked.":"This box is inactive."),W();return}if(!await k())return;let i=yt(o,S);e.disabled=!0,e.textContent="Posting...";let c=ze(o,null,S);try{console.time("post");let s=await I(`${h}/api/v1/widget/sites/${L}/boxes/${w}/comments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)});if(s.status===429){n.getElementById(i)?.remove(),d("You are commenting too quickly. Please slow down.");return}console.timeEnd("post"),t.value="",t.style.height="auto",S=null,me();let E=n.getElementById("cb-gif-panel");E&&(E.style.display="none"),n.getElementById(i)?.remove();let B=await s.json();G(B),P.unshift(B),be(H+1),n.getElementById("cb-comments").insertAdjacentHTML("afterbegin",K(B))}catch(s){n.getElementById(i)?.remove(),d("Failed to post comment. Please try again."),console.error("[ChatterBox] Failed to post comment:",s)}finally{e.disabled=!1,e.textContent="Comment",W()}})}function ue(e,t="composer"){let o=n.getElementById(e);if(o){if(o.style.display==="block"){o.style.display="none";return}ft(e,t)}}function ft(e,t="composer"){let o=n.getElementById(e);if(!o)return;o.style.display="block",o.dataset.mode=t,o.innerHTML=`
      <input
        class="cb-gif-search"
        placeholder="Search GIFs..."
      />

      <div class="cb-gif-results"></div>
    `;let i=o.querySelector(".cb-gif-search");i&&(i.autocomplete="off"),i?.addEventListener("input",xt(()=>ht(i),300)),i?.focus()}async function gt(e){let t=await fetch(`${h}/api/v1/widget/gifs/search?q=${encodeURIComponent(e)}`);if(!t.ok)throw new Error(`GIF search failed: ${t.status}`);return await t.json()}async function ht(e){let t=e.value.trim(),i=e.closest(".cb-gif-panel-inline")?.querySelector(".cb-gif-results");if(!i){console.error("[ChatterBox] No GIF results element found.");return}if(!t){i.innerHTML="";return}i.innerHTML='<div class="cb-gif-loading">Searching...</div>';try{let c=await gt(t);if(!c.length){i.innerHTML='<div class="cb-empty">No GIFs found.</div>';return}i.innerHTML=c.map(s=>`
        <button
          type="button"
          class="cb-gif-result"
          data-gif-url="${$(s.gifUrl)}"
          data-gif-preview-url="${$(s.gifPreviewUrl||s.gifUrl)}"
          data-gif-provider="${$(s.gifProvider)}"
          data-gif-provider-id="${$(s.gifProviderId)}"
          data-gif-title="${$(s.gifTitle||"GIF")}">
          <img src="${$(s.gifPreviewUrl||s.gifUrl)}" />
        </button>
      `).join("")}catch(c){console.error("[ChatterBox] GIF search failed:",c),i.innerHTML='<div class="cb-gif-error">Failed to load GIFs.</div>'}}function xt(e,t){let o;return function(...i){clearTimeout(o),o=setTimeout(()=>{e.apply(this,i)},t)}}function me(){let e=n.querySelector("#cb-selected-gif-preview");if(e){if(!S){e.innerHTML="";return}e.innerHTML=`
      <div class="cb-selected-gif">
        <img src="${$(S.gifPreviewUrl||S.gifUrl)}"
            alt="${$(S.gifTitle||"Selected GIF")}" />
        <button type="button" id="cb-remove-selected-gif">\xD7</button>
      </div>
    `}}function qe(e){let t=n.getElementById(`cb-reply-gif-preview-${e}`);if(t){if(!T){t.innerHTML="";return}t.innerHTML=`
      <div class="cb-selected-gif">
        <img
          src="${$(T.gifPreviewUrl||T.gifUrl)}"
          alt="${$(T.gifTitle||"Selected GIF")}"
        />
        <button
          type="button"
          class="cb-remove-reply-gif"
          data-comment-id="${e}"
        >
          \xD7
        </button>
      </div>
    `}}function fe(e){let t=n.getElementById(`cb-edit-gif-preview-${e}`);if(!t)return;if(M){t.innerHTML="";return}let o=x||V;if(!o){t.innerHTML="";return}t.innerHTML=`
      <div class="cb-selected-gif">
        <img
          src="${$(o.gifPreviewUrl||o.gifUrl)}"
          alt="${$(o.gifTitle||"GIF")}"
        />
        <button
          type="button"
          class="cb-edit-remove-gif"
          data-comment-id="${e}"
        >
          \xD7
        </button>
      </div>
    `}function ze(e,t=null,o=null){return{body:e,...t?{parentId:t}:{},...o?{gifUrl:o.gifUrl,gifPreviewUrl:o.gifPreviewUrl,gifProvider:o.gifProvider,gifProviderId:o.gifProviderId,gifTitle:o.gifTitle}:{}}}function $(e){return y(String(e??""))}function Fe(e,t){let o=A(e);if(!o)return;o.status=t,o.body=t==="REMOVED"?"[removed]":"[deleted]",o.permissions={},o.reactions=[],o.locked=!0,G(o);let i=n.querySelector(`[data-comment-root-id="${e}"]`);i&&(i.outerHTML=o.parentId?O(o,o.parentId):K(o))}function je(e){return e.status==="DELETED"||e.status==="REMOVED"}function te(e){return e.status==="REMOVED"?"[removed]":"[deleted]"}function De(e){return e.status==="REMOVED"?"!":"\xD7"}function vt(e,t){e.classList.toggle("cb-reaction-active",t.reacted);let o=e.querySelector("span");t.count>0?o?o.textContent=t.count:e.insertAdjacentHTML("beforeend",`<span>${t.count}</span>`):o?.remove()}function yt(e,t){let o=n.getElementById("cb-comments"),i=`cb-pending-${crypto.randomUUID()}`,c=`
      <div id="${i}" class="cb-comment cb-comment-pending">
        <div class="cb-avatar">Y</div>

        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">You</span>
            <span class="cb-timestamp">just now</span>
          </div>

          <div class="cb-comment-text">
            ${y(e)}
          </div>
          ${t?`
            <div class="cb-comment-gif">
                <img
                    src="${$(t.gifPreviewUrl||t.gifUrl)}"
                    alt=""
                />
            </div>
            `:""}
        </div>
      </div>
    `;return o.insertAdjacentHTML("afterbegin",c),i}function wt(e,t,o){let i=n.getElementById(`replies-${e}`);if(!i)return null;let c=`cb-pending-reply-${crypto.randomUUID()}`;return i.insertAdjacentHTML("beforeend",`
        <div
          id="${c}"
          class="cb-comment cb-reply cb-comment-pending"
        >
          <div class="cb-avatar">Y</div>

          <div class="cb-comment-body">
            <div class="cb-comment-meta">
              <span class="cb-username">You</span>
              <span class="cb-timestamp">just now</span>
            </div>

            <div class="cb-comment-text">
              ${y(t)}
            </div>
            ${o?`
              <div class="cb-comment-gif">
                  <img
                      src="${$(o.gifPreviewUrl||o.gifUrl)}"
                      alt=""
                  />
              </div>
              `:""}
          </div>
        </div>
      `),c}function G(e){de.set(e.id,e)}function A(e){return de.get(e)||null}async function Oe(){let e=n.getElementById("cb-rules-list");e.innerHTML='<div class="cb-loading">Loading rules...</div>';let o=await(await fetch(`${h}/api/v1/dashboard/sites/${L}/rules`)).json();se=o;let i=n.getElementById("cb-rules-tab");i.textContent=`Rules ${o.length?`(${o.length})`:"0"}`,e.innerHTML=o.length?o.map(c=>`
          <div class="cb-rule">
            <div class="cb-rule-title">${y(c.rule)}</div>
            <div class="cb-rule-description">${y(c.description||"")}</div>
          </div>
        `).join(""):'<div class="cb-empty">No site rules yet.</div>'}async function k(){return!v.accessToken||!await oe()?(Ge(),!1):!0}function Ge(){if(n.getElementById("cb-auth-modal"))return;let t=document.createElement("div");t.id="cb-auth-modal",t.className="cb-auth-backdrop",t.innerHTML=`
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
    `,n.querySelector(".cb-root").appendChild(t)}function $t(e){n.querySelector(".cb-report-modal-backdrop")?.remove();let t=document.createElement("div");t.className="cb-report-modal-backdrop",t.innerHTML=`
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

        ${se.length?`
          <select class="cb-report-select" id="cb-report-rule">
            <option value="">Select rule violated optional</option>
            ${se.map(o=>`
              <option value="${o.id}">
                ${y(o.title)}
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
    `,n.querySelector(".cb-root").appendChild(t)}async function _e(){let e=n.querySelector("#cb-login-username")?.value.trim(),t=n.querySelector("#cb-login-password")?.value.trim();if(!e||!t){d("Please fill in all fields.");return}try{let o=new URLSearchParams({grant_type:"password",client_id:"chatterbox-api",username:e,password:t}),i=await fetch(Ee,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:o});if(!i.ok){Ve("Invalid username or password.");return}let c=await i.json();Ne(c),he(),m?.active?await kt():await Me()}catch(o){Ve("Please enter your username and password."),console.error(o)}}async function kt(){await Tt(),await le()}async function Tt(){if(!(await ge()).Authorization)throw new Error("No auth token available for permission refresh.");let t=await I(`${h}/api/v1/widget/boxes/${w}`);if(!t.ok)throw new Error(`Failed to refresh box state: ${t.status}`);m=await t.json(),w=m.id,Ae(),W()}async function ge(){if(!v.accessToken)return{};try{if(await oe())return{Authorization:`Bearer ${v.accessToken}`}}catch(e){console.warn("[ChatterBox] Token refresh failed, loading anonymously:",e)}return q(),{}}function Ne(e){if(!e?.access_token)throw new Error("Authentication response did not include an access token.");v.accessToken=e.access_token,e.refresh_token&&(v.refreshToken=e.refresh_token)}function q(){v.accessToken=null,v.refreshToken=null}async function I(e,t={}){if(!await oe())return q(),he(),new Response(null,{status:401});let i=()=>fetch(e,{...t,headers:{...t.headers||{},Authorization:`Bearer ${v.accessToken}`}}),c=await i();return c.status===401&&(await Je()?c=await i():(q(),he())),c}async function oe(){return v.accessToken?It(v.accessToken)?await Je()&&!!v.accessToken:!0:!1}function he(){n.getElementById("cb-auth-modal")?.remove(),n.querySelector(".cb-auth-backdrop")?.remove()}async function Je(){return Y||(Y=(async()=>{try{let e=v.refreshToken;if(!e)return q(),!1;let t=new URLSearchParams({grant_type:"refresh_token",client_id:"chatterbox-api",refresh_token:e}),o=await fetch(Ee,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:t});if(!o.ok)return q(),!1;let i=await o.json();return Ne(i),!0}finally{Y=null}})(),Y)}function Ye(e){try{let o=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"),i=decodeURIComponent(atob(o).split("").map(c=>"%"+("00"+c.charCodeAt(0).toString(16)).slice(-2)).join(""));return JSON.parse(i)}catch{return null}}function It(e){let t=Ye(e);if(!t?.exp)return!0;let o=t.exp*1e3,i=Date.now(),c=1e3*60*2;return o-i<c}function Ct(e){let t=Ye(e);return t?.exp?t.exp*1e3<=Date.now():!0}async function Bt(){let e=n.querySelector("#cb-signup-username")?.value.trim(),t=n.querySelector("#cb-signup-email")?.value.trim(),o=n.querySelector("#cb-signup-password")?.value.trim();if(!e||!t||!o){d("Please fill in all fields.");return}try{await fetch(`${h}/api/v1/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,email:t,password:o})}),await _e()}catch(i){d("Sign up failed."),console.error(i)}}function Ve(e){let t=n.getElementById("cb-auth-error");if(!t){d(e);return}t.textContent=e,t.style.display="block",clearTimeout(t._timeoutId),t._timeoutId=setTimeout(()=>{t.textContent="",t.style.display="none"},5e3)}function Ke(e){let t=new Date(e),i=Math.floor((new Date-t)/1e3);return i<60?"just now":i<3600?`${Math.floor(i/60)}m ago`:i<86400?`${Math.floor(i/3600)}h ago`:`${Math.floor(i/86400)}d ago`}function y(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function d(e){n.getElementById("cb-error")?.remove();let o=document.createElement("div");o.id="cb-error",o.className="cb-error",o.textContent=e,n.querySelector(".cb-root").appendChild(o),setTimeout(()=>{o.remove()},2500)}function Et(){return`
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
    `}Me()})();})();
