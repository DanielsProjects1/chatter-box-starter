(()=>{(function(){let a="http://localhost:8081",i=window.ChatterBoxConfig||{},c=i.siteId;if(!c){console.error("[ChatterBox] No siteId provided in window.ChatterBoxConfig");return}let s=i.mountId||"chatterbox-widget",r=document.getElementById(s);if(!r){console.error(`[ChatterBox] No element found with id "${s}"`);return}let d=r.attachShadow({mode:"open"});async function l(){let t=window.location.pathname;try{let e=await(await fetch(`${a}/api/v1/widget/init`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({siteId:c,pageUrl:t})})).json();m(e)}catch(o){console.error("[ChatterBox] Failed to initialize:",o)}}function m(t){d.innerHTML=`
      <style>${g()}</style>
      <div class="cb-root">
        <div class="cb-header">
          <span class="cb-title">Discussion</span>
        </div>
        <div class="cb-comments" id="cb-comments">
          <div class="cb-loading">Loading comments...</div>
        </div>
      </div>
    `,p(t.id)}async function p(t){try{let e=await(await fetch(`${a}/api/v1/widget/${t}/comments?page=0&size=20`)).json();b(e.content||[])}catch(o){console.error("[ChatterBox] Failed to load comments:",o)}}function b(t){let o=d.getElementById("cb-comments");if(t.length===0){o.innerHTML='<div class="cb-empty">No comments yet. Be the first!</div>';return}o.innerHTML=t.map(f).join("")}function f(t){return`
      <div class="cb-comment">
        <div class="cb-avatar">${t.author.displayName?t.author.displayName.charAt(0).toUpperCase():"?"}</div>
        <div class="cb-comment-body">
          <div class="cb-comment-meta">
            <span class="cb-username">${t.author.displayName||t.author.username}</span>
            <span class="cb-timestamp">${h(t.createdDate)}</span>
          </div>
          <div class="cb-comment-text">${t.body}</div>
          <div class="cb-comment-actions">
            <button class="cb-action-btn">Reply</button>
            <button class="cb-action-btn">\u2764\uFE0F</button>
          </div>
        </div>
      </div>
    `}function h(t){let o=new Date(t),n=Math.floor((new Date-o)/1e3);return n<60?"just now":n<3600?`${Math.floor(n/60)}m ago`:n<86400?`${Math.floor(n/3600)}h ago`:`${Math.floor(n/86400)}d ago`}function g(){return`
      * { box-sizing: border-box; margin: 0; padding: 0; }
      :host { font-family: 'Inter', system-ui, sans-serif; }
      .cb-root { max-width: 720px; padding: 24px 0; color: #e1e1e1; }
      .cb-header { margin-bottom: 20px; }
      .cb-title { font-size: 15px; font-weight: 600; color: #f5f5f5; }
      .cb-comment { display: flex; gap: 12px; padding: 14px 0; border-bottom: 1px solid #2a2a2a; }
      .cb-avatar { width: 32px; height: 32px; border-radius: 50%; background: #3a3a3a; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: #a0a0a0; flex-shrink: 0; }
      .cb-comment-body { flex: 1; }
      .cb-comment-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
      .cb-username { font-size: 13px; font-weight: 600; color: #f0f0f0; }
      .cb-timestamp { font-size: 12px; color: #666; }
      .cb-comment-text { font-size: 14px; line-height: 1.6; color: #c8c8c8; }
      .cb-comment-actions { display: flex; gap: 12px; margin-top: 8px; }
      .cb-action-btn { background: none; border: none; font-size: 12px; color: #666; cursor: pointer; padding: 2px 0; transition: color 0.15s; }
      .cb-action-btn:hover { color: #a0a0a0; }
      .cb-empty { font-size: 14px; color: #666; padding: 20px 0; }
      .cb-loading { font-size: 14px; color: #666; padding: 20px 0; }
    `}l()})();})();
