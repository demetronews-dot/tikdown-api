    // ===== CHAMADA À API TIKTOK =====
    const rapidApiHost = 'tiktok-media-downloader-videos-photos-no-watermark.p.rapidapi.com';
    const encodedUrl = encodeURIComponent(url);
    const apiEndpoint = `https://${rapidApiHost}/tiktok?url=${encodedUrl}`;

    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': rapidApiHost
      }
    });
