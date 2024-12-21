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
                type: 'email',
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



