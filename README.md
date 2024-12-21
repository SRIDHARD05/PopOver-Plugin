# Popover Plugin

The **Popover Plugin** is a lightweight, flexible JavaScript library for creating interactive, customizable popovers with ease. It supports a variety of elements, styles, and triggers, making it suitable for diverse use cases in modern web development.

## Features

- **Dynamic Content:** Add headers, inputs, checkboxes, date pickers, range sliders, and more.
- **Customizable:** Easily style and position your popovers with flexible options.
- **Event Handling:** Bind events to footer buttons for custom actions.
- **Lightweight:** Minimal dependencies and easy integration.

## Installation

Include the `popover.js` file in your project:

```html
<script src="popover.js"></script>
```

Alternatively, if using a module bundler:

```javascript
import Popover from './popover';
```

## Usage

### Basic Setup

```html
<!-- Trigger Element -->
<button id="popover-trigger">Click Me</button>

<!-- Initialize Popover -->
<script>
    const popover = new Popover('#popover-trigger', {
        placement: 'bottom',
        trigger: 'click',
        popover_head: [
            { title: 'Popover Header', class: 'header-class' }
        ],
        popover_body: [
            { type: 'input', id: 'username', name: 'username', placeholder: 'Enter your username', label: 'Username:' },
            { type: 'checkbox', id: 'terms', name: 'terms', items: [
                { id: 'accept-terms', label: 'I accept the terms and conditions', checked: false }
            ] },
            { type: 'datepicker', id: 'dob', name: 'dob', label: 'Date of Birth:' },
            { type: 'range', id: 'volume', name: 'volume', min: 0, max: 100, step: 5, label: 'Volume:' }
        ],
        popover_footer: {
            submit: { id: 'submit-btn', name: 'Submit', class: 'btn-submit', onClick: (data) => console.log(data) },
            cancel: { id: 'cancel-btn', name: 'Cancel', class: 'btn-cancel', onClick: () => console.log('Cancelled') }
        }
    });
</script>
```

## Configuration Options

### General Options

| Option            | Type     | Default   | Description                              |
|-------------------|----------|-----------|------------------------------------------|
| `placement`       | String   | `bottom`  | Position of the popover: `top`, `bottom`, `left`, `right`. |
| `trigger`         | String   | `click`   | Trigger type: `click` or `hover`.        |
| `style`           | Object   | `{}`      | Inline styles for the popover and arrow. |
| `class`           | Object   | `{}`      | CSS classes for the popover and arrow.   |

### Content Options

#### Header (`popover_head`)

An array of objects defining header elements:

| Property  | Type   | Description                 |
|-----------|--------|-----------------------------|
| `title`   | String | Header text.                |
| `class`   | String | CSS class for the header.   |
| `id`      | String | ID for the header element.  |

#### Body (`popover_body`)

An array of objects defining body elements:

| Property     | Type     | Description                                        |
|--------------|----------|----------------------------------------------------|
| `type`       | String   | Element type: `input`, `checkbox`, `datepicker`, etc. |
| `id`         | String   | ID of the element.                                |
| `name`       | String   | Name of the element.                              |
| `label`      | String   | Label text for the element.                       |
| `placeholder`| String   | Placeholder text (for inputs).                    |
| `defaultValue`| Any     | Default value for the element.                    |
| `items`      | Array    | For checkboxes, an array of item configurations.  |

#### Footer (`popover_footer`)

An object defining footer buttons:

| Property      | Type     | Description                                      |
|---------------|----------|--------------------------------------------------|
| `submit`      | Object   | Submit button configuration (see below).         |
| `cancel`      | Object   | Cancel button configuration (see below).         |

**Button Configuration:**

| Property  | Type     | Description                                      |
|-----------|----------|--------------------------------------------------|
| `id`      | String   | ID of the button.                               |
| `name`    | String   | Text of the button.                             |
| `class`   | String   | CSS class for the button.                       |
| `onClick` | Function | Callback function triggered on button click.     |

## Example with All Features

```html
<button id="trigger">Open Popover</button>

<script>
    const popover = new Popover('#trigger', {
        placement: 'right',
        trigger: 'click',
        popover_head: [{ title: 'Advanced Popover', class: 'header-class' }],
        popover_body: [
            { type: 'input', id: 'email', name: 'email', placeholder: 'Enter your email', label: 'Email:' },
            { type: 'checkbox', id: 'newsletter', name: 'newsletter', items: [
                { id: 'subscribe', label: 'Subscribe to newsletter', checked: true }
            ] },
            { type: 'datepicker', id: 'start-date', name: 'start-date', label: 'Start Date:' },
            { type: 'range', id: 'priority', name: 'priority', min: 1, max: 10, step: 1, label: 'Priority:' },
            { type: 'input-range', id: 'budget', name: 'budget', min: 0, max: 1000, step: 10, label: 'Budget Range:' }
        ],
        popover_footer: {
            submit: { id: 'submit', name: 'Submit', class: 'btn-primary', onClick: (data) => alert(JSON.stringify(data)) },
            cancel: { id: 'cancel', name: 'Cancel', class: 'btn-secondary', onClick: () => alert('Action cancelled') }
        }
    });
</script>
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please submit issues or pull requests to help improve this plugin.

## Support

For questions or issues, please reach out via the repository's issue tracker.

