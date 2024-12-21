class Popover {
    constructor(triggerElement, options) {
        this.triggerElement = document.querySelector(triggerElement);
        if (!this.triggerElement) {
            throw new Error(`Element not found for selector: ${triggerElement}`);
        }
        this.options = options;
        this.popover = null;
        this.init();
    }

    init() {
        const { placement = 'bottom', trigger = 'click' } = this.options;

        if (trigger === 'click') {
            this.triggerElement.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.popover && this.popover.classList.contains('show')) {
                    this.hidePopover();
                } else {
                    this.showPopover();
                }
            });

            document.addEventListener('click', () => this.hidePopover());
        }
    }

    showPopover() {
        if (!this.popover) {
            this.createPopover();
        }
        this.applyStyles();
        this.applyClasses();
        this.positionPopover();
        this.popover.classList.add('show');
    }

    hidePopover() {
        if (this.popover) {
            this.popover.classList.remove('show');
        }
    }

    createPopover() {
        const { content = [], submit, cancel } = this.options;

        if (!this.validateContent(content)) {
            console.error('Invalid content configuration. Please check your options.');
            return;
        }

        this.popover = document.createElement('div');
        this.popover.className = 'popover interactive-popover';

        const contentHTML = this.generateContentHTML(content);
        const buttonsHTML = this.generateButtonsHTML({ submit, cancel });

        this.popover.innerHTML = `
            <div class="popover-arrow"></div>
            <div class="popover-body">
                ${contentHTML}
                <div class="d-flex justify-content-end gap-2 mt-3">
                    ${buttonsHTML}
                </div>
            </div>
        `;

        document.body.appendChild(this.popover);

        this.bindButtonEvents({ submit, cancel });
    }

    applyStyles() {
        const { style = {} } = this.options;

        if (style.popover) {
            Object.assign(this.popover.style, style.popover);
        }

        const arrow = this.popover.querySelector('.popover-arrow');
        if (arrow && style.arrow) {
            Object.assign(arrow.style, style.arrow);
        }

        const body = this.popover.querySelector('.popover-body');
        if (body && style.body) {
            Object.assign(body.style, style.body);
        }

        if (this.popover.classList.contains('show') && style.show) {
            Object.assign(this.popover.style, style.show);
        }
    }

    applyClasses() {
        const { class: classNames = {} } = this.options;

        if (classNames.popover) {
            this.popover.classList.add(...classNames.popover.split(' '));
        }

        const arrow = this.popover.querySelector('.popover-arrow');
        if (arrow && classNames.arrow) {
            arrow.classList.add(...classNames.arrow.split(' '));
        }

        const body = this.popover.querySelector('.popover-body');
        if (body && classNames.body) {
            body.classList.add(...classNames.body.split(' '));
        }
    }

    validateContent(content) {
        const validTypes = ['datepicker', 'checkbox', 'range', 'input', 'input-range'];
        return content.every((item) => {
            if (!validTypes.includes(item.type)) {
                console.error(`Unsupported content type: ${item.type}`);
                return false;
            }

            if (item.type === 'checkbox' && (!item.items || !Array.isArray(item.items))) {
                console.error('Checkbox content must have an "items" array.');
                return false;
            }

            if (item.type === 'range' && (item.min === undefined || item.max === undefined)) {
                console.error('Range content must specify "min" and "max" values.');
                return false;
            }

            if (item.type === 'input' && item.validation && !(item.validation instanceof RegExp)) {
                console.error('Input validation must be a valid regular expression.');
                return false;
            }

            if (item.type === 'input-range' && (!item.minInputId || !item.maxInputId)) {
                console.error('Input-Range must specify "minInputId" and "maxInputId".');
                return false;
            }

            return true;
        });
    }

    generateContentHTML(content) {
        return content
            .map((item) => {
                const customClasses = item.contentClasses?.join(' ') || ''; // Add user-defined classes
                switch (item.type) {
                    case 'datepicker':
                        return `<input type="date" id="${item.id}" class="${item.class} ${customClasses}" name="${item.name}">`;

                    case 'checkbox':
                        return item.items
                            .map(
                                (checkbox) => `  
                                    <div class="form-check ${customClasses}">
                                        <input type="checkbox" id="${checkbox.id}" class="form-check-input ${checkbox.class}" name="${checkbox.name}">
                                        <label for="${checkbox.id}" class="form-check-label">${checkbox.name}</label>
                                    </div>`
                            )
                            .join('');

                    case 'range':
                        return ` 
                            <label for="${item.id}" class="form-label ${customClasses}">${item.name}</label>
                            <input type="range" id="${item.id}" class="form-range ${item.class}" min="${item.min}" max="${item.max}" step="${item.step}">
                        `;

                    case 'input':
                        return ` 
                            <label for="${item.id}" class="form-label ${customClasses}">${item.label || ''}</label>
                            <input 
                                type="text" 
                                id="${item.id}" 
                                class="form-control ${item.class}" 
                                placeholder="${item.placeholder || ''}" 
                                value="${item.defaultValue || ''}" 
                                ${item.validation ? `pattern="${item.validation.source}"` : ''} 
                            >
                        `;

                    case 'input-range':
                        return ` 
                            <div class="d-flex align-items-center gap-2 ${customClasses}">
                                <label>${item.label || ''}</label>
                                <input type="number" id="${item.minInputId}" class="form-control ${item.class}" placeholder="Min" min="${item.min}" max="${item.max}">
                                <input type="number" id="${item.maxInputId}" class="form-control ${item.class}" placeholder="Max" min="${item.min}" max="${item.max}">
                            </div>
                        `;

                    default:
                        return '';
                }
            })
            .join('');
    }

    generateButtonsHTML({ submit, cancel }) {
        const buttons = [];
        if (cancel) {
            buttons.push(`
                <button class="btn ${cancel.class}" id="${cancel.id}">
                    ${cancel.name}
                </button>
            `);
        }
        if (submit) {
            buttons.push(`
                <button class="btn ${submit.class}" id="${submit.id}">
                    ${submit.name}
                </button>
            `);
        }
        return buttons.join('');
    }

    bindButtonEvents({ submit, cancel }) {
        if (cancel) {
            const cancelBtn = this.popover.querySelector(`#${cancel.id}`);
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    if (cancel.type === 'hide') {
                        this.hidePopover();
                    }
                    if (cancel.onClick) {
                        cancel.onClick();
                    }
                });
            }
        }

        if (submit) {
            const submitBtn = this.popover.querySelector(`#${submit.id}`);
            if (submitBtn) {
                submitBtn.addEventListener('click', () => {
                    const values = this.collectContentValues();
                    if (submit.type === 'submit' && submit.onClick) {
                        submit.onClick(values);
                    }
                });
            }
        }
    }

    collectContentValues() {
        const { content = [] } = this.options;
        const values = [];

        content.forEach((item) => {
            if (item.type === 'input' || item.type === 'datepicker' || item.type === 'range') {
                const element = document.getElementById(item.id);
                if (element) {
                    values.push({
                        id: item.id,
                        name: item.name || item.label || item.id,
                        value: element.value
                    });
                }
            } else if (item.type === 'checkbox') {
                item.items.forEach((checkbox) => {
                    const checkboxElement = document.getElementById(checkbox.id);
                    if (checkboxElement) {
                        values.push({
                            id: checkbox.id,
                            name: checkbox.name,
                            value: checkboxElement.checked
                        });
                    }
                });
            } else if (item.type === 'input-range') {
                const minElement = document.getElementById(item.minInputId);
                const maxElement = document.getElementById(item.maxInputId);
                if (minElement && maxElement) {
                    values.push({
                        id: item.minInputId,
                        name: `${item.label || ''} Min`,
                        value: minElement.value
                    });
                    values.push({
                        id: item.maxInputId,
                        name: `${item.label || ''} Max`,
                        value: maxElement.value
                    });
                }
            }
        });

        return values;
    }

    positionPopover() {
        const { placement = 'bottom' } = this.options;
        const triggerRect = this.triggerElement.getBoundingClientRect();
        const popoverRect = this.popover.getBoundingClientRect();

        let top = 0;
        let left = 0;

        switch (placement) {
            case 'top':
                top = triggerRect.top - popoverRect.height;
                left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
                break;
            case 'right':
                top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
                left = triggerRect.right;
                break;
            case 'bottom':
                top = triggerRect.bottom;
                left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
                break;
            case 'left':
                top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
                left = triggerRect.left - popoverRect.width;
                break;
            default:
                throw new Error(`Unknown placement: ${placement}`);
        }

        this.popover.style.top = `${top}px`;
        this.popover.style.left = `${left}px`;
        this.popover.style.position = 'absolute';
    }
}

