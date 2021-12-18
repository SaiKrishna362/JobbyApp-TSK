import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {v4} from 'uuid'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {GoLocation} from 'react-icons/go'
import {BsBriefcaseFill, BsSearch, BsBoxArrowUpRight} from 'react-icons/bs'
import Navbar from '../Navbar'
import './index.css'

const apiStatusConstants = {
  initial: 'initial',
  success: 'success',
  inprogress: 'inprogress',
  failure: 'failure',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: {},
    similarJobs: [],
    skills: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  onSuccessDetails = data => {
    const a = data.job_details
    const b = data.similar_jobs

    const updatedA = {
      companyLogoUrl: a.company_logo_url,
      companyWebsiteUrl: a.company_website_url,
      employmentType: a.employment_type,
      id: a.id,
      jobDescription: a.job_description,
      location: a.location,
      packagePerAnnum: a.package_per_annum,
      rating: a.rating,
      title: a.title,
      description: a.life_at_company.description,
      imageUrl: a.life_at_company.image_url,
    }

    const updatedSkills = a.skills.map(eachDetails => ({
      id: v4(),
      name: eachDetails.name,
      imageUrl: eachDetails.image_url,
    }))

    const updatedB = b.map(eachDetails => ({
      companyLogoUrl: eachDetails.company_logo_url,
      employmentType: eachDetails.employment_type,
      id: eachDetails.id,
      jobDescription: eachDetails.job_description,
      location: eachDetails.location,
      rating: eachDetails.rating,
      title: eachDetails.title,
    }))

    this.setState({
      jobDetails: updatedA,
      similarJobs: updatedB,
      skills: updatedSkills,
      apiStatus: apiStatusConstants.success,
    })
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inprogress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      this.onSuccessDetails(data)
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {jobDetails, similarJobs, skills} = this.state
    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      companyWebsiteUrl,
      description,
      imageUrl,
    } = jobDetails

    return (
      <div className="job-details-main-bg-container">
        <div className="job-details-item-container">
          <div className="logo-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
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
          <div className="visit-container">
            <h1 className="description-heading">Description</h1>
            <a href={companyWebsiteUrl} className="visit">
              Visit <BsBoxArrowUpRight />
            </a>
          </div>
          <p className="all-description">{jobDescription}</p>
          <div>
            <h1 className="description-heading">Skills</h1>
            <ul className="skills-container">
              {skills.map(eachList => (
                <li key={eachList.id} className="skills-list-container">
                  <h1 className="name">{eachList.name}</h1>
                  <img
                    src={eachList.imageUrl}
                    alt={eachList.name}
                    className="skills-img"
                  />
                </li>
              ))}
            </ul>
          </div>
          <h1 className="description-heading">Life At Company</h1>
          <div className="life-at-company-container">
            <p className="life-at-description">{description}</p>
            <img src={imageUrl} alt="life at company" className="life-at-img" />
          </div>
        </div>
        <h1 className="description-heading">Similar Jobs</h1>
        <ul className="similar-jobs-ul-container">
          {similarJobs.map(eachList => (
            <li key={eachList.id} className="similar-jobs-li-container">
              <div className="logo-container">
                <img
                  src={eachList.companyLogoUrl}
                  alt="similar job company logo"
                  className="company-logo"
                />
                <div>
                  <h1 className="card-title">{eachList.title}</h1>
                  <div className="star-container">
                    <AiFillStar className="star-icon" />
                    <p className="star-rating">{eachList.rating}</p>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="description-heading ">Description</h1>
                <p className="all-description">{eachList.jobDescription}</p>
              </div>
              <div className="similar-location-main-container">
                <div className="location-container">
                  <GoLocation />
                  <p className="employment-type">{eachList.location}</p>
                </div>
                <div className="location-container">
                  <BsBriefcaseFill />
                  <p className="employment-type">{eachList.employmentType}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  onClickMainsRetry = () => {
    this.getJobDetails()
  }

  renderFailureView = () => {
    const {searchedInput} = this.state
    return (
      <div className="failure-main-container">
        <div className="lg-input-container">
          <input
            type="search"
            className="lg-input"
            placeholder="Search"
            value={searchedInput}
          />
          <button
            type="button"
            testid="searchButton"
            onClick={this.onClickSearchIcon}
            className="lg-icon-btn"
          >
            <BsSearch className="lg-search-icon" />
          </button>
        </div>
        <div className="failure-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
            className="failure-img"
          />
          <h1 className="failure-heading">Oops! Something Went Wrong</h1>
          <p className="failure-para">
            We cannot seem to find the page you are looking for.
          </p>
          <button
            type="button"
            className="retry-btn"
            onClick={this.onClickMainsRetry}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  renderResult = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inprogress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <div className="main-home-bg-container">
          <Navbar />

          <div className="job-container">
            <div className="job-content">{this.renderResult()}</div>
          </div>
        </div>
      </>
    )
  }
}
export default JobItemDetails
