// Function Mapping Visualizer - Web Version
// Global State
const state = {
    functionName: 'f',
    arrowsInverse: false,
    selectedElement: null,
    arrowStartPoint: null,
    fontSize: 27,
    currentFig: { a: null, b: null },
    domainElements: [],
    codomainElements: [],
    thirdSetElements: [],
    // Drag state
    isDragging: false,
    dragStartElement: null,
    tempArrow: null,
    hoveredTarget: null,
    snapCircle: null,
    // Language state
    currentLanguage: 'en',
    // Composition function state
    compositionMode: false,
    secondFunctionName: 'g',
    // Set names
    domainName: 'X',
    codomainName: 'Y',
    thirdSetName: 'Z'
};

// Language translations
const translations = {
    en: {
        'title': 'Function Mapper',
        'domain-label': 'Domain (e.g. a,b,c):',
        'codomain-label': 'Codomain (e.g. x,y,z):',
        'font-size-label': 'Font Size:',
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
        'modal-placeholder': 'Enter function name (e.g. f, g, h)',
        'modal-ok': 'OK',
        'modal-cancel': 'Cancel',
        'domain-placeholder': 'Enter domain elements',
        'codomain-placeholder': 'Enter codomain elements',
        'third-set-label': 'Third Set (e.g. p,q,r):',
        'third-set-placeholder': 'Enter third set elements',
        'composition-mode': 'Composition Function Mode',
        'toast-domain-selected': 'Domain element selected. Click a codomain element or drag to draw arrow.',
        'toast-arrow-drawn': 'Arrow drawn successfully!',
        'toast-invalid-selection': 'Please select a codomain element to complete the arrow.',
        'toast-selection-cancelled': 'Selection cancelled.',
        'toast-drag-to-codomain': 'Please drag to a codomain element.',
        'toast-arrows-reversed': 'Arrow directions reversed!',
        'toast-function-updated': 'Function name updated!',
        'toast-arrows-removed': 'Relation arrows removed!',
        'toast-image-saved': 'PNG image saved successfully!',
        'toast-svg-saved': 'SVG file saved successfully!'
    },
    ko: {
        'title': '함수 대응 관계 그리기',
        'domain-label': '정의역 (예: a,b,c):',
        'codomain-label': '공역 (예: x,y,z):',
        'font-size-label': '글꼴 크기:',
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
        'modal-placeholder': '함수명 입력 (예: f, g, h)',
        'modal-ok': '확인',
        'modal-cancel': '취소',
        'domain-placeholder': '정의역 원소 입력',
        'codomain-placeholder': '공역 원소 입력',
        'third-set-label': '세 번째 집합 (예: p,q,r):',
        'third-set-placeholder': '세 번째 집합 원소 입력',
        'composition-mode': '합성함수 모드',
        'toast-domain-selected': '정의역 원소가 선택되었습니다. 공역 원소를 클릭하거나 드래그하세요.',
        'toast-arrow-drawn': '화살표가 성공적으로 그려졌습니다!',
        'toast-invalid-selection': '화살표를 완성하려면 공역 원소를 선택하세요.',
        'toast-selection-cancelled': '선택이 취소되었습니다.',
        'toast-drag-to-codomain': '공역 원소로 드래그하세요.',
        'toast-arrows-reversed': '화살표 방향이 바뀌었습니다!',
        'toast-function-updated': '함수명이 업데이트되었습니다!',
        'toast-arrows-removed': '관계 화살표가 제거되었습니다!',
        'toast-image-saved': 'PNG 이미지가 성공적으로 저장되었습니다!',
        'toast-svg-saved': 'SVG 파일이 성공적으로 저장되었습니다!'
    },
    ja: {
        'title': '関数対応関係作図',
        'domain-label': '定義域 (例: a,b,c):',
        'codomain-label': '値域 (例: x,y,z):',
        'font-size-label': 'フォントサイズ:',
        'instruction': '要素をクリックして矢印を描く: 定義域 → 値域',
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
        'modal-placeholder': '関数名を入力 (例: f, g, h)',
        'modal-ok': 'OK',
        'modal-cancel': 'キャンセル',
        'domain-placeholder': '定義域要素を入力',
        'codomain-placeholder': '値域要素を入力',
        'third-set-label': '第三集合 (例: p,q,r):',
        'third-set-placeholder': '第三集合要素を入力',
        'composition-mode': '合成関数モード',
        'toast-domain-selected': '定義域要素が選択されました。値域要素をクリックまたはドラッグしてください。',
        'toast-arrow-drawn': '矢印が正常に描かれました！',
        'toast-invalid-selection': '矢印を完成させるには値域要素を選択してください。',
        'toast-selection-cancelled': '選択がキャンセルされました。',
        'toast-drag-to-codomain': '値域要素にドラッグしてください。',
        'toast-arrows-reversed': '矢印の方向が逆になりました！',
        'toast-function-updated': '関数名が更新されました！',
        'toast-arrows-removed': '関係矢印が削除されました！',
        'toast-image-saved': 'PNG画像が正常に保存されました！',
        'toast-svg-saved': 'SVGファイルが正常に保存されました！'
    }
};

// SVG namespace
const SVG_NS = 'http://www.w3.org/2000/svg';

// DOM Elements
let canvas, domainInput, codomainInput, thirdSetInput, fontSizeSlider, fontSizeValue;
let domainNameInput, codomainNameInput, thirdSetNameInput;
let showFunctionCheckbox, compositionModeCheckbox, inverseBtnElement, removeArrowsBtn, saveBtn;
let thirdSetGroup;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    drawEllipses();
});

function initializeElements() {
    canvas = document.getElementById('main-canvas');
    domainInput = document.getElementById('domain-input');
    codomainInput = document.getElementById('codomain-input');
    thirdSetInput = document.getElementById('third-set-input');
    domainNameInput = document.getElementById('domain-name-input');
    codomainNameInput = document.getElementById('codomain-name-input');
    thirdSetNameInput = document.getElementById('third-set-name-input');
    thirdSetGroup = document.getElementById('third-set-group');
    fontSizeSlider = document.getElementById('font-size');
    fontSizeValue = document.getElementById('font-size-value');
    showFunctionCheckbox = document.getElementById('show-function');
    compositionModeCheckbox = document.getElementById('composition-mode');
    inverseBtnElement = document.getElementById('inverse-btn');
    removeArrowsBtn = document.getElementById('remove-arrows-btn');
    saveBtn = document.getElementById('save-btn');

    // Initialize language
    const savedLanguage = localStorage.getItem('preferred-language') || detectBrowserLanguage();
    state.currentLanguage = savedLanguage;
    document.getElementById('language-select').value = savedLanguage;
    updateLanguage();
}

function setupEventListeners() {
    // Input field event listeners
    domainInput.addEventListener('input', debounce(drawEllipses, 300));
    domainInput.addEventListener('blur', drawEllipses);

    codomainInput.addEventListener('input', debounce(drawEllipses, 300));
    codomainInput.addEventListener('blur', drawEllipses);

    thirdSetInput.addEventListener('input', debounce(drawEllipses, 300));
    thirdSetInput.addEventListener('blur', drawEllipses);

    // Name input field event listeners
    domainNameInput.addEventListener('input', function() {
        state.domainName = this.value.trim() || 'X';
        debounce(drawEllipses, 300)();
    });
    domainNameInput.addEventListener('blur', function() {
        state.domainName = this.value.trim() || 'X';
        drawEllipses();
    });

    codomainNameInput.addEventListener('input', function() {
        state.codomainName = this.value.trim() || 'Y';
        debounce(drawEllipses, 300)();
    });
    codomainNameInput.addEventListener('blur', function() {
        state.codomainName = this.value.trim() || 'Y';
        drawEllipses();
    });

    thirdSetNameInput.addEventListener('input', function() {
        state.thirdSetName = this.value.trim() || 'Z';
        debounce(drawEllipses, 300)();
    });
    thirdSetNameInput.addEventListener('blur', function() {
        state.thirdSetName = this.value.trim() || 'Z';
        drawEllipses();
    });
    
    // Font size slider
    fontSizeSlider.addEventListener('input', function() {
        state.fontSize = parseInt(this.value);
        fontSizeValue.textContent = this.value;
        updateFontSize();
    });
    
    fontSizeSlider.addEventListener('change', function() {
        state.fontSize = parseInt(this.value);
        fontSizeValue.textContent = this.value;
        updateFontSize();
    });
    
    // Checkbox and buttons
    showFunctionCheckbox.addEventListener('change', toggleFunctionArrow);
    compositionModeCheckbox.addEventListener('change', toggleCompositionMode);
    inverseBtnElement.addEventListener('click', reverseArrowsDirection);
    removeArrowsBtn.addEventListener('click', removeRelationArrows);
    saveBtn.addEventListener('click', saveAsImage);
    const saveSvgBtn = document.getElementById('save-svg-btn');
    saveSvgBtn.addEventListener('click', saveAsSVG);
    
    // Canvas event handlers for click and drag
    canvas.addEventListener('click', onCanvasClick);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseLeave);
    
    // Language selector
    document.getElementById('language-select').addEventListener('change', function() {
        state.currentLanguage = this.value;
        localStorage.setItem('preferred-language', this.value);
        updateLanguage();
    });
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Parse input elements
function parseElements(input) {
    return input.split(',')
        .map(e => e.trim())
        .filter(e => e.length > 0);
}

