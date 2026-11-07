// Function Mapping Visualizer - Web Version

// SVG namespace
const SVG_NS = 'http://www.w3.org/2000/svg';

// Sets from left to right; the third set is only shown in composition mode
const SET_KEYS = ['domain', 'codomain', 'third-set'];
const SET_INPUTS = {
    'domain': { nameId: 'domain-name-input', elementsId: 'domain-input', defaultName: 'X' },
    'codomain': { nameId: 'codomain-name-input', elementsId: 'codomain-input', defaultName: 'Y' },
    'third-set': { nameId: 'third-set-name-input', elementsId: 'third-set-input', defaultName: 'Z' }
};

// Pointer interaction tuning. Screen distances are in CSS pixels so they hold
// on phones, where the drawing is scaled down to the screen width.
const DRAG_THRESHOLD_PX = { mouse: 5, pen: 8, touch: 12 };
const HIT_RADIUS_PX = { mouse: 12, pen: 16, touch: 26 };
// Snap distance while dragging, in SVG user units
const SNAP_DISTANCE = 50;

// Hangul, kana and CJK ideographs are drawn upright in a sans-serif font
const CJK_PATTERN = /[ᄀ-ᇿ぀-ヿ㄰-㆏㐀-鿿가-힯]/;

// Fonts for Hangul (and other CJK) labels. Web fonts are loaded only once chosen,
// and the glyphs a drawing uses are embedded into exported PNG/SVG files.
const FONTSOURCE = 'https://cdn.jsdelivr.net/npm/@fontsource';
const CJK_FONTS = {
    gothic: {
        stack: "'Malgun Gothic', 'Apple SD Gothic Neo', AppleGothic, NanumGothic, 'Noto Sans KR', 'Noto Sans CJK KR', sans-serif"
    },
    myeongjo: {
        family: 'Nanum Myeongjo',
        css: [`${FONTSOURCE}/nanum-myeongjo@5.3.0/400.css`, `${FONTSOURCE}/nanum-myeongjo@5.3.0/700.css`],
        stack: "'Nanum Myeongjo', Batang, AppleMyungjo, 'Noto Serif KR', 'Noto Serif CJK KR', 'Hiragino Mincho ProN', 'Yu Mincho', serif"
    },
    pen: {
        family: 'Nanum Pen Script',
        css: [`${FONTSOURCE}/nanum-pen-script@5.3.0/400.css`],
        // Handwriting glyphs are drawn small within the em box
        scale: 1.4,
        stack: "'Nanum Pen Script', 'Malgun Gothic', 'Apple SD Gothic Neo', AppleGothic, sans-serif"
    }
};

// Styles embedded in exported files (mirror the SVG rules in style.css)
const EXPORT_STYLE = `
    .domain-ellipse, .codomain-ellipse, .third-set-ellipse { fill: none; stroke: #333; stroke-width: 2; }
    .element-text, .set-label, .function-name {
        font-family: 'Times New Roman', 'STIX Two Math', 'Latin Modern Math', 'Computer Modern', serif;
        text-anchor: middle;
        fill: #333;
    }
    .element-text { font-style: italic; }
    .set-label { font-weight: bold; font-style: normal; }
    .function-name { font-weight: bold; font-style: italic; }
    .cjk-text { font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', AppleGothic, NanumGothic, sans-serif; font-style: normal; }
    .function-arrow { fill: none; stroke: #333; stroke-width: 2; }
    .relation-arrow { fill: none; stroke: #333; stroke-width: 1.5; }
`;

// Global State
const state = {
    functionName: 'f',
    secondFunctionName: 'g',
    arrowsInverse: false,
    showFunction: true,
    compositionMode: false,
    fontSize: 27,
    // Key of CJK_FONTS used for Hangul labels
    cjkFont: 'gothic',
    currentLanguage: 'en',
    // Set names and parsed elements, read from the inputs on every render
    sets: {
        'domain': { name: 'X', elements: [] },
        'codomain': { name: 'Y', elements: [] },
        'third-set': { name: 'Z', elements: [] }
    },
    // Relation arrows drawn by the user: { from, fromIndex, fromElement, to, toIndex, toElement }
    arrows: [],
    // Element picked as an arrow start by clicking: { type, index, element }
    selected: null,
    // Pointer gesture in progress on the canvas
    pointer: null,
    // Geometry of the current drawing (null while a set is empty)
    layout: null,
    // Function whose name is being edited in the modal
    editingFunction: null
};

