let draggedElement = null;
let prevPosition = null;

function parseText() {
    const input = document.getElementById('inputText').value;
    if (!input) {
        return;
    }

    const words = input.split('-').map(item => item.trim());

    const lowerCaseWords = [];
    const upperCaseWords = [];
    const numbers = [];

    words.forEach(word => {
        if (!isNaN(word)) {
            numbers.push(Number(word));
        } else if (word[0] === word[0].toLowerCase()) {
            lowerCaseWords.push(word);
        } else {
            upperCaseWords.push(word);
        }
    });

    lowerCaseWords.sort();
    upperCaseWords.sort();
    numbers.sort((x, y) => x - y);

    const associativeArray = {};
    let index = 1;
    lowerCaseWords.forEach(word => associativeArray[`a${index++}`] = word);
    index = 1;
    upperCaseWords.forEach(word => associativeArray[`b${index++}`] = word);
    index = 1;
    numbers.forEach(num => associativeArray[`n${index++}`] = num);

    displayElements(associativeArray);
}

function createDraggableElement(key, value) {
    const element = document.createElement('div');
    element.className = 'draggable-item';
    element.textContent = key + " " + value;
    element.style.backgroundColor = 'darkseagreen';
    element.setAttribute('data-key', key);
    element.setAttribute('data-value', value);
    element.setAttribute('data-original-color', getRandomColor());

    element.addEventListener('mousedown', handleMouseDown);

    return element;
}

function displayElements(array) {
    const block = document.getElementById('block2');
    block.innerHTML = '';

    for (const [key, value] of Object.entries(array)) {
        const element = createDraggableElement(key, value);
        block.appendChild(element);
    }
}

function handleClick(event) {
    const block1 = document.getElementById('wordsContainer');
    const element = document.createElement('span');
    element.textContent = event.target.dataset.value;


    element.style.marginLeft = '10px';
    block1.appendChild(element);
}

function clearDisplay() {
    document.getElementById('wordsContainer').innerHTML = '';
}

function getRandomColor() {
    const colors = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function assignListenerById(id, event, func) {
    document.getElementById(id).addEventListener(event, func);
}

function isMouseOverBlock(event, blockId, element) {
    const block = document.getElementById(blockId);
    const blockRect = block.getBoundingClientRect();
    const elementRect = element ? element.getBoundingClientRect() : {width: 0, height: 0};

    const mouseX = event.clientX + window.scrollX;
    const mouseY = event.clientY + window.scrollY;

    return (
        mouseX >= blockRect.left + window.scrollX &&
        mouseX + elementRect.width <= blockRect.right + window.scrollX &&
        mouseY >= blockRect.top + window.scrollY &&
        mouseY + elementRect.height <= blockRect.bottom + window.scrollY
    );
}

function handleMouseDown(event) {
    draggedElement = event.target;
    const pos = draggedElement.getBoundingClientRect();

    prevPosition = {
        block: isMouseOverBlock(event, 'block3') ? 'block3' : 'block2',
        x: pos.x + window.scrollX,
        y: pos.y + window.scrollY
    };
    draggedElement.style.position = 'absolute';
    draggedElement.style.zIndex = '100';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseMove(event) {
    if (draggedElement) {
        draggedElement.style.left = event.pageX + 'px';
        draggedElement.style.top = event.pageY + 'px';
    }
}

function resetElementPosition(element, block) {
    if (block === 'block2') {
        element.style.position = 'relative';
        element.style.left = '';
        element.style.top = '';
    } else {
        element.style.position = 'absolute';
        element.style.left = prevPosition.x + 'px';
        element.style.top = prevPosition.y + 'px';
    }
}

function handleMouseUp(event) {
    if (draggedElement) {
        draggedElement.style.zIndex = '10';

        if (isMouseOverBlock(event, 'block2')) {
            resetElementPosition(draggedElement, 'block2');
            draggedElement.style.backgroundColor = 'darkseagreen';
            draggedElement.style.borderRadius = '100% 0 0 100%'
        } else if (isMouseOverBlock(event, 'block3', draggedElement)) {
            draggedElement.addEventListener('click', handleClick);
            draggedElement.style.borderRadius = '100% 0 0 100%'
            draggedElement.style.backgroundColor = draggedElement.getAttribute('data-original-color');
        } else {
            resetElementPosition(draggedElement, prevPosition.block);
        }
        draggedElement = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
}

assignListenerById('buttonParse', 'click', parseText);
assignListenerById('buttonClear', 'click', clearDisplay);
