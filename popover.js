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
        } else if (trigger === 'hover') {
            this.triggerElement.addEventListener('mouseover', () => this.showPopover());
            this.triggerElement.addEventListener('mouseout', () => this.hidePopover());
        }
    }

    showPopover() {
        if (!this.popover) {
            this.createPopover();
        }
        this.applyStylesAndClasses();
        this.positionPopover();
        this.popover.classList.add('show');
    }

    hidePopover() {
        if (this.popover) {
            this.popover.classList.remove('show');
        }
    }

    createPopover() {
        const { popover_head = [], popover_body = [], popover_footer = {} } = this.options;

        this.popover = document.createElement('div');
        this.popover.className = 'popover';

        const headerHTML = this.generateHeaderHTML(popover_head);
        const bodyHTML = this.generateBodyHTML(popover_body);
        const footerHTML = this.generateFooterHTML(popover_footer);

        this.popover.innerHTML = `
            <div class="popover-arrow"></div>
            ${headerHTML ? `<div class="popover-header">${headerHTML}</div>` : ''}
            ${bodyHTML ? `<div class="popover-body">${bodyHTML}</div>` : ''}
            ${footerHTML ? `<div class="popover-footer">${footerHTML}</div>` : ''}
        `;

        document.body.appendChild(this.popover);
        this.bindFooterEvents(popover_footer);
    }

    applyStylesAndClasses() {
        const { style = {}, class: classes = {} } = this.options;

        if (style.popover) {
            Object.assign(this.popover.style, style.popover);
        }
        if (classes.popover) {
            this.popover.classList.add(...classes.popover.split(' '));
        }

        const arrow = this.popover.querySelector('.popover-arrow');
        if (arrow && style.arrow) {
            Object.assign(arrow.style, style.arrow);
        }
        if (arrow && classes.arrow) {
            arrow.classList.add(...classes.arrow.split(' '));
        }
    }

    generateHeaderHTML(headerConfig) {
        if (!headerConfig || !Array.isArray(headerConfig)) return '';
        return headerConfig
            .map(
                ({ title, class: className = '', id = '' }) =>
                    `<div class="${className}" id="${id}">${title || ''}</div>`
            )
            .join('');
    }

    generateBodyHTML(bodyConfig) {
        return bodyConfig
            .map((item) => {
                switch (item.type) {
                    case 'input':
                        return `
                            <label for="${item.id}">${item.label || ''}</label>
                            <input 
                                type="text" 
                                id="${item.id}" 
                                name="${item.name || ''}" 
                                placeholder="${item.placeholder || ''}" 
                                value="${item.defaultValue || ''}" 
                                class="${item.class || ''}" 
                            />
                        `;
                    case 'checkbox':
                        return item.items
                            .map(
                                (checkbox) => `
                                    <div>
                                        <input 
                                            type="checkbox" 
                                            id="${checkbox.id}" 
                                            name="${checkbox.name || ''}" 
                                            ${checkbox.checked ? 'checked' : ''}
                                        />
                                        <label for="${checkbox.id}">${checkbox.label || ''}</label>
                                    </div>
                                `
                            )
                            .join('');
                    case 'datepicker':
                        return `
                            <label for="${item.id}">${item.label || ''}</label>
                            <input 
                                type="date" 
                                id="${item.id}" 
                                name="${item.name || ''}" 
                                class="${item.class || ''}" 
                            />
                        `;
                    case 'range':
                        return `
                            <label for="${item.id}">${item.label || ''}</label>
                            <input 
                                type="range" 
                                id="${item.id}" 
                                name="${item.name || ''}" 
                                min="${item.min || 0}" 
                                max="${item.max || 100}" 
                                step="${item.step || 1}" 
                                class="${item.class || ''}" 
                            />
                        `;
                    case 'input-range':
                        return `
                            <label>${item.label || ''}</label>
                            <div class="d-flex justify-content-between align-items-center">
                                <input 
                                    type="range" 
                                    id="${item.id}-min" 
                                    name="${item.name || ''}_min" 
                                    min="${item.min || 0}" 
                                    max="${item.max || 100}" 
                                    step="${item.step || 1}" 
                                    class="${item.class || ''}" 
                                />
                                <input 
                                    type="range" 
                                    id="${item.id}-max" 
                                    name="${item.name || ''}_max" 
                                    min="${item.min || 0}" 
                                    max="${item.max || 100}" 
                                    step="${item.step || 1}" 
                                    class="${item.class || ''}" 
                                />
                            </div>
                        `;
                    default:
                        return '';
                }
            })
            .join('');
    }

    generateFooterHTML(footerConfig) {
        const { submit, cancel } = footerConfig;
        return `
            ${cancel
                ? `<button class="${cancel.class || ''}" id="${cancel.id}" type="button">${cancel.name || 'Cancel'}</button>`
                : ''
            }
            ${submit
                ? `<button class="${submit.class || ''}" id="${submit.id}" type="button">${submit.name || 'Submit'}</button>`
                : ''
            }
        `;
    }

    bindFooterEvents(footerConfig) {
        const { submit, cancel } = footerConfig;
        if (cancel) {
            const cancelButton = this.popover.querySelector(`#${cancel.id}`);
            if (cancelButton && cancel.onClick) {
                cancelButton.addEventListener('click', cancel.onClick);
            }
        }

        if (submit) {
            const submitButton = this.popover.querySelector(`#${submit.id}`);
            if (submitButton) {
                submitButton.addEventListener('click', () => {
                    const values = this.collectFormData();
                    if (submit.onClick) {
                        submit.onClick(values);
                    }
                });
            }
        }
    }

    collectFormData() {
        const { popover_body = [] } = this.options;
        const data = {};

        popover_body.forEach((item) => {
            if (item.type === 'input' || item.type === 'datepicker' || item.type === 'range') {
                const input = this.popover.querySelector(`#${item.id}`);
                if (input) {
                    data[item.name || item.id] = input.value;
                }
            } else if (item.type === 'checkbox') {
                data[item.name || item.id] = [];
                item.items.forEach((checkbox) => {
                    const checkboxInput = this.popover.querySelector(`#${checkbox.id}`);
                    if (checkboxInput && checkboxInput.checked) {
                        data[item.name || item.id].push(checkbox.name || checkbox.id);
                    }
                });
            } else if (item.type === 'input-range') {
                const minInput = this.popover.querySelector(`#${item.id}-min`);
                const maxInput = this.popover.querySelector(`#${item.id}-max`);
                if (minInput && maxInput) {
                    data[item.name || item.id] = {
                        min: minInput.value,
                        max: maxInput.value,
                    };
                }
            }
        });

        return data;
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
                left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
                break;
            case 'bottom':
                top = triggerRect.bottom;
                left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
                break;
            case 'left':
                top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
                left = triggerRect.left - popoverRect.width;
                break;
            case 'right':
                top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
                left = triggerRect.right;
                break;
        }

        this.popover.style.top = `${top}px`;
        this.popover.style.left = `${left}px`;
    }
}



