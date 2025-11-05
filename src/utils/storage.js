/**
 * Storage utility functions with error handling
 */

export const storage = {
  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @returns {string|null} - Stored value or null
   */
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to get item "${key}" from storage:`, error);
      return null;
    }
  },

  /**
   * Set item in localStorage
   * @param {string} key - Storage key
   * @param {string} value - Value to store
   */
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Failed to set item "${key}" in storage:`, error);
    }
  },

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item "${key}" from storage:`, error);
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  },

  /**
   * Get JSON item from localStorage
   * @param {string} key - Storage key
   * @returns {any|null} - Parsed value or null
   */
  getJSON(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Failed to get JSON item "${key}" from storage:`, error);
      return null;
    }
  },

  /**
   * Set JSON item in localStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store (will be stringified)
   */
  setJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set JSON item "${key}" in storage:`, error);
    }
  },
};
