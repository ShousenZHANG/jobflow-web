import { gzipSync } from "zlib";

type TarFile = {
  name: string;
  content: string | Buffer;
};

function writeString(target: Buffer, offset: number, length: number, value: string) {
  const src = Buffer.from(value, "utf8");
  src.copy(target, offset, 0, Math.min(src.length, length));
}

function writeOctal(target: Buffer, offset: number, length: number, value: number) {
  const oct = value.toString(8);
  const raw = oct.padStart(length - 1, "0").slice(-1 * (length - 1)) + "\0";
  writeString(target, offset, length, raw);
}

function createHeader(name: string, size: number, mtime: number): Buffer {
  const header = Buffer.alloc(512, 0);

  writeString(header, 0, 100, name);
  writeOctal(header, 100, 8, 0o644);
  writeOctal(header, 108, 8, 0);
  writeOctal(header, 116, 8, 0);
  writeOctal(header, 124, 12, size);
  writeOctal(header, 136, 12, mtime);

  // Checksum field must be spaces while calculating.
  for (let i = 148; i < 156; i += 1) header[i] = 0x20;

  header[156] = "0".charCodeAt(0); // typeflag
  writeString(header, 257, 6, "ustar\0");
  writeString(header, 263, 2, "00");
  writeString(header, 265, 32, "jobflow");
  writeString(header, 297, 32, "jobflow");

  let sum = 0;
  for (let i = 0; i < 512; i += 1) sum += header[i];
  const checksum = sum.toString(8).padStart(6, "0");
  writeString(header, 148, 8, `${checksum}\0 `);

  return header;
}

export function createTarGz(files: TarFile[]) {
  const chunks: Buffer[] = [];
  const now = Math.floor(Date.now() / 1000);

  for (const file of files) {
    const content = Buffer.isBuffer(file.content) ? file.content : Buffer.from(file.content, "utf8");
    chunks.push(createHeader(file.name, content.length, now));
    chunks.push(content);

    const remainder = content.length % 512;
    if (remainder !== 0) {
      chunks.push(Buffer.alloc(512 - remainder, 0));
    }
  }

  // End-of-archive marker.
  chunks.push(Buffer.alloc(1024, 0));
  return gzipSync(Buffer.concat(chunks), { level: 9 });
}

