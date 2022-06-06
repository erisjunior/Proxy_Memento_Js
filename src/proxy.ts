interface IService {
  getData(): string;
}

interface IUI {
  service: IService;

  handleButtonClick(): void;
}

class Service implements IService {
  getData(): string {
    return 'data';
  }
}

class ServiceProxy implements IService {
  constructor(private service: Service) {}

  getData(): string {
    return this.service.getData();
  }
}

class UI implements IUI {
  service = new ServiceProxy(new Service());

  handleButtonClick(): void {
    console.log(this.service.getData());
  }
}

const ui = new UI();

ui.handleButtonClick();

// Proxy do próprio Javascript

function CryptoAPI(coin: string) {
  console.log('Calling External API...');

  switch (coin) {
    case 'BTC':
      return 'Bitcoin';
    case 'ETH':
      return 'Ethereum';
    case 'LTC':
      return 'Litecoin';
    default:
      return 'Unknown Coin';
  }
}

const cache: { [k: string]: string } = {};

const cachedCryptoAPI = new Proxy(CryptoAPI, {
  apply: (target, thisArg, args: [coin: string]) => {
    const key = args[0];
    if (cache[key]) {
      return cache[key];
    }
    const result = target.apply(thisArg, args);
    cache[key] = result;
    return result;
  }
});

console.log(cachedCryptoAPI('BTC'))
console.log(cachedCryptoAPI('BTC'))
console.log(cachedCryptoAPI('LTC'))
console.log(cachedCryptoAPI('LTC'))