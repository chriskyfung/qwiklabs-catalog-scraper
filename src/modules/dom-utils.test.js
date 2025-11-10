import { describe, it, expect } from 'vitest';
import { extractActivityData } from './dom-utils';

describe('dom-utils', () => {
  describe('extractActivityData', () => {
    it('should return null if the card has no shadowRoot', () => {
      const card = document.createElement('div');
      expect(extractActivityData(card)).toBeNull();
    });

    it('should extract data from card attributes when available', () => {
      const card = document.createElement('div');
      card.setAttribute('path', '/catalog/course/12345');
      card.setAttribute('title', 'Test Course');
      card.setAttribute('type', 'Course');

      // Mock shadowRoot and metadata elements
      const shadowRoot = card.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = `
        <div class="metadata-value">1 hour</div>
        <div class="metadata-value">Intermediate</div>
        <div class="metadata-value">5 Credits</div>
      `;

      const data = extractActivityData(card);
      expect(data).toEqual({
        id: '12345',
        name: 'Test Course',
        type: 'course',
        duration: '1 hour',
        level: 'Intermediate',
        credits: '5 Credits',
        link: 'https://www.skills.google/catalog/course/12345',
      });
    });

    it('should extract data from shadow DOM elements as a fallback', () => {
      const card = document.createElement('div');
      const shadowRoot = card.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = `
        <a href="/catalog/lab/67890" title="Test Lab"></a>
        <ql-activity-label activity="Lab"></ql-activity-label>
        <div class="metadata-value">30 minutes</div>
        <div class="metadata-value">Fundamental</div>
        <div class="metadata-value">1 Credit</div>
      `;

      const data = extractActivityData(card);
      expect(data).toEqual({
        id: '67890',
        name: 'Test Lab',
        type: 'lab',
        duration: '30 minutes',
        level: 'Fundamental',
        credits: '1 Credit',
        link: 'https://www.skills.google/catalog/lab/67890',
      });
    });

    it('should return null if essential data (id, type) is missing', () => {
      const card = document.createElement('div');
      const shadowRoot = card.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = `<a href="/catalog/unknown/invalid"></a>`;
      expect(extractActivityData(card)).toBeNull();
    });

    it('should handle missing metadata gracefully', () => {
      const card = document.createElement('div');
      card.setAttribute('path', '/catalog/course/111');
      card.setAttribute('title', 'Incomplete Course');
      card.setAttribute('type', 'Course');
      card.attachShadow({ mode: 'open' }); // Empty shadowRoot

      const data = extractActivityData(card);
      expect(data).toEqual({
        id: '111',
        name: 'Incomplete Course',
        type: 'course',
        duration: '',
        level: '',
        credits: '',
        link: 'https://www.skills.google/catalog/course/111',
      });
    });
  });
});