// Check if text is ASCII (for LaTeX rendering decision)
function isAscii(text) {
    try {
        return /^[\x00-\x7F]*$/.test(text);
    } catch (e) {
        return false;
    }
}

// Create text element with LaTeX-like formatting
function createMathText(x, y, content, className, fontSize) {
    if (isAscii(content)) {
        // For ASCII content, try to parse and render LaTeX-like formatting
        return createFormattedText(x, y, content, className, fontSize);
    } else {
        // For non-ASCII content, use simple text with appropriate font
        const text = document.createElementNS(SVG_NS, 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('font-size', fontSize);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('font-family', 'Malgun Gothic, AppleGothic, NanumGothic, DejaVu Sans, Arial, sans-serif');
        text.textContent = content;
        text.classList.add(className);
        return text;
    }
}

// Create formatted text with subscript/superscript support
function createFormattedText(x, y, content, className, fontSize) {
    const group = document.createElementNS(SVG_NS, 'g');
    group.classList.add(className);
    
    // Parse simple LaTeX-like formatting: x_1, x^2, x_{10}, x^{-1}
    const parts = parseLatexLike(content);
    let currentX = x;
    
    parts.forEach((part, index) => {
        const text = document.createElementNS(SVG_NS, 'text');
        text.setAttribute('x', currentX);
        text.setAttribute('text-anchor', index === 0 ? 'middle' : 'start');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('font-family', 'Times New Roman, STIX Two Math, Latin Modern Math, Computer Modern, serif');
        // Elements (variables) are italic, but we'll handle sets separately
        if (className === 'set-label') {
            text.setAttribute('font-style', 'normal'); // Sets are upright
            text.setAttribute('font-weight', 'bold');
        } else {
            text.setAttribute('font-style', 'italic'); // Variables are italic
        }
        text.textContent = part.text;
        
        if (part.type === 'superscript') {
            text.setAttribute('y', y - fontSize * 0.3);
            text.setAttribute('font-size', fontSize * 0.7);
        } else if (part.type === 'subscript') {
            text.setAttribute('y', y + fontSize * 0.3);
            text.setAttribute('font-size', fontSize * 0.7);
        } else {
            text.setAttribute('y', y);
            text.setAttribute('font-size', fontSize);
        }
        
        group.appendChild(text);
        
        // Estimate text width for positioning next part (serif fonts are narrower)
        const textWidth = part.text.length * fontSize * 0.55;
        if (index === 0) {
            currentX += textWidth * 0.5;
        } else {
            currentX += textWidth * 0.8;
        }
    });
    
    return group;
}

// Parse LaTeX-like formatting
function parseLatexLike(text) {
    // First, replace LaTeX symbols with Unicode equivalents
    text = text.replace(/\\circ/g, '∘');
    
    const parts = [];
    let i = 0;
    
    while (i < text.length) {
        if (text[i] === '_') {
            // Subscript
            i++; // skip _
            let subscript = '';
            if (text[i] === '{') {
                // Multi-character subscript
                i++; // skip {
                while (i < text.length && text[i] !== '}') {
                    subscript += text[i];
                    i++;
                }
                i++; // skip }
            } else {
                // Single character subscript
                subscript = text[i] || '';
                i++;
            }
            parts.push({ text: subscript, type: 'subscript' });
        } else if (text[i] === '^') {
            // Superscript
            i++; // skip ^
            let superscript = '';
            if (text[i] === '{') {
                // Multi-character superscript
                i++; // skip {
                while (i < text.length && text[i] !== '}') {
                    superscript += text[i];
                    i++;
                }
                i++; // skip }
            } else {
                // Single character superscript
                superscript = text[i] || '';
                i++;
            }
            parts.push({ text: superscript, type: 'superscript' });
        } else {
            // Regular text
            let regular = '';
            while (i < text.length && text[i] !== '_' && text[i] !== '^') {
                regular += text[i];
                i++;
            }
            if (regular) {
                parts.push({ text: regular, type: 'normal' });
            }
        }
    }
    
    // If no special formatting found, return the original text
    if (parts.length === 0) {
        parts.push({ text: text, type: 'normal' });
    }
    
    return parts;
}

// Helper function to create a text label with background
function createTextWithBackground(x, y, text, className, fontSize) {
    const group = document.createElementNS(SVG_NS, 'g');

    // Create text element first to measure its size
    const textElement = createMathText(x, y, text, className, fontSize);
    group.appendChild(textElement);

    // Temporarily add to canvas to measure
    canvas.appendChild(group);

    // Get bounding box of the text
    const bbox = textElement.getBBox ? textElement.getBBox() :
                 (textElement.querySelector ? textElement.getBBox() : { x: x - fontSize/2, y: y - fontSize/2, width: fontSize, height: fontSize });

    // Create background rectangle with padding
    const padding = fontSize * 0.3;
    const bg = document.createElementNS(SVG_NS, 'rect');
    bg.setAttribute('x', bbox.x - padding);
    bg.setAttribute('y', bbox.y - padding);
    bg.setAttribute('width', bbox.width + padding * 2);
    bg.setAttribute('height', bbox.height + padding * 2);
    bg.setAttribute('fill', 'white');
    bg.setAttribute('stroke', 'none');
    bg.setAttribute('rx', '4'); // Rounded corners

    // Remove group temporarily
    canvas.removeChild(group);

    // Insert background first, then text
    group.insertBefore(bg, textElement);

    return group;
}

// Calculate ellipse parameters
function calculateEllipseParams(domainElements, codomainElements) {
    const maxElements = Math.max(domainElements.length, codomainElements.length);
    const a = (maxElements + 1) / 2;
    const b = a / 2;
    return { a, b };
}

// Get Y positions for elements (matching original Python implementation)
function getYValues(elements, a) {
    const totalParts = elements.length + 2;
    const yValues = [];
    
    // Create linspace from a to -a with totalParts points, then take middle elements
    for (let i = 1; i < totalParts - 1; i++) {
        const y = a - (2 * a * i) / (totalParts - 1);
        yValues.push(y);
    }
    
    return yValues;
}

// Clear SVG canvas
function clearCanvas() {
    while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
    }
    
    // Add arrow marker definitions
    const defs = document.createElementNS(SVG_NS, 'defs');
    
    // Normal arrowhead (smaller and more elegant)
    const marker = document.createElementNS(SVG_NS, 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '8');
    marker.setAttribute('markerHeight', '8');
    marker.setAttribute('refX', '7');
    marker.setAttribute('refY', '4');
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('markerUnits', 'strokeWidth');
    
    const polygon = document.createElementNS(SVG_NS, 'polygon');
    polygon.setAttribute('points', '0,0 8,4 0,8');
    polygon.setAttribute('fill', '#333');
    polygon.setAttribute('stroke', 'none');
    
    marker.appendChild(polygon);
    defs.appendChild(marker);
    
    // Reverse arrowhead for inverse arrows (smaller and more elegant)
    const markerReverse = document.createElementNS(SVG_NS, 'marker');
    markerReverse.setAttribute('id', 'arrowhead-reverse');
    markerReverse.setAttribute('markerWidth', '8');
    markerReverse.setAttribute('markerHeight', '8');
    markerReverse.setAttribute('refX', '1');
    markerReverse.setAttribute('refY', '4');
    markerReverse.setAttribute('orient', 'auto');
    markerReverse.setAttribute('markerUnits', 'strokeWidth');
    
    const polygonReverse = document.createElementNS(SVG_NS, 'polygon');
    polygonReverse.setAttribute('points', '8,0 0,4 8,8');
    polygonReverse.setAttribute('fill', '#333');
    polygonReverse.setAttribute('stroke', 'none');
    
    markerReverse.appendChild(polygonReverse);
    defs.appendChild(markerReverse);
    
    canvas.appendChild(defs);
}

