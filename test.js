
document.addEventListener('DOMContentLoaded', function () {
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
            },
            show: {
                display: "block"
            },
            body: {
                "margin-top": "1rem"
            }
        },
        class: {
            popover: 'popover-md shadow-lg',
            arrow: 'custom-arrow',
            body: 'bg-light p-3'
        },
        content: [
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
                        id: 'terms',
                        name: 'terms',
                        label: 'I accept the terms',
                        checked: false
                    },
                    {
                        id: 'privacy',
                        name: 'privacy',
                        label: 'I accept the privacy policy',
                        checked: false
                    }
                ]
            }
        ],
        submit: {
            id: 'submit-btn',
            name: 'Submit',
            class: 'btn btn-primary',
            type: 'submit',
            onClick: function (values) {
                console.log(values); // Handle submit logic here
            }
        },
        cancel: {
            id: 'cancel-btn',
            name: 'Cancel',
            class: 'btn btn-secondary',
            type: 'hide',
            onClick: function () {
                console.log('Popover canceled'); // Handle cancel logic here
                $('.popover').popover('hide');
            }
        }
    });


});



