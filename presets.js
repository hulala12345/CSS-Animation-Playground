const presets = {
  fade: {
    duration: 2,
    keyframes: [
      { offset: 0, style: 'opacity: 0;' },
      { offset: 100, style: 'opacity: 1;' }
    ]
  },
  bounce: {
    duration: 2,
    keyframes: [
      { offset: 0, style: 'transform: translateY(0);' },
      { offset: 50, style: 'transform: translateY(-50px);' },
      { offset: 100, style: 'transform: translateY(0);' }
    ]
  },
  slide: {
    duration: 2,
    keyframes: [
      { offset: 0, style: 'transform: translateX(-100%);' },
      { offset: 100, style: 'transform: translateX(0);' }
    ]
  }
};