// Draw ellipses and elements
function drawEllipses() {
    const domainElementsStr = domainInput.value.trim();
    const codomainElementsStr = codomainInput.value.trim();
    const thirdSetElementsStr = state.compositionMode ? thirdSetInput.value.trim() : '';
    
    if (!domainElementsStr || !codomainElementsStr || (state.compositionMode && !thirdSetElementsStr)) {
        clearCanvas();
        return;
    }
    
    state.domainElements = parseElements(domainElementsStr);
    state.codomainElements = parseElements(codomainElementsStr);
    state.thirdSetElements = state.compositionMode ? parseElements(thirdSetElementsStr) : [];
    
    if (state.domainElements.length === 0 || state.codomainElements.length === 0 || 
        (state.compositionMode && state.thirdSetElements.length === 0)) {
        clearCanvas();
        return;
    }
    
    const allElements = state.compositionMode ? 
        [state.domainElements, state.codomainElements, state.thirdSetElements] :
        [state.domainElements, state.codomainElements];
    
    const { a, b } = calculateEllipseParams(...allElements);
    state.currentFig.a = a;
    state.currentFig.b = b;
    
    clearCanvas();
    
    // Set canvas viewBox for proper scaling
    const canvasWidth = state.compositionMode ? 1000 : 700;
    const canvasHeight = 600;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    // Scale factors
    const totalWidth = state.compositionMode ? (6 * b) : (4 * b); // 3 ellipses vs 2 ellipses
    const scaleX = (canvasWidth * 0.8) / totalWidth;
    const scaleY = (canvasHeight * 0.8) / (2 * a + b);
    const scale = Math.min(scaleX, scaleY);
    
    if (state.compositionMode) {
        // Draw 3 ellipses: A -> B -> C
        // Domain ellipse (A, leftmost)
        const domainEllipse = document.createElementNS(SVG_NS, 'ellipse');
        domainEllipse.setAttribute('cx', centerX - 2.5 * b * scale);
        domainEllipse.setAttribute('cy', centerY);
        domainEllipse.setAttribute('rx', b * scale);
        domainEllipse.setAttribute('ry', a * scale);
        domainEllipse.classList.add('domain-ellipse');
        canvas.appendChild(domainEllipse);
        
        // Codomain ellipse (B, middle)
        const codomainEllipse = document.createElementNS(SVG_NS, 'ellipse');
        codomainEllipse.setAttribute('cx', centerX);
        codomainEllipse.setAttribute('cy', centerY);
        codomainEllipse.setAttribute('rx', b * scale);
        codomainEllipse.setAttribute('ry', a * scale);
        codomainEllipse.classList.add('codomain-ellipse');
        canvas.appendChild(codomainEllipse);
        
        // Third set ellipse (C, rightmost)
        const thirdSetEllipse = document.createElementNS(SVG_NS, 'ellipse');
        thirdSetEllipse.setAttribute('cx', centerX + 2.5 * b * scale);
        thirdSetEllipse.setAttribute('cy', centerY);
        thirdSetEllipse.setAttribute('rx', b * scale);
        thirdSetEllipse.setAttribute('ry', a * scale);
        thirdSetEllipse.classList.add('third-set-ellipse');
        canvas.appendChild(thirdSetEllipse);
    } else {
        // Draw 2 ellipses: A -> B
        // Domain ellipse (left)
        const domainEllipse = document.createElementNS(SVG_NS, 'ellipse');
        domainEllipse.setAttribute('cx', centerX - 1.5 * b * scale);
        domainEllipse.setAttribute('cy', centerY);
        domainEllipse.setAttribute('rx', b * scale);
        domainEllipse.setAttribute('ry', a * scale);
        domainEllipse.classList.add('domain-ellipse');
        canvas.appendChild(domainEllipse);
        
        // Codomain ellipse (right)
        const codomainEllipse = document.createElementNS(SVG_NS, 'ellipse');
        codomainEllipse.setAttribute('cx', centerX + 1.5 * b * scale);
        codomainEllipse.setAttribute('cy', centerY);
        codomainEllipse.setAttribute('rx', b * scale);
        codomainEllipse.setAttribute('ry', a * scale);
        codomainEllipse.classList.add('codomain-ellipse');
        canvas.appendChild(codomainEllipse);
    }
    
    // Draw elements based on mode
    const domainYValues = getYValues(state.domainElements, a);
    const codomainYValues = getYValues(state.codomainElements, a);
    
    if (state.compositionMode) {
        // Draw domain elements (A, leftmost)
        state.domainElements.forEach((element, i) => {
            const mathElement = createMathText(
                centerX - 2.5 * b * scale, 
                centerY - domainYValues[i] * scale, 
                element, 
                'element-text', 
                state.fontSize
            );
            mathElement.setAttribute('data-element', element);
            mathElement.setAttribute('data-type', 'domain');
            mathElement.setAttribute('data-index', i);
            mathElement.style.cursor = 'pointer';
            canvas.appendChild(mathElement);
        });
        
        // Draw codomain elements (B, middle)
        state.codomainElements.forEach((element, i) => {
            const mathElement = createMathText(
                centerX, 
                centerY - codomainYValues[i] * scale, 
                element, 
                'element-text', 
                state.fontSize
            );
            mathElement.setAttribute('data-element', element);
            mathElement.setAttribute('data-type', 'codomain');
            mathElement.setAttribute('data-index', i);
            mathElement.style.cursor = 'pointer';
            canvas.appendChild(mathElement);
        });
        
        // Draw third set elements (C, rightmost)
        const thirdSetYValues = getYValues(state.thirdSetElements, a);
        state.thirdSetElements.forEach((element, i) => {
            const mathElement = createMathText(
                centerX + 2.5 * b * scale, 
                centerY - thirdSetYValues[i] * scale, 
                element, 
                'element-text', 
                state.fontSize
            );
            mathElement.setAttribute('data-element', element);
            mathElement.setAttribute('data-type', 'third-set');
            mathElement.setAttribute('data-index', i);
            mathElement.style.cursor = 'pointer';
            canvas.appendChild(mathElement);
        });
    } else {
        // Draw domain elements (left)
        state.domainElements.forEach((element, i) => {
            const mathElement = createMathText(
                centerX - 1.5 * b * scale, 
                centerY - domainYValues[i] * scale, 
                element, 
                'element-text', 
                state.fontSize
            );
            mathElement.setAttribute('data-element', element);
            mathElement.setAttribute('data-type', 'domain');
            mathElement.setAttribute('data-index', i);
            mathElement.style.cursor = 'pointer';
            canvas.appendChild(mathElement);
        });
        
        // Draw codomain elements (right)
        state.codomainElements.forEach((element, i) => {
            const mathElement = createMathText(
                centerX + 1.5 * b * scale, 
                centerY - codomainYValues[i] * scale, 
                element, 
                'element-text', 
                state.fontSize
            );
            mathElement.setAttribute('data-element', element);
            mathElement.setAttribute('data-type', 'codomain');
            mathElement.setAttribute('data-index', i);
            mathElement.style.cursor = 'pointer';
            canvas.appendChild(mathElement);
        });
    }
    
    // Draw set labels (overlapping with ellipse top, with white background)
    const labelSize = Math.max(24, state.fontSize * 1.1);
    
    if (state.compositionMode) {
        // Domain label with dynamic background
        const domainLabelX = centerX - 2.5 * b * scale;
        const domainLabelY = centerY - a * scale;
        const domainLabel = createTextWithBackground(
            domainLabelX,
            domainLabelY,
            state.domainName,
            'set-label',
            labelSize
        );
        canvas.appendChild(domainLabel);

        // Codomain label with dynamic background
        const codomainLabelX = centerX;
        const codomainLabelY = centerY - a * scale;
        const codomainLabel = createTextWithBackground(
            codomainLabelX,
            codomainLabelY,
            state.codomainName,
            'set-label',
            labelSize
        );
        canvas.appendChild(codomainLabel);

        // Third set label with dynamic background
        const thirdSetLabelX = centerX + 2.5 * b * scale;
        const thirdSetLabelY = centerY - a * scale;
        const thirdSetLabel = createTextWithBackground(
            thirdSetLabelX,
            thirdSetLabelY,
            state.thirdSetName,
            'set-label',
            labelSize
        );
        canvas.appendChild(thirdSetLabel);
    } else {
        // Domain label with dynamic background
        const domainLabelX = centerX - 1.5 * b * scale;
        const domainLabelY = centerY - a * scale;
        const domainLabel = createTextWithBackground(
            domainLabelX,
            domainLabelY,
            state.domainName,
            'set-label',
            labelSize
        );
        canvas.appendChild(domainLabel);

        // Codomain label with dynamic background
        const codomainLabelX = centerX + 1.5 * b * scale;
        const codomainLabelY = centerY - a * scale;
        const codomainLabel = createTextWithBackground(
            codomainLabelX,
            codomainLabelY,
            state.codomainName,
            'set-label',
            labelSize
        );
        canvas.appendChild(codomainLabel);
    }
    
    // Store positions for click detection (needed for drawFunctionArrow)
    if (state.compositionMode) {
        state.canvasParams = {
            centerX, centerY, scale, a, b,
            domainCenter: { x: centerX - 2.5 * b * scale, y: centerY },
            codomainCenter: { x: centerX, y: centerY },
            thirdSetCenter: { x: centerX + 2.5 * b * scale, y: centerY }
        };
    } else {
        state.canvasParams = {
            centerX, centerY, scale, a, b,
            domainCenter: { x: centerX - 1.5 * b * scale, y: centerY },
            codomainCenter: { x: centerX + 1.5 * b * scale, y: centerY }
        };
    }
    
    // Draw function arrow if enabled
    if (showFunctionCheckbox && showFunctionCheckbox.checked) {
        drawFunctionArrow();
    }
}

