export function renderBoxModerationMenu(box) {
  const p = box.permissions || {};

  const hasActions =
    p.canShutBox ||
    p.canDeactivateBox ||
    p.canEmptyBox;

  if (!hasActions) return '';

  return `
    <div class="cb-box-mod-actions">
      ${p.canShutBox ? `
        <button
          class="cb-box-mod-action"
          data-box-action="${box.locked ? 'open' : 'shut'}"
        >
          ${box.locked ? 'Open Box' : 'Shut Box'}
        </button>
      ` : ''}

      ${p.canDeactivateBox ? `
        <button
          class="cb-box-mod-action cb-danger-item"
          data-box-action="deactivate"
        >
          ${box.active ? 'Deactivate Box' : 'Reactivate Box'}
        </button>
      ` : ''}

      ${p.canEmptyBox ? `
        <button
          class="cb-box-mod-action cb-danger-item"
          data-box-action="empty"
        >
          Empty Box
        </button>
      ` : ''}
    </div>
  `;
}