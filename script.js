
				const supportedCards = {
        visa, mastercard
      };

      const countries = [
        {
          code: "US",
          currency: "USD",
          currencyName: '',
          country: 'United States'
        },
        {
          code: "NG",
          currency: "NGN",
          currencyName: '',
          country: 'Nigeria'
        },
        {
          code: 'KE',
          currency: 'KES',
          currencyName: '',
          country: 'Kenya'
        },
        {
          code: 'UG',
          currency: 'UGX',
          currencyName: '',
          country: 'Uganda'
        },
        {
          code: 'RW',
          currency: 'RWF',
          currencyName: '',
          country: 'Rwanda'
        },
        {
          code: 'TZ',
          currency: 'TZS',
          currencyName: '',
          country: 'Tanzania'
        },
        {
          code: 'ZA',
          currency: 'ZAR',
          currencyName: '',
          country: 'South Africa'
        },
        {
          code: 'CM',
          currency: 'XAF',
          currencyName: '',
          country: 'Cameroon'
        },
        {
          code: 'GH',
          currency: 'GHS',
          currencyName: '',
          country: 'Ghana'
        }
      ];

      const billHype = () => {
        const billDisplay = document.querySelector('.mdc-typography--headline4');
        if (!billDisplay) return;

        billDisplay.addEventListener('click', () => {
          const billSpan = document.querySelector("[data-bill]");
          if (billSpan &&
            appState.bill &&
            appState.billFormatted &&
            appState.billFormatted === billSpan.textContent) {
            window.speechSynthesis.speak(
              new SpeechSynthesisUtterance(appState.billFormatted)
            );
          }
        });
      };

	  const appState = {};

	  const validateTextFieldLength = (event, maxlength) => {
		  let maxl = parseInt(maxlength.getAttribute('size'),10);
		  let currentTargetLength = event.srcElement.value.length;

		  if(currentTargetLength === maxl){
			  return true;
		  } else return false;
	  };

	//   Object.prototype.isEmpty = () => {
	// 	  for(let key in this){
	// 		  if(this.hasOwnProperty(key))
	// 		  return false;
	// 	  }
	// 	  return true;
	//   };
      
	  const formatAsMoney = (amount, buyerCountry) => {
		  const country = countries.find(country => country.country == buyerCountry);
		  if(country) {
			  return amount.toLocaleString('en-'+country.code, {style: "currency", currency:country.currency});
		  } else {
			  return amount.toLocaleString('en-'+countries[0].code, {style: "currency", currency:countries[0].currency});
		  }
	  };

	  const flagIfInvalid = (field, isValid) => {
		  if(isValid) {
			  field.classList.remove('is-invalid');
		  } else {
			  field.classList.add('is-invalid');
		  }
	  };

	  const expiryDateFormatIsValid = (field) => {
		  const regEx = /^(((0|)[0-9])|((1)[0-2]))(\/)\d{2}$/;
		  return regEx.test(field) ? true : false;
	  };

	  const detectCardType = (first4Digits) => {
		  const convertToNumber = parseInt(first4Digits);
		  if(convertToNumber ===4){
			  document.querySelector('[data-credit-card]').classList.add('is-visa');
			  document.querySelector('[data-card-type]').src = supportedCards.visa;
			  return 'is-visa';
		  }
		  if(convertToNumber === 5){
			  document.querySelector('[data-credit-card]').classList.remove('is-visa');
			  document.querySelector('[data-credit-card]').classList.add('is-mastercard');
			  document.querySelector('[data-card-type]').src = supportedCards.mastercard;
			  return 'is-mastercard';
		  }
	  };

	  const validateCardExpiryDate = () => {
		const dateField = document.querySelector('#date');
		const cardMonth = Number(dateField.value.split('/')[0]);
		const cardYear = Number(dateField.value.split('/')[1]);
		const monthNow = new Date().getMonth();
		const yearNow = Number(new Date().getFullYear().toString().split('').splice(2).join(''));
		const isTrue = expiryDateFormatIsValid(dateField.value);
		const isFutureDate = ((cardMonth>=monthNow) && (cardYear>=yearNow));
		
		if(isTrue && isFutureDate){
			flagIfInvalid(dateField, true);
			return true;
		}else{
			flagIfInvalid(dateField, false);
			return false;
		}
	  };

	  const validateCardHolderName = () => {
		  const field = document.querySelector('#name');
		  const isMatch = /^([A-za-z]{3,}[\s]{1}[A-za-z]{3,})$/.test(field.value.trim());
		  
		  if(isMatch){
			  flagIfInvalid(field, true);
			  return true;
		  } else{
			  flagIfInvalid(field, false);
			  return false;
		  }
	  };

	  const validateWithLuhn = (digits) => {
		  let value = digits.join('');
		  if(/[^0-9\s]+/.test(value)) return false;

		  let nCheck =0, nDigit =0, bEven = false;
		  value.replace(/\D/g,'');

		  for(let n = value.length -1; n>=0; n--){
			  let cDigit = value.charAt(n),
			  	  nDigit = parseInt(cDigit,10);
					if(bEven){
						if((nDigit *= 2)>9) nDigit = nDigit-9
					} 
					nCheck = nCheck + nDigit;
					bEven = !bEven;
		  }
		  return (nCheck % 10) == 0;
	  };

	  const validateCardNumber = () => {
		  let result = appState.cardDigits.flat(Infinity);
		  let isValid = validateWithLuhn(result);
		  if(isValid){
			  document.querySelector('[data-cc-digits]').classList.remove('is-invalid');
		  }else{
			  document.querySelector('[data-cc-digits]').classList.add('is-invalid');
		  }
		  return isValid;
	  };

	  const validatePayment = () => {
		  validateCardNumber();
		  validateCardHolderName();
		  validateCardExpiryDate();
	  };

	  const smartBackspace = (event, fieldIndex, fields) => {
		  let key = event.char || event.charCode || event.which;
		  if(fields[fieldIndex].value === '' && fieldIndex > 0 && event.key == 'Backspace'){
			  fields[fieldIndex -1].focus();
		  }
	  };

	  const smartCursor = (event, fieldIndex, fields) => {
		  if(fieldIndex < fields.length-1){
			  if(fields[fieldIndex].value.length === Number(fields[fieldIndex].size)){
				  fields[fieldIndex+1].focus();
			  }
		  }
	  };

	  const smartInput = (event, fieldIndex, fields) => {
		  const controlKeys = ['Tab', 'Delete', 'Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Shift'];

		  const isControlKey = controlKeys.includes(event.key);

		  if(!isControlKey){
			  if(fieldIndex <= 3){
				  if(/^\d$/.test(event.key)){
					  if(appState.cardDigits[fieldIndex] === undefined){
						  appState.cardDigits[fieldIndex] = [];
					  }
						  let field = fields[fieldIndex];

						  event.preventDefault();
						  const target = event.target;

						  let {selectionStart, value} = target;
						  appState.cardDigits[fieldIndex][selectionStart] = +event.key;
						  target.value = value.substr(0,selectionStart) + event.key + value.substr(selectionStart + 1);
						  setTimeout(() => {
			
							  appState.cardDigits[fieldIndex] = target.value.split('').map((car,i) => (car >= '0' && car <= '9')? Number(car):Number(appState.cardDigits[fieldIndex][i]));

							  if(fieldIndex<3){
								  target.value=target.value.replace(/\d/g,'$');
							  }

							  smartCursor(event, fieldIndex, fields);

							  if(fieldIndex==0 && target.value.length >=4){
								  let first4Digits = appState.cardDigits[0];
								  detectCardType(first4Digits);
							  }
						  },500)
					  }else{
						  event.preventDefault();
					  }
				  }else if(fieldIndex==4){
					  if(/[a-z]|\s/i.test(event.key)){
						  setTimeout(() => {
							  smartCursor(event, fieldIndex, fields);
						  },500)
					  }else{
						  event.preventDefault();
					  }
				  }else{
					  if(/\d|\//.test(event.key)){
						  setTimeout(() => {
							  smartCursor(event, fieldIndex, fields);
						  }, 500)
					  }else{
						  event.preventDefault();
					  }
				  }
			  }else{
				  if(event.key=== 'Backspace'){
					  if(appState.cardDigits[fieldIndex].length > 0){
						  appState.cardDigits[fieldIndex].splice(-1,1);
					  }else{}
						  smartCursor(event, fieldIndex, fields);
					  }else if(event.key == 'Delete'){
						  if(appState.cardDigits[fieldIndex].length > 0){
							  appState.cardDigits[fieldIndex].splice(1,1);
						  }
					  }
				  }
	  };

	  const enableSmartTyping = () => {
		  const inputs = document.querySelectorAll('input');
		  inputs.forEach((field, index, fields) => {
			  field.addEventListener('keydown', event => {
				  smartInput(event, index, fields);
			  })
		  })
	  };

	  const uiCanInteract = () => {
		  document.querySelector('#firstFour').focus();
		  const btn = document.querySelector('#btn');
		  btn.addEventListener('click', validatePayment);
		  billHype();
		  enableSmartTyping();
	  };

	  const displayCartTotal = ({results}) => {
		  const [data] = results;
		  const {itemsInCart, buyerCountry} = data;

		  appState.items = itemsInCart;
		  appState.country = buyerCountry;

		  appState.bill = itemsInCart.reduce((acc, value) => acc + (value.price * value.qty), 0);
		  appState.billFormatted = formatAsMoney(appState.bill, appState.country);

		  document.querySelector('[data-bill]').textContent = appState.billFormatted;
		  appState.cardDigits = [];
		  uiCanInteract();
	  };

	  const fetchBill = () => {
        const apiHost = 'https://randomapi.com/api';
		const apiKey = '006b08a801d82d0c9824dcfdfdfa3b3c';
		const apiEndpoint = `${apiHost}/${apiKey}`;
        
		fetch(apiEndpoint)
		.then(response => response.json())
		.then(data => displayCartTotal(data))
		.catch(error => console.warn(error));
      };
      
      const startApp = () => {
		  fetchBill();
      };

      startApp();