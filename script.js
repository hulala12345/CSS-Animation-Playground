const timeline = document.getElementById('timeline');
const presetSelect = document.getElementById('presetSelect');
const addKeyframeBtn = document.getElementById('addKeyframeBtn');
const styleInput = document.getElementById('styleInput');
const offsetDisplay = document.getElementById('offsetDisplay');
const generateBtn = document.getElementById('generateBtn');
const cssOutput = document.getElementById('cssOutput');
const box = document.getElementById('box');
const shareBtn = document.getElementById('shareBtn');
const shareUrl = document.getElementById('shareUrl');

let keyframes = [];
let selectedKeyframe = null;
let duration = 2;

function updatePresetOptions() {
  for (const name of Object.keys(presets)) {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    presetSelect.appendChild(opt);
  }
}

function loadFromPreset(name) {
  const preset = presets[name];
  if (!preset) return;
  keyframes = JSON.parse(JSON.stringify(preset.keyframes));
  duration = preset.duration;
  renderTimeline();
  applyAnimation();
}

function createKeyframeElement(kf, index) {
  const el = document.createElement('div');
  el.className = 'keyframe';
  el.style.left = `${kf.offset}%`;
  el.draggable = true;
  el.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', index);
  });
  el.addEventListener('click', () => selectKeyframe(index));
  return el;
}

function renderTimeline() {
  timeline.innerHTML = '';
  keyframes.forEach((kf, idx) => {
    const el = createKeyframeElement(kf, idx);
    timeline.appendChild(el);
  });
}

timeline.addEventListener('dragover', e => e.preventDefault());
timeline.addEventListener('drop', e => {
  e.preventDefault();
  const idx = +e.dataTransfer.getData('text/plain');
  const rect = timeline.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
  keyframes[idx].offset = percent;
  renderTimeline();
  selectKeyframe(idx);
});

function selectKeyframe(index) {
  selectedKeyframe = index;
  const kf = keyframes[index];
  offsetDisplay.textContent = `${Math.round(kf.offset)}%`;
  styleInput.value = kf.style;
}

addKeyframeBtn.addEventListener('click', () => {
  keyframes.push({ offset: 50, style: '' });
  renderTimeline();
});

styleInput.addEventListener('input', () => {
  if (selectedKeyframe === null) return;
  keyframes[selectedKeyframe].style = styleInput.value;
});

function generateCSS() {
  const name = 'generatedAnimation';
  let css = `@keyframes ${name} {\n`;
  keyframes
    .sort((a, b) => a.offset - b.offset)
    .forEach(kf => {
      css += `  ${kf.offset}% { ${kf.style} }\n`;
    });
  css += `}\n`;
  css += `#box {\n  animation: ${name} ${duration}s linear forwards;\n}`;
  cssOutput.textContent = css;
}

function applyAnimation() {
  generateCSS();
  box.style.animation = 'none';
  void box.offsetWidth; // restart
  const name = 'generatedAnimation';
  let keyframeStyles = '';
  keyframes
    .sort((a, b) => a.offset - b.offset)
    .forEach(kf => {
      keyframeStyles += `${kf.offset}%{${kf.style}}`;
    });
  const styleEl = document.getElementById('dynamicStyles') || document.createElement('style');
  styleEl.id = 'dynamicStyles';
  styleEl.textContent = `@keyframes ${name}{${keyframeStyles}}`;
  document.head.appendChild(styleEl);
  box.style.animation = `${name} ${duration}s linear forwards`;
}

generateBtn.addEventListener('click', applyAnimation);

function encodeData() {
  const data = { duration, keyframes };
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}

function decodeData(str) {
  try {
    const json = decodeURIComponent(escape(atob(str)));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

shareBtn.addEventListener('click', () => {
  const encoded = encodeData();
  const url = `${location.origin}${location.pathname}?data=${encoded}`;
  shareUrl.value = url;
  history.replaceState(null, '', `?data=${encoded}`);
});

function loadFromUrl() {
  const params = new URLSearchParams(location.search);
  const dataStr = params.get('data');
  if (dataStr) {
    const data = decodeData(dataStr);
    if (data) {
      duration = data.duration;
      keyframes = data.keyframes;
      renderTimeline();
    }
  } else {
    loadFromPreset('fade');
  }
}

updatePresetOptions();
loadFromUrl();

presetSelect.addEventListener('change', () => {
  if (presetSelect.value) {
    loadFromPreset(presetSelect.value);
  }
});