// Draw the main function arrow
function drawFunctionArrow() {
    if (!state.currentFig.a || !state.currentFig.b || !state.canvasParams) return;
    
    const { centerX, centerY, scale, b } = state.canvasParams;
    
    // Remove existing function arrow and name (more thorough cleanup)
    const existingArrows = canvas.querySelectorAll('.function-arrow');
    const existingNames = canvas.querySelectorAll('.function-name');
    existingArrows.forEach(arrow => arrow.remove());
    existingNames.forEach(name => name.remove());
    
    // Remove any groups that might contain function elements
    const allGroups = canvas.querySelectorAll('g');
    allGroups.forEach(group => {
        if (group.classList.contains('function-name')) {
            group.remove();
        }
    });
    
    // Remove any text elements that might be function names
    const allTexts = canvas.querySelectorAll('text');
    allTexts.forEach(text => {
        if (text.classList.contains('function-name')) {
            text.remove();
        }
    });
    
    if (state.compositionMode) {
        // Draw two function arrows: f: X→Y and g: Y→Z
        const arrowY = centerY - state.currentFig.a * scale; // Same height as X, Y, Z labels
        
        // First function arrow (f: X→Y)
        const line1 = document.createElementNS(SVG_NS, 'line');
        const startX1 = centerX - 2.5 * b * scale + 0.5 * b * scale;
        const endX1 = centerX - 0.5 * b * scale;
        
        line1.setAttribute('x1', startX1);
        line1.setAttribute('y1', arrowY);
        line1.setAttribute('x2', endX1);
        line1.setAttribute('y2', arrowY);
        line1.setAttribute('stroke', '#2980b9'); // Blue for f
        line1.setAttribute('stroke-width', '2');
        line1.classList.add('function-arrow');
        
        if (state.arrowsInverse) {
            line1.setAttribute('marker-start', 'url(#arrowhead-reverse)');
            line1.removeAttribute('marker-end');
        } else {
            line1.setAttribute('marker-end', 'url(#arrowhead)');
            line1.removeAttribute('marker-start');
        }
        
        canvas.appendChild(line1);
        
        // Second function arrow (g: Y→Z)
        const line2 = document.createElementNS(SVG_NS, 'line');
        const startX2 = centerX + 0.5 * b * scale;
        const endX2 = centerX + 2.5 * b * scale - 0.5 * b * scale;
        
        line2.setAttribute('x1', startX2);
        line2.setAttribute('y1', arrowY);
        line2.setAttribute('x2', endX2);
        line2.setAttribute('y2', arrowY);
        line2.setAttribute('stroke', '#e74c3c'); // Red for g
        line2.setAttribute('stroke-width', '2');
        line2.classList.add('function-arrow');
        
        if (state.arrowsInverse) {
            line2.setAttribute('marker-start', 'url(#arrowhead-reverse)');
            line2.removeAttribute('marker-end');
        } else {
            line2.setAttribute('marker-end', 'url(#arrowhead)');
            line2.removeAttribute('marker-start');
        }
        
        canvas.appendChild(line2);
        
        // Draw function names
        const nameSize = Math.max(18, state.fontSize * 0.9);
        
        // First function name (f) - clickable
        const functionNameText1 = state.arrowsInverse ? `${state.functionName}^{-1}` : state.functionName;
        const functionText1 = createMathText(
            (startX1 + endX1) / 2, 
            arrowY - nameSize * 0.7,
            functionNameText1, 
            'function-name', 
            nameSize
        );
        functionText1.setAttribute('data-function-type', 'first');
        functionText1.style.cursor = 'pointer';
        functionText1.addEventListener('click', () => changeFunctionNameClick('first'));
        canvas.appendChild(functionText1);
        
        // Second function name (g) - clickable
        const functionNameText2 = state.arrowsInverse ? `${state.secondFunctionName}^{-1}` : state.secondFunctionName;
        const functionText2 = createMathText(
            (startX2 + endX2) / 2, 
            arrowY - nameSize * 0.7,
            functionNameText2, 
            'function-name', 
            nameSize
        );
        functionText2.setAttribute('data-function-type', 'second');
        functionText2.style.cursor = 'pointer';
        functionText2.addEventListener('click', () => changeFunctionNameClick('second'));
        canvas.appendChild(functionText2);
        
        // Draw composition function arc (g∘f: X → Z)
        const compositionArc = document.createElementNS(SVG_NS, 'path');
        const startXComp = centerX - 2.5 * b * scale + 0.5 * b * scale;
        const endXComp = centerX + 2.5 * b * scale - 0.5 * b * scale;
        const arcStartY = arrowY - 15; // Start/end points slightly above f,g arrows
        
        // Create curved path from X to Z (arc above the straight arrows)
        const controlY = arcStartY - Math.abs(endXComp - startXComp) * 0.25; // Arc upward, higher to avoid overlap
        const pathData = `M ${startXComp} ${arcStartY} Q ${(startXComp + endXComp) / 2} ${controlY} ${endXComp} ${arcStartY}`;
        
        compositionArc.setAttribute('d', pathData);
        compositionArc.setAttribute('stroke', '#27ae60'); // Green for composition
        compositionArc.setAttribute('stroke-width', '2');
        compositionArc.setAttribute('fill', 'none');
        compositionArc.classList.add('function-arrow');
        compositionArc.classList.add('composition-arrow');
        
        if (state.arrowsInverse) {
            compositionArc.setAttribute('marker-start', 'url(#arrowhead-reverse)');
            compositionArc.removeAttribute('marker-end');
        } else {
            compositionArc.setAttribute('marker-end', 'url(#arrowhead)');
            compositionArc.removeAttribute('marker-start');
        }
        
        canvas.appendChild(compositionArc);
        
        // Draw composition function name (g∘f) above the arc
        const compositionNameText = state.arrowsInverse ? 
            `(${state.functionName} \\circ ${state.secondFunctionName})^{-1}` : 
            `${state.secondFunctionName} \\circ ${state.functionName}`;
        const compositionText = createMathText(
            (startXComp + endXComp) / 2, 
            controlY + nameSize * 0.7, // Position below the arc vertex for visibility
            compositionNameText, 
            'function-name', 
            nameSize * 0.9 // Slightly smaller
        );
        compositionText.setAttribute('data-function-type', 'composition');
        compositionText.style.cursor = 'pointer';
        compositionText.style.fill = '#333'; // Black color
        compositionText.addEventListener('click', () => changeFunctionNameClick('composition'));
        canvas.appendChild(compositionText);
        
    } else {
        // Draw single arrow at the same height as X, Y labels
        const line = document.createElementNS(SVG_NS, 'line');
        const startX = centerX - 1.5 * b * scale + 0.5 * b * scale;
        const endX = centerX + 1.5 * b * scale - 0.5 * b * scale;
        const arrowY = centerY - state.currentFig.a * scale; // Same height as X, Y labels
        
        line.setAttribute('x1', startX);
        line.setAttribute('y1', arrowY);
        line.setAttribute('x2', endX);
        line.setAttribute('y2', arrowY);
        line.setAttribute('stroke', '#333');
        line.setAttribute('stroke-width', '2');
        line.classList.add('function-arrow');
        
        if (state.arrowsInverse) {
            line.setAttribute('marker-start', 'url(#arrowhead-reverse)');
            line.removeAttribute('marker-end');
        } else {
            line.setAttribute('marker-end', 'url(#arrowhead)');
            line.removeAttribute('marker-start');
        }
        
        canvas.appendChild(line);
        
        // Draw function name (slightly above the arrow) - clickable
        const nameSize = Math.max(18, state.fontSize * 0.9);
        const functionNameText = state.arrowsInverse ? `${state.functionName}^{-1}` : state.functionName;
        const functionText = createMathText(
            centerX, 
            arrowY - nameSize * 0.7, // Position above the arrow
            functionNameText, 
            'function-name', 
            nameSize
        );
        functionText.setAttribute('data-function-type', 'single');
        functionText.style.cursor = 'pointer';
        functionText.addEventListener('click', () => changeFunctionNameClick('single'));
        canvas.appendChild(functionText);
    }
}

