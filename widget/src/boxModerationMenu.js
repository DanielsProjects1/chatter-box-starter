export function renderBoxModerationMenu(box) {
  const p = box.permissions || {};

  const hasActions =
    p.canToggleBoxLock ||
    p.canToggleBox ||
    p.canEmptyBox;

  if (!hasActions) return '';

  return `
    <div class="cb-box-mod-actions">
      ${p.canToggleBoxLock ? `
        <button
          class="cb-box-mod-action"
          data-box-action="${box.locked ? 'open' : 'shut'}"
        >
          ${box.locked ? 'Open Box' : 'Shut Box'}
        </button>
      ` : ''}

      ${p.canToggleBox ? `
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