// Language translations
const translations = {
    en: {
        'title': 'Function Mapper',
        'section-sets': 'Sets',
        'section-options': 'Options',
        'section-edit': 'Edit',
        'section-export': 'Export',
        'domain-label': 'Domain (e.g. a,b,c)',
        'codomain-label': 'Codomain (e.g. x,y,z)',
        'font-size-label': 'Font Size',
        'instruction': 'Click elements to draw arrows: Domain → Codomain',
        'show-function': 'Show function Name',
        'function-hint': 'Click function name to change',
        'inverse-btn': 'Inverse Arrows & Function Name',
        'remove-arrows-btn': 'Remove Relation Arrows',
        'save-btn': 'Save as PNG',
        'save-svg-btn': 'Save as SVG',
        'footer-made-by': 'Made by Namgung Yeon @seolakhigh school 2025',
        'footer-copyright': '© 2025 Namgung Yeon. All rights reserved.',
        'footer-license': 'CC BY-NC 4.0 License',
        'modal-title': 'Change Function Name',
        'modal-title-first': 'Change First Function Name ({name})',
        'modal-title-second': 'Change Second Function Name ({name})',
        'modal-placeholder': 'Enter function name (e.g. f, g, h)',
        'modal-ok': 'OK',
        'modal-cancel': 'Cancel',
        'domain-placeholder': 'Enter domain elements',
        'codomain-placeholder': 'Enter codomain elements',
        'third-set-label': 'Third Set (e.g. p,q,r)',
        'third-set-placeholder': 'Enter third set elements',
        'composition-mode': 'Composition Function Mode',
        'toast-element-selected': '{from} element selected. Click or drag to a {to} element.',
        'toast-arrow-drawn': 'Arrow drawn successfully!',
        'toast-arrow-exists': 'This arrow already exists.',
        'toast-invalid-target': 'Please choose an element of {to}.',
        'toast-selection-cancelled': 'Selection cancelled.',
        'toast-arrows-reversed': 'Arrow directions reversed!',
        'toast-function-updated': 'Function name updated!',
        'toast-composition-auto': 'The composite function name is made from the two function names.',
        'toast-arrows-removed': 'Relation arrows removed!',
        'toast-image-saved': 'PNG image saved successfully!',
        'toast-svg-saved': 'SVG file saved successfully!',
        'toast-save-error': 'Error saving image. Please try again.',
        'random-btn': 'Random',
        'cjk-font-label': 'Korean font',
        'cjk-font-gothic': 'Gothic',
        'cjk-font-myeongjo': 'Myeongjo',
        'cjk-font-pen': 'Handwriting',
        'random-type-function': 'Function',
        'random-type-injective': 'One-to-one function',
        'random-type-bijective': 'One-to-one correspondence',
        'random-type-constant': 'Constant function',
        'random-type-not-function': 'Not a function',
        'toast-random-drawn': 'Random mapping drawn: {type}',
        'toast-random-injective-error': 'A one-to-one function needs at least as many elements in {to} as in {from}.',
        'toast-random-bijective-error': 'A one-to-one correspondence needs the same number of elements in {from} and {to}.'
    },
    ko: {
        'title': '함수 대응 관계 그리기',
        'section-sets': '집합',
        'section-options': '옵션',
        'section-edit': '편집',
        'section-export': '내보내기',
        'domain-label': '정의역 (예: a,b,c)',
        'codomain-label': '공역 (예: x,y,z)',
        'font-size-label': '글꼴 크기',
        'instruction': '원소를 클릭하여 화살표 그리기: 정의역 → 공역',
        'show-function': '함수명 표시',
        'function-hint': '함수명을 클릭하여 변경',
        'inverse-btn': '화살표 및 함수명 역방향',
        'remove-arrows-btn': '관계 화살표 제거',
        'save-btn': 'PNG로 저장',
        'save-svg-btn': 'SVG로 저장',
        'footer-made-by': 'Made by Namgung Yeon @seolakhigh school 2025',
        'footer-copyright': '© 2025 Namgung Yeon. All rights reserved.',
        'footer-license': 'CC BY-NC 4.0 라이선스',
        'modal-title': '함수명 변경',
        'modal-title-first': '첫 번째 함수명 변경 ({name})',
        'modal-title-second': '두 번째 함수명 변경 ({name})',
        'modal-placeholder': '함수명 입력 (예: f, g, h)',
        'modal-ok': '확인',
        'modal-cancel': '취소',
        'domain-placeholder': '정의역 원소 입력',
        'codomain-placeholder': '공역 원소 입력',
        'third-set-label': '세 번째 집합 (예: p,q,r)',
        'third-set-placeholder': '세 번째 집합 원소 입력',
        'composition-mode': '합성함수 모드',
        'toast-element-selected': '{from}의 원소가 선택되었습니다. {to}의 원소를 클릭하거나 드래그하세요.',
        'toast-arrow-drawn': '화살표가 성공적으로 그려졌습니다!',
        'toast-arrow-exists': '이미 그려진 화살표입니다.',
        'toast-invalid-target': '{to}의 원소를 선택하세요.',
        'toast-selection-cancelled': '선택이 취소되었습니다.',
        'toast-arrows-reversed': '화살표 방향이 바뀌었습니다!',
        'toast-function-updated': '함수명이 업데이트되었습니다!',
        'toast-composition-auto': '합성함수 이름은 두 함수 이름으로 자동으로 만들어집니다.',
        'toast-arrows-removed': '관계 화살표가 제거되었습니다!',
        'toast-image-saved': 'PNG 이미지가 성공적으로 저장되었습니다!',
        'toast-svg-saved': 'SVG 파일이 성공적으로 저장되었습니다!',
        'toast-save-error': '이미지 저장 중 오류가 발생했습니다. 다시 시도하세요.',
        'random-btn': '무작위 대응',
        'cjk-font-label': '한글 글꼴',
        'cjk-font-gothic': '고딕',
        'cjk-font-myeongjo': '명조',
        'cjk-font-pen': '손글씨',
        'random-type-function': '함수',
        'random-type-injective': '일대일함수',
        'random-type-bijective': '일대일대응',
        'random-type-constant': '상수함수',
        'random-type-not-function': '함수가 아닌 대응',
        'toast-random-drawn': '무작위로 그렸습니다: {type}',
        'toast-random-injective-error': '일대일함수를 그리려면 {to}의 원소가 {from}의 원소보다 적지 않아야 합니다.',
        'toast-random-bijective-error': '일대일대응을 그리려면 {from}, {to}의 원소 개수가 같아야 합니다.'
    },
    ja: {
        'title': '関数対応関係作図',
        'section-sets': '集合',
        'section-options': 'オプション',
        'section-edit': '編集',
        'section-export': '書き出し',
        'domain-label': '定義域 (例: a,b,c)',
        'codomain-label': '終域 (例: x,y,z)',
        'font-size-label': 'フォントサイズ',
        'instruction': '要素をクリックして矢印を描く: 定義域 → 終域',
        'show-function': '関数名を表示',
        'function-hint': '関数名をクリックして変更',
        'inverse-btn': '矢印と関数名を逆方向',
        'remove-arrows-btn': '関係矢印を削除',
        'save-btn': 'PNGとして保存',
        'save-svg-btn': 'SVGとして保存',
        'footer-made-by': 'Made by Namgung Yeon @seolakhigh school 2025',
        'footer-copyright': '© 2025 Namgung Yeon. All rights reserved.',
        'footer-license': 'CC BY-NC 4.0 ライセンス',
        'modal-title': '関数名を変更',
        'modal-title-first': '第1関数名を変更 ({name})',
        'modal-title-second': '第2関数名を変更 ({name})',
        'modal-placeholder': '関数名を入力 (例: f, g, h)',
        'modal-ok': 'OK',
        'modal-cancel': 'キャンセル',
        'domain-placeholder': '定義域要素を入力',
        'codomain-placeholder': '終域要素を入力',
        'third-set-label': '第三集合 (例: p,q,r)',
        'third-set-placeholder': '第三集合要素を入力',
        'composition-mode': '合成関数モード',
        'toast-element-selected': '{from}の要素が選択されました。{to}の要素をクリックまたはドラッグしてください。',
        'toast-arrow-drawn': '矢印が正常に描かれました！',
        'toast-arrow-exists': 'この矢印はすでに描かれています。',
        'toast-invalid-target': '{to}の要素を選択してください。',
        'toast-selection-cancelled': '選択がキャンセルされました。',
        'toast-arrows-reversed': '矢印の方向が逆になりました！',
        'toast-function-updated': '関数名が更新されました！',
        'toast-composition-auto': '合成関数の名前は2つの関数名から自動的に作られます。',
        'toast-arrows-removed': '関係矢印が削除されました！',
        'toast-image-saved': 'PNG画像が正常に保存されました！',
        'toast-svg-saved': 'SVGファイルが正常に保存されました！',
        'toast-save-error': '画像の保存中にエラーが発生しました。もう一度お試しください。',
        'random-btn': 'ランダム対応',
        'cjk-font-label': 'ハングルフォント',
        'cjk-font-gothic': 'ゴシック',
        'cjk-font-myeongjo': '明朝',
        'cjk-font-pen': '手書き',
        'random-type-function': '関数',
        'random-type-injective': '単射',
        'random-type-bijective': '全単射',
        'random-type-constant': '定数関数',
        'random-type-not-function': '関数でない対応',
        'toast-random-drawn': 'ランダムに作図しました: {type}',
        'toast-random-injective-error': '単射を作るには、{to}の要素数が{from}の要素数以上である必要があります。',
        'toast-random-bijective-error': '全単射を作るには、{from}と{to}の要素数が同じである必要があります。'
    }
};

