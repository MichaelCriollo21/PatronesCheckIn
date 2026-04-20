const BASE62_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const BASE62_BASE = 62n;

function bytesToBigInt(bytes: Uint8Array): bigint {
  let value = 0n;

  for (const byte of bytes) {
    value = (value << 8n) + BigInt(byte);
  }

  return value;
}

function bigIntToBytes(value: bigint): Uint8Array {
  if (value === 0n) {
    return new Uint8Array([0]);
  }

  const bytes: number[] = [];
  let current = value;

  while (current > 0n) {
    bytes.unshift(Number(current & 255n));
    current >>= 8n;
  }

  return new Uint8Array(bytes);
}

export function encodeFlightId(flightId: string): string {
  const textEncoder = new TextEncoder();
  const bytes = textEncoder.encode(flightId);

  let leadingZeroBytes = 0;
  for (const byte of bytes) {
    if (byte !== 0) {
      break;
    }
    leadingZeroBytes += 1;
  }

  const numericValue = bytesToBigInt(bytes);
  let encoded = "";
  let current = numericValue;

  if (current === 0n) {
    encoded = "0";
  } else {
    while (current > 0n) {
      const remainder = Number(current % BASE62_BASE);
      encoded = BASE62_ALPHABET[remainder] + encoded;
      current /= BASE62_BASE;
    }
  }

  return `${BASE62_ALPHABET[0].repeat(leadingZeroBytes)}${encoded}`;
}

export function decodeFlightId(encodedFlightId: string): string {
  if (!encodedFlightId) {
    return "";
  }

  let value = 0n;

  for (const character of encodedFlightId) {
    const digit = BASE62_ALPHABET.indexOf(character);
    if (digit < 0) {
      throw new Error("La URL del vuelo no es base62 valida");
    }

    value = value * BASE62_BASE + BigInt(digit);
  }

  const bytes = bigIntToBytes(value);
  const textDecoder = new TextDecoder();
  return textDecoder.decode(bytes);
}