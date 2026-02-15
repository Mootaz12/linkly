import { Injectable } from '@nestjs/common';
import baseX from 'base-x';
import { randomBytes } from 'crypto';
import { BASE62_CHARS } from '@const/shorten-url.const';

/**
 * Service responsible for generating unique, short URL slugs.
 * Uses cryptographically secure random bytes and base62 encoding.
 */
@Injectable()
export class UrlGeneratorService {
  /**
   * Base62 encoder/decoder using the standard character set: [0-9A-Za-z].
   * @private
   */
  private readonly BASE62 = baseX(BASE62_CHARS);

  /**
   * Generates a random 6-character URL slug.
   *
   * @remarks
   * The generation process follows two main steps:
   * 1. `randomBytes(6)`: Generates 6 random bytes using a cryptographically secure generator (CSPRNG).
   * 2. `this.BASE62.encode(...).slice(0, 6)`: Encodes those bytes into a Base62 alphabet (`0-9A-Za-z`)
   *    and takes the first 6 characters to ensure a fixed-length slug.
   *
   * @returns A 6-character base62 string.
   */
  generateSlug(): string {
    const bytes = randomBytes(6);
    return this.BASE62.encode(bytes).slice(0, 6);
  }
}