// DOM Elements
let canvas, fontSizeSlider, fontSizeValue, showFunctionCheckbox, compositionModeCheckbox, thirdSetGroup;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    render();
});

function initializeElements() {
    canvas = document.getElementById('main-canvas');
    fontSizeSlider = document.getElementById('font-size');
    fontSizeValue = document.getElementById('font-size-value');
    showFunctionCheckbox = document.getElementById('show-function');
    compositionModeCheckbox = document.getElementById('composition-mode');
    thirdSetGroup = document.getElementById('third-set-group');

    // Browsers may restore form controls on reload, so start from their current values
    state.fontSize = parseInt(fontSizeSlider.value, 10);
    updateFontSizeDisplay();
    state.showFunction = showFunctionCheckbox.checked;
    state.compositionMode = compositionModeCheckbox.checked;
    applyCompositionLayout();

    // Hangul font: a remembered choice, else what the browser restored
    const fontSelect = document.getElementById('cjk-font');
    const savedFont = readStored('cjk-font');
    if (CJK_FONTS[savedFont]) fontSelect.value = savedFont;
    state.cjkFont = CJK_FONTS[fontSelect.value] ? fontSelect.value : 'gothic';

    // Initialize language
    const savedLanguage = readStoredLanguage();
    state.currentLanguage = translations[savedLanguage] ? savedLanguage : detectBrowserLanguage();
    document.getElementById('language-select').value = state.currentLanguage;
    updateLanguage();
}

// Show the slider value and fill the track up to the thumb
function updateFontSizeDisplay() {
    const { min, max, value } = fontSizeSlider;
    fontSizeValue.textContent = value;
    fontSizeSlider.style.setProperty('--fill', `${((value - min) / (max - min)) * 100}%`);
}

function setupEventListeners() {
    // Set name and element inputs
    const renderLater = debounce(render, 300);
    SET_KEYS.forEach(key => {
        const { nameId, elementsId } = SET_INPUTS[key];
        [nameId, elementsId].forEach(id => {
            const input = document.getElementById(id);
            input.addEventListener('input', renderLater);
            input.addEventListener('blur', render);
        });
    });

    // Font size slider
    fontSizeSlider.addEventListener('input', function() {
        state.fontSize = parseInt(this.value, 10);
        updateFontSizeDisplay();
        render();
    });

    // Checkboxes and buttons
    showFunctionCheckbox.addEventListener('change', function() {
        state.showFunction = this.checked;
        render();
    });
    compositionModeCheckbox.addEventListener('change', toggleCompositionMode);
    document.getElementById('inverse-btn').addEventListener('click', reverseArrowsDirection);
    document.getElementById('remove-arrows-btn').addEventListener('click', removeRelationArrows);
    document.getElementById('random-btn').addEventListener('click', drawRandomMapping);
    document.getElementById('save-btn').addEventListener('click', saveAsImage);
    document.getElementById('save-svg-btn').addEventListener('click', saveAsSVG);

    // Canvas: one pointer flow handles both click-click and drag, for mouse, pen and touch
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerCancel);
    // Keep a touch drag that starts on (or near) an element from scrolling the page
    canvas.addEventListener('touchstart', function(event) {
        const touch = event.changedTouches[0];
        const info = touch && findElementAt(touch.clientX, touch.clientY, 'touch', event.target);
        if (info && getMappingFrom(info.type)) {
            event.preventDefault();
        }
    }, { passive: false });

    // Hangul font
    document.getElementById('cjk-font').addEventListener('change', function() {
        state.cjkFont = this.value;
        try {
            localStorage.setItem('cjk-font', this.value);
        } catch (e) {
            // Storage can be unavailable (private mode); the choice just isn't remembered
        }
        render();
    });

    // Language selector
    document.getElementById('language-select').addEventListener('change', function() {
        state.currentLanguage = this.value;
        try {
            localStorage.setItem('preferred-language', this.value);
        } catch (e) {
            // Storage can be unavailable (private mode); the choice just isn't remembered
        }
        updateLanguage();
    });

    setupFunctionNameModal();
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Parse input elements
function parseElements(input) {
    return input.split(',')
        .map(e => e.trim())
        .filter(e => e.length > 0);
}

function createSvgElement(tag, attributes = {}) {
    const element = document.createElementNS(SVG_NS, tag);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
    return element;
}

// Create a text element with LaTeX-like formatting: x_1, x^2, x_{10}, f^{-1}, \circ
function createMathText(x, y, content, className, baseSize) {
    const isCjk = CJK_PATTERN.test(content);
    const cjkFont = CJK_FONTS[state.cjkFont];
    const fontSize = isCjk && cjkFont.scale ? baseSize * cjkFont.scale : baseSize;

    const text = createSvgElement('text', { x, y, 'font-size': fontSize });
    text.classList.add(className);
    if (isCjk) {
        text.classList.add('cjk-text');
        text.style.fontFamily = cjkFont.stack;
    }

    // Raise/lower scripts with relative dy so the whole label stays centered on x
    let currentShift = 0;
    parseLatexLike(content).forEach(part => {
        const tspan = createSvgElement('tspan');
        tspan.textContent = part.text;

        const shift = part.type === 'superscript' ? -0.3 * fontSize :
                      part.type === 'subscript' ? 0.3 * fontSize : 0;
        if (shift !== currentShift) {
            tspan.setAttribute('dy', shift - currentShift);
            currentShift = shift;
        }
        if (part.type !== 'normal') {
            tspan.setAttribute('font-size', fontSize * 0.7);
        }
        text.appendChild(tspan);
    });

    return text;
}

