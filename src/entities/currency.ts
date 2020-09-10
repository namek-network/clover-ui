
import LogoDot from '../assets/images/coin-dot.png';
import LogoBxEth from '../assets/images/coin-bxeth.png';
import LogoBxBtc from '../assets/images/coin-bxbtc.png';
import LogoBxUsdt from '../assets/images/coin-bxusdt.png';
import LogoBxDai from '../assets/images/coin-bxdai.png';

export default class Currency {
  readonly symbol: string;
  readonly name: string;
  readonly logo: string;

  constructor(symbol: string, name: string, logo: string) {
    this.symbol = symbol;
    this.name = name;
    this.logo = logo;
  }

  public static readonly Dot: Currency = new Currency('DOT', 'DOT', LogoDot);
  public static readonly BxEth: Currency = new Currency('BxEth', 'BxEth', LogoBxEth);
  public static readonly BxBtc: Currency = new Currency('BxBtc', 'BxBtc', LogoBxBtc);
  public static readonly BxUsdt: Currency = new Currency('BxUsdt', 'BxUsdt', LogoBxUsdt);
  public static readonly BxDai: Currency = new Currency('BxDai', 'BxDai', LogoBxDai);

  public static readonly BuiltinCurrencies = [Currency.Dot, Currency.BxEth, Currency.BxBtc, Currency.BxUsdt, Currency.BxDai];
}
