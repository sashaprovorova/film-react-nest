import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  it('.log() должен выводить лог в формате JSON через console.log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.log('Hello World');

    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'log',
        message: 'Hello World',
        optionalParams: [],
      }),
    );

    spy.mockRestore();
  });

  it('.error() должен выводить лог в формате JSON через console.error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    logger.error('An error occurred');

    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'error',
        message: 'An error occurred',
        optionalParams: [],
      }),
    );

    spy.mockRestore();
  });

  it('.warn() должен выводить лог в формате JSON через console.warn', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    logger.warn('This is a warning');

    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'warn',
        message: 'This is a warning',
        optionalParams: [],
      }),
    );

    spy.mockRestore();
  });

  it('.debug() должен выводить лог в формате JSON через console.debug', () => {
    const spy = jest.spyOn(console, 'debug').mockImplementation(() => {});

    logger.debug('Debug message');

    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'debug',
        message: 'Debug message',
        optionalParams: [],
      }),
    );

    spy.mockRestore();
  });

  it('.verbose() должен выводить лог в формате JSON через console.info', () => {
    const spy = jest.spyOn(console, 'info').mockImplementation(() => {});

    logger.verbose('Verbose message');

    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'verbose',
        message: 'Verbose message',
        optionalParams: [],
      }),
    );

    spy.mockRestore();
  });
});
