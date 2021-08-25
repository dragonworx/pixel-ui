export const buffer: string[] = [];

export const config = {
  enabled: true,
  maxBufferSize: 100,
};

export function log(message: string) {
  if (config.enabled) {
    buffer.push(message);
    if (buffer.length > config.maxBufferSize) {
      buffer.shift();
    }
    console.log(`%c: ${message}`, 'color:cyan');
  }
}
