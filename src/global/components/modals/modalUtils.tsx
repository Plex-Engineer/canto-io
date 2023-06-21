/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(
  ref: React.MutableRefObject<any>,
  onClickOutside: () => void
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
interface OutsideAlerterProps {
  onClickOutside: () => void;
  children: React.ReactNode;
}
export default function OutsideAlerter(props: OutsideAlerterProps) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props.onClickOutside);

  return <div ref={wrapperRef}>{props.children}</div>;
}
