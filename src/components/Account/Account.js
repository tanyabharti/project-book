import React, { useEffect, useState } from 'react'
import styles from './Account.module.css'
import {
  Camera,
  Edit2,
  GitHub,
  Loader,
  LogOut,
  Paperclip,
  PlusCircle,
  Trash,
} from 'react-feather'
import Input from '../Input/Input'
import pic from '../../assets/sample.jpg'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import {
  auth,
  deleteProject,
  getAllProjectsForUser,
  updateUserDatabase,
} from '../../firebase'

import Project from '../Project/Project'

function Account(props) {
  const userInfo = props.userInfo
  const isAuthenticate = props.auth
  const navigate = useNavigate()
  const [saveDetails, setSaveDetails] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [saveBtnDisabled, setsaveBtnDisabled] = useState(false)
  const [showProject, setShowProject] = useState(false)
  const [loadProjects, setLoadProjects] = useState()
  const [projects, setProjects] = useState()
  const [editProjectModal, setEditProjectModal] = useState(false)
  const [editProject, setEditProject] = useState({})
  const [profileDetails, setProfileDetails] = useState({
    name: userInfo.name,
    designation: userInfo.designation || '',
    github: userInfo.designation || '',
    linkedin: userInfo.linkedin || '',
  })

  // Profile details section
  useEffect(() => {
    setSaveDetails(true)
  }, [profileDetails])

  const handlerLogout = async () => {
    await signOut(auth)
    navigate('/')
  }
  const handlerInput = (event, value) => {
    setSaveDetails(true)

    setProfileDetails((prev) => ({
      ...prev,
      [value]: event.target.value,
    }))
  }
  const saveDetailsOnServer = async () => {
    if (!profileDetails.name) {
      setErrorMsg('Name required')
      return
    }
    setsaveBtnDisabled(true)
    await updateUserDatabase({ ...profileDetails }, userInfo.uid)
    setsaveBtnDisabled(false)
    setSaveDetails(false)
  }

  // Project Section functions

  const fetchAllProjects = async () => {
    const result = await getAllProjectsForUser(userInfo.uid)
    if (!result) {
      setLoadProjects(true)
      return
    }
    setLoadProjects(true)

    let tempProjects = []
    result.forEach((doc) => tempProjects.push({ ...doc.data(), pid: doc.id }))
    setProjects(tempProjects)
  }

  const handlerEdit = (project) => {
    setEditProjectModal(true)
    setEditProject(project)
    setShowProject(true)
  }

  const handlerDeletion = async (pid) => {
    await deleteProject(pid)
    fetchAllProjects()
  }

  const handlerBack = () => {
    navigate('/')
  }
  useEffect(() => {
    fetchAllProjects()
  }, [])

  return isAuthenticate ? (
    <div className={styles.container}>
      {showProject && (
        <Project
          onSubmission={fetchAllProjects}
          onClose={() => setShowProject(false)}
          uid={userInfo.uid}
          isEdit={editProjectModal}
          default={editProject}
        />
      )}

      <div className={styles.header}>
        <p className={styles.heading}>
          Welcome <span>{profileDetails.name}</span>
        </p>

        <div className={styles.back}>
          <button className='button' onClick={handlerBack}>
            Go Back
          </button>
        </div>
        <div className={styles.logout} onClick={handlerLogout}>
          <LogOut /> Logout
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.title}>Your Profile</div>
        <div className={styles.profile}>
          {/*  left section  */}
          <div className={styles.left}>
            <div className={styles.image}>
              <img src={pic} alt='Profile ' />
              <div className={styles.camera}>
                <Camera />
              </div>
            </div>
          </div>
          {/* right section  */}
          <div className={styles.right}>
            <div className={styles.row}>
              <Input
                label='Name'
                placeholder='Enter your name'
                value={profileDetails.name}
                onChange={(event) => {
                  handlerInput(event, 'name')
                }}
              />
              <Input
                label='Title'
                placeholder=' eg. Software Developer'
                value={profileDetails.designation}
                onChange={(event) => {
                  handlerInput(event, 'designation')
                }}
              />
            </div>
            <div className={styles.row}>
              <Input
                label='GitHub'
                placeholder='Enter your GitHub repository link'
                value={profileDetails.github}
                onChange={(event) => {
                  handlerInput(event, 'github')
                }}
              />
              <Input
                label='Linkedin'
                placeholder='Enter your Linkedin profile link'
                value={profileDetails.linkedin}
                onChange={(event) => {
                  handlerInput(event, 'linkedin')
                }}
              />
            </div>
            <div className={styles.footer}>
              <p className={styles.error}>{errorMsg}</p>
              {saveDetails && (
                <button
                  className={styles.saveButton}
                  onClick={saveDetailsOnServer}
                  disabled={saveBtnDisabled}
                >
                  Save Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <hr
        style={{
          color: 'gray',
          backgroundColor: 'grey',
          minWidth: '95%',
        }}
      />
      <hr />

      <div className={styles.section}>
        <div className={styles.projectsHeader}>
          <div className={styles.title}> Dashboard</div>
          <button className='button' onClick={() => setShowProject(true)}>
            Add Project <PlusCircle />
          </button>
        </div>

        <div className={styles.projects}>
          {loadProjects ? (
            projects.length > 0 ? (
              projects.map((item, index) => (
                <div className={styles.project} key={item.title + index}>
                  <p className={styles.title}>{item.title}</p>

                  <div className={styles.links}>
                    <Edit2 onClick={() => handlerEdit(item)} />
                    <Trash onClick={() => handlerDeletion(item.pid)} />

                    <Link target='_blank' to={`//${item.github}`}>
                      <GitHub />
                    </Link>
                    {item.link ? (
                      <Link target='_blank' to={`//${item.link}`}>
                        <Paperclip />
                      </Link>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No Projects found</p>
            )
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  ) : (
    <Navigate to='/' />
  )
}
export default Account
