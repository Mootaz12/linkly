/**
 * Error code format:
 * - First character: 'E' stands for Error
 * - Second and third characters: HEX code from 00 to FF (0 to 255)
 */
export enum ErrorCodesPrefix {
  SHORTENER_ERROR = 'E00',
}
