document.addEventListener('DOMContentLoaded', function() {
    const my_popover = new Popover('#openPopover', {
        placement: 'bottom',
        content: [
            {
                type: 'input',
                label: 'Enter Name:',
                id: 'nameInput',
                class: 'form-control',
                placeholder: 'John Doe',
                defaultValue: '',
                validation: /^[a-zA-Z\s]+$/
            },
            {
                type: 'datepicker',
                id: 'dobInput',
                class: 'form-control',
                name: 'Date of Birth'
            }
        ],
        cancel: {
            name: 'Cancel',
            class: 'btn-secondary',
            id: 'cancelBtn',
            type: 'hide',
            onClick: () => console.log('Popover cancelled')
        },
        submit: {
            name: 'Submit',
            class: 'btn-primary',
            id: 'submitBtn',
            type: 'submit',
            onClick: (values) => console.log('Form values:', values)
            
        }
    });

});
