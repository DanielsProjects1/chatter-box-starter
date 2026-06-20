(()=>{function Ae(c){let m=c.querySelector(".cb-auth-modal");m.innerHTML=`
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
  `}function ze(c){let m=c.querySelector(".cb-auth-modal");m.innerHTML=`
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
  `}function He(c,m={}){return`
    <div
      class="cb-comment-menu"
      data-comment-id="${c}"
    >

      ${m.canEdit?`
        <button
          class="cb-menu-item cb-edit-comment"
          data-comment-id="${c}"
        >
          Edit
        </button>
      `:""}

      ${m.canDelete?`
        <button
          class="cb-menu-item cb-delete-comment"
          data-comment-id="${c}"
        >
          Delete
        </button>
      `:""}

      ${m.canReport?`
        <button
          class="cb-menu-item cb-report-comment"
          data-comment-id="${c}"
        >
          Report
        </button>
      `:""}

      <button
        class="cb-menu-item cb-copy-comment-link"
        data-comment-id="${c}"
      >
        Copy link
      </button>

    </div>
  `}function qe(c){let m=c.permissions||{};return`
    <div
      class="cb-mod-menu"
      data-comment-id="${c.id}"
    >
      ${m.canPin?`
        <button
          class="cb-menu-item cb-pin-comment"
          data-comment-id="${c.id}"
        >
          ${c.pinned?"Unpin comment":"Pin comment"}
        </button>
      `:""}

      ${m.canLock?`
        <button
          class="cb-menu-item cb-lock-comment"
          data-comment-id="${c.id}"
        >
          ${c.locked?"Unlock comment":"Lock comment"}
        </button>
      `:""}

      ${m.canMuteAuthor?`
        <button
          class="cb-menu-item cb-mute-user"
          data-comment-id="${c.id}"
          data-user-id="${c.author.id}"
        >
          Mute author
        </button>
      `:""}

      ${m.canDelete?`
        <button
          class="cb-menu-item cb-danger-item cb-mod-delete-comment"
          data-comment-id="${c.id}"
        >
          Delete comment
        </button>
      `:""}
    </div>
  `}function ae(c){let m=c.permissions||{};return m.canShutBox||m.canDeactivateBox||m.canEmptyBox?`
    <div class="cb-box-mod-actions">
      ${m.canShutBox?`
        <button
          class="cb-box-mod-action"
          data-box-action="${c.locked?"open":"shut"}"
        >
          ${c.locked?"Open Box":"Shut Box"}
        </button>
      `:""}

      ${m.canDeactivateBox?`
        <button
          class="cb-box-mod-action cb-danger-item"
          data-box-action="deactivate"
        >
          ${c.active?"Deactivate Box":"Reactivate Box"}
        </button>
      `:""}

      ${m.canEmptyBox?`
        <button
          class="cb-box-mod-action cb-danger-item"
          data-box-action="empty"
        >
          Empty Box
        </button>
      `:""}
    </div>
  `:""}(function(){let c="http://127.0.0.1:8081",m={HEART:"\u2764\uFE0F",THUMBS_UP:"\u{1F44D}",THUMBS_DOWN:"\u{1F44E}",LAUGH:"\u{1F602}",SURPRISED:"\u{1F62E}",SAD:"\u{1F622}",FIRE:"\u{1F525}"},ie=["THUMBS_UP","HEART","FIRE","LAUGH","SURPRISED","SAD","THUMBS_DOWN"],h=window.ChatterBoxConfig||{},q=null,T=new Map,ce=Promise.resolve(),Y=localStorage.getItem("chatterbox_token"),Pe=Number(localStorage.getItem("chatterbox_last_active")||0),je=1e3*60*60*24*7;Y&&Date.now()-Pe<je?(h.token=Y,$e(Y)&&(ce=Q().then(e=>(e||A(),e)))):A();let M=h.siteId;if(!M){console.error("[ChatterBox] No siteId provided in window.ChatterBoxConfig");return}let se=h.mountId||"chatterbox-widget",de=document.getElementById(se);if(!de){console.error(`[ChatterBox] No element found with id "${se}"`);return}let n=de.attachShadow({mode:"open"}),w=null,u=null,I=0,le=!1,D=0,y=[],F=!1,G=[],P=new Map;async function _e(){let e=window.location.pathname;try{let o=await(await fetch(`${c}/api/v1/widget/init`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({siteId:M,pageUrl:e})})).json();De(o)}catch(t){d("Failed to initialize comments. Please refresh the page."),console.error("[ChatterBox] Failed to initialize:",t)}}function De(e){n.innerHTML=`
      <style>${We()}</style>
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
          ${ae(e)}
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
    `,u=e,w=e.id,queueMicrotask(O),Oe(),le||(Ue(),le=!0),be(w)}async function be(e){try{let o=await(await fetch(`${c}/api/v1/widget/${e}/comments?page=${D}&size=20`)).json();I=o.totalElements||0;let a=n.getElementById("cb-load-more");a.style.display=o.last?"none":"block",y=D===0?o.content||[]:[...y,...o.content||[]],me(y,o.totalElements||0)}catch(t){d("Failed to load comments. Please try again."),console.error("[ChatterBox] Failed to load comments:",t)}}async function pe(){let e=D,t=[],o=0,a=!1;for(let p=0;p<=e;p++){let k=await(await fetch(`${c}/api/v1/widget/${w}/comments?page=${p}&size=20`)).json();o=k.totalElements||0,a=k.last,t.push(...k.content||[])}y=t;let s=n.getElementById("cb-load-more");s.style.display=a?"none":"block",me(y,o)}function me(e,t){U(t);let o=n.getElementById("cb-comments");if(e.length===0){o.innerHTML='<div class="cb-empty">No comments yet. Be the first!</div>';return}e.forEach(L),o.innerHTML=e.map(ue).join("")}function ue(e){let t=e.author.displayName?e.author.displayName.charAt(0).toUpperCase():"?";return console.log("comment replyCount:",e.id,e.replyCount),`
      <div class="cb-comment ${e.replyCount>0?"cb-has-replies":""}">
        <div class="cb-avatar">${t}</div>
        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">${e.author.displayName||e.author.username}</span>
            <span class="cb-timestamp">${Be(e.createdDate)}</span>
          </div>
          <div class="cb-comment-text">${v(e.body)}</div>
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
              ${ge(e)}
            </div>
            <button
              class="cb-comment-menu-btn"
              data-comment-id="${e.id}"
              aria-expanded="false"
            >
              \u22EF
            </button>
            ${fe(e)?`
              <button
                class="cb-mod-menu-btn"
                data-comment-id="${e.id}"
              >
                Moderate
              </button>
            `:""}
          </div>
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
    `}function U(e=I){I=e;let t=n.querySelector(".cb-title");t&&(t.textContent=`Chatter \xB7 ${I} ${I===1?"comment":"comments"}`)}function fe(e){let t=e.permissions||{};return t.canPin||t.canLock||t.canMuteAuthor||t.canDelete}async function V(e){let t=n.getElementById(`replies-${e}`);if(!t){let p=n.getElementById(`reply-container-${e}`);if(!p)return;p.insertAdjacentHTML("afterend",`
          <div
            class="cb-replies"
            id="replies-${e}"
          ></div>
        `),t=n.getElementById(`replies-${e}`)}if(t.innerHTML='<div class="cb-loading">Loading replies...</div>',T.has(e)){let p=T.get(e);t.innerHTML=p.length?p.map(B=>W(B,e)).join(""):"";return}let s=(await(await fetch(`${c}/api/v1/widget/${w}/comments/${e}`)).json()).content||[];s.forEach(L),T.set(e,s),t.innerHTML=s.length?s.map(p=>W(p,e)).join(""):""}function W(e,t){let o=e.author.displayName?e.author.displayName.charAt(0).toUpperCase():"?",a=e.author.displayName||e.author.username;return`
      <div class="cb-comment cb-reply">
        <div class="cb-avatar">
          ${o}
        </div>

        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">
              ${a}
            </span>
            <span class="cb-timestamp">
              ${Be(e.createdDate)}
            </span>
          </div>

          <div class="cb-comment-text">
            ${v(e.body)}
          </div>

          <div class="cb-comment-actions">
            <button
              class="cb-action-btn cb-reply-btn"
              data-comment-id="${e.id}"
              data-root-comment-id="${t}"
              data-reply-to="${v(a)}"
            >
              Reply
            </button>

            <div class="cb-reactions">
              ${ge(e)}
            </div>
            <button
              class="cb-comment-menu-btn"
              data-comment-id="${e.id}"
              aria-expanded="false"
            >
              \u22EF
            </button>
            ${fe(e)?`
              <button
                class="cb-mod-menu-btn"
                data-comment-id="${e.id}"
              >
                Moderate
              </button>
            `:""}
          </div>

          <div
            class="cb-reply-container"
            id="reply-container-${e.id}"
          ></div>
        </div>
      </div>
    `}function ge(e){let t={};for(let a of e.reactions||[])t[a.reactionType]=a;let o="";for(let a of ie){let s=t[a],p=s?s.count:0,B=s?s.reacted:!1,k=m[a];o+=`
        <button
          class="cb-reaction-btn ${B?"cb-reaction-active":""}"
          data-comment-id="${e.id}"
          data-reaction-type="${a}"
        >
          ${k}
          ${p>0?`<span>${p}</span>`:""}
        </button>
      `}return o}function Fe(){let e=n.querySelector(".cb-header");n.querySelector(".cb-box-mod-actions")?.remove(),e.insertAdjacentHTML("beforeend",ae(u))}function O(){let e=n.getElementById("cb-input"),t=n.getElementById("cb-submit-btn");if(!e||!t||!u)return;let o=u.locked||!u.active;e.disabled=o,t.disabled=o,e.placeholder=u.active?u.locked?"This discussion is locked.":"Join the chatter...":"This discussion is inactive."}function Ue(){n.addEventListener("click",async e=>{if(e.target.closest("#cb-load-more")){D+=1,await be(w);return}let o=e.target.closest(".cb-tab");if(o){let r=o.dataset.tab;n.querySelectorAll(".cb-tab").forEach(i=>{i.classList.remove("cb-tab-active")}),o.classList.add("cb-tab-active"),n.getElementById("cb-comments-panel").style.display=r==="comments"?"block":"none",n.getElementById("cb-rules-panel").style.display=r==="rules"?"block":"none",r==="rules"&&!F&&(await xe(),F=!0);return}let a=e.target.closest(".cb-box-mod-action");if(a){if(!await g())return;let r=a.dataset.boxAction;if(r==="empty"&&!confirm("Delete every comment in this discussion?"))return;if(!(await $(`${c}/api/v1/widget/boxes/${w}/${r}`,{method:"PUT"})).ok){d("Failed to update discussion.");return}if(r==="shut"&&(u.locked=!0),r==="open"&&(u.locked=!1),r==="deactivate"&&(u.active=!u.active),r==="empty"){y=[],P.clear(),T.clear(),U(0);let l=n.getElementById("cb-comments");l.innerHTML='<div class="cb-empty">No comments yet. Be the first!</div>';let b=n.getElementById("cb-load-more");b.style.display="none"}n.querySelectorAll(".cb-reply-container").forEach(l=>{l.innerHTML=""}),Fe(),O(),d(`Box updated. Action: ${r}`);return}let s=e.target.closest(".cb-mod-menu-btn");if(s){let r=n.querySelector(".cb-mod-menu");if(r){let l=r.dataset.commentId;if(r.remove(),l===s.dataset.commentId)return}let i=R(s.dataset.commentId);if(!i)return;s.insertAdjacentHTML("afterend",qe(i));return}let p=e.target.closest(".cb-lock-comment");if(p){if(!await g())return;let r=p.dataset.commentId;if(!(await $(`${c}/api/v1/dashboard/moderation/${M}/comments/${r}/lock`,{method:"PUT"})).ok){d("Failed to update comment lock.");return}d("Comment updated."),n.querySelector(".cb-mod-menu")?.remove(),await pe();return}let B=e.target.closest(".cb-pin-comment");if(B){if(!await g())return;let r=B.dataset.commentId;if(!(await $(`${c}/api/v1/dashboard/moderation/${M}/comments/${r}/pin`,{method:"PUT"})).ok){d("Failed to update pinned comment.");return}d("Comment updated."),n.querySelector(".cb-mod-menu")?.remove(),await pe();return}let k=e.target.closest(".cb-mod-delete-comment");if(k){if(!await g())return;let r=k.dataset.commentId;if(!confirm("Delete this comment?"))return;if(!(await $(`${c}/api/v1/widget/${w}/comments/${r}`,{method:"DELETE"})).ok){d("Failed to delete comment.");return}P.delete(r),y=y.filter(l=>l.id!==r),U(Math.max(I-1,0)),k.closest(".cb-comment")?.remove(),d("Comment deleted."),n.querySelector(".cb-mod-menu")?.remove();return}let Ce=e.target.closest(".cb-mute-user");if(Ce){if(!await g())return;let r=Ce.dataset.userId,i=prompt("Reason for muting this user?")||"";if(!(await $(`${c}/api/v1/dashboard/moderation/${M}/mute/${r}`,{method:"POST",headers:{"Content-Type":"text/plain"},body:i})).ok){d("Failed to mute user.");return}d("User muted."),n.querySelector(".cb-mod-menu")?.remove();return}let z=e.target.closest(".cb-comment-menu-btn");if(z){let r=n.querySelector(".cb-comment-menu"),i=n.querySelector('.cb-comment-menu-btn[aria-expanded="true"]');if(i&&i.setAttribute("aria-expanded","false"),r&&(r.remove(),i===z))return;z.setAttribute("aria-expanded","true");let l=R(z.dataset.commentId);z.insertAdjacentHTML("afterend",He(z.dataset.commentId,l?.permissions||{}));return}let Se=e.target.closest(".cb-report-comment");if(Se){if(!await g())return;let r=Se.dataset.commentId;F||(await xe(),F=!0),Ge(r),n.querySelector(".cb-comment-menu")?.remove();return}let Ie=e.target.closest(".cb-report-submit");if(Ie){let r=Ie.dataset.commentId,i=n.getElementById("cb-report-reason").value,l=n.getElementById("cb-report-details").value.trim(),f=n.getElementById("cb-report-rule")?.value||null;await $(`${c}/api/v1/widget/${w}/comments/${r}/report`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reason:i,explanation:l,ruleId:f})}),n.querySelector(".cb-report-modal-backdrop")?.remove(),d("Report submitted.");return}if(e.target.closest(".cb-report-close")){n.querySelector(".cb-report-modal-backdrop")?.remove();return}let Ee=e.target.closest(".cb-copy-comment-link");if(Ee){let r=Ee.dataset.commentId,i=`${window.location.href}#comment-${r}`;await navigator.clipboard.writeText(i),d("Comment link copied."),n.querySelector(".cb-comment-menu")?.remove(),n.querySelector('.cb-comment-menu-btn[aria-expanded="true"]')?.setAttribute("aria-expanded","false");return}let Z=e.target.closest(".cb-edit-comment");if(Z){if(!await g())return;let r=Z.dataset.commentId,l=Z.closest(".cb-comment").querySelector(".cb-comment-text"),f=R(r)?.body||l.textContent.trim();n.querySelector(".cb-comment-menu")?.remove(),l.innerHTML=`
          <div class="cb-edit-box">
            <textarea class="cb-edit-input">${v(f)}</textarea>

            <div class="cb-inline-actions">
              <button
                class="cb-edit-cancel"
                data-comment-id="${r}"
              >
                Cancel
              </button>

              <button
                class="cb-edit-save"
                data-comment-id="${r}"
              >
                Save
              </button>
            </div>
          </div>
        `,l.querySelector(".cb-edit-input")?.focus();return}let E=e.target.closest(".cb-edit-save");if(E){if(!await g())return;let r=E.dataset.commentId,i=E.closest(".cb-comment"),b=i.querySelector(".cb-edit-input").value.trim();if(!b){d("Comment cannot be empty.");return}E.disabled=!0,E.textContent="Saving...";try{if(!(await $(`${c}/api/v1/widget/comments/${r}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({body:b})})).ok){d("Failed to edit comment.");return}let x=R(r);x&&(x.body=b,L(x));let S=i.querySelector(".cb-comment-text");S.innerHTML=v(b),d("Comment updated.")}catch(f){d("Failed to edit comment."),console.error("[ChatterBox] Edit failed:",f)}finally{E.disabled=!1,E.textContent="Save"}return}let ee=e.target.closest(".cb-edit-cancel");if(ee){let r=ee.dataset.commentId,l=ee.closest(".cb-comment").querySelector(".cb-comment-text"),b=R(r);b&&(l.innerHTML=v(b.body));return}let j=e.target.closest(".cb-delete-comment");if(j){if(!await g())return;let r=j.dataset.commentId;if(!confirm("Delete this comment?"))return;j.disabled=!0,j.textContent="Deleting...";try{if(!(await $(`${c}/api/v1/widget/${w}/comments/${r}`,{method:"DELETE"})).ok){d("Failed to delete comment.");return}j.closest(".cb-comment")?.remove(),P.delete(r),y=y.filter(f=>f.id!==r),n.querySelector(".cb-comment-menu")?.remove(),d("Comment deleted.")}catch(l){d("Failed to delete comment."),console.error("[ChatterBox] Delete failed:",l)}return}let H=e.target.closest(".cb-reaction-btn");if(H){if(!await g())return;let r=H.dataset.commentId,i=H.dataset.reactionType;H.disabled=!0;try{let l=await $(`${c}/api/v1/widget/comments/${r}/reactions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reactionType:i})});if(!l.ok){d("Failed to add reaction. Please try again.");return}let b=await l.json();Ne(H,b);let f=R(r);if(f){let x=f.reactions||[],S=x.find(_=>_.reactionType===b.reactionType);S?(S.count=b.count,S.reacted=b.reacted):x.push(b),f.reactions=x,L(f)}}catch(l){d("Failed to add reaction. Please try again."),console.error("[ChatterBox] Failed to react:",l)}finally{H.disabled=!1}return}let N=e.target.closest(".cb-reply-btn");if(N){if(u?.locked||!u?.active){d(u.active?"This discussion is locked.":"This discussion is inactive.");return}if(!await g())return;let r=N.dataset.commentId,i=N.dataset.replyTo,l=N.dataset.rootCommentId||r,b=n.getElementById(`reply-container-${r}`);if(b.innerHTML.trim()){b.innerHTML="";return}let f=i?`@${i} `:"";b.innerHTML=`
          <div class="cb-inline-reply">

            <textarea
              class="cb-inline-input"
              placeholder="Write a reply..."
            >${f}</textarea>

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
        `,queueMicrotask(()=>{b.querySelector("textarea")?.focus()});return}let Te=e.target.closest(".cb-view-replies-btn");if(Te){let r=Te.dataset.commentId,i=n.getElementById(`replies-${r}`);if(i.innerHTML.trim()){i.innerHTML="";return}await V(r);return}let C=e.target.closest(".cb-inline-submit");if(C){if(u?.locked||!u?.active){d(u.active?"This discussion is locked.":"This discussion is inactive.");return}if(!await g())return;let r=C.dataset.commentId,i=C.dataset.rootCommentId||r,l=C.closest(".cb-inline-reply"),f=l.querySelector("textarea").value.trim();if(!f)return;C.disabled=!0,C.textContent="Posting...";let x=null,S=n.getElementById(`replies-${i}`);S||(await V(i),S=n.getElementById(`replies-${i}`)),x=Ye(i,f);try{console.time("post");let _=await $(`${c}/api/v1/widget/${w}/comments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({body:f,parentId:i})});console.timeEnd("post");let Le=l.closest(".cb-reply-container"),te=await _.json();x&&n.getElementById(x)?.remove(),L(te);let Re=T.get(i)||[];Re.push(te),T.set(i,Re);let oe=y.find(J=>J.id===i);oe&&(oe.replyCount=(oe.replyCount||0)+1);let ne=n.getElementById(`replies-${i}`);ne||(await V(i),ne=n.getElementById(`replies-${i}`)),ne.insertAdjacentHTML("beforeend",W(te,i));let re=n.querySelector(`[data-comment-id="${i}"].cb-view-replies-btn`);if(re){let J=Number(re.textContent.match(/\d+/)?.[0]||0)+1;re.textContent=`View ${J} ${J===1?"reply":"replies"}`}Le&&(Le.innerHTML="")}catch(_){x&&n.getElementById(x)?.remove(),d("Failed to post reply. Please try again."),console.error("[ChatterBox] Reply failed:",_)}finally{C.disabled=!1,C.textContent="Reply"}return}let Me=e.target.closest(".cb-inline-cancel");if(Me){let r=Me.closest(".cb-reply-container");r&&(r.innerHTML="")}if(e.target.closest(".cb-auth-close")){n.getElementById("cb-auth-modal")?.remove();return}if(e.target.closest(".cb-auth-login")){Ae(n),console.log("[ChatterBox] Login clicked");return}if(e.target.closest(".cb-auth-signup")){ze(n),console.log("[ChatterBox] Sign up clicked");return}if(e.target.closest(".cb-auth-primary-login")){await ye();return}if(e.target.closest(".cb-auth-primary-signup")){await Ve();return}!e.target.closest(".cb-comment-menu")&&!e.target.closest(".cb-comment-menu-btn")&&(n.querySelector(".cb-comment-menu")?.remove(),n.querySelector('.cb-comment-menu-btn[aria-expanded="true"]')?.setAttribute("aria-expanded","false")),!e.target.closest(".cb-mod-menu")&&!e.target.closest(".cb-mod-menu-btn")&&n.querySelector(".cb-mod-menu")?.remove()})}function Oe(){let e=n.getElementById("cb-submit-btn"),t=n.getElementById("cb-input");t.addEventListener("input",()=>{t.style.height="auto",t.style.height=`${Math.min(t.scrollHeight,160)}px`}),t.addEventListener("keydown",o=>{o.key==="Enter"&&!o.shiftKey&&(o.preventDefault(),e.click())}),e.addEventListener("click",async()=>{let o=t.value.trim();if(!o||e.disabled)return;if(u?.locked||!u?.active){d(u.active?"This discussion is locked.":"This discussion is inactive."),O();return}if(!await g())return;let a=Je(o);e.disabled=!0,e.textContent="Posting...";try{console.time("post");let s=await $(`${c}/api/v1/widget/${w}/comments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({body:o})});console.timeEnd("post"),t.value="",n.getElementById(a)?.remove();let p=await s.json();L(p),y.unshift(p),U(I+1),n.getElementById("cb-comments").insertAdjacentHTML("afterbegin",ue(p))}catch(s){n.getElementById(a)?.remove(),d("Failed to post comment. Please try again."),console.error("[ChatterBox] Failed to post comment:",s)}finally{e.disabled=!1,e.textContent="Comment",O()}})}function Ne(e,t){e.classList.toggle("cb-reaction-active",t.reacted);let o=e.querySelector("span");t.count>0?o?o.textContent=t.count:e.insertAdjacentHTML("beforeend",`<span>${t.count}</span>`):o?.remove()}function Je(e){let t=n.getElementById("cb-comments"),o=`cb-pending-${crypto.randomUUID()}`,a=`
      <div id="${o}" class="cb-comment cb-comment-pending">
        <div class="cb-avatar">Y</div>

        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">You</span>
            <span class="cb-timestamp">just now</span>
          </div>

          <div class="cb-comment-text">
            ${v(e)}
          </div>
        </div>
      </div>
    `;return t.insertAdjacentHTML("afterbegin",a),o}function Ye(e,t){let o=n.getElementById(`replies-${e}`);if(!o)return null;let a=`cb-pending-reply-${crypto.randomUUID()}`;return o.insertAdjacentHTML("beforeend",`
        <div
          id="${a}"
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
          </div>
        </div>
      `),a}function L(e){P.set(e.id,e)}function R(e){return P.get(e)||null}async function xe(){let e=n.getElementById("cb-rules-list");e.innerHTML='<div class="cb-loading">Loading rules...</div>';let o=await(await fetch(`${c}/api/v1/dashboard/sites/${M}/rules`)).json();G=o;let a=n.getElementById("cb-rules-tab");a.textContent=`Rules ${o.length?`(${o.length})`:"0"}`,e.innerHTML=o.length?o.map(s=>`
          <div class="cb-rule">
            <div class="cb-rule-title">${v(s.rule)}</div>
            <div class="cb-rule-description">${v(s.description||"")}</div>
          </div>
        `).join(""):'<div class="cb-empty">No site rules yet.</div>'}async function g(){return!h.token||!await we()?(he(),!1):!0}function he(){if(n.getElementById("cb-auth-modal"))return;let t=document.createElement("div");t.id="cb-auth-modal",t.className="cb-auth-backdrop",t.innerHTML=`
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
    `,n.querySelector(".cb-root").appendChild(t)}function Ge(e){n.querySelector(".cb-report-modal-backdrop")?.remove();let t=document.createElement("div");t.className="cb-report-modal-backdrop",t.innerHTML=`
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

        ${G.length?`
          <select class="cb-report-select" id="cb-report-rule">
            <option value="">Select rule violated optional</option>
            ${G.map(o=>`
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
    `,n.querySelector(".cb-root").appendChild(t)}async function ye(){let e=n.querySelector("#cb-login-username")?.value.trim(),t=n.querySelector("#cb-login-password")?.value.trim();if(!e||!t){d("Please fill in all fields.");return}try{let o=new URLSearchParams({grant_type:"password",client_id:"chatterbox-api",username:e,password:t});console.time("login");let a=await fetch("http://127.0.0.1:8080/realms/chatterbox/protocol/openid-connect/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:o});if(console.timeEnd("login"),!a.ok){ke("Invalid username or password.");return}let s=await a.json();h.token=s.access_token,ve(s),console.log(X(h.token)),K()}catch(o){ke("Please enter your username and password."),console.error(o)}}function ve(e){h.token=e.access_token,localStorage.setItem("chatterbox_token",e.access_token),localStorage.setItem("chatterbox_refresh_token",e.refresh_token),localStorage.setItem("chatterbox_last_active",Date.now().toString())}function A(){h.token=null,localStorage.removeItem("chatterbox_token"),localStorage.removeItem("chatterbox_refresh_token"),localStorage.removeItem("chatterbox_last_active")}async function $(e,t={}){if(!await we())return A(),K(),new Response(null,{status:401});localStorage.setItem("chatterbox_last_active",Date.now().toString());let a=()=>fetch(e,{...t,headers:{...t.headers||{},Authorization:`Bearer ${h.token}`}}),s=await a();return s.status===401&&(await Q()?s=await a():(A(),K())),s}async function we(){return await ce,h.token?$e(h.token)?await Q()&&!!h.token:!0:!1}function K(){n.getElementById("cb-auth-modal")?.remove(),n.querySelector(".cb-auth-backdrop")?.remove()}async function Q(){return q||(q=(async()=>{try{let e=localStorage.getItem("chatterbox_refresh_token");if(!e)return A(),!1;let t=new URLSearchParams({grant_type:"refresh_token",client_id:"chatterbox-api",refresh_token:e}),o=await fetch("http://127.0.0.1:8080/realms/chatterbox/protocol/openid-connect/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:t});if(!o.ok)return A(),!1;let a=await o.json();return ve(a),!0}finally{q=null}})(),q)}function X(e){try{let o=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"),a=decodeURIComponent(atob(o).split("").map(s=>"%"+("00"+s.charCodeAt(0).toString(16)).slice(-2)).join(""));return JSON.parse(a)}catch{return null}}function $e(e){let t=X(e);if(!t?.exp)return!0;let o=t.exp*1e3,a=Date.now(),s=1e3*60*2;return o-a<s}function Ke(e){let t=X(e);return t?.exp?t.exp*1e3<=Date.now():!0}async function Ve(){let e=n.querySelector("#cb-signup-username")?.value.trim(),t=n.querySelector("#cb-signup-email")?.value.trim(),o=n.querySelector("#cb-signup-password")?.value.trim();if(!e||!t||!o){d("Please fill in all fields.");return}try{await fetch(`${c}/api/v1/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,email:t,password:o})}),await ye()}catch(a){d("Sign up failed."),console.error(a)}}function ke(e){let t=n.getElementById("cb-auth-error");if(!t){d(e);return}t.textContent=e,t.style.display="block",clearTimeout(t._timeoutId),t._timeoutId=setTimeout(()=>{t.textContent="",t.style.display="none"},5e3)}function Be(e){let t=new Date(e),a=Math.floor((new Date-t)/1e3);return a<60?"just now":a<3600?`${Math.floor(a/60)}m ago`:a<86400?`${Math.floor(a/3600)}h ago`:`${Math.floor(a/86400)}d ago`}function v(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function d(e){n.getElementById("cb-error")?.remove();let o=document.createElement("div");o.id="cb-error",o.className="cb-error",o.textContent=e,n.querySelector(".cb-root").appendChild(o),setTimeout(()=>{o.remove()},2500)}function We(){return`
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
      .cb-box-mod-action { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); color: #cbd5e1; border-radius: 8px; padding: 6px 9px; font-size: 12px; cursor: pointer; } 
      .cb-danger-item { color: #fecaca; }
    `}_e()})();})();
