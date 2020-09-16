import { TokenType } from './types';

const BXB: TokenType = { id: 1, name: 'BXB', logo: require('../../assets/images/icon-bxb.svg') };
const BUSD: TokenType = { id: 2, name: 'BUSD', logo: require('../../assets/images/icon-busd.svg') };
const DOT: TokenType = { id: 3, name: 'DOT', logo: require('../../assets/images/icon-dot.svg') };
const BETH: TokenType = { id: 4, name: 'BETH', logo: require('../../assets/images/icon-beth.svg') };

export default [BXB, BUSD, DOT, BETH];
