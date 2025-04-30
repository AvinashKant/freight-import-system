import { describe, it, expect, vi, afterEach } from 'vitest';
import axios from 'axios';
import { saveFreight, getAllFreight  } from '../services/dashboardServices';

vi.mock('axios');

describe('dashboardServices API', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should post data in saveFreight', async () => {
    const mockData = [{ name: 'item 1' }];
    const mockResponse = { data: 'success' };
    axios.post.mockResolvedValueOnce(mockResponse);

    const result = await saveFreight(mockData);

    expect(axios.post).toHaveBeenCalledWith(`${import.meta.env.VITE_API_BASE_URL}/api/freight`, mockData);
    expect(result).toBe('success');
  });

  it('should get data in getAllFreight', async () => {
    const mockResponse = { data: [{ id: 1 }] };
    axios.get.mockResolvedValueOnce(mockResponse);

    const result = await getAllFreight();

    expect(axios.get).toHaveBeenCalledWith(`${import.meta.env.VITE_API_BASE_URL}/api/freight`);
    expect(result).toEqual(mockResponse.data);
  });
});
