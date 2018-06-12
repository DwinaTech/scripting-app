const express = require('express');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const request = require('request');

const router = express.Router();

function getPageInfo(body, url) {
  const $ = cheerio.load(body);
  // URL domain/page host
  const domain = request(url).host;
  // is has secure manner
  const isSecure = request(url).uri.protocol === 'https:';
  let isHasGoogleAnalytics = false;
  const uniqueLinksDomains = [];
  $('a').each(function (i, elem) {
    const linksAtrr = $(this).attr('href');
    if (linksAtrr && linksAtrr.includes('http')) {
      uniqueLinksDomains.push(request(linksAtrr).host);
    }
    if (linksAtrr.includes('google-analytics')) {
      isHasGoogleAnalytics = true
    }
  });
  // unique domains for the list of links at the page
  const filteredDomain = uniqueLinksDomains.filter((elem, index, self) =>
    index === self.indexOf(elem)
  )
  //Number of unique domains for the list of links at the page
  const uniqueDomainNumber = filteredDomain.length;

  // Number of the links at the page
  const links = $('a').get().length;
  // Page title
  let pageTitle = $('title');
  pageTitle = $('title').text();

  results = { links, pageTitle, domain, isSecure, filteredDomain, uniqueDomainNumber, isHasGoogleAnalytics };
  console.log(results)
  return results;
}

router.post('/script', (req, res) => {
  const { url } = req.body;
  console.log(req.body)
  fetch(`${url}`).then(response => response.text())
    .then(data => {
      const results = getPageInfo(data, url)
      res.status(200).json({
        success: true,
        results
      })
    }).catch(err => res.status(502).json(err))
})

module.exports = router;