// TODO: Example Code
document.addEventListener('DOMContentLoaded', function () {
    // Example Usage
    const popover = new Popover('#popover-trigger', {
        placement: 'bottom',
        trigger: 'click',
        style: {
            popover: {
                border: "1px solid #ddd",
                "border-radius": "5px",
                background: "#fff",
                "box-shadow": "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "1rem",
                width: "300px",
                "z-index": 1000
            },
            arrow: {
                width: "10px",
                height: "10px",
                background: "#fff",
                position: "absolute",
                transform: "rotate(45deg)",
                top: "-5px",
                left: "50%",
                "margin-left": "-5px",
                border: "1px solid #ddd",
                "z-index": -1
            }
        },
        class: {
            popover: 'popover-md shadow-lg',
            arrow: 'custom-arrow',
            body: 'bg-light p-3'
        },
        popover_head: [
            {
                title: 'Popover Title',
                class: 'custom-header',
                id: 'popover-header-id'
            }
        ],
        popover_body: [
            {
                type: 'input',
                id: 'input-field',
                name: 'username',
                label: 'Enter your username',
                placeholder: 'Username',
                defaultValue: '',
                class: 'form-control',
                validation: /^[a-zA-Z0-9_]+$/
            },
            {
                type: 'checkbox',
                id: 'checkbox-agree',
                name: 'agree',
                label: 'I agree to the terms and conditions',
                class: 'form-check-input',
                items: [
                    {
                        placeholder: 'Username',
                        class: '',
                        id: 'terms',
                        name: 'terms',
                        label: 'I accept the terms',
                        checked: false
                    }
                ]
            },
            {
                type: 'datepicker',
                id: 'start-date',
                name: 'start-date',
                label: 'Start Date:'
            },
            {
                type: 'range',
                id: 'priority',
                name: 'priority',
                min: 1,
                max: 10,
                step: 1,
                label: 'Priority:'
            },
            {
                type: 'input-range',
                id: 'budget',
                name: 'budget',
                min: 0,
                max: 1000,
                step: 10,
                label: 'Budget Range:'
            },
            {
                type: 'input',
                id: 'budget',
                name: 'budget',
                type : 'email',
                label: 'Budget Range:'
            }

        ],
        popover_footer: {
            submit: {
                id: 'submit-btn',
                name: 'Submit',
                class: 'btn btn-primary',
                type: 'submit',
                onClick: function (values) {
                    console.log('Form submitted with values:', values);
                }
            },
            cancel: {
                id: 'cancel-btn',
                name: 'Cancel',
                class: 'btn btn-secondary',
                type: 'hide',
                onClick: function () {
                    console.log('Popover canceled');
                }
            }
        }
    });

});