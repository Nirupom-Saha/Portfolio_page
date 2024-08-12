function addRecommendation() {
  // Get the message of the new recommendation
  let recommendation = document.getElementById("new_recommendation");
  // If the user has left a recommendation, display a pop-up
  if (recommendation.value != null && recommendation.value.trim() != "") {
    console.log("New recommendation added");
    //Call showPopup here
    showPopup(true);
    // Create a new 'recommendation' element and set it's value to the user's message
    var element = document.createElement("div");
    element.setAttribute("class","recommendation");
    element.innerHTML = "\<span\>&#8220;\</span\>" + recommendation.value + "\<span\>&#8221;\</span\>";
    // Add this element to the end of the list of recommendations
    document.getElementById("all_recommendations").appendChild(element); 
    
    // Reset the value of the textarea
    recommendation.value = "";
  }
}

function showPopup(bool) {
  if (bool) {
    document.getElementById('popup').style.visibility = 'visible'
  } else {
    document.getElementById('popup').style.visibility = 'hidden'
  }
}

async function saveRecommendationToGitHub(recommendationText) {
  const repoOwner = 'Nirupom-Saha'; // Replace with your GitHub username
  const repoName = 'Portfolio_page'; // Replace with your GitHub repository name
  const fileName = `recommendations/${Date.now()}.md`; // Save as a markdown file
  const fileContent = btoa(`# Recommendation\n\n${recommendationText}`); // Base64 encode the markdown content
  const branch = 'main'; // Replace with your branch name if different

  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${fileName}`;
  const token = 'your-personal-access-token'; // Replace with your GitHub Personal Access Token

  const response = await fetch(url, {
      method: 'PUT',
      headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          message: `Add recommendation on ${new Date().toISOString()}`,
          content: fileContent,
          branch: branch,
      }),
  });

  if (response.ok) {
      console.log('Recommendation saved successfully on GitHub Pages.');
  } else {
      console.error('Failed to save recommendation:', response.statusText);
  }
}

// Example usage in addRecommendation function
async function addRecommendation() {
  var recommendationText = document.getElementById("new_recommendation").value;

  if (recommendationText.trim() === "") {
      return;
  }

  await saveRecommendationToGitHub(recommendationText);
  document.getElementById("new_recommendation").value = "";
  showPopup(true);
}

async function deleteRecommendationFromGitHub(fileName) {
  const repoOwner = 'your-username'; // Replace with your GitHub username
  const repoName = 'your-repo'; // Replace with your GitHub repository name
  const branch = 'main'; // Replace with your branch name if different

  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${fileName}`;
  const token = 'your-personal-access-token'; // Replace with your GitHub Personal Access Token

  // Get the file's SHA to delete it
  const getFileResponse = await fetch(url, {
      method: 'GET',
      headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
      },
  });

  if (getFileResponse.ok) {
      const fileData = await getFileResponse.json();
      const sha = fileData.sha;

      // Now delete the file
      const deleteResponse = await fetch(url, {
          method: 'DELETE',
          headers: {
              'Authorization': `token ${token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              message: `Deleted recommendation ${fileName}`,
              sha: sha,
              branch: branch,
          }),
      });

      if (deleteResponse.ok) {
          console.log('Recommendation deleted successfully from GitHub Pages.');
      } else {
          console.error('Failed to delete recommendation:', deleteResponse.statusText);
      }
  } else {
      console.error('Failed to get file info:', getFileResponse.statusText);
  }
}

// Example usage
deleteRecommendationFromGitHub('recommendations/1684959483941.md');
