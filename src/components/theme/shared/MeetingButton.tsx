"use client";
import { useEffect, useRef, useState } from "react";
import { contact } from "@/content/contact";
import type { Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { lockPageScroll } from "./lockPageScroll";
import "./MeetingButton.css";

/**
 * Toplanti planlama: Google Takvim randevu sayfasi site icinde bir pencerede
 * acilir. Google'in hazir buton kodu her ziyaretcide Google'dan betik
 * yukluyordu; burada Google'a yalnizca pencere acilinca (iframe) baglanilir.
 * Cerez ve gizlilik metinleri bu davranisi anlatir.
 */
export function MeetingButton({ locale }: { locale: Locale }) {
  const ui = getUi(locale).contact;
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    if (!open || !dialog) return;
    const unlock = lockPageScroll();
    dialog.showModal();
    return () => {
      dialog.close();
      unlock();
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  if (!contact.meetingUrl) return null;
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="Button_button__30ukX Button_button--variant-filled-light__vqIaI Button_button--radius-large__M_ook ash-meeting-button"
      >
        <div className="Button_button__children__eLy5L">{ui.bookMeeting}</div>
      </button>
      {open && (
        <dialog
          ref={dialogRef}
          className="ash-meeting"
          aria-label={ui.bookMeeting}
          onCancel={(event) => { event.preventDefault(); setOpen(false); }}
          onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}
        >
          <div className="ash-meeting__bar">
            {/* Tarayici ucuncu taraf cercevelerini engellerse ayni sayfa yeni sekmede acilabilir. */}
            <a href={contact.meetingUrl} target="_blank" rel="noopener noreferrer">{ui.meetingNewTab}</a>
            <button type="button" className="ash-meeting__close" onClick={() => setOpen(false)} aria-label={ui.meetingClose}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <iframe className="ash-meeting__frame" src={contact.meetingUrl} title={ui.bookMeeting} />
        </dialog>
      )}
    </>
  );
}
