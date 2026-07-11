(()=>{function Te(c){let g=c.querySelector(".cb-auth-modal");g.innerHTML=`
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
  `}function dt(c){let g=c.querySelector(".cb-auth-modal");g.innerHTML=`
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
  `}function lt(c){let g=c.permissions||{};return`
    <div
      class="cb-comment-menu"
      data-comment-id="${c.id}"
    >

      ${g.canEdit?`
        <button
          class="cb-menu-item cb-edit-comment"
          data-comment-id="${c.id}"
        >
          Edit
        </button>
      `:""}

      ${g.canDelete?`
        <button
          class="cb-menu-item cb-delete-comment"
          data-comment-id="${c.id}"
        >
          Delete
        </button>
      `:""}

      ${g.canReport?`
        <button
          class="cb-menu-item cb-report-comment"
          data-comment-id="${c.id}"
        >
          Report
        </button>
      `:""}

      <button
        class="cb-menu-item cb-copy-comment-link"
        data-comment-id="${c.id}"
      >
        Copy link
      </button>

    </div>
  `}function bt(c){let g=c.permissions||{};return`
    <div
      class="cb-mod-menu"
      data-comment-id="${c.id}"
    >
      ${g.canPin?`
        <button
          class="cb-menu-item cb-pin-comment"
          data-comment-id="${c.id}"
        >
          ${c.pinned?"Unpin comment":"Pin comment"}
        </button>
      `:""}

      ${g.canLock?`
        <button
          class="cb-menu-item cb-lock-comment"
          data-comment-id="${c.id}"
        >
          ${c.locked?"Unlock comment":"Lock comment"}
        </button>
      `:""}

      ${g.canMuteAuthor?`
        <button
          class="cb-menu-item cb-mute-user"
          data-comment-id="${c.id}"
          data-user-id="${c.author.id}"
        >
          Mute author
        </button>
      `:""}

      ${g.canDelete?`
        <button
          class="cb-menu-item cb-danger-item cb-mod-delete-comment"
          data-comment-id="${c.id}"
        >
          Delete comment
        </button>
      `:""}
    </div>
  `}function Be(c){let g=c.permissions||{};return g.canToggleBoxLock||g.canToggleBox||g.canEmptyBox?`
    <div class="cb-box-mod-actions">
      ${g.canToggleBoxLock?`
        <button
          class="cb-box-mod-action"
          data-box-action="${c.locked?"open":"shut"}"
        >
          ${c.locked?"Open Box":"Shut Box"}
        </button>
      `:""}

      ${g.canToggleBox?`
        <button
          class="cb-box-mod-action cb-danger-item"
          data-box-action="deactivate"
        >
          ${c.active?"Deactivate Box":"Reactivate Box"}
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
  `:""}(function(){let c="http://127.0.0.1:8081",g={HEART:"\u2764\uFE0F",THUMBS_UP:"\u{1F44D}",THUMBS_DOWN:"\u{1F44E}",LAUGH:"\u{1F602}",SURPRISED:"\u{1F62E}",SAD:"\u{1F622}",FIRE:"\u{1F525}"},Ee=["THUMBS_UP","HEART","FIRE","LAUGH","SURPRISED","SAD","THUMBS_DOWN"],x=window.ChatterBoxConfig||{},N=null,F=new Map,Ce=Promise.resolve(),ae=localStorage.getItem("chatterbox_token"),pt=Number(localStorage.getItem("chatterbox_last_active")||0),ut=1e3*60*60*24*7;ae&&Date.now()-pt<ut?(x.token=ae,Ye(ae)&&(Ce=he().then(e=>(e||M(),e)))):M();let S=x.siteId;if(!S){console.error("[ChatterBox] No siteId provided in window.ChatterBoxConfig");return}let Se=x.mountId||"chatterbox-widget",Le=document.getElementById(Se);if(!Le){console.error(`[ChatterBox] No element found with id "${Se}"`);return}let n=Le.attachShadow({mode:"open"}),y=null,m=null,H=0,Me=!1,Q=0,P=[],X=!1,ce=[],C=null,h=null,L=!1,J=null,R=null,k=null,D=null,se=new Map;async function Pe(){let e=window.location.pathname;try{let t={"Content-Type":"application/json"};x.token&&await ee()&&(t.Authorization=`Bearer ${x.token}`);let o=await fetch(`${c}/api/v1/widget/init`,{method:"POST",headers:t,body:JSON.stringify({siteId:S,pageUrl:e})});if(o.status===401&&(M(),o=await fetch(`${c}/api/v1/widget/init`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({siteId:S,pageUrl:e})})),!o.ok)throw new Error(`Init failed: ${o.status}`);let i=await o.json();console.log("init box",i),console.log("box perms",i.permissions),mt(i)}catch(t){l("Failed to initialize comments. Please refresh the page."),console.error("[ChatterBox] Failed to initialize:",t)}}function mt(e){n.innerHTML=`
      <style>${Ct()}</style>
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
          ${Be(e)}
        </div>
        ${e.active?"":`
          <div class="cb-box-status">
            <strong>This discussion is inactive.</strong>
            <span>Log in as a moderator or site owner to reactivate it.</span>
            ${x.token?"":`
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
    `,m=e,y=e.id,queueMicrotask(V),gt(),Me||(ft(),Me=!0),Ue(y)}async function Ue(e){console.log("Loading comments for box: ",e);try{let t=`${c}/api/v1/widget/${e}/comments?page=${Q}&size=20`,o=await fe(),i=await fetch(t,{headers:o});if(i.status===401&&(M(),i=await fetch(t,{headers:{}})),!i.ok)throw new Error(`Failed to load comments: ${i.status}`);let s=await i.json();H=s.totalElements||0;let d=n.getElementById("cb-load-more");d.style.display=s.last?"none":"block",P=Q===0?s.content||[]:[...P,...s.content||[]],He(P,H)}catch(t){l("Failed to load comments. Please try again."),console.error("[ChatterBox] Failed to load comments:",t)}}async function de(){let e=Q,t=[],o=0,i=!1,s=await fe();for(let B=0;B<=e;B++){let T=await fetch(`${c}/api/v1/widget/${y}/comments?page=${B}&size=20`,{headers:s});if(!T.ok)throw new Error(`Failed to refresh comments: ${T.status}`);let A=await T.json();o=A.totalElements||0,i=A.last,t.push(...A.content||[])}P=t;let d=n.getElementById("cb-load-more");d.style.display=i?"none":"block",He(P,o)}function He(e,t){le(t);let o=n.getElementById("cb-comments");if(e.length===0){o.innerHTML='<div class="cb-empty">No comments yet. Be the first!</div>';return}e.forEach(O),o.innerHTML=e.map(Y).join("")}function Y(e){let t=je(e),o=t?Z(e):e.author.displayName||e.author.username,i=t?Oe(e):o.charAt(0).toUpperCase();return`
      <div class="cb-comment ${t?"cb-comment-deleted":""} ${e.replyCount>0?"cb-has-replies":""}"
      data-comment-root-id="${e.id}">
        <div class="cb-avatar ${t?"cb-avatar-deleted":""} ">${i}</div>
        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">${o}</span>
            <span class="cb-timestamp">${Ke(e.createdDate)}</span>
          </div>
          <div class="cb-comment-text">${t?Z(e):v(e.body)}</div>
          ${e.gifUrl?`
            <div class="cb-comment-gif">
                <img
                    src="${v(e.gifPreviewUrl||e.gifUrl)}"
                    alt="${v(e.gifTitle||"GIF")}"
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
              data-reply-to="${v(e.author.displayName||e.author.username)}"
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
              ${qe(e)}
            </div>
            <button
              class="cb-comment-menu-btn"
              data-comment-id="${e.id}"
              aria-expanded="false"
            >
              \u22EF
            </button>
            ${Re(e)?`
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
    `}function le(e=H){H=e;let t=n.querySelector(".cb-title");t&&(t.textContent=`Chatter \xB7 ${H} ${H===1?"comment":"comments"}`)}function Re(e){let t=e.permissions||{};return t.canPin||t.canLock||t.canMuteAuthor||t.canDelete}async function be(e){let t=n.getElementById(`replies-${e}`);if(!t){let d=n.getElementById(`reply-container-${e}`);if(!d)return;d.insertAdjacentHTML("afterend",`
          <div
            class="cb-replies"
            id="replies-${e}"
          ></div>
        `),t=n.getElementById(`replies-${e}`)}if(t.innerHTML='<div class="cb-loading">Loading replies...</div>',F.has(e)){let d=F.get(e);t.innerHTML=d.length?d.map(B=>j(B,e)).join(""):"";return}let s=(await(await fetch(`${c}/api/v1/widget/${y}/comments/${e}`,{headers:{...x.token?{Authorization:`Bearer ${x.token}`}:{}}})).json()).content||[];s.forEach(O),F.set(e,s),t.innerHTML=s.length?s.map(d=>j(d,e)).join(""):""}function j(e,t){let o=je(e),i=o?Z(e):e.author.displayName||e.author.username,s=o?Oe(e):i.charAt(0).toUpperCase();return`
      <div class="cb-comment cb-reply ${o?"cb-comment-deleted":""} ${e.replyCount>0?"cb-has-replies":""}"
      data-comment-root-id="${e.id}">
        <div class="cb-avatar ${o?"cb-avatar-deleted":""}">
          ${s}
        </div>

        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">${v(i)}</span>
            <span class="cb-timestamp">${Ke(e.createdDate)}</span>
          </div>

          <div class="cb-comment-text">
            ${o?Z(e):v(e.body)}
          </div>
          ${e.gifUrl?`
            <div class="cb-comment-gif">
                <img
                    src="${v(e.gifPreviewUrl||e.gifUrl)}"
                    alt="${v(e.gifTitle||"GIF")}"
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
                data-reply-to="${v(i)}"
              >
                Reply
              </button>

              <div class="cb-reactions">
                ${qe(e)}
              </div>

              <button
                class="cb-comment-menu-btn"
                data-comment-id="${e.id}"
                aria-expanded="false"
              >
                \u22EF
              </button>

              ${Re(e)?`
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
    `}function qe(e){let t={};for(let i of e.reactions||[])t[i.reactionType]=i;let o="";for(let i of Ee){let s=t[i],d=s?s.count:0,B=s?s.reacted:!1,T=g[i];o+=`
        <button
          class="cb-reaction-btn ${B?"cb-reaction-active":""}"
          data-comment-id="${e.id}"
          data-reaction-type="${i}"
        >
          ${T}
          ${d>0?`<span>${d}</span>`:""}
        </button>
      `}return o}function Ae(){let e=n.querySelector(".cb-header");n.querySelector(".cb-box-mod-actions")?.remove(),e.insertAdjacentHTML("beforeend",Be(m))}function V(){let e=n.getElementById("cb-input"),t=n.getElementById("cb-submit-btn");if(!e||!t||!m)return;let o=m.locked||!m.active;e.disabled=o,t.disabled=o,e.placeholder=m.active?m.locked?"This discussion is locked.":"Join the chatter...":"This discussion is inactive."}function ft(){n.addEventListener("click",async e=>{if(e.target.closest(".cb-box-login")){Te(n);return}if(e.target.closest("#cb-load-more")){Q+=1,await Ue(y);return}let i=e.target.closest(".cb-tab");if(i){let r=i.dataset.tab;n.querySelectorAll(".cb-tab").forEach(a=>{a.classList.remove("cb-tab-active")}),i.classList.add("cb-tab-active"),n.getElementById("cb-comments-panel").style.display=r==="comments"?"block":"none",n.getElementById("cb-rules-panel").style.display=r==="rules"?"block":"none",r==="rules"&&!X&&(await Ge(),X=!0);return}if(e.target.closest("#cb-gif-btn")){pe("cb-gif-panel","composer");return}let d=e.target.closest(".cb-gif-result");if(d){let r={gifUrl:d.dataset.gifUrl,gifPreviewUrl:d.dataset.gifPreviewUrl,gifProvider:d.dataset.gifProvider,gifProviderId:d.dataset.gifProviderId,gifTitle:d.dataset.gifTitle},a=d.closest(".cb-gif-panel-inline"),b=a?.dataset.mode||"composer";if(b==="edit"){h=r,L=!1,me(R),a&&(a.style.display="none"),n.querySelector(".cb-edit-input")?.focus();return}if(b==="reply"){k=r,ze(D),a&&(a.style.display="none"),n.getElementById(`reply-container-${D}`)?.querySelector(".cb-inline-input")?.focus();return}C=r,ue(),a&&(a.style.display="none"),n.getElementById("cb-input")?.focus();return}e.target.closest("#cb-remove-selected-gif")&&(C=null,ue());let T=e.target.closest(".cb-remove-reply-gif");if(T){let r=T.dataset.commentId;k=null,ze(r);return}let A=e.target.closest(".cb-reply-gif-btn");if(A){let r=A.dataset.commentId;D=r,pe(`cb-reply-gif-panel-${r}`,"reply");return}let We=e.target.closest(".cb-box-mod-action");if(We){if(!await $())return;let r=We.dataset.boxAction;if(r==="empty"&&!confirm("Delete every comment in this discussion?"))return;if(!(await I(`${c}/api/v1/dashboard/moderation/boxes/${y}/${r}`,{method:"PUT"})).ok){l("Failed to update discussion.");return}if(r==="shut"&&(m.locked=!0),r==="open"&&(m.locked=!1),r==="deactivate"&&(m.active=!m.active),r==="empty"){P=[],se.clear(),F.clear(),le(0);let b=n.getElementById("cb-comments");b.innerHTML='<div class="cb-empty">No comments yet. Be the first!</div>';let p=n.getElementById("cb-load-more");p.style.display="none"}n.querySelectorAll(".cb-reply-container").forEach(b=>{b.innerHTML=""}),Ae(),V(),l(`Box updated. Action: ${r=="deactivate"?"activation toggle":r}`);return}let te=e.target.closest(".cb-mod-menu-btn");if(te){n.querySelector(".cb-comment-menu")?.remove();let r=n.querySelector(".cb-mod-menu");if(r){let b=r.dataset.commentId;if(r.remove(),b===te.dataset.commentId)return}let a=q(te.dataset.commentId);if(!a)return;te.insertAdjacentHTML("afterend",bt(a));return}let Qe=e.target.closest(".cb-lock-comment");if(Qe){if(!await $())return;let r=Qe.dataset.commentId;if(!(await I(`${c}/api/v1/dashboard/moderation/${S}/comments/${r}/lock`,{method:"PUT"})).ok){l("Failed to update comment lock.");return}l("Comment updated."),n.querySelector(".cb-mod-menu")?.remove(),await de();return}let Xe=e.target.closest(".cb-pin-comment");if(Xe){if(!await $())return;let r=Xe.dataset.commentId;if(!(await I(`${c}/api/v1/dashboard/moderation/${S}/comments/${r}/pin`,{method:"PUT"})).ok){l("Failed to update pinned comment.");return}l("Comment updated."),n.querySelector(".cb-mod-menu")?.remove(),await de();return}let Ze=e.target.closest(".cb-mod-delete-comment");if(Ze){if(!await $())return;let r=Ze.dataset.commentId;if(!confirm("Delete this comment?"))return;if(!(await I(`${c}/api/v1/widget/${y}/comments/${r}`,{method:"DELETE"})).ok){l("Failed to remove comment.");return}De(r,"REMOVED"),n.querySelector(".cb-mod-menu")?.remove(),l("Comment removed.");return}let et=e.target.closest(".cb-mute-user");if(et){if(!await $())return;let r=et.dataset.userId,a=prompt("Reason for muting this user?")||"";if(!(await I(`${c}/api/v1/dashboard/moderation/${S}/mute/${r}`,{method:"POST",headers:{"Content-Type":"text/plain"},body:a})).ok){l("Failed to mute user.");return}l("User muted."),n.querySelector(".cb-mod-menu")?.remove();return}let K=e.target.closest(".cb-comment-menu-btn");if(K){n.querySelector(".cb-mod-menu")?.remove();let r=n.querySelector(".cb-comment-menu"),a=n.querySelector('.cb-comment-menu-btn[aria-expanded="true"]');if(a&&a.setAttribute("aria-expanded","false"),r&&(r.remove(),a===K))return;K.setAttribute("aria-expanded","true");let b=q(K.dataset.commentId);K.insertAdjacentHTML("afterend",lt(b));return}let tt=e.target.closest(".cb-report-comment");if(tt){if(!await $())return;let r=tt.dataset.commentId;X||(await Ge(),X=!0),It(r),n.querySelector(".cb-comment-menu")?.remove();return}let ot=e.target.closest(".cb-report-submit");if(ot){let r=ot.dataset.commentId,a=n.getElementById("cb-report-reason").value,b=n.getElementById("cb-report-details").value.trim(),u=n.getElementById("cb-report-rule")?.value||null;await I(`${c}/api/v1/widget/${y}/comments/${r}/report`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reason:a,explanation:b,ruleId:u})}),n.querySelector(".cb-report-modal-backdrop")?.remove(),l("Report submitted.");return}if(e.target.closest(".cb-report-close")){n.querySelector(".cb-report-modal-backdrop")?.remove();return}let nt=e.target.closest(".cb-copy-comment-link");if(nt){let r=nt.dataset.commentId,a=`${window.location.href}#comment-${r}`;await navigator.clipboard.writeText(a),l("Comment link copied."),n.querySelector(".cb-comment-menu")?.remove(),n.querySelector('.cb-comment-menu-btn[aria-expanded="true"]')?.setAttribute("aria-expanded","false");return}let ve=e.target.closest(".cb-edit-comment");if(ve){if(!await $())return;let r=ve.dataset.commentId;R=r;let b=ve.closest(".cb-comment").querySelector(".cb-comment-text"),p=q(r);h=null,L=!1,J=p?.gifUrl?{gifUrl:p.gifUrl,gifPreviewUrl:p.gifPreviewUrl,gifProvider:p.gifProvider,gifProviderId:p.gifProviderId,gifTitle:p.gifTitle}:null;let u=p?.body||b.textContent.trim();n.querySelector(".cb-comment-menu")?.remove(),b.innerHTML=`
          <div class="cb-composer cb-edit-composer">
            <textarea class="cb-input cb-edit-input">${v(u)}</textarea>

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
        `,me(r);let f=b.querySelector(".cb-edit-input");f?.focus(),f&&(f.style.height="auto",f.style.height=`${Math.min(f.scrollHeight,160)}px`),f?.addEventListener("input",()=>{f.style.height="auto",f.style.height=`${Math.min(f.scrollHeight,160)}px`}),f?.addEventListener("keydown",E=>{E.key==="Enter"&&!E.shiftKey&&(E.preventDefault(),b.querySelector(".cb-edit-save")?.click())});return}let rt=e.target.closest(".cb-edit-add-gif");if(rt){let r=rt.dataset.commentId;R=r,pe(`cb-edit-gif-panel-${r}`,"edit");return}let it=e.target.closest(".cb-edit-remove-gif");if(it){h=null,L=!0,R=it.dataset.commentId,me(R);return}let z=e.target.closest(".cb-edit-save");if(z){if(!await $())return;let r=z.dataset.commentId,a=z.closest(".cb-comment"),p=a.querySelector(".cb-edit-input").value.trim(),u=q(r);if(!(p.length>0)&&!(L?!!h:!!J||!!h)){l("Comment cannot be empty.");return}z.disabled=!0,z.textContent="Saving...";let _={body:p,...h?{gifUrl:h.gifUrl,gifPreviewUrl:h.gifPreviewUrl,gifProvider:h.gifProvider,gifProviderId:h.gifProviderId,gifTitle:h.gifTitle}:{},...L?{removeGif:!0}:{}};try{if(!(await I(`${c}/api/v1/widget/${y}/comments/${r}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(_)})).ok){l("Edit patch req failed.");return}u&&(u.body=p,L?(u.gifUrl=null,u.gifPreviewUrl=null,u.gifProvider=null,u.gifProviderId=null,u.gifTitle=null):h&&(u.gifUrl=h.gifUrl,u.gifPreviewUrl=h.gifPreviewUrl,u.gifProvider=h.gifProvider,u.gifProviderId=h.gifProviderId,u.gifTitle=h.gifTitle),O(u),h=null,L=!1,J=null,R=null),a.outerHTML=u.parentId?j(u,u.parentId):Y(u),l("Comment updated.")}catch(W){l("Failed to edit comment."),console.error("[ChatterBox] Edit failed:",W)}finally{z.disabled=!1,z.textContent="Save"}return}let ye=e.target.closest(".cb-edit-cancel");if(ye){let r=ye.dataset.commentId,a=ye.closest(".cb-comment"),b=a.querySelector(".cb-comment-text"),p=q(r);h=null,L=!1,J=null,R=null,p&&(a.outerHTML=p.parentId?j(p,p.parentId):Y(p));return}let oe=e.target.closest(".cb-delete-comment");if(oe){if(!await $())return;let r=oe.dataset.commentId;if(!confirm("Delete this comment?"))return;oe.disabled=!0,oe.textContent="Deleting...";try{if(!(await I(`${c}/api/v1/widget/${y}/comments/${r}`,{method:"DELETE"})).ok){l("Failed to delete comment.");return}De(r,"DELETED"),n.querySelector(".cb-comment-menu")?.remove(),l("Comment deleted.")}catch(b){l("Failed to delete comment."),console.error("[ChatterBox] Delete failed:",b)}return}let G=e.target.closest(".cb-reaction-btn");if(G){if(!await $())return;let r=G.dataset.commentId,a=G.dataset.reactionType;G.disabled=!0;try{let b=await I(`${c}/api/v1/widget/comments/${r}/reactions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reactionType:a})});if(!b.ok){l("Reaction request failed.");return}let p=await b.json();wt(G,p);let u=q(r);if(u){let f=u.reactions||[],E=f.find(re=>re.reactionType===p.reactionType);E?(E.count=p.count,E.reacted=p.reacted):f.push(p),u.reactions=f}}catch(b){l("Failed to add reaction. Please try again."),console.error("[ChatterBox] Failed to react:",b)}finally{G.disabled=!1}return}let ne=e.target.closest(".cb-reply-btn");if(ne){if(m?.locked||!m?.active){l(m.active?"This discussion is locked.":"This discussion is inactive.");return}if(!await $())return;let r=ne.dataset.commentId,a=ne.dataset.replyTo,b=ne.dataset.rootCommentId||r,p=n.getElementById(`reply-container-${r}`);if(p.innerHTML.trim()){p.innerHTML="";return}let u=a?`@${a} `:"";D=r,k=null,p.innerHTML=`
          <div class="cb-composer cb-inline-reply">
            <textarea
              class="cb-input cb-inline-input"
              placeholder="Write a reply..."
            >${u}</textarea>

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
                  data-root-comment-id="${b}"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        `,queueMicrotask(()=>{p.querySelector("textarea")?.focus()});return}let at=e.target.closest(".cb-view-replies-btn");if(at){let r=at.dataset.commentId,a=n.getElementById(`replies-${r}`);if(a.innerHTML.trim()){a.innerHTML="";return}await be(r);return}let U=e.target.closest(".cb-inline-submit");if(U){if(m?.locked||!m?.active){l(m.active?"This discussion is locked.":"This discussion is inactive.");return}if(!await $())return;let r=U.dataset.commentId,a=U.dataset.rootCommentId||r,b=U.closest(".cb-inline-reply"),u=b.querySelector("textarea").value.trim();if(!u&&!k)return;U.disabled=!0,U.textContent="Posting...";let f=null,E=n.getElementById(`replies-${a}`);E||(await be(a),E=n.getElementById(`replies-${a}`)),f=kt(a,u,k);let re=Fe(u,a,k);try{console.time("post");let _=await I(`${c}/api/v1/widget/sites/${S}/boxes/${y}/comments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(re)});if(_.status===429){f&&n.getElementById(f)?.remove(),l("You are commenting too quickly. Please slow down.");return}console.timeEnd("post");let W=b.closest(".cb-reply-container"),we=await _.json();f&&n.getElementById(f)?.remove(),O(we);let st=F.get(a)||[];st.push(we),F.set(a,st);let $e=P.find(ie=>ie.id===a);$e&&($e.replyCount=($e.replyCount||0)+1);let ke=n.getElementById(`replies-${a}`);ke||(await be(a),ke=n.getElementById(`replies-${a}`)),ke.insertAdjacentHTML("beforeend",j(we,a));let Ie=n.querySelector(`[data-comment-id="${a}"].cb-view-replies-btn`);if(Ie){let ie=Number(Ie.textContent.match(/\d+/)?.[0]||0)+1;Ie.textContent=`View ${ie} ${ie===1?"reply":"replies"}`}W&&(W.innerHTML=""),k=null,D=null}catch(_){f&&n.getElementById(f)?.remove(),l("Failed to post reply. Please try again."),console.error("[ChatterBox] Reply failed:",_)}finally{U.disabled=!1,U.textContent="Reply"}return}let ct=e.target.closest(".cb-inline-cancel");if(ct){k=null,D=null;let r=ct.closest(".cb-reply-container");r&&(r.innerHTML="")}if(e.target.closest(".cb-auth-close")){n.getElementById("cb-auth-modal")?.remove();return}if(e.target.closest(".cb-auth-login")){Te(n),console.log("[ChatterBox] Login clicked");return}if(e.target.closest(".cb-auth-signup")){dt(n),console.log("[ChatterBox] Sign up clicked");return}if(e.target.closest(".cb-auth-primary-login")){await Ne();return}if(e.target.closest(".cb-auth-primary-signup")){await Et();return}!e.target.closest(".cb-comment-menu")&&!e.target.closest(".cb-comment-menu-btn")&&(n.querySelector(".cb-comment-menu")?.remove(),n.querySelector('.cb-comment-menu-btn[aria-expanded="true"]')?.setAttribute("aria-expanded","false")),!e.target.closest(".cb-mod-menu")&&!e.target.closest(".cb-mod-menu-btn")&&n.querySelector(".cb-mod-menu")?.remove()})}function gt(){let e=n.getElementById("cb-submit-btn"),t=n.getElementById("cb-input");t.addEventListener("input",()=>{t.style.height="auto",t.style.height=`${Math.min(t.scrollHeight,160)}px`}),t.addEventListener("keydown",o=>{o.key==="Enter"&&!o.shiftKey&&(o.preventDefault(),e.click())}),e.addEventListener("click",async()=>{let o=t.value.trim();if(!o&&!C||e.disabled)return;if(m?.locked||!m?.active){l(m.active?"This box is locked.":"This box is inactive."),V();return}if(!await $())return;let i=$t(o,C);e.disabled=!0,e.textContent="Posting...";let s=Fe(o,null,C);try{console.time("post");let d=await I(`${c}/api/v1/widget/sites/${S}/boxes/${y}/comments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(d.status===429){n.getElementById(i)?.remove(),l("You are commenting too quickly. Please slow down.");return}console.timeEnd("post"),t.value="",t.style.height="auto",C=null,ue();let B=n.getElementById("cb-gif-panel");B&&(B.style.display="none"),n.getElementById(i)?.remove();let T=await d.json();O(T),P.unshift(T),le(H+1),n.getElementById("cb-comments").insertAdjacentHTML("afterbegin",Y(T))}catch(d){n.getElementById(i)?.remove(),l("Failed to post comment. Please try again."),console.error("[ChatterBox] Failed to post comment:",d)}finally{e.disabled=!1,e.textContent="Comment",V()}})}function pe(e,t="composer"){let o=n.getElementById(e);if(o){if(o.style.display==="block"){o.style.display="none";return}ht(e,t)}}function ht(e,t="composer"){let o=n.getElementById(e);if(!o)return;o.style.display="block",o.dataset.mode=t,o.innerHTML=`
      <input
        class="cb-gif-search"
        placeholder="Search GIFs..."
      />

      <div class="cb-gif-results"></div>
    `;let i=o.querySelector(".cb-gif-search");i&&(i.autocomplete="off"),i?.addEventListener("input",yt(()=>vt(i),300)),i?.focus()}async function xt(e){let t=await fetch(`${c}/api/v1/widget/gifs/search?q=${encodeURIComponent(e)}`);if(!t.ok)throw new Error(`GIF search failed: ${t.status}`);return await t.json()}async function vt(e){let t=e.value.trim();console.log("[ChatterBox] GIF query:",t);let i=e.closest(".cb-gif-panel-inline")?.querySelector(".cb-gif-results");if(!i){console.error("[ChatterBox] No GIF results element found.");return}if(!t){i.innerHTML="";return}i.innerHTML='<div class="cb-gif-loading">Searching...</div>';try{let s=await xt(t);if(console.log("[ChatterBox] GIF results:",s),!s.length){i.innerHTML='<div class="cb-empty">No GIFs found.</div>';return}i.innerHTML=s.map(d=>`
        <button
          type="button"
          class="cb-gif-result"
          data-gif-url="${w(d.gifUrl)}"
          data-gif-preview-url="${w(d.gifPreviewUrl||d.gifUrl)}"
          data-gif-provider="${w(d.gifProvider)}"
          data-gif-provider-id="${w(d.gifProviderId)}"
          data-gif-title="${w(d.gifTitle||"GIF")}">
          <img src="${w(d.gifPreviewUrl||d.gifUrl)}" />
        </button>
      `).join("")}catch(s){console.error("[ChatterBox] GIF search failed:",s),i.innerHTML='<div class="cb-gif-error">Failed to load GIFs.</div>'}}function yt(e,t){let o;return function(...i){clearTimeout(o),o=setTimeout(()=>{e.apply(this,i)},t)}}function ue(){let e=n.querySelector("#cb-selected-gif-preview");if(e){if(!C){e.innerHTML="";return}e.innerHTML=`
      <div class="cb-selected-gif">
        <img src="${w(C.gifPreviewUrl||C.gifUrl)}"
            alt="${w(C.gifTitle||"Selected GIF")}" />
        <button type="button" id="cb-remove-selected-gif">\xD7</button>
      </div>
    `}}function ze(e){let t=n.getElementById(`cb-reply-gif-preview-${e}`);if(t){if(!k){t.innerHTML="";return}t.innerHTML=`
      <div class="cb-selected-gif">
        <img
          src="${w(k.gifPreviewUrl||k.gifUrl)}"
          alt="${w(k.gifTitle||"Selected GIF")}"
        />
        <button
          type="button"
          class="cb-remove-reply-gif"
          data-comment-id="${e}"
        >
          \xD7
        </button>
      </div>
    `}}function me(e){let t=n.getElementById(`cb-edit-gif-preview-${e}`);if(!t)return;if(L){t.innerHTML="";return}let o=h||J;if(!o){t.innerHTML="";return}t.innerHTML=`
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
    `}function Fe(e,t=null,o=null){return{body:e,...t?{parentId:t}:{},...o?{gifUrl:o.gifUrl,gifPreviewUrl:o.gifPreviewUrl,gifProvider:o.gifProvider,gifProviderId:o.gifProviderId,gifTitle:o.gifTitle}:{}}}function w(e){return v(String(e??""))}function De(e,t){let o=q(e);if(!o)return;o.status=t,o.body=t==="REMOVED"?"[removed]":"[deleted]",o.permissions={},o.reactions=[],o.locked=!0,O(o);let i=n.querySelector(`[data-comment-root-id="${e}"]`);i&&(i.outerHTML=o.parentId?j(o,o.parentId):Y(o))}function je(e){return e.status==="DELETED"||e.status==="REMOVED"}function Z(e){return e.status==="REMOVED"?"[removed]":"[deleted]"}function Oe(e){return e.status==="REMOVED"?"!":"\xD7"}function wt(e,t){e.classList.toggle("cb-reaction-active",t.reacted);let o=e.querySelector("span");t.count>0?o?o.textContent=t.count:e.insertAdjacentHTML("beforeend",`<span>${t.count}</span>`):o?.remove()}function $t(e,t){let o=n.getElementById("cb-comments"),i=`cb-pending-${crypto.randomUUID()}`,s=`
      <div id="${i}" class="cb-comment cb-comment-pending">
        <div class="cb-avatar">Y</div>

        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">You</span>
            <span class="cb-timestamp">just now</span>
          </div>

          <div class="cb-comment-text">
            ${v(e)}
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
    `;return o.insertAdjacentHTML("afterbegin",s),i}function kt(e,t,o){let i=n.getElementById(`replies-${e}`);if(!i)return null;let s=`cb-pending-reply-${crypto.randomUUID()}`;return i.insertAdjacentHTML("beforeend",`
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
              ${v(t)}
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
      `),s}function O(e){se.set(e.id,e)}function q(e){return se.get(e)||null}async function Ge(){let e=n.getElementById("cb-rules-list");e.innerHTML='<div class="cb-loading">Loading rules...</div>';let o=await(await fetch(`${c}/api/v1/dashboard/sites/${S}/rules`)).json();ce=o;let i=n.getElementById("cb-rules-tab");i.textContent=`Rules ${o.length?`(${o.length})`:"0"}`,e.innerHTML=o.length?o.map(s=>`
          <div class="cb-rule">
            <div class="cb-rule-title">${v(s.rule)}</div>
            <div class="cb-rule-description">${v(s.description||"")}</div>
          </div>
        `).join(""):'<div class="cb-empty">No site rules yet.</div>'}async function $(){return!x.token||!await ee()?(_e(),!1):!0}function _e(){if(n.getElementById("cb-auth-modal"))return;let t=document.createElement("div");t.id="cb-auth-modal",t.className="cb-auth-backdrop",t.innerHTML=`
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
    `,n.querySelector(".cb-root").appendChild(t)}function It(e){n.querySelector(".cb-report-modal-backdrop")?.remove();let t=document.createElement("div");t.className="cb-report-modal-backdrop",t.innerHTML=`
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

        ${ce.length?`
          <select class="cb-report-select" id="cb-report-rule">
            <option value="">Select rule violated optional</option>
            ${ce.map(o=>`
              <option value="${o.id}">
                ${v(o.title)}
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
    `,n.querySelector(".cb-root").appendChild(t)}async function Ne(){console.time("TOTAL LOGIN TIME");let e=n.querySelector("#cb-login-username")?.value.trim(),t=n.querySelector("#cb-login-password")?.value.trim();if(!e||!t){l("Please fill in all fields.");return}try{let o=new URLSearchParams({grant_type:"password",client_id:"chatterbox-api",username:e,password:t});console.time("Keycloak req");let i=await fetch("http://127.0.0.1:8080/realms/chatterbox/protocol/openid-connect/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:o});if(console.timeEnd("Keycloak req"),!i.ok){Ve("Invalid username or password.");return}console.time("Parse token");let s=await i.json();console.timeEnd("Parse token"),console.time("Save auth"),Je(s),console.log("token saved?",!!x.token),console.log(xe(x.token)),console.timeEnd("Save auth"),console.time("Refresh after login"),ge(),m?.active?await Tt():await Pe(),console.timeEnd("Refresh after login"),console.timeEnd("TOTAL LOGIN TIME")}catch(o){Ve("Please enter your username and password."),console.error(o)}}async function Tt(){await Bt(),await de()}async function Bt(){if(!(await fe()).Authorization)throw new Error("No auth token available for permission refresh.");let t=await I(`${c}/api/v1/widget/boxes/${y}`);if(!t.ok)throw new Error(`Failed to refresh box state: ${t.status}`);m=await t.json(),y=m.id,Ae(),V()}async function fe(){if(!x.token)return{};try{if(await ee())return{Authorization:`Bearer ${x.token}`}}catch(e){console.warn("[ChatterBox] Token refresh failed, loading anonymously:",e)}return M(),{}}function Je(e){x.token=e.access_token,localStorage.setItem("chatterbox_token",e.access_token),localStorage.setItem("chatterbox_refresh_token",e.refresh_token),localStorage.setItem("chatterbox_last_active",Date.now().toString())}function M(){x.token=null,localStorage.removeItem("chatterbox_token"),localStorage.removeItem("chatterbox_refresh_token"),localStorage.removeItem("chatterbox_last_active")}async function I(e,t={}){if(!await ee())return M(),ge(),new Response(null,{status:401});localStorage.setItem("chatterbox_last_active",Date.now().toString());let i=()=>fetch(e,{...t,headers:{...t.headers||{},Authorization:`Bearer ${x.token}`}}),s=await i();return s.status===401&&(await he()?s=await i():(M(),ge())),s}async function ee(){return await Ce,x.token?Ye(x.token)?await he()&&!!x.token:!0:!1}function ge(){n.getElementById("cb-auth-modal")?.remove(),n.querySelector(".cb-auth-backdrop")?.remove()}async function he(){return N||(N=(async()=>{try{let e=localStorage.getItem("chatterbox_refresh_token");if(!e)return M(),!1;let t=new URLSearchParams({grant_type:"refresh_token",client_id:"chatterbox-api",refresh_token:e}),o=await fetch("http://127.0.0.1:8080/realms/chatterbox/protocol/openid-connect/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:t});if(!o.ok)return M(),!1;let i=await o.json();return Je(i),!0}finally{N=null}})(),N)}function xe(e){try{let o=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"),i=decodeURIComponent(atob(o).split("").map(s=>"%"+("00"+s.charCodeAt(0).toString(16)).slice(-2)).join(""));return JSON.parse(i)}catch{return null}}function Ye(e){let t=xe(e);if(!t?.exp)return!0;let o=t.exp*1e3,i=Date.now(),s=1e3*60*2;return o-i<s}function St(e){let t=xe(e);return t?.exp?t.exp*1e3<=Date.now():!0}async function Et(){let e=n.querySelector("#cb-signup-username")?.value.trim(),t=n.querySelector("#cb-signup-email")?.value.trim(),o=n.querySelector("#cb-signup-password")?.value.trim();if(!e||!t||!o){l("Please fill in all fields.");return}try{await fetch(`${c}/api/v1/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,email:t,password:o})}),await Ne()}catch(i){l("Sign up failed."),console.error(i)}}function Ve(e){let t=n.getElementById("cb-auth-error");if(!t){l(e);return}t.textContent=e,t.style.display="block",clearTimeout(t._timeoutId),t._timeoutId=setTimeout(()=>{t.textContent="",t.style.display="none"},5e3)}function Ke(e){let t=new Date(e),i=Math.floor((new Date-t)/1e3);return i<60?"just now":i<3600?`${Math.floor(i/60)}m ago`:i<86400?`${Math.floor(i/3600)}h ago`:`${Math.floor(i/86400)}d ago`}function v(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function l(e){n.getElementById("cb-error")?.remove();let o=document.createElement("div");o.id="cb-error",o.className="cb-error",o.textContent=e,n.querySelector(".cb-root").appendChild(o),setTimeout(()=>{o.remove()},2500)}function Ct(){return`
      * { box-sizing: border-box; margin: 0; padding: 0; }
      :host { font-family: 'Inter', system-ui, sans-serif; }
      .cb-root { max-width: 720px; color: #e1e1e1; background: #111318; border: 1px solid #23262d; border-radius: 16px; padding: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.4), 0 12px 32px rgba(0,0,0,0.28); }
      .cb-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
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
    `}Pe()})();})();