// Parse LaTeX-like formatting
function parseLatexLike(text) {
    // First, replace LaTeX symbols with Unicode equivalents
    text = text.replace(/\\circ/g, '∘');

    const parts = [];
    let i = 0;

    while (i < text.length) {
        if (text[i] === '_' || text[i] === '^') {
            const type = text[i] === '_' ? 'subscript' : 'superscript';
            i++; // skip _ or ^
            let script = '';
            if (text[i] === '{') {
                // Multi-character script
                i++; // skip {
                while (i < text.length && text[i] !== '}') {
                    script += text[i];
                    i++;
                }
                i++; // skip }
            } else {
                // Single character script
                script = text[i] || '';
                i++;
            }
            parts.push({ text: script, type });
        } else {
            // Regular text
            let regular = '';
            while (i < text.length && text[i] !== '_' && text[i] !== '^') {
                regular += text[i];
                i++;
            }
            parts.push({ text: regular, type: 'normal' });
        }
    }

    return parts;
}

// Append a math label whose vertical center is on y. The baseline is placed by
// measuring the font box instead of using dominant-baseline, which Safari and
// apps that import the SVG ignore, leaving every label sitting above its arrows.
function appendMathText(parent, x, y, content, className, fontSize) {
    const text = createMathText(x, y, content, className, fontSize);
    parent.appendChild(text);

    // Same font and text without sub/superscript shifts, so scripts don't move the label
    const probe = text.cloneNode(false);
    probe.textContent = text.textContent;
    parent.appendChild(probe);
    const box = probe.getBBox();
    probe.remove();

    if (box.height > 0) {
        const baseline = 2 * y - (box.y + box.height / 2);
        text.setAttribute('y', Math.round(baseline * 100) / 100);
    }
    return text;
}

// Append a text label on a white background (set names sit on top of the ellipse outline)
function appendTextWithBackground(x, y, content, className, fontSize) {
    const group = createSvgElement('g');
    canvas.appendChild(group);
    const text = appendMathText(group, x, y, content, className, fontSize);

    // Measure once the text is in the document
    const bbox = text.getBBox();
    const padding = fontSize * 0.3;
    const background = createSvgElement('rect', {
        x: bbox.x - padding,
        y: bbox.y - padding,
        width: bbox.width + padding * 2,
        height: bbox.height + padding * 2,
        fill: 'white',
        stroke: 'none',
        rx: 4
    });
    group.insertBefore(background, text);
}

// Get Y positions for elements (matching original Python implementation)
function getYValues(elements, a) {
    const totalParts = elements.length + 2;
    const yValues = [];

    // Create linspace from a to -a with totalParts points, then take middle elements
    for (let i = 1; i < totalParts - 1; i++) {
        yValues.push(a - (2 * a * i) / (totalParts - 1));
    }

    return yValues;
}

function getActiveSetKeys() {
    return state.compositionMode ? SET_KEYS : SET_KEYS.slice(0, 2);
}

// Functions between neighbouring sets: f: X → Y, and g: Y → Z in composition mode
function getMappings() {
    if (!state.compositionMode) {
        return [{ id: 'single', from: 'domain', to: 'codomain', name: state.functionName }];
    }
    return [
        { id: 'first', from: 'domain', to: 'codomain', name: state.functionName },
        { id: 'second', from: 'codomain', to: 'third-set', name: state.secondFunctionName }
    ];
}

// The function whose arrows start in the given set, or null if arrows can't start there
function getMappingFrom(setKey) {
    return getMappings().find(mapping => mapping.from === setKey) || null;
}

function readSetsFromInputs() {
    SET_KEYS.forEach(key => {
        const { nameId, elementsId, defaultName } = SET_INPUTS[key];
        state.sets[key].name = document.getElementById(nameId).value.trim() || defaultName;
        state.sets[key].elements = parseElements(document.getElementById(elementsId).value);
    });
}

// Compute ellipse and element positions for the visible sets
function computeLayout() {
    const keys = getActiveSetKeys();
    const width = state.compositionMode ? 1000 : 700;
    const height = 600;

    if (keys.some(key => state.sets[key].elements.length === 0)) {
        return { width, height, sets: null };
    }

    const centerX = width / 2;
    const centerY = height / 2;

    // Ellipse semi-axes in abstract units, sized for the largest visible set
    const maxElements = Math.max(...keys.map(key => state.sets[key].elements.length));
    const a = (maxElements + 1) / 2;
    const b = a / 2;

    // Ellipse centers in units of b: two sets at ±1.5, three sets at -2.5, 0, 2.5
    const offsets = keys.length === 3 ? [-2.5, 0, 2.5] : [-1.5, 1.5];
    const totalWidth = (keys.length === 3 ? 6 : 4) * b;
    const scale = Math.min((width * 0.8) / totalWidth, (height * 0.8) / (2 * a + b));
    const unit = b * scale;

    const sets = {};
    keys.forEach((key, i) => {
        const cx = centerX + offsets[i] * unit;
        sets[key] = {
            cx,
            points: getYValues(state.sets[key].elements, a).map(y => ({ x: cx, y: centerY - y * scale }))
        };
    });

    return { width, height, centerX, centerY, rx: unit, ry: a * scale, unit, labelY: centerY - a * scale, sets };
}

// Index of an element that may have moved since it was recorded (inputs edited)
function resolveIndex(setKey, index, element) {
    const elements = state.sets[setKey].elements;
    return elements[index] === element ? index : elements.indexOf(element);
}

function getElementPoint(setKey, index, element) {
    const set = state.layout && state.layout.sets && state.layout.sets[setKey];
    if (!set) return null;
    const resolved = resolveIndex(setKey, index, element);
    return resolved >= 0 ? set.points[resolved] : null;
}

// Clear SVG canvas and add the arrowhead marker
function clearCanvas() {
    canvas.textContent = '';

    const defs = createSvgElement('defs');
    const marker = createSvgElement('marker', {
        id: 'arrowhead',
        markerWidth: 8,
        markerHeight: 8,
        refX: 7,
        refY: 4,
        orient: 'auto',
        markerUnits: 'strokeWidth'
    });
    marker.appendChild(createSvgElement('polygon', { points: '0,0 8,4 0,8', fill: '#333', stroke: 'none' }));
    defs.appendChild(marker);
    canvas.appendChild(defs);
}

// Redraw everything from state
function render() {
    readSetsFromInputs();
    clearCanvas();

    state.layout = computeLayout();
    const { width, height } = state.layout;
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    canvas.setAttribute('viewBox', `0 0 ${width} ${height}`);

    if (!state.layout.sets) {
        state.selected = null;
        return;
    }

    drawSets();
    drawRelationArrows();
    drawSetLabels();
    if (state.showFunction) {
        drawFunctionArrows();
    }
    renderSelection();
    ensureCjkGlyphs();
}

