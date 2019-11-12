const request = require('supertest')
const app = require('../src/app')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { User } = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    "user": {
        "_id": userOneId,
        "name":"Angel Manuel Góez Giraldo",
        "email":"angelmanuel.goez@gmail.com",
        "password":"1234567890!**",
        "tokens":[{
            "token": jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
        }]
    }
}

beforeEach(async () => {
    await User.deleteMany()
    await new User({...userOne.user}).save()
})

test('Should singup a new user', async() => {
    const response = await request(app).post('/users').send({
        "user": {
            "name":"Luis Miguel Vasco Castaño",
            "email":"luis.vasco@gmail.com",
            "password":"1234567890!**"
        }
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        "user":{
            "name":"LUIS MIGUEL VASCO CASTAÑO",
            "email":"luis.vasco@gmail.com"
        },
        token:user.tokens[0].token
    })
})

test('Should not create an user with the same email', async() => {
    await request(app).post('/users').send({
        "user": {
            "name":"Angel Manuel Góez Giraldo",
            "email":"angelmanuel.goez@gmail.com",
            "password":"1234567890!**"
        }
    }).expect(400)
})

test('Shoul login an existing user', async () => {
    await request(app).post('/users/login').send({
        "email":userOne.user.email,
        "password":userOne.user.password
    }).expect(200)
})

test('Should not login an non-existing user', async () => {
    await request(app).post('/users/login').send({
        "email":`a${userOne.user.email}`,
        "password":userOne.user.password
    }).expect(400)
})

test('Should get profile for user', async() => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.user.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async() => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should get an account deleted', async () => {
    await request(app).delete('/users/me')
            .set('Authorization', `Bearer ${userOne.user.tokens[0].token}`)
            .send()
            .expect(200)
})

test('Should not get an account deleted', async () => {
    await request(app).delete('/users/me')
            .send()
            .expect(401)
})