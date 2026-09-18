"use client";

import { useEffect, useRef, useState } from "react";
import { brand } from "@/content/brand";
import { lockPageScroll } from "./lockPageScroll";
import "./VideoModal.css";

export function VideoModal({ onClose, trigger }: {
  onClose: () => void;
  trigger: HTMLElement;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [videoUnavailable, setVideoUnavailable] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const unlock = lockPageScroll();
    dialog.showModal();
    closeRef.current?.focus();
    return () => {
      dialog.close();
      unlock();
      if (trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [trigger]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={`Discover ${brand.name}`}
      className="VideoOverlay_overlay__gkcvQ theme-video-overlay"
      data-state="open"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="VideoOverlay_dialog__7OQ2s VideoOverlay_dialog--transform-fade-animation__XVlGk" data-state="open">
        <button
          ref={closeRef}
          type="button"
          className="VideoOverlay_dialog__close-button__xaqh4"
          aria-label="Videoyu kapat"
          onClick={onClose}
        >
          <span /><span />
        </button>
        <div className="VideoOverlay_dialog__aspect-ratio-container__JxTUF">
          <video
            className="VideoOverlay_dialog__video__PJIEE"
            src={brand.videoUrl}
            controls
            autoPlay
            playsInline
            preload="metadata"
            aria-label={`${brand.name} introduction video`}
            onError={() => setVideoUnavailable(true)}
          />
        </div>
        {videoUnavailable && <p className="theme-video-error" role="status">This video is currently unavailable.</p>}
      </div>
    </dialog>
  );
}
