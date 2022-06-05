import React from 'react'
import { Link } from 'react-router-dom'
import { GitHub, Paperclip } from 'react-feather'
import Modal from '../../Modal/Modal'
import styles from './ProjectModal.module.css'

function ProjectModal(props) {
  const details = props.details

  return (
    <Modal onClose={() => (props.onClose ? props.onClose() : '')}>
      <div className={styles.container}>
        <p className={styles.heading}>Project Details</p>

        <div className={styles.inner}>
          <div className={styles.left}>
            <div className={styles.links}>
              <p>Github Link :</p>
              <Link target='_blank' to={`//${details.github}`}>
                <GitHub />
              </Link>
              <p>Website Link :</p>
              <Link target='_blank' to={`//${details.link}`}>
                <Paperclip />
              </Link>
            </div>
          </div>
          <div className={styles.right}>
            <p className={styles.title}>{details.title}</p>
            <p className={styles.overview}>{details.overview}</p>
            <ul>
              {details.summary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ProjectModal
