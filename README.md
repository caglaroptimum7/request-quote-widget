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
      data-is-active="true"
      data-min-threshold="99"
      data-cart-remove-on-success="false"
      data-access-token="vCztSQeVwjPshCBYLHyOmJNEoCLNm8RM">
</script>
```

**Widget script: ``{{cdn 'assets/js/theme/request-quote-widget/raq-widget.js'}}``**

**Access Token: ``"vCztSQeVwjPshCBYLHyOmJNEoCLNm8RM"`` 

It comes from the request a quote auth API: ``https://raq-auth-api-server.herokuapp.com/client/:accessToken`` **

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

- If the client wants to clear the cart after successfully submitted the form you can activate it from ``data-cart-remove-on-success`` attribute.


