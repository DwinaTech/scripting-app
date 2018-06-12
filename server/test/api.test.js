const superTest = require('supertest');
const app = require('../app');

describe('API testing', () => {
  it('It will get URL from client then will send some info about it back to client as json format', (done) => {
    superTest(app).post("/api/script")
      .send({ url: 'https://sputnik.digital/' })
      .expect(200)
      .expect({
        results: {
          links: 31,
          uniqueDomainNumber: 5,
          isSecure: false,
          pageTitle: "Sputnik Digital| Precision Digital Engineering in Manchester, UK",
          domain: "sputnik.digital",
          isSecure: true,
          filteredDomain: ['sputnik.digital',
            't.co',
            'twitter.com',
            'www.twitter.com',
            'www.google.co.uk'],
          isHasGoogleAnalytics: false,
        },
        success: true
      }, done)
  })
})