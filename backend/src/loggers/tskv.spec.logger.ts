import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  it('.log() должен выводить строку в формате TSKV через console.log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.log('Hello', 'x');

    expect(spy).toHaveBeenCalled();

    const line = spy.mock.calls[0][0] as string;

    expect(line).toContain('\t');
    expect(line.endsWith('\n')).toBe(true);
    expect(line).toContain('level=log');
    expect(line).toContain('message=Hello');
    expect(line).toContain('params=');

    spy.mockRestore();
  });

  it('.error() должен выводить строку в формате TSKV через console.error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    logger.error('Boom');

    expect(spy).toHaveBeenCalled();

    const line = spy.mock.calls[0][0] as string;

    expect(line).toContain('level=error');
    expect(line).toContain('message=Boom');
    expect(line.endsWith('\n')).toBe(true);

    spy.mockRestore();
  });

  it('.warn() должен выводить строку в формате TSKV через console.warn', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    logger.warn('Warn');

    expect(spy).toHaveBeenCalled();

    const line = spy.mock.calls[0][0] as string;

    expect(line).toContain('level=warn');
    expect(line).toContain('message=Warn');
    expect(line.endsWith('\n')).toBe(true);

    spy.mockRestore();
  });

  it('.debug() должен выводить строку в формате TSKV через console.debug', () => {
    const spy = jest.spyOn(console, 'debug').mockImplementation(() => {});

    logger.debug('Debug');

    expect(spy).toHaveBeenCalled();

    const line = spy.mock.calls[0][0] as string;

    expect(line).toContain('level=debug');
    expect(line).toContain('message=Debug');
    expect(line.endsWith('\n')).toBe(true);

    spy.mockRestore();
  });

  it('.verbose() должен выводить строку в формате TSKV через console.info', () => {
    const spy = jest.spyOn(console, 'info').mockImplementation(() => {});

    logger.verbose('Verbose');

    expect(spy).toHaveBeenCalled();

    const line = spy.mock.calls[0][0] as string;

    expect(line).toContain('level=verbose');
    expect(line).toContain('message=Verbose');
    expect(line.endsWith('\n')).toBe(true);

    spy.mockRestore();
  });
});
