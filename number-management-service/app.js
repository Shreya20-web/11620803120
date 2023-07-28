const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8080;

app.use(express.json());

app.get('/question1', async (req, res) => {
  try {
    const urls = req.query.url;
    if (!urls || !Array.isArray(urls)) {
      return res.status(450).json({ error: 'URL is not correct' });
    }

    const responses = await axios.all(
      urls.map((url) => axios.get(url).catch(() => null))
    );

    const numbers = responses
      .filter((response) => response && response.data && Array.isArray(response.data.numbers))
      .flatMap((response) => response.data.numbers);

    const uniqueNums = [...new Set(numbers)].sort((a, b) => a - b);

    return res.json({ numbers: uniqueNums });
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server runs on http://localhost:${PORT}`);
});
