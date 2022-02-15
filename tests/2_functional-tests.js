const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    this.timeout(5000);

    //test #1
    test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .post('/api/issues/chai-tests')
            .send({
                'assigned_to': 'SpyingLulu',
                'status_text': 'In testing',
                'issue_title': 'More hugs are needed',
                'issue_text': 'He is just so cute',
                'created_by': 'SpyingEnvy',
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body['assigned_to'], 'SpyingLulu');
                assert.equal(res.body['status_text'], 'In testing');
                assert.equal(res.body['open'], true);
                assert.equal(res.body['issue_title'], 'More hugs are needed');
                assert.equal(res.body['issue_text'], 'He is just so cute');
                assert.equal(res.body['created_by'], 'SpyingEnvy');
                done();
            })
    })

    //test #2
    test('Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .post('/api/issues/chai-test')
            .send({
                'issue_title': 'Even more hugs are needed',
                'issue_text': 'The more hugs the better',
                'created_by': 'SpyingEnvy'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body['assigned_to'], "");
                assert.equal(res.body['status_text'], "");
                assert.equal(res.body['open'], true);
                assert.equal(res.body['issue_title'], 'Even more hugs are needed');
                assert.equal(res.body['issue_text'], 'The more hugs the better');
                assert.equal(res.body['created_by'], 'SpyingEnvy');
                done();
            })
    })

    //test #3
    test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .post('/api/issues/chai-test')
            .send({
                'issue_title': 'Extra hugs neeeded'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body['error'], 'required field(s) missing');
                done();
            })
    })

    //test #4
    test('View issues on a project: GET request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .get('/api/issues/chai-tests')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body[0]['project_name'], 'chai-tests');
                assert.equal(res.body[1]['project_name'], 'chai-tests');
                assert.equal(res.body[2]['project_name'], 'chai-tests');
                assert.equal(res.body[3]['project_name'], 'chai-tests');
                done();
            })
    })

    //test #5
    test('View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .get('/api/issues/chai-tests?open=true')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body[0]['project_name'], 'chai-tests');
                assert.equal(res.body[1]['project_name'], 'chai-tests');
                assert.equal(res.body[2]['project_name'], 'chai-tests');
                assert.equal(res.body[3]['project_name'], 'chai-tests');
                done();
            })
    })

    //test #6
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .get('/api/issues/chai-tests?open=true&assigned_to=SpyingLulu')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body[0]['assigned_to'], 'SpyingLulu');
                assert.equal(res.body[1]['open'], true);
                assert.equal(res.body[2]['assigned_to'], 'SpyingLulu');
                assert.equal(res.body[3]['open'], true);
                done();
            })
    })
});