// Handle canvas clicks (fallback for click-only interaction)
function onCanvasClick(event) {
    // Skip if this was part of a drag operation
    if (state.isDragging || state.dragStartElement) return;
    
    const clickedElement = findElementFromPoint(event.clientX, event.clientY);
    
    if (clickedElement && clickedElement.getAttribute('data-element')) {
        const elementName = clickedElement.getAttribute('data-element');
        const elementType = clickedElement.getAttribute('data-type');
        const elementIndex = parseInt(clickedElement.getAttribute('data-index'));
        
        if (!state.arrowStartPoint) {
            // First click - select start point
            if (state.compositionMode) {
                // In composition mode: allow domain (X) or codomain (Y) as start
                if (elementType === 'domain' || elementType === 'codomain') {
                    state.arrowStartPoint = {
                        element: elementName,
                        type: elementType,
                        index: elementIndex,
                        domElement: clickedElement
                    };
                    
                    // Highlight selected element with a circle
                    removeElementHighlights();
                    clickedElement.classList.add('element-selected');
                    
                    // Add selection circle
                    const bbox = clickedElement.getBBox();
                    const circle = document.createElementNS(SVG_NS, 'circle');
                    circle.setAttribute('cx', bbox.x + bbox.width / 2);
                    circle.setAttribute('cy', bbox.y + bbox.height / 2);
                    circle.setAttribute('r', Math.max(bbox.width, bbox.height) / 2 + 5);
                    circle.setAttribute('fill', 'none');
                    circle.setAttribute('stroke', '#3498db');
                    circle.setAttribute('stroke-width', '2');
                    circle.classList.add('selection-highlight');
                    canvas.appendChild(circle);
                    
                    const startMessage = elementType === 'domain' ? 
                        'X element selected. Click Y element for f arrow.' : 
                        'Y element selected. Click Z element for g arrow.';
                    showToast(startMessage);
                }
            } else {
                // In normal mode: only domain as start
                if (elementType === 'domain') {
                    state.arrowStartPoint = {
                        element: elementName,
                        type: elementType,
                        index: elementIndex,
                        domElement: clickedElement
                    };
                    
                    // Highlight selected element with a circle
                    removeElementHighlights();
                    clickedElement.classList.add('element-selected');
                    
                    // Add selection circle
                    const bbox = clickedElement.getBBox();
                    const circle = document.createElementNS(SVG_NS, 'circle');
                    circle.setAttribute('cx', bbox.x + bbox.width / 2);
                    circle.setAttribute('cy', bbox.y + bbox.height / 2);
                    circle.setAttribute('r', Math.max(bbox.width, bbox.height) / 2 + 5);
                    circle.setAttribute('fill', 'none');
                    circle.setAttribute('stroke', '#e74c3c');
                    circle.setAttribute('stroke-width', '2');
                    circle.classList.add('selection-highlight');
                    canvas.appendChild(circle);
                    
                    showToast(t('toast-domain-selected'));
                }
            }
        } else {
            // Second click - draw arrow
            if (state.compositionMode) {
                // In composition mode: validate arrow direction
                const startType = state.arrowStartPoint.type;
                if ((startType === 'domain' && elementType === 'codomain') ||
                    (startType === 'codomain' && elementType === 'third-set')) {
                    
                    drawRelationArrow(state.arrowStartPoint, {
                        element: elementName,
                        type: elementType,
                        index: elementIndex,
                        domElement: clickedElement
                    });
                    
                    // Reset selection
                    removeElementHighlights();
                    state.arrowStartPoint = null;
                    showToast(t('toast-arrow-drawn'), 'success');
                } else {
                    // Invalid arrow direction
                    removeElementHighlights();
                    state.arrowStartPoint = null;
                    showToast('Invalid arrow direction. Use X→Y or Y→Z.', 'error');
                }
            } else {
                // In normal mode: domain to codomain only
                if (elementType === 'codomain') {
                    drawRelationArrow(state.arrowStartPoint, {
                        element: elementName,
                        type: elementType,
                        index: elementIndex,
                        domElement: clickedElement
                    });
                    
                    // Reset selection
                    removeElementHighlights();
                    state.arrowStartPoint = null;
                    showToast(t('toast-arrow-drawn'), 'success');
                } else {
                    // Invalid second click
                    removeElementHighlights();
                    state.arrowStartPoint = null;
                    showToast(t('toast-invalid-selection'), 'error');
                }
            }
        }
    } else {
        // Click outside elements - reset selection
        if (state.arrowStartPoint) {
            removeElementHighlights();
            state.arrowStartPoint = null;
            showToast(t('toast-selection-cancelled'));
        }
    }
}

// Remove element highlights
function removeElementHighlights() {
    const highlighted = canvas.querySelectorAll('.element-selected');
    highlighted.forEach(el => el.classList.remove('element-selected'));
    
    const circles = canvas.querySelectorAll('.selection-highlight');
    circles.forEach(circle => circle.remove());
}

