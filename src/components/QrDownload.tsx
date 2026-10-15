"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";

export function QrDownload({ url, fileName }: { url: string; fileName: string }) {
  const wrapper = useRef<HTMLDivElement>(null);

  function download() {
    const canvas = wrapper.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = fileName;
    link.click();
  }

  return (
    <>
      <div ref={wrapper} className="rounded-2xl bg-white p-4">
        <QRCodeCanvas value={url} size={512} fgColor="#2b2b2b" marginSize={2} style={{ width: 200, height: 200 }} />
      </div>
      <button type="button" onClick={download} className="btn-secondary">
        Download QR code
      </button>
    </>
  );
}
