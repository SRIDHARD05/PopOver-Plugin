class Popover {
    /**
     * Creates an instance of the Popover class.
     * @param {string} triggerElement - The CSS selector for the element that triggers the popover.
     * @param {Object} options - Configuration options for the popover.
     * @param {string} [options.placement='bottom'] - The position of the popover relative to the trigger element.
     * @param {string} [options.trigger='click'] - The event that triggers the popover (e.g., 'click', 'hover').
     * @param {Array} options.content - An array of content objects that define the form elements in the popover.
     * @param {Object} [options.submit] - Configuration for the submit button.
     * @param {Object} [options.cancel] - Configuration for the cancel button.
     */
    constructor(triggerElement, options) {
        this.triggerElement = document.querySelector(triggerElement);
        if (!this.triggerElement) {
            throw new Error(`Element not found for selector: ${triggerElement}`);
        }
        this.options = options;
        this.popover = null;
        this.init();
    }

    /**
     * Initializes the popover and sets up event listeners.
     */
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

    /**
     * Validates the content configuration to ensure it contains valid fields.
     * @param {Array} content - The content configuration array.
     * @returns {boolean} - True if the content is valid, otherwise false.
     * @private
     */
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

    /**
     * Generates HTML for the content based on the content configuration.
     * @param {Array} content - The content configuration array.
     * @returns {string} - The HTML string for the content.
     * @private
     */
    generateContentHTML(content) {
        return content
            .map((item) => {
                switch (item.type) {
                    case 'datepicker':
                        return `<input type="date" id="${item.id}" class="${item.class}" name="${item.name}">`;

                    case 'checkbox':
                        return item.items
                            .map(
                                (checkbox) => `  
                                    <div class="form-check">
                                        <input type="checkbox" id="${checkbox.id}" class="form-check-input ${checkbox.class}" name="${checkbox.name}">
                                        <label for="${checkbox.id}" class="form-check-label">${checkbox.name}</label>
                                    </div>`
                            )
                            .join('');

                    case 'range':
                        return ` 
                            <label for="${item.id}" class="form-label">${item.name}</label>
                            <input type="range" id="${item.id}" class="form-range ${item.class}" min="${item.min}" max="${item.max}" step="${item.step}">
                        `;

                    case 'input':
                        return `
                            <label for="${item.id}" class="form-label">${item.label || ''}</label>
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
                            <div class="d-flex align-items-center gap-2">
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

    /**
     * Generates HTML for the buttons based on the submit and cancel configuration.
     * @param {Object} buttons - The submit and cancel button configuration.
     * @param {Object} buttons.submit - The submit button configuration.
     * @param {Object} buttons.cancel - The cancel button configuration.
     * @returns {string} - The HTML string for the buttons.
     * @private
     */
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

    /**
     * Binds event listeners to the buttons inside the popover (submit, cancel).
     * @param {Object} buttons - The submit and cancel button configuration.
     * @param {Object} buttons.submit - The submit button configuration.
     * @param {Object} buttons.cancel - The cancel button configuration.
     * @private
     */
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

    /**
     * Collects the current values of the form elements inside the popover.
     * @returns {Array} - An array of objects containing the form values.
     * @private
     */
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

    /**
     * Positions the popover on the screen relative to the trigger element.
     * @private
     */
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