// Draw relation arrow between two elements
function drawRelationArrow(startInfo, endInfo) {
    if (!state.canvasParams) return;
    
    const { centerX, centerY, scale, a, b } = state.canvasParams;
    
    let startX, startY, endX, endY, arrowColor, arrowClass;
    
    if (state.compositionMode) {
        // Calculate positions based on arrow type
        const domainYValues = getYValues(state.domainElements, a);
        const codomainYValues = getYValues(state.codomainElements, a);
        const thirdSetYValues = getYValues(state.thirdSetElements, a);
        
        if (startInfo.type === 'domain' && endInfo.type === 'codomain') {
            // f: X → Y (blue arrow)
            startX = centerX - 2.5 * b * scale + 0.15 * b * scale;
            startY = centerY - domainYValues[startInfo.index] * scale;
            endX = centerX - 0.15 * b * scale;
            endY = centerY - codomainYValues[endInfo.index] * scale;
            arrowColor = '#2980b9'; // Blue for f
            arrowClass = 'f-relation-arrow';
        } else if (startInfo.type === 'codomain' && endInfo.type === 'third-set') {
            // g: Y → Z (red arrow)
            startX = centerX + 0.15 * b * scale;
            startY = centerY - codomainYValues[startInfo.index] * scale;
            endX = centerX + 2.5 * b * scale - 0.15 * b * scale;
            endY = centerY - thirdSetYValues[endInfo.index] * scale;
            arrowColor = '#e74c3c'; // Red for g
            arrowClass = 'g-relation-arrow';
        } else {
            return; // Invalid arrow type
        }
    } else {
        // Normal mode: domain to codomain
        const domainYValues = getYValues(state.domainElements, a);
        const codomainYValues = getYValues(state.codomainElements, a);
        
        startX = centerX - 1.5 * b * scale + 0.15 * b * scale;
        startY = centerY - domainYValues[startInfo.index] * scale;
        endX = centerX + 1.5 * b * scale - 0.15 * b * scale;
        endY = centerY - codomainYValues[endInfo.index] * scale;
        arrowColor = '#333'; // Black for normal mode
        arrowClass = 'relation-arrow';
    }
    
    // Create straight line arrow
    const line = document.createElementNS(SVG_NS, 'line');
    
    // Apply arrow direction based on current state
    if (state.arrowsInverse) {
        // Reverse direction: swap start and end points
        line.setAttribute('x1', endX);
        line.setAttribute('y1', endY);
        line.setAttribute('x2', startX);
        line.setAttribute('y2', startY);
        line.setAttribute('marker-start', 'url(#arrowhead-reverse)');
        line.removeAttribute('marker-end');
    } else {
        // Normal direction
        line.setAttribute('x1', startX);
        line.setAttribute('y1', startY);
        line.setAttribute('x2', endX);
        line.setAttribute('y2', endY);
        line.setAttribute('marker-end', 'url(#arrowhead)');
        line.removeAttribute('marker-start');
    }
    
    line.setAttribute('stroke', arrowColor);
    line.setAttribute('stroke-width', '1.5');
    line.classList.add('relation-arrow');
    line.classList.add(arrowClass);
    
    canvas.appendChild(line);
}

// Mouse down handler - start drag or select
function onMouseDown(event) {
    const clickedElement = findElementFromPoint(event.clientX, event.clientY);
    
    if (clickedElement && clickedElement.getAttribute('data-element')) {
        const elementType = clickedElement.getAttribute('data-type');
        
        // Check if element can be a drag start point
        let canStartDrag = false;
        if (state.compositionMode) {
            // In composition mode: allow domain (X) or codomain (Y) as drag start
            canStartDrag = (elementType === 'domain' || elementType === 'codomain');
        } else {
            // In normal mode: only domain as drag start
            canStartDrag = (elementType === 'domain');
        }
        
        if (canStartDrag) {
            state.isDragging = true;
            state.dragStartElement = {
                element: clickedElement.getAttribute('data-element'),
                type: elementType,
                index: parseInt(clickedElement.getAttribute('data-index')),
                domElement: clickedElement
            };
            
            // Highlight the start element
            removeElementHighlights();
            clickedElement.classList.add('element-selected');
            
            const bbox = clickedElement.getBBox();
            const circle = document.createElementNS(SVG_NS, 'circle');
            circle.setAttribute('cx', bbox.x + bbox.width / 2);
            circle.setAttribute('cy', bbox.y + bbox.height / 2);
            circle.setAttribute('r', Math.max(bbox.width, bbox.height) / 2 + 5);
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', '#3498db');
            circle.setAttribute('stroke-width', '2');
            circle.classList.add('selection-highlight');
            canvas.appendChild(circle);
            
            event.preventDefault();
        }
    }
}

// Mouse move handler - show temporary arrow while dragging
function onMouseMove(event) {
    if (!state.isDragging || !state.dragStartElement) return;
    
    // Remove previous temporary elements
    if (state.tempArrow) {
        state.tempArrow.remove();
        state.tempArrow = null;
    }
    if (state.snapCircle) {
        state.snapCircle.remove();
        state.snapCircle = null;
    }
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Get start position based on drag start element type
    const { centerX, centerY, scale, a, b } = state.canvasParams;
    let startX, startY;
    
    if (state.compositionMode) {
        if (state.dragStartElement.type === 'domain') {
            // Dragging from X
            const domainYValues = getYValues(state.domainElements, a);
            startX = centerX - 2.5 * b * scale + 0.15 * b * scale;
            startY = centerY - domainYValues[state.dragStartElement.index] * scale;
        } else if (state.dragStartElement.type === 'codomain') {
            // Dragging from Y
            const codomainYValues = getYValues(state.codomainElements, a);
            startX = centerX + 0.15 * b * scale;
            startY = centerY - codomainYValues[state.dragStartElement.index] * scale;
        }
    } else {
        // Normal mode: dragging from domain
        const domainYValues = getYValues(state.domainElements, a);
        startX = centerX - 1.5 * b * scale + 0.15 * b * scale;
        startY = centerY - domainYValues[state.dragStartElement.index] * scale;
    }
    
    // Find closest target element for snapping
    const closestTarget = findClosestTargetElement(mouseX, mouseY);
    
    let endX = mouseX;
    let endY = mouseY;
    let arrowColor = '#3498db';
    let arrowStyle = '5,5'; // dashed
    
    // Set arrow color based on function type
    if (state.compositionMode) {
        if (state.dragStartElement.type === 'domain') {
            arrowColor = '#2980b9'; // Blue for f (X→Y)
        } else if (state.dragStartElement.type === 'codomain') {
            arrowColor = '#e74c3c'; // Red for g (Y→Z)
        }
    }
    
    if (closestTarget) {
        // Snap to closest element
        let adjustmentX = 0;
        if (state.compositionMode) {
            if (state.dragStartElement.type === 'codomain') {
                adjustmentX = -0.15 * b * scale; // Y→Z
            } else {
                adjustmentX = -0.15 * b * scale; // X→Y
            }
        } else {
            adjustmentX = -0.15 * b * scale; // Normal mode
        }
        
        endX = closestTarget.x + adjustmentX;
        endY = closestTarget.y;
        arrowStyle = 'none'; // Solid line when snapped
        state.hoveredTarget = closestTarget;
        
        // Create snap circle around target element
        const snapCircle = document.createElementNS(SVG_NS, 'circle');
        snapCircle.setAttribute('cx', closestTarget.x);
        snapCircle.setAttribute('cy', closestTarget.y);
        snapCircle.setAttribute('r', 25);
        snapCircle.setAttribute('fill', 'none');
        snapCircle.setAttribute('stroke', '#27ae60');
        snapCircle.setAttribute('stroke-width', '3');
        snapCircle.setAttribute('opacity', '0.8');
        snapCircle.classList.add('snap-circle');
        canvas.appendChild(snapCircle);
        state.snapCircle = snapCircle;
    } else {
        state.hoveredTarget = null;
    }
    
    // Create temporary arrow line
    const tempLine = document.createElementNS(SVG_NS, 'line');
    tempLine.setAttribute('x1', startX);
    tempLine.setAttribute('y1', startY);
    tempLine.setAttribute('x2', endX);
    tempLine.setAttribute('y2', endY);
    tempLine.setAttribute('stroke', arrowColor);
    tempLine.setAttribute('stroke-width', '2');
    if (arrowStyle !== 'none') {
        tempLine.setAttribute('stroke-dasharray', arrowStyle);
    }
    tempLine.setAttribute('opacity', '0.8');
    tempLine.classList.add('temp-arrow');
    
    canvas.appendChild(tempLine);
    state.tempArrow = tempLine;
}

// Mouse up handler - complete drag and draw arrow
function onMouseUp(event) {
    if (!state.isDragging) return;
    
    // Check if we have a snapped target first (priority over direct click)
    if (state.hoveredTarget) {
        // Use the snapped target
        const endInfo = {
            element: state.hoveredTarget.element,
            type: state.hoveredTarget.type,
            index: state.hoveredTarget.index
        };
        
        drawRelationArrow(state.dragStartElement, endInfo);
        showToast(t('toast-arrow-drawn'), 'success');
    } else {
        // Fallback to direct click detection
        const clickedElement = findElementFromPoint(event.clientX, event.clientY);
        
        if (clickedElement && clickedElement.getAttribute('data-element')) {
            const elementType = clickedElement.getAttribute('data-type');
            
            if (elementType === 'codomain') {
                // Draw the final arrow
                const endInfo = {
                    element: clickedElement.getAttribute('data-element'),
                    type: elementType,
                    index: parseInt(clickedElement.getAttribute('data-index')),
                    domElement: clickedElement
                };
                
                drawRelationArrow(state.dragStartElement, endInfo);
                showToast(t('toast-arrow-drawn'), 'success');
            } else {
                showToast(t('toast-drag-to-codomain'), 'error');
            }
        } else {
            showToast(t('toast-drag-to-codomain'), 'error');
        }
    }
    
    // Clean up drag state
    cleanupDrag();
}

