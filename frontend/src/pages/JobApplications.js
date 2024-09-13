import React from 'react';
import { useQuery, useAction } from 'wasp/client/operations';
import { getJobApplications, deleteJobApplication } from 'wasp/client/operations';

const JobApplicationsPage = () => {
  const { data: jobApplications, isLoading, error } = useQuery(getJobApplications);
  const deleteJobApplicationFn = useAction(deleteJobApplication);

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  const handleDeleteApplication = (jobApplicationId) => {
    deleteJobApplicationFn({ jobApplicationId });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Job Applications</h1>
      {jobApplications.length === 0 ? (
        <p>No job applications found.</p>
      ) : (
        jobApplications.map((application) => (
          <div key={application.id} className="flex items-center justify-between bg-gray-100 p-4 mb-4 rounded-lg">
            <div>
              <h2 className="text-xl font-semibold">{application.jobOffer.title}</h2>
              <p>{application.jobOffer.description}</p>
              <p className="text-sm text-gray-600">Status: {application.status}</p>
            </div>
            <button
              onClick={() => handleDeleteApplication(application.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete Application
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default JobApplicationsPage;
