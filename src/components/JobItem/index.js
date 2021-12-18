import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {GoLocation} from 'react-icons/go'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobItem = props => {
  const {jobData} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobData

  return (
    <Link to={`/jobs/${id}`} className="link-container">
      <li className="job-item-container">
        <div className="logo-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h1 className="card-title">{title}</h1>
            <div className="star-container">
              <AiFillStar className="star-icon" />
              <p className="star-rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="LPA-container">
          <div className="location-main-container">
            <div className="location-container">
              <GoLocation />
              <p className="employment-type">{location}</p>
            </div>
            <div className="location-container">
              <BsBriefcaseFill />
              <p className="employment-type">{employmentType}</p>
            </div>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr className="h-line" />
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
