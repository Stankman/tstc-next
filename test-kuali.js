// Simple test script to check Kuali API connectivity
// For Node.js 18+ which has built-in fetch

const KUALI_API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YmRiN2IzMWI0OWRlMDAxZjMxMGRkNiIsImlzcyI6Imt1YWxpLmNvIiwiZXhwIjoxNzcyMDIyNTc5LCJpYXQiOjE3NDA0ODY1Nzl9.KUpbrtn3QB9pYu94WtLyk8LD48daUx-YWHLXmt-gMyw";

async function testKualiAPI() {
  try {
    console.log('Testing Kuali API connectivity...');
    
    // Test basic API endpoint
    const response = await fetch('https://tstc.kuali.co/api/cm/programs/', {
      headers: {
        'Authorization': `Bearer ${KUALI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response received. Total programs:', data.length);
      
      if (data.length > 0) {
        console.log('First few programs:');
        data.slice(0, 3).forEach(program => {
          console.log(`- ID: ${program.id}, Title: ${program.title}, Status: ${program.status}`);
        });
      }
    } else {
      console.log('Error:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testKualiAPI();
