import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import cheerio from 'cheerio';
import https from 'https';
import _path from 'path';

const app = express();
const port = 8282;
app.use(cors());

app.use(
  '/proxy',
  createProxyMiddleware({
    target: 'https://solved.ac/api/v3',
    changeOrigin: true,
    pathRewrite: {
      '^/proxy': '', // /proxy 경로를 타겟 경로로 매핑
    },
    onProxyRes: function (proxyRes, req, res) {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
  }),
);

app.use(
  '/proxy_profile',
  createProxyMiddleware({
    target: 'https://solved.ac/profile',
    changeOrigin: true,
    pathRewrite: {
      '^/proxy_profile': '', // /proxy 경로를 타겟 경로로 매핑
    },
    onProxyRes: function (proxyRes, req, res) {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
  }),
);

app.get('/problem/:id', (req, res) => {
  const id = req.params.id;
  const url = `https://www.acmicpc.net/problem/${id}`;

  const options = {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    },
  };

  https
    .get(url, options, (response) => {
      let body = '';

      response.on('data', (chunk) => {
        body += chunk;
      });

      response.on('end', () => {
        const $ = cheerio.load(body);
        const title = $('#problem_title').text();
        const problemBody = $('#problem-body');
        const description = problemBody.find('#problem_description').html();
        const input = problemBody.find('#problem_input').html();
        const output = problemBody.find('#problem_output').html();
        const samples = [];
        const imgs = [];

        $('[id*=sample-input]').each((i, el) => {
          const input = $(el).html();
          const output = $(el)
            .parent()
            .parent()
            .next()
            .find('[id*=sample-output]')
            .html();
          samples[i] = { input, output };
        });
        console.log(samples);

        problemBody
          .find('#problem_description')
          .find('img')
          .each((i, el) => {
            const src = $(el).attr('src');
            if (src) {
              imgs.push(src);
            }
          });

        res.json({
          title,
          description,
          input,
          output,
          samples,
          imgs,
        });
      });
    })
    .on('error', (error) => {
      res.status(500).json({ error: error.message });
    });
});

app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
