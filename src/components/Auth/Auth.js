import React, { useState } from 'react'
import styles from './Auth.module.css'
import Input from '../Input/Input'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth, updateUserDatabase } from '../../firebase'

function Auth(props) {
  const navigate = useNavigate()
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [resubmitStop, setResubmitStop] = useState(false)

  const handlerSignUp = () => {
    if (!values.name || !values.email || !values.password) {
      setError('All fields are required')
      return
    }

    setResubmitStop(true)
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(async (response) => {
        const userID = response.user.uid
        await updateUserDatabase(
          { name: values.name, email: values.email },
          userID
        )
        setResubmitStop(false)
        navigate('/')
      })
      .catch((error) => {
        setResubmitStop(false)

        setError(error.message)
      })
  }
  const handlerLogin = () => {
    if (!values.email || !values.password) {
      setError('All fields are required')
      return
    }

    setResubmitStop(true)
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(async () => {
        setResubmitStop(false)
        navigate('/')
      })
      .catch((error) => {
        setResubmitStop(false)

        setError(error.message)
      })
  }
  const handleSumbitButton = (event) => {
    event.preventDefault()
    if (isSignup) handlerSignUp()
    else handlerLogin()
  }
  const isSignup = props.signup ? true : false
  return (
    <div className={styles.container}>
      <div className={styles.home}>
        <ArrowLeft />
        <p className={styles.homelink}>
          <Link to='/'>{'Back to Home'}</Link>
        </p>
      </div>
      <form className={styles.form} onSubmit={handleSumbitButton}>
        <p className={styles.heading}>{isSignup ? 'Signup' : 'Login'}</p>

        {isSignup && (
          <Input
            label='Name'
            placeholder='Enter your name'
            onChange={(event) =>
              setValues((prev) => ({ ...prev, name: event.target.value }))
            }
          />
        )}
        <Input
          label='Email'
          placeholder='Enter your email'
          onChange={(event) =>
            setValues((prev) => ({ ...prev, email: event.target.value }))
          }
        />
        <Input
          label='Password'
          placeholder='Enter your password'
          onChange={(event) =>
            setValues((prev) => ({ ...prev, password: event.target.value }))
          }
          isPassword
        />

        <p className={styles.error}>{error}</p>
        <button type='submit' disabled={resubmitStop}>
          {isSignup ? 'Signup' : 'Login'}
        </button>
        <div className={styles.bottom}>
          {isSignup ? (
            <p>
              Already have an account ? <Link to='/login'>Login Here</Link>
            </p>
          ) : (
            <p>
              New here ? <Link to='/signup'>Create an account</Link>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default Auth