// Stylesheets are added once; resolves when loaded (or failed, leaving fallback fonts)
const stylesheetLoads = new Map();
function loadStylesheet(href) {
    if (!stylesheetLoads.has(href)) {
        stylesheetLoads.set(href, new Promise(resolve => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = resolve;
            document.head.appendChild(link);
        }));
    }
    return stylesheetLoads.get(href);
}

// Labels are measured when drawn, so once a web font's glyphs arrive the drawing
// is redrawn to center and space the labels with the real font
const loadedGlyphs = new Set();
function ensureCjkGlyphs() {
    const key = state.cjkFont;
    const font = CJK_FONTS[key];
    if (!font.css) return;

    const text = [...canvas.querySelectorAll('.cjk-text')].map(el => el.textContent).join('');
    const missing = [...new Set(text)].filter(ch => !loadedGlyphs.has(`${key}:${ch}`)).join('');
    if (!missing) return;

    Promise.all(font.css.map(loadStylesheet))
        .then(() => Promise.all(['400', '700'].map(weight =>
            document.fonts.load(`${weight} 16px "${font.family}"`, missing))))
        .catch(() => {})
        .then(() => {
            [...missing].forEach(ch => loadedGlyphs.add(`${key}:${ch}`));
            if (state.cjkFont === key) render();
        });
}

// Draw ellipses and their elements
function drawSets() {
    const { sets, centerY, rx, ry } = state.layout;

    Object.entries(sets).forEach(([key, set]) => {
        const ellipse = createSvgElement('ellipse', { cx: set.cx, cy: centerY, rx, ry });
        ellipse.classList.add(`${key}-ellipse`);
        canvas.appendChild(ellipse);

        state.sets[key].elements.forEach((element, i) => {
            const point = set.points[i];
            const text = appendMathText(canvas, point.x, point.y, element, 'element-text', state.fontSize);
            text.dataset.element = element;
            text.dataset.type = key;
            text.dataset.index = i;
            // Arrows keep clear of wide labels such as 10, x_1 or Hangul
            point.halfWidth = text.getBBox().width / 2;
        });
    });
}

function drawSetLabels() {
    const labelSize = Math.max(24, state.fontSize * 1.1);
    Object.entries(state.layout.sets).forEach(([key, set]) => {
        appendTextWithBackground(set.cx, state.layout.labelY, state.sets[key].name, 'set-label', labelSize);
    });
}

// Straight arrow from (x1, y1) to (x2, y2); in inverse mode it points back to (x1, y1)
function createArrowLine(x1, y1, x2, y2, className) {
    const [from, to] = state.arrowsInverse ? [[x2, y2], [x1, y1]] : [[x1, y1], [x2, y2]];
    const line = createSvgElement('line', {
        x1: from[0],
        y1: from[1],
        x2: to[0],
        y2: to[1],
        'marker-end': 'url(#arrowhead)'
    });
    line.classList.add(className);
    return line;
}

// Horizontal distance from an element's center to where an arrow meets it
function arrowInset(point) {
    return Math.max(0.15 * state.layout.unit, (point.halfWidth || 0) + state.fontSize * 0.25);
}

// Draw the element-to-element arrows whose endpoints are currently visible
function drawRelationArrows() {
    state.arrows.forEach(arrow => {
        const start = getElementPoint(arrow.from, arrow.fromIndex, arrow.fromElement);
        const end = getElementPoint(arrow.to, arrow.toIndex, arrow.toElement);
        if (start && end) {
            canvas.appendChild(createArrowLine(start.x + arrowInset(start), start.y, end.x - arrowInset(end), end.y, 'relation-arrow'));
        }
    });
}

// Draw the function arrows between set labels, plus g∘f in composition mode
function drawFunctionArrows() {
    const { sets, labelY, unit } = state.layout;
    const nameSize = Math.max(18, state.fontSize * 0.9);

    getMappings().forEach(mapping => {
        const startX = sets[mapping.from].cx + 0.5 * unit;
        const endX = sets[mapping.to].cx - 0.5 * unit;
        canvas.appendChild(createArrowLine(startX, labelY, endX, labelY, 'function-arrow'));

        const name = state.arrowsInverse ? `${mapping.name}^{-1}` : mapping.name;
        appendFunctionName((startX + endX) / 2, labelY - nameSize * 0.7, name, mapping.id, nameSize);
    });

    if (state.compositionMode) {
        drawCompositionArrow(nameSize);
    }
}

// Curved g∘f arrow from the first set to the third, above the f and g arrows
function drawCompositionArrow(nameSize) {
    const { sets, labelY, unit } = state.layout;
    const startX = sets['domain'].cx + 0.5 * unit;
    const endX = sets['third-set'].cx - 0.5 * unit;
    const midX = (startX + endX) / 2;
    const arcY = labelY - 15;
    const controlY = arcY - (endX - startX) * 0.25;

    const [fromX, toX] = state.arrowsInverse ? [endX, startX] : [startX, endX];
    const arc = createSvgElement('path', {
        d: `M ${fromX} ${arcY} Q ${midX} ${controlY} ${toX} ${arcY}`,
        'marker-end': 'url(#arrowhead)'
    });
    arc.classList.add('function-arrow', 'composition-arrow');
    canvas.appendChild(arc);

    // (g∘f)⁻¹ = f⁻¹∘g⁻¹, so the inverse keeps g∘f inside the parentheses
    const composition = `${state.secondFunctionName} \\circ ${state.functionName}`;
    const name = state.arrowsInverse ? `(${composition})^{-1}` : composition;
    const label = appendFunctionName(midX, controlY + nameSize * 0.7, name, 'composition', nameSize * 0.9);
    label.classList.add('composition-name');
}

// Clickable function name label
function appendFunctionName(x, y, content, functionId, fontSize) {
    const label = appendMathText(canvas, x, y, content, 'function-name', fontSize);
    label.dataset.functionType = functionId;
    label.addEventListener('click', () => openFunctionNameModal(functionId));
    return label;
}

