import React, { useState } from 'react'
import Input from '../Input/Input'
import styles from './Project.module.css'
import Modal from '../Modal/Modal'
import uploadimg from '../../assets/dummy.png'

import { PlusCircle, X } from 'react-feather'
import { addProjectInServer, updateProjectInServer } from '../../firebase'

function Project(props) {
  const isEdit = props.isEdit ? true : false
  const defaults = props.default
  const [values, setValues] = useState({
    title: defaults?.title || '',
    overview: defaults?.overview || '',
    github: defaults?.github || '',
    link: defaults?.link || '',
    summary: defaults?.summary || ['', ''],
  })
  const [errorMsg, setErrorMsg] = useState('')
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false)

  const handlerSummary = (value, index) => {
    const tempSummary = [...values.summary]
    tempSummary[index] = value
    setValues((prev) => ({ ...prev, summary: tempSummary }))
  }
  const handlerAdd = () => {
    if (values.summary.length > 4) return
    setValues((prev) => ({ ...prev, summary: [...values.summary, ''] }))
  }

  const handlerDelete = (index) => {
    const tempSummary = [...values.summary]
    tempSummary.splice(index, 1)
    setValues((prev) => ({ ...prev, summary: tempSummary }))
  }

  const validateForm = () => {
    const originalSummary = values.summary.filter((item) => item.trim())

    let isValid = true
    if (!values.github) {
      isValid = false
      setErrorMsg("Project's repository link required")
    } else if (!values.title) {
      isValid = false
      setErrorMsg("Project's Title required")
    } else if (!values.overview) {
      isValid = false
      setErrorMsg("Project's Overview required")
    } else if (!originalSummary.length) {
      isValid = false
      setErrorMsg('Description of Project is required')
    } else if (originalSummary.length < 2) {
      isValid = false
      setErrorMsg('Minimum 2 description points required')
    } else {
      setErrorMsg('')
    }

    return isValid
  }

  const handlerSubmission = async () => {
    if (!validateForm()) return

    setSubmitBtnDisabled(true)
    if (isEdit)
      await updateProjectInServer(
        { ...values, refUser: props.uid },
        defaults.pid
      )
    else await addProjectInServer({ ...values, refUser: props.uid })
    setSubmitBtnDisabled(false)
    if (props.onSubmission) props.onSubmission()
    if (props.onClose) props.onClose()
  }
  return (
    <Modal onClose={() => (props.onClose ? props.onClose() : '')}>
      <div className={styles.container}>
        <div className={styles.inner}>
          {/* Left Section */}
          <div className={styles.left}>
            <div className={styles.image}>
              <img src={uploadimg} alt='project' />
            </div>
            <Input
              label='Github'
              placeholder='Project repository link'
              value={values.github}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  github: event.target.value,
                }))
              }
            />
            <Input
              label='Deployed link'
              placeholder='Project Deployed link'
              value={values.link}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  link: event.target.value,
                }))
              }
            />
          </div>

          {/* Right Section */}
          <div className={styles.right}>
            <Input
              label='Project Title'
              placeholder='Enter your Project title'
              value={values.title}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
            />
            <Input
              label='Project Overview'
              placeholder=" Project's brief overview"
              value={values.overview}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  overview: event.target.value,
                }))
              }
            />

            <div className={styles.description}>
              <div className={styles.top}>
                <p className={styles.title}>Project Description</p>
                <p
                  className={styles.link}
                  onClick={() => {
                    handlerAdd()
                  }}
                >
                  <PlusCircle />
                </p>
              </div>
              <div className={styles.inputs}>
                {values.summary.map((item, index) => (
                  <div className={styles.input}>
                    <Input
                      placeholder='
                      Start Typing....'
                      key={index}
                      value={item}
                      onChange={(event) =>
                        handlerSummary(event.target.value, index)
                      }
                    />
                    {index > 1 && (
                      <X
                        onClick={() => {
                          handlerDelete()
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.error}>{errorMsg}</div>
        <div className={styles.footer}>
          <p
            className={styles.cancel}
            onClick={() => (props.onClose ? props.onClose() : '')}
          >
            Cancel
          </p>
          <button
            className='button'
            onClick={handlerSubmission}
            disabled={submitBtnDisabled}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default Project
