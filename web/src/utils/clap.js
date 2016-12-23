const maxSingleTouchTime = 300; // ms
const singleTapDistanceSquared = 25; // within 5px we consider it as a single tap

export default function clap(el, fn) {
  let touchStartTime;
  const startPos = { x: 0, y: 0 };

  if (typeof fn === 'function') {
    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mouseup', handleMouseUp);

    el.addEventListener('touchend', handleTouchEnd);
    el.addEventListener('touchstart', handleTouchStart);
  }

  return dispose;

  function handleMouseDown(e) {
    touchStartTime = new Date();
    startPos.x = e.pageX;
    startPos.y = e.pageY;
  }

  function handleMouseUp(e) {
    invokeHandleForPoint(e, e);
  }

  function handleTouchStart(e) {
    const touches = e.touches;

    if (touches.length === 1) {
      touchStartTime = new Date();
      startPos.x = e.touches[0].pageX;
      startPos.y = e.touches[0].pageY;
    }
  }

  function handleTouchEnd(e) {
    // multitouch - ignore
    if (e.touches.length > 1) return;

    invokeHandleForPoint(e.changedTouches[0], e);
  }

  function invokeHandleForPoint(pagePoint, e) {
    // single touch - use time diference to determine if it was a touch or
    // a swipe
    const dt = new Date() - touchStartTime;

    // To long - ignore
    if (dt > maxSingleTouchTime) return;

    const dx = pagePoint.pageX - startPos.x;
    const dy = pagePoint.pageY - startPos.y;

    if (dx * dx + dy * dy < singleTapDistanceSquared) {
      invokeHandler(e);
    }
  }

  function dispose() {
    el.removeEventListener('mousedown', handleMouseDown);
    el.removeEventListener('mouseup', handleMouseUp);

    el.removeEventListener('touchend', handleTouchEnd);
    el.removeEventListener('touchstart', handleTouchStart);
  }

  function invokeHandler(e) {
    fn(e);
  }
}
