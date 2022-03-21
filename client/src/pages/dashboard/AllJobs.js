import { JobsContainerWithoutUser, SearchContainerJob } from "../../components"

const AllJobs = () => {
	return (<>
		<SearchContainerJob />
		<JobsContainerWithoutUser />
	</>
	)
}

export default AllJobs