// Mouse leave handler - cancel drag if mouse leaves canvas
function onMouseLeave(event) {
    if (state.isDragging) {
        cleanupDrag();
    }
}

// Helper function to find element from point
function findElementFromPoint(clientX, clientY) {
    let clickedElement = document.elementFromPoint(clientX, clientY);
    
    while (clickedElement && !clickedElement.getAttribute('data-element')) {
        clickedElement = clickedElement.parentElement;
        if (clickedElement === canvas || !clickedElement) {
            clickedElement = null;
            break;
        }
    }
    
    return clickedElement;
}

// Find the closest target element within snap distance
function findClosestTargetElement(mouseX, mouseY, snapDistance = 50) {
    if (!state.canvasParams || !state.dragStartElement) return null;
    
    const { centerX, centerY, scale, a, b } = state.canvasParams;
    let closestElement = null;
    let minDistance = snapDistance;
    
    if (state.compositionMode) {
        if (state.dragStartElement.type === 'domain') {
            // Dragging from X: look for Y elements
            const codomainYValues = getYValues(state.codomainElements, a);
            const codomainCenterX = centerX;
            
            state.codomainElements.forEach((element, index) => {
                const elementY = centerY - codomainYValues[index] * scale;
                const distance = Math.sqrt(
                    Math.pow(mouseX - codomainCenterX, 2) + 
                    Math.pow(mouseY - elementY, 2)
                );
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestElement = {
                        element: element,
                        type: 'codomain',
                        index: index,
                        x: codomainCenterX,
                        y: elementY,
                        distance: distance
                    };
                }
            });
        } else if (state.dragStartElement.type === 'codomain') {
            // Dragging from Y: look for Z elements
            const thirdSetYValues = getYValues(state.thirdSetElements, a);
            const thirdSetCenterX = centerX + 2.5 * b * scale;
            
            state.thirdSetElements.forEach((element, index) => {
                const elementY = centerY - thirdSetYValues[index] * scale;
                const distance = Math.sqrt(
                    Math.pow(mouseX - thirdSetCenterX, 2) + 
                    Math.pow(mouseY - elementY, 2)
                );
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestElement = {
                        element: element,
                        type: 'third-set',
                        index: index,
                        x: thirdSetCenterX,
                        y: elementY,
                        distance: distance
                    };
                }
            });
        }
    } else {
        // Normal mode: dragging from domain, look for codomain
        const codomainYValues = getYValues(state.codomainElements, a);
        const codomainCenterX = centerX + 1.5 * b * scale;
        
        state.codomainElements.forEach((element, index) => {
            const elementY = centerY - codomainYValues[index] * scale;
            const distance = Math.sqrt(
                Math.pow(mouseX - codomainCenterX, 2) + 
                Math.pow(mouseY - elementY, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                closestElement = {
                    element: element,
                    type: 'codomain',
                    index: index,
                    x: codomainCenterX,
                    y: elementY,
                    distance: distance
                };
            }
        });
    }
    
    return closestElement;
}

// Clean up drag state
function cleanupDrag() {
    state.isDragging = false;
    state.dragStartElement = null;
    state.hoveredTarget = null;
    
    if (state.tempArrow) {
        state.tempArrow.remove();
        state.tempArrow = null;
    }
    
    if (state.snapCircle) {
        state.snapCircle.remove();
        state.snapCircle = null;
    }
    
    removeElementHighlights();
}

// Utility function to escape regex characters
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Detect browser language and return supported language code
function detectBrowserLanguage() {
    // Get browser language preferences
    const browserLang = navigator.language || navigator.userLanguage;
    const browserLangs = navigator.languages || [browserLang];
    
    // Supported languages in our app
    const supportedLangs = ['en', 'ko', 'ja'];
    
    // Check each browser language preference
    for (const lang of browserLangs) {
        const langCode = lang.toLowerCase().split('-')[0]; // Get language code without region
        
        if (supportedLangs.includes(langCode)) {
            return langCode;
        }
    }
    
    // Default to English if no supported language found
    return 'en';
}

// Language functions
function updateLanguage() {
    const lang = state.currentLanguage;
    const t = translations[lang];
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            element.textContent = t[key];
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            element.placeholder = t[key];
        }
    });
}

function t(key) {
    return translations[state.currentLanguage][key] || key;
}

// Toggle composition mode
function toggleCompositionMode() {
    state.compositionMode = compositionModeCheckbox.checked;
    
    const container = document.querySelector('.container');
    
    if (state.compositionMode) {
        // Show third set input
        thirdSetGroup.style.display = 'block';
        // Expand canvas width for 3 ellipses
        canvas.setAttribute('width', '1000');
        // Expand container max-width to accommodate larger canvas
        container.style.maxWidth = '1500px';
    } else {
        // Hide third set input
        thirdSetGroup.style.display = 'none';
        // Reset canvas width for 2 ellipses
        canvas.setAttribute('width', '700');
        // Reset container max-width
        container.style.maxWidth = '1200px';
    }
    
    // Redraw ellipses
    drawEllipses();
}

// Update font size
function updateFontSize() {
    // Redraw all elements with new font size
    drawEllipses();
}

// Toggle function arrow visibility
function toggleFunctionArrow() {
    if (showFunctionCheckbox.checked) {
        drawFunctionArrow();
    } else {
        // Remove all function arrows
        const arrows = canvas.querySelectorAll('.function-arrow');
        arrows.forEach(arrow => arrow.remove());
        
        // Remove all function names (including groups and text elements)
        const names = canvas.querySelectorAll('.function-name');
        names.forEach(name => name.remove());
        
        const allGroups = canvas.querySelectorAll('g');
        allGroups.forEach(group => {
            if (group.classList.contains('function-name')) {
                group.remove();
            }
        });
        
        const allTexts = canvas.querySelectorAll('text');
        allTexts.forEach(text => {
            if (text.classList.contains('function-name')) {
                text.remove();
            }
        });
    }  
}

// Reverse arrows direction
function reverseArrowsDirection() {
    state.arrowsInverse = !state.arrowsInverse;
    
    // Update all line arrows (including relation arrows and function arrows)
    const lineArrows = canvas.querySelectorAll('.relation-arrow, .function-arrow:not(.composition-arrow), .f-relation-arrow, .g-relation-arrow');
    lineArrows.forEach(arrow => {
        // Get current coordinates
        const x1 = arrow.getAttribute('x1');
        const y1 = arrow.getAttribute('y1');
        const x2 = arrow.getAttribute('x2');
        const y2 = arrow.getAttribute('y2');
        
        if (state.arrowsInverse) {
            // Reverse direction: swap coordinates and use reverse marker
            arrow.setAttribute('x1', x2);
            arrow.setAttribute('y1', y2);
            arrow.setAttribute('x2', x1);
            arrow.setAttribute('y2', y1);
            arrow.setAttribute('marker-start', 'url(#arrowhead-reverse)');
            arrow.removeAttribute('marker-end');
        } else {
            // Normal direction: swap back coordinates and use normal marker
            arrow.setAttribute('x1', x2);
            arrow.setAttribute('y1', y2);
            arrow.setAttribute('x2', x1);
            arrow.setAttribute('y2', y1);
            arrow.setAttribute('marker-end', 'url(#arrowhead)');
            arrow.removeAttribute('marker-start');
        }
    });
    
    // Update composition arrows (path elements) separately
    const pathArrows = canvas.querySelectorAll('.composition-arrow');
    pathArrows.forEach(arrow => {
        if (state.arrowsInverse) {
            arrow.setAttribute('marker-start', 'url(#arrowhead-reverse)');
            arrow.removeAttribute('marker-end');
        } else {
            arrow.setAttribute('marker-end', 'url(#arrowhead)');
            arrow.removeAttribute('marker-start');
        }
    });
    
    // Update function name - redraw the function arrow to update LaTeX
    if (showFunctionCheckbox.checked) {
        drawFunctionArrow();
    }
    
    showToast(t('toast-arrows-reversed'), 'success');
}

// Change function name by clicking on it
function changeFunctionNameClick(functionType) {
    showFunctionNameModal(functionType);
}

// Show custom modal for function name input
function showFunctionNameModal(functionType = 'single') {
    const modal = document.getElementById('function-name-modal');
    const input = document.getElementById('function-name-input');
    const okBtn = document.getElementById('modal-ok');
    const cancelBtn = document.getElementById('modal-cancel');
    const modalTitle = modal.querySelector('h3');
    
    // Set modal title and current function name based on type
    if (functionType === 'first') {
        modalTitle.textContent = `Change First Function Name (${state.functionName})`;
        input.value = state.functionName;
    } else if (functionType === 'second') {
        modalTitle.textContent = `Change Second Function Name (${state.secondFunctionName})`;
        input.value = state.secondFunctionName;
    } else if (functionType === 'composition') {
        modalTitle.textContent = 'Composition functions are automatically named';
        input.value = `${state.secondFunctionName}∘${state.functionName}`;
        input.disabled = true;
        showToast('Composition function name is automatically generated from f and g', 'info');
        return; // Don't show the modal for composition
    } else {
        modalTitle.textContent = 'Change Function Name';
        input.value = state.functionName;
    }
    
    modal.style.display = 'block';
    
    // Focus input and select text for easy editing
    setTimeout(() => {
        input.focus();
        input.select();
    }, 100);
    
    // Handle OK button
    const handleOk = () => {
        const newName = input.value.trim();
        if (newName) {
            // Update the appropriate function name
            if (functionType === 'first') {
                state.functionName = newName;
            } else if (functionType === 'second') {
                state.secondFunctionName = newName;
            } else {
                state.functionName = newName;
            }
            
            // Force immediate update by directly calling drawEllipses if function is currently shown
            if (showFunctionCheckbox && showFunctionCheckbox.checked) {
                drawEllipses();
            }
            
            showToast(t('toast-function-updated'), 'success');
        }
        hideModal();
    };
    
    // Handle Cancel button
    const handleCancel = () => {
        hideModal();
    };
    
    // Handle Enter key
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            handleOk();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };
    
    // Hide modal function
    const hideModal = () => {
        modal.style.display = 'none';
        okBtn.removeEventListener('click', handleOk);
        cancelBtn.removeEventListener('click', handleCancel);
        input.removeEventListener('keydown', handleEnter);
        modal.removeEventListener('click', handleModalClick);
    };
    
    // Handle click outside modal
    const handleModalClick = (e) => {
        if (e.target === modal) {
            handleCancel();
        }
    };
    
    // Add event listeners
    okBtn.addEventListener('click', handleOk);
    cancelBtn.addEventListener('click', handleCancel);
    input.addEventListener('keydown', handleEnter);
    modal.addEventListener('click', handleModalClick);
}

// Remove relation arrows
function removeRelationArrows() {
    const relationArrows = canvas.querySelectorAll('.relation-arrow, .f-relation-arrow, .g-relation-arrow');
    relationArrows.forEach(arrow => arrow.remove());
    showToast(t('toast-arrows-removed'), 'success');
}

// Save as image
function saveAsImage() {
    const svgElement = canvas.cloneNode(true);
    
    // Add proper SVG namespace and styling
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgElement.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    
    // Create a style element with all necessary CSS
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
        .domain-ellipse, .codomain-ellipse, .third-set-ellipse {
            fill: none;
            stroke: #333;
            stroke-width: 2;
        }
        .element-text {
            font-family: 'Times New Roman', 'STIX Two Math', 'Latin Modern Math', 'Computer Modern', serif;
            text-anchor: middle;
            dominant-baseline: central;
            fill: #333;
            font-style: italic;
        }
        .set-label {
            font-family: 'Times New Roman', 'STIX Two Math', 'Latin Modern Math', 'Computer Modern', serif;
            font-weight: bold;
            font-style: normal;
            text-anchor: middle;
            dominant-baseline: central;
            fill: #333;
        }
        .function-arrow, .relation-arrow, .f-relation-arrow, .g-relation-arrow {
            fill: none;
        }
        .function-arrow {
            stroke: #333;
            stroke-width: 2;
        }
        .relation-arrow {
            stroke: #333;
            stroke-width: 1.5;
        }
        .f-relation-arrow {
            stroke: #333;
            stroke-width: 1.5;
        }
        .g-relation-arrow {
            stroke: #333;
            stroke-width: 1.5;
        }
        .composition-arrow {
            stroke: #333;
            stroke-width: 2;
        }
        .function-name {
            font-family: 'Times New Roman', 'STIX Two Math', 'Latin Modern Math', 'Computer Modern', serif;
            font-weight: bold;
            font-style: italic;
            text-anchor: middle;
            dominant-baseline: central;
            fill: #333;
        }
    `;
    
    // Insert style as first child
    svgElement.insertBefore(style, svgElement.firstChild);
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas2d = document.createElement('canvas');
    const ctx = canvas2d.getContext('2d');
    
    // Get SVG actual dimensions
    const svgRect = canvas.getBoundingClientRect();
    const svgWidth = canvas.getAttribute('width') || svgRect.width;
    const svgHeight = canvas.getAttribute('height') || svgRect.height;
    
    // High resolution for better quality
    const scale = 2;
    canvas2d.width = svgWidth * scale;
    canvas2d.height = svgHeight * scale;
    ctx.scale(scale, scale);
    
    const img = new Image();
    
    img.onload = function() {
        // Clear canvas with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, svgWidth, svgHeight);
        
        // Draw the SVG image maintaining original aspect ratio
        ctx.drawImage(img, 0, 0, svgWidth, svgHeight);
        
        // Download image
        const link = document.createElement('a');
        link.download = 'function-mapping.png';
        link.href = canvas2d.toDataURL('image/png', 1.0);
        link.click();
        
        // Clean up
        URL.revokeObjectURL(url);
        
        showToast(t('toast-image-saved'), 'success');
    };
    
    img.onerror = function() {
        showToast('Error saving image. Please try again.', 'error');
    };
    
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.src = url;
}

// Save as SVG function
function saveAsSVG() {
    const svgElement = canvas.cloneNode(true);
    
    // Add proper SVG namespace and styling
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgElement.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    
    // Create a style element with all necessary CSS for SVG
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
        .domain-ellipse, .codomain-ellipse, .third-set-ellipse {
            fill: none;
            stroke: #333;
            stroke-width: 2;
        }
        .element-text {
            font-family: 'Times New Roman', 'STIX Two Math', 'Latin Modern Math', 'Computer Modern', serif;
            text-anchor: middle;
            dominant-baseline: central;
            fill: #333;
            font-style: italic;
        }
        .set-label {
            font-family: 'Times New Roman', 'STIX Two Math', 'Latin Modern Math', 'Computer Modern', serif;
            font-weight: bold;
            font-style: normal;
            text-anchor: middle;
            dominant-baseline: central;
            fill: #333;
        }
        .function-arrow, .relation-arrow, .f-relation-arrow, .g-relation-arrow {
            fill: none;
        }
        .function-arrow {
            stroke: #333;
            stroke-width: 2;
        }
        .relation-arrow {
            stroke: #333;
            stroke-width: 1.5;
        }
        .f-relation-arrow {
            stroke: #333;
            stroke-width: 1.5;
        }
        .g-relation-arrow {
            stroke: #333;
            stroke-width: 1.5;
        }
        .composition-arrow {
            stroke: #333;
            stroke-width: 2;
        }
        .function-name {
            font-family: 'Times New Roman', 'STIX Two Math', 'Latin Modern Math', 'Computer Modern', serif;
            font-weight: bold;
            font-style: italic;
            text-anchor: middle;
            dominant-baseline: central;
            fill: #333;
        }
    `;
    
    // Insert style element at the beginning of SVG
    svgElement.insertBefore(style, svgElement.firstChild);
    
    // Serialize SVG to string
    const svgData = new XMLSerializer().serializeToString(svgElement);
    
    // Create and download SVG file
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const link = document.createElement('a');
    link.download = 'function-mapping.svg';
    link.href = url;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    
    showToast(t('toast-svg-saved'), 'success');
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}