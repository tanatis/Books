const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const expect = chai.expect;

chai.use(chaiHttp);


describe('Book API', () => {
    let bookId;
    it('should POST a book', (done) => {
        const book = { id: "1", title: "Test Book", author: "Test Author" };
        chai.request(server)
            .post('/books')
            .send(book)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('title');
                expect(res.body).to.have.property('author');
                bookId = res.body.id;
                done();
            });
    });

    it('should GET a single book', (done) => {
        chai.request(server)
            .get('/books/1')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('title');
                expect(res.body).to.have.property('author');
                done();
            });
    });

    it('should GET all books', (done) => {
        chai.request(server)
            .get('/books')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                done();
            });
    });

    it('should PUT an existing book', (done) => {
        const updatedBook = {id: '1', title: 'Updated title', author: 'Updated author'};
        chai.request(server)
            .put('/books/1')
            .send(updatedBook)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.title).to.equal('Updated title');
                expect(res.body.author).to.equal('Updated author');
                done();
            });
    });

    it('should DELETE an existing book', (done) => {
        chai.request(server)
            .delete('/books/1')
            .end((err, res) => {
                expect(res).to.have.status(204);
                done();
            });
    });

    it('should return 404 if we try to GET, PUT or DELETE a non-existing book', (done) => {
        chai.request(server)
            .get('/books/999')
            .end((err, res) => {
                expect(res).to.have.status(404);
            });

        chai.request(server)
            .post('/books/999')
            .send({ id: "999", title: "Not existing", author: "Unknown" })
            .end((err, res) => {
                expect(res).to.have.status(404);
            });

        chai.request(server)
            .delete('/books/999')
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });
});