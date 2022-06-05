import React, { useState } from 'react'
import { Eye, EyeOff } from 'react-feather'
import styles from './Input.module.css'

function Input({ label, isPassword, ...props }) {
  const [isShown, setIsShown] = useState(false)

  return (
    <div className={styles.container}>
      {label && <label>{label}</label>}
      <div className={styles.inputContainer}>
        <input
          type={isPassword ? (isShown ? 'text' : 'password') : 'text'}
          {...props}
        />
        {isPassword && (
          <div className={styles.icon}>
            {isShown ? (
              <EyeOff onClick={() => setIsShown((prev) => !prev)} />
            ) : (
              <Eye onClick={() => setIsShown((prev) => !prev)} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Input
