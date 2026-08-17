const Assets = {
  async fetchBlob(url) {
    try {
      const cached = await DB.get('assets', url);
      if (cached) return cached.blob;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network response error');
      const blob = await res.blob();
      await DB.put('assets', { url, blob, timestamp: Date.now() });
      return blob;
    } catch (e) { return null; }
  },
  async getQR(text) {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&data=${encodeURIComponent(text)}`;
    return await this.fetchBlob(url);
  }
};
