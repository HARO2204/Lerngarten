const Hoertempo = (() => {
  function bind(audio, control, pace = 1) {
    function apply() {
      const rate = pace * Number(control.value);
      audio.defaultPlaybackRate = rate;
      audio.playbackRate = rate;
    }
    control.addEventListener('change', apply);
    apply();
    return apply;
  }

  return {bind};
})();
