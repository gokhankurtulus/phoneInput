# phoneInput

* Country list taken from https://countrycode.org/, there may be discrepancies or omissions, data accuracy has not been tested.
* Country flag sprite taken from https://flag-sprites.com/, there may be discrepancies or omissions, data accuracy has not been tested.

> Warning!: Different flags may appear due to countries using the same code which is given. e.g. country code of Canada and USA is 1.

### Usage

```html

<link rel="stylesheet" href="assets/phone-input-ui.min.css">
<link rel="stylesheet" href="assets/flags.css">
```

```html
<!-- This usage generates country code and list parts automatically -->
<input type="tel" name="mobile-number" id="mobile-number" required>
```
or if you want to show specific number and code from your data;
```html
<!-- Country code id should be input id + _country_code -->
<input type="tel" name="mobile-number" id="mobile-number" value="(111) 111 1111" required>
<input type="text" name="mobile-number_country_code" id="mobile-number_country_code" value="90"> <!-- This will allow you to enter code value from your data -->
```

```html
<script src="assets/phoneinput.min.js"></script>
<script>
    new PhoneInput("mobile-number", {
        defaultCountry: "TR"
    });
</script>
```

#### Optional Settings

```html
<script>
    new PhoneInput("mobile-number", {
        defaultCountry: "TR", //this sets default country by ISO Codes. when list loaded this country selected automatically if you dont give country code to related input
        plusSign: true, //puts '+' at the beginning of country code
        autoComplete: false, //allows input to be able autocomplete. autocomplete: true may corrupt formatting on input
        customMessage: 'Please enter your phone number correctly.' //this text will be shown when input is not valid
    });
</script>
```