// Highlight the element picked as an arrow start
function renderSelection() {
    canvas.querySelectorAll('.selection-highlight').forEach(el => el.remove());
    canvas.querySelectorAll('.element-selected').forEach(el => el.classList.remove('element-selected'));

    const selected = state.selected;
    if (!selected) return;

    // Drop the selection if its element is gone or can no longer start an arrow
    const visible = getMappingFrom(selected.type) && getElementPoint(selected.type, selected.index, selected.element);
    const index = visible ? resolveIndex(selected.type, selected.index, selected.element) : -1;
    const node = index >= 0 ? canvas.querySelector(`[data-type="${selected.type}"][data-index="${index}"]`) : null;
    if (!node) {
        state.selected = null;
        return;
    }
    state.selected = { ...selected, index };

    node.classList.add('element-selected');
    const bbox = node.getBBox();
    const circle = createSvgElement('circle', {
        cx: bbox.x + bbox.width / 2,
        cy: bbox.y + bbox.height / 2,
        r: Math.max(bbox.width, bbox.height) / 2 + 5
    });
    circle.classList.add('selection-highlight');
    canvas.appendChild(circle);
}

function setSelection(info) {
    state.selected = info;
    renderSelection();
}

function clearSelection() {
    state.selected = null;
    renderSelection();
}

// Element info for an event target inside an element label, or null
function getElementInfo(target) {
    const node = target && target.closest ? target.closest('[data-element]') : null;
    if (!node || !canvas.contains(node)) return null;
    return { type: node.dataset.type, index: Number(node.dataset.index), element: node.dataset.element };
}

function getSvgPoint(event) {
    const point = new DOMPoint(event.clientX, event.clientY);
    return point.matrixTransform(canvas.getScreenCTM().inverse());
}

// Pointer tuning value for a pointer type, in SVG user units
function pointerDistance(table, pointerType) {
    const px = table[pointerType] || table.touch;
    return px / canvas.getScreenCTM().a;
}

// Element under a screen point, or the closest one within finger reach,
// since element labels are only a few pixels wide on a phone
function findElementAt(clientX, clientY, pointerType, target) {
    const direct = getElementInfo(target);
    if (direct || !state.layout || !state.layout.sets) return direct;

    const point = new DOMPoint(clientX, clientY).matrixTransform(canvas.getScreenCTM().inverse());
    return findClosestElement(point, pointerDistance(HIT_RADIUS_PX, pointerType));
}

// Record a relation arrow unless the same one is already drawn
function addArrow(start, end) {
    const exists = state.arrows.some(arrow =>
        arrow.from === start.type && arrow.to === end.type &&
        resolveIndex(arrow.from, arrow.fromIndex, arrow.fromElement) === start.index &&
        resolveIndex(arrow.to, arrow.toIndex, arrow.toElement) === end.index);
    if (exists) {
        showToast(t('toast-arrow-exists'));
        return;
    }

    state.arrows.push({
        from: start.type,
        fromIndex: start.index,
        fromElement: start.element,
        to: end.type,
        toIndex: end.index,
        toElement: end.element
    });
    render();
    showToast(t('toast-arrow-drawn'), 'success');
}

function onPointerDown(event) {
    if (!state.layout.sets || event.button !== 0) return;
    // Function names handle their own clicks
    if (event.target.closest('[data-function-type]')) return;

    const info = findElementAt(event.clientX, event.clientY, event.pointerType, event.target);
    state.pointer = {
        id: event.pointerId,
        type: event.pointerType,
        info,
        startX: event.clientX,
        startY: event.clientY,
        dragging: false,
        target: null
    };

    if (info && getMappingFrom(info.type)) {
        // Keep receiving moves while dragging outside the element
        canvas.setPointerCapture(event.pointerId);
        event.preventDefault();
    }
}

function onPointerMove(event) {
    const pointer = state.pointer;
    if (!pointer || pointer.id !== event.pointerId || !pointer.info) return;
    if (!getMappingFrom(pointer.info.type)) return;

    if (!pointer.dragging) {
        // A finger wobbles a few pixels during a tap; only a clear move starts a drag
        const moved = Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY);
        if (moved < (DRAG_THRESHOLD_PX[pointer.type] || DRAG_THRESHOLD_PX.touch)) return;
        pointer.dragging = true;
        setSelection(pointer.info);
    }
    updateDragPreview(pointer, getSvgPoint(event));
}

function onPointerUp(event) {
    const pointer = state.pointer;
    if (!pointer || pointer.id !== event.pointerId) return;

    state.pointer = null;
    clearDragPreview();

    if (pointer.dragging) {
        finishDrag(pointer, event);
    } else {
        handleTap(pointer.info);
    }
}

function onPointerCancel(event) {
    const pointer = state.pointer;
    if (!pointer || pointer.id !== event.pointerId) return;

    state.pointer = null;
    clearDragPreview();
    if (pointer.dragging) {
        clearSelection();
    }
}

// Click-click drawing: pick a start element, then a target element
function handleTap(info) {
    const selected = state.selected;

    if (!info) {
        if (selected) {
            clearSelection();
            showToast(t('toast-selection-cancelled'));
        }
        return;
    }

    const selectedMapping = selected && getMappingFrom(selected.type);
    if (selectedMapping) {
        if (info.type === selectedMapping.to) {
            clearSelection();
            addArrow(selected, info);
            return;
        }
        if (info.type === selected.type && info.index === selected.index) {
            clearSelection();
            showToast(t('toast-selection-cancelled'));
            return;
        }
    }

    const mapping = getMappingFrom(info.type);
    if (mapping) {
        // Start (or move) the selection
        setSelection(info);
        showToast(t('toast-element-selected', {
            from: state.sets[info.type].name,
            to: state.sets[mapping.to].name
        }));
    } else if (selectedMapping) {
        clearSelection();
        showToast(t('toast-invalid-target', { to: state.sets[selectedMapping.to].name }), 'error');
    }
}

// Drag drawing: drop on (or near) an element of the target set
function finishDrag(pointer, event) {
    const mapping = getMappingFrom(pointer.info.type);
    clearSelection();

    const dropped = findElementAt(event.clientX, event.clientY, pointer.type,
        document.elementFromPoint(event.clientX, event.clientY));
    const target = pointer.target || (dropped && dropped.type === mapping.to ? dropped : null);

    if (target) {
        addArrow(pointer.info, target);
    } else if (dropped && dropped.type === pointer.info.type && dropped.index === pointer.info.index) {
        // Dragged back onto the start element: treat it as a tap and keep it selected
        handleTap(pointer.info);
    } else {
        showToast(t('toast-invalid-target', { to: state.sets[mapping.to].name }), 'error');
    }
}

// Closest element to an SVG point within maxDistance, optionally only in one set
function findClosestElement(point, maxDistance, setKey = null) {
    let closest = null;
    let minDistance = maxDistance;

    Object.entries(state.layout.sets).forEach(([key, set]) => {
        if (setKey && key !== setKey) return;
        set.points.forEach((p, index) => {
            const distance = Math.hypot(point.x - p.x, point.y - p.y);
            if (distance < minDistance) {
                minDistance = distance;
                closest = { type: key, index, element: state.sets[key].elements[index] };
            }
        });
    });

    return closest;
}

