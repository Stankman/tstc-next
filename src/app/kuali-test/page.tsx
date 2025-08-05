import { KualiApiResponse } from "@/lib/kuali";
import { TuitionCalculator, KualiTuitionCalculator } from "@/components/programs/single/tuition-calculator";
import { TuitionSummary, TuitionBadge } from "@/components/programs/single/tuition-summary";
import { exampleUsage } from "@/lib/pricing";

async function getKualiData(programId: string): Promise<KualiApiResponse | null> {
  try {
    const response = await fetch(`http://localhost:3001/api/kuali/${programId}`);
    if (!response.ok) {
      console.error('Kuali API error:', response.status, response.statusText);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Kuali data:', error);
    return null;
  }
}

export default async function KualiTestPage() {
  // Use the working program ID we found: Auto Collision & Management Technology
  const kualiData = await getKualiData('61a4e7d862ae11f5fccb4354');
  
  // For testing purposes, let's assume this program is Tier 2
  const programTier = 2;

  // Run pricing examples in console (for testing)
  if (typeof window === 'undefined') {
    exampleUsage();
  }

  if (!kualiData) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Kuali API Test</h1>
        <p className="text-red-500">Failed to load Kuali data</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Kuali API Test - Working Data</h1>
      
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
        ✅ API is working! Program: <strong>{kualiData.program.title}</strong><br/>
        📋 Program ID (PID): <strong>61a4e7d862ae11f5fccb4354</strong>
      </div>

      <div className="grid gap-6">
        {/* Tuition Calculator Example */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tuition Calculator Examples</h2>
          
          {/* Single semester example */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Single Semester (12 credits)</h3>
            <TuitionCalculator credits={12} />
          </div>

          {/* Program calculation with Kuali data */}
          {kualiData.specializations.length > 0 && kualiData.specializations[0].degreePlan && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">
                Program Tuition: {kualiData.specializations[0].title}
              </h3>
              <KualiTuitionCalculator degreePlan={kualiData.specializations[0].degreePlan} />
            </div>
          )}

          {/* Tuition Summary Component Examples */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Tuition Summary Components</h3>
            <div className="space-y-4">
              {/* Small badge for 12 credits */}
              <div>
                <h4 className="text-sm font-medium mb-2">Tuition Badge (12 credits): <TuitionBadge tier={programTier} credits={12} /></h4>
              </div>
              
              {/* Small summary */}
              {kualiData.specializations.length > 0 && kualiData.specializations[0].degreePlan && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Compact Program Summary:</h4>
                  <TuitionSummary 
                    tier={programTier}
                    credits={kualiData.specializations[0].degreePlan.totalCredits || 0}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basic Program Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Program Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>ID:</strong> {kualiData.program.id}</div>
            <div><strong>Status:</strong> {kualiData.program.status}</div>
            <div><strong>Locations:</strong> {kualiData.locations.length} available</div>
            <div><strong>Modalities:</strong> {kualiData.modalities.length} available</div>
          </div>
        </div>

        {/* Specializations */}
        {kualiData.specializations.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Specializations ({kualiData.specializations.length})</h2>
            <div className="space-y-6">
              {kualiData.specializations.map((specialization) => (
                <div key={specialization.id} className="border-l-4 border-blue-500 pl-4 bg-gray-50 p-4 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-medium">{specialization.title}</h3>
                      <p className="text-sm text-gray-600">Specialization PID: <code className="bg-gray-200 px-1 rounded">{specialization.pid}</code></p>
                    </div>
                    {specialization.degreePlan?.totalCredits && (
                      <TuitionBadge tier={programTier} credits={specialization.degreePlan.totalCredits} />
                    )}
                  </div>
                  
                  {/* Degree Plan Info */}
                  {specialization.degreePlan && (
                    <div className="bg-white p-4 rounded mb-4">
                      <h4 className="font-semibold text-blue-600 mb-2">Degree Plan Details</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-4">
                        <div><strong>Code:</strong> {specialization.degreePlan.code}</div>
                        <div><strong>Spec PID:</strong> <code className="bg-yellow-100 px-1 rounded">{specialization.pid}</code></div>
                        <div><strong>Duration:</strong> {specialization.degreePlan.monthsToComplete} months</div>
                        <div><strong>Total Credits:</strong> {specialization.degreePlan.totalCredits}</div>
                        <div><strong>Locations:</strong> {specialization.degreePlan.locations.length}</div>
                      </div>

                      {/* Semester Breakdown - This is what we're testing! */}
                      {specialization.degreePlan.semesters && specialization.degreePlan.semesters.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-semibold text-green-600 mb-3">
                            🎯 Semester Breakdown ({specialization.degreePlan.semesters.length} semesters)
                          </h5>
                          <div className="space-y-4">
                            {specialization.degreePlan.semesters.map((semester, semIndex) => (
                              <div key={semIndex} className="bg-gray-100 rounded p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h6 className="font-medium text-lg">{semester.label}</h6>
                                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                                    {semester.credits} credits
                                  </span>
                                </div>
                                
                                {/* Course Blocks */}
                                <div className="space-y-3">
                                  {semester.blocks.map((block, blockIndex) => (
                                    <div key={blockIndex} className="bg-white rounded p-3">
                                      {block.optional && (
                                        <div className="text-sm text-orange-600 mb-2 font-medium">
                                          ⚡ Optional Block (Min: {block.minimumCredits} credits required)
                                        </div>
                                      )}
                                      <div className="space-y-2">
                                        {block.courses.map((course, courseIndex) => (
                                          <div key={courseIndex} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                                            <div>
                                              <strong>{course.code}{course.number}</strong> - {course.title}
                                              <div className="text-xs text-gray-500 mt-1">
                                                Lecture: {course.lecture}hrs • Lab: {course.lab}hrs
                                              </div>
                                            </div>
                                            <span className="text-blue-600 font-medium">
                                              {course.credits} credits
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-right mt-2 text-sm">
                                        <span className="text-gray-600">
                                          Block Total: {block.credits} credits
                                        </span>
                                        {block.optional && (
                                          <span className="text-orange-600 ml-2">
                                            (Only {block.minimumCredits} counted toward degree)
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Show message if no semesters */}
                      {(!specialization.degreePlan.semesters || specialization.degreePlan.semesters.length === 0) && (
                        <div className="mt-4 text-red-500 text-sm">
                          ❌ No semester data available
                        </div>
                      )}
                    </div>
                  )}

                  {/* Show message if no degree plan */}
                  {!specialization.degreePlan && (
                    <div className="text-red-500 text-sm">
                      ❌ No degree plan data available
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
