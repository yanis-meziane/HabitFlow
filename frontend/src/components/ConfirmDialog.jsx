import { useEffect, useRef } from "react";

// boîte de confirmation native <dialog> : focus piégé, Échap = annuler
export default function ConfirmDialog({ title, message, confirmLabel = "Supprimer", onConfirm, onCancel }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.showModal();
  }, []);

  return (
    <dialog ref={ref} className="confirm" onCancel={onCancel} aria-labelledby="confirm-title">
      <h3 id="confirm-title">{title}</h3>
      <p>{message}</p>
      <div className="confirm-actions">
        <button type="button" className="confirm-cancel" autoFocus onClick={onCancel}>Annuler</button>
        <button type="button" className="confirm-ok" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </dialog>
  );
}