// Closest element of the target set within snap distance
function findSnapTarget(setKey, point) {
    return findClosestElement(point, SNAP_DISTANCE, setKey);
}

// Temporary arrow while dragging, snapping to a nearby target element
function updateDragPreview(pointer, point) {
    clearDragPreview();

    const { sets } = state.layout;
    const mapping = getMappingFrom(pointer.info.type);
    const start = getElementPoint(pointer.info.type, pointer.info.index, pointer.info.element);
    if (!start) return;

    pointer.target = findSnapTarget(mapping.to, point);
    let end = point;

    if (pointer.target) {
        const targetPoint = sets[mapping.to].points[pointer.target.index];
        end = { x: targetPoint.x - arrowInset(targetPoint), y: targetPoint.y };

        const snapCircle = createSvgElement('circle', { cx: targetPoint.x, cy: targetPoint.y, r: 25 });
        snapCircle.classList.add('snap-circle');
        canvas.appendChild(snapCircle);
    }

    const line = createSvgElement('line', { x1: start.x + arrowInset(start), y1: start.y, x2: end.x, y2: end.y });
    line.classList.add('temp-arrow');
    if (pointer.target) {
        line.classList.add('snapped');
    }
    canvas.appendChild(line);
}

function clearDragPreview() {
    canvas.querySelectorAll('.temp-arrow, .snap-circle').forEach(el => el.remove());
}

function readStored(key) {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        return null;
    }
}

function readStoredLanguage() {
    return readStored('preferred-language');
}

// Detect browser language and return supported language code
function detectBrowserLanguage() {
    const browserLangs = navigator.languages || [navigator.language || navigator.userLanguage || 'en'];

    for (const lang of browserLangs) {
        const langCode = lang.toLowerCase().split('-')[0]; // Get language code without region
        if (translations[langCode]) {
            return langCode;
        }
    }

    // Default to English if no supported language found
    return 'en';
}

// Language functions
function updateLanguage() {
    const strings = translations[state.currentLanguage];

    // Update HTML lang attribute
    document.documentElement.lang = state.currentLanguage;

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const text = strings[element.getAttribute('data-i18n')];
        if (text) {
            element.textContent = text;
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const text = strings[element.getAttribute('data-i18n-placeholder')];
        if (text) {
            element.placeholder = text;
        }
    });
}

// Translate a key, filling {placeholders} from params
function t(key, params = {}) {
    const template = translations[state.currentLanguage][key] || translations.en[key] || key;
    return template.replace(/\{(\w+)\}/g, (match, name) => (name in params ? params[name] : match));
}

// Toggle composition mode
function toggleCompositionMode() {
    state.compositionMode = compositionModeCheckbox.checked;
    state.selected = null;
    applyCompositionLayout();
    render();
}

// Show the third set input and widen the page for three ellipses
function applyCompositionLayout() {
    thirdSetGroup.style.display = state.compositionMode ? 'block' : 'none';
    document.body.classList.toggle('composition-mode', state.compositionMode);
}

// Reverse arrows direction
function reverseArrowsDirection() {
    state.arrowsInverse = !state.arrowsInverse;
    render();
    showToast(t('toast-arrows-reversed'), 'success');
}

// Remove relation arrows
function removeRelationArrows() {
    state.arrows = [];
    state.selected = null;
    render();
    showToast(t('toast-arrows-removed'), 'success');
}

function randomInt(n) {
    return Math.floor(Math.random() * n);
}

function shuffled(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = randomInt(i + 1);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// Random [fromIndex, toIndex] pairs of one kind of mapping from a set of n
// elements to a set of m elements, or null when the sizes don't allow that kind
function randomPairs(kind, n, m) {
    const indices = count => Array.from({ length: count }, (_, i) => i);

    switch (kind) {
        case 'function':
            return indices(n).map(i => [i, randomInt(m)]);
        case 'injective':
            return n > m ? null : shuffled(indices(m)).slice(0, n).map((j, i) => [i, j]);
        case 'bijective':
            return n !== m ? null : shuffled(indices(m)).map((j, i) => [i, j]);
        case 'constant': {
            const j = randomInt(m);
            return indices(n).map(i => [i, j]);
        }
        case 'not-function': {
            // Break a random function: leave an element without an image and/or give one two
            const pairs = indices(n).map(i => [i, randomInt(m)]);
            const leaveOneOut = m < 2 || Math.random() < 0.5;
            if (leaveOneOut) {
                pairs.splice(randomInt(pairs.length), 1);
            }
            if (m >= 2 && pairs.length > 0 && (!leaveOneOut || Math.random() < 0.3)) {
                const [i, j] = pairs[randomInt(pairs.length)];
                pairs.push([i, (j + 1 + randomInt(m - 1)) % m]);
            }
            return pairs;
        }
        default:
            return null;
    }
}

// Replace the relation arrows with a random mapping of the chosen kind
// (in composition mode, both f and g get that kind)
function drawRandomMapping() {
    if (!state.layout || !state.layout.sets) return;

    const kind = document.getElementById('random-type').value;
    const mappings = getMappings();
    const size = key => state.sets[key].elements.length;

    const blocked = mappings.find(mapping => !randomPairs(kind, size(mapping.from), size(mapping.to)));
    if (blocked) {
        const names = { from: state.sets[blocked.from].name, to: state.sets[blocked.to].name };
        showToast(t(`toast-random-${kind}-error`, names), 'error');
        return;
    }

    const generate = () => mappings.flatMap(mapping =>
        randomPairs(kind, size(mapping.from), size(mapping.to)).map(([i, j]) => ({
            from: mapping.from,
            fromIndex: i,
            fromElement: state.sets[mapping.from].elements[i],
            to: mapping.to,
            toIndex: j,
            toElement: state.sets[mapping.to].elements[j]
        })));

    // Small sets repeat often; retry a few times so each press visibly changes the drawing
    const signature = arrows => arrows
        .map(a => `${a.from}/${a.fromIndex}>${a.to}/${a.toIndex}`)
        .sort()
        .join(' ');
    const current = signature(state.arrows);
    let arrows = generate();
    for (let attempt = 0; attempt < 10 && signature(arrows) === current; attempt++) {
        arrows = generate();
    }

    state.arrows = arrows;
    state.selected = null;
    render();
    showToast(t('toast-random-drawn', { type: t(`random-type-${kind}`) }), 'success');
}

function setupFunctionNameModal() {
    const modal = document.getElementById('function-name-modal');
    const input = document.getElementById('function-name-input');

    document.getElementById('modal-ok').addEventListener('click', confirmFunctionName);
    document.getElementById('modal-cancel').addEventListener('click', closeFunctionNameModal);

    input.addEventListener('keydown', function(event) {
        // Ignore the Enter that commits Korean/Japanese IME composition
        if (event.isComposing || event.keyCode === 229) return;
        if (event.key === 'Enter') {
            confirmFunctionName();
        } else if (event.key === 'Escape') {
            closeFunctionNameModal();
        }
    });

    // Click outside the dialog closes it
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeFunctionNameModal();
        }
    });
}

