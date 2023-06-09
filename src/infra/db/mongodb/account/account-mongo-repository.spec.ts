import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'
import env from '../../../../main/config/env'
import { type Collection } from 'mongodb'

const MONGO_URL = env.mongoUrl
let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL!, 'dev')
  })

  afterAll(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.drop()
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()
      const account = await sut.add({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      expect(account).toBeTruthy()
      expect(account.id).toEqual(expect.any(String))
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeTruthy()
      expect(account!.id).toEqual(expect.any(String))
      expect(account!.name).toBe('any_name')
      expect(account!.email).toBe('any_email@mail.com')
      expect(account!.password).toBe('any_password')
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeNull()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account acessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      await sut.updateAccessToken(res.insertedId.toString(), 'any_token')
      const account = await accountCollection.findOne({ _id: res.insertedId })
      expect(account).toBeTruthy()
      expect(account!.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any-token'
      })
      const account = await sut.loadByToken('any-token')
      expect(account).toBeTruthy()
      expect(account!.id).toEqual(expect.any(String))
      expect(account!.name).toBe('any_name')
      expect(account!.email).toBe('any_email@mail.com')
      expect(account!.password).toBe('any_password')
    })

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any-token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any-token', 'admin')

      expect(account).toBeTruthy()
      expect(account!.id).toEqual(expect.any(String))
      expect(account!.name).toBe('any_name')
      expect(account!.email).toBe('any_email@mail.com')
      expect(account!.password).toBe('any_password')
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any-token'
      })
      const account = await sut.loadByToken('any-token', 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken with user is admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any-token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any-token')

      expect(account).toBeTruthy()
      expect(account!.id).toEqual(expect.any(String))
      expect(account!.name).toBe('any_name')
      expect(account!.email).toBe('any_email@mail.com')
      expect(account!.password).toBe('any_password')
    })

    test('Should return null on loadByToken with role', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any-token')
      expect(account).toBeFalsy()
    })
  })
})
