import { TokenType } from './types';

const BXB: TokenType = { id: 0, name: 'BXB', logo: require('../../assets/images/icon-bxb.svg') };
const BUSD: TokenType = { id: 1, name: 'BUSD', logo: require('../../assets/images/icon-busd.svg') };
const DOT: TokenType = { id: 2, name: 'DOT', logo: require('../../assets/images/icon-dot.svg') };
const BETH: TokenType = { id: 3, name: 'BETH', logo: require('../../assets/images/icon-beth.svg') };

/**
 * TODO: Delete.
 * Do not use this hard-coded ones. This should only be used for testing
 */
export default [BXB, BUSD, DOT, BETH];
