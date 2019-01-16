const xray = require('aws-xray-sdk');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiHttp = require('chai-http');
const chaiSpies = require('chai-spies');

const segmentEmitter = require('aws-xray-sdk-core/lib/segment_emitter')
const app = require('../app');

const { expect } = require('chai');

chai.use(chaiHttp);
chai.use(chaiSpies);
chai.use(chaiAsPromised);

describe('When getSignedUrl method is called', () => {
  before(() => {
    chai.spy.on(segmentEmitter, 'send');
  });

  after(() => {
    chai.spy.restore();
  });

  it('should emit a segment', (done) => {
    chai
      .request(app)
      .get('/test')
      .end((err, { body }) => {
        if (err) {
          done(err);
        } else {
          expect(body).to.have.property('url');
          expect(segmentEmitter.send).to.have.been.called.once;
          done();
        }
      });
  });
});
