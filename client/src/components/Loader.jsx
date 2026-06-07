import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const bootMessages = [
  "Initializing EPMOC Core...",
  "Loading Neural Interface...",
  "Syncing Event Protocols...",
  "Access Granted ✔"
];

export default function Loader({ onComplete }) {
  const [text, setText] = useState(bootMessages[0]);
  const loaderRef = useRef(null);

  useEffect(() => {
    let bootIdx = 0;
    let timeoutId;
    
    const showBoot = () => {
      if (bootIdx < bootMessages.length) {
        setText(bootMessages[bootIdx]);
        bootIdx++;
        timeoutId = setTimeout(showBoot, 800);
      } else {
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 1.2,
          delay: 0.5,
          onComplete: () => {
            if (loaderRef.current) loaderRef.current.style.display = 'none';
            onComplete();
          }
        });
      }
    };

    timeoutId = setTimeout(showBoot, 1000);
    return () => clearTimeout(timeoutId);
  }, [onComplete]);

  return (
    <div id="spline-loader" ref={loaderRef}>
      <iframe src="https://my.spline.design/scifihudcopycopycopy-L6egIrA1hCKNNsaOurkKbqQF-ZfC/" frameBorder="0" width="100%" height="100%"></iframe>
      {/* Overlay to hide the "Built with Spline" watermark */}
      <div className="absolute bottom-0 right-0 w-48 h-16 bg-black z-[100]"></div>
      <div id="boot-text">{text}</div>
    </div>
  );
}
