import { describe, expect, test } from 'vitest'
import { isString } from '../src'

describe('test string file', () => {
  test('should return true for a valid string argument', () => {
    expect(isString('test')).toBe(true)
  })

  test('should return false for an invalid argument', () => {
    expect(isString(123)).toBe(false)
  })

  test('should return false for a null argument', () => {
    expect(isString(null)).toBe(false)
  })

  test('should return false for an undefined argument', () => {
    expect(isString(undefined)).toBe(false)
  })
})
