(()=>{function st(c){let u=c.querySelector(".cb-auth-modal");u.innerHTML=`
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
  `}function lt(c){let u=c.querySelector(".cb-auth-modal");u.innerHTML=`
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
  `}function dt(c,u={}){return`
    <div
      class="cb-comment-menu"
      data-comment-id="${c}"
    >
      <button
        class="cb-menu-item cb-report-comment"
        data-comment-id="${c}"
      >
        Report
      </button>

      <button
        class="cb-menu-item cb-copy-comment-link"
        data-comment-id="${c}"
      >
        Copy link
      </button>

      ${u.canDelete?`
        <button
          class="cb-menu-item cb-delete-comment"
          data-comment-id="${c}"
        >
          Delete
        </button>
      `:""}

      ${u.canLock?`
        <button
          class="cb-menu-item cb-lock-comment"
          data-comment-id="${c}"
        >
          Lock Comment
        </button>
      `:""}

      ${u.canMute?`
        <button
          class="cb-menu-item cb-mute-user"
          data-comment-id="${c}"
        >
          Mute User
        </button>
      `:""}

      ${u.canPin?`
        <button
          class="cb-menu-item cb-pin-comment"
          data-comment-id="${c}"
        >
          Pin Comment
        </button>
      `:""}
    </div>
  `}(function(){let c="http://127.0.0.1:8081",u=["\u{1F44D}","\u2764\uFE0F","\u{1F525}","\u{1F602}"],l=window.ChatterBoxConfig||{},$=null,C=new Map,D=Promise.resolve(),z=localStorage.getItem("chatterbox_token"),pt=Number(localStorage.getItem("chatterbox_last_active")||0),bt=1e3*60*60*24*7;z&&Date.now()-pt<bt?(l.token=z,P(z)&&(D=et().then(t=>(t||B(),t)))):B();let j=l.siteId;if(!j){console.error("[ChatterBox] No siteId provided in window.ChatterBoxConfig");return}let U=l.mountId||"chatterbox-widget",J=document.getElementById(U);if(!J){console.error(`[ChatterBox] No element found with id "${U}"`);return}let n=J.attachShadow({mode:"open"}),f=null,T=0,h=[],E=!1,$t=[];async function ut(){let t=window.location.pathname;try{let o=await(await fetch(`${c}/api/v1/widget/init`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({siteId:j,pageUrl:t})})).json();mt(o)}catch(e){b("Failed to initialize comments. Please refresh the page."),console.error("[ChatterBox] Failed to initialize:",e)}}function mt(t){n.innerHTML=`
      <style>${wt()}</style>
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
    `,f=t.id,ft(),gt(),Y(f)}async function Y(t){try{let o=await(await fetch(`${c}/api/v1/widget/${t}/comments?page=${T}&size=20`)).json(),r=n.getElementById("cb-load-more");r.style.display=o.last?"none":"block",h=T===0?o.content||[]:[...h,...o.content||[]],V(h,o.totalElements||0)}catch(e){b("Failed to load comments. Please try again."),console.error("[ChatterBox] Failed to load comments:",e)}}async function Ct(){let t=T,e=[],o=0,r=!1;for(let d=0;d<=t;d++){let y=await(await fetch(`${c}/api/v1/widget/${f}/comments?page=${d}&size=20`)).json();o=y.totalElements||0,r=y.last,e.push(...y.content||[])}h=e;let s=n.getElementById("cb-load-more");s.style.display=r?"none":"block",V(h,o)}function V(t,e){let o=n.querySelector(".cb-title");o.textContent=`Chatter \xB7 ${e} ${e===1?"comment":"comments"}`;let r=n.getElementById("cb-comments");if(t.length===0){r.innerHTML='<div class="cb-empty">No comments yet. Be the first!</div>';return}r.innerHTML=t.map(G).join("")}function G(t){let e=t.author.displayName?t.author.displayName.charAt(0).toUpperCase():"?";return console.log("comment replyCount:",t.id,t.replyCount),`
      <div class="cb-comment ${t.replyCount>0?"cb-has-replies":""}">
        <div class="cb-avatar">${e}</div>
        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">${t.author.displayName||t.author.username}</span>
            <span class="cb-timestamp">${nt(t.createdDate)}</span>
          </div>
          <div class="cb-comment-text">${x(t.body)}</div>
          <div class="cb-comment-actions">
            <button
              class="cb-action-btn cb-reply-btn"
              data-comment-id="${t.id}"
              data-root-comment-id="${t.id}"
              data-reply-to="${x(t.author.displayName||t.author.username)}"
            >
              Reply
            </button>
            ${t.replyCount>0?`
              <button
                class="cb-action-btn cb-view-replies-btn"
                data-comment-id="${t.id}"
              >
                View ${t.replyCount} ${t.replyCount===1?"reply":"replies"}
              </button>
            `:""}
            <div class="cb-reactions">
              ${K(t)}
            </div>
            <button
              class="cb-comment-menu-btn"
              data-comment-id="${t.id}"
              aria-expanded="false"
            >
              \u22EF
            </button>
          </div>
          <div
            class="cb-reply-container"
            id="reply-container-${t.id}"
          ></div>
        </div>
          ${t.replyCount>0?`
            <div
              class="cb-replies"
              id="replies-${t.id}"
            ></div>
          `:""}
        
      </div>
    `}async function W(t){let e=n.getElementById(`replies-${t}`);if(!e){let g=n.getElementById(`reply-container-${t}`);if(!g)return;g.insertAdjacentHTML("afterend",`
          <div
            class="cb-replies"
            id="replies-${t}"
          ></div>
        `),e=n.getElementById(`replies-${t}`)}if(e.innerHTML='<div class="cb-loading">Loading replies...</div>',C.has(t)){e.innerHTML=C.get(t);return}let s=(await(await fetch(`${c}/api/v1/widget/${f}/comments/${t}`)).json()).content||[],d=s.length?s.map(g=>H(g,t)).join(""):"";C.set(t,d),e.innerHTML=d}function H(t,e){let o=t.author.displayName?t.author.displayName.charAt(0).toUpperCase():"?",r=t.author.displayName||t.author.username;return`
      <div class="cb-comment cb-reply">
        <div class="cb-avatar">
          ${o}
        </div>

        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">
              ${r}
            </span>
            <span class="cb-timestamp">
              ${nt(t.createdDate)}
            </span>
          </div>

          <div class="cb-comment-text">
            ${x(t.body)}
          </div>

          <div class="cb-comment-actions">
            <button
              class="cb-action-btn cb-reply-btn"
              data-comment-id="${t.id}"
              data-root-comment-id="${e}"
              data-reply-to="${x(r)}"
            >
              Reply
            </button>

            <div class="cb-reactions">
              ${K(t)}
            </div>
            <button
              class="cb-comment-menu-btn"
              data-comment-id="${t.id}"
              aria-expanded="false"
            >
              \u22EF
            </button>
          </div>

          <div
            class="cb-reply-container"
            id="reply-container-${t.id}"
          ></div>
        </div>
      </div>
    `}function K(t){let e={};return(t.reactions||[]).forEach(o=>{e[o.emoji]=o.count}),u.map(o=>{let r=e[o]||0;return`
        <button
          class="cb-reaction-btn"
          data-comment-id="${t.id}"
          data-emoji="${o}"
        >
          ${o}
          ${r>0?`<span>${r}</span>`:""}
        </button>
      `}).join("")}function gt(){n.addEventListener("click",async t=>{if(t.target.closest("#cb-load-more")){T+=1,await Y(f);return}let o=t.target.closest(".cb-tab");if(o){let i=o.dataset.tab;n.querySelectorAll(".cb-tab").forEach(a=>{a.classList.remove("cb-tab-active")}),o.classList.add("cb-tab-active"),n.getElementById("cb-comments-panel").style.display=i==="comments"?"block":"none",n.getElementById("cb-rules-panel").style.display=i==="rules"?"block":"none",i==="rules"&&!E&&(await Q(),E=!0);return}let r=t.target.closest(".cb-comment-menu-btn");if(r){let i=n.querySelector(".cb-comment-menu"),a=n.querySelector('.cb-comment-menu-btn[aria-expanded="true"]');if(a&&a.setAttribute("aria-expanded","false"),i&&(i.remove(),a===r))return;r.setAttribute("aria-expanded","true"),r.insertAdjacentHTML("afterend",dt(r.dataset.commentId));return}let s=t.target.closest(".cb-report-comment");if(s){if(!await S())return;let i=s.dataset.commentId;E||(await Q(),E=!0),xt(i),n.querySelector(".cb-comment-menu")?.remove();return}let d=t.target.closest(".cb-report-submit");if(d){let i=d.dataset.commentId,a=n.getElementById("cb-report-reason").value,p=n.getElementById("cb-report-details").value.trim(),k=n.getElementById("cb-report-rule")?.value||null;await L(`${c}/api/v1/widget/${f}/comments/${i}/report`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reason:a,explanation:p,ruleId:k})}),n.querySelector(".cb-report-modal-backdrop")?.remove(),b("Report submitted.");return}if(t.target.closest(".cb-report-close")){n.querySelector(".cb-report-modal-backdrop")?.remove();return}let y=t.target.closest(".cb-copy-comment-link");if(y){let i=y.dataset.commentId,a=`${window.location.href}#comment-${i}`;await navigator.clipboard.writeText(a),b("Comment link copied."),n.querySelector(".cb-comment-menu")?.remove(),n.querySelector('.cb-comment-menu-btn[aria-expanded="true"]')?.setAttribute("aria-expanded","false");return}let m=t.target.closest(".cb-reaction-btn");if(m){if(!await S())return;let i=m.dataset.commentId,a=m.dataset.emoji;m.disabled=!0;try{await L(`${c}/api/v1/widget/comments/${i}/reactions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({emoji:a})});let p=m.querySelector("span");p?p.textContent=Number(p.textContent)+1:m.insertAdjacentHTML("beforeend","<span>1</span>")}catch(p){m.disabled=!1,b("Failed to add reaction. Please try again."),console.error("[ChatterBox] Failed to react:",p)}return}let I=t.target.closest(".cb-reply-btn");if(I){if(!await S())return;let i=I.dataset.commentId,a=I.dataset.replyTo,p=I.dataset.rootCommentId||i,w=n.getElementById(`reply-container-${i}`);if(w.innerHTML.trim()){w.innerHTML="";return}let k=a?`@${a} `:"";w.innerHTML=`
          <div class="cb-inline-reply">

            <textarea
              class="cb-inline-input"
              placeholder="Write a reply..."
            >${k}</textarea>

            <div class="cb-inline-actions">

              <button class="cb-inline-cancel">
                Cancel
              </button>

              <button
                class="cb-inline-submit"
                data-comment-id="${i}"
                data-root-comment-id="${p}"
              >
                Reply
              </button>

            </div>

          </div>
        `,queueMicrotask(()=>{w.querySelector("textarea")?.focus()});return}let rt=t.target.closest(".cb-view-replies-btn");if(rt){let i=rt.dataset.commentId,a=n.getElementById(`replies-${i}`);if(a.innerHTML.trim()){a.innerHTML="";return}await W(i);return}let v=t.target.closest(".cb-inline-submit");if(v){if(!await S())return;let i=v.dataset.commentId,a=v.dataset.rootCommentId||i,p=v.closest(".cb-inline-reply"),k=p.querySelector("textarea").value.trim();if(!k)return;v.disabled=!0,v.textContent="Posting...";try{console.time("post");let q=await L(`${c}/api/v1/widget/${f}/comments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({body:k,parentId:a})});console.timeEnd("post");let it=p.closest(".cb-reply-container"),ct=await q.json(),F=h.find(M=>M.id===a);F&&(F.replyCount=(F.replyCount||0)+1);let N=n.getElementById(`replies-${a}`);N||(await W(a),N=n.getElementById(`replies-${a}`)),N.insertAdjacentHTML("beforeend",H(ct,a));let O=n.querySelector(`[data-comment-id="${a}"].cb-view-replies-btn`);if(O){let M=Number(O.textContent.match(/\d+/)?.[0]||0)+1;O.textContent=`View ${M} ${M===1?"reply":"replies"}`}let kt=(C.get(a)||"")+H(ct,a);C.set(a,kt),it&&(it.innerHTML="")}catch(q){b("Failed to post reply. Please try again."),console.error("[ChatterBox] Reply failed:",q)}finally{v.disabled=!1,v.textContent="Reply"}return}let at=t.target.closest(".cb-inline-cancel");if(at){let i=at.closest(".cb-reply-container");i&&(i.innerHTML="")}if(t.target.closest(".cb-auth-close")){n.getElementById("cb-auth-modal")?.remove();return}if(t.target.closest(".cb-auth-login")){st(n),console.log("[ChatterBox] Login clicked");return}if(t.target.closest(".cb-auth-signup")){lt(n),console.log("[ChatterBox] Sign up clicked");return}if(t.target.closest(".cb-auth-primary-login")){await X();return}if(t.target.closest(".cb-auth-primary-signup")){await vt();return}t.target.closest(".cb-comment-menu")||(n.querySelector(".cb-comment-menu")?.remove(),n.querySelector('.cb-comment-menu-btn[aria-expanded="true"]')?.setAttribute("aria-expanded","false"))})}function ft(){let t=n.getElementById("cb-submit-btn"),e=n.getElementById("cb-input");e.addEventListener("input",()=>{e.style.height="auto",e.style.height=`${Math.min(e.scrollHeight,160)}px`}),e.addEventListener("keydown",o=>{o.key==="Enter"&&!o.shiftKey&&(o.preventDefault(),t.click())}),t.addEventListener("click",async()=>{let o=e.value.trim();if(!o||t.disabled||!await S())return;if(!await _()){R();return}let s=ht(o);t.disabled=!0,t.textContent="Posting...";try{console.time("post");let d=await L(`${c}/api/v1/widget/${f}/comments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({body:o})});console.timeEnd("post"),e.value="",n.getElementById(s)?.remove();let g=await d.json();h.unshift(g);let y=n.querySelector(".cb-title"),m=h.length;y.textContent=`Chatter \xB7 ${m} ${m===1?"comment":"comments"}`,n.getElementById("cb-comments").insertAdjacentHTML("afterbegin",G(g))}catch(d){n.getElementById(s)?.remove(),b("Failed to post comment. Please try again."),console.error("[ChatterBox] Failed to post comment:",d)}finally{t.disabled=!1,t.textContent="Comment"}})}function ht(t){let e=n.getElementById("cb-comments"),o=`cb-pending-${crypto.randomUUID()}`,r=`
      <div id="${o}" class="cb-comment cb-comment-pending">
        <div class="cb-avatar">Y</div>

        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">You</span>
            <span class="cb-timestamp">just now</span>
          </div>

          <div class="cb-comment-text">
            ${x(t)}
          </div>
        </div>
      </div>
    `;return e.insertAdjacentHTML("afterbegin",r),o}async function Q(){let t=n.getElementById("cb-rules-list");t.innerHTML='<div class="cb-loading">Loading rules...</div>';let o=await(await fetch(`${c}/api/v1/dashboard/sites/${j}/rules`)).json();cachedRules=o;let r=n.getElementById("cb-rules-tab");r.textContent=`Rules ${o.length?`(${o.length})`:""}`,t.innerHTML=o.length?o.map(s=>`
          <div class="cb-rule">
            <div class="cb-rule-title">${x(s.title)}</div>
            <div class="cb-rule-description">${x(s.description||"")}</div>
          </div>
        `).join(""):'<div class="cb-empty">No site rules yet.</div>'}function St(){return l.token?{Authorization:`Bearer ${l.token}`}:{}}function Bt(){return!!l.token}async function S(){return!l.token||!await _()?(R(),!1):!0}function R(){if(n.getElementById("cb-auth-modal"))return;let e=document.createElement("div");e.id="cb-auth-modal",e.className="cb-auth-backdrop",e.innerHTML=`
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
    `,n.querySelector(".cb-root").appendChild(e)}function xt(t){n.querySelector(".cb-report-modal-backdrop")?.remove();let e=document.createElement("div");e.className="cb-report-modal-backdrop",e.innerHTML=`
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

        ${cachedRules.length?`
          <select class="cb-report-select" id="cb-report-rule">
            <option value="">Select rule violated optional</option>
            ${cachedRules.map(o=>`
              <option value="${o.id}">
                ${x(o.title)}
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
          data-comment-id="${t}"
        >
          Submit report
        </button>
      </div>
    `,n.querySelector(".cb-root").appendChild(e)}async function X(){let t=n.querySelector("#cb-login-username")?.value.trim(),e=n.querySelector("#cb-login-password")?.value.trim();if(!t||!e){b("Please fill in all fields.");return}try{let o=new URLSearchParams({grant_type:"password",client_id:"chatterbox-api",username:t,password:e});console.time("login");let r=await fetch("http://127.0.0.1:8080/realms/chatterbox/protocol/openid-connect/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:o});if(console.timeEnd("login"),!r.ok){ot("Invalid username or password.");return}let s=await r.json();l.token=s.access_token,Z(s),console.log(A(l.token)),tt()}catch(o){ot("Please enter your username and password."),console.error(o)}}function Z(t){l.token=t.access_token,localStorage.setItem("chatterbox_token",t.access_token),localStorage.setItem("chatterbox_refresh_token",t.refresh_token),localStorage.setItem("chatterbox_last_active",Date.now().toString())}function B(){l.token=null,localStorage.removeItem("chatterbox_token"),localStorage.removeItem("chatterbox_refresh_token"),localStorage.removeItem("chatterbox_last_active")}async function L(t,e={}){return console.log("token expiring?",P(l.token)),console.log("token expired?",yt(l.token)),await _()?(localStorage.setItem("chatterbox_last_active",Date.now().toString()),fetch(t,{...e,headers:{...e.headers||{},Authorization:`Bearer ${l.token}`}})):(B(),tt(),new Response(null,{status:401}))}async function _(){return await D,l.token?P(l.token)?await et()&&!!l.token:!0:!1}function tt(){n.getElementById("cb-auth-modal")?.remove(),n.querySelector(".cb-auth-backdrop")?.remove()}async function et(){return $||($=(async()=>{try{let t=localStorage.getItem("chatterbox_refresh_token");if(!t)return B(),!1;let e=new URLSearchParams({grant_type:"refresh_token",client_id:"chatterbox-api",refresh_token:t}),o=await fetch("http://127.0.0.1:8080/realms/chatterbox/protocol/openid-connect/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:e});if(!o.ok)return B(),!1;let r=await o.json();return Z(r),!0}finally{$=null}})(),$)}function A(t){try{let o=t.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"),r=decodeURIComponent(atob(o).split("").map(s=>"%"+("00"+s.charCodeAt(0).toString(16)).slice(-2)).join(""));return JSON.parse(r)}catch{return null}}function P(t){let e=A(t);if(!e?.exp)return!0;let o=e.exp*1e3,r=Date.now(),s=1e3*60*2;return o-r<s}function yt(t){let e=A(t);return e?.exp?e.exp*1e3<=Date.now():!0}async function vt(){let t=n.querySelector("#cb-signup-username")?.value.trim(),e=n.querySelector("#cb-signup-email")?.value.trim(),o=n.querySelector("#cb-signup-password")?.value.trim();if(!t||!e||!o){b("Please fill in all fields.");return}try{await fetch(`${c}/api/v1/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:t,email:e,password:o})}),await X()}catch(r){b("Sign up failed."),console.error(r)}}function ot(t){let e=n.getElementById("cb-auth-error");if(!e){b(t);return}e.textContent=t,e.style.display="block",clearTimeout(e._timeoutId),e._timeoutId=setTimeout(()=>{e.textContent="",e.style.display="none"},5e3)}function nt(t){let e=new Date(t),r=Math.floor((new Date-e)/1e3);return r<60?"just now":r<3600?`${Math.floor(r/60)}m ago`:r<86400?`${Math.floor(r/3600)}h ago`:`${Math.floor(r/86400)}d ago`}function x(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function b(t){n.getElementById("cb-error")?.remove();let o=document.createElement("div");o.id="cb-error",o.className="cb-error",o.textContent=t,n.querySelector(".cb-root").appendChild(o),setTimeout(()=>{o.remove()},2500)}function wt(){return`
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
    `}ut()})();})();
