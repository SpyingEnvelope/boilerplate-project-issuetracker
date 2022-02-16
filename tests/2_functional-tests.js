const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { send } = require('express/lib/response');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    this.timeout(5000);
    let id;

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
                id = res.body['_id'];
                assert.equal(res.status, 200);
                assert.equal(res.body['assigned_to'], 'SpyingLulu');
                assert.equal(res.body['status_text'], 'In testing');
                assert.equal(res.body['open'], true);
                assert.equal(res.body['issue_title'], 'More hugs are needed');
                assert.equal(res.body['issue_text'], 'He is just so cute');
                assert.equal(res.body['created_by'], 'SpyingEnvy');
                assert.equal(res.body['_id'], id);
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

    //test #7
    test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .put('/api/issues/chai-tests')
            .send({
                '_id': '620baaa48ad192e6d35ad92c',
                'issue_title': 'The hugs have been received',
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body['_id'], '620baaa48ad192e6d35ad92c');
                done();
            })
    })

    //test #8
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .put('/api/issues/chai-tests')
            .send({
                '_id': '620baa254d954e717f7b72ea',
                'issue_title': 'The hugs have been received',
                'issue_text': 'He is still super cute, even more so now',
                'created_by': 'SpyingLulu',
                'assigned_to': 'SpyingEnvy',
                'status_text': 'A username should not be here silly'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body['_id'], '620baa254d954e717f7b72ea');
                done();
            })
    })

    //test #9
    test('Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .put('/api/issues/chai-tests')
            .send({
                'issue_title': 'The hugs have been received',
                'issue_text': 'He is still super cute, even more so now',
                'created_by': 'SpyingLulu',
                'assigned_to': 'SpyingEnvy',
                'status_text': 'A username should not be here silly' 
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');
                done();
            })
    })

    //test #10
    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .put('/api/issues/chai-tests')
            .send({
                '_id': '620baa254d954e717f7b72ea'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'no update field(s) sent');
                assert.equal(res.body['_id'], '620baa254d954e717f7b72ea')
                done();
            })
    })

    //test #11
    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .put('/api/issues/chai-tests')
            .send({
                '_id': '620baa254d954e717f7b722f',
                'issue_title': 'The hugs have been received',
                'issue_text': 'He is still super cute, even more so now',
                'created_by': 'SpyingLulu',
                'assigned_to': 'SpyingEnvy',
                'status_text': 'A username should not be here silly'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'could not update');
                assert.equal(res.body['_id'], '620baa254d954e717f7b722f');
                done();
            })
    })

    //test #12
    test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .delete('/api/issues/chai-tests')
            .send({
                '_id': id
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully deleted');
                assert.equal(res.body['_id'], id);
                done();
            })
    })

    //test #13
    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .delete('/api/issues/chai-tests')
            .send({
                '_id': id + 1
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'could not delete');
                assert.equal(res.body['_id'], id + 1);
                done();
            })
    })

    //test #14
    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .delete('/api/issues/chai-tests')
            .send({
                
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');
                done();
            })
    })
});
