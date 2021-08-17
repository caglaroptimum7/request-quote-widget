# Request a Quote Widget

## Starting Environment and Bundling

**Run in development mode**
```npm
npm run dev
```

**Making a production build**
```npm
npm run build
```

## Installation & Usage

Place this code block on the ``layout/base.html`` file.

```html
<script
      id="raq-app-script"
      src="widget-script.js"
      data-storefront-token="{{settings.storefront_api.token}}"
      data-api-url="quote-request-api.url"
      data-is-active="true"
      data-min-threshold="99"
      data-cart-remove-on-success="false">
</script>
```

**Widget script: ``{{cdn 'assets/js/theme/request-quote-widget/raq-widget.js'}}``**

**Quote Request API URL: ``https://paxton-patterson-integration.opt7dev.com/api/quote``**

## Options and Attributes

- You can add many of data attributes and can be used in the React App: 

```javascript
cartRemoveOnSuccess: props.args.cartRemoveOnSuccess
```

or It has already placed on ``this.state.args`` variable.

So that you can use it like:

```javascript
this.state.args.cartRemoveOnSuccess
```

- If you want to change threshold value you should use ``data-min-threshold`` attribute

- ``data-is-active`` attribute is obviously activating the application.

- If the client wants to clear cart on successfully submitted form you can activate it ``data-cart-remove-on-success`` attribute.


