class PhoneInput {
    constructor(inpudID, options = {}) {
        this.input = document.getElementById(inpudID);
        this.container = null;

        this.countryCodeContainer = null;
        this.countryCodeInput = null;
        this.countryCodeFlag = null;

        this.countryListContainer = null;
        this.searchInput = null;

        this.defaultCountry = options.defaultCountry || 'TR'
        this.plusSign = options.plusSign || false;
        this.autoComplete = options.autoComplete || false;
        this.customMessage = options.customMessage || 'Please enter your phone number correctly.'

        this.defaultCode = countries[this.defaultCountry].code;
        this.defaultFlag = countries[this.defaultCountry].flag;

        this.currentCountry = countries[this.defaultCountry];
        this.currentFormat = this.currentCountry.format;
        this.bindEvents();
    }

    formatPhoneNumber(format, digit) {
        const formatChars = format.split('');
        let formattedOutput = this.input.value || "";
        for (let index = 0; index < formatChars.length; index++) {
            if (formattedOutput.length <= index) {
                const char = formatChars[index];
                if (char === '#') {
                    formattedOutput += digit;
                    break;
                } else {
                    formattedOutput += char;
                }

            }
        }
        this.input.value = formattedOutput;
        if (!this.validatePhoneNumber(formattedOutput, format))
            this.input.setCustomValidity(this.customMessage);
        else
            this.input.setCustomValidity('');
    }

