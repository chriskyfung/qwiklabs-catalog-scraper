import { describe, it, expect, vi } from 'vitest';
import { saveAs } from './downloader';

describe('downloader', () => {
  it('should save data as a file', () => {
    const data = { foo: 'bar' };
    const filename = 'test.json';

    const a = {
      click: vi.fn(),
      href: '',
      download: '',
      dataset: {
        downloadurl: '',
      },
    };

    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockReturnValue(a);
    const createObjectURLSpy = vi
      .spyOn(window.URL, 'createObjectURL')
      .mockReturnValue('blob:http://localhost:3000/test-guid');
    const revokeObjectURLSpy = vi
      .spyOn(window.URL, 'revokeObjectURL')
      .mockImplementation(() => {});

    saveAs(data, filename);

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(a.download).toBe(filename);
    expect(a.href).toBe('blob:http://localhost:3000/test-guid');
    expect(a.click).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalledWith(
      'blob:http://localhost:3000/test-guid'
    );
  });
});