// Show custom modal for function name input
function openFunctionNameModal(functionId) {
    if (functionId === 'composition') {
        showToast(t('toast-composition-auto'));
        return;
    }

    const modal = document.getElementById('function-name-modal');
    const input = document.getElementById('function-name-input');
    const currentName = functionId === 'second' ? state.secondFunctionName : state.functionName;
    const titleKey = { first: 'modal-title-first', second: 'modal-title-second' }[functionId] || 'modal-title';

    state.editingFunction = functionId;
    modal.querySelector('h3').textContent = t(titleKey, { name: currentName });
    input.value = currentName;
    modal.style.display = 'block';

    // Focus input and select text for easy editing
    setTimeout(() => {
        input.focus();
        input.select();
    }, 100);
}

function confirmFunctionName() {
    const newName = document.getElementById('function-name-input').value.trim();
    if (newName) {
        if (state.editingFunction === 'second') {
            state.secondFunctionName = newName;
        } else {
            state.functionName = newName;
        }
        render();
        showToast(t('toast-function-updated'), 'success');
    }
    closeFunctionNameModal();
}

function closeFunctionNameModal() {
    document.getElementById('function-name-modal').style.display = 'none';
    state.editingFunction = null;
}

// Serialize the drawing as a standalone SVG document
async function buildExportSvg() {
    const svgElement = canvas.cloneNode(true);
    svgElement.setAttribute('xmlns', SVG_NS);

    // Drop interaction-only overlays
    svgElement.querySelectorAll('.selection-highlight, .temp-arrow, .snap-circle').forEach(el => el.remove());
    svgElement.querySelectorAll('.element-selected').forEach(el => el.classList.remove('element-selected'));

    const style = createSvgElement('style');
    style.textContent = EXPORT_STYLE + await embeddedFontCss(svgElement);
    svgElement.insertBefore(style, svgElement.firstChild);

    return new XMLSerializer().serializeToString(svgElement);
}

// True if a CSS unicode-range (e.g. "U+ac00-ac5b,U+ff07") covers any of the code points
function unicodeRangeCovers(range, codePoints) {
    return range.split(',').some(part => {
        const [lo, hi = lo] = part.trim().replace(/^U\+/i, '').split('-');
        const start = parseInt(lo.replace(/\?/g, '0'), 16);
        const end = parseInt(hi.replace(/\?/g, 'f'), 16);
        return [...codePoints].some(cp => cp >= start && cp <= end);
    });
}

const fontDataUrls = new Map();
async function fetchDataUrl(url) {
    if (!fontDataUrls.has(url)) {
        fontDataUrls.set(url, fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.arrayBuffer();
            })
            .then(buffer => {
                const bytes = new Uint8Array(buffer);
                let binary = '';
                for (let i = 0; i < bytes.length; i += 0x8000) {
                    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
                }
                return `data:font/woff2;base64,${btoa(binary)}`;
            })
            .catch(error => {
                fontDataUrls.delete(url);
                throw error;
            }));
    }
    return fontDataUrls.get(url);
}

// @font-face rules carrying the chosen web font's glyphs that the drawing uses, so
// exported files keep the font on computers that don't have it ('' if none or offline)
async function embeddedFontCss(svgElement) {
    const font = CJK_FONTS[state.cjkFont];
    if (!font.css) return '';

    // Element labels are regular; set and function names are bold
    const codePointsOf = selector => new Set([...svgElement.querySelectorAll(selector)]
        .flatMap(el => [...el.textContent].map(ch => ch.codePointAt(0))));
    const byWeight = {
        400: codePointsOf('.cjk-text.element-text'),
        700: codePointsOf('.cjk-text.set-label, .cjk-text.function-name')
    };
    if (!byWeight[400].size && !byWeight[700].size) return '';

    try {
        const rules = await Promise.all(font.css.map(async href => {
            const css = await (await fetch(href)).text();
            const faces = css.match(/@font-face\s*{[^}]*}/g) || [];
            return Promise.all(faces.map(async face => {
                const weight = (/font-weight:\s*(\d+)/.exec(face) || [])[1] || '400';
                // A font without a bold face (handwriting) also serves bold labels
                const wanted = font.css.length > 1 ? byWeight[weight] : new Set([...byWeight[400], ...byWeight[700]]);
                const range = /unicode-range:\s*([^;]+);/.exec(face);
                const src = /url\(['"]?([^'")]+\.woff2)['"]?\)/.exec(face);
                if (!wanted || !wanted.size || !src || (range && !unicodeRangeCovers(range[1], wanted))) return '';
                const data = await fetchDataUrl(new URL(src[1], href).href);
                return face.replace(/src:[^;]+;/, `src: url(${data}) format('woff2');`);
            }));
        }));
        return '\n' + rules.flat().filter(Boolean).join('\n');
    } catch (error) {
        return '';
    }
}

function downloadFile(href, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = href;
    link.click();
}

// Save as image
async function saveAsImage() {
    const width = Number(canvas.getAttribute('width'));
    const height = Number(canvas.getAttribute('height'));
    const svgBlob = new Blob([await buildExportSvg()], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = function() {
        // High resolution for better quality
        const scale = 2;
        const canvas2d = document.createElement('canvas');
        canvas2d.width = width * scale;
        canvas2d.height = height * scale;

        const ctx = canvas2d.getContext('2d');
        ctx.scale(scale, scale);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);

        downloadFile(canvas2d.toDataURL('image/png'), 'function-mapping.png');
        showToast(t('toast-image-saved'), 'success');
    };

    img.onerror = function() {
        URL.revokeObjectURL(url);
        showToast(t('toast-save-error'), 'error');
    };

    img.src = url;
}

// Save as SVG function
async function saveAsSVG() {
    const svgBlob = new Blob([await buildExportSvg()], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    downloadFile(url, 'function-mapping.svg');

    // Revoking right away can cancel the download in some browsers
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    showToast(t('toast-svg-saved'), 'success');
}

// Show toast notification (a new toast replaces the current one)
function showToast(message, type = 'info') {
    document.querySelectorAll('.toast').forEach(el => el.remove());

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