    validatePhoneNumber(phoneNumber, format) {
        const escapedFormat = format.replace(/([()[{*+.$^\\|?])/g, '\\$1');
        const pattern = escapedFormat.replace(/#/g, '\\d');
        const regex = new RegExp(pattern);
        return regex.test(phoneNumber);
    }

    createInputContainer() {
        let inputIndex = Array.from(this.input.parentElement.children).indexOf(this.input);

        this.container = document.createElement('div');
        this.container.classList.add("phone__input");
        //insert created container to input's index to prevent displacement
        this.input.parentElement.insertBefore(this.container, this.input.parentElement.children[inputIndex]);
    }

    createCountryCodeInput() {
        // country code input's name is given input name + _country_code
        let countryCodeInputName = this.input.id + '_country_code';
        this.createCountryCodePart(countryCodeInputName);
    }

    createCountryCodeWithoutInput(codeInput) {
        let newDiv = document.createElement('div');
        newDiv.innerHTML = CountryCodeWithoutInput(this.defaultFlag);
        this.container.appendChild(newDiv.firstElementChild);
        this.countryCodeContainer = this.container.getElementsByClassName("country__code")[0];
        this.countryCodeFlag = this.countryCodeContainer.getElementsByClassName("fg flag")[0];
        this.countryCodeInput = codeInput;
        this.countryCodeInput.classList.add("country__code__input");
        this.countryCodeContainer.appendChild(this.countryCodeInput);
    }

    createCountryCodePart(countryCodeInputName) {
        let plusSign = "";
        if (this.plusSign)
            plusSign = "+";
        let newDiv = document.createElement('div');
        newDiv.innerHTML = CountryCodeTemplate(plusSign, countryCodeInputName, this.defaultCode, this.defaultFlag);
        this.container.appendChild(newDiv.firstElementChild);
        this.countryCodeContainer = this.container.getElementsByClassName("country__code")[0];
        this.countryCodeInput = this.countryCodeContainer.getElementsByClassName("country__code__input")[0];
        this.countryCodeFlag = this.countryCodeContainer.getElementsByClassName("fg flag")[0];
    }

    createCountryListTemplate() {
        let newDiv = document.createElement('div');
        newDiv.innerHTML = CountryListTemplate();
        this.container.appendChild(newDiv.firstElementChild);
        this.countryListContainer = this.container.getElementsByClassName("country__list")[0];
        this.searchInput = this.container.getElementsByClassName("search__on__list")[0];
    }

    createCountryListItems() {
        let plusSign = "";
        if (this.plusSign)
            plusSign = "+";
        Object.entries(countries).forEach(entry => {
            const [key, country] = entry;
            let newDiv = document.createElement('div');
            newDiv.innerHTML = CountryListItemTemplate(plusSign, country.flag, country.name, country.code, key);
            newDiv.firstElementChild.addEventListener("click", (event) => {
                this.setCountry(key);
            })
            this.countryListContainer.appendChild(newDiv.firstElementChild);
        });
    }

    blockNonDigitChars() {
        let regex = new RegExp("^[0-9]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

        if (!regex.test(key) && event.keyCode !== 13) {
            event.preventDefault();
            return false;
        }
    }

    closeCountryLists() {
        let countryLists = document.querySelectorAll(".country__list");
        if (countryLists.length)
            countryLists.forEach(item => {
                item.style.display = "none";
            });
    }

    openCountryList() {
        this.countryListContainer.style.display = "flex";
    }

    searchOnCountryList(elem) {
        if (elem) {
            let searchText = elem.value;
            let items = this.countryListContainer.getElementsByClassName("country__list__item");
            items = Array.from(items);
            items.forEach(item => {
                let countryName = item.getElementsByClassName("country-name")[0];
                let countryCode = item.getElementsByClassName("country-code")[0];
                if (!countryName.innerHTML.toLowerCase().includes(searchText) && !countryCode.innerHTML.toLowerCase().includes(searchText)) {
                    item.style.display = "none";
                } else {
                    item.style.display = "flex";
                }
            });
        }
    }

    changeCountryByCountryCode() {
        Object.entries(countries).forEach(entry => {
            const [key, country] = entry;
            if (country.code === this.countryCodeInput.value) {
                this.setCountry(key);
                return false;
            }
        });
    }

    setCountry(ISO) {
        this.currentCountry = countries[ISO];
        this.currentFormat = this.currentCountry.format;
        this.input.value = "";
        this.countryCodeInput.value = this.plusSign ? '+' + this.currentCountry.code : this.currentCountry.code;
        this.countryCodeFlag.className = "fg flag " + this.currentCountry.flag;
    }

    bindEvents() {
        this.createInputContainer();
        let countryCodeInput = document.getElementById(this.input.id + '_country_code');
        if (countryCodeInput) {
            this.createCountryCodeWithoutInput(countryCodeInput);
            this.changeCountryByCountryCode();
        } else
            this.createCountryCodeInput();
        this.createCountryListTemplate();
        this.createCountryListItems();
        this.countryCodeInput.readOnly = true;
        this.countryCodeInput.addEventListener('focus', () => {
            this.countryCodeInput.readOnly = true;
        });

        this.container.appendChild(this.input);
        this.closeCountryLists();

        this.input.addEventListener("keypress", (event) => {
            this.blockNonDigitChars()
        });
        this.input.addEventListener("keypress", (event) => {
            if (/\d/.test(event.key))
                this.formatPhoneNumber(this.currentFormat, event.key);
            event.preventDefault();
        });
        this.countryCodeContainer.addEventListener("click", (event) => {
            this.closeCountryLists();
            event.stopPropagation();
            this.openCountryList();
            this.searchInput.focus();
        });
        this.countryCodeContainer.addEventListener("keypress", (event) => {
            if (event.which === 13) {
                event.preventDefault();
                this.closeCountryLists();
                event.stopPropagation();
                this.openCountryList();
                this.searchInput.focus();
            }
        });
        this.searchInput.addEventListener("click", (event) => {
            event.stopPropagation();
        });
        this.searchInput.addEventListener("input", () => {
            this.searchOnCountryList(this.searchInput);
        });
        document.addEventListener("click", (event) => {
            this.closeCountryLists();
        })
        if (this.autoComplete === true) {
            this.input.setAttribute('autocomplete', 'on');
            this.countryCodeInput.setAttribute('autocomplete', 'on');
            this.searchInput.setAttribute('autocomplete', 'on');
        } else {
            this.input.setAttribute('autocomplete', 'off');
            this.countryCodeInput.setAttribute('autocomplete', 'off');
            this.searchInput.setAttribute('autocomplete', 'off');
        }
    }
}

const CountryCodeWithoutInput = (default_flag) => `
        <div class="country__code">
            <div class="selected__flag">
                <div class="fg flag ${default_flag}"></div>
            </div>
        </div>
`;
const CountryCodeTemplate = (plus_sign, input_name, default_code, default_flag) => `
        <div class="country__code">
            <div class="selected__flag">
                <div class="fg flag ${default_flag}"></div>
            </div>
            <input type="text" class="country__code__input" name="${input_name}" id="${input_name}" readonly value="${plus_sign}${default_code}">
        </div>
`;
const CountryListTemplate = () => `
        <ul class="country__list">
        <li class="country__search__container"><input class="search__on__list"></li>
        </ul>
`;
const CountryListItemTemplate = (plus_sign, flag, name, code, iso) => `
            <li class="country__list__item" data-iso-code="${iso}" data-country-code="${plus_sign}${code}" data-country-flag="${flag}">
                <div class="flag ${flag}"></div>
                <div class="country-name">${name}</div>
                <div class="country-code">${plus_sign}${code}</div>
            </li>
`;
const countries = {
    "AF": {"name": "Afghanistan", "code": "93", "flag": "flag-af", "format": "### ### ####"},
    "AL": {"name": "Albania", "code": "355", "flag": "flag-al", "format": "## ### ####"},
    "DZ": {"name": "Algeria", "code": "213", "flag": "flag-dz", "format": "0 ### ## ## ##"},
    "AD": {"name": "Andorra", "code": "376", "flag": "flag-ad", "format": "### ###"},
    "AO": {"name": "Angola", "code": "244", "flag": "flag-ao", "format": "### ### ###"},
    "AG": {"name": "Antigua and Barbuda", "code": "1-268", "flag": "flag-ag", "format": "(268) ###-####"},
    "AR": {"name": "Argentina", "code": "54", "flag": "flag-ar", "format": "## ####-####"},
    "AM": {"name": "Armenia", "code": "374", "flag": "flag-am", "format": "## ### ###"},
    "AU": {"name": "Australia", "code": "61", "flag": "flag-au", "format": "#### ### ###"},
    "AT": {"name": "Austria", "code": "43", "flag": "flag-at", "format": "#### ### ###"},
    "AZ": {"name": "Azerbaijan", "code": "994", "flag": "flag-az", "format": "### ### ## ##"},
    "BS": {"name": "Bahamas", "code": "1-242", "flag": "flag-bs", "format": "(242) ###-####"},
    "BH": {"name": "Bahrain", "code": "973", "flag": "flag-bh", "format": "#### ####"},
    "BD": {"name": "Bangladesh", "code": "880", "flag": "flag-bd", "format": "## #######"},
    "BB": {"name": "Barbados", "code": "1-246", "flag": "flag-bb", "format": "(246) #####"},
    "BY": {"name": "Belarus", "code": "375", "flag": "flag-by", "format": "## ### ## ##"},
    "BE": {"name": "Belgium", "code": "32", "flag": "flag-be", "format": "0# ### ###"},
    "BZ": {"name": "Belize", "code": "501", "flag": "flag-bz", "format": "###-####"},
    "BJ": {"name": "Benin", "code": "229", "flag": "flag-bj", "format": "## ## ## ##"},
    "BT": {"name": "Bhutan", "code": "975", "flag": "flag-bt", "format": "17 ### ###"},
    "BO": {"name": "Bolivia (Plurinational State of)", "code": "591", "flag": "flag-bo", "format": "###-###-####"},
    "BA": {"name": "Bosnia and Herzegovina", "code": "387", "flag": "flag-ba", "format": "### ######"},
    "BW": {"name": "Botswana", "code": "267", "flag": "flag-bw", "format": "## #######"},
    "BR": {"name": "Brazil", "code": "55", "flag": "flag-br", "format": "(##) ####-####"},
    "BN": {"name": "Brunei Darussalam", "code": "673", "flag": "flag-bn", "format": "### ####"},
    "BG": {"name": "Bulgaria", "code": "359", "flag": "flag-bg", "format": "## ### ###"},
    "BF": {"name": "Burkina Faso", "code": "226", "flag": "flag-bf", "format": "## ## ####"},
    "BI": {"name": "Burundi", "code": "257", "flag": "flag-bi", "format": "## ## ## ##"},
    "KH": {"name": "Cambodia", "code": "855", "flag": "flag-kh", "format": "### ### ###"},
    "CM": {"name": "Cameroon", "code": "237", "flag": "flag-cm", "format": "2# ### ###"},
    "CA": {"name": "Canada", "code": "1", "flag": "flag-ca", "format": "(###) ###-####"},
    "CV": {"name": "Cape Verde", "code": "238", "flag": "flag-cv", "format": "9## ###"},
    "CF": {"name": "Central African Republic", "code": "236", "flag": "flag-cf", "format": "## ## ## ##"},
    "TD": {"name": "Chad", "code": "235", "flag": "flag-td", "format": "## ## ## ##"},
    "CL": {"name": "Chile", "code": "56", "flag": "flag-cl", "format": "## #### ####"},
    "CN": {"name": "China", "code": "86", "flag": "flag-cn", "format": "####-####"},
    "CO": {"name": "Colombia", "code": "57", "flag": "flag-co", "format": "### ### ####"},
    "KM": {"name": "Comoros", "code": "269", "flag": "flag-km", "format": "#####"},
    "CG": {"name": "Congo", "code": "242", "flag": "flag-cg", "format": "## ### ###"},
    "CR": {"name": "Costa Rica", "code": "506", "flag": "flag-cr", "format": "#### ####"},
    "CI": {"name": "Côte d'Ivoire", "code": "225", "flag": "flag-ci", "format": "## ## ## ##"},
    "HR": {"name": "Croatia", "code": "385", "flag": "flag-hr", "format": "0# ### ####"},
    "CU": {"name": "Cuba", "code": "53", "flag": "flag-cu", "format": "### ### ###"},
    "CY": {"name": "Cyprus", "code": "357", "flag": "flag-cy", "format": "##-###-###"},
    "CZ": {"name": "Czech Republic", "code": "420", "flag": "flag-cz", "format": "### ### ###"},
    "DK": {"name": "Denmark", "code": "45", "flag": "flag-dk", "format": "## ## ## ##"},
    "DJ": {"name": "Djibouti", "code": "253", "flag": "flag-dj", "format": "## ## ## ##"},
    "DM": {"name": "Dominica", "code": "1-767", "flag": "flag-dm", "format": "(767) ###-####"},
    "DO": {"name": "Dominican Republic", "code": "1-809", "flag": "flag-do", "format": "(809) ###-####"},
    "EC": {"name": "Ecuador", "code": "593", "flag": "flag-ec", "format": "0# ### ####"},
    "EG": {"name": "Egypt", "code": "20", "flag": "flag-eg", "format": "01# ### ####"},
    "SV": {"name": "El Salvador", "code": "503", "flag": "flag-sv", "format": "#### ####"},
    "GQ": {"name": "Equatorial Guinea", "code": "240", "flag": "flag-gq", "format": "## ### ###"},
    "ER": {"name": "Eritrea", "code": "291", "flag": "flag-er", "format": "## ### ###"},
    "EE": {"name": "Estonia", "code": "372", "flag": "flag-ee", "format": "#### ####"},
    "ET": {"name": "Ethiopia", "code": "251", "flag": "flag-et", "format": "## ### ####"},
    "FJ": {"name": "Fiji", "code": "679", "flag": "flag-fj", "format": "## ####"},
    "FI": {"name": "Finland", "code": "358", "flag": "flag-fi", "format": "#### ### ###"},
    "FR": {"name": "France", "code": "33", "flag": "flag-fr", "format": "0# ### ###"},
    "GA": {"name": "Gabon", "code": "241", "flag": "flag-ga", "format": "## ## ## ##"},
    "GM": {"name": "Gambia", "code": "220", "flag": "flag-gm", "format": "# ## ## ##"},
    "GE": {"name": "Georgia", "code": "995", "flag": "flag-ge", "format": "### ### ###"},
    "DE": {"name": "Germany", "code": "49", "flag": "flag-de", "format": "#### ### ###"},
    "GH": {"name": "Ghana", "code": "233", "flag": "flag-gh", "format": "## ### ####"},
    "GR": {"name": "Greece", "code": "30", "flag": "flag-gr", "format": "2# ### ####"},
    "GD": {"name": "Grenada", "code": "1-473", "flag": "flag-gd", "format": "(473) ###-####"},
    "GT": {"name": "Guatemala", "code": "502", "flag": "flag-gt", "format": "###-####-####"},
    "GN": {"name": "Guinea", "code": "224", "flag": "flag-gn", "format": "### ### ###"},
    "GW": {"name": "Guinea-Bissau", "code": "245", "flag": "flag-gw", "format": "## ### ###"},
    "GY": {"name": "Guyana", "code": "592", "flag": "flag-gy", "format": "### ####"},
    "HT": {"name": "Haiti", "code": "509", "flag": "flag-ht", "format": "## ## ####"},
    "HN": {"name": "Honduras", "code": "504", "flag": "flag-hn", "format": "####-####"},
    "HU": {"name": "Hungary", "code": "36", "flag": "flag-hu", "format": "(###) ### ###"},
    "IS": {"name": "Iceland", "code": "354", "flag": "flag-is", "format": "### ####"},
    "IN": {"name": "India", "code": "91", "flag": "flag-in", "format": "#### # #####"},
    "ID": {"name": "Indonesia", "code": "62", "flag": "flag-id", "format": "## #######"},
    "IR": {"name": "Iran", "code": "98", "flag": "flag-ir", "format": "0## ### ####"},
    "IQ": {"name": "Iraq", "code": "964", "flag": "flag-iq", "format": "### ### ####"},
    "IE": {"name": "Ireland", "code": "353", "flag": "flag-ie", "format": "#### ### ###"},
    "IL": {"name": "Israel", "code": "972", "flag": "flag-il", "format": "0#-###-####"},
    "IT": {"name": "Italy", "code": "39", "flag": "flag-it", "format": "### #######"},
    "JM": {"name": "Jamaica", "code": "1-876", "flag": "flag-jm", "format": "(876) ###-####"},
    "JP": {"name": "Japan", "code": "81", "flag": "flag-jp", "format": "0# #### ####"},
    "JO": {"name": "Jordan", "code": "962", "flag": "flag-jo", "format": "## ### ####"},
    "KZ": {"name": "Kazakhstan", "code": "7", "flag": "flag-kz", "format": "7 ### ### ###"},
    "KE": {"name": "Kenya", "code": "254", "flag": "flag-ke", "format": "### ### ###"},
    "KI": {"name": "Kiribati", "code": "686", "flag": "flag-ki", "format": "## ###"},
    "XK": {"name": "Kosovo", "code": "383", "flag": "flag-xk", "format": "### ### ###"},
    "KW": {"name": "Kuwait", "code": "965", "flag": "flag-kw", "format": "#### ####"},
    "KG": {"name": "Kyrgyzstan", "code": "996", "flag": "flag-kg", "format": "###-##-##-##"},
    "LA": {"name": "Laos", "code": "856", "flag": "flag-la", "format": "### ### ###"},
    "LV": {"name": "Latvia", "code": "371", "flag": "flag-lv", "format": "## #### ###"},
    "LB": {"name": "Lebanon", "code": "961", "flag": "flag-lb", "format": "## ### ###"},
    "LS": {"name": "Lesotho", "code": "266", "flag": "flag-ls", "format": "## ### ###"},
    "LR": {"name": "Liberia", "code": "231", "flag": "flag-lr", "format": "### ### ###"},
    "LY": {"name": "Libya", "code": "218", "flag": "flag-ly", "format": "## ### ###"},
    "LI": {"name": "Liechtenstein", "code": "423", "flag": "flag-li", "format": "### ### ###"},
    "LT": {"name": "Lithuania", "code": "370", "flag": "flag-lt", "format": "(###) ### ##"},
    "LU": {"name": "Luxembourg", "code": "352", "flag": "flag-lu", "format": "## ### ###"},
    "MG": {"name": "Madagascar", "code": "261", "flag": "flag-mg", "format": "## ## ### ##"},
    "MW": {"name": "Malawi", "code": "265", "flag": "flag-mw", "format": "1 ### ####"},
    "MY": {"name": "Malaysia", "code": "60", "flag": "flag-my", "format": "##-########"},
    "MV": {"name": "Maldives", "code": "960", "flag": "flag-mv", "format": "### ####"},
    "ML": {"name": "Mali", "code": "223", "flag": "flag-ml", "format": "## ## ## ##"},
    "MT": {"name": "Malta", "code": "356", "flag": "flag-mt", "format": "#### ####"},
    "MH": {"name": "Marshall Islands", "code": "692", "flag": "flag-mh", "format": "### ####"},
    "MR": {"name": "Mauritania", "code": "222", "flag": "flag-mr", "format": "## ## ## ##"},
    "MU": {"name": "Mauritius", "code": "230", "flag": "flag-mu", "format": "### ####"},
    "MX": {"name": "Mexico", "code": "52", "flag": "flag-mx", "format": "### ### ####"},
    "FM": {"name": "Micronesia", "code": "691", "flag": "flag-fm", "format": "### ####"},
    "MD": {"name": "Moldova", "code": "373", "flag": "flag-md", "format": "#### ### ##"},
    "MC": {"name": "Monaco", "code": "377", "flag": "flag-mc", "format": "## ## ## ## ##"},
    "MN": {"name": "Mongolia", "code": "976", "flag": "flag-mn", "format": "##-##-####"},
    "ME": {"name": "Montenegro", "code": "382", "flag": "flag-me", "format": "## ### ###"},
    "MA": {"name": "Morocco", "code": "212", "flag": "flag-ma", "format": "## ### ####"},
    "MZ": {"name": "Mozambique", "code": "258", "flag": "flag-mz", "format": "## ### ###"},
    "MM": {"name": "Myanmar", "code": "95", "flag": "flag-mm", "format": "##-### ###"},
    "NA": {"name": "Namibia", "code": "264", "flag": "flag-na", "format": "### #######"},
    "NR": {"name": "Nauru", "code": "674", "flag": "flag-nr", "format": "### ###"},
    "NP": {"name": "Nepal", "code": "977", "flag": "flag-np", "format": "##-### ###"},
    "NL": {"name": "Netherlands", "code": "31", "flag": "flag-nl", "format": "## ### ####"},
    "NZ": {"name": "New Zealand", "code": "64", "flag": "flag-nz", "format": "### #######"},
    "NI": {"name": "Nicaragua", "code": "505", "flag": "flag-ni", "format": "#### ####"},
    "NE": {"name": "Niger", "code": "227", "flag": "flag-ne", "format": "## ## ## ##"},
    "NG": {"name": "Nigeria", "code": "234", "flag": "flag-ng", "format": "### ### ####"},
    "KP": {"name": "North Korea", "code": "850", "flag": "flag-kp", "format": "### ### ####"},
    "MK": {"name": "North Macedonia", "code": "389", "flag": "flag-mk", "format": "## ### ###"},
    "NO": {"name": "Norway", "code": "47", "flag": "flag-no", "format": "## ## ## ##"},
    "OM": {"name": "Oman", "code": "968", "flag": "flag-om", "format": "### #### ####"},
    "PK": {"name": "Pakistan", "code": "92", "flag": "flag-pk", "format": "### ### ####"},
    "PW": {"name": "Palau", "code": "680", "flag": "flag-pw", "format": "### ####"},
    "PS": {"name": "Palestine", "code": "970", "flag": "flag-ps", "format": "## ### ####"},
    "PA": {"name": "Panama", "code": "507", "flag": "flag-pa", "format": "### ####"},
    "PG": {"name": "Papua New Guinea", "code": "675", "flag": "flag-pg", "format": "### ###"},
    "PY": {"name": "Paraguay", "code": "595", "flag": "flag-py", "format": "### ### ###"},
    "PE": {"name": "Peru", "code": "51", "flag": "flag-pe", "format": "###-###-###"},
    "PH": {"name": "Philippines", "code": "63", "flag": "flag-ph", "format": "### ### ####"},
    "PL": {"name": "Poland", "code": "48", "flag": "flag-pl", "format": "## ### ###"},
    "PT": {"name": "Portugal", "code": "351", "flag": "flag-pt", "format": "### ### ###"},
    "QA": {"name": "Qatar", "code": "974", "flag": "flag-qa", "format": "#### ####"},
    "RO": {"name": "Romania", "code": "40", "flag": "flag-ro", "format": "### ### ###"},
    "RU": {"name": "Russia", "code": "7", "flag": "flag-ru", "format": "### ### ## ##"},
    "RW": {"name": "Rwanda", "code": "250", "flag": "flag-rw", "format": "### ### ###"},
    "KN": {"name": "Saint Kitts and Nevis", "code": "1869", "flag": "flag-kn", "format": "### ####"},
    "LC": {"name": "Saint Lucia", "code": "1758", "flag": "flag-lc", "format": "### ####"},
    "VC": {"name": "Saint Vincent and the Grenadines", "code": "1784", "flag": "flag-vc", "format": "### ####"},
    "WS": {"name": "Samoa", "code": "685", "flag": "flag-ws", "format": "## ###"},
    "SM": {"name": "San Marino", "code": "378", "flag": "flag-sm", "format": "#### ######"},
    "ST": {"name": "Sao Tome and Principe", "code": "239", "flag": "flag-st", "format": "### ###"},
    "SA": {"name": "Saudi Arabia", "code": "966", "flag": "flag-sa", "format": "### ### ####"},
    "SN": {"name": "Senegal", "code": "221", "flag": "flag-sn", "format": "## ### ####"},
    "RS": {"name": "Serbia", "code": "381", "flag": "flag-rs", "format": "## ### ####"},
    "SC": {"name": "Seychelles", "code": "248", "flag": "flag-sc", "format": "### ####"},
    "SL": {"name": "Sierra Leone", "code": "232", "flag": "flag-sl", "format": "## ######"},
    "SG": {"name": "Singapore", "code": "65", "flag": "flag-sg", "format": "#### ####"},
    "SK": {"name": "Slovakia", "code": "421", "flag": "flag-sk", "format": "### ### ###"},
    "SI": {"name": "Slovenia", "code": "386", "flag": "flag-si", "format": "## ### ###"},
    "SB": {"name": "Solomon Islands", "code": "677", "flag": "flag-sb", "format": "### ###"},
    "SO": {"name": "Somalia", "code": "252", "flag": "flag-so", "format": "##-###-###"},
    "ZA": {"name": "South Africa", "code": "27", "flag": "flag-za", "format": "### ### ####"},
    "SS": {"name": "South Sudan", "code": "211", "flag": "flag-ss", "format": "## ### ####"},
    "ES": {"name": "Spain", "code": "34", "flag": "flag-es", "format": "### ### ###"},
    "LK": {"name": "Sri Lanka", "code": "94", "flag": "flag-lk", "format": "## ### ####"},
    "SD": {"name": "Sudan", "code": "249", "flag": "flag-sd", "format": "### ### ###"},
    "SR": {"name": "Suriname", "code": "597", "flag": "flag-sr", "format": "###-####"},
    "SZ": {"name": "Swaziland", "code": "268", "flag": "flag-sz", "format": "## #### ####"},
    "SE": {"name": "Sweden", "code": "46", "flag": "flag-se", "format": "### ### ###"},
    "CH": {"name": "Switzerland", "code": "41", "flag": "flag-ch", "format": "0## ### ## ##"},
    "SY": {"name": "Syria", "code": "963", "flag": "flag-sy", "format": "## ### ####"},
    "TW": {"name": "Taiwan", "code": "886", "flag": "flag-tw", "format": "## #### ####"},
    "TJ": {"name": "Tajikistan", "code": "992", "flag": "flag-tj", "format": "### ### ###"},
    "TZ": {"name": "Tanzania", "code": "255", "flag": "flag-tz", "format": "### ### ###"},
    "TH": {"name": "Thailand", "code": "66", "flag": "flag-th", "format": "#### ### ###"},
    "TL": {"name": "Timor-Leste", "code": "670", "flag": "flag-tl", "format": "### ###"},
    "TG": {"name": "Togo", "code": "228", "flag": "flag-tg", "format": "## ### ###"},
    "TO": {"name": "Tonga", "code": "676", "flag": "flag-to", "format": "####"},
    "TT": {"name": "Trinidad and Tobago", "code": "1868", "flag": "flag-tt", "format": "### ####"},
    "TN": {"name": "Tunisia", "code": "216", "flag": "flag-tn", "format": "## ### ###"},
    "TR": {"name": "Turkey", "code": "90", "flag": "flag-tr", "format": "(###) ### ####"},
    "TM": {"name": "Turkmenistan", "code": "993", "flag": "flag-tm", "format": "### ### ###"},
    "TV": {"name": "Tuvalu", "code": "688", "flag": "flag-tv", "format": "####"},
    "UG": {"name": "Uganda", "code": "256", "flag": "flag-ug", "format": "##-###-###-###"},
    "UA": {"name": "Ukraine", "code": "380", "flag": "flag-ua", "format": "## ### ####"},
    "AE": {"name": "United Arab Emirates", "code": "971", "flag": "flag-ae", "format": "#### ### ###"},
    "GB": {"name": "United Kingdom", "code": "44", "flag": "flag-gb", "format": "#### ### ####"},
    "US": {"name": "United States", "code": "1", "flag": "flag-us", "format": "###-###-####"},
    "UY": {"name": "Uruguay", "code": "598", "flag": "flag-uy", "format": "0### ### ###"},
    "UZ": {"name": "Uzbekistan", "code": "998", "flag": "flag-uz", "format": "### ### ####"},
    "VU": {"name": "Vanuatu", "code": "678", "flag": "flag-vu", "format": "## ###"},
    "VE": {"name": "Venezuela", "code": "58", "flag": "flag-ve", "format": "0### ### ###"},
    "VN": {"name": "Vietnam", "code": "84", "flag": "flag-vn", "format": "0### ### ###"},
    "YE": {"name": "Yemen", "code": "967", "flag": "flag-ye", "format": "### ### ###"},
    "ZM": {"name": "Zambia", "code": "260", "flag": "flag-zm", "format": "### ### ###"},
    "ZW": {"name": "Zimbabwe", "code": "263", "flag": "flag-zw", "format": "## #### ####"},
};