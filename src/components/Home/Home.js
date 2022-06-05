import React, { useEffect, useState } from 'react'
import styles from './Home.module.css'
import img from '../../assets/logo.svg'
import details from '../../assets/github.png'
import { ArrowRight, Loader } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { getAllProjects } from '../../firebase'
import ProjectModal from './Project Modal/ProjectModal'

function Home(props) {
  const navigate = useNavigate()
  const isAuthenticate = props.auth ? true : false
  const [projectsFetched, setProjectsFetched] = useState(false)
  const [projects, setProjects] = useState([])
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [projectInfo, setProjectInfo] = useState({})

  const handleButtonClick = () => {
    if (isAuthenticate) navigate('/account')
    else navigate('/login')
  }

  const fetchAllProjects = async () => {
    const result = await getAllProjects()
    setProjectsFetched(true)
    if (!result) {
      return
    }

    const tempProjects = []
    result.forEach((doc) => tempProjects.push({ ...doc.data(), pid: doc.id }))

    setProjects(tempProjects)
  }

  const handleProjectCard = (project) => {
    setShowProjectModal(true)
    setProjectInfo(project)
  }

  useEffect(() => {
    fetchAllProjects()
  }, [])

  return (
    <div className={styles.container}>
      {showProjectModal && (
        <ProjectModal
          onClose={() => setShowProjectModal(false)}
          details={projectInfo}
        />
      )}
      <div className={styles.header}>
        <div className={styles.left}>
          <p className={styles.heading}>Project Book</p>
          <p className={styles.subheading}>
            One stop destination for all your projects
          </p>
          <button onClick={handleButtonClick}>
            {isAuthenticate ? 'Manage your Projects' : 'Get Started'}
            <ArrowRight />
            {''}
          </button>
        </div>
        <div className={styles.right}>
          <img src={img} alt='logo' />
        </div>
      </div>
      {isAuthenticate && (
        <div className={styles.body}>
          <p className={styles.title}> Project Section </p>
          <div className={styles.projects}>
            {projectsFetched ? (
              projects.length > 0 ? (
                projects.map((item) => (
                  <div
                    className={styles.project}
                    key={item.pid}
                    onClick={() => handleProjectCard(item)}
                  >
                    <div className={styles.image}>
                      <img src={details} alt=' thumbnail' />
                    </div>
                    <p className={styles.title}>{item.title}</p>
                  </div>
                ))
              ) : (
                <p>No projects found</p>
              )
            ) : (
              <Loader